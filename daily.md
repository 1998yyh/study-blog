## 7.18 

### object-fit 的 scale-down 属性什么场景会用到？

防止图片过于放大导致模糊

scale-down类似contain，但会防止图片超过其本身大小

## 7.22

### 检测css是否支持

```JS
npm i--save - dev css - browser - support

const {
    cssBrowserSupport
} = require("css-browser-support");

cssBrowserSupport([
    "aspect-ratio",
    "margin-inline",
    "border-radius",
    ":nth-last-child",
    "@layer",
    "gap",
]);

{
    'aspect-ratio': {
        chrome: {
            sinceVersion: '88',
            flagged: true,
            globalSupport: 22.46,
            browserTitle: 'Chrome'
        },
        chrome_android: {
            sinceVersion: '88',
            flagged: false,
            globalSupport: 41.34,
            browserTitle: 'Chrome Android'
        },
        edge: {
            sinceVersion: '88',
            flagged: false,
            globalSupport: 3.88,
            browserTitle: 'Edge'
        },
        // ... continued for all browsers
        globalSupport: 86.49
    }
}
```

## 7.25

### 渐变字体解决方案

01. -webkit-background-clip:text

02. https://www.zhangxinxu.com/wordpress/2022/07/css-font-palette/

## 8.18

01. 数组转化

```js
const arr = [{
        x: 80,
        y: 180,
    },
    {
        x: 10,
        y: 100,
    },
    {
        x: 20,
        y: 200
    }
]

// 希望转化成
result = [80, 180, 10, 100, 20, 200]
```

结果:

```js
const result1 = arr.map(item => Object.values(item)).flat();
const result2 = arr.reduce((p, {
    x,
    y
}) => [...p, x, y], [])
const result3 = arr.flatMap(v => [v.x, v.y])
const result4 = Array.from(arr, item => [item.x, item.y]).flat();
const result5 = arr.flatMap(Object.values)
const result6 = JSON.stringify(arr).match(/\d+/g);

console.log(result1, result2, result3, result4, result5, result6)
```

02. catastrophic backtracking

这个会导致内存溢出 卡死

```js
/(a*a*|a*)+b/.test('aaaaaaaaaaaaaa')
```

03. Evil.js

什么？黑心996公司要让你提桶跑路了？

想在离开前给你们的项目留点小礼物？

偷偷地把本项目引入你们的项目吧，你们的项目会有但不仅限于如下的神奇效果：

仅在周日时：

当数组长度可以被7整除时，Array.includes 永远返回false。
Array.map 有5%概率会丢失最后一个元素。
Array.filter 的结果有5%的概率丢失最后一个元素。
Array.forEach 会卡死一段时间。
setTimeout 总是会比预期时间慢1秒才触发。
Promise.then 有10%概率不会触发。
JSON.stringify 有30%概率会把I(大写字母I)变成l(小写字母L)。
Date.getTime() 的结果总是会慢一个小时。
localStorage.getItem 有5%几率返回空字符串。
Math.random() 的取值范围改为0到1.1
声明：本包的作者不参与注入，因引入本包造成的损失本包作者概不负责。

github地址:https://github.com/wheatup/evil.js

03. TODO

https://developer.chrome.com/blog/has-with-cq-m105/?utm_source=CSS-Weekly&utm_campaign=Issue-516&utm_medium=email

chrome版本过低 不支持

## 8.19

http://fex.baidu.com/blog/2014/06/xss-frontend-firewall-1/ - XSS 前端防火墙 —— 内联事件拦截
http://fex.baidu.com/blog/2014/06/xss-frontend-firewall-2/ - XSS 前端防火墙 —— 可疑模块拦截
http://fex.baidu.com/blog/2014/06/xss-frontend-firewall-3/ - XSS 前端防火墙 —— 无懈可击的钩子

我当年看完 还抄了写了一篇 《【前端安全】JavaScript防http劫持与XSS 》https://www.cnblogs.com/coco1s/p/5777260.html

## 8.25 

使用canvas实现监控视频播放时间轴，支持有视频区域显示，拖拽
https://blog.csdn.net/weixin_46543056/article/details/121631320

## 9.8 transform 更细粒度的属性

transform 作用于 元素 可以接受多个转换函数  

目标元素在 X 轴上翻译50% ，旋转30度，最后放大到120% 。

```css
.target {
    transform: translateX(50%) rotate(30deg) scale(1.2);
}
```

现在可以拆分

```css
.target {
    translate: 50% 0;
    rotate: 30deg;
    scale: 1.2;
}
```

