# NODEJS STREAM模块

<!-- 说明：官方文档先介绍的实力 -->

## Stream

### API 
#### stream.finished(stream[, options], callback)
#### stream.pipeline(source[, ...transforms], destination, callback)#
#### stream.pipeline(streams, callback)
#### stream.compose(...streams)

## Writable

### options 

* `options`:<Object>
  + `hightWaterMark`<number> stream.write() 开始返回false的缓冲级别  默认值: 16384 (16 KB) 或 16 表示 objectMode 流。  最大值1GB
  + `decodeStrings` <boolean> 是否将传给 stream.write() 的 string 编码为 Buffer（使用 stream.write() 调用中指定的编码），然后再将它们传给 stream._write()。 其他类型的数据不会被转换（即 Buffer 不会被解码为 string）。 设置为 false 将阻止 string 被转换。 默认值: true。
  + `defaultEncoding` <string> 当没有将编码指定为 stream.write() 的参数时使用的默认编码。 默认值: 'utf8'。
  + `objectMode` <boolean> stream.write(anyObj) 是否为有效操作。 当设置后，如果流实现支持，则可以写入字符串、Buffer 或 Uint8Array 以外的 JavaScript 值。 默认值: false。
  + `emitClose` <boolean> 流被销毁后是否应该触发 'close'。 默认值: true。
  + `write` <Function> stream._write() 方法的实现。
  + `writev` <Function> stream._writev() 方法的实现。
  + `destroy` <Function> stream._destroy() 方法的实现。
  + `final` <Function> stream._final() 方法的实现。
  + `construct` <Function> stream._construct() 方法的实现。 V16
  + `autoDestroy` <boolean> 此流是否应在结束后自动调用自身的 .destroy()。 默认值: true。
  + `signal` <AbortSignal> 表示可能取消的信号。 V16

#### hightWaterMark 

官方解释：stream.write() 开始返回 false 时的缓冲级别 
根据源码我们可以看到, 其返回的是 state.highWaterMark 与 state.length 的大小关系。

给过来多少chunk 他就会写入多少chunk 并没有限制, 与readable的hightWaterMark不同

```javascript
const len = state.objectMode ? 1 : chunk.length;
state.length += len;
const ret = state.length < state.highWaterMark;
return ret && !state.errored && !state.destroyed
```

如果 `ret` 是 `false` , writable会在写入结束后 出发 `drain` 事件

```javascript
if (!ret) state.needDrain = true;

function afterWrite(stream, state, count, cb) {
    ...
    if (needDrain) {
        state.needDrain = false;
        stream.emit('drain');
    }
    ...
}
```

#### decodeStrings

是否将传给 stream.write() 的 string 编码为 Buffer（使用 stream.write() 调用中指定的编码），然后再将它们传给 stream._write()。 其他类型的数据不会被转换（即 Buffer 不会被解码为 string）。 设置为 false 将阻止 string 被转换。 默认值: true。

```javascript
// 🌰 🌰 🌰 🌰
import {
    Writable
} from 'stream'

const w = new Writable({
    decodeStrings: true,
    write(chunk, encoding, cb) {
        console.log('write', chunk);
        cb();
    },
    writev(chunks, cb) {
        console.log('writev', chunks);
    },
})
// decodeStrings:true
// write <Buffer 31>
// writev [
//   { chunk: <Buffer 31>, encoding: 'buffer', callback: [Function: nop] },
//   { chunk: <Buffer 31>, encoding: 'buffer', callback: [Function: nop] },
//   allBuffers: true
// ]

w.write('1')
w.cork();
w.write('1')
w.write('1')
w.uncork();
// decodeStrings:false
// write 1
// writev [
//   { chunk: '1', encoding: 'utf8', callback: [Function: nop] },
//   { chunk: '1', encoding: 'utf8', callback: [Function: nop] },
//   allBuffers: false
// ]
```

他还有个属性叫objectMode 优先级比这个高下面会有🌰

#### defaultEncoding

当没有将编码指定为 stream.write() 的参数时使用的默认编码。 默认值: 'utf8'。

这个地方有个坑就是 `defaultEncoding` 在objectMode 是false的时候 是不能指定除 `'string', 'Buffer', 'Uint8Array'` 之外的其他属性的

当设置了 `objectMode:true` 时可以设置其他值

