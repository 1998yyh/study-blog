# NODEJS PATH模块

由于使用的是 ESModule   没有__dirname __filename 这样的环境变量 引入需要以下方案

``` javascript
import { fileURLToPath} from 'url';
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
```

## windows路径规范 

[https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file#maximum-path-length-limitation](https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file#maximum-path-length-limitation)

如果文件名不以以下之一开头，则文件名是相对于当前目录的：
  + 任何格式的 UNC 名称，始终以两个反斜杠字符 ("\\") 开头。有关更多信息，请参阅下一节。
  + 带有反斜杠的磁盘指示符，例如“C:\”或“d:\”。
  + 单个反斜杠，例如“\directory”或“\file.txt”。这也称为绝对路径。

如果文件名仅以磁盘指示符开头，而不以冒号后的反斜杠开头，则将其解释为具有指定字母的驱动器上当前目录的相对路径。请注意，当前目录可能是也可能不是根目录，具体取决于它在该磁盘上最近一次“更改目录”操作期间的设置。这种格式的例子如下：
  + `C:tmp.txt` 指的是C盘当前目录下一个名为`tmp.txt`的文件。
  + `C:tempdir\tmp.txt` 指的是驱动器 C 上当前目录的子目录中的文件。

## windows路径限制 

路径的最大长度为MAX_PATH，定义为 260 个字符。在更高版本的 Windows 中，需要更改注册表项或使用组策略工具才能取消限制。

## path.basename(path[, ext])

path.basename() 方法返回 path 的最后一部分, 并非文档参数中的文件扩展名

```javascript
const virtualPath = '/foo/bar/baz/qq.html'
const basename = path.basename(virtualPath) // qq.html
const basename2 = path.basename(virtualPath, 'html') // qq.
const basename3 = path.basename(virtualPath, 'q.html') // q
/** 很明显发现 只是很粗略的去匹配掉了一样的部分 */
const virtualPath2 = '/foo/bar/baz/qq.html.qq.html'
const basename4 = path.basename(virtualPath2, 'q') // qq.html.qq.html
/** 测试处理大小写 */
const upperCase = '/foo/bar/baz/qq.html.qq.HTML';
const basename5 = path.basename(upperCase, 'html') // qq.html.qq.HTML
// Windows 通常以不区分大小写的方式处理文件名（包括文件扩展名），但此函数不会。 例如，C:\\foo.html 和 C:\\foo.HTML 指的是同一个文件，但 basename 将扩展名视为区分大小写的字符串：
const basename6 = path.basename('.a.b')
```

**注**: 
1. path 不会处理大小写问题，如果大小写不一致 不会匹配(windows环境 一样(未测试))
2. 如果path 和 ext不是字符串会报错

## path.delimiter

`; ` 用于 Windows
`:` 用于 POSIX

**注**：要与路径片段分隔符区分，路径界定符是用于分割多个路径，在系统变量里，多个路径是凭借成一个字符串存储的，而非数组集合。

## path.dirname(path)

方法返回 path 的目录名; 

**注**：
1. 其会忽略尾随的路径分隔符,例如`/foo/bar/` 和 `/foo/bar`是一样的
2. 如果path没有路径分隔符,例如`asd` 则 返回`.`

```javascript
const virtualPath = '/foo/bar/baz/qq.html'
const dirname1 = path.dirname(virtualPath) // /foo/bar/baz

// 如果path中 有 / 这种 不会做合并处理
path.dirname('/foo/bar/baz///qq.html') // /foo/bar/baz//

// 如果path中 \ 中的处理方式是 作为转译符 而不是路径分割符
path.dirname('/foo/bar\\\\baz///qq.html') // /foo/bar\\baz//
path.dirname('/foo/bar//baz\\\\qq.html') // /foo/bar
// 证明方式 获取到dirname 后去 parse一下 会发现base 是 那一坨 而 dir是空

// path 尾部以 / 多个和一个一样
path.dirname('/foo/bar/baz/qq.html/') //  /foo/bar/baz

// path 尾部以 / \ 混合使用
path.dirname('foo/bar/baz/qq.html/\\') // 

//如果没有分隔符返回 /
path.dirname('1') // .

// 其他类型会报错
path.dirname(1) // The "path" argument must be of type string. Received type number (1)
```

## path.extname(path)

path.extname() 方法返回 path 的扩展名，即 path 的最后一部分中从最后一次出现的 .（句点）字符到字符串的结尾。 如果 path 的最后一部分中没有 .，或者除了 path 的基本名称（参见 path.basename()）的第一个字符之外没有 . 个字符，则返回空字符串。

``` javascript
path.extname('index.html');
// 返回: '.html'

path.extname('index.coffee.md');
// 返回: '.md'

path.extname('index.');
// 返回: '.'

path.extname('index');
// 返回: ''

path.extname('.index');
// 返回: ''

path.extname('.index.md');
// 返回: '.md'
```

## path.format(pathObject)

+ `pathObject`

  - `dir` : ` < string > `
  - `root` : ` < string > `
  - `base` : ` < string > `
  - `name` : ` < string > `
  - `ext` : ` < string > `

```
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
```

当向 pathObject 提供属性时，存在一个属性优先于另一个属性的组合：

1. 如果提供 pathObject.dir，则忽略 pathObject.root
2. 如果 pathObject.base 存在，则忽略 pathObject.ext 和 pathObject.name

``` javascript
// 本质还是字符串连接 dir和base拼接的时候 会增加 / 
path.format({
    root: 'a',
    dir: '/home/user/dir',
    base: 'file.txt'
}) // /home/user/dir/file.txt

// root 则不会
path.format({
    root: 'a',
    base: 'file.txt',
    ext: 'ignored',
}) // afile.txt

//  如果某个属性自带 / 那么也会拼接上 
path.format({
    dir: '/home/user/dir/',
    base: '/file.txt'
}) // /home/user/dir///file.txt

path.format({
    dir: 'C:\\path\\dir',
    base: 'file.txt'
}) // C:\path\dir/file.txt 此处也是纯字符串拼接 
// 解析后的数据为
{
    root: '',
    dir: '',
    base: 'C:\\path\\dir\\file.txt',
    ext: '.txt',
    name: 'C:\\path\\dir\\file'
}
```

## path.isAbsolute(path)

path.isAbsolute() 方法确定 path 是否为绝对路径。

如果给定的 path 是零长度字符串，则将返回 false。

``` javascript
// POSIX 上 基本以 /(包括\/这种转译形式的) 开头的都是 

path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/./'); // true
path.isAbsolute('\/./')； // true

// window \  /  [a-zA-Z]:/ 开头的都是
path.win32.isAbsolute('//server') // true
path.win32.isAbsolute('\\\\server') // true
path.win32.isAbsolute('c:/foo/..') // true
path.win32.isAbsolute('C:\\foo\\..') // true
```

## path.join([...paths])

path.join() 方法使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。

零长度的 path 片段被忽略。 如果连接的路径字符串是零长度字符串，则将返回 '.'，表示当前工作目录。

``` javascript
// 正常版 
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'); // /foo/bar/baz/asdf

// \\ 在POISIX 上会做我转译符 和普通字符串 拼接上
path.join('foo', '\\\\a\\') // foo/\\a\

// 如果当前已经有路径 .. 往上次层跳 直到无法跳 就会保留到结果里
path.join('..', '../', '/././.')

// 0个和多个`/` 生成的路径相同
path.join('a', 'b') // a/b
path.join('a', '///////b') //  a/b
```

## path.normalize(path)

当找到多个连续的路径片段分隔符（例如 POSIX 上的 / 和 Windows 上的 \ 或 /）时，则它们将被平台特定路径片段分隔符（POSIX 上的 / 和 Windows 上的 \）的单个实例替换。 保留尾随的分隔符。

如果 path 是零长度字符串，则返回 '.'，表示当前工作目录。

之前很多接口都是单纯的拼接 没有处理重复情况。

``` javascript
path.normalize('foo///.././././//') // ./
path.normalize('foo///.././././//.') // .
path.normalize('C:////temp\\\\/\\/\\/foo/bar') // C:/temp\\/\/\/foo/bar
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar') //C:\temp\foo\bar

```

## path.parse(path)

path.parse() 方法返回一个对象，其属性表示 path 的重要元素。 尾随的目录分隔符被忽略

``` javascript
path.parse('/home/user/dir/file.txt');

// 解析后
pathResult = {
    root: '/',
    dir: '/home/user/dir',
    base: 'file.txt',
    ext: '.txt',
    name: 'file'
}

// 如果带有 \\  会作为转译符
path.parse('C:\\path\\dir\\file.txt') {
    root: '',
    dir: '',
    base: 'C:\\path\\dir\\file.txt',
    ext: '.txt',
    name: 'C:\\path\\dir\\file'
}

// 使用 win32 去解析上面的  第一个一样  第二个不同
path.win32.parse('C:\\path\\dir\\file.txt'); {
    root: 'C:\\',
    dir: 'C:\\path\\dir',
    base: 'file.txt',
    ext: '.txt',
    name: 'file'
}

// 如果存在多个 \\ // 情况 不会处理
path.parse('/home//user///dir/file.txt') {
    root: '/',
    dir: '/home//user///dir',
    base: 'file.txt',
    ext: '.txt',
    name: 'file'
}

path.win32.parse('C:\\//\\path\\dir\\file.txt') {
    root: 'C:\\',
    dir: 'C:\\//\\path\\dir',
    base: 'file.txt',
    ext: '.txt',
    name: 'file'
}
```

## path.relative(from, to)

根据当前工作目录返回从 from 到 to 的相对路径。 如果 from 和 to 都解析为相同的路径（在分别调用 path.resolve() 之后），则返回零长度字符串。

```javascript
path.relative('a/b/c', 'a/b/c/d') // d
// 多个 // 会合并   \\ 不会 
path.relative('a/b/c', 'a/b//c///d') // d
// win32会
path.win32.relative('a/b/c', 'a\\/b/c/d') // d
// 当前路径下 a 文件夹下的b/c 到 跟路径
path.relative('a/b/c', '/') // ../../../../../../../..
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'); //'../../impl/bbb'
// 这种依旧是字符串
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb'); //../C:\orandea\impl\bbb
path.win32.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb'); // ..\..\impl\bbb
```

**注**: 同时测试了与 `__dirname` , `/` 的相对路径, `/data/oranded/test/aa` 会根据 `process.cwd()` (也可以是 `.` )为baseurl去拼接形成路径，最后计算相对路径.
例如:

```javascript
path.relative('/', 'a/b/c') // Users/yanghao/Desktop/touch/node/a/b/c
process.cwd() // /Users/yanghao/Desktop/touch/node
```

## path.resolve([...paths])

方法将路径或路径片段的序列解析为绝对路径。给定的路径序列从右到左处理，每个后续的 path 会被追加到前面，直到构建绝对路径。

**注**:
1. 如果在处理完所有给定的 path 片段之后，还没有生成绝对路径，则使用当前工作目录。
2. 生成的路径被规范化，并删除尾部斜杠（除非路径解析为根目录）。
3. 零长度的 path 片段被忽略。
4. 如果没有传入 path 片段，则 path.resolve() 将返回当前工作目录的绝对路径。

```javascript
path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif'); // /Users/yanghao/Desktop/touch/node/wwwroot/static_files/gif/image.gif

path.resolve('/a/b/c/', '../../') // /a

path.resolve('/', 'a', '', '.', '', 'a') // /a/a

path.resolve('.')  // /Users/yanghao/Desktop/touch/node

```

## path.sep
+ 提供特定于平台的路径片段分隔符：
  - Windows 上是 `\`
  - POSIX 上是 `/`

在 Windows 上，正斜杠 (/) 和反斜杠 (\) 都被接受作为路径片段分隔符；但是，path 方法只添加反斜杠 (\)。


## path.toNamespacedPath(path)

仅在 Windows 系统上，返回给定 path 的等效命名空间前缀路径。 如果 path 不是字符串，则 path 将不加修改地返回。

``` javascript
path.toNamespacedPath(originalPath) // C:\Windows\users\..\admin

path.win32.toNamespacedPath(originalPath); // \\?\C:\Windows\admin
```

windows命名空间前缀:
  + Win32 文件命名空间: `\\?\`
  + Win32 设备命名空间: `\\.\`   
  + NT 命名空间: `\`


## path.posix   

path.posix 属性提供对 path 方法的 POSIX 特定实现的访问。

## path.win32

path.win32 属性提供对 path 方法的 Windows 特定实现的访问。

POSIX: Portable Operating System Interface，可移植操作系统接口。是 IEEE 为要在各种 UNIX 操作系统上运行软件，而定义 API 的一系列互相关联的标准的总称。Linux 基本实现 POSIX 兼容，Windows 部分实现。

Posix 的主要目的是在源码层面提供给开发者统一的操作系统 API。它本身是一个规范，但是系统没保证一定落实

由于在 Windows 和 Posix 上，针对 path 的一些规范不相同（例如分隔符），所以相同的 api+相同的参数，在两种平台上的调用结果可能不一样。

为了解决这个问题，nodejs 也提供了path.win32和path.posix来解决这个问题。
