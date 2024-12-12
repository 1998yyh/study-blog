# 闲聊 OR 杂谈


1. shadcn/ui 

shadcn/ui 用 React 编写的 UI 组件的集合，允许通过 TailwindCSS 进行自定义样式。与传统的组件库不同的是 他不是通过 npm 安装而是通过 CLI 交付，该 CLI 将组件的源代码放入项目本身。

> 为什么复制/粘贴而不打包为依赖项？
> 其背后的想法是赋予您对代码的所有权和控制权，允许您决定如何构建组件和设计样式。
> 从一些合理的默认值开始，然后根据您的需要自定义组件。
> 将组件打包在 npm 包中的缺点之一是样式与实现耦合。组件的设计应该与其实现分开。

2. promise.reject(reason) 如果不是 Error 会有警告，

通过修改 eslint 规则 `'prefer-promise-reject-errors': 'off'` 取消掉该报错。

3. Select 遇到的一个小问题

```html
<div id="app">
  <textarea id="summary" cols="30" rows="10">
    Hello how are you!
  </textarea>
  <div>
    <button type="button">Select From Textarea & Just Click</button>
    <a href="#">Select Text From Textarea & Just Click</a>
  </div>
</div>

<script>
  const summary = document.getElementById("summary");
  summary?.addEventListener("select", (e) => {
    console.log("listening to select event...");
  });
</script>
```

现象是这样的 先选中一段 然后去点击按钮 此时也会触发输出 (只在 chrome 出现)

4. localstorage.clear 间接调用会报错。

```js
const clear = localStorage.clear;
clear();
// 报错 this上下文丢了，调用会报错
```

5. 不作用于 SEO 的属性 `data-nosnippet <span data-nosnippet>This is sensitive information.</span>`
6. 中断 forEach 的方法

```js
// throw Error
const array = [-3, -2, -1, 0, 1, 2, 3];

try {
  array.forEach((it) => {
    if (it >= 0) {
      console.log(it);
      throw Error(`We've found the target element.`);
    }
  });
} catch (err) {}

// 修改长度

array.forEach((it) => {
  if (it >= 0) {
    console.log(it);
    array.length = 0;
  }
});

// 修改原数组
array.forEach((it, i) => {
  if (it >= 0) {
    console.log(it);
    // Notice the sinful line of code
    array.splice(i + 1, array.length - i);
  }
});
```

7.  a 为什么时 `(a== 1 && a==2 && a==3)` 为真

```js
const a = {
  i: 1,
  toString: function () {
    return a.i++;
  },
};

if (a == 1 && a == 2 && a == 3) {
  console.log("Hello World!");
}
```

```js
const a = [1, 2, 3];
a.join = a.shift;
console.log(a == 1 && a == 2 && a == 3);
```

```js
let i = 0;
let a = { [Symbol.toPrimitive]: () => ++i };

console.log(a == 1 && a == 2 && a == 3);
```

这个可能有点不合适

```js
var i = 0;
// JavaScript 查找某个未使用命名空间的变量时，会通过作用域链来查找，作用域链是跟执行代码的 context 或者包含这个变量的函数有关。'with'语句将某个对象添加到作用域链的顶部，如果在 statement 中有某个未使用命名空间的变量，跟作用域链中的某个属性同名，则这个变量将指向这个属性值。如果沒有同名的属性，则将拋出ReferenceError异常。
with ({
  get a() {
    return ++i;
  },
}) {
  if (a == 1 && a == 2 && a == 3) console.log("wohoo");
}
```


8. toggle 

最常见的是`DOMTokenlist.toggle` 方法，这里的`DOMTokenList` 表示一组空格分割的标记，最常见的就是`Element.classList`

```html
<div class="a b c"></div>
```

通过`el.classList` 可以获取到 class 的详细信息

```js
el.classList.toggle("a"); // 移除 a
el.classList.toggle("a"); // 添加 a
```

通过上面这个，浏览器会动态判断，如果存在就移除，如果不存在就添加。

toggle 还支持第二个参数，表示强制，是一个布尔值，为 true 表示添加，反之为移除，而不管当前是什么状态

9. toggleAttribute 是用来切换属性的

比如控制一个输入框的禁用和开启。

```js
input.toggleAttribute("disable");

