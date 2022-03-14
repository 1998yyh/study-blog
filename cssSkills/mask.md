# MASK

CSS 属性 mask 允许使用者通过遮罩或者裁切特定区域的图片的方式来隐藏一个元素的部分或者全部可见区域。

## 语法

最基本的语法，使用mask的方式是借助图片

```css
{
    /* Image values */
    mask: url(mask.png);
    /* 使用位图来做遮罩 */
    mask: url(masks.svg#star);
    /* 使用 SVG 图形中的形状来做遮罩 */
}
```

还有比如使用渐变的方法

```css
{
    background: url(image.png);
    /* 图片与 mask 生成的渐变的 transparent 的重叠部分，将会变得透明。 */
    mask: linear-gradient(90deg, transparent, #fff);
}
```

<iframe height="300" style="width: 100%; " scrolling="no" title="mask-demo1" src="https://codepen.io/WFFMLOVE/embed/abEomMK?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/abEomMK">
  mask-demo1</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 常用技俩

### 剪切图片

比如我们要实现一些特殊形状的图形

1. 四角被切

<div style='width: 200px; height: 120px; background:linear-gradient(135deg, transparent 15px, deeppink 0) top left, linear-gradient(-135deg, transparent 15px, deeppink 0) top right, linear-gradient(-45deg, transparent 15px, deeppink 0) bottom right, linear-gradient(45deg, transparent 15px, deeppink 0) bottom left; background-size: 50% 50%; background-repeat: no-repeat; '></div>

使用线性渐变，我们实现一个简单的切角图形：

```css
.notching {
    width: 200px;
    height: 120px;
    background:
        linear-gradient(135deg, transparent 15px, deeppink 0) top left,
        linear-gradient(-135deg, transparent 15px, deeppink 0) top right,
        linear-gradient(-45deg, transparent 15px, deeppink 0) bottom right,
        linear-gradient(45deg, transparent 15px, deeppink 0) bottom left;
    background-size: 50% 50%;
    background-repeat: no-repeat;
}
```

我们将渐变放到mask 上，并且将背景换成一张图片，这样就可以获得一个四角被切的图片。

<iframe height="300" style="width: 100%; " scrolling="no" title="mask-demo2" src="https://codepen.io/WFFMLOVE/embed/bGabwyp?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/bGabwyp">
  mask-demo2</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

2. 优惠券

<div style='width: 200px; height:120px; background: linear-gradient(45deg, orange, red); -webkit-mask: radial-gradient(circle at 0, transparent 20px, red 0); '></div>

和上面类似的原理，我们只需要实现一个透明的径向渐变的Mask即可。

 `-webkit-mask: radial-gradient(circle at 0, transparent 20px, red 0)`

如果我们需要两边都开洞呢?

<div style='width: 200px; height:120px; background: linear-gradient(45deg, orange, red); -webkit-mask: radial-gradient(circle at 0, transparent 20px, red 0), radial-gradient(circle at right, transparent 20px, blue 0); -webkit-mask-size: 50%; -webkit-mask-position: 0, 100%; -webkit-mask-repeat: no-repeat; '></div>

这里需要注意一点，单纯的重复上面操作，再右边复制一个渐变是无法实现的，我们需要同时去设置mask的大小以及不可重复。

```css
{
    ... -webkit-mask: radial-gradient(circle at 0, transparent 20px, red 0), radial-gradient(circle at right, transparent 20px, blue 0);
    -webkit-mask-size: 50%;
    -webkit-mask-position: 0, 100%;
    -webkit-mask-repeat: no-repeat;
}
```

既然已经用到了 `mask-position` , 那么我们应该可以想到，将渐变圆心调整，再对position偏移，就可以得出对应的效果

 `-webkit-mask: radial-gradient(circle at 20px, transparent 20px, red 0) -20px;`

这里还有另一种方式去实现: 那就是利用mask的 `mask-composite` 属性

```css
{
    ... -webkit-mask: radial-gradient(circle at 0, transparent 20px, red 0), radial-gradient(circle at right, transparent 20px, blue 0);
    -webkit-mask-composite: source-in;
    /*只显示重合的地方*/
}
```

