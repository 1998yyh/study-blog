# IntersectionObserver

网页开发时，常常需要了解某个元素是否进入了"视口"（viewport），即用户能不能看到它(曝光)。

传统的实现方法是，监听到scroll事件后，调用目标元素的getBoundingClientRect()方法，得到它对应于视口左上角的坐标，再判断是否在视口之内。这种方法的缺点是，由于scroll事件密集发生，计算量很大，容易造成性能问题。

目前有一个新的 IntersectionObserver API，可以自动"观察"元素是否可见，Chrome 51+ 已经支持。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。


当一个 IntersectionObserver 对象被创建时，其被配置为监听根中一段给定比例的可见区域。一旦 IntersectionObserver 被创建，则无法更改其配置，所以一个给定的观察者对象只能用来监听可见区域的特定变化值；然而，你可以在同一个观察者对象中配置监听多个目标元素。

## 构造函数

创建一个新的 IntersectionObserver 对象，当其监听到目标元素的可见部分（的比例）超过了一个或多个阈值（threshold）时，会执行指定的回调函数。

```js
var observer = new IntersectionObserver(callback[, options]);
```

callback函数的参数（entries）是一个数组，每个成员都是一个IntersectionObserverEntry对象。举例来说，如果同时有两个被观察的对象的可见性发生变化，entries数组就会有两个成员。

### options

1. root: 作为边界盒的元素 或者 文档 ,如果构造函数没有传入 root 或者 其值为 null 则默认使用顶级文档的视口

2. rootMargin: 计算交叉时添加到根边界盒 (en-US)的矩形偏移量，可以有效的缩小或扩大根的判定范围从而满足计算需要。此属性返回的值可能与调用构造函数时指定的值不同，因此可能需要更改该值，以匹配内部要求。所有的偏移量均可用像素（px）或百分比（%）来表达，默认值为 “0px 0px 0px 0px”。

3. thresholds: 一个包含阈值的列表，按升序排列，列表中的每个阈值都是监听对象的交叉区域与边界区域的比率。当监听对象的任何阈值被越过时，都会生成一个通知（Notification）。如果构造器未传入值，则默认值为 0。

用户可以自定义这个数组。比如，[0, 0.25, 0.5, 0.75, 1]就表示当目标元素 0%、25%、50%、75%、100% 可见时，会触发回调函数。

如果阀值超过了 0.0 - 1.0 的范围 会报错 

### IntersectionObserverEntry

其一共有六个属性

``` js
{
  time: 3893.92,
  rootBounds: ClientRect {
    bottom: 920,
    height: 1024,
    left: 0,
    right: 1024,
    top: 0,
    width: 920
  },
  boundingClientRect: ClientRect {
     // ...
  },
  intersectionRect: ClientRect {
    // ...
  },
  intersectionRatio: 0.54,
  target: element
}
```
1. time：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
2. target：被观察的目标元素，是一个 DOM 节点对象
3. rootBounds：根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
4. boundingClientRect：目标元素的矩形区域的信息
5. intersectionRect：目标元素与视口（或根元素）的交叉区域的信息
6. intersectionRatio：目标元素的可见比例，即intersectionRect占boundingClientRect的比例，完全可见时为1，完全不可见时小于等于0


### 实例属性 同options


### 实例方法

1. disconnect: 停止监听目标

2. observe: 开始监听一个目标

3. takeRecords: 返回所有观察目标的 IntersectionObserverEntry 对象数组

4. unobserve: 停止监听特定元素 

## demo - lazyload

```js
function query(selector) {
  return Array.from(document.querySelectorAll(selector));
}

var observer = new IntersectionObserver(
  function(changes) {
    changes.forEach(function(change) {
      var container = change.target;
      var content = container.querySelector('template').content;
      container.appendChild(content);
      observer.unobserve(container);
    });
  }
);

query('.lazy-loaded').forEach(function (item) {
  observer.observe(item);
});
```

## demo - 单个曝光

```html
<div 
  v-exposure="{
    cb:()=>{
      reportProductInfo(item,'tabcategory_chanpinbaoguang')
    }
  }"></div>
```

