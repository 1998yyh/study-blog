# 黑白雕刻图片

内容来源于 <https://cloudfour.com/thinks/the-power-of-css-blend-modes/?utm_source=CSS-Weekly&utm_campaign=Issue-522&utm_medium=email>

先看效果:

<img src='https://pic1.imgdb.cn/item/63355fc816f2c2beb14e6886.png' width='200' height='420'/> <img src='https://pic1.imgdb.cn/item/63355fc816f2c2beb14e688a.png' width='200' height='420'/>


## 思路

1. 第一步是完全相同的，在图片后面创建一个重复的径向渐变

2. 将图片放置到最上层并且增加一些滤镜. 增加灰度,调整亮度和对比度,并且增加模糊

3. 给整个容器增加极端的对比度过滤器

## 代码

```HTML
<style>
    .wrap {
        font-size: 12px;
        width: 200px;
        height: 420px;
        background: repeating-radial-gradient(circle at 0 -25%, #fff, #333 0.125em, #fff 0.25em);
        filter: contrast(500%);
    }

    .wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        mix-blend-mode: hard-light;
        filter: grayscale(1) brightness(90%) contrast(150%) blur(3px);
    }
</style>
<div class="wrap">
    <img src="https://pic1.imgdb.cn/item/6335560a16f2c2beb1432dec.png" alt="">
</div>
```


