# iframe

## 踩坑

### X-Frame-Options响应限制

百度使用了 X-Frame-Options 响应头来限制其在 iframe 中的嵌套。X-Frame-Options 是一种安全策略，可以由网站的服务器设置，用于控制页面是否允许在 iframe 中嵌套。当网站设置了 X-Frame-Options 为 DENY 或 SAMEORIGIN，浏览器将不允许将该页面在 iframe 中加载，以防止点击劫持等安全问题。


+ DENY: 禁止所有页面在 iframe 中嵌套，无论来源域名是什么。

+ SAMEORIGIN: 允许同源页面在 iframe 中嵌套，但禁止不同源的页面进行嵌套。

+ allow-from XXX.com: 允许被指定域名的网站嵌套。

### cookie设置共享问题

如果目标网站的登录和会话管理依赖于 Cookie，由于跨域限制，Cookie 无法在主域中设置或读取，导致登录状态无法正确保存或共享

浏览器限制了通过 iframe 中的页面使用 set-cookie 标头来设置 Cookie。这是出于安全考虑，防止跨域 Cookie 污染攻击。当在 iframe 中加载一个来自不同域的页面时，该页面无法通过设置 set-cookie 标头来在主页面的域中设置 Cookie。


解决方案：

1. 使用同域代理: 在服务器端设置代理，让服务器请求目标域的资源，然后将结果传递给前端，由前端处理 Cookie。这样可以避免跨域 Cookie 问题。

2. 使用 token: 通过在请求中使用 token 来进行身份验证和会话管理，而不依赖于 Cookie。比如我直接嵌入掘金的页面，使用情况是属于正常的

3. CORS: 可以考虑设置目标网站服务器 CORS 响应头，以允许特定域名的请求访问资源。


### iframe中跳转问题

在iframe中引入csdn是没有问题的，并且某些内容都能正常访问，可能因为大多数都是get请求的原因，所以访问并没有限制，但是如果进行登录操作，就会出现以下的问题。

![](https://pic.imgdb.cn/item/65dc09079f345e8d037b13df.jpg)

这个错误通常出现在浏览器中，涉及到对 iframe 进行跳转的操作。这是由于浏览器的安全机制，阻止当前窗口在 iframe 中导航到其他域名的页面，以防止潜在的安全风险。

这个错误信息表明当前窗口（主页面）试图在 iframe 中导航到 www.csdn.net/

但由于浏览器的安全策略，不允许这样的操作


### http无法嵌入https

如果页面使用的是 HTTP 协议，而尝试将 HTTPS 页面嵌入到该页面中的 iframe，浏览器会认为它们不是同源的，从而阻止加载 HTTPS 页面。这是为了保护用户的安全和隐私，防止潜在的安全风险，例如通过 HTTP 页面窃取在 HTTPS 页面中输入的敏感信息。


