# vue3-diff

## 从头对比

1. Vue 3 的 diff 算法第一步就是进行新老节点从头比对的方式来判断是否是同类型的节点：

``` js
const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
  let i = 0
  const l2 = c2.length
  // 旧节点的尾部标记位
  let e1 = c1.length - 1
  // 新节点的尾部标记位
  let e2 = l2 - 1
  // 从头部开始比对
  // (a b) c
  // (a b) d e
  while (i <= e1 && i <= e2) {
    const n1 = c1[i]
    const n2 = (c2[i] = optimized ? cloneIfMounted(c2[i] as VNode) : normalizeVNode(c2[i]))
    // 如果是 sameVnode 则递归执行 patch  
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized)
    } else {
      break
    }
    i++
  }

   // 从尾部开始比对
  // a (b c)
  // d e (b c)
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1]
    const n2 = (c2[i] = optimized
      ? cloneIfMounted(c2[i] as VNode)
      : normalizeVNode(c2[i]))
    // 如果是 sameVnode 则递归执行 patch  
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized)
    } else {
      break
    }
    e1--
    e2--
  }
}

```


1. i 代表的是头部的标记位；
2. e1 代表的是旧的子节点的尾部标记位；
3. e2 代表的是新的子节点的尾部标记位。

从头比对就是通过不断移动 i 这个头部标记位来判断对应的节点是否是 sameVnode。如果是，则进行递归 patch 操作，递归 patch 如果不满足条件，则退出头部比对，进入从尾比对流程。
从尾比对就是通过不断移动新旧节点 e1 和 e2 的尾部指针来判断对应的节点是否是 sameVnode。如果是则进行递归 patch 操作 h 如果不满足条件，则退出尾部比对，进入后续流程。



## 新增节点

``` html 
<!-- 旧列表 -->
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="c">c</li>
  <li key="d">d</li>
</ul>



<!-- 新列表 -->
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="c">c</li>
  <li key="d">d</li>
  <li key="e">e</li>
</ul>
```

上述情况我们会先进入头部流程 i -> 0 -> 1  当i = 2 时 c !== e 所以退出头部对比
进入尾部对比 e1,e2 -> 3,4 -> 2,3 -> 1,2 ; 此时 i > e1 所以退出尾部对比
然后我们需要添加多余的剩余节点

``` js
const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
  let i = 0
  const l2 = c2.length
  // 旧节点的尾部标记位
  let e1 = c1.length - 1
  // 新节点的尾部标记位
  let e2 = l2 - 1
  // 从头部开始必须
  // ...
  // 从尾部开始比对
  // ...
  // 如果有多余的新节点，则执行新增逻辑
  if (i > e1) {
    if (i <= e2) {
      const nextPos = e2 + 1
      const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor
      while (i <= e2) {
        // 新增新节点
        patch(null, c2[i], container, anchor, parentComponent, parentSuspense, isSVG)
        i++
      }
    }
  }
}
```

## 删除节点

``` html 
<!-- 旧列表 -->
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="c">c</li>
  <li key="d">d</li>
  <li key="e">e</li>
</ul>



<!-- 新列表 -->
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="c">c</li>
  <li key="d">d</li>
</ul>
```

同理:

我们会先进入头部流程 i -> 0 -> 1  当i = 2 时 c !== e 所以退出头部对比
进入尾部对比 e1,e2 -> 4,3 -> 3,2 -> 2,1 ; 此时 i > e2 所以退出尾部对比
然后我们删除多余的剩余节点

``` js
const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
  let i = 0
  const l2 = c2.length
  // 旧节点的尾部标记位
  let e1 = c1.length - 1
  // 新节点的尾部标记位
  let e2 = l2 - 1
  // 从头部开始必须
  // ...
  // 从尾部开始比对
  // ...
  // 如果有多余的新节点，则执行新增逻辑
  if (i > e1) {
    
  }else if(i > e2){
     while (i <= e1) {
      // 卸载节点
      unmount(c1[i], parentComponent, parentSuspense, true)
      i++
    }
  }
}
```

## 未知子序列

``` html
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="c">c</li>
  <li key="d">d</li>
  <li key="e">e</li>
  <li key="f">f</li>
  <li key="g">g</li>
  <li key="h">h</li>
</ul>

<!-- 新节点 -->
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="e">e</li>
  <li key="c">c</li>
  <li key="d">d</li>
  <li key="i">i</li>
  <li key="g">g</li>
  <li key="h">h</li>
</ul>
```

经过前两部我们可以得到

i -> 0 -> 1 -> 2;

e1,e2 -> 7,7 -> 6,6 -> 5,5


DOM更新的性能优劣大致为 : 属性更新 > 位置移动 > 增删节点。 所以我们要尽可能复用老节点, 当需要进行移动操作时，

那么这个问题就变成了求取新旧子树上的最长公共子序列，当知道了最长公共子序列，那么所有的操作可以简化为。

1. 如果节点在新节点中，不在旧节点中，那么新增节点。
2. 如果节点在旧节点中，不在新节点中，那么删除节点。
3. 如果节点既在旧节点中，也在新节点中，那么更新。
4. 如果节点需要移动，那么求出最长公共子序列后，进行最小位置移动。