input.disabled = !input.disabled;

document.body.toggleAttribute("dark");

// 第二个参数表示强制
document.body.toggleAttribute("dark", ture); //添加dark属性
document.body.toggleAttribute("dark", false); //移除dark属性

// 也可以使用常规手段
document.body.setAttribute("dark", ""); //添加dark属性
document.body.removeAttribute("dark"); //移除dark属性
```


10. togglePopover 是新出来的，是针对 popover 元素推出的打开与关闭的方法。

```js
popoverEl.togglePopover(); //切换 popover
popoverEl.togglePopover(true); //打开 popover
popoverEl.togglePopover(false); //关闭 popover

// 打开
popoverEl.togglePopover(true);
// 等同于
popoverEl.showPopover();

// 关闭
popoverEl.togglePopover(false);
// 等同于
popoverEl.hidePopover();
```


11. 希望可以解构出来

```js
let [a, b] = { a: 1, b: 2 };

console.log(a, b); //TypeError: {(intermediate value)(intermediate value)} is not iterable
```

我们知道第一行等号左边的数组[a,b]是可迭代的，右边的对象{a:1,b:2}不可迭代的。那么我们应该‘使’命的想办法让右边的对象变成是可迭代的。既然对象身上没有迭代器属性，那我们就给它加一个！

```js
Object.prototype[Symbol.iterator] = function () {
  //Symbol.iterator属性返回的是函数
  return []; //此处应该返回的是一个迭代器对象，不是[]，直接{}也不可行
};
let [a, b] = { a: 1, b: 2 };

console.log(a, b); //TypeError: undefined is not a function
```

我们可以看到报的错不再是 not iterable,而是 undefined is not a function！这是因为 Symbol.iteratorreturn 出来的一个迭代器对象，所以这样也是不可行的。

再来，我们想数组的解构只能往数组解构，那么我们把对象转成数组，就是硬生生的把对象的值转为[1,2],也就是把值抠出来不要 key,那么此时才能解构成立。

```js
Object.prototype[Symbol.iterator] = function () {
  //Symbol.iterator属性返回的是函数
  //返回一个Array类型的可迭代对象
  return Object.values(this)[Symbol.iterator](); //this指向实例对象,Object.values(this)得到的是数组
};
let [a, b] = { a: 1, b: 2 }; //实例对象 相当于获得[1,2]

console.log(a, b); //1 2
```


12. 冬令时 / 夏令时 问题

比如德国在`2023-10-29`凌晨 3 点 会进入冬令时，即当我们时间到了 2:59 即将走完时，会自动跳转到 2:00, 此时当天就是 25 小时，如果我们计算第二天日期是选择当前时间+24h 的时间戳去做的话，会有问题。

所以需要我们去设置时间，setDate 这样。

另外`Date.getTimezoneOffset` 回在 UTC 时区中计算的此日期与在本地时区中计算的同一日期之间的差异（以分钟为单位）。 它是会自动考虑令时的。

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset>


13. 获取数字长度 `Math.ceil(Math.log10(number))` 或者 `String(number).length`
14. 解释 下面现象

```js
const items = {
  "000": "000",
  "001": "001",
  "002": "002",
  "003": "003",
  107: "107",
  108: "108",
};
for (const key in items) {
  if (key) {
    console.log("The Item Yahh", items[key]);
  }
}
```

不考虑符号，对象键只是字符串，但“000”和“0”不是一回事。只有“0”被认为是“类数字”，排在前面，“107”也是如此。这里有一篇文章更好地演示了这种行为 – <https://dev.to/frehner/the-order-of-js-object-keys-458d>


15. 某大佬讨论面试方案的变化

我几年前还会让候选人解释一下变量提升和函数提升，后来我是直接告诉候选人这个现象，听听候选人对这个的看法, 如果能结合其它语言，那就更好了

例如 go 的变量定义就只有 var 这种，这也导致了跟 js 类似的闭包问题；但从 1.21 开始 go 加了一个 flag 将 for 循环的变量行为改为 js 的 let，并且打算从 1.22 开始使其成为默认行为

function 有时候是必要的，“提前定义”在 C 语言里面都要用到，因为涉及到两个函数循环引用的问题

而函数提升就起到了提前定义的作用

我之所以改了问法，就是因为新问法其实不论对错，但可以了解候选人对其它语言的了解程度，以及自己是否有做过对比和总结

面试就变得更像是两个人的技术交流，而不是单纯的手册考察

而且这个话题可以继续顺着问下去，例如 cjs 的循环引用问题、如何破除循环引用


16. 业务前端如何提高业务价值。<https://mp.weixin.qq.com/s/v8izxLOQ4ZSEMuaXO1FC8w> 这个比较不错

17. 不要使用 maxLength 属性来阻止用户超出限制，

存在的问题：

- 采用`maxLength`属性一位置会忽略超过 x 个字符之后的内容
- 用户可能没有意识到他们的输入被忽略（并且可能保存了不正确的信息）
- 自动填充的值超过限制会被截断

18.  URL.canParse() 判断是否可以被解析。
19.  npm/yarn 默认都是扁平化 node_modules，之所以偶尔会出现一个依赖在另一个的 node modules 里，原因是没法 hoist 了

之前有遇到过，例如 a 依赖 c@1，b 依赖 c@2，如果一个项目同时装了 a 和 b.那其中一个 c 会被 hoist，另一个会呆在内部的 node_modules 里;至于是 c@1 还是 c@2 被提升，那就看运气了

当时群友遇到的问题好像是若干 @pro-components/xxx 都依赖 antd，但是是不同版本;这就导致其中一个 antd 被 hoist，剩下的十几个 antd 都在二级 node_modules 里，就出现了多实例问题

hoist 是提升特定的包
nohoist


20. 鸭子类型：

> 如果它走路像鸭子，叫起来像鸭子，那么它就是鸭子。

运行时检查，程序只是尝试调用的方法，甚至不知道对象是否具有这些方法，而不是先检查对象的类型作为了解对象是否具有这些方法的手段

21. 题

``` js

