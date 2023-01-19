# 列表的单列排序

做一个表格的单列排序 约定只能有一个排序选项 `'desc'` | `'asc'` , 其他的都是 `false`

例如:

```ts
type tableSort = {
  createTime?:false | 'desc' | 'asc';
  dataLength?:false | 'desc' | 'asc';
  indexLength?:false | 'desc' | 'asc';
  tableRows?:false | 'desc' | 'asc';
}

```

第一种方法是枚举所有情况

``` ts
type test = {
  aaa:'desc' | 'asc',
  bbb:false,
  ccc:false,
  ddd:false
} | {
  aaa:false,
  bbb:'desc' | 'asc',
  ccc:false,
  ddd:false
} ... 

```

这确实能解决问题,但是如果我们再加几个属性 就需要增加很多

这个时候就需要类型编程动态生成了.

``` ts
type GenerateType<Keys extends string> = {
  [Key in Keys]:{
    [Key2 in Key]:'desc' | 'asc'
  }
}

```