
# Web Crypto API

全局只读crypto属性返回与Crypto全局对象关联的对象。此对象允许网页访问某些与加密相关的服务。

尽管属性本身是只读的，但它的所有方法（及其子对象的方法SubtleCrypto）都不是只读的，因此容易受到polyfill的攻击。

## Methods 

### getRandomValues

可让您获得加密的强随机值。作为参数给出的数组填充了随机数（在其密码学意义上是随机的）。

为了保证足够的性能，实现没有使用真正的随机数生成器，而是使用了一个伪随机数生成器，该生成器以具有足够熵的值作为种子


#### 语法

``` javascript
crypto.getRandomValues(typedArray)
``` 

#### DEMO

``` javascript
// 生成盐
const salt = window.crypto.getRandomValues(new Uint8Array(16));
```

#### 兼容性

无问题

#### 为什么已经有了Math.random() 还要一个 getRandomValues

MDN 在 Math.random()方法 部分有一条备注: 
> Math.random() 不能提供像密码一样安全的随机数字。不要使用它们来处理有关安全的事情。使用Web Crypto API 来代替, 和更精确的window.crypto.getRandomValues() 方法.

Math.random()函数返回一个0-1的伪随机浮点数，其实现的原理为：
> 为了保证足够的性能，Math.random() 随机数并不是实时生成的，而是直接生成一组随机数（64个），并放在缓存中。
> 当这一组随机数取完之后再重新生成一批，放在缓存中。

由于 Math.random() 的底层算法是公开的（xorshift128+ 算法），V8 源码可见，因此，是可以使用其他语言模拟的，这就导致，如果攻击者知道了当前随机生成器的状态，那就可以知道缓存中的所有随机数，那就很容易匹配与破解。

例如抽奖活动，使用 Math.random() 进行随机，那么就可以估算出一段时间内所有的中奖结果，从而带来非常严重且致命的损失。

详细解释在此:<https://www.anquanke.com/post/id/231799>


<!-- #### 伪随机与真随机 不存在真随机 -->

#### 熵

crypto 提到了很多次熵这个概念，他是一个指标，其描述的无序的程度，换言之，足够的熵值，其实也就是较强的伪随机性。

之前人工简单的随机数的方法是使用随机数表，当这个表足够大的情况下那么选取到的数就越接近真随机。

换做程序的话，生成随机数的算法足够复杂，就更加难以预测，熵也就大了。





### randomUUID

该接口的randomUUID()方法用于使用加密安全随机数生成器Crypto生成 v4 UUID 。


#### DEMO
```javascript
let uuid = self.crypto.randomUUID();
console.log(uuid); // for example "36b8f84d-df4e-4d49-b662-bcde71a8764f"
```

#### 兼容性

webview : Android 92
Chrome Android 92
iOS 15.4上的 Safari

## Props(subtle)

### 兼容性

包括其方法兼容性都为:
webview : Android 37
Chrome Android 37
iOS 7 上的 Safari


### 常见算法(MDN中提到的)

`RSASSA-PKCS1-v1_5` : 非对称加密

`RSA-PSS` : 非对称加密

`ECDSA` : 对数据（比如一个文件）创建数字签名，以便于你在不破坏它的安全性的前提下对它的真实性进行验证

`HMAC` : 一种使用哈希函数和密钥的加密身份验证技术

`RSA-OAEP` : 最优非对称加密填充

`AES-CTR` : 对称加密中的一种通过将逐次累加的计数器进行加密来生成密钥流的流密码

`AES-CBC` : 对称加密中的密码分组链接模式

`AES-GCM` : 对称加密中的加密采用Counter模式，并带有GMAC消息认证码

`SHA-1` : 是一种密码散列函数，生成一个被称为消息摘要的160位散列值，散列值通常的呈现形式为40个十六进制数。

`SHA-256` : 是一种密码散列函数，对于任意长度的消息，SHA256都会产生一个256位的哈希值，称作消息摘要

`SHA-384` : 是一种密码散列函数，对于任意长度的消息，SHA384都会产生一个384位的哈希值，称作消息摘要

`SHA-512` : 是一种密码散列函数，对于任意长度的消息，SHA512都会产生一个512位的哈希值，称作消息摘要

`ECDH` : 是一种匿名的密钥合意协议，这是迪菲－赫尔曼密钥交换的变种，采用椭圆曲线密码学来加强性能与安全性。在这个协定下，双方利用由椭圆曲线密码学建立的公钥与私钥对，在一个不安全的通道中，建立起安全的共有加密资料。

`HKDF` : 主要目的使用原始的密钥材料, 派生出一个或更多个能达到密码学强度的密钥(主要是保证随机性)——就是将较短的密钥材料扩展成较长的密钥材料，过程中需要保证随机性。

