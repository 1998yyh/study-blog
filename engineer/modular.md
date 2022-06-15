# 模块化进程

## CommonJS 

#### 定义
根据CommonJS规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是该模块定义的内部变量，无法被其他模块读取。


#### 模块输出：

通过module.exports 输出，把希望输出的内容放到该对象中。

通过require引入。



## AMD

额外的引入RequireJS来进行支持

requireJS主要解决两个问题：

一，多个js文件可能有依赖关系，被依赖的文件需要早于依赖它的文件加载到浏览器； 

二，js加载的时候浏览器会停止页面渲染，加载文件越多，页面失去响应时间越长。

requireJS定义了一个函数 define，它是全局变量，用来定义模块


## CMD

，CMD有个浏览器的实现SeaJS，SeaJS要解决的问题和requireJS一样，只不过在模块定义方式和模块加载（可以说运行、解析）时机上有所不同 语法 Sea.js 推崇一个模块一个文件，遵循统一的写法 define define(id?, deps?, factory) 因为CMD推崇一个文件一个模块，所以经常就用文件名作为模块id；CMD推崇依赖就近，所以一般不在define的参数中写依赖，而是在factory中写。

## UMD

UMD 就是一种思想，它是一个整合了AMD、CMD和Commonjs规范的方法。define.amd / define.cmd / module 等判断当前支持什么方式，都不行就挂载到 window 全局对象上面去


##　ES Module(ESM)

ESM 在语言标准的层面上，实现了模块化功能，而且实现的相当简单，旨在成为浏览器和服务器通用的模块化解决方案，其模块化功能主要由俩个命令构成：exports和import。

其次ESM还提供了export default的命令，为模块指定默认输出，对应的 import 语句不需要大括号，这也更接近AMD的引用写法。