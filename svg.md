# 什么是SVG
1. SVG 是一种开放标准的矢量图形语言，即表示可缩放矢量图形（Scalable Vector Graphics）格式
2. SVG 图像是矢量图像，可以无限缩小放大，所以 SVG 可以在任何分辨率的设备上高清显示，不需要再像以前一样输出各种 @2x 倍图来适配不同分辨率的屏幕。
3. 有非常成熟的设计工具支持导出 SVG 的图形格式，比如，AI 或者是 Sketch 等设计软件都支持直接导出 SVG 的图形格式，非常方便。
4. SVG 还是一种 XML 格式的图形，所以我们可以使用 CSS 和 JavaScript 与它们进行交互，这使得 SVG 在动画方面有着很大潜力和想象力。


下面是一个简易的SVG代码：

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="300" width='300' viewBox='0 0 300 300'>
    <circle cx="150" cy="150" r="60" stroke="black" stroke-width="2" fill="red" />
</svg>
```

![](public\svg\readme-demo1.svg)

* width 和 height 属性可设置此 SVG 文档的宽度和高度 
* version 属性可定义所使用的 SVG 版本(就两个版本 1.0 1.1) 基本没啥用
* xmlns 属性可定义 SVG 命名空间 防止用户代理无法试别内容
* viewBox有四个参数 (svg有个特点，在默认情况下，会调整这个viewBox的大小，让这个viewBox正好能被放进svg里去。)
    - 最小X轴数值；
    - 最小y轴数值；
    - 宽度；
    - 高度。
* preserveAspectRatio: 'xMinYMin meet/slice'
    - xMinYMin 将SVG元素的viewbox属性的X的最小值与视图的X的最小值对齐。将SVG元素的viewbox属性的Y的最小值与视图的Y的最小值对齐。
    - meet/slice 图形将缩放到整个SVG的viewbox在视图范围内是可见的 /  整个视图窗口将覆盖viewbox;(此处对比background-size的cover和contain 或者这 object-fit:cover/contain 效果一致)
    

[点此查看示例](http://localhost:3000)

## line

```html
    <svg viewBox="0 0 150 100">
        <line x1="10" y1="10" x2="140" y2="10" stroke="black" stroke-linecap="butt" stroke-dasharray="10" />
        <line x1="10" y1="80" x2="140" y2="80" stroke="black" stroke-dasharray="10,20,30,40" />
    </svg>
```

* x1 y1 表示起点坐标。
* x2 y2 表示终点坐标。
* stroke 线段填充颜色 支持rgba
* stroke-linecap 路径两端形状 round圆形 square方形  butt无
* stroke-dasharray:
  + stroke-dasharray为一个参数时： 其实是表示虚线长度和每段虚线之间的间距 
  + 两个参数或者多个参数时：一个表示长度，一个表示间距
* stroke-dashoffset: 是相对于起始点的偏移，正数偏移x值的时候，相当于往左移动了x个长度单位，负数偏移x的时候，相当于往右移动了x个长度单位

## rect

![](./public/svg/readme-demo2.svg)

```html
<svg viewBox="0 0 150 100">
    <rect x="20" y="20" stroke="rgba(0,0,0,.1)" stroke-width="20" width="60" height="60" fill="red" rx="20" ry="20" />
</svg>
```

* width 和 height 属性定义矩形的高度和宽度
* x 属性定义矩形的左侧位置
* y 属性定义矩形的顶端位置
* rx和ry属性产生圆角
* style 属性用来定义 CSS 属性
* fill 属性定义矩形的填充颜色（RGB 值、颜色名或者十六进制值）支持rgba
* stroke-width 属性定义矩形边框的宽度
* fill-opacity 属性定义填充颜色透明度
* stroke-opacity 属性定义笔触颜色的透明度

## circle

* cx和cy 表示圆心的位置.
* r表示半径

## ellipse

* rx 属性定义的水平半径
* ry 属性定义的垂直半径

## polygon
``` html
<svg viewBox="0 0 300 150">
    <polygon
    points="100,10 40,180 190,60 10,60 160,180"
    fill="lime"
    fill-rule='evenodd'
    />
</svg>
```
多边形是由直线组成，其形状是 封闭 的（所有的线条连接起来）
points 表示连接的顶点
fill-rule 属性为外观属性，它定义了用来确定一个多边形内部区域的算法
+ nonzero ：起始值为0，射线会和路径相交，如果路径方向和射线方向形成的是顺时针方向则+1，如果是逆时针方向则-1，最后如果数值为0，则是路径的外部；如果不是0，则是路径的内部，因此被称为“非0规则”
+ evenodd：起始值为0，射线会和路径相交，每交叉一条路径，我们计数就+1，最后看我们的总计算数值，如果是奇数，则认为是路径内部，如果是偶数，则认为是路径外部。

## path
注意：不需要手写 用工具导出
* M = moveto 移动到某个点
* L = lineto 直线画到某个点
* H = horizontal lineto 水平划线到某个点
* V = vertical lineto 垂直划到某个点
* C = curveto 三次贝塞尔曲线
* S = smooth curveto 简化的三次贝塞尔曲线
* Q = quadratic Bézier curve 二次贝塞尔曲线
* T = smooth quadratic Bézier curveto  简化的二次贝塞尔曲线
* Z = closepath 闭合路径


  <!-- https://c.runoob.com/more/svgeditor/ -->
上面所有命令均允许小写字母
大写表示绝对定位，小写表示相对定位

[在线编辑](https://c.runoob.com/more/svgeditor/)
