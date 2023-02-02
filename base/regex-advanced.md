# 正则(advanced)

## 正则表达式回溯法原理

学习正则表达式，是需要懂点儿匹配原理的。 而研究匹配原理时，有两个字出现的频率比较高:“回溯”。 听起来挺高大上，事实上却是一个比较容易理解的概念。

#### 没有回溯的匹配

假设我们的正则是 `/ab{1,3}c/`

而当目标字符串是 "abbbc" 时，就没有所谓的“回溯”。

#### 有回溯的匹配

如果目标字符串是"abbc"，中间就有回溯。 匹配到第三个b 没有的时候会回朔 第二个就可以了.

回溯法也称试探法，它的基本思想是: 从问题的某一种状态(初始状态)出发，搜索从这种状态出发 所能达到的所有“状态”，当一条路走到“尽头”的时候(不能再前进)，再后退一步或若干步，从 另一种可能“状态”出发，继续搜索，直到所有的“路径”(状态)都试探过。这种不断“前进”、 不断“回溯”寻找解的方法，就称作“回溯法”。

JavaScript 中正则表达式会产生回溯的地方都有哪些呢?

```js
var string = "12345";
var regex = /(\d{1,3})(\d{1,3})/;
console.log(string.match(regex));
// => ["12345", "123", "45", index: 0, input: "12345"]
```

当我们加了惰性量词的时候. 表示尽可能少的匹配. 比如匹配如下字符串
```js
var string = "12345";
var regex = /(\d{1,3}?)(\d{1,3})/;
console.log(string.match(regex));
// => ["1234", "1", "234", index: 0, input: "12345"]
```

虽然惰性量词不贪，但也会有回溯的现象。比如正则是:

```js
var string = "12345";
var regex = /^(\d{1,3}?)(\d{1,3})$/;
console.log(string.match(regex));
// => ["12345", "12", "345", index: 0, input: "12345"]
```

#### 分支结构的匹配

我们知道分支也是惰性的，比如 /can|candy/，去匹配字符串 "candy"，得到的结果是 "can"，因为分支会
一个一个尝试，如果前面的满足了，后面就不会再试验了

分支结构，可能前面的子模式会形成了局部匹配，如果接下来表达式整体不匹配时，仍会继续尝试剩下的分
支。这种尝试也可以看成一种回溯。

比如正则 `/^(?:can|candy)$/` 目标字符串是 `candy`

## 正则表达式的拆分

### IPV4地址

 `/^((0{0,2}\d|0?\d{2}|1\d{2}|2[0-4]\d|25[0-5])\.){3}(0{0,2}\d|0?\d{2}|1\d{2}|2[0-4]\d|25[0-5])$/`

这部分正则主要是 前面三个多了一个 . 

 `(0{0,2}\d|0?\d{2}|1\d{2}|2[0-4]\d|25[0-5])`

这部分又可以拆成一个5部分的多选结构

`0{0,2}\d` ，匹配一位数，包括 "0" 补齐的。比如，"9"、"09"、"009"; 
`0?\d{2}` ，匹配两位数，包括 "0" 补齐的，也包括一位数; 
`1\d{2}` ，匹配 "100" 到 "199"; 
`2[0-4]\d` ，匹配 "200" 到 "249"; 
`25[0-5]` ，匹配 "250" 到 "255"。

## 正则表达式的构建

### 平衡法则

构建正则有一点非常重要，需要做到下面几点的平衡:
• 匹配预期的字符串
• 不匹配非预期的字符串 • 可读性和可维护性
• 效率

### 构建正则的前提

1. 是否能使用正则

正则太强大了，以至于我们随便遇到一个操作字符串问题时，都会下意识地去想，用正则该怎么做。但我们 始终要提醒自己，正则虽然强大，但不是万能的，很多看似很简单的事情，还是做不到的。

比如匹配这样的字符串:1010010001...。 虽然很有规律，但是只靠正则就是无能为力。

2. 是否有必要使用正则

要认识到正则的局限，不要去研究根本无法完成的任务。同时，也不能走入另一个极端: 无所不用正则。能用字符串 API 解决的简单问题，就不该正则出马。

比如从日期中提取出年月日

```js
const string = "2017-07-01";
const regex = /^(\d{4})-(\d{2})-(\d{2})/;
console.log(string.match(regex));

//  ["2017-07-01", "2017", "07", "01", index: 0, input: "2017-07-01"]
//  其实用string.split('-') 来做即可
```

比如判断字符串中存在某个字符, 使用indexOf即可

3. 是否有必要构建一个复杂的正则

比如密码匹配问题，要求密码长度 6-12 位，由数字、小写字符和大写字母组成，但必须至少包括 2 种字符

 `/(?!^[0-9]{6,12}$)(?!^[a-z]{6,12}$)(?!^[A-Z]{6,12}$)^[0-9A-Za-z]{6,12}$/`

其实完全可以分解为多个小正则来做

