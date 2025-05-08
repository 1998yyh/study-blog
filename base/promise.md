# Promise

## Promise/A+

`Promise` 是一种优秀的异步解决方案，其原生实现更是面试中的爆点，提到 `Promise` 实现，我们首先会想起 `Promises/A+` 规范，大多数教程中都是按照 `Promises/A+` 规范来实现 `Promise` 。

遵循 `Promises/A+` 规范实现的 `Promise` 与 `ES6-Promise` 能有什么区别呐？

### Promise的成功值 value

`Promises/A+` 规范只提供了 `value` 的定义，并没有详细说明如何处理不同类型的 `value` 值:

> “value” is any legal JavaScript value (including undefined, a thenable, or a promise).(value 可以是任意合法的 JavaScript 值，包括 undefined、具备 then 接口的对象或者 promise)

但 `ECMAScript` 规范对不同类型的 `value` 做了细致的处理。

- 判断 resolution 是否为 Object，如果不是，直接执行 FulfillPromise
- 如果是 Object，试探是否存在 then 接口
- 判断 then 是否可执行 (abrupt completion 可以理解为非正常值)
- 如果 then 可执行，将 then 方法放入事件队列中。

```javascript
const p = new Promise((resolve) => {
  resolve(1);
});

const p1 = new Promise((resolve) => {
  resolve(p);
});

p1.then((d) => console.log(d)); // 1

// p1 接收的成功值 value 为 Promise p，p 状态为 fulfilled ，这种情况下 ES6 中会采取 p 的状态及 value，因此最终打印 1。
```

`Promises/A+` 没有对此进行规范,因此当传入的`value`为`thenable`对象时,会原封不动的输出.

所以按A+ 的规范 输出的应该是 一个`pending`状态的promise

```javascript
const resolve = (value) => {
  // 如果 value 可 thenable ，则采纳他的状态和值，递归进行上述步骤，直至 value 不可 thenable。
  // (这里与 resolvePromise 部分递归解析 onFulfilled 函数的返回值是类似的)
  if (typeof value === "object" && value != null) {
    try {
      const then = value.then;
      if (typeof then === "function") {
        return then.call(value, resolve, reject);
      }
    } catch (e) {
      return reject(e);
    }
  }
  if (this.status === PENDING) {
    this.value = value;
    this.status = FULFILLED;
    this.onFulfilledCallbacks.forEach((cb) => cb(this.value));
  }
};
```

### Promise 与 microTask

`Promises/A+` 规范中其实并没有将 `Promise` 对象与 `microTask` 挂钩，规范是这么说的:

> Here “platform code” means engine, environment, and promise implementation code. In practice, this requirement ensures that onFulfilled and onRejected execute asynchronously, after the event loop turn in which then is called, and with a fresh stack. This can be implemented with either a “macro-task” mechanism such as setTimeout or setImmediate, or with a “micro-task” mechanism such as MutationObserver or process.nextTick. Since the promise implementation is considered platform code, it may itself contain a task-scheduling queue or “trampoline” in which the handlers are called.

`Promises/A+` 规范中表示 then 方法可以通过 `setTimeout` 或 `setImediate` 等宏任务机制实现，也可以通过 `MutationObserver` 或 `process.nextTick` 等微任务机制实现。

### 谁规定了 Promise 是 microTask

ECMAScript 规范中，最接近的是下面两段表达：

> The host-defined abstract operation HostEnqueuePromiseJob takes arguments job (a Job Abstract Closure) and realm (a Realm Record or null) and returns unused. It schedules job to be performed at some future time. The Abstract Closures used with this algorithm are intended to be related to the handling of Promises, or otherwise, to be scheduled with equal priority to Promise handling operations.

> Jobs are scheduled for execution by ECMAScript host environments. This specification describes the host hook HostEnqueuePromiseJob to schedule one kind of job; hosts may define additional abstract operations which schedule jobs. Such operations accept a Job Abstract Closure as the parameter and schedule it to be performed at some future time. Their implementations must conform to the following requirements:

上面两句话意思大约是: `ECMAScript` 中将 `Promise` 看作一个 job(作业)`，HostEnqueuePromiseJob` 是用来调度 `Promise` 作业的方法，这个方法会在未来某个时间段执行，具体执行与 `Promise` 的处理函数或者与 `Promise` 处理操作相同的优先级有关。

那何处将 `Promise` 规定为 `microTask` 呐？--- `HTML 标准`

HTML 标准中指出:

> JavaScript contains an implementation-defined HostEnqueuePromiseJob(job, realm) abstract operation to schedule Promise-related operations. HTML schedules these operations in the microtask queue.

## 从 v8解析 https://juejin.cn/post/7055202073511460895

从Job的概念出发 ， 看看能否解释这个问题

```js
const a = new Promise((resolve) => {
  resolve(1);
});

async function b() {
  return Promise.resolve(Promise.resolve(2));
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