Promise.resolve(Promise.reject())
.then(console.log(1))
.catch(console.log(2))

```


22. 1000瓶水 其中一个有毒 ，要在 24 小时内鉴别出哪瓶水有毒，至少需要 几只 只小白鼠。

下面是原因：

这个问题可以转换为二进制编码的问题。因为一瓶水有毒，我们需要找到这瓶水的唯一标识。对于 1000 瓶水，可以用二进制编码表示这些瓶子的编号。

因此，需要 10 位二进制数来表示 1000 瓶水的编号。每只小白鼠可以代表二进制数中的一位，即每只小白鼠的生死状态（0 或 1）可以用来确定一位二进制数。

具体操作如下：

1. 给每一瓶水编号，使用二进制表示。例如：

   - 瓶 0: 0000000000
   - 瓶 1: 0000000001
   - 瓶 2: 0000000010
   - 瓶 3: 0000000011
   - ...
   - 瓶 999: 1111100111

2. 每只小白鼠负责一个二进制位的位置。例如，第 1 只小白鼠负责最高位（2^9），第 2 只小白鼠负责次高位（2^8），依此类推，第 10 只小白鼠负责最低位（2^0）。

3. 让对应二进制位是 1 的小白鼠尝试相应编号的水。例如：

   - 瓶 999 (1111100111) 的水会给所有小白鼠喝，因为其二进制表示中的每一位都是 1。
   - 瓶 1 (0000000001) 的水只会给第 10 只小白鼠喝。

4. 24 小时后，通过检查哪些小白鼠死亡，可以得到一个二进制数，这个二进制数正好对应有毒的那瓶水的编号。例如，如果第 1、3 和 4 只小白鼠死亡（其他都存活），那么毒水的编号就是二进制数 1011 (对应的十进制数是 11)。

通过这种方法，使用 10 只小白鼠就可以在 24 小时内唯一确定哪瓶水有毒。


23. Symbol.replace 可以通过正则替换字符串，所以对于本身不是字符串的替换比较安全


![](https://pic.imgdb.cn/item/665593ddd9c307b7e9a7b4b0.jpg)


24. vue 多根节点

```html
<script setup>
import { ref } from "vue";

const contracts = ref([]);
</script>

