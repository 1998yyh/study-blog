# css 实现高度0 -> 高度'auto'

> 大部分原文来自于 `https://juejin.cn/post/7196843994030342200`

## 效果

先看一下效果

## 旧的实现方式

在我第一份工作的时候 曾经遇到过这个需求 我们当时使用的是Vue的函数组件实现的

```js
import {
    defineComponent,
    VNodeData
} from 'vue';

let transitionStyle = '.5s height linear'
const Transition = {
    beforeEnter(el: HTMLElement) {
        el.style.transition = transitionStyle
        el.style.height = '0';
    },

    enter(el: HTMLElement) {
        if (el.scrollHeight !== 0) {
            el.style.height = `${ el.scrollHeight }px`
        } else {
            el.style.height = ''
        }
        el.style.overflow = 'hidden'
    },

    afterEnter(el: HTMLElement) {
        el.style.transition = ''
        el.style.height = ''
    },

    beforeLeave(el: HTMLElement) {
        el.style.display = 'block'
        el.style.height = `${ el.scrollHeight }px`
        el.style.overflow = 'hidden'
    },

    leave(el: HTMLElement) {
        if (el.scrollHeight !== 0) {
            el.style.transition = transitionStyle
            el.style.height = '0'
        }
    },

    afterLeave(el: HTMLElement) {
        el.style.transition = ''
        el.style.height = ''
    }
}

export default defineComponent({
    functional: true,
    props: {
        time: {
            type: Number,
            default: 500
        }
    },
    render(h, {
        children,
        props
    }) {
        transitionStyle = `${ props.time }ms height ease-in-out`
        const data: VNodeData = {
            props,
            on: Transition
        }
        return h('transition', data, children)
    }
})
```

## max-height方法

```css
div {
    max-height: 0;
    transition: 1s
}

.wrap :hover div {
    max-height: 800px
        /*大概的值，需要超过元素高度*/
}
```

但是有一个局限性，高度差异越大，过渡效果越糟糕，假设元素真实高度只有 100px，如果 max-height为800px，那只有前1/8有动画

## gird方法

grid布局中有一个全新的fr单位，用于定义网格轨道大小的弹性系数。

repeat(3, 1fr)其实就是1fr 1fr 1fr的简写，表示 3 等分剩余空间。 我们还可以将比例设置为 0fr, 但是0fr 和 1fr的效果占比相同, 其实这是由gird的最小尺寸规则决定的, 此时的最小高度是`min-content`, 也就是由内部文本决定的. 如果没有文字, 0fr自然就不占空间了,如果想保留文字并且不占空间的话,我们可以设置最小尺寸 

``` css
span{
  min-height:0;
}
```
这样0fr也会不占空间,还可以借助超出隐藏 , 彻底隐藏子内容 

下面重点来了，grid中的fr单位也是支持过渡动画的(0fr=>1fr )

由于高度是由内部文本撑开的，也就是高度不确定，而0fr到1fr的过渡变化，相当于实现了 高度不固定的过渡动画



```css
.grid {
    position: absolute;
    margin-top: 10px;
    max-width: 250px;
    border-radius: 5px;
    display: grid;
    grid-template-rows: 0fr;
    transition: 0.3s;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.65);
    color: #fff;
}

.grid>* {
    min-height: 0;
    padding: 0 10px;
}

.wrap:hover .grid {
    grid-template-rows: 1fr;
}
```
