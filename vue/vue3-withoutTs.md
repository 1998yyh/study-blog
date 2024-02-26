# vue3 在文档中没有的东西

## ExtractPropTypes

我们声明组件Props 有两种方式

``` js
// 写法一
import { ExtractPropTypes } from 'vue';

const props = {
  file: {
    type: String,
    required: true,
  },
  demo: {
    type: Object,
    required: true,
  },
}
defineProps(props)

export interface componentType = ExtractPropTypes<typeof props>

// 写法二
export interface componentType{
  file:string;
  demo:Object;
}
defineProps<componentType>
```

其实还有一种父组件可以通过 `Instancetype<typeof Child>['$props']`来获取


## resolveDynamicComponent


Vue 中 resolveDynamicComponent 的用法
resolveDynamicComponent 是 Vue 3 中引入的一个新的 API，用于动态解析组件。它可以根据传入的组件名称或对象，返回一个已解析的组件对象。



## TeleportProps

TeleportProps 是 Vue 3 中 Teleport 组件的 prop 对象，用于定义传送目标和相关配置。

TeleportProps 的属性:

+ to: 必需属性，指定传送目标的元素选择器或 ref 对象。
+ disabled: 可选属性，类型为 Boolean，默认值为 false。设置为 true 时，组件将不会被传送。
+ mode: 可选属性，类型为 String，默认值为 'append'. 可选值包括:
  + 'append': 将组件追加到目标元素的末尾。
  + 'prepend': 将组件插入到目标元素的开头。
  + 'before': 将组件插入到目标元素之前。
  + 'after': 将组件插入到目标元素之后。
+ tag: 可选属性，类型为 String，用于指定传送元素的标签名。默认情况下，将使用 'div' 标签。
+ props: 可选属性，类型为 Object，用于传递给传送元素的 props。
+ transition: 可选属性，类型为 Object 或 Function，用于定义 teleport 的过渡动画。



## CSSProperties

CSSProperties 是 Vue 3 中的一个类型，用于扩展在样式属性绑定上允许的值。它可以用来定义更复杂的样式，并提供类型检查和代码补全等功能。

``` ts
const style: CSSProperties = {
  background: props.color,
};
```



## ComponentPublicInstance

有时，你可能需要为一个子组件添加一个模板引用，以便调用它公开的方法。举例来说，我们有一个 MyModal 子组件，它有一个打开模态框的方法：


``` vue
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```

为了获取 `MyModal` 的类型，我们首先需要通过 `typeof` 得到其类型，再使用 TypeScript 内置的 `InstanceType` 工具类型来获取其实例类型

如果组件的具体类型无法获得，或者你并不关心组件的具体类型，那么可以使用 `ComponentPublicInstance`。这只会包含所有组件都共享的属性，比如 `$el`。


## PropType

当我们使用传入的方式来声明组件属性时，又想加类型限制，则需要使用`PropType` 


``` ts
export type CheckerLabelPosition = 'left' | 'right';

export const checkerProps = {
  name: unknownProp,
  disabled: Boolean,
  iconSize: numericProp,
  modelValue: unknownProp,
  checkedColor: String,
  labelPosition: String as PropType<CheckerLabelPosition>,
  labelDisabled: Boolean,
};
```


## InjectionKey

InjectionKey 是 Vue 3 中引入的一个类型，用于在组件之间传递依赖关系。它可以让我们以更解耦、更易维护的方式来管理依赖关系。

InjectionKey 的作用:
+ 在组件之间传递依赖关系，无需通过 props 或子组件传递。
+ 提高代码的解耦性和可维护性。
+ 支持 TypeScript 类型检查，增强代码安全性。

``` js
// 定义key
const MyService = Symbol('MyService');

export default MyService;


// 提供依赖关系
const App = {
  setup() {
    const myService = new MyService();

    provide(MyService, myService);

    return {
      // ...
    };
  },
};

export default App;

// 注入依赖关系
const MyComponent = {
  setup() {
    const myService = inject(MyService);

    return {
      // ...
    };
  },
};

export default MyComponent;
```


## computedRef

其实就是computed 返回的类型

``` ts
const a:ComputedRef<number> = computed(()=> x+ 1)
```


## effectScope

创建一个 effect 作用域，可以捕获其中所创建的响应式副作用 (即计算属性和侦听器)，这样捕获到的副作用可以一起处理。

``` ts
const scope = effectScope()

scope.run(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(doubled.value))

  watchEffect(() => console.log('Count: ', doubled.value))
})

// 处理掉当前作用域内的所有 effect
scope.stop()
```