原始 CSS 转换属性和新属性之间的一个关键区别是应用声明的转换的顺序。

通过转换，转换函数按照它们的写入顺序应用-从左(外)到右(内)。

对于各个转换属性，顺序不是它们声明的顺序。顺序总是相同的: translate(外) ，然后rotate，然后scale(内)。

那就意味着 下面两个效果是相通的

```css
.transform--individual {
    translate: 50% 0;
    rotate: 30deg;
    scale: 1.2;
}

.transform--individual-alt {
    rotate: 30deg;
    translate: 50% 0;
    scale: 1.2;
}
```

这样分隔是为了动画更容易, 比如我们要这样一个动画

<iframe height="300" style="width: 100%; " scrolling="no" title="transform1(copy:https://web.dev/css-individual-transform-properties/)" src="https://codepen.io/WFFMLOVE/embed/yLjeoWd?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/yLjeoWd">
  transform1(copy:https://web.dev/css-individual-transform-properties/)</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

我们需要的css代码如下

```css
@keyframes anim {
    0% {
        transform: translateX(0%);
    }

    5% {
        transform: translateX(5%) rotate(90deg) scale(1.2);
    }

    10% {
        transform: translateX(10%) rotate(180deg) scale(1.2);
    }

    90% {
        transform: translateX(90%) rotate(180deg) scale(1.2);
    }

    95% {
        transform: translateX(95%) rotate(270deg) scale(1.2);
    }

    100% {
        transform: translateX(100%) rotate(360deg);
    }
}

.target {
    animation: anim 2s;
    animation-fill-mode: forwards;
}
```

而如果使用单独转化的属性

```css
@keyframes anim {
    0% {
        translate: 0% 0;
    }

    100% {
        translate: 100% 0;
    }

    0%,
    100% {
        scale: 1;
    }

    5%,
    95% {
        scale: 1.2;
    }

    0% {
        rotate: 0deg;
    }

    10%,
    90% {
        rotate: 180deg;
    }

    100% {
        rotate: 360deg;
    }
}

.target {
    animation: anim 2s;
    animation-fill-mode: forwards;
}
```

## 9.9 

01. excel 转化成 json 

https://stackoverflow.com/questions/28782074/excel-to-json-javascript-code

02. Geolocation api

JavaScript Geolocation API 提供对与用户设备关联的地理位置数据的访问。这可以使用 GPS、WIFI、IP 地理位置等来确定。

getCurrentPosition：返回设备的当前位置。
watchPosition：当设备位置改变时自动调用的处理函数。

03. 在node环境的eventloop 中 宏任务的执行顺序是 (setTimeout setInterval ) => IO => setImmediate

在每个调用的任务之后，都会运行一个“子循环”，它由两个阶段组成：

Next-tick 任务，通过process.nextTick().
queueMicrotask()微任务，通过、 Promise 反应等排队。

```js
function enqueueTasks() {
    Promise.resolve().then(() => console.log('Promise reaction 1'));
    queueMicrotask(() => console.log('queueMicrotask 1'));
    process.nextTick(() => console.log('nextTick 1'));
    setImmediate(() => console.log('setImmediate 1')); // (A)
    setTimeout(() => console.log('setTimeout 1'), 0);

    Promise.resolve().then(() => console.log('Promise reaction 2'));
    queueMicrotask(() => console.log('queueMicrotask 2'));
    process.nextTick(() => console.log('nextTick 2'));
    setImmediate(() => console.log('setImmediate 2')); // (B)
    setTimeout(() => console.log('setTimeout 2'), 0);
}

setImmediate(enqueueTasks);

/**
nextTick 1
nextTick 2
Promise reaction 1
queueMicrotask 1
Promise reaction 2
queueMicrotask 2
setTimeout 1
setTimeout 2
setImmediate 1
setImmediate 2
 */
```

04. 冷门数组方法

* copyWithin(target, start, end)

```js
const array = [1, 2, 3, 4, 5];
const result = array.copyWithin(3, 1, 3);
console.log(result); // [1, 2, 3, 2, 3]
```

* al
* reduceRight
* findLast
* findLastIndex
* lastIndexOf
* flatMap

flatMap()方法使用给定的回调函数转换数组，然后将转换后的结果平展一层。

调用flatMap()数组与调用map()后跟一个深度为 1 的flat()的作用相同，但它比单独调用这两个方法更有效。

```js
const arr = [1, 2, 3, 4];
const withDoubles = arr.flatMap((num) => [num, num * 2]);
console.log(withDoubles); // [1, 2, 2, 4, 3, 6, 4, 8]

// flat() uses a depth of 1 by default
const withDoubles = arr.map((num) => [num, num * 2]).flat();
console.log(withDoubles); // [1, 2, 2, 4, 3, 6, 4, 8]
```

## 9.19 

监听全局input的value改变 我们可以去做一些埋点上报之类的操作

通过object.defineProperty 去重写value的set方法

```js
var desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
Object.defineProperty(HTMLInputElement.prototype, 'value', {
    ...desc,
    set(v) {
        console.log('set', v);
        desc.set.call(this, v)
    }
})
```

## 9.21 

重绘 <https://juejin.cn/post/6844903779700047885>

编辑页面 可以使用 

document.body.contentEditable = true

document.designMode = 'on' 来直接编辑

## 9.23

自定义谷歌浏览器:

允许跨域模式: `open -n /Applications/Google\ Chrome.app/ --args --disable-web-security --disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure  --user-data-dir=/Users/hao.yang/Desktop/ChromeUserData  --disable-site-isolation-trials`

调试模式: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=debugChrome`

## 10.8 2022 javascript 

https://almanac.httparchive.org/en/2022/javascript

01. async defer module 

HTML < script > 元素上的异步和延迟属性控制脚本加载的行为。

`async` 将防止脚本阻塞解析，但是脚本一下载就会执行，因此仍然可能阻塞呈现。

`Defer` 属性将延迟脚本的执行，直到 DOM 准备就绪，因此应该防止这些脚本阻塞解析和呈现。

Type = “ module”和 nommodule 属性特定于发送到浏览器的 ES6模块的存在(或不存在)。

当使用 type = “ module”时，浏览器期望这些脚本的内容包含 ES6模块，并将这些脚本的执行推迟到默认构造 DOM 之后。

相反的 nomomodule 属性向浏览器指示当前脚本不使用 ES6模块。

02. preload prefetch modulepreload

预取仍然完全是推测性的，以至于浏览器在某些情况下可能会忽略它。这意味着一些页面可能会因为请求未使用的资源而浪费数据。

不同的浏览器有不同的规则 , 看情况使用

## 10.8 2022 css 问卷调查

01. border-block border-inline 

02. content-visibility https://github.com/chokcoco/iCSS/issues/185

03. @media (400px < width < 1000px)

04. color-mix()

05. color()

06. lch() lab() oklch() oklab() 

```css
.foo {
    --color: #4488dd;
    background-color: hsl(from var(--color) h s calc(l * 1.2))
}

.gradient {
    background: linear-gradient(in oklab, hsl(80 90% 50%), red);
}
```

07. overscroll-behavior  父子元素都有滚动 如果子元素滚动到头 是否继续继续滚动父元素

08. touch-action 触屏的缩放 平移等操作

09. font-display 

```css
@font-face {
    font-family: ExampleFont;
    src: url(/path/to/fonts/examplefont.woff) format("woff");
    font-display: fallback;
}
```

10. ::part()

part CSS伪元素表示阴影树中具有匹配part属性的任何元素。

11. Native CSS nesting, excluding pre- or post-processors.

## 10.10 为什么访问defineStore创建的state不需要.value

state的数据都会被处理为ref，那访问ref自然是需要.value，但是我们日常使用pinia似乎从来没有.value。

```js
let name = ref("张三");
let age = ref("24");

const info = reactive({
    name,
    age
});

console.log(info.name); // 张三
console.log(info.age); // 24
```

简单来说就是reactive中嵌套ref的时候，修改reactive内的值不需要.value

## 10.11 

flex grid 两个游戏
https://cssgridgarden.com/
http://flexboxfroggy.com/

01. indexOf 不可以检查NaN 
    includes 可以·检查nan

    https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness

## 10.12

01. symbol 的 取值

```js
const a = Symbol(1)
const b = {};
b[a] = 1;

// 如何获取 Symbol

Object.getOwnPropertySymbols

Reflect.ownKeys()
```

## 10.13

webpack适⽤于⼤型复杂的前端站点构建: webpack有强⼤的loader和插件⽣态, 打包后的⽂件实际上就是⼀个⽴即执⾏函数，这个⽴即执⾏函数接收⼀个参数，这个参数是模块对象，键为各个模块的路径，值为模块内容。⽴即执行函数内部则处理模块之间的引⽤，执⾏模块等, 这种情况更适合⽂件依赖复杂的应⽤开发.
rollup适⽤于基础库的打包，如vue、d3等: Rollup 就是将各个模块打包进⼀个⽂件中，并且通过 Tree-shaking 来删除⽆⽤的代码, 可以最⼤程度上降低代码体积, 但是rollup没有webpack如此多的的如代码分割、按需加载等⾼级功能，其更聚焦于库的打包，因此更适合库的开发.
parcel适⽤于简单的实验性项⽬: 他可以满⾜低⻔槛的快速看到效果, 但是⽣态差、报错信息不够全⾯都是他的硬 伤，除了⼀些玩具项⽬或者实验项⽬不建议使⽤

## 10.14


这个是为了解决 indexdb无法存储非序列化的内容 比如vuethis
```js
{
    checkDataCloneException: {
        test: function test(e) {
            var t = {}.toString.call(e).slice(8, -1);
            if (["symbol", "function"].includes(_typeof$1(e)) || ["Arguments", "Module", "Error", "Promise", "WeakMap", "WeakSet", "Event", "MessageChannel"].includes(t) || e && "object" === _typeof$1(e) && "number" == typeof e.nodeType && "function" == typeof e.insertBefore)
                throw new DOMException("The object cannot be cloned.", "DataCloneError");
            return !1;
        }
    }
}
```


## 10.18

深拷贝 
```js
function cloneByMessageChannel(params) {
  return new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel();
    port2.onmessage = (ev) => resolve(ev.data);
    port1.postMessage(params);
  });
}
```



1. 乱序问题

https://juejin.cn/post/6844903503094087688


## 11.11 

1. 代码如下
``` js


