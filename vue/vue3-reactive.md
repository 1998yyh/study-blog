# Reactive API

``` js
export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap,
  )
}
```

这个函数核心也就是通过 createReactiveObject 把我们传入的 target 变成响应式的：

``` js
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  // 如果目标不是对象，则直接返回
  if (!isObject(target)) {
    return target
  }
  // 已经是一个响应式对象了，也直接返回
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // proxyMap 中已经存入过 target，直接返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // 只有特定类型的值才能被 observe.
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  // 通过 proxy 来构造一个响应式对象
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  // 缓存 target proxy
  proxyMap.set(target, proxy)
  return proxy
}

```