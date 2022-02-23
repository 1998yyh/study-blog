# UI自动化测试

一种方式是 在`Selenium` 这样的系统中运行您的测试，它可以自动化浏览器,

另一种是 `JSDOM` 一个像浏览器一样解析和交互组合 HTML 的库。好处是它实际上不是浏览器。相反，它像浏览器一样实现 Web 标准。
你可以给它一些 HTML，它会解析那个 HTML。然后，您可以使用普通的 JavaScript DOM API检查或修改内存中的 HTML 。


testing-library官方首页地址:<https://testing-library.com/>
<!-- mock-service-worker:<https://www.vuemastery.com/blog/mock-service-worker-api-mocking-for-vuejs-development-testing/> -->

## @testing-library/dom

测试 DOM 节点的非常轻量级的解决方案
库提供的实用程序有助于以与用户相同的方式查询 DOM。通过标签文本查找表单元素（就像用户那样），从他们的文本中查找链接和按钮（就像用户那样）等等
鼓励您的应用程序更易于访问，并允许您让您的测试更接近于以用户的方式使用您的组件，这让您的测试让您更有信心当真实用户使用它时您的应用程序将工作。

### 安装

`npm install --save-dev @testing-library/dom`
jsdom是运行在 node.js 中的 DOM 和浏览器 API 的纯 JavaScript 实现。
如果您不使用 Jest，并且想在 Node 中运行测试，那么您必须自己安装 jsdom。还有一个名为 global-jsdom的包，可用于设置全局环境以模拟浏览器 API。 

`npm install --save-dev jsdom global-jsdom`

### 配置

```javascript
module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
        '^.+\\.vue$': 'vue-jest',
    },
    // 测试文件地址
    testRegex: '__tests__\/.*?\.ts$',
    // 解析文件后缀
    moduleFileExtensions: ['ts', 'js', 'vue'],
    // 测试环境 
    testEnvironment: 'jsdom', // jest-environment-jsdom /  jest-environment-jsdom-fifteen  / node
    // ts转译配置
    globals: {
        'ts-jest': {
            tsconfig: {
                strict: false
            } 
        }
    },
    // 多文件测试输出每条用例
    verbose: true,
};
```

### DOM测试

我们用一个最普遍的demo

<iframe height="300" style="width: 100%; " scrolling="no" title="testing-library-dom-demo" src="https://codepen.io/WFFMLOVE/embed/RwjMzgm?default-tab=&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/WFFMLOVE/pen/RwjMzgm">
  testing-library-dom-demo</a> by 1998yyh (<a href="https://codepen.io/WFFMLOVE">@WFFMLOVE</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

我们可以丢在body中

```javascript
// 创建元素并添加至body中
div = document.createElement('div')
document.body.appendChild(div)
container = renderContent(div)
```

#### 获取元素

```javascript
// 官方获取元素 同步方法
const submitBtn = getByRole(container, 'button', {
    name: 'Login',
})
// 官方异步通过内容获取元素方法
const submitBtn2 = await findByText(container, 'Login');

// 原生获取DOM方法
const submitBtn3 = document.querySelector('#submit')

// 比较获取到的内容是否一致
expect(submitBtn).toEqual(submitBtn2)
expect(submitBtn).toEqual(submitBtn3)
```

#### 点击元素

`@testing-library/dom` 暴露出了 `fireEvent` 去做用户交互操作, 我们可以用它做一些简单的交互，更多情况下我们会使用 `@testing-library/user-event`

```javascript
const submitBtn = getByRole(container, 'button', {
    name: 'Login',
})
// 点击提交按钮
userEvent.click(submitBtn)
// 校验错误提示是否显示
expect(await findByText(container, 'User Name Required')).toBeVisible()
expect(await findByText(container, 'Password Required')).toBeVisible()
```

#### 输入校验

```javascript
// 获取DOM
const userNameField = getByPlaceholderText(container, 'Enter user name')
const passwordField = getByPlaceholderText(container, 'Enter password')

// 校验错误提示没有显示
expect(await findByText(container, 'Invalid Password')).not.toBeVisible()
expect(await findByText(container, 'Invalid User Name')).not.toBeVisible()

// 写入
userEvent.type(userNameField, 'Philchard')
userEvent.type(passwordField, 'theCat')

// 是否写入成功
expect(userNameField).toHaveValue('Philchard')
expect(passwordField).toHaveValue('theCat')

// 点击BUTTON
userEvent.click(
    getByRole(container, 'button', {
        name: 'Login',
    }),
)

// 错误提示出现
expect(await findByText(container, 'Invalid User Name')).toBeVisible()
expect(await findByText(container, 'Invalid Password')).toBeVisible()
```

### CSS测试

#### 添加样式

我们可以直接通过 `innerHTML = <style>...</style>` 这样的操作添加样式; 

**注**:在某个版本测试的时(具体哪个忘了),碰到会忽略style和script标签，如果遇到这种情况，可手动创建标签然后appendChild

```javascript
const html = `
<style>
  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 250px;
  }
