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
var result = "hello".replace(/^|$/g, '#');
```

当有多行匹配模式的时候, 二者会匹配该行的

```JS
var result = "I\nlove\njavascript".replace(/^|$/gm, '#');
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
var result = "[JS] Lesson_01.mp4".replace(/\b/g, '#');
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
var result = "[JS] Lesson_01.mp4".replace(/\B/g, '#');
console.log(result);
// => "#[J#S]# L#e#s#s#o#n#_#0#1.m#p#4"
```

### (?=pattern) 和 (?!pattern)

(?=p)，其中 p 是一个子模式，即 p 前面的位置，或者说，该位置后面的字符要匹配 p。

```JS
var result = "hello".replace(/(?=l)/g, '#');
console.log(result);
// => "he#l#lo"
```

而 (?!p) 就是 (?=p) 的反面意思，比如:

```JS
var result = "hello".replace(/(?!l)/g, '#');
console.log(result);
// => "#h#ell#o#"
```


### *补充* (?<=pattern) (?<!pattern)

(?<=pattern) 正向后行断言 

代表字符串中的一个位置，紧接该位置之前的字符序列能够匹配pattern。

比如`regex represents regular expression`这个字符串,有四个单词,我们只想匹配单词内部的re,不想匹配单词开头的re

我们就可以使用`/(?<=\w)re/` 表示在re之前应该是个单词字符

```JS
const result = 'regex represents regular expression'.replace(/(?<=\w)re/g,'name')
// 'regex repnamesents regular expnamession'
```

之所以叫后行断言，是因为正则表达式引擎在匹配字符串和表达式时，是从前向后逐个扫描字符串中的字符，并判断是否与表达式符合，当在表达式中遇到该断言时，正则表达式引擎需要往字符串前端检测已扫描过的字符，相对于扫描方向是向后的。



(?<!pattern) 负向后行断言

代表字符串中的一个位置，紧接该位置之前的字符序列不能匹配pattern。

例如对”regex represents regular expression”这个字符串，要想匹配单词开头的re，可以用”(?<!\w)re”。

```JS
const result = 'regex represents regular expression'.replace(/(?<=\w)re/g,'name')
// 'namegex namepresents namegular expression'
```

当然也可以通过单词边界来判断`\bre`, 结果一样

