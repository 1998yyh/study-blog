# Notifications 

Notifications API 允许网页控制向最终用户显示系统通知。这些在顶级浏览上下文视口之外，因此即使用户切换选项卡或移动到不同的应用程序也可以显示。该 API 旨在与跨不同平台的现有通知系统兼容。

## 获取权限

在支持的平台上，显示系统通知通常涉及两件事。首先，用户要授权当前显示源显示系统通知的权限。

```javascript
Notification.requestPermission().then(function(permission) {
    ...
});
```

permission 可能是 `granted` 被授予, `denied` 被拒绝, `default` 默认 

在部分旧的版本上(Safari), 需要使用回调函数的方式获取。

```javascript
Notification.requestPermission(function(permission) {
    handlePermission(permission);
});
```

我们可以根据是否支持requestPermission来进行判断。

```javascript
function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }
    return true;
}
```

在FireFox 72中指出了只能在响应用户的手势时调用，比如点击事件。这将会是未来各家浏览器的实践方案。


## 构造方法

``` javascript
let notification = new Notification(title,options);
```

### 参数

+ title 被显示通知的标题
+ options 用来设置通知的对象。
 - dir:文本的方向。 auto(自动),ltr(从左到右),rtl(从右到左) 
 - lang:指定通知中所有的语言。
 - body:通知中额外显示的字符串
 - tag:被赋予通知的一个ID，以便在必要的时候对通知进行刷新，替换或移除。
 - icon: 一个图片的URL,将被用于显示通知的图标
 - data:	任意类型和通知相关联的数据。
 - vibrate:	通知显示时候，设备震动硬件需要的振动模式。所谓振动模式，指的是一个描述交替时间的数组，分别表示振动和不振动的毫秒数，一直交替下去。例如[200, 100, 200]表示设备振动200毫秒，然后停止100毫秒，再振动200毫秒。
 - renotify:布尔值。新通知出现的时候是否替换之前的。
 - silent:布尔值。通知出现的时候，是否要有声音。默认false, 表示无声。
 - sound:字符串。音频地址。表示通知出现要播放的声音资源。
 - noscreen:布尔值。是否不再屏幕上显示通知信息。默认false, 表示要在屏幕上显示通知内容。
 - sticky:布尔值。是否通知具有粘性，这样用户不太容易清除通知。

### prop

permission 这是一个静态属性。表示是否允许通知，值就是上面的granted, denied, 或default.


### Methods

#### Notification.requestPermission()

这是一个静态方法，作用就是让浏览器出现是否允许通知的提示
