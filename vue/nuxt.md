# Nuxt.js

文章来源 : https://blog.logrocket.com/next-js-vs-nuxt-js/?utm_source=newsletter&utm_medium=email&utm_campaign=23Q1_EM_TheReplay_230110&mkt_tok=NzQwLUxLTS0yNjMAAAGJO2YQqmd8sh8q-Fwq8xaGWItcMRBjpL1OVzi0hXzrjYnvHsbj2gy_nViLJkMLQlnnl1oXXN_vFVcuEUVEqOu-xl9Opmq17g2RAsvW6ydjuA#nuxt-js


## 是什么

Nuxt.js是一个构建在Vue.js, Node.js, Webpack和Babel.js之上的元框架，用于设计和开发复杂，快速，通用的Vue应用程序。

Nuxt.js致力于使web应用程序开发具有弹性和有效性。通过处理服务器端细节和客户端代码分发，Nuxt.js允许开发人员专注于使用它提供的惊人特性创建应用程序。Vue.js项目的基础是Nuxt.js，它为创建具有足够灵活性的应用程序提供了强大的框架。

## 特性

### 自动导入

Nuxt.js自动导入辅助函数、组合和Vue api，以便在整个应用程序中使用，而不需要显式地导入它们。它使用这些函数来执行数据获取、访问应用上下文和运行时配置、管理状态以及定义组件和插件。

Nuxt.js中的内置组合组件(如useHead)和组件(如NuxtLink)可以在Nuxt.js中的任何文件中使用，而无需显式地导入它们。

Nuxt.js还允许您自动导入从可组合目录和插件中编写的Composition API函数。js通过在发生名称冲突时显示警告来防止名称冲突。自动导入大大缩短了开发时间，提高了整个流程。


### 生态系统模块

在使用Nuxt.js创建生产级应用程序时，支持每个项目的开箱即用需求会使你的Nuxt应用程序非常复杂，操作起来具有挑战性。这就是为什么Nuxt.js提供了一个模块系统，允许您扩展Nuxt.js应用程序的核心功能，并增强与任何第三方库(如Tailwind、Axios、Cloudinary等)的集成。这个模块系统是一个在运行Nuxt实例时按顺序调用的函数。


### 呈现模式

Nuxt.js支持混合呈现，允许您使用路由规则，它决定服务器应该如何响应特定URL上的新请求，从而为每个路由启用各种缓存规则。它还允许我们利用像增量静态生成这样的特性，它将SSR和SSG结合在一起。

nuext .js允许JavaScript代码被浏览器和服务器解释，将Vue.js组件转换为HTML元素。Nuxt.js中的组件可以在服务器上呈现为HTML字符串，直接传输到浏览器，然后在客户端上与Vue混合成一个完全交互式的应用程序。

而不是一个空白的index.html页面，Nuxt.js在web服务器上预加载应用程序，并将呈现的HTML作为对浏览器对每个路由请求的响应。因此，页面加载速度更快，SEO也得到了改进，因为搜索引擎可以更容易地抓取页面。客户端呈现是Nuxt.js的另一个特性，它使我们能够使用客户端JavaScript加载、编辑或更新内容。


### 服务器引擎

有一个叫做Nitro的健壮的服务器引擎。这个服务器引擎是Nuxt应用程序的动力。服务器引擎提供了一些令人兴奋的特性，包括对Node.js、Deno、service worker和其他技术的跨平台支持。它提供了无服务器支持、自动代码分割、异步加载块和具有热模块重新加载的开发服务器。Nitro与平台无关的特性使Nuxt应用程序能够在边缘显示，更接近用户，从而实现复制和进一步优化。


### 文件系统路由

据获取是从服务器检索数据，并在客户端组件挂载时将其返回给客户端组件，从而允许组件立即访问此数据。因此，不需要加载数据。Nuxt.js允许您从Vue组件和具有ssr就绪功能的页面中的任何来源获取数据。Nuxt.js还允许你使用useFetch、useLazyFetch、useAsyncData和useLazyAsyncData钩子来管理应用程序的数据抓取。




## Nuxt的缺点

1. 在Nuxt.js中使用自定义库可能很困难
2. 对于大型、高流量的应用程序，站点的高流量可能会导致服务器压力
3. 如果需要开发高度通用的Vue应用程序，例如需要呈现另一个组件中插槽的内容，则需要呈现不同的JSX/函数
4. 道具必须明确指定。在特定的情况下，你可能想把一些CSS类转换成道具;在这种情况下，你必须指定每个道具或使用$attrs/render方法或JSX
5. Nuxt.js缺少某些广泛使用的可靠插件和组件，如日历、矢量地图和谷歌地图。但是，有些组件通常没有得到很好的维护。另外，有些插件在服务器端不能工作