const count = ref(0)

const increment = () => count.value++

onMounted(() => {
  console.log(count.value)
})

watch(count, (val) => {
  console.log(val)
})

watchEffect(() => {
  console.log('watcheffect', count.value)
})

```

生命周期时
顺序是 watch(immdiate) > watchEffect> computed > onMounted
当increment 调用时 
顺序是 watch > watchEffect

如果我们在watch中修改监听的值
```js

watch(count, (val) => {
  console.log('watch', val)
  count.value < 10 && count.value++
}, {
  immediate: true
})
```
此时 watch拿到的是count.value++后的值 所以watch正常输出 watcheffect会隔着输出


2. v-bind 绑定多个值

``` js
<button :disabled="isButtonDisabled">Button</button>
// disabled 如果是个真值或者'' 元素会包含这个attribute

// 动态绑定多个值
<div v-bind="objectOfAttrs"></div>
data(){
    return {
        objectOfAttrs:{
            id: 'container',
            class: 'wrapper'
        }
    }
}
```

3. 访问全局对象

 app.config.globalProperties上显式的添加他们,供所有vue表达式使用

4. 完整的指令语法

v-on:submit.prevent = 'onsubmit';

5. 有状态方法处理

有些情况下,我们可能需要动态的创建一个方法函数,比如创建一个防抖函数
``` js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // 使用 Lodash 的防抖函数
    click: debounce(function () {
      // ... 对点击的响应 ...
    }, 500)
  }
}
```

但是对于被重用的组件来说,是会有问题的,因为这个预置防抖的函数是 有状态的：它在运行时维护着一个内部状态。如果多个组件实例都共享这同一个预置防抖的函数，那么它们之间将会互相影响。

要保持每个组件实例的防抖函数都彼此独立，我们可以改为在 created 生命周期钩子中创建这个预置防抖的函数：

```js
export default {
  created() {
    // 每个实例都有了自己的预置防抖的处理函数
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // 最好是在组件卸载时
    // 清除掉防抖计时器
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... 对点击的响应 ...
    }
  }
}

