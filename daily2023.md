# 2023 年每日笔记 

## 1.30 

01. swc

插件存在的问题: 

放到前端研发框架这样的复杂业务场景，JS 插件的能力是至关重要的。架构团队另说，我们几乎不可能要求业务方去用 JS 以外的语言去写插件。可是在复杂的场景中，业务几乎离不开对 JS Compiler 有定制化的诉求，比如用的比较多的 babel-plugin-import

值得注意的是，在 swc 的场景下，并不是所有的插件都用 JS 写合适，前文有提到性能问题，swc 的作者也在尽力将 babel 社区主流的插件改用 Rust 来写。但是基于前面的原因，可扩展的 JS 插件是不可或缺的。

01. 没有 presets 的概念
02. plugin 自身能获取的信息过少：缺失 stat 信息，其中包含了当前正在处理的文件路径；无法给插件传递参数
03. 缺少 @babel/types 这样的生态工具
04. 没有 AST playground

体验与感受 :

构建时间说到底了是一种体验优化，所以在对研发框架进行改造的过程中，一定是不能捡了桃子丢了西瓜的（为什么是桃子？因为开发体验可比芝麻要重要的多）。评价一个研发框架是否好用，除了构建时间，还有开发效率、可扩展能力、稳定性等等更多维度的东西。

babel 确确实实已经经历过太多的考验和迭代，即使 swc 已经快三年了，并且一定程度上站在巨人的肩膀上，但依然有很多事情要做，尤其它的定位是取代 babel。

目前的结论是，研发框架暂不适合将 swc 投入到生产环境使用，短期内可能会以实验性属性的形式透出，未来会看 swc 的发展来决定怎么处理。

## 2.1

01. 解决typescript 报错 无法重新声明块范围变量,从而导致编译报错 报错如下

