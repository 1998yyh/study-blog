# vue3源码

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
  };
}
```

初始化的时候 调用 createApp

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

会调用 createVNode 方法

5. createVNode

当进行根组件渲染的时候，createVNode 的第一个入参 type 是我们的 App 对象，也就是一个 Object，所以得到的 shapeFlags 的值是 STATEFUL_COMPONENT，代表的是一个有状态组件对象。（如果传入的是个函数，那么就是一个函数式组件 FUNCTIONAL_COMPONENT，函数式组件和有状态的对象组件都是 Vue 可处理的组件类型，这个会在下面渲染阶段提及。）

6. render

```ts
const render: RootRenderFunction = (vnode, container, isSVG) => {
  if (vnode == null) {
    if (container._vnode) {
      unmount(container._vnode, null, null, true);
    }
  } else {
    patch(container._vnode || null, vnode, container, null, null, null, isSVG);
  }
  flushPreFlushCbs();
  flushPostFlushCbs();
  container._vnode = vnode;
};
```

如果 vnode 不存在了 说明要卸载组件 所以执行 unmount

如果 vnode 存在 则执行 patch

7. patch

初始化根组件的过程中，传入了一个根组件的 vnode 对象，所以这里会执行 patch 相关的动作。

patch 本意是补丁的意思，可以理解成为更新做一些补丁的活儿，其实初始的过程也可以看作是一个全量补丁，一种特殊的更新操作。

```js
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
    return;
  }

  // 如果类型不同 直接卸载
  if (n1 && !isSameVNodeType(n1, n2)) {
    // getNextHostNode 处理 fragment
    anchor = getNextHostNode(n1);
    unmount(n1, parentComponent, parentSuspense, true);
    n1 = null;
  }
  // 基于n2来判断
  const { type, ref, shapeFlag } = n2;
  switch (type) {
    case Text:
      processText(n1, n2, container, anchor);
      break;
    case Comment:
      processCommentNode(n1, n2, container, anchor);
      break;
    case Static:
    case Fragment:
    // 上面两个略
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement();
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent();
      } else if (shapeFlag & ShapeFlags.TELEPORT) {
        // other...
      }
  }

  // set ref
  if (ref != null && parentComponent) {
    setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
  }
};
```

这里我们主要关注前 3 个参数，因为是初始化的过程，所以 n1 本次值为空，核心看 n2 的值，n2 有一个 type 和 shapeFlag。

当前 n2 的 type 是 App 组件对象，所以逻辑会进入 Switch 的 default 中。

再比较 shapeFlag 属性，前面提到 shapeFlag 的值是 STATEFUL_COMPONENT。

> 这里需要注意的是 ShapeFlags 是一个二进制左移操作符生成的对象，其中
> ShapeFlags.COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT， 所以 shapeFlag & ShapeFlags.COMPONENT 这里的值是 true

8. progressComponent

然后进入了 progressComponent

```js
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

然后判断 n1 存在 即是否是初始化

不存在 在判断是否是 keepAlive 执行 activate / mountComponent

我们先只看 mountComponent

```js
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

然后 setupComponent

```js
function setupComponent(instance: ComponentInternalInstance, isSSR = false) {
  // 1. 处理 props
  // 取出存在 vnode 里面的 props
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);

  initProps(instance, props, isStateful, isSSR);
  // 2. 处理 slots
  initSlots(instance, children);

  // 3. 调用 setup 并处理 setupResult
  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined;
  isInSSRComponentSetup = false;
  return setupResult;
}
```

把组件实例的 render 函数执行一遍，这里是通过 setupRenderEffect 来执行的。

```js
// packages/runtime-core/src/renderer.ts
const setupRenderEffect = (
  instance,
  initialVNode,
  container,
  anchor,
  parentSuspense,
  isSVG,
  optimized
) => {
  function componentUpdateFn() {
    if (!instance.isMounted) {
      // 渲染子树的 vnode
      const subTree = (instance.subTree = renderComponentRoot(instance));
      // 挂载子树 vnode 到 container 中
      patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
      // 把渲染生成的子树根 DOM 节点存储到 el 属性上
      initialVNode.el = subTree.el;
      instance.isMounted = true;
    } else {
      // 更新相关，后面介绍
    }
  }
  // 创建副作用渲染函数
  instance.update = effect(componentUpdateFn, prodEffectOptions);
};
```

调用了 renderComponentRoot 来生成 subTree，然后再把 subTree 挂载到 container 中。

而 renderComponentRoot 本质上调用的还是 `render` 方法

再看下 processElement

```js
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

