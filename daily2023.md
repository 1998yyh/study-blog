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