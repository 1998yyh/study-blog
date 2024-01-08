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
