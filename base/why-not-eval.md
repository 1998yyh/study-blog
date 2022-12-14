# Why not use eval

常常听别人说 不要使用eval 会造成内存泄漏 ,eval不安全之类的话, 你反问句为啥不安全, 对方也说不出个所以然. 就稀里糊涂的记下了.

## 闭包

闭包是 JS 的常见概念，它是一个函数返回另一个函数的形式，返回的函数引用了外层函数的变量，就会以闭包的形式保存下来。

我们通过断点调试看一下

``` js
function fun() {
    const a = 1;
    const b = 2;
    return function () {
        const c = 2;

        console.log(a, c);
        debugger;
    };
}

const f = fun();
f();

```

![](https://pic.imgdb.cn/item/6399ab83b1fccdcd36854666.jpg)

local 表示 返回函数的作用域

Closure(fun) 表示闭包作用域 因为访问了a 所以会保留下来,但是b 却没有问题.

如果a 所占用的内存特别大的话, 会造成内存泄漏


## eval

还是上面的例子 我们把`console.log()` 换成`eval('1+2')`


![](https://pic.imgdb.cn/item/6399ae6db1fccdcd368b62dd.jpg)

我们发现 eval 虽然没有用外部的变量 但是也会存在闭包中, 并且由于不知道使用了哪个, 他会把所有的都存进去 ,包括上级函数的, 包括最外层的 . 所以会有危险.


