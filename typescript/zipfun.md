# 3层typescript 面试题 

##  1.实现一个 zip 函数，对两个数组的元素按顺序两两合并，比如输入 [1,2,3], [4,5,6] 时，返回 [[1,4], [2,5],[3,6]]

这层就是每次各从两个数组取一个元素，合并之后放到数组里，然后继续处理下一个，递归进行这个流程，直到数组为空即可。

``` js
function zip(target, source) {
  if (!target.length || !source.length) return [];

  const [one, ...rest1] = target;
  const [other, ...rest2] = source;

  return [[one, other], ...zip(rest1, rest2)];
}
```


## 2. zip 函数定义 ts 类型（两种写法）

函数的定义有两种方式

直接通过 function 声明函数 和 声明匿名函数然后赋值给变量

``` ts
function func(){}

const func = () => {}
```

而参数和返回值的类型都是数组，只是具体类型不知道，可以写 unknown[]。

所以两个函数的定义应该是这样的

``` ts
function zip(target:unknown[],source:unknown[]){
  // ...
}

interface Zip{
  (target:unknown[],source:unknown[]) : unknown[]
}

const zip: Zip = (target:unknown[],source:unknow[])=>{}
```

也是直接 function 声明函数类型和 interface 声明函数类型然后加到变量类型上两种。

因为具体元素类型不知道，所以用 unknown。



