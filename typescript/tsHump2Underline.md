# TS 驼峰与下划线互相转化

需要部分前置知识如(递归，变量，重映射，infer等),阅读过程中如有问题,请查阅上篇TS类型体操

## 下划线转驼峰 

下划线相较于驼峰有明显的特征就是下划线，我们可以通过`${infer A}_${infer B}`很容易提取出下划线后面的部分,然后通过底层自带的`Capitalize`,将首字母转化成大写。

```typescript
// 下划线转驼峰
type DeepParseHump<T> =   T extends `${infer A}_${infer B}` ? `${A}${Capitalize<B>}` :T ; 

type result = DeepParseHump<'a_b'> // aB
```

但是我们定义变量不仅仅只会有一个下划线，所以需要进行递归处理

```typescript
// 下划线转驼峰
type DeepParseHump<T> =   T extends `${infer A}_${infer B}` ? `${A}${DeepParseHump<Capitalize<B>>}` :T ; 

type result = DeepParseHump<'a_b_ccasd_d'> // aBCcasdD
```

到目前可以说主要的功能已经完成了。剩下的就是各种判断,我们要判断数组和对象，对其分别处理

``` typescript
// 判断对象 与 数组
type Hump2Underline<T> =  T extends Array<any> ?  deepParseArray<T[number]> : T extends Record<string,any> ? deepParseObject<T> : T;
```

然后我们需要分别完成对象与数组的操作

``` typescript
// 对于数组我们需要对其每个元素都进行转化的操作
interface deepParseArray<T> extends Array<Hump2Underline<T>> {};

// 我们使用遍历对象的key 进行重映射修改，并且其value也有可能是对象或数组，所以需要递归处理。
type deepParseObject<T extends Record<string,any>>  = {
  [P in keyof T as `${DeepParseHump<P & string>}`] : Hump2Underline<T[P]>
}
```


我们找个试一下 可直接复制到playground尝试一下
 
```typescript
// 下划线转驼峰
type DeepParseHump<T> =   T extends `${infer A}_${infer B}` ? `${A}${DeepParseHump<Capitalize<B>>}` :T ; 

interface deepParseArray<T> extends Array<Hump2Underline<T>> {};

type deepParseObject<T extends Record<string,any>>  = {
  [P in keyof T as `${DeepParseHump<P & string>}`] : Hump2Underline<T[P]>
}

type Hump2Underline<T> =  T extends Array<any> ?  deepParseArray<T[number]> : T extends Record<string,any> ? deepParseObject<T> : T;

// 测试
interface b {
  a_b:number,
  casd_d:number,
  x:{
    m_d:{
      x_yasasd_z:{
      aaxasd_bb:number
      }
    },
  },
  y:[
    {
      mmmasd_asdas:number
    }
  ]
}

type a = Hump2Underline<b>

// 通过不报错
const m:a = {
  aB:1,
  casdD:1,
  x:{
    mD:{
      xYasasdZ:{
        aaxasdBb:1
      }
    }
  },
  y:[{
    mmmasdAsdas:1
  }]
}
```


## 驼峰转下划线

驼峰就比较难处理了,没有明确的分隔符，不是很好去提取对应的文本段。

我们换个角度想一下，如果一个字符串 首字母小写之后 与 自身相同 是不是就可以证明当前点不是拆分点；

底层同样提供了`Uncapitalize`帮助我们转化首字母小写

``` typescript
// 由于有上一个的经验 我们就不拆分递归了
// 此处判断相等 不是很严谨 但是我们知道明确的是字符串 所以也可以这样判断。
type ParseUnderline<T extends string> = T extends `${infer A}${infer B}` ? B extends Uncapitalize<B> ? `${A}${ParseUnderline<B>}` : `${A}_${Uncapitalize<ParseUnderline<B>>}` : T;
```


剩下的与下划线转驼峰一样，

``` typescript
// 处理数组
interface deepParseUnderLineArray<T> extends Array<Underline2Hump<T>> {};

// 处理对象
type deepParseUnderLineObject<T extends Record<string,any>>  = {
  // 重映射
  [P in keyof T as `${ParseUnderline<P & string>}`] : Underline2Hump<T[P]>
}
// 最终类型
type Underline2Hump<T> =  T extends Array<any> ?  deepParseUnderLineArray<T[number]> : T extends Record<string,any> ? deepParseUnderLineObject<T> : T;

// 测试
// 此处a为上面转化过的类型
type c = Underline2Hump<a>

const x:c = {
  a_b:1,
  casd_d:1,
  x:{
    m_d:{
      x_yasasd_z:{
        aaxasd_bb:1,
      }
    }
  },
  y:[
    {
      mmmasd_asdas:1
    }
  ]
}
```

## 总结

……