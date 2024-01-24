# 2024

## 1.1
元旦摆烂

## 1.2
元旦调休摆烂

## 1.3 
## 1.4
## 1.5

一个效果

<https://codepen.io/wheatup/pen/PoLZLXZ/a340269f2d6ebcfc371994574e396ea1?editors=1100>

## 1.6 

1. 2023年github 涨星最快的项目

<https://risingstars.js.org/2023/en#section-all>

挑几个看了看 

+ shadcn/ui 用 React 编写的 UI 组件的集合，允许通过 TailwindCSS 进行自定义样式。与传统的组件库不同的是 他不是通过npm 安装而是通过 CLI 交付，该 CLI 将组件的源代码放入项目本身。

> 为什么复制/粘贴而不打包为依赖项？
> 其背后的想法是赋予您对代码的所有权和控制权，允许您决定如何构建组件和设计样式。
> 从一些合理的默认值开始，然后根据您的需要自定义组件。
> 将组件打包在 npm 包中的缺点之一是样式与实现耦合。组件的设计应该与其实现分开。

+ 手绘的虚拟白板，项目地址 <https://excalidraw.com> <https://www.tldraw.com>
+ Tarui 移动端构建

> vue生态
> 随着Vue 2宣布将于 2023 年底停用，今年被认为是 Vue 及其社区的转折点，我们中的许多人开始了升级到版本 3 的旅程。
> 在这方面，我们努力帮助迁移，生态系统迎头赶上并不断发展：它显示出了巨大的成果！Nuxt 3现在的下载量比 Nuxt 2 更多。UI 框架（如Vuetify和PrimeVue）比以往任何时候都更容易帮助构建大型（和较小的！）应用程序。VueUse、Pinia甚至TresJS 等库不断发展和增强自身，以更好地为我们所有人提供支持。
> 
> 与 2022 年一样，开发者体验仍然是重中之重。Vue 3.3改进了对`<script setup>`. Nuxt 发布了 8 个小版本，并推出了Nuxt DevTools，这是一个富有创意且富有洞察力的 UI，可以帮助我们更好地理解我们的应用程序并更快地开发它们。
> 
> 展望未来，正如 Evan 所说，2024 年对于 Vue 来说将是激动人心的一年。Vue 3.4 即将到来，Vapor 模式现已开源，进展顺利。所有这些都在新的一年中进行了调整，以实现更多的性能改进和社区创新。

+ Nuxt  
+ slidev vue 幻灯片 <https://sli.dev/guide/why.html>


> 构建工具
> Bun也是一个捆绑器，因此我们今年将其纳入“构建工具”类别。
> 
> 两年后，Vite仍然是最受欢迎的多功能捆绑器，为 Astro、Nuxt、Remix、SolidStart、SvelteKit 等元框架提供支持...
> 
> 11 月发布的版本5建立在 rollup 4 之上，带来了性能改进。
> 
> Evan You宣布他正在开发 Rolldown，这是 Rust 中 Rollup 的一个端口，将集成到 Vite 中。所以Vite的未来是光明的！
> 
> 三季度的时候 Biome的崛起是今年的故事之一。它与Roma的陷落有关，这是一个雄心勃勃的项目，旨在统一工具（编译、linting、格式化、捆绑、测试）。该项目背后的公司失败了，该项目今年被叫停。
> 
> 幸运的是，该项目被分叉并以 Biome 的名义重生。
> 
> 11 月，Biome 赢得了Prettier 挑战：创建“一个基于 Rust 的代码格式化程序，可以通过超过 95% 的 Prettier 测试”。Prettier 是这样一个标准，我们预计 2024 年 Biome 会有更多采用。
> 
> 说到 Rust，Oxc和Rspack是这个领域的新玩家，来自字节跳动团队。 Rspack提供与 Webpack 的兼容性，同时提供无与伦比的性能。自从我们举办新星评选以来，这是第一次，考虑到使用 Webpack 的项目数量，在排名中没有看到 Webpack 是很奇怪的！

+ Bun
+ vite
+ Biome
+ Rspack 字节的
+ Turborepo 当初号称比vite快十倍的
+ swc Rust版babel 

> 测试工具
+ Playwright 微软出的一个测试工具
+ Storybook UI测试工具 <https://storybook.js.org/>
+ Puppteer 无头浏览器
+ vitest 


