# study-electron


## Why electron

1. 无兼容问题
2. 最新浏览器 Feature Electron 会在最新稳定版本发布后快速更新chromium版本。意味着你可以用一些最新的Feature
3. 轻松绕过跨域： 作为一个前端开发，经常会碰到各种各样的跨域问题，比如 iframe 跨域、request 请求跨域……而对于请求类跨域问题通常需要后端配合着设置跨域限制。
4. 使用 Node.js 提供的能力
5. 客户端能力的支持
6. 调用OS的能力


在 Electron 应用中，由于可以自由地访问本地文件系统和系统资源，也可以通过 Node.js 模块实现对底层操作系统的访问。这种能力使得 Electron 应用可以绕过浏览器的跨域限制，可以在本地环境中自由通信和交互，而无需担心同源策略带来的限制。

## 基础概念

Electron 由 Node.js + Chromium + Native API 构成。你可以理解成，它是一个得到了 Node.js 和基于不同平台的 Native API 加强的 Chromium 浏览器。

### 主进程（main） 和 渲染进程（renderer）

Electron 继承了来自 Chromium 的多进程架构，Chromium 始于其主进程。从主进程可以派生出渲染进程。

渲染进程与浏览器窗口是一个意思。主进程保存着对渲染进程的引用，并且可以根据需要创建/删除渲染器进程。


#### 主进程

主进程是 Electron 应用程序的核心，通常由一个主要的 JavaScript 文件（如 main.js ）定义，你可以在 package.json 中指定它


``` json
{
  ...
  "main": "dist-electron/main.js",
  "devDependencies": {
   ...
  }
}
```

它是应用程序的入口点，负责管理整个应用的生命周期、创建窗口、原生 API 调用等。主进程可以访问底层的系统资源，如文件系统、操作系统 API 等，这些功能通常是通过 Node.js 提供的模块实现的。它是 Electron 应用的主要控制中心。

1. 应用的生命周期

在 Electron 的主进程中，你可以使用 app 模块来管理应用程序的生命周期，该模块提供了一整套的事件和方法，可以让你用来添加自定义的应用程序行为

will-finish-launching 在应用完成基本启动进程之后触发。
ready 当 electron 完成初始化后触发。
window-all-closed 所有窗口都关闭的时候触发，在 windows 和 linux 里，所有窗口都退出的时候通常是应用退出的时候。
before-quit 退出应用之前的时候触发。
will-quit 即将退出应用的时候触发。
quit 应用退出的时候触发。

而我们通常会在 ready 的时候执行创建应用窗口、创建应用菜单、创建应用快捷键等初始化操作。而在 will-quit 或者 quit 的时候执行一些清空操作，比如解绑应用快捷键。

特别的，在非 macOS 的系统下，通常一个应用的所有窗口都退出的时候，也是这个应用退出之时。所以，可以配合 window-all-closed 这个钩子来实现：


``` js
app.on('window-all-closed', () => {
  // 当操作系统不是darwin（macOS）的话
  if (process.platform !== 'darwin') { 
    // 退出应用
    app.quit()
  }
})
```

2. 创建窗口

通过 BrowserWindow 来打开页面 ，也可以监听一些事件

``` js
mainWindow.on('closed',()=>{console.log('closed')})
mainWindow.on('focus',()=>{console.log('focus')})
mainWindow.on('show',()=>{console.log('show')})
mainWindow.on('hide',()=>{console.log('hide')})
mainWindow.on('minimize',()=>{console.log('minimize')})
```


3. 调用原生API



#### 渲染进程

能够在渲染进程中使用的 API 一共有 7 个。那么如果需要在渲染进程中使用主进程的 API 要怎么操作呢？Electron 本身额外提供了一个库 @electron/remote，使用这个库可以用来调用主进程的一些 API 能力：


#### 其他

1. 预加载脚本 preload.js
预加载（preload）脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码。
在 preload.js 中，我们不仅可以使用 Node API，还可以直接使用 Electron 渲染进程的 API 以及 DOM API，另外可以通过 IPC 和主进程进行通信达成调用主进程模块的目的。preload.js 脚本虽运行于渲染器的环境中，却因此而拥有了更多的权限。

2. contextIsolation

假设有一个 Electron 应用程序，其中有一个渲染进程需要执行一些文件系统操作，比如读取本地文件并在界面中显示。在未启用 contextIsolation 的情况下，渲染进程可以直接访问 Node.js 的 fs 模块来进行文件操作。但这样会存在安全风险，因为渲染进程可以执行任意的文件系统操作，比如文件删除，可能导致安全漏洞或恶意代码执行。

现在，启用了 contextIsolation，渲染进程无法直接访问 Node.js 的 fs 模块。相反，你可以使用 preload 选项来为渲染进程加载一个预加载的脚本，在这个脚本中可以安全地访问 Node.js 的 fs 模块，并将需要的操作通过 contextBridge 模块封装成 AP

假设有一个 Electron 应用程序，其中有一个渲染进程需要执行一些文件系统操作，比如读取本地文件并在界面中显示。在未启用 contextIsolation 的情况下，渲染进程可以直接访问 Node.js 的 fs 模块来进行文件操作。但这样会存在安全风险，因为渲染进程可以执行任意的文件系统操作，比如文件删除，可能导致安全漏洞或恶意代码执行。

现在，启用了 contextIsolation，渲染进程无法直接访问 Node.js 的 fs 模块。相反，你可以使用 preload 选项来为渲染进程加载一个预加载的脚本，在这个脚本中可以安全地访问 Node.js 的 fs 模块，并将需要的操作通过 contextBridge 模块封装成 API 提供给渲染进程


## 主进程与渲染进程之间的通讯

### ipcMain 和 ipcRenderer

ipcMain 是一个仅在主进程中以异步方式工作的模块，用于与渲染进程交换消息。

ipcRenderer 是一个仅在渲染进程中以异步方式工作的模块，用于与主进程交换消息。


### 渲染进程 -> 主进程

ipcRenderer.send(channel, ...args)
ipcRenderer.invoke(channel, ...args)
ipcRenderer.sendSync(channel, ...args)

channel 表示的就是事件名(消息名称)， 
args 是参数。需要注意的是参数将使用结构化克隆算法进行序列化，就像浏览器的 window.postMessage 一样，因此不会包含原型链。
发送函数、Promise、Symbol、WeakMap 或 WeakSet 将会抛出异常。


## 项目创建

创建vue项目

``` bash
npm create vite@latest electron-jue-jin -- --template vue-ts
```
安装electron 依赖

``` bash
npm install electron -D
```


### 主进程

``` ts
//src\main\mainEntry.ts
import { app, BrowserWindow } from "electron";

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(process.argv[2]);
});

```


主进程的代码写好之后，只有编译过之后才能被 Electron 加载，我们是通过 Vite 插件的形式来完成这个编译工作和加载工作的，如下代码所示：

``` ts
//plugins\devPlugin.ts
import { ViteDevServer } from "vite";
export let devPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer) {
      require("esbuild").buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"],
      });
      server.httpServer.once("listening", () => {
        let { spawn } = require("child_process");
        let addressInfo = server.httpServer.address();
        let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
        let electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", httpAddress], {
          cwd: process.cwd(),
          stdio: "inherit",
        });

        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};

```