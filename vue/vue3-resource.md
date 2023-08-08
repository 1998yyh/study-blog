# v3

## 初始化

createAPP -> ensureRenderer -> createAppAPI -> mount -> createVNode -> patch ->

### 步骤

1. createAPP

2. ensureRenderer 获取渲染函数 （做缓存 / SSR 等）

3. createAppAPI

ensureRenderer 返回了 
```js
// packages/runtime-core/src/renderer.ts
export function createRenderer(options) {
  // ...
  // 这里不介绍 hydrate 模式
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate),
  }
}
```

初始化的时候 调用createApp

该函数接收了 <App /> 组件作为根组件 rootComponent，返回了一个包含 mount 方法的 app 对象。


4. mount 主要作用是渲染根组件
```js
// packages/runtime-core/src/apiCreateApp.ts
mount(rootContainer, isHydrate, isSVG) {
  if (!isMounted) {
    // 1. 创建根组件的 vnode
    const vnode = createVNode(
      rootComponent,
      rootProps
    )
    
    // 2. 渲染根组件
    render(vnode, rootContainer, isSVG)
    isMounted = true
  }
}
```
会调用createVNode 方法


5. createVNode

当进行根组件渲染的时候，createVNode 的第一个入参 type 是我们的 App 对象，也就是一个 Object，所以得到的 shapeFlags 的值是 STATEFUL_COMPONENT，代表的是一个有状态组件对象。（如果传入的是个函数，那么就是一个函数式组件 FUNCTIONAL_COMPONENT，函数式组件和有状态的对象组件都是 Vue 可处理的组件类型，这个会在下面渲染阶段提及。）

6. render

``` ts
const render: RootRenderFunction = (vnode, container, isSVG) => {
  if (vnode == null) {
    if (container._vnode) {
      unmount(container._vnode, null, null, true)
    }
  } else {
    patch(container._vnode || null, vnode, container, null, null, null, isSVG)
  }
  flushPreFlushCbs()
  flushPostFlushCbs()
  container._vnode = vnode
}
```

如果vnode不存在了 说明要卸载组件 所以执行unmount

如果vnode存在 则执行patch



7. patch

初始化根组件的过程中，传入了一个根组件的 vnode 对象，所以这里会执行 patch 相关的动作。

patch 本意是补丁的意思，可以理解成为更新做一些补丁的活儿，其实初始的过程也可以看作是一个全量补丁，一种特殊的更新操作。


``` js
  const patch: PatchFn = (
    // 旧vnode
    n1,
    // 新 vnode
    n2,
    // 挂载dom容器
    container,
    // 参考元素
    anchor = null,
    // 父组件
    parentComponent = null,
    parentSuspense = null,
    isSVG = false,
    slotScopeIds = null,
    optimized = __DEV__ && isHmrUpdating ? false : !!n2.dynamicChildren
  ) => {
    if (n1 === n2) {
      return
    }

    // 如果类型不同 直接卸载
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1)
      unmount(n1, parentComponent, parentSuspense, true)
      n1 = null
    }
    // 基于n2来判断
    const { type, ref, shapeFlag } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor)
        break
      case Comment:
        processCommentNode(n1, n2, container, anchor)
        break
      case Static:
      case Fragment:
        // 上面两个略
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement()
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent()
        } else if (shapeFlag & ShapeFlags.TELEPORT) {
         
        }
    }

    // set ref
    if (ref != null && parentComponent) {
      setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2)
    }
  }
```

这里我们主要关注前 3 个参数，因为是初始化的过程，所以 n1 本次值为空，核心看 n2 的值，n2 有一个 type 和 shapeFlag。

当前 n2 的 type 是 App 组件对象，所以逻辑会进入 Switch 的 default 中。

再比较 shapeFlag 属性，前面提到 shapeFlag 的值是 STATEFUL_COMPONENT。

> 这里需要注意的是 ShapeFlags 是一个二进制左移操作符生成的对象，其中
ShapeFlags.COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT， 所以 shapeFlag & ShapeFlags.COMPONENT 这里的值是 true

