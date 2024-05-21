# Nodejs中process.cwd()与__dirname的区别

process.cwd(): The process.cwd() method returns the current working directory of theNode.js process.


上面的意思就是，process.cwd()返回的是当前Node.js进程执行时的工作目录。


比如我们有如下目录结构

``` tree
sand
  buffer
  file
    1.js
    2.txt
```

``` js
// 1.js
console.log(__dirname)
console.log(process.cwd())
```

当我们在send文件夹下执行 `node ./file/1.js` 时候

process.cwd 输出的是`****/sand`
__dirname 输出的是`****/sand/file` 


所以__dirname输出的是模块名，就是当前文件的目录名
