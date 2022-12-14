# 调试


## 移动端调试(usb)

1. 安卓手机开启开发者模式, 并且开启USB调试

2. 链接电脑后 打开 `chrome://inspect/#devices` 或 `edge://inspect/#devices`, 

![](https://pic.imgdb.cn/item/6391ade7b1fccdcd36e034d2.jpg)

3. 手机允许调试,建立会话

![](https://pic.imgdb.cn/item/639147bfb1fccdcd3657d191.jpg=10x5)

4. 然后点击inspect就可以调试移动端页面了

## 微信内调试

根据目前了解到的情况，微信从8.0.19开始内核从x5换成了xweb 调试方式发生变化

### x5内核 

1. http://debugx5.qq.com 

2. 打开微信 TBS 调试

![](https://pic.imgdb.cn/item/63907241b1fccdcd36574fb7.jpg)

3. 然后在谷歌浏览器地址栏输入chrome://inspect/#devices 步骤同移动端调试


### xweb内核

1. 手机微信内点击http://debugxweb.qq.com/?inspector=true

![](https://pic.imgdb.cn/item/63993e73b1fccdcd36b6bdc0.jpg)

只要出现这个页面就算是开启调试了

2. 微信内打开所需调试网址

3. 然后在谷歌浏览器地址栏输入chrome://inspect/#devices 步骤同移动端调试


## 远程调试

有的时候我们无法通过usb链接调试. 这种情况下 还可以使用远程调试的方式来调试页面.

### spy-debugger

一站式页面调试、抓包工具。远程调试任何手机浏览器页面，任何手机移动端webview（如：微信，HybridApp等）。支持HTTP/HTTPS，无需USB连接设备。 

安装:
win: `npm install spy-debugger -g`
mac: `sudo npm install spy-debugger -g`


第一步：手机和PC保持在同一网络下（比如同时连到一个Wi-Fi下）

第二步：命令行输入spy-debugger，按命令行提示用浏览器打开相应地址。

![](https://pic.imgdb.cn/item/6391b2edb1fccdcd36e78fef.jpg)

第三步：设置手机的HTTP代理，代理IP地址设置为PC的IP地址，端口为spy-debugger的启动端口(默认端口：9888)。

Android设置代理步骤：设置 - WLAN - 长按选中网络 - 修改网络 - 高级 - 代理设置 - 手动
iOS设置代理步骤：设置 - 无线局域网 - 选中网络 - HTTP代理手动
第四步：手机安装证书。注：手机必须先设置完代理后再通过(非微信)手机浏览器访问 http://s.xxx(地址二维码)安装证书（手机首次调试需要安装证书，已安装了证书的手机无需重复安装)。iOS新安装的证书需要手动打开证书信任

第五步：用手机浏览器访问你要调试的页面即可。

我们看下效果

![](https://pic.imgdb.cn/item/6391b354b1fccdcd36e815aa.jpg)

同时可以看日志输出,本地的storage,网络请求

pc浏览器中已经获取到了页面元素, 同时我们选中元素、移动端相应的能够响应

![](https://pic.imgdb.cn/item/6391b807b1fccdcd36ef71de.jpg)

同时提供了抓包功能

![](https://pic.imgdb.cn/item/6391b43eb1fccdcd36e98870.jpg)

ios可以通过这种方式去调试微信内h5页面

有些app可能回检测到我们使用远程调试而不让我们访问.

![](https://pic.imgdb.cn/item/6391b61eb1fccdcd36ec1ba6.jpg)

### chii

chii 与 spy-debugger 原理类似

官方地址:https://github.com/liriliri/chii

### 原理

Chrome DevTools 被设计成了和 Chrome 分离的架构，两者之间通过 WebSocket 通信，设计了专门的通信协议： Chrome DevTools Protocol。

只要实现对接 CDP 协议的 ws 服务端，就可以用 Chrome DevTools 来调试，所以 Chrome DevTools 可以用来调试浏览器的网页、调试 Node.js

自然也就可以远程调试安卓手机的网页了，只要开启了 USB 调试，那手机和电脑就可以做网络通信，从而实现基于 CDP 的调试。

我们可以在 Chrome DevTools 的 more tools 里打开 Protocol Monitor 面板：

![](https://pic.imgdb.cn/item/6392b0b9b1fccdcd363ba752.jpg)

当我们操作手机的时候 通过json的形式通知到devtools 然后chrome做一些渲染

![](https://pic.imgdb.cn/item/6392b172b1fccdcd363ce8e6.jpg)

上图是一个简单的滚动操作,可以看到有滚动属性传递给了chrome 

我们如果足够熟悉这些字段返回的信息,就可以设计自己的调试工具. 类似

![](https://pic.imgdb.cn/item/6392b293b1fccdcd363e354c.jpg)


### ajax调试

有时候我们调试接口的时候, 可能没有配置mock,或者发到了测试环境,但是后台还没完成,此时我们可以使用`Ajax Interceptor` 这个chrome 插件

![](https://pic.imgdb.cn/item/6396f305b1fccdcd364e2346.jpg)

根据url或者正则 来匹配请求 并修改其返回的内容.



## 代码调试 

### console.log

### 断点调试

我们可以在控制台的Sources处进行断点调试

![](https://pic.imgdb.cn/item/6392dd44b1fccdcd368419ee.jpg)

可以控制代码的执行，可以看到每一步的调用栈和作用域的变量


### LogPoint 

console.log 用的多了容易污染代码 而且容易忘记删除 这样肯跟会造成其他人调试的不便

所以推荐使用logPoint 进行输出

![](https://pic.imgdb.cn/item/6397e9e4b1fccdcd36a67e28.jpg)

![](https://pic.imgdb.cn/item/6397ec01b1fccdcd36aa5d84.jpg)


### DOM断点



![](https://pic.imgdb.cn/item/63981739b1fccdcd36f2af95.jpg)

Subtree Modifications  每当修改选定节点的子元素时，断点将中断任何事件的执行。修改可以是子内容的删除、添加或更改。

Node Removal 节点删除断点是在从 DOM 树中删除元素时触发的。

Attribute Modifications  属性修改断点用于调试元素中属性的更改。它们在属性更改、添加或删除时被触发。

这样可以通过调用栈找到对应的哪个方法修改了元素

![](https://pic.imgdb.cn/item/639818c8b1fccdcd36f6884e.jpg)


### Event Listener / Ajax

![](https://pic.imgdb.cn/item/6398205bb1fccdcd36014ce3.jpg)

![](https://pic.imgdb.cn/item/63982acdb1fccdcd3614c1ed.jpg)

也可以帮助我们调试一些场景

###  VSCode Debug 

我们可以在跟路径下创建一个`.vscode`文件夹 然后在里面创建`launch.json` 然后添加配置

也可以直接在运行和调试工具中添加 配置 `创建launch.json`文件

launch：调试模式启动浏览器，访问某个 url，然后连上进行调试
attach：连接某个已经在调试模式启动的 url 进行调试
userDataDir： user data dir 是保存用户数据的地方，比如浏览历史、cookie 等，一个数据目录只能跑一个 chrome，所以默认会创建临时用户数据目录，想用默认的目录可以把这个配置设为 false
runtimeExecutable：切换调试用的浏览器，可以是 stable、canary 或者自定义的
runtimeArgs：启动浏览器的时候传递的启动参数
sourceMapPathOverrides：对 sourcemap 到的文件路径做一次映射，映射到 VSCode workspace 下的文件，这样调试的文件就可以修改了
file：可以直接指定某个文件，然后启动调试

####  launch / attach

创建 Chrome Debug 配置有两种方式：launch 和 attach：

它们只是 request 的配置不同：

launch 的意思是把 url 对应的网页跑起来，指定调试端口，然后 frontend 自动 attach 到这个端口。

但如果你已经有一个在调试模式跑的浏览器了，那直接连接上就行，这时候就直接 attach。


比如我们手动把 Chrome 跑起来，指定调试端口 remote-debugging-port 为 9222，指定用户数据保存目录 user-data-dir 为你自己创建一个目录：

``` 
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=debugChrome
```

Chrome 跑起来之后，你可以打开几个网页，比如百度、掘金，然后你访问 localhost:9222/json，这时候你就会发现所有的 ws 服务的地址了：
```json
[ {
   "description": "",
   "devtoolsFrontendUrl": "/devtools/inspector.html?ws=localhost:9222/devtools/page/877C24B810B6C95D0EDEBBC993C65B68",
   "faviconUrl": "https://mat1.gtimg.com/www/icon/favicon2.ico",
   "id": "877C24B810B6C95D0EDEBBC993C65B68",
   "title": "腾讯网",
   "type": "page",
   "url": "https://www.qq.com/",
   "webSocketDebuggerUrl": "ws://localhost:9222/devtools/page/877C24B810B6C95D0EDEBBC993C65B68"
}, {
   "description": "",
   "devtoolsFrontendUrl": "/devtools/inspector.html?ws=localhost:9222/devtools/page/A4808DE61CA45DF2E508B5D028780992",
   "faviconUrl": "https://www.baidu.com/favicon.ico",
   "id": "A4808DE61CA45DF2E508B5D028780992",
   "title": "百度一下，你就知道",
   "type": "page",
   "url": "https://www.baidu.com/",
   "webSocketDebuggerUrl": "ws://localhost:9222/devtools/page/A4808DE61CA45DF2E508B5D028780992"
} ]
```

然后你创建一个 attach 的 Chrome Debug 配置：

``` json
{
  "configurations": [
    {
      "name": "Attach to Chrome",
      "port": 9222,
      "request": "attach",
      "type": "chrome",
      "webRoot": "${workspaceFolder}"
    },
  ]
}
```


![](https://pic.imgdb.cn/item/632d292a16f2c2beb128f94b.png)

可以多个页面一起调试，每个页面都有独立的调试上下文。

#### userDataDir


user data dir 是保存用户数据的地方，比如你的浏览记录、cookies、插件、书签、网站的数据等等，在 macOS 下是保存在这个位置：

```
~/Library/Application\ Support/Google/Chrome
```

用户数据目录有个特点，就是只能被一个 Chrome 实例所访问，如果你之前启动了 Chrome 用了这个默认的 user data dir，那就不能再启动一个 Chrome 实例用它了。

所以我们用调试模式启动 Chrome 的时候，需要单独指定一下 user data dir 的位置。除非你把之前的 Chrome 关掉，才能用默认的。


#### runtimeExecutable


#### runtimeArgs 启动参数

 --auto-open-devtools-for-tabs 默认调起chrome devtools

--incognito 无痕模式




#### vue

以`@vue/cli`创建的项目为例

```
npm install @vue/cli -g
vue create vue-demo
```

创建完之后把项目跑起来

我们随便在某个地方打个断点会发现断点失效

![](https://pic.imgdb.cn/item/63993732b1fccdcd36abdf81.jpg)


先通过代码debugger的方式来断住,然后观察一下

![](https://pic.imgdb.cn/item/63993792b1fccdcd36ac59d0.jpg)

![](https://pic.imgdb.cn/item/639937aeb1fccdcd36ac7d80.jpg)

文件的映射路径有问题,并且我们发现文件是带有hash的


映射问题我们可以通过`sourceMapPathOverrides` 将`webpack://test-vue2-debug/src` 映射为我们代码的路径

文件带有hash 是因为devtools 使用的是 `eval-cheap-module-source-map` 其文件是 `sourceURL=[module]` module的就会带着hash 所以我们需要修改 `devtools`

![](https://pic.imgdb.cn/item/63993ce0b1fccdcd36b3c6de.jpg)


再重启服务 就发现可以打上断点进行调试了

#### node


通常情况会使用 `node --inspect-brk ./index.js` 

也可以使用vscode调试.

配置如下
```json
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Program",
      "program": "${workspaceFolder}/index.js",
      "request": "launch",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "stopOnEntry": true, // 在第一行停下来
      "type": "node",
      "restart": {
        "delay": 1000,
        "maxAttempts": 3
      }
    }
  ]
}
```



### 调试vue源码

我们在项目里下载的vue的包是不带sourcemap的,所以我们需要自己打包vue

```js
git clone https://github.com/vuejs/core vue3

pnpm install // 安装依赖
```

此时去执行build 依然是没有sourcemap的

![](https://pic.imgdb.cn/item/639848f5b1fccdcd3646bb8d.jpg)

执行 export SOURCE_MAP=true 然后再跑 pnpm run build 这样构建出的就是带有sourceMap的了 将其复制到node_modules下

按照下面配置launch.json
``` json
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:8080",
      "runtimeArgs": [
        "--auto-open-devtools-for-tabs"
      ],
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverrides": {
        "meteor://💻app/*": "${workspaceFolder}/*",
        "webpack:///./~/*": "${workspaceFolder}/node_modules/*",
        "webpack://?:*/*": "${workspaceFolder}/*"
      }
    }
  ]
}
```

比如我们想要看ref是怎么实现的 只需要在对应的行打上断点,启动vscode调试

![](https://pic.imgdb.cn/item/63985196b1fccdcd3653fa70.jpg)

![](https://pic.imgdb.cn/item/6398538bb1fccdcd365767f8.jpg)