```javascript
if (!state.objectMode) {
    if (typeof chunk === 'string') {
        if (state.decodeStrings !== false) {
            chunk = Buffer.from(chunk, encoding);
            encoding = 'buffer';
        }
    } else if (chunk instanceof Buffer) {
        encoding = 'buffer';
    } else if (Stream._isUint8Array(chunk)) {
        chunk = Stream._uint8ArrayToBuffer(chunk);
        encoding = 'buffer';
    } else {
        throw new ERR_INVALID_ARG_TYPE(
            'chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
    }
}
```

#### objectMode

当设置后，如果流实现支持，则可以写入字符串、Buffer 或 Uint8Array 以外的 JavaScript 值。

```javascript
import {
    Writable
} from 'stream'

const w = new Writable({
    decodeStrings: true, // 此处同时设置了 按照文档写的 会在write和writev里实用Buffer
    defaultEncoding: 'base64', // 设置了base64
    objectMode: true, // 同时设置objectMode
    write(chunk, encoding, cb) {
        console.log('write', chunk);
        cb();
    },
    writev(chunks, cb) {
        console.log('writev', chunks);
    },
})

// 如果不设置objectMode:true 此处的chunk是不能写入number的
w.write(1)
w.cork();
w.write(1)
w.write(1)
w.uncork();

// 可以明显的发现 输出的chunk类型不是utf-8了
// write 1
// writev [
//   { chunk: 1, encoding: 'base64', callback: [Function: nop] },
//   { chunk: 1, encoding: 'base64', callback: [Function: nop] },
//   allBuffers: false
// ]
```

同时objectMode还有一个作用, 还记得 `hightWaterMark` 的判断是否超过的条件吗？

```javascript
const len = state.objectMode ? 1 : chunk.length;
// 如果objectMode是true 调用一次write length+1
```

#### write (chunk, encoding, callback)

* chunk `<Buffer> | <string> | <any>` 要写入的 Buffer，从 string 转换为 stream.write()。 如果流的 decodeStrings 选项是 false 或者流在对象模式下运行，则块将不会被转换，而是传给 stream.write() 的任何内容。
* encoding `<string>` 如果块是字符串，则 encoding 是该字符串的字符编码。 如果块是 Buffer，或者如果流在对象模式下运行，则可以忽略 encoding。
* callback `<Function>` 当对提供的块的处理完成时调用此函数（可选地带有错误参数）。

所有 Writable 流实现都必须提供 writable._write() 和/或 writable._writev() 方法来将数据发送到底层资源。

callback 函数必须在 writable._write() 内部同步调用或异步调用（即不同的滴答），以表示写入成功完成或因错误而失败。 如果调用失败，则传给 callback 的第一个参数必须是 Error 对象，如果写入成功，则传入 null 对象。

```javascript
const writable = new Writable({
    write(chunk, encoding, callback) {
        // callback(null);
        callback(new Error())
    }
})
```

在调用 writable._write() 和调用 callback 之间发生的对 writable.write() 的所有调用都将导致写入的数据被缓冲。 当调用 callback 时，流可能会触发 'drain' 事件。 如果流实现能够同时处理多个数据块，则应实现 writable._writev() 方法。

```javascript
const w = new Writable({
    write(chunk, enc, cb) {
        // 我们将cb注释调 其状态就会一直保持在 写入中的状态，此时如果去调用write() 就会写入缓冲。 虽然 这个时候可以明显的看出 写入的已经超出了设置的阀值 但是'drain'事件是在 写入结束后才触发的。
        // cb();
    },
    highWaterMark: 3
})

w.on('drain', () => {
    console.log('drain');
})

w.write('11111')
w.write('1')
```

实现步骤为：
1. 先判断传入的 encoding 是否合规 
2. 判断长度是否超过缓冲池 
3. 判断是否正在写入 是否cork 是否error如果是的话 将其推入buffer缓冲区
4. 否则调用实例化时定义的write函数，并且将writing等状态修改
5. 在`onwrite`回调里去修改状态为空闲并减去`state.length`,并且查看缓冲区内是否还有，如果有的话循环调用 直到为空

#### writev(chunks, callback)

