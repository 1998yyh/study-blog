# 2025

# 1.10

在项目开发过程中个，一般都会添加 .gitignore 文件，规则很简单，但有时会发现，规则不生效。
原因是 .gitignore 只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。
那么解决方法就是先把本地缓存删除（改变成未track状态），然后再提交。

git rm -r --cached .

git add .

git commit -m 'update .gitignore'

# 3.14

🤔 突然才发现 已经好久没有记录过学习知识了。 业务事可真多。

## 3.21

电商AI的运用

针对研发效率，那当然是 PRD 优化、风险评估、技术方案评审、CR、手工用例生成

针对客户，那就是智能客服、商品评价总结、卖家商品描述优化等文字类工作

## 3.24

1. 关于资源请求失败，如何重新发起请求

```html
<script src="www.aa.com/a.js"></script>
<script src="www.aa.com/b.js"></script>
<script src="www.aa.com/c.js"></script>
```

当a.js请求出错的时候，我们页面就会白屏

我们通过service-worker增加重试逻辑

```html
<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(() => {
      console.log("Service Worker registered");
    });
  }
</script>
```

```js
const PRIMARY_HOST = "primary.example.com";
const FALLBACK_HOST = "fallback.example.com";

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // 仅处理目标脚本的请求
  if (requestUrl.pathname === "/path/to/script.js") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 检查HTTP状态码
          if (!response.ok) throw new Error("Response not OK");
          return response;
        })
        .catch(() => {
          // 替换Host为备用地址
          requestUrl.host = FALLBACK_HOST;
          const fallbackRequest = new Request(
            requestUrl.toString(),
            event.request,
          );
          return fetch(fallbackRequest);
        }),
    );
  }
});
```

通过onerror事件动态重试

```html
<script>
  function loadFallback(element) {
    const fallbackSrc = element.src.replace(
      "primary.example.com",
      "fallback.example.com",
    );
    const newScript = document.createElement("script");
    newScript.src = fallbackSrc;
    document.body.appendChild(newScript);
  }
</script>

<script
  src="https://primary.example.com/script.js"
  onerror="loadFallback(this)"
></script>
```

但是这样会有问题，如果后面的依赖前面的js，会报错，某个变量是undefined

service-worker 通用版

```js
const FALLBACK_MAP = {
  "primary-host.com": "fallback-host.com",
};

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith(".js")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        const fallbackHost = FALLBACK_MAP[url.host];
        if (!fallbackHost) return Response.error();
        const fallbackUrl = new URL(url);
        fallbackUrl.host = fallbackHost;
        return fetch(fallbackUrl);
      }),
    );
  }
});
```

2. WeakRef

垃圾回收使用的一个API

WeakRef 的特点：

1. 不会阻止垃圾回收
2. 引用的对象可能随时被回收
3. 需要通过 deref() 方法获取原始对象
4. 适合处理可能被垃圾回收的对象
   使用建议：

5. 优先使用普通引用
6. 只在确实需要弱引用时使用 WeakRef
7. 总是检查 deref() 的返回值
8. 配合 FinalizationRegistry 使用更完整
   注意事项：

9. WeakRef 不保证引用的对象一定存在
10. 不适合用于核心业务逻辑
11. 主要用于性能优化和资源管理
12. 需要妥善处理引用对象不存在的情况

```js
const target = { name: "example" };
const weakRef = new WeakRef(target);

// 获取引用的对象
const obj = weakRef.deref();
if (obj) {
  console.log(obj.name); // 'example'
}
```

主要的使用场景

缓存系统：

```ts
class Cache {
  private cache = new Map<string, WeakRef<object>>();

  set(key: string, value: object) {
    this.cache.set(key, new WeakRef(value));
  }

  get(key: string) {
    const ref = this.cache.get(key);
    return ref?.deref();
  }
}
```

监听器管理

```ts
class EventManager {
  private listeners = new Set<WeakRef<Function>>();

  addListener(callback: Function) {
    this.listeners.add(new WeakRef(callback));
  }

  emit(event: any) {
    for (const listenerRef of this.listeners) {
      const listener = listenerRef.deref();
      if (listener) {
        listener(event);
      }
    }
  }
}
```

配合 FinalizationRegistry

```ts
// 创建清理注册表
const registry = new FinalizationRegistry((heldValue) => {
  console.log("对象被回收，清理数据：", heldValue);
});

// 使用 WeakRef 和 FinalizationRegistry 的示例
class ResourceManager {
  private cache = new Map<string, WeakRef<Resource>>();
  private cleanup = new FinalizationRegistry((key: string) => {
    console.log(`资源 ${key} 已被回收`);
    this.cache.delete(key);
  });

  addResource(key: string, resource: Resource) {
    const ref = new WeakRef(resource);
    this.cache.set(key, ref);
    // 注册清理回调
    this.cleanup.register(resource, key);
  }

  getResource(key: string) {
    const ref = this.cache.get(key);
    return ref?.deref();
  }
}
```

使用场景

大型组件的缓存

```ts
import { WeakRef, FinalizationRegistry } from "js-runtime";

export function useComponentCache() {
  const cache = new Map<string, WeakRef<any>>();
  const cleanup = new FinalizationRegistry((key: string) => {
    cache.delete(key);
    console.log(`组件缓存 ${key} 已清理`);
  });

  function cacheComponent(key: string, component: any) {
    const ref = new WeakRef(component);
    cache.set(key, ref);
    cleanup.register(component, key);
  }

  function getCachedComponent(key: string) {
    return cache.get(key)?.deref();
  }

  return {
    cacheComponent,
    getCachedComponent,
  };
}
```

长期运行的webworker管理