![](https://pic.imgdb.cn/item/63d9cc3a588a5d166c06ffe8.jpg)

之所以 tslint 会提示这个错误，是因为在 Commonjs 规范里，没有像 ESModule 能形成闭包的「模块」概念，所有的模块在引用时都默认被抛至全局，因此当再次声明某个模块时，TypeScript 会认为重复声明了两次相同的变量进而抛错。

对于这个问题，最简单的解决方法是在报错的文件底部添加一行代码：***`export {}`***。这行代码会「欺骗」tslint 使其认为当前文件是一个 ESModule 模块，因此不存在变量重复声明的可能性。当使用这个方法时，记得这样配置你的 `tsconfig.json`

```json
{
  "include": ["src", "demo"],
  "compilerOptions": {
    /** ....  */
    // `esMoudleInterop` 这个配置允许文件中出现 export 关键字。
    "esModuleInterop": true, // important!
    /** ....  */
  }
}
```

但是这样同时回带来一个问题 , 无法执行编译后的Javascript 代码 , babel虽然能够转译 但是并没有去掉, node 会由于无法识别关键字而报错

所以需要我们手动去删除掉 ` export {}` , 已经有包 `@babel/plugin-transform-modules-commonjs` 满足需求 
使用方法

```js
{
    plugins: [
        '@babel/plugin-transform-modules-commonjs'
    ]
}
```

## 2.2 

01. 我们吧第三方库代码打到了业务里面  如果用外链的形式引入第三方库, 会减少白屏的效果吗?

答:

分场景 :
01. 首次加载
02. 二次加载
03. 首次加载后,有新版本发布
04. 你的静态资源有没有设置缓存
05. 发布策略,增量发布还是替换发布

首次加载 没有缓存 发两个bundle 和 打进一个bundle 的区别不大
第三方库独立引入的好处是 发新版本 这部分以来无需更新的话 可以享受到他的缓存
其次就是同站点下的其他页面公用这个缓存
拆分来发 利用浏览器的并行请求 是可以减少白屏

如果拆开来发 用http2 反而会因为多路复用而降低性能
如果你要加载的本身就是大文件, 此时的瓶颈是带宽而不是延迟 这种情况没必要拆
如果是bundle的话 至少要把vendor 拆出来 这样能利用缓存 

不常维护的系统 就http2 和 拆包选一个

多路复用只是降低了 链接延迟 但把一些并行的请求变成了串行

这个可能是实现的问题 
https://stackoverflow.com/questions/33658302/why-http-2-is-slower-than-plain-https

## 2.3

01. 在Esmodule 使用__dirname 

```js
import path, {
    dirname
} from "path"
import {
    fileURLToPath
} from 'url'
const __dirname = dirname(fileURLToPath(
    import.meta.url));
```

02. 前端监控方法

https://juejin.cn/post/7172072612430872584

03. 检测白屏方法 : web-see

04. css 波浪 wave : https://codepen.io/andyfitz/pen/wvxpBWL

## 2.5

01. 讨论关于js使用位运算 

终于追到了。。。。要说到 v8 如何实现位运算，一个按位 or 光是编译器就要做这么多：
https://source.chromium.org/chromium/chromium/src/+/main:v8/src/compiler/js-type-hint-lowering.cc;l=461?q=JSBitwiseOr&ss=chromium%2Fchromium%2Fsrc
运行时 turbofan 还会做一些优化，例如如果发现一个数字在 1w 次循环中都是 int 就会优化成 int 的 or，如果发现了不好的写法（如某次循环中发现某个数字不是 int 了）则会推翻之前的优化，重新用慢的方法

你以为写的 js，实际上被转换成了一堆 runtime 的调用。。很多语言都这样，go 也是，一个 make 会被转换成 runtime 的各类函数，取决于 make 的参数是啥

现代编程语言已经不再是编译成纯二进制执行了，大多是基础功能转换为二进制、复杂功能转换为 runtime 调用。。语言的功能多少也就取决于 runtime 提供的功能有多少

但 js 这种语言过于灵活，一个变量啥类型都有可能，所以实际上我们以为的底层操作反而会很慢

## 2.6

01. 值得注意的是：块语句（大括号”｛｝＂中间的语句），如if和switch条件语句或for和while循环语句，不像函数，它们不会创建一个新的作用域。

不对，块级是有独立的作用域的，但是比起lexical作用域定义会松一些

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

01. uni-app 生命周期顺序 

App launch -> App Show -> page onLoad -> paeg onShow -> component beforeCreate -> component created -> component mounted -> page onReady

## 2.8 

专心工作 无心抓鱼

## 2.9 

01. web 版本更新提示

https://juejin.cn/post/7159484928136642567

https://juejin.cn/post/6995385715672481799

## 2.10

01. 如果是node直接查数据库,推荐直接使用node的技术展 例如 sequelize 或者 typeorm 

02. mybatis 跟 node 生态差的有点远 虽然手动转化也能做 但是 orm 也好 active record 也好 不就是为了以后可以增加字段关联的时候不用改那么多代码 手动转就失去了这个优势了

03. 真正计算密集型的东西还得看性能, 多喝只是只吃了横向扩展 但是碳排放还是挺高

04. 服务基本就这几个 服务发现 心跳检测 冒烟检测 复杂均衡

冒烟检测: 一些基本的检测 有些时候服务不是跑起来就能接受流量的 会有一些预加载和预处理 只有这些检测完毕之后 冒烟检测才会通过 负载均衡才会把流量引过来

05. 即使是ts 用ts-node运行的本质也是线打包 , 之后运行js 只能说冷启动的时间 会稍微慢一点点 这对serverless(或者叫函数计算)来说是致命的,但他们也有解决办法,不一定非得降低冷启动时间

06. 静态文件肯定是nginx厉害 单实例百万链接 不过静态文件最好还是扔到cdn vue有一种写法是可以不打包直接挂到nginx后面,让浏览器运行 没有人会在线上跑dev server

07. 后端框架 python 有flask 和 django, go基本是gin搭起来的 , nodejs有egg next koa express , php 有laravel,thinkphp 
  即使不提语言差异, 后端也会纠结mySql和mariaDB哪个好, RocketMq和Kafka该用哪个
  java我不太了解 因为他似乎是主流语言中唯一一个 没有ide我深知连项目都不会编译 的语言 于是就一直没有怎么接触过

08. js的数组并不是严格的数组实现, 而是类似于c++的vector (对于稀疏数组V8甚至用了哈希表),所以即使你pop了, 占用空间也没办法立即减少

09. Infinity 一般用于简化算法, 作为哨兵数字  
    在一些 没有Infinity的场景 (如 C 语言切数据类型为Int)下  会使用-1 或者一个很大的数字来代替, 不过要特别判断一些东西 ,infinity 几乎不需要做特别判断 

    例如归并排序的归并流程 , 只要在两个系列末尾加入一个Infinity , 就不需要判断一个序列已结束了 

    Math.main 也是 如果另初始值为 Infinity 就只需要for 循环 不需要特判 ‘如果是第一个元素 则把它赋值给result 了 
    
    当然他也是作为IEEE754浮点数的一部分 , 用作1/0, 在js中只要数字的运算结果超过一定大小 也会变为Infinity 

    至于Number.MAX_VALUE 一般用不到 ,业务中常用的是number.MAX_SAFE_INTEGER 用于避免整数过大导致精度问题 (例如 API返回的order ID 如果超过了这个数字 前端就没办法展示 后端必须用String 返回)

    MAX_VALUE 几乎没有什么意义 不会有业务判断的数字这么大

10. 当前时间是实时取的,它的精准度只取决于取数字的函数 例如,Date.now 就是毫秒级 performance.now就更精确一点 所谓的16.7ms 导致的误差其实是你点不准 也就是计数器没法在你点击的时候瞬间停止 但是计时器停止了之后 去到的时间一定是准确的

11. 有时候前端还是要了解一下 一些常见操作的时空小号 不然哪天把n的复杂度 搞成了 n^ 2就不好了 

一个常见的例子就是为了优雅 而用reduce 来构造对象

```js 
xxx.reduce((acc, cur)=>({
  ...acc, 
  [cur.key]:cur.value
}), {})

// 这个地方使用 { ... acc} 来构造一个对象会消耗 O(Object.keys(x)) 的时间

```

12. 

r: 流式的堆甚至没办法解决最值问题 ?

g: 当然 可以 维护k个元素的堆就行了 你贴的这个只是找一次kth-value 有价值

r: 问题是不输入完整元素你是不知道 谁最大的 然而就这个问题来说 , 堆需要nlogn 或者如果不在线处理, 那直接 n+klogn

g: 要的就是已知数据里的kth-value 当有新数据时不断刷新 , 快排的思想做不到 它只能在单词o(n) 中找kth value , 我的意思是 在真实世界中 ,在一段 固定的数据里找一次 kth-value 并不常见, 还有就是不能处理大数据 因为空间不够,所以才需要支持流式计算 

r: 堆能做到这个? 如果是大根堆 大小为k并不能保证挤出去的一定是最小的 

g: 看你要维护什么数据 如果前k小 , 就维护小根堆,反之就维护大根堆 

r: 因为堆内数据没有任何顺序保证 只有根元素有保证 我要找第k大 于是维护一个大小为k的大根堆 , 然后进来第k+1个元素了 该如何处理 有一个元素会被挤出去 但并不能保证是 当前堆中最小的, 搞不好第二小的被挤出去了也有可能

g: 你想错了 你说的这个是滑动窗口问题 ,这种情况下 就是窗口大小固定, (比如只看某个时间段内的数据) , 可以上平衡树 平衡树求 kth-value 可以用名次树 在O(logn)的insert/delete/query的复杂度下解决 

r: 平衡树 写起来太麻烦了 大材小用 看业务场景, 如果你说的是滑动窗口求 kth-value 我想不到更好的解法

r: 我第一反应是滑动窗口的思路 确实有别的思路 

g: 不是普通的平衡树 ,得实现名次树才行 treap和splay 都可以 但需要实现额外的方法 滑动窗口只能求最大或者最小 ,在这个问题中没有意义 ,你直接维护个单调栈就可以

13. js的位 运算效率超级低, 因为js的number并不是int 没法直接算 

  chromium在执行js之前会试图做优化 实际上  | 运算符 会被转化成调用 IrOpcode::BitwiseOr  

  你以为写的js 实际上 被转化成了一堆runtime的调用 , 很多语言都这样 go也是 , 一个make 会被抓花城runtime的各类函数 , 取决于make的参数是啥 

  这是JIT(Just In time)通用的东西, 不光chromium有, 但js这种语言过于灵活 , 一个变量啥类型都有 所以实际上我们以为的底层操作反而会很慢

14. 我倒是比较看好flat 因为原生实现迟早会被优化 除非当下的需求必须要求性能,否则比较推荐原生, 代码简单而且未来有潜力 

前端这些年的新东西大都是让代码写的更优雅 而后端的新东西大多都是在解决业务问题 

一个前端目前遇到的业务挑战没有后端那么多 一个是后端的语言,概念,工具都很成熟了 ,目前的瓶颈是水平扩展 高可用 数据一致性

后端的请求凉椅上来 ,之前所有的架构几乎都要推翻, 至于后端写前端 只是他们缺少一个管理页面罢了 , 而且很久以前后端也要写页面 只是现在分开了而已

15. v8的Map使用OrderedHashTable 做的 是一个维持key插入顺序的hash表

反正想看某个js类型这么实现的 直接去搜v8/src/objects 下面找 或者全局搜索 JSxxx 例如 JSNumber JSBigint JSmap 

如果遇到数据结构（例如这儿的 OrderedHashTable），一般里面都会附上注释，图中的注释还给了 MDN Wiki 的参考链接：https://wiki.mozilla.org/User:Jorend/Deterministic_hash_tables

它的搜索做的非常好 可以搜关键字 也可以基于reference跳转

## 2.13

01. Object.is(NaN,NaN) 和 isNan(NaN) 没有区别
02. Number.isNaN() 和 isNaN 有一个转化的区别 isNaN(x) = Number.isNaN(Number(xx))

## 2.14

01. 画一条三次贝塞尔曲线曲线   https://codepen.io/Chokcoco/pen/mdGdejG

## 2.15

忙

## 2.16

忙

## 2.17

01. Jest 单元测试 如果需要使用浏览器中API 需要配合js-dom
02. `color-contrast`  color-contrast()函数符号接受一个颜色值，并将其与其他颜色值的列表进行比较，从列表中选择对比度最高的一个。
03. npm cache 

NPM缓存是节点包管理器在安装新包时使用的存储在计算机上的包的集合。这个缓存有助于加快安装过程，因为它不需要重复下载相同的包。缓存还允许NPM跟踪你的计算机安装了哪些扩展、文件和包。

不幸的是，随着时间的推移，这个缓存文件夹可能会变得混乱，因为NPM会定期更新旧包或安装新包。这种混乱可能会导致安装新包时出现问题，因为它可能无法识别机器上已经安装了哪些文件。

首先我要说的是，不建议清理NPM缓存，除非你因为数据损坏问题而面临错误，或者只是想释放磁盘空间。NPM非常擅长处理缓存，如果有异常，它会尝试自动修复它或让你知道任何可能的损坏。

这里有一些你可能想要清理你的NPM缓存的原因:

01. 释放磁盘空间。
02. 消除“Please run npm cache clean”错误。
03. 修复无法正确下载的库。
04. 重新安装没有缓存的库(虽然不知道为什么你会这样做)。

``` js
npm cache clean --force  
```

这个命令将删除NPM缓存中存储的所有数据，包括任何过时版本的包。请注意，在运行此命令时使用" -force "标志非常重要，因为它可以确保删除所有数据，即使可能由于缓存损坏或其他原因而出现错误。

```js
npm cache verify
```

npm cache verify是一个命令，用于验证npm缓存中所有已安装包的完整性。它验证缓存文件夹的内容，垃圾收集任何不需要的数据，并验证缓存索引和所有缓存数据的完整性。

删除NPM缓存不同于从项目中删除node_modules文件夹。NPM缓存对于您的计算机是全局的，而node_modules文件夹则存储在每个项目中。如果你只是删除node_modules文件夹并重新安装所有的包，你仍然可以从NPM缓存中获取这些包，并且清理NPM缓存，不会影响你的项目库。

NPM缓存是NPM包管理器的重要组成部分，它有助于加快安装过程，并跟踪在您的机器上安装了哪些包。清理NPM缓存可以帮助释放磁盘空间，修复损坏的库，并避免遇到“请运行NPM缓存清理”错误。

不建议清理NPM缓存，除非你真的需要，但如果你需要它，现在你知道怎么做了。

04. https://javascriptkicks.us9.list-manage.com/track/click?u=4ba84fe3f6d629e746e48e5b7&id=1d04ca3374&e=cfe47b0953 

interface 和 type的区别 

05. TresJS Bring Three to the Vue ecosystem 这个库将threejs 引入 vue的生态系统

地址 - https://tresjs.org/

## 2.20

请加

## 2.21

01. mutation-observer 

02. intersection-observer :

提供了一种异步观察目标元素与其祖先元素或顶级文档视口（viewport）交叉状态的方法

当一个 IntersectionObserver 对象被创建时，其被配置为监听根中一段给定比例的可见区域。一旦 IntersectionObserver 被创建，则无法更改其配置，所以一个给定的观察者对象只能用来监听可见区域的特定变化值；然而，你可以在同一个观察者对象中配置监听多个目标元素。

## 2.22 

可以写个批量曝光的方法

https://juejin.cn/post/7018430369321975822

## 2.23

微信小程序picker-view 的问题 

picker-view的bindchange事件（选项变更事件）会随着动画结束延迟触发，目前动画时长太久，导致bindchange触发延迟太久

只要滚得快一点，那么通知事件就会迟到，导致用户点击确认按钮后得到的数据和其看到的选择项会不一样

问题描述的地址

https://developers.weixin.qq.com/community/develop/doc/0002c6f63c86b8cccd17af72c56c00?page=1

https://developers.weixin.qq.com/community/develop/doc/00086ede9f4af82fdd8ca65be54c14

暂时的解决方案 
![](https://pic.imgdb.cn/item/63f748acf144a010078992b5.jpg)

## 2.24

01. iOS and iPadOS 16.4 beta 1 这个版本中 支持了很多属性 比如`媒体查询`,`@property`,`font-size-adjust(按比例缩小font-size)`等属性

增加了对Web推送到主屏幕Web应用程序的支持。Web Push使得Web开发人员可以通过使用Push API、notifications API和Service worker一起工作来向用户发送推送通知。

## 2.27

## 2.28

无事

## 3.1

canvas绘制两点之间曲线链接 

```js
var drawCurve = function(startX, startY, endX, endY) {
    // 曲线控制点坐标
    var cp1x = startX;
    var cp1y = startY + (endY - startY) / 2;
    // 这里的除数2和曲线的曲率相关，数值绝大，曲率越小
    var cp2x = endX;
    var cp2y = endY - (endY - startY) / 2;

    // 开始绘制曲线
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = '#000';
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
    console.log(a)
}

function bar(a, b, c = 3) {
    arguments[0] = 42;
    console.log(a)
}

foo(1, 2);
bar(1, 2);
```

严格模式下，arguments是拷贝而不是引用

而带默认值的方法判定为ES2015以后的语法，方法体会被自动指定为严格模式

arguments在任何场合都不应该使用

## 3.3 

01. 容器查询 https://developer.chrome.com/en/blog/style-queries/

据说是可以通过 

```css
@container style(--detail: new) {
    .comment-block {
        display: block;
    }

    .comment-block::after {
        content: 'New';
        border: 1px solid currentColor;
        background: white;
        ...
    }
}

@container style(--detail: low-stock) {
    .comment-block {
        display: block;
    }

    .comment-block::after {
        content: 'Low Stock';
        border: 1px solid currentColor;
        background: white;
        ...
    }

    .media-img {
        border: 2px solid brickred;
    }
}
```

02. 一个课程 地址是 

主要讲的是 前端页面在用户切到后台的时候 我们应该做些什么 ? 比如是否要停止定时器或者一些动画 , 如果有接口请求 是否要中断它 

https://frontendmasters.com/courses/background-javascript/?utm_source=javascriptweekly&utm_medium=email&utm_content=backgroundjs

纯英文的

03. 尤大对于vue3的状况的文章以及 视频 https://thenewstack.io/vue-2023/

04. 对于 前端上传word转化pdf 记录

R:》 如果为了保证效果，我比较推荐 openoffice，支持 headless 模式输出 PDF

  比较完善的做法是 openoffice 跑在 headless 模式下并开一个端口监听，后端服务有库可以跟它做交互，就跟 chrome devtools protocol 一样，控制它打开文件、生成 PDF

  这样的好处是你可以维护一个 openoffice 池，有新请求就从池里挑一个实例出来，用完再塞回去，还能定时重启以及监控😐

  浏览器保证不了效果

S:》 这后端给我拒绝了，说让我(前端)自己做 他说服务器压力顶不住，放在浏览器好一点

R:》 虽然网上有库可以读取文件内容，但对于一些样式，无法很好地识别；并且这类库通常很大，显著影响加载速度

  而 openoffice 这类软件，本来就是 office 的替代品，效果是可以保证的

  如果你们领导只关注文档内容，那就前端随便找个库做吧

  啊这，我搜了一下 npm，好像常见的做法都是用我说的 libreoffice😂

J:》 或者，Puppeteer，前端做一个中间页面，用来预览用户上传的文件附件，然后再写个node服务，把网页的转成PDF

## 3.6

## 3.7

忙于需求

## 3.8

```ts
type res =  never extends 1 ? 1:2;
//  type res = 1
type Test<T> = T extends 1 ? 1:2;
type res2 = Test<never>;
// type res2 = never;
```

第一个 非范型的时候 如果 extends 的是any 或者 unknow 或者 check部分是extends 部分的字类型, 直接返回 trueType 的类型

never 是任何类型的子类型, 所以是 1

第二个 当类型参数是 never 出现在条件类型左边 直接返回never 

## 3.17

01. 开平方的操作 Math.sqrt(2) === 2**0.5 

02. 随机mac地址的写法

```js
function randomMac() {
    const mac = [
        (0x52).toString(16),
        (0x54).toString(16),
        (0x00).toString(16),
        Math.floor((Math.random() * 0xff)).toString(16),
        Math.floor((Math.random() * 0xff)).toString(16),
        Math.floor((Math.random() * 0xff)).toString(16)
    ]
    return mac.join(':')
}
```

03. semver https://juejin.cn/post/6844903516754935816

只要有一个作者没有遵循 semver，引入了 breaking change，你的项目就挂了（参考之前我遇到的 antd eslint 的问题

你给 typedoc 提 PR 就会发现，它依赖的某个东西（有可能是 @typescript-eslint，或者 ts-loader）也没有 typescript@^5 的 peer

如果不是最底层的库，真的没办法跟进那么快。。我们业务项目至今迟迟没升级 react 18 就是因为一些库还不支持，又没有更好的选择

ts 从 3 升到 4 也经历了一大波编译错误（主要是 Promise 的范型相关）

所以一个是等待时机成熟，一个是需要有足够的人力。。

像是pnpm swc webpack5 

04. 生成随机码的函数

```js
export function genRamdomMAC() {
    return 'xy-xx-xx-xx-xx-xx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        // 这个地方使用0x没有 0b清晰

        const v = c === 'x' ? r : (r & 0b11 | 0b1000)
        return v.toString(16)
    })
}
```

05. 对称加密 
https://halfrost.com/symmetric_encryption/#toc-19

基于大整数分解难题的加密算法应该指的是 RSA（我还没见过其它的），不过随着量子计算机的发展，RSA 并不能抵抗量子攻击

啊这，我才发现基于椭圆曲线的 ECDSA 甚至比 RSA 还容易被量子攻击。。

以后 ssh 不用它了

06. 取颜色值的argb

```js
(0xabcdef12 >> 0x18 & 0xff).toString(16);
(0xabcdef12 >> 0x10 & 0xff).toString(16);
(0xabcdef12 >> 0x08 & 0xff).toString(16);
(0xabcdef12 >> 0x00 & 0xff).toString(16);
```

07. pnpm 问题 

之前听 zkochan 分享，我问过一个问题：不同版本的 pnpm 生成的 lock file 冲突很明显，这个除了重新 pnpm i 以外有没有更好的解决办法？在未来 lock file 的格式是否会逐渐固定下来？
大佬回答：我们确实在解决格式问题，但目前最推荐的做法还是 pnpm i。

## 3.20

01. dvh 是视频口相对视口的单位

我们可以尝试通过 max函数去

```css
@supports(padding: max(0px)) {
    .post {
        padding-left: max(12px, env(safe-area-inset-left));
        padding-right: max(12px, env(safe-area-inset-right));
    }
}
```

02. 有没有什么好的方法可以预防pdf文件的xss攻击。需求是需要预览pdf文件，但是使用浏览器或者iframe去预览pdf文件会执行pdf文件中的js脚本，找了几个vue的pdf预览插件都是基于iframe的，有没有什么别的预览插件推荐的

 csp 协议 https://www.ruanyifeng.com/blog/2016/09/csp.html

03. page lifecycle API
   page Visibility API

   https://www.bookstack.cn/read/webapi-tutorial/docs-page-visibility.md

## 3.21

01. Chrome paint Profiler

你可以使用Chrome DevTools中的Paint Profiler来重放页面的“绘图”。当你在屏幕上绘制简单元素时，文本、边框、轮廓、背景、伪元素等都是单独绘制的。对于我们大多数人来说，这一切都是瞬间出现的，我们不会多想。Paint Profiler允许您一步一步地查看浏览器是如何绘制页面的。

制作一个新的时间线记录，选中“绘制”。
确保出现一些绘画(例如重新加载网页)
单击绘制记录。油漆记录被标记为绿色。
在Summary窗格中，单击“Paint Profiler”

02. 消除渐变的锯齿 

抗锯齿的算法 及其一些理论的东西 https://juejin.cn/post/6844904180776173581 
抗锯齿 css 中操作 https://github.com/chokcoco/iCSS/issues/209

## 3.22

01. 老哥们讨论协同文档的问题 

两种方案 1. dom 堆砌 2. cavnas绘制

超过1000 行必卡

canvas 能支持 10万行

那就是没做离屏渲染吧. 
现在视图都是用的乐观更新的, 两份数据 , 前端一份, 后段一份, 先更新前端, 再发请求, 请求成功不管, 请求失败了回退是图, 没有协同算法 直接ws覆盖的 看谁的接口先返回. 冲突本来想做编辑锁, 到那时体验不好

可以考虑上个crdt(ot和crdt) 现在已经很成熟了

如何设计crdt 算法:
https://www.zxch3n.com/crdt-intro/design-crdt/

https://juejin.cn/post/7049939780477386759

02.  volta 不知道干啥的 有老哥说挺好用 可以局部切换node版本

## 3.23

01. 单字动画 通常会用GSAP 
大佐的codepen

https://codepen.io/wheatup/pen/OJoazBO??editors=1100

用图的缺陷比较明显 换个文案加个字就要出图 

不过可以以字的维度出图

如果是纯英文的话 可以考虑bitMap字体 (字蛛也可以)

https://www.midjourney.com/home/?callbackUrl=%2Fapp%2F

bitmap fontSpider 

字蛛构建流程地址 https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fyangchuansheng%2Ffont-spider-plus

## 4.4

01. vite模板 后面可以把这个超过来做一下cli配置

https://github.com/honghuangdc/soybean-admin

https://github.com/pure-admin/vue-pure-admin

## 4.7

01. css 片段 (容器查询 / scroll snap / grid pile / aspect-ratio / @layer / logical properties)

@layer 做什么用的

02. css 支持了 角度函数 sin cos tan asin acos atan atan2

我们可以通过 translate 进行旋转计算

```css
:root {
    --radius: 20vmin;
}

.dot {
    --angle: 30deg;
    translate:
        /* Translation on X-axis */
        calc(cos(var(--angle)) * var(--radius))
        /* Translation on Y-axis */
        calc(sin(var(--angle)) * var(--radius) * -1);
}
```

<!-- https://web.dev/css-trig-functions/?utm_source=CSS-Weekly&utm_campaign=Issue-544&utm_medium=email -->

03. 一个dom堆叠的loading

https://codepen.io/amit_sheen/pen/JjBLaGG

## 4.13

01. GLSL Shader : `https://codepen.io/ksenia-k/pen/poOMpzx`
02. Colorful Theme Switch(switch切换) : `https://codepen.io/jkantner/pen/eYPYppR`
03. Page change(页面切换) : `https://codepen.io/konstantindenerz/pen/abaXabq`
04. Button超级炫 : `https://codepen.io/jh3y/pen/LYJMPBL`

05. text-wrap:balance (stag4阶段)
06. working with webxr (https://www.youtube.com/playlist?list=PLpM_sf_d5YTPXeVp4cmgN_cNBj9pNTEmZ#react3dfiber)

## 4.14

01. 银行家算法  是浮点数取整常用的算法 -> 

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

> 假设有5位储户的利息分别是0.000、0.001、0.002、0.003、0.004，这些厘被四舍五入了，因此银行赚了。但另外5位储户的利息分别是0.005、0.006、0.007、0.008、0.009，那么他们每人拿到的利息就是0.01，银行亏了。

而根据本福特定律的相关测算，首位非零数字的出现是有概率分布的，数字越低概率越大。但非首位的数，基本符合随机分布。

那么上述10位储户的利息，经过四舍五入之后，银行的盈利情况如下：

```
0.000 + 0.001 + 0.002 + 0.003 + 0.004 - 0.005 - 0.004 - 0.003 - 0.002 - 0.001 = -0.005
```

银行亏了0.005！

这怎么能行！资本家的钱是你能轻易赚走的么？

而同样的数据，用“奇进偶舍”的规则计算后，刚好俩俩抵消，盈利为0，在这个案例几乎完美！

不过，并不是所有的案例都如此完美，但本福特定律从统计学层面已经很好的解释和规避了大部分情况下的误差。

02. ue和前端不通过后台直接通信的方法 - 
展示上是虚幻引擎里掏了个浏览器, 把浏览器盖在引擎画面上, 交互也是通过浏览器内嵌实现的, UE给浏览器煮鱼监听方法, web端调用其对应方法.

03. 位运算的有效数据范围 int32

```js
let a = Date.now()
a === ~~a // false
```

04. 判断奇数 3&1 === 1  4 & 1 === 0;

05. 猜颜色 https://codepen.io/wheatup/pen/dygGQOO?editors=0110

06. npm 包下载问题 如何在外层下载子目录下的node_modules https://zhuanlan.zhihu.com/p/38040253

07. 使用API Extractor 管理 API
https://zhuanlan.zhihu.com/p/434565485

## 4.21

在pnpm的仓库的一个issues上 讨论了 感觉pnpm 好像比yarn 慢

https://github.com/pnpm/pnpm/issues/6447

01. 如果你使用独立脚本安装PNPM，或者你安装@pnpm/exe包，而不是NPMJS中的PNPM包(npm I -g @pnpm/exe)， PNPM运行命令会更快。

pnpm install——frozen-lockfile曾经比Yarn快，但后来变差了。我不知道是什么变化引起的，但我注意到在我们的基准测试中。

我相信pnpm add总是比较慢。

pnpm在macOS上安装可能会慢一些，因为pnpm在macOS上使用硬链接，而Yarn会复制文件。复制速度更快，但使用更多的磁盘空间。Copy-on-write副本是最好的(我们在支持它的Linux文件系统上使用)，但在macOS上我们不能使用它，因为Node.js不允许它(#5001)

用独立的pnpm运行命令似乎是最快的，但是用npm运行包含pnpm命令的脚本是最快的。

这可能是由于Node.js字节码或模块缓存，但我没有证据。

另外，我很好奇为什么@pnpm/exe运行得更快。是因为@pnpm/exe有自己的Node.js，使它加载更少的包时执行? 以上翻译结果来自有道神经网络翻译（YNMT）· 通用场景

在CI上使用@pnpm/exe确实给了我们一点提升。不幸的是，还不足以赶上纱线。

使用标准的pnpm/action-setup:

解决方案
使用动态导入而不是顶层导入，顶层导入已经在文件pnpm/src/pnpm中应用了。是的，但这还不够。
将一些常量/utils分离到较小的文件中，以防止总是导入整个模块。
不幸的是，这是一项巨大的工作，不可能很快完成。

## 5.6

01. 小程序 父子组件传递函数this指向有问题 

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

02. 小程序组件生命周期 无 onshow onload 等 只有vue的那几个

且 执行顺序 为 App launch -> App Show -> page onLoad -> paeg onShow -> component beforeCreate -> component created -> component mounted -> page onReady

03. localStorage , sessionStorage 的存储限制是多大?
《https://github.com/FrankKai/FrankKai.github.io/issues/179》

PC:

|  浏览器名称   | localStorage limit  | sessionStorage limit |
|  ----  | ----  | --- |
| chrome40  | 10mb | 10mb |
| firefox 34  | 10mb | 10mb |
| ie9  | 10mb | 10mb |
| safari  | 10mb | 无限大 |

Mobile:

|  浏览器名称   | localStorage limit  | sessionStorage limit |
|  ----  | ----  | --- |
| chrome 40 for Android | 10mb | 10mb |
| firefox 34 for Android | 10mb | 10mb |
| Android Browser| 2mb | 无限大 |
| mobile safari 8  | 5mb | 无限大 |
| ios webview safari 8  | 5mb | 无限大 |

可以使用 localForage 可以突破离线存储 5MB的限制

https://www.zhangxinxu.com/wordpress/2018/06/js-localforage-localstorage-indexdb/

他会按照 indexdb -> websql -> localstorage 来敲套

vue 生态可以使用 vif

## 5.9

01. 小程序分包 引用submodule内容时 如果主包没有使用可能会导致部分代码缺失

01. TTI (Time to Interactive) 可交互时间

https://web.dev/i18n/zh/tti/

TTI 指标测量页面从开始加载到主要子资源完成渲染，并能够快速、可靠地响应用户输入所需的时间。

如需根据网页的性能跟踪计算 TTI，请执行以下步骤：

先进行First Contentful Paint 首次内容绘制 (FCP)。

沿时间轴正向搜索时长至少为 5 秒的安静窗口，其中，安静窗口的定义为：没有长任务且不超过两个正在处理的网络 GET 请求。

沿时间轴反向搜索安静窗口之前的最后一个长任务，如果没有找到长任务，则在 FCP 步骤停止执行。

TTI 是安静窗口之前最后一个长任务的结束时间（如果没有找到长任务，则与 FCP 值相同）。

服务器端渲染 (SSR) 等技术可能会导致页面看似具备交互性（即，链接和按钮在屏幕上可见），但实际上并不能进行交互，因为主线程被阻塞或是因为控制这些元素的 JavaScript 代码尚未完成加载。

当用户尝试与看似具备交互性但实际上并非如此的页面进行交互时，他们可能会有如下两种反应：

在最好的情况下，他们会因为页面响应缓慢而感到恼火。
在最坏的情况下，他们会认为页面已损坏，因此很可能直接离开。他们甚至可能对您的品牌价值丧失信心或信任。
为了避免这个问题，请尽一切努力将 FCP 和 TTI 之间的差值降至最低。如果两者在某些情况下确实存在明显差异，请通过视觉指示器清楚表明页面上的组件还无法进行交互。

可以使用 `lighthoust` 或者 `webPageTest` 工具测量TTI

标准: 网站普通移动硬件上进行测试时, 应该努力将可交互时间控制在5s以内

如果改进: 

01. 缩小 JavaScript
02. 预连接到所需的来源
03. 预加载关键请求
04. 减少第三方代码的影响
05. 最小化关键请求深度
06. 减少 JavaScript 执行时间
07. 最小化主线程工作
08. 保持较低的请求数和较小的传输大小

02. First Input Delay 首次输入延迟 (FID)

https://web.dev/fid/

FID 测量从用户第一次与页面交互（例如当他们单击链接、点按按钮或使用由 JavaScript 驱动的自定义控件）直到浏览器对交互作出响应，并实际能够开始处理事件处理程序所经过的时间。

为了提供良好的用户体验，网站应该努力将首次输入延迟设控制在100 毫秒或以内。为了确保您能够在大部分用户的访问期间达成建议目标值，一个良好的测量阈值为页面加载的第 75 个百分位数，且该阈值同时适用于移动和桌面设备。

作为编写事件响应代码的开发者，我们通常会假定代码会在事件发生时立即运行。但作为用户，我们都常常面临相反的情况，当我们在手机上加载了一个网页并试图与网页交互，接着却因为网页没有任何反应而感到沮丧。

一般来说，发生输入延迟（又称输入延时）是因为浏览器的主线程正忙着执行其他工作，所以（还）不能响应用户。可能导致这种情况发生的一种常见原因是浏览器正忙于解析和执行由您的应用程序加载的大型 JavaScript 文件。在此过程中，浏览器不能运行任何事件侦听器，因为正在加载的 JavaScript 可能会让浏览器去执行其他工作。

```js
new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
        const delay = entry.processingStart - entry.startTime;
        console.log('FID candidate:', delay, entry);
    }
}).observe({
    type: 'first-input',
    buffered: true
});
```

## 5.10

eng
01. ts 之争论

反方: 
  js: 1+1=2
  ts: add: MathFunction<int, int>(1 as number, 1 as number) = 2 as number

虽然屎的确难吃，但是白饭谁吃得下啊，可以先为浇头，后期高级的烹饪方法可以慢慢学，总比光吃白饭要好很多

ts上限高，下线也低，啰嗦就不说了，定义了一堆东西反而成了坑你的陷阱，自掘坟墓

主要是ts还会让人放松警惕，无法养成运行时类型检查和防御式编程的习惯，以为编译时不报错就万事大吉，出问题都是在线上 烦就烦在这点 所有类型都是意淫

其实恰恰相反，ts就是你自己的一套逻辑自洽去cover所有的case，而这个所有的case必须是你能意料到的，万一你忘了一个case，编译肯定是没有问题的

一个参数的类型被定义了，你就不会想到去检查它是不是空，或者是别的类型

正方
: 大部分人也不需要了解什么类型体操，会给参数加类型就行了。。

这几年 ts 在帮忙发现组件使用错误/数据格式变更漏掉了某文件/自动补全上面不知道帮了我多少忙

两个开发负责的模块有共用的部分，A 开发加了个字段，B 在调用的时候没有加，代码一合一上线，就是运行时错误

然而对于业务代码来说，不需要那么多的防御式编程。。我们项目几乎没这东西 而且即使用了 js，开发也不会防御式编程😂‘

对服务端的防御直接做到 API 层就是了 基于类型的数据校验，用 zod 足够了

如果想要自动 normalize，那就加上 ajv

根本不需要业务开发来处理。。

然后对工具函数的边界处理，这个不管用不用 ts 都会存在问题，但至少 ts 可以阻止业务开发胡乱调用（number 传成 string 这种问题完全避免掉了）

以及关于边界处理，只要团队整体用了 ts，那我直接定义 (param: string) => ... 就比在函数内部写个 if 要简单很多

空值就几种可能：开发用 as any 传进去了，或者后端返回了空；前者直接去真人快打，后者 zod 可以在 axios 中间件里面报错

02. ajv Ajv JSON schema validator  https://ajv.js.org/

一个通过json配置来校验参数的插件

```js
const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    type: "object",
    properties: {
        foo: {
            type: "integer"
        },
        bar: {
            type: "string"
        }
    },
    required: ["foo"],
    additionalProperties: false
}

const data = {
    foo: 1,
    bar: "abc"
}
const valid = ajv.validate(schema, data)
if (!valid) console.log(ajv.errors)
```

03. OPPO FIND N2 Flip 且 自带的浏览器 存在问题

 使用 `<input type="checkbox" />` 存在问题

```js
< input type = "checkbox": value = "value"
@change = "change" / >

    <
    script >

    export default {
        data() {
            return {
                value: false
            }
        },
        methods: {
            change() {
                this.$emit('update:value', !this.value)
            }
        }
    } <
    /script>
```

这种情况下 不论点击哪里 都会触发 `@change`

## 05.11

01. 一段文本 大小写翻转

```js
const input = 'Hello World!';

const reverseCase = txt => text.replace(/[a-z]/gi, char => String.fromCharCode(char.charCodeAt(0) ^ 32));

console.log(reverseCase(input)); // "hELLO wORLD!"
```

方法1: 

```js
const reverseCase = txt => txt.replace(/[a-zA-Z]/g, c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());
```

方法2:

```js
const reverseCase = txt => [...txt].map(i => /[A-Z]/.test(i) ? i.toLowerCase() : i.toUpperCase()).join('');
```

方法3(最短):

```js
const reverseCase = txt => text.replace(/[a-z]/gi, char => String.fromCharCode(char.charCodeAt(0) ^ 32));
```

2. 

```ts
type res = never extends 1 ? 1 :2; // 1
type Test<T> = T extends 1 ? 1:2; //never
type res2 = Test<never>

```

非泛型的时候 如果extends的是any 或者 unknow 或者 check 部分是 extends 部分的子类型 直接返回returnType 的类型

当类型参数是never 出现在条件类型左边 直接返回never

## 5.15

对于小程序自动化测试 - 尝试

01. uni-app多端处理的不是特别理想 文档内容特别差 按文档流程无法完成测试代码编写

02. 微信小程序可以使用其自动化测试录制功能 可以录制部分流程 做自动化测试 

03. 注意存在的问题是 公司小程序依赖不同账号, 依赖后台返回的接口状态 一个账号无法满足需求 

找出数组中所有出现奇数次的元素

```js
const input = ['A', 'B', 'B', 'C', 'A', 'B', 'B', 'C', 'D', 'A', 'B', 'B', 'C']

const filterOddOccurrance = arr = {}

console.log(filterOddOccurrance(input))
```

方案一:

```js
const filterOdd = arr => {
    const a = [];
    arr.forEach(item => {
        a.includes(item) ? a.splice(a.indexOf(item), 1) : a.push(item)
    })
    return
}
```

方案二:

```js
const filterOdd = arr => {
    const m = new Map();
    arr.forEach(i => !m.has(i) ? m.set(i, 1) : m.delete(i))
    return m.keys();
}
```

方案三:

```js
const filterOdd = arr => Object.keys(arr = arr.group(e => e)).filter(k => arr[k].length & 1)
```

## 5.24

输出字节码

node --print-bytecode --print-bytecode-filter=test2 test.js

```js
function test1() {
    let i = 0;
    while (i < 10) {
        console.log(i)
        i++
    }
}

function test2() {
    for (let i = 0; i < 10; i++) {
        console.log(i)
    }
}
```

## 06.08

01. css @scope 支持

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

如上代码 button 颜色为blue

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

02. matches API

Element接口的matches()方法测试指定的CSS选择器是否选择该元素。

比如 :active : link 或者其他属性选择器

03. Dialog 

全局Dialog标签

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


04. #top-layer层级

JS 也无法模拟的系统级新特性 

解决的问题 -> 
一些弹框写在了某些容器下 采用fixed定位  但是由于父容器使用了 transform 会导致失效 , 

在以前，或者说很多框架中，都会想办法把弹窗放到最外层的 body下，这样就不受影响了，比如下面是vue3中的处理方式

```html
<div>
  <Teleport to="body"> <!--将子内容传送到body下-->
  	<dialog></dialog>
  </Teleport>
</div>

```


虽然dialog仍然在原来位置上，但真正渲染到了一个#top-layer的层级上，这个层级非常特殊，已经超越了html文档流，可以说是独一档的存在，这样，无论的dialog在什么位置，最后渲染的地方其实都在#top-layer层级上，自然也不会被父容器裁剪被隐藏了


05. 

popover是一个全局属性。给任意元素添加popover以后，它就变成了一个悬浮层。
popover属性有两个值，默认是auto自动模式，支持默认行为，比如点击空白关闭，键盘Esc关闭
popover属性还支持manual手动模式，也就是没有以上默认行为
控制popover有两种方式，分别是声明式和命令式
声明式是指通过HTML属性来实现点击交互
可以通过popovertarget属性将悬浮层的id和按钮相关联，这样就能通过按钮打开悬浮层了
还可以通过popovertargetaction属性来设置点击行为，有show、hide、toggle3种方式
命令式是指通过 JS API来实现对悬浮层的控制，相比声明式而言更加灵活
控制悬浮层的方法有showPopover、hidePopover、togglePopover
CSS伪类:open可以区分悬浮层的打开状态
JS 可以通过matches(':open')来获取悬浮层的打开状态
JS 还可以通过监听toggle事件来获取悬浮层的打开状态，方式是event.newState
相比传统实现，原生popover最大的优势是支持顶层特性



## 7.25 

终于不是很忙碌 

1. TS内置函数 Awaited


正常我们定义一个函数接口，在`api.ts`定义如下
```ts
// api.ts
interface fetchDataReturn {
    name:string,
    age:number,
    sex:boolean
}

function fetchData():Promise<fetchDataReturn> {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve({
                name:'1',
                age:1,
                sex:false
            })
        })
    })
}
```
在调用的地方

``` ts
import { fetchDataReturn, fetchData} from 'api'

async function process() {
  const result: fetchDataReturn = await fetchData();
  console.log(result); 
}
process();
```

Awaited这个内置函数可以帮助我们不需要引入 `return` 类型就可以 获取到data

``` ts
async function process() {
  const result: Awaited<ReturnType<typeof fetchData>> = await fetchData();
  console.log(result); // Output: "Data fetched successfully!"
}
```


2. vite 4.4 更新 更快的css构建

3. 2023 css state https://survey.devographics.com/en-US/survey/state-of-css/2023/outline/2 做个分享吧
