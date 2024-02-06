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


## 1.24

1. puppeteer 相关操作 <https://proxiesapi.com/articles/the-complete-puppeteer-cheatsheet>
2. codepen Top100 2023 <https://codepen.io/2023/popular>
3. React 相关的 可能会用到吧
7个顶级学习平台  <https://javascript.plainenglish.io/7-top-platforms-to-learn-react-for-free-f91a14b23ba7>  
一步一步学习react <https://www.freecodecamp.org/news/how-to-learn-react-step-by-step/>




## 1.25

1. 如何在vue.config.js 引入 自定义loader

``` js
chainWebpack: config => {
// my-loader为loader的别名，./src/myLoader.js是loader的位置
config.resolveLoader.alias.set('my-loader', path.resolve(__dirname, './src/myLoader.js'))
// 修改vue文件Loader的选项，增加新的处理loader
const vueRule = config.module.rule('vue')
vueRule.use('my-loader').loader('my-loader').end()
}

```

## 1.26

1. 多行文本圆角背景 <https://codepen.io/ines/pen/NXbmRO>


## 1.29

## 1.30

1. 嵌套使用的ref会自动解包

``` js
const a = ref(1)
const b = ref({
  a
})

const c = ref({
  b
})

const d = ref({
  c
})

console.log(d.value.c.b.a);

console.log(c.value.b.a);

console.log(b.value.a);
```
   
2. 多个watchEffect 的执行顺序是 书写顺序
3. vue3 中 readonly的使用场景？

## 1.31

1. 今日问题

``` js
// 实现数字格式化，以万、亿为单位，最多展示4位有效数字
function formatNumber(num) {
    // your code
}

console.log(formatNumber(0));           // 0
console.log(formatNumber(1));           // 1
console.log(formatNumber(123));         // 123
console.log(formatNumber(1234));        // 1234
console.log(formatNumber(12345));       // 1.23万
console.log(formatNumber(123450));      // 12.35万
console.log(formatNumber(1234567));     // 123.5万
console.log(formatNumber(12345678));    // 1235万
console.log(formatNumber(123456789));   // 1.235亿


function formatNumber(num) {
  return new Intl.NumberFormat('zh',{maximumSignificantDigits: 4, notation: 'compact'}).format(num);
}
```


## 2.2

1. 水文发现的一个Array.map 比 Array.foreach 在gzip压缩的场景下 会笑3kb
``` js

if (handlers) {
  (handlers as EventHandlerList<Events[keyof Events]>)
    .slice()
    .map((handler) => {
      handler(evt!);
    });
}

if (handlers) {
  (handlers as EventHandlerList<Events[keyof Events]>)
    .slice()
    .forEach((handler) => {
      handler(evt!);
    });
}

```


## 2.4service

1. eslint的 extends 可以简写 比如`eslint-config-xxx` 可以简写为`xxx`
2. 
SaaS：一般用户使用你的在线服务
PaaS：技术用户用你的平台来托管服务，但基建在你这儿
IaaS：技术用户可以自己搞基建



## 2.5 

1. a为什么时 `(a== 1 && a==2 && a==3)` 为真

``` js
const a = {
  i: 1,
  toString: function () {
    return a.i++;
  }
}

if(a == 1 && a == 2 && a == 3) {
  console.log('Hello World!');
}
```


``` js
const a = [1,2,3];
a.join = a.shift;
console.log(a == 1 && a == 2 && a == 3);

```


``` js
let i = 0;
let a = { [Symbol.toPrimitive]: () => ++i };

console.log(a == 1 && a == 2 && a == 3);
```

这个可能有点不合适

``` js
var i = 0;

with({
  get a() {
    return ++i;
  }
}) {
  if (a == 1 && a == 2 && a == 3)
    console.log("wohoo");
}
```

2. 图像相关的一个库 <https://js.cytoscape.org/> 
3. typescript 5.4 更新 <https://devblogs.microsoft.com/typescript/announcing-typescript-5-4-beta/>

保留类型收缩的范围

``` ts
function getUrls(url: string | URL, names: string[]) {
    if (typeof url === "string") {
        url = new URL(url);
    }

    return names.map(name => {
        url.searchParams.set("name", name)
        //  ~~~~~~~~~~~~
        // error!
        // Property 'searchParams' does not exist on type 'string | URL'.

        return url.toString();
    });
}
```

TypeScript 5.4 利用这一点使缩小变得更加智能。当参数和变量在非提升let函数中使用时，类型检查器将查找最后一个赋值点。如果找到，TypeScript 可以安全地从包含函数的外部缩小范围。这意味着上面的例子现在可以工作了。




4. 小球下落 <https://sparkbox.github.io/bouncy-ball/#web-animations-api> 各种各样的API


## 2.6

1. codepen 滚动相关 scroll-timeline `https://codepen.io/giana/pen/BabdgjB`
2. scroll-timeline的用处介绍文章 `https://frontendmasters.com/blog/highlight-text-when-a-user-scrolls-down-to-that-piece-of-text/` 它是通过scroll-timeline 当用户向下滚动到该文本时突出显示该文本
3. `text-wrap:balance`已经很熟悉不说了 ,`text-wrap:pretty` 它告诉浏览器使用更好但更慢的算法来流动文本。这旨在用于正文以提高可读性。 它提供的最受欢迎的好处可能是防止孤儿（孤儿是段落末尾的一个单词，它自己换成一行，这看起来有点尴尬）![](https://pic.imgdb.cn/item/65c1a0609f345e8d039e1567.jpg)
4. 可变字体 <https://v-fonts.com/> 我们通常设置字体字重的时候 很多间隔是没有效果的，这是因为字体不支持。
5. text-area 正常情况下是不会根据输入内容高度变化的。提供一个库<https://github.com/andrico1234/autosize-textarea> 一个css解决方案: <https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/>
6. WebGPU的库 感觉永远用不到了 <https://jmberesford.github.io/webgpu-kit/>