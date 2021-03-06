# HTTP 2.0 

HTTP 1.0 是 1996 年发布的，奠定了 web 的基础。时隔三年，1999 年又发布了 HTTP 1.1，对功能上做了扩充。之后又时隔十六年，2015 年发布了 HTTP 2.0。

## HTTP 1.1 的问题

我们知道，HTTP 的下层协议是 TCP，需要经历三次握手才能建立连接。而 HTTP 1.0 的时候一次请求和响应结束就会断开链接，这样下次请求又要重新三次握手来建立连接。

为了减少这种建立 TCP 链接的消耗，HTTP 1.1 支持了 keep-alive，只要请求或响应头带上 Connection: keep-alive，就可以告诉对方先不要断开链接，我之后还要用这个链接发消息。当需要断开的时候，再指定 Connection: close 的 header。

但这样虽然减少了链接的建立，在性能上却有问题，下次请求得等上一个请求返回响应才能发出。

### 队头阻塞

这个问题有个名字，叫做队头阻塞，很容易理解，因为多个请求要排队嘛，队前面的卡住了，那后面的也就执行不了了。

HTTP 1.1 提出了管道的概念，就是多个请求可以并行发送，返回响应后再依次处理。

其实这样能部分解决问题，但是返回的响应依然要依次处理，解决不了队头阻塞的问题。

所以说管道化是比较鸡肋的一个功能，现在绝大多数浏览器都默认关闭了，甚至都不支持。

所以解决队头阻塞的问题的方案是， 开多个队。

浏览器一般会同一个域名建立6-8个TCP链接，如果一个队发生了队头阻塞，那就放到其他队里。

我们写的网页想尽快的打开就要利用这一点，比如把静态资源部署在不同的域名下。这样每个域名都能并发 6-8 个下载请求，网页打开的速度自然就会快很多。

这种优化手段叫做“域名分片”，CDN 一般都支持这个。


### 头部过大

除了队头阻塞问题，还有头部过大的问题。

就算只传输几个字符，也会携带一大堆header，

而且这些 header 还都是文本的，这样占据的空间就格外的大。

所以呢，HTTP 1.1 的时候，我们就要尽量避免一些小请求，因为就算请求的内容很少，也会带上一大段 header。特别是有 cookie 的情况，问题格外明显。


因此，我们的网页就要做打包，也就是需要打包工具把模块合并成多个 chunk 来加载。需要把小图片合并成大图片，通过调整 background:position 来使用。需要把一些 css、图片等内联。而且静态资源的域名也要禁止携带 cookie。



## HTTP2.0做的优化

### 优化队头阻塞

HTTP2 确实是通过 ID 把请求和响应关联起来了，它把这个概念叫做流 stream。

而且我们之前说了 header 需要单独的优化嘛，所以把 header 和 body 部分分开来传送，叫做不同的帧 frame。

![RUNOOB 图标](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54085d10a0d14bde8f22c892e01b3d1f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)


header 部分最开始是长度，然后是这个帧的类型，有这样几种类型：

* SETTINGS 帧：配置信息，比如最大帧 size，是否支持 server push 等。
* HEADERS 帧：请求或响应的 header
* DATA 帧：请求或响应的 body
* CONTINUATION 帧：一个帧不够装的时候，可以分帧，用这个可以引用上一个帧。
* PUSH_PROMISE 帧：服务端推送数据的帧
* END_STREAM 帧：表示流传输结束
* RST_STREAM 帧，用来终止当前流


SETTING 帧是配置信息，先告诉对方我这里支持什么，帧大小设置为多大等。

帧大小是有个上限的，如果帧太大了，可以分成多个，这时候帧类型就是 CONTINUATION（继续）。也很容易理解。

HTTP2 确实是支持服务端推送的，这时候帧类型也是单独的，叫做 PUSH_PROMISE。

流是用来传输请求响应或者服务端推送的，那传输完毕的时候就可以发送 END_STREAM 帧来表示传输完了，然后再传输 RST_STREAM 来结束当前流。


帧的类型讲完了，我们继续往后看，后面还有个 flags 标志位，这个在不同的帧类型里会放不同的内容：

比如 header 帧会在 flags 中设置优先级，这样高优先级的流就可以更早的被处理。

HTTP 1.1 的时候都是排队处理的，没什么优先级可言，而 HTTP 2.0 通过流的方式实现了请求的并发，那自然就可以控制优先级了。


后面还有个 R，这个现在还没啥用，是一个保留的位。

再后面的流标识符就是 stream id 了，关联同一个流的多个帧用的。


### stream的状态流转

刚开始，流是 idle 状态，也就是空闲。

收到或发送 HEADERS 帧以后会进入 open 状态。

oepn 状态下可以发送或接收多次 DATA 帧。

之后发送或接收 END_STREAM 帧进入 half_closed 状态。

half_closed 状态下收到或者发送 RST_STREAM 帧就关闭流。

这个流程很容易理解，就是先发送 HEADER，再发送 DATA，之后告诉对方结束，也就是 END_STREAM，然后关闭 RST_STREAM。


### stream 服务端推送流转状态

流刚开始是 idle 状态。

接收到 PUSH_PROMISE 帧，也就是服务端推送过来的数据，变为 reserved 状态。

reserved 状态可以再发送或接收 header，之后进入 half_closed 状态。

后面的流程是一样的，也是 END_STREAM 和 RST_STREAM。

这个流程是 HTTP2 特有的，也就是先推送数据，再发送 headers，然后结束流。

### 多路复用

流和流之间可以并发，还可以设置优先级，这样自然就没有了队头阻塞的问题，这个特性叫做多路复用。也就是复用同一个链接，建立起多条通路（流）的意思。


### 头部压缩

而且传输的 header 帧也是经过处理的，就像我们前面说的，会用二进制的方式表示，用做压缩，而且压缩算法是专门设计的，叫做 HPACK：

两端会维护一个索引表，通过下标来标识 header，这样传输量就少了不少：



## HTTP2.0的问题

虽然 HTTP 层面没有了队头阻塞问题，多个请求响应可以并行处理。但是同一个流的多个帧还是有队头阻塞问题，以为你 TCP 层面会保证顺序处理，丢失了会重传，这就导致了上一个帧没收到的话，下一个帧是处理不了的。

这个问题是 TCP 的可靠传输的特性带来的，所以想彻底解决队头阻塞问题，只能把 HTTP 的底层传输协议换掉了。