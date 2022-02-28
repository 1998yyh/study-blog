# TS类型编程基础版

## 类型是什么

它们是编程语言提供的对不同内容的抽象:
* 不同类型变量占据的内存大小不同。
* 不同类型变量可做的操作不同。

如果能保证对某种类型只做该类型允许的操作，这就叫做类型安全

### 简单类型系统

比如一个 add 函数既可以做整数加法、又可以做浮点数加法，却需要声明两个函数：

```typescript
function returnStringValue(n:string):string {
  return n;
}

function returnNumberValue(n:number):number{
  return n;
}
```

### 支持泛型的类型系统

声明时把会变化的类型声明成泛型（也就是类型参数），在调用的时候再确定类型。

```typescript
function getPropValue<T>(obj: T, key): number { //key对应的属性值类型
    return obj[key];
}
```

好像拿到了 T，也不能拿到它的属性和属性值，如果能对类型参数 T 做一些逻辑处理就好了。

所以，就有了第三种类型系统。

### 支持类型编程的类型系统

```typescript
function getPropValue<T extends object,Key extends keyof T>(obj: T, key: Key): T[Key] {
    return obj[key];
}
```

### 类型逻辑可以多复杂？

TypeScript 的类型系统是图灵完备的，也就是能描述各种可计算逻辑。简单点来理解就是循环、条件等各种 JS 里面有的语法它都有，JS 能写的逻辑它都能写。

## 开始

基本类型

* 元组（Tuple）就是元素个数和类型固定的数组类型：
* 接口（Interface）可以描述函数、对象、构造器的结构：
* 枚举（Enum）是一系列值的复合：
* 字面量类型 1111、'aaaa'、{ a: 1} 
* void 代表空，可以是 null 或者 undefined，一般是用于函数返回值。
* any 是任意类型，任何类型都可以赋值给它，它也可以赋值给任何类型。
* unknown 是未知类型，任何类型都可以赋值给它，但是它不可以赋值给别的类型。
* never 代表不可达，比如函数抛异常的时候，返回值就是 never。

### 类型的装饰

```typescript
interface IPerson {
    readonly name: string;
    age?: number;
}
type tuple = [string, number?];
```

### 类型运算

#### 条件：extends ? :

```typescript
type res = 1 extends 2 ? true : false;
```

这就是 TypeScript 类型系统里的 if else。

#### 推导：infer

如何提取类型的一部分呢？答案是 infer。

比如提取元组类型的第一个元素：

```typescript
type First<Tuple extends unknown[]> = Tuple extends [infer T,...infer R] ? T : never;

type res = First<[1,2,3]>;
```

#### 联合：｜  交叉：&

```typescript
type Union = 1 | 2 | 3;

type ObjType = {a: number } & {c: boolean};
```

#### 映射类型

映射类型就相当于把一个集合映射到另一个集合

```typescript
type MapType<T> = {
  [Key in keyof T]?: T[Key]
}
```

`keyof T` 是查询索引类型中所有的索引，叫做索引查询。

`T[Key]` 是取索引类型某个索引的值，叫做索引访问。

`in` 是用于遍历联合类型的运算符。

比如我们把一个索引类型的值变成 3 个元素的数组：

```typescript
type MapType<T> = {
    [Key in keyof T]: [T[Key], T[Key], T[Key]]
}

type res = MapType<{a: 1, b: 2}>;
```

##### 重映射

除了值可以变化，索引也可以做变化，用 as 运算符，叫做重映射。

```typescript
type MapType<T> = {
  [
      Key in keyof T 
          as `${Key & string}${Key & string}${Key & string}`
  ]: [T[Key], T[Key], T[Key]]
}
```

交叉类型会把同一类型做合并，不同类型舍弃。

**注**: 这个地方 `Key & string` 解释一下, 索引类型是可以使用 `string` , `number` , `symbol` 作为key, 这里 `keyof T` 取出的所索引就是 `string|number|symbol` 的联合类型，和 `string` 交叉就剩下了 `string` 。

