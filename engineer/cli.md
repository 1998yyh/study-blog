# CLI

主要是几个库

地址: https://juejin.cn/post/7178666619135066170
地址2: https://juejin.cn/post/6966119324478079007#heading-19
demo库: https://github.com/HermitGeek/node-cli-template

## commander 

```js
const {
    Command
} = require('commander')
const program = new Command()
```

* version : `program.version(这个地方写具体版本, '-v, --version ', '@calmer/terminal-cli 当前版本')`
* option
  + 布尔选项: `program.option('-c, --copy','布尔选项')` 如果指令中带有 -c 则选项copy 为true
  + 带参数选项 : `program.option('-d, --dir <dirname>', '带参选项描述', '选项默认值') ` 带参选项 取值时 支持默认值
  + 数组选项值 : `program.option('-i, --ip [dirname...]', '带参选项描述')` 数组参数 指令中多个参数空格分割 

* action : 定义命令的回调函数
* parse : 解析用户执行命令传入的参数
* hook: preAction postAction preSubcommand
* on 

## inquirer

#### question 

```js
{
    type: String, // 表示提问的类型，下文会单独解释
    name: String, // 在最后获取到的answers回答对象中，作为当前这个问题的键
    message: String | Function, // 打印出来的问题标题，如果为函数的话
    default: String | Number | Array | Function, // 用户不输入回答时，问题的默认值。或者使用函数来return一个默认值。假如为函数时，函数第一个参数为当前问题的输入答案。
    choices: Array | Function, // 给出一个选择的列表，假如是一个函数的话，第一个参数为当前问题的输入答案。为数组时，数组的每个元素可以为基本类型中的值。
    validate: Function, // 接受用户输入，并且当值合法时，函数返回true。当函数返回false时，一个默认的错误信息会被提供给用户。
    filter: Function, // 接受用户输入并且将值转化后返回填充入最后的answers对象内。
    when: Function | Boolean, // 接受当前用户输入的answers对象，并且通过返回true或者false来决定是否当前的问题应该去问。也可以是简单类型的值。
    pageSize: Number, // 改变渲染list,rawlist,expand或者checkbox时的行数的长度。
}
```

#### question type

1. List `{type:"list"}`
问题对象中必须有type, name, message, choices等属性，同时，default选项必须为默认值在choices数组中的位置索引(Boolean)

2. Raw list `{type:"rawlist"}`
与List类型类似, 不同在于, list打印出来为无须列表, 而rawlist打印为有序列表

3. Expand`{type:"expand"}`
同样是生成列表，但是在choices属性中需要增加一个属性：key，这个属性用于快速选择问题的答案。类似于alias或者shorthand的东西。同时这个属性值必须为一个小写字母

4. Checkbox`{type: 'checkbox'}`
其余诸项与list类似，主要区别在于，是以一个checkbox的形式进行选择。同时在choices数组中，带有checked: true属性的选项为默认值。

5. Confirm `{type: 'confirm'}`
提问，回答为Y/N。若有default属性，则属性值应为Boolean类型

6. Input `{type: 'input'}`
获取用户输入字符串

7. Password `{type: 'password'}`
与input类型类似，只是用户输入在命令行中呈现为XXXX

8. Editor `{type: 'editor'}`
终端打开用户默认编辑器，如vim，notepad。并将用户输入的文本传回

#### demo

``` js
inquirer.prompt({
  type: 'input', // 交互组件类型
  name: 'name', // 数据属性名称
  message: '用户名', // 交互提示
  default: '', // 默认值
  choices: '', // 当交互类型为`选择类型`时, 该属性配置可选项目

  // 校验函数, 函数以当前回答为参数。 返回: true 通过 false 不通过,无提示 Error 不通过,显示错误信息
  validate(value){
    return !value.length ? new Error('项目名称不能为空') : true
  },

  // 过滤器, 返回修改后的回答。优先级高于 `validte`
  filter(value){
      return /vue/.test(value) ? `${value}-demo` : value
  },

  // 转换器, 返回转换后的值，只作为显示，不影响收集结果
  transformer(value){
      return /vue/.test(value) ? `${value}-demo` : value
  },

  // 是否显示问题
  when(answers){
      return !!answers.company
  },

  // message 前缀
  prefix: '',
  // message 后缀
  suffix: '',
  // 如果回答已存在, 是否依然提问
  askAnswered: false,
}).then((answers) => {
        // answers.project
}).catch((error) => {
  console.error('出错啦！', error);
});

//  Separator 分割线
inquirer.prompt([
  {
    type: 'checkbox',
    name: '多选',
    message: 'checkbox',
    choices: [ "Choice A", new inquirer.Separator(), "choice B" ]
  }
])
```

## Ora

命令行提示图标 或者 小动画 

``` js
import ora from 'ora';

const spinner = ora({
  text: "链接网络中"
}).start(); // 开始状态 => 加载状态

setTimeout(() => {
  spinner.color = "yellow";
  spinner.text = "网速有点慢";
}, 1000); // 还是 加载状态, 更新文案和颜色

setTimeout(() => {
  spinner.succeed("下载成功"); // 加载状态 => 成功状态
}, 2000);
```

## chalk
``` js
import chalk from 'chalk';

console.log(chalk.blue('Hello world!'));
console.log(chalk.blue.bgRed.bold('Hello world!'));
```

## progress 
``` js
var ProgressBar = require('progress');

var bar = new ProgressBar(':bar', { total: 10 });
var timer = setInterval(function () {
  bar.tick();
  if (bar.complete) {
    console.log('\ncomplete\n');
    clearInterval(timer);
  }
}, 100);
```

## 终端持久化存储 configstore、conf

``` js
import Configstore from 'configstore';


const config = new Configstore('name', {foo: 'bar'});
console.log(config.get('foo'));
//=> 'bar'

config.set('awesome', true);
console.log(config.get('awesome'));
//=> true

// Use dot-notation to access nested properties.
config.set('bar.baz', true);
console.log(config.get('bar'));
//=> {baz: true}

config.delete('awesome');
console.log(config.get('awesome'));
//=> undefined
```


```js
const Conf = require('conf');

const config = new Conf();

config.set('unicorn', '🦄');
console.log(config.get('unicorn'));
//=> '🦄'

// Use dot-notation to access nested properties
config.set('foo.bar', true);
console.log(config.get('foo'));
//=> {bar: true}

config.delete('unicorn');
console.log(config.get('unicorn'));
//=> undefined
```


## JS 中执行 Shell 脚本