`PBKDF2` : 是一个用来导出密钥的函数，常用于生成加密的密码。 它的基本原理是通过一个伪随机函数（例如HMAC函数），把明文和一个盐值作为输入参数，然后重复进行运算，并最终产生密钥。 如果重复的次数足够大，破解的成本就会变得很高。

`AES-KW` : 对称加密

## API

### generateKey

使用接口的generateKey()方法 SubtleCrypto生成新的密钥（对称算法）或密钥对（公钥算法）。

#### 语法

```javascript
const result = crypto.subtle.generateKey(algorithm, extractable, keyUsages);
```

#### 参数

* algorithm: 是一个对象，定义了要生成的键的类型并提供额外的算法特定参数。
  + 对于`RSASSA-PKCS1-v1_5`、`RSA-PSS`或`RSA-OAEP`传递一个`{name:算法的名称，modulesLength:2048/4096,publicExponent:公众指数。除非有充分的理由使用其他方法，否则请在这里指定65537 ([0x01, 0x00, 0x01])。,hash:SHA-256 | SHA-384 | SHA-512}`; 
  + 对于`ECDSA`或`ECDH`: 传递一个`{name:算法名称，namedCurve:P-256 | P-384 | P-521}`
  + 对于`HMAC`传递一个`{name:...,hash:...,length:...}`; length密钥长度。如果省略这一点，则键的长度等于您所选择的哈希函数的块大小。除非有充分的理由使用不同的长度，否则省略此属性并使用默认值
  + 对于`AES-CTR`、`AES-CBC`、`AES-GCM`或`AES-KW`传递一个`{name:...,length:128|192|256}`; length表示要生成密钥的长度。
* extractable: 是否允许导出该密钥
* keyUsages: 指明哪些接口可以使用该密钥 `[encrypt,decrypt,sign,verify,deriveKey,deriveBits,wrapKey,unwrapKey]`

#### DEMO

```javascript
let keyPair = window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
);
```

### importKey

接口的importKey()方法SubtleCrypto 导入一个密钥: 也就是说，它将一个外部可移植格式的密钥作为输入，并为您提供一个CryptoKey可以在Web Crypto API中使用的对象。

该接口，返回一个Promise

#### 语法

```javascript
const result = crypto.subtle.importKey(
    format,
    keyData,
    algorithm,
    extractable,
    keyUsages
);
```

#### 参数

* format: `raw`,      `pkcs8`,      `spki`,      `jwk`
* keyData: `ArrayBuffer`,      `TypedArray`,      `DataView`,      `JSONWebKey`
* algorithm: 定义要导入的键的类型并提供额外的算法特定参数 `raw`,      `pkcs8`,      `spki`,      `jwk`
  + `RSASSA-PKCS1-v1_5`, `RSA-PSS`, `RSA-OAEP`,  `HMAC` 使用的数据结构是`{name:算法的名称,hash:SHA-256 | SHA-384 | SHA-512}`
  + `ECDSA`,  `ECDH` 使用的数据结构是`{name:算法的名称:P-256|P-384|P-521}`
  + `AES-CTR`, `AES-CBC`, `AES-GCM`, `AES-KW`需要的数据结构`{name:算法的名称}`
  + `PBKDF2`,  `HKDF` 无该属性
* extractable: 是否允许导出该密钥
* keyUsages: 指明哪些接口可以使用该密钥 `[encrypt,decrypt,sign,verify,deriveKey,deriveBits,wrapKey,unwrapKey]`

#### DEMO

```javascript
const rawKey = window.crypto.getRandomValues(new Uint8Array(16));

/*
Import an AES secret key from an ArrayBuffer containing the raw bytes.
Takes an ArrayBuffer String containing the bytes, and returns a Promise
that will resolve to a CryptoKey representing the secret key.
*/
function importSecretKey(rawKey) {
    return window.crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-GCM",
        true,
        ["encrypt", "decrypt"]
    );
}
```

### exportKey

该接口的exportKey()方法SubtleCrypto 导出一个密钥：也就是说，它接受一个CryptoKey对象作为输入，并以一种外部的、可移植的格式为您提供密钥。

要导出密钥，密钥必须CryptoKey.extractable设置为 true。

密钥不会以加密格式导出：要在导出密钥时加密密钥，请改用 SubtleCrypto.wrapKey() API。

#### 语法

```javascript
const result = crypto.subtle.exportKey(format, key);
```

#### 参数

* format是一个字符串值，描述应导出密钥的数据格式。 
  + raw: 原始格式。
  + pkcs8: PKCS #8格式。
  + spki: SubjectPublicKeyInfo 格式。
  + jwk：JSON 网络密钥 格式。
* key是CryptoKey要导出的

#### DEMO

```javascript
window.crypto.subtle.generateKey({
        name: "AES-GCM",
        length: 256,
    },
    true,
    ["encrypt", "decrypt"]
).then(async (key) => {
    const k = await window.crypto.subtle.exportKey(
        "raw",
        key
    );
    console.log(k)
});
```

