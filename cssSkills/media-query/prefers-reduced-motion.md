# prefers-reduce-motion

CSS 媒体查询特性 prefers-reduced-motion 用于检测用户的系统是否被开启了动画减弱功能。

## 语法

`no-preference` : 用户未修改系统动画相关特性。
`reduce`: 这个值意味着用户修改了系统设置，将动画效果最小化，最好所有的不必要的移动都能被移除。


## 作用
动画渐变、视差滚动、背景视频等装饰效果。虽然许多用户喜欢此类动画，但有些用户不喜欢它们，因为他们觉得它们分散了注意力或减慢了速度。在最坏的情况下，用户甚至可能会像现实生活中一样出现晕动病，因此对于这些用户来说，减少动画是一种医疗必需品。

用户偏好媒体查询prefers-reduced-motion可让您为表达此偏好的用户设计网站的运动减少变体。


## css

``` css
/*
  If the user has expressed their preference for
  reduced motion, then don't use animations on buttons.
*/
@media (prefers-reduced-motion: reduce) {
  button {
    animation: none;
  }
}

/*
  If the browser understands the media query and the user
  explicitly hasn't set a preference, then use animations on buttons.
*/
@media (prefers-reduced-motion: no-preference) {
  button {
    /* `vibrate` keyframes are defined elsewhere */
    animation: vibrate 0.3s linear infinite both;
  }
}
```


如果有大量与动画相关的CSS， 可以将所有与动画相关的CSS 外包到一个单独的样式表中，仅通过元素上的属性有条件的增加样式表
```html
<link rel="stylesheet" href="animations.css" media="(prefers-reduced-motion: no-preference)">
```

## js

假设我们通过 Animation API 定义了一个复杂动画，当用户首选项变化的时候，会自动触发CSS规则，但是对于Javascript 动画，必须自己监听

```js
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
mediaQuery.addEventListener('change', () => {
  console.log(mediaQuery.media, mediaQuery.matches);
  // Stop JavaScript-based animations.
});
```

要注意的是`()`是必须的



## picture

``` html
<picture>
  <!-- Animated versions. -->
  <source
    srcset="nyancat.avifs"
    type="image/avif"
    media="(prefers-reduced-motion: no-preference)"
  />
  <source
    srcset="nyancat.gif"
    type="image/gif"
    media="(prefers-reduced-motion: no-preference)"
  />
  <!-- Static versions. -->
  <img src="nyancat.png" alt="Nyan cat" width="250" height="250" />
</picture>
```


当我们开启 `reduce` 的时候 picture 会变成静态图片

## 操作

`command+shift+p`调用`rendering` 


![](https://pic.imgdb.cn/item/64ccb1741ddac507cc7493a8.jpg)