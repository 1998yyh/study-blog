# jest 

看文档写单元测试的时候，发现文档有很多地方没讲清楚，很多demo都是举的特例，容易迷惑人，经过自测与查阅网上各种内容，记录一下部分API需要注意的地方


## Globals

* 我们可以在全局beforeAll 创建对象，定时器等每个describe都会用到的东西。 局部beforeAll 创建局部内需要的对象,但是这样做有个坑就是回丢失代码提示。

* 在afterAll 内可以清除定时器 清空对象 等， 支持传入时间延迟执行

* .only 可以只测试当前这个describe 或者 test 方便调试

* .skip 调试出现某种情况影响调试，可以先skip暂时跳过，省的删除代码

* .each 可以使用一组数据进行多次此


## Expect

* extend可以让我们自定义匹配器 

``` javascript
expect.extend({
  isTen(number) {
    const pass = number === 10;
    if (pass) {
      return {
        message: () => `expected ${number} is ten`, pass: true
      }
    } else {
      return {
        message: () => `expected ${number} is not ten`, pass: false
      }
    }
  }
})
expect(10).isTen()
```

* anything表示非null 和非undefined的值,当我们无法获取到参数的时候可以使用。

* any 匹配使用给定构造函数创建的任何内容,有个问题是 参数相同可以通过 单实际上并不是同一对象


```javascript
class Cat {
    constructor(name) {
        this.name = name
    }
};
const getCat = (fn) => fn(new Cat(1));
const mock = jest.fn();
getCat(mock)
expect(mock).toBeCalledWith(new Cat(1))
```

* assertions(number); 调用次数官方给的demo是

```javascript
test('doAsync calls both callbacks', () => {
    expect.assertions(2);

    function callback1(data) {
        expect(data).toBeTruthy();
    }

    function callback2(data) {
        expect(data).toBeTruthy();
    }
    doAsync(callback1, callback2);
});
```

这里对于函数本身有要求，感觉并无法满足所有情况, 下面写法似乎更加合理

```javascript
const fn1 = () => {
    const mock = jest.fn();
    mock();
    expect(mock).toBeCalled();
};
const fn2 = (data) => {
    const mock = jest.fn();
    mock();
    expect(mock).toBeCalled();
};

doAsync(fn1, fn2)
```

* .toBe不与浮点数一起使用。例如，由于四舍五入，在 JavaScript0.2 + 0.1中并不严格等于0.3 如果您有浮点数，请尝试.toBeCloseTo。
* .toHaveBeenCalled(.toBeCalled) 必须是一个模拟函数 或者 spy 函数
下面写法是不允许的

```javascript
const add = (a, b) => a + b;
add(1, 2);
expect(add).toHaveBeenCalled();
```

如果是外部引入的话 可以使用spy监听

```javascript
const obj = {}
obj.add = (a, b) => a + b;
const spy = jest.spyOn(obj, 'add')
obj.add(1, 2);
expect(spy).toHaveBeenCalled();
```

内部自定义的话

```javascript
const add = (a, b, cb) => {
    const sum = a + b;
    cb && cb();
    return sum
}
const fn = jest.fn();
add(1, 2, fn);
expect(fn).toBeCalled();
```

* 不得不再吐槽一下 jest 文档真的烂 .toHaveBeenCalledWith(arg1, arg2, ...)的官方demo

```javascript
test('registration applies correctly to orange La Croix', () => {
    const beverage = new LaCroix('orange');
    register(beverage);
    const f = jest.fn();
    applyToAll(f);
    expect(f).toHaveBeenCalledWith(beverage);
});
```

所有的函数定义都没写，都不知道是做什么的。建议所有的函数调用的校验，一律使用spy去监听

```javascript
const obj = {};
obj.add = (a, b) => a + b;
const spy = jest.spyOn(obj, 'add')
obj.add(1, 2);
expect(spy).toBeCalledWith(1, 2)
```

* toHaveReturned 系列和 toHaveBeenCalled 系列用法基本相同， 唯一不同的地方在于，called只在乎是否调用了 toHaveReturned 在乎是否没有报错的调用了
* toHaveLength(number) 检查的是对象是否具有.length 属性并且为某个数值， 它的not 行为 则是 检查对象是否具有.length 属性 且 不为某个数值，一切的前提都是要有length属性

```javascript
expect(1).toHaveLength(); //报错
expect(1).not.toHaveLength(); // 报错
```

* toContainEqual(item)当您要检查具有特定结构和值的项目是否包含在数组中时使用。 对象的话检查的是结构 而不是同一个

