# nest 碎碎念


## 15. 如何创建动态模块


动态引入的方式需要我们手动定义一下

``` ts
@Module({})
export class BbbModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      // module是我们需要新增的内容
      module: BbbModule,
      controllers: [BbbController],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        BbbService,
      ],
      exports: [],
    };
  }
}
``` 

register 方法名约定了3种方法

+ register 用一次模块传一次配置，比如这次调用事`BbbModule.register({aaa:1})`下次就是`BbbModule.register({aaa:2})`了。
+ forRoot 配置一次模块用多次, 比如XxxModule.forRoot({}) 一次 之后一直用这个`Module` ，一般在AppModule 里 import
+ forFeature 用了forRoot 固定了整体模块，用于局部的时候，可能需要再传一些配置，比如`forRoot`指定了数据库链接信息，在用forFeature 指定某个模块访问某个数据库

+ ConfigurableModuleBuilder:

我们还可以使用`ConfigurableModuleBuilder`来创建动态模块，

```ts
import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface CccModuleOptions {
    aaa: number;
    bbb: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<CccModuleOptions>().build();


// 然后CccModule 通过 MODULE_OPTIONS_TOKEN TOKE来注入options
```

通过`setClassMethodName` 来设置`builder`的生成方式



## 微服务

项目越来越大之后，模块越来越多，代码会越来越难以维护。

并且因为代码都在一个项目里，不好扩展。比如有的业务模块想多部署几个节点就做不到，只能整体扩展。

所以就有了拆分的需求，把业务模块拆成单独的微服务

微服务与微服务之间 没必要使用http 因为会携带相应头 会增大通信开销 直接使用tcp就好




### 维护

我们维护  monorepo + Library

通过命令 再添加一个nest项目

``` 
nest g app app2

```


项目多了 公共代码如何复用

``` 
nest g lib lib1

```


### 配置中心 

系统中会有很多微服务，它们会有一些配置信息，比如环境变量、数据库连接信息等。

这些配置信息散落在各个服务中，以配置文件的形式存在。

这样你修改同样的配置需要去各个服务下改下配置文件，然后重启服务。


如果有一个服务专门用来集中管理配置信息呢？

这样每个微服务都从这里拿配置，可以统一的修改，并且配置更改后也会通知各个微服务。

这个集中管理配置信息的服务就叫配置中心。




### 注册中心

微服务之间会相互依赖，共同完成业务逻辑的处理。

如果某个微服务挂掉了，那所有依赖它的服务就都不能工作了。

为了避免这种情况，我们会通过集群部署的方式，每种微服务部署若干个节点，并且还可能动态增加一些节点。

微服务 A 依赖了微服务 B，写代码的时候 B 只有 3 个节点，但跑起来以后，某个节点挂掉了，并且还新增了几个微服务 B 的节点。

这时候微服务 A 怎么知道微服务 B 有哪些节点可用呢？


答案也是需要一个单独的服务来管理，这个服务就是注册中心：



微服务在启动的时候，向注册中心注册，销毁的时候向注册中心注销，并且定时发心跳包来汇报自己的状态。

在查找其他微服务的时候，去注册中心查一下这个服务的所有节点信息，然后再选一个来用，这个叫做`服务发现`。

