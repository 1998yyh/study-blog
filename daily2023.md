# 2023 年每日笔记

## 1.30

1.  swc

插件存在的问题:

放到前端研发框架这样的复杂业务场景，JS 插件的能力是至关重要的。架构团队另说，我们几乎不可能要求业务方去用 JS 以外的语言去写插件。可是在复杂的场景中，业务几乎离不开对 JS Compiler 有定制化的诉求，比如用的比较多的 babel-plugin-import

值得注意的是，在 swc 的场景下，并不是所有的插件都用 JS 写合适，前文有提到性能问题，swc 的作者也在尽力将 babel 社区主流的插件改用 Rust 来写。但是基于前面的原因，可扩展的 JS 插件是不可或缺的。

1.  没有 presets 的概念
2.  plugin 自身能获取的信息过少：缺失 stat 信息，其中包含了当前正在处理的文件路径；无法给插件传递参数
3.  缺少 @babel/types 这样的生态工具
4.  没有 AST playground

体验与感受 :

构建时间说到底了是一种体验优化，所以在对研发框架进行改造的过程中，一定是不能捡了桃子丢了西瓜的（为什么是桃子？因为开发体验可比芝麻要重要的多）。评价一个研发框架是否好用，除了构建时间，还有开发效率、可扩展能力、稳定性等等更多维度的东西。

babel 确确实实已经经历过太多的考验和迭代，即使 swc 已经快三年了，并且一定程度上站在巨人的肩膀上，但依然有很多事情要做，尤其它的定位是取代 babel。

目前的结论是，研发框架暂不适合将 swc 投入到生产环境使用，短期内可能会以实验性属性的形式透出，未来会看 swc 的发展来决定怎么处理。

## 2.1

1.  解决 typescript 报错 无法重新声明块范围变量,从而导致编译报错 报错如下

