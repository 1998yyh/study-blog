# toLocaleString

toLocaleString 方法是用于返回格式化对象后的字符串，该字符串格式因不同语言而不同。可以通过传参决定返回的语言与具体的表现，某些场景下相当有用，语法如下：

```JS
object.toLocaleString([locales [, options]]);
```

`locales` 参数用于格式化对象时使用的语言环境,默认为当前的语言.

```JS
const data = new Date();
data.toLocalString('zh') // 2022/7/22 17:09:51
data.toLocalString('en') // 7/22/2022, 5:09:51 PM
```

options 参数为输出样式的配置项，根据 object 类型不同会有不同选项

## Number.toLocaleString();

比如格式化一个数字,整数部分三位一个逗号

```JS
const num = 2333333;
num.toLocalString(); // 2,333,333
```

### useGrouping

如果不想要分隔符,可以置成false
### style

`style` 表示格式化时使用的样式，默认值是 `decimal` 也就是纯数字，也可为 `percent` 百分比显示与 `currency` 货币显示。值为 `currency` 时必须同时指定 options 中的 `currency` 属性，否则报错。具体例子如下：

```JS
const num = 2333333;
num.toLocaleString('zh', { style: 'decimal' });   //2,333,333
num.toLocaleString('zh', { style: 'percent' });   //233,333,300%
num.toLocaleString('zh', { style: 'currency' });    //报错
```

### currency && currencyDisplay

`currency` 指定对应的货币，例如 "USD" 表示美元，"EUR" 表示欧元，或者 "CNY"是人民币。

`currencyDisplay` 是货币符号的展示样式，默认值是 `symbol`，即对应的符号，如 CNY 是 ￥。该属性的值也可以是 `code` 与 `name`

```JS
const num = 2333333;
num.toLocaleString('zh', { style: 'currency', currency: 'CNY' });    //￥2,333,333.00
num.toLocaleString('zh', { style: 'currency', currency: 'cny', currencyDisplay: 'code' });      //CNY2,333,333.00
num.toLocaleString('zh', { style: 'currency', currency: 'cny', currencyDisplay: 'name' });      //2,333,333.00人民币
```


### minimumIntegerDigits minimumFractionDigits maximumFractionDigits

用于指定最小位数,小数的最小位数和小数的最多位数

```JS
let num = 2333.3;
num.toLocaleString('zh', { minimumIntegerDigits: 5 });        //02,333.3
//如果不想有分隔符，可以指定useGrouping为false
num.toLocaleString('zh', { minimumIntegerDigits: 5, useGrouping: false });        //02333.3
num.toLocaleString('zh', { minimumFractionDigits: 2, useGrouping: false });     //2333.30

num = 666.666
num.toLocaleString('zh', { maximumFractionDigits: 2, useGrouping: false });     //666.67
```

### minimumSignificantDigits maximumSignificantDigits

如果定义了第二组的任意一个属性 则会忽略上面那组的属性

```JS
const num = 1234.5;
num.toLocaleString('zh', { minimumSignificantDigits: 6, useGrouping: false });      //1234.50
num.toLocaleString('zh', { maximumSignificantDigits: 4, useGrouping: false });      //1235
```

## Date.toLocaleString()


与数字类型不同，日期类型的 locales 对输出的影响十分之大（其实数字类型影响也大，只是一般用不到），因而应该根据实际情况选择合适的语言环境。


### hour12

表示是使用十二小时制还是二十四小时制，默认值视 locales 而定。

```JS
const date = new Date();
date.toLocaleString('zh', { hour12: true });        //2018/4/4 下午6:57:36
date.toLocaleString('zh', { hour12: false });       //2018/4/4 18:57:36
```

### 格式化年月日时分秒星期

#### weekday era

它们均可以取值为 narrow、short 或 long，简单说就是能有多短多短，缩写与正常表现

```JS
const date = new Date();
date.toLocaleString('en', { weekday: 'narrow', era: 'narrow' });        //W A
date.toLocaleString('en', { weekday: 'short', era: 'short' });      //Wed AD
date.toLocaleString('en', { weekday: 'long', era: 'long' });        //Wednesday Anno Domini
```