</style>
<div class="box">
  the content
</div>
`
document.body.innerHTML = html;
```

#### 获取属性

1. `getComputedStyle`: `expect(getComputedStyle(dom).width).toEqual('400px') // 通过`

2. `getBoundingClientRect`: 获取到的是{0,0,0,0,0,0};
3. `offsetXXX`,`clientXXX`等Api 获取到的数据都是 0 
4. `dom.style.xxx`: 如果行内样式存在的话 可以获取到

#### 测试权重

```html
<style>
    #xx {
        width: 300px;
    }

    .btn {
        width: 200px !important;
    }

    div {
        width: 100vw;
    }
</style>
<div id='xx' data-testid='custom-element' class='btn'>btn</div>
```

这是一个特别坑的地方，他没有权重的概念，只是简单的后面的样式覆盖前面的样式。

但是行内样式的权重是比style样式的权重高的

```javascript
dom.style.width = '500px'
expect(dom.style.width).toEqual('500px')
expect(getComputedStyle(dom).width).toEqual('500px')
```

#### 最外层的宽高

只有 `window` 可以获取到宽高 `768 1024` , `body` , `documentElement` 等均是0


#### 其他

另外 我尝试使用了`@testing-library/user-event`的hover去模拟css的`:hover` 去校验属性值变化或者DOM显示隐藏，很遗憾他是不生效的。

### VUE测试

> 您的测试与您的软件使用方式越相似，它们能给您的信心就越大。 ---testing-library.com

对于vue组件的测试，我们使用的是 `@testing-library/vue` , 可能有同学使用过vue `@vue/test-utils` ，两者有什么差距呢？

这是一个 `@vue/test-utils` 的例子; 

```javascript
import {
    shallowMount
} from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
    it('renders props.msg when passed', () => {
        const msg = 'new message'
        const wrapper = shallowMount(HelloWorld, {
            propsData: {
                msg
            }
        })
        expect(wrapper.text()).toMatch(msg)
    })
})
```

上述测试 Vue 应用程序的方法的问题是最终用户将与 DOM 交互并且不知道 Vue 如何呈现 UI。

相同的demo 

```javascript
import {
    render
} from '@testing-library/vue'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
    it('renders props.msg when passed', () => {
        const msg = 'new message'
        const {
            getByText
        } = render(HelloWorld, {
            props: {
                msg
            }
        })
        getByText(msg)
    })
})
```

1. 我们使用renderVue 测试库公开的函数来渲染HelloWorld组件。render是 Vue 测试库中渲染组件的唯一方式。当你调用 render 时，你传入了 Vue 组件和一个可选options对象。
2. 然后我们使用 options 对象传入组件msg所需的 props HelloWorld。render将返回一个带有辅助方法的对象来查询 DOM，其中一种方法是getByText
3. 然后，我们使用getByText断言文本内容为“新消息”的元素是否存在于 DOM 中。

#### 测试props

同样的我们使用一个简单的demo做个测试:<https://codesandbox.io/s/testing-library-vue-demo-wyc9vk?file=/src/main.js>