![](https://pic.imgdb.cn/item/63d9cc3a588a5d166c06ffe8.jpg)

之所以 tslint 会提示这个错误，是因为在 Commonjs 规范里，没有像 ESModule 能形成闭包的「模块」概念，所有的模块在引用时都默认被抛至全局，因此当再次声明某个模块时，TypeScript 会认为重复声明了两次相同的变量进而抛错。

对于这个问题，最简单的解决方法是在报错的文件底部添加一行代码：**_`export {}`_**。这行代码会「欺骗」tslint 使其认为当前文件是一个 ESModule 模块，因此不存在变量重复声明的可能性。当使用这个方法时，记得这样配置你的 `tsconfig.json`

```json
{
  "include": ["src", "demo"],
  "compilerOptions": {
    /** ....  */
    // `esMoudleInterop` 这个配置允许文件中出现 export 关键字。
    "esModuleInterop": true // important!
    /** ....  */
  }
}
```

但是这样同时回带来一个问题 , 无法执行编译后的 Javascript 代码 , babel 虽然能够转译 但是并没有去掉, node 会由于无法识别关键字而报错

所以需要我们手动去删除掉 ` export {}` , 已经有包 `@babel/plugin-transform-modules-commonjs` 满足需求
使用方法

```js
{
  plugins: ["@babel/plugin-transform-modules-commonjs"];
}
```

## 2.2

1.  我们吧第三方库代码打到了业务里面 如果用外链的形式引入第三方库, 会减少白屏的效果吗?

答:

分场景 : 01. 首次加载 02. 二次加载 03. 首次加载后,有新版本发布 04. 你的静态资源有没有设置缓存 05. 发布策略,增量发布还是替换发布

首次加载 没有缓存 发两个 bundle 和 打进一个 bundle 的区别不大
第三方库独立引入的好处是 发新版本 这部分以来无需更新的话 可以享受到他的缓存
其次就是同站点下的其他页面公用这个缓存
拆分来发 利用浏览器的并行请求 是可以减少白屏

如果拆开来发 用 http2 反而会因为多路复用而降低性能
如果你要加载的本身就是大文件, 此时的瓶颈是带宽而不是延迟 这种情况没必要拆
如果是 bundle 的话 至少要把 vendor 拆出来 这样能利用缓存

不常维护的系统 就 http2 和 拆包选一个

多路复用只是降低了 链接延迟 但把一些并行的请求变成了串行

这个可能是实现的问题
https://stackoverflow.com/questions/33658302/why-http-2-is-slower-than-plain-https

## 2.3

1.  在 Esmodule 使用\_\_dirname

```js
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
```

2.  前端监控方法

https://juejin.cn/post/7172072612430872584

3.  检测白屏方法 : web-see

4.  css 波浪 wave : https://codepen.io/andyfitz/pen/wvxpBWL

## 2.5

1.  讨论关于 js 使用位运算

终于追到了。。。。要说到 v8 如何实现位运算，一个按位 or 光是编译器就要做这么多：
https://source.chromium.org/chromium/chromium/src/+/main:v8/src/compiler/js-type-hint-lowering.cc;l=461?q=JSBitwiseOr&ss=chromium%2Fchromium%2Fsrc
运行时 turbofan 还会做一些优化，例如如果发现一个数字在 1w 次循环中都是 int 就会优化成 int 的 or，如果发现了不好的写法（如某次循环中发现某个数字不是 int 了）则会推翻之前的优化，重新用慢的方法

你以为写的 js，实际上被转换成了一堆 runtime 的调用。。很多语言都这样，go 也是，一个 make 会被转换成 runtime 的各类函数，取决于 make 的参数是啥

现代编程语言已经不再是编译成纯二进制执行了，大多是基础功能转换为二进制、复杂功能转换为 runtime 调用。。语言的功能多少也就取决于 runtime 提供的功能有多少

但 js 这种语言过于灵活，一个变量啥类型都有可能，所以实际上我们以为的底层操作反而会很慢

## 2.6

1.  值得注意的是：块语句（大括号”｛｝＂中间的语句），如 if 和 switch 条件语句或 for 和 while 循环语句，不像函数，它们不会创建一个新的作用域。

不对，块级是有独立的作用域的，但是比起 lexical 作用域定义会松一些

```js
let a = 1;

{
  let a = 2;
  console.log(a);
}

var a = 1;

{
  var a = 2;
  console.log(a);
}

console.log(a);

// 报错
// Uncaught SyntaxError: Identifier 'a' has already been declared at <anonymous>:1:1
```

## 2.7

1.  uni-app 生命周期顺序

App launch -> App Show -> page onLoad -> paeg onShow -> component beforeCreate -> component created -> component mounted -> page onReady

## 2.8

专心工作 无心抓鱼

## 2.9

1.  web 版本更新提示

https://juejin.cn/post/7159484928136642567

https://juejin.cn/post/6995385715672481799

## 2.10

1.  如果是 node 直接查数据库,推荐直接使用 node 的技术展 例如 sequelize 或者 typeorm

2.  mybatis 跟 node 生态差的有点远 虽然手动转化也能做 但是 orm 也好 active record 也好 不就是为了以后可以增加字段关联的时候不用改那么多代码 手动转就失去了这个优势了

3.  真正计算密集型的东西还得看性能, 多喝只是只吃了横向扩展 但是碳排放还是挺高

4.  服务基本就这几个 服务发现 心跳检测 冒烟检测 复杂均衡

冒烟检测: 一些基本的检测 有些时候服务不是跑起来就能接受流量的 会有一些预加载和预处理 只有这些检测完毕之后 冒烟检测才会通过 负载均衡才会把流量引过来

5.  即使是 ts 用 ts-node 运行的本质也是线打包 , 之后运行 js 只能说冷启动的时间 会稍微慢一点点 这对 serverless(或者叫函数计算)来说是致命的,但他们也有解决办法,不一定非得降低冷启动时间

6.  静态文件肯定是 nginx 厉害 单实例百万链接 不过静态文件最好还是扔到 cdn vue 有一种写法是可以不打包直接挂到 nginx 后面,让浏览器运行 没有人会在线上跑 dev server

7.  后端框架 python 有 flask 和 django, go 基本是 gin 搭起来的 , nodejs 有 egg next koa express , php 有 laravel,thinkphp
    即使不提语言差异, 后端也会纠结 mySql 和 mariaDB 哪个好, RocketMq 和 Kafka 该用哪个
    java 我不太了解 因为他似乎是主流语言中唯一一个 没有 ide 我深知连项目都不会编译 的语言 于是就一直没有怎么接触过

8.  js 的数组并不是严格的数组实现, 而是类似于 c++的 vector (对于稀疏数组 V8 甚至用了哈希表),所以即使你 pop 了, 占用空间也没办法立即减少

9.  Infinity 一般用于简化算法, 作为哨兵数字  
    在一些 没有 Infinity 的场景 (如 C 语言切数据类型为 Int)下 会使用-1 或者一个很大的数字来代替, 不过要特别判断一些东西 ,infinity 几乎不需要做特别判断

    例如归并排序的归并流程 , 只要在两个系列末尾加入一个 Infinity , 就不需要判断一个序列已结束了

    Math.main 也是 如果另初始值为 Infinity 就只需要 for 循环 不需要特判 ‘如果是第一个元素 则把它赋值给 result 了

    当然他也是作为 IEEE754 浮点数的一部分 , 用作 1/0, 在 js 中只要数字的运算结果超过一定大小 也会变为 Infinity

    至于 Number.MAX_VALUE 一般用不到 ,业务中常用的是 number.MAX_SAFE_INTEGER 用于避免整数过大导致精度问题 (例如 API 返回的 order ID 如果超过了这个数字 前端就没办法展示 后端必须用 String 返回)

    MAX_VALUE 几乎没有什么意义 不会有业务判断的数字这么大

10. 当前时间是实时取的,它的精准度只取决于取数字的函数 例如,Date.now 就是毫秒级 performance.now 就更精确一点 所谓的 16.7ms 导致的误差其实是你点不准 也就是计数器没法在你点击的时候瞬间停止 但是计时器停止了之后 去到的时间一定是准确的

11. 有时候前端还是要了解一下 一些常见操作的时空小号 不然哪天把 n 的复杂度 搞成了 n^ 2 就不好了

一个常见的例子就是为了优雅 而用 reduce 来构造对象

```js
xxx.reduce(
  (acc, cur) => ({
    ...acc,
    [cur.key]: cur.value,
  }),
  {}
);

// 这个地方使用 { ... acc} 来构造一个对象会消耗 O(Object.keys(x)) 的时间
```

12.

r: 流式的堆甚至没办法解决最值问题 ?

g: 当然 可以 维护 k 个元素的堆就行了 你贴的这个只是找一次 kth-value 有价值

r: 问题是不输入完整元素你是不知道 谁最大的 然而就这个问题来说 , 堆需要 nlogn 或者如果不在线处理, 那直接 n+klogn

g: 要的就是已知数据里的 kth-value 当有新数据时不断刷新 , 快排的思想做不到 它只能在单词 o(n) 中找 kth value , 我的意思是 在真实世界中 ,在一段 固定的数据里找一次 kth-value 并不常见, 还有就是不能处理大数据 因为空间不够,所以才需要支持流式计算

r: 堆能做到这个? 如果是大根堆 大小为 k 并不能保证挤出去的一定是最小的

g: 看你要维护什么数据 如果前 k 小 , 就维护小根堆,反之就维护大根堆

r: 因为堆内数据没有任何顺序保证 只有根元素有保证 我要找第 k 大 于是维护一个大小为 k 的大根堆 , 然后进来第 k+1 个元素了 该如何处理 有一个元素会被挤出去 但并不能保证是 当前堆中最小的, 搞不好第二小的被挤出去了也有可能

g: 你想错了 你说的这个是滑动窗口问题 ,这种情况下 就是窗口大小固定, (比如只看某个时间段内的数据) , 可以上平衡树 平衡树求 kth-value 可以用名次树 在 O(logn)的 insert/delete/query 的复杂度下解决

r: 平衡树 写起来太麻烦了 大材小用 看业务场景, 如果你说的是滑动窗口求 kth-value 我想不到更好的解法

r: 我第一反应是滑动窗口的思路 确实有别的思路

g: 不是普通的平衡树 ,得实现名次树才行 treap 和 splay 都可以 但需要实现额外的方法 滑动窗口只能求最大或者最小 ,在这个问题中没有意义 ,你直接维护个单调栈就可以

13. js 的位 运算效率超级低, 因为 js 的 number 并不是 int 没法直接算

chromium 在执行 js 之前会试图做优化 实际上 | 运算符 会被转化成调用 IrOpcode::BitwiseOr

你以为写的 js 实际上 被转化成了一堆 runtime 的调用 , 很多语言都这样 go 也是 , 一个 make 会被抓花城 runtime 的各类函数 , 取决于 make 的参数是啥

这是 JIT(Just In time)通用的东西, 不光 chromium 有, 但 js 这种语言过于灵活 , 一个变量啥类型都有 所以实际上我们以为的底层操作反而会很慢

14. 我倒是比较看好 flat 因为原生实现迟早会被优化 除非当下的需求必须要求性能,否则比较推荐原生, 代码简单而且未来有潜力

前端这些年的新东西大都是让代码写的更优雅 而后端的新东西大多都是在解决业务问题

一个前端目前遇到的业务挑战没有后端那么多 一个是后端的语言,概念,工具都很成熟了 ,目前的瓶颈是水平扩展 高可用 数据一致性

后端的请求凉椅上来 ,之前所有的架构几乎都要推翻, 至于后端写前端 只是他们缺少一个管理页面罢了 , 而且很久以前后端也要写页面 只是现在分开了而已

15. v8 的 Map 使用 OrderedHashTable 做的 是一个维持 key 插入顺序的 hash 表

反正想看某个 js 类型这么实现的 直接去搜 v8/src/objects 下面找 或者全局搜索 JSxxx 例如 JSNumber JSBigint JSmap

如果遇到数据结构（例如这儿的 OrderedHashTable），一般里面都会附上注释，图中的注释还给了 MDN Wiki 的参考链接：https://wiki.mozilla.org/User:Jorend/Deterministic_hash_tables

它的搜索做的非常好 可以搜关键字 也可以基于 reference 跳转

## 2.13

1.  Object.is(NaN,NaN) 和 isNan(NaN) 没有区别
2.  Number.isNaN() 和 isNaN 有一个转化的区别 isNaN(x) = Number.isNaN(Number(xx))

## 2.14

1.  画一条三次贝塞尔曲线曲线 https://codepen.io/Chokcoco/pen/mdGdejG

## 2.15

忙

## 2.16

忙

## 2.17

1.  Jest 单元测试 如果需要使用浏览器中 API 需要配合 js-dom
2.  `color-contrast` color-contrast()函数符号接受一个颜色值，并将其与其他颜色值的列表进行比较，从列表中选择对比度最高的一个。
3.  npm cache

NPM 缓存是节点包管理器在安装新包时使用的存储在计算机上的包的集合。这个缓存有助于加快安装过程，因为它不需要重复下载相同的包。缓存还允许 NPM 跟踪你的计算机安装了哪些扩展、文件和包。

不幸的是，随着时间的推移，这个缓存文件夹可能会变得混乱，因为 NPM 会定期更新旧包或安装新包。这种混乱可能会导致安装新包时出现问题，因为它可能无法识别机器上已经安装了哪些文件。

首先我要说的是，不建议清理 NPM 缓存，除非你因为数据损坏问题而面临错误，或者只是想释放磁盘空间。NPM 非常擅长处理缓存，如果有异常，它会尝试自动修复它或让你知道任何可能的损坏。

这里有一些你可能想要清理你的 NPM 缓存的原因:

1.  释放磁盘空间。
2.  消除“Please run npm cache clean”错误。
3.  修复无法正确下载的库。
4.  重新安装没有缓存的库(虽然不知道为什么你会这样做)。

```js
npm cache clean --force
```

这个命令将删除 NPM 缓存中存储的所有数据，包括任何过时版本的包。请注意，在运行此命令时使用" -force "标志非常重要，因为它可以确保删除所有数据，即使可能由于缓存损坏或其他原因而出现错误。

```js
npm cache verify
```

npm cache verify 是一个命令，用于验证 npm 缓存中所有已安装包的完整性。它验证缓存文件夹的内容，垃圾收集任何不需要的数据，并验证缓存索引和所有缓存数据的完整性。

删除 NPM 缓存不同于从项目中删除 node_modules 文件夹。NPM 缓存对于您的计算机是全局的，而 node_modules 文件夹则存储在每个项目中。如果你只是删除 node_modules 文件夹并重新安装所有的包，你仍然可以从 NPM 缓存中获取这些包，并且清理 NPM 缓存，不会影响你的项目库。

NPM 缓存是 NPM 包管理器的重要组成部分，它有助于加快安装过程，并跟踪在您的机器上安装了哪些包。清理 NPM 缓存可以帮助释放磁盘空间，修复损坏的库，并避免遇到“请运行 NPM 缓存清理”错误。

不建议清理 NPM 缓存，除非你真的需要，但如果你需要它，现在你知道怎么做了。

4.  https://javascriptkicks.us9.list-manage.com/track/click?u=4ba84fe3f6d629e746e48e5b7&id=1d04ca3374&e=cfe47b0953

interface 和 type 的区别

5.  TresJS Bring Three to the Vue ecosystem 这个库将 threejs 引入 vue 的生态系统

地址 - https://tresjs.org/

## 2.20

请加

## 2.21

1.  mutation-observer

2.  intersection-observer :

提供了一种异步观察目标元素与其祖先元素或顶级文档视口（viewport）交叉状态的方法

当一个 IntersectionObserver 对象被创建时，其被配置为监听根中一段给定比例的可见区域。一旦 IntersectionObserver 被创建，则无法更改其配置，所以一个给定的观察者对象只能用来监听可见区域的特定变化值；然而，你可以在同一个观察者对象中配置监听多个目标元素。

## 2.22

可以写个批量曝光的方法

https://juejin.cn/post/7018430369321975822

## 2.23

微信小程序 picker-view 的问题

picker-view 的 bindchange 事件（选项变更事件）会随着动画结束延迟触发，目前动画时长太久，导致 bindchange 触发延迟太久

只要滚得快一点，那么通知事件就会迟到，导致用户点击确认按钮后得到的数据和其看到的选择项会不一样

问题描述的地址

https://developers.weixin.qq.com/community/develop/doc/0002c6f63c86b8cccd17af72c56c00?page=1

https://developers.weixin.qq.com/community/develop/doc/00086ede9f4af82fdd8ca65be54c14

暂时的解决方案
![](https://pic.imgdb.cn/item/63f748acf144a010078992b5.jpg)

## 2.24

1.  iOS and iPadOS 16.4 beta 1 这个版本中 支持了很多属性 比如`媒体查询`,`@property`,`font-size-adjust(按比例缩小font-size)`等属性

增加了对 Web 推送到主屏幕 Web 应用程序的支持。Web Push 使得 Web 开发人员可以通过使用 Push API、notifications API 和 Service worker 一起工作来向用户发送推送通知。

## 2.27

## 2.28

无事

## 3.1

canvas 绘制两点之间曲线链接

```js
var drawCurve = function (startX, startY, endX, endY) {
  // 曲线控制点坐标
  var cp1x = startX;
  var cp1y = startY + (endY - startY) / 2;
  // 这里的除数2和曲线的曲率相关，数值绝大，曲率越小
  var cp2x = endX;
  var cp2y = endY - (endY - startY) / 2;

  // 开始绘制曲线
  context.beginPath();
  context.lineWidth = 4;
  context.strokeStyle = "#000";
  context.moveTo(startX, startY);
  // 绘制曲线点
  context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
  context.stroke();
};
```

## 3.2

再重温一遍

```js
function foo(a, b, c) {
  arguments[0] = 42;
  console.log(a);
}

function bar(a, b, c = 3) {
  arguments[0] = 42;
  console.log(a);
}

foo(1, 2);
bar(1, 2);
```

严格模式下，arguments 是拷贝而不是引用

而带默认值的方法判定为 ES2015 以后的语法，方法体会被自动指定为严格模式

arguments 在任何场合都不应该使用

## 3.3

1.  容器查询 https://developer.chrome.com/en/blog/style-queries/

据说是可以通过

```css
@container style(--detail: new) {
  .comment-block {
    display: block;
  }

  .comment-block::after {
    content: "New";
    border: 1px solid currentColor;
    background: white;
    ...;
  }
}

@container style(--detail: low-stock) {
  .comment-block {
    display: block;
  }

  .comment-block::after {
    content: "Low Stock";
    border: 1px solid currentColor;
    background: white;
    ...;
  }

  .media-img {
    border: 2px solid brickred;
  }
}
```

2.  一个课程 地址是

主要讲的是 前端页面在用户切到后台的时候 我们应该做些什么 ? 比如是否要停止定时器或者一些动画 , 如果有接口请求 是否要中断它

https://frontendmasters.com/courses/background-javascript/?utm_source=javascriptweekly&utm_medium=email&utm_content=backgroundjs

纯英文的

3.  尤大对于 vue3 的状况的文章以及 视频 https://thenewstack.io/vue-2023/

4.  对于 前端上传 word 转化 pdf 记录

R:》 如果为了保证效果，我比较推荐 openoffice，支持 headless 模式输出 PDF

比较完善的做法是 openoffice 跑在 headless 模式下并开一个端口监听，后端服务有库可以跟它做交互，就跟 chrome devtools protocol 一样，控制它打开文件、生成 PDF

这样的好处是你可以维护一个 openoffice 池，有新请求就从池里挑一个实例出来，用完再塞回去，还能定时重启以及监控 😐

浏览器保证不了效果

S:》 这后端给我拒绝了，说让我(前端)自己做 他说服务器压力顶不住，放在浏览器好一点

R:》 虽然网上有库可以读取文件内容，但对于一些样式，无法很好地识别；并且这类库通常很大，显著影响加载速度

而 openoffice 这类软件，本来就是 office 的替代品，效果是可以保证的

如果你们领导只关注文档内容，那就前端随便找个库做吧

啊这，我搜了一下 npm，好像常见的做法都是用我说的 libreoffice😂

J:》 或者，eteer，前端做一个中间页面，用来预览用户上传的文件附件，然后再写个 node 服务，把网页的转成 PDF

## 3.6

## 3.7

忙于需求

## 3.8

```ts
type res = never extends 1 ? 1 : 2;
//  type res = 1
type Test<T> = T extends 1 ? 1 : 2;
type res2 = Test<never>;
// type res2 = never;
```

第一个 非范型的时候 如果 extends 的是 any 或者 unknow 或者 check 部分是 extends 部分的字类型, 直接返回 trueType 的类型

never 是任何类型的子类型, 所以是 1

第二个 当类型参数是 never 出现在条件类型左边 直接返回 never

## 3.17

1.  开平方的操作 Math.sqrt(2) === 2\*\*0.5

2.  随机 mac 地址的写法

```js
function randomMac() {
  const mac = [
    (0x52).toString(16),
    (0x54).toString(16),
    (0x00).toString(16),
    Math.floor(Math.random() * 0xff).toString(16),
    Math.floor(Math.random() * 0xff).toString(16),
    Math.floor(Math.random() * 0xff).toString(16),
  ];
  return mac.join(":");
}
```

3.  semver https://juejin.cn/post/6844903516754935816

只要有一个作者没有遵循 semver，引入了 breaking change，你的项目就挂了（参考之前我遇到的 antd eslint 的问题

你给 typedoc 提 PR 就会发现，它依赖的某个东西（有可能是 @typescript-eslint，或者 ts-loader）也没有 typescript@^5 的 peer

如果不是最底层的库，真的没办法跟进那么快。。我们业务项目至今迟迟没升级 react 18 就是因为一些库还不支持，又没有更好的选择

ts 从 3 升到 4 也经历了一大波编译错误（主要是 Promise 的范型相关）

所以一个是等待时机成熟，一个是需要有足够的人力。。

像是 pnpm swc webpack5

4.  生成随机码的函数

```js
export function genRamdomMAC() {
  return "xy-xx-xx-xx-xx-xx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    // 这个地方使用0x没有 0b清晰

    const v = c === "x" ? r : (r & 0b11) | 0b1000;
    return v.toString(16);
  });
}
```

5.  对称加密
    https://halfrost.com/symmetric_encryption/#toc-19

基于大整数分解难题的加密算法应该指的是 RSA（我还没见过其它的），不过随着量子计算机的发展，RSA 并不能抵抗量子攻击

啊这，我才发现基于椭圆曲线的 ECDSA 甚至比 RSA 还容易被量子攻击。。

以后 ssh 不用它了

6.  取颜色值的 argb

```js
((0xabcdef12 >> 0x18) & 0xff).toString(16);
((0xabcdef12 >> 0x10) & 0xff).toString(16);
((0xabcdef12 >> 0x08) & 0xff).toString(16);
((0xabcdef12 >> 0x00) & 0xff).toString(16);
```

7.  pnpm 问题

之前听 zkochan 分享，我问过一个问题：不同版本的 pnpm 生成的 lock file 冲突很明显，这个除了重新 pnpm i 以外有没有更好的解决办法？在未来 lock file 的格式是否会逐渐固定下来？
大佬回答：我们确实在解决格式问题，但目前最推荐的做法还是 pnpm i。

## 3.20

1.  dvh 是视频口相对视口的单位

我们可以尝试通过 max 函数去

```css
@supports (padding: max(0px)) {
  .post {
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
  }
}
```

2.  有没有什么好的方法可以预防 pdf 文件的 xss 攻击。需求是需要预览 pdf 文件，但是使用浏览器或者 iframe 去预览 pdf 文件会执行 pdf 文件中的 js 脚本，找了几个 vue 的 pdf 预览插件都是基于 iframe 的，有没有什么别的预览插件推荐的

csp 协议 https://www.ruanyifeng.com/blog/2016/09/csp.html

3.  page lifecycle API
    page Visibility API

https://www.bookstack.cn/read/webapi-tutorial/docs-page-visibility.md

## 3.21

1.  Chrome paint Profiler

你可以使用 Chrome DevTools 中的 Paint Profiler 来重放页面的“绘图”。当你在屏幕上绘制简单元素时，文本、边框、轮廓、背景、伪元素等都是单独绘制的。对于我们大多数人来说，这一切都是瞬间出现的，我们不会多想。Paint Profiler 允许您一步一步地查看浏览器是如何绘制页面的。

制作一个新的时间线记录，选中“绘制”。
确保出现一些绘画(例如重新加载网页)
单击绘制记录。油漆记录被标记为绿色。
在 Summary 窗格中，单击“Paint Profiler”

2.  消除渐变的锯齿

抗锯齿的算法 及其一些理论的东西 https://juejin.cn/post/6844904180776173581
抗锯齿 css 中操作 https://github.com/chokcoco/iCSS/issues/209

## 3.22

1.  老哥们讨论协同文档的问题

两种方案 1. dom 堆砌 2. cavnas 绘制

超过 1000 行必卡

canvas 能支持 10 万行

那就是没做离屏渲染吧.
现在视图都是用的乐观更新的, 两份数据 , 前端一份, 后段一份, 先更新前端, 再发请求, 请求成功不管, 请求失败了回退是图, 没有协同算法 直接 ws 覆盖的 看谁的接口先返回. 冲突本来想做编辑锁, 到那时体验不好

可以考虑上个 crdt(ot 和 crdt) 现在已经很成熟了

如何设计 crdt 算法:
https://www.zxch3n.com/crdt-intro/design-crdt/

https://juejin.cn/post/7049939780477386759

2.  volta 不知道干啥的 有老哥说挺好用 可以局部切换 node 版本

## 3.23

1.  单字动画 通常会用 GSAP
    大佐的 codepen

https://codepen.io/wheatup/pen/OJoazBO??editors=1100

用图的缺陷比较明显 换个文案加个字就要出图

不过可以以字的维度出图

如果是纯英文的话 可以考虑 bitMap 字体 (字蛛也可以)

https://www.midjourney.com/home/?callbackUrl=%2Fapp%2F

bitmap fontSpider

字蛛构建流程地址 https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fyangchuansheng%2Ffont-spider-plus

## 4.4

1.  vite 模板 后面可以把这个超过来做一下 cli 配置

https://github.com/honghuangdc/soybean-admin

https://github.com/pure-admin/vue-pure-admin

## 4.7

1.  css 片段 (容器查询 / scroll snap / grid pile / aspect-ratio / @layer / logical properties)

@layer 做什么用的

2.  css 支持了 角度函数 sin cos tan asin acos atan atan2

我们可以通过 translate 进行旋转计算

```css
:root {
  --radius: 20vmin;
}

.dot {
  --angle: 30deg;
  translate:
        /* Translation on X-axis */ calc(cos(var(--angle)) * var(--radius)) /* Translation on Y-axis */
    calc(sin(var(--angle)) * var(--radius) * -1);
}
```

<!-- https://web.dev/css-trig-functions/?utm_source=CSS-Weekly&utm_campaign=Issue-544&utm_medium=email -->

3.  一个 dom 堆叠的 loading

https://codepen.io/amit_sheen/pen/JjBLaGG

## 4.13

1.  GLSL Shader : `https://codepen.io/ksenia-k/pen/poOMpzx`
2.  Colorful Theme Switch(switch 切换) : `https://codepen.io/jkantner/pen/eYPYppR`
3.  Page change(页面切换) : `https://codepen.io/konstantindenerz/pen/abaXabq`
4.  Button 超级炫 : `https://codepen.io/jh3y/pen/LYJMPBL`

5.  text-wrap:balance (stag4 阶段)
6.  working with webxr (https://www.youtube.com/playlist?list=PLpM_sf_d5YTPXeVp4cmgN_cNBj9pNTEmZ#react3dfiber)

## 4.14

1.  银行家算法 是浮点数取整常用的算法 ->

https://mp.weixin.qq.com/s/jB3384p2mi5rtpE7i4ffzQ
https://juejin.cn/post/7206871218032918565?share_token=57678acc-f269-4f72-9dfd-b016a07ad900

四舍六入五考虑，五后非零就进一，五后为零看奇偶，五前为偶应舍去，五前为奇要进一

```js
5.214≈ 5.21（ 4 小于5）
5.216≈ 为5 .22（ 6 大于5）
5.2254≈ 5.23（ 5 后面有数， 进入）
5.215≈ 5.22（ 5 后面没数， 前一位1是奇数， 进入）
5.225≈ 5.22（ 5 后面没数， 前一位2是偶数， 舍弃）
```

从统计学的角度 : ’奇进偶舍' 比 四舍五入更为精准

> 假设有 5 位储户的利息分别是 0.000、0.001、0.002、0.003、0.004，这些厘被四舍五入了，因此银行赚了。但另外 5 位储户的利息分别是 0.005、0.006、0.007、0.008、0.009，那么他们每人拿到的利息就是 0.01，银行亏了。

而根据本福特定律的相关测算，首位非零数字的出现是有概率分布的，数字越低概率越大。但非首位的数，基本符合随机分布。

那么上述 10 位储户的利息，经过四舍五入之后，银行的盈利情况如下：

```
0.000 + 0.001 + 0.002 + 0.003 + 0.004 - 0.005 - 0.004 - 0.003 - 0.002 - 0.001 = -0.005
```

银行亏了 0.005！

这怎么能行！资本家的钱是你能轻易赚走的么？

而同样的数据，用“奇进偶舍”的规则计算后，刚好俩俩抵消，盈利为 0，在这个案例几乎完美！

不过，并不是所有的案例都如此完美，但本福特定律从统计学层面已经很好的解释和规避了大部分情况下的误差。

2.  ue 和前端不通过后台直接通信的方法 -
    展示上是虚幻引擎里掏了个浏览器, 把浏览器盖在引擎画面上, 交互也是通过浏览器内嵌实现的, UE 给浏览器煮鱼监听方法, web 端调用其对应方法.

3.  位运算的有效数据范围 int32

```js
let a = Date.now();
a === ~~a; // false
```

4.  判断奇数 3&1 === 1 4 & 1 === 0;

5.  猜颜色 https://codepen.io/wheatup/pen/dygGQOO?editors=0110

6.  npm 包下载问题 如何在外层下载子目录下的 node_modules https://zhuanlan.zhihu.com/p/38040253

7.  使用 API Extractor 管理 API
    https://zhuanlan.zhihu.com/p/434565485

## 4.21

在 pnpm 的仓库的一个 issues 上 讨论了 感觉 pnpm 好像比 yarn 慢

https://github.com/pnpm/pnpm/issues/6447

1.  如果你使用独立脚本安装 PNPM，或者你安装@pnpm/exe 包，而不是 NPMJS 中的 PNPM 包(npm I -g @pnpm/exe)， PNPM 运行命令会更快。

pnpm install——frozen-lockfile 曾经比 Yarn 快，但后来变差了。我不知道是什么变化引起的，但我注意到在我们的基准测试中。

我相信 pnpm add 总是比较慢。

pnpm 在 macOS 上安装可能会慢一些，因为 pnpm 在 macOS 上使用硬链接，而 Yarn 会复制文件。复制速度更快，但使用更多的磁盘空间。Copy-on-write 副本是最好的(我们在支持它的 Linux 文件系统上使用)，但在 macOS 上我们不能使用它，因为 Node.js 不允许它(#5001)

用独立的 pnpm 运行命令似乎是最快的，但是用 npm 运行包含 pnpm 命令的脚本是最快的。

这可能是由于 Node.js 字节码或模块缓存，但我没有证据。

另外，我很好奇为什么@pnpm/exe 运行得更快。是因为@pnpm/exe 有自己的 Node.js，使它加载更少的包时执行? 以上翻译结果来自有道神经网络翻译（YNMT）· 通用场景

在 CI 上使用@pnpm/exe 确实给了我们一点提升。不幸的是，还不足以赶上纱线。

使用标准的 pnpm/action-setup:

解决方案
使用动态导入而不是顶层导入，顶层导入已经在文件 pnpm/src/pnpm 中应用了。是的，但这还不够。
将一些常量/utils 分离到较小的文件中，以防止总是导入整个模块。
不幸的是，这是一项巨大的工作，不可能很快完成。

## 5.6

1.  小程序 父子组件传递函数 this 指向有问题

```js
// parent
<
son: callback = 'callback' >

    <
    /son>

data() {
        name: 'parent'
    },
    methods: {
        callback() {
            console.log(this.name)
        }
    }

// son

data() {
    name: 'son'
}

methods: {
    done() {
        this.callback();

    }
}

// 按照上面代码 小程序中会输出 son
// h5 会输出 parent

// 且 小程序 使用 :callback='()=>callback()' 会编译报错
```

2.  小程序组件生命周期 无 onshow onload 等 只有 vue 的那几个

且 执行顺序 为 App launch -> App Show -> page onLoad -> paeg onShow -> component beforeCreate -> component created -> component mounted -> page onReady

3.  localStorage , sessionStorage 的存储限制是多大?
    《https://github.com/FrankKai/FrankKai.github.io/issues/179》

PC:

| 浏览器名称 | localStorage limit | sessionStorage limit |
| ---------- | ------------------ | -------------------- |
| chrome40   | 10mb               | 10mb                 |
| firefox 34 | 10mb               | 10mb                 |
| ie9        | 10mb               | 10mb                 |
| safari     | 10mb               | 无限大               |

Mobile:

| 浏览器名称             | localStorage limit | sessionStorage limit |
| ---------------------- | ------------------ | -------------------- |
| chrome 40 for Android  | 10mb               | 10mb                 |
| firefox 34 for Android | 10mb               | 10mb                 |
| Android Browser        | 2mb                | 无限大               |
| mobile safari 8        | 5mb                | 无限大               |
| ios webview safari 8   | 5mb                | 无限大               |

可以使用 localForage 可以突破离线存储 5MB 的限制

https://www.zhangxinxu.com/wordpress/2018/06/js-localforage-localstorage-indexdb/

他会按照 indexdb -> websql -> localstorage 来敲套

vue 生态可以使用 vif

## 5.9

1.  小程序分包 引用 submodule 内容时 如果主包没有使用可能会导致部分代码缺失

1.  TTI (Time to Interactive) 可交互时间

https://web.dev/i18n/zh/tti/

TTI 指标测量页面从开始加载到主要子资源完成渲染，并能够快速、可靠地响应用户输入所需的时间。

如需根据网页的性能跟踪计算 TTI，请执行以下步骤：

先进行 First Contentful Paint 首次内容绘制 (FCP)。

沿时间轴正向搜索时长至少为 5 秒的安静窗口，其中，安静窗口的定义为：没有长任务且不超过两个正在处理的网络 GET 请求。

沿时间轴反向搜索安静窗口之前的最后一个长任务，如果没有找到长任务，则在 FCP 步骤停止执行。

TTI 是安静窗口之前最后一个长任务的结束时间（如果没有找到长任务，则与 FCP 值相同）。

服务器端渲染 (SSR) 等技术可能会导致页面看似具备交互性（即，链接和按钮在屏幕上可见），但实际上并不能进行交互，因为主线程被阻塞或是因为控制这些元素的 JavaScript 代码尚未完成加载。

当用户尝试与看似具备交互性但实际上并非如此的页面进行交互时，他们可能会有如下两种反应：

在最好的情况下，他们会因为页面响应缓慢而感到恼火。
在最坏的情况下，他们会认为页面已损坏，因此很可能直接离开。他们甚至可能对您的品牌价值丧失信心或信任。
为了避免这个问题，请尽一切努力将 FCP 和 TTI 之间的差值降至最低。如果两者在某些情况下确实存在明显差异，请通过视觉指示器清楚表明页面上的组件还无法进行交互。

可以使用 `lighthoust` 或者 `webPageTest` 工具测量 TTI

标准: 网站普通移动硬件上进行测试时, 应该努力将可交互时间控制在 5s 以内

如果改进:

1.  缩小 JavaScript
2.  预连接到所需的来源
3.  预加载关键请求
4.  减少第三方代码的影响
5.  最小化关键请求深度
6.  减少 JavaScript 执行时间
7.  最小化主线程工作
8.  保持较低的请求数和较小的传输大小

9.  First Input Delay 首次输入延迟 (FID)

https://web.dev/fid/

FID 测量从用户第一次与页面交互（例如当他们单击链接、点按按钮或使用由 JavaScript 驱动的自定义控件）直到浏览器对交互作出响应，并实际能够开始处理事件处理程序所经过的时间。

为了提供良好的用户体验，网站应该努力将首次输入延迟设控制在 100 毫秒或以内。为了确保您能够在大部分用户的访问期间达成建议目标值，一个良好的测量阈值为页面加载的第 75 个百分位数，且该阈值同时适用于移动和桌面设备。

作为编写事件响应代码的开发者，我们通常会假定代码会在事件发生时立即运行。但作为用户，我们都常常面临相反的情况，当我们在手机上加载了一个网页并试图与网页交互，接着却因为网页没有任何反应而感到沮丧。

一般来说，发生输入延迟（又称输入延时）是因为浏览器的主线程正忙着执行其他工作，所以（还）不能响应用户。可能导致这种情况发生的一种常见原因是浏览器正忙于解析和执行由您的应用程序加载的大型 JavaScript 文件。在此过程中，浏览器不能运行任何事件侦听器，因为正在加载的 JavaScript 可能会让浏览器去执行其他工作。

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log("FID candidate:", delay, entry);
  }
}).observe({
  type: "first-input",
  buffered: true,
});
```

## 5.10

eng 01. ts 之争论

反方:
js: 1+1=2
ts: add: MathFunction<int, int>(1 as number, 1 as number) = 2 as number

虽然屎的确难吃，但是白饭谁吃得下啊，可以先为浇头，后期高级的烹饪方法可以慢慢学，总比光吃白饭要好很多

ts 上限高，下线也低，啰嗦就不说了，定义了一堆东西反而成了坑你的陷阱，自掘坟墓

主要是 ts 还会让人放松警惕，无法养成运行时类型检查和防御式编程的习惯，以为编译时不报错就万事大吉，出问题都是在线上 烦就烦在这点 所有类型都是意淫

其实恰恰相反，ts 就是你自己的一套逻辑自洽去 cover 所有的 case，而这个所有的 case 必须是你能意料到的，万一你忘了一个 case，编译肯定是没有问题的

一个参数的类型被定义了，你就不会想到去检查它是不是空，或者是别的类型

正方
: 大部分人也不需要了解什么类型体操，会给参数加类型就行了。。

这几年 ts 在帮忙发现组件使用错误/数据格式变更漏掉了某文件/自动补全上面不知道帮了我多少忙

两个开发负责的模块有共用的部分，A 开发加了个字段，B 在调用的时候没有加，代码一合一上线，就是运行时错误

然而对于业务代码来说，不需要那么多的防御式编程。。我们项目几乎没这东西 而且即使用了 js，开发也不会防御式编程 😂‘

对服务端的防御直接做到 API 层就是了 基于类型的数据校验，用 zod 足够了

如果想要自动 normalize，那就加上 ajv

根本不需要业务开发来处理。。

然后对工具函数的边界处理，这个不管用不用 ts 都会存在问题，但至少 ts 可以阻止业务开发胡乱调用（number 传成 string 这种问题完全避免掉了）

以及关于边界处理，只要团队整体用了 ts，那我直接定义 (param: string) => ... 就比在函数内部写个 if 要简单很多

空值就几种可能：开发用 as any 传进去了，或者后端返回了空；前者直接去真人快打，后者 zod 可以在 axios 中间件里面报错

2.  ajv Ajv JSON schema validator https://ajv.js.org/

一个通过 json 配置来校验参数的插件

```js
const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    foo: {
      type: "integer",
    },
    bar: {
      type: "string",
    },
  },
  required: ["foo"],
  additionalProperties: false,
};