```

6. 绑定class 
可以通过 {} 和 []绑定

``` js
// 确定有两个类名 只是控制显示不显示
<div :class="{isActive:true,error:false}"></div>
// 不确定类名是什么
<div :class="[activeClass,errorClass]"></div>
data(){
    return {
        activeClass:'active',
        errorClass:'error'
    }
}
// 也可以根据条件渲染处理 根据类名2选一 或者 控制显示不显示
<div :class="[isActive?'activeClass':'']"></div>
// 混用 两者都存在
<div :class="[activeClass,{isActive:true}]"></div>

```

在组件上使用
``` vue
<!-- 子组件模板 -->
<p class="foo bar">Hi!</p>
<!-- 在使用组件时 -->
<MyComponent class="baz boo" />
<!-- 渲染的结果是 -->
<p class="foo bar baz boo">Hi</p>
<!-- 如果你的组件有多个根元素，你将需要指定哪个根元素来接收这个 class。你可以通过组件的 $attrs 属性来实现指定： -->
<!-- MyComponent 模板使用 $attrs 时 -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

7. 列表渲染

v-if 的 优先级比 v-for 更高 这就意味着,v-if的条件无法访问到v-for作用域内定义的变量别名

``` vue
<!-- 此时访问不到todo.isComplete -->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
<!-- 如果想要使用 -->
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```


