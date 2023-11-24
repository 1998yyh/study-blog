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