const data = {
  foo: 1,
  bar: "abc",
};
const valid = ajv.validate(schema, data);
if (!valid) console.log(ajv.errors);
```

3.  OPPO FIND N2 Flip 且 自带的浏览器 存在问题

使用 `<input type="checkbox" />` 存在问题

```html
<input type="checkbox" : value="value" @change="change" />

<script>
  export default {
    data() {
      return {
        value: false,
      };
    },
    methods: {
      change() {
        this.$emit("update:value", !this.value);
      },
    },
  };
</script>
```

这种情况下 不论点击哪里 都会触发 `@change`

## 05.11

1.  一段文本 大小写翻转

```js
const input = "Hello World!";

const reverseCase = (txt) =>
  text.replace(/[a-z]/gi, (char) =>
    String.fromCharCode(char.charCodeAt(0) ^ 32)
  );

console.log(reverseCase(input)); // "hELLO wORLD!"
```

方法 1:

```js
const reverseCase = (txt) =>
  txt.replace(/[a-zA-Z]/g, (c) =>
    c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
  );
```

方法 2:

```js
const reverseCase = (txt) =>
  [...txt]
    .map((i) => (/[A-Z]/.test(i) ? i.toLowerCase() : i.toUpperCase()))
    .join("");
```

方法 3(最短):

```js
const reverseCase = (txt) =>
  text.replace(/[a-z]/gi, (char) =>
    String.fromCharCode(char.charCodeAt(0) ^ 32)
  );