```js
export class WorkerPool {
  private workers = new Map<string, WeakRef<Worker>>()
  private cleanup = new FinalizationRegistry((workerId: string) => {
    const worker = this.workers.get(workerId)?.deref()
    if (worker) {
      worker.terminate()
    }
    this.workers.delete(workerId)
  })

  createWorker(id: string, scriptURL: string) {
    const worker = new Worker(scriptURL)
    this.workers.set(id, new WeakRef(worker))
    this.cleanup.register(worker, id)
    return worker
  }
}
```

大文件上传的临时缓存

```js
export function useFileUpload() {
  const fileRefs = new Map<string, WeakRef<File>>()
  const cleanup = new FinalizationRegistry((fileId: string) => {
    // 清理临时文件
    fileRefs.delete(fileId)
    localStorage.removeItem(`upload_progress_${fileId}`)
  })

  function trackFile(file: File) {
    const fileId = crypto.randomUUID()
    fileRefs.set(fileId, new WeakRef(file))
    cleanup.register(file, fileId)
    return fileId
  }

  return { trackFile }
}
```

## 4.9

1. promise 一直处于 pedding 状态 不resolve 会造成内存泄漏吗？

会的，因为 promise 是一个异步任务，它会在未来的某个时间点被执行。如果 promise 一直处于 pedding 状态，那么它的回调函数就不会被执行，也就不会被释放。这就会导致内存泄漏。

是和闭包有关，直接原因是promise pending才保存了闭包的上下文，不然组件的闭包环境也会释放的

不止promise，在大量并发ajax请求，网速特别卡的情况下，会占用大量内存造成卡顿，血与泪的教训，其实promise 就是个闭包 ajax的回调函数也是闭包，都会引用作用域上下文，不及时清除完成引用都会占内存

2. promise 收集 / 释放

```js
const a = new Promise((resolve) => {
  resolve(1);
});

async function b() {
  return Promise.resolve(2);
}

b().then((res) => {
  console.log(res);
});

a.then((res) => {
  console.log(res);
}).then(() => {
  console.log(3);
});
```

function b 加和不加 async 的效果是不一样的

## 4.11

1. 5 个改变游戏规则的 GitHub 代码库，助你轻松应对编程面试
   https://javascript.plainenglish.io/top-5-github-repos-to-ace-your-coding-interviews-230b1d8506f4

## 4.21

1. Promise.finally 返回成功的promise 无效 返回失败的promise会拦截

```js
Promise.resolve(1).finally(() => {
  return 2;
});
```

## 5.7

终于又可以学习点东西了

1. 字符串的转化

```js
String(v)
'' + v
`${v}`
v.toString()
{}.toString.call(v)

// 上面是五种转化字符串的方法

undefined
null
Symbol()
{__proto__: null}

// 我们用它来处理一下一些棘手的值
```

|                     | undefined |   null    | Symbol()  | {**proto**:null} |
| ------------------- | :-------: | :-------: | :-------: | :--------------: |
| String(v)           |    ✔     |    ✔     |    ✔     |    TypeError     |
| '' + v              |    ✔     |    ✔     | TypeError |    TypeError     |
| `${v}`              |    ✔     |    ✔     | TypeError |    TypeError     |
| v.toString()        | TypeError | TypeError |    ✔     |    TypeError     |
| {}.toString.call(v) |    ✔     |    ✔     |    ✔     |        ✔        |

{}.toString.call(v)
Object.prototype.toString.call(v) 两者是等价的

```js
> String({__proto__: null}) // no method available
TypeError: Cannot convert object to primitive value
> String({__proto__: null, [Symbol.toPrimitive]() {return 'YES'}})
'YES'
> String({__proto__: null, toString() {return 'YES'}})
'YES'
> String({__proto__: null, valueOf() {return 'YES'}})
'YES'
> String({__proto__: null, toString() { return undefined }})
'undefined'
> String({__proto__: null, toString() { return null }})
'null'
> String({__proto__: null, toString() { return {} }})
TypeError: Cannot convert object to primitive value
```

字符串的转化 https://2ality.com/2025/04/stringification-javascript.html

## 5.23

1. vue3 配置eslint 和 prettier : https://vueschool.io/articles/vuejs-tutorials/eslint-and-prettier-with-vite-and-vue-js-3/?utm_source=drip&utm_medium=email&utm_campaign=Smarter+Dev+with+LLM+Agents+%2B+Top+Reads+%26+Courses

2. vue 路由课程 : https://vueschool.io/lessons/introduction-to-vue-router-4

3. 迭代器

可迭代协议

```js
const gospelIterable = {
  [Symbol.iterator]() {
    return {
      index: -1,
      next() {
        // this.index++
        const gospels = ["Matthew", "Mark", "Luke", "John"];
        this.index++;

        return {
          value: gospels[this.index],
          done: this.index >= gospels.length,
        };
      },
    };
  },
};

for (const author of gospelIteratable) {
  console.log(author); // Matthew, Mark, Luke, John
}

console.log([...gospelIteratable]);
// ['Matthew', 'Mark', 'Luke', 'John']
```

下面是一个遍历 1900 年之后每个闰年的例子

```js
function isLeapYear(year) {
  return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}

const leapYears = {
  [Symbol.iterator]() {
    return {
      startYear: 1900,
      currentYear: new Date().getFullYear(),
      next() {
        this.startYear++;

        while (!isLeapYear(this.startYear)) {
          this.startYear++;
        }

        return {
          value: this.startYear,
          done: this.startYear > this.currentYear,
        };
      },
    };
  },
};

for (const leapYear of leapYears) {
  console.log(leapYear);
}
```

惰性求值是可迭代对象最受推崇的优点之一。我们不需要从一开始就获取序列中的每个元素。在某些情况下，这可以很好地避免性能问题。

文章地址: https://macarthur.me/posts/generators/