```js
// packages/runtime-core/src/renderer.ts
const mountElement = (
  vnode,
  container,
  anchor,
  parentComponent,
  parentSuspense,
  isSVG,
  optimized
) => {
  let el;
  const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode;
  // ...
  // 根据 vnode 创建 DOM 节点
  el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is);
  if (props) {
    // 处理 props 属性
    for (const key in props) {
      if (!isReservedProp(key)) {
        hostPatchProp(el, key, null, props[key], isSVG);
      }
    }
  }
  // 文本节点处理
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    hostSetElementText(el, vnode.children);
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 如果节点是个数据类型，则递归子节点
    mountChildren(vnode.children, el);
  }
  // 把创建好的 el 元素挂载到容器中
  hostInsert(el, container, anchor);
};
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
  import { ref } from "vue";
  export default {
    data() {
      return {
        msg: "msg from data",
      };
    },
    setup() {
      const msg = ref("msg from setup");
      return {
        msg,
      };
    },
    methods: {
      changeMsg() {
        this.msg = "change";
      },
    },
  };
</script>
```

1. 页面显示的是什么内容？
2. 点击按钮后，修改的是哪部分的数据？是 data 中定义的，还是 setup 中的呢？

### 初始化组件

```js
export function setupComponent(instance, isSSR = false) {
  const { props, children } = instance.vnode;

  // 判断组件是否是有状态的组件
  const isStateful = isStatefulComponent(instance);

  // 初始化 props
  initProps(instance, props, isStateful, isSSR);

  // 初始化 slots
  initSlots(instance, children);

  // 如果是有状态组件，那么去设置有状态组件实例
  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined;

  return setupResult;
}
```

isStatefulComponent 判断是否是有状态的组件的函数如下：

```js
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT;
}
```

shapeFlags 在遇到组件类型的 `type = object`时 ， vnode 的 `shapeFlags =  ShapeFlags.STATEFUL_COMPONENT` 所以会执行`setupStatefulComponent` 函数

```js
function setupStatefulComponent(instance, isSSR) {
  // 定义 Component 变量
  const Component = instance.type;

  // 1. 创建渲染代理的属性访问缓存
  instance.accessCache = Object.create(null);
  // 2. 创建渲染上下文代理, proxy 对象其实是代理了 instance.ctx 对象
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  // 3. 执行 setup 函数
  const { setup } = Component;
  if (setup) {
    // 如果 setup 函数带参数，则创建一个 setupContext
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null);
    // 执行 setup 函数，获取结果
    const setupResult = callWithErrorHandling(setup, instance, 0, [
      instance.props,
      setupContext,
    ]);
    // 处理 setup 执行结果
    handleSetupResult(instance, setupResult);
  } else {
    // 4. 完成组件实例设置
    finishComponentSetup(instance, isSSR);
  }
}
```

setupStatefulComponent 字面意思就是设置有状态组件。

和有状态组件相对的是函数式组件

```js
import { ref } from "vue";

export default () => {
  let num = ref(0);
  const plusNum = () => {
    num.value++;
  };
  return (
    <div>
      <button onClick={plusNum}>{num.value}</button>
    </div>
  );
};
```

这个函数点击按钮， num 的值并不会按我们预期的那样一直递增， 因为他是一个函数式组件 该组件内部是没有状态保持的，

