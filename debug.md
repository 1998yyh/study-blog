# 调试

调试就是把浏览器跑起来，访问目标网页，这时候会有一个 ws 的调试服务，我们用 frontend 的 ws 客户端连接上这个 ws 服务，就可以进行调试了。


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

1. 手机微信内点击http://debugxweb.qq.com/?inspector=true（只要跳转过微信首页就是开启了调试）

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


## 代码调试 

### 

### 断点

我们可以在控制台的Sources处进行断点调试

![](https://pic.imgdb.cn/item/6392dd44b1fccdcd368419ee.jpg)

可以控制代码的执行，可以看到每一步的调用栈和作用域的变量




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