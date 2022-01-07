# SVG滤镜

首先，CSS3支持的所有这些滤镜SVG都是可以实现的，“可以实现”。但是如果要问容不容易实现呢，那和CSS比，那就是雅思跟四级的区别，除了高斯模糊等少数几个滤镜，其他滤镜效果只要自己重新进行组合定制。

这并不是说SVG滤镜不好，而是本身定位和策略的差异。

SVG滤镜提供的是更基础，更底层的控制手段；而CSS的这些滤镜是看成是经过封装处理后暴露的高度定制的API。你可以看成是原生JavaScript和jQuery的区别。

例如SVG滤镜可以对特定通道颜色进行细致的处理，比方说把图片里面所有红色全部去掉。但是在CSS中，目前却没有这样的功能。

### SVG 滤镜的语法

我们需要使用 `<defs>` 和 `<filter>` 标签来定义一个 SVG 滤镜。
SVG 滤镜元素都需要定义在 `<defs>` 标记内。

### 滤镜标签通用属性

| 属性          | 作用                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| x, y          | 提供左上角的坐标来定义在哪里渲染滤镜效果。 （默认值：0）               |
| width, height | 绘制滤镜容器框的高宽（默认都为 100%）                                  |
| result        | 用于定义一个滤镜效果的输出名字，以便将其用作另一个滤镜效果的输入（in） |
| in            | 指定滤镜效果的输入源，可以是某个滤镜导出的 result，也可以是下面 6 个值 |

### in 属性的 6 个取值

| 属性            | 作用                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| SourceGraphic   | 该关键词表示图形元素自身将作为 `<filter>` 原语的原始输入                                                                                     |
| SourceAlpha     | 该关键词表示图形元素自身将作为 `<filter>` 原语的原始输入。SourceAlpha 与 SourceGraphic 具有相同的规则除了 SourceAlpha 只使用元素的非透明部分 |
| BackgroundImage | 与 SourceGraphic 类似，但可在背景上使用。 需要显式设置                                                                                     |
| BackgroundAlpha | 提供左上角的坐标来定义在哪里渲染滤镜效果                                                                                                   |
| FillPaint       | 将其放置在无限平面上一样使用填充油漆                                                                                                       |
| StrokePaint     | 将其放在无限平面上一样使用描边绘画   

## feGaussianBlur  模糊滤镜

feGaussianBlur 高斯模糊有两个属性
in:  SourceGraphic  模糊效果要应用于整个图片
stdDeviation:  指明模糊的程度

```html
<filter id="blur">
    <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
</filter>
```

## feOffset  位移滤镜

dx： x轴平移
dy:  y轴平移

```html
<filter id="MyFilter">
    <feOffset in="blur" dx="10" dy="10" result="offsetBlur" />
</filter>
```

## feMerge 多滤镜叠加

创建 feMergeNode
in: SourceAlpha 图像的 alpha 通道
result: '自定义名称' 生成了 自定义名称的临时缓冲区 也称为 primitives 图元

feMerge 滤镜允许同时应用滤镜效果而不是按顺序应用滤镜效果。利用 result 存储别的滤镜的输出可以实现这一点，然后在一个 `<feMergeNode>` 子元素中访问它。

整体再遵循后输入的层级越高的原则，最终得到上述结果。

    

```html
    <filter id="MyFilter">
        <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
        <feOffset in="blur" dx="10" dy="10" result="offsetBlur" />
        <feMerge>
            <feMergeNode in="offsetBlur" />
            <feMergeNode in="SourceGraphic" />
        </feMerge>
    </filter>
```

