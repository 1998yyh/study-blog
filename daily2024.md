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


7. javascript 中的 AO 


在 JavaScript 中，AO 代表激活对象（Activation Object），是函数执行时创建的一个隐藏的数据结构。它包含了函数执行时所需的信息，包括：函数的参数，函数的局部变量，函数的执行上下文，函数的返回值
AO 是 JavaScript 函数执行机制的重要组成部分。它可以确保函数在执行时拥有独立的执行环境，并且不会相互影响。



## 2.7

1. 2023年遇到的兼容性问题 https://juejin.cn/post/7309040097936343103

## 2.26 

春节休假20天 摆大烂

1. 白屏检测(Mutation Observer)：

使用 Mutation Observer 来监听 DOM 变化，从而判断页面是否白屏。需要注意的是，判断页面是否白屏的阈值时间应该根据页面的实际情况来确定，如果设置时间太短可能会误判，设置时间太长可能会影响页面性能。

同时如果用户长时间未操作DOM，Mutation Observer 监听到一定时间内没有 DOM 变化，就可能会误判为页面白屏。


Mutation Record 提供具体的 DOM 变更记录,可以支持白屏问题的回溯与定位。而检测根节点渲染无法提供问题的详细诊断信息。例如,如果一段时间内 DOM 变化只有删除元素操作,几乎没有新增或更新操作,可以判断可能存在删除逻辑错误导致白屏,这可以作为问题回溯的参考信息。
那如何利用Mutation Observe进行问题回溯呢？



2. 白屏检测(document.elementsFromPoint):


在我们的屏幕中，随机取几个固定的点，利用document.elementsFromPoint（x,y）该函数返还在特定坐标点下的 HTML 元素数组。

``` html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div class="main"></div>
  <script>
    function onload() {
      if (document.readyState === 'complete') {
        whiteScreen()
      } else {
        window.addEventListener('load', whiteScreen)
      }
    }
    let wrapperElements = ['html', 'body', '.content'] //首先定义容器列表
    let emptyPoints = 0 //空白点数量
    function getSelector(element) { //获取节点的容器
      if (element.id) {
        return '#' + element.id
      } else if (element.className) {  //content main==> .content.main  主要为了处理类名是多个的情况
        return '.' + element.className.split(' ').filter(item => !!item).join('.')
      } else {
        return element.nodeName.toLowerCase()
      }
    }

    function isWrapper(element) { //判断关键点是否在wrapperElements定义的容器内
      let selector = getSelector(element)
      if (wrapperElements.indexOf(selector) != -1) {
        emptyPoints++ //如果采样的关键点是在wrapperElements容器内，则说明此关键点是空白点，则数量加1
      }
    }

    function whiteScreen() {
      for (let i = 1; i <= 9; i++) {
        let xElement = document.elementsFromPoint(window.innerWidth * i / 10, window.innerHeight / 2)//在x轴方向上，取10个点
        let yElement = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i / 10)//在y轴方向上，取10个点
        isWrapper(xElement[0])
        isWrapper(yElement[0])
      }
      if (emptyPoints != 18) {//如果18个点不都是空白点，则说明页面正常显示
        clearInterval(window.loopFun)
        window.loopFun = null
      } else {
         console.log('页面白屏了');
        if (!window.loopFun) {
          loop()
        }
      }
    }

    window.loopFun = null

    function loop() {
      if (window.loopFun) return;
      window.loopFun = setInterval(() => {
        emptyPoints=0
        whiteScreen()
      }, 2000)
    }
    
    onload()
  </script>
    <script>
      let content = document.querySelector('.main')
      setTimeout(() => {
        content.style.width = '500px'
        content.style.height = '500px'
        content.style.backgroundColor = 'red'
      }, 4000);
    </script>
</body>

</html>

```


3. toggle 最常见的是`DOMTokenlist.toggle` 方法，这里的`DOMTokenList` 表示一组空格分割的标记，最常见的就是`Element.classList`

``` html
<div class="a b c"></div>

```

通过`el.classList` 可以获取到class的详细信息

``` js
el.classList.toggle('a'); // 移除 a
el.classList.toggle('a'); // 添加 a
```

通过上面这个，浏览器会动态判断，如果存在就移除，如果不存在就添加。

toggle还支持第二个参数，表示强制，是一个布尔值，为 true表示添加，反之为移除，而不管当前是什么状态

4. toggleAttribute 是用来切换属性的

比如控制一个输入框的禁用和开启。

