# 根据背景颜色深浅 切换文字颜色的黑白

我们的需求是 : 当背景是深色时，文字为白色，当背景是浅色时，文字为黑色

看一下效果 

![](https://pic.imgdb.cn/item/63ef42acf144a01007773fcd.gif)


## js做法

通常这种情况，大家可能会通过 js 去计算背景色的深浅度（灰度），算法是公开的，如果已知颜色的RGB值，那么可以通过以下方式得到颜色灰度

``` js
luma = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255
```
这样就可以得到一个 0~1之间的范围值 , 可以根据需求 ,设定一个阀值 , 超过表示为浅色, 否则为深色

## css 滤镜实现

我们有这样一个HTML

``` html
<div class="box">
  <span class="txt">ready</span>
</div>
```

然后，容器和文字用同一种颜色表示，目的是让文字颜色和背景相关联，可以通过currentColor实现

``` css
.box{
  color: #ffeb3b;
  background-color: currentColor;
}
```

接下来可以想一下，如何让彩色文字变成黑白？

提到黑白，可以想到灰度滤镜（grayscale），相信大家前几天都用到过，这样可以将彩色的文字转换成灰色

``` css
.text{
  filter: grayscale(1)
}
```

这种灰色在现在这种背景下太难看清了，我们需要的是纯正的黑色或者白色，现在只是灰色，如何“加强”一下呢？

这时，我们可以用到对比度滤镜（contrast），在前面的基础上再叠加一层

``` css
.text{
  filter: grayscale(1) contrast(999)
}
```

这里的对比度给的比较大，这样就会极大的增强对比度，黑的更黑，白的更白，如果是浅灰，那就变成白色，如果是深灰，那就变成黑色

由于前面的操作是将原有颜色经过滤镜转换成了和自身相对应的白色或者黑色，但是是相反的，所以需要用到反转滤镜（invert），颠倒黑白

```css
.text{
  filter: grayscale(1) contrast(999) invert(1)
}
```



## css其他思路

除了上面这种方式，还可以通过 CSS 变量来实现，要复杂一些。

这里简单介绍一下实现思路

1. 将颜色RGB值拆分成 3 个独立的 CSS变量
2. 通过灰度算法，用 CSS 计算函数算出灰度
3. 用得到的灰度和阈值做差值，通过hsl模式转换成纯黑和纯白

``` css
:root {
  /* 定义RGB变量 */
  --red: 44;
  --green: 135;
  --blue: 255;
  /* 文字颜色变色的临界值，建议0.5~0.6 */
  --threshold: 0.5;
}

.btn {
  /* 按钮背景色就是基本背景色 */
  background: rgb(var(--red), var(--green), var(--blue));

  /** 
   * 使用sRGB Luma方法计算灰度（可以看成亮度）
   * 算法为：
   * lightness = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255
  */
  --r: calc(var(--red) * 0.2126);
  --g: calc(var(--green) * 0.7152);
  --b: calc(var(--blue) * 0.0722);
  --sum: calc(var(--r) + var(--g) + var(--b));
  --lightness: calc(var(--sum) / 255);
  
  /* 设置颜色 */
  color: hsl(0, 0%, calc((var(--lightness) - var(--threshold)) * -999999%));
}
```


## 对比度函数 

CSS 正在起草一个颜色对比函数color-contrast，可以从几个颜色中自动选择对比度最高的那个，实现是这样的

``` css
.text-contrast-primary {
  color: color-contrast(var(--theme-primary) vs white, black);
}
```