```js
Vue.directive('exposure', {
  inserted(el, binding) {
    // 该API ios 12以下不支持 需引入polyify
    const intersection = new IntersectionObserver((entries)=>{
      if (entries[0].intersectionRatio <= 0) return;
      binding.value.cb && binding.value.cb();
      intersection.disconnect()
    })
    intersection.observe(el);
  },
})
```

## utils - 批量曝光(减少请求)



```ts
export  class Exposure {
  /** 进入视窗的DOM节点的数据 */
  private dotDataArr:Record<string,any>[];
  /** 批量曝光最大数 */
  private maxNum:number;
  /** 间隔时间上传一次 */
  private timeout:number;
  /** 定时器 */
  private _timer:number;
  /** 观察者的集合 */
  private _observer:IntersectionObserver | null;
  /** 上报函数 */
  private reportFunction:(name:string,data?:Record<string,any>)=>void

  constructor(maxNum = Number.MAX_SAFE_INTEGER,reportFunction:(name:string,data?:Record<string,any>)=>void) {
    this.dotDataArr = [];
    this.maxNum = maxNum;
    this.timeout = 1 * 1000 * 60; 
    this._timer = 0;
    this._observer = null; 
    this.reportFunction = reportFunction;
    this.init(); 
  }

  init(this:Exposure) {
    
    // 初始化的时候查看是否还有未上传的曝光 上传
    // 或者在最后离开页面的时候 把缓存里的数据 都提交上去
    // 使用Navigator.sendBeacon
    this.dotFromLocalStorage();

    this._observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // 每一个产品进入视窗时都会触发
          if (entry.isIntersecting) {
            // 清除当前定时器
            clearTimeout(this._timer);
            // 需要上报的数据通过data-set上报上去
            const dataset = (entry.target as HTMLDivElement).dataset;
            const ctm = {
              reportName:dataset.reportName
            };
            // 收集数据，进待上报的数据数组
            this.dotDataArr.push(ctm);
            // 收集到数据后，取消对该DOM节点的观察
            // 在回调函数中处理 肯定会执行
            this._observer!.unobserve(entry.target);
            // 超过一定数量直接上传
            if (this.dotDataArr.length >= this.maxNum) {
              this.dot();
            } else {
              // 否则，直接缓存
              this.storeIntoLocalstorage(this.dotDataArr);
              if (this.dotDataArr.length > 0) {
                // 不断有新的ctm进来，接下来如果没增加，自动n秒后打点
                this._timer = window.setTimeout(() => {
                  this.dot();
                }, this.timeout);
              }
            }
          }
        });
      },
      {
        root: null, // 指定根目录，也就是当目标元素显示在这个元素中时会触发监控回调。 默认值为null，即浏览器窗口
        rootMargin: "0px", // 设定root元素的边框区域
        threshold: 0.5, // number或number数组，控制target元素进入root元素中可见性超过的阙值，达到阈值会触发函数，也可以使用数据来让元素在进入时在不同的可见度返回多次值
      }
    );
  }

  // 每个DOM元素通过全局唯一的Exposure的实例来执行该add方法,将自己添加进观察者中
  add(entry) {
    this._observer && this._observer.observe(entry.el);
  }

  // 上传并更新缓存
  dot() {
    const dotDataArr = this.dotDataArr.splice(0, this.maxNum);
    // this.reportFunction(dotDataArr);
    this.storeIntoLocalstorage(this.dotDataArr);
  }

  // 缓存数据
  storeIntoLocalstorage(dotDataArr) {
    // 通过localStorage缓存埋点数据 
    localStorage.setItem("dotDataArr", JSON.stringify(dotDataArr));
  }

  // 上传数据
  dotFromLocalStorage() {
    // 此处需要根据自身需求 /  根据不同的api设计 去做数据的上报处理
    // const ctmsStr = JSON.parse(localStorage.getItem("dotDataArr"));
    // if (ctmsStr && ctmsStr.length > 0) {
    //   this.reportFunction(ctmsStr);
    // }
  }
}


const exp = new Exposure(20,(name:string)=>{})

// 暴露vue指令
export default {
  install(Vue){
    Vue.directive('exposure',{
      bind(el,binding,vnode){
        exp.add({el,val:binding.value})
      },
      update(newValue,oldValue){

      },
      unbind(){

      }
    })
  }
}
```



