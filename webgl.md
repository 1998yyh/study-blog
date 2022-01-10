# webGL

WebGL经常被当成3D API，人们总想“我可以使用WebGL和一些神奇的东西做出炫酷的3D作品”。 事实上WebGL仅仅是一个光栅化引擎，它可以根据你的代码绘制出点，线和三角形。 想要利用WebGL完成更复杂任务，取决于你能否提供合适的代码，组合使用点，线和三角形代替实现。

WebGL在电脑的GPU中运行。因此你需要使用能够在GPU上运行的代码。 这样的代码需要提供成对的方法。每对方法中一个叫顶点着色器， 另一个叫片断着色器，并且使用一种和C或C++类似的强类型的语言 GLSL。 (GL着色语言)。 每一对组合起来称作一个 program（着色程序）

顶点着色器的作用是计算顶点的位置。根据计算出的一系列顶点位置，WebGL可以对点,线和三角形在内的一些图元进行光栅化处理。当对这些图元进行光栅化处理时需要使用片断着色器方法。 片断着色器的作用是计算出当前绘制图元中每个像素的颜色值。

几乎整个WebGL API都是关于如何设置这些成对方法的状态值以及运行它们。 对于想要绘制的每一个对象，都需要先设置一系列状态值，然后通过调用 gl.drawArrays 或 gl.drawElements 运行一个着色方法对，使得你的着色器对能够在GPU上运行。

这些方法对所需的任何数据都需要发送到GPU，这里有着色器获取数据的4种方法。

1. 属性（Attributes）和缓冲

缓冲是发送到GPU的一些二进制数据序列，通常情况下缓冲数据包括位置，法向量，纹理坐标，顶点颜色值等。 你可以存储任何数据。

属性用来指明怎么从缓冲中获取所需数据并将它提供给顶点着色器。 例如你可能在缓冲中用三个32位的浮点型数据存储一个位置值。 对于一个确切的属性你需要告诉它从哪个缓冲中获取数据，获取什么类型的数据（三个32位的浮点数据）， 起始偏移值是多少，到下一个位置的字节数是多少。

缓冲不是随意读取的。事实上顶点着色器运行的次数是一个指定的确切数字， 每一次运行属性会从指定的缓冲中按照指定规则依次获取下一个值。

2. 全局变量（Uniforms）

全局变量在着色程序运行前赋值，在运行过程中全局有效。

3. 纹理（Textures）

纹理是一个数据序列，可以在着色程序运行中随意读取其中的数据。 大多数情况存放的是图像数据，但是纹理仅仅是数据序列， 你也可以随意存放除了颜色数据以外的其它数据。

4. 可变量（Varyings）

可变量是一种顶点着色器给片断着色器传值的方式，依照渲染的图元是点， 线还是三角形，顶点着色器中设置的可变量会在片断着色器运行中获取不同的插值。

## Hello World


`void main` 是所有着色的主函数 
`precision` 是用来设置精读的 `mediump` 是默认的中等精度代表 `medium precision`

```html
<script type="shader-source" id="vertexShader">
  void main(){
    gl_Position = vec4(0.0,0.0,0.0,1.0);
    gl_PointSize = 10.0;
  }
</script>

<script type="shader-source" id="fragmentShader">
    precision mediump float; 

  void main(){
    //设置像素颜色为红色
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
  }
</script>
```

然后我们创建 `canvas`

```javascript
// 使用这样方式创建 在使用过程中可以获得代码提示
const canvas = document.createElement('canvas');
document.querySelector('body').appendChild(canvas);
const gl = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
// 获取顶点着色器源码
const vertexShaderSource = document.querySelector('#vertexShader').innerHTML;
// 创建顶点着色器
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// 将源码分配给顶点着色器对象
gl.shaderSource(vertexShader, vertexShaderSource);
// 编译顶点着色器程序
gl.compileShader(vertexShader);

// 获取片元着色器源码
const fragmentShaderSource = document.querySelector('#fragmentShader').innerHTML;
// 创建片元着色器程序
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// 将源码分配给片元着色器对象
gl.shaderSource(fragmentShader, fragmentShaderSource);
// 编译片元着色器
gl.compileShader(fragmentShader);

// 创建着色器程序
const program = gl.createProgram();
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
// 链接着色器程序
gl.linkProgram(program)

console.log(program);
// 使用刚创建好的着色器程序。
gl.useProgram(program)

//设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//用上一步设置的清空画布颜色清空画布。
gl.clear(gl.COLOR_BUFFER_BIT);

//绘制点。
gl.drawArrays(gl.POINTS, 0, 1);
```