下面是个官方demo

<iframe src='https://mdn.github.io/dom-examples/web-crypto/export-key/index.html' height='600'></iframe>

### encrypt

返回Promise与作为参数给出的明文、算法和密钥相对应的加密数据实现的。

支持 `RSA-OAEP` , `AES-CTR` , `AES-CBC` , `AES-GCM`

#### 语法

```javascript
const result = crypto.subtle.encrypt(algorithm, key, data);
```

#### 参数

* algorithm 是一个对象，指定要使用的算法和任何额外的参数
  + 如果使用`RSA-OAEP` 需要的参数 `{name:String,[label]:BufferSource}`; label它本身不需要加密，但应该绑定到密文。标签的摘要是加密操作输入的一部分。除非您的应用程序需要标签，否则您可以省略此参数，它不会影响加密操作的安全性。
  + 如果使用`AES-CTR` 需要的参数 `{name:String,counter:BufferSource,length:number}`; counter  计数器块的初始值。这必须是 16 字节长（AES 块大小）。该块的最右边length位用于计数器，其余位用于随机数。例如，如果length设置为 64，则前半部分counter是 nonce，后半部分用于计数器。 length: 计数器块中用于实际计数器的位数。计数器必须足够大以至于它不会回绕: 如果消息是n块并且计数器是m位长，那么以下必须为真n <= 2^m
  + 如果使用`AES-CBC` 需要的参数 `{name:String,iv:BufferSource}`。iv 初始化向量，必须是16字节，
  + 如果使用`AES-GCM` 需要的参数 `{name:String,iv:BufferSource,[additionalData]:BufferSource,[tagLength]:Number}`; iv: 对于使用给定密钥执行的每个加密操作，这必须是唯一的。换句话说: 永远不要重复使用具有相同密钥的 IV。additionalData: 这包含不会加密但将与加密数据一起进行身份验证的附加数据。如果additionalData在此处给出，则在相应的调用中必须给出相同decrypt()的数据: 如果给decrypt()调用的数据与原始数据不匹配，则解密将抛出异常。位长additionalData必须小于2^64 - 1; tagLength: 这决定了在加密操作中生成并用于相应解密中的认证的认证标签的比特大小。

* key 是一个用于加密的密钥
* data 是一个`BufferSource` 包含要加密的数据。

#### DEMO

##### RSA-OAEP

```javascript
// 需要加密的字符串
const sourceStr = '123456abcdef'
// 我们需要将字符串转化成BufferSource
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
const data = str2ab(sourceStr)
// 我们先获取密钥
(async () => {
    let keyPair = await window.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    )

    // 此时keyPair 返回给我们是个对象 分别包括{privateKey,publicKey};
    // 我们使用公钥去进行加密操作
    let result = await window.crypto.subtle.encrypt({
        name: "RSA-OAEP",
    }, keyPair.publicKey, data)

    // 由于我们拿到的是ArrayBuffer 所以将起转化成字符串看一下结果
    console.log(String.fromCharCode.apply(null, new Uint8Array(result)))

    // fÅºÊð§È»vÙ¬µ÷GP¹V:±Ñºä§]j=ß)>?Çæ=Í@<ÛZÇÜn[¿vµ¢çtXÄTcYàùèØ÷îµrxK©Æm8®oÄ¤÷#³Òa²k7w²¾{±Em>@É'÷Îòyd9*áAòb_MÊï\þ
    // ×!ZõQc?Ëm¬K¥§¬°c-ò ~µ)ÓIPxP-Êæº^ç0úÂVöf£hZ_ØÏ{ÒpãÌæÛÅ÷»<Z/Òl /£E®®^ÐÒ:¢ øò½(ÍìüÌ¡P+L$øq

    // 这样我们就加密成功了

})();
```

#### AES-CTR

```javascript
...

// 我们使用和上面例子相同的数据 所以省略 
// 直接开始方法
let iv = window.crypto.getRandomValues(new Uint8Array(16));
let keyPair = await window.crypto.subtle.generateKey({
        name: "AES-CTR",
        length: 128
    },
    true,
    ["encrypt", "decrypt"]
)

// AES-CTR 生成的不是密钥对 
const encrypted_content = await window.crypto.subtle.encrypt({
        name: "AES-CTR",
        counter: iv,
        length: 64
    },
    keyPair,
    data
);

console.log(String.fromCharCode.apply(null, new Uint8Array(encrypted_content))) // ¹R«ýN¬Å
```

剩余两个同理，不举例了

### decrypt

接口的decrypt()方法SubtleCrypto 对一些加密数据进行解密。它将解密密钥、一些可选的额外参数和要解密的数据（也称为“密文”）作为参数。它返回一个Promise将用解密的数据（也称为“明文”）来实现的。