展示过滤或排序后的结果,我们希望显示数组经过过滤或排序后的内容，而不实际变更或重置原始数据。在这种情况下，你可以创建返回已过滤或已排序数组的计算属性。

8. 事件处理

使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的。

因此使用 @click.prevent.self 会阻止元素及其子元素的所有点击事件的默认行为而 

@click.self.prevent 则只会阻止对元素本身的点击事件的默认行为。

* 系统按键修饰符

.ctrl
.alt
.shift
.meta


* 鼠标按键修饰符

.left
.right
.middle

* .exact 修饰符

.exact 修饰符允许控制触发一个事件所需的确定组合的系统按键修饰符。



## 11.14

1. 表单输入绑定修饰符

* .lazy

默认情况下，v-model 会在每次 input 事件后更新数据 (IME 拼字阶段的状态例外)。你可以添加 lazy 修饰符来改为在每次 change 事件后更新数据

change是在失焦事件之后才触发

* .number 

如果你想让用户输入自动转换为数字，你可以在 v-model 后添加 .number 修饰符来管理输入 (这个体验不如 手动去校验并给出提示)


2. 侦听器

watch 的第一个参数可以是不同形式的“数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组：

``` ts
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

注意，你不能直接侦听响应式对象的属性值，例如:

``` ts
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})

// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```


* watchEffect

watch() 是懒执行的：仅当数据源变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。举例来说，我们想请求一些初始数据，然后在相关状态更改时重新请求数据。


watch vs. watchEffect


watch 和 watchEffect 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

watch 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。watch 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。

watchEffect，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。


* 回调的触发时机

当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。


默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新之前被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。

如果想在组件更新之后调用 你需要指明flush : post

``` js
watch(source,callback,{
    flush:"post"
})

watchEffect(callback,{
    flush:"post"
})

// 或者又个更方便的别名
watchPostEffect(callback)
```


* 听器必须用同步语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑


``` js
const unWatchEffect = watchEffect(()=>{})

// 移除
unWatchEffect();
```



## 11.15

1. js new Date 受时区影响

如果客户更改了电脑的系统时区，会有什么情况呢?

电脑系统时区是：(UTC-08:00)太平洋时间(美国和加拿大)
电脑系统时间是：2018年3月8日 0:21:17
打开浏览器console，输入 new Date() 输出是Thu Mar 08 2018 00:21:17 GMT-0800 (太平洋标准时间)。

换个时区：(UTC+08:00)北京，重庆，香港特别行政区，乌鲁木齐
系统时间不变，打开浏览器console,输入new Date()，输出是Thu Mar 08 2018 00:21:17 GMT+0800 (China Standard Time)
可以看到，修改时区对new Date()方法并没有影响。但是一般电脑系统时区的改变，是跟着时间自动变化的。这时候new Date()出来的数据，就会变成Wed Mar 07 2018 16:21:17 GMT+0800 (China Standard Time)时区差16个小时，所以时间也是差16个小时。

new Date()方法给出的时间是与客户机的系统时间有关的，而我们的目的是网页上显示的时间，是与服务器同步的。如果跟客户机同步的话，假设一个人在美国，一个人在中国，同时登陆一个网页应用，在网页上做操作，向服务器提交操作的一些结果，并且结果是带时间信息的，那么，以哪个为准呢？记录怎么保持一致性呢？如果跟服务器同步的话，就不会有这种问题了，每个人不管在什么地方，看到的时间总是服务器的时间。

Date.prototype.getTimezoneOffset()返回当前时区的时区偏移。

思路就是通过new Date().getTimezoneOffset()获取当前时区相对于0时区的偏移，然后将毫秒数转换为0时区的毫秒数。通过+偏移*1000*60来获取0时区的毫秒数。然后在new Date(0时区的毫秒数),这样展示的就是服务器的毫秒数。

