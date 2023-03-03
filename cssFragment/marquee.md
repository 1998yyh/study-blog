# marquee 

不定宽文本溢出跑马灯

> 原文 [CSS 数学函数与容器查询实现不定宽文本溢出跑马灯效果](https://juejin.cn/post/7205604505646465081)

## 要点

1. 容器查询的新单位

* cqw 容器cqh 容器查询高度（Container Query Height）占比。1cqh 等于容器高度的 1%。
* cqi 表示容器查询内联方向尺寸（Container Query Inline-Size）占比。这个是逻辑属性单位，默认情况下等同于 cqw
* cqb 容器查询块级方向尺寸（Container Query Block-Size）占比。同上，默认情况下等同于 cqh
* cqmin 容器查询较小尺寸的（Container Query Min）占比。取 cqw 和 cqh 中较小的一个
* cqmax 表示容器查询较大尺寸的（Container Query Min）占比。取 cqw 和 cqh 中较大的一个

`width:100%` 对于span元素而言, 其文本长度就是整个的宽度 100% 代表的就是文本内容的长度
`width:100cqw` 表示的是设置了容器查询的 `.marquee` 的宽度 ( 父容器的宽度 )

2. css比较大小的数学函数

`max` , `min` 是css提供的两个比较大小的函数

```css
.wrap {
    translate: min(100% - 100cqw, 0px);
    /* 或者 */
    translate: max(100% - 100cqw, 0px);
}
```

## 结构

```html
<div class="marquee">
    <span>Lorem ipsum dolor sit amet elit. Animi, aliquid.<span>
</div>

<style>
    .marquee {
        display: flex;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        width: 200px;
        padding: 2px 4px;
        background-color: salmon;
        resize: horizontal;
        container-type: inline-size;
    }

    .marquee span {
        animation: marquee 3s linear infinite both alternate;
    }

    @keyframes marquee {
        to {
            transform: translateX(min(100cqw - 100%, 0px));
        }
    }
</style>
```

## 效果

<iframe height="300" style="width: 100%; " scrolling="no" title="Pure CSS Marquee" src="https://codepen.io/wheatup/embed/ZEMGaKw?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/wheatup/pen/ZEMGaKw">
  Pure CSS Marquee</a> by wheatup (<a href="https://codepen.io/wheatup">@wheatup</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
