# typescript 5.5新增功能

## 推断类型谓词

``` ts
function makeBirdCalls(countries: string[]) {
  // birds: (Bird | undefined)[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);

  for (const bird of birds) {
    bird.sing();  // error: 'bird' is possibly 'undefined'.
  }
}
```

上述代码 我们已经undefined从列表中过滤了所有值。但 TypeScript 却未能跟进。

使用 TypeScript 5.5，类型检查器可以正常处理以下代码：
``` ts
function makeBirdCalls(countries: string[]) {
  // birds: Bird[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);

  for (const bird of birds) {
    bird.sing();  // ok!
  }
}
```

我们将其拉出到独立函数内

``` ts
// function isBirdReal(bird: Bird | undefined): bird is Bird
function isBirdReal(bird: Bird | undefined) {
  return bird !== undefined;
}
```

bird is Bird是类型谓词。这意味着，如果函数返回true，则它是 a Bird（如果函数返回false则它是undefined）。

类型声明Array.prototype.filter了解类型谓词，因此最终结果是您获得更精确的类型，并且代码通过了类型检查器。

类型谓词具有“当且仅当”语义。如果函数返回x is T，则意味着：

如果函数返回，true则x其类型为T。
如果函数返回false则x没有type。T


再看个例子

``` ts
function getClassroomAverage(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
    .filter(score => !!score);

  return studentScores.reduce((a, b) => a + b) / studentScores.length;
  //     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // error: Object is possibly 'undefined'.
}
```

TypeScript 没有推断出 的类型谓词score => !!score，这是正确的：如果返回true则为scorea number。但如果它返回false，则score可以是undefined或 a number（具体来说，0）。这是一个真正的错误：如果任何学生在测试中得零分，那么过滤掉他们的分数将使平均值向上倾斜。超过平均水平的人少了，悲伤的人多了！

但是同时还发现一个问题 如何条件叠加的话 还是无法识别

``` ts
function getClassroomAverage2(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
    .filter(score => score !== undefined &&  score > 10)

  return studentScores.reduce((a, b) => a + b)
}
```

上述这种还是会报错



## 恒定索引访问的控制流缩小



``` ts
function f1(obj: Record<string, unknown>, key: string) {
    if (typeof obj[key] === "string") {
        // 5.5 之前版本会报错
        obj[key].toUpperCase();
    }
}

```


## 其他内容

<https://devblogs.microsoft.com/typescript/announcing-typescript-5-5-beta/>