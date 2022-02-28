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

但是它支持数组坐标查找，不知道是否对小学的乘法口诀表有印象，


我们用ts也堆出一个来看看

``` typescript
// TS加法口诀表 A + B = AdditionMap[A][B]
type AdditionMap = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
];
```

这样我们获取十以内的加法就可以算出来了，用类型可以表示为:
``` typescript
type DigitRangeMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

type Dight = DigitRangeMap[number]

type AddOneDigit<First extends Dight,Second extends Dight> = Add

type ToDigit<T extends string> = T extends keyof DigitRangeMap ? DigitRangeMap[T] : never;
type Carry<T extends number, R extends number[] = []> =
  T extends keyof RoundMap
  ? [1, [RoundMap[T], ...R]]
  : [0, [T, ...R]];
  
```