## 匹配提取

### 模式匹配

字符串可以和正则做模式匹配，找到匹配的部分然后可以用1，2等引用匹配到的元素。

```javascript
'abc'.replace(/a(b)c/, '$1,$1,$1');
'b,b,b'
```

typescript 同样可以做模式匹配

比如这样一个Promise类型:

```typescript
type p = Promise < 'p' >
```

我们想要提取value的类型，可以

```typescript
type GetValueType<P> = P extends Promise<infer Value> ? Value : never;
```

通过 `extends` 对传入的类型参数 P 做模式匹配，其中值的类型是需要提取的，通过 `infer` 声明一个局部变量 `Value` 来保存，如果匹配，就返回匹配到的 `Value` ，否则就返回 `never` 代表没匹配到。

#### 数组类型

数组类型 想提取第一个元素的类型如何做?

```typescript
type arr = [1,2,3];
```

他来匹配一个模式类型，提取第一个元素通过 `infer` 声明的局部变量里返回。

```typescript
type GetFirst<Arr extends unknown[]> = Arr extends [infer First,...unknown[]] ? First :  never;
```

同理可以提取最后一个元素

```typescript
type GetLast<Arr extends unknown[]> = Arr extends [...unknown[] , infer Last] ? Last :  never;
```

剩余数组也可以提取

```typescript
type PopArr<Arr extends unknown[]> = Arr extends [...infer Rest,unknown] ? Rest : never;
type ShiftArr<Arr extends unknown[]> = Arr extends [unknown,...infer Rest] ? Rest : never;
```

#### 字符串类型

判断字符串是否以某个前缀开头，也是通过模式匹配(StartsWith)

```typescript
type StartsWith<Str extends string, Prefix extends string> = Str extends `${Prefix}${string}` ? true : false;
```

也可以匹配一个模式类型，提取想要的部分，构成一个新的类型

```typescript
type ReplaceStr<Str extends string,From extends string,Toe extends string> = Str extends `${infer Prefix}${From}${infer Suffix}` ? `${Prefix}${To}${Suffix}` : never;
```

同理也可以实现匹配掉空白字符

```typescript
type TrimStrRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\t'}`  TrimStrRight<Rest> : Str;
```

#### 函数

函数可以通过模式匹配，提取参数，返回值的类型。

```typescript
type GetParameters<Func extends Function> = Func extends (...args: infer Args) => unknown ? Args : never;
```

```typescript
type GetReturnType<Func extends Function> = Func extends (...args: unknown[]) => infer ReturnType ? ReturnType : never;
```

### class 

class 可以通过模式匹配提取 this 和构造器的实例类型：

```typescript
class Dong {
    name: string;

    constructor() {
        this.name = "dong";
    }

    hello() {
        return 'hello, I\'m ' + this.name;
    }
}

const dong = new Dong();
dong.hello();
```

用 `对象.方法名` 的方式调用的时候， `this` 就指向那个对象。但是方法也可以用call或者apply调用。

```typescript
dong.hello.call({xxx:1})
```

call调用的时候, this就变了，但这里却并没有检查出来this的指向的错误。

我们可以声明方法的时候指定this的类型:

```typescript
class Dong {
  name:string;

  constructor() {
    this.name = "dong";
  }

  hello(this: Dong) {
      return 'hello, I\'m ' + this.name;
  }
}

const dong = new Dong();
dong.hello();
dong.hello.call({xxx:1})
```

这里的this 我们也可以通过匹配模式提取出来

```typescript
type GetThisParameterType<T> = T extends (this: infer ThisType, ...args: any[]) => any  ? ThisType : unknown;

type o = GetThisParameterType<typeof dong.hello>
```

构造器类型可以用 `interface` 声明，使用 `new().xxx` 的语法。

```typescript
interface Person {
    name: string;
}

interface PersonConstructor {
    new(name: string): Person;
}

