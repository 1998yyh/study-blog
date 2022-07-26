# 阴间JS

来给大家整个活！下面的问题比较偏门，所以不必纠结，因为它们毫无卵用。

### 唯一falsy对象 ?

先看题目: 
``` javascript
// foo 是什么
console.log(typeof foo) // undefined
console.log(foo.name) // 1234
```

`foo`的类型是undefined，但是foo.name却有值，比较奇怪的一个问题。

答案就是:`document.all`

``` javascript
const foo = document.all;
foo.name = 1234;

console.log(typeof foo)
console.log(foo.name)
```

尽管`document.all`可以返回一个像数组一样的对象，可以用来访问DOM节点。但是呢，通过typeof查看document.all，你会惊讶地发现类型是undefined。

``` javascript
document.all instanceof Object // -> true
typeof document.all // -> 'undefined'

```

而且，document.all并不等于undefined。

``` javascript
document.all === undefined // -> false
document.all === null // -> false
document.all == null // -> true
```

### 变来变去的arguments 

``` js
function foo(a,b,c){
  arguments[0] = 42;
  console.log(a)
}

function bar(a,b,c = 3){
  arguments[0] = 42;
  console.log(a)
}

foo(1,2);
bar(1,2);
```

第一个结果是42 
第二个结果是1

在参数有默认值的情况下,方法体检测到ES6语法,会自动进入严格模式,而严格模式的arguments数组是参数数组的拷贝,而非引用,所以修改arguments[0]并不会修改原参数,所以bar打印 1;

### 访问全局const?

先看问题:
``` javascript
const num = 42;
function foo(){
  const num = 2;
  console.log(num); // 2
}
```
如上述代码所示，此时输出的num 是2，如果我们想要输出 42 的num 该如何操作呢 ?

很容易想到的是`window.num`，但是`const`声明的变量并没有挂载到window上

那我们如何获取到呢 

``` javascript
const num = 42;
function foo(){
  const num = 2;
  console.log(num); // 2
  console.log((0,eval)('num')) // 42
  console.log(new Function('return foo')()) //42

}

``` 

1. `eval` 被视为直接调用，所以如果我们直接调用`eval('num')` 输出的会是2，因为直接调用num的上下文是当前块作用域的。

逗号运算符，计算其两个操作数，并且返回第二个操作数的值。这样操作有个目的是，将eval变为了间接引用，该调用将会是全局作用域而。

2. 如果我们使用`new Function` 创建一个函数 那么函数的`[[Environment]]`并不指向当前的词法环境，而是指向全局环境

但是这种方式容易在代码混淆后报错



### .. ?

`.` 和 `...` 我们经常用到，但是，有见过什么情况下 出现了 `..`吗？


``` javascript
1..toString();
```
其实`..`并不是一个运算符，之前前面数组的1.0省略了0再调用toString()方法而已。
只是一个噱头,不必在意。



### ![] == []

相等(==)判断操作会将两边的类型都转换为数字(number)，然后再比较。

因为`[]`和`![]`都会转换为0。我们可以理解`[]`是一个数组，只不过为空而已，那么为true。

右侧`![]`则为false。false然后转换为数字0。左侧`[]`直接转换为数字，因为空数组会转换为0，所以尽管我们认为`[]`为true，这里却变成了0。

下面是简化过程
```javascript
+[] == +![]
0 == +false
0 == 0
true
```

### 最小值比0大？

``` javascript
Number.MIN_VALUE > 0  // true

```
MIN_VALUE 属性是 JavaScript 里最接近 0 的正值，而不是最小的负值。

MIN_VALUE 的值约为 5e-324。小于 MIN_VALUE ("underflow values") 的值将会转换为 0。


### 数组相加

如果我们将两个数组相加，结果回怎么样?

``` javascript
[1,2,3] + [4,5,6] // -> '1,2,34,5,6'

```

实际上是转换成了字符串做了拼接


### 数组分号去除

我们创建一个4个空元素的数组。结果呢，该数组实际上只有3个元素，因为最后一个分号被去掉了。

``` javascript
let a = [,,,]
a.length     // -> 3
a.toString() // -> ',,'
```

> 末尾分号(Trailing commas)(又叫做final commas)在添加新元素、参数或则属性时候很有用。如果你想增加一个新的属性，并且前一行末尾有使用分号，你可以直接在新的一行添加而不用修改前一行。这可以让版本控制的diff操作更加清晰，代码更少出问题。


### return

``` javascript
(function(){
  return {
    b:0
  }
})() // -> {b:0}

(function(){
  return 
  {
    b:0
  }
})() // -> undefined
```
这主要是因为有一个自动行尾加分号的机制在作怪，会自动在很多新行的行尾添加分号。在第一个例子中，实际上是在return后面添加了分号。

### Math.min() > Math.max()

Math.max() 返回给定的一组数字中的最大值。

如果没有参数，则结果为 - Infinity。

如果有任一参数不能被转换为数值，则结果为 NaN。

Math.max() 则反之。




## 其他

欢迎补充...
