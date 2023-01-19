# 新语法

## satisfies 4.9-beta

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