[点此查看](http://localhost:3001/#/share/offset)

 ## feBlend 混合滤镜
 

```html
       <svg>
           <defs>
               <filter id="blend" x="0" y="0" width="200" height="250">
                   <feImage width="200" height="250" xlink:href="https://img0.baidu.com/it/u=1930278100,3700472910&fm=26&fmt=auto&gp=0.jpg" result="img1" />
                   <feImage width="200" height="250" xlink:href="https://img1.baidu.com/it/u=1814718469,2187171273&fm=15&fmt=auto&gp=0.jpg" result="img2" />
                   <feBlend mode="multiply" in="img1" in2="img2" />
               </filter>
           </defs>
       </svg>
```

* normal — 正常
* multiply — 正片叠底
* screen — 滤色
* darken — 变暗
* lighten— 变亮

[点此查看](http://localhost:3001/#/share/blend)

## feColorMatrix 转换矩阵对颜色进行变换

`<feColorMatrix>` 滤镜也是 SVG 滤镜中非常有意思的一个滤镜，顾名思义，它的名字中包含了矩阵这个单词，表示该滤镜基于转换矩阵对颜色进行变换。每一像素的颜色值(一个表示为[红, 绿, 蓝, 透明度] 的矢量) 都经过矩阵乘法 (matrix multiplated) 计算出的新颜色。

`<feColorMatrix>` 滤镜有 2 个私有属性 type 和 values，type 它支持 4 种不同的类型：saturate | hueRotate | luminanceToAlpha | matrix，

| type 类型        | 作用                                  | values 的取值范围                  |
| ---------------- | ------------------------------------- | ---------------------------------- |
| saturate         | 转换图像饱和度                        | 0.0 - 1.0                          |
| hueRotate        | 转换图像色相                          | 0 - 360                            |
| luminanceToAlpha | 阿尔法通道亮度（不知道如何翻译 :sad） | 只有一个效果，无需改变 values 的值 |
| matrix           | 使用矩阵函数进行色彩变换              | 需要应用一个 4 x 5 的矩阵          |

数字图像的本质是一个多维矩阵。在图像显示时，我们把图像的 R 分量放进红色通道里，B 分量放进蓝色通道里，G 分量放进绿色通道里。经过一系列处理，显示在屏幕上的就是我们所看到的彩色图像了。

而 feColorMatrix 中的 matrix 矩阵，就是用来表示不同通道的值每一个分量的值，最终通过计算得到我们熟知的 rgba() 值。

计算逻辑为

```javascript
/* R G B A 1 */
1 0 0 0 0 // R = 1*R + 0*G + 0*B + 0*A + 0 
0 1 0 0 0 // G = 0*R + 1*G + 0*B + 0*A + 0 
0 0 1 0 0 // B = 0*R + 0*G + 1*B + 0*A + 0 
0 0 0 1 0 // A = 0*R + 0*G + 0*B + 1*A + 0
```

[点此查看](http://localhost:3001/#/share/colorMatrix)

## feSpecularLighting/feDiffuseLighting 光照滤镜

feDiffuseLighting：来自外部光源，适合模拟太阳光或者灯光照明
specularExponent: 属性控制光源的焦点，较大的值表示更“闪亮”的光线。  范围在1.0 - 128.0之间
specularConstant：指定KS值
`<fePointLight>` SVG滤镜基元允许创建点光源效果。

feSpecularLighting：指定从反射面反射的二次光

* feDiffuseLighting
滤镜光照一个图像，使用alpha通道作为隆起映射。结果图像，是一个RGBA不透明图像，取决于光的颜色、光的位置以及输入隆起映射的表面几何形状。

## feMorphology 

feMorphology 为形态滤镜，它的输入源通常是图形的 alpha 通道，用来它的两个操作可以使源图形腐蚀（变薄）或扩张（加粗）。

使用属性 operator 确定是要腐蚀效果还是扩张效果。使用属性 radius 表示效果的程度，可以理解为笔触的大小。

operator：erode 腐蚀模式，dilate 为扩张模式，默认为 erode
radius：笔触的大小，接受一个数字，表示该模式下的效果程度，默认为 0

如果是图像
对于 erode 模式，会将图片的每一个像素向更暗更透明的方向变化，
而 dilate 模式，则是将每个向像素周围附近更亮更不透明的方向变化

```html
<svg width="0" height="0">
    <filter id="dilate">
        <feMorphology in="SourceGraphic" operator="dilate" :radius="Morphology['radius3'] / 30"></feMorphology>
    </filter>
    <filter id="erode">
        <feMorphology in="SourceGraphic" operator="erode" :radius="Morphology['radius4'] / 30"></feMorphology>
    </filter>
</svg>
```

[点此查看](http://localhost:3001/#/share/morphology)

## feDisplacementMap 滤镜

feDisplacementMap实际上是一个位置替换滤镜，就是改变元素和图形的像素位置的。

map含义和ES5中数组的map方法是一样的，遍历原图形的所有像素点，使用feDisplacementMap重新映射替换一个新的位置，形成一个新的图形。

feDisplacementMap对图形进行位置隐射 公式如下：
P'(x, y) ← P( x + scale * (XC(x, y) - 0.5), y + scale * (YC(x, y) - 0.5))

* P'(x, y)指的是转换之后的x, y坐标。
* x + scale * (XC(x, y) - 0.5), y + scale * (YC(x, y) - 0.5)指的是具体的转换规则。
* XC(x, y)表示当前x, y坐标像素点其X轴方向上设置的对应通道的计算值，范围是0~1。
* YC(x, y)表示当前x, y坐标像素点其Y轴方向上设置的对应通道的计算值，范围是0~1。
* -0.5是偏移值，因此XC(x, y) - 0.5范围是-0.5~0.5，YC(x, y) - 0.5范围也是-0.5~0.5。
* scale表示计算后的偏移值相乘的比例，scale越大，则偏移越大。

```html
<feDisplacementMap xChannelSelector="G" yChannelSelector="R" color-interpolation-filters="sRGB" in="SourceGraphic" in2="ripple" scale="80"></feDisplacementMap>
<!-- xChannelSelector对应XC(x,y)，表示X轴坐标使用的是哪个颜色通道进行位置偏移。yChannelSelector和xChannelSelector类似 -->
<!-- color-interpolation-filters表示滤镜对颜色进行计算时候采用的颜色模式类型。分为linearRGB（默认值）和sRGB -->
<!-- in和in2都表示输入，支持的属性值也都是一样的，包括固定的属性值关键字SourceGraphic，SourceAlpha，BackgroundImage，BackgroundAlpha，FillPaint，StrokePaint；以及自定义的滤镜的原始引用 -->
<!-- scale很好理解，就是公式里面的缩放比例，可正可负，默认是0。通常使用正数值处理，值越大，偏移越大 -->
```

[点此查看](http://localhost:3001/#/share/displacementMap)

## feTurbulence 滤镜

##### 常见的光影效果

1. 彩色阴影
<img src='./public/svg/texture2.image' style='display:block'>

2. 倒影
<img src='./public/svg/texture3.image' style='display:block'>

3. 扫光动画
<img src='./public/svg/texture.image' style='display:block'>

以上提到的几种绘制光影的方法，主要用来传达物体的形状及位置。比方说，倒影和渐变高光可以用来传达物体的质感，展示物体光滑到足以发生镜面反射的表面。当然，这是理想情况。现实中的物体很少有平滑的表面，就算肉眼可见的光滑表面，微观上而言也是坑坑洼洼不堪入目。CSS 去模拟高级光影，首先碰到的难题就是如何处理磨砂表面

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab89b1f789d8415f8323b29038f25e4e~tplv-k3u1fbpfcp-zoom-1.image)

turbulence 意为湍流，不稳定气流，而 SVG `<feTurbulence>` 滤镜能够实现半透明的烟熏或波状图像。 通常用于实现一些特殊的纹理。滤镜利用 Perlin 噪声函数创建了一个图像。噪声在模拟云雾效果时非常有用，能产生非常复杂的质感，利用它可以实现了人造纹理比如说云纹、大理石纹的合成。

<!-- ##### Perlin湍流算法/Perlin噪声算法 -->

有了 feTurbulence，我们可以自使用 SVG 创建纹理图形作为置换图，而不需要借助外部图形的纹理效果，即可创建复杂的图形效果。
feTurbulence 有三个属性是我们特别需要注意的：type、baseFrequency、numOctaves：

type：实现的滤镜的类型，可选fractalNoise 分形噪声，或者是 turbulence 湍流噪声。
fractalNoise：分形噪声更加的平滑，它产生的噪声质感更接近云雾
turbulence：湍流噪声

* baseFrequency： 表示噪声函数的基本频率的参数，频率越小，产生的图形越大，频率越大，产生的噪声越复杂其图形也越小越精细，通常的取值范围在 0.02 ~ 0.2
* numOctaves：表示噪声函数的精细度，数值越高，产生的噪声更详细。 默认值为1
* numOctaves的属性值大到一定程度后，就看不到明显变化了，具体多大的值和baseFrequency属性的值密切相关，根据测试和肉眼识别
* baseFrequency值是0.05，如果numOctaves的属性值大于3，例如4或者5，渲染效果和3没有区别。
* baseFrequency值是0.02，如果numOctaves的属性值为4，我们还是可以看到微小的变化，如果值为5，则几乎看不出和4有什么区别。
* baseFrequency值是0.01，如果numOctaves的属性值是4或者5的时候都可以看到一些细小的变化。

<img src='https://image.zhangxinxu.com/image/blog/202008/2020-08-06_221103.jpg'>

```html
<svg width="0" height="0">
    <filter id="surface">
        <feTurbulence type="fractalNoise" baseFrequency='0.03 0.06' numOctaves="30" />
        <feDiffuseLighting lighting-color='#ffe8d5' surfaceScale='2'>
            <feDistantLight elevation='10' />
        </feDiffuseLighting>
    </filter>
</svg>
```

<img src='./public/svg/texture4.png' style='display:block'>
先试试降低灯光到表面的距离（减小 elevation）以增加高光面和阴影面的对比度。获得了以下看起来像是某种土壤的纹理。
<img src='https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1947bfdb34cf4b84ae03435b770dc4e7~tplv-k3u1fbpfcp-zoom-1.image' style='display:block'>

接下来拉高灯光，调整光照颜色（lighting-color），再把纹理弄粗糙一些（减小 baseFrequency），获得了类似大理石的纹理（也许有点像白色的牛皮纸）。
<img src='https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7393d8b396e147d08cb9986de2434c3c~tplv-k3u1fbpfcp-zoom-1.image' style='display:block'>

增加 baseFrequency、调整表面基准高度 surfaceScale 获得平滑纹理，再调整灯光高度降低高光和阴影的对比度，得到了白石灰墙壁纹理。
<img src='https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc930c7995644780875fc70e5bd9a59d~tplv-k3u1fbpfcp-zoom-1.image' style='display:block'>

#### 生成云
``` html
<div class="cloud2" id="cloud-back"></div>
<svg width="0" height="0">
    <filter id="filter-back">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="0" />
        <feDisplacementMap in="SourceGraphic" scale="170" />
    </filter>
</svg>
<style>
#cloud-back {
    width: 500px;
    height: 275px;
    border-radius: 50%;
    filter: url(#filter-back);
    box-shadow: 300px 300px 30px -20px #fff;
    /* 也可以使用渐变 */
}
</style>
```

[点此查看](http://localhost:3001/#/share/cloud)

