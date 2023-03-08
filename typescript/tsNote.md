# 记录一些遗漏的点

文章搜集到的
https://juejin.cn/post/6844904055039344654

### 1. unknown 和 any 的区别

any 和 unknown 都可以接收任何类型：

但是 any 也可以赋值给任何类型，但 unknown 不行。

只是用来接收其他类型， 所以 unknown 比any 更合适一些，更安全。

``` ts
const num:any = '1';
const num2:any = 2;
const num3:unknown = 3;
const num4:unknown = 'n';

// ok
const num5:number = num; 
// Error : type 'unknown' is not assignable to type 'number'
const num6:number = num3;
```



### 2. extends