### 构造新老节点位置映射 keyToNewIndexMap ;

``` js
// 旧子序列开始位置
const s1 = i
// 新子序列开始位置
const s2 = i

// 5.1 构建 key:index 关系索引 map
const keyToNewIndexMap = new Map()
for (i = s2; i <= e2; i++) {
  const nextChild = (c2[i] = optimized
    ? cloneIfMounted(c2[i] as VNode)
    : normalizeVNode(c2[i]))
  if (nextChild.key != null) {
    keyToNewIndexMap.set(nextChild.key, i)
  }
}
```

这样我们构造出一个新节点的索引图` keyToNewIndexMap = {e: 2, c: 3, d: 4, i: 5}`

### 继续处理旧节点

有了keyToNewIndexMap 接下来我们就需要遍历旧的节点，寻找旧节点在新节点中对应的位置信息，如果找到则做更新，找不到则移除；

``` js
// 记录新节点已更新的数目
let patched = 0
// 记录新节点还有多少个没有更新 4
const toBePatched = e2 - s2 + 1
// 标记是否有必要进行节点的位置移动
let moved = false
// 标记是否有节点进行了位置移动
let maxNewIndexSoFar = 0
// 记录新节点在旧节点中的位置数组
const newIndexToOldIndexMap = new Array(toBePatched)
// newIndexToOldIndexMap 全部置为 0
for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
// 开始遍历旧子节点
for (i = s1; i <= e1; i++) {
  // prevChild 代表旧节点
  const prevChild = c1[i]
  // 还有多余的旧节点，则删除
  if (patched >= toBePatched) {
    unmount(prevChild, parentComponent, parentSuspense, true)
    continue
  }
  // 记录旧节点在新节点中的位置数组 3
  let newIndex = keyToNewIndexMap.get(prevChild.key)
  
  // 如果旧节点不存在于新节点中，则删除该节点 
  if (newIndex === undefined) {
    unmount(prevChild, parentComponent, parentSuspense, true)
  } else {
    // newIndexToOldIndexMap 中元素为 0 表示着新节点不存在于旧节点中
    newIndexToOldIndexMap[newIndex - s2] = i + 1
    // 默认不移动的话，所有相同节点都是增序排列的
    // 如果有移动，必然出现节点降序的情况
    if (newIndex >= maxNewIndexSoFar) {
      maxNewIndexSoFar = newIndex
    } else {
      moved = true  
    }
    // 更新节点
    patch(
      prevChild,
      c2[newIndex] as VNode,
      container,
      null,
      parentComponent,
      parentSuspense,
      isSVG,
      slotScopeIds,
      optimized
    )
    // 记录更新的数量
    patched++
  }
}

```

1. 定义一个初始长度为新节点数组长度且默认值全为 0 的变量。 `newIndexToOldIndexMap` 记录新节点中元素在旧节点中的位置关系

2. 遍历旧的节点数组，如果旧节点不存在于新节点之中，则表示旧的节点时多余的节点，需要被移除

3. 如果旧节点存在于新节点数组中，则将它在旧子序列中的位置信息记录到`newIndexToOldIndexMap`中，同时根据newIndex 是否大于 `maxNewIndexSoFar` 来判断是否有节点移动。

比如 旧节点信息为 abc、新节点为 cab，当旧节点遍历到 c 节点时，此时的newIndex 的值为 0 而 maxNewIndexSoFar 的值为 2。这就意味着此时的 c 节点并不是升序位于 ab 节点之后的，因此需要标记为有需要移动的节点。

4. 更新相同节点

经过上面的一系列操作，我们最终得到了一个 `newIndexToOldIndexMap = [5, 3, 4, 0]` 和一个 moved 两个变量。


### 移动和增加新节点

``` js
// 根据 newIndexToOldIndexMap 求取最长公共子序列
const increasingNewIndexSequence = moved
  ? getSequence(newIndexToOldIndexMap)
  : EMPTY_ARR
// 最长公共子序列尾部索引  
j = increasingNewIndexSequence.length - 1
// 从尾部开始遍历
for (i = toBePatched - 1; i >= 0; i--) {
  const nextIndex = s2 + i
  const nextChild = c2[nextIndex]
  const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor
  // 如果新子序列中的节点在旧子序列中不存在，则新增节点
  if (newIndexToOldIndexMap[i] === 0) {
    patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG)
  } else if (moved) {
    // 如果需要移动且
    // 没有最长递增子序列
    // 当前的节点不在最长递增子序列中
    if (j < 0 || i !== increasingNewIndexSequence[j]) {
      move(nextChild, container, anchor, MoveType.REORDER)
    } else {
      j--
    }
  }
}
```



## 最长公共子序列问题

子串和子序列时有区别的， 子串是连续的，子序列可以不连续

比如我们输入 `nums = [10, 9, 2, 5, 3, 7, 101, 18]` 其中最长递增子序列时 `[2, 3, 7, 101]`
