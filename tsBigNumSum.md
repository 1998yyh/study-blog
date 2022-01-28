# TS版本大数相加

## JS版本

我们知道js有最大安全数的限制，做大数相加的时候会出现问题，通常我们用的是字符串去处理，如下所示。

``` javascript 
var addStrings = function (num1, num2) {
  let i = num1.length - 1;
  let j = num2.length - 1;
  let add = 0;
  const resultArr = [];
  while (i >= 0 || j >= 0 || add != 0) {
    const x = i >= 0 ? num1.charAt(i) - 0 : 0;
    const y = j >= 0 ? num2.charAt(j) - 0 : 0;
    const result = x + y + add;
    resultArr.push(result % 10);

    add = Math.floor(result / 10);
    i--;
    j--;
  }
  return resultArr.reverse().join('')
};
```

## TS版本

我们知道TS的类型系统是图灵完备的，那么按理说，也是可以实现上述操作的。

### 简单的加法

可能一开始就遇到了困难，TS这玩意好像都不支持加法。

我们仔细想一下`A + B = C` 