#### 语法

```javascript
const result = crypto.subtle.decrypt(algorithm, key, data);
```

#### 参数

基本与加密一样

* algorithm 是一个对象，指定要使用的算法和任何额外的参数
  + 如果使用`RSA-OAEP` 需要的参数 `{name:String,[label]:BufferSource}`; label它本身不需要加密，但应该绑定到密文。标签的摘要是加密操作输入的一部分。除非您的应用程序需要标签，否则您可以省略此参数，它不会影响加密操作的安全性。
  + 如果使用`AES-CTR` 需要的参数 `{name:String,counter:BufferSource,length:number}`; counter  计数器块的初始值。这必须是 16 字节长（AES 块大小）。该块的最右边length位用于计数器，其余位用于随机数。例如，如果length设置为 64，则前半部分counter是 nonce，后半部分用于计数器。 length: 计数器块中用于实际计数器的位数。计数器必须足够大以至于它不会回绕: 如果消息是n块并且计数器是m位长，那么以下必须为真n <= 2^m
  + 如果使用`AES-CBC` 需要的参数 `{name:String,iv:BufferSource}`。iv 初始化向量，必须是16字节，
  + 如果使用`AES-GCM` 需要的参数 `{name:String,iv:BufferSource,[additionalData]:BufferSource,[tagLength]:Number}`; iv: 对于使用给定密钥执行的每个加密操作，这必须是唯一的。换句话说: 永远不要重复使用具有相同密钥的 IV。additionalData: 这包含不会加密但将与加密数据一起进行身份验证的附加数据。如果additionalData在此处给出，则在相应的调用中必须给出相同decrypt()的数据: 如果给decrypt()调用的数据与原始数据不匹配，则解密将抛出异常。位长additionalData必须小于2^64 - 1; tagLength: 这决定了在加密操作中生成并用于相应解密中的认证的认证标签的比特大小。

* key 是一个用于加密的密钥，如果使用的是`RSA-OAEP` 记得使用对应的privateKey进行解密
* data 是一个`BufferSource` 包含要加密的数据。

#### DEMO

##### RSA-OAEP

```javascript
// 此处的result 是上面DEMO 加密生成的ArrayBuffer
// KeyPair是对应的密钥对
const decodeResult = await window.crypto.subtle.decrypt({
    name: "RSA-OAEP",
}, keyPair.privateKey, result)

console.log('解密后的数据', String.fromCharCode.apply(null, new Uint8Array(decodeResult))); // 123456abcdef
```

##### AES-CTR

```javascript
const decodeResult = await window.crypto.subtle.decrypt({
        name: "AES-CTR",
        counter: iv,
        length: 64
    },
    keyPair,
    encrypted_content
)

console.log(String.fromCharCode.apply(null, new Uint8Array(decodeResult))) // 123456abcdef
```

### deriveKey

该接口的deriveKey()方法SubtleCrypto 可用于从主密钥导出秘密密钥。

它将一些初始密钥材料、要使用的派生算法以及要派生的密钥所需的属性作为参数。它返回一个Promise 将由一个CryptoKey表示新键的对象来实现。

#### 语法

```javascript
const result = crypto.subtle.deriveKey(
    algorithm,
    baseKey,
    derivedKeyAlgorithm,
    extractable,
    keyUsages
);
```

#### 参数

* algorithm是定义要使用的推导算法的对象。
  + 要使用ECDH，请传递一个`{name:'ECDH',public:另一个实体的公钥}`
  + 要使用HKDF，请传递一个`{name:'HKDF',hash:'SHA-1|SHA-256|SHA-384|SHA-512',salt:BufferSource,info:BufferSource}` 理想情况下，盐是一个随机或伪随机值，其长度与摘要函数的输出相同。info: 表示特定于应用程序的BufferSource上下文信息。这用于将派生的密钥绑定到应用程序或上下文，并使您能够在使用相同的输入密钥材料时为不同的上下文派生不同的密钥。
  + 要使用PBKDF2，请传递一个`{name:'HKDF',hash:'SHA-1|SHA-256|SHA-384|SHA-512',salt:BufferSource,iterations:number}` salt是至少 16 个字节的随机或伪随机值.iterations表示要执行的哈希次数

* baseKey是推导算法的输入，如果algorithm是 ECDH，那么这将是 ECDH 私钥。否则，它将是派生函数的初始密钥材料
* derivedKeyAlgorithm: 是定义派生密钥将用于算法的对象
  + 对于`HMAC`, 传递一个`{name:'HMAC',hash:SHA-1|SHA-256|SHA-384|SHA-512,length:number}` length密钥长度，可忽略
  + 对于`AES-CTR`、`AES-CBC`、`AES-GCM`或`AES-KW`, 传递一个`{name:...,length:128|192|256}`