2. 比较有意思的 MySql 将会引入`javascript`的语法 <https://blogs.oracle.com/mysql/post/introducing-javascript-support-in-mysql>
3. RSC 比较清晰的一个讲解： <https://juejin.cn/post/7254901061176950844>
4. 一个外网的vite课程 :<https://frontendmasters.com/courses/vite/> 想办法搞个翻译的



## 1.7 

## 1.8

1. subtree 拉取代码报错

背景是这样 A项目 使用了subtreeA  B项目也使用了subtreeA 
A提交了一些commit 到A分支 B项目也需要对子项目更改，但是它没有拉取A项目的提交，然后直接提交
A项目去拉取代码的时候 报错下面的。

subtree: Can't squash-merge: 'foo' was never added.

<https://stackoverflow.com/questions/9777564/git-subtree-pull-complications>

我们最简单的方法是 删除A项目的tree 重新ADD一下。



2. vite 依赖预构建相关

场景是这样，我们有一个组件库，然后一个项目，当项目修改需要修改组件库时，通过npm link / 发包的形式 在项目中使用，但是


## 1.9

1. vite的项目有啥插件可以访问alias的路径（import api from "@/api"）内容吗？现在鼠标放上去不能跳转了

ts config 配置 `/// <reference types="vite/client" />`
js config 配置 
``` json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*","src/**/*.{js,jsx,vue}"],
  "exclude": ["node_modules", "dist", "createVueTemplate", "dll", "public"]
}

```

2. 题目

``` js
const group = (arr, count) => { /* 代码 */ };

const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

group(input, 4);
// 输出
[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15]]
```

解法
``` js
const group = (arr,count) => arr.flatMap((v,i)=> i % count ? [] : [input.slice(i,i+count)])

const group = (arr, count)=> Object.values(Object.groupBy(arr,(_,i)=>~~(i/count)));

const group = (arr, count) => arr.reduce((result, _, index) => ((result[index / count >> 0] ||= []).push(arr[index]), result), []);
```

3. ra2协议



## 1.10

1. subtree 的问题 

会遇到`rev-parse split hash commitId1 from commit2` 这种报错 ，是另一个人提交了split，在当前分支后，所以葱新的commit 去递归找不到信息，所以需要先pull 一下 再去push

遇到`working tree has modifications . cannot add` 这种事拉下来冲突了 或者拉下来代码 只是放在了缓存区 需要手动commit push 


2. uni-app 组件样式穿透 

页面级的可以去修改组件的样式 ， 组件无法修改组件的样式。如果想改 ，通过全局css文件去改。


## 1.11

1. promise.reject(reason) 如果不是Error会有警告，

通过修改eslint规则 `'prefer-promise-reject-errors': 'off'` 取消掉该报错。



## 1.12

1. vite依赖预构建

指的是在 DevServer 启动之前，Vite 会扫描使用到的依赖从而进行构建，之后在代码中每次导入(import)时会动态地加载构建过的依赖这一过程

 vite 启动项目时，项目 node_modules 目录下会额外增加一个 node_modules/.vite/deps,这个目录就是 vite 在开发环境下预编译的产物。

 项目中的依赖部分： ahooks、antd、react 等部分会被预编译成为一个一个 .js 文件。

同时，.vite/deps 目录下还会存在一个 _metadata.json,_metadata.json 的文件用来保存预编译阶段生成文件的映射关系(optimized 字段)，方便在开发环境运行时重写依赖路径。


为什么需要预构建 ?

首先第一点，我们都清楚 Vite 是基于浏览器 Esmodule 进行模块加载的方式。

那么，对于一些非 ESM 模块规范的第三方库，比如 react。在开发阶段，我们需要借助预构建的过程将这部分非 esm 模块的依赖模块转化为 esm 模块。从而在浏览器中进行 import 这部分模块时也可以正确识别该模块语法。

另外一个方面，同样是由于 Vite 是基于 Esmodule 这一特性。在浏览器中每一次 import 都会发送一次请求，部分第三方依赖包中可能会存在许多个文件的拆分从而导致发起多次 import 请求。

比如 lodash-es 中存在超过 600 个内置模块，当我们执行 import { debounce } from 'lodash' 时，如果不进行预构建浏览器会同时发出 600 多个 HTTP 请求，这无疑会让页面加载变得明显缓慢。

通过依赖预构建，将 lodash-es 预构建成为单个模块后仅需要一个 HTTP 请求就可以解决上述的问题。

基于上述两点，Vite 中正是为了模块兼容性以及性能这两方面大的原因，所以需要进行依赖预构建。