最终效果如下:
<iframe height="300" style="width: 100%;" scrolling="no" title="learn-webgl1" src="https://codepen.io/WFFMLOVE/embed/OJxoqPM?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/OJxoqPM">
  learn-webgl1</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


## 三角

我们在上面的基础上，绘制一个三角形

上面顶点的数据是写死的，我们将其改为外部传入
```html
<script type="shader-source" id="vertexShader">
  attribute vec4 a_Position;
  void main(){
    gl_Position = (a_Position,0.0,1.0);
  }
</script>

<script type="shader-source" id="fragmentShader">
  precision mediump float;
  uniform vec4 u_Color;

  void main(){
    vec4 color  = u_Color/ vec4(255,255,255,1);
    gl_FragColor = color;
  }
</script>
```

``` javascript
// 我们紧跟着清空画布后面开始
// 坐标数据
const points = [1,0,0,1,0,0]
// 创建一个缓冲区
const buffer = gl.createBuffer();
// 绑定缓存区
// 绑定该缓冲区为 WebGL 当前缓冲区 gl.ARRAY_BUFFER
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 最后一个参数 gl.STATIC_DRAW 提示 WebGL 我们不会频繁改变缓冲区中的数据，WebGL 会根据这个参数做一些优化处理。
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
// 告诉 WebGL 如何从之前创建的缓冲区中获取数据，并且传递给顶点着色器中的 a_Position 属性。 那么，首先启用对应属性 a_Position：
gl.enableVertexAttribArray(a_Position)
//每次取两个数据
const size = 2;
//每个数据的类型是32位浮点型
const type = gl.FLOAT;
//不需要归一化数据
const normalize = false;
// 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点。
const stride = 0;
// 从缓冲起始位置开始读取     
const offset = 0;
/**
 * target： 允许哪个属性读取当前缓冲区的数据。
 * size：一次取几个数据赋值给 target 指定的目标属性。在我们的示例中，顶点着色器中 a_Position 是 vec2 类型，即每次接收两个数据，所以 size 设置为 2。以后我们绘制立体模型的时候，a_Position 会接收三个数据，size 相应地也会设置成 3。
 * type：数据类型，一般而言都是浮点型。
 * normalize：是否需要将非浮点类型数据单位化到【-1, 1】区间。
 * stride：步长，即每个顶点所包含数据的字节数，默认是 0 ，0 表示一个属性的数据是连续存放的。在我们的例子中，我们的一个顶点包含两个分量，X 坐标和 Y 坐标，每个分量都是一个 Float32 类型，占 4 个字节，所以，stride = 2 * 4 = 8 个字节。但我们的例子中，缓冲区只为一个属性a_Position服务，缓冲区的数据是连续存放的，因此我们可以使用默认值 0 来表示。
 * 但如果我们的缓冲区为多个属性所共用，那么 stride 就不能设置为 0 了，需要进行计算。
 * 
 * offset：在每个步长的数据里，目标属性需要偏移多少字节开始读取。在我们的例子中，buffer 只为 a_Position 一个属性服务，所以 offset 为 0 * 4 = 0。
 * 
 * */
gl.vertexAttribPointer(a_Position, size, type, normalize, stride, offset)
// 图元 设置为三角形
const primitiveType = gl.TRIANGLES;
// 从顶点数组的开始位置获取数据
const _offset = 0;

const _count = 3;
// 获取到颜色
const u_Color = gl.getUniformLocation(program, 'u_Color');
// 传递颜色
gl.uniform4f(u_Color, 222, 111, 22, 1.0)
gl.drawArrays(primitiveType, _offset, _count)
```
结果如下:

<iframe height="300" style="width: 100%;" scrolling="no" title="learn-webgl2" src="https://codepen.io/WFFMLOVE/embed/bGoxJxO?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/bGoxJxO">
  learn-webgl2</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### 裁剪坐标系
在裁剪坐标系中，中心点是坐标原点，正值在右上方。

对于描述二维空间的物体，比起裁剪坐标系，我们可能更希望使用屏幕像素坐标。

我们可以将其改造一下



## 变量

* attribute 变量 : 只能在`顶点着色器`(vertexShader)中定义。
* uniform 变量 : 既可以再`顶点着色器`(vertexShader)中定义，也可以在`片元着色器`(fragmentShader)定义。
* varing 变量 : 用来从`顶点着色器`中往`片元着色器`传递数据，使用它我们可以在顶点着色器中声明一个变量并对其赋值，经过插值处理后，在片元着色器中取出插值后的值来使用。

