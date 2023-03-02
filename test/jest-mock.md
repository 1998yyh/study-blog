# Jest.mock

mock 函数允许你测试代码之间的连接——实现方式包括：擦除函数的实际实现、捕获对函数的调用 ( 以及在这些调用中传递的参数) 、在使用 new 实例化时捕获构造函数的实例、允许测试时配置返回值。



## mock Function 

官网给的例子

``` js
// forEach.js
export function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}

// forEach.spec.js
const forEach = require('./forEach');

const mockCallback = jest.fn(x => 42 + x);

test('forEach mock function', () => {
  forEach([0, 1], mockCallback);

  // The mock function was called twice
  expect(mockCallback.mock.calls).toHaveLength(2);

  // The first argument of the first call to the function was 0
  expect(mockCallback.mock.calls[0][0]).toBe(0);

  // The first argument of the second call to the function was 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);

  // The return value of the first call to the function was 42
  expect(mockCallback.mock.results[0].value).toBe(42);
});
```

为了测试此函数，我们可以使用一个 mock 函数，然后检查 mock 函数的状态来确保回调函数如期调用。


## mock模块

在Jest中，对模块进行mock非常简单，只需要使用jest.mock即可，对于模块的mock主要有两种情况：

1. 只mock模块中的非default导出

对于只有非default导出的情况（如export const、export class等），只需要使用jest.mock，返回一个对象即可，对象中包含有你想要mock的函数或者变量：

``` ts
// mock 'moduleName' 中的 foo 函数
jest.mock('../moduleName', () => ({
  foo: jest.fn().mockReturnValue('mockValue'),
}));
```

mock 第三方模块
``` ts
// user.js
import axios from 'axios';

class Users {
  static all() {
    return axios.get('/users.json').then(resp => resp.data);
  }
}

export default Users;

// users.spec.js
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```

### mock模块中的default 导出

对于 default 导出mock, 则不能返回一个简单的对象, 而是需要在对象中包含一个default属性，同时添加__esModule: true。

当为ES6模块使用默认导出的factory参数时，需要指定__esModule: true属性。该属性通常由Babel / TypeScript生成，但在这里需要手动设置。当导入默认导出时，它是一个从导出对象导入名为default的属性的指令

``` ts
import moduleName, { foo } from '../moduleName';

jest.mock('../moduleName', () => {
  return {
    __esModule: true,
    default: jest.fn(() => 42),
    foo: jest.fn(() => 43),
  };
});

moduleName(); // Will return 42
foo(); // Will return 43
```

### mock 部分模块

如果只想mock模块中的部分内容，对于其他部分保持原样，可以使用jest.requireActual来引入真实的模块：


``` js
// foo.js
export const foo = 'foo';
export const bar = () => 'bar';
export default () => 'baz';

// foo.spec.js
//test.js
import defaultExport, {bar, foo} from '../foo-bar-baz';

jest.mock('../foo-bar-baz', () => {
  const originalModule = jest.requireActual('../foo-bar-baz');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked baz'),
    foo: 'mocked foo',
  };
});

test('should do a partial mock', () => {
  const defaultExportResult = defaultExport();
  expect(defaultExportResult).toBe('mocked baz');
  expect(defaultExport).toHaveBeenCalled();

  expect(foo).toBe('mocked foo');
  expect(bar()).toBe('bar');
});
```

*** 注意 *** : 如果引入的模块之前有相互引用的话 此时单元测试会报错

``` js
// utils.js
export const funcA = () =>{}
export const funcB = () =>{
  funcA();
}


// utils.spec.js
import { funcA, funcB } from '../src/utils';

jest.mock('../src/utils', () => {
  const originalModule = jest.requireActual('../src/utils');
  return {
    ...originalModule,
    funcA: jest.fn(),
  };
});

describe('utils.ts 单元测试', () => {
  test('测试 funcB', () => {
    funcB();
    expect(funcA).toBeCalled();
  });
});

```

这时候我们运行单测 会得到一个报错

