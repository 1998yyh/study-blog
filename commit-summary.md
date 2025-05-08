# 文件修改汇总

## .husky/pre-commit

```diff
diff --git a/.husky/pre-commit b/.husky/pre-commit
new file mode 100755
index 0000000..6c79886
--- /dev/null
+++ b/.husky/pre-commit
@@ -0,0 +1,8 @@
+#!/usr/bin/env sh
+. "$(dirname -- "$0")/_/husky.sh"
+
+# 运行 lint-staged
+npx lint-staged
+
+# 生成文件修改汇总
+node scripts/generate-summary.js
\ No newline at end of file

```

## base/promise.md

````diff
diff --git a/base/promise.md b/base/promise.md
index 2f6efdb..0252332 100644
--- a/base/promise.md
+++ b/base/promise.md
@@ -3 +3 @@
-## Promise/A+
+## Promise/A+
@@ -9 +8,0 @@
-
@@ -16 +14,0 @@
-
@@ -19,5 +17,4 @@
-* 判断 resolution 是否为 Object，如果不是，直接执行 FulfillPromise
-* 如果是 Object，试探是否存在 then 接口
-* 判断 then 是否可执行 (abrupt completion 可以理解为非正常值)
-* 如果 then 可执行，将 then 方法放入事件队列中。
-
+- 判断 resolution 是否为 Object，如果不是，直接执行 FulfillPromise
+- 如果是 Object，试探是否存在 then 接口
+- 判断 then 是否可执行 (abrupt completion 可以理解为非正常值)
+- 如果 then 可执行，将 then 方法放入事件队列中。
@@ -25 +22 @@
-``` javascript
+```javascript
@@ -43 +40 @@ p1.then((d) => console.log(d)); // 1
-``` javascript
+```javascript
@@ -71 +67,0 @@ const resolve = (value) => {
-
@@ -74 +69,0 @@ const resolve = (value) => {
-
@@ -83 +77,0 @@ ECMAScript 规范中，最接近的是下面两段表达：
-
@@ -86 +79,0 @@ ECMAScript 规范中，最接近的是下面两段表达：
-
@@ -91 +83,0 @@ HTML 标准中指出:
-
@@ -93,0 +86,3 @@ HTML 标准中指出:
+## 从 v8解析 https://juejin.cn/post/7055202073511460895
+
+从Job的概念出发 ， 看看能否解释这个问题
@@ -94,0 +90,19 @@ HTML 标准中指出:
+```js
+const a = new Promise((resolve) => {
+  resolve(1);
+});
+
+async function b() {
+  return Promise.resolve(Promise.resolve(2));
+}
+
+b().then((res) => {
+  console.log(res);
+});
+
+a.then((res) => {
+  console.log(res);
+}).then(() => {
+  console.log(3);
+});
+```
@@ -96 +110 @@ HTML 标准中指出:
-## 从 v8解析 https://juejin.cn/post/7055202073511460895
\ No newline at end of file
+function b 加和不加 async 的效果是不一样的

````

## daily2025.md

````diff
diff --git a/daily2025.md b/daily2025.md
index 8a86566..d236cdf 100644
--- a/daily2025.md
+++ b/daily2025.md
@@ -9 +8,0 @@
-
@@ -16,2 +15 @@ git commit -m 'update .gitignore'
-
-# 3.14
+# 3.14
@@ -21 +18,0 @@ git commit -m 'update .gitignore'
-
@@ -34,5 +31,4 @@ git commit -m 'update .gitignore'
-
-``` html
-<script src='www.aa.com/a.js'></script>
-<script src='www.aa.com/b.js'></script>
-<script src='www.aa.com/c.js'></script>
+```html
+<script src="www.aa.com/a.js"></script>
+<script src="www.aa.com/b.js"></script>
+<script src="www.aa.com/c.js"></script>
@@ -41 +37 @@ git commit -m 'update .gitignore'
-当a.js请求出错的时候，我们页面就会白屏
+当a.js请求出错的时候，我们页面就会白屏
@@ -45,2 +41 @@ git commit -m 'update .gitignore'
-
-``` html
+```html
@@ -48,5 +43,5 @@ git commit -m 'update .gitignore'
-if ('serviceWorker' in navigator) {
-  navigator.serviceWorker.register('/sw.js').then(() => {
-    console.log('Service Worker registered');
-  });
-}
+  if ("serviceWorker" in navigator) {
+    navigator.serviceWorker.register("/sw.js").then(() => {
+      console.log("Service Worker registered");
+    });
+  }
@@ -56,3 +51,3 @@ if ('serviceWorker' in navigator) {
-``` js
-const PRIMARY_HOST = 'primary.example.com';
-const FALLBACK_HOST = 'fallback.example.com';
+```js
+const PRIMARY_HOST = "primary.example.com";
+const FALLBACK_HOST = "fallback.example.com";
@@ -60 +55 @@ const FALLBACK_HOST = 'fallback.example.com';
-self.addEventListener('fetch', (event) => {
+self.addEventListener("fetch", (event) => {
@@ -64 +59 @@ self.addEventListener('fetch', (event) => {
-  if (requestUrl.pathname === '/path/to/script.js') {
+  if (requestUrl.pathname === "/path/to/script.js") {
@@ -69 +64 @@ self.addEventListener('fetch', (event) => {
-          if (!response.ok) throw new Error('Response not OK');
+          if (!response.ok) throw new Error("Response not OK");
@@ -75 +70,4 @@ self.addEventListener('fetch', (event) => {
-          const fallbackRequest = new Request(requestUrl.toString(), event.request);
+          const fallbackRequest = new Request(
+            requestUrl.toString(),
+            event.request,
+          );
@@ -77 +75 @@ self.addEventListener('fetch', (event) => {
-        })
+        }),
@@ -83 +80,0 @@ self.addEventListener('fetch', (event) => {
-
@@ -86,2 +83 @@ self.addEventListener('fetch', (event) => {
-
-``` html
+```html
@@ -89,6 +85,9 @@ self.addEventListener('fetch', (event) => {
-function loadFallback(element) {
-  const fallbackSrc = element.src.replace('primary.example.com', 'fallback.example.com');
-  const newScript = document.createElement('script');
-  newScript.src = fallbackSrc;
-  document.body.appendChild(newScript);
-}
+  function loadFallback(element) {
+    const fallbackSrc = element.src.replace(
+      "primary.example.com",
+      "fallback.example.com",
+    );
+    const newScript = document.createElement("script");
+    newScript.src = fallbackSrc;
+    document.body.appendChild(newScript);
+  }
@@ -97 +96 @@ function loadFallback(element) {
-<script
+<script
@@ -99,4 +98,2 @@ function loadFallback(element) {
-  onerror="loadFallback(this)">
-</script>
-
-
+  onerror="loadFallback(this)"
+></script>
@@ -105,2 +102 @@ function loadFallback(element) {
-
-但是这样会有问题，如果后面的依赖前面的js，会报错，某个变量是undefined
+但是这样会有问题，如果后面的依赖前面的js，会报错，某个变量是undefined
@@ -110 +106 @@ service-worker 通用版
-``` js
+```js
@@ -112 +108 @@ const FALLBACK_MAP = {
-  'primary-host.com': 'fallback-host.com',
+  "primary-host.com": "fallback-host.com",
@@ -115 +111 @@ const FALLBACK_MAP = {
-self.addEventListener('fetch', (event) => {
+self.addEventListener("fetch", (event) => {
@@ -117 +113 @@ self.addEventListener('fetch', (event) => {
-  if (url.pathname.endsWith('.js')) {
+  if (url.pathname.endsWith(".js")) {
@@ -125 +121 @@ self.addEventListener('fetch', (event) => {
-      })
+      }),
@@ -131,3 +126,0 @@ self.addEventListener('fetch', (event) => {
-
-
-
@@ -144 +137 @@ WeakRef 的特点：
-使用建议：
+   使用建议：
@@ -146,5 +139,5 @@ WeakRef 的特点：
-1. 优先使用普通引用
-2. 只在确实需要弱引用时使用 WeakRef
-3. 总是检查 deref() 的返回值
-4. 配合 FinalizationRegistry 使用更完整
-注意事项：
+5. 优先使用普通引用
+6. 只在确实需要弱引用时使用 WeakRef
+7. 总是检查 deref() 的返回值
+8. 配合 FinalizationRegistry 使用更完整
+   注意事项：
@@ -152,4 +145,4 @@ WeakRef 的特点：
-1. WeakRef 不保证引用的对象一定存在
-2. 不适合用于核心业务逻辑
-3. 主要用于性能优化和资源管理
-4. 需要妥善处理引用对象不存在的情况
+9. WeakRef 不保证引用的对象一定存在
+10. 不适合用于核心业务逻辑
+11. 主要用于性能优化和资源管理
+12. 需要妥善处理引用对象不存在的情况
@@ -157,3 +150,3 @@ WeakRef 的特点：
-``` js
-const target = { name: 'example' }
-const weakRef = new WeakRef(target)
+```js
+const target = { name: "example" };
+const weakRef = new WeakRef(target);
@@ -162 +155 @@ const weakRef = new WeakRef(target)
-const obj = weakRef.deref()
+const obj = weakRef.deref();
@@ -164 +157 @@ if (obj) {
-  console.log(obj.name) // 'example'
+  console.log(obj.name); // 'example'
@@ -168 +160,0 @@ if (obj) {
-
@@ -172 +164,2 @@ if (obj) {
-``` ts
+
+```ts
@@ -174,2 +167,2 @@ class Cache {
-  private cache = new Map<string, WeakRef<object>>()
-
+  private cache = new Map<string, WeakRef<object>>();
+
@@ -177 +170 @@ class Cache {
-    this.cache.set(key, new WeakRef(value))
+    this.cache.set(key, new WeakRef(value));
@@ -179 +172 @@ class Cache {
-
+
@@ -181,2 +174,2 @@ class Cache {
-    const ref = this.cache.get(key)
-    return ref?.deref()
+    const ref = this.cache.get(key);
+    return ref?.deref();
@@ -188 +181,2 @@ class Cache {
-``` ts
+
+```ts
@@ -190,2 +184,2 @@ class EventManager {
-  private listeners = new Set<WeakRef<Function>>()
-
+  private listeners = new Set<WeakRef<Function>>();
+
@@ -193 +187 @@ class EventManager {
-    this.listeners.add(new WeakRef(callback))
+    this.listeners.add(new WeakRef(callback));
@@ -195 +189 @@ class EventManager {
-
+
@@ -198 +192 @@ class EventManager {
-      const listener = listenerRef.deref()
+      const listener = listenerRef.deref();
@@ -200 +194 @@ class EventManager {
-        listener(event)
+        listener(event);
@@ -206,0 +201 @@ class EventManager {
+配合 FinalizationRegistry
@@ -208,5 +203 @@ class EventManager {
-配合 FinalizationRegistry
-
-
-``` ts
-
+```ts
@@ -215 +206 @@ const registry = new FinalizationRegistry((heldValue) => {
-  console.log('对象被回收，清理数据：', heldValue);
+  console.log("对象被回收，清理数据：", heldValue);
@@ -240 +230,0 @@ class ResourceManager {
-
@@ -245,2 +235,2 @@ class ResourceManager {
-``` ts
-import { WeakRef, FinalizationRegistry } from 'js-runtime'
+```ts
+import { WeakRef, FinalizationRegistry } from "js-runtime";
@@ -249 +239 @@ export function useComponentCache() {
-  const cache = new Map<string, WeakRef<any>>()
+  const cache = new Map<string, WeakRef<any>>();
@@ -251,3 +241,3 @@ export function useComponentCache() {
-    cache.delete(key)
-    console.log(`组件缓存 ${key} 已清理`)
-  })
+    cache.delete(key);
+    console.log(`组件缓存 ${key} 已清理`);
+  });
@@ -256,3 +246,3 @@ export function useComponentCache() {
-    const ref = new WeakRef(component)
-    cache.set(key, ref)
-    cleanup.register(component, key)
+    const ref = new WeakRef(component);
+    cache.set(key, ref);
+    cleanup.register(component, key);
@@ -262 +252 @@ export function useComponentCache() {
-    return cache.get(key)?.deref()
+    return cache.get(key)?.deref();
@@ -267,2 +257,2 @@ export function useComponentCache() {
-    getCachedComponent
-  }
+    getCachedComponent,
+  };
@@ -272 +261,0 @@ export function useComponentCache() {
-
@@ -275,2 +264 @@ export function useComponentCache() {
-
-``` js
+```js
@@ -298,2 +286 @@ export class WorkerPool {
-
-``` js
+```js
@@ -319 +305,0 @@ export function useFileUpload() {
-
@@ -322 +307,0 @@ export function useFileUpload() {
-
@@ -331 +315,0 @@ export function useFileUpload() {
-
@@ -334,4 +318,4 @@ export function useFileUpload() {
-``` js
-const a = new Promise((resolve)=>{
-  resolve(1)
-})
+```js
+const a = new Promise((resolve) => {
+  resolve(1);
+});
@@ -339,2 +323,2 @@ const a = new Promise((resolve)=>{
-async function b(){
-  return Promise.resolve(2)
+async function b() {
+  return Promise.resolve(2);
@@ -343 +327,5 @@ async function b(){
-b().then((res)=>{
+b().then((res) => {
+  console.log(res);
+});
+
+a.then((res) => {
@@ -345 +333,4 @@ b().then((res)=>{
-})
+}).then(() => {
+  console.log(3);
+});
+```
@@ -346,0 +338 @@ b().then((res)=>{
+function b 加和不加 async 的效果是不一样的
@@ -348,5 +340 @@ b().then((res)=>{
-a.then((res)=>{
-  console.log(res)
-}).then(()=>{
-  console.log(3)
-})
+## 4.11
@@ -354 +342,2 @@ a.then((res)=>{
-```
+1. 5 个改变游戏规则的 GitHub 代码库，助你轻松应对编程面试
+   https://javascript.plainenglish.io/top-5-github-repos-to-ace-your-coding-interviews-230b1d8506f4
@@ -355,0 +345 @@ a.then((res)=>{
+## 4.21
@@ -357 +347 @@ a.then((res)=>{
-function b 加和不加 async 的效果是不一样的
+1. Promise.finally 返回成功的promise 无效 返回失败的promise会拦截
@@ -358,0 +349,5 @@ function b 加和不加 async 的效果是不一样的
+```js
+Promise.resolve(1).finally(() => {
+  return 2;
+});
+```
@@ -360 +355 @@ function b 加和不加 async 的效果是不一样的
-## 4.11
+## 5.7
@@ -361,0 +357 @@ function b 加和不加 async 的效果是不一样的
+终于又可以学习点东西了
@@ -363,2 +359 @@ function b 加和不加 async 的效果是不一样的
-1. 5 个改变游戏规则的 GitHub 代码库，助你轻松应对编程面试
-https://javascript.plainenglish.io/top-5-github-repos-to-ace-your-coding-interviews-230b1d8506f4
+1. 字符串的转化
@@ -365,0 +361,6 @@ https://javascript.plainenglish.io/top-5-github-repos-to-ace-your-coding-intervi
+```js
+String(v)
+'' + v
+`${v}`
+v.toString()
+{}.toString.call(v)
@@ -367 +368 @@ https://javascript.plainenglish.io/top-5-github-repos-to-ace-your-coding-intervi
-## 4.21
+// 上面是五种转化字符串的方法
@@ -369 +370,4 @@ https://javascript.plainenglish.io/top-5-github-repos-to-ace-your-coding-intervi
-1. Promise.finally 返回成功的promise 无效 返回失败的promise会拦截
+undefined
+null
+Symbol()
+{__proto__: null}
@@ -371,4 +375,30 @@ https://javascript.plainenglish.io/top-5-github-repos-to-ace-your-coding-intervi
-``` js
-Promise.resolve(1).finally(()=>{
-  return 2
-})
+// 我们用它来处理一下一些棘手的值
+```
+
+|                     | undefined |   null    | Symbol()  | {**proto**:null} |
+| ------------------- | :-------: | :-------: | :-------: | :--------------: |
+| String(v)           |    ✔     |    ✔     |    ✔     |    TypeError     |
+| '' + v              |    ✔     |    ✔     | TypeError |    TypeError     |
+| `${v}`              |    ✔     |    ✔     | TypeError |    TypeError     |
+| v.toString()        | TypeError | TypeError |    ✔     |    TypeError     |
+| {}.toString.call(v) |    ✔     |    ✔     |    ✔     |        ✔        |
+
+{}.toString.call(v)
+Object.prototype.toString.call(v) 两者是等价的
+
+```js
+> String({__proto__: null}) // no method available
+TypeError: Cannot convert object to primitive value
+> String({__proto__: null, [Symbol.toPrimitive]() {return 'YES'}})
+'YES'
+> String({__proto__: null, toString() {return 'YES'}})
+'YES'
+> String({__proto__: null, valueOf() {return 'YES'}})
+'YES'
+> String({__proto__: null, toString() { return undefined }})
+'undefined'
+> String({__proto__: null, toString() { return null }})
+'null'
+> String({__proto__: null, toString() { return {} }})
+TypeError: Cannot convert object to primitive value
+```
@@ -376 +406 @@ Promise.resolve(1).finally(()=>{
-```
\ No newline at end of file
+字符串的转化 https://2ality.com/2025/04/stringification-javascript.html

````

## package-lock.json

```diff
diff --git a/package-lock.json b/package-lock.json
index aca4b47..8df4d1f 100644
--- a/package-lock.json
+++ b/package-lock.json
@@ -12,0 +13,741 @@
+      },
+      "devDependencies": {
+        "husky": "^9.1.7",
+        "lint-staged": "^15.5.2",
+        "prettier": "^3.5.3"
+      }
+    },
+    "node_modules/ansi-escapes": {
+      "version": "7.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/ansi-escapes/-/ansi-escapes-7.0.0.tgz",
+      "integrity": "sha512-GdYO7a61mR0fOlAsvC9/rIHf7L96sBc6dEWzeOu+KAea5bZyQRPIpojrVoI4AXGJS/ycu/fBTdLrUkA4ODrvjw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "environment": "^1.0.0"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/ansi-regex": {
+      "version": "6.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/ansi-regex/-/ansi-regex-6.1.0.tgz",
+      "integrity": "sha512-7HSX4QQb4CspciLpVFwyRe79O3xsIZDDLER21kERQ71oaPodF8jL725AgJMFAYbooIqolJoRLuM81SpeUkpkvA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/chalk/ansi-regex?sponsor=1"
+      }
+    },
+    "node_modules/ansi-styles": {
+      "version": "6.2.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/ansi-styles/-/ansi-styles-6.2.1.tgz",
+      "integrity": "sha512-bN798gFfQX+viw3R7yrGWRqnrN2oRkEkUjjl4JNn4E8GxxbjtG3FbrEIIY3l8/hrwUwIeCZvi4QuOTP4MErVug==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
+      }
+    },
+    "node_modules/braces": {
+      "version": "3.0.3",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/braces/-/braces-3.0.3.tgz",
+      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "fill-range": "^7.1.1"
+      },
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/chalk": {
+      "version": "5.4.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/chalk/-/chalk-5.4.1.tgz",
+      "integrity": "sha512-zgVZuo2WcZgfUEmsn6eO3kINexW8RAE4maiQ8QNs8CtpPCSyMiYsULR3HQYkm3w8FIA3SberyMJMSldGsW+U3w==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": "^12.17.0 || ^14.13 || >=16.0.0"
+      },
+      "funding": {
+        "url": "https://github.com/chalk/chalk?sponsor=1"
+      }
+    },
+    "node_modules/cli-cursor": {
+      "version": "5.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/cli-cursor/-/cli-cursor-5.0.0.tgz",
+      "integrity": "sha512-aCj4O5wKyszjMmDT4tZj93kxyydN/K5zPWSCe6/0AV/AA1pqe5ZBIw0a2ZfPQV7lL5/yb5HsUreJ6UFAF1tEQw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "restore-cursor": "^5.0.0"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/cli-truncate": {
+      "version": "4.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/cli-truncate/-/cli-truncate-4.0.0.tgz",
+      "integrity": "sha512-nPdaFdQ0h/GEigbPClz11D0v/ZJEwxmeVZGeMo3Z5StPtUTkA9o1lD6QwoirYiSDzbcwn2XcjwmCp68W1IS4TA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "slice-ansi": "^5.0.0",
+        "string-width": "^7.0.0"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/colorette": {
+      "version": "2.0.20",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/colorette/-/colorette-2.0.20.tgz",
+      "integrity": "sha512-IfEDxwoWIjkeXL1eXcDiow4UbKjhLdq6/EuSVR9GMN7KVH3r9gQ83e73hsz1Nd1T3ijd5xv1wcWRYO+D6kCI2w==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/commander": {
+      "version": "13.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/commander/-/commander-13.1.0.tgz",
+      "integrity": "sha512-/rFeCpNJQbhSZjGVwO9RFV3xPqbnERS8MmIQzCtD/zl6gpJuV/bMLuN92oG3F7d8oDEHHRrujSXNUr8fpjntKw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/cross-spawn": {
+      "version": "7.0.6",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/cross-spawn/-/cross-spawn-7.0.6.tgz",
+      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "path-key": "^3.1.0",
+        "shebang-command": "^2.0.0",
+        "which": "^2.0.1"
+      },
+      "engines": {
+        "node": ">= 8"
+      }
+    },
+    "node_modules/debug": {
+      "version": "4.4.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/debug/-/debug-4.4.0.tgz",
+      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "ms": "^2.1.3"
+      },
+      "engines": {
+        "node": ">=6.0"
+      },
+      "peerDependenciesMeta": {
+        "supports-color": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/emoji-regex": {
+      "version": "10.4.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/emoji-regex/-/emoji-regex-10.4.0.tgz",
+      "integrity": "sha512-EC+0oUMY1Rqm4O6LLrgjtYDvcVYTy7chDnM4Q7030tP4Kwj3u/pR6gP9ygnp2CJMK5Gq+9Q2oqmrFJAz01DXjw==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/environment": {
+      "version": "1.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/environment/-/environment-1.1.0.tgz",
+      "integrity": "sha512-xUtoPkMggbz0MPyPiIWr1Kp4aeWJjDZ6SMvURhimjdZgsRuDplF5/s9hcgGhyXMhs+6vpnuoiZ2kFiu3FMnS8Q==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/eventemitter3": {
+      "version": "5.0.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/eventemitter3/-/eventemitter3-5.0.1.tgz",
+      "integrity": "sha512-GWkBvjiSZK87ELrYOSESUYeVIc9mvLLf/nXalMOS5dYrgZq9o5OVkbZAVM06CVxYsCwH9BDZFPlQTlPA1j4ahA==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/execa": {
+      "version": "8.0.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/execa/-/execa-8.0.1.tgz",
+      "integrity": "sha512-VyhnebXciFV2DESc+p6B+y0LjSm0krU4OgJN44qFAhBY0TJ+1V61tYD2+wHusZ6F9n5K+vl8k0sTy7PEfV4qpg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "cross-spawn": "^7.0.3",
+        "get-stream": "^8.0.1",
+        "human-signals": "^5.0.0",
+        "is-stream": "^3.0.0",
+        "merge-stream": "^2.0.0",
+        "npm-run-path": "^5.1.0",
+        "onetime": "^6.0.0",
+        "signal-exit": "^4.1.0",
+        "strip-final-newline": "^3.0.0"
+      },
+      "engines": {
+        "node": ">=16.17"
+      },
+      "funding": {
+        "url": "https://github.com/sindresorhus/execa?sponsor=1"
+      }
+    },
+    "node_modules/fill-range": {
+      "version": "7.1.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/fill-range/-/fill-range-7.1.1.tgz",
+      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "to-regex-range": "^5.0.1"
+      },
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/get-east-asian-width": {
+      "version": "1.3.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/get-east-asian-width/-/get-east-asian-width-1.3.0.tgz",
+      "integrity": "sha512-vpeMIQKxczTD/0s2CdEWHcb0eeJe6TFjxb+J5xgX7hScxqrGuyjmv4c1D4A/gelKfyox0gJJwIHF+fLjeaM8kQ==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/get-stream": {
+      "version": "8.0.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/get-stream/-/get-stream-8.0.1.tgz",
+      "integrity": "sha512-VaUJspBffn/LMCJVoMvSAdmscJyS1auj5Zulnn5UoYcY531UWmdwhRWkcGKnGU93m5HSXP9LP2usOryrBtQowA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=16"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/human-signals": {
+      "version": "5.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/human-signals/-/human-signals-5.0.0.tgz",
+      "integrity": "sha512-AXcZb6vzzrFAUE61HnN4mpLqd/cSIwNQjtNWR0euPm6y0iqx3G4gOXaIDdtdDwZmhwe82LA6+zinmW4UBWVePQ==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "engines": {
+        "node": ">=16.17.0"
+      }
+    },
+    "node_modules/husky": {
+      "version": "9.1.7",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/husky/-/husky-9.1.7.tgz",
+      "integrity": "sha512-5gs5ytaNjBrh5Ow3zrvdUUY+0VxIuWVL4i9irt6friV+BqdCfmV11CQTWMiBYWHbXhco+J1kHfTOUkePhCDvMA==",
+      "dev": true,
+      "license": "MIT",
+      "bin": {
+        "husky": "bin.js"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/typicode"
+      }
+    },
+    "node_modules/is-fullwidth-code-point": {
+      "version": "4.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/is-fullwidth-code-point/-/is-fullwidth-code-point-4.0.0.tgz",
+      "integrity": "sha512-O4L094N2/dZ7xqVdrXhh9r1KODPJpFms8B5sGdJLPy664AgvXsreZUyCQQNItZRDlYug4xStLjNp/sz3HvBowQ==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/is-number": {
+      "version": "7.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/is-number/-/is-number-7.0.0.tgz",
+      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=0.12.0"
+      }
+    },
+    "node_modules/is-stream": {
+      "version": "3.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/is-stream/-/is-stream-3.0.0.tgz",
+      "integrity": "sha512-LnQR4bZ9IADDRSkvpqMGvt/tEJWclzklNgSw48V5EAaAeDd6qGvN8ei6k5p0tvxSR171VmGyHuTiAOfxAbr8kA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/isexe": {
+      "version": "2.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/isexe/-/isexe-2.0.0.tgz",
+      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
+      "dev": true,
+      "license": "ISC"
+    },
+    "node_modules/lilconfig": {
+      "version": "3.1.3",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/lilconfig/-/lilconfig-3.1.3.tgz",
+      "integrity": "sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=14"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/antonk52"
+      }
+    },
+    "node_modules/lint-staged": {
+      "version": "15.5.2",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/lint-staged/-/lint-staged-15.5.2.tgz",
+      "integrity": "sha512-YUSOLq9VeRNAo/CTaVmhGDKG+LBtA8KF1X4K5+ykMSwWST1vDxJRB2kv2COgLb1fvpCo+A/y9A0G0znNVmdx4w==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "chalk": "^5.4.1",
+        "commander": "^13.1.0",
+        "debug": "^4.4.0",
+        "execa": "^8.0.1",
+        "lilconfig": "^3.1.3",
+        "listr2": "^8.2.5",
+        "micromatch": "^4.0.8",
+        "pidtree": "^0.6.0",
+        "string-argv": "^0.3.2",
+        "yaml": "^2.7.0"
+      },
+      "bin": {
+        "lint-staged": "bin/lint-staged.js"
+      },
+      "engines": {
+        "node": ">=18.12.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/lint-staged"
+      }
+    },
+    "node_modules/listr2": {
+      "version": "8.3.3",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/listr2/-/listr2-8.3.3.tgz",
+      "integrity": "sha512-LWzX2KsqcB1wqQ4AHgYb4RsDXauQiqhjLk+6hjbaeHG4zpjjVAB6wC/gz6X0l+Du1cN3pUB5ZlrvTbhGSNnUQQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "cli-truncate": "^4.0.0",
+        "colorette": "^2.0.20",
+        "eventemitter3": "^5.0.1",
+        "log-update": "^6.1.0",
+        "rfdc": "^1.4.1",
+        "wrap-ansi": "^9.0.0"
+      },
+      "engines": {
+        "node": ">=18.0.0"
+      }
+    },
+    "node_modules/log-update": {
+      "version": "6.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/log-update/-/log-update-6.1.0.tgz",
+      "integrity": "sha512-9ie8ItPR6tjY5uYJh8K/Zrv/RMZ5VOlOWvtZdEHYSTFKZfIBPQa9tOAEeAWhd+AnIneLJ22w5fjOYtoutpWq5w==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "ansi-escapes": "^7.0.0",
+        "cli-cursor": "^5.0.0",
+        "slice-ansi": "^7.1.0",
+        "strip-ansi": "^7.1.0",
+        "wrap-ansi": "^9.0.0"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/log-update/node_modules/is-fullwidth-code-point": {
+      "version": "5.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/is-fullwidth-code-point/-/is-fullwidth-code-point-5.0.0.tgz",
+      "integrity": "sha512-OVa3u9kkBbw7b8Xw5F9P+D/T9X+Z4+JruYVNapTjPYZYUznQ5YfWeFkOj606XYYW8yugTfC8Pj0hYqvi4ryAhA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "get-east-asian-width": "^1.0.0"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/log-update/node_modules/slice-ansi": {
+      "version": "7.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/slice-ansi/-/slice-ansi-7.1.0.tgz",
+      "integrity": "sha512-bSiSngZ/jWeX93BqeIAbImyTbEihizcwNjFoRUIY/T1wWQsfsm2Vw1agPKylXvQTU7iASGdHhyqRlqQzfz+Htg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "ansi-styles": "^6.2.1",
+        "is-fullwidth-code-point": "^5.0.0"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/chalk/slice-ansi?sponsor=1"
+      }
+    },
+    "node_modules/merge-stream": {
+      "version": "2.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/merge-stream/-/merge-stream-2.0.0.tgz",
+      "integrity": "sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/micromatch": {
+      "version": "4.0.8",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/micromatch/-/micromatch-4.0.8.tgz",
+      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "braces": "^3.0.3",
+        "picomatch": "^2.3.1"
+      },
+      "engines": {
+        "node": ">=8.6"
+      }
+    },
+    "node_modules/mimic-fn": {
+      "version": "4.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/mimic-fn/-/mimic-fn-4.0.0.tgz",
+      "integrity": "sha512-vqiC06CuhBTUdZH+RYl8sFrL096vA45Ok5ISO6sE/Mr1jRbGH4Csnhi8f3wKVl7x8mO4Au7Ir9D3Oyv1VYMFJw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/mimic-function": {
+      "version": "5.0.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/mimic-function/-/mimic-function-5.0.1.tgz",
+      "integrity": "sha512-VP79XUPxV2CigYP3jWwAUFSku2aKqBH7uTAapFWCBqutsbmDo96KY5o8uh6U+/YSIn5OxJnXp73beVkpqMIGhA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/ms": {
+      "version": "2.1.3",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/ms/-/ms-2.1.3.tgz",
+      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/npm-run-path": {
+      "version": "5.3.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/npm-run-path/-/npm-run-path-5.3.0.tgz",
+      "integrity": "sha512-ppwTtiJZq0O/ai0z7yfudtBpWIoxM8yE6nHi1X47eFR2EWORqfbu6CnPlNsjeN683eT0qG6H/Pyf9fCcvjnnnQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "path-key": "^4.0.0"
+      },
+      "engines": {
+        "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/npm-run-path/node_modules/path-key": {
+      "version": "4.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/path-key/-/path-key-4.0.0.tgz",
+      "integrity": "sha512-haREypq7xkM7ErfgIyA0z+Bj4AGKlMSdlQE2jvJo6huWD1EdkKYV+G/T4nq0YEF2vgTT8kqMFKo1uHn950r4SQ==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/onetime": {
+      "version": "6.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/onetime/-/onetime-6.0.0.tgz",
+      "integrity": "sha512-1FlR+gjXK7X+AsAHso35MnyN5KqGwJRi/31ft6x0M194ht7S+rWAvd7PHss9xSKMzE0asv1pyIHaJYq+BbacAQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "mimic-fn": "^4.0.0"
+      },
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/path-key": {
+      "version": "3.1.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/path-key/-/path-key-3.1.1.tgz",
+      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/picomatch": {
+      "version": "2.3.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/picomatch/-/picomatch-2.3.1.tgz",
+      "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=8.6"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/jonschlinkert"
+      }
+    },
+    "node_modules/pidtree": {
+      "version": "0.6.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/pidtree/-/pidtree-0.6.0.tgz",
+      "integrity": "sha512-eG2dWTVw5bzqGRztnHExczNxt5VGsE6OwTeCG3fdUf9KBsZzO3R5OIIIzWR+iZA0NtZ+RDVdaoE2dK1cn6jH4g==",
+      "dev": true,
+      "license": "MIT",
+      "bin": {
+        "pidtree": "bin/pidtree.js"
+      },
+      "engines": {
+        "node": ">=0.10"
+      }
+    },
+    "node_modules/prettier": {
+      "version": "3.5.3",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/prettier/-/prettier-3.5.3.tgz",
+      "integrity": "sha512-QQtaxnoDJeAkDvDKWCLiwIXkTgRhwYDEQCghU9Z6q03iyek/rxRh/2lC3HB7P8sWT2xC/y5JDctPLBIGzHKbhw==",
+      "dev": true,
+      "license": "MIT",
+      "bin": {
+        "prettier": "bin/prettier.cjs"
+      },
+      "engines": {
+        "node": ">=14"
+      },
+      "funding": {
+        "url": "https://github.com/prettier/prettier?sponsor=1"
+      }
+    },
+    "node_modules/restore-cursor": {
+      "version": "5.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/restore-cursor/-/restore-cursor-5.1.0.tgz",
+      "integrity": "sha512-oMA2dcrw6u0YfxJQXm342bFKX/E4sG9rbTzO9ptUcR/e8A33cHuvStiYOwH7fszkZlZ1z/ta9AAoPk2F4qIOHA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "onetime": "^7.0.0",
+        "signal-exit": "^4.1.0"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/restore-cursor/node_modules/onetime": {
+      "version": "7.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/onetime/-/onetime-7.0.0.tgz",
+      "integrity": "sha512-VXJjc87FScF88uafS3JllDgvAm+c/Slfz06lorj2uAY34rlUu0Nt+v8wreiImcrgAjjIHp1rXpTDlLOGw29WwQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "mimic-function": "^5.0.0"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/rfdc": {
+      "version": "1.4.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/rfdc/-/rfdc-1.4.1.tgz",
+      "integrity": "sha512-q1b3N5QkRUWUl7iyylaaj3kOpIT0N2i9MqIEQXP73GVsN9cw3fdx8X63cEmWhJGi2PPCF23Ijp7ktmd39rawIA==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/shebang-command": {
+      "version": "2.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/shebang-command/-/shebang-command-2.0.0.tgz",
+      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "shebang-regex": "^3.0.0"
+      },
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/shebang-regex": {
+      "version": "3.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/shebang-regex/-/shebang-regex-3.0.0.tgz",
+      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=8"
+      }
+    },
+    "node_modules/signal-exit": {
+      "version": "4.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/signal-exit/-/signal-exit-4.1.0.tgz",
+      "integrity": "sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==",
+      "dev": true,
+      "license": "ISC",
+      "engines": {
+        "node": ">=14"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/isaacs"
+      }
+    },
+    "node_modules/slice-ansi": {
+      "version": "5.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/slice-ansi/-/slice-ansi-5.0.0.tgz",
+      "integrity": "sha512-FC+lgizVPfie0kkhqUScwRu1O/lF6NOgJmlCgK+/LYxDCTk8sGelYaHDhFcDN+Sn3Cv+3VSa4Byeo+IMCzpMgQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "ansi-styles": "^6.0.0",
+        "is-fullwidth-code-point": "^4.0.0"
+      },
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/chalk/slice-ansi?sponsor=1"
+      }
+    },
+    "node_modules/string-argv": {
+      "version": "0.3.2",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/string-argv/-/string-argv-0.3.2.tgz",
+      "integrity": "sha512-aqD2Q0144Z+/RqG52NeHEkZauTAUWJO8c6yTftGJKO3Tja5tUgIfmIl6kExvhtxSDP7fXB6DvzkfMpCd/F3G+Q==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=0.6.19"
+      }
+    },
+    "node_modules/string-width": {
+      "version": "7.2.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/string-width/-/string-width-7.2.0.tgz",
+      "integrity": "sha512-tsaTIkKW9b4N+AEj+SVA+WhJzV7/zMhcSu78mLKWSk7cXMOSHsBKFWUs0fWwq8QyK3MgJBQRX6Gbi4kYbdvGkQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "emoji-regex": "^10.3.0",
+        "get-east-asian-width": "^1.0.0",
+        "strip-ansi": "^7.1.0"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/strip-ansi": {
+      "version": "7.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/strip-ansi/-/strip-ansi-7.1.0.tgz",
+      "integrity": "sha512-iq6eVVI64nQQTRYq2KtEg2d2uU7LElhTJwsH4YzIHZshxlgZms/wIc4VoDQTlG/IvVIrBKG06CrZnp0qv7hkcQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "ansi-regex": "^6.0.1"
+      },
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/chalk/strip-ansi?sponsor=1"
+      }
+    },
+    "node_modules/strip-final-newline": {
+      "version": "3.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/strip-final-newline/-/strip-final-newline-3.0.0.tgz",
+      "integrity": "sha512-dOESqjYr96iWYylGObzd39EuNTa5VJxyvVAEm5Jnh7KGo75V43Hk1odPQkNDyXNmUR6k+gEiDVXnjB8HJ3crXw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=12"
+      },
+      "funding": {
+        "url": "https://github.com/sponsors/sindresorhus"
+      }
+    },
+    "node_modules/to-regex-range": {
+      "version": "5.0.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/to-regex-range/-/to-regex-range-5.0.1.tgz",
+      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "is-number": "^7.0.0"
+      },
+      "engines": {
+        "node": ">=8.0"
@@ -26,0 +768,47 @@
+    },
+    "node_modules/which": {
+      "version": "2.0.2",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/which/-/which-2.0.2.tgz",
+      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
+      "dev": true,
+      "license": "ISC",
+      "dependencies": {
+        "isexe": "^2.0.0"
+      },
+      "bin": {
+        "node-which": "bin/node-which"
+      },
+      "engines": {
+        "node": ">= 8"
+      }
+    },
+    "node_modules/wrap-ansi": {
+      "version": "9.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/wrap-ansi/-/wrap-ansi-9.0.0.tgz",
+      "integrity": "sha512-G8ura3S+3Z2G+mkgNRq8dqaFZAuxfsxpBB8OCTGRTCtp+l/v9nbFNmCUP1BZMts3G1142MsZfn6eeUKrr4PD1Q==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "ansi-styles": "^6.2.1",
+        "string-width": "^7.0.0",
+        "strip-ansi": "^7.1.0"
+      },
+      "engines": {
+        "node": ">=18"
+      },
+      "funding": {
+        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
+      }
+    },
+    "node_modules/yaml": {
+      "version": "2.7.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/yaml/-/yaml-2.7.1.tgz",
+      "integrity": "sha512-10ULxpnOCQXxJvBgxsn9ptjq6uviG/htZKk9veJGhlqn3w/DxQ631zFF+nlQXLwmImeS5amR2dl2U8sg6U9jsQ==",
+      "dev": true,
+      "license": "ISC",
+      "bin": {
+        "yaml": "bin.mjs"
+      },
+      "engines": {
+        "node": ">= 14"
+      }
@@ -29,0 +818,434 @@
+    "ansi-escapes": {
+      "version": "7.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/ansi-escapes/-/ansi-escapes-7.0.0.tgz",
+      "integrity": "sha512-GdYO7a61mR0fOlAsvC9/rIHf7L96sBc6dEWzeOu+KAea5bZyQRPIpojrVoI4AXGJS/ycu/fBTdLrUkA4ODrvjw==",
+      "dev": true,
+      "requires": {
+        "environment": "^1.0.0"
+      }
+    },
+    "ansi-regex": {
+      "version": "6.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/ansi-regex/-/ansi-regex-6.1.0.tgz",
+      "integrity": "sha512-7HSX4QQb4CspciLpVFwyRe79O3xsIZDDLER21kERQ71oaPodF8jL725AgJMFAYbooIqolJoRLuM81SpeUkpkvA==",
+      "dev": true
+    },
+    "ansi-styles": {
+      "version": "6.2.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/ansi-styles/-/ansi-styles-6.2.1.tgz",
+      "integrity": "sha512-bN798gFfQX+viw3R7yrGWRqnrN2oRkEkUjjl4JNn4E8GxxbjtG3FbrEIIY3l8/hrwUwIeCZvi4QuOTP4MErVug==",
+      "dev": true
+    },
+    "braces": {
+      "version": "3.0.3",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/braces/-/braces-3.0.3.tgz",
+      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
+      "dev": true,
+      "requires": {
+        "fill-range": "^7.1.1"
+      }
+    },
+    "chalk": {
+      "version": "5.4.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/chalk/-/chalk-5.4.1.tgz",
+      "integrity": "sha512-zgVZuo2WcZgfUEmsn6eO3kINexW8RAE4maiQ8QNs8CtpPCSyMiYsULR3HQYkm3w8FIA3SberyMJMSldGsW+U3w==",
+      "dev": true
+    },
+    "cli-cursor": {
+      "version": "5.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/cli-cursor/-/cli-cursor-5.0.0.tgz",
+      "integrity": "sha512-aCj4O5wKyszjMmDT4tZj93kxyydN/K5zPWSCe6/0AV/AA1pqe5ZBIw0a2ZfPQV7lL5/yb5HsUreJ6UFAF1tEQw==",
+      "dev": true,
+      "requires": {
+        "restore-cursor": "^5.0.0"
+      }
+    },
+    "cli-truncate": {
+      "version": "4.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/cli-truncate/-/cli-truncate-4.0.0.tgz",
+      "integrity": "sha512-nPdaFdQ0h/GEigbPClz11D0v/ZJEwxmeVZGeMo3Z5StPtUTkA9o1lD6QwoirYiSDzbcwn2XcjwmCp68W1IS4TA==",
+      "dev": true,
+      "requires": {
+        "slice-ansi": "^5.0.0",
+        "string-width": "^7.0.0"
+      }
+    },
+    "colorette": {
+      "version": "2.0.20",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/colorette/-/colorette-2.0.20.tgz",
+      "integrity": "sha512-IfEDxwoWIjkeXL1eXcDiow4UbKjhLdq6/EuSVR9GMN7KVH3r9gQ83e73hsz1Nd1T3ijd5xv1wcWRYO+D6kCI2w==",
+      "dev": true
+    },
+    "commander": {
+      "version": "13.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/commander/-/commander-13.1.0.tgz",
+      "integrity": "sha512-/rFeCpNJQbhSZjGVwO9RFV3xPqbnERS8MmIQzCtD/zl6gpJuV/bMLuN92oG3F7d8oDEHHRrujSXNUr8fpjntKw==",
+      "dev": true
+    },
+    "cross-spawn": {
+      "version": "7.0.6",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/cross-spawn/-/cross-spawn-7.0.6.tgz",
+      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
+      "dev": true,
+      "requires": {
+        "path-key": "^3.1.0",
+        "shebang-command": "^2.0.0",
+        "which": "^2.0.1"
+      }
+    },
+    "debug": {
+      "version": "4.4.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/debug/-/debug-4.4.0.tgz",
+      "integrity": "sha512-6WTZ/IxCY/T6BALoZHaE4ctp9xm+Z5kY/pzYaCHRFeyVhojxlrm+46y68HA6hr0TcwEssoxNiDEUJQjfPZ/RYA==",
+      "dev": true,
+      "requires": {
+        "ms": "^2.1.3"
+      }
+    },
+    "emoji-regex": {
+      "version": "10.4.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/emoji-regex/-/emoji-regex-10.4.0.tgz",
+      "integrity": "sha512-EC+0oUMY1Rqm4O6LLrgjtYDvcVYTy7chDnM4Q7030tP4Kwj3u/pR6gP9ygnp2CJMK5Gq+9Q2oqmrFJAz01DXjw==",
+      "dev": true
+    },
+    "environment": {
+      "version": "1.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/environment/-/environment-1.1.0.tgz",
+      "integrity": "sha512-xUtoPkMggbz0MPyPiIWr1Kp4aeWJjDZ6SMvURhimjdZgsRuDplF5/s9hcgGhyXMhs+6vpnuoiZ2kFiu3FMnS8Q==",
+      "dev": true
+    },
+    "eventemitter3": {
+      "version": "5.0.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/eventemitter3/-/eventemitter3-5.0.1.tgz",
+      "integrity": "sha512-GWkBvjiSZK87ELrYOSESUYeVIc9mvLLf/nXalMOS5dYrgZq9o5OVkbZAVM06CVxYsCwH9BDZFPlQTlPA1j4ahA==",
+      "dev": true
+    },
+    "execa": {
+      "version": "8.0.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/execa/-/execa-8.0.1.tgz",
+      "integrity": "sha512-VyhnebXciFV2DESc+p6B+y0LjSm0krU4OgJN44qFAhBY0TJ+1V61tYD2+wHusZ6F9n5K+vl8k0sTy7PEfV4qpg==",
+      "dev": true,
+      "requires": {
+        "cross-spawn": "^7.0.3",
+        "get-stream": "^8.0.1",
+        "human-signals": "^5.0.0",
+        "is-stream": "^3.0.0",
+        "merge-stream": "^2.0.0",
+        "npm-run-path": "^5.1.0",
+        "onetime": "^6.0.0",
+        "signal-exit": "^4.1.0",
+        "strip-final-newline": "^3.0.0"
+      }
+    },
+    "fill-range": {
+      "version": "7.1.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/fill-range/-/fill-range-7.1.1.tgz",
+      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
+      "dev": true,
+      "requires": {
+        "to-regex-range": "^5.0.1"
+      }
+    },
+    "get-east-asian-width": {
+      "version": "1.3.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/get-east-asian-width/-/get-east-asian-width-1.3.0.tgz",
+      "integrity": "sha512-vpeMIQKxczTD/0s2CdEWHcb0eeJe6TFjxb+J5xgX7hScxqrGuyjmv4c1D4A/gelKfyox0gJJwIHF+fLjeaM8kQ==",
+      "dev": true
+    },
+    "get-stream": {
+      "version": "8.0.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/get-stream/-/get-stream-8.0.1.tgz",
+      "integrity": "sha512-VaUJspBffn/LMCJVoMvSAdmscJyS1auj5Zulnn5UoYcY531UWmdwhRWkcGKnGU93m5HSXP9LP2usOryrBtQowA==",
+      "dev": true
+    },
+    "human-signals": {
+      "version": "5.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/human-signals/-/human-signals-5.0.0.tgz",
+      "integrity": "sha512-AXcZb6vzzrFAUE61HnN4mpLqd/cSIwNQjtNWR0euPm6y0iqx3G4gOXaIDdtdDwZmhwe82LA6+zinmW4UBWVePQ==",
+      "dev": true
+    },
+    "husky": {
+      "version": "9.1.7",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/husky/-/husky-9.1.7.tgz",
+      "integrity": "sha512-5gs5ytaNjBrh5Ow3zrvdUUY+0VxIuWVL4i9irt6friV+BqdCfmV11CQTWMiBYWHbXhco+J1kHfTOUkePhCDvMA==",
+      "dev": true
+    },
+    "is-fullwidth-code-point": {
+      "version": "4.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/is-fullwidth-code-point/-/is-fullwidth-code-point-4.0.0.tgz",
+      "integrity": "sha512-O4L094N2/dZ7xqVdrXhh9r1KODPJpFms8B5sGdJLPy664AgvXsreZUyCQQNItZRDlYug4xStLjNp/sz3HvBowQ==",
+      "dev": true
+    },
+    "is-number": {
+      "version": "7.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/is-number/-/is-number-7.0.0.tgz",
+      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
+      "dev": true
+    },
+    "is-stream": {
+      "version": "3.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/is-stream/-/is-stream-3.0.0.tgz",
+      "integrity": "sha512-LnQR4bZ9IADDRSkvpqMGvt/tEJWclzklNgSw48V5EAaAeDd6qGvN8ei6k5p0tvxSR171VmGyHuTiAOfxAbr8kA==",
+      "dev": true
+    },
+    "isexe": {
+      "version": "2.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/isexe/-/isexe-2.0.0.tgz",
+      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
+      "dev": true
+    },
+    "lilconfig": {
+      "version": "3.1.3",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/lilconfig/-/lilconfig-3.1.3.tgz",
+      "integrity": "sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==",
+      "dev": true
+    },
+    "lint-staged": {
+      "version": "15.5.2",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/lint-staged/-/lint-staged-15.5.2.tgz",
+      "integrity": "sha512-YUSOLq9VeRNAo/CTaVmhGDKG+LBtA8KF1X4K5+ykMSwWST1vDxJRB2kv2COgLb1fvpCo+A/y9A0G0znNVmdx4w==",
+      "dev": true,
+      "requires": {
+        "chalk": "^5.4.1",
+        "commander": "^13.1.0",
+        "debug": "^4.4.0",
+        "execa": "^8.0.1",
+        "lilconfig": "^3.1.3",
+        "listr2": "^8.2.5",
+        "micromatch": "^4.0.8",
+        "pidtree": "^0.6.0",
+        "string-argv": "^0.3.2",
+        "yaml": "^2.7.0"
+      }
+    },
+    "listr2": {
+      "version": "8.3.3",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/listr2/-/listr2-8.3.3.tgz",
+      "integrity": "sha512-LWzX2KsqcB1wqQ4AHgYb4RsDXauQiqhjLk+6hjbaeHG4zpjjVAB6wC/gz6X0l+Du1cN3pUB5ZlrvTbhGSNnUQQ==",
+      "dev": true,
+      "requires": {
+        "cli-truncate": "^4.0.0",
+        "colorette": "^2.0.20",
+        "eventemitter3": "^5.0.1",
+        "log-update": "^6.1.0",
+        "rfdc": "^1.4.1",
+        "wrap-ansi": "^9.0.0"
+      }
+    },
+    "log-update": {
+      "version": "6.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/log-update/-/log-update-6.1.0.tgz",
+      "integrity": "sha512-9ie8ItPR6tjY5uYJh8K/Zrv/RMZ5VOlOWvtZdEHYSTFKZfIBPQa9tOAEeAWhd+AnIneLJ22w5fjOYtoutpWq5w==",
+      "dev": true,
+      "requires": {
+        "ansi-escapes": "^7.0.0",
+        "cli-cursor": "^5.0.0",
+        "slice-ansi": "^7.1.0",
+        "strip-ansi": "^7.1.0",
+        "wrap-ansi": "^9.0.0"
+      },
+      "dependencies": {
+        "is-fullwidth-code-point": {
+          "version": "5.0.0",
+          "resolved": "https://reg.yingzhongtong.com/repository/npm_public/is-fullwidth-code-point/-/is-fullwidth-code-point-5.0.0.tgz",
+          "integrity": "sha512-OVa3u9kkBbw7b8Xw5F9P+D/T9X+Z4+JruYVNapTjPYZYUznQ5YfWeFkOj606XYYW8yugTfC8Pj0hYqvi4ryAhA==",
+          "dev": true,
+          "requires": {
+            "get-east-asian-width": "^1.0.0"
+          }
+        },
+        "slice-ansi": {
+          "version": "7.1.0",
+          "resolved": "https://reg.yingzhongtong.com/repository/npm_public/slice-ansi/-/slice-ansi-7.1.0.tgz",
+          "integrity": "sha512-bSiSngZ/jWeX93BqeIAbImyTbEihizcwNjFoRUIY/T1wWQsfsm2Vw1agPKylXvQTU7iASGdHhyqRlqQzfz+Htg==",
+          "dev": true,
+          "requires": {
+            "ansi-styles": "^6.2.1",
+            "is-fullwidth-code-point": "^5.0.0"
+          }
+        }
+      }
+    },
+    "merge-stream": {
+      "version": "2.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/merge-stream/-/merge-stream-2.0.0.tgz",
+      "integrity": "sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w==",
+      "dev": true
+    },
+    "micromatch": {
+      "version": "4.0.8",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/micromatch/-/micromatch-4.0.8.tgz",
+      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
+      "dev": true,
+      "requires": {
+        "braces": "^3.0.3",
+        "picomatch": "^2.3.1"
+      }
+    },
+    "mimic-fn": {
+      "version": "4.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/mimic-fn/-/mimic-fn-4.0.0.tgz",
+      "integrity": "sha512-vqiC06CuhBTUdZH+RYl8sFrL096vA45Ok5ISO6sE/Mr1jRbGH4Csnhi8f3wKVl7x8mO4Au7Ir9D3Oyv1VYMFJw==",
+      "dev": true
+    },
+    "mimic-function": {
+      "version": "5.0.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/mimic-function/-/mimic-function-5.0.1.tgz",
+      "integrity": "sha512-VP79XUPxV2CigYP3jWwAUFSku2aKqBH7uTAapFWCBqutsbmDo96KY5o8uh6U+/YSIn5OxJnXp73beVkpqMIGhA==",
+      "dev": true
+    },
+    "ms": {
+      "version": "2.1.3",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/ms/-/ms-2.1.3.tgz",
+      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
+      "dev": true
+    },
+    "npm-run-path": {
+      "version": "5.3.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/npm-run-path/-/npm-run-path-5.3.0.tgz",
+      "integrity": "sha512-ppwTtiJZq0O/ai0z7yfudtBpWIoxM8yE6nHi1X47eFR2EWORqfbu6CnPlNsjeN683eT0qG6H/Pyf9fCcvjnnnQ==",
+      "dev": true,
+      "requires": {
+        "path-key": "^4.0.0"
+      },
+      "dependencies": {
+        "path-key": {
+          "version": "4.0.0",
+          "resolved": "https://reg.yingzhongtong.com/repository/npm_public/path-key/-/path-key-4.0.0.tgz",
+          "integrity": "sha512-haREypq7xkM7ErfgIyA0z+Bj4AGKlMSdlQE2jvJo6huWD1EdkKYV+G/T4nq0YEF2vgTT8kqMFKo1uHn950r4SQ==",
+          "dev": true
+        }
+      }
+    },
+    "onetime": {
+      "version": "6.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/onetime/-/onetime-6.0.0.tgz",
+      "integrity": "sha512-1FlR+gjXK7X+AsAHso35MnyN5KqGwJRi/31ft6x0M194ht7S+rWAvd7PHss9xSKMzE0asv1pyIHaJYq+BbacAQ==",
+      "dev": true,
+      "requires": {
+        "mimic-fn": "^4.0.0"
+      }
+    },
+    "path-key": {
+      "version": "3.1.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/path-key/-/path-key-3.1.1.tgz",
+      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
+      "dev": true
+    },
+    "picomatch": {
+      "version": "2.3.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/picomatch/-/picomatch-2.3.1.tgz",
+      "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
+      "dev": true
+    },
+    "pidtree": {
+      "version": "0.6.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/pidtree/-/pidtree-0.6.0.tgz",
+      "integrity": "sha512-eG2dWTVw5bzqGRztnHExczNxt5VGsE6OwTeCG3fdUf9KBsZzO3R5OIIIzWR+iZA0NtZ+RDVdaoE2dK1cn6jH4g==",
+      "dev": true
+    },
+    "prettier": {
+      "version": "3.5.3",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/prettier/-/prettier-3.5.3.tgz",
+      "integrity": "sha512-QQtaxnoDJeAkDvDKWCLiwIXkTgRhwYDEQCghU9Z6q03iyek/rxRh/2lC3HB7P8sWT2xC/y5JDctPLBIGzHKbhw==",
+      "dev": true
+    },
+    "restore-cursor": {
+      "version": "5.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/restore-cursor/-/restore-cursor-5.1.0.tgz",
+      "integrity": "sha512-oMA2dcrw6u0YfxJQXm342bFKX/E4sG9rbTzO9ptUcR/e8A33cHuvStiYOwH7fszkZlZ1z/ta9AAoPk2F4qIOHA==",
+      "dev": true,
+      "requires": {
+        "onetime": "^7.0.0",
+        "signal-exit": "^4.1.0"
+      },
+      "dependencies": {
+        "onetime": {
+          "version": "7.0.0",
+          "resolved": "https://reg.yingzhongtong.com/repository/npm_public/onetime/-/onetime-7.0.0.tgz",
+          "integrity": "sha512-VXJjc87FScF88uafS3JllDgvAm+c/Slfz06lorj2uAY34rlUu0Nt+v8wreiImcrgAjjIHp1rXpTDlLOGw29WwQ==",
+          "dev": true,
+          "requires": {
+            "mimic-function": "^5.0.0"
+          }
+        }
+      }
+    },
+    "rfdc": {
+      "version": "1.4.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/rfdc/-/rfdc-1.4.1.tgz",
+      "integrity": "sha512-q1b3N5QkRUWUl7iyylaaj3kOpIT0N2i9MqIEQXP73GVsN9cw3fdx8X63cEmWhJGi2PPCF23Ijp7ktmd39rawIA==",
+      "dev": true
+    },
+    "shebang-command": {
+      "version": "2.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/shebang-command/-/shebang-command-2.0.0.tgz",
+      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
+      "dev": true,
+      "requires": {
+        "shebang-regex": "^3.0.0"
+      }
+    },
+    "shebang-regex": {
+      "version": "3.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/shebang-regex/-/shebang-regex-3.0.0.tgz",
+      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
+      "dev": true
+    },
+    "signal-exit": {
+      "version": "4.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/signal-exit/-/signal-exit-4.1.0.tgz",
+      "integrity": "sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==",
+      "dev": true
+    },
+    "slice-ansi": {
+      "version": "5.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/slice-ansi/-/slice-ansi-5.0.0.tgz",
+      "integrity": "sha512-FC+lgizVPfie0kkhqUScwRu1O/lF6NOgJmlCgK+/LYxDCTk8sGelYaHDhFcDN+Sn3Cv+3VSa4Byeo+IMCzpMgQ==",
+      "dev": true,
+      "requires": {
+        "ansi-styles": "^6.0.0",
+        "is-fullwidth-code-point": "^4.0.0"
+      }
+    },
+    "string-argv": {
+      "version": "0.3.2",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/string-argv/-/string-argv-0.3.2.tgz",
+      "integrity": "sha512-aqD2Q0144Z+/RqG52NeHEkZauTAUWJO8c6yTftGJKO3Tja5tUgIfmIl6kExvhtxSDP7fXB6DvzkfMpCd/F3G+Q==",
+      "dev": true
+    },
+    "string-width": {
+      "version": "7.2.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/string-width/-/string-width-7.2.0.tgz",
+      "integrity": "sha512-tsaTIkKW9b4N+AEj+SVA+WhJzV7/zMhcSu78mLKWSk7cXMOSHsBKFWUs0fWwq8QyK3MgJBQRX6Gbi4kYbdvGkQ==",
+      "dev": true,
+      "requires": {
+        "emoji-regex": "^10.3.0",
+        "get-east-asian-width": "^1.0.0",
+        "strip-ansi": "^7.1.0"
+      }
+    },
+    "strip-ansi": {
+      "version": "7.1.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/strip-ansi/-/strip-ansi-7.1.0.tgz",
+      "integrity": "sha512-iq6eVVI64nQQTRYq2KtEg2d2uU7LElhTJwsH4YzIHZshxlgZms/wIc4VoDQTlG/IvVIrBKG06CrZnp0qv7hkcQ==",
+      "dev": true,
+      "requires": {
+        "ansi-regex": "^6.0.1"
+      }
+    },
+    "strip-final-newline": {
+      "version": "3.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/strip-final-newline/-/strip-final-newline-3.0.0.tgz",
+      "integrity": "sha512-dOESqjYr96iWYylGObzd39EuNTa5VJxyvVAEm5Jnh7KGo75V43Hk1odPQkNDyXNmUR6k+gEiDVXnjB8HJ3crXw==",
+      "dev": true
+    },
+    "to-regex-range": {
+      "version": "5.0.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/to-regex-range/-/to-regex-range-5.0.1.tgz",
+      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
+      "dev": true,
+      "requires": {
+        "is-number": "^7.0.0"
+      }
+    },
@@ -33,0 +1256,26 @@
+    },
+    "which": {
+      "version": "2.0.2",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/which/-/which-2.0.2.tgz",
+      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
+      "dev": true,
+      "requires": {
+        "isexe": "^2.0.0"
+      }
+    },
+    "wrap-ansi": {
+      "version": "9.0.0",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/wrap-ansi/-/wrap-ansi-9.0.0.tgz",
+      "integrity": "sha512-G8ura3S+3Z2G+mkgNRq8dqaFZAuxfsxpBB8OCTGRTCtp+l/v9nbFNmCUP1BZMts3G1142MsZfn6eeUKrr4PD1Q==",
+      "dev": true,
+      "requires": {
+        "ansi-styles": "^6.2.1",
+        "string-width": "^7.0.0",
+        "strip-ansi": "^7.1.0"
+      }
+    },
+    "yaml": {
+      "version": "2.7.1",
+      "resolved": "https://reg.yingzhongtong.com/repository/npm_public/yaml/-/yaml-2.7.1.tgz",
+      "integrity": "sha512-10ULxpnOCQXxJvBgxsn9ptjq6uviG/htZKk9veJGhlqn3w/DxQ631zFF+nlQXLwmImeS5amR2dl2U8sg6U9jsQ==",
+      "dev": true

```

## package.json

```diff
diff --git a/package.json b/package.json
index 792bc53..279b9fc 100644
--- a/package.json
+++ b/package.json
@@ -10 +10,2 @@
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "test": "echo \"Error: no test specified\" && exit 1",
+    "prepare": "husky install"
@@ -24,0 +26,10 @@
+  },
+  "devDependencies": {
+    "husky": "^9.0.11",
+    "lint-staged": "^15.2.2",
+    "prettier": "^3.2.5"
+  },
+  "lint-staged": {
+    "*.{js,jsx,ts,tsx,json,css,scss,md}": [
+      "prettier --write"
+    ]

```

## scripts/generate-summary.js

````diff
diff --git a/scripts/generate-summary.js b/scripts/generate-summary.js
new file mode 100644
index 0000000..32e4fcf
--- /dev/null
+++ b/scripts/generate-summary.js
@@ -0,0 +1,50 @@
+const { execSync } = require("child_process");
+const fs = require("fs");
+const path = require("path");
+
+// 获取暂存区的文件列表
+const getStagedFiles = () => {
+  const output = execSync("git diff --cached --name-only").toString();
+  return output.split("\n").filter(Boolean);
+};
+
+// 获取文件的修改内容
+const getFileDiff = (filePath) => {
+  try {
+    return execSync(`git diff --cached --unified=0 ${filePath}`).toString();
+  } catch (error) {
+    return `无法获取文件 ${filePath} 的修改内容`;
+  }
+};
+
+// 生成汇总信息
+const generateSummary = () => {
+  const stagedFiles = getStagedFiles();
+
+  if (stagedFiles.length === 0) {
+    console.log("没有暂存的文件");
+    return;
+  }
+
+  let summary = "# 文件修改汇总\n\n";
+
+  stagedFiles.forEach((file) => {
+    summary += `## ${file}\n\n`;
+    summary += "```diff\n";
+    summary += getFileDiff(file);
+    summary += "\n```\n\n";
+  });
+
+  // 将汇总信息写入文件
+  const summaryPath = path.join(process.cwd(), "commit-summary.md");
+  fs.writeFileSync(summaryPath, summary);
+
+  console.log(`汇总信息已生成到: ${summaryPath}`);
+  return summaryPath;
+};
+
+// 执行生成汇总
+const summaryPath = generateSummary();
+if (summaryPath) {
+  console.log("请查看 commit-summary.md 文件获取详细的修改信息");
+}

````