```

2.

```ts
type res = never extends 1 ? 1 : 2; // 1
type Test<T> = T extends 1 ? 1 : 2; //never
type res2 = Test<never>;
```

非泛型的时候 如果 extends 的是 any 或者 unknow 或者 check 部分是 extends 部分的子类型 直接返回 returnType 的类型

当类型参数是 never 出现在条件类型左边 直接返回 never

## 5.15

对于小程序自动化测试 - 尝试

1.  uni-app 多端处理的不是特别理想 文档内容特别差 按文档流程无法完成测试代码编写

2.  微信小程序可以使用其自动化测试录制功能 可以录制部分流程 做自动化测试

3.  注意存在的问题是 公司小程序依赖不同账号, 依赖后台返回的接口状态 一个账号无法满足需求

找出数组中所有出现奇数次的元素

```js
const input = ["A", "B", "B", "C", "A", "B", "B", "C", "D", "A", "B", "B", "C"];

const filterOddOccurrance = (arr = {});

console.log(filterOddOccurrance(input));
```

方案一:

```js
const filterOdd = (arr) => {
  const a = [];
  arr.forEach((item) => {
    a.includes(item) ? a.splice(a.indexOf(item), 1) : a.push(item);
  });
  return;
};
```

方案二:

```js
const filterOdd = (arr) => {
  const m = new Map();
  arr.forEach((i) => (!m.has(i) ? m.set(i, 1) : m.delete(i)));
  return m.keys();
};
```

方案三:

```js
const filterOdd = (arr) =>
  Object.keys((arr = arr.group((e) => e))).filter((k) => arr[k].length & 1);
