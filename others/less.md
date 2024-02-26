# Less


## Logical Function 逻辑函数

### IF

根据条件会返回两个值其中之一

``` less
@some: foo;
div {
    margin: if((2 > 1), 0, 3px);
    color:  if((iscolor(@some)), @some, black);
    color:if(not (true), foo, bar);
    color:if((true) and (2 > 1), foo, bar);
    color:if((false) or (isstring("boo!")), foo, bar);
}
```

转化后

``` css
div {
  margin: 0;
  color: black;
  color: bar;
  color: foo;
}
```

### boolean

``` less
@bg: black;
@bg-light: boolean(luma(@bg) > 50%);

div {
  background: @bg; 
  color: if(@bg-light, black, white);
}
```

转化后
``` css
div {
  background: black;
  color: white;
}

```


## String Functions 

### escape

对输入字符串中的特殊字符应用url编码。

``` less
div{
  color:escape('a=1');
}
```

```css
div {
  color: a%3D1;
}
```


### e

输出原本文案 

``` less
@mscode: "ms:alwaysHasItsOwnSyntax.For.Stuff()" 
filter: e(@mscode);
```
转化后
``` css
filter: ms:alwaysHasItsOwnSyntax.For.Stuff();
```

### % format

函数%(string, arguments…)格式化一个字符串。

第一个参数是带有占位符的字符串。所有占位符都以百分比符号%开头，后面接字母s、s、d、d、a或a。其余参数包含替换占位符的表达式。如果需要打印百分比符号，请转义为另一个百分比%%。

``` less
 format-a-d: %("repetitions: %a file: %d", 1 + 2, "directory/file.less");
format-a-d-upper: %('repetitions: %A file: %D', 1 + 2, "directory/file.less");
format-s: %("repetitions: %s file: %s", 1 + 2, "directory/file.less");
format-s-upper: %('repetitions: %S file: %S', 1 + 2, "directory/file.less");
```
转化后
```css
format-a-d: "repetitions: 3 file: "directory/file.less"";
format-a-d-upper: 'repetitions: 3 file: %22directory%2Ffile.less%22';
format-s: "repetitions: 3 file: directory/file.less";
format-s-upper: 'repetitions: 3 file: directory%2Ffile.less';
```


### replace

替换字符串中的某些文本

``` less
replace("Hello, Mars?", "Mars\?", "Earth!");
replace("One + one = 4", "one", "2", "gi");
replace('This is a string.', "(string)\.$", "new $1.");
replace(~"bar-1", '1', '2');
```

转化后

``` css
"Hello, Earth!";
"2 + 2 = 4";
'This is a new string.';
bar-2;
```


## list Function

### length

返回一个数组的长度

```less
@list: "banana", "tomato", "potato", "peach";
n: length(@list);

// n: 4;
```

### extract

返回列表中指定位置的值。

```less
@list: apple, pear, coconut, orange;
value: extract(@list, 3);

// value: coconut;
```

### range

生成一个包含一系列值的列表

```less
value: range(4);
value : 1 2 3 4;
```

单位会统一保持一致
``` less
value: range(10px 30px 10);
value: 10px 30px 10px;
```

### each

``` less
@selectors: blue, green, red;

each(@selectors, {
  .sel-@{value} {
    a: b;
  }
});
```
转化为

```css
.sel-blue {
  a: b;
}
.sel-green {
  a: b;
}
.sel-red {
  a: b;
}
```

或者可以使用对象类型

``` less

@set: {
  one: blue;
  two: green;
  three: red;
}
.set {
  each(@set, {
    @{key}-@{index}: @value;
  });
}
```

转化为
``` css
.set {
  one-1: blue;
  two-2: green;
  three-3: red;
}
```


## Math Function 

基本于JS Math的方法一致

ceil、floor、percentage、round、sqrt、abs、sin、asin、cos、acos、tan、atan、pi、pow、mod、min、max'


## Type Function

感觉没啥用

isnumber、isstring、iscolor、iskeyword、isurl、ispixel、isem、ispercentage、isunit、isruleset、isdefined

## Misc Function

这边也是几个用处不大的 看几个比较有用的吧


1. svg-gradient 

生成svg的渐变 , 我们都知道 css 的 linear-gradient 是会产生锯齿的 , 消除锯齿的方法有很多 , 使用svg去替换就是一种方法

``` less
div {
  @list: red, green 30%, blue;
  background-image: svg-gradient(to right, @list);
  // 或者直接写 background-image: svg-gradient(to right, red, green 30%, blue);
}
```

```css
div {
  background-image: url('data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%220%200%201%201%22%20preserveAspectRatio%3D%22none%22%3E%3ClinearGradient%20id%3D%22gradient%22%20gradientUnits%3D%22userSpaceOnUse%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%220%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ff0000%22%2F%3E%3Cstop%20offset%3D%2230%25%22%20stop-color%3D%22%23008000%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%230000ff%22%2F%3E%3C%2FlinearGradient%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22url(%23gradient)%22%20%2F%3E%3C%2Fsvg%3E');
}
```
　

## 颜色相关

略


