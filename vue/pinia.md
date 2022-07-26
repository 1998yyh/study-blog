
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