``` js
input.toggleAttribute('disable');

input.disabled = !input.disabled;

document.body.toggleAttribute('dark');

// 第二个参数表示强制
document.body.toggleAttribute('dark', ture); //添加dark属性
document.body.toggleAttribute('dark', false);//移除dark属性

// 也可以使用常规手段
document.body.setAttribute('dark', ''); //添加dark属性
document.body.removeAttribute('dark');//移除dark属性
```


5. togglePopover 是新出来的，是针对popover元素推出的打开与关闭的方法。

``` js

popoverEl.togglePopover(); //切换 popover
popoverEl.togglePopover(true); //打开 popover
popoverEl.togglePopover(false); //关闭 popover

// 打开
popoverEl.togglePopover(true)
// 等同于
popoverEl.showPopover()

// 关闭
popoverEl.togglePopover(false)
// 等同于
popoverEl.hidePopover()
```

6. toggle event
这个也是跟随poperver推出的，可以通过event对象获取当前的新状态和旧状态，如下

``` js
popover.addEventListener("toggle", (event) => {
  if (event.newState === "open") {
    console.log("Popover has been shown");
  } else {
    console.log("Popover has been hidden");
  }
});

// 有意思的是，这个事件同时也支持details元素
details.addEventListener("toggle", (event) => {
  
});
```


7. 字节题

希望可以解构出来

``` js
let [a,b]={a:1,b:2}

console.log(a,b);//TypeError: {(intermediate value)(intermediate value)} is not iterable
```

我们知道第一行等号左边的数组[a,b]是可迭代的，右边的对象{a:1,b:2}不可迭代的。那么我们应该‘使’命的想办法让右边的对象变成是可迭代的。既然对象身上没有迭代器属性，那我们就给它加一个！


``` js
Object.prototype[Symbol.iterator] = function(){//Symbol.iterator属性返回的是函数
  return []  //此处应该返回的是一个迭代器对象，不是[]，直接{}也不可行
}
let [a,b]={a:1,b:2}

console.log(a,b); //TypeError: undefined is not a function
```


我们可以看到报的错不再是not iterable,而是undefined is not a function！这是因为Symbol.iteratorreturn出来的一个迭代器对象，所以这样也是不可行的。

再来，我们想数组的解构只能往数组解构，那么我们把对象转成数组，就是硬生生的把对象的值转为[1,2],也就是把值抠出来不要key,那么此时才能解构成立。


``` js
Object.prototype[Symbol.iterator] = function(){//Symbol.iterator属性返回的是函数
  //返回一个Array类型的可迭代对象
  return Object.values(this)[Symbol.iterator]() //this指向实例对象,Object.values(this)得到的是数组
}
let [a,b]={a:1,b:2} //实例对象 相当于获得[1,2]

console.log(a,b); //1 2
```


## 2.27

1. 冬令时 / 夏令时 问题 

比如德国在`2023-10-29`凌晨3点 会进入冬令时，即当我们时间到了2:59即将走完时，会自动跳转到2:00, 此时当天就是25小时，如果我们计算第二天日期是选择当前时间+24h的时间戳去做的话，会有问题。

所以需要我们去设置时间，setDate这样。

另外`Date.getTimezoneOffset` 回在 UTC 时区中计算的此日期与在本地时区中计算的同一日期之间的差异（以分钟为单位）。 它是会自动考虑令时的。

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset>


## 2.29

1. https://nextjs-book.innei.in/ 
2. 闰年怎么算 正则`/^((\d?\d?((0|^)[48]|[2468][048]|[13579][26])(00)?)|0+)$/`


## 3.05

1. 获取数字长度 `Math.ceil(Math.log10(number))` 或者 `String(number).length`


## 3.06

1. Rex 对于eventLoop的理解: 

不同的异步操作属于不同的任务集合，例如 setTimeout 属于 callbacks ，fetch 属于 networking，addEventListener 属于 user interaction，insertBefore（如果没有强制重排）则属于 DOM manipulation

然后某个时刻某个 task source 里面有任务可以被执行了，运行环境就会生成一个叫 event loop 的东西（对，这是一个名称，不是动作），这个 event loop 有几个属性：当前运行的任务（就是那个 task）、一个或多个微任务队列（在这个 task 中产生的微任务会加入此队列）

所谓的微任务，大概有这么几类：events（如 MutationObserver，Promise.then 理论上也应该在这儿但我刚搜了一下 chromium 走了单独的逻辑）、parsing（底层的 HTML parser 做的一些工作）、reacting to DOM manipulation（insertBefore 等操作如果没触发强制重排，则会在这里做重排）

所以并不是说宏任务“优先级低”，而是微任务队列本身就是某个 event loop 中的一个属性，会在最后执行

标准就是在不断变化的，为了适应更多的环境相关的 API

