# 2023 CSS汇总

包括一些新的特性以及旧的属性的新用法

## 新特性

### 1. 三角函数

在 CSS 中，可以编写数学表达式。 calc() 函数用于执行计算， min()、max() 和 clamp()进行比较。

Chrome 111 增加了对三角函数 sin()、cos()、tan()、asin()、acos()、atan() 和 atan2() 的支持，使其适用于所有主流引擎。

+ cos()：返回角度的余弦值，该值介于 -1 和 1 之间。
+ sin()：返回角度的正弦值，该值介于 -1 和 1 之间。
+ tan()：返回角度的正切值，取值介于 −∞ 和 +∞ 之间。


```css
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: true;
}

:root {
  --radius: 20vmin;
}

.dot {
  --angle: 30deg;
  translate: /* Translation on X-axis */
  calc(cos(var(--angle)) * var(--radius))
  /* Translation on Y-axis */
  calc(sin(var(--angle)) * var(--radius) * -1)
  ;
}
```



+ atan2() 函数计算从一个点与另一个点的相对角度。该函数接受两个以英文逗号分隔的值作为其参数：另一点的 y 和 x 位置（相对于位于起点 0,0 的起点）。(对边比斜边)

<iframe height="500" style="width: 100%;" scrolling="no" title="CSS Trigonometric Functions: atan2()" src="https://codepen.io/web-dot-dev/embed/dyqGpQV?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/web-dot-dev/pen/dyqGpQV">
  CSS Trigonometric Functions: atan2()</a> by web.dev (<a href="https://codepen.io/web-dot-dev">@web-dot-dev</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


### 2.n-*选择器

默认情况下，:nth-*() 伪代码会考虑所有子元素。

```html
<ul>
  <li></li>
  <li class="a"></li>
  <li class="a"></li>
  <li class="b"></li>
  <li class="b"></li>
  <li></li>
  <li></li>
  <li class="b"></li>
  <li class="a"></li>
  <li class="b"></li>
  <li class="a"></li>
  <li></li>
</ul>
```

比如我们要获取`.a`的偶数列去修改颜色 通过`.a:nth-child(2n)`时无法获取到的，

从 Chrome 111 开始， 可以通过 `of .a`来进行过滤 `li:nth-child(2n of .a)`

### 3.scope

Chrome 118 增加了对 @scope 的支持，即作用域

``` css
.text{
  color: red;
}

@scope(.a){
  .text{
    color:blue;
  }
}
```


也可以设置边界

第二个选择器设置一个下边界——即从这一点停止样式。

```html
<style>
  @scope (.component) to (.content) {
    p {
      color: red;
    }
  }
</style>
<div class="component">
  <p>In scope.</p>
  <div class="content">
    <p>Out of scope.</p>
  </div>
</div>
```



### 4.嵌套

``` css
 .a{
  .b{
    .c{
      color: green;
    }
  }
}
```


### 5. subgrid 

非常适合用来根据彼此的动态内容对齐同级，比如我们有三段内容不一的块，它们的样式保持一致

使用前
![](https://pic.imgdb.cn/item/657a7bcfc458853aef4e9804.jpg)

使用后
![](https://pic.imgdb.cn/item/657a7bcfc458853aef4e9804.jpg)

代码如下
```css
article {
  display: grid;
  gap: 2ch;
  grid-row: span 4;
  grid-template-rows: subgrid;
  margin-inline: 5vmin;
  margin-block: 7.5vmin;
}
```


### 6.text-wrap
作为开发者，不知道标题或段落的最终大小、字体大小，甚至是语言。有效且美观处理文本换行所需的所有变量均在浏览器中提供。由于浏览器了解所有因素（例如字体大小、语言和分配区域），因此非常适合用于处理高级、优质文本布局。

这就需要我们采用两种新的文本换行技术，一种称为 balance，另一种称为 pretty。balance 值旨在创建一个和谐的文本块，而 pretty 旨在防止孤立字符并确保健康的断字。


![](https://pic.imgdb.cn/item/657a7d61c458853aef547efc.jpg)

### 7.initial-letter

一个针对首字母的处理的属性

`initial-letter:normal | <number> <interger> ` 如果没有设置 interger 会使用number的值

number: 定义首字母的大小，以它占用的行数为单位，
integer: 定义首字母下沉的行数。

``` css
div:first-letter{
  initial-letter: normal;
  initial-letter: 1 1;
}
```

### 8.color-mix 

颜色混合 

`color-mix(method, color1[ p1], color2[ p2])`

```css
div{
  background:color-mix(in rgba, red 10%,blue 90%)
}
```

### 9.更多的颜色函数

我们日常使用的是 RGB,RGBA,HSL

lch() lab() oklch() oklab() 


### 10.调整容器大小

容器查询支持查询网页中父元素，而不是使用视口的全局尺寸信息来应用 CSS 样式。这意味着，您可以在多个布局和多个视图中为组件设置动态样式。

首先我们需要声明 `container`,type表示查询的容器维度，值可以有`size`,`inline-size`,`normal`

``` css
.post{
  container: sidebar / inline-size;
  container-type: inline-size;
  container-name: sidebar;
}
```

`@container (width>=400px)` 使用方式媒体查询一致

``` html
<style>
  .post {
    container-type: inline-size;
  }
  /* Default heading styles for the card title */
  .card h2 {
    font-size: 1em;
  }

  /* If the container is larger than 700px */
  @container (min-width: 700px) {
    .card h2 {
      font-size: 2em;
    }
  }
</style>

<body>
  <div class="post">
    <div class="card">
      <h2>Card title</h2>
      <p>Card content</p>
    </div>
  </div>
</body>
```


### 11.容器的自定义属性查询

``` html
<style>
  @container style(--rain: true) {
  .weather-card {
    background: linear-gradient(140deg, #5dc3ff, #31debd);
  }
}
</style>

<li class="card-container" style="--rain: true;">
  <div class="weather-card">
    <div class="day">Thursday</div>
    <div class="date">Dec <span>9</span></div>
    <div class="temps">
      <div class="high">High: <span>52</span></div>/
      <div class="low">Low: <span>43</span></div>
    </div>
    <div class="features">
      Afternoon showers
    </div>
  </div>
</li>
```

目前只支持自定义属性，在未来版本的实现中，您将能够查询值的范围（例如 style(60 <= --weather <= 70)）和根据属性-值对（例如 style(font-style: italic)）来确定应用的样式。


### 12.:has() 选择器

父级选择器概念很早就被提出，但是一致没有落实。在Chrom105中 增加了此选择器

:has() CSS 伪类代表一个元素，其给定的选择器参数（相对于该元素的 :scope）至少匹配一个元素。

使用:has()使我们能够“展望”CSS并设置父元素或祖先元素的样式。然后，我们可以将选择器扩展到一个或多个兄弟姐妹或子对象。通过考虑元素的状态或位置，我们可以将几乎任何元素组合样式化为唯一的单个或范围。


+ .wrap:has( p) 表示,我们选择的容器包含p标签
+ .wrap:has(> .a) 表示,我们选择的容器的直接后代是.a元素
+ li:has(+ .hide) 表示,我们选择的li是后面紧跟着.hide的li
+ li:has(~ .hide) 表示,我们选择的li是兄弟元素包含.hide的li
+ img:not(h1 + *) 表示，我们选择的图像不直接跟随h1。
+ p:is(h2 + *) 表示，我们只选择直接跟随h2的段落。



### 13. 媒体查询设备刷新率

我们大部分的设备拥有较高的刷新率,但是还存在一些低刷新率的设备。

电子阅读器以及低能耗付款系统等设备的刷新率可能较慢。设备无法处理动画或频繁更新意味着，您可以节省电池电量或减少错误的视图更新。

``` css
@media (update: slow) {
  /* e-book readers or severely underpowered devices */
}
```

打印场景和电子水墨显示屏可能仅通过单通道渲染，此类输出完全无法刷新
``` css
@media (update: none) {
  /* one time render like printed paper */
}
```


### 14. 检查代码是否可用

脚本媒体查询可用于检查 JavaScript 是否可用。


``` css
@media (scripting: none) {
  .steam {
    opacity: 0;
  }
}

@media (scripting: enabled) {
  .steam {
    opacity: 1;
  }
}
```

我们可以打开`chrome`控制台，然后输入`command+shift+p` 然后打开javascript disable 禁用 

### 15. 降低透明度的媒体查询

透明界面可能会引起头痛，或者让各类视力缺陷造成视觉障碍，因此，Windows、macOS 和 iOS 设有系统偏好设置，可以降低或移除界面的透明度。


``` css
@media (prefers-reduced-transparency: reduce) {
  --transparency: 95%;
}
```


### 16. 视图过度

视图过渡会对网页的用户体验产生巨大影响。

借助 View Transitions API，可以在单页应用的两个页面状态之间创建视觉过渡。这些转换可以是整页转换，也可以是网页上某些较小的转换，例如向列表中添加或移除新项。

View Transitions API 的核心是 document.startViewTranstion 函数。传入将 DOM 更新为新状态的函数，此 API 会为您处理所有工作。为此，它会拍摄前后快照，然后在两者之间转换。

页面DEMO: <https://simple-set-demos.glitch.me/enter-exit-sidebar/page-2.html>
列表DEMO:<https://codesandbox.io/p/sandbox/view-transition-api-forked-msncnc?file=%2Findex.css%3A1%2C1-67%2C2>


### 17 线性加速减速函数

与`linear`关键字不同，它是一个函数，我们可以用它来构建加速/减速运动。

![](https://pic.imgdb.cn/item/657c06e1c458853aef836aec.jpg)


``` css
.ball{
  animation: move linear(
    0,
    0.06,
    0.25 18%,
    1 36%,
    0.81,
    0.75,
    0.81,
    1,
    0.94,
    1,
    1
  ) 2s infinite both;
}

```


### 18. Scroll End

许多界面包含滚动互动，有时界面需要同步与当前滚动位置相关的信息，或根据当前状态提取数据。

在 scrollend 事件之前，必须使用不准确的超时方法，该方法可以在用户的手指仍在屏幕上时触发。

借助 scrollend 事件，您可以实现精确计时的 scrollend 事件，了解用户是否仍在进行手势操作。


<https://codepen.io/web-dot-dev/pen/OJdxKqJ>


### 19. ScrollTimeline

可以提取现有的CSS动画 与 滚动条滚动偏移量相结合。

使用ScrollTimeline 可以跟踪滚动条的整体进度，

<https://codepen.io/web-dot-dev/pen/JjxvwqG>


### 20. allow-discrete 离散动画属性

它是transition-behavior属性的关键字，也可以通过简写来实现`transition:all 1s allow-discrete`

比如，我们给一个`display:none`之间添加动画效果。

``` html
<style>
  img{
    transition: opacity 0.5s, display 0.5s;
  }

  .remove{
    opacity: 0;
    display: none;
  }
</style>
<img src="https://picsum.photos/200" alt="">
<button onClick="removeImg()">click</button>
<script>
  function removeImg(){
    const img = document.querySelector('img')
    img.classList.add('remove')
  }
</script>
```

我们如果不加`allow-discrete` 它并不会有过渡动画。


### 21. @starting-style

这个规则定义的事元素进入页面之前的样式，即打开之前的状态。

``` css
 .item {
  opacity: 1;
  height: 3rem;
  display: grid;
  overflow: hidden;
  transform-origin: bottom;
  transition: opacity 0.5s, transform 0.5s, height 0.5s, display 0.5s allow-discrete;
}

@starting-style {
  .item {
    opacity: 0;
    height: 0;
  }
}
```

上述样式表示的是`item`在页面中创建从高度`0->3rem` 透明度从`0->1`


### 22. popover dialog #top-laryer

#top-layer 层级

JS 也无法模拟的系统级新特性

解决的问题 ->
一些弹框写在了某些容器下 采用 fixed 定位 但是由于父容器使用了 transform 会导致失效 ,

在以前，或者说很多框架中，都会想办法把弹窗放到最外层的 body 下，这样就不受影响了，比如下面是 vue3 中的处理方式

```html
<div>
  <Teleport to="body">
    <!--将子内容传送到body下-->
    <dialog></dialog>
  </Teleport>
</div>
```

虽然 dialog 仍然在原来位置上，但真正渲染到了一个#top-layer 的层级上，这个层级非常特殊，已经超越了 html 文档流，可以说是独一档的存在，这样，无论的 dialog 在什么位置，最后渲染的地方其实都在#top-layer 层级上，自然也不会被父容器裁剪被隐藏了


### 23. Select hr分割规则

Chrome 和 Safari 对 HTML 做出了另一项细微更改，即能够在 `<select>` 元素中添加水平规则元素（`<hr>` 标记），从而在视觉上拆分您的内容。

以前，将 `<hr>` 标记放入 select 中根本不会呈现。但今年，Safari 和 Chrome 都支持此功能，从而更好地分隔 `<select>` 元素中的内容。

### 24. :user-valid 和 :invalid pseudo class

:user-valid 和 :user-invalid 在所有浏览器中都很稳定，其行为类似于 :valid 和 :invalid 伪类，但仅在用户与输入内容进行明显互动后，才会匹配表单控件。必填且空的表单控件将与 :invalid 匹配，即使用户尚未开始与页面互动也是如此。除非用户更改了输入内容并将其置于无效状态，否则该控件不会匹配 :user-invalid。

### 25. details 增加name属性

Chrome 120 中新增了对` <details> `元素的 name 属性的支持。使用此属性时，具有相同 name 值的多个 `<details> `元素会形成语义组。组内最多只能有一个元素同时打开


## 新用法

1. 安全距离

``` css
padding-bottom: calc(constant(safe-area-inset-bottom) / 2) !important;
padding-bottom: calc(env(safe-area-inset-bottom) / 2) !important;

```

可以配合上max函数 
```css
@supports (padding: max(0px)) {
  .post {
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
  }
}
```


2. 抗锯齿

```css
div {
    width: 500px;
    height: 100px;
    background: linear-gradient(37deg), #000 50%, #f00 50%, #f00 0);
}
```

解决失真的问题有很多。这里最简单的方式就是不要直接过渡，保留一个极小的渐变过渡空间。
``` css
div {
    width: 500px;
    height: 100px;
  - background: linear-gradient(37deg), #000 50%, #f00 50%, #f00);
  + background: linear-gradient(37deg), #000 49.5%, #f00 50.5%, #f00);
}
```

更深层次的原理 可以参考文章:<https://juejin.cn/post/6844904180776173581>


3. 单字动画:<https://codepen.io/wheatup/pen/OJoazBO>

用图的缺陷比较明显 换个文案加个字就要出图,不过可以以字的维度出图

如果是纯英文的话 可以考虑 bitMap 字体 (字蛛也可以) 字蛛构建流程地址 https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fyangchuansheng%2Ffont-spider-plus

https://www.midjourney.com/home/?callbackUrl=%2Fapp%2F


4. @layer

如果我们的页面上存在非常多的样式，譬如有我们开发页面的时候的自定义样式，也有引入的组件库样式。这时候样式将会非常混乱难以管理。

当我们想覆盖一些本身非我们书写的样式时候，往往不得不通过使用优先级权重更高的样式名，去覆盖那些样式。

同时，当样式优先级感到难以控制时，开发者习惯滥用 !important 去解决，这又循环导致了后续更混乱的样式结构。

基于让 CSS 得到更好的控制和管理的背景，CSS @layer 应运而生。


@layer声明了一个 级联层， 同一层内的规则将级联在一起， 这给予了开发者对层叠机制的更多控制。

``` css
@layer B, C, A;
div {
    width: 200px;
    height: 200px;
}
@layer A {
    div {
        background: blue;
    }
}
@layer B {
    div {
        background: green;
    }
}
@layer C {
    div {
        background: orange;
    }
}
```

比如上述代码的权重就是 A>C>B; 

除了在页面内定义的方式 我们还可以通过引入

``` css
@import(utilities.css) layer(utilities);
```


5. codepen片段
Switch
<https://codepen.io/jkantner/pen/eYPYppR>
Button
<https://codepen.io/jh3y/pen/LYJMPBL>
Page change(页面切换)
<https://codepen.io/konstantindenerz/pen/abaXabq>
Blend-mode
<https://codepen.io/tommiehansen/pen/BaGyVVy>

6. 如果一个元素行内设置了`color：red !important`


原本内容

```html
<style>
  .wrap {
    display: block;
    position: absolute;
    width: fit-content;
    height: fit-content;
    inset: 0;
    margin: auto;
  }

  .wrap {
    /*  请开始你的表演 */
  }
</style>

<div class="wrap" style="color:red!important">把我变成蓝色</div>
```

- 方案一

```css
.wrap {
  -webkit-text-fill-color: blue;
}
```

- 方案二

```css
.wrap {
  filter: hue-rotate(240deg);
}
```

- 方案三

```css
.wrap:first-line {
  color: blue;
}
```

- 方案四

```css
.wrap {
  background: #fff;
}

.wrap::after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  background-color: blue;
  mix-blend-mode: color;
}
```

- 方案五

```css
.wrap::after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  backdrop-filter: hue-rotate(240deg);
}
```


7. :is :where

数以选择器列表作为参数，并选择该列表中任意一个选择器可以选择的元素。

两者之间的区别在于，:is() 会计入整个选择器的优先级（它采用其最具体参数的优先级），而 :where() 的优先级为 0
``` css
/* 0 级 */
h1 {
  font-size: 30px;
}

/* 1 级 */
section h1,
article h1,
aside h1,
nav h1 {
  font-size: 25px;
}

/* 2 级 */
section section h1,
section article h1,
section aside h1,
section nav h1,
article section h1,
article article h1,
article aside h1,
article nav h1,
aside section h1,
aside article h1,
aside aside h1,
aside nav h1,
nav section h1,
nav article h1,
nav aside h1,
nav nav h1 {
  font-size: 20px;
}


/* 0 级 */
h1 {
  font-size: 30px;
}
/* 1 级 */
:is(section, article, aside, nav) h1 {
  font-size: 25px;
}
/* 2 级 */
:is(section, article, aside, nav) :is(section, article, aside, nav) h1 {
  font-size: 20px;
}
/* 3 级 */
:is(section, article, aside, nav)
  :is(section, article, aside, nav)
  :is(section, article, aside, nav)
  h1 {
  font-size: 15px;
}
```


8. 渲染性能比较：https://benchmarks.slaylines.io/webgl.html
9. 获取伪类的宽高`getComputedStyle('div',':before')`
10. 不是所有元素都有伪元素，譬如 iframe、input、img 等替换元素是没有伪元素的 2. 当 img 触发了元素的 onerror 事件时（或者理解为 img src 内的资源替换失败），此状态下的 img 可以添加伪元素
11. 新增的css函数


- light-dark();
  比如我们背景颜色 希望在普通模式下是白色 暗黑模式下是黑

我们需要这么写

```css
:root {
  color-scheme: light dark;
  --text-color: #333; /* Value for Light Mode */
}

@media (prefers-color-scheme: dark) {
  --text-color: #ccc; /* Value for Dark Mode */
}

/* 
  如果我们使用 light-dark();
*/

:root {
  color-scheme: light dark;
  --text-color: light-dark(#333, #ccc);
}
```


- xywh()

这将创建一个“基本形状”，该形状从 X、Y 坐标开始，然后具有指定的宽度和高度。有点酷。用于使用基本形状的地方：

```css
.thing-that-is-clipped {
  clip-path: xywh(0 0 100% 100% round 5px);

  offset-path: xywh(0 20px 100% calc(100% - 20px));
}
```

- round()

默认情况下，它舍入到最接近的值，但可以是上或下，也可以是奇异的到零。但更重要的是，它有一个“舍入间隔”，不仅意味着最接近的整数，还意味着任何整数的间隔。

```css
#drag {
  margin: round(to-zero, -105px, 10px);
}
```

- rem()

在 css 中我们使用 rem 计算余数

```css
line-height: rem(9, 4); /* 1 */
line-height: rem(5, 4.1); /* 0.9 */
line-height: rem(1003 % 5); /* 3 */
```

12. inert

防止 click 用户单击元素时触发该事件。（可以完美替换 pointer-event:none）
focus 通过阻止元素获得焦点来阻止引发事件。（之前是通过 tabIndex 来避免的）
通过将元素及其内容从辅助功能树中排除来隐藏辅助技术。

13. 一行css使chrome崩溃

width: atan2(calc(100cqw - 0px), 1px);

14. height:0 -> height:auto;

``` css
div{
  height: 0;
  transition: 1s
}
.wrap:hover div{
  height: auto
}
```

``` css
.trigger {
  border: 0;
  background-color: royalblue;
  color: #fff;
  outline: 0;
  font-size: 16px;
  padding: 0.4em 1em;
  border-radius: 0.2em;
  cursor: pointer;
}
.grid {
  position: absolute;
  margin-top: 10px;
  max-width: 250px;
  border-radius: 5px;
  display: grid;
  grid-template-rows: 0fr;
  transition: 0.3s;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.65);
  color: #fff;
}
.grid > * {
  min-height: 0;
  padding: 0 10px;
}
.wrap:hover .grid {
  grid-template-rows: 1fr;
}
span {
  padding: 10px;
}
```

