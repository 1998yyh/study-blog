# 苹果的时钟效果

文章来源于 <https://cloudfour.com/thinks/the-power-of-css-blend-modes/?utm_source=CSS-Weekly&utm_campaign=Issue-522&utm_medium=email>

## 思路

1. 使用径向渐变在灰白之间交替 `background: repeating-radial-gradient(circle at -150% -25%, #fff, #777 0.025em, #fff 0.05em);` 这样我们就能得到最底层

2. 上面一层显示HTML文本, 做一些模糊处理(为了后面使用滤镜实现效果),透明(可以显示底部效果), 旋转(为了适配径向渐变角度)

```css
filter: blur(0.0125em);
transform: rotate(6deg);
opacity: 0.46;
```

3. 然后我们往上面覆盖一层彩色的渐变 `background: repeating-radial-gradient(circle at -150% -25%, #f7b232 0em, #f7b232 0.05em, #e12626 0.05em, #e12626 0.1em, #733d2c 0.1em, #733d2c 0.15em, #2b1d1d 0.15em, #2b1d1d 0.2em, #511c69 0.2em, #511c69 0.25em, #1c73c4 0.25em, #1c73c4 0.3em, #a0cdfb 0.3em, #a0cdfb 0.35em, #69d6ad 0.35em, #69d6ad 0.4em, #ffcd04 0.4em, #ffcd04 0.45em, #fbaaaa 0.45em, #fbaaaa 0.5em);`

这时候我们使用混合 `mix-blend-mode: lighten;`

他的计算公式为 `C = Max(A,B)`

4. 给容器增加一个极端的对比度过滤器 `filter: contrast(2000%);`

这使得背景和文本中所有的灰色都变成纯黑色或纯白色ーー以及它们重叠的任何地方，得到了整洁的效果，使得线条看起来像是在变粗或变细，从而形成数字，而彩虹覆盖使得每一行成为一个单一的纯色。

## 代码

```HTML
 <style>
     html {
         font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif;
     }

     html,
     body {
         height: 100%;
         width: 100%;
         overflow: hidden;
     }

     ::selection {
         background: #000;
         color: #858585;
     }

     .clock {
         font-size: 45vmin;
         line-height: 0.8;
         position: static;
         top: 0;
         bottom: 0;
         left: 0;
         right: 0;
         font-style: italic;
         font-weight: 1000;
         letter-spacing: -0.05em;
         font-variant-numeric: tabular-nums;
         overflow: hidden;
     }

     .clock-inner {
         position: absolute;
         top: 0;
         bottom: 0;
         left: 0;
         right: 0;
         display: grid;
         place-content: center;
         background: repeating-radial-gradient(circle at -150% -25%, #fff, #777 0.025em, #fff 0.05em);
         /* filter: contrast(2000%); */
     }

     .numbers {
         font-size: 1em;
         filter: blur(0.0125em);
         transform: rotate(6deg);
         opacity: 0.46;
     }

     .hour {
         transform: translatex(0.2em);
     }

     .min {
         transform: translatex(-0.2em);
     }

     .clock-overlay {
         position: absolute;
         top: 0;
         bottom: 0;
         left: 0;
         right: 0;
         mix-blend-mode: lighten;
         pointer-events: none;
         background: repeating-radial-gradient(circle at -150% -25%, #f7b232 0em, #f7b232 0.05em, #e12626 0.05em, #e12626 0.1em, #733d2c 0.1em, #733d2c 0.15em, #2b1d1d 0.15em, #2b1d1d 0.2em, #511c69 0.2em, #511c69 0.25em, #1c73c4 0.25em, #1c73c4 0.3em, #a0cdfb 0.3em, #a0cdfb 0.35em, #69d6ad 0.35em, #69d6ad 0.4em, #ffcd04 0.4em, #ffcd04 0.45em, #fbaaaa 0.45em, #fbaaaa 0.5em);
     }
 </style>
 <div class="clock">
     <div class="clock-inner">
         <div class="numbers" contenteditable>
             <div class="hour" id="hour">9</div>
             <div class="min" id="min">41</div>
         </div>
     </div>
     <div class="clock-overlay"></div>
 </div>
 <script>
     var time = new Date();

     h = time.getHours();
     m = time.getMinutes();

     document.getElementById("hour").innerHTML = h;
     document.getElementById("min").innerHTML = m;
 </script>
```


## 效果

<iframe height="500" style="width: 100%;" scrolling="no" title="Apple inspired Pride clock" src="https://codepen.io/WFFMLOVE/embed/ExLQJPv?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/ExLQJPv">
  Apple inspired Pride clock</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