* chunks `<Object[]>` 要写入的数据。 该值是 `<Object>` 数组，每个数组表示要写入的离散数据块。 这些对象的属性是：
  + chunk `<Buffer> | <string>` 包含要写入的数据的缓冲区实例或字符串。 如果 Writable 是在 decodeStrings 选项设置为 false 的情况下创建的，并且字符串已传给 write()，则 chunk 将是字符串。
  + encoding `<string>` chunk 的字符编码。 如果 chunk 是 Buffer，则 encoding 将是 'buffer'。
* callback `<Function>` 当对提供的块的处理完成时要调用的回调函数（可选地带有错误参数）。

writable._writev() 方法可以在能够同时处理多个数据块的流实现中作为 writable._write() 的补充或替代来实现。 如果实现并且有来自先前写入的缓冲数据，则将调用 _writev() 而不是 _write()。

```javascript
const w = new Writable({
    decodeStrings: true, // 此处同时设置了 按照文档写的 会在write和writev里实用Buffer
    defaultEncoding: 'base64', // 设置了base64
    objectMode: true, // 同时设置objectMode
    write(chunk, encoding, cb) {
        console.log('write', chunk);
        cb();
    },
    writev(chunks, cb) {
        // 输出 chunks
        console.log('writev', chunks);
    },
})

// 如果不设置objectMode:true 此处的chunk是不能写入number的
w.write(1)
w.cork();
w.write(1)
w.write(1)
w.uncork();

// write 1
// writev [
//   { chunk: 1, encoding: 'base64', callback: [Function: nop] },
//   { chunk: 1, encoding: 'base64', callback: [Function: nop] },
//   allBuffers: false
// ]
```

他的实现步骤与write唯一的区别就是，write是重复调用多次，writev是一次性全部调用。

其触发条件是，当执行完write时，此时自定义了writev函数并且 缓冲区内还有数据，就会调用writev

#### destroy 

writable.destroy() 调用。 它可以被子类覆盖，但不能直接调用。

```javascript
const w = new Writable({
    destroy() {
        ...
    }
})

w._destroy = function() {
    ...
}
```

#### final

完成写入任何剩余数据后调用此函数

调用方式同上

#### construct

当流完成初始化时调用此函数，这个可选函数将在流构造函数返回后的一个滴答中被调用，延迟任何 _write()、_final() 和 _destroy() 调用，直到调用 callback。 这对于在使用流之前初始化状态或异步初始化资源很有用。

```javascript
const w = new Writable({
    construct(cb) {
        console.log(1);
        // cb()
    },
    write() {
        console.log(2); // cb不打开不输出 打开才输出
    }
})

w.write('1');
```

#### autoDestroy

此流是否应在结束后自动调用自身的 .destroy()

```javascript
const w = new Writable({
    write(chunk, enc, cb) {
        console.log(chunk);
        cb();
    },
    destroy() {
        console.log('destroy'); // 输出
    },
    autoDestroy: true
})

w.write('1')
w.end('1') // 结束流
```

### Event 

#### close
当流及其任何底层资源（例如文件描述符）已关闭时，则会触发 'close' 事件。 该事件表明将不再触发更多事件，并且不会发生进一步的计算。

如果 Writable 流是使用 emitClose 选项创建的，则始终会触发 'close' 事件。

``` javascript
const w1 = new Writable();
w1._write = function (data, enc, next) {
  process.stdout.write(data.toString())
  next()
}

w1.write('c')
w1.on('close', () => { console.log('close'); })
w1.end()
```


#### drain
如果对 stream.write(chunk) 的调用返回 false，则 'drain' 事件将在适合继续将数据写入流时触发。

``` javascript
let c = 0;
const readable = new Readable({
  highWaterMark:2,
  read:function(){
    process.nextTick(() => {
      var data = c < 26 ? String.fromCharCode(c++ + 97) : null
      console.log('push', data)
      this.push(data)
    })
  }
})

// 这是两s 消费一次的 Writable
const writable = new Writable({
  // 缓存池 是 2
  highWaterMark: 2,
  write: function (data, enc, next) {
    console.log('write', data.toString())
    setTimeout(() => {
      next();
    }, 2000);
  }
})

writable.on('drain',()=>{
  console.log('drain');
})



// 将上游 下游 链接起来
readable.pipe(writable)
// 输出 
// push a 
// write a  没有调用next a没有被消费掉， a存入缓存 此时缓存池 1
// push b   一直没有消费掉 b 也进入缓存池 此时writable的缓存已经存满 上游的流动模式切换为暂停模式
// push c  写入 readable 的 缓存池
// push d  readable 缓存也已经满

// 2s 后
// write b

// 2s 后 
// drain  缓存清空  触发drain
// write c
```


