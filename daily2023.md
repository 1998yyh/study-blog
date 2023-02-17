# 2023 年每日笔记 

## 1.30 

1. swc

插件存在的问题: 

放到前端研发框架这样的复杂业务场景，JS 插件的能力是至关重要的。架构团队另说，我们几乎不可能要求业务方去用 JS 以外的语言去写插件。可是在复杂的场景中，业务几乎离不开对 JS Compiler 有定制化的诉求，比如用的比较多的 babel-plugin-import

值得注意的是，在 swc 的场景下，并不是所有的插件都用 JS 写合适，前文有提到性能问题，swc 的作者也在尽力将 babel 社区主流的插件改用 Rust 来写。但是基于前面的原因，可扩展的 JS 插件是不可或缺的。

1. 没有 presets 的概念
2. plugin 自身能获取的信息过少：缺失 stat 信息，其中包含了当前正在处理的文件路径；无法给插件传递参数
3. 缺少 @babel/types 这样的生态工具
4. 没有 AST playground



体验与感受 :

构建时间说到底了是一种体验优化，所以在对研发框架进行改造的过程中，一定是不能捡了桃子丢了西瓜的（为什么是桃子？因为开发体验可比芝麻要重要的多）。评价一个研发框架是否好用，除了构建时间，还有开发效率、可扩展能力、稳定性等等更多维度的东西。

babel 确确实实已经经历过太多的考验和迭代，即使 swc 已经快三年了，并且一定程度上站在巨人的肩膀上，但依然有很多事情要做，尤其它的定位是取代 babel。

目前的结论是，研发框架暂不适合将 swc 投入到生产环境使用，短期内可能会以实验性属性的形式透出，未来会看 swc 的发展来决定怎么处理。



## 2.1

1. 解决typescript 报错 无法重新声明块范围变量,从而导致编译报错 报错如下

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

所以需要我们手动去删除掉 ` export {}` , 已经有包`@babel/plugin-transform-modules-commonjs` 满足需求 
使用方法
``` js
{
  plugins:[
    '@babel/plugin-transform-modules-commonjs'
  ]
}
```



## 2.2 

1. 我们吧第三方库代码打到了业务里面  如果用外链的形式引入第三方库, 会减少白屏的效果吗?

答:

分场景 :
1. 首次加载
2. 二次加载
3. 首次加载后,有新版本发布
4. 你的静态资源有没有设置缓存
5. 发布策略,增量发布还是替换发布


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

1. 在Esmodule 使用__dirname 

``` js
import path, { dirname } from "path"
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url));
```


2. 前端监控方法

https://juejin.cn/post/7172072612430872584

3. 检测白屏方法 : web-see


4. css 波浪 wave : https://codepen.io/andyfitz/pen/wvxpBWL


## 2.5

1. 讨论关于js使用位运算 

终于追到了。。。。要说到 v8 如何实现位运算，一个按位 or 光是编译器就要做这么多：
https://source.chromium.org/chromium/chromium/src/+/main:v8/src/compiler/js-type-hint-lowering.cc;l=461?q=JSBitwiseOr&ss=chromium%2Fchromium%2Fsrc
运行时 turbofan 还会做一些优化，例如如果发现一个数字在 1w 次循环中都是 int 就会优化成 int 的 or，如果发现了不好的写法（如某次循环中发现某个数字不是 int 了）则会推翻之前的优化，重新用慢的方法


你以为写的 js，实际上被转换成了一堆 runtime 的调用。。很多语言都这样，go 也是，一个 make 会被转换成 runtime 的各类函数，取决于 make 的参数是啥

现代编程语言已经不再是编译成纯二进制执行了，大多是基础功能转换为二进制、复杂功能转换为 runtime 调用。。语言的功能多少也就取决于 runtime 提供的功能有多少

但 js 这种语言过于灵活，一个变量啥类型都有可能，所以实际上我们以为的底层操作反而会很慢

## 2.6

1. 值得注意的是：块语句（大括号”｛｝＂中间的语句），如if和switch条件语句或for和while循环语句，不像函数，它们不会创建一个新的作用域。

不对，块级是有独立的作用域的，但是比起lexical作用域定义会松一些

``` js
let a=1;

{let a=2; console.log(a);}

var a=1; 

{ var a=2; console.log(a); }

console.log(a);

// 报错
// Uncaught SyntaxError: Identifier 'a' has already been declared at <anonymous>:1:1


```


## 2.7

1. uni-app 生命周期顺序 

App launch -> App Show -> page onLoad -> paeg onShow -> component beforeCreate -> component created -> component mounted -> page onReady



## 2.8 

专心工作 无心抓鱼


## 2.9 

1. web 版本更新提示

https://juejin.cn/post/7159484928136642567

https://juejin.cn/post/6995385715672481799


## 2.10

1. 如果是node直接查数据库,推荐直接使用node的技术展 例如 sequelize 或者 typeorm 