```javascript
const myBeverage = {
    delicious: true,
    sour: false
}
const arr = [1, 2, 3, {
    delicious: true,
    sour: false
}];
expect(arr).toContainEqual(myBeverage) // 通过
```

* toEqual toBe 在检查对象的时候 toEqual判断的是结构key-value是否相同，toBe 比较的是否是同一个对象。

```javascript
const can1 = {
    flavor: 'grapefruit',
    ounces: 12,
};
const can2 = {
    flavor: 'grapefruit',
    ounces: 12,
};
expect(can1).toEqual(can2);
expect(can1).not.toBe(can2);
```

* toMatchObject 匹配对象属性的子集 

```javascript
const houseForSale = {
    bath: true,
    bedrooms: 4,
    kitchen: {
        amenities: ['oven', 'stove', 'washer'],
        area: 20,
        wallColor: 'white',
    },
};
const desiredHouse = {
    bath: true,
    kitchen: {
        amenities: ['oven', 'stove', 'washer'],
        wallColor: expect.stringMatching(/white|yellow/),
    },
};

test('the house has my desired features', () => {
    expect(houseForSale).toMatchObject(desiredHouse);
});
```

同时也可以处理数组。与另一个API `arrayContaining` 相似，不同的是

arrayContaining 处理预期数组是接收数组的子集。
toMatchObject 检查两个数组的元素数量是否匹配，如果是对象的话，匹配对象属性的子集 

```javascript
// toMatchObject
expect([1, 2, 3, 4]).toMatchObject([1, 2, 3, 4])
expect([1, 2, 3, 4, 5, 6, 7]).not.toMatchObject([1, 2, 3, 4])
expect([1, 2, 3, 4]).not.toMatchObject([1, 2, 4, 3])
expect([{foo: 'bar'}, {baz: 1, extra: 'quux'}]).toMatchObject([{foo: 'bar'}, { baz: 1 },]);

// arrayContaining

expect([1, 2, 3, 4, 6, 5]).toEqual(expect.arrayContaining([1, 5]));
expect([1, [],{}]).toEqual(expect.arrayContaining([{}]));
```

* throws() 必须将代码包装在一个函数中，否则将无法捕获错误并且断言将失败。
``` javascript
expect(new Error()).toThrow() // 报错
expect(()=>{throw 1}).toThrow() // 报错
expect(()=>{new Error()}).toThrow() // 通过
```

## Mock Functions 


* typescript 使用jest.fn() 后的各种方法会报错

``` typescript
import add from './add';
import calculate from './calc';

jest.mock('./add');

// Our mock of `add` is now fully typed
const mockAdd = add as jest.MockedFunction<typeof add>;

test('calculate calls add', () => {
  calculate('Add', 1, 2);

  expect(mockAdd).toBeCalledTimes(1);
  expect(mockAdd).toBeCalledWith(1, 2);
});

```

* mockReset vs mockRestore vs mockClear; 

mockClear: 清除mockFn.mock.calls,mockFn.mock.instances和mockFn.mock.results数组中存储的所有信息。当您想要清理两个断言之间的模拟使用数据时，这通常很有用。
mockReset: 执行所有mockFn.mockClear()操作，并删除任何模拟的返回值或实现。
mockRestore: 执行所有mockFn.mockReset()操作，并恢复原始（非模拟）实现。
``` javascript
// spy mocked
const module = { api: () => 'actual' }
jest.spyOn(module, 'api').mockImplementation(() => 'spy mocked')

expect(module.api()).toStrictEqual('spy mocked')
expect(module.api).toHaveBeenCalledTimes(1)

// module.api.mockClear();
// module.api() 为 spy mocked  无法清除


// module.api.mockReset() 
// module.api() 为 undefined;  直接清除成undefined


// module.api.mockRestore()  恢复成最初设置的属性
// module.api() 为 actual


expect(module.api()).toStrictEqual(undefined)
expect(module.api).toHaveBeenCalledTimes(1)
```

``` javascript
// non-spy mocked
const api = jest.fn(() => 'non-spy mocked')
expect(api()).toStrictEqual('non-spy mocked')
expect(api).toHaveBeenCalledTimes(1)

// api.mockClear()
// api() 为 non-spy mocked 无法清除

api.mockReset()
// api.mockRestore();
// api() 为 undefined 可以清除

expect(api()).toStrictEqual(undefined)
expect(api).toHaveBeenCalledTimes(1)
``` 

## 快照测试（测试组件）
直接按着教程做就好了。
[https://learnku.com/vuejs/t/41116](https://learnku.com/vuejs/t/41116)

## 其他
后续如果遇到其他问题再补充……

## 补充 
https://segmentfault.com/a/1190000041386455