#### error
如果在写入或管道数据时发生错误，则会触发 'error' 事件。 监听器回调在调用时传入单个 Error 参数。

除非在创建流时将 autoDestroy 选项设置为 false，否则当触发 'error' 事件时将关闭流。

在 'error' 之后，不应触发除 'close' 之外的其他事件（包括 'error' 事件）。

```javascript
 const myStream = new Writable();
 
 const fooErr = new Error('foo error');
 myStream.destroy(fooErr);
 // 一旦 destroy() 被调用，任何进一步的调用都将是空操作，除了来自 _destroy() 的其他错误可能不会作为 'error' 触发。
 myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
 ```

#### finish

在调用 stream.end() 方法之后，并且所有数据都已刷新到底层系统，则触发 'finish' 事件。
``` javascript
const w1 = new Writable();
w1._write = function (data, enc, next) {
  process.stdout.write(data.toString())
  next()
}
w1.write('a')
w1.write('b')
w1.write('c')
/** finish 在close 前 */
w1.on('finish', () => { console.log('finish'); })
w1.end()
```
#### pipe
当在可读流上调用 stream.pipe() 方法将此可写流添加到其目标集时，则触发 'pipe' 事件。
#### unpipe
当在 Readable 流上调用 stream.unpipe() 方法时，则会触发 'unpipe' 事件，从其目标集合中删除此 Writable。

当 Readable 流管道进入它时，如果此 Writable 流触发错误，则这也会触发。

``` javascript
const readable = new Readable({
  read:function(){
  }
})
const writable = new Writable({
  write: function (data, enc, next) {
  }
})

writable.on('pipe',()=>{
  console.log('pipe');
})

writable.on('unpipe',()=>{
  console.log('unpipe');
})
readable.pipe(writable)
readable.unpipe(writable)
```

### API

#### writable.cork()

writable.cork() 方法强制所有写入的数据都缓存在内存中。 当调用 stream.uncork() 或 stream.end() 方法时，缓冲的数据将被刷新。

writable.cork() 的主要目的是适应将几个小块快速连续写入流的情况。 writable.cork() 不是立即将它们转发到底层目标，而是缓冲所有块，直到 writable.uncork() 被调用，如果存在，writable.uncork() 会将它们全部传给 writable._writev()。 这可以防止在等待处理第一个小块时正在缓冲数据的行头阻塞情况。 但是，在不实现 writable._writev() 的情况下使用 writable.cork() 可能会对吞吐量产生不利影响。

``` javascript
const writable2 = new Writable({
  highWaterMark:2,
  write(data,enc,next){
    console.log(data);
    next(data)
  }
})
writable2.cork();
writable2.write('a')
writable2.write('b')
writable2.write('c')
writable2.write('d')
writable2.write('e')
console.log(writable2._writableState.buffered.length) // 5
```

#### writable.destroy([error])

销毁流 可选地触发 'error' 事件，并且触发 'close' 事件（除非 emitClose 设置为 false）。 在此调用之后，则可写流已结束，随后对 write() 或 end() 的调用将导致 ERR_STREAM_DESTROYED 错误。 这是销毁流的破坏性和直接的方式。 先前对 write() 的调用可能没有排空，并且可能触发 ERR_STREAM_DESTROYED 错误。 如果数据应该在关闭之前刷新，或者在销毁流之前等待 'drain' 事件，则使用 end() 而不是销毁。

``` javascript
import { Writable, Readable } from 'stream'

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
// 一旦 destroy() 被调用，任何进一步的调用都将是空操作，除了来自 _destroy() 的其他错误可能不会作为 'error' 触发。
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
myStream.write('error',(a)=>console.log(a?.stack))
// Cannot call write after a stream was destroyed
//  如果在 destory 之后 写入 会报错
```


#### writable.end([chunk[, encoding]][, callback])

调用 writable.end() 方法表示不再有数据写入 Writable。 可选的 chunk 和 encoding 参数允许在关闭流之前立即写入最后一个额外的数据块。

在调用 stream.end() 之后调用 stream.write() 方法将引发错误。

``` javascript
const fs = require('fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
```

#### writable.setDefaultEncoding(encoding)

writable.setDefaultEncoding() 方法为 Writable 流设置默认的 encoding。

