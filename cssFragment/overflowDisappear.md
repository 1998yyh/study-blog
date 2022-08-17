# overflow-disappear


## 要点

* 通过设置变量 设置遮挡dom颜色和背景色一致 
* 伪类定位在右侧底部, 背景渐变遮挡


## 代码

```html
<div class="card">
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore consectetur temporibus quae aliquam nobis nam
    accusantium, minima quam iste magnam autem neque laborum nulla esse cupiditate modi impedit sapiente vero?</p>
</div>
```

``` css
:root {
    --base: 1.35;
    /* Handy multiplier for consistency across elements */
    --background:black;
  }

  body {
    background-image: radial-gradient(circle at top, #222, var(--background));
    display: grid;
    height: 100vh;
    place-items: center;
  }

  .card {
    background-color: var(--background);
    border: 2px solid lch(100% 0 0 / 0.25);
    border-radius: 16px;
    color: lch(100% 0 0 / 0.85);
    font-size: calc(1rem * var(--base));
    line-height: var(--base);
    max-width: 35ch;
    padding: calc(1rem * var(--base));
  }

  .card p {
    max-height: calc(4rem * var(--base));
    overflow: hidden;
    color: #fff;
    position: relative;
  }

  .card p:after {
    content: "";
    background: linear-gradient(to right, transparent, var(--background) 80%);
    display: block;
    height: calc(1rem * var(--base) + 1px);
    position: absolute;
    inset-block-end: 0;
    pointer-events: none;
    width: 100%;
  }
```

## 最终效果

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/WFFMLOVE/embed/RwMqXbQ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/RwMqXbQ">
  Untitled</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>