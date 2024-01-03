# 杂项 & 闲聊


## SWC (编译，构建，babel相关)

#### 定义 

SWC 是一个基于 Rust 的可扩展平台，适用于下一代快速开发工具。它被 Next.js、Parcel 和 Deno 等工具以及 Vercel、ByteDance、腾讯、Shopify 等公司使用。

SWC 可用于编译和捆绑。对于编译，它使用现代 JavaScript 功能获取 JavaScript / TypeScript 文件，并输出所有主要浏览器支持的有效代码。

SWC在单线程上比 Babel 快 20 倍，在四核上比Babel 快 70 倍。

官网:<https://swc.rs/>

#### 闲聊

插件存在的问题:

放到前端研发框架这样的复杂业务场景，JS 插件的能力是至关重要的。架构团队另说，我们几乎不可能要求业务方去用 JS 以外的语言去写插件。可是在复杂的场景中，业务几乎离不开对 JS Compiler 有定制化的诉求，比如用的比较多的 babel-plugin-import

值得注意的是，在 swc 的场景下，并不是所有的插件都用 JS 写合适，前文有提到性能问题，swc 的作者也在尽力将 babel 社区主流的插件改用 Rust 来写。但是基于前面的原因，可扩展的 JS 插件是不可或缺的。

1.  没有 presets 的概念
2.  plugin 自身能获取的信息过少：缺失 stat 信息，其中包含了当前正在处理的文件路径；无法给插件传递参数
3.  缺少 @babel/types 这样的生态工具
4.  没有 AST playground

#### 体验与感受

构建时间说到底了是一种体验优化，所以在对研发框架进行改造的过程中，一定是不能捡了桃子丢了西瓜的（为什么是桃子？因为开发体验可比芝麻要重要的多）。评价一个研发框架是否好用，除了构建时间，还有开发效率、可扩展能力、稳定性等等更多维度的东西。

babel 确确实实已经经历过太多的考验和迭代，即使 swc 已经快三年了，并且一定程度上站在巨人的肩膀上，但依然有很多事情要做，尤其它的定位是取代 babel。

目前的结论是，研发框架暂不适合将 swc 投入到生产环境使用，短期内可能会以实验性属性的形式透出，未来会看 swc 的发展来决定怎么处理。


## typescript 报错 无法重新声明块范围变量

直接看问题

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

## 一个性能优化问题 （打包，白屏，外链）

有人问：我们把第三方库代码打到了业务里面 如果用外链的形式引入第三方库, 会减少白屏的效果吗?

回答：

需要分常见考虑： 01. 首次加载 02. 二次加载 03. 首次加载后,有新版本发布 04. 你的静态资源有没有设置缓存 05. 发布策略,增量发布还是替换发布

首次加载 没有缓存 发两个 bundle 和 打进一个 bundle 的区别不大
第三方库独立引入的好处是 发新版本 这部分以来无需更新的话 可以享受到他的缓存
其次就是同站点下的其他页面公用这个缓存
拆分来发 利用浏览器的并行请求 是可以减少白屏

如果拆开来发 用 http2 反而会因为多路复用而降低性能(处理HTTP协议版本可能造成阻塞，网络带宽也有最大限制)
如果你要加载的本身就是大文件, 此时的瓶颈是带宽而不是延迟 这种情况没必要拆
如果是 bundle 的话 至少要把 vendor 拆出来 这样能利用缓存

不常维护的系统 就 http2 和 拆包选一个

多路复用只是降低了 链接延迟 但把一些并行的请求变成了串行



## 前端监控手段

web-see 监控提供三种错误还原方式：定位源码、播放录屏、记录用户行为
rrweb 提供回放功能
sentry 集合功能

## 位运算

js 的位 运算效率超级低, 因为 js 的 number 并不是 int 没法直接算

chromium 在执行 js 之前会试图做优化 实际上 | 运算符 会被转化成调用 IrOpcode::BitwiseOr

一个按位 or 光是编译器就要做这么多：
<https://source.chromium.org/chromium/chromium/src/+/main:v8/src/compiler/js-type-hint-lowering.cc;l=461?q=JSBitwiseOr&ss=chromium%2Fchromium%2Fsrc>

