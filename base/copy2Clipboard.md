# copy text to the clipboard

复制一段文本去剪切板

## document.execCommand

这个api的问题是 你要选中要复制的内容

``` js
textarea.select();

document.execCommand('copy', true);
```

实际开发通常使用的是 创建一个隐藏的输入框, 赋值 选中 然后复制

``` js
// 创建输入框
var textarea = document.createElement('textarea');
document.body.appendChild(textarea);
// 隐藏此输入框
textarea.style.position = 'absolute';
textarea.style.clip = 'rect(0 0 0 0)';
// 赋值
textarea.value = '复制的文本内容...';
// 选中
textarea.select();
// 复制
document.execCommand('copy', true);
```

### 可能存在的问题

1. 滚动问题

如果选中的时候 输入框不在视图中的时候 有的手机可能会滚动到视图中,我们可以定位到视图中 解决这个问题

2. 性能隐患

如果复制的内容过长的话,可能会引起卡顿,因为他是一个同步方法,必须等复制操作完之后才能

3. 无法修改复制内容

使用 execCommand() 方法复制的文字内容，是无法进行修改与替换的，这其实是不友好的，因为对复制或拖拽的本文内容进行处理还是比较常见的。

正是由于以上一些限制，execCommand() 已经是不推荐的使用的方法，业界推荐使用全新的 Clipboard API。

## Clipboard API

``` js
if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
}
```

但是兼容性不太行,需要和普通方法整合一下

### 封装

```js
var text = '被复制的内容，啦啦啦~';
if (navigator.clipboard) {
    // clipboard api 复制
    navigator.clipboard.writeText(text);
} else {
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    // 隐藏此输入框
    textarea.style.position = 'fixed';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.style.top = '10px';
    // 赋值
    textarea.value = text;
    // 选中
    textarea.select();
    // 复制
    document.execCommand('copy', true);
    // 移除输入框
    document.body.removeChild(textarea);
}
```


这套代码我在iphone12 上复制失败了 不知道是什么原因 最后使用的是开源库


## clipboard.js

但是这个库的应用场景大多数为 点击指定类名按钮 然后进行复制其内容或者一个属性的值.

已经对项目本身侵入了 感觉体验并不是很好,

比如我有一个已经封装好的弹框,我只穿入按钮的名字 而不是一个html 所以无法去控制按钮的类名和属性 

如果强行去添加 只能通过dom选择器去修改


