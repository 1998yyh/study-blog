# Rollup

## 配置

rollup配置大全 

https://www.rollupjs.com/guide/big-list-of-options 
### 简单的配置

```JS
// src/index.js
import {
    add
} from "./util";
console.log(add(1, 2));

// src/util.js
export const add = (a, b) => a + b;

export const multi = (a, b) => a * b;
// rollup.config.js
// 以下注释是为了能使用 VSCode 的类型提示
/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
    input: ["src/index.js"],
    output: {
        // 产物输出目录
        dir: "dist/es",
        // 产物格式
        format: "esm",
    },
};

export default buildOptions;
```

然后运行指令 `rollup -C` 我们就打包出了文件

```js
const add = (a, b) => a + b;

console.log(add(1, 2));
```

同时你也可以发现，util.js中的multi方法并没有被打包到产物中，这是因为 Rollup 具有天然的 Tree Shaking 功能，可以分析出未使用到的模块并自动擦除。

所谓 Tree Shaking(摇树)，也是计算机编译原理中DCE(Dead Code Elimination，即消除无用代码) 技术的一种实现。由于 ES 模块依赖关系是确定的，和运行时状态无关。因此 Rollup 可以在编译阶段分析出依赖关系，对 AST 语法树中没有使用到的节点进行删除，从而实现 Tree Shaking。

### 出入口配置

#### 自定义出口配置

```JS
output: {
    // 产物输出目录
    dir: path.resolve(__dirname, 'dist'),
    // 以下三个配置项都可以使用这些占位符:
    // 1. [name]: 去除文件后缀后的文件名
    // 2. [hash]: 根据文件名和文件内容生成的 hash 值
    // 3. [format]: 产物模块格式，如 es、cjs
    // 4. [extname]: 产物后缀名(带`.`)
    // 入口模块的输出文件名
    entryFileNames: `[name].js`,
    // 非入口模块(如动态 import)的输出文件名
    chunkFileNames: 'chunk-[hash].js',
    // 静态资源文件输出文件名
    assetFileNames: 'assets/[name]-[hash][extname]',
    // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
    format: 'cjs',
    // 是否生成 sourcemap 文件
    sourcemap: true,
    // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
    name: 'MyBundle',
    // 全局变量声明
    globals: {
        // 项目中可以直接用`$`代替`jquery`
        jquery: '$'
    }
}
```

#### 多入口

将 input 设置为一个数组或者一个对象

```JS
{
    input: ["src/index.js", "src/util.js"]
}
// 或者
{
    input: {
        index: "src/index.js",
        util: "src/util.js",
    },
}
```

#### 多出口

在打包 JavaScript 类库的场景中，我们通常需要对外暴露出不同格式的产物供他人使用，不仅包括 ESM，也需要包括诸如CommonJS、UMD等格式，保证良好的兼容性。那么，同一份入口文件，如何让 Rollup 给我们打包出不一样格式的产物呢？我们基于上述的配置文件来进行修改:

```js
// rollup.config.js
/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
    input: ["src/index.js"],
    // 将 output 改造成一个数组
    output: [{
            dir: "dist/es",
            format: "esm",
        },
        {
            dir: "dist/cjs",
            format: "cjs",
        },
    ],
};

export default buildOptions;
```

如果不同入口对应的打包配置不一样，我们也可以默认导出一个配置数组，如下所示:

```JS
// rollup.config.js
/**
 * @type { import('rollup').RollupOptions }
 */
const buildIndexOptions = {
    input: ["src/index.js"],
    output: [
        // 省略 output 配置
    ],
};

/**
 * @type { import('rollup').RollupOptions }
 */
const buildUtilOptions = {
    input: ["src/util.js"],
    output: [
        // 省略 output 配置
    ],
};

export default [buildIndexOptions, buildUtilOptions];
```

#### 依赖 external

对于某些第三方包，有时候我们不想让 Rollup 进行打包，也可以通过 external 进行外部化:

```JS
{
    external: ['react', 'react-dom']
}
```

在 SSR 构建或者使用 ESM CDN 的场景中，这个配置将非常有用

#### 接入插件能力

