# 大文件转MD5 阻塞DOM 

盆友遇到个问题，大文件转MD5的时候阻塞DOM。

先模拟一下该场景

```html
<button onclick="console.log(1)">BUTTON</button>
<input type="file">
<!-- 转MD5的库 -->
<script src="https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.js"></script>
```

```javascript
document.querySelector('input').addEventListener('change', e => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    const md5 = new SparkMD5();
    fileReader.readAsBinaryString(file);
    fileReader.onload = e => {
        md5.appendBinary(e.target.result);
    }
})
```

当我们上传出发了input事件后，我们去点击 `BUTTON` 按钮 控制台并没有立即输出 过了一段时间后才输出

## 切片

```javascript
 document.querySelector('input').addEventListener('change', e => {
     console.time()
     const file = e.target.files[0];
     // 按份数切 10 份
     const sliceLength = 10;
     // 每片大小
     const chunkSize = Math.ceil(file.size / sliceLength)
     const fileReader = new FileReader();
     const md5 = new SparkMD5();
     let index = 0;
     const loadFile = () => {
         // 逐个处理
         const slice = file.slice(index, index + chunkSize);
         fileReader.readAsBinaryString(slice);
     }

     loadFile();
     fileReader.onload = e => {
         md5.appendBinary(e.target.result);
         // 判断退出条件
         if (index < file.size) {
             index += chunkSize;
             loadFile()
         } else {
             // 结束
             console.timeEnd();
         }
     }
 })
```

## 多worker处理 md5编码

我们需要一个worker.js

```javascript
// workerjs 的引入方式 引入sparkMD5
importScripts('https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.js');
const md5 = new SparkMD5();
this.addEventListener('message', function(e) {
    md5.appendBinary(e.data);
    this.postMessage(md5.end());
    this.close();
}, false);
```

主线程

```javascript
document.querySelector('input').addEventListener('change', e => {
    const file = e.target.files[0];
    const sliceLength = 10;
    const workers = [];
    const result = new Array()
    const chunkSize = Math.ceil(file.size / sliceLength)
    for (let i = 0; i < sliceLength; i++) {
        const worker = new Worker('work.js?' + i)
        const fileReader = new FileReader();

        const slice = file.slice(i, i + chunkSize);
        fileReader.onload = e => {
            worker.postMessage(e.target.result)
        }
        fileReader.readAsBinaryString(slice);
        worker.onmessage = ((e) => {
            result[i] = e.data
            if (result.length === sliceLength) {
                // 结束
            }
        })
    }
})
```

## 性能比较

测试设备 Apple M1 文件大小1G

|  方式   | 是否卡顿  | 耗时 |
|  ----  | ----  | ---- |
| 普通方式  | 是 | 2000ms |
| 切片  | 否 | 4000ms |
| workers  | 否 | 3000ms |