```javascript
const {
    getByText
} = render(CheckOut, {
    props: {
        product
    }
})
// 能够找到对应内容的元素
getByText(product.name)
getByText("$" + product.price)
getByDisplayValue(1)
```

#### 测试methods

```javascript
const {
    getByDisplayValue,
    getByText
} = render(CheckOut, {
    props: {
        product
    }
})
// 根据内容获取到 + 按钮
const incrementQuantityButton = getByText('+')
// 点击测试
await fireEvent.click(incrementQuantityButton)
getByDisplayValue(2)

// 点击测试
const decrementQuantityButton = getByText('-')
await fireEvent.click(decrementQuantityButton)
getByDisplayValue(1)
```

#### 测试computed

```javascript
const {
    getByDisplayValue,
    getByText,
    container
} = render(CheckOut, {
    props: {
        product
    }
})

const incrementQuantityButton = getByText('+')
// 尝试一下用querySelector也可以获取到元素
const final = container.querySelector('.final')
// innerHTML 是string
expect(Number(final.innerHTML)).toEqual(product.price * 1)

await fireEvent.click(incrementQuantityButton)
expect(Number(final.innerHTML)).toEqual(product.price * 2)
```

#### 触发事件

`render`会返回一个`emitted`,可以通过它去获取到事件触发的情况,调用它返回的是一个`Record<string,number>`的结构，可以获取到它的事件名和调用次数

```javascript
const {
    getByText,
    emitted
} = render(CheckOut, {
    props: {
        product
    }
})

const checkoutBtn = getByText('Checkout')
await checkoutBtn.click();
expect(emitted()).toHaveProperty('event')
```

#### vuex

我们只需要在render组件的时候传入store即可。

```javascript
const {
    getByTestId,
    getByText
} = render(VuexTest, {
    store: {
        ...store
    }
})
```

对于vuex我们使用较多的还是多个组件传值，我们也可以举个例子

```javascript
const currentStore = {
    store: {
        ...store
    }
}
const {
    getByText,
    getByTestId
} = render(VuexTest, currentStore)

render(VuexTest2, currentStore)

await fireEvent.click(getByText('+'))
// 组件1
expect(getByTestId('count-value')).toHaveTextContent('1')
// 组件2
expect(getByTestId('count-value2')).toHaveTextContent('1')
```

#### vue-router

`vue-router` 与 `vuex` 同理, 我们可以在render时传入 `routers` ; 

```javascript
const routes = [{
        path: '/',
        component: Home
    },
    {
        path: '/about',
        component: About
    },
    ...
]

const {
    getByTestId,
    getAllByText
} = render(App, {
    routes
})
// 显示的全路径是 / 
expect(getByTestId('location-display')).toHaveTextContent('/')
// 点击路由跳转
await fireEvent.click(getByTestId('other-link'))
// 全路径变成了 / about
expect(getByTestId('location-display')).toHaveTextContent('/about')
// 并且可以找到About组件里的元素
getAllByText('About')
```

`render`这个方法还接受第三个参数作为回调函数,可以在组件实例化好之后调用

```javascript
  const {
    getByTestId
  } = render(App, {
    routes
  }, (vue, store, router) => {
    // 这样我们进入显示就是about的内容了
    router.push('/about')
  })
```


## miniprogram-automator

首先开启工具安全设置中的 CLI/HTTP 调用功能。

