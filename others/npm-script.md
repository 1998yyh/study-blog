# npm-script 

### 用 npm init 快速创建项目


npm 为我们提供了快速创建 package.json 文件的命令 npm init，执行该命令会问几个基本问题，如包名称、版本号、作者信息、入口文件、仓库地址、许可协议等，多数问题已经提供了默认值，你可以在问题后敲回车接受默认值：

``` json
{
  "name": "hello-npm-script",
  "version": "0.1.0",
  "description": "hello npm script",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "npm",
    "script"
  ],
  "license": "MIT"
}
```


### 用 npm run 执行任意命令

使用 npm init 创建的 package.json 文件中包含了 scripts 字段：

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

在终端中运行npm run test 能看到 Erroe: no test specified 的输出. npm run test 可以简写为npm test 或者更简单的npm t ,得到的结果是几乎相同的.npm test顾名思义,就是运行项目的测试.

npm run 实际上是 npm run-script 命令的简写。当我们运行 npm run xxx 时，基本步骤如下：

1. 从 package.json 文件中读取 scripts 对象里面的全部配置；
2. 以传给 npm run 的第一个参数作为键，本例中为 xxx，在 scripts 对象里面获取对应的值作为接下来要执行的命令，如果没找到直接报错；
3. 在系统默认的 shell 中执行上述命令，系统默认 shell 通常是 bash，windows 环境下可能略有不同。


如果不带任何参数执行 npm run，它会列出可执行的所有命令

npm 在执行指定 script 之前会把 node_modules/.bin 加到环境变量 $PATH 的前面，这意味着任何内含可执行文件的 npm 依赖都可以在 npm script 中直接调用，换句话说，你不需要在 npm script 中加上可执行文件的完整路径，比如 ./node_modules/.bin/eslint **.js


### 让多个 npm script 串行？

只需要用 && 符号把多条 npm script 按先后顺序串起来即可

串行执行的时候如果前序命令失败（通常进程退出码非0），后续全部命令都会终止

### 让多个 npm script 并行？

把连接多条命令的 && 符号替换成 & 即可。

但是 npm 内置支持的多条命令并行跟 js 里面同时发起多个异步请求非常类似，它只负责触发多条命令，而不管结果的收集，如果并行的命令执行时间差异非常大,解决也很简单,在命令的增加 & wait 即可

加上 wait 的额外好处是，如果我们在任何子命令中启动了长时间运行的进程，比如启用了 mocha 的 --watch 配置，可以使用 ctrl + c 来结束进程，如果没加的话，你就没办法直接结束启动到后台的进程。

### 有没有更好的管理方式？

有强迫症的同学可能会觉得像上面这样用原生方式来运行多条命令很臃肿，幸运的是，我们可以使用 npm-run-all 实现更轻量和简洁的多命令运行。

然后修改 package.json 实现多命令的串行执行：`npm-run-all lint:js lint:css lint:json lint:markdown mocha`

npm-run-all 还支持通配符匹配分组的 npm script，上面的脚本可以进一步简化成:`npm-run-all lint:* mocha`;

让多个 npm script 并行执行？也很简单：`npm-run-all --parallel lint:* mocha`,并行执行的时候，我们并不需要在后面增加 & wait，因为 npm-run-all 已经帮我们做了。


### 给 npm script 传递参数

eslint 内置了代码风格自动修复模式，只需给它传入 --fix 参数即可，在 scripts 中声明检查代码命令的同时你可能也需要声明修复代码的命令，面对这种需求，大多数同学可能会忍不住复制粘贴，如下：

``` json
{
   "lint:js": "eslint *.js",
  "lint:js:fix": "eslint *.js --fix",
}
```

在 lint:js 命令比较短的时候复制粘贴的方法简单粗暴有效，但是当 lint:js 命令变的很长之后，难免后续会有人改了 lint:js 而忘记修改 lint:js:fix

更健壮的做法是，在运行 npm script 时给定额外的参数，代码修改如下：