* extractable是一个布尔值，指示是否可以使用SubtleCrypto.exportKey()或 导出密钥SubtleCrypto.wrapKey()
* keyUsagesArray: 指示可以使用派生密钥做什么, 密钥的使用必须由 中设置的算法允许derivedKeyAlgorithm

#### Error

* InvalidAccessError
当主密钥不是请求派生算法的密钥或该密钥的keyUsages值不包含时引发deriveKey。
* NotSupported
当尝试使用未知或不适合派生的算法，或者派生密钥请求的算法未定义密钥长度时引发。
* SyntaxError
当keyUsages为空但未包装的密钥类型为secretor时引发private。

#### ECDH

ECDH（椭圆曲线 Diffie-Hellman）是一种密钥协商算法。它使每个拥有 ECDH 公钥/私钥对的两个人能够生成一个共享的秘密

举个例子, A和B进行回话，这个方法的作用就是用A的私钥和B的公钥 生成了一个秘密密钥(猜测可能也叫会话密钥)，然后用这个密钥对要传输的内容进行加密，等B收到加密消息后，用自己的私钥和A的公钥生成一个密钥，这个密钥和A生成的一样，所以就可以用它去解密。

```javascript
// Alices 的密钥对
let alicesKeyPair = await window.crypto.subtle.generateKey({
        name: "ECDH",
        namedCurve: "P-384"
    },
    false,
    ["deriveKey"]
);
// Bob 的密钥对
let bobsKeyPair = await window.crypto.subtle.generateKey({
        name: "ECDH",
        namedCurve: "P-384"
    },
    false,
    ["deriveKey"]
);

// 此函数生成秘密密钥
function deriveSecretKey(privateKey, publicKey) {
  return window.crypto.subtle.deriveKey({
        name: "ECDH",
        public: publicKey
    },
    privateKey, {
        name: "AES-GCM",
        length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );
}

let alicesSecretKey = await deriveSecretKey(alicesKeyPair.privateKey, bobsKeyPair.publicKey);

let bobsSecretKey = await deriveSecretKey(bobsKeyPair.privateKey, alicesKeyPair.publicKey);

const iv = window.crypto.getRandomValues(new Uint8Array(12));

const data = str2ab('123456abcdef')

let result = await window.crypto.subtle.encrypt({
    name: "AES-GCM",
    iv: iv
}, alicesSecretKey, data)

const decodeResult = await window.crypto.subtle.decrypt({
    name: "AES-GCM",
    iv: iv
}, bobsSecretKey, result)

console.log(String.fromCharCode.apply(null, new Uint8Array(result))) // ¸]BÞ4é¶/NBÕ;+Dø-Ü'	Ö4
console.log(String.fromCharCode.apply(null, new Uint8Array(decodeResult))) // 123456abcdef
```

#### PBKDF2

<!-- It's designed to derive key material from some high-entropy input, such as the output of an ECDH key agreement operation. -->

<!-- 它旨在从一些高熵输入中获得密钥材料，例如ECDH密钥协议操作的输出。-->

```javascript
// 假设我们谈了个框，让用户输入了一个密码 然后用这个密码作为一个密钥
const password = '123456a';
let enc = new TextEncoder();
// 通过用户输入的内容 生成了一个密钥
const getKeyMaterial = () => {
    return window.crypto.subtle.importKey(
        'raw',
        enc.encode(password), {
            name: 'PBKDF2'
        },
        false,
        ["deriveBits", "deriveKey"]
    )
}

// 通过 用户输入生成的密钥 ， 再生成一个秘密密钥
const getKey = (keyMaterial) => {
    return window.crypto.subtle.deriveKey({
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial, {
            "name": "AES-GCM",
            "length": 256
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// 然后我们就可以用这个密钥进行操作了

const result = await window.crypto.subtle.encrypt({
    name: "AES-GCM",
    iv: iv
  },
  key,
  enc('123456abcdef')
);

const decodeResult = await window.crypto.subtle.decrypt({
        name: "AES-GCM",
        iv: iv
    },
    key,
    result
);
```

### deriveBits

该接口的deriveBits()方法 SubtleCrypto可用于从基本密钥派生位数组。

它将基密钥、要使用的派生算法以及要派生的位串的长度作为其参数。它返回 a Promise ，它将用 ArrayBuffer 包含派生位的 a 来实现。

此方法与 非常相似 SubtleCrypto.deriveKey()，只是deriveKey()返回一个 CryptoKey对象而不是 ArrayBuffer. 本质上deriveKey()是由 deriveBits()后跟 importKey()。

除了参数之外其他的用法和 `deriveKey` 一致

#### 语法

```javascript
const result = crypto.subtle.deriveBits(
    algorithm,
    baseKey,
    length
);
```

#### 参数