#### writable.uncork()

当使用 writable.cork() 和 writable.uncork() 管理写入流的缓冲时，建议使用 process.nextTick() 延迟对 writable.uncork() 的调用。 

这样做允许对在给定 Node.js 事件循环阶段中发生的所有 writable.write() 调用进行批处理。

如果在一个流上多次调用 writable.cork() 方法，则必须调用相同数量的 writable.uncork() 调用来刷新缓冲的数据。

``` javascript
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // 在第二次调用 uncork() 之前不会刷新数据。
  stream.uncork();
});
```


#### writable.write(chunk[, encoding][, callback])

writable.write() 方法将一些数据写入流，并在数据完全处理后调用提供的 callback。 如果发生错误，则 callback 将使用错误作为其第一个参数进行调用。 callback 是异步地调用，并且在 'error' 触发之前。

如果在接纳 chunk 后，内部缓冲区小于当创建流时配置的 highWaterMark，则返回值为 true。 如果返回 false，则应停止进一步尝试将数据写入流，直到触发 'drain' 事件。

当流没有排空时，对 write() 的调用将缓冲 chunk，并返回 false。 一旦所有当前缓冲的块都被排空（操作系统接受交付），则将触发 'drain' 事件。 建议一旦 write() 返回 false，则在触发 'drain' 事件之前不再写入块。 虽然允许在未排空的流上调用 write()，但 Node.js 将缓冲所有写入的块，直到出现最大内存使用量，此时它将无条件中止。 即使在它中止之前，高内存使用量也会导致垃圾收集器性能不佳和高 RSS（通常不会释放回系统，即使在不再需要内存之后）。 由于如果远程对等方不读取数据，TCP 套接字可能永远不会排空，因此写入未排空的套接字可能会导致可远程利用的漏洞。

在流未排空时写入数据对于 Transform 来说尤其成问题，因为 Transform 流是默认暂停，直到它们被管道传输、或添加 'data' 或 'readable' 事件句柄。

如果要写入的数据可以按需生成或获取，则建议将逻辑封装成 Readable 并且使用 stream.pipe()。 但是，如果首选调用 write()，则可以使用 'drain' 事件遵守背压并避免内存问题：


由于之前对于常规的已经说明过了，下面只对一些情况实验demo

注:内存泄漏相关

虽然允许在未排空的流上调用 write()，但 Node.js 将缓冲所有写入的块，直到出现最大内存使用量，此时它将无条件中止。 即使在它中止之前，高内存使用量也会导致垃圾收集器性能不佳和高 RSS（通常不会释放回系统，即使在不再需要内存之后）。 由于如果远程对等方不读取数据，TCP 套接字可能永远不会排空，因此写入未排空的套接字可能会导致可远程利用的漏洞。
``` javascript
// 创建一个可写流
let writable2 = new Writable({
  write(data,enc,next){
    next()
  }
})
// 通常情况
// 记录现在的内存 
console.log(process.memoryUsage())
// {
//   rss: 26968064,
//   heapTotal: 4636672,
//   heapUsed: 3643888,
//   external: 214019,
//   arrayBuffers: 11146
// }
let S_OVERFLOW = '-'.repeat(writable2.writableHighWaterMark+1)
writable2.write(S_OVERFLOW)
writable2.write(S_OVERFLOW)
writable2.write(S_OVERFLOW)


console.log(process.memoryUsage())
// {
//   rss: 27967488,
//   heapTotal: 5177344,
//   heapUsed: 4256144,
//   external: 324710,
//   arrayBuffers: 60301
// }

// node --expose_gc  需要手动开启gc
global.gc();
writable2 = null;
console.log(process.memoryUsage())
// {
//   rss: 28540928,
//   heapTotal: 6225920,
//   heapUsed: 3500600,
//   external: 324142,
//   arrayBuffers: 10422
// }


// 下面是数据存在内存中的数据,
// 我们可以在write的时候使用cork进行往内存中写入 
// 三处console的结果如下
// {
//   rss: 26787840,
//   heapTotal: 4636672,
//   heapUsed: 3643904,
//   external: 214019,
//   arrayBuffers: 11146
// }
// {
//   rss: 27852800,
//   heapTotal: 5177344,
//   heapUsed: 4256344,
//   external: 324710,
//   arrayBuffers: 60301
// }
// {
//   rss: 28508160,
//   heapTotal: 6225920,
//   heapUsed: 3501720,
//   external: 324142,
//   arrayBuffers: 59577
// }

// 会发现arrayBuffer明显增加了
```