## 问题

IntersectionObserver API 是异步的，不随着目标元素的滚动同步触发。

规格写明，IntersectionObserver的实现，应该采用requestIdleCallback()，即只有线程空闲下来，才会执行观察器。这意味着，这个观察器的优先级非常低，只在其他任务执行完，浏览器有了空闲才会执行。

交叉监视器的异步执行基于 event-loop，处于 动画帧回调函数requestAnimationFrame 之后，又在 requestidlecallback 之前。

所以会有一个快速滚动的坑 : 

大部分设备中浏览器的刷新频率为 60FPS ，大概是 16.6ms 一次，也就是说如果我们拖动滚动条的速度快于这个更新频率 IntersectionObserver 确实是有可能不会执行到的。


### 解决方案

如果用户快速滑动, 肉眼没有观察到数据, 应可以理解为未看到要曝光的数据, 但是如果硬要实现快速滑动也能监听

1. 处理这个问题的一种方法是尝试间接推断哪些元素穿过了视口，但交集观察者没有捕捉到。要实现它，您需要按升序为所有列表元素赋予一个唯一的数字属性。

然后，在每个交集观察者的回调函数中，保存交集元素的最小和最大id。在回调结束时，调用setTimeout(applyChanges, 150)来安排一个函数，该函数将循环遍历所有id在min和max之间的元素。

同样，将clearTimeout()放在回调的开头，以确保该函数等待IO在一小段时间内处于非活动状态。


``` js
let minId = null;
let maxId = null;
let debounceTimeout = null;

function applyChanges() {
  console.log(minId, maxId);
  const items = document.querySelectorAll('.item');
  // perform action on elements with Id between min and max
  minId = null;
  maxId = null;
}

function reportIntersection(entries) {
  clearTimeout(debounceTimeout);
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const entryId = parseInt(entry.target.id);
      if (minId === null || maxId === null) {
        minId = entryId;
        maxId = entryId;
      } else {
        minId = Math.min(minId, entryId);
        maxId = Math.max(maxId, entryId);
      }
    }
  });
  debounceTimeout = setTimeout(applyChanges, 500);
}

const container = document.querySelector('#container');
const items = document.querySelectorAll('.item');
const io = new IntersectionObserver(reportIntersection, container);
let idCounter = 0;
items.forEach(item => {
  item.setAttribute('id', idCounter++);
  io.observe(item)
});
```

2. 限制滚动事件

不可能影响默认的滚动条行为，但可以使用自定义滚动条覆盖它。其思想是限制滚动事件，以便容器在每个渲染周期中滚动的高度不能超过其自身的高度。这样，IntersectionObserver将有时间捕获所有交叉口。尽管我建议使用现有的库来完成这项任务，但下面是它应该如何工作的粗略逻辑。

首先，定义容器在单个渲染周期内滚动的最大距离:let scrollPool = 500。在每次滚动事件中，在requestAnimationFrame()函数中下一次渲染时，计划将scrollPool重置为原始值。接下来，检查scrollPool是否小于0，如果小于0，则不滚动返回。否则，从scrollPool中减去scrollDistance，并将scrollDistance添加到容器的scrollTop属性中。

同样，由于用户滚动页面的方式多种多样，这个解决方案的实现可能有些过度。但为了描述这个想法，这里有一个关于车轮事件的草稿:

```js
let scrollPool = 500;

function resetScrollPool() {
  scrollPool = 500;
}

function scrollThrottle(event) {
  window.requestAnimationFrame(resetScrollPool);
  if (scrollPool < 0) {
    return false;
  }
  const scrollDistance = event.deltaY * 10;
  scrollPool = scrollPool - Math.abs(scrollDistance);
  document.querySelector('#container').scrollTop += scrollDistance;
}

window.addEventListener('wheel', scrollThrottle);
```

3. 实现自定义路口检测

这将意味着完全抛弃IntersectionObserver，使用旧的方法(scroll) 。这肯定会在性能方面付出更大的代价，但您将确保捕获所有穿过视口的元素。

这个想法是添加一个滚动处理函数来循环遍历容器的所有子容器，以查看它们是否穿过了可见区域。为了提高性能，您可能希望将此函数的反弹时间缩短一秒左右。