* algorithm是定义要使用的推导算法的对象。
  + 要使用ECDH，请传递一个`{name:'ECDH',public:另一个实体的公钥}`
  + 要使用HKDF，请传递一个`{name:'HKDF',hash:'SHA-1|SHA-256|SHA-384|SHA-512',salt:BufferSource,info:BufferSource}` 理想情况下，盐是一个随机或伪随机值，其长度与摘要函数的输出相同。info: 表示特定于应用程序的BufferSource上下文信息。这用于将派生的密钥绑定到应用程序或上下文，并使您能够在使用相同的输入密钥材料时为不同的上下文派生不同的密钥。
  + 要使用PBKDF2，请传递一个`{name:'HKDF',hash:'SHA-1|SHA-256|SHA-384|SHA-512',salt:BufferSource,iterations:number}` salt是至少 16 个字节的随机或伪随机值.iterations表示要执行的哈希次数

* baseKey是推导算法的输入，如果algorithm是 ECDH，那么这将是 ECDH 私钥。否则，它将是派生函数的初始密钥材料
* length是一个数字，表示要导出的位数。为了兼容所有浏览器，数字应该是 8 的倍数。

#### DEMO

由于与 `deriveKey` 极其类似。只展示不同部分

```javascript
// Alice then generates a secret key using her private key and Bob's public key.
let alicesSecretArray = await deriveSecretKey(alicesKeyPair.privateKey, bobsKeyPair.publicKey);
let alicesSecretKey = await window.crypto.subtle.importKey('raw', alicesSecretArray, {
    name: 'AES-GCM'
}, true, ['encrypt', 'decrypt'])

// Bob generates the same secret key using his private key and Alice's public key.
let bobsSecretArray = await deriveSecretKey(bobsKeyPair.privateKey, alicesKeyPair.publicKey);
let bobsSecretKey = await window.crypto.subtle.importKey('raw', bobsSecretArray, {
    name: 'AES-GCM'
}, true, ['encrypt', 'decrypt'])

function deriveSecretKey(privateKey, publicKey) {
    return window.crypto.subtle.deriveBits({
            name: "ECDH",
            namedCurve: "P-384",
            public: publicKey
        },
        privateKey,
        128
    );
}
```

### digest

接口的digest()方法SubtleCrypto 生成给定数据的摘要。摘要是从一些可变长度输入派生的短的固定长度值。密码摘要应该表现出抗碰撞性，这意味着很难提出两个具有相同摘要值的不同输入。

它将要使用的摘要算法的标识符和要摘要的数据作为其参数。

#### 语法

```javascript
const digest = crypto.subtle.digest(algorithm, data);
```

#### 参数

* algorithm: 这可能是一个字符串或具有单个属性的对象，name即字符串。字符串命名要使用的散列函数。支持的值是：SHA-1 | SHA-256 | SHA-384 | SHA-512 
* data: 一个ArrayBuffer 

#### DEMO

```javascript
const text = 'An obscure body in the S-K System, your majesty. The inhabitants refer to it as the planet Earth.';

async function digestMessage(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return hash;
}

digestMessage(text).then(digestBuffer => console.log(new TextDecoder().decode(digestBuffer)));
```

### sign

该接口的sign()方法SubtleCrypto 生成数字签名。

它将签名密钥、一些特定于算法的参数和要签名的数据作为其参数。它返回一个Promise将由签名完成的。

您可以使用相应的SubtleCrypto.verify()方法来验证签名。

#### 语法

```javascript
const signature = crypto.subtle.sign(algorithm, key, data);
```

#### 参数

* algorithm是一个字符串或对象，它指定要使用的签名算法及其参数：
  + 要使用RSASSA-PKCS1-v1_5，请传递表单的字符串 "RSASSA-PKCS1-v1_5"或对象 { "name": "RSASSA-PKCS1-v1_5" }
  + 要使用RSA-PSS，请传递一个`{name:'RSA-PSS',saltLength:number}` RFC 3447说“典型的盐长度”要么是0，要么是生成这个键时选择的摘要算法输出的长度。例如，如果您使用SHA-256作为摘要算法，这个值可能是32。 saltLength表示要使用的随机盐的长度的长整数，以字节为单位。
  + 要使用ECDSA，请传递一个`{name:ECDSA:hash:...}`
  + 要使用HMAC，请传递"HMAC"表单的字符串或对象 `{ "name": "HMAC" }`。
* key是一个CryptoKey包含用于签名的密钥的对象。如果算法识别出公钥密码系统，这就是私钥。
* data是一个ArrayBuffer或 ArrayBufferView对象，包含要签名的数据。

### verify

接口的verify()方法SubtleCrypto 验证数字签名。

它将一个密钥作为其参数来验证签名，一些特定于算法的参数、签名和原始签名数据。它返回一个 Promise布尔值，指示签名是否有效。

#### 语法