同理 可以偏移得出四角1/4圆的效果:

 `-webkit-mask: radial-gradient(circle at 20px 20px, transparent 20px, red 0) -20px -20px;`

<div style='width: 200px; height:120px; background: linear-gradient(45deg, orange, red); -webkit-mask: radial-gradient(circle at 20px 20px, transparent 20px, red 0) -20px -20px; '></div>

还有一些是两边是锯齿状，而不是这种简单的四个角

<div style='width: 200px; height:120px; background: linear-gradient(45deg, orange, red); -webkit-mask:radial-gradient(circle at 5px, transparent 5px, red 0) -5px/100% 15px'></div>

我们将mask的渐变圆形缩小，创建出一些间隔，并且利用repeat重复，就可以达成上面的效果。

```css
{
    width: 200px;
    height: 120px;
    background: linear-gradient(45deg, orange, red);
    -webkit-mask: radial-gradient(circle at 5px, transparent 5px, red 0) -5px/100% 15px
}
```

还有一种是中间有打孔，

<div style='width: 200px; height:120px; background: linear-gradient(45deg, orange, red); -webkit-mask: radial-gradient(circle at 50%, red 3px, transparent 0) 50% 50% / 100% 10px, radial-gradient(circle at 15px 15px, transparent 15px, red 0) -15px -15px / 50%; -webkit-mask-composite: destination-out; '></div>

上面有一个demo使用了 `mask-composite` ，他还有另一个值 `destination-out` , 他的效果是，清除源图像和mask图像中的重叠像素, 源图像的所有剩余像素都将被渲染。

我们只需要在原图 中心出叠加几个带色的小圆圈，这样做重叠的时候会因为清楚效果不现实，这样就实现了上面的效果

```css
{
    width: 300px;
    height: 150px;
    margin: auto;
    -webkit-mask: radial-gradient(circle at 50%, red 3px, transparent 0) 50% 50% / 100% 20px, radial-gradient(circle at 15px 15px, transparent 15px, red 0) -15px -15px / 50%;
    -webkit-mask-composite: destination-out;
    background: linear-gradient(45deg, orange, red);
}
```

还有其他的类型的，原理基本类似。

### 场景切换

#### 线性切换
假设我们有两张图片，使用 mask，可以很好将他们叠加在一起进行展示。最常见的一个用法

```scss
{
  .more-clip-mask {
    width: 300px;
    height: 200px;
    background-image: url(https://s2.loli.net/2022/03/11/jIARdkS5gOYV8Gz.jpg);
    background-size: 100% 100%, 100% 100%;
    background-repeat: no-repeat;
    position: relative;
   
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      content: "";
      display: block;
      width: 300px;
      height: 200px;
      background-image: url(https://s2.loli.net/2022/03/11/u5P1KDOj9aRBG3b.jpg);
      background-size: 100% 100%, 100% 100%;
      background-repeat: no-repeat;
      mask:linear-gradient(45deg, #000 50%, transparent 50%);
    }
  }
}

```

