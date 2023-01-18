# chrome调试

## DevTools 基础
1.可以通过ctrl+1~9切换(需要先setting里勾选)，通过ctrl+ '[' / ']'左右切换
2.elements,console,sources&network都支持查找
3.command菜单 ctrl + shift + p 
4.全屏截图 command 菜单中输入 Screenshot 然后选Capture full size screenshot
5.快速切换面板 DevTools一般采用双面板布局 元素面板+资源面板，他根据屏幕可用的部分，以合适阅读的方式展示出来，我们可以通过 command 菜单输入 layout 选择切换横向或竖向展示
6.切换主题 command 菜单输入 theme 切换夜间/白天模式
7.可以通过Sources面板New snippet(新建一个代码块)，复用代码(执行代码块，函数无法传参)

## console部分
1.copy(...) 可以复制前面输出的一大串对象(比如在输出bookinfo的时候不用拖动长条去复制)
2.堆栈信息(报错信息) 可以通过右键save保存(之前都是复制或者截图)
3.$0 指的是当前选中的HTML节点 $1指的是上次 $2上上次 
4.$ 指的是 document.querySelector 
5.$$ 不仅执行了 document.querySelectorAll 并且返回的是一个节点的数组 而不是Node list
6.$_表示上次执行的结果
7.$i 表示下载npm包 例如 $i('lodash') (需要引入Console Importer插件)
8.console.log(输出的对象是引用类型)打印的时候需要打印它复制的对象或者JSON.stringfy输出
9.对象查询 使用 queryObjects 可以查询某个类/构造函数的实例 比如 queryObjects(Object) 会输出所以通过Object new 出来的对象
10.方法(事件同理)跟踪 使用 monitor 可以跟踪某个对象的某个方法，当期调用的时候输出，例如
```javascript
class Person {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
  greet() {
    return this.getMessage('greeting');
  }
  getMessage(type) {
    if (type === 'greeting') {
      return `Hello, I'm ${this.name}!`;
    }
  }
}

var john = new Person('john')
// 跟踪(监听) getMessage方法
monitor(john.getMessage)
// 调用方法
john.greet();
// 控制台输出
`function getMessage called with arguments: greeting`
`Hello, I'm john`
```
11.console.assert()  如果第一个参数为假的时候 会输出第二个参数，node版本低于10的话会阻断下面代码(报错)
12.console.table() 如果有数组、类数组、对象的时候可以通过table打印出来，node版本大于10才会有效果
13.console.dir()  可查看一个元素的属性节点
14.自定义console样式 输出的前面加上一个%a console.log('%ca','font-size:30px;color: red;')
15.Live expression  console下面的一行有个小眼睛的东西，实时的输出东西

## Source 部分
1.条件断点 右击行号 选择Add conditional breakpoint...(添加条件断点)，如果已设置断点，选择Edit breakpoint(编辑断点)，如果条件成立，断点会暂停代码的执行
2.直接输出console 选择Add logpoint 输出日志会在console上

## element 部分
1.选中元素 通过'h'可快速隐藏元素
2.通过拖动放置可移动元素的位置
3.Shadow editor 元素设置了 box-shadow或text-shadow后 该属性前会有一个小按钮，点击弹出一个可视化编辑区域
4.Timing function editor 元素设置timing-function(animation或transition)后 属性前会有一个按钮 点击弹出贝塞尔曲线编辑区，区域上方会有小球运动轨迹示意图
5.样式区域最后有个扩展按钮，可以快速添加字体颜色，背景颜色，字体阴影，盒子阴影
6.expand recursively 右键某个节点可快速展开其全部子节点
7.DOM断点 右击元素 在Break on下，三个按钮
选择 subtree modifications :监听任何它内部的节点被 移除 或者 添加的事件；
选择 attribute modifications :监听任何当前选中的节点被 添加，移除 或者 被修改值的事件；
选择 node removal :监听被选中的元素被 移除 的事件

## 设置
1.自定义格式 
```javascript
window.devtoolsFormatters = [{
  header: function (obj) {
    // 判断是否支持自定义格式
    if (!obj.__clown) {
      return null;
    }
    // 删除旧的格式
    delete obj.__clown;
    // 格式样式
    const style = `
      color: red;
      border: dotted 2px gray;
      border-radius: 4px;
      padding: 5px;
    `
  // 缩进 4
    const content = ` ${JSON.stringify(obj, null, 4)}`;

    try {
      return ['div', {
        style
      }, content]
    } catch (err) { // for circular structures
      return null; // use the default formatter
    }
  },
  // 不输出 箭头扩展形式对象
  hasBody: function () {
    return false;
  }
}]

console.clown = function (obj) {
  console.log({
    ...obj,
    __clown: true
  });
}

console.log({
  message: 'hello!'
}); // normal log
console.clown({
  message: 'hello!'
}); // a silly log
```