所以 num 数据更新的时候， 组件会重新渲染 num 永远不变 是 0

所以在这个时候，为了能符合我们预期的结果，我们需要将其设置成有状态的组件。我们可以通过 defineComponent 函数包装一下：

```js
import { ref, defineComponent } from "vue";

export default defineComponent(() => {
  let num = ref(0);
  const plusNum = () => {
    num.value++;
  };

  return () => (
    <div>
      <button onClick={plusNum}>{num.value}</button>
    </div>
  );
});
```

defineComponent 返回的是个对象类型的 type，所以就变成了有状态组件。

### 创建渲染上下文代理

1. 为什么要对 instance.ctx 做代理

2. 为什么要创建渲染代理的属性访问缓存 ？

首先看下 vue2 如何实现的

```html
<template>
  <p>{{ num }}</p>
</template>
<script>
  export default {
    data() {
      num: 1;
    },
    mounted() {
      this.num = 2;
    },
  };
</script>
```

我们在 vue2 中访问 num 使用的是 `this.num` 而不是通过 `this._data.num` 来获取的

是因为 vue 对\_data 做了一层代理

```js
_proxy(options.data);

function _proxy(data) {
  const that = this;
  Object.keys(data).forEach((key) => {
    Object.defineProperty(that, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter() {
        return that._data[key];
      },
      set: function proxySetter(val) {
        that._data[key] = val;
      },
    });
  });
}
```

当我们访问 data 中的变量时，会代理到 data 修改同理

而 vue3 也在这里做了同样的事情,Vue 3 内部有很多状态属性，存储在不同的对象上，比如 setupState、ctx、data、props。这样用户取数据就会考虑具体从哪个对象中获取，这无疑增加了用户的使用负担，所以对 instance.ctx 进行代理，然后根据属性优先级关系依次完成从特定对象上获取值。

#### get

我们看一下 proxy 的 get 他的实现

```js
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance
    let normalizedProps
    if (key[0] !== '$') {
      // 从缓存中获取当前 key 存在于哪个属性中
      const n = accessCache![key]
      if (n !== undefined) {
        switch (n) {
          case AccessTypes.SETUP:
            return setupState[key]
          case AccessTypes.DATA:
            return data[key]
          case AccessTypes.CONTEXT:
            return ctx[key]
          case AccessTypes.PROPS:
            return props![key]
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        // 从 setupState 中取
        accessCache![key] = AccessTypes.SETUP
        return setupState[key]
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        // 从 data 中取
        accessCache![key] = AccessTypes.DATA
        return data[key]
      } else if (
        (normalizedProps = instance.propsOptions[0]) &&
        hasOwn(normalizedProps, key)
      ) {
        // 从 props 中取
        accessCache![key] = AccessTypes.PROPS
        return props![key]
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        // 从 ctx 中取
        accessCache![key] = AccessTypes.CONTEXT
        return ctx[key]
      } else if (!__FEATURE_OPTIONS_API__ || shouldCacheAccess) {
        // 都取不到
        accessCache![key] = AccessTypes.OTHER
      }
    }

    const publicGetter = publicPropertiesMap[key]
    let cssModule, globalProperties
    if (publicGetter) {
      // 以 $ 保留字开头的相关函数和方法
      // ...
    } else if (
      // css module
    (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      // ...
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      // ...
    } else if (
      // 全局属性
      ((globalProperties = appContext.config.globalProperties),
      hasOwn(globalProperties, key))
    ) {
      // ...
    } else if (__DEV__) {
      // 一些告警
      // ...
    }
  }
}
```

如果我们知道 key 存在于哪个对象上，那么就可以直接通过对象取值的操作获取属性上的值了。

如果我们不知道用户访问的 key 存在于哪个属性上，那只能通过 hasOwn 的方法先判断存在于哪个属性上，再通过对象取值的操作获取属性值，这无疑是多操作了一步，而且这个判断是比较耗费性能的。

