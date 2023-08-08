# Type Or Interface

常常遇到的一个问题 interface 和 type 有什么区别



1. interface不能表达联合、映射类型或条件类型。type可以表示任何类型。

``` ts
type a = b | c;

type TypeName<Type> = {
  [Property in keyof Type]: boolean;
};

type isTwo<T> = T extends 2 ? true: false;

```
2. interface可以使用extends，类型不能。
3. 当您使用相互继承的对象时，请使用interface。extends使 TypeScript 的类型检查器运行速度比使用&.
``` ts
- type Foo = Bar & Baz & {
-     someProp: string;
- }

+ interface Foo extends Bar, Baz {
+     someProp: string;
+ }

```
4. 同一范围内具有相同名称的interface合并其声明，从而导致意外的错误。

``` ts
interface User {
  name: string;
}
 
interface User {
  id: string;
}
 
const user: User = {
Property 'name' is missing in type '{ id: string; }' but required in type 'User'.
  id: "123",
};
```
5. type有一个隐式索引签名Record<PropertyKey, unknown>，偶尔会出现。
```ts
interface KnownAttributes {
  x: number;
  y: number;
}
 
const knownAttributes: KnownAttributes = {
  x: 1,
  y: 2,
};
 
type RecordType = Record<string, number>;
 
const oi: RecordType = knownAttributes;
```

此错误的原因是interface稍后可以扩展。string它可能添加了与 的键或值不匹配的属性number。

可以通过向界面添加显式索引签名来解决此问题：

``` ts
interface KnownAttributes {
  x: number;
  y: number;
  [index: string]: unknown; // new!
}
```