> 如果出于某些原因你想要强制 Vite 重新构建依赖项，你可以在启动开发服务器时指定 --force 选项，或手动删除 node_modules/.vite 缓存目录。


**遇到的问题**

如果我们有两个项目，主项目A与组件库项目B，某次需求我需要去修改项目A 与 组件库B ， 我希望在A中修改B（不管是那种方式）当我更改了`node_modules`中B项目代码，期望是可以A项目自动刷新 并运用更改后的B代码。


主要的问题其实有两点，一是我们需要吧B项目 从预构建中剔除掉，二是我们需要在`node_modules`变化时热更新一下

剔除的方法：`vite.config.js`中有配置是`optimizeDeps`可以指定不预构建和构建某些地址的文件。

比如

``` js
export default defineConfig({
  optimizeDeps: {
    // 预构建某些
    include: ['esm-dep > cjs-dep'],
    // 或者忽略某些
    exlude:[],
    // 强制不使用预构建
    force:true,
  }
})
```

监听更改后代码的方法：

> 目前没有可行的方式来监听 node_modules 中的文件。若要了解更多详情和可能的临时替代方案，你可以关注 issue #8619<https://github.com/vitejs/vite/issues/8619>。

原文文档地址：
https://cn.vitejs.dev/config/server-options.html#server-watch


除了上面这几种方法，anfu大佬开发了一个插件<https://github.com/antfu/vite-plugin-restart/issues/10> 

是否可用暂时没有试。


2. Select 遇到的一个小问题 

``` html
<div id="app">
  <textarea id="summary" cols="30" rows="10">
    Hello how are you!
  </textarea
>
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

现象是这样的 先选中一段 然后去点击按钮 此时也会触发输出 (只在chrome出现)



## 1.15


## 1.16

1. 可选链函数调用 `a?.()`
2. 在浏览器环境执行node,`webcontainer`<https://juejin.cn/post/7250009632253411365>
3. vscode 源码各种看解析的 <https://juejin.cn/post/7235847450765836348#heading-12>
4. uni app 新版本 极验插件失效

## 1.17

1. 大佐分享的一个权限管理

``` js
const Permissions = {
  VIEW:1,
  SUBMIT:2,
  EDIT:4,
  MANAGEMENT:8
}

const { VIEW , SUBMIT, EDIT ,MANAGEMENT } = Permissions

const guest = VIEW;
const user = VIEW | SUBMIT | EDIT;
const admint = VIEW | SUBMIT | EDIT |MANAGEMENT;

const hasPermission = (role,permission) => !!(role & permission);
console.log(hasPermission(guest,EDIT));
console.log(hasPermission(admin,EDIT))


```


2. 一个插件 `import cost` 计算引入包的体积
3. localstorage.clear 间接调用会报错。
``` js
const clear = localStorage.clear;
clear();
// 报错 this上下文丢了，调用会报错
``` 


## 1.23 

1. console-delight  我们可以在控制台做彩蛋
<https://frontendmasters.com/blog/console-delight/>

2. 一个很好的DEMO 结合和`view-transition` 和 `has`
<https://codepen.io/web-dot-dev/pen/wvOzRPM>
3. `subgrid` `view-timeline` `@property` 等结合的一个dmo
<https://codepen.io/argyleink/pen/vYQQEmo>

4. 不作用于SEO的属性 `data-nosnippet <span data-nosnippet>This is sensitive information.</span>`
5. a11y测试工具，插件 <https://github.com/pa11y/pa11y>
6. 关于尺寸设计的理念 <https://ishadeed.com/article/target-size/?utm_source=CSS-Weekly&utm_medium=newsletter&utm_campaign=issue-573-january-10-2023> 提升用户体验相关
7. 一个纯css进度条的视频可以配置中文字幕看 <https://www.youtube.com/watch?v=FWn8HBFQ4n4>
8. 中断forEach的方法 

``` js
// throw Error
const array = [ -3, -2, -1, 0, 1, 2, 3 ]

try {
  array.forEach((it) => {
    if (it >= 0) {
      console.log(it)
      throw Error(`We've found the target element.`)
    }
  })
} catch (err) {
  
}

// 修改长度

array.forEach((it) => {
  if (it >= 0) {
    console.log(it)
    array.length = 0
  }
})

// 修改原数组
array.forEach((it, i) => {
  if (it >= 0) {
    console.log(it)
    // Notice the sinful line of code
    array.splice(i + 1, array.length - i)
  }
})
```