如果遇到大量渲染取值的操作，那么这块就是个性能瓶颈，所以这里用了 accessCache 来标记缓存 key 存在于哪个属性上。这其实也相当于用一部分空间换时间的优化。

接下来，函数首先判断 key[0] !== '$' 的情况（$ 开头的一般是 Vue 组件实例上的内置属性），在 Vue 3 源码中，会依次从 setupState、data、props、ctx 这几类数据中取状态值。

这里的定义顺序，决定了后续取值的优先级顺序：setupState >data >props > ctx。

#### set

然后看下 set 的实现

```js
export const PublicInstanceProxyHandlers = {
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      // 设置 setupState
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      // 设置 data
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      // 不能给 props 赋值
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      // 不能给组件实例上的内置属性赋值
      return false;
    } else {
      // 用户自定义数据赋值
      ctx[key] = value;
    }
    return true;
  },
};
```

可以看到这里也是和前面 get 函数类似的通过调用顺序来实现对 set 函数不同属性设置优先级的，可以直观地看到优先级关系为：setupState > data > props。同时这里也有说明：就是如果直接对 props 或者组件实例上的内置属性赋值，则会告警。

#### has

proxy 属性 has 的实现：

```js
export const PublicInstanceProxyHandlers = {
  has({_: { data, setupState, accessCache, ctx, appContext, propsOptions }}, key) {
    let normalizedProps
    return (
      !!accessCache![key] ||
      (data !== EMPTY_OBJ && hasOwn(data, key)) ||
      (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) ||
      ((normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key)) ||
      hasOwn(ctx, key) ||
      hasOwn(publicPropertiesMap, key) ||
      hasOwn(appContext.config.globalProperties, key)
    )
  },
}
```

这个函数则是依次判断 key 是否存在于 accessCache > data > setupState > prop > ctx > publicPropertiesMap > globalProperties，然后返回结果。

### setup 调用

我们继续看 `setupStatefulComponent` 后面代码

```js
// 获取 setup 函数
const { setup } = Component;
// 存在 setup 函数
if (setup) {
  // 根据 setup 函数的入参长度，判断是否需要创建 setupContext 对象
  // 函数的length 表示参数的个数
  const setupContext = (instance.setupContext =
    setup.length > 1 ? createSetupContext(instance) : null);
  // 调用 setup
  const setupResult = callWithErrorHandling(setup, instance, 0, [
    instance.props,
    setupContext,
  ]);
  // 处理 setup 执行结果
  handleSetupResult(instance, setupResult);
}
```

此处的 setup 获取的就是我们自己定义的函数

```html
<template>
  <p>{{ msg }}</p>
</template>
<script>
  export default {
    props: {
      msg: String,
    },
    setup(props, setupContext) {
      // todo
    },
  };
</script>
```

#### createSetupContext

```js
function createSetupContext(instance) {
  return {
    get attrs() {
      return attrs || (attrs = createAttrsProxy(instance));
    },
    slots: instance.slots,
    emit: instance.emit,
    expose,
  };
}
```

#### callWithErrorHandling

```js
export function callWithErrorHandling(
  fn: Function,
  instance: ComponentInternalInstance | null,
  type: ErrorTypes,
  args?: unknown[]
) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
```

Vue 3 很多函数的调用都是通过 callWithErrorHandling 来包裹

这样的好处一方面可以由 Vue 内部统一 try...catch 处理用户代码运行可能出现的错误。

另一方面这些错误也可以交由用户统一注册的 errorHandler 进行处理，比如上报给监控系统。

#### handleSetupResult

```js
function handleSetupResult(instance, setupResult) {
  if (isFunction(setupResult)) {
    // setup 返回渲染函数
    instance.render = setupResult;
  } else if (isObject(setupResult)) {
    // proxyRefs 的作用就是把 setupResult 对象做一层代理
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}
```

setup 返回值不一样的话，会有不同的处理，如果 setupResult 是个函数，那么会把该函数绑定到 render 上。