在 Rollup 的日常使用中，我们难免会遇到一些 Rollup 本身不支持的场景，比如兼容 CommonJS 打包、注入环境变量、配置路径别名、压缩产物代码 等等。这个时候就需要我们引入相应的 Rollup 插件了。

虽然 Rollup 能够打包输出出 CommonJS 格式的产物，但对于输入给 Rollup 的代码并不支持 CommonJS，仅仅支持 ESM。目前为止，还是有不少第三方依赖只有 CommonJS 格式产物而并未提供 ESM 产物，比如项目中用到 lodash 时，打包回报错

因此，我们需要引入额外的插件去解决这个问题。

首先需要安装两个核心的插件包:

```JS
npm i @rollup / plugin - node - resolve @rollup / plugin - commonjs
```

* @rollup/plugin-node-resolve是为了允许我们加载第三方依赖，否则像import React from 'react' 的依赖导入语句将不会被 Rollup 识别。
* @rollup/plugin-commonjs 的作用是将 CommonJS 格式的代码转换为 ESM 格式

其他的rollup库

* @rollup/plugin-json： 支持.json的加载，并配合rollup的Tree Shaking机制去掉未使用的部分，进行按需打包。
* @rollup/plugin-babel：在 Rollup 中使用 Babel 进行 JS 代码的语法转译。
* @rollup/plugin-typescript: 支持使用 TypeScript 开发。
* @rollup/plugin-alias：支持别名配置。
* @rollup/plugin-replace：在 Rollup 进行变量字符串的替换。
* rollup-plugin-visualizer: 对 Rollup 打包产物进行分析，自动生成产物体积可视化分析图。

## JS api 构建

些场景下我们需要基于 Rollup 定制一些打包过程，配置文件就不够灵活了，这时候我们需要用到对应 JavaScript API 来调用 Rollup，主要分为rollup.rollup和rollup.watch两个 API

### rollup.rollup

主要的执行步骤如下:

1. 通过 rollup.rollup方法，传入 inputOptions，生成 bundle 对象；
2. 调用 bundle 对象的 generate 和 write 方法，传入outputOptions，分别完成产物和生成和磁盘写入。
3. 调用 bundle 对象的 close 方法来结束打包。

```JS
// build.js
const rollup = require("rollup");

// 常用 inputOptions 配置
const inputOptions = {
    input: "./src/index.js",
    external: [],
    plugins: []
};

const outputOptionsList = [
    // 常用 outputOptions 配置
    {
        dir: 'dist/es',
        entryFileNames: `[name].[hash].js`,
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        format: 'es',
        sourcemap: true,
        globals: {
            lodash: '_'
        }
    }
    // 省略其它的输出配置
];

async function build() {
    let bundle;
    let buildFailed = false;
    try {
        // 1. 调用 rollup.rollup 生成 bundle 对象
        bundle = await rollup.rollup(inputOptions);
        for (const outputOptions of outputOptionsList) {
            // 2. 拿到 bundle 对象，根据每一份输出配置，调用 generate 和 write 方法分别生成和写入产物
            const {
                output
            } = await bundle.generate(outputOptions);
            await bundle.write(outputOptions);
        }
    } catch (error) {
        buildFailed = true;
        console.error(error);
    }
    if (bundle) {
        // 最后调用 bundle.close 方法结束打包
        await bundle.close();
    }
    process.exit(buildFailed ? 1 : 0);
}

build();
```

### rollup.watch

```JS
// watch.js
const rollup = require("rollup");

const watcher = rollup.watch({
    // 和 rollup 配置文件中的属性基本一致，只不过多了`watch`配置
    input: "./src/index.js",
    output: [{
            dir: "dist/es",
            format: "esm",
        },
        {
            dir: "dist/cjs",
            format: "cjs",
        },
    ],
    watch: {
        exclude: ["node_modules/**"],
        include: ["src/**"],
    },
});

// 监听 watch 各种事件
watcher.on("restart", () => {
    console.log("重新构建...");
});

watcher.on("change", (id) => {
    console.log("发生变动的模块id: ", id);
});

watcher.on("event", (e) => {
    if (e.code === "BUNDLE_END") {
        console.log("打包信息:", e);
    }
});
```

