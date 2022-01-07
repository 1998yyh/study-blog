# 粘连效果

## css 滤镜实现

模糊滤镜叠加对比度产生融合效果，原理在于，高斯模糊产生的边缘会被对比度滤镜干掉。

1. `filter:blur()`:给图像设置高斯模糊。
2. `filter:contrast()`:调整图像的对比度。

举个例子：
<iframe height="300" style="width: 100%;" scrolling="no" title="constrast 作用(1)" src="https://codepen.io/WFFMLOVE/embed/OJjqPOr?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/OJjqPOr">
  constrast 作用(1)</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

我们给`ball1`和`ball2`都增加10px的高斯模糊，然后逐步增加容器的对比度，可以发现模糊模糊边缘清除掉了，两个球的链接部分就粘连在了一起。

那么 我们使用相同的数据 让两个球动起来,这样的效果就很明显了。

<iframe height="300" style="width: 100%;" scrolling="no" title="contrast 2" src="https://codepen.io/WFFMLOVE/embed/ExvrXQa?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/ExvrXQa">
  contrast 2</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

然后我们再进一步，想一下如果两个球之前接触分开的过程中，有粘连效果，如果显示隐藏呢。

我们做一个倒计时的切换，运用一下上面的技巧。

试想一下完整的过程，4出现 4在消失的过程中3出现，3出现的过程中2出现，由于要有粘连的效果，所以在消失的同时要给他们设置模糊，
给每个文字都增加一个动画，动画时长总共8s:

+ 0-0.2s展示
+ 0.2-4s消失动画
+ 4s-6.4s隐藏
+ 6.4s-8s显示动画

我们假设一个4一开始展示，在0.2s后即将消失，那么3必定需要在6.4s的位置开始动画，我们通过设置`animation-delay:-6.4s`达到这一目的。
同时这一刻2应该是完完全全隐藏的，所以它应该在4.8s的这一个位置保持自己的一个隐藏状态。
为了保持动画统一，1的位置就同样的减去1.6s，这样整个动画就完成了。

<iframe height="300" style="width: 100%;" scrolling="no" title="svg contract6" src="https://codepen.io/WFFMLOVE/embed/qBXvBMb?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/qBXvBMb">
  svg contract6</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


## 静态图形

<iframe height="300" style="width: 100%;" scrolling="no" title="contrast 3" src="https://codepen.io/WFFMLOVE/embed/QWqbVyR?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/QWqbVyR">
  contrast 3</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

这里有几个细节需要注意：
1. g-content 这一层需要设置 background、需要 overflow: hidden（可以自己尝试去掉看看效果）
2. 外侧的直角也变成了圆角 如果希望这个圆角也是直角，就有了 .g-container 这一层，我们可以通过在这一层添加一个伪元素，将 4 个角覆盖成直角：



## svg 滤镜实现

css的滤镜实现都可以通过svg滤镜来实现，并且svg的滤镜功能更强大。

对比上面的css属性：

1. `feGaussianBlur` 可以通过`stdDeviation`来给图片设置高斯模糊
2. `feColorMatrix` 可以通过颜色矩阵设置对比度。
3. `feBlend` 可以将原图 和 处理过的图片 一起输出


### feColorMatrix

颜色矩阵
```
   | R | G | B | A | +
---|-------------------
 R | 1 | 0 | 0 | 0 | 0
---|-------------------
 G | 0 | 1 | 0 | 0 | 0
---|-------------------
 B | 0 | 0 | 1 | 0 | 0
---|-------------------
 A | 0 | 0 | 0 | 1 | 0
---|-------------------
```
数字图像的本质是一个多维矩阵。在图像显示时，我们把图像的 R 分量放进红色通道里，B 分量放进蓝色通道里，G 分量放进绿色通道里。经过一系列处理，显示在屏幕上的就是我们所看到的彩色图像了。

每行代表一个通道（红色、绿色、蓝色和 alpha），用于设置通道的值。前四列中的每一列也代表一个通道，它们返回各自通道的当前值。然后，单元格中的数字将乘以该数字与其列表示的通道的当前值相乘的结果添加到其行通道中。例如，对于每个像素，R 行 G 列上的 0.5 将向红色通道添加绿色 *0.5 的当前值。最后一列不代表任何通道，用于加法/减法，这意味着那里的数字会将其值乘以 255 添加到其通道中。


我们试着使用这几个滤镜：

<iframe height="300" style="width: 100%;" scrolling="no" title="svg contract4" src="https://codepen.io/WFFMLOVE/embed/WNEPVwm?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/WNEPVwm">
  svg contract4</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
这样像是分裂出去，同时加上缩放的动画，给人的视觉体验更真实

再看一个例子：

<iframe height="300" style="width: 100%;" scrolling="no" title="svg contract5" src="https://codepen.io/WFFMLOVE/embed/ZEJwgBG?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/ZEJwgBG">
  svg contract5</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

这种粘连并且叠加着抖动的效果，也不错。


