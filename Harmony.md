# HarmonyOS 

官网地址: https://developer.harmonyos.com/

起步：掠过



## 工程目录

1. AppScope 中存放应用所需要的资源文件，
2. entry 是应用的主模块，存放HarmonyOs应用的代码、资源等。
3. oh_modules是工程的依赖包，存放工程依赖的源文件
4. build-profile.json5是工程级的配置信息，包括签名，产品配置等。
5. hvigorfile.ts是工程级编译构建任务脚本，hvigor是基于任务管理机制实现的一款全新的自动化构建工具，主要提供任务注册编排，工程模型管理、配置管理等核心能力。
6. oh-package.json5是工程级依赖配置文件，用于记录引入包的配置信息。



#### entry 文件夹

entry>src目录中主要包含总的main文件夹，单元测试目录ohosTest，以及模块级的配置文件。

1. main文件夹中，ets文件夹用于存放ets代码，resources文件存放模块内的多媒体及布局文件等，module.json5文件为模块的配置文件。
2. ohosTest是单元测试目录。
3. build-profile.json5是模块级配置信息，包括编译构建配置项。
4. hvigorfile.ts文件是模块级构建脚本。
5. oh-package.json5是模块级依赖配置信息文件。



#### UIAbility 

当用户浏览、切换和返回到对应应用的时候，应用中的UIAbility实例会在其生命周期的不同状态之间转换。

UIAbility类提供了很多回调，通过这些回调可以知晓当前UIAbility的某个状态已经发生改变：例如UIAbility的创建和销毁，或者UIAbility发生了前后台的状态切换。


UIAbility的生命周期包括`Create`、`Foreground`、`Background`、`Destroy`四个状态，`WindowStageCreate`和`WindowStageDestroy`为窗口管理器（WindowStage）在UIAbility中管理UI界面功能的两个生命周期回调，从而实现UIAbility与窗口之间的弱耦合。


Create状态，在UIAbility实例创建时触发，系统会调用onCreate回调。可以在onCreate回调中进行相关初始化操作。

例如用户打开电池管理应用，在应用加载过程中，在UI页面可见之前，可以在onCreate回调中读取当前系统的电量情况，用于后续的UI页面展示。


``` ts
import UIAbility from '@ohos.app.ability.UIAbility';
import hilog from '@ohos.hilog';
import window from '@ohos.window';

export default class EntryAbility extends UIAbility {
  onCreate(want, launchParam) {
     // 应用初始化
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    // 设置UI页面加载
    // 设置WindowStage的事件订阅（获焦/失焦、可见/不可见）
  }

  onForeground() {
    // 在UIAbility的UI页面可见之前，即UIAbility切换至前台时触发。
    // 可以在onForeground回调中申请系统需要的资源，或者重新申请在onBackground中释放的资源。
    // 例如用户打开地图应用查看当前地理位置的时候，假设地图应用已获得用户的定位权限授权。在UI页面显示之前，可以在onForeground回调中打开定位功能，从而获取到当前的位置信息。
  }

  onBackground() {
    // 在UIAbility的UI页面完全不可见之后，即UIAbility切换至后台时候触发。
    // 可以在onBackground回调中释放UI页面不可见时无用的资源，或者在此回调中执行较为耗时的操作，例如状态保存等。
    // 当地图应用切换到后台状态，可以在onBackground回调中停止定位功能，以节省系统的资源消耗。
  }

  onWindowStageDestroy() {
    // Main window is destroyed, release UI related resources
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
  }



  onDestroy() {
  // 系统资源的释放、数据的保存等 
  }
}


```


##### UIAbility的启动模式

对于浏览器或者新闻等应用，用户在打开该应用，并浏览访问相关内容后，回到桌面，再次打开该应用，显示的仍然是用户当前访问的界面。

对于应用的分屏操作，用户希望使用两个不同应用（例如备忘录应用和图库应用）之间进行分屏，也希望能使用同一个应用（例如备忘录应用自身）进行分屏。

对于文档应用，用户从文档应用中打开一个文档内容，回到文档应用，继续打开同一个文档，希望打开的还是同一个文档内容。

基于以上场景的考虑，UIAbility当前支持singleton（单实例模式）、multiton（多实例模式）和specified（指定实例模式）3种启动模式。