```html
<script>
  import { createVnode } from "vue";
  export default {
    props: {
      msg: String,
    },
    setup(props, { emit }) {
      return (ctx) => {
        return [createVnode("p", null, ctx.msg)];
      };
    },
  };
</script>
```

当 setupResult 是一个对象的时候，我们为 setupResult 对象通过 proxyRefs 作了一层代理，方便用户直接访问 ref 类型的值。比如，在模板中访问 setupResult 中的数据，就可以省略 .value 的取值，而由代理来默认取 .value 的值。

最后完成实例设置

```js
function finishComponentSetup(instance) {
  // type 是个组件对象
  const Component = instance.type;

  if (!instance.render) {
    // 如果组件没有 render 函数，那么就需要把 template 编译成 render 函数
    if (compile && !Component.render) {
      if (Component.template) {
        // 这里就是 runtime 模块和 compile 模块结合点
        // 运行时编译
        Component.render = compile(Component.template, {
          isCustomElement: instance.appContext.config.isCustomElement || NO,
        });
      }
    }
    instance.render = Component.render;
  }
  if (__FEATURE_OPTIONS_API__ && !(__COMPAT__ && skipOptions)) {
    // 兼容选项式组件的调用逻辑
  }
}
```

这里主要做的就是根据 instance 上有没有 render 函数来判断是否需要进行运行时渲染，运行时渲染指的是在浏览器运行的过程中，动态编译 `<template>` 标签内的内容，产出渲染函数。对于编译时渲染，则是有渲染函数的，因为模板中的内容会被 webpack 中 vue-loader 这样的插件进行编译。

这里有个 **FEATURE_OPTIONS_API** 变量用来标记是否是兼容 选项式 API 调用，如果我们只使用 Composition Api 那么就可以通过 webpack 静态变量注入的方式关闭此特性。然后交由 Tree-Shacking 删除无用的代码，从而减少引用代码包的体积。

## 组件更新

```js
const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
  function componentUpdateFn() {
    if (!instance.isMounted) {
      // 初始化组件
    }
    else {
      // 更新组件
      let { next, vnode } = instance
      // 如果有 next 的话说明需要更新组件的数组（props, slot 等）
      if (next) {
        next.el = vnode.el
        // 更新组件实例信息
        updateComponentPreRender(instance, next, optimized)
      } else {
        next = vnode
      }
      // 获取新的子树 vnode
      const nextTree = renderComponentRoot(instance)
      // 获取旧的子树 vnode
      const prevTree = instance.subTree
      // 更新子树 vnode
      instance.subTree = nextTree
      // patch 新老子树的 vnode
      patch(
        prevTree, 
        nextTree,
        // 处理 teleport 相关
        hostParentNode(prevTree.el),
        // 处理 fragment 相关
        getNextHostNode(prevTree),
        instance,
        parentSuspense,
        isSVG)
      // 缓存更新后的 DOM 节点
      next.el = nextTree.el
    }
  }
  // 创建响应式的副作用渲染函数
  instance.update = effect(componentUpdateFn, prodEffectOptions)
}
```

这里的核心流程是通过 next 来判断当前是否需要更新 vnode 的节点信息，然后渲染出新的子树 nextTree，再进行比对新旧子树并找出需要更新的点，进行 DOM 更新。我们先来看一下 patch 的更新流程(和初始化调用的patch完全一致)

```js
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
    return;
  }

  // 如果类型不同 直接卸载
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1);
    unmount(n1, parentComponent, parentSuspense, true);
    n1 = null;
  }
  // 基于n2来判断
  const { type, ref, shapeFlag } = n2;
  switch (type) {
    case Text:
      processText(n1, n2, container, anchor);
      break;
    case Comment:
      processCommentNode(n1, n2, container, anchor);
      break;
    case Static:
    case Fragment:
    // 上面两个略
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement();
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent();
      } else if (shapeFlag & ShapeFlags.TELEPORT) {
      }
  }

  // set ref
  if (ref != null && parentComponent) {
    setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
  }
};
```

