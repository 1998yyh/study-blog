# 创建带有动画的复选框

## 要点

* 使用`<svg>`元素创建检查`<symbol>`并通过`<use>`元素插入以创建可重用的 SVG 图标。
* 创建一个`.checkbox-container`并使用 `flexbox` 为复选框创建适当的布局。
* 隐藏`<input>`元素并使用label与之关联的元素来显示复选框和提供的文本。
* 用于`stroke-dashoffset`在状态更改时为复选符号设置动画。
* 通过 CSS 动画使用transform: scale(0.9)来创建缩放动画效果。


## 代码
有几个属性介绍一下
* `stroke-linecap`:在开放子路径被设置描边的情况下，用于开放自路径两端的形状
* `stroke-linejoin`:指明路径的转角处使用的形状或者绘制的基础形状。

``` html
<svg class="checkbox-symbol">
  <symbol id="check" viewbox="0 0 12 10">
    <polyline
      points="1.5 6 4.5 9 10.5 1"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    ></polyline>
  </symbol>
</svg>

<div class="checkbox-container">
  <input class="checkbox-input" id="apples" type="checkbox" />
  <label class="checkbox" for="apples">
    <span>
      <svg width="12px" height="10px">
        <use xlink:href="#check"></use>
      </svg>
    </span>
    <span>Apples</span>
  </label>
  <input class="checkbox-input" id="oranges" type="checkbox" />
  <label class="checkbox" for="oranges">
    <span>
      <svg width="12px" height="10px">
        <use xlink:href="#check"></use>
      </svg>
    </span>
    <span>Oranges</span>
  </label>
</div>

```

``` css

.checkbox-symbol {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  user-select: none;
}

.checkbox-container {
  box-sizing: border-box;
  background: #ffffff;
  color: #222;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row wrap;
}

.checkbox-container * {
  box-sizing: border-box;
}

.checkbox-input {
  position: absolute;
  visibility: hidden;
}

.checkbox {
  user-select: none;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
}

.checkbox:not(:last-child) {
  margin-right: 6px;
}

.checkbox:hover {
  background: rgba(0, 119, 255, 0.06);
}

.checkbox span {
  vertical-align: middle;
  transform: translate3d(0, 0, 0);
}

.checkbox span:first-child {
  position: relative;
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  transform: scale(1);
  border: 1px solid #cccfdb;
  transition: all 0.3s ease;
}

.checkbox span:first-child svg {
  position: absolute;
  top: 3px;
  left: 2px;
  fill: none;
  stroke: #fff;
  stroke-dasharray: 16px;
  stroke-dashoffset: 16px;
  transition: all 0.3s ease;
  transform: translate3d(0, 0, 0);
}

.checkbox span:last-child {
  padding-left: 8px;
  line-height: 18px;
}

.checkbox:hover span:first-child {
  border-color: #0077ff;
}

.checkbox-input:checked + .checkbox span:first-child {
  background: #0077ff;
  border-color: #0077ff;
  animation: zoom-in-out 0.3s ease;
}

.checkbox-input:checked + .checkbox span:first-child svg {
  stroke-dashoffset: 0;
}

@keyframes zoom-in-out {
  50% {
    transform: scale(0.9);
  }
}
```


## 最终效果

<iframe height="300" style="width: 100%;" scrolling="no" title="checkbox" src="https://codepen.io/WFFMLOVE/embed/NWaVWWY?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/NWaVWWY">
  checkbox</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>