```

## 5.24

输出字节码

node --print-bytecode --print-bytecode-filter=test2 test.js

```js
function test1() {
  let i = 0;
  while (i < 10) {
    console.log(i);
    i++;
  }
}

function test2() {
  for (let i = 0; i < 10; i++) {
    console.log(i);
  }
}
```

## 06.08

1.  css @scope 支持

```html
<style>
  @scope (.blue) {
    button {
      background-color: blue;
    }
  }

  @scope (.green) {
    button {
      background-color: green;
    }
  }

  @scope (.red) {
    button {
      background-color: red;
    }
  }
</style>
<div class="red">
  <div class="green">
    <div class="blue">
      <button>Click</button>
    </div>
  </div>
</div>
```

如上代码 button 颜色为 blue

也可以设置边界

第二个选择器设置一个下边界——即从这一点停止样式。

```html
<style>
  @scope (.component) to (.content) {
    p {
      color: red;
    }
  }
</style>
<div class="component">
  <p>In scope.</p>
  <div class="content">
    <p>Out of scope.</p>
  </div>
</div>
```

2.  matches API

Element 接口的 matches()方法测试指定的 CSS 选择器是否选择该元素。

比如 :active : link 或者其他属性选择器

3.  Dialog

全局 Dialog 标签

```html
<form method="dialog">
    <h3></h3>
    <button>关闭</button>
</form>
</dialog>
<button id="btn">显示DIalog</button>
<script>
    const btn = document.querySelector('#btn')
    const dialog = document.querySelector('dialog');

    btn.onclick = () => {
        dialog.show();
        // 或者调用
        dialog.showModal();
        // 通过这个方法打开的弹窗，会自带一个半透明的背景，并且完全水平垂直居中

    }
</script>

<style>

    /* 可以通过来生成顶层 */

    dialog::backdrop {
        background: rgba(255,0,0,.25);
    }

    /* 如果希望打开弹窗有动画，可以自定义默认样式，通过visibility的方式实现隐藏显示 */

    dialog[open] {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
    }

</style>


```

4.  #top-layer 层级

JS 也无法模拟的系统级新特性

解决的问题 ->
一些弹框写在了某些容器下 采用 fixed 定位 但是由于父容器使用了 transform 会导致失效 ,

在以前，或者说很多框架中，都会想办法把弹窗放到最外层的 body 下，这样就不受影响了，比如下面是 vue3 中的处理方式

```html
<div>
  <Teleport to="body">
    <!--将子内容传送到body下-->
    <dialog></dialog>
  </Teleport>
</div>
```

虽然 dialog 仍然在原来位置上，但真正渲染到了一个#top-layer 的层级上，这个层级非常特殊，已经超越了 html 文档流，可以说是独一档的存在，这样，无论的 dialog 在什么位置，最后渲染的地方其实都在#top-layer 层级上，自然也不会被父容器裁剪被隐藏了

5.

popover 是一个全局属性。给任意元素添加 popover 以后，它就变成了一个悬浮层。
popover 属性有两个值，默认是 auto 自动模式，支持默认行为，比如点击空白关闭，键盘 Esc 关闭
popover 属性还支持 manual 手动模式，也就是没有以上默认行为
控制 popover 有两种方式，分别是声明式和命令式
声明式是指通过 HTML 属性来实现点击交互
可以通过 popovertarget 属性将悬浮层的 id 和按钮相关联，这样就能通过按钮打开悬浮层了
还可以通过 popovertargetaction 属性来设置点击行为，有 show、hide、toggle3 种方式
命令式是指通过 JS API 来实现对悬浮层的控制，相比声明式而言更加灵活
控制悬浮层的方法有 showPopover、hidePopover、togglePopover
CSS 伪类:open 可以区分悬浮层的打开状态
JS 可以通过 matches(':open')来获取悬浮层的打开状态
JS 还可以通过监听 toggle 事件来获取悬浮层的打开状态，方式是 event.newState
相比传统实现，原生 popover 最大的优势是支持顶层特性

## 7.25

终于不是很忙碌

1. TS 内置函数 Awaited

正常我们定义一个函数接口，在`api.ts`定义如下

```ts
// api.ts
interface fetchDataReturn {
  name: string;
  age: number;
  sex: boolean;
}

function fetchData(): Promise<fetchDataReturn> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "1",
        age: 1,
        sex: false,
      });
    });
  });
}
```

在调用的地方

```ts
import { fetchDataReturn, fetchData } from "api";

async function process() {
  const result: fetchDataReturn = await fetchData();
  console.log(result);
}
process();
```

Awaited 这个内置函数可以帮助我们不需要引入 `return` 类型就可以 获取到 data

```ts
async function process() {
  const result: Awaited<ReturnType<typeof fetchData>> = await fetchData();
  console.log(result); // Output: "Data fetched successfully!"
}
```

2. vite 4.4 更新 更快的 css 构建

3. 2023 css state https://survey.devographics.com/en-US/survey/state-of-css/2023/outline/2 做个分享吧

## 7.26

1. 一个 blend-mode 用的特别好的案例

https://codepen.io/tommiehansen/pen/BaGyVVy

## 7.28

1. code golf

构造一个数组 3 的倍数 值为 fizz 5 的倍数 值为 buzz 同时是 3 和 5 值为 fizzbuzz

```js
[...Array(100)].map((_, i) =>
  ++i % 3 ? i : "fizz" + (i % 5 ? "" : "buzz") || i
);
```

2. code golf

https://www.geeksforgeeks.org/code-golfing-in-javascript/?ref=ml_lbp

3. grid + clip-path 实现 GTA5 头图

## 7.31

1. http3 -

h3 是这几年才出来的，而且它本质是 HTTP，不一定适用于所有场景（比如推拉流 - 不是， 他握手还是 http， 然后使用 alt-svc 替换到 udp 协议

那也可以直接用 quic , 不就得了 , quic 本身不就是仿的 tcp，然后解决了 tcp 的问题的协议

等于是个奇葩产品

quic 本身在某些地区可能被墙 因为之前墙都是基于 TCP 的阻断，后来就有人想出来用 quic 翻

udp 国内 qos 严重

h3 = quic + http quic 里包含了 tls 所有 h3 本身就是 https 的

那 h3 可以用来传输 rtmp 数据吗 🤔

那有人还用 websocket 翻呢，websocket 被禁了吗 - 对，百度云加速已经禁止转发 ws 协议了

不过 vless 的 ws 协议本身就容易被识别

以前我是用百度云加速转发，因为它跟 cloudflare 有合作；被禁了之后只能用 cloudflare 自己的 IP 了，慢死

之所以不直接暴露服务器，因为容易被直接禁

quic 是 h3 的底层协议

对，一些新技术国内部分地区用不了，例如 ESNI（因为这可以让运营商无法知道你要去哪儿；不过后来这协议也被 ECH 代替了

quic 作为一个新协议，并且不容易被阻断，那直接一刀切

一刀切那就都别用 h3 了呗

除非哪天工信部大力推动 h3 标准落地

我认为顶多阻断跨境 h3 流量

## 8.2

1. 发现一个图片服务

https://fastly.picsum.photos/id/1015/1920/1080.jpg

2. 如果一个元素行内设置了`color：red !important`

原本内容

```html
<style>
  .wrap {
    display: block;
    position: absolute;
    width: fit-content;
    height: fit-content;
    inset: 0;
    margin: auto;
  }

  .wrap {
    /*  请开始你的表演 */
  }
</style>

<div class="wrap" style="color:red!important">把我变成蓝色</div>
```

- 方案一

```css
.wrap {
  -webkit-text-fill-color: blue;
}
```

- 方案二

```css
.wrap {
  filter: hue-rotate(240deg);
}
```

- 方案三

```css
.wrap:first-line {
  color: blue;
}
```

- 方案四

```css
.wrap {
  background: #fff;
}

