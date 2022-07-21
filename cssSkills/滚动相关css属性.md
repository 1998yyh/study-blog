# 滚动属性

## Scroll Snap

CSS Scroll Snap是 CSS 的一个模块，它引入了滚动捕捉位置，它强制滚动容器的滚动端口在滚动操作完成后可能结束的滚动位置。

### scroll-snap-type

其告诉浏览器它应该考虑将此滚动容器捕捉到其后代产生的捕捉位置。

属性包括告诉滚动发生的轴: `x` , `y` , `both`

以及捕捉的严格性: `mandatory` 和 `proximity`

`mandatory` : 当滚动动作结束，滚动偏移将被调整为保持静止在临时点上。

`proximity` : 当用户滚动到特定部分的中间时，它不会干扰，但当他们滚动到足够近时，它也会捕捉并引起对新部分的注意。

直接看DEMO:

<iframe height="350" style="width: 100%; " scrolling="no" title="scroll-demo1" src="https://codepen.io/WFFMLOVE/embed/JjMGjmw?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/JjMGjmw">
  scroll-demo1</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### scroll-padding

可用于调整滚动容器或 snapport 的有效可视区域，在计算滚动对齐对齐时使用。该属性针对滚动容器的填充框定义了一个插图。在我们的示例中，15vh顶部添加了额外的插图，指示浏览器15vh将滚动容器顶部边缘下方的较低位置视为滚动捕捉的垂直起始边缘。捕捉时，捕捉目标元素的起始边缘将与这个新位置齐平，从而在上方留出空间。

用法与padding等类似，上右下左四个方向。

<iframe height="300" style="width: 100%; " scrolling="no" title="scroll-demo2" src="https://codepen.io/WFFMLOVE/embed/KKZVEGW?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/KKZVEGW">
  scroll-demo2</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### scroll-margin

设置元素的所有滚动边距，分配值与该属性为元素的边距所做的非常相似。

<iframe height="300" style="width: 100%; " scrolling="no" title="scroll-demo3" src="https://codepen.io/WFFMLOVE/embed/LYeGaoq?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/LYeGaoq">
  scroll-demo3</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

我们会注意到这两个属性中 没有 `snap` 一词，这是故意的，因为他们实际上修改了所有滚动相关的框，而不仅仅是滚动捕捉。

比如scrollIntoView() 操作的滚动量会考虑它们

## scroll-behavior

当滚动由导航或 CSSOM 滚动 API 触发时， CSS属性设置滚动框的行为。scroll-behavior

`auto` : 滚动框立即滚动。
`smooth` : 滚动框使用用户代理定义的计时功能在用户代理定义的时间段内以平滑的方式滚动。用户代理应该遵循平台约定，如果有的话。

这个属性也可以在scroll的API中第三个参数 `options` 中设置。

## 滚动条属性

```css
/* 滚动条整体部分，可以设置宽度啥的 */
::-webkit-scrollbar {}

/* 滚动条两端的按钮 */
::-webkit-scrollbar-button {}

/* 外层轨道 */
::-webkit-scrollbar-track {}

/* 内层滚动槽 */
::-webkit-scrollbar-track-piece {}

/* 滚动的滑块 */
::-webkit-scrollbar-thumb {}

/* 边角 */
::-webkit-scrollbar-corner {}

/* 定义右下角拖动块的样式 */
::-webkit-resizer {}
```

## scrollbar-gutter

CSS属性允许作者为滚动条保留空间，防止在内容增长时不必要的布局更改，同时在不需要滚动时避免不必要的视觉效果。

元素的滚动条间距是内部边框边缘和外部填充边缘之间的空间，浏览器可以在此处显示滚动条。如果不存在滚动条，则 gutter 将被绘制为 padding 的扩展。

浏览器决定是使用经典滚动条还是覆盖滚动条：

1. 经典滚动条总是放置在一个排水沟中，当存在时会占用空间。

2. 覆盖滚动条放置在内容之上，而不是在装订线中，并且通常是部分透明的。

`auto` : 初始值。overflow经典滚动条会在isscroll或当overflowisauto并且盒子溢出时创建一个装订线。覆盖滚动条不占用空间。

`stable` : 使用经典滚动条时，如果overflow是auto、scroll或hidden即使框没有溢出，也会出现装订线。使用覆盖滚动条时，将不存在装订线。

`both-edges` : 如果一个装订线出现在盒子的内联开始/结束边缘之一，另一个也将出现在相对边缘。

这个属性是去处理windows系统下，滚动条出现消失产生的抖动问题。

## 




## 滚动结合background vola