# 阴影

我们的眼睛习惯于看到阴影。它们能让我们了解物体的大小和深度，盒子阴影将这种真实感带入我们的在线体验中。如果样式得当，可以提高网页的美观性。

## box-shadow

box-shadow 属性用于在元素的框架上添加阴影效果。你可以在同一个元素上设置多个阴影效果，并用逗号将他们分隔开。该属性可设置的值包括阴影的X轴偏移量、Y轴偏移量、模糊半径、扩散半径和颜色。

* 可选，`inset`关键字
* 如果只给出两个值, 那么这两个值将会被当作 `<offset-x>``<offset-y>` 来解释。
* 如果给出了第三个值, 那么第三个值将会被当作`<blur-radius>`解释。
* 如果给出了第四个值, 那么第四个值将会被当作`<spread-radius>`来解释。
* 可选，`<color>`值。

**注**: 元素可以设置多个阴影, 多个box-shadow存在层叠关系，离box-shadow最近设置的优先级最高

**注**:box-shadow不占用实际空间，且不能捕获类似点击事件等。

### 悬浮与按压

我们可以使用上面的属性，实现悬浮 与 按压的效果，虽然不及真实的3D，但以假乱真足以。

我们配合 `translateY` 做一点偏移, 同时增加一点扩散程度

<iframe height="300" style="width: 100%; " scrolling="no" title="Untitled" src="https://codepen.io/WFFMLOVE/embed/wvPNrJL?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/wvPNrJL">
  Untitled</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

另一个常见的方案是使用 `scale` 放大

<iframe height="300" style="width: 100%; " scrolling="no" title="boxShadow4" src="https://codepen.io/WFFMLOVE/embed/KKyJXXV?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/KKyJXXV">
  boxShadow4</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

上面的按压的效果与真实的还是有一定差距，它只是单纯的做了一下位置的偏移，没有产生形变。

如果我们active的同时 去修改阴影的垂直偏移而不是 `translateY` 做偏移，那么效果是不是更好呢？

<iframe height="300" style="width: 100%; " scrolling="no" title="fake 3d button" src="https://codepen.io/WFFMLOVE/embed/mdqpNvK?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/mdqpNvK">
  fake 3d button</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### 实现图形

某段时间很流行单标签实现图形，除了 `::before` 和 `::after` 之外, 阴影是最方便扩展的属性了。比如下面的例子

<iframe height="300" style="width: 100%; " scrolling="no" title="boxShadow1" src="https://codepen.io/WFFMLOVE/embed/MWEZGMZ?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/MWEZGMZ">
  boxShadow1</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

由于 `box-shadow` 的多重性, 我们可以无限去叠加, 那么理论上任意一张图片, 每一个像素点都可以由一个1*1的box-shadow 来表示。canvas 刚好提供了一个方法 `canvas.getImageData` 获取像素点的信息，所以可以绘制一下图片。

![1642132186788.jpg](https://s2.loli.net/2022/01/14/ElUrgF47aWT1t3v.jpg)

[试一下](https://chokcoco.github.io/demo/img2div/html/)

### 给投影加点细节

可以通过改变阴影的偏移，模拟出光源变化的效果。

<iframe height="300" style="width: 100%; " scrolling="no" title="boxShadow2" src="https://codepen.io/WFFMLOVE/embed/XWeoBLE?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/XWeoBLE">
  boxShadow2</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

由于阴影的位置大小角度等可变性比较小，在实现一些效果时难免有些不方便，这时候我们可以使用伪元素+blur的方式来模拟

<iframe height="600" style="width: 100%; " scrolling="no" title="立体投影" src="https://codepen.io/Chokcoco/embed/LgdRKE?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/Chokcoco/pen/LgdRKE">
  立体投影</a> by Chokcoco (<a href="https://codepen.io/Chokcoco">@Chokcoco</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

除了修改阴影的位置 大小等，我们还可以给阴影增加点颜色。

<iframe height="300" style="width: 100%; " scrolling="no" title="boxShadow5" src="https://codepen.io/WFFMLOVE/embed/QWOYqBy?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/QWOYqBy">
  boxShadow5</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

这种常见于深色主题的页面上 带着一点点霓虹灯的效果

### 神经拟态阴影

这种效果是独特的，视觉上令人愉悦。它来自skeuomorphism，它试图完全复制对象在现实生活中的样子。

我们需要创建的前两个效果处理似乎漂浮在页面上方并在背景上投射阴影的扁平 Web 组件。这种效果使这些组件看起来像是从页面中挤出来的。

<iframe height="300" style="width: 100%; " scrolling="no" title="boxShadow6" src="https://codepen.io/WFFMLOVE/embed/abVXLRq?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/abVXLRq">
  boxShadow6</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

神经拟态设计模仿现实生活中的物体。它并没有完全复制事物，但它看起来足够真实，就像你可以伸手触摸它一样。

<iframe height="300" style="width: 100%; " scrolling="no" title="boxShadow7" src="https://codepen.io/WFFMLOVE/embed/QWOYqoE?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/QWOYqoE">
  boxShadow7</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### 鸡肋的效果

1. 由于边框只能设置一个，可以通过设置阴影实现多边框
2. 实现遮罩（鸡肋）

## text-shadow

同样的 text-shadow 也可以实现 文本的立体效果，同样是使用阴影的叠加

<iframe height="300" style="width: 100%; " scrolling="no" title="textShadow1" src="https://codepen.io/WFFMLOVE/embed/eYGbPOo?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/eYGbPOo">
  textShadow1</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## drop-shadow

drop-shadow 与 box-shadow 不同的是 简单的理解是它不会对透明的地方做投影。

其本质上是一个滤镜，将图像做处理后 与原图像叠加后生成的效果。

下面是两个属性的对比。

![Snipaste_2022-03-04_17-17-57.png](https://s2.loli.net/2022/03/04/ZIX8qJ4np5xE1cK.png)

## 不是阴影的阴影

在现实生活中，如果物体本身有透明度，他的阴影应该不是纯色阴影。显然，box-shadow 和 drop-shadow 无法完成这样的效果。

此时我们就可以用伪类去模拟。

```css
.box {
    /* 省略 */
    background-image: url('./pngsucai_6320528_efeb66.png');
    background-size: 100% 100%;
}

.box::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: -1;
    background-image: url('./pngsucai_6320528_efeb66.png');
    background-size: 100% 100%;
    filter: blur(5px)
}
```

下面是最终效果

![Snipaste_2022-03-04_17-33-26.png](https://s2.loli.net/2022/03/04/oHA4NqyK3RzhmIe.png)


## 最后

复杂的阴影动画对于渲染影响也很大，请合理使用。