``` json
{
   "lint:js": "eslint *.js",
   "lint:js:fix": "npm run lint:js -- --fix",
}
```

要格外注意 `--fix` 参数前面的 `--` 分隔符，意指要给 `npm run lint:js` 实际指向的命令传递额外的参数。


### 给 npm script 添加注释

如果 package.json 中的 scripts 越来越多，或者出现复杂的编排命令，你可能需要给它们添加注释以保障代码可读性，但 json 天然是不支持添加注释的，下面是 2 种比较 trick 的方式。

第一种方式是，package.json 中可以增加 // 为键的值，注释就可以写在对应的值里面，npm 会忽略这种键，比如，我们想要给 test 命令添加注释，按如下方式添加：

``` json
{
  "//": "运行所有代码检查和单元测试",
  "test": "npm-run-all --parallel lint:* mocha"
}
```


另外一种方式是直接在 script 声明中做手脚，因为命令的本质是 shell 命令（适用于 linux 平台），我们可以在命令前面加上注释，具体做法如下：

``` json
{
  "test": "# 运行所有代码检查和单元测试 \n    npm-run-all --parallel lint:* mocha"
}

```

注意注释后面的换行符 \n 和多余的空格，换行符是用于将注释和命令分隔开，这样命令就相当于微型的 shell 脚本，多余的空格是为了控制缩进，也可以用制表符 \t 替代。这种做法能让 npm run 列出来的命令更美观，但是 scripts 声明阅读起来不那么整齐美观。


### 调整 npm script 运行时日志输出


在运行 npm script 出现问题时你需要有能力去调试它，某些情况下你需要让 npm script 以静默的方式运行，这类需求可通过控制运行时日志输出级别来实现。

#### 显示尽可能少的有用信息

需要使用 --loglevel silent，或者 --silent，或者更简单的 -s 来控制（只有命令本身的输出，读起来非常的简洁）,执行各种 lint script 的时候启用了 -s 配置，代码都符合规范的话，你不会看到任何输出

#### 显示尽可能多的运行时状态

排查脚本问题的时候比较有用，需要使用 --loglevel verbose，或者 --verbose，或者更简单的 -d 来控制，这个日志级别的输出实例如下


### 使用 npm script 的钩子

为了方便开发者自定义，npm script 的设计者为命令的执行增加了类似生命周期的机制，具体来说就是 pre 和 post 钩子脚本。这种特性在某些操作前需要做检查、某些操作后需要做清理的情况下非常有用。

举例来说，运行 npm run test 的时候，分 3 个阶段：

1. 检查 scripts 对象中是否存在 pretest 命令，如果有，先执行该命令；
2. 检查是否有 test 命令，有的话运行 test 命令，没有的话报错；
3. 检查是否存在 posttest 命令，如果有，执行 posttest 命令；

比如:
``` json
{
   "pretest": "npm run lint",
   "test": "mocha tests/"
}
```

当我们运行npm test的时候,会先执行pretest里面的lint



### 在 npm script 中使用变量

npm 为加高效的执行 npm script 做了大量的优化,环境变量特性能让我们在 npm script 中直接调用依赖包里的可执行文件，更强大的是，npm 还提供了 $PATH 之外的更多的变量，比如当前正在执行的命令、包的名称和版本号、日志输出的级别等。

DRY（Don't Repeat Yourself）是基本的编程原则，在 npm script 中使用预定义变量和自定义变量让我们更容易遵从 DRY 原则，因为使用这些变量之后，npm script 就具备了自适应的能力，我们可以直接把积累起来的 npm script 使用到其他项目里面，而不用做任何修改。


通过运行 npm run env 就能拿到完整的变量列表，这个列表非常长，这里我使用 npm run env | grep npm_package | sort 拿到部分排序后的预定义环境变量


```
npm_package_author=
npm_package_description=
npm_package_devDependencies_nyc=^15.1.0
npm_package_devDependencies_opn_cli=^5.0.0
npm_package_license=ISC
npm_package_main=index.js
npm_package_name=npmscript
npm_package_scripts_cover=nyc --reporter=html npm test
npm_package_scripts_env=env
npm_package_scripts_postcover=rm -rf .nyc_output && opn coverage/index.html
npm_package_scripts_precover=rm -rf coverage
npm_package_version=1.0.0
```

