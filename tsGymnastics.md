# typescript-gymnastics

前端圈流行一个名词“TS 体操”，简称为“TC”，体操这个词是从 Haskell 社区来的，本意就是高难度动作，关于“体操”能够实现到底多高难度的动作

## 几个Tips

### 结构化类型

```typescript
  // 下述代码，即使vector3D不是vector2D的子类，仍然不会报错， 因为Typescript不是通过继承来实现子类型，
  // 而是通过结构化来实现子类型， 即虽然vector3D不是vector2D的子类但是是其子类型。
  interface vector2D  {
    x:number;
    y:number;
  }

  interface vector3D  {
    x:number;
    y:number;
    z:number;
  }

  function calculateLength(v: vector2D) {
    return Math.sqrt(v.x + v.x + v.y * v.y);
  }

  const point = {x:1,y:2,z:3}
  // 会报错: 类型“{ x: number; y: number; z: number; }”的参数不能赋给类型“vector2D”的参数。对象文字可以只指定已知属性，并且“z”不在类型“vector2D”中。
  const result = calculateLength({x:1,y:2,z:3})
  const dist = calculateLength(point);
```

### 多余属性检查

当 TypeScript 在赋值中遇到对象字面量或作为参数传递给函数时，它会触发一个称为过度属性检查的操作。
与结构类型相反，它检查对象是否具有确切的属性。

```typescript
interface Point {
    x: number;
    y: number;
  }

  const point: Point = {
    x: 1,
    y: 2,
    // z:3  // 报错 多余的属性
  }
  // 绕过方法
  //  * 引入临时变量
  const temp = {
    x: 1,
    y: 2,
    z: 3
  }
  const demoPoint: Point = temp; // 不报错
  // 断言
  const demo2Point: Point = {
    x: 1, y: 2, z: 3
  } as Point
```

### 类型 值

TS中的一个符号可以属于type space或者 value space，也可以同时属于type space和value space
class和enum同时属于type space和value space 如下的左边的Cylinder是实例的类型，而右边的Cylinder是constructor

```typescript
class Cylinder {
  radius = 1;
  height = 1;
}
const instance: Cylinder = new Cylinder();
// typeof Cylinder并非是Cylinder类型，而InstanceType<typeof Cylinder>才是Cylinder类型
const instance: InstanceType<typeof Cylinder> = new Cylinder();
```

### 避免使用装箱类型(String, Number, Boolean, Symbol, BigInt)

```typescript
const a = new String('ss')
// 不能将类型“String”分配给类型“string”。“string”是基元，但“String”是包装器对象。
// const b:string = a; // 报错
const c: string = '123'
```

### 使用alias时保持一致

```typescript
interface Man {
  name?:string;
}
const obj:Man = {};
const name = obj.name;
// 虽然这里的name和obj.name是一致的但是，name并不受obj.name影响
// 当对变量进行narrowing时，并不会同步的对其alias进行narrowing
if (obj.name) {
  obj.name.toLocaleLowerCase();
  // 对象可能为“未定义”
  // name.toLocaleLowerCase();
  name?.toLocaleLowerCase();
}
```

### extends 

如果用于简单的条件判断，则是直接判断前面的类型是否可分配给后面的类型
若extends前面的类型是泛型，且泛型传入的是联合类型时，则会依次判断该联合类型的所有子类型是否可分配给extends后面的类型（是一个分发的过程）。

```typescript
// A1 = 2
type A1 = 'x' | 'y' extends 'x' ? 1 : 2;
// A2 = 1 | 2
type P<T> = T extends 'x' ? 1: 2;
type A2 = P<'x' | 'y'>
```

阻止extends关键词对于联合类型的分发特性

```typescript
type P<T> = [T] extends ['x'] ? : 1: 2;
// A3 = 2
type A3 = P<'x'|'y'>
```

### 可赋值 (协变, 逆变, 双向协变)

集合论中，如果一个集合的所有元素在集合B中都存在，则A是B的子集；
类型系统中，如果一个类型的属性更具体，则该类型是子类型。（因为属性更少则说明该类型约束的更宽泛，是父类型）