## GLSL

* gl_Position： 内置变量，用来设置顶点坐标。
* gl_PointSize： 内置变量，用来设置顶点大小。
* vec2：2 维向量容器，可以存储 2 个浮点数。
* gl_FragColor： 内置变量，用来设置像素颜色。
* vec4：4 维向量容器，可以存储 4 个浮点数。
* precision：精度设置限定符，使用此限定符设置完精度后，之后所有该数据类型都将沿用该精度，除非单独设置。
* 运算符：向量的对应位置进行运算，得到一个新的向量。
  + vec * 浮点数： vec2(x, y) * 2.0 = vec(x * 2.0, y * 2.0)。
  + vec2 * vec2：vec2(x1, y1) * vec2(x2, y2) = vec2(x1 * x2, y1 * y2)。
  + 加减乘除规则基本一致。但是要注意一点，如果参与运算的是两个 vec 向量，那么这两个 vec 的维数必须相同。

### JavaScript 程序如何连接着色器程序

* createShader：创建着色器对象
* shaderSource：提供着色器源码
* compileShader：编译着色器对象
* createProgram：创建着色器程序
* attachShader：绑定着色器对象
* linkProgram：链接着色器程序
* useProgram：启用着色器程序

### JavaScript 如何往着色器中传递数据

* getAttribLocation：找到着色器中的 attribute 变量地址。
* getUniformLocation：找到着色器中的 uniform 变量地址。
* vertexAttrib2f：给 attribute 变量传递两个浮点数。
* uniform4f：给uniform变量传递四个浮点数。

### 三角形图元分类

* gl. TRIANGLES：基本三角形。
* gl. TRIANGLE_STRIP：三角带。
* gl. TRIANGLE_FAN：三角扇。

### 使用缓冲区传递数据

* gl.createBuffer：创建buffer。
* gl.bindBuffer：绑定某个缓冲区对象为当前缓冲区。
* gl.bufferData：往缓冲区中复制数据。
* gl.enableVertexAttribArray：启用顶点属性。
* gl.vertexAttribPointer：设置顶点属性从缓冲区中读取数据的方式。

## 纹理

WebGL 对图片素材是有严格要求的，图片的宽度和高度必须是 2 的 N 次幂，比如 16 x 16，32 x 32，64 x 64 等。

### 纹理坐标系统

纹理也有一套自己的坐标系统，为了和顶点坐标加以区分，通常把纹理坐标称为 UV，U 代表横轴坐标，V 代表纵轴坐标。

* 图片坐标系统的特点是：
  + 左上角为原点(0, 0)。
  + 向右为横轴正方向，横轴最大值为 1，即横轴坐标范围【1，0】。
  + 向下为纵轴正方向，纵轴最大值为 1，即纵轴坐标范围【0，1】。

* 纹理坐标系统不同于图片坐标系统，它的特点是：
  + 左下角为原点(0, 0)。
  + 向右为横轴正方向，横轴最大值为 1，即横轴坐标范围【1，0】。
  + 向上为纵轴正方向，纵轴最大值为 1，即纵轴坐标范围【0，1】。

## 开发基本步骤

* 初始化阶段
  + 创建所有着色器程序。
  + 寻找全部 attribute 参数位置。
  + 寻找全部 uniforms 参数位置。
  + 创建缓冲区，并向缓冲区上传顶点数据。
  + 创建纹理，并上传纹理数据。
* 首次渲染阶段
  + 为 uniforms 变量赋值。
    - 处理 attribute 变量
    - 使用 gl.bindBuffer 重新绑定模型的 attribute 变量。
    - 使用 gl.enableVertexAttribArray 启用 attribute 变量。
    - 使用 gl.vertexAttribPointer设置 attribute变量从缓冲区中读取数据的方式。
    - 使用 gl.bufferData 将数据传送到缓冲区中。
  + 使用 gl.drawArrays 执行绘制。
* 后续渲染阶段
  + 对发生变化的 uniforms 变量重新赋值。
  + 每个模型的 attribute 变量。
    - 使用 gl.bindBuffer 重新绑定模型的 attribute 变量。
    - 使用 gl.bufferData 重新向缓冲区上传模型的 attribute 数据。
  + 使用 gl.drawArrays 执行绘制。