## 插件机制

仅仅使用 Rollup 内置的打包能力很难满足项目日益复杂的构建需求。对于一个真实的项目构建场景来说，我们还需要考虑到模块打包之外的问题，比如路径别名(alias) 、全局变量注入和代码压缩等等。

可要是把这些场景的处理逻辑与核心的打包逻辑都写到一起，一来打包器本身的代码会变得十分臃肿，二来也会对原有的核心代码产生一定的侵入性，混入很多与核心流程无关的代码，不易于后期的维护。因此 ，Rollup 设计出了一套完整的插件机制，将自身的核心逻辑与插件逻辑分离，让你能按需引入插件功能，提高了 Rollup 自身的可扩展性。

Rollup 的打包过程中，会定义一套完整的构建生命周期，从开始打包到产物输出，中途会经历一些标志性的阶段，并且在不同阶段会自动执行对应的插件钩子函数(Hook)。对 Rollup 插件来讲，最重要的部分是钩子函数，一方面它定义了插件的执行逻辑，也就是"做什么"；另一方面也声明了插件的作用阶段，即"什么时候做"，这与 Rollup 本身的构建生命周期息息相关。

因此，要真正理解插件的作用范围和阶段，首先需要了解 Rollup 整体的构建过程中到底做了些什么。

### 整个rollup内部逻辑可以简化如下

```js
// build 阶段
const bundle = await rollup.rollup(inputOptions);

// Output 阶段
await Promise.all(outputOptions.map(bundle.write));

// 构建结束
await bundle.close();
```

build阶段 主要负责创建模块依赖图 , 初始化各个模块的AST以及模块之前的依赖关系.

```JavaScript
// src/index.js
import {
    a
} from './module-a';
console.log(a);

// src/module-a.js
export const a = 1;
```

执行下面的构建脚本

``` JS
const rollup = require('rollup');
const util = require('util');
async function build() {
  const bundle = await rollup.rollup({
    input: ['./src/index.js'],
  });
  console.log(util.inspect(bundle));
}
build();

```

我们可以看到这样的bundle对象信息

```js
{
  cache: {
    modules: [
      {
        ast: 'AST 节点信息，具体内容省略',
        code: 'export const a = 1;',
        dependencies: [],
        id: '/Users/code/rollup-demo/src/data.js',
        // 其它属性省略
      },
      {
        ast: 'AST 节点信息，具体内容省略',
        code: "import { a } from './data';\n\nconsole.log(a);",
        dependencies: [
          '/Users/code/rollup-demo/src/data.js'
        ],
        id: '/Users/code/rollup-demo/src/index.js',
        // 其它属性省略
      }
    ],
    plugins: {}
  },
  closed: false,
  // 挂载后续阶段会执行的方法
  close: [AsyncFunction: close],
  generate: [AsyncFunction: generate],
  write: [AsyncFunction: write]
}
```


从上面的信息中可以看出，目前经过 Build 阶段的 bundle 对象其实并没有进行模块的打包，这个对象的作用在于存储各个模块的内容及依赖关系，同时暴露generate和write方法，以进入到后续的 Output 阶段（write和generate方法唯一的区别在于前者打包完产物会写入磁盘，而后者不会）。

所以，真正进行打包的过程会在 Output 阶段进行，即在bundle对象的 generate或者write方法中进行。



``` js
const rollup = require('rollup');
async function build() {
  const bundle = await rollup.rollup({
    input: ['./src/index.js'],
  });
  const result = await bundle.generate({
    format: 'es',
  });
  console.log('result:', result);
}

build();

```


执行后得到以下输出

```js
{
  output: [
    {
      exports: [],
      facadeModuleId: '/Users/hao.yang/Desktop/self/rollupProject/test/index.js',
      isDynamicEntry: false,
      isEntry: true,
      isImplicitEntry: false,
      modules: [Object: null prototype],
      name: [Getter],
      type: 'chunk',
      code: 'const a = 1;\n\n// src/index.js\nconsole.log(a);\n\n// src/module-a.js\n',
      dynamicImports: [],
      fileName: 'index.js',
      implicitlyLoadedBefore: [],
      importedBindings: {},
      imports: [],
      map: null,
      referencedFiles: []
    }
  ]
}
```