```

这里的personConstructor 返回的Person类型的实例对象，也可以通过匹配模式提取出来

```typescript
type GetInstanceType<ConstructorType extends new (...args:any) => any> = ConstructorType extends new (...args:any) => infer Instance ? Instance : any;
```

类型参数 `ConstructorType` 是待处理的类型, 通过 `extends` 约束为构造器类型

用 ConstructorType 匹配一个模式类型，提取返回的实例类型到 infer 声明的局部变量 InstanceType 里，返回 InstanceType。

## 变换

类型编程的主要目的就是对类型做各种转换, 那么如何对类型做修改呢？

TypeScript 类型系统支持 3 种可以声明任意类型的变量： `type` 、 `infer` 、类型参数。

`type` 叫做类型别名，其实就是声明一个变量存储某个类型:

```typescript
type t = Promise<number>
```

`infer` 用于类型的提取，然后保存到一个变量里，相当于局部变量:

```typescript
type GetValueType<P> = P extends Promise<infer Value> ? Value : never;
```

`类型参数` 用于接受具体的类型，在类型运算中也相当于局部变量:

```typescript
type isTwo<T> = T extends 2 ? true: false;
```

但是严格来说这三种也都不叫变量，因为它们不能被重新赋值。

### 数组类型的重构

我们有一个元组类型, 我们想给他再添加一些类型, typescript类型变量不支持修改，我们可以构造一个新的元组类型:

#### Push

```typescript
type tuple = [1,2,3]

type Push<Arr extends unknown[],Ele> = [...Arr,Ele];

```

#### Unshift

同样可以往前加

```typescript
type tuple = [1,2,3]

type Unshift<Arr extends unknown[],Ele> = [Ele,...Arr];

```

#### Zip

```typescript
type tuple1 = [1,2];
type tuple2 = ['guang', 'dong'];

// 我们想要合并成这样的元组
type tuple = [[1,'guang'],[2,'dong']]
```

```typescript
type Zip<One extends [unknown, unknown], Other extends [unknown, unknown]> = 
    One extends [infer OneFirst, infer OneSecond]
        ? Other extends [infer OtherFirst, infer OtherSecond]
            ? [[OneFirst, OtherFirst], [OneSecond, OtherSecond]] :[] 
                : [];
```

我们往深扩展一下 如果不只两个呢

```typescript
type Zip2<One extends unknown[], Other extends unknown[]> = 
    One extends [infer OneFirst, ...infer OneRest]
        ? Other extends [infer OtherFirst, ...infer OtherRest]
            ? [[OneFirst, OtherFirst], ...Zip2<OneRest, OtherRest>]: []
                : [];
```

### 字符串类型的重构

#### 修改

我们想把一个字面量类型的首字母转为大写 

```typescript
type CapitalizeStr<Str extends string> = Str extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : Str

```

这就是字符串类型的重新构造：从已有的字符串类型中提取出一些部分字符串，经过一系列变换，构造成新的字符串类型。

我们顺着首字母大写逻辑，写一个下划线转驼峰的类型。

```typescript
type CamelCase<Str extends string> =  Str extends `${infer Left}_${infer Right}${infer Rest}`  ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`  : Str;
```

#### 删除

可以修改自然可以删除：

```typescript
// 类型参数 Str 是待处理的字符串， SubStr 是要删除的字符串，都通过 extends 约束为 string 类型。
// 通过模式匹配提取 SubStr 之前和之后的字符串到 infer 声明的局部变量 Prefix、Suffix 中。
// 如果不匹配就直接返回 Str。
type DropSubStr<Str extends string, SubStr extends string> =  Str extends `${infer Prefix}${SubStr}${infer Suffix}` ? DropSubStr<`${Prefix}${Suffix}`, SubStr> : Str;
```

### 函数类型的重构

比如我们想添加一个参数

```typescript
type AppendArgument<Func extends Function,Arg> = Func extends (...args:infer Args) => infer ReturnType ? (...args:[...Args,Arg]) => ReturnType : never;

```

### 索引类型的重新构造

