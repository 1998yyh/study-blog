# chrome 插件 

一般来说，插件的原理是向页面中注入 javascript 脚本，对页面进行处理，比如屏蔽页面中可能的广告元素，改变某些元素的样式，增加一些 UI。

## 历史背景

只要有网页浏览器，就有各种形式的浏览器扩展。通过添加专门的功能，并使浏览器更好地满足特定用户的需求，扩展为用户提供了一种强大的方式。

Chrome扩展平台基于“webby”模型，以最大限度地减少开发者参与的障碍。通过建立网络技术和网络安全模型，它的核心也被认为比以前的工作更安全。

后来，Chrome扩展引入了权限模型，让用户可以更细粒度地控制他们安装的任何扩展可以访问哪些信息和资源。扩展平台还将扩展沙盒化在单独的进程中，提供额外的安全性。

## 组成 

chrome 插件通常由以下几部分组成：

1. manifest.json：相当于插件的 meta 信息，包含插件的名称、版本号、图标、脚本文件名称等，这个文件是每个插件都必须提供的，其他几部分都是可选的。
2. background script：可以调用全部的 chrome 插件 API，实现跨域请求、网页截屏、弹出 chrome 通知消息等功能。相当于在一个隐藏的浏览器页面内默默运行。
3. 功能页面：包括点击插件图标弹出的页面（简称 popup）、插件的配置页面（简称 options）。
4. content script：早期也被称为 injected script，是插件注入到页面的脚本，但是不会体现在页面 DOM 结构里。content script 可以操作 DOM，但是它和页面其他的脚本是隔离的，访问不到其他脚本定义的变量、函数等，相当于运行在单独的沙盒里。content script 可以调用有限的 chrome 插件 API，网络请求收到同源策略限制。

### mainifest.json

#### content_scripts

content_scripts 可以使用以下两种方式注入页面，这两种方式并不冲突，可以结合使用。

##### 声明式注入

```json
{
  "content_scripts": [
    {
      "matches": ["http://*/*", "https://*/*"],
      "run_at": "document_idle",
      "js": ["content.js"]
    }
  ]
}
```

在 manifest 中声明要加载的脚本，各个字段都比较直观。其中：

matches 表示页面 url 匹配时才加载
run_at 表示在什么时机加载，一般是 document_idle，避免 content_scripts 影响页面加载性能。

需要注意的是，如果用户已经打开了 N 个页面，然后再安装插件，这 N 个页面除非重新刷新，否则是不会加载 manifest 声明的 content_scripts。安装插件之后新打开的页面是可以加载 content_scripts 的。
所以需要在用户点击插件图标时，探测页面中的 content_scripts 是否存在（发送消息是否有响应/出错），再提示用户刷新页面。

##### 程序注入

还可以使用程序动态注入脚本，代码如下：

```js
chrome.tabs.executeScript({
    file: "content.js",
});
```

比如用户点击插件图标时执行注入脚本，则无需刷新页面，代码如下：

```js
// 监听插件图标点击事件
chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.executeScript({
        file: 'content.js',
    });
});
```

#### permissions

该字段是一个字符串数组，用来声明插件需要的权限，这样才能调用某些 chrome API，常见的有：

1. tabs
2. activeTab
3. contextMenus：网页右键菜单，browser_action 右键菜单
4. cookies：操作 cookie，和用户登录态相关的功能可能会用到该权限
5. storage：插件存储，不是 localStorage
6. web_accessible_resources：网页能访问的插件内部资源，比如插件提供 SDK 给页面使用，如 ethereum 的 metamask 钱包插件。或者是修改 DOM 结构用到了插件的样式、图片、字体等资源。

permissions 中还可以声明多个 url patterns，表示插件需要访问这些 url，比如和 API 通信。


#### background script

可以理解它是在一个隐藏的 tab 中执行，所在的页面域名为空，这会影响对 document.cookie 的使用。

比如 background 需要和 a.com 通信。首先应该把 *://*.a.com/* 加入到 manifest 的 permissions 数组中。