运行时 turbofan(<https://v8.dev/blog/turbofan-jit>) 还会做一些优化

例如如果发现一个数字在 1w 次循环中都是 int, 就会优化成 int 的 or，如果发现了不好的写法（如某次循环中发现某个数字不是 int 了）则会推翻之前的优化，重新用慢的方法

你以为写的 js，实际上被转换成了一堆 runtime 的调用。。很多语言都这样，go 也是，一个 make 会被转换成 runtime 的各类函数，取决于 make 的参数是啥

现代编程语言已经不再是编译成纯二进制执行了，大多是基础功能转换为二进制、复杂功能转换为 runtime 调用。。语言的功能多少也就取决于 runtime 提供的功能有多少

这是 JIT(Just In time)通用的东西, 不光 chromium 有, 但 js 这种语言过于灵活 , 一个变量啥类型都有 所以实际上我们以为的底层操作反而会很慢

## 块语句 {} 

值得注意的是：块语句（大括号”｛｝＂中间的语句），如 if 和 switch 条件语句或 for 和 while 循环语句，不像函数，它们不会创建一个新的作用域。

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

## Infinity 与 Number.Max_Value Number.Max_SAFE_INTEGER

Infinity 一般用于简化算法, 作为哨兵数字  

在一些 没有 Infinity 的场景 (如 C 语言切数据类型为 Int)下 会使用-1 或者一个很大的数字来代替, 不过要特别判断一些东西 ,infinity 几乎不需要做特别判断

例如归并排序的归并流程 , 只要在两个系列末尾加入一个 Infinity , 就不需要判断一个序列已结束了

Math.main 也是 如果另初始值为 Infinity 就只需要 for 循环 不需要特判 ‘如果是第一个元素 则把它赋值给 result 了

当然他也是作为 IEEE754 浮点数的一部分 , 用作 1/0, 在 js 中只要数字的运算结果超过一定大小 也会变为 Infinity

至于 Number.MAX_VALUE 一般用不到 ,业务中常用的是 number.MAX_SAFE_INTEGER 用于避免整数过大导致精度问题 (例如 API 返回的 order ID 如果超过了这个数字 前端就没办法展示 后端必须用 String 返回)

MAX_VALUE 几乎没有什么意义 不会有业务判断的数字这么大


## 定时器 Date.now() performance.now();

当前时间是实时取的,它的精准度只取决于取数字的函数 例如,Date.now 就是毫秒级 performance.now 就更精确一点 所谓的

16.7ms 导致的误差其实是你点不准 也就是计数器没法在你点击的时候瞬间停止 但是计时器停止了之后 去到的时间一定是准确的


## 代码性能（复杂度）

有时候前端还是要了解一下 一些常见操作的复杂度 不然哪天把 n 的复杂度 搞成了 n^ 2 就不好了

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

## 前/后/客户端端

我倒是比较看好 flutter 因为原生实现迟早会被优化 除非当下的需求必须要求性能,否则比较推荐原生, 代码简单而且未来有潜力

前端这些年的新东西大都是让代码写的更优雅 而后端的新东西大多都是在解决业务问题

一个前端目前遇到的业务挑战没有后端那么多, 一个是后端的语言,概念,工具都很成熟了 ,目前的瓶颈是水平扩展 高可用 数据一致性

后端的请求量一上来 ,之前所有的架构几乎都要推翻, 至于后端写前端，只是他们缺少一个管理页面罢了 , 而且很久以前后端也要写页面，只是现在分开了而已


## v8源码查看 

v8 的 Map 使用 OrderedHashTable 做的 是一个维持 key 插入顺序的 hash 表

反正想看某个 js 类型这么实现的 直接去搜 v8/src/objects 下面找 或者全局搜索 JSxxx 例如 JSNumber JSBigint JSmap

如果遇到数据结构（例如这儿的 OrderedHashTable），一般里面都会附上注释，图中的注释还给了 MDN Wiki 的参考链接：https://wiki.mozilla.org/User:Jorend/Deterministic_hash_tables

它的搜索做的非常好 可以搜关键字 也可以基于 reference 跳转


## npm cache相关

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


## 小程序picker-view问题 

微信小程序 picker-view 的问题

picker-view 的 bindchange 事件（选项变更事件）会随着动画结束延迟触发，目前动画时长太久，导致 bindchange 触发延迟太久

只要滚得快一点，那么通知事件就会迟到，导致用户点击确认按钮后得到的数据和其看到的选择项会不一样

问题描述的地址

https://developers.weixin.qq.com/community/develop/doc/0002c6f63c86b8cccd17af72c56c00?page=1

https://developers.weixin.qq.com/community/develop/doc/00086ede9f4af82fdd8ca65be54c14

暂时的解决方案
![](https://pic.imgdb.cn/item/63f748acf144a010078992b5.jpg)