```javascript
const result = crypto.subtle.verify(algorithm, key, signature, data);
```

#### 参数

* algorithm是一个字符串或对象，它指定要使用的签名算法及其参数：
  + 要使用RSASSA-PKCS1-v1_5，请传递表单的字符串 "RSASSA-PKCS1-v1_5"或对象 { "name": "RSASSA-PKCS1-v1_5" }
  + 要使用RSA-PSS，请传递一个`{name:'RSA-PSS',saltLength:number}` RFC 3447说“典型的盐长度”要么是0，要么是生成这个键时选择的摘要算法输出的长度。例如，如果您使用SHA-256作为摘要算法，这个值可能是32。 saltLength表示要使用的随机盐的长度的长整数，以字节为单位。
  + 要使用ECDSA，请传递一个`{name:ECDSA:hash:...}`
  + 要使用HMAC，请传递"HMAC"表单的字符串或对象 `{ "name": "HMAC" }`。
* key是一个CryptoKey包含用于签名的密钥的对象。如果算法识别出公钥密码系统，这就是私钥。
* signature是一个ArrayBuffer包含 要验证 的签名。
* data是一个ArrayBuffer或 ArrayBufferView对象，包含要签名的数据。

#### DEMO

```javascript
let keyPair = await window.crypto.subtle.generateKey({
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
}, true, ['sign', 'verify'])
let encoded = new TextEncoder().encode(
    'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt quas ex eum '
);
let signature = await window.crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    keyPair.privateKey,
    encoded
);
console.log('输出签名', new TextDecoder().decode(signature))

let result = await window.crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    keyPair.publicKey,
    signature,
    encoded
)
console.log(result) //true
```

官网DEMO
<iframe src='https://mdn.github.io/dom-examples/web-crypto/sign-verify/index.html' height='800'></iframe>

### wrapKey 

接口的wrapKey()方法SubtleCrypto “包装”了一个密钥。这意味着它以外部、可移植的格式导出密钥，然后加密导出的密钥。包装密钥有助于在不受信任的环境中保护它，例如在不受保护的数据存储内部或通过不受保护的网络传输。

与 一样SubtleCrypto.exportKey()，您可以为密钥指定导出格式 。要导出密钥，它必须CryptoKey.extractable 设置为true.

但是因为wrapKey()还要加密要导入的密钥，所以还需要传入必须用来加密的密钥。这有时被称为“包装密钥”。

#### 语法

```javascript
const result = crypto.subtle.wrapKey(
    format,
    key,
    wrappingKey,
    wrapAlgo
);
```

#### 参数

* format 是一个字符串，描述了在加密之前导出密钥的数据格式 raw | pkcs8 | spki | jwk
* key 是 要包装的 cryptoKey  
* wrappingKey 用于 CryptoKey 加密导出的密钥。密钥必须具有wrapKey法集
* wrapAlgo 是一个对象，指定用于加密导出密钥的算法, 
  + 要使用`RSA-OAEP`，请传递一个`{name:...,[label]:BufferSource}`
  + 要使用`AES-CTR`，请传递一个`{name:String,counter:BufferSource,length:number}`
  + 要使用`AES-CBC`，请传递一个`{name:String,iv:BufferSource}`
  + 要使用`AES-GCM`，请传递一个`{name:String,iv:BufferSource,[additionalData]:BufferSource,[tagLength]:Number}`
  + 要使用`AES-KW`，请传递一个`{ "name": "AES-KW }`

#### Error

* InvalidAccessError: 当包装密钥不是请求的包装算法的密钥时引发。

* NotSupported: 在尝试使用未知或不适合加密或包装的算法时引发。

* TypeError: 尝试使用无效格式时引发。

#### DEMO

```javascript
const salt = window.crypto.getRandomValues(new Uint8Array(16));

// 这个是我们加密解密所用的密钥
const secretKey = await window.crypto.subtle.generateKey({
    name: "AES-GCM",
    length: 256
  },
  true,
  ['encrypt', 'decrypt']
)

// 通过导入用户输入 生成一个密钥
const materialKey = await window.crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode('123456a'),
  {name:'PBKDF2'},
  false,
  ["deriveBits", "deriveKey"]
)

// 从用户输入材料 生成的主密钥 导出一个秘密密钥
// AES-KW 是一种使用 AES 密码进行密钥包装的方法。
// 使用 AES-KW 优于另一种 AES 模式（例如 AES-GCM）的一个优点是 AES-KW 不需要初始化向量。要使用 AES-KW，输入必须是 64 位的倍数。
const wrappingKey = await window.crypto.subtle.deriveKey(
  {
    "name":"PBKDF2",
    salt,
    "iterations":1000,
    hash:'SHA-256'
  },
  materialKey,
  {name:'AES-KW',length:256},
  true,
  ['wrapKey','unwrapKey']
)

// 采用上面导出的秘密密钥 去加密 用于加密的秘密密钥。
const wrapedKey = await window.crypto.subtle.wrapKey(
  'raw',
  // 用的密钥
  secretKey,
  // 加密上面密钥用的密钥
  wrappingKey,
  {name:'AES-KW'}
)


```