但是，经测试发现出现了一个问题，时区是有夏令时和冬令时的，在某个具体日期，可能就变成夏令时了，这时候会相差一个小时。
但是使用new Date().getTimezoneOffset()这个方法是能获取到当前电脑时间是否是夏令时的偏移量的，但是new Date(转换后的时间)确没有考虑夏令时的问题。
原有在于new Date(value)当传入value毫秒数的时候，是会根据value进行判断的，导致还是跟new Date()方法有个夏令时的一个小时的误差。所以当获取系统的时区的时候，使用new Date(服务器传的0时区的偏移量).getTimezoneOffset(),然后调用new Date(计算过的客户单事件毫秒数)，这两个步骤的时区偏移量是一致的。不会有差别。



2. 单向数据流

所有的 props 都遵循着单向绑定原则，props 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。这避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。

另外，每次父组件更新后，所有的子组件中的 props 都会被更新到最新值，这意味着你不应该在子组件中去更改一个 prop。若你这么做了，Vue 会在控制台上向你抛出警告：

``` js
const props = defineProps(['foo'])

// ❌ 警告！prop 是只读的！
props.foo = 'bar'
```


3. 传递给props不能是一个导入的类型

``` ts
import { Props } from './other-file'

// 不支持！
defineProps<Props>()
```

这是因为 Vue 组件是单独编译的，编译器目前不会抓取导入的文件以分析源类型。我们计划在未来的版本中解决这个限制。

4. props 默认值 

我们通过类型声明的同时 , 失去了默认值的能力,可以通过withDefault 编译器宏来解决


5. 禁用Attributes继承

如果你不想要一个组件自动地继承attribute 你可以在组件选项中设置 inheritAttrs: false。

如果你使用了 `<script setup>`，你需要一个额外的 `<script>` 块来书写这个选项声明

最常见的需要禁用 attribute 继承的场景就是 attribute 需要应用在根节点以外的其他元素上。通过设置 inheritAttrs 选项为 false，你可以完全控制透传进来的 attribute 被如何使用。

比如一个button组件,我们有一些样式需要套一个父容器才能实现,同时有些属性需要继承在button上

```html
<!-- 我们不希望将attr绑定在btn-wrapper 上  -->
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

多个根结点的 `Attributes` 没有自动透传行为, 如果$attrs没有被显示绑定, 将会抛出一个错误

6. 作用域插槽使用jsx形式写

``` js
MyComponent({
    default:(slotProps)=>{
        return `${slotProps.text} ${slotProps.count}`
    }
})

function MyComponent(slots){
    const greetingMessage = 'hello';
    // 对应的组件其实也是一个渲染函数 通过参数传递 达成作用域插槽的效果
    return `<div>${
        slots.default({text:greetingMessage,count:1})
    }</div>`
}
```



## 12.14

1. JSON.stringify() 会忽略 数组除元素的属性

``` js
const a = [];
a.name = 1;

// 此时a  [name:1];

JSON.stringify(a) // []

structuredClone(a) // [name:1]
```

所以 当我们深拷贝的时候 考虑一下 是否需要这么操作


## 12.16 

1. ::view-transition-new ::view-transition-old 

这个好像是从a.html 切换到b.html的时候增加的过度动画效果 具体demo在 `view-transitions-example` 下 需要使用最新版本的 金丝雀chrome

2. 前端获取本地IP

通过webrtc 获取

```js
//创建RTCPeerConnection接口
let conn = new RTCPeerConnection({
    iceServers: []
})
let noop = function () {}
conn.onicecandidate = function (ice) {
    console.log(ice.candidate.candidate)
    if (ice.candidate) {
    //使用正则获取ip
    let ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
    let ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
    console.log('ip_addr', ip_addr);
    conn.onicecandidate = noop
    }
}
//随便创建一个叫狗的通道(channel)
conn.createDataChannel('dog')
//创建一个SDP协议请求
conn.createOffer(conn.setLocalDescription.bind(conn), noop)
```


## 12.20 

1. css3 四个自适应关键字 fill-available max-content min-content fit-content;

fill-available

举例来说，页面中一个<div>元素，该<div>元素的width表现就是fill-available自动填满剩余的空间

出现fill-available关键字值的价值在于，可以让元素的100%自动填充特性不仅仅在block水平元素上，也可以应用在其他元素 比如可以撑满垂直的剩余空间

fit-content
　　width:fit-content表示将元素宽度收缩为内容宽度





## 12.26 

1. 自动补 0 的操作 可以使用 padstart


2. CSS属性值范围溢出边界渲染特性


CSS这门语言有个很有意思的特性，就是CSS属性值超过正常的范围的时候，只要格式正确，也会渲染，而渲染的值就是合法边界值。

``` css
.example {
  opacity: -2;    /* 解析为 0, 完全透明 */
  opacity: -1;    /* 解析为 0, 完全透明 */
  opacity: 2;     /* 解析为 1, 完全不透明 */
  opacity: 100;   /* 解析为 1, 完全不透明 */
}
```


3. 根据背景色自动切换黑白 计算背景色的深浅度(灰度) luma = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255 然后根据某个阀值 建议0.5~0.6

具体地址 `https://www.zhangxinxu.com/wordpress/2018/11/css-background-color-font-auto-match/`

