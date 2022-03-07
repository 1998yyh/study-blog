# crypto 加密


## 加密算法

`RSASSA-PKCS1-v1_5`: 非对称加密
`RSA-PSS`: 非对称加密
`ECDSA`: 对数据（比如一个文件）创建数字签名，以便于你在不破坏它的安全性的前提下对它的真实性进行验证
`HMAC`: 一种使用哈希函数和密钥的加密身份验证技术
`RSA-OAEP`: 最优非对称加密填充
`AES-CTR`:对称加密中的一种通过将逐次累加的计数器进行加密来生成密钥流的流密码
`AES-CBC`:对称加密中的密码分组链接模式
`AES-GCM`:对称加密中的加密采用Counter模式，并带有GMAC消息认证码
`SHA-1`:是一种密码散列函数，生成一个被称为消息摘要的160位散列值，散列值通常的呈现形式为40个十六进制数。
`SHA-256`:是一种密码散列函数，对于任意长度的消息，SHA256都会产生一个256位的哈希值，称作消息摘要
`SHA-384`:是一种密码散列函数，对于任意长度的消息，SHA384都会产生一个384位的哈希值，称作消息摘要
`SHA-512`:是一种密码散列函数，对于任意长度的消息，SHA512都会产生一个512位的哈希值，称作消息摘要
`ECDH`:是一种匿名的密钥合意协议，这是迪菲－赫尔曼密钥交换的变种，采用椭圆曲线密码学来加强性能与安全性。在这个协定下，双方利用由椭圆曲线密码学建立的公钥与私钥对，在一个不安全的通道中，建立起安全的共有加密资料。
`HKDF`:主要目的使用原始的密钥材料,派生出一个或更多个能达到密码学强度的密钥(主要是保证随机性)——就是将较短的密钥材料扩展成较长的密钥材料，过程中需要保证随机性。
`PBKDF2`:是一个用来导出密钥的函数，常用于生成加密的密码。 它的基本原理是通过一个伪随机函数（例如HMAC函数），把明文和一个盐值作为输入参数，然后重复进行运算，并最终产生密钥。 如果重复的次数足够大，破解的成本就会变得很高。
`AES-KW`:


## API

### importKey

接口的importKey()方法SubtleCrypto 导入一个密钥：也就是说，它将一个外部可移植格式的密钥作为输入，并为您提供一个CryptoKey可以在Web Crypto API中使用的对象。

该接口，返回一个Promise

#### 语法

``` javascript
const result = crypto.subtle.importKey(
    format,
    keyData,
    algorithm,
    extractable,
    keyUsages
);
```

#### 参数
+ format: `raw`,`pkcs8`,`spki`,`jwk`
+ keyData: `ArrayBuffer`,`TypedArray`,`DataView`,`JSONWebKey`
+ algorithm: `raw`,`pkcs8`,`spki`,`jwk`
  - `RSASSA-PKCS1-v1_5`,`RSA-PSS`,`RSA-OAEP`,`HMAC` 使用的数据结构是`{name:算法的名称,hash:SHA-256 | SHA-384 | SHA-512}`
  - `ECDSA`,`ECDH` 使用的数据结构是`{name:算法的名称:P-256|P-384|P-521}`
  - `AES-CTR`,`AES-CBC`,`AES-GCM`,`AES-KW`需要的数据结构`{name:算法的名称}`
  - `PBKDF2`,`HKDF` 无该属性
+ extractable: 是否允许导出该密钥
+ keyUsages: 指明哪些接口可以使用该密钥 `[encrypt,decrypt,sign,verify,deriveKey,deriveBits,wrapKey,unwrapKey]`




### encrypt
返回Promise与作为参数给出的明文、算法和密钥相对应的加密数据实现的 a。

#### 语法

``` javascript
const result = crypto.subtle.encrypt(algorithm, key, data);
```

#### 参数