<template>
  <div v-if="contracts.length" class="contract-list">
    <div
      v-for="item in contracts"
      :key="item.id"
      class="item"
      @click="viewContract(item.contractNo, item.title)"
    >
      <div class="name">{{ item.title }}</div>
      <div class="icon"></div>
    </div>
  </div>
  <div v-else class="no-list">
    <img
      class="empty-img"
      src="https://xcfs-public.xystatic.com/100051/loans/empty-bg.png"
      alt=""
    />
    
  </div>
</template>
```

加 div 和 加 div 注释 和 不加 render 的效果都不一样。



25.  canvas 放到webworker 中绘制

比如我们正常绘制一个canvas
``` js
const drawSunshine = () => {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d')

  const lines = 500;

  const fontSize = 20;

  ctx.font = fontSize + 'px Arial';
  ctx.fillStyle = 'orange';

  const text = 'sunshine';
  const wordsPerLine = 10000;

  const lineHeight = fontSize * 12;

  for(let i = 0; i< lines;i++){
    let line = '';
    for(let j = 0; j<wordsPerLine;j++){
       line += `${text} - ${i+1} - ${j}`
    }

    requestAnimationFrame(()=>{
      ctx.fillText(line,0,(i+1)*lineHeight)
    })
  }
}

const computedTotal = ()=>{
  const total = new Array(100).fill(0).reduce((pre,_,index)=>{
    return pre + index + 1;
  },0)
}

drawSunshine();

computedTotal();
```

这样会阻塞主进程的代码，导致后续流程被阻塞


我们平时在遇到这类情况的时候，十有八九第一时间都会想到 Web Worker

但是问题来了：正常来说，Web Worker 中可获取不了 DOM，做不了画布绘制呀

估计会有人想：那我们可以把 Canvas 的 DOM 节点传入 Web Worker 中吗？

发现会报错，因为 postMessage 传数据的时候会进行深拷贝，而 DOM 节点无法被深拷贝

不得不说 JavaScript 是真的强大，早就为我们准备好了一个 API ，那就是 transferControlToOffscreen

有了这个 API ，我们就可以把 Canvas 的 DOM 节点以另一种方式传入 Web Worker 了！！！我们也能在 Web Worker 中去进行 Canvas 的绘制，进而优化主线程的代码执行效率！！

首先改造一下 drawSunshine，现在只需要传入 Canvas DOM，不需要在主线程去做绘制


``` js
const drawSunshine = ()=>{
  const canvas = document.getelementById('myCanvas').transferControlToOffscreen();
  const worker = new Worker('./worker.js')
  worker.postMessage({
    canvas
  },[canvas])

  worker.onmessage = res=>{
    console.log('end')
  }
}
```


26. 在最新版本的node中 我们可以通过 增加`--experimental-strip-types` 来直接运行ts
27. NP 问题 

通俗地说，它问的是，每个可以快速验证其解决方案的问题是否也可以快速解决。

举个例子： 比如求大整数99400891的两个质因子是很难的，但是若告知9967,9973，验证他们是 99400891 的两个质因子是可以在多项式时间内实现的。


28. overscroll-behavior: contain 

可以阻止mac侧滑 

29. Generator 的代码

``` js

const range = (...rest) => {
  if(rest.length === 0){
    throw new Error('range need two paramters, but get 0!')
  }

  let [start,end] = rest;

  if(rest.length === 1){
    [start,end] = [0,start]
  }

  function* _(){
    while(true){
      console.log(start)
      yield start++;
    }
  }

  return [..._().take(end-start)]
}

```


 斐波那契数列

```js
function* fibonacci(){
  let [prev,curr] = [0,1];
  for(;;){
    yield curr;
    [prev,curr] = [curr,prev+curr];
  }
}

for(let n of fibonacci().take(10)){
  console.log(n)
}

```


30. vue-router BeforeRouterEnter 钩子函数 中 next 执行顺序问题

``` html
<script>
export default {
  props:['query'],
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('beforeRouteEnter')
    })
  },
  actived(){
    console.log('activated')
  },
  computed(){
    myId(){
      console.log('myId')
      return this.query.id
    },
    myName(){
      console.log('myName')
      return this.query.name
    }
  }
}
</script>

```

按照上述的顺序执行，

第一次进入 会先执行  myId -> myName -> activated -> beforeRouteEnter
第二次进入 会先执行  beforeRouteEnter ->  myId -> activated -> myName
