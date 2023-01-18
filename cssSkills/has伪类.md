# has 伪类

## 介绍

`:has()` CSS 伪类代表一个元素，其给定的选择器参数（相对于该元素的 :scope）至少匹配一个元素。

相当于我们常说的父元素选择器

1. 比如我们要选中 包含 `img` 元素的 `a` 元素 => `a:has(img)`
2. 比如我们要匹配 紧跟着 `p` 的 `h1` 元素 => `h1:has(+ p)`

> 兼容性要求需要 Chrome 101+，并且开始实验特性（105+正式支持），Safari 15.4+，

## 实际场景

### 1. require 表单

下面有个表单元素 用户名是必填项目 

我们需要在必填项目前加上 `*` 表示必填

```HTML
<style>
    label:has(+input[required]):before {
        content: "*";
        color: red;
    }
</style>
<div>
    <label>用户名:</label>
    <input type='text' required>
</div>
```

### 2. 多层级hover 

多层级的hover遇到的问题是 当hover到子元素的时候,父元素也会触发hover的效果.

```HTML
<style>
    div {
        display: inline-block;
        margin: 50px;
    }

    .box-3 {
        width: 200px;
        height: 200px;
        background: pink
    }

    .box-2 {
        background: rgb(113, 160, 179)
    }

    .box-1 {
        background: thistle
    }

    div:hover {
        outline: 2px dashed rebeccapurple
    }
</style>

<div class="box-1">
    <div class="box-2">
        <div class="box-3"></div>
    </div>
</div>
```


解决办法是:
```css
div:not(:has(:hover)):hover{ 
    outline:4px dashed rebeccapurple
}
```

`div:has(:hover)`表示有子元素正处于hover的div，比如当hover到box-3时，`div:has(:hover)`选中的就是除box-3以外的两个父级，然后加上:not就刚好反过来，只选中box-3本身

<style>
    div {
        display: inline-block;
        margin: 30px;
    }

    .box-3 {
        width: 100px;
        height: 100px;
        background: pink
    }

    .box-2 {
        background: rgb(113, 160, 179)
    }

    .box-1 {
        background: thistle
    }

    .old div:hover{
        outline: 2px dashed rebeccapurple
    }

    .new div:not(:has(:hover)):hover{ 
        outline:4px dashed rebeccapurple
    }
</style>

<div style="display:flex">
  <div class='old'>
    <div class="box-1">
        <div class="box-2">
            <div class="box-3"></div>
        </div>
    </div>
  </div>
  <div class='new'>
    <div class="box-1">
        <div class="box-2">
            <div class="box-3"></div>
        </div>
    </div>
  </div>
</div>



### 3. star 选中

``` html
<style>
  star {
    display: flex;
  }

  star [type="radio"] {
    appearance: none;
    width: 40px;
    height: 40px;
    margin: 0;
    cursor: pointer;
    background: #ccc;
    transition: 0.3s;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E %3Cpath d='M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z'%3E%3C/path%3E %3C/svg%3E") center / 80% no-repeat;
  }

  star [type="radio"]:hover,
  star [type="radio"]:has(~ :hover) {
    background: orangered;
  }

  star:not(:hover) [type="radio"]:checked,
  star:not(:hover) [type="radio"]:has(~ :checked) {
    background: orangered;
  }
</style>
<star>
  <input name="star" type="radio">
  <input name="star" type="radio">
  <input name="star" type="radio">
  <input name="star" type="radio">
  <input name="star" type="radio">
</star>
```

[type="radio"]:has(~:hover)表示选中当前hover元素之前的元素，所以可以轻易的实现评分的效果

<iframe height="300" style="width: 100%;" scrolling="no" title="star-radio" src="https://codepen.io/WFFMLOVE/embed/abGWYBM?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/abGWYBM">
  star-radio</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


### 4. 选中某个元素前的指定元素

``` html
<ul>
  <li class="hide-node"></li>
  <li class="show-node"></li>
  <li class="show-node"></li>
  <li class="show-node"></li>
  <li class="hide-node"></li>
  <li class="show-node"></li>
  <li class="show-node"></li>
  <li class="show-node"></li>
  <li class="hide-node"></li>
  <li class="show-node"></li>
</ul>
```

比如上面这个列表 我们希望选中每一个`.hide-node`最后的`.show-node` 

```css
.hide-node ~ .show-node:has(+:not(.show-node)), .show-node:last-child{
  background-color: green;
}
```
我们分析一下:
`.hide-node ~ .show-node` 选中的是`.hide-node`的兄弟元素`.show-node`
`:not(.show-node)`很简单 指的是 非`.show-node`的其他元素 任何都可以 
`:has(+ )` `+` 指的是紧密的兄弟元素 然后配合上 `not` 
连起来就是 选中`.hide-node`后面的 ( 紧挨着不是 `.show-node`元素 的) `.show-node`元素 

这样我们就选中了 所有的中间部分的元素了 

最后一个也很简单 `:last-child` 如果`.show-node`是最后一个元素 会被选中 如果不是 则会被中间的选中.

## 参考

1. CSS 有了:has伪类可以做些什么？ <https://juejin.cn/post/7143121853853204516>
2. css 中 hover 的问题 <https://segmentfault.com/q/1010000016225343/a-1020000042380822>
