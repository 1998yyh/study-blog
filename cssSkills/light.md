# light

我们将从三种技术角度查看光（光影）的实际应用

## 光晕

![https://s2.loli.net/2022/04/21/c5uA2SH1lKDdNmZ.png](https://s2.loli.net/2022/04/21/c5uA2SH1lKDdNmZ.png)

上面的镜头光晕有几个部分。让我们把它们列出来，这样我们就知道我们的目标是什么：

1. 中心光源显示为一个发光的光球。
2. 有一些水平的椭圆光条纹——光线扭曲和模糊，导致椭圆形变长。
3. 随机光线从中心光源以不同的角度射出。

我们从映射到我们的flare组件下面的HTML元素开始。有一个中心光源和两个非对角圆形耀斑，三个水平透镜耀斑和三个锥形射线状耀斑。

```html
<!-- 耀斑左 -->
<div class="left-flare horizontal-flare"></div>
<!-- 耀斑右 -->
<div class="right-flare horizontal-flare"></div>
<!-- 对称耀斑 -->
<div class="full-flare horizontal-flare"></div>
<!-- 点光源 -->
<div class="lens-center"></div>
<!-- 光斑1 -->
<div class="circle-1"></div>
<!-- 光斑2 -->
<div class="circle-2"></div>
<!-- 漫射光线1 -->
<div class="conic-1"></div>
<!-- 漫射光线2 -->
<div class="conic-2"></div>
<!-- 漫射光线3 -->
<div class="conic-3"></div>
```

### 背景与光源 

我们从 CSS 镜头光晕的黑色背景和中央光源开始。

网络上的大多数渐变都是带有纯色过渡的线性渐变，但我们可以对它们应用 Alpha 通道，这实际上是产生发光效果的好方法。

具有多层半透明颜色的圆形径向渐变为我们提供了良好的相机中心效果。

并且我们通过增加 `blur` 滤镜，使其拥有漫射光效果。

```css
div {
    background: radial-gradient(closest-side circle at center,
            hsl(4 5% 100% / 100%) 0%,
            hsl(4 5% 100% / 100%) 15%,
            hsl(4 10% 70% / 70%) 30%,
            hsl(4 0% 50% / 30%) 55%,
            hsl(4 0% 10% / 5%) 75%,
            transparent 99);
    filter: blur(4px);
}
```

这样我们实现了一个中心点光源，为了使其更加真实。我们还将在光源后面添加一个更大的漫射光斑，以及45deg与中心成一定角度的三个额外光斑。

![light _2_.png](https://s2.loli.net/2022/04/21/UH8YF6cLAqkM7fB.png)

设置的同理方式，使用渐变背景 + 模糊滤镜。

### 设置耀斑

从网上找了一张耀斑的图片

![https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fe682e9e990e40292bf0cc041e721cb6ed580b3f850a8-jdT51p_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999](https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fe682e9e990e40292bf0cc041e721cb6ed580b3f850a8-jdT51p_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999)



我们可以采取一些选择，一个非常细长的椭圆渐变将是最简单的方法。使用渐变的一个问题就是，过于对称，在真实的耀斑不应该是这样完全对称的，所以我们也做一个非对称的耀斑。

径向渐变在 CSS 中有一个可选的位置参数。我们可以创建同一水平光斑的两个大小略有不同的左右部分，颜色也略有不同。我们还可以添加一个不透明度过滤器，使水平耀斑连接中心的区域减少耀斑的刺耳感。

```css
  /* 非对称 右 */
  .right-flare {
      left: 35%;
      width: calc(100vw - 35%);
      top: calc(35% - (5vh / 2));
      background: radial-gradient(ellipse at center left,
              hsl(4 20% 90% / 80%) 0%,
              hsl(4 10% 70% / 40%) 30%,
              transparent 75%);
      filter: opacity(50%);
  }

  /* 非对称 左 */
  .left-flare {
      left: 0;
      top: calc(35% - (5vh / 2));
      width: 35%;
      background: radial-gradient(ellipse at center right,
              hsl(4 20% 90% / 60%) 0%,
              hsl(14 10% 70% / 40%) 30%,
              transparent 75%);
      filter: opacity(40%);
  }

  /* 对称 */
  .full-flare {
      background: radial-gradient(closest-side ellipse at 45% center,
              hsl(4 20% 90% / 80%) 0%,
              hsl(4 10% 70% / 30%) 30%,
              transparent 95%);
      left: 0%;
      width: 100%;
      top: 75vh;
      filter: blur(5px);
  }
```

![flare.png](https://s2.loli.net/2022/04/21/ynCXJTgDpoUfsa9.png)

### 漫射光线

我们剩下的就是从光源射出的成角度的光线，可以使用圆锥渐变。

耀斑中心为中心的圆锥渐变，具有各种半透明颜色的渐变角度。因为圆锥渐变可以显示其容器的角点div，所以我们将使用我们的光源作为其原点对它们进行旋转变换，从而产生偏移漫反射滤镜效果。

```css
div {
    background: conic-gradient(from 5deg at 0% 100%,
            transparent 0deg,
            hsl(4 10% 70% / 30%) 7deg,
            transparent 15deg);
    transform-origin: bottom left;
    transform: rotate(-45deg);
}
```

下面是全部合成后的效果

<iframe height="500" style="width: 100%; " scrolling="no" title="light-demo01" src="https://codepen.io/WFFMLOVE/embed/vYpPpPv?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/vYpPpPv">
  light-demo01</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

> https://css-tricks.com/add-a-css-lens-flare-to-photos-for-a-bright-touch/

## 树影光斑

我们先看效果

<iframe height="500" style="width: 100%; " scrolling="no" title="light-demo02" src="https://codepen.io/WFFMLOVE/embed/WNdmdVr?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/WNdmdVr">
  light-demo02</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

是不是很像光透过树叶的缝隙，照射到墙上的样子，那么这个是如何实现的呢？

首先我们需要通过 `filter: brightness(1.7)` 滤镜来实现背景的强光照射。

```css
.wrap {
    background: center / cover no-repeat url("https://images.unsplash.com/photo-1556993683-f5dcad606dd0?w=500&q=60");
    width: 400px;
    height: 300px;
    overflow: hidden;
    border-radius: 20px;
    filter: brightness(1.7);
    cursor: default;
}
```

![](https://pic.imgdb.cn/item/62625af2239250f7c5745e29.png)
![](https://pic.imgdb.cn/item/62625af2239250f7c5745e18.png)

然后我们寻找几个图标字体 🍃 🍂 对其做处理  我们将其背景颜色设置为半透明黑色，调整大小使其覆盖到整个父容器，文本设置为透明色，只保留了图形，并且可以透光。

但是由于给背景增加了增亮滤镜，如果文本设置了透明色的话，光线会过于强。那么有没有什么办法可以使颜色变暗呢？

这里介绍一个混合模式: 正片叠底。

正片就是常见的幻灯片，正片叠底的效果是把基色和混合色的图像都制作成幻灯片，把它们叠放在一起，拿起来凑到亮处看的效果，由于两张幻灯片都有内容，所以重叠起来的图像比单张图片要暗。

```css
div {
    color: transparent;
    background-color: rgba(0, 0, 0, 0.4);
    text-shadow: 0 0 20px beige;
    mix-blend-mode: multiply;
    font: bolder 320pt/320pt monospace;
    margin-top: -100px;
    user-select: none;
}
```

![](https://pic.imgdb.cn/item/626261e4239250f7c586de70.png)

最后我们加点细节，增加个动画，就完成上面的效果了。


## 线条光影

![](https://pic.imgdb.cn/item/626263ca239250f7c58c5864.gif)

类似这样的光影或者霓虹灯效果很常见，原理很简单

``` css
.rect{
  filter: drop-shadow(0 0 2px #f24983) drop-shadow(0 0 4px #f24983) drop-shadow(0 0 8px #f24983) drop-shadow(0 0 12px #f24983);
}
```

通过设置多重阴影滤镜,实现这种效果。

同时我们可以改变路径