### unwrapKey

接口的unwrapKey()方法SubtleCrypto “解包”一个密钥。这意味着它将一个已导出然后加密（也称为“包装”）的密钥作为其输入。它解密密钥然后导入它，返回一个CryptoKey可以在Web Crypto API中使用的对象。

#### 语法

```javascript
const result = crypto.subtle.unwrapKey(
    format,
    wrappedKey,
    unwrappingKey,
    unwrapAlgo,
    unwrappedKeyAlgo,
    extractable,
    keyUsages
);
```

#### 参数

* format 是一个字符串，描述了在加密之前导出密钥的数据格式 raw | pkcs8 | spki | jwk
* wrappedKey是一个ArrayBuffer包含给定格式的包装键。(其实就是通过wrapkey返回的那个结果 他本身就是arrayBuffer格式)
* unwrappingKey是CryptoKey用于解密包装密钥的。密钥必须具有unwrapKey用法集。(同理 加密的时候通过导入用户的输入或者其他格式的材料生成了一个加密用的密钥，解密的时候同时也需要一个这些参数生成的密钥)
* wrapAlgo 是一个对象，指定用于加密导出密钥的算法
  + 要使用`RSA-OAEP`，请传递一个`{name:...,[label]:BufferSource}`
  + 要使用`AES-CTR`，请传递一个`{name:String,counter:BufferSource,length:number}`
  + 要使用`AES-CBC`，请传递一个`{name:String,iv:BufferSource}`
  + 要使用`AES-GCM`，请传递一个`{name:String,iv:BufferSource,[additionalData]:BufferSource,[tagLength]:Number}`
  + 要使用`AES-KW`，请传递一个`{ "name": "AES-KW }`
* unwrappedKeyAlgo
* extractable表示Boolean 是否可以使用SubtleCrypto.exportKey() 或导出密钥SubtleCrypto.wrapKey()。
* keyUsages 是一个Array 指示可以用该键做什么。

#### Error

InvalidAccessError: 当解包密钥不是请求解包算法的密钥或keyUsages该密钥的值不包含 时引发unwrap。

NotSupported: 在尝试使用未知或不适合加密或包装的算法时引发。

SyntaxError: 当keyUsages为空但未包装的密钥类型为secretor时引发private。

TypeError: 尝试使用无效格式时引发。

#### DEMO

```javascript
// 从用户材料 生成解密用的主密钥
const unWrapMaterialKey = await window.crypto.subtle.importKey(
  'raw',
  // 假设用户输入的密码是123456a
  new TextEncoder().encode('123456a'),
  {name:'PBKDF2'},
  false,
  ["deriveBits", "deriveKey"]
)
// 从解密的主密钥 导出 解密用的秘密密钥
const unWrappingKey = await window.crypto.subtle.deriveKey(
  {
    "name":"PBKDF2",
    salt,
    "iterations":1000,
    hash:'SHA-256'
  },
  unWrapMaterialKey,
  {name:'AES-KW',length:256},
  true,
  ['wrapKey','unwrapKey']
)


const unwrapKey = await window.crypto.subtle.unwrapKey(
  'raw',
  // 这个就是上面加密demo的结果
  wrapedKey,
  // 用解密的密钥解密
  unWrappingKey,
  {name:'AES-KW'},
  {name:'AES-GCM'},
  true,
  ['encrypt','decrypt']
)

```


## 兼容性测试DEMO
<!-- 上面写的demo 只在控制台输出了具体结果，后面发现官方有demo并 有dom交互 -->
* encrypt decrypt <https://mdn.github.io/dom-examples/web-crypto/encrypt-decrypt/index.html>
* deriveKey <https://mdn.github.io/dom-examples/web-crypto/encrypt-decrypt/index.html>
* deriveBits <https://mdn.github.io/dom-examples/web-crypto/derive-bits/index.html>
* exportKey <https://mdn.github.io/dom-examples/web-crypto/export-key/index.html>
* generateKey <https://mdn.github.io/dom-examples/web-crypto/encrypt-decrypt/index.html>
* importKey <https://mdn.github.io/dom-examples/web-crypto/import-key/index.html>
* sign verify <https://mdn.github.io/dom-examples/web-crypto/sign-verify/index.html>
* unwrapKey <https://mdn.github.io/dom-examples/web-crypto/unwrap-key/index.html>
* wrapKey <https://mdn.github.io/dom-examples/web-crypto/wrap-key/index.html>

## 总结

用法简单，但是整体逻辑比较混乱，有很多概念难以理解。