### property

#### destroyed 
在调用 writable.destroy() 之后是 true。

#### writable

如果调用 writable.write() 是安全的，则为 true，这意味着流没有被销毁、出错或结束。

#### writableEnded

在调用 writable.end() 之后是 true。 此属性不指示数据是否已刷新，为此则使用 writable.writableFinished 代替。

#### writableCorked

需要调用 writable.uncork() 以完全解开流的次数。

#### writableFinished

在触发 'finish' 事件之前立即设置为 true。

#### writableHighWaterMark

返回创建此 Writable 时传入的 highWaterMark 的值。

#### writableObjectMode

给定 Writable 流的属性 objectMode 的获取器。

#### writableNeedDrain

如果流的缓冲区已满并且流将触发 'drain'，则为 true。

#### writableLength

此属性包含队列中准备写入的字节数（或对象数）。 该值提供有关 highWaterMark 状态的内省数据。

## Readable

创建方式
```javascript
//  ES6
class MyReadable extends Readable {
    constructor(options) {
        // 调用 stream.Readable(options) 构造函数。
        super(options);
        // ...
    }
}

// ES5
const util = require('util');

function MyReadable(options) {
    if (!(this instanceof MyReadable))
        return new MyReadable(options);
    Readable.call(this, options);
}
util.inherits(MyReadable, Readable);

// 构造函数
const myReadable = new Readable({
    read(size) {
        // ...
    }
});
```
### options

+ options <Object>
  - highWaterMark <number> 在停止从底层资源读取之前存储在内部缓冲区中的最大字节数。 默认值: 16384 (16 KB) 或 16 表示 objectMode 流。 最大值1GB
  - encoding <string> 如果指定，则缓冲区将使用指定的编码解码为字符串。 默认值: null。
  - objectMode <boolean> 此流是否应表现为对象流。 这意味着 stream.read(n) 返回单个值而不是大小为 n 的 Buffer。 默认值: false。
  - emitClose <boolean> 流被销毁后是否应该触发 'close'。 默认值: true。
  - read <Function> stream._read() 方法的实现。
  - destroy <Function> stream._destroy() 方法的实现。
  - construct <Function> stream._construct() 方法的实现。
  - autoDestroy <boolean> 此流是否应在结束后自动调用自身的 .destroy()。 默认值: true。
  - signal <AbortSignal> 表示可能取消的信号。

#### highWaterMark

官方解释: 在停止从底层资源读取之前存储在内部缓冲区中的最大字节数。 默认值: 16384 (16 KB) 或 16 表示 objectMode 流。

highWaterMark在初始化之后还有可能会随着read传入的值变化而变化。

```javascript
let i = 0;
const r = new Readable({
    // 初始值设置的是3
    highWaterMark: 3,
    // size 指示当前的hwm
    read(size) {
        console.log('size', size)
        // 输出 size 3
        // 输出 size 64
        if (i < 2) {
            this.push(Buffer.alloc(70))
            i++
        } else {
            this.push(null)
        }
    }
})
r.on('readable', () => {
    let chunk = r.read(40);
    console.log('chunk', chunk);
})
```

当传入40的时候，发现40比当初设置的HWM大，这是 Readable 会对HWM进行重新赋值，赋值的逻辑为，寻找大于40 最近2的n次幂的数。

```javascript
Readable.prototype.read = function(n) {
    ...
    if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
    ...
}
const MAX_HWM = 0x40000000;

function computeNewHighWaterMark(n) {
    if (n > MAX_HWM) {
        throw new ERR_OUT_OF_RANGE('size', '<= 1GiB', n);
    } else {
        // Get the next highest power of 2 to prevent increasing hwm excessively in
        // tiny amounts.
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
    }
    return n;
}
```

  

#### encoding

如果指定，则缓冲区将使用指定的编码解码为字符串
``` javascript
let i = 0;
const r = new Readable({
    highWaterMark: 3,
    // encoding: 'hex', 
    read(size) {
        if (i < 10) {
            this.push('1')
            i++
        } else {
            this.push(null)
        }
    }
})
r.on('data', (a) => {
    console.log(a);
    // 关闭encoding <buffer 31>
    // 打开encoding 31
})
```