```js
var regex1 = /^[0-9A-Za-z]{6,12}$/;
var regex2 = /^[0-9]{6,12}$/;
var regex3 = /^[A-Z]{6,12}$/;
var regex4 = /^[a-z]{6,12}$/;

function checkPassword(string) {
    if (!regex1.test(string)) return false;
    if (regex2.test(string)) return false;
    if (regex3.test(string)) return false;
    if (regex4.test(string)) return false;
    return true;
}
```

### 准确性

所谓准确性，就是能匹配预期的目标，并且不匹配非预期的目标。

#### 匹配固定电话

比如匹配如下格式的固定电话

```

055188888888
0551-88888888
(0551)88888888
```

区号是"0"开头的3-4位数字, 对应的正则是 `/0\d{2,3}/`

号码是非"0"开头的7-8位数字, 对应的正则是 `/[1-9]\d{6,7}/`

因此是那个数字对应的正则应该是

```js
const reg1 = /^0\d{2,3}[1-9]\d{6,7}$/
const reg2 = /^0\d{2,3}-[1-9]\d{6,7}$/
const reg3 = /^\(0\d{2,3}\)[1-9]\d{6,7}$/
```

合并一下

 `/^(\(0\d{2,3}\)|0\d{2,3}\-?)[1-9]\d{6,7}$/`

#### 匹配浮点数

要求匹配如下的格式

```js
// 1.23、+1.23、-1.23 10、+10、-10 .2、+.2、-.2
// 可以看做分为三个部分
// 符号部分 +-  整数部分 \d+ 小数部分\.\d+;
// 很容易写出下面这种正则 但是这个会有一个问题是回匹配到空
const reg = /^[+-]?(\d+)?(\.\d+)?$/
```

要匹配 "1.23"、"+1.23"、"-1.23"，可以用 `/^[+-]?\d+\.\d+$/` ， 
要匹配 "10"、"+10"、"-10"，可以用 `/^[+-]?\d+$/` ，
要匹配 ".2"、"+.2"、"-.2"，可以用 `/^[+-]?\.\d+$/` 。
因此整个正则是这三者的或的关系，提取公众部分后是: `/^[+-]?(\d+\.\d+|\d+|\.\d+)$/`

### 效率

保证了准确性后，才需要是否要考虑要优化。大多数情形是不需要优化的，除非运行的非常慢。什么情形正
则表达式运行才慢呢? 我们需要考察正则表达式的运行过程(原理)。 正则表达式的运行分为如下的阶段:
• 1. 编译; 
• 2. 设定起始位置; 
• 3. 尝试匹配; 
• 4. 匹配失败的话，从下一位开始继续第 3 步; 
• 5. 最终结果: 匹配成功或失败。

## 正则表达式编程

正则表达式是匹配模式，不管如何使用正则表达式，万变不离其宗，都需要先“匹配”。
有了匹配这一基本操作后，才有其他的操作: 验证、切分、提取、替换。

### 验证

1. search

```js
var regex = /\d/;
var string = "abc123";
// ~-1 = 0  !! 转化成boolean
console.log(!!~string.search(regex));
```

2. test

```js
var regex = /\d/;
var string = "abc123";
console.log(regex.test(string));
// => true
```

3. match

```js
var regex = /\d/;
var string = "abc123";
// match 返回的结果不是数组就是null
console.log(!!string.match(regex));
// => true
```

4. exec

```js
var regex = /\d/;
var string = "abc123";
console.log(!!regex.exec(string));
// => true
```

### 切分

```js
var regex = /\D/;
console.log("2017/06/26".split(regex));
console.log("2017.06.26".split(regex));
console.log("2017-06-26".split(regex));
// => ["2017", "06", "26"]
// => ["2017", "06", "26"]
// => ["2017", "06", "26"]
```

### 提取

1. match

```js
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";
console.log(string.match(regex));
// =>["2017-06-26", "2017", "06", "26", index: 0, input: "2017-06-26"]
```

2. exec 

```js
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";
console.log(regex.exec(string));
// =>["2017-06-26", "2017", "06", "26", index: 0, input: "2017-06-26"]
```

3. test

```js
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";
regex.test(string);
console.log(RegExp.$1, RegExp.$2, RegExp.$3);
// => "2017" "06" "26"
```

4. search

```js
   var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
   var string = "2017-06-26";
   string.search(regex);
   console.log(RegExp.$1, RegExp.$2, RegExp.$3);
   // => "2017" "06" "26"
```

5. replace

```js
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";
var date = [];
string.replace(regex, function(match, year, month, day) {
    date.push(year, month, day);
});
console.log(date);
// => ["2017", "06", "26"]
```

### 替换

``` js
var string = "2017-06-26";
var today = new Date( string.replace(/-/g, "/") ); console.log( today );
```


### API注意点

用于正则操作的方法共有6个,字符串实例 `4` 个 ,正则实例子 `2` 个


#### search match 参数问题

search 和 match，会把字符串转换为正则的