8. progressComponent

然后进入了progressComponent

``` js
const processComponent = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  slotScopeIds: string[] | null,
  optimized: boolean
) => {
  n2.slotScopeIds = slotScopeIds
  if (n1 == null) {
    if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
      ;(parentComponent!.ctx as KeepAliveContext).activate(
        n2,
        container,
        anchor,
        isSVG,
        optimized
      )
    } else {
      mountComponent(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        optimized
      )
    }
  } else {
    updateComponent(n1, n2, optimized)
  }
}
```

首先缓存了 slotScopeIds 

然后判断n1存在 即是否是初始化

不存在 在判断是否是keepAlive 执行 activate / mountComponent


我们先只看 mountComponent

``` js
// packages/runtime-core/src/renderer.ts
function mountComponent(initialVNode, container, parentComponent) {
  // 1. 先创建一个 component instance
  const instance = (initialVNode.component = createComponentInstance(
    initialVNode,
    parentComponent
  ));
  
  // 2. 初始化 instance 上的 props, slots, 执行组件的 setup 函数...
  setupComponent(instance);

  // 3. 设置并运行带副作用的渲染函数
  setupRenderEffect(instance, initialVNode, container);
}

```

然后setupComponent

```js
function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  // 1. 处理 props
  // 取出存在 vnode 里面的 props
  const { props, children } = instance.vnode
  const isStateful = isStatefulComponent(instance)

  initProps(instance, props, isStateful, isSSR)
    // 2. 处理 slots
  initSlots(instance, children)

 // 3. 调用 setup 并处理 setupResult
  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined
  isInSSRComponentSetup = false
  return setupResult
}

```

把组件实例的 render 函数执行一遍，这里是通过 setupRenderEffect 来执行的。

``` js
// packages/runtime-core/src/renderer.ts
const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
  function componentUpdateFn() {
    if (!instance.isMounted) {
      // 渲染子树的 vnode
      const subTree = (instance.subTree = renderComponentRoot(instance))
      // 挂载子树 vnode 到 container 中
      patch(null, subTree, container, anchor, instance, parentSuspense, isSVG)
      // 把渲染生成的子树根 DOM 节点存储到 el 属性上
      initialVNode.el = subTree.el
      instance.isMounted = true
    }
    else {
      // 更新相关，后面介绍
    }
  }
  // 创建副作用渲染函数
  instance.update = effect(componentUpdateFn, prodEffectOptions)
}
```

调用了 renderComponentRoot 来生成 subTree，然后再把 subTree 挂载到 container 中。

而renderComponentRoot 本质上调用的还是 `render` 方法


再看下 processElement 

``` js
// packages/runtime-core/src/renderer.ts
function processElement(n1, n2, container, anchor, parentComponent) {
  if (!n1) {
    // 挂载元素节点
    mountElement(n2, container, anchor);
  } else {
    // 更新元素节点
    updateElement(n1, n2, container, anchor, parentComponent);
  }
}
```

因为在初始化的过程中，n1 是 null，所以这里执行的是 mountElement 进行元素的初始化挂载。

``` js
// packages/runtime-core/src/renderer.ts
const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  let el
  const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode
  // ...
  // 根据 vnode 创建 DOM 节点
  el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is)
  if (props) {
    // 处理 props 属性
    for (const key in props) {
      if (!isReservedProp(key)) {
        hostPatchProp(el, key, null, props[key], isSVG)
      }
    }
  }
  // 文本节点处理
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    hostSetElementText(el, vnode.children)
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 如果节点是个数据类型，则递归子节点
    mountChildren(vnode.children, el)
  }
  // 把创建好的 el 元素挂载到容器中
  hostInsert(el, container, anchor)
}

```

mountElemet 首先是通过 hostCreateElement 创建了一个 DOM 节点，然后处理一下 props 属性，接着根据 shapeFlag 判断子节点的类型，如果节点是个文本节点，则直接创建文本节点，如果子节点是个数组 

此时会对该 vnode 节点的子节点调用 mountChildren 进行递归的 patch 渲染。

最终挂载到根元素上




