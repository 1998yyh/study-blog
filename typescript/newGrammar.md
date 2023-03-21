# 新语法

## 5.0.2 

vscode 自身的ts版本 4.9.5 需要选择一下 node_modules 下的包版本

`command + shift + p` 输入 `Select typescript version ...` 会出现这个然后选择 包版本5.0.2


### const 类型参数

Typescript 通常会把一个对象推断成一个更通用的类型。

``` ts
type HasNames = {names : readonly string[]};
function getNamesExactly<T extends HasNames>(arg:T) :T["names"]{
  return arg.names
}

// 推断的类型是: string[]
const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"]});

// 如果想要推导的类型是 ["Alice", "Bob", "Eve"] 我们需要 as Const
const names2 =  getNamesExactly({ names: ["Alice", "Bob", "Eve"]} as const);
```

这种方式用起来不够优雅 而且可能会忘了加, 所以TS5 的类型参数支持了const 描述符;

``` ts
type HasNames = { names: readonly string[] };
function getNamesExactly<const T extends HasNames>(arg: T): T["names"] {
    return arg.names;
}

// 推断类型: readonly ["Alice", "Bob", "Eve"]
// 这样就不需要 as const 了
const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"] });
```

但是会有个问题 如果约束的类型 是 `可变类型` 不会推导出具体类型

``` ts
declare function test1<const T extends string[]>(args:T):void{}

// 此处推到出来的 T 是 string[]
const res = test1(["a","b","c"])
```


const 修饰符只能影响直接写在函数调用中的对象、数组和原始表达式的推断
``` ts
declare function fnGood<const T extends readonly string[]>(args: T): void;

const arr = ["a", "b" ,"c"];
// T 仍然是 string[] -- const 修饰符在这里没有任何效果
fnGood(arr);
// T 是 readonly string ["a", "b" ,"c"]
fnGood(["a", "b" ,"c"]);
```

### 关系型运算符禁止隐式类型转换

``` ts
function func(ns: number | string) {
  return ns * 4; // 错误，可能存在隐式强制转换
}

// 5.0 之前不会报错
function func(ns: number | string) {
  return ns > 4;
}
// 
function func(ns: number | string) {
  return +ns > 4; // OK
}
```




##  4.9-beta

### satisfies

手动ts声明 时 会做类型检查

``` ts
type Obj = {
  a:number;
  b:number;
}

const obj:Obj = {
  a:1,
  // Error : Type 'string' is not assignable to type 'number'
  b:'2',
}
```

但也不是所有的变量都要手动声明类型，因为 ts 会做自动类型推导：

``` ts
const obj = {
  a:1,
  b:'bbbb',
  c:true
}

// 类型会推导出
const obj:{
  a:number;
  b:string;
  c:boolean;
}
```

同时会有类型提示和检查 , 同时推到的时候加上as const , 这样推导出的是字面量类型 但是会带有readonly的修饰

``` ts
const obj = {
  a:1,
  b:'aaa',
} as const ;

// 类型推导出
const obj :{
  readonly a:1;
  readonly b:'aaa';
}
```

如果自动推导出的是 b 属性是string 但其实也可能是一个number;

``` ts
const obj = {
  a:1,
  b:'bbbb',
  c:true;
}

// Type 'number' is not assignable to type 'string'
obj.b = 1;
```

这种情况我们只能去手动声明类型

``` ts
type obj = {
  a:number;
  b:string|number;
  c:boolean;
}
```

但是手动声明的类型也是有局限性的,
``` ts
type Obj = {
  a:number;
  b:string;
  [key:string]:any;
}

const obj:Obj = {
  a:1,b:'1',c:true,d:4
}

// 这个时候只有obj a obj b 有提示 obj.c是没有的
```

但它只会提示声明的索引，动态添加的那些是不会提示的
如果使用自动类型推导, 有些类型又不对 有需要手动改

在 4.9新增了一个语法 satisfies(/ˈsætɪsfaɪz/)

让你用自动推导出的类型，而不是声明的类型，增加灵活性，同时还可以对这个推导出的类型做类型检查，保证安全。

``` ts
type Obj = {
  a:number;
  b:string;
  [key:string]:any;
}

const obj = {
  a:1,
  b:'bb',
  cc:3,
  d:true
} satisfies Obj

```

但是这样就不能动态扩展了 比如 `obj.e==1` 这样会报错



## 4.7

### infer extends 

``` ts
type TestLast<Arr extends string[]> = Arr extends [...infer Rest,infer Last extends string] ? `最后一个是:${Last}` : never;

```