# 常见的一些运算符


1. `>>` 右移运算符 `num >> 1 ` 相当于 `Math.floor(num/2)`

```js
console.log(40>>1) //20
console.log(40.5>>1) //20
console.log(40>>1) //10
```
2. `<<` 左移运算符 `num<<1` 相当于`Math.floor(num) * 2`

```js
console.log(3<<1) //6
console.log(3.4<<1) //6
console.log(3<<2) //12
```

3. `~`  按位取反 一般用于处理 -1 的情况, 因为~-1 是 0 所以省去了判断 > -1;

```js
const index = [1,2,3,4,5].indexOf(0) // -1
if(index > -1) {
  ...
}

if(~index){
  ...
}
```
4. `~~` 按位取反再取反 相当于调用了`Math.floor(num)`

```js
console.log(~~1.4) // 1
console.log(~~-1.4) // -1
```
5. `!!` 转化为布尔值 配合`~`使用

```ts
// 常用于ts 要求boolean类型
const a = undefined;
if(!!a){
  ...
}
```
6. `**` 幂 等价于 Math.pow();
7. `?.` 可选链
允许读取位于连接对象链深处的属性的值，而不必明确验证链中的每个引用是否有效。?. 运算符的功能类似于 . 链式运算符，不同之处在于，在引用为空 (nullish ) (null 或者 undefined) 的情况下不会引起错误，该表达式短路返回值是 undefined。与函数调用一起使用时，如果给定的函数不存在，则返回 undefined。
``` js
const adventurer = {
  name: 'Alice',
  cat: {
    name: 'Dinah'
  }
};

const dogName = adventurer.dog?.name;
console.log(dogName);
// expected output: undefined

console.log(adventurer.someNonExistentMethod?.());
// expected output: undefined
```

低版本babel需要安装 `@babel/plugin-proposal-optional-chaining`
高版本内置

8. `??` 判断undefined 或者是 null

空值合并运算符（??）是一个逻辑运算符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。

``` js
const foo = null ?? 'default string';
console.log(foo);
// expected output: "default string"

const baz = 0 ?? 42;
console.log(baz);
// expected output: 0
```

低版本babel需要安装 `@babel/plugin-proposal-nullish-coalescing-operator`
高版本内置



9. `（,）` 逗号运算符 

运算符对它的每个操作数从左到右求值，并返回最后一个操作数的值。这让你可以创建一个复合表达式，其中多个表达式被评估，复合表达式的最终值是其成员表达式中最右边的值。

```js
const arr = [1, 2]

const result = arr.reduce((pre, cur) => {
  pre[cur] = cur ** 2
  return pre
}, {})

// 简写 
const result2 = arr.reduce((pre, cur) => (pre[cur] = cur ** 2, pre), {})

```

10. `|>` 管道运算符 

正处于TC39 
```js
const output = func3(func2(func1(input)))
```

```js
output = input -> func1 -> func2 -> func3

```

可以使用 `@babel/plugin-proposal-pipeline-operator` 支持

<!-- TS -->
11. `!` 后缀表达式操作符 ! 可以用于断言操作对象是非 null 和非 undefined 类型。具体而言，x! 将从 x 值域中排除 null 和 undefined 。

```ts
function myFunc(maybeString: string | undefined | null) {
  // Type 'string | null | undefined' is not assignable to type 'string'.
  // Type 'undefined' is not assignable to type 'string'. 
  const onlyString: string = maybeString; // Error
  const ignoreUndefinedAndNull: string = maybeString!; // Ok
}

```