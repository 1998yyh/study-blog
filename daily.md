## 7.18 

### object-fit 的 scale-down 属性什么场景会用到？

防止图片过于放大导致模糊

scale-down类似contain，但会防止图片超过其本身大小

## 7.22

### 检测css是否支持

```JS
npm i --save-dev css-browser-support

const { cssBrowserSupport } = require("css-browser-support");

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

1. -webkit-background-clip:text


2. https://www.zhangxinxu.com/wordpress/2022/07/css-font-palette/






## 8.18

1. 数组转化
``` js
const arr = [
  {
    x:80,
    y:180,
  },
  {
    x:10,
    y:100,
  },
  {
    x:20,
    y:200
  }
]

// 希望转化成
result = [80,180,10,100,20,200]
```

结果:
``` js
const result1 = arr.map(item=>Object.values(item)).flat();
const result2 = arr.reduce((p,{x,y})=>[...p,x,y],[])
const result3 = arr.flatMap(v=>[v.x,v.y])
const result4 = Array.from(arr,item=>[item.x,item.y]).flat();
const result5 = arr.flatMap(Object.values)
const result6 = JSON.stringify(arr).match(/\d+/g);

console.log(result1,result2,result3,result4,result5,result6)
```



2. catastrophic backtracking

这个会导致内存溢出 卡死
``` js
/(a*a*|a*)+b/.test('aaaaaaaaaaaaaa')
```


3. Evil.js

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


3. TODO

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

``` css
.target {
  transform: translateX(50%) rotate(30deg) scale(1.2);
}
```

现在可以拆分

``` css
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
``` css
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

<iframe height="300" style="width: 100%;" scrolling="no" title="transform1(copy:https://web.dev/css-individual-transform-properties/)" src="https://codepen.io/WFFMLOVE/embed/yLjeoWd?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/yLjeoWd">
  transform1(copy:https://web.dev/css-individual-transform-properties/)</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

我们需要的css代码如下
``` css
@keyframes anim {
  0% { transform: translateX(0%); }
  5% { transform: translateX(5%) rotate(90deg) scale(1.2); }
  10% { transform: translateX(10%) rotate(180deg) scale(1.2); }
  90% { transform: translateX(90%) rotate(180deg) scale(1.2); }
  95% { transform: translateX(95%) rotate(270deg) scale(1.2); }
  100% { transform: translateX(100%) rotate(360deg); }
}

.target {
  animation: anim 2s;
  animation-fill-mode: forwards;
}
```




而如果使用单独转化的属性

``` css
@keyframes anim {
  0% { translate: 0% 0; }
  100% { translate: 100% 0; }

  0%, 100% { scale: 1; }
  5%, 95% { scale: 1.2; }

  0% { rotate: 0deg; }
  10%, 90% { rotate: 180deg; }
  100% { rotate: 360deg; }
}

.target {
  animation: anim 2s;
  animation-fill-mode: forwards;
}

```


## 9.9 

1. excel 转化成 json 

https://stackoverflow.com/questions/28782074/excel-to-json-javascript-code

2. Geolocation api

JavaScript Geolocation API 提供对与用户设备关联的地理位置数据的访问。这可以使用 GPS、WIFI、IP 地理位置等来确定。

getCurrentPosition：返回设备的当前位置。
watchPosition：当设备位置改变时自动调用的处理函数。


3. 在node环境的eventloop 中 宏任务的执行顺序是 (setTimeout setInterval ) => IO => setImmediate

在每个调用的任务之后，都会运行一个“子循环”，它由两个阶段组成：

Next-tick 任务，通过process.nextTick().
queueMicrotask()微任务，通过、 Promise 反应等排队。

``` js
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

4. 冷门数组方法

+ copyWithin(target,start,end)

```js
const array = [1, 2, 3, 4, 5];
const result = array.copyWithin(3, 1, 3);
console.log(result); // [1, 2, 3, 2, 3]
```


+ al
+ reduceRight
+ findLast
+ findLastIndex
+ lastIndexOf
+ flatMap

flatMap()方法使用给定的回调函数转换数组，然后将转换后的结果平展一层。

调用flatMap()数组与调用map()后跟一个深度为 1 的flat()的作用相同，但它比单独调用这两个方法更有效。


``` js
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
        console.log('set',v);
        desc.set.call(this, v)
    }
})
```


## 9.21 

重绘 <https://juejin.cn/post/6844903779700047885>


编辑页面 可以使用 

document.body.contentEditable = true

document.designMode = 'on' 来直接编辑