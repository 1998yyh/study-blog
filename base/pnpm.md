# pnpm

## 包管理工具发展

### npm2

node 版本管理工具把 node 版本降到 4，那 npm 版本就是 2.x 了。

然后执行 npm install express，那么 express 包和它的依赖都会被下载下来,展开 express，它也有 node_modules,再展开几层，每个依赖都有自己的 node_modules


* 这样的问题在于 多个包之间会有重复的公共依赖,这样会引入多次,会占据较大的磁盘空间.

* 致命问题是 windows 的文件路径最长是 260 多个字符，这样嵌套是会超过 windows 路径的长度限制的


### yarn npm3

他们的解决方式是铺平在同一层.这样就没有依赖重复多次的问题了

全部铺平在了一层，展开下面的包大部分是没有二层 node_modules 的 ,部分也会存在第二层 因为一个包是可能有多个版本的，提升只能提升一个，所以后面再遇到相同包的不同版本，依然还是用嵌套的方式。

最主要的一个问题是幽灵依赖，也就是你明明没有声明在 dependencies 里的依赖，但在代码里却可以 require 进来。

这个也很容易理解，因为都铺平了嘛，那依赖的依赖也是可以找到的。但是这样是有隐患的，因为没有显式依赖，万一有一天别的包不依赖这个包了，那你的代码也就不能跑了，因为你依赖这个包，但是现在不会被安装了。


## pnpm

回想下 npm3 和 yarn 为什么要做 node_modules 扁平化？不就是因为同样的依赖会复制多次，并且路径过长在 windows 下有问题么？

那如果不复制呢，比如通过 link。

首先介绍下 link，也就是软硬连接，这是操作系统提供的机制，硬连接就是同一个文件的不同引用，而软链接是新建一个文件，文件内容指向另一个路径。当然，这俩链接使用起来是差不多的。

如果不复制文件，只在全局仓库保存一份 npm 包的内容，其余的地方都 link 过去呢？

这样不会有复制多次的磁盘空间浪费，而且也不会有路径过长的问题。因为路径过长的限制本质上是不能有太深的目录层级，现在都是各个位置的目录的 link，并不是同一个目录，所以也不会有长度限制。

pnpm 就是通过这种思路来实现的。

比如我们调用 `pnpm install express`时候,会输出

```JS
// Packages are hard linked from the content-addressable store to the virtual store.
// 包是从全局 store 硬连接到虚拟 store 的，这里的虚拟 store 就是 node_modules/.pnpm。

// Progress: resolved 59, reused 57, downloaded 0, added 57, done
// 说明磁盘里已经有了相应的包了 reused 57 复用了 57个 然后添加软连接到node_modules上
```

但是这样容易造成全局磁盘堆积,需要我们定期清理一下,全局缓存 pnpm store prune 

### workspace

pnpm除了 安装时候减少资源外 还有一个重要的功能就是 monorepo

使用 monorepo 可以把原本一个项目的多个模块拆分成多个 packages，在 packages 之间相互引用，也可以单独发布成包，极大地解决了项目之间代码无法重用的痛点。在项目打包或者编译操作时也可重用一套配置，通吃所有 packages。

``` 
├── packages
│   ├── ui
│   ├── utils
│   └── web
```

假设我们有以上这种格式的目录结构

假设每个 package 的 name 依次为 @test/ui @test/utils @test/web。

当我们在ui中想要调用utils中的方法 需要先安装 `pnpm i @test/utils -r --filter @test/ui`

然后 ui 中的 packages.json中
``` JSON
{
  "name": "@test/ui",
  "version": "1.0.0",
  "description": "",
  "main": "./index.tsx",
  "scripts": {},
  "author": "Innei",
  "license": "MIT",
  "dependencies": {
    "@test/utils": "workspace:^1.0.0" // <--------
  }
}
```
我们会发现多了一行 workspace

然后我们就可以在 ui 中 引入 `import {add} from '@test/utils'`

此时我们将

那么接下来的 package/web 就是整个项目的整体了。放置原来项目中的所有 src 下的代码。而一些原本通用的代码就从 src 下提取成包放在了 packages 下了。这样就好理解了。

当我们发布的时候 pnpm动态替换这些 workspace: 依赖： 
``` json
{
    "dependencies": {
        "foo": "workspace:*",
        "bar": "workspace:~",
        "qar": "workspace:^",
        "zoo": "workspace:^1.5.0"
    }
}
```
会转化为
```json
{
    "dependencies": {
        "foo": "1.5.0",
        "bar": "~1.5.0",
        "qar": "^1.5.0",
        "zoo": "^1.5.0"
    }
}
```


### 别名 Aliases

别名让您可以使用自定义名称安装软件包。

假设你在项目中大量地使用了 lodash， 但 lodash 中的一个 bug 破坏了你的项目， 为此你修复了这个 bug，但 lodash 并没有合并（merge）它。 通常你会直接从你的 fork 仓库中安装修改过的 lodash (git 托管的依赖) 或者修改一下名称做为新包发布到 npm。 如果你使用第二种解决方式，则必须使用新的包名（require('lodash') => require('awesome-lodash')）来替换项目中的所有引用。 

```
pnpm add lodash@npm:awesome-lodash
```

有时你会想要在项目中使用一个包的两个不同版本

```
pnpm add lodash1@npm:lodash@1
pnpm add lodash2@npm:lodash@2
```

与钩子结合使用功能会更加强大， 比如你想将 node_modules 里所有的 lodash 引用也替换为 awesome-lodash ， 你可以用下面的 .pnpmfile.cjs 轻松实现：
```js
function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies.lodash) {
    pkg.dependencies.lodash = 'npm:awesome-lodash@^1.0.0'
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
```


## 扩展

### 软连接

又被叫为符号链接（symbolic  Link），它包含了到原文件的路径信息。

#### 特性

（1）软链接有自己的文件属性及权限等；

（2）可对不存在的文件或目录创建软链接；

（3）软链接可交叉文件系统；

（4）软链接可对文件或目录创建；

（5）创建软链接时，链接计数 i_nlink 不会增加；`ln -s file link`

（6）删除软链接并不影响被指向的文件，但若被指向的原文件被删除，则相关软连接被称为死链接（即 dangling link，若被指向路径文件被重新创建，死链接可恢复为正常的软链接）。


### 硬连接

是对原文件起了一个别名。

#### 特性

（1）文件有相同的 inode 及 data block；

（2）只能对已存在的文件进行创建；

（3）不能交叉文件系统进行硬链接的创建；

（4）不能对目录进行创建，只可对文件创建；`ln file link`

（5）删除一个硬链接文件并不影响其他有相同inode 号的文件。


### 区别

1. 本质:硬连接是同一个文件 软连接不是同一个文件

2. 跨设备 软连接支持 硬连接不支持

3. inode 硬连接相同 软连接不同