整个 event loop 的机制都是运行环境决定的，不属于 JS 的标准


## 3.07

1. 获取Web 性能标准代码片段 <https://webperf-snippets.nucliweb.net/>

您可以复制任何代码片段，然后粘贴到浏览器控制台中并运行它以获取结果

核心：CLS LCP
相互作用: 
加载事件等等相关的指标。
   
2. 点击页面元素 打开IDE源码的工具 插件 <https://juejin.cn/post/7326002010084311079>  有点厉害（考虑看一下源码）

通过AST 在元素上添加行列属性，  通过某些按键组合， 鼠标移动到DOM上显示遮罩信息，然后点击遮罩，请求接口，然后起node服务， 打开IDE的 通过终端code launching-from-thecommand-line 

3. 从业务开发中学习和理解架构设计 <https://mp.weixin.qq.com/s/1LF0qdfvBooV7S-CNAjnow>

代码目录调整实际上是一个对业务场景、工程结构理解和设计的问题。

代码目录的结构代表了我们的工程结构，也是业务场景划分的抽象描述，更是模块定义以及模块依赖关系的展现。

架构设计一定要从业务场景出发，架构设计一定要落到业务场景中去验证

我们不能只从基础能力、安全性或者性能方面去评判一个架构的好坏。架构对业务开发的支持能力，面向业务变化时的灵活度以及持续演进能力等都是评判的因素。
此外，我们要求软件架构必须是灵活的，能够满足未来业务持续发展的要求。

业务场景是不断变化的，架构也要具有跟随业务形态不断演进的能力。架构设计的核心是保证面向业务变化时有足够灵活的响应力，这要求架构设计能够识别到业务的核心领域。所以，无论是面向当前还是面向未来，架构设计都需要真正地识别和理解业务问题。


4. 如何实现一个Canvas渲染引擎 <https://juejin.cn/post/7323382193640423451> 也有点猛 先记录一下。

5. css 中 `Infinity` 

我们可以通过设置`infinity`来 层级,这样可以保证层级最高，同样高的层级 按照渲染顺序后面的在上

``` css
.model{
  position: fixed;
  z-index: calc(infinity);
}

``` 

或者我们可以给宽高设置最大像素

``` css
.big{
  width: calc(infinity * 1px);
  height: calc(infinity * 1px);
}
```

这个时候我们可以通过`getComputedStyle` 和`getBoundingRect` 来获取真实的宽高
``` js
// getComputedStyle()
const computed = window.getComputedStyle(bigEl);
const computedWidth = computed.getPropertyValue('width');
const computedHeight = computed.getPropertyValue('height');

// getBoundingRect()
const rect = bigEl.getBoundingClientRect();
const rectWidth = rect.width + 'px';
const rectHeight = rect.height + 'px';
```


6. input-file的点击 也必须在用户交互之后才可以通过js调用，和视频自动播放同理


## 3.12

1. 提案 css 变量组 :

在 UI 中使用时，颜色被赋予语义：品牌颜色、主色（或强调色）、辅助色、成功、危险等。

``` css
:root{
  --color-primary-10: var(--color-blue-10);
  --color-primary-20: var(--color-blue-20);
  /* ... */
  --color-primary-100: var(--color-blue-100);
}
/* 
  该提案允许作者使用大括号定义具有相同前缀的变量组，然后将整个组传递给其他变量：
  那么这相当于创建--color-green-100, --color-green-200, 等等变量。
 */
:root{
  --color-green: {
    100: oklch(95% 13% 135);
    200: oklch(95% 15% 135);
    /* ... */
    900: oklch(25% 20% 135);
  };
}

```
<https://lea.verou.me/docs/var-groups/?utm_source=CSS-Weekly&utm_medium=newsletter&utm_campaign=issue-581-march-08-2024>


2. 几个`:has` 的使用场景<https://piccalil.li/blog/some-little-ways-im-using-css-has-in-the-real-world/?utm_source=CSS-Weekly&utm_medium=newsletter&utm_campaign=issue-581-march-08-2024>

<https://codepen.io/jlengstorf/pen/YzMwNrp>


3. 多行溢出隐藏的方案<https://ant-design.antgroup.com/docs/blog/line-ellipsis-cn#js-%E5%AE%9E%E7%8E%B0> antd的
4. 自动添加changelog插件 `conventional-changelog`


## 3.14

1. vscode setting 配置

``` json
{
    "editor.wordSeparators": "`~#!@$%^&*()-=+[{]}\\|;:'\",<>/?."
}
```

vscode 相关配置文章 `https://juejin.cn/post/7344573753538789430`


2. beforeRouterEnter 在 script setup 中无法直接使用 必须通过optons API 