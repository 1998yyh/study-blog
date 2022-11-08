# version-badge 

先看效果 

![](https://pic1.imgdb.cn/item/6369f60816f2c2beb1c7595b.jpg)

## 要点

1. 渐变边框:

* 根据效果图看得出来 v3.2的边框是渐变的 并且连续 显然不是`border`属性能够做到的. 其实是通过定位, 在元素底部放一个线性渐变且比内容区域大1px的元素, 具体代码如下

```css
div::before {
    content: "";
    position: absolute;
    z-index: -1;
    background: linear-gradient(30deg, #7f6dc5 60%, white);
    top: -1px;
    right: -1px;
    bottom: -1px;
    left: -1px;
    border-radius: 999px;
}
```

2. 右上角四角星 通过伪类`::before`,`::after`旋转角度和定位 可以实现, 实现中间粗两边细,同样可以使用渐变

```css
span {
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.7), transparent);
}
```

## 代码

```html
<style>
    * {
        box-sizing: border-box;
    }

    .v-badge {
        position: relative;
        text-decoration: none;
        padding: 8px 16px;
        color: white;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        background: linear-gradient(to bottom, #725fbf, #5340a1);
        border-radius: 999px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        user-select: none;
    }

    .v-badge span {
        width: 25px;
        height: 25px;
        position: absolute;
        top: -12px;
        right: -2px;
        transform: rotate(-20deg);
        filter: blur(0.5px);
    }

    .v-badge span:before,
    .v-badge span:after {
        content: "";
        position: absolute;
    }

    .v-badge span:before {
        width: 1px;
        height: 100%;
        left: 12px;
        background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.7), transparent);
    }

    .v-badge span:after {
        width: 100%;
        height: 1px;
        top: 12px;
        background: linear-gradient(to left, transparent, rgba(255, 255, 255, 0.7), transparent);
    }

    .v-badge:before {
        content: "";
        position: absolute;
        z-index: -1;
        background: linear-gradient(30deg, #7f6dc5 60%, white);
        top: -1px;
        right: -1px;
        bottom: -1px;
        left: -1px;
        border-radius: 999px;
    }
</style>
<div href="#" class="v-badge">
    v3.2
    <span></span>
</div>
```

## 加点动画

我们可以通过 @property 加点动画 让渐变边框动起来

## pen

<iframe height="300" style="width: 100%;" scrolling="no" title="fork 'Version Badge' with transtion" src="https://codepen.io/WFFMLOVE/embed/GRGNQBY?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/GRGNQBY">
  fork 'Version Badge' with transtion</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>