```typescript
type A = 1 | 2 | 3;
type B = 2 | 3;
let aa: A = 1;
let bb: B = 2;

// 不可以赋值
// bb = aa;
// 可以赋值
aa = bb;
```

```typescript
interface Animal {
  name:string;
}
interface Dog extends {
  run():void;
}

let a: Animal = { name: 'a' };
let b: Dog = { name: '', run() { } }
// 子类型更具体，可以赋值给更宽泛的父类型
a = b;
// 反过来不行
// b = a; // error
```

#### 协变

协变与逆变(Covariance and contravariance )是在计算机科学中，描述具有父/子型别关系的多个型别通过型别构造器、构造出的多个复杂型别之间是否有父/子型别关系的用语。
简单说就是，具有父子关系的多个类型，在通过某种构造关系构造成的新的类型，如果还具有父子关系则是协变的，而关系逆转了（子变父，父变子）就是逆变的。

```typescript
interface Animal {
  name:string;
}
interface Dog extends {
  run():void;
}

let Eg1: Animal = { name: 'a' };
let Eg2: Dog = { name: '', run() { } }
Eg1 = Eg2

let Eg3: Array<Animal> = [Eg1]
let Eg4: Array<Dog> = [Eg2]

Eg3 = Eg4
// 通过Eg3和Eg4来看，在Animal和Dog在变成数组后，Array<Dog>依旧可以赋值给Array<Animal>，因此对于type MakeArray = Array<any>来说就是协变的。
```

#### 逆变

```typescript
type AnimalFn = (arg: Animal) => void;
type DogFn = (arg: Dog) => void;

let Eg5: AnimalFn = (Eg1) => {}
let Eg6: DogFn = (Eg2) => {}

// 不再可以赋值了，
// AnimalFn = DogFn不可以赋值了, Animal = Dog是可以的
// Eg5 = Eg6;
// 反过来可以
Eg6 = Eg5;
```

理论上，Animal = Dog是类型安全的，那么 `AnimalFn = DogFn` 也应该类型安全才对。

Animal和Dog在进行 `type Fn<T> = (arg: T) => void` 构造器构造后，父子关系逆转了，此时成为“逆变”。

#### 复杂一点 

```typescript
interface Animal {
  name: string;
}
interface Dog extends Animal {
  run(): void;
}
interface GreyHound extends Dog {
  eat(): void;
}

let animal = { name: 'animal' }
let dog = { name: 'dog', run() { } }
let greyHound = { name: 'greyHound', run() { }, eat() { } }

// 子类型 可以 赋值给夫类型
// animal =  dog;
// animal = greyHound;
// dog = greyHound;

type AA = (arg:Animal) => Animal;
type AD = (arg:Animal) => Dog;
type AG = (arg:Animal) => GreyHound;
type DD = (arg:Dog) => Dog;
type DA = (arg:Dog) => Animal;
type DG = (arg:Dog) => GreyHound;
type GG = (arg:GreyHound) => GreyHound;
type GA = (arg:GreyHound) => Animal;
type GD = (arg:GreyHound) => Dog;

// 思考一下 哪些可以赋值给哪些 
```

#### 双向协变（既是协变又是逆变的）

Ts在函数参数的比较中实际上默认采取的策略是双向协变：只有当源函数参数能够赋值给目标函数或者反过来时才能赋值成功。
这是不稳定的，因为调用者可能传入了一个具有更精确类型信息的函数，但是调用这个传入的函数的时候却使用了不是那么精确的类型信息（典型的就是上述的逆变）。

```typescript
// lib.dom.d.ts中EventListener的接口定义
interface EventListener {
  (evt: Event): void;
}
// 简化后的Event
interface Event {
  readonly target: EventTarget | null;
  preventDefault(): void;
}
// 简化合并后的MouseEvent
interface MouseEvent extends Event {
  readonly x: number;
  readonly y: number;
}

// 简化后的Window接口
interface Window {
  // 简化后的addEventListener
  addEventListener(type: string, listener: EventListener)
}

// 日常使用
window.addEventListener('click', (e: Event) => {});
window.addEventListener('mouseover', (e: MouseEvent) => {});
```

