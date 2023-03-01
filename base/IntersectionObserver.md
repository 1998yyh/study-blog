# IntersectionObserver

网页开发时，常常需要了解某个元素是否进入了"视口"（viewport），即用户能不能看到它(曝光)。

传统的实现方法是，监听到scroll事件后，调用目标元素（绿色方块）的getBoundingClientRect()方法，得到它对应于视口左上角的坐标，再判断是否在视口之内。这种方法的缺点是，由于scroll事件密集发生，计算量很大，容易造成性能问题。

目前有一个新的 IntersectionObserver API，可以自动"观察"元素是否可见，Chrome 51+ 已经支持。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。


当一个 IntersectionObserver 对象被创建时，其被配置为监听根中一段给定比例的可见区域。一旦 IntersectionObserver 被创建，则无法更改其配置，所以一个给定的观察者对象只能用来监听可见区域的特定变化值；然而，你可以在同一个观察者对象中配置监听多个目标元素。

## 构造函数

创建一个新的 IntersectionObserver 对象，当其监听到目标元素的可见部分（的比例）超过了一个或多个阈值（threshold）时，会执行指定的回调函数。

```js
new IntersectionObserver(cb)
```

callback函数的参数（entries）是一个数组，每个成员都是一个IntersectionObserverEntry对象。举例来说，如果同时有两个被观察的对象的可见性发生变化，entries数组就会有两个成员。

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


### 实例属性


## 实例 - lazyload



## 实际 - 单个曝光

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