```typescript
type obj = {
  name:string;
  age:number;
  gender:boolean;
}

// 索引类型可以添加修饰符
type modifiObj = {
  readonly name: string;
  age?:number;
  gender:boolean;
}
```

对于索引类型的修改和构造涉及到了映射类型的语法:

```typescript
type Mapping<Obj extends object> = {
  [Key in keyof Obj] : Obj[Key];
}
```

我们可以对值修改:

```typescript
type MapType<T> = {
    [Key in keyof T]: [T[Key], T[Key], T[Key]]
}

type res = MapType<{a: 1, b: 2}>;
```

对key修改:

```typescript
// 将原来的key 变成了大写的Key
type UppercaseKey<Obj extends object> = { 
    [Key in keyof Obj as Uppercase<Key & string>] : Obj[Key];
}
```

Typescript 提供了 内置的高级类型 Record 来创建索引类型, 

指定索引和值的类型分别为 K 和 T，就可以创建一个对应的索引类型。

```typescript
type Record<K extends string|number|symbol , T> = {[P in K]:T}
```

索引类型的索引可以添加 `readonly` 的修饰符，代表只读。

那我们可以实现索引类型添加 `readonly` 修饰的高级类型:

```typescript
type ToReadonly<T> = {
  readonly [Key in keyof T] : T[Key]
}
```

同理, 索引类型还可以添加可选修饰符:

```typescript
type ToPartial<T> = {
  [Key in keyof T]?:T[Key]
}
```

除了添加 `readonly` 我们也可以删除 `readonly`

```typescript
type ToMutable<T> = {
  -readonly [Key in keyof T]:T[Key]
}
```

删除可选修饰符

```typescript
type ToRequire<T> = {
  [Key in keyof T]-?:T[Key];
}
```

可以再构造新的索引类型时做过滤

```typescript
type FilterByValueType<Obj extends Record<string,any>,ValueType> = {
  [Key in keyof Obj] as ValueType extends Obj[Key] ? Key : never] : Obj[Key]
}

```

类型参数 Obj 为要处理的索引类型，通过 extends 约束为索引为 string，值为任意类型的索引类型 Record<string, any>。

构造新的索引类型，索引为 Obj 的索引，也就是 Key in keyof Obj，但要做一些变换，也就是 as 之后的部分。

如果原来索引的值 Obj[Key] 是 ValueType 类型，索引依然为之前的索引 Key，否则索引设置为 never，never 的索引会在生成新的索引类型时被去掉。

## 递归调用

递归是把问题分解为一系列相似的小问题，通过函数不断调用自身来解决这一个个小问题，直到满足结束条件，就完成了问题的求解。

TypeScript 类型系统不支持循环，但支持递归。当处理数量（个数、长度、层数）不固定的类型的时候，可以只处理一个类型，然后递归的调用自身处理下一个类型，直到结束条件也就是所有的类型都处理完了，就完成了不确定数量的类型编程，达到循环的效果。

举个简单的例子

```typescript
// 这是一个Promise的递归
type p = Promise<Promise<Promise<Record<string, any>>>>;

// 
type DeepPromiseValueType<P extends Promise<unknown>> = P extends Promise<infer ValueType> ? ValueType extends Promise<unknown> ? DeepPromiseValueType<ValueType> : ValueType :never;
```

### 数组类型的递归

```typescript
// 我们要构造一个长度为 n 的数组，那么就要传入长度的类型参数 Len、元素的类型参数 Ele、以及构造出的数组的类型参数 Arr（用于递归）。
// 然后类型计算逻辑就是判断 Arr 的 length 是否是 Len，如果是的话，就返回构造出的 Arr，不是的话就往其中添加一个元素继续构造。
type createArray<Len, Ele, Arr extends Ele[] = []> = Arr['length'] extends Len ? Arr : createArray<Len, Ele, [Ele, ...Arr]>;
type createArrayRes = createArray<3, 'a'>
```


<https://note.xiexuefeng.cc/post/ts-union-to-tuple/>