首先判断当 n1 存在，即存在老节点，但新节点和老节点不是同类型的节点情况，那么执行销毁老节点，新增新节点。那么 Vue 如何判断是否是不同类型的节点呢？答案就在 isSameVNodeType 函数中：

``` js
export function isSameVNodeType(n1, n2) {
  // 新老节点的 type 和 key 都相同
  return n1.type === n2.type && n1.key === n2.key
}

```

如果新老节点是同类型的节点，会根据shapeFlag 不同走到不同逻辑

如果是普通元素更新会走到 processElement 里 如果是组件更新 会走到processComponent 中

#### processElement

processElement的更新流程

```js
const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  isSVG = isSVG || n2.type === 'svg'
  if (n1 == null) {
    // 初始化的过程 上面已经看过了
  }
  else {
    // 更新的过程
    patchElement(n1, n2, parentComponent, parentSuspense, isSVG, optimized)
  }
}


const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, optimized) => {
  const el = (n2.el = n1.el)
  let { patchFlag, dynamicChildren, dirs } = n2
  // ...
  // 旧节点的 props
  const oldProps = (n1 && n1.props) || EMPTY_OBJ
  // 新节点的 props
  const newProps = n2.props || EMPTY_OBJ
  // 对比 props 并更新
  patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG)  
  // 先省略 dynamicChildren 的逻辑，后续介绍... 
  // 全量比对子节点更新
  patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG)
}
```

可以看到普通元素的更新主要做的就是先更新 props ，当 props 更新完成后，然后再统一更新子节点。

但是我在看源码的时候发现了 `patchChildren` 是在 `patchProps` 之前的 先按照文章的顺序走


> 这里省略了对 dynamicChildren 存在时，执行 patchBlockChildren 的优化 diff 过程，我们直接先看全量 diff 也就是 patchChildren 函数。关于 patchBlockChildren 我们将在编译过程中的优化小节中进行详细介绍

然后看 patchChildren 更新子节点函数

``` js
const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized = false) => {
  // c1 代表旧节点的子节点元素
  const c1 = n1 && n1.children
  const prevShapeFlag = n1 ? n1.shapeFlag : 0
  // c2 代表新节点的子节点元素
  const c2 = n2.children
  const { patchFlag, shapeFlag } = n2
  // 新节点是文本
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // 旧节点是数组
    if (prevShapeFlag & ARRAY_CHILDREN) {
      // 卸载旧节点
      unmountChildren(c1, parentComponent, parentSuspense)
    }
    if (c2 !== c1) {
      // 新旧节点都是文本，但内容不一样，则替换
      hostSetElementText(container, c2)
    }
  } else {
    // 新节点不为文本
    // 旧节点是数组
    if (prevShapeFlag & ARRAY_CHILDREN) {
      // 新节点也是数组
      if (shapeFlag & ARRAY_CHILDREN) {
        // 进行新旧节点的 diff
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
      } else {
        // 卸载旧节点
        unmountChildren(c1, parentComponent, parentSuspense, true)
      }
    } else {
      // 新节点不为文本
      // 旧节点不是数组
      // 旧节点是文本
      if (prevShapeFlag & TEXT_CHILDREN) {
        // 则把它清空
        hostSetElementText(container, '')
      }
      // 新节点是数组
      if (shapeFlag & ARRAY_CHILDREN) {
        // 挂载新节点
        mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
      }
    }
  }
}

```


对于子节点来说总共有三种类型 文本节点，数组节点，空节点。 

所以patchChildren就是针对不同的组合进行的处理。


|  旧节点   | 新节点  | 表现  |
| :----: |:----: | :----: | 
|  空  | 空 | 空 |
| 空  | 纯文本 |添加纯文本 |
| 空  | 数组 |添加多个新子节点 |
| 纯文本  | 空 | 删除 |
| 纯文本  | 纯文本 | 替换文本 |
| 纯文本  | 数组 | 清空旧子节点，添加多个新子节点 |
| 数组  | 空 | 删除旧的子节点 |
| 数组  | 纯文本 | 删除旧的子节点，添加新文本节点 |
| 数组  | 数组 | diff |


