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


### 配置中心 注册中心