![Snipaste_2022-02-22_15-41-02.png](https://s2.loli.net/2022/02/22/6FXvZ8yAPaE5sYH.png)

然后安装小程序自动化测试SDK
``` 
npm i miniprogram-automator --save-dev
```

然后直接引入 SDK 开始编写控制脚本，参考下边例子:

```javascript
const automator = require('miniprogram-automator')

automator.launch({
  projectPath: 'path/to/project', // 项目文件地址
}).then(async miniProgram => {
  const page = await miniProgram.reLaunch('/page/component/index')
  await page.waitFor(500)
  const element = await page.$('.kind-list-item-hd')
  console.log(await element.attribute('class'))
  await element.tap()

  await miniProgram.close()
})
```

有的时候可能只是做个小程序组件，而不是整个项目，官方也提供了对于单个组件的库`miniprogram-simulate`<https://github.com/wechat-miniprogram/miniprogram-simulate>

``` javascript
const simulate = require('miniprogram-simulate')

test('test sth', () => {
    const id = simulate.load('/components/comp/index') // 加载自定义组件
    const comp = simulate.render(id) // 渲染自定义组件
    
    // 使用自定义组件封装实例 comp 对象来进行各种单元测试
})
```

单个组件的问题就是 wx对象需要自己mock

## 常见问题

### 1. 单元测试覆盖率怎么看

Statements（语句覆盖率）：是否每个语句都执行了

Branches（分支覆盖率）：是否每个判断都执行了

Functions（函数覆盖率）： 是否每个函数都执行了

Lines（行覆盖率）：是否每行都执行了，大部分情况下等于 Statements

但是光这点还是不够我们定位问题。so

![Snipaste_2022-02-23_16-01-45.png](https://s2.loli.net/2022/02/23/v6wbSW24pPCOcuY.png)

![Snipaste_2022-02-23_16-02-25.png](https://s2.loli.net/2022/02/23/nGbEAiR7vF32kfg.png)

![Snipaste_2022-02-23_16-02-03.png](https://s2.loli.net/2022/02/23/8fFwDKOm19edYcB.png)

![Snipaste_2022-02-23_16-02-34.png](https://s2.loli.net/2022/02/23/mecB54jRaL7UVzi.png)

这样我们就能轻松的定位到拿一行没有覆盖到了


### 2. 该使用哪种选择器?

`testing-library-dom`提供了许多选择器例如`getBy...`,`queryBy...`,`findBy...`, 根据指导原则，您的测试应该尽可能地类似于用户与您的代码（组件、页面等）的交互方式。考虑到这一点，我们推荐以下优先顺序：
* getByRole 这可用于查询 可访问性树中公开的每个元素。使用该选项，您可以按可访问的名称name过滤返回的元素 。这应该是您对几乎所有内容的首选。没有什么是你不能得到的（如果你不能，你的 UI 可能无法访问）
* getByLabelText 在浏览网站表单时，用户使用标签文本查找元素。此方法模拟该行为，因此它应该是您的首选。
* getByPlaceholderText   占位符不能代替标签
* getByText 根据文本查询
* getByDisplayValue 根据填充值查询

* getByAltText  如果您的元素支持alt文本（img、 area、input和任何自定义元素），那么您可以使用它来查找该元素。
* getByTitle 标题属性

* getByTestId 用户无法看到（或听到）这些，因此仅建议在无法按角色或文本匹配或没有意义的情况下（例如，文本是动态的）。


### 3. 如何配置通用环境

在 Jest 中提供了 setupFilesAfterEnv 配置，可以指向我们的脚本文件，该脚本的内容会在测试框架环境运行之后，执行测试用例之前执行：

我们可以将一些通用的环境配置写在一起，在框架加载后先将我们的环境引入
``` javascript
// env.ts
import "@testing-library/jest-dom"; // 扩展你的断言方法
import axios from "./src/axios";

const mockLocation = {
  code:0,
  message:'success',
  result:[
    {task_state: 1, count: 3}
  ]
};

beforeEach(() => {
  jest.spyOn(axios, "getAuth").mockImplementation(()=>Promise.resolve(mockLocation));
});
```

这样我们获取到的数据就是我们mock的数据了
``` javascript
import axios from '../src/axios'

describe("环境测试", () => {
  it('获取auth',async ()=>{
    const auth = await axios.getAuth();
    expect(auth.code).toEqual(0)
  })
})
```

### 4. 如何 polyfill 浏览器的方法和属性？

代码中肯定会使用到 BOM / DOM 方法，这类方法通过直接 window.func = () => { ... } 是无法直接覆写的，此时可以使用 defineProperty 重写。这类 polyfill 建议统一放到 polyfill 目录下，在 setupFilesAfterEnv 时全部引入即可。

``` javascript
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