![Snipaste_2022-03-14_10-57-02.png](https://s2.loli.net/2022/03/14/EMAOLGmk62jSwQI.png)

我们加一点过度，让渐变不那么生硬

```css
{
  - mask: linear-gradient(45deg, #000 50%, transparent 50%);
  + mask: linear-gradient(45deg, #000 40%, transparent 60%);
}
```

<iframe height="300" style="width: 100%; " scrolling="no" title="mask-demo3" src="https://codepen.io/WFFMLOVE/embed/abEzzMy?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/abEzzMy">
  mask-demo3</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


在此之上，我们再加上动画!
``` css
{
  animation: maskMove 2s linear;
}

@keyframes maskMove{
  0% {
    mask: linear-gradient(45deg, #000 0%, transparent 5%, transparent 5%);
  }
  100% {
    mask: linear-gradient(45deg, #000 100%, transparent 105%, transparent 105%);
  }
}
```
但是注意，渐变是不支持动画的。

<iframe height="300" style="width: 100%;" scrolling="no" title="mask-demo4" src="https://codepen.io/WFFMLOVE/embed/XWVJbde?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/XWVJbde">
  mask-demo4</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

不支持动画的属性要想用动画，则需要`@property`属性了,该属性再css变量相关介绍过，可自行查看

``` css
@property --length-0{
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

@property --length-5{
  syntax: '<percentage>';
  inherits: false;
  initial-value: 5%;
}

div{
  animation: maskMove 2s linear both infinite ;
  -webkit-mask: linear-gradient(45deg, #000 var(--length-0), transparent  var(--length-5), transparent  var(--length-5));
}

@keyframes maskMove {
  0% {
    --length-0:0%;
    --length-5:5%;
  }

  100% {
    --length-0:100%;
    --length-5:105%;
  }
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="mask-demo5" src="https://codepen.io/WFFMLOVE/embed/KKZwpWN?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/KKZwpWN">
  mask-demo5</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

上面这种方式可能一下子想不到，更常见的方式应该是下面这种，我们将动画无限细分，使其看起来流畅。

```css 
@keyframes {
  0% {
    mask: linear-gradient(45deg, #000 0%, transparent 5%, transparent 5%);
  }
  1% {
    mask: linear-gradient(45deg, #000 1%, transparent 6%, transparent 6%);
  }
  ...
  100% {
    mask: linear-gradient(45deg, #000 100%, transparent 105%, transparent 105%);
  }
}
```

如果使用了预处理器，就可以使用它的循环功能

``` scss
@keyframes mask-animation {
  @for $i from 0 through 100 {
    #{$i + "%"} {
      mask: linear-gradient(
        45deg,
        #000 #{$i + "%"},
        transparent #{$i + "%"},
        transparent 1%
      );
    }
  }
```

<iframe height="300" style="width: 100%;" scrolling="no" title="mask-demo6" src="https://codepen.io/WFFMLOVE/embed/BaJyNZN?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/BaJyNZN">
  mask-demo6</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


#### 径向切换

上面使用的是线性渐变，当然了，径向渐变我们也试试他的效果。

<iframe height="300" style="width: 100%;" scrolling="no" title="mask-demo7" src="https://codepen.io/WFFMLOVE/embed/popvJaP?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/popvJaP">
  mask-demo7</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


这样效果的其他方案就不列举了，有兴趣可以自行尝试。


#### 圆锥切换

最后一个渐变，圆锥渐变，原理一样，直接看效果。


<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/WFFMLOVE/embed/mdpyVep?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/mdpyVep">
  Untitled</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>



#### 头像附加效果

之前wx上特别火的一个效果，头像左上角带个国旗,原理和上面的基本类似

<iframe height="300" style="width: 100%;" scrolling="no" title="mask-demo9" src="https://codepen.io/WFFMLOVE/embed/WNdbrEW?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/WNdbrEW">
  mask-demo9</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

#### 复杂的切换

图片与 mask 生成的渐变的 transparent 的重叠部分，将会变得透明。

也可以作用于 mask 属性传入的图片。也就是说，mask 是可以传入图片素材的，并且遵循 background-image 与 mask 图片的透明重叠部分，将会变得透明。

比如有张这样的图片

![86525710-39709f80-bebd-11ea-9c8d-79367cc070cd.png](https://s2.loli.net/2022/03/14/D1JU3ExH7nPrcR9.png)

使用逐帧动画就可以实现不规则的切换。

<iframe height=500" style="width: 100%;" scrolling="no" title="mask-demo10" src="https://codepen.io/WFFMLOVE/embed/QWawyme?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/QWawyme">
  mask-demo10</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

#### 防遮弹幕

视频弹幕中，弹幕碰到人物，自动被隐藏过滤。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/WFFMLOVE/embed/KKZwVbp?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/KKZwVbp">
  Untitled</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

在实际生产环境中，mask 图片的参数，其实是由后端实时对视频进行处理计算出来的，然后传给前端，前端再进行渲染。

对于运用了这项技术的直播网站，我们可以审查元素，看到包裹弹幕的容器的 mask 属性，每时每刻都在发生变化：


![](https://pic.imgdb.cn/item/622ee9735baa1a80abb6c65d.gif)

这样，根据视频人物的实时位置变化，不断计算新的 mask，再实时作用于弹幕容器之上，实现遮罩过滤。

## 总结



