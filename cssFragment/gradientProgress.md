# 创建带渐变的进度条

## 要点

* 使用`repeating-linear-gradient` 设置好相应的角度,创建水平的渐变.
* 使用`-webkit-mask-image` 设置对应的颜色,创建垂直的渐变.
* 使用`transform:translateX`设置进度


## 代码

```html
<div class="content">
  <div class="content-wrap">
    <div class="content-bar"></div>
  </div>
  <div class="content-text">50%</div>
</div>
```

``` css
:root{
  font-size: 100px;
}
.content-wrap {
  height: .22rem;
  background: linear-gradient(180deg, rgba(91, 115, 246, 0.4000) 0%, rgba(141, 185, 255, 0.3000) 51%, rgba(93, 118, 247, 0.4000) 100%);
  border-radius: .11rem;
  flex-grow: 1;
  overflow: hidden;
}

.content-bar {
  height: .22rem;
  background: repeating-linear-gradient(-55deg, #5B73F6, #5B73F6 9px, #ACCEFF 9px, #ACCEFF 18px);
  -webkit-mask-image: linear-gradient(180deg, #5B73F6, rgba(255, 255, 255, 0.5) 51%, #5D76F7 100%);
  border-radius: .11rem;
  transform: translateX(0);
  animation: move both linear infinite 4s;
}

.content-text {
  width: .68rem;
  font-size: .24rem;
  font-weight: bold;
  line-height: .32rem;
  color: #23C770;
  text-align: right;
}

.content {
  width: 500px;
  display: flex;
  align-items: center;
}


@keyframes move {
  from{
  transform: translateX(-100%);

  }
  to{
  transform: translateX(0);

  }
  
}
```

## 最终效果

<iframe height="300" style="width: 100%;" scrolling="no" title="gradientProgress" src="https://codepen.io/WFFMLOVE/embed/vYRjYKw?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/vYRjYKw">
  gradientProgress</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
