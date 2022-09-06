# 正则表达式位置匹配

内容来自JavaScript正则表达式迷你书（1.1版）第二章, 仅当做笔记学习

## 位置

位置(锚)是相邻字符之间的位置

![](https://pic.imgdb.cn/item/62ecd63e8c61dc3b8e690f6b.png)

在 ES5 中 共有6个锚:

^、$、\b、\B、(?=p)、(?!p)

### ^ 和 $

`^` (脱字符)匹配开头，在多行匹配中匹配行开头。
`$` 美元符号匹配结尾，在多行匹配中匹配行结尾。

比如我们把字符串的开头和结尾用 "#" 替换(位置可以替换成字符的!); 

```JS
const result = "hello".replace(/^|$/g, '#');
```

当有多行匹配模式的时候, 二者会匹配该行的

```JS
const result = "I\nlove\njavascript".replace(/^|$/gm, '#');
console.log(result);

/*
#I#
#love#
#javascript#
*/
```

###  \b 和 \B

`\b` 是单词边界，具体就是 `\w` 与 `\W` 之间的位置，也包括 `\w` 与 `^` 之间的位置，和 `\w` 与 `$` 之间的位置。

比如: 

```JS
const result = "[JS] Lesson_01.mp4".replace(/\b/g, '#');
console.log(result);
// => "[#JS#] #Lesson_01#.#mp4#"
```

* 第 1 个，两边字符是 "[" 与 "J"，是 \W 与 \w 之间的位置。
* 第 2 个，两边字符是 "S" 与 "]"，也就是 \w 与 \W 之间的位置。
* 第 3 个，两边字符是空格与 "L"，也就是 \W 与 \w 之间的位置。 
* 第 4 个，两边字符是 "1" 与 "."，也就是 \w 与 \W 之间的位置。
* 第 5 个，两边字符是 "." 与 "m"，也就是 \W 与 \w之间的位置。
* 第 6 个，位于结尾，前面的字符 "4" 是 \w，即 \w 与 $ 之间的位置。

`\B` 就是 `\b` 的反面的意思，非单词边界。例如在字符串中所有位置中，扣掉 `\b` ，剩下的都是 `\B` 的。

```JS
const result = "[JS] Lesson_01.mp4".replace(/\B/g, '#');
console.log(result);
// => "#[J#S]# L#e#s#s#o#n#_#0#1.m#p#4"
```

### (?=pattern) 和 (?!pattern)

(?=p)，其中 p 是一个子模式，即 p 前面的位置，或者说，该位置后面的字符要匹配 p。

```JS
const result = "hello".replace(/(?=l)/g, '#');
console.log(result);
// => "he#l#lo"
```

而 (?!p) 就是 (?=p) 的反面意思，比如:

```JS
const result = "hello".replace(/(?!l)/g, '#');
console.log(result);
// => "#h#ell#o#"
```

### *补充* (?<=pattern) (?<!pattern)

(?<=pattern) 正向后行断言 

代表字符串中的一个位置，紧接该位置之前的字符序列能够匹配pattern。

比如 `regex represents regular expression` 这个字符串, 有四个单词, 我们只想匹配单词内部的re, 不想匹配单词开头的re

我们就可以使用 `/(?<=\w)re/` 表示在re之前应该是个单词字符

```JS
const result = 'regex represents regular expression'.replace(/(?<=\w)re/g, 'name')
// 'regex repnamesents regular expnamession'
```

之所以叫后行断言，是因为正则表达式引擎在匹配字符串和表达式时，是从前向后逐个扫描字符串中的字符，并判断是否与表达式符合，当在表达式中遇到该断言时，正则表达式引擎需要往字符串前端检测已扫描过的字符，相对于扫描方向是向后的。

(?<!pattern) 负向后行断言

代表字符串中的一个位置，紧接该位置之前的字符序列不能匹配pattern。

例如对”regex represents regular expression”这个字符串，要想匹配单词开头的re，可以用”(?<!\w)re”。

```JS
const result = 'regex represents regular expression'.replace(/(?<=\w)re/g, 'name')
// 'namegex namepresents namegular expression'
```

当然也可以通过单词边界来判断 `\bre` , 结果一样

## 位置的特性

对于位置的理解, 我们可以理解成空字符“”. 

### 案例

#### 1. 写一个正则不匹配任何东西

`/.^/` 这个正则只要求一个字符, 但是该字符的后面是开头, 所以这样的字符串是不存在的

#### 2. 数字的千分位分割符表示法

```js
const result = '12345678'.replace(/(?=\d{3}$)/g, ',')
```

`(?=p)` 表示该位置后面的字符要匹配 p。

`(?=\d{3})` 表示我们要匹配的位置 后面是三个数字

所以我们通过设置 $ 结尾, 这样我们就匹配到了倒数三个数字前面的位置

然后我们需要弄出所有的逗号, 逗号出现的位置要求三个数字至少出现一次, 所以可以使用量词 `+`

```js
const result = "12345678".replace(/(?=(\d{3})+$)/g, ',')
console.log(result);
// => "12,345,678"

// 写完正则后，要多验证几个案例，此时我们会发现问题:
const result = "123456789".replace(/(?=(\d{3})+$)/g, ',')
console.log(result);
// => ",123,456,789"
```

因为上面的正则，仅仅表示把从结尾向前数，一但是 3 的倍数，就把其前面的位置替换成逗号。因此才会出 现这个问题。

所以我们要匹配出位置后面不是开头的所有满足上面条件的位置

```js
const regex = /(?!^)(?=(\d{3})+$)/g;

const result = "123456789".replace(regex, ',');
console.log(result);
// => "123,456,789"
```

我们也可以通过修改句末符 来改变形式 比如

```js
// 如果要把 "12345678 123456789" 替换成 "12,345,678 123,456,789"。

const regex = /(?!\b)(?=(\d{3})+\b)/g
const result = "12345678 123456789".replace(regex, ',');
console.log(result);
```

`(?!\b)` 表示的是 当前的位置 不是 单词边界前面的位置 就可以转化为 `\B`

最后的正则就可以表示为 `/\B(?=(\d{3})+\b)/g`

#### 3. 格式化

千分符表示法一个常见的应用就是货币格式化。

比如将 `1880` 转化为 `$1,880.00`

```js
const num = 1800;
const result = num.toFixed(2).replace(/\B(?=(\d{3})+\b)/g, ',').replace(/^/, '$')
```

#### 4. 验证码问题

密码长度 6-12 位，由数字、小写字符和大写字母组成，但必须至少包括 2 种字符。
此题，如果写成多个正则来判断，比较容易。但要写成一个正则就比较困难。

如果我们不考虑包括两种字符, 很容易可以写出

```js
const regex = /^[0-9A-Za-z]{6,12}$/;
```

如果我们要判断包含数字, 需要通过 `(?=.*[0-9])` 来做
如果同时包含字母和数字, 则需要通过 `(?=.*[0-9])(?=.*[a-z])` 来做。

```JS
const regex = /(?=.*[0-9])(?=.*[a-z])^[0-9A-Za-z]{6,12}$/;
```

对于这个正则，我们只需要弄明白 (?=.*[0-9])^ 即可。

表示开头前面还有个位置(当然也是开头，即同一个位置，想想之前的空字符类比)。

(?=.*[0-9]) 表示该位置后面的字符匹配 .*[0-9]，即，有任何多个任意字符，后面再跟个数字。
翻译成大白话，就是接下来的字符，必须包含个数字。

#### 5. 另一种解法

“至少包含两种字符”的意思就是说，不能全部都是数字，也不能全部都是小写字母，也不能全部都是大写
字母。

不能全是数字对应的正则就是

```js
const reg = /(?!^[0-9]{6,12}$)^[0-9a-zA-Z]{6,12}$/
```

三种都不能的话

```js
const reg = /(?!^[0-9]{6,12}$)(?!^[a-z]{6,12}$)(?!^[A-Z]{6,12}$)^[0-9a-zA-Z]{6,12}$/
```

## 正则表达式括号的作用

### 分组与分支

分组: 比如匹配重复出现的ab `/(ab)+/`

分支: 比如匹配如下字符串

```js
I love JavaScript
I love Regular Expression

const reg = /I love (JavaScript|Regular Expression)/
```

#### 分组引用

以日期为例. 假设格式是 yyyy-mm-dd 

我们就可以利用分组提取出年月日

```js
const regex = /(\d{4})-(\d{2})-(\d{2})/;
const string = "2017-06-12";
console.log(string.match(regex));
// 我们也可以使用正则实例对象的exec方法:
console.log(regex.exec(string));
```

同时, 也可以使用构造函数的全局属性 `$1` 至 `$9` 来获取

```js
const regex = /(\d{4})-(\d{2})-(\d{2})/;
const string = "2017-06-12";
regex.test(string); // 正则操作即可，例如 //regex.exec(string); //string.match(regex);
console.log(RegExp.$1); // "2017"
console.log(RegExp.$2); // "06"
console.log(RegExp.$3); // "12"
```

#### 替换 

比如我们想把 `yyyy-mm-dd` 替换成 `mm/dd/yyyy`

我们可以利用replace中的 第二个参数

```js
const regex = /(\d{4})-(\d{2})-(\d{2})/;
const string = "2017-06-12";
const result = string.replace(regex, function() {
    return RegExp.$2 + "/" + RegExp.$3 + "/" + RegExp.$1;
});
console.log(result);
```

#### 反向引用

除了使用相应 API 来引用分组，也可以在正则本身里引用分组。但只能引用之前出现的分组，即反向引用。

比如要写一个正则支持匹配如下三种格式:

```js
// 2016-06-12
// 2016/06/12
// 2016.06.12
// 如果是这么写正则的话
const reg1 = /^\d{4}[\/\-\.]\d{2}[\/\-\.]\d{2}$/
// 2016/06.12 也会通过
const reg2 = /\d{4}(-|\/|\.)\d{2}\1\d{2}/
```

`\1` ，表示的引用之前的那个分组 `(-|\/|\.)` 。不管它匹配到什么(比如 -)， `\1` 都匹配那个同 样的具体某个字符。

##### 括号嵌套

以左括号为准, 比如 `/^((\d)(\d(\d)))\1\2\3\4$/`

匹配字符 `1231231233`

前三个数字分别是123

对应的四个括号分别应该是 123 1 23 3

这样就可以匹配到对应的字符串

##### \10 

如果出现了 \10 表示的是第十个分组 而不是 \1 和 0; 

```JS
var regex = /(1)(2)(3)(4)(5)(6)(7)(8)(9)(#) \10+/;
var string = "123456789# ######"
console.log(regex.test(string));
// => true
```

##### 引用不存在的分组 

因为反向引用，是引用前面的分组，但我们在正则里引用了不存在的分组时，此时正则不会报错，只是匹配 反向引用的字符本身。例如 \2，就匹配 "\2"。注意 "\2" 表示对 "2" 进行了转义。

```js
var regex = /\1\2\3\4\5\6\7\8\9/;
console.log(regex.test("\1\2\3\4\5\6\7\8\9"));
// true
console.log("\1\2\3\4\5\6\7\8\9".split(""));
// ['\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07', '8', '9']
```

##### 分组后面有量词会怎样?

分组后面有量词的话，分组最终捕获到的数据是最后一次的匹配。比如如下的测试案例:

```js
var regex = /(\d)+/;
var string = "12345";
console.log(string.match(regex));
// => ["12345", "5", index: 0, input: "12345"]
```

### 非捕获括号

如果只想要括号最原始的功能，但不会引用它，即，既不在 API 里引用，也不在正则里反向引用。
此时可以使用非捕获括号 (?:p) 和 (?:p1|p2|p3)

## 括号案例

### trim方法

方法1: 匹配到开头结尾的空格 替换为空白字符

```js
function _trim(str) {
    return str.replace(/^\s+|\s+$/g, '')
}
```

方法2: 匹配到整个字符串, 然后提取出来相应的数据

```js
function _trim(str) {
    return str.replace(/^\s*(.*?)\s*$/, '$1')
}
```

### 将每个单词的首字母转换为大写

```js
function _upperCase(str) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function(c) {
        return c.toUpperCase();
    })
}
```

### 驼峰化

```js
function camelize(str) {
    return str.replace(/[-_\s]+(.)?/g, function(match, c) {
        return c ? c.toUpperCase() : '';
    });
}
```

### 逆驼峰

```js
function dasherize1(str) {
    return str.replace(/[A-Z]/g, function(e) {
        return '-' + e.toLowerCase();
    })
}

// 下民这个是书里的 不知道他为什么要替换所有的- _ 空格 为- 遇到再说
function dasherize2(str) {
    return str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}
```

### HTML转义与反转义

```js
// 将HTML特殊字符转换成等值的实体
function escapeHTML(str) {
    var escapeChars = {
        '<': 'lt',
        '>': 'gt',
        '"': 'quot',
        '&': 'amp',
        '\'': '#39'
    };
    return str.replace(new RegExp('[' + Object.keys(escapeChars).join('') + ']', 'g'),
        function(match) {
            return '&' + escapeChars[match] + ';';
        });
}
console.log(escapeHTML('<div>Blah blah blah</div>'));
// => "&lt;div&gt;Blah blah blah&lt;/div&gt";
```

反转义

```js

function unescapeHTML (str) {
    var htmlEntities = {
        nbsp: ' ',
        lt: '<',
        gt: '>',
        quot: '"',
        amp: '&',
        apos: '\''
    };
    return str.replace(/\&([^;]+);/g, function (match, key) {
        if (key in htmlEntities) {
            return htmlEntities[key];
        }
            return match;
        });
}
```

### 匹配成对标签

匹配

``` html
<title>regular expression</title>
<p>laoyao bye bye</p>
```

不匹配

```html
<title>wrong!</p>
```


匹配一个开标签 可以使用`<[^>]+>`
匹配一个闭标签 可以使用`<\/[^>]+>`

匹配一个成对的就需要使用反向引用了 `<([^>]+)>[\d\D]*<\/\1>`