## 数据代理


### question

看一个问题

```html
<template>
  <p>{{ msg }}</p>
  <button @click="changeMsg">点击试试</button>
</template>
<script>
  import { ref } from 'vue'
  export default {
    data() {
      return {
        msg: 'msg from data'
      }
    },
    setup() {
      const msg = ref('msg from setup')
      return {
        msg
      }
    },
    methods: {
      changeMsg() {
        this.msg = 'change'
      }
    }
  }
</script>

```

1. 页面显示的是什么内容？
2. 点击按钮后，修改的是哪部分的数据？是 data 中定义的，还是 setup 中的呢？

### 初始化组件

``` js
export function setupComponent(instance, isSSR = false) {
  const { props, children } = instance.vnode
  
  // 判断组件是否是有状态的组件
  const isStateful = isStatefulComponent(instance)
  
  // 初始化 props
  initProps(instance, props, isStateful, isSSR)
  
  // 初始化 slots
  initSlots(instance, children)

  // 如果是有状态组件，那么去设置有状态组件实例
  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined
    
  return setupResult
}
```

isStatefulComponent 判断是否是有状态的组件的函数如下：

``` js
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
}
```

shapeFlags 在遇到组件类型的 `type = object`时 ， vnode 的 `shapeFlags =  ShapeFlags.STATEFUL_COMPONENT` 所以会执行`setupStatefulComponent` 函数


``` js
function setupStatefulComponent(instance, isSSR) {
  // 定义 Component 变量
  const Component = instance.type

  // 1. 创建渲染代理的属性访问缓存
  instance.accessCache = Object.create(null)
  // 2. 创建渲染上下文代理, proxy 对象其实是代理了 instance.ctx 对象
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  // 3. 执行 setup 函数
  const { setup } = Component
  if (setup) {
    // 如果 setup 函数带参数，则创建一个 setupContext
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null)
    // 执行 setup 函数，获取结果
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext])
    // 处理 setup 执行结果
    handleSetupResult(instance, setupResult)
  } else {
    // 4. 完成组件实例设置
    finishComponentSetup(instance, isSSR)
  }
}

```

setupStatefulComponent 字面意思就是设置有状态组件。 

和有状态组件相对的是函数式组件

``` js
import { ref } from 'vue';

export default () => {
  let num = ref(0);
  const plusNum = () => {
    num.value ++;
  };
  return (
    <div>
      <button onClick={plusNum}>
        { num.value }
      </button>
    </div>
  )
}

```

这个函数点击按钮， num的值并不会按我们预期的那样一直递增， 因为他是一个函数式组件 该组件内部是没有状态保持的， 

所以num数据更新的时候， 组件会重新渲染 num永远不变 是 0 

所以在这个时候，为了能符合我们预期的结果，我们需要将其设置成有状态的组件。我们可以通过 defineComponent 函数包装一下：

``` js
import { ref, defineComponent } from 'vue';

export default defineComponent(() => {
  let num = ref(0);
  const plusNum = () => {
    num.value ++;
  };
  
  return () => (
    <div>
      <button onClick={plusNum}>
        { num.value }
      </button>
    </div>
  )
});

```

defineComponent 返回的是个对象类型的 type，所以就变成了有状态组件。

### 创建渲染上下文代理


1. 为什么要对instance.ctx做代理



2. 为什么要创建渲染代理的属性访问缓存 ？ 

首先看下vue2 如何实现的


``` html
<template>
  <p>{{ num }}</p>
</template>
<script>
export default {
  data() {
    num: 1
  },
  mounted() {
    this.num = 2
  }
}
</script>
```

我们在vue2 中访问num 使用的是 `this.num` 而不是通过 `this._data.num` 来获取的

是因为vue对_data做了一层代理

```js
_proxy(options.data);

function _proxy (data) {
  const that = this;
  Object.keys(data).forEach(key => {
    Object.defineProperty(that, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return that._data[key];
      },
      set: function proxySetter (val) {
        that._data[key] = val;
      }
    })
  });
}

```
当我们访问data中的变量时，会代理到data 修改同理