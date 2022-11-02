# sourceMap 

在 processAssets 钩子遍历产物文件 assets 数组，调用 webpack-sources 提供的 map 方法，最终计算出 asset 与源码 originSource 之间的映射关系。



## devtool

一般是由 inline、eval、source-map、nosources、hidden、cheap、module 七种关键字组合而成，这些关键词各自代表一项 Sourcemap 规则

我们以下面这段代码为例 看看不同配置的差距

![](https://pic1.imgdb.cn/item/6358983c16f2c2beb18f6001.png)

调整下面两个参数

![](https://pic1.imgdb.cn/item/6358aaf316f2c2beb1a282aa.jpg)

### eval(development)

这个关键词表示每个模块用eval执行，并且存在@sourceUrl，就是说这种配置的devtool在打包的时候，生成的bundle.js文件模块都会被eval包裹，并且后面跟着sourceUrl,指向的是原文件index.js，调试的时候就是根据这个sourceUrl找到的index.js文件的。

所以它是不生成sourceMap的

![](https://pic1.imgdb.cn/item/6358ab5516f2c2beb1a2d22d.jpg)

### source-map(production)

这种配置会生成一个带有.map文件，这个map文件会和原始文件做一个映射，调试的时候，就是通过这个.map文件去定位原来的代码位置

![](https://pic1.imgdb.cn/item/6358a13216f2c2beb1984206.jpg)

这个map会跟着源码一起上传到服务器


### cheap(development)

我们以`cheap-source-map` 为例 构建出的代码如下

![](https://pic1.imgdb.cn/item/6358ae2216f2c2beb1a5e3ad.jpg)

它与其他的不同的是没有列信息



### module

module 关键字只在 cheap 场景下生效，例如 cheap-module-source-map、eval-cheap-module-source-map。当 devtool 包含 cheap 时，Webpack 根据 module 关键字判断按 loader 联调处理结果作为 source，还是按处理之前的代码作为 source。

![](https://pic1.imgdb.cn/item/6358d5fd16f2c2beb1daedd1.jpg)



### nosources

当 devtool 包含 nosources 时，生成的 Sourcemap 内容中不包含源码内容 —— 即 sourcesContent 字段

虽然没有带上源码，但 .map 产物中还带有文件名、 mappings 字段、变量名等信息，依然能够帮助开发者定位到代码对应的原始位置，配合 sentry 等工具提供的源码映射功能，可在异地还原诸如错误堆栈之类的信息。

### inline

当 devtool 包含 inline 时，Webpack 会将 Sourcemap 内容编码为 Base64 DataURL，直接追加到产物文件中。

### hidden

通常，产物中必须携带 //# sourceMappingURL= 指令，浏览器才能正确找到 Sourcemap 文件，当 devtool 包含 hidden 时，编译产物中不包含 //# sourceMappingURL= 指令。