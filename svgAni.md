# SVG动画

## clip-path

clip-path CSS 属性使用裁剪方式创建元素的可显示区域。区域内的部分显示，区域外的隐藏。

 `clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); `

 `clip-path: path('M 0 200 L 0, 75 A 5, 5 0, 0, 1 150, 75 L 200 200 z'); `

## CSS Motion Path 

* offset-path：接收一个 SVG 路径（与 SVG 的path、CSS 中的 clip-path 类似），指定运动的几何路径
* offset-distance：控制当前元素基于 offset-path 运动的距离
* offset-position：指定 offset-path 的初始位置
* offset-rotate：定义沿 offset-path 定位时元素的方向，说人话就是运动过程中元素的角度朝向

## 下载进度

```html
<template>
    <section>
        <p>下载进度</p>
        <svg>
            <g>
                <circle class="download" cx="100" cy="60" r="40" stroke="#ccc" />
                <circle class="download" id="circle" cx="100" cy="60" r="40" stroke="hsl(160,80%,50%)" />
            </g>
        </svg>
    </section>
</template>

<style lang="scss" scoped>
    .download {
        fill: transparent;
        stroke-width: 10px;
    }

    #circle {
        stroke-dasharray: 250.921;
        stroke-dashoffset: 250.921;
        animation: round 3s linear infinite;
    }

    @keyframes round {
        to {
            stroke-dashoffset: 0;
        }
    }
</style>
```

[点此查看](http://localhost:3001/#/share/download)

## 裁剪动画

```html
<svg viewBox="0 0 1400 800">
    <defs>
        <clipPath id="cd-image-1">
            <circle id="cd-circle-1" cx="110" cy="400" r="60" />
        </clipPath>
    </defs>

</svg>
<image href="../../../images/dota1.jpg"></image>

<style lang='scss'>
    #cd-image-1 circle {
        animation: visible-clippath 3s linear forwards infinite;
        clip-path="url(#cd-image-1)"
    }

    @keyframes visible-clippath {
        to {
            r: 1364;
        }
    }
</style>
```

[点此查看 clip](http://localhost:3001/#/share/clip)
<br>
[点此查看 shapes](http://localhost:3001/#/share/shapes)

## 路径动画

常见的动画
<img style='display:block' src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfa8f17c92e848cc9fa17f4da40f6658~tplv-k3u1fbpfcp-zoom-1.image" alt="" />
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fe1f250fbab4f77a18409fc1fc9ada0~tplv-k3u1fbpfcp-zoom-1.image" alt="" />

```html
    <div class="wrap">
        <svg width="400" height="160" xmlns="http://www.w3.org/2000/svg">
            <path d="M 10 80 C 80 10, 130 10, 190 80 S 300 150, 360 80" stroke="black" fill="transparent"></path>
        </svg>
        <div class="chunk"></div>
    </div>
    <style>
        .chunk {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            background-color: red;
            offset-path: path("M 10 80 C 80 10, 130 10, 190 80 S 300 150, 360 80");
            animation: move 3s linear infinite;
        }

        @keyframes move {
            0% {
                offset-distance: 0%;
            }

            100% {
                offset-distance: 100%;
            }
        }
    </style>
```

[点此查看](http://localhost:3001/#/share/path)

## 批改动画

[点此查看](http://localhost:3001/#/share/checkmark)

```html
  <section>
      <p>对勾</p>
      <svg class="checkmark" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
      </svg>
  </section>
  <style scoped lang='scss'>
      .checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke: #7ac142;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }

      .checkmark {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #fff;
          margin: 20px auto;
          box-shadow: inset 0px 0px 0px #7ac142;
          animation: fill 0.4s ease-in-out 0.4s forwards,
              scale 0.3s ease-in-out 0.9s both;
      }

      .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      }

      @keyframes stroke {
          100% {
              stroke-dashoffset: 0;
          }
      }

      @keyframes scale {

          0%,
          100% {
              transform: none;
          }

          50% {
              transform: scale3d(1.1, 1.1, 1);
          }
      }

      @keyframes fill {
          100% {
              box-shadow: inset 0px 0px 0px 30px #7ac142;
          }
      }
  </style>
```
[点此查看](http://localhost:3001/#/share/checkmarkX)

## 滤镜相关动画
```html
```
[点此查看](http://localhost:3001/#/share/corrugat)
```html
```
[点此查看](http://localhost:3001/#/share/lakereflect)