Window的listener函数要求参数是Event，但是日常使用时更多时候传入的是Event子类型。但是这里可以正常使用，正是其默认行为是双向协变的原因。

### 同态与非同态

Partial Readonly Pick 都属于同态的， 即其实现需要输入类型 T 来拷贝属性 因此属性修饰符 都会被拷贝
Record是非同态的 不需要拷贝属性 因此不会拷贝属性修饰符

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
}

type _ReadOnly<T> = {
  readonly [P in keyof T]: T[P]
}

type _Pick<T, U extends keyof T> = {
  [P in U]?: T[P]
}

type _Record<T extends keyof any, K> = {
  [P in T]: K;
}

```

当遇到了提取某个类型中所有可选类型的key时 可以遇到，
或者提取某个类型中所有只类型时用得到。

## 基础操作

### 条件判断

```typescript
// extends 关键字是用于判断 A 是否是 B 类型的。例子中传入的类型参数 T 是 1，是 number 类型，所以最终返回的是 true。
type isNumber<T> = T extends number ? true : false;
type isNumberRes = isNumber<1>; // true
```

### 递归(循环)

```typescript
// 我们要构造一个长度为 n 的数组，那么就要传入长度的类型参数 Len、元素的类型参数 Ele、以及构造出的数组的类型参数 Arr（用于递归）。
// 然后类型计算逻辑就是判断 Arr 的 length 是否是 Len，如果是的话，就返回构造出的 Arr，不是的话就往其中添加一个元素继续构造。
type createArray<Len, Ele, Arr extends Ele[] = []> = Arr['length'] extends Len ? Arr : createArray<Len, Ele, [Ele, ...Arr]>;
type createArrayRes = createArray<3, 'a'>
```

### infer

表示 在 extends 条件语句中待推断的类型变量。

infer关键词作用是让Ts自己推导类型，并将推导结果存储在其参数绑定的类型上
infer关键词只能在extends条件类型上使用，不能在其他地方使用。

```typescript
type ParamType<T> = T extends (...args: infer P) => any ? P : T;
interface User {
  name: string;
  age: number;
}
type Func = (user: User, age: number) => void;
// [user: User, age: number]
type Param = ParamType<Func>;
```

#### 重点

infer推导的名称相同并且都处于逆变的位置，则推导的结果将会是交叉类型。

```typescript
type Bar<T> = T extends {
  a: (x: infer U) => void;
  b: (x: infer U) => void;
} ? U : never;

// type T1 = string
type T1 = Bar<{ a: (x: string) => void; b: (x: string) => void }>;

// type T2 = never
type T2 = Bar<{ a: (x: string) => void; b: (x: number) => void }>;

```

infer推导的名称相同并且都处于协变的位置，则推导的结果将会是联合类型。

```typescript
type Foo<T> = T extends {
  a: infer U;
  b: infer U;
} ? U : never;

// type T3 = string
type T3 = Foo<{ a: string; b: string }>;

// type T4 = string | number
type T4 = Foo<{ a: string; b: number }>;
```

## 正式开始'体操'

### Add

``` typescript
type Add<A extends number, B extends number> = [...createArray<A, 1>, ...createArray<B, 2>]['length']
type sum = Add<3, 4>
```

### RepeatStr
``` typescript
type RepeatStr<Str extends string, Count, Arr extends Str[] = [], ResStr extends string = ''> = Arr['length'] extends Count ? ResStr : RepeatStr<Str, Count, [Str, ...Arr], `${Str}${ResStr}`>
type repeatResult = RepeatStr<'asd', 10>
```

### tuple 转 union

```typescript
// 在一定特定条件下 元组 是可以赋值给数组类型的
type TTuple = [string, number];
type TArray = Array<string | number>;
type Res = TTuple extends TArray ? true : false; // true
// 配合infer
type ElementOf<T> = T extends Array<infer E> ? E :never;
type tuple = [string,number];
type ToUnion = ElementOf<tuple>

