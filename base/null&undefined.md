# null & undefined

在 JavaScript 中，空数据类型和未定义的数据类型在抽象级别上可能看起来很相似。 因此，开发人员在调试与这两个值相关的错误时通常需要澄清和帮助。

## null

我们常常将null赋值给变量， 以表示该变量已声明初始化，并且当前不包含任何值。尽管如此，未来仍可预期价值。



## undefined

undefined 是 JavaScript 自动分配的一个原始值，用于指示无意中缺少任何对象值。

#### JavaScript 分配值未定义

1. 对于已声明但未初始化的变量。
2. 程序员声明变量时没有将其初始化为任何值（甚至不是null）。
3. 对象的不存在的属性
4. 未明确定义的函数的返回值。
5. 没有实际参数的函数的形式参数。
6. 超出范围的数组元素


## 相似之处 

1. 两者都没有值
2. 两者都是原始JavaScript 值，这意味着它们不被视为对象，因此没有方法或属性。
3. 当在布尔上下文中遇到时，两者都是false
4. 尽管两者在布尔上下文中都是假的，但null或undefined并不松散地等于(==)任何其他假值，例如零(0)、空字符串(“”、“”)或非数字(NaN)

## 不同

1. 默认情况下，JavaScript 总是分配undefined来指示不存在值，并且它永远不会自动分配null作为值。仅当程序员或 API 专门将null值赋给变量时，该变量才会返回null。

2. 在数字上下文中，undefined被评估为NaN，而null被评估为0。
3. 尽管null和undefined松散相等，但它们并不严格相等。
4. 尽管由于发生了历史错误， null和undefined都是 JavaScript 中的原始值，但 typeof(null) 返回“object”。另一方面，typeof(undefined)是“未定义”。