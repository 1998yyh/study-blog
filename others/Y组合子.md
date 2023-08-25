# 函数式编程


## 停机问题

调用程序的时候会遇到死循环的Bug，那么是否存在一个方法，能够判断出某个函数在有限次以内结束

停机问题： 给定任意一个程序及其输入，判断该程序能够在有限次内结束

### 假设存在

假设这个算法真实存在：

``` js
function halting(func,input){
  return is_func_will_halt_on_input
}
```

我们就可以用上面的伪代码来描述。

然后我们构造另一个函数

``` js

function ni_ma(func){
  if(halting(func,func)){
    for(;;)
    // 死循环
  }
}

```

接下来我们调用 `ni_ma(ni_ma)` 所以我们无法判断到底停机不停机。


## 递归

我们来看一个简单的递归的例子, 计算n的阶乘。

``` js
let fact = (n) => {
  if(n === 0) return 1
  return n* fact(n-1)
}
```

问题出现了，我们在定义fact的时候引用到了自身。

虽然实际的编程中，编辑器都可以识别这种方式的定义，但是这不符合严格的数学公理体系。



### 重新审视

不是无法引入自身吗，我们就把自身参数化。

```js
let P = (self,n)=> {
  if(n === 0)return 1
  return (n* self(self,n-1))
}

let fact = (n) => P(P,n)

```

如此一来

fact(4)

=> P(P,4);

=> 4 * P(P,3)

...

=> 4*3*2*1;



可惜这不是真正的递归，而是每次传入了一个额外的参数，反复调用而已。

而我们的目的是 找到一个真正的递归函数。

``` js
let fact = (n)=>{
  if(n===0) return 1;
  return (n * fact(n-1))
}
```

我们假设真正的fact 是存在的 

然后回到带回到那个带参数的【伪递归】函数。

``` js
let P = (self,n) => {
  if(n === 0) return 1;
  return (n * self(n - 1))
}

```

P接受两个参数，但是我们可以部分求值

``` js
p(fact) => function (n){
  if(n===0)return 1;
  return n * fact(n-1)
}
```

然后神奇的现象就出现了


``` js
P(fact) = fact
```

## 不动点

我们发现了一个P的不动点

`P(fact) = fact`

广义上来说， 一个点在一个函数的映射下，得到的结果仍然是这个点。

想象一下，墙上的一张中国地图掉在了地上，地面上肯定有且仅有一个点与他实际的位置是重合的。




### 神奇的 Y

所以，让我们继续假设有个神奇函数Y ， 它可以找到这个伪递归函数的不动点即

``` js
Y(F) = f = F(Y(F))
```

其中 F(f) = f;

``` js
Y(P) = fact
```
只要我们有了Y，就可以把伪递归函数变化成我们的真递归函数。

### 推导

1. let Y = (F) => G(G)

2. 其中 G = (self)=>F(self(self))

3. Y(P) = P(G(G)) = > (n) if(n==0) return 1 