![](https://pic.imgdb.cn/item/640073e3f144a01007bd3c89.jpg)

很明显，我们对funcA的mock失败了，为什么会有这样的结果呢，因为我们从模块外部导入的funcA引用和模块内部直接使用的funcA引用并不是同一个，通过jest.mock修改funcA并不会影响内部的调用。对于这种情况，建议的解决方法有两种：

拆分文件，将funcA拆分到不同的文件。这种做法可能会造成文件过多且分散的问题。
将相互调用的函数，作为一个工具类的方法来实现。即将互相调用的函数，放到同一个工具类中。

### mock class 实例方法

当我们在mock一个class的方法的时候，很简单地将类对象的对应方法赋值为jest.fn()即可，但是对于在构造函数中调用的成员方法，却不能这样做。因为类里面的方法只能在实例化完成之后再进行mock，不能阻止constructor中执行原函数。

我们可以考虑一下，class的本质是什么，class是ES6中的语法糖，本质上还是ES5中的原型prototype，所以类的成员方法本质上也是挂载到类原型上的方法，所以我们只需要mock类构造函数的原型上的方法即可：

```js
class Person {
  constructor() {
    this.init();
    // ...
  }
  public init() {}
}

Person.prototype.init = jest.fn();
```

### mock 类中的私有函数

对于ts中类的私有函数（private），无法直接获取（虽然说可以ts-ignore忽略ts报错，不过不建议这样做），这时只需使用同样的方法，在类的原型上直接mock即可：
``` ts
class Person {
  private funcA(){}
}

Person.prototype.funcA = jest.fn();
```
### mock 只读属性 (getter);

在单测中，对于可读可写属性我们可以比较方便地进行mock，直接赋值为对应的mocK值即可，如Platform.OS。但是对于只读属性（getter）的mock却不能直接这样写。通常对于只读属性（此处以document.body.clientWidth为例）有以下两种mock方式：

``` js
// Object.defineProperty

Object.defineProperty(document.body, 'clientWidth', {
  value: 10,
  set: jest.fn(),
});

// jest.spyOn
const mockClientWidth = jest.spyOn(document.body, 'clientWidth', 'get');
mockClientWidth.mockReturnValue(10);
```

### 匿名函数断言

我们需要对于某个方法测试时，有时需要断言这个方法以具体参数被调用，toBeCalledWith可以实现这个功能，但是设想下面一种情况

``` js
export const func = (): void => {
  if (/* condition 1 */) {
    moduleA.method1(1, () => {
      // do something
    });
  } else {
    moduleA.method1(2);
  }
}
```
在某种情况下，moduleA.method1将会被传入参数1和一个匿名函数，要怎么用toBeCalledWith断言moduleA.method1被以这些参数调用了呢？因为第二个参数是一个匿名函数，外部没办法mock。这个时候，我们可以使用expect.any(Function)来断言：

```js
moduleA.method1 = jest.fn();
// 构造出 condition 1
func();
expect(moduleA.method1).toBeCalledWith(1, expect.any(Function));
```

因为这里其实只关心moduleA.method1是否被传入第二个参数且参数是否为一个函数，而不关心函数的具体内容，所以可以用expect.any(Function)来断言。



## mock node环境不存在的变量

### mock localStorage
localStorage是浏览器环境下的一个全局变量，挂载在window下，在单测运行时（Node环境）是获取不到的，对于localStorage，我们可以实现一个简单的mock：

``` ts
class LocalStorageMock {
  private store: Record<string, string> = {};

  public setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  public getItem(key: string): string | null {
    return this.store[key] || null;
  }

  public removeItem(key: string) {
    delete this.store[key];
  }

  public clear() {
    this.store = {};
  }

  public key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }

  public get length(): number {
    return Object.keys(this.store).length;
  }
}

global.localStorage = new LocalStorageMock();
```


## 问题:

1. spyOn监听的参数和调用次数 监听有误

![](https://pic.imgdb.cn/item/63f8743ff144a010073595f8.jpg) 

如上图琐事 期望调用次数为1 但是监听到的却是0 