2. mybatis 跟 node 生态差的有点远 虽然手动转化也能做 但是 orm 也好 active record 也好 不就是为了以后可以增加字段关联的时候不用改那么多代码 手动转就失去了这个优势了

3. 真正计算密集型的东西还得看性能, 多喝只是只吃了横向扩展 但是碳排放还是挺高

4. 服务基本就这几个 服务发现 心跳检测 冒烟检测 复杂均衡

冒烟检测: 一些基本的检测 有些时候服务不是跑起来就能接受流量的 会有一些预加载和预处理 只有这些检测完毕之后 冒烟检测才会通过 负载均衡才会把流量引过来


5. 即使是ts 用ts-node运行的本质也是线打包 , 之后运行js 只能说冷启动的时间 会稍微慢一点点 这对serverless(或者叫函数计算)来说是致命的,但他们也有解决办法,不一定非得降低冷启动时间

6. 静态文件肯定是nginx厉害 单实例百万链接 不过静态文件最好还是扔到cdn vue有一种写法是可以不打包直接挂到nginx后面,让浏览器运行 没有人会在线上跑dev server

7. 后端框架 python 有flask 和 django, go基本是gin搭起来的 , nodejs有egg next koa express , php 有laravel,thinkphp 
  即使不提语言差异,后端也会纠结mySql和mariaDB哪个好,RocketMq和Kafka该用哪个
  java我不太了解 因为他似乎是主流语言中唯一一个 没有ide我深知连项目都不会编译 的语言 于是就一直没有怎么接触过


8. js的数组并不是严格的数组实现, 而是类似于c++的vector (对于稀疏数组V8甚至用了哈希表),所以即使你pop了, 占用空间也没办法立即减少

9. Infinity 一般用于简化算法, 作为哨兵数字  
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
xxx.reduce((acc,cur)=>({
  ...acc,
  [cur.key]:cur.value
}),{})

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

1. Object.is(NaN,NaN) 和 isNan(NaN) 没有区别
2. Number.isNaN() 和 isNaN 有一个转化的区别 isNaN(x) = Number.isNaN(Number(xx))


## 2.14

1. 画一条三次贝塞尔曲线曲线   https://codepen.io/Chokcoco/pen/mdGdejG

## 2.15

忙

## 2.16

忙

## 2.17

1. Jest 单元测试 如果需要使用浏览器中API 需要配合js-dom
2. `color-contrast`  color-contrast()函数符号接受一个颜色值，并将其与其他颜色值的列表进行比较，从列表中选择对比度最高的一个。
3. npm cache 

NPM缓存是节点包管理器在安装新包时使用的存储在计算机上的包的集合。这个缓存有助于加快安装过程，因为它不需要重复下载相同的包。缓存还允许NPM跟踪你的计算机安装了哪些扩展、文件和包。

不幸的是，随着时间的推移，这个缓存文件夹可能会变得混乱，因为NPM会定期更新旧包或安装新包。这种混乱可能会导致安装新包时出现问题，因为它可能无法识别机器上已经安装了哪些文件。

首先我要说的是，不建议清理NPM缓存，除非你因为数据损坏问题而面临错误，或者只是想释放磁盘空间。NPM非常擅长处理缓存，如果有异常，它会尝试自动修复它或让你知道任何可能的损坏。

这里有一些你可能想要清理你的NPM缓存的原因:

1. 释放磁盘空间。
2. 消除“Please run npm cache clean”错误。
3. 修复无法正确下载的库。
4. 重新安装没有缓存的库(虽然不知道为什么你会这样做)。

``` js
npm cache clean --force  
```

这个命令将删除NPM缓存中存储的所有数据，包括任何过时版本的包。请注意，在运行此命令时使用" -force "标志非常重要，因为它可以确保删除所有数据，即使可能由于缓存损坏或其他原因而出现错误。

``` js
npm cache verify
```

npm cache verify是一个命令，用于验证npm缓存中所有已安装包的完整性。它验证缓存文件夹的内容，垃圾收集任何不需要的数据，并验证缓存索引和所有缓存数据的完整性。

删除NPM缓存不同于从项目中删除node_modules文件夹。NPM缓存对于您的计算机是全局的，而node_modules文件夹则存储在每个项目中。如果你只是删除node_modules文件夹并重新安装所有的包，你仍然可以从NPM缓存中获取这些包，并且清理NPM缓存，不会影响你的项目库。

NPM缓存是NPM包管理器的重要组成部分，它有助于加快安装过程，并跟踪在您的机器上安装了哪些包。清理NPM缓存可以帮助释放磁盘空间，修复损坏的库，并避免遇到“请运行NPM缓存清理”错误。

不建议清理NPM缓存，除非你真的需要，但如果你需要它，现在你知道怎么做了。

4. https://javascriptkicks.us9.list-manage.com/track/click?u=4ba84fe3f6d629e746e48e5b7&id=1d04ca3374&e=cfe47b0953 

interface 和 type的区别 

5. TresJS Bring Three to the Vue ecosystem 这个库将threejs 引入 vue的生态系统

地址 - https://tresjs.org/

