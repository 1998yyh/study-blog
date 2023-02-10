# webSocket

我们知道 , http 是一问一答的模式 ,客户端想服务端发送http请求,服务器返回http相应. 

这种模式对资源,数据的加载足够用,但是需要数据推送的场景就不合适了. 

有同学说http2 不是有server push 吗 那只是推资源用的:

比如浏览器请求了html , 服务器可以连同css一起推给浏览器 , 浏览器可以决定收不收

对于即时通讯等实时性要求高的场景, 就需要用websocket, webSocket 严格来说 和http 没什么关系 , 是一种另外的协议格式 ,但是需要一次从http 到webSocket的切换过程


## 请求过程

1. 请求的时候带上这几个header : 
``` makefile
# request header
# 升级到websocket
Connection: Upgrade
Upgrade: websocket
# 保证安全的key
Sec-WebSocket-Key: Ia3dQjfWrAug/6qm7mTZOg==
```
服务端返回的是这样 header:

``` makefile
# response header
HTTP/1.1 101 Switching Protocols
Connection: Upgrade
Upgrade: websocket
# 和请求 header 类似，Sec-WebSocket-Accept 是对请求带过来的 Sec-WebSocket-Key 处理之后的结果。
Sec-WebSocket-Accept: JkE58n3uIigYDMvC+KsBbGZsp1A=
```

加入这个header的校验是为了确定对方一定是有WebSocket能力的 , 不然万一建立了链接 对方却一直没有消息, 那不就白等了么.

那Sec-WebSocket-Key 经过什么处理能得到Sec-WebSocket-Accept呢

大概实现如下
``` js
const crypto = require('crypto');

function hashKey(key) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
  return sha1.digest('base64');
}
```

也就是用客户端传过来的 key，加上一个固定的字符串，经过 sha1 加密之后，转成 base64 的结果。


### 协议

它具体是一个什么协议呢? 大家习惯的http 协议是key:value 的header 带一个body 他是文本协议,每一个header都是很容易理解的字符, 这样好懂是好懂,但是传输的空间太大了. 

而websocket 是二进制协议 , 一个字节可以用来存储很多信息.

比如协议的第一个字节 就存储了FIN 结束标志, opcode 等信息 ,第二个字节存储了mask(是否有加密) , payload(数据长度)等信息

我们看到的webSocket的message的语法 ,其实底层都是拼成这样的格式 

然后我们看一下具体的实现


```js
const { EventEmitter } = require('events');
const http = require('http');

class MyWebsocket extends EventEmitter {
  constructor(options) {
    super(options);

    const server = http.createServer();
    server.listen(options.port || 8080);

    server.on('upgrade', (req, socket) => {
      
    });
  }
}
```

继承 EventEmitter 是为了可以用 emit 发送一些事件，外界可以通过 on 监听这个事件来处理。

我们在构造函数里创建了一个 http 服务，当 ungrade 事件发生，也就是收到了 Connection: upgrade 的 header 的时候，返回切换协议的 header。

返回的 header 前面已经见过了，就是要对 sec-websocket-key 做下处理。

```js
server.on('upgrade', (req, socket) => {
  this.socket = socket;
  socket.setKeepAlive(true);

  const resHeaders = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    'Sec-WebSocket-Accept: ' + hashKey(req.headers['sec-websocket-key']),
    '',
    ''
  ].join('\r\n');
  socket.write(resHeaders);

  socket.on('data', (data) => {
    console.log(data)
  });
  socket.on('close', (error) => {
      this.emit('close');
  });
});
```

我们拿到scoket 返回上面的header 其中key做的处理就是下面的算法

```js
function hashKey(key) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
  return sha1.digest('base64');
}
```

但是这个地方我们收到的data是二进制的,这部分比较麻烦

![](https://pic.imgdb.cn/item/63e6139e4757feff3327ee24.jpg)

首先我们需要的是第一个字节的后四位,也就是opcode

``` js
const byte1 = bufferData.readUInt8(0)
let opcode =  byte1 & 0x0f;
```

读取8位无符号整数的内容,也就是第一个字节的内容. 参数是偏移的字节, 这里是 0 , 通过位运算去除后四位 这就是opcode了

然后处理第二个字节

第一位是mask标志位 , 后7位是payload长度

``` js
const byte2 = bufferData.readUInt8(1);
const str2 = byte2.toString(2);
const MASK = str2[0];
let payloadLength = parseInt(str2.substring(1), 2);
```

先转成二进制字符串，这时第一位就是 mask，然后再截取后 7 位的子串，parseInt 成数字，这就是 payload 长度了。

后面还有两个扩展用的payload长度, 这是因为数据不一定有多长,可能需要16位存长度 可能需要32位

于是 websocket 协议就规定了如果那个 7 位的内容不超过 125，那它就是 payload 长度。

如果 7 位的内容是 126，那就不用它了，用后面的 16 位的内容作为 payload 长度。

如果 7 位的内容是 127，也不用它了，用后面那个 64 位的内容作为 payload 长度。


``` js
let payloadLength = parseInt(str2.substring(1), 2);

let curByteIndex = 2;

if (payloadLength === 126) {
  payloadLength = bufferData.readUInt16BE(2);
  curByteIndex += 2;
} else if (payloadLength === 127) {
  payloadLength = bufferData.readBigUInt64BE(2);
  curByteIndex += 8;
}
```

这里的 curByteIndex 是存储当前处理到第几个字节的。

如果是 126，那就从第 3 个字节开始，读取 2 个字节也就是 16 位的长度，用 buffer.readUInt16BE 方法。

如果是 127，那就从第 3 个字节开始，读取 8 个字节也就是 64 位的长度，用 buffer.readBigUInt64BE 方法。

这样就拿到了payload的长度,然后再用这个长度去截取内容就好了. 但是在读取数据之前 还有个mask需要处理, 这个是用来给内容解密的,

读 4个字节 就是 mask key, 在后面的就可以根据payload长度读出来

```js
let realData = null;

if (MASK) {
  const maskKey = bufferData.slice(curByteIndex, curByteIndex + 4);  
  curByteIndex += 4;
  const payloadData = bufferData.slice(curByteIndex, curByteIndex + payloadLength);
  realData = handleMask(maskKey, payloadData);
} else {
  realData = bufferData.slice(curByteIndex, curByteIndex + payloadLength);;
}
```