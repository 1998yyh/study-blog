# 字体变粗

## font-weight(加粗)

font-weight属性设置字体的粗细或粗细，并且取决于字体系列中的可用字体或浏览器定义的粗细。

该font-weight属性接受关键字值或预定义的数值。可用的关键字是： <normal> <bold> <bolder> <lighter>

可用的数值是：100 - 900

关键字值normal映射到数值400，值bold映射到700。

为了使用400或以外的值查看任何效果700，所使用的字体必须具有与这些指定权重匹配的内置字体。

如果字体具有粗体（“700”）或普通（“400”）版本作为字体系列的一部分，浏览器将使用它。如果这些不可用，浏览器将模仿其自己的粗体或正常版本的字体。它不会模仿其他不可用的权重。字体通常使用“Regular”和“Light”等名称来标识任何替代字体粗细。

<iframe height="300" style="width: 100%;" scrolling="no" title="font-weight" src="https://codepen.io/WFFMLOVE/embed/RwLpwwg?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/RwLpwwg">
  font-weight</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


## -webkit-text-stroke(粗上加粗)

该属性为文本字符添加了一个边框（笔锋），指定了边框的宽和颜色， 它是 -webkit-text-stroke-width 和 -webkit-text-stroke-color 属性的缩写。

<iframe height="300" style="width: 100%;" scrolling="no" title="-webkit-text-stroke " src="https://codepen.io/WFFMLOVE/embed/rNGyNLN?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/rNGyNLN">
  -webkit-text-stroke </a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


## 伪元素

使用文字的伪元素放大文字,我们可以对每一个文字进行精细化处理，利用文字的伪元素稍微放大一点文字，将原文字和访达后的文字贴合在一起。

<iframe height="300" style="width: 100%;" scrolling="no" title="pseudoElements font-weight" src="https://codepen.io/WFFMLOVE/embed/poWeoem?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/poWeoem">
  pseudoElements font-weight</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

仔细看会发现效果很粗糙，文字每一处并非规则的被覆盖。

## text-shadow

每个阴影值由元素在X和Y方向的偏移量、模糊半径和颜色值组成。
```html
<div class="wrap">
  <div class="word">text-shadow文本</div>
</div>
```
```css
.wrap{
  margin: 20px auto;
  font-weight: bold;
  font-size: 100px;
  text-align: center;
}
.word{
  text-shadow: 0 0 4px red;
}
```

![text-shadow1.jpg](https://s2.loli.net/2021/12/15/8ihtwKN1rfBqYDA.jpg)

和box-shadow不同的是，text-shadow没有扩散程度，一眼看上去就是阴影，很难达到加粗的效果

不过别着急，text-shadow 是支持多重阴影的，我们把上述的 text-shadow 多叠加几次：

![text-shadow2.jpg](https://s2.loli.net/2021/12/15/uv8LmRODAc9lI4i.jpg)

![text-shadow3.jpg](https://s2.loli.net/2021/12/15/qXOJKI7Pu3M52lf.jpg)

比之前单个阴影强，如果仔细看的话也是能够看出来是阴影。


## drop-shadow

上面说过text-shadow没有扩散属性，所以阴影的模糊效果很明显

MDN 上介绍的 drop-shadow属性 drop-shadow(offset-x offset-y blur-radius spread-radius color) 存在阴影的扩展半径

但是很遗憾 大多数浏览器并不支持这个参数。

## svg

借用 feMorphology 的扩张能力可以加粗文本。

feMorphology 为形态滤镜，它的输入源通常是图形的 alpha 通道，用来它的两个操作可以使源图形腐蚀（变薄）或扩张（加粗）。

使用属性 operator 确定是要腐蚀效果还是扩张效果。使用属性 radius 表示效果的程度，可以理解为笔触的大小。

operator：erode 腐蚀模式，dilate 为扩张模式，默认为 erode
radius：笔触的大小，接受一个数字，表示该模式下的效果程度，默认为 0

如果是图像

对于 erode 模式，会将图片的每一个像素向更暗更透明的方向变化，
而 dilate 模式，则是将每个向像素周围附近更亮更不透明的方向变化

<iframe height="400" style="width: 100%;" scrolling="no" title="feMorphology font-weight bold" src="https://codepen.io/WFFMLOVE/embed/MWEpYQm?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/MWEpYQm">
  feMorphology font-weight bold</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>



## 最后
以上这些方式不仅可以加粗字体，并且可以作为字体边框使用。

实际需求中，如果不是要求任意字都要有这个效果，建议切图。

没用的知识又增加了 = = ;


## 参考
- [https://juejin.cn/post/7023940690476269605](https://juejin.cn/post/7023940690476269605)