#### objectMode

此流是否应表现为对象流。 这意味着 stream.read(n) 返回单个值而不是大小为 n 的 Buffer。 默认值: false。

``` javascript 
const r = new Readable({
  highWaterMark: 3,
  // objectMode:true, 
  // 如果不打开 <Buffer 31 31 31 31 31 31>
  // 如果打开 111111
  read(size) {
    if (i < 10) {
      this.push('111111')
      i++
    } else {
      this.push(null)
    }
  }
})
```

#### emitClose

流被销毁后是否应该触发 'close'。 默认值: true。
``` javascript 
const r = new Readable({
  emitClose:false,
  read(size) {
    this.push(null)
  }
})

r.on('close', function(){
    console.log('close') // 未触发
})
```

#### read

此函数不得由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 Readable 类方法调用。

所有 Readable 流实现都必须提供 readable._read() 方法的实现，以从底层资源中获取数据。

调用 readable._read() 时，如果资源中的数据可用，则实现应开始使用 this.push(dataChunk) 方法将该数据推送到读取队列中。 一旦流准备好接受更多数据，则 _read() 将在每次调用 this.push(dataChunk) 后再次调用。 _read() 可能会继续从资源中读取并推送数据，直到 readable.push() 返回 false。 只有当 _read() 停止后再次被调用时，它才能继续将额外的数据推入队列。

一旦调用了 readable._read() 方法，则不会再次调用它，直到通过 readable.push() 方法推送更多数据。 空缓冲区和字符串等空数据不会导致调用 readable._read()。

size 参数是建议性的。 对于“读取”是返回数据的单个操作的实现，可以使用 size 参数来确定要获取多少数据。 其他实现可能会忽略此参数，并在数据可用时简单地提供数据。 在调用 stream.push(chunk) 之前不需要“等待”直到 size 个字节可用。

readable._read() 方法以下划线为前缀，因为它是定义它的类的内部方法，不应由用户程序直接调用。


#### destroy
_destroy() 方法由 readable.destroy() 调用。 它可以被子类覆盖，但不能直接调用。

在读取过过程中出现错误，必须通过readable.destroy(err)方法传播。

``` javascript
const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // 做一些工作。
    }
  },
  destroy(){
      console.log('destroy')
  }
});
```


#### construct
当流完成初始化时调用此函数

#### autoDestroy
此流是否应在结束后自动调用自身的 .destroy()  默认 true;

#### signal
表示可能取消的信号。


### Event

#### close
#### data
#### end
#### error
#### pause 
#### readable
#### resume


### API
#### readable.destroy([error])
#### readable.isPaused()
#### readable.pause()
#### readable.pipe(destination[, options])
#### readable.read([size])
#### readable.resume()
#### readable.setEncoding(encoding)
#### readable.unpipe([destination])
#### readable.unshift(chunk[, encoding])
#### readable.wrap(stream)
#### readable[Symbol.asyncIterator]()
#### readable.iterator([options])

### property

#### destroyed
#### readable
#### readableAborted
#### readableDidRead
#### readableEncoding
#### readableEnded
#### readableFlowing
#### readableHighWaterMark
#### readableLength
#### readableObjectMode


## 双工流

Duplex 流是同时实现 Readable 和 Writable 的流

+ options <Object> 传给 Writable 和 Readable 构造函数。 还具有以下字段：
    - allowHalfOpen <boolean> 如果设置为 false，则流将在可读端结束时自动结束可写端。 默认值: true。
    - readable <boolean> 设置 Duplex 是否可读。 默认值: true。
    - writable <boolean> 设置 Duplex 是否可写。 默认值: true。
    - readableObjectMode <boolean> 为流的可读端设置 objectMode。 如果 objectMode 是 true，则无效。 默认值: false。
    - writableObjectMode <boolean> 为流的可写端设置 objectMode。 如果 objectMode 是 true，则无效。 默认值: false。
    - readableHighWaterMark <number> 为流的可读端设置 highWaterMark。 如果提供 highWaterMark，则无效。
    - writableHighWaterMark <number> 为流的可写端设置 highWaterMark。 如果提供 highWaterMark，则无效。

#### allowHalfOpen
其他几个配置和两个流一样所以只对这个配置做说明

allowHalfOpen 如果为 false，则当可读端结束时，流将自动结束可写端。 最初由 allowHalfOpen 构造函数选项设置，默认为 false。

