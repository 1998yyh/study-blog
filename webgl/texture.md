# 图像处理（纹理）

在WebGL中绘制图片需要使用纹理。和WebGL渲染时需要裁剪空间坐标相似， 渲染纹理时需要纹理坐标，而不是像素坐标。


## 坐标系统

纹理也有一套自己的坐标系统，为了和顶点坐标加以区分，通常把纹理坐标称为 UV，U 代表横轴坐标，V 代表纵轴坐标。

* 图片坐标系统的特点是：
  + 左上角为原点(0, 0)。
  + 向右为横轴正方向，横轴最大值为 1，即横轴坐标范围【1，0】。
  + 向下为纵轴正方向，纵轴最大值为 1，即纵轴坐标范围【0，1】。

* 纹理坐标系统不同于图片坐标系统，它的特点是：
  + 左下角为原点(0, 0)。
  + 向右为横轴正方向，横轴最大值为 1，即横轴坐标范围【1，0】。
  + 向上为纵轴正方向，纵轴最大值为 1，即纵轴坐标范围【0，1】。




## 绘制

我们只用画一个矩形（其实是两个三角形），所以需要告诉WebGL矩形中每个顶点对应的纹理坐标。 

我们将使用一种特殊的叫做'varying'的变量将纹理坐标从顶点着色器传到片断着色器，它叫做“可变量” 是因为它的值有很多个，WebGL会用顶点着色器中值的进行插值(例如我们设置渐变，只需要设置几个点的颜色就能自动生成一整条渐变带，这几个点之间的颜色都是通过内置插值得到的)，然后传给对应像素执行的片断着色器。

``` html
<script type="shader-source" id="vertexShader">
  precision mediump float;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main(){
    // 将纹理坐标传给片断着色器
    // GPU会在点之间进行插值
    v_texCoord = a_texCoord;
  }

</script>
<script type="shader-source" id="fragmentShader">
  precision mediump float;
  // 纹理
  varying vec2 v_texCoord;
  // 从顶点着色器传入的纹理坐标
  uniform sampler2D u_image;
  void main(){
    // 在纹理上寻找对应颜色值
    // 我们可以通过改变rgb的顺序来对换图片的颜色
    gl_FragColor = texture2D(u_image,v_texCoord).rgba;
    
  }
</script>
```

``` javascript
/** ... 前面省略  */
const positions = [
  30, 30, 0, 0, //V0
  30, 300, 0, 1, //V1
  300, 300, 1, 1, //V2
  30, 30, 0, 0, //V0
  300, 300, 1, 1, //V2
  300, 30, 1, 0 //V3
]
//创建buffer
const buffer = gl.createBuffer()
// 
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

const a_Position = gl.getAttribLocation(program, 'a_Position')
const a_Canvas_Size = gl.getAttribLocation(program, 'a_Canvas_Size')
const a_texCoord = gl.getAttribLocation(program, 'a_texCoord')
const u_image = gl.getUniformLocation(program, 'u_image')
gl.vertexAttrib2f(a_Canvas_Size, canvas.width, canvas.height)

gl.enableVertexAttribArray(a_Position)
gl.enableVertexAttribArray(a_texCoord)
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 16, 0);
gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 16, 8);

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

const img = new Image;
// 如果不做处理 纹理 所 需要的图片是 2的倍数的
img.src = '../images/wl.png'
img.onload = function () {
  const texture = gl.createTexture();
  // gl.TEXTURE_2D 当前纹理绑定点
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // 为片元着色器传递图片数据
  // 我们将 img 变量指向的图片数据传递给片元着色器，取对应纹理坐标的 RGBA 四个通道值，赋给片元，每个通道的数据格式是无符号单字节整数。
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  /** 这个配置只支持 2^n 的图片 */
  // gl.LINEAR 代表采用最靠近象素中心的四个象素的加权平均值，这种效果表现的更加平滑自然。 gl.NEAREST 采用最靠近象素中心的纹素，该算法可能使图像走样，但是执行效率高，不需要额外的计算。
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  /** 普遍性图片 */
  // // 纹理坐标水平填充 设置值为 贴近边缘
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // // 纹理坐标垂直填充 设置值为 贴近边缘
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // // 
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.uniform1i(u_image, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  if (positions.length <= 0) {
      return;
  }
  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 4);
}
```

## 卷积

什么是卷积矩阵？无需使用只有少数人知道的数学工具，就可以大致了解它。卷积是由另一个称为 “核”的矩阵对矩阵的处理。

卷积矩阵过滤器使用第一个矩阵，即要处理的图像。图像是直角坐标中像素的二维集合。使用的内核取决于您想要的效果。

过滤器依次研究图像的每个像素。对于它们中的每一个，我们将其称为“初始像素”，它将这个像素的值和周围 8 个像素的值乘以内核对应值。然后将结果相加，并将初始像素设置为此最终结果值。

过滤器从左到右和从上到下依次读取内核动作区域的所有像素。它将它们中的每一个的值乘以内核对应的值并添加结果。初始像素变成了42：(40*0)+(42*1)+(46*0) + (46*0)+(50*0)+(55*0) + (52*0)+( 56*0)+(58*0) = 42。（过滤器对图像不起作用，但对副本起作用）。作为图形结果，初始像素向下移动了一个像素。

<iframe height="750" style="width: 100%;" scrolling="no" title="learn-webgl3" src="https://codepen.io/WFFMLOVE/embed/JjOdrVE?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/JjOdrVE">
  learn-webgl3</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


## 新使用API说明

1. `WebGlRenderingContext.texImage2D()` 指定了 二维纹理图像。
+ 参数
  - `target` 指定纹理的绑定对象，可能的值:
    * `gl.TEXTURE_2D`:二维纹理贴图.
    * `gl.TEXTURE_CUBE_MAP_POSITIVE_X`:立方体映射纹理的正X面.
    * `gl.TEXTURE_CUBE_MAP_NEGATIVE_X`:立方体映射纹理的负X面.
    * `gl.TEXTURE_CUBE_MAP_POSITIVE_Y`:立方体映射纹理的正Y面.
    * `gl.TEXTURE_CUBE_MAP_NEGATIVE_Y`:立方体映射纹理的负Y面.
    * `gl.TEXTURE_CUBE_MAP_POSITIVE_Z`:立方体映射纹理的正Z面.
    * `gl.TEXTURE_CUBE_MAP_NEGATIVE_Z`:立方体映射纹理的负Z面.
  - `level`指定详细的级别，0级是基本图像的等级
  - `internalformat` 指定纹理中的颜色组件
  - `width` 指定纹理的宽度
  - `height` 指定纹理的高度
  - `border` 指定纹理的边框宽度,必须为0。
  - `format`指定`texel`数据格式,需要和`internalformat`保持一致
  - `type` 指定`texel`数据的数据类型，可能的值
  - `pixels` 指定像素来源


2. `WebGlRenderingContext.texParameteri()` 设置纹理参数
+ 参数 
  - `target` 指定绑定点。
    * `gl.TEXTURE_2D` 二维纹理
    * `gl.TEXTURE_CUBE_MAP`立方体纹理
    * `gl.TEXTURE_3D` 三维贴图
    * `gl.TEXTURE_2D_ARRAY` 二维数组贴图
  - `params` 纹理参数 
  - `value` 对应的值  

[查看texParameteri具体参数](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texParameter)


## 图像要求

WebGL 对图片素材是有严格要求的，默认情况下图片的宽度和高度必须是 2 的 N 次幂，比如 16 x 16，32 x 32，64 x 64 等。

当然我们也可以去修改配置来支持不同像素的图像

