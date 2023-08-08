# satisfies

## 如何分配类型


当我们使用冒号注释的时候，就意味着分配给变量的内容就是该类型

``` ts
const str:string = 123;
```

当我们有一个默认值 并且稍后课呢功能进行重新分配的时候， 可以指定一个更宽的类型


``` ts
let id: number|string = '1';

id = 123;
```

但是使用冒号有一个缺点， 就是类型 > 值

``` ts
const routes: Record<string, {}> = {
  "/": {},
  "/users": {},
  "/admin/users": {},
};

// 当我们使用 是不会报错的 
console.log(routes.asddasd)
```

但如果我们使用 satisfies ， 则是值 > 类型

``` ts
const routes = {
  "/": {},
  "/users": {},
  "/admin/users": {},
} satisfies Record<string, {}>;

// Property 'awdkjanwdkjn' does not exist on type
// '{ "/": {}; "/users": {}; "/admin/users": {}; }'
routes.awdkjanwdkjn;

```



## 用处

1. 采用宽松类型的强类型函数 

比如我们使用`URLSearchParams`它通常采用 `Record<string, string>`作为其参数。这是一种非常宽松的类型，不强制执行任何特定的键。

缺少内容我们所需要的内容也不会报错 ，这时候就需要我们用 satisfies
``` ts
type GHIssueURLParams = {
  title: string;
  body: string;
};

// Type '{ title: string; }' does not satisfy the expected type 'GHIssueURLParams'.
// Property 'body' is missing in type '{ title: string; }' but required in type 'GHIssueURLParams'.
const params = new URLSearchParams({
  title: "New Issue",
} satisfies GHIssueURLParams )
```


2. 推断元组

``` ts
type MoreThanOneMember = [any, ...any[]];

const array = [1, 2, 3];
//    ^?
const maybeExists = array[3];
//    ^?
const tuple = [1, 2, 3] satisfies MoreThanOneMember;
//    ^?
const doesNotExist = tuple[3];
```

在上面的代码中，我们用两种不同的方式声明一个数组。如果我们不用 注释它satisfies，它就会被推断为number[]。这意味着当我们尝试访问其上不存在的元素时，TypeScript 不会给我们错误；它只是将其推断为number | undefined.

但是，当我们tuple使用satisfies运算符进行声明时，它会将类型推断为包含三个元素的元组。现在，当我们尝试使用 访问第四个元素时tuple[3]，TypeScript 会正确地给出错误，因为索引超出范围。


