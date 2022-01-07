# webgl


## 变量

* attribute 变量 : 只能在`顶点着色器`(vertexShader)中定义。
* uniform 变量 : 既可以再`顶点着色器`(vertexShader)中定义，也可以在`片元着色器`(fragmentShader)定义。
* varing 变量 : 用来从`顶点着色器`中往`片元着色器`传递数据，使用它我们可以在顶点着色器中声明一个变量并对其赋值，经过插值处理后，在片元着色器中取出插值后的值来使用。


## GLSL

+ gl_Position： 内置变量，用来设置顶点坐标。
+ gl_PointSize： 内置变量，用来设置顶点大小。
+ vec2：2 维向量容器，可以存储 2 个浮点数。
+ gl_FragColor： 内置变量，用来设置像素颜色。
+ vec4：4 维向量容器，可以存储 4 个浮点数。
+ precision：精度设置限定符，使用此限定符设置完精度后，之后所有该数据类型都将沿用该精度，除非单独设置。
+ 运算符：向量的对应位置进行运算，得到一个新的向量。
  - vec * 浮点数： vec2(x, y) * 2.0 = vec(x * 2.0, y * 2.0)。
  - vec2 * vec2：vec2(x1, y1) * vec2(x2, y2) = vec2(x1 * x2, y1 * y2)。
  - 加减乘除规则基本一致。但是要注意一点，如果参与运算的是两个 vec 向量，那么这两个 vec 的维数必须相同。


### JavaScript 程序如何连接着色器程序
+ createShader：创建着色器对象
+ shaderSource：提供着色器源码
+ compileShader：编译着色器对象
+ createProgram：创建着色器程序
+ attachShader：绑定着色器对象
+ linkProgram：链接着色器程序
+ useProgram：启用着色器程序


### JavaScript 如何往着色器中传递数据
+ getAttribLocation：找到着色器中的 attribute 变量地址。
+ getUniformLocation：找到着色器中的 uniform 变量地址。
+ vertexAttrib2f：给 attribute 变量传递两个浮点数。
+ uniform4f：给uniform变量传递四个浮点数。


### 三角形图元分类
+ gl.TRIANGLES：基本三角形。
+ gl.TRIANGLE_STRIP：三角带。
+ gl.TRIANGLE_FAN：三角扇。

### 使用缓冲区传递数据
+ gl.createBuffer：创建buffer。
+ gl.bindBuffer：绑定某个缓冲区对象为当前缓冲区。
+ gl.bufferData：往缓冲区中复制数据。
+ gl.enableVertexAttribArray：启用顶点属性。
+ gl.vertexAttribPointer：设置顶点属性从缓冲区中读取数据的方式。



## 纹理

WebGL 对图片素材是有严格要求的，图片的宽度和高度必须是 2 的 N 次幂，比如 16 x 16，32 x 32，64 x 64 等。

### 纹理坐标系统
纹理也有一套自己的坐标系统，为了和顶点坐标加以区分，通常把纹理坐标称为 UV，U 代表横轴坐标，V 代表纵轴坐标。

+ 图片坐标系统的特点是：
  - 左上角为原点(0, 0)。
  - 向右为横轴正方向，横轴最大值为 1，即横轴坐标范围【1，0】。
  - 向下为纵轴正方向，纵轴最大值为 1，即纵轴坐标范围【0，1】。

+ 纹理坐标系统不同于图片坐标系统，它的特点是：
  - 左下角为原点(0, 0)。
  - 向右为横轴正方向，横轴最大值为 1，即横轴坐标范围【1，0】。
  - 向上为纵轴正方向，纵轴最大值为 1，即纵轴坐标范围【0，1】。


## 开发基本步骤

+ 初始化阶段
  - 创建所有着色器程序。
  - 寻找全部 attribute 参数位置。
  - 寻找全部 uniforms 参数位置。
  - 创建缓冲区，并向缓冲区上传顶点数据。
  - 创建纹理，并上传纹理数据。
- 首次渲染阶段
  - 为 uniforms 变量赋值。
    + 处理 attribute 变量
    + 使用 gl.bindBuffer 重新绑定模型的 attribute 变量。
    + 使用 gl.enableVertexAttribArray 启用 attribute 变量。
    + 使用 gl.vertexAttribPointer设置 attribute变量从缓冲区中读取数据的方式。
    + 使用 gl.bufferData 将数据传送到缓冲区中。
  - 使用 gl.drawArrays 执行绘制。
+ 后续渲染阶段
  - 对发生变化的 uniforms 变量重新赋值。
  - 每个模型的 attribute 变量。
    + 使用 gl.bindBuffer 重新绑定模型的 attribute 变量。
    + 使用 gl.bufferData 重新向缓冲区上传模型的 attribute 数据。
  - 使用 gl.drawArrays 执行绘制。