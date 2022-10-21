# Eslint





## 原理

lint 的实现是基于 AST，调用 rule 来做的检查。

fix 的实现就是字符串的替换，多个 fix 有冲突的话会循环多次修复。


## 流程

我们以下面的代码为例, 走一遍调试流程,看一下到底做了哪些操作.

``` js
const engine = new ESLint({
  fix: false
})

async function main() {
  const results = await engine.lintText(`
    function add (a, b) 
{
  return a + b
}
  `);

  console.log(results[0].output);
  const formatter = await engine.loadFormatter("stylish");
  const resultText = formatter.format(results);
  console.log(resultText);
}
```