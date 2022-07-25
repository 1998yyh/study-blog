# Vue3


## 响应式API

### 响应式基础API

#### reactive

返回对象的响应式副本

``` JavaScript
const obj = reactive({ count: 0 })

// 类型声明

function reactive<T extends object>(target: T): UnwrapNestedRefs<T>

```

reactive 将解包所有深层的 refs，同时维持 ref 的响应性。

``` JavaScript
const count = ref(1)
const obj = reactive({ count })

// ref 会被解包
console.log(obj.count === count.value) // true

// 它会更新 `obj.count`
count.value++
console.log(count.value) // 2
console.log(obj.count) // 2

// 它也会更新 `count` ref
obj.count++
console.log(obj.count) // 3
console.log(count.value) // 3

```


当将 ref 分配给 reactive property 时，ref 将被自动解包。

#### readonly

接受一个对象 (响应式或纯对象) 或 ref 并返回原始对象的只读代理。只读代理是深层的：任何被访问的嵌套 property 也是只读的。

与 reactive 一样，如果任何 property 使用了 ref，当它通过代理访问时，则被自动解包：

#### isProxy

检查对象是否是由 reactive 或 readonly 创建的 proxy。

#### isReactive

检查对象是否是由 reactive 创建的响应式代理。

如果该代理是 readonly 创建的，但包裹了由 reactive 创建的另一个代理，它也会返回 true。

``` JavaScript
const state = reactive({
  name: 'John'
})
// 从普通对象创建的只读 proxy
const plain = readonly({
  name: 'Mary'
})
console.log(isReactive(plain)) // -> false

// 从响应式 proxy 创建的只读 proxy
const stateCopy = readonly(state)
console.log(isReactive(stateCopy)) // -> true

```


#### isReadonly

检查对象是否是由 readonly 创建的只读代理。

#### toRaw

返回 reactive 或 readonly 代理的原始对象。

可用于临时读取数据而无需承担代理访问/跟踪的开销，也可用于写入数据而避免触发更改。

去 修改他的引用 仍然会触发响应式

```JavaScript
const foo = {
  name:1
};

const reactiveFoo = reactive(foo)

let fooRaw = toRaw(reactiveFoo)

fooRaw.name = 2

watchEffect(()=>{
  console.log(reactiveFoo,'change');
})

```


#### markRaw

标记一个对象，使其永远不会转换为 proxy。返回对象本身。

``` JavaScript
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 嵌套在其他响应式对象中时也可以使用
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

有些值不应该是响应式的，例如复杂的第三方类实例或 Vue 组件对象。
当渲染具有不可变数据源的大列表时，跳过 proxy 转换可以提高性能。


可能类似Object.freeze

``` JavaScript
import { reactive,markRaw } from 'vue'
let person:any = reactive({
    name: "杨光",
    sex:'男',
    likes:['吃饭','睡觉']
});
 
let likes = ['吃饭','睡觉'];
person.likes = markRaw(likes);
let canChange = () => {
    person.name='发生改变了'
    person.likes[0]= '我要吃饭';
    person.likes[1]= '我要睡觉';
    console.log(person.likes);
};

```

但是好像这样会更改


#### shallowReactive

创建一个响应式代理，它跟踪其自身 property 的响应性，但不执行嵌套对象的深层响应式转换 (暴露原始值)。


``` JavaScript
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 改变 state 本身的性质是响应式的
state.foo++
// ...但是不转换嵌套对象
isReactive(state.nested) // false
state.nested.bar++ // 非响应式

``` 

#### shallowReadonly

创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。


``` JavaScript
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 改变 state 本身的 property 将失败
state.foo++
// ...但适用于嵌套对象
isReadonly(state.nested) // false
state.nested.bar++ // 适用

```








### refs