.wrap::after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  background-color: blue;
  mix-blend-mode: color;
}
```

- 方案五

```css
.wrap::after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  backdrop-filter: hue-rotate(240deg);
}
```

## 08.08

1. 在看 vue 源码的时候注意到一个细节，就是初始化一个对象的时候常常用 `Object.create(null)` 。而不是一个空对象

MDN 对于其的定义是

```js
Object.create(proto, [propertiesObject]);
```

proto:新创建对象的原型对象

propertiesObject:可选。要添加到新对象的可枚举（新添加的属性是其自身的属性，而不是其原型链上的属性）的属性。

看下 Object.create(null) 的使用场景

首先看下 Object.create(null) 和 {} 创建的对象的区别

![](https://pic.imgdb.cn/item/64d20dbe1ddac507cc00e686.jpg)

从上图可以看到，使用 create 创建的对象，没有任何属性，显示 No properties，我们可以把它当作一个非常纯净的 map 来使用，我们可以自己定义 hasOwnProperty、toString 方法，不管是有意还是不小心，我们完全不必担心会将原型链上的同名方法覆盖掉。

```js
//Demo1:
var a= {...省略很多属性和方法...};
//如果想要检查a是否存在一个名为toString的属性，你必须像下面这样进行检查：
if(Object.prototype.hasOwnProperty.call(a,'toString')){
    ...
}
//为什么不能直接用a.hasOwnProperty('toString')?因为你可能给a添加了一个自定义的hasOwnProperty
//你无法使用下面这种方式来进行判断,因为原型上的toString方法是存在的：
if(a.toString){}

//Demo2:
var a=Object.create(null)
//你可以直接使用下面这种方式判断，因为存在的属性，都将定义在a上面，除非手动指定原型：
if(a.toString){}

```

另一个使用 create(null)的理由是，在我们使用 for..in 循环的时候会遍历对象原型链上的属性，使用 create(null)就不必再对属性进行检查了，当然，我们也可以直接使用 Object.keys[]。

2. 微信小程序 如果用户点击了授权 不在询问 想要删除 可以扫开发工具 -> 多账户调试 -> 添加测试号 -> 清楚授权数据

3. :is :where 其中 where 中有一个非法就导致全部失效。

## 08.09

1. 一个函数的 length 表示函数的入参长度

```js
const a = (m, n) => {};
a.length = 2;

const b = (x, y, z) => {};
b.length = 3;
```

## 08.10

疯狂星期四

```js
add[1][2][3] + 4; //10
add[1][-1][3] * 2 + // 6
  add[1][3]; // 4
```

```js
const makeProxy = (total = 0) =>
  new Proxy([], {
    get(_, prop) {
      if (prop === Symbol.toPrimitive) {
        return () => total;
      }

      return makeProxy(total + +prop);
    },
  });

const add = makeProxy();
```

## 08.15

1. https://codepen.io/wheatup/pen/GRwVwdV/fce68f6eb87f3aefa5d6ff9886194529?editors=1100 蛇形增加减少
2. https://codepen.io/wheatup/pen/poQMdKP/365119e821503f753fb778db16b54896?editors=0110 弹球

## 08.16

1. vue v-model 使用中文输入法不触发 input 事件

## 08.17

1. emoji 在 mac1080p13-18px 都是 18px

## 08.23

1. new Date('2023-08-25') 和 new Date('2023/08/25') 输出的结果不一致

```js
new Date("2023/08/23");
// Wed Aug 23 2023 00:00:00 GMT+0800 (中国标准时间)
new Date("2023-08-23");
// Wed Aug 23 2023 08:00:00 GMT+0800 (中国标准时间)
```

这是因为在 JavaScript 中，`Date`构造函数接受不同格式的日期字符串，并且解析方式会有所不同。

当你使用`new Date("2023/08/22")`时，日期字符串中使用的是斜杠（`/`）作为日期分隔符。根据 ECMAScript 规范，这种格式被解释为使用本地时区的日期和时间。因此，`new Date("2023/08/22")`将返回一个表示本地时区中指定日期的`Date`对象。

而当你使用`new Date("2023-08-22")`时，日期字符串中使用的是连字符（`-`）作为日期分隔符。根据 ECMAScript 规范，这种格式被解释为使用协调世界时（UTC）的日期和时间。因此，`new Date("2023-08-22")`将返回一个表示 UTC 中指定日期的`Date`对象。

由于本地时区和 UTC 之间存在时区偏移，因此当你使用不同的日期分隔符时，`Date`对象的返回值会有所不同。

如果你希望始终按照特定的时区解析日期，可以使用其他方式指定日期字符串，例如使用 ISO 8601 格式（例如："2023-08-22T00:00:00Z"表示 UTC 时间）或者使用特定时区的日期库。

然后 你在前面放个空格 又不一样了

```js
new Date(" 2023-08-23");
// Wed Aug 23 2023 00:00:00 GMT+0800 (中国标准时间)
new Date("2023-08-23");
// Wed Aug 23 2023 08:00:00 GMT+0800 (中国标准时间)
```

## 08.24

1. 疯狂星期四

生成 1-100 的 FizzBuzz 数组
条件 1：禁止出现字面量（直接定义[1, 2, "Fizz", ...]）
条件 2：禁止出现任何值比较和条件语句（if、while、switch、三元表达式、==、!=、&&、||等）
条件 3（可选）：一行代码

这种无条件式一般在计算机图形学和 shader 里面比较常用，因为值判断比较耗性能 判断使用 object lookup 模拟

```js
Array.from(
  { length: 100 },
  (_, i) => [++i, "Fizz", "Buzz", "FizzBuzz"][!(i % 3) + !(i % 5) * 2]
);
```

## 08.30

1. 为什么这段代码在 chrome 中不符合事件循环机制

```js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

const intervalId = setInterval(() => {
  console.log(3);
}, 0);

setTimeout(() => {
  console.log(10);
  clearInterval(intervalId);
}, 0);
```

在 Chrome 浏览器中不会输出 3；在 Node 环境或者火狐浏览器中可以输出 3。

按照事件循环机制，应该是 3 个宏任务依次进入宏任务队列排队，那应该是先输出一次 3 再清除 Interval 才对，为什么 Chrome 环境输出结果是反常的？

原因是在目前的 Chrome 里 setInterval 的最小延迟时间不是 0，而是 1，即便你写了 0，Chrome 也会改成 1，而 setTimeout 没有这个限制，

所以 setTimeout 回调会先执行，也就执行了 clearInterval，所以不会打印 3。很久以前 setTimeout 和 setInterval 的 timeout 都有最小值 1ms 的限制，

从 2014 年 Chrome 就想让 setTimeout 允许真正的 0ms，但失败了，因为测试代码改动太多。

在命令行关掉这个特性 --disable-features=SetTimeoutWithoutClamp，setTimeout 就又延迟 1ms 执行了

2. echarts 的截图测试

echarts 的 visual test 还能录制 / 回放操作， 不是用的 rrweb

## 08.31

疯狂星期四

```js
const getCurrentFunctionName = () => {
  // 开始你的表演
};

const foo = () => {
  console.log(getCurrentFunctionName());
};

function bar() {
  console.log(getCurrentFunctionName());
}

foo(); // foo
bar(); // bar
```

答案：

```js
const getCurrentFunctionName = () => {
  const error = new Error();
  const stackLines = error.stack.split("\n").slice(2);
  const callerLine = stacklines[0].trim();
  return callerLine.match(/at (\S+)/)[1];
};