// 简单的写法
type TTuple1 = [string, number];
type Res1 = TTuple1[number]; // string | number
```

### 增强型Pick

我们知道pick是通过key提取的，如果我们想提指定值的类型呢

```typescript
type PickByValue<T,V> = Pick<T,
  {
    [P in keyof T]: T[P] extends V ? P :never 
  }[keyof T]
>
// [keyof T] 可以将{} 遍历转化成联合类型
```

由于TS的类型兼容特性，类似string是可以分配给string | number的，因此上述并不是精准的提取方式。

```typescript
type PickByValueExact<T, V> = Pick<T,
  TypeKeys<{ [P in keyof T]: [T[P]] extends [V]
    ? ([V] extends [T[P]] ? P : never)
    : never;
  }>
>
```

我们做了两次extends, 就可以精确的拿到指定的类型

### Equal

如何判断两个类型是否相同？似乎按上一个类型的做法，就可以做到

```typescript
type Equals<X,Y> = X extends Y ? Y extends X ? true : false : false;

type T1 = { key1: string };
type T2 = { readonly key1: string };
type T3 = { key1?: string };

//  A1 = true
type A1 = Equals<T1,T2>
// A2 = false
type A2 = Equals<T2,T3>
```

是不是发现不对劲了，对于readonly修饰符就无法控制

```typescript
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false

//  A1 = false
type A1 = Equals<T1,T2>
```

这是利用了Ts编译器的一个特点，编译器只会在 X 和 Y（仅用于 的约束中T）相同（包括它们的readonly属性）时才认为这两个泛型函数相同

### MutableKeys<T>查找T所有非只读类型的key组成的联合类型。

``` typescript
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
// MutableKeys首先约束T为object类型
// 通过映射类型[P in keyof T]进行遍历，key对应的值则是IfEquals<类型1, 类型2, P>，如果类型1和类型2相等则返回对应的P（也就是key），否则返回never。
// 如果P是只读的，那么参数1和参数2的P最终都是只读的；如果P是非只读的，则参数1的P为非只读的，而参数2的P被-readonly去掉了非只读属性从而变成了只读属性。
// 因此就完成了筛选：P为非只读时IfEquals返回的P，P为只读时IfEquals返回never。
type MutableKeys<T extends object> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >
}[keyof T]
```

### OptionalKeys<T>提取T中所有可选类型的key组成的联合类型。

```typescript
type optionalKeys<T> = {
  // 利用了同态拷贝会拷贝可选修饰符的特性。
  // 利用{} extends {当前key: 类型}判断是否是可选类型。
  [P in keyof T]: {} extends Pick<T, P> ? P : never;
}[keyof T]
```

### DeepReadonly
我们知道自带的 ReadOnly 是只对第一层做只读,对于深层次的没有办法 
`DeepReadonlyArray<T>`将T的转换成只读的，如果T为object则将所有的key转换为只读的，如果T为数组则将数组转换成只读数组。整个过程是深度递归的。

```typescript
// _DeepReadonlyArray 构造一个只读数组
interface _DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> { }
// _DeepReadonlyObject 构造一个只读对象
type _DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}
// DeepReadonlyArray<T>将T的转换成只读的，如果T为object则将所有的key转换为只读的，如果T为数组则将数组转换成只读数组。整个过程是深度递归的。
type DeepReadonly<T> = T extends ((...args: any[]) => any) | Primitive
  ? T
  : T extends _DeepReadonlyArray<infer U>
  ? _DeepReadonlyArray<U>
  : T extends _DeepRequiredObject<infer V>
  ? _DeepReadonlyObject<V>
  : T
```


## 最后

篇幅有限，只聊了一些简单的操作。

像看更深一点的操作,可以去看下[TS象棋](https://github.com/type-challenges/type-challenges/blob/master/README.zh-CN.md)这些。

如果想挑战一下TS体操的题目，可以去[挑战一下](https://github.com/type-challenges/type-challenges/blob/master/README.zh-CN.md) 