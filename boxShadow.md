# 阴影


## box-shadow
box-shadow 属性用于在元素的框架上添加阴影效果。你可以在同一个元素上设置多个阴影效果，并用逗号将他们分隔开。该属性可设置的值包括阴影的X轴偏移量、Y轴偏移量、模糊半径、扩散半径和颜色。

* 可选，`inset`关键字
* 如果只给出两个值, 那么这两个值将会被当作 `<offset-x>``<offset-y>` 来解释。
* 如果给出了第三个值, 那么第三个值将会被当作`<blur-radius>`解释。
* 如果给出了第四个值, 那么第四个值将会被当作`<spread-radius>`来解释。
* 可选，`<color>`值。

**注**:元素可以设置多个阴影,多个box-shadow存在层叠关系，离box-shadow最近设置的优先级最高
**注**:box-shadow不占用实际空间，且不能捕获类似点击事件等。


### 几个基本操作
1. 添加阴影造成悬浮效果
2. 由于边框只能设置一个，可以通过设置阴影实现多边框
3. 实现遮罩（鸡肋）

### 实现图形

某段时间很流行单标签实现图形，除了`::before`和`::after`之外,阴影是最方便扩展的属性了。比如下面的例子

<iframe height="300" style="width: 100%;" scrolling="no" title="boxShadow1" src="https://codepen.io/WFFMLOVE/embed/MWEZGMZ?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/MWEZGMZ">
  boxShadow1</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>



由于`box-shadow`的多重性,我们可以无限去叠加,那么理论上任意一张图片,每一个像素点都可以由一个1*1的box-shadow 来表示。canvas 刚好提供了一个方法 `canvas.getImageData`获取像素点的信息，所以可以绘制一下图片。

![1642132186788.jpg](https://s2.loli.net/2022/01/14/ElUrgF47aWT1t3v.jpg)

[试一下](https://chokcoco.github.io/demo/img2div/html/)

### 给投影加点细节

可以通过改变阴影的偏移，模拟出光源变化的效果。

<iframe height="300" style="width: 100%;" scrolling="no" title="boxShadow2" src="https://codepen.io/WFFMLOVE/embed/XWeoBLE?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/XWeoBLE">
  boxShadow2</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

由于阴影的位置大小角度等可变性比较小，在实现一些效果时难免有些不方便，这时候我们可以使用伪元素+blur的方式来模拟

<iframe height="600" style="width: 100%;" scrolling="no" title="立体投影" src="https://codepen.io/Chokcoco/embed/LgdRKE?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/Chokcoco/pen/LgdRKE">
  立体投影</a> by Chokcoco (<a href="https://codepen.io/Chokcoco">@Chokcoco</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


## text-shadow

同样的 text-shadow 也可以实现 文本的立体效果，同样是使用阴影的叠加

<iframe height="300" style="width: 100%;" scrolling="no" title="textShadow1" src="https://codepen.io/WFFMLOVE/embed/eYGbPOo?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/eYGbPOo">
  textShadow1</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>