这可以手动更改以更改现有 Duplex 流实例的半开行为，但必须在触发 'end' 事件之前更改。

``` javascript
import { Duplex } from "stream";

const duplex = new Duplex({
  read(){
    this.push(null)
  },
  write(data,enc,next){
    console.log(data);
    next();
  },
  // allowHalfOpen:false  // 打开后会输出 close
})

duplex.resume();

duplex.on('end',()=>{
  console.log('duplex end');
  duplex.write('1')
  process.nextTick(()=>{
    duplex.write('1')
  })
})


duplex.on('close',()=>{
  console.log('close');
})
```


## 转换流

Transform 流是 Duplex 流，其中输出以某种方式从输入计算。 示例包括压缩、加密、或解密数据的压缩流或加密流。

不要求输出与输入大小相同、块数相同或同时到达。 例如，Hash 流只会有一个单一的输出块，它在输入结束时提供。 zlib 流将产生比其输入小得多或大得多的输出。

stream.Transform 类被扩展以实现 Transform 流。

stream.Transform 类原型上继承自 stream.Duplex 并实现其自己版本的 writable._write() 和 readable._read() 方法。 自定义的 Transform 实现必须实现 transform._transform() 方法，也可以实现 transform._flush() 方法。

使用 Transform 流时必须小心，因为如果不消耗 Readable 端的输出，写入流的数据可能导致流的 Writable 端暂停。

### transform 

此函数不得由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 Readable 类方法调用。

所有 Transform 流实现都必须提供 _transform() 方法来接受输入并产生输出。 transform._transform() 实现处理写入的字节，计算输出，然后使用 transform.push() 方法将该输出传给可读部分。

transform.push() 方法可以被调用零次或多次以从单个输入块生成输出，这取决于作为块的结果要输出多少。

任何给定的输入数据块都可能不会产生任何输出。

callback 函数必须在当前块被完全消耗时才被调用。 如果在处理输入时发生错误，则传给 callback 的第一个参数必须是 Error 对象，否则传给 null。 如果将第二个参数传给 callback，它将被转发到 transform.push() 方法。 换句话说，以下内容是等效的：


``` javascript
class Rotate extends Transform {
  constructor(n) {
    super()
    // 将字母旋转`n`个位置
    this.offset = (n || 13) % 26
  }

  // 将可写端写入的数据变换后添加到可读端
  _transform(buf, enc, next) {
    const res = buf.toString().split('').map(c => {
      var code = c.charCodeAt(0)
      if (c >= 'a' && c <= 'z') {
        code += this.offset
        if (code > 'z'.charCodeAt(0)) {
          code -= 26
        }
      } else if (c >= 'A' && c <= 'Z') {
        code += this.offset
        if (code > 'Z'.charCodeAt(0)) {
          code -= 26
        }
      }
      return String.fromCharCode(code)
    }).join('')
    // 调用push方法将变换后的数据添加到可读端
    this.push(res)
    // 调用next方法准备处理下一个
    next()
  }
}

var transform = new Rotate(3)
transform.on('data', data => process.stdout.write(data))
transform.write('hello, ')
transform.write('world!')
transform.end()
// khoor, zruog!

``` 


#### flush

此函数不得由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 Readable 类方法调用。

在某些情况下，转换操作可能需要在流的末尾触发额外的数据位。 例如，zlib 压缩流将存储用于优化压缩输出的内部状态量。 但是，当流结束时，需要刷新额外的数据，以便完成压缩数据。

自定义的 Transform 实现可以实现 transform._flush() 方法。 当没有更多的写入数据被消耗时，但在触发 'end' 事件以表示 Readable 流结束之前，将调用此方法。

在 transform._flush() 实现中，transform.push() 方法可以被调用零次或多次，视情况而定。 必须在刷新操作完成时调用 callback 函数。

transform._flush() 方法以下划线为前缀，因为它是定义它的类的内部方法，不应由用户程序直接调用。

``` javascript
const trans = new stream.Transform({
  transform(chunk,encoding,cb){
    this.push(chunk)
    cb();
  },
  flush(callback){
    this.push('flush');
    callback();
  }
})
trans.on('data',(data)=>process.stdout.write(data))
trans.write('1')
trans.write('2')
trans.write('3')
trans.end();
// 输出
// 123flush
```