const getCurrentFunctionName = () =>
  new Error().stack.split("\n")[2].match(/at(.*)\(/[1]);
```

## 09.01

1. C10K 问题 :

Client 10000 问题 即 在同时连接到服务器的客户端数量超过 10000 个的环境中，即便硬件性能足够，依然无法正常提供服务，简而言之，就是单机 1 万个并发连接问题。

2. Discord 为什么从 go 迁移到 rust

https://discord.com/blog/why-discord-is-switching-from-go-to-rust

## 09.05

1. 手写 call

```js
Function.prototype.myCall = function (context) {
  if (typeof this !== "function") {
    console.error("type error");
  }
  let args = [...arguments].slice(1);
  let result = null;
  context = context || window;
  context.fn = this;
  result = context.fn(...args);
  delete context.fn;
  return result;
};
```

疑问的点在于,为什么要对`this 做类型约束`

答：

首先 ES 规范的第二条 就是这个

> 1.Let func be the this value.
> 2.If IsCallable(func) is false, throw a TypeError exception
> 3.Perform PrepareForTailCall0.
> 4.Return ? Call(func, thisArg, args).

call 就是个普通函数，不管他写在哪里 , 只要 this 可以被改变， 就不能依赖 this

因为 js 没有类型限制，所以肯定要做各种防御式编程， 规范那么做说明可以通过现有范式达到这个场景

1. canvas 相关库性能比较

https://benchmarks.slaylines.io/webgl.html

结论：在渲染 32000 个 DOM 的场景下 WebGL 帧率最稳 其次都是

## 09.06

1. web-worker 下载内容方案

https://juejin.cn/post/7273803674789953575

## 09.07

1. 疯狂星期四

```js
let foo = //
if(!foo){
    console.log(foo + 1) //2
}
```

答案

```js
let foo = document.all;
foo[Symbol.toPrimitive] = () => 1;
```

2. 疯狂星期四

```js
let foo = // 开始你的表演
  console.log(typeof foo); // number
console.log(1 + foo === 1); // false
console.log(2 + foo === 2); // true
```

答案：Number.EPSILON

解析：
1 的指数部分是 1023，尾数部分是 0，所以被解释为 2^(1023-1023) _ (1+0) = 1；
Number.EPSILON 的指数部分是 971，尾数部分是 0，所以被解释为 2^(971-1023) _ (1+0) = 2^(-52)；
在做加法的时候，1 的指数部分较大，所以先把 Number.EPSILON 转换成 2^(1023-1023) _ 2^(-52)，这在二进制中刚好是 0.00...01（尾数部分最后一位是 1），所以加起来刚好是 1 + 0.00...01，值发生了变化；
但如果第一个数字是 2，被解释为 2^(1024-1023) _ (1+0)，在做加法时 Number.EPSILON 就会被转换为 2^(1024-1023) \* 2^(-53)，但尾数一共就 52 位，所以最后一位 1 被丢弃了，结果就没有发生变化

## 09.10

Google 开发者大会 2023 web 相关观后感

1. WebAssembly 可以把其他语言编写的代码放到 web 平台来使用。
2. Web 将成为重要的 AI 应用平台，而其根本是因为 GPU，我们所用的设备本身就携带了 GPU 相关能力，只是 Web 没有权限去使用。 所以 WebGPU 为此而生，可以充分发挥 GPU 能力，强化本地算力。借助 WebGPU 应用可以同时使用云端和本地的能力。性能上 tensorFlow 在 webGPU 上运行比之前快 100 倍
   ![](https://pic.imgdb.cn/item/64fd98a9661c6c8e54361469.jpg)

WebGPU 比 WebGL 快 3 倍，本身 WebGL 就是目前 web 端运行效率最高的方式了。 3. FID

## 09.11

1.


## 09.14

1. 获取伪类的宽高

getComputedStyle('div',':before')


## 09.21

1. nest 的问题

sql 的执行流程

mysql 的索引优化

TCP 的 timewait



## 09.22
## 09.23


LCP：

UV / PV  
优化LCP资源加载延迟 1.资源预加载。 2. 服务端渲染。

vscode 插件？ 分析火焰图/

升级依赖带来的问题 测试需要覆盖？ 如果去评估升级带来的影响？

setEffect false 没有引入webpack会删除

拆的足够小 并行加载问题》


clickhouse 打点自动清理

### 内存泄漏

## 09.25

1. Chrome的自动播放政策很简单：

+ 静音自动播放总是允许的。
+ 在下列情况下允许使用声音自动播放：
  -  用户已经与域进行了交互（点击，tap等）。
  -  在桌面上，用户的媒体参与指数阈值(MEI)已被越过，这意味着用户以前播放带有声音的视频。
  -  在移动设备上，用户已将该网站添加到主屏幕。
  -  顶部框架可以将自动播放权限授予其iframe以允许自动播放声音。



MEI衡量个人在网站上消费媒体的倾向。Chrome 目前的方法是访问每个来源的重要媒体播放事件的比率：

媒体消耗（音频/视频）必须大于7秒。
音频必须存在并取消静音。
视频选项卡处于活动状态。
视频大小（以像素为单位）必须大于200x140。
因此，Chrome会计算媒体参与度分数，该分数在定期播放媒体的网站上最高。足够高时，媒体播放只允许在桌面上自动播放。MEI是谷歌自动播放策略的一部分。它是一个算法，参考了媒体内容的持续时间、浏览器标签页是否活动、活动标签页视频的大小这一系列元素。不过也正因此，开发者难以在所有的网页上都测试这一算法的效果。

用户的MEI位于chrome://media-engagement/内部页面


开发者开关
作为开发者，您可能需要在本地更改Chrome浏览器自动播放政策行为，以根据用户的参与情况测试您的网站。

您可以决定通过将Chrome标志“自动播放策略”设置为“无需用户手势”来完全禁用自动播放策略 chrome://flags/#autoplay-policy。这样您就可以测试您的网站，就好像用户与您的网站保持紧密联系一样，并且始终允许播放自动播放。
您也可以决定禁止使用MEI以及默认情况下全新MEI获得播放自动播放的网站是否允许新用户使用，从而决定禁止播放自动播放。这可以用两个来完成 内部开关用chrome.exe --disable-features=PreloadMediaEngagementData,AutoplayIgnoreWebAudio, MediaEngagementBypassAutoplayPolicies


## 10.07

1. 快速生成目录结构(mac)

```
brew install tree

tree
```

相关参数说明:<https://www.runoob.com/linux/linux-comm-tree.html>


## 10.08

1. git reabse 教程 

https://medium.com/starbugs/use-git-interactive-rebase-to-organize-commits-85e692b46dd

## 10.18

1. ARIA


https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA


## 10.23

疯狂星期一？

1. 正则题

![](https://pic.imgdb.cn/item/65363ab7c458853aef3c4405.jpg)

使用正则替换，将所有偶数位的大写字母替换为*：

替换前：
ABCDefghIJkLmnoPqrstUvwxYZ
替换后：
A*C*efghI*k*mno*qrstUvwxY*

``` js
'ABCDefghIJkLmnoPqrstUvwxYz'.replace(/(?<=^.(..)*)[A-Z]/g,'*')
```

``` js
.[^A-Z](*SKIP)(*F)|.\K.
```

2. 正则题

``` html
在一个以逗号分割的字符串中，替换每组字符串中偶数位的大写字母为*

替换前：
AB,CDefghI,JKLm,noPQRstU,vwxYZ

替换后：
A*,C*efghI,J*Lm,noP*Rst*,vwx*Z

```


``` js
(?:,|.[^A-Z])(*SKIP)(*F)|.\K.
```


## 10.27

1. 疯狂星期5

``` js
const data = [1, 'Hello', 2, NaN, 43.23, -0, undefined];

function getIndex(array, element) {
  return array.findIndex(e=>[e].includes(element))
    // write your code here
}

console.log(getIndex(data, 1));          // 0
console.log(getIndex(data, 'Hello'));    // 1
console.log(getIndex(data, NaN));        // 3
console.log(getIndex(data, 0));          // 5
console.log(getIndex(data, undefined));  // 6
```


2. 如何判断 +0 与 -0

通常情况下 `+0 === -0` 是true的

``` js
// 我们可以使用 Object.is(+0,-0)来操作
Object.is(+0,-0) // false

// 其次我们可以使用 1/0  1/-0
function isNegativeZero(x){
  return -Infinity === 1/x;
}

// 使用Math.sign
function isNegativeZero(x){
  return Math.sign(1/x) < 0;
} 

// 使用toLocalString()
function isNegativeZero(x){
  return '-0' === x.toLocaleString();
}

// 使用buffer？
function doubleToLongBits(d){
  let buffer = new ArrayBuffer(8);
  let view = new DataView(Buffer);
  view.setFloat64(0,d);
  let hi = view.getUint32(0);
  let lo = view.getUint32(4);
  return BigInt(hi) << 32n | BigInt(lo);
}
```


## 10.30

1. Coco在做语雀插件的时候发现的，通过控制台DOM编辑语雀的元素内容，再次focus的时候会重制回去。

``` js
const targetElement = document.getElementById("g-container");
// 记录初始数据
let cacheInitData = '';
// 数据复位标志位
let data_fixed_flag = false; 
// 复位缓存对象
let cacheObservingObject = null;
let cacheContainer = null;
let cacheData = '';

function eventBind() {
    targetElement.addEventListener('focus', (e) => {
        if (data_fixed_flag) {
            cacheContainer.innerText = cacheData;
            cacheObservingObject.disconnect();
            observeElementChanges(targetElement);
            data_fixed_flag = false;
        }
    });
}

function observeElementChanges(element) {
    const changes = []; // 存储变化的数组
    const targetElementCache = element.innerText;

    // 缓存每次的初始数据
    cacheInitData = targetElementCache
    
    // 创建 MutationObserver 实例
    const observer = new MutationObserver((mutationsList, observer) => {
        // 检查当前是否存在焦点
        // const hasFocus = targetElement === document.activeElement;
        mutationsList.forEach((mutation) => {
            console.log('observer', observer);
            const { type, target, addedNodes, removedNodes } = mutation;
            let realtimeText = "";
            
            if (type === "characterData") {
                realtimeText = target.data;
            }
            
            const change = {
                type,
                target,
                addedNodes: [...addedNodes],
                removedNodes: [...removedNodes],
                realtimeText,
                activeElement: document.activeElement
            };
            changes.push(change);
        });
        console.log("changes", changes);
        
        let isFixed = false;
        let container = null;
        
        for (let i = changes.length - 1; i >= 0; i--) {
            const item = changes[i];
            console.log('i', i);
            if (item.activeElement === element) {
                if (isFixed) {
                    cacheData = item.realtimeText;
                }
                break;
            } else {
                if (!isFixed) {
                    isFixed = true;
                    container = item.target.nodeType === 3 ? item.target.parentElement : item.target;
                    cacheContainer = container;
                    data_fixed_flag = true;
                }
            }
        }
        
        if (data_fixed_flag && cacheData === '') {
            cacheData = cacheInitData;
        }
        
        cacheObservingObject = observer;
    });

    // 配置 MutationObserver
    const config = { childList: true, subtree: true, characterData: true };

    // 开始观察元素的变化
    observer.observe(element, config);
    eventBind();
    
    // 返回停止观察并返回变化数组的函数
    return () => {
        observer.disconnect();
        return changes;
    };
}

observeElementChanges(targetElement);
```

## 11.01 

1. 冷知识：1. 不是所有元素都有伪元素，譬如 iframe、input、img 等替换元素是没有伪元素的 2. 当 img 触发了元素的 onerror 事件时（或者理解为 img src 内的资源替换失败），此状态下的 img 可以添加伪元素

2. 通过零宽字符设置空title   


我们如果设置`document.title = ''` 这样浏览器的title会显示当前页面地址，如果我们想设置空标题，需要设置`document.title = '\u200b'`，

我们如果需要过滤可以使用
``` js
newStr = str.replace(/[\u200b-\u200f\uFEFF\u202a-\u202e]/g, "");
```

如果要提取可以使用
``` js
newStr = str.replace(/[^\u200b-\u200f\uFEFF\u202a-\u202e]/g, "");
```

## 11.02


1. prefers-reduced-transparency

从chrome 118开始 此媒体查询可用。 例如透界面会导致头疼，或者各类视力缺陷导致视觉困难，各类操作系统也支持了降低UI透明度的选项

![](https://pic.imgdb.cn/item/65434a31c458853aef282a0e.jpg)


``` css
.example {
  --opacity: .5;

  background: hsl(200 100% 50% / var(--opacity));

  @media (prefers-reduced-transparency: reduce) {
    --opacity: .95;
  }
}
```

在前面的代码示例中，CSS 变量保存一个不透明度值，然后50%与 HSL 一起使用该值来创建半透明的蓝色背景。嵌套媒体查询检查用户对降低透明度的偏好，如果为 true，则将不透明度变量调整为，95%一个几乎不透明的不透明度值。

我们在开发过程中如果遇到相关需求 可以使用 

![](https://pic.imgdb.cn/item/65434dfac458853aef32f061.jpg)



2. 几个新增的 比较偏门的 CSS 函数

+  light-dark();
比如我们背景颜色 希望在普通模式下是白色 暗黑模式下是黑

我们需要这么写

```css
:root {
  color-scheme: light dark;
  --text-color: #333; /* Value for Light Mode */
}

@media (prefers-color-scheme: dark) {
  --text-color: #ccc; /* Value for Dark Mode */
}


/* 
  如果我们使用 light-dark();
*/

:root {
  color-scheme: light dark;
  --text-color: light-dark(#333, #ccc);
}
```


+ xywh()

这将创建一个“基本形状”，该形状从 X、Y 坐标开始，然后具有指定的宽度和高度。有点酷。用于使用基本形状的地方：

``` css
.thing-that-is-clipped {
  clip-path: xywh(0 0 100% 100% round 5px);

  offset-path: xywh(0 20px 100% calc(100% - 20px));
}
```


+ round()


默认情况下，它舍入到最接近的值，但可以是上或下，也可以是奇异的到零。但更重要的是，它有一个“舍入间隔”，不仅意味着最接近的整数，还意味着任何整数的间隔。

``` css
#drag{
  left:round(1px,20px)
}

```




3. 匹配HTML 里是否有某个属性 

![](https://pic.imgdb.cn/item/6543560ec458853aef49d599.jpg)

![](https://pic.imgdb.cn/item/65435716c458853aef4cc634.jpg)


4. inputmode

inputmode 全局属性 是一个枚举属性，它提供了用户在编辑元素或其内容时可能输入的数据类型的提示 

比如我们使用`tpye=text` 却希望弹出的是数字键盘 就可以加一个`inputmode='number'` 来实现


5. css函数 rem() 

在css中我们使用 rem 计算余数 

``` css
line-height: rem(9, 4); /* 1 */
line-height: rem(5, 4.1); /* 0.9 */
line-height: rem(1003 % 5); /* 3 */
```




## 11.02 STATE of HTML 2023


1. 我们可以通过input.showPicker 吊起原生的时间选择器 颜色选择器等等

``` html
<input id="dateInput" type="date">
<button onclick="dateInput.showPicker()">Select date</button>
```


2. DOM HTML 处理的方法

+ Element.innerHTML
+ Element.innerTEXT
+ element.insertAdjacentHTML(position, text);
+ DOMParser


insertAdjanceHTML position 位置具体
``` 
<!-- beforebegin -->
<p>
  <!-- afterbegin -->
  foo
  <!-- beforeend -->
</p>
<!-- afterend -->
```


``` js

const string = `<div>lsdjalsdlj</div>`
var doc = new DOMParser().parseFromString(string, 'text/xml');


var d1 = document.getElementById("one");
d1.insertAdjacentHTML("afterend", '<div id="two">two</div>');
```



## 11.03 继续 STATE of HTML 2023

1. inert 惰性的

防止click用户单击元素时触发该事件。（可以完美替换pointer-event:none）
focus通过阻止元素获得焦点来阻止引发事件。（之前是通过tabIndex 来避免的）
通过将元素及其内容从辅助功能树中排除来隐藏辅助技术。


**思考**： 可以进来默认设置inert然后，接口请求成功后再置为false

2. loading="lazy"
 
loading元素上的属性（`<img>`或loading上的属性`<iframe>`）可用于指示浏览器推迟加载屏幕外的图像/iframe，直到用户滚动到它们附近。

你可以检查元素上`complete`属性来判断是否加载成功


3. scrset 和 sizes属性

``` html
<img
  srcset="fairy-med.jpg 480w, fairy-large.jpg 800w"
  sizes="(max-width: 600px) 480px, 800px"
  src="fairy-large.jpg"
  alt="Elva dressed as a fairy" />
```

设置不同分辨率的图片展示 

4. dns-prefetch

仅对跨源dns-prefetch域的 DNS 查找有效，因此请避免使用它来指向您的站点或域。这是因为当浏览器看到提示时，您网站域背后的 IP 已经被解析。

其次，还可以使用HTTP 链接字段dns-prefetch将（和其他资源提示）指定为HTTP 标头：

```
Link: <https://fonts.googleapis.com/>; rel=dns-prefetch
```
第三，考虑dns-prefetch与preconnect提示配对。虽然dns-prefetch仅执行 DNS 查找，但preconnect建立与服务器的连接。此过程包括 DNS 解析、建立 TCP 连接以及执行TLS握手（如果站点通过 HTTPS 提供服务）。将两者结合起来可以进一步减少跨源请求的感知延迟。您可以像这样安全地一起使用它们：

```html
<link rel="preconnect" href="https://fonts.googleapis.com/" crossorigin />
<link rel="dns-prefetch" href="https://fonts.googleapis.com/" />
```



5. fetchpriority 优先级

设置 `fetchpriority='high'` 相比于其他图像优先获取， `fetchpriority='low'` 以较低优先级获取图像

6. Web组件 / ShadowDom

Web组件的关键功能是能够创建自定义元素

自定义的内置元素继承自标准 HTML 元素，例如HTMLImageElement或HTMLParagraphElement。它们的实现定制了标准元素的行为。

比如P元素

``` js
class WordCount extends HTMLParagraphElement {
  constructor() {
    super();
  }
  // Element functionality written in here
}
```
它可以定义以下的声明周期
connectedCallback()：每次将元素添加到文档时调用。规范建议，开发人员应尽可能在此回调中而不是构造函数中实现自定义元素设置。
disconnectedCallback()：每次从文档中删除元素时调用。
adoptedCallback()：每次将元素移动到新文档时调用。
attributeChangedCallback()：在更改、添加、删除或替换属性时调用。有关此回调的更多详细信息，请参阅响应属性更改。


MDN官方的例子：
``` js
class PopupInfo extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create spans
    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    const icon = document.createElement("span");
    icon.setAttribute("class", "icon");
    icon.setAttribute("tabindex", 0);

    const info = document.createElement("span");
    info.setAttribute("class", "info");

    // Take attribute content and put it inside the info span
    const text = this.getAttribute("data-text");
    info.textContent = text;

    // Insert icon
    let imgUrl;
    if (this.hasAttribute("img")) {
      imgUrl = this.getAttribute("img");
    } else {
      imgUrl = "img/default.png";
    }

    const img = document.createElement("img");
    img.src = imgUrl;
    icon.appendChild(img);

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");
    console.log(style.isConnected);

    style.textContent = `
      .wrapper {
        position: relative;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }

      img {
        width: 1.2rem;
      }

      .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    console.log(style.isConnected);
    shadow.appendChild(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(info);
  }
}

customElements.define("popup-info", PopupInfo);
```

7. 无障碍

语义化标签：main nav aside header footer section 
可聚焦属性:  tabindex
聚焦小组: focusgroup 可以把一组元素放到单个焦点下
制作网站时考虑: 低视力 色觉异常 行动障碍 前庭失调 学习障碍 认知障碍 听力障碍
常规无障碍策略：描述性alt文本 / 跳转到内容的链接 / 信息层次结构 / 有意义的文本链接 / 表单控制标签 / 可视焦点环 /  不只依赖指针 / 足够对比度 / prefers-reduce-motion / prefers-contrast 



## 11.06 

1. 输入框效果 限制输入数字且小数点后两位
https://codepen.io/wheatup/pen/bGzgdqP/86e3dd8c2abeb1ed288b0062135202ca



## 11.07

1.  chrome 115 全量了 UA reduction 功能，判断机型不能再用 UA 了


## 11.08

1. chrome 120 bug 

filter: drop-shadow 叠加transform 算出来的布局不太对，表现上就是这样；原因等有空再看

2. 一行css 使chrome 崩溃 

width: atan2(calc(100cqw - 0px), 1px)

主要是atan2 calc cqw 同时存在 就会崩溃

REX大佬: 
出问题的 CSS，atan2 的两个参数分别是 calc(100cqw - 0px) 和 1px，它俩分别是 kUnknown 和 kPixels 类型；在执行 ComputeValueInCanonicalUnit 之后，1px 被转换成 1，但那个 calc 还是一个脏值，于是在获取它的 .value() 时 abseil 库挂掉了


![](https://pic.imgdb.cn/item/654b71a6c458853aefeb9250.jpg)


## 11.13


git 操作


1. HEAD^1 返回上一级 HEAD~num 返回多级

我使用相对引用最多的就是移动分支。可以直接使用 -f 选项让分支指向另一个提交。例如:

git branch -f main HEAD~3

上面的命令会将 main 分支强制指向 HEAD 的第 3 级 parent 提交。


2. 撤销

在 Git 里撤销变更的方法很多。和提交一样，撤销变更由底层部分（暂存区的独立文件或者片段）和上层部分（变更到底是通过哪种方式被撤销的）组成。我们这个应用主要关注的是后者。

主要有两种方法用来撤销变更 —— 一是 git reset，还有就是 git revert。接下来咱们逐个进行讲解。


3. cherry-pick 

git cherry-pick <提交号>...
如果你想将一些提交复制到当前所在的位置（HEAD）下面的话， Cherry-pick 是最直接的方式了。我个人非常喜欢 cherry-pick，因为它特别简单。


4. rebase -i

如果你在命令后增加了这个选项, Git 会打开一个 UI 界面并列出将要被复制到目标分支的备选提交记录，它还会显示每个提交记录的哈希值和提交说明，提交说明有助于你理解这个提交进行了哪些更改。

在实际使用时，所谓的 UI 窗口一般会在文本编辑器 —— 如 Vim —— 中打开一个文件。 考虑到课程的初衷，我弄了一个对话框来模拟这些操作。


我们可以使用 rebase -i 对提交记录进行重新排序。只要把我们想要的提交记录挪到最前端，我们就可以很轻松的用 --amend 修改它，然后把它们重新排成我们想要的顺序。


5. git tag tagName commitNam


## 11.14

1. B站纪录片 TS的诞生
2. Electron的替代品 Neutralinojs ，优势是使用了用户本身的 chromium
3. Safari发布17.0版本 新特性
成为首个支持 <search> 元素的浏览器
支持 Storage API
正则表达式支持 v flag 和重复命名分组捕获
Set 新增 7 种新的集合方法

4. reset.css
修改 新增了一些属性

具体原因 :<https://andy-bell.co.uk/a-more-modern-css-reset/>

``` css
/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Prevent font size inflation */
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

/* Remove default margin in favour of better control in authored CSS */
body, h1, h2, h3, h4, p,
figure, blockquote, dl, dd {
  margin-block-end: 0;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role='list'],
ol[role='list'] {
  list-style: none;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  line-height: 1.5;
}

/* Set shorter line heights on headings and interactive elements */
h1, h2, h3, h4,
button, input, label {
  line-height: 1.1;
}

/* Balance text wrapping on headings */
h1, h2,
h3, h4 {
  text-wrap: balance;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input, button,
textarea, select {
  font: inherit;
}

/* Make sure textareas without a rows attribute are not tiny */
textarea:not([rows]) {
  min-height: 10em;
}

/* Anything that has been anchored to should have extra scroll margin */
:target {
  scroll-margin-block: 5ex;
}
```

5. Theatre.js 是一个具有专业动作设计工具集的 JS 动画库。它可以帮助你创建任何动画，包括从 THREE.js 中的电影场景到令人愉悦的 UI 交互。 暂时用不到它


6. 创建chrome 插件工具  https://github.com/guocaoyi/create-chrome-ext