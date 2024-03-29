# 正则

内容来自JavaScript正则表达式迷你书（1.1版）, 仅当做笔记学习

## 模糊匹配 
### 横向模糊匹配

横向模糊指的是，一个正则可匹配的字符串的长度不是固定的，可以是多种情况的。

其实现的方式是使用量词。譬如 {m,n}，表示连续出现最少 m 次，最多 n 次。

### 纵向模糊匹配

纵向模糊指的是，一个正则匹配的字符串，具体到某一位字符时，它可以不是某个确定的字符，可以有多种 可能。

其实现的方式是使用字符组。譬如 [abc]，表示该字符是可以字符 "a"、"b"、"c" 中的任何一个。

## 字符组

### 范围表示法

比如 [123456abcdefGHIJKLM]，可以写成 [1-6a-fG-M]。用连字符 - 来省略和简写。

如果我们要匹配连字符 需要将其放在开头或者结尾 或 转译 [-ab] / [ab-] / [a\-b]

### 排除字符组

有一种情形就是，某位字符可以是任何东西，但就不能是 "a"、"b"、"c"。

此时就是排除字符组(反义字符组)的概念。例如 [^abc]，表示是一个除 "a"、"b"、"c"之外的任意一个字 符。字符组的第一位放 ^(脱字符)，表示求反的概念。


###  常见的简写形式

`\d` 表示[0-9]。表示是一位数字
`\D` 表示除了数字之外的其他字符
`\w` 表示数字、大小写字母和下滑线
`\W` 表示非单词字符
`\s` 表示空白符,包括空格` ` 水平制表符`\t` 垂直制表符`\v` 换行符`\n` 回车符`\r` 换页符`\f`
`\S` 表示非空白符
`.`  即[^\n\r\u2028\u2029]. 通配符 表示除了 换行符、回车符、行分割符和段分割符除外

所以通配符并不是匹配任意字符.

匹配任意字符可以使用  [\d\D]、[\w\W]、[\s\S] 和 [^] 中任何的一个。
### `\`

在非特殊字符之前的反斜杠表示下一个字符是特殊字符，不能按照字面理解。例如，前面没有 "\" 的 "b" 通常匹配小写字母 "b"，即字符会被作为字面理解，无论它出现在哪里。但如果前面加了 "\"，它将不再匹配任何字符，而是表示一个字符边界。


## 量词
量词也称重复,`{m,n}`表示出现m-n次数

简写形式
`{m,}` 表示至少出现m次数
`{m}`  表示出现m次数
`?`    等价于`{0,1}` 表示出现0次或者1次
`+`    等价于`{1,}` 至少出现一次
`*`    等价于`{0,}` 出现任意次

### 贪婪匹配和惰性匹配

```JS
var regex = /\d{2,5}/g;
var string = "123 1234 12345 123456";
console.log( string.match(regex) );
// => ["123", "1234", "12345", "12345"]
```

上面这个例子 匹配数字 2-5次 , 他是贪婪的,会尽可能多的匹配.

有时候贪婪并不是我们要的效果,我们可以采用惰性匹配.


```JS
var regex = /\d{2,5}?/g;
var string = "123 1234 12345 123456";
console.log( string.match(regex) );
//  ['12', '12', '34', '12', '34', '12', '34', '56']
```

`/\d{2,5}?` 表示, 虽然2到5此都行,但是当2个够的时候就不往下尝试了

## 多选分支

一个模式可以实现横向和纵向模糊匹配. 而多选分支可以支持多个子模式任选其一.

具体形式如下:(p1|p2|p3)，其中 p1、p2 和 p3 是子模式，用 |(管道符)分隔，表示其中任何之一。

有个事实我们应该注意,比如我用`/good|goodbye/`去匹配`"goodbye"` 字符串时,结果是`good`

而把正则改成 `/goodbye|good/`，结果是: `goodbye`

也就是说，分支结构也是惰性的，即当前面的匹配上了，后面的就不再尝试了。



### case


#### 匹配颜色

表示一个十六进制的字符 可以使用字符组`[0-9a-fA-F]` 

其中字符可以出现3或6次, 需要用到多选分支结构


正则如下`/#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})/`


#### 匹配时间

以24小时制为例

第一个数字可以是0-2
当第一个数字是2的时候 第二位数字可以为0-3 其他情况是0-9
第三位数字是0-5 第四位数字是0-9

正则如下`/^([01][0-9]|2[0-3]):[0-5][0-9]$/`


如果要求 13位是0可以忽略 则需要调整

`/^([0]?\d|1\d|2[0-3]):(0?\d|[1-5]\d)$/`


#### 匹配日期

以 `yyyy-mm-dd` 格式为例。

年 四个数字即可 没有限制

月 当第一位是1的时候 第二个数字 只能是012

日 最大31天可以用`(0[1-9]|[12]\d|3[01])`


所以正则应该为`/\d{4}-(0\d|1[012])-(0[1-9]|[12]\d|3[01])/`


####  window 操作系统文件路径

其整体模式是`盘符:\文件夹\文件夹\文件`

盘符 不区分大小写 所以使用[a-zA-Z] 

分隔符需要转译

文件名或者文件夹名，不能包含一些特殊字符，此时我们需要排除字符组 [^\\:*<>|"?\r\n/] 来表示合法 字符,这样文件夹就可以表示为`[^\\:*<>|"?\r\n/]+\\`

最后一部分是文件 由于是路径文件是可有可无的 `([^\\:*<>|"?\r\n/]+)?`


所以正则应该是`/^[a-zA-Z]:\\([^\\:*<>|"?\r\n/]+\\)*([^\\:*<>|"?\r\n/]+)?$/`


#### 匹配ID

从html里提取出ID
```HTML
<div id="container" class="main"></div>
```

很容易想到的 `/id="\.*"/` 但是匹配出来的结果是 `id="container" class="main"`

这就是因为贪婪模式 我们只需要修改为惰性`/id="\.*?"/`