核心代码 
``` css
:root {
  /* 定义RGB变量 */
  --red: 44;
  --green: 135;
  --blue: 255;
  /* 文字颜色变色的临界值，建议0.5~0.6 */
  --threshold: 0.5;
  /* 深色边框出现的临界值，范围0~1，推荐0.8+*/
  --border-threshold: 0.8;
}

.btn {
  /* 按钮背景色就是基本背景色 */
  background: rgb(var(--red), var(--green), var(--blue));

  /** 
   * 使用sRGB Luma方法计算灰度（可以看成亮度）
   * 算法为：
   * lightness = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255
  */
  --r: calc(var(--red) * 0.2126);
  --g: calc(var(--green) * 0.7152);
  --b: calc(var(--blue) * 0.0722);
  --sum: calc(var(--r) + var(--g) + var(--b));
  --lightness: calc(var(--sum) / 255);
  
  /* 设置颜色 */
  color: hsl(0, 0%, calc((var(--lightness) - var(--threshold)) * -999999%));
  
  /* 确定边框透明度 */
  --border-alpha: calc((var(--lightness) - var(--border-threshold)) * 100);
  /* 设置边框相关样式 */
  border: .2em solid;
  border-color: rgba(calc(var(--red) - 50), calc(var(--green) - 50), calc(var(--blue) - 50), var(--border-alpha));
}

```



4. 根据背景色自动切换黑白 使用滤镜实现

``` html
<div class="box">
  <span class="txt">前端侦探</span>
</div>

<style>
.box{
  color: #ffeb3b;
  background-color: currentColor;
}

.text{
  filter: grayscale(1) contrast(999) 
  /* invert(1) 翻转 */
}

</style>
```


## 12.29

1. ios 微信内 h5页面 测试和预发环境 出现黑块  -webkit-tap-highlight-color 导致的


## 1.4 

1. 横屏竖屏切换

```css
// portrait 为判断为竖屏
 
@media only screen and (orientation: portrait) and (max-width: 768px) {
 
        // 需求代码
 
}
 
// landscape 为判断为横屏
 
@media only screen and (orientation: landscape) and (max-height: 600px) {
 
// 需求代码
 
}
```


2. 0s 后执行某个操作 我们一般使用setTimeout来实现 但是其会受到函数执行等影响 其实执行的是不准确的 

我们如果想严格的执行 0s 后操作的话 可以使用 postmessage

```js
// Only add setZeroTimeout to the window object, and hide everything
// else in a closure.
(function() {
    var timeouts = [];
    var messageName = "zero-timeout-message";

    // Like setTimeout, but only takes a function argument.  There's
    // no time argument (always zero) and no arguments (you have to
    // use a closure).
    function setZeroTimeout(fn) {
        timeouts.push(fn);
        window.postMessage(messageName, "*");
    }

    function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
            event.stopPropagation();
            if (timeouts.length > 0) {
                var fn = timeouts.shift();
                fn();
            }
        }
    }

    window.addEventListener("message", handleMessage, true);

    // Add the one thing we want added to the window object.
    window.setZeroTimeout = setZeroTimeout;
})();
```



## 1.5 

1. 腾讯文档 这种在线编辑 权限控制的有啥开源方案推荐嘛

RBAC 权限模型~

 https://juejin.cn/post/6844903905931821063


2. 0xffffffff 转 [255,255,255,255]

``` js
const input = 0xffffffff;

const output = [...function*(input){
  while(input){
    yield input & 0xff;
    input >>> = 8;
  }
}(input)].reverse();

```


## 1.9 
背景卡片地址 : https://codepen.io/xboxyan/pen/gOxKyvx


## 1.10 

1. git删除分支

删除当前分支以外的所有分支

git branch | xargs git branch -d

删除分支名包含的指定字符的分支

git branch | grep 'dev' | xargs git branch -d


grep 搜索过滤命令 使用正则表达式搜索文本 并把匹配到的打印出来

xargs 参数传递命令 用于将标准输入作为命令的参数传给下一个命令


## 1.11

1. 图片的真实尺寸 

