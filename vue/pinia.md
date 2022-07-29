# Pinia

### 挂载pinia

```JS
import {
    createApp
} from 'vue'
import {
    createPinia
} from 'pinia'
import App from './App.vue'

const pinia = createPinia();

createApp(App).use(pinia).mount('#app')
```

### 创建store

```JS
import {
    defineStore
} from 'pinia'

export const mainStore = defineStore('main', {
    state() {
        return {
            msg: 'hello'
        }
    },
    getters: {},
    actions: {}
})
```

### 使用store

```JS
// 解构的时候会丢失响应式 所以需要使用storeToRefs 添加响应式
import {
    storeToRefs
} from "pinia";
import {
    reactive,
    ref,
    watchEffect
} from "vue";
import {
    mainStore
} from "../store/index";

const data = reactive({});

const _minStore = mainStore();

const {
    msg
} = storeToRefs(_minStore);
```

### Pinia 修改数据状态

简单数据直接通过在方法中操作 store. 属性名 来修改

```JS
let {
    msg
} = storeToRefs(_minStore);

const changeMsg = () => {
    // 直接通过 . 修改
    msg.value = 'changed msg hi'
}
```

### 多条数据修改

1. 通过$patch修改

```JS
const _minStore = mainStore();

_minStore.$patch({
    name: 'yh',
    age: 24
})
```

2. 设置一个action 去修改

```JS
changePerson(args ? : Record < string, any > ) {
    this.name = 'yh'
    this.age = 24
}
```

### getters

Pinia 中的 getter 和 Vue 中的计算属性几乎一样，在获取 State值之前做一些逻辑处理

可以通过参数传入state 也可以通过this获取

```JS
const mainStore = defineStore('main', {
    state() {},
    getters: {
        realMsg(state) {
            return 'realMsg:' + state.msg
        },
        fakeMsg() {
            return 'fakeMsg:' + state.msg
        }
    }
})
```

### store之间 互相引用

在 Pinia 中，可以在一个 store 中 import 另外一个 store ，然后通过调用引入 store 方法的形式，获取引入 store 的状态

```JS
const mainStore = defineStore('main', {

    actions: {
        changePerson(args: Record < string, any > ) {
            this.name = 'yh'
            this.age = 24
            otherStore().changeMsg();
        }
    }
})
const otherStore = defineStore("other", {
    state() {
        return {
            otherMsg: 'hi',
        }
    },
    actions: {
        changeMsg() {
            this.otherMsg = 'hello'
        }
    }
})
```


### 其他API

#### $reset

该API只能在定义store的时候传入的是一个对象的形式才能重置，如果是setup形式，是不能重置状态的。 

```JS

const createSetupStore = (id: string, setup: () => any, pinia: IRootPinia) => {
  // ...
  const partialStore = {
    $patch,
    $reset(){
      console.warn(`setup store 不允许使用 $reset 方法`)
    }
  };
  // ...
  return store;
};
const createOptionsStore = (
  id: string,
  options: Pick<IPiniaStoreOptions, "actions" | "getters" | "state">,
  pinia: IRootPinia
) => {
  // ......
  const store = createSetupStore(id, setup, pinia);
  // 重置状态API
  store.$reset = function $reset() {
    const newState = state ? state() : {};
    store.$patch(($state: any) => {
      Object.assign($state, newState);
    });
  };
};


```


#### $subscribe

当store状态发生改变的时候，可以监控到数据的改变，并且通知用户。本质上内部就是一个watch，通知方式就是回调的形式。

```JS
const partialStore = {
  $patch,
  $reset() {
    console.warn(`setup store 不允许使用 $reset 方法`);
  },
  $subscribe(
    callback: (mutation?: any, state?: any) => void,
    options?: WatchOptions
  ) {
    scope.run(() =>
      watch(
        pinia.state.value[id],
        (state) => {
          // 触发
          callback({ type: "dirct" }, state);
        },
        options
      )
    );
  },
};
```





#### $onAction

类似于发布订阅模式，通过action修改状态以后，可以监听到状态的改变，并执行用户提供的监听函数。

```JS
counterStore.$onAction(({ after, onError, store }: any) => {
  after((res: any) => {
    // res是action的执行后的返回值
    console.log("状态修改成功后的回调", res);
  });
  console.log(store);
});
```


原理.

```js
export const addSubscription = (subscriptions: any[], cb: any) => {
  subscriptions.push(cb);
  return () => {
    subscriptions = subscriptions.filter((item) => item !== cb);
  };
};
export const triggerSubscription = (subscriptions: any[], ...args: any) => {
  subscriptions.forEach((cb) => cb(...args));
};

const actionSubscribes: any[] = [];
const partialStore = {
  // ...
  $onAction: addSubscription.bind(null, actionSubscribes),
};

const wrapAction = (
  key: string,
  action: any,
  store: any,
  actionSubscribes: any[] = []
) => {
  return (...args: Parameters<typeof action>) => {
    const afterCallback: any[] = [];
    const onErrorCallback: any[] = [];
    const after = (cb: any) => {
      afterCallback.push(cb);
    };
    const onError = (cb: any) => {
      onErrorCallback.push(cb);
    };
    // 触发 action 给你传递两个参数
    triggerSubscription(actionSubscribes, { after, onError, store });
    let res: any;
    try {
      // 触发action之前 可以触发一些额外的逻辑
      res = Reflect.apply(action, store, args);
      if (res instanceof Promise) {
        return res
          .then((value: any) => {
            triggerSubscription(afterCallback, value);
          })
          .catch((err) => {
            triggerSubscription(onErrorCallback, err);
            return Promise.reject(err);
          });
      } 
      triggerSubscription(afterCallback, res);
    } catch (err) {
      triggerSubscription(onErrorCallback, err);
    }
    // 返回值也可以做处理
    return res;
  };
};
```




#### $dispose

掉用此方法就不在做依赖手机

```JS

// 取消依赖收集 不在更新 除了直接操作state视图更新 其他如计算属性等都失效
$dispose: () => {
  scope.stop();
  actionSubscribes.length = 0;
  pinia._s.delete(id);
},

```



#### $state

通过store的$state属性，拿到的就是当前的state，通过该属性，可以合并指定的属性当state上，同名属性会被覆盖。

``` js
const handleCoverClick = () => {
  counterStore.$state = {
    count: 100,
  };
};


// 获取状态
Object.defineProperty(store, "$state", {
  get() {
    return pinia.state.value[id];
  },
  set(newState) {
    $patch(($state: any) => {
      Object.assign($state, newState);
    });
  },
});



```

