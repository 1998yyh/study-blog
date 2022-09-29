# 调试

调试就是把浏览器跑起来，访问目标网页，这时候会有一个 ws 的调试服务，我们用 frontend 的 ws 客户端连接上这个 ws 服务，就可以进行调试了。



### VSCode Debug 

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