变量的使用方法遵循 shell 里面的语法，直接在 npm script 给想要引用的变量前面加上 $ 符号即可。比如：

```
"console":"echo $npm_package_devDependencies_nyc"
```


### 使用自定义变量

除了预定义变量外，我们还可以在 package.json 中添加自定义变量，并且在 npm script 中使用这些变量。

比如我们使用http-server

```json
{
  "config": {
    "port": 3000
  },
  "script":{
    "cover:serve": "http-server coverage_archive/$npm_package_version -p $npm_package_config_port",
    "cover:open": "opn http://localhost:$npm_package_config_port",
    "postcover": "npm-run-all cover:archive cover:cleanup --parallel cover:serve cover:open"
  }
}
```

### 自动完成

npm 命令补全到目前为止显然还不够高效，能不能补全 package.json 里面的依赖名称？能不能在补全 npm script 的时候列出这个命令是干啥的？

有人已经帮我们解决了这个痛点，还写成了 zsh 插件 zsh-better-npm-completion


### node.js 脚本替代复杂的 npm script




```
npm i scripty -D
```


``` js
const { rm, cp, mkdir, exec, echo, env } = require('shelljs');
const chalk = require('chalk');
const npm_package_version = env['npm_package_version'];

console.log(chalk.green('1. remove old coverage reports...'));
rm('-rf', 'coverage');
rm('-rf', '.nyc_output');

console.log(chalk.green('2. run test and collect new coverage...'));
exec('nyc --reporter=html npm run test');

console.log(chalk.green('3. archive coverage report by version...'));
mkdir('-p', 'coverage_archive/' + npm_package_version);
cp('-r', 'coverage/*', 'coverage_archive/' + npm_package_version);

console.log(chalk.green('4. open coverage report for preview...'));
exec('npm-run-all --parallel cover:serve cover:open');

```


### 在 Git Hooks 中执行 npm script

严肃的研发团队都会使用 Git 之类的版本管理系统来管理代码，随着 GitHub 的广受欢迎，相信大家对 Git 并不陌生。Git 在代码版本管理之外，也提供了类似 npm script 里 pre、post 的钩子机制，叫做 Git Hooks，钩子机制能让我们在代码 commit、push 之前（后）做自己想做的事情。


前端社区里有多种结合 npm script 和 git-hooks 的方案，比如 pre-commit、husky，相比较而言 husky 更好用，它支持更多的 Git Hooks 种类，再结合 lint-staged 试用就更溜。


```
npm i husky lint-staged -D

```

``` json
  "scripts": {
    "precommit": "npm run lint",
    "prepush": "npm run test",
    "test": "jest",
    "format": "prettier --single-quote --no-semi --write **/*.js",
    "install": "node ./bin/install.js",
    "uninstall": "node ./bin/uninstall.js"
  }
```


这两个命令的作用是在代码提交前运行所有的代码检查 npm run lint；在代码 push 到远程之前，运行 lint 和自动化测试（言外之意，如果测试失败，push 就不会成功），虽然运行的是 npm run test，但是 lint 也配置在了 pretest 里面。


在大型项目、遗留项目中接入过 lint 工作流的同学可能深有体会，每次提交代码会检查所有的代码,lint-staged 来环节这个问题，每个团队成员提交的时候，只检查当次改动的文件，具体改动如下：

``` json
   "scripts": {
-    "precommit": "npm run lint",
+    "precommit": "lint-staged",
     "prepush": "npm run test",
     "lint": "npm-run-all --parallel lint:*",
   },
  "lint-staged": {
    "*.js": "eslint",
    "*.less": "stylelint",
    "*.css": "stylelint",
    "*.json": "jsonlint --quiet",
    "*.md": "markdownlint --config .markdownlint.json"
  },
  "keywords": [],
```