``` js
const string = '2017.06.27';
console.log(string.search("."))
// 0
// 应该使用
console.log(string.search("\\."));
console.log(string.search(/\./));
// 4 

// match
console.log(string.match('.'));
// => ["2", index: 0, input: "2017.06.27"]
console.log(string.match("\\."));
console.log(string.match(/\./));
```


#### match 返回结果的格式问题 

与正则对象是否有修饰符 g 有关

``` js
const string = '2017.06.27'
const regex1 = /\b(\d+)\b/;
const regex2 = /\b(\d+)\b/g;
console.log( string.match(regex1) );
console.log( string.match(regex2) );
// => ["2017", "2017", index: 0, input: "2017.06.27"]
// => ["2017", "06", "27"]
```

#### exec 比 match 更强大

``` js
const string = "2017.06.27";
const regex2 = /\b(\d+)\b/g;
console.log( regex2.exec(string) );
console.log( regex2.lastIndex);
console.log( regex2.exec(string) );
console.log( regex2.lastIndex);
console.log( regex2.exec(string) );
console.log( regex2.lastIndex);
console.log( regex2.exec(string) );
console.log( regex2.lastIndex);
// => ["2017", "2017", index: 0, input: "2017.06.27"]
// => 4
// => ["06", "06", index: 5, input: "2017.06.27"]
// => 7
// => ["27", "27", index: 8, input: "2017.06.27"]
// => 10
// => null
// => 0

```

与 while 配合

```js
const string = "2017.06.27";
const regex2 = /\b(\d+)\b/g;
const result;
while ( result = regex2.exec(string) ) {
    console.log( result, regex2.lastIndex );
}
// => ["2017", "2017", index: 0, input: "2017.06.27"] 4
// => ["06", "06", index: 5, input: "2017.06.27"] 7
// => ["27", "27", index: 8, input: "2017.06.27"] 10
```


#### 修饰符 g，对 exex 和 test 的影响

正则实例的 lastIndex 属性，表示尝试匹配时，从字符串的 lastIndex 位开始去匹配。

字符串的四个方法,每次匹配的时候都是从 0 开始的,即 lastIndex 属性始终不变.

而正则实例的两个方法 exec、test 当正则是全局匹配时 , 每次完成匹配都会修改 lastIndex 

``` js
var regex = /a/g;
console.log( regex.test("a"), regex.lastIndex );
console.log( regex.test("aba"), regex.lastIndex );
console.log( regex.test("ababc"), regex.lastIndex );
// => true 1
// => true 3
// => false 0
```

如果没有 g 都是从第 0 个字符处开始匹配


#### replace

|  属性  | 描述  |
|  :----:  | ----  |
| $1,$2,...,$99   | 匹配第 1-99 个 分组里捕获的文本 |
| $&  | 匹配到的子串文本 |
| $`  | 匹配到的子串的左边文本 |
| $'  | 匹配到的子串的右边文本 |
| $&  | 美元符号 |


例如，把 "2,3,5"，变成 "5=2+3":

```js
var result = "2,3,5".replace(/(\d+),(\d+),(\d+)/, "$3=$1+$2");
console.log(result);
// => "5=2+3"
```

又例如，把 "2,3,5"，变成 "222,333,555":

``` js
var result = "2,3,5".replace(/(\d+)/g, "$&$&$&");
console.log(result);
// => "222,333,555"
```

再例如，把 "2+3=5"，变成 "2+3=2+3=5=5":

```js
var result = "2+3=5".replace(/=/, "$&$`$&$'$&");
console.log(result);
// => "2+3=2+3=5=5"
```

第二个参数是函数时,我们需要注意 
``` js
"1234 2345 3456".replace(/(\d)\d{2}(\d)/g, function (match, $1, $2, index, input) {
    console.log([match, $1, $2, index, input]);
});
// => ["1234", "1", "4", 0, "1234 2345 3456"]
// => ["2345", "2", "5", 5, "1234 2345 3456"]
// => ["3456", "3", "6", 10, "1234 2345 3456"]
```

#### 把一个字符串编程每三个一组的字符串 用空格分开


输入`abcdef`
输出`abc bcd cde def`

1. 方法一:
``` js
'abcdef'.replace(/.(?=(..(?!$)))/g,'$&$1 ')  // 输出 'abc bcd cde def'

// 不加(?!$)会把倒数第三个也替换了，替换到倒数第三个的时候可以直接结束了
'abcdef'.replace(/.(?=(..(?!$)))/g,'$&$1 ')  // 输出 'abc bcd cde def ef'

```

2. 方法二:
```js
'abcdef'.replace(/(?!^)(?=(..)(?!$))/g,'$1 ')  // 输出 'abc bcd cde def'

```


#### 替换

输入: `Hello,my name is Alice`
输出: `H___,m_n____i_A____`


```js
'Hello,my name is Alice'.replace(/\B\w/g,'_'); // 输出 'H____,m_ n___ i_ A____'
```