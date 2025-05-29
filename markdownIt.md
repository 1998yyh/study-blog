# markdownIt

markdown-it是一个 markdown 解析器，并且易于拓展。

这是它的一个解析地址，可以直接输出token

[https://markdown-it.github.io/](https://markdown-it.github.io/)

这是 markdown的规范
[https://spec.commonmark.org/0.30/#blocks-and-inlines](https://spec.commonmark.org/0.30/#blocks-and-inlines)

markdown-it 整体过程主要分为两步，

1. Parse：将 Markdown 文件 Parse 为 Tokens
2. Render：将 Tokens 渲染为 HTML

跟 Babel 很像，不过 Babel 是转换为抽象语法树（AST），而 markdown-it 没有选择使用 AST，主要是为了遵循 KISS(Keep It Simple, Stupid) 原则。

## parse

```js
var _rules = [
  ["normalize", require("./rules_core/normalize")],
  ["block", require("./rules_core/block")],
  ["inline", require("./rules_core/inline")],
  ["linkify", require("./rules_core/linkify")],
  ["replacements", require("./rules_core/replacements")],
  ["smartquotes", require("./rules_core/smartquotes")],
];

function Core() {
  // ...
}

Core.prototype.process = function (state) {
  // ...
  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
};
```

1. normalize 规则主要是对文本进行规范化处理，比如将连续的空格替换为一个空格，将换行符替换为 \n 等 [参考](https://www.ruanyifeng.com/blog/2006/04/post_213.html)
2. 找出block 生成 tokens
3. 找出inline 生成 tokens
4. linkify 识别连接
5. replacements 替换一些字符
6. smartquotes 为了方便印刷，对直引号做了处理：

## render 过程

内置了一些rules

```js
default_rules.code_inline;
default_rules.code_block;
default_rules.fence;
default_rules.image;
default_rules.hardbreak;
default_rules.softbreak;
default_rules.text;
default_rules.html_block;
default_rules.html_inline;
```

其实这些名字也是 token 的 type，在遍历 token 的时候根据 token 的 type 对应这里的 rules 进行执行，我们看下 code_inline 规则的内容，其实非常简单：

```js
default_rules.code_inline = function (tokens, idx, options, env, slf) {
  var token = tokens[idx];

  return (
    "<code" +
    slf.renderAttrs(token) +
    ">" +
    escapeHtml(tokens[idx].content) +
    "</code>"
  );
};
```

我们可以在 `block`,`inline`,`core` 中自定义规则 并且可以指定插入顺序`before`,`after`,`at`,`disable`,`enable` 等

## demo

比如我们有个`12345 \n {input}(12345)` 这种的 要渲染成 input 标签

```js
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

// md提供的方法 ，替换数组中的元素
const arrayReplaceAt = md.utils.arrayReplaceAt;

// 向markdown-it中添加一个自定义规则
md.core.ruler.push("myInput", function (state) {
  // 获取所有的tokens
  let blockTokens = state.tokens;
  // 遍历所有的tokens
  let i = 0;
  let j = blockTokens.length;
  let tokens;

  while (i < j) {
    // 如果不是inline类型的tokens，跳过
    if (blockTokens[i].type !== "inline") {
      i++;
      continue;
    }
    // 遍历inline类型的tokens的children
    tokens = blockTokens[i].children;
    let k = tokens.length - 1;
    while (k >= 0) {
      const token = tokens[k];
      // 如果是input类型的tokens，替换成input标签
      tokens = arrayReplaceAt(tokens, k, splitTextToken(token, state.Token));
      blockTokens[i].children = tokens;
      k--;
    }
    i++;
  }
});

const splitTextToken = function (original, Token) {
  const text = original.content;

  // 使用正则表达式匹配
  const regex = /{([^}]+)}\(([^)]+)\)/;
  const match = text.match(regex);
  let label = "";
  let value = "";

  // 匹配到
  if (match) {
    // 修改tokens
    label = match[1];
    value = match[2];
    // new Token 第一个自定义名字 第二个tag类型 第三个 0 自闭合标签 1 开标签 -1 闭合标签
    const token = new Token("input_open", "input", 0);
    token.attrs = [
      ["type", "text"],
      ["id", "xyInput"],
      ["value", value],
      ["onchange", "aabb()"],
    ];

    const beforeKey = text.slice(0, match.index);
    const afterKey = text.slice(match.index + match[0].length);

    const beforeToken = new Token("text", "div", 0);
    beforeToken.content = beforeKey;

    const afterToken = new Token("text", "", 0);
    afterToken.content = afterKey;

    return [beforeToken, token, afterToken];
  } else {
    // 直接返回原tokens
    return original;
  }
};
```