抛开Diff算法，我们看下处理Vue组件


#### processComponent

``` js
const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  if (n1 == null) {
    // 初始化的过程
  }
  else {
    // 更新的过程
    updateComponent(n1, n2, parentComponent, optimized)
  }
}

const updateComponent = (n1, n2, optimized) => {
  const instance = (n2.component = n1.component)!
   // 根据新老节点判断是否需要更新子组件
  if (shouldUpdateComponent(n1, n2, optimized)) {
    //...
    // 如果需要更新，则将新节点 vnode 赋值给 next
    instance.next = n2
    // 执行前面定义在 instance 上的 update 函数。
    instance.update()
  } else {
    // 如果不需要更新，则将就节点的内容更新到新节点上即可
    n2.el = n1.el
    instance.vnode = n2
  }
}
```

updateComponent 函数首先通过 shouldUpdateComponent 函数来判断当前是否需要更新，因为有些VNode值变化并不需要立即显示更新子组件。

``` html
<template>
   <div>{{msg}}</div>
   <Child />
</template>
<script setup>
import { ref } from 'vue'

const msg = ref('hello')
<script>
```

因为子组件不依赖父组件的状态数据，所以子组件是不需要更新的，这也从侧面反映出 Vue 的更新不仅是组件层面的细粒度更新，更在源码层面帮我们处理了一些不必要的子节点更新！

最后执行的 instance.update，这个函数其实就是在 setupRenderEffect 内创建的。最终子组件的更新还会走一遍自己副作用函数的渲染，然后 patch 子组件的子模板 DOM，接上上面的流程。

##### next

``` html
<template>
  <div>
    hello world
    <hello :msg="msg" />
    <button @click="changeMsg">修改 msg</button>
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  setup () {
    const msg = ref('你好')
    function changeMsg() {
      msg.value = '你好啊，我变了'
    }
    return {
      msg,
      changeMsg
    }
  }
}
</script>

<!-- hello.vue -->
<template>
  <div>
    {{msg}}
  </div>
</template>
<script>
export default {
  props: {
    msg: String
  }
}
</script>
```


1. 点击 修改 msg 后， App 组件自身的数据变化，导致 App 组件进入 update 逻辑，此时是没有 next 的，接下来渲染新的子组件vnode，得到真实的模板vnode nextTree，用新旧subTree进行patch。
2. 此时patch的元素类型是 div，进入更新普通元素的流程，先更新props，再更新子节点，当前div下的子节点有Hello组件时，进入组件的的更新流程。
3. 在更新 Hello 组件时，根据 updateComponent 函数执行的逻辑，会先将Hello组件 instance.next 赋值为最新的子组件 vnode，之后再主动调用instance.update 进入上面的副作用渲染函数，这次的实例是 Hello 组件自身的渲染，且 next 存在值。

当 next 存在时，会执行 updateComponentPreRender 函数：
``` js
const updateComponentPreRender = (instance, nextVNode, optimized) => {
  // 新节点 vnode.component 赋值为 instance
  nextVNode.component = instance
  // 获取老节点的 props
  const prevProps = instance.vnode.props
  // 为 instance.vnode 赋值为新的组件 vnode 
  instance.vnode = nextVNode
  instance.next = null
  // 更新 props
  updateProps(instance, nextVNode.props, prevProps, optimized)
  // 更新 slots
  updateSlots(instance, nextVNode.children)
}
```

updateComponentPreRender 函数核心功能就是完成了对实例上的属性、vnode 信息、slots 进行更新，当后续组件渲染的时候，得到的就是最新的值。

总而言之，next 就是用来标记接下来需要渲染的子组件，如果 next 存在，则会进行子组件实例相关内容属性的更新操作，再进行子组件的更新流程。