对于一次完整的构建过程而言， Rollup 会先进入到 Build 阶段，解析各模块的内容及依赖关系，然后进入Output阶段，完成打包及输出的过程。对于不同的阶段，Rollup 插件会有不同的插件工作流程




### 拆解插件工作流


#### 谈谈插件 Hook 类型

插件的各种 Hook 可以根据这两个构建阶段分为两类: Build Hook 与 Output Hook。

1. Build Hook即在Build阶段执行的钩子函数，在这个阶段主要进行模块代码的转换、AST 解析以及模块依赖的解析，那么这个阶段的 Hook 对于代码的操作粒度一般为模块级别，也就是单文件级别。

2. Ouput Hook(官方称为Output Generation Hook)，则主要进行代码的打包，对于代码而言，操作粒度一般为 chunk级别(一个 chunk 通常指很多文件打包到一起的产物)。

除了根据构建阶段可以将 Rollup 插件进行分类，根据不同的 Hook 执行方式也会有不同的分类，主要包括`Async`、`Sync`、`Parallel`、`Squential`、`First`这五种。在后文中我们将接触各种各样的插件 Hook，但无论哪个 Hook 都离不开这五种执行方式。

##### 1. Async & Sync

首先是Async和Sync钩子函数，两者其实是相对的，分别代表异步和同步的钩子函数，两者最大的区别在于同步钩子里面不能有异步逻辑，而异步钩子可以有。


##### 2. Parallel

这里指并行的钩子函数。如果有多个插件实现了这个钩子的逻辑，一旦有钩子函数是异步逻辑，则并发执行钩子函数，不会等待当前钩子完成(底层使用 Promise.all)。

比如对于Build阶段的buildStart钩子，它的执行时机其实是在构建刚开始的时候，各个插件可以在这个钩子当中做一些状态的初始化操作，但其实插件之间的操作并不是相互依赖的，也就是可以并发执行，从而提升构建性能。反之，对于需要依赖其他插件处理结果的情况就不适合用 Parallel 钩子了，比如 transform。


##### 3. Sequential

Sequential 指串行的钩子函数。这种 Hook 往往适用于插件间处理结果相互依赖的情况，前一个插件 Hook 的返回值作为后续插件的入参，这种情况就需要等待前一个插件执行完 Hook，获得其执行结果，然后才能进行下一个插件相应 Hook 的调用，如transform。

##### 4. First

如果有多个插件实现了这个 Hook，那么 Hook 将依次运行，直到返回一个非 null 或非 undefined 的值为止。比较典型的 Hook 是 resolveId，一旦有插件的 resolveId 返回了一个路径，将停止执行后续插件的 resolveId 逻辑。



#### Build 工作流

1. 首先经历 options 钩子进行配置的转换，得到处理后的配置对象。

2. 随之 Rollup 会调用buildStart钩子，正式开始构建流程。

3. Rollup 先进入到 resolveId 钩子中解析文件路径。(从 input 配置指定的入口文件开始)。

4. Rollup 通过调用load钩子加载模块内容。

5. 紧接着 Rollup 执行所有的 transform 钩子来对模块内容进行进行自定义的转换，比如 babel 转译。

6. 现在 Rollup 拿到最后的模块内容，进行 AST 分析，得到所有的 import 内容，调用 moduleParsed 钩子:

  + 6.1 如果是普通的 import，则执行 resolveId 钩子，继续回到步骤3。
  + 6.2 如果是动态 import，则执行 resolveDynamicImport 钩子解析路径，如果解析成功，则回到步骤4加载模块，否则回到步骤3通过 resolveId 解析路径。
7. 直到所有的 import 都解析完毕，Rollup 执行buildEnd钩子，Build 阶段结束。

当然，在 Rollup 解析路径的时候，即执行resolveId或者resolveDynamicImport的时候，有些路径可能会被标记为external(翻译为排除)，也就是说不参加 Rollup 打包过程，这个时候就不会进行load、transform等等后续的处理了。