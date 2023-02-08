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