<!-- 下面的是图片的真实尺寸 -->
img.naturalHeight
img.naturalWidth
<!-- 下面的获取到的是css属性 而不是图片的真实属性 -->
img.width
img.height

如果获取真实尺寸 还有可以通过new image()的宽高 来获取


2. 移动端单屏解决方案  适配问题

https://segmentfault.com/a/1190000042587022?utm_source=sf-similar-article


3. git 下载慢的解决方案

可以通过 --depth 1 来加速： 

```js
git clone --depth 1 https://xxxxxx
```

这样下载的代码仍然是完整的代码,只是少了历史commit

4. 提示用户去更新页面

https://juejin.cn/post/7185451392994115645


## 1.12 

渐变进度条 https://codepen.io/Chokcoco/pen/PoBmaqe?editors=0100

https://codepen.io/xboxyan/pen/poZPKxj

使用到的mask-compose技巧 https://github.com/chokcoco/iCSS/issues/189


## 1.16

1. css布局效果 元素宽度在范围内浮动 间隔固定 根据页面宽度调整每行展示的数量

https://codepen.io/xboxyan/pen/JjByZVE

1. 2022 state of js 看一些比较关注的数据

![](https://pic.imgdb.cn/item/63c509d3be43e0d30eae09e0.jpg)

+ 构建工具
  - webpack 仍然是使用率比较高的框架 但是受欢迎程度在削弱
  - vite 整体上升趋势
  - gulp 应该只有某些特殊情况下会使用它

+ 框架
  - vue 在平均水平线左右 但是感觉受到别的新框架影响 
  - react 使用人数还是比较多 
  - svelte 用的人比较少 但是整体是上升趋势 感觉鱿鱼会抄一波它

+ 测试
  - jest 整体还是这个吊
  - mocha 不太行了 

![](https://pic.imgdb.cn/item/63c50b90be43e0d30eb11053.jpg)

+ 测试框架感觉可以往vitest迁 应该是个趋势
+ pnpm 
+ testing-library 这个库比较全 各类框架都有适配
+ 现在前端三大框架 svelte / react / vue  (angular是什么辣鸡)


服务端渲染 

![](https://pic.imgdb.cn/item/63c50dc7be43e0d30eb4916f.jpg)

svelteKit 受欢迎程度非常高 感觉受 svelte 影响
nextjs 使用最多 满意度还可以
nuxtjs 中等水平 

整体和基础框架的情况一样



测试框架: vitest - testing-library => jest => mocha

客户端框架 tauri 比较火 然后electron

构建工具  热度 vite - swc - esbuild -> turbopack
        使用 webpack -> tsccli -> gulp -> vite 



## 1.17 
2022 js stars数量 
https://risingstars.js.org/2022/en


vue3的蒸汽模式(Vapor mode) 借鉴于solid

对于相同的Vue SFC，与当前基于Virtual DOM的输出相比，Vapor Mode将其编译为性能更好、使用更少内存、需要更少运行时支持代码的JavaScript输出。

看到个低代码 https://github.com/imcuttle/mometa

## 1.18

1. git 删除当前分支以外的所有分支

git branch | xargs git branch -d

git 删除分支名包括指定字符串的分支 


git branch | grep 'dev' | xargs git branch -d

grep
搜索过滤命令。使用正则表达式搜索文本，并把匹配的行打印出来。

xargs
参数传递命令。用于将标准输入作为命令的参数传给下一个命令。

2. 设置css权重

如果是 string 的话倒是可以用 attr 来做，但 z-index 是个 number，而 attr number 目前还没有浏览器支持

以后应该可以先在 html 里面写 data-zindex="3"，然后 css 里面写 z-index: attr(data-zindex number)

不过既然可以直接操作 dom 了，那为啥不直接加 inline style 呢

我一般用CSS变量style="--index: 1;"

然后css里写z-index: var(--index)

这得看情况，我是比较推荐共同的样式写 CSS，由代码控制的样式就写到 inline

如果一定要行内的话

行内尽量用变量，不要inline style

因为变量可以计算，可以用于多个值

这种情况下，用 class/dataset 然后通过别的方式传到 CSS 里，反而是有点麻烦，因为 inline CSS 会比 class 更好搜索，并且也不需要约束开发之间的命名规范

inline style是bad practice，不适合优先级管理


Good:
<div style="--index: 1;">
<div style="--index: 2;">

[style*='--index:'] {
    z-index: var(--index);
    translate: 0 0 calc(var(--index) * 1px);
}

Bad:
<div style="z-index: 1; translate: 0 0 1px;">
<div style="z-index: 2; translate: 0 0 2px;">