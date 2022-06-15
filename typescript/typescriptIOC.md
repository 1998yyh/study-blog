# IOC

IoC全称Inversion of Control，直译为控制反转

IOC 是一种设计模式, 主要是用来解决软件工程里的耦合问题。

所谓耦合指的是类之间, 或模块之间的依赖, 如果两个或以上的类或模块紧密耦合, 意味着只要改其中之一, 就会影响另一个类, 也意味着我们要改另一个的代码, 不然会出现错误。

强耦合, 某方面来说, 也可以说是我们日常所说 "屎山代码"的代名词, 当我们改了一段代码, 要不就某个地方报错, 甚至可能整个项目无法运行。所以说, 解耦合, 是软件开发经常要处理的问题。

## 之前的问题

假设有一个在线书店, 通过BookService获取书籍:

```ts
 class BookService {
    private HikariConfig config = new HikariConfig();
    private DataSource dataSource = new HikariDataSource(config);

    public Book getBook(long bookId) {
        try (Connection conn = dataSource.getConnection()) {
            ...
            return book;
        }
    }
}
```


为了获取书籍， `BookService` 持有一个 `DataSource` (数据库)，为了实例化一个 `dataSource` 不得不实例化一个 `config` 。

然后还有一个 `UserService` 获取用户

```ts
 class UserService {
    private HikariConfig config = new HikariConfig();
    private DataSource dataSource = new HikariDataSource(config);

    public User getUser(long userId) {
        try (Connection conn = dataSource.getConnection()) {
            ...
            return user;
        }
    }
}
```

因为 `UserService` 也需要访问数据库，因此，我们不得不也实例化一个 `dataSource` , 同时例化一个 `HikariConfig` 。

在处理用户购买的`CartServlet`中，我们需要实例化`UserService`和`BookService`：

```ts
 class CartServlet extends HttpServlet {
    private BookService bookService = new BookService();
    private UserService userService = new UserService();

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        long currentUserId = getFromCookie(req);
        User currentUser = userService.getUser(currentUserId);
        Book book = bookService.getBook(req.getParameter("bookId"));
        cartService.addToCart(currentUser, book);
        ...
    }
}
```

类似的，在购买历史HistoryServlet中，也需要实例化UserService和BookService：

```ts
 class HistoryServlet extends HttpServlet {
    private BookService bookService = new BookService();
    private UserService userService = new UserService();
}
```

上述每个组件都采用了一种简单的通过`new`创建实例并持有的方式。仔细观察，会发现以下缺点：
1. 实例化一个组件其实很难，例如，`BookService`和`UserService`要创建`HikariDataSource`，实际上需要读取配置，才能先实例化`HikariConfig`，再实例化`HikariDataSource`。
2. 没有必要让`BookService`和`UserService`分别创建`DataSource`实例，完全可以共享同一个`DataSource`，但谁负责创建`DataSource`，谁负责获取其他组件已经创建的`DataSource`，不好处理。类似的，`CartServlet`和`HistoryServlet`也应当共享`BookService`实例和`UserService`实例，但也不好处理。
3. 很多组件需要销毁以便释放资源，例如`DataSource`，但如果该组件被多个组件共享，如何确保它的使用方都已经全部被销毁？
4. 随着更多的组件被引入，例如，书籍评论，需要共享的组件写起来会更困难，这些组件的依赖关系会越来越复杂。
5. 测试某个组件，例如`BookService`，是复杂的，因为必须要在真实的数据库环境下执行。

从上面的例子可以看出，如果一个系统有大量的组件，其生命周期和相互之间的依赖关系如果由组件自身来维护，不但大大增加了系统的复杂度，而且会导致组件之间极为紧密的耦合，继而给测试和维护带来了极大的困难。

因此，核心问题是：

1. 谁负责创建组件？
2. 谁负责根据依赖关系组装组件？
3. 销毁时，如何按依赖顺序正确销毁？

传统的应用程序中，控制权在程序本身，程序的控制流程完全由开发者控制，例如：

`CartServlet`创建了`BookService`，在创建`BookService`的过程中，又创建了`DataSource`组件。这种模式的缺点是，一个组件如果要使用另一个组件，必须先知道如何正确地创建它。

在IoC模式下，控制权发生了反转，即从应用程序转移到了IoC容器，所有组件不再由应用程序自己创建和配置，而是由IoC容器负责，这样，应用程序只需要直接使用已经创建好并且配置好的组件。为了能让组件在IoC容器中被“装配”出来，需要某种“注入”机制，例如，`BookService`自己并不会创建`DataSource`，而是等待外部通过`setDataSource()`方法来注入一个`DataSource`：

```ts
public class BookService {
    private DataSource dataSource;

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }
}
```

不直接new一个DataSource，而是注入一个DataSource，这个小小的改动虽然简单，却带来了一系列好处：

1. BookService不再关心如何创建DataSource，因此，不必编写读取数据库配置之类的代码；
2. DataSource实例被注入到BookService，同样也可以注入到UserService，因此，共享一个组件非常简单；
3. 测试BookService更容易，因为注入的是DataSource，可以使用内存数据库，而不是真实的MySQL配置。

它解决了一个最主要的问题：将组件的创建+配置与组件的使用相分离，并且，由IoC容器负责管理组件的生命周期。


## 反射

在面向对象语言中, 如java, 反射可以在运行期间, 做到类型, 接口, 属性和方法的检查, 不需要知道在编译期间知道接口, 属性和方法的名称。 它也可以实例化对象, 和调用方法。

如果在其他OOP语言, 会经常使用反射, IOC, ORM等就是基于反射实现的。但在js/ts里, 很少会直接使用反射 (Reflect)的api, 为什么? 

我的答案是因为js是一门动态语言, 它的对象操作就像是操作哈希表 (事实上, 在v8中, 对象就是类似哈希表的结构), 在对象里, 属性和方法的赋值增删改没什么太大区别, 就是键值对 (也因此在js中很少用Map这个数据结构, 因为对象已经能实现它的功能), 键值对结构即使在静态语言中, 本身就可以做到动态操作。

## 装饰器

装饰器是一个在其他常见的oop语言 (如 java, C#)中一个烂大街的特性, 在ioc框架中大量使用, 但在js中依然是实验性质的存在 (所以我在文章一开始说一般中小企前端工程师没必要看, 因为这特性在生产环境用不上)。装饰器是什么? 看代码是最容易理解:

```ts
@sealed
class BugReport {
  type = "report";
  title: string;
 
  constructor(t: string) {
    this.title = t;
  }
}
```

就是在代码加了一些装饰器, 然后可以利用反射对加上注解的类, 属性和方法做一些操作

```
npm install reflect-metadata
```

Reflect Metadata 是ES7 的一个提案，它主要用来在声明的时候添加和读取元数据。

```ts
import 'reflect-metadata';

function classDecorator(): ClassDecorator {
  return target => {
    // 在类上定义元数据，key 为 `classMetaData`，value 为 `a`
    Reflect.defineMetadata('classMetaData', 'a', target);
  };
}

function methodDecorator(): MethodDecorator {
  return (target, key, descriptor) => {
    // 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `b`
    Reflect.defineMetadata('methodMetaData', 'b', target, key);
  };
}

@classDecorator()
class SomeClass {
  @methodDecorator()
  someMethod() {}
}

console.log(Reflect.getMetadata('classMetaData', SomeClass)); // 'a'
console.log(Reflect.getMetadata('methodMetaData', new SomeClass(), 'someMethod')); // 'b'

```

可以直接用`Reflect.metadata`作为装饰器, 然后利用`Reflect.getMetadata`就可以获取相应的值。

也可以自己写一个装饰器


``` ts
import 'reflect-metadata';

function classDecorator(): ClassDecorator {
  return target => {
    // 在类上定义元数据，key 为 `classMetaData`，value 为 `a`
    Reflect.defineMetadata('classMetaData', 'a', target);
  };
}

function methodDecorator(): MethodDecorator {
  return (target, key, descriptor) => {
    // 在类的原型属性 'someMethod' 上定义元数据，key 为 `methodMetaData`，value 为 `b`
    Reflect.defineMetadata('methodMetaData', 'b', target, key);
  };
}

@classDecorator()
class SomeClass {
  @methodDecorator()
  someMethod() {}
}

console.log(Reflect.getMetadata('classMetaData', SomeClass)); // 'a'
console.log(Reflect.getMetadata('methodMetaData', new SomeClass(), 'someMethod')); // 'b'
```




## Controller 与 Get 的 实现

如果你在使用 TypeScript 开发 Node 应用，相信你对 Controller、Get、POST 这些 Decorator，并不陌生：

``` ts
@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod() {
    return 'hello world';
  }

  @Post('/b')
  somePostMethod() {}
}
```


这些 Decorator 也是基于 Reflect Metadata 实现，这次，我们将 metadataKey 定义在 descriptor 的 value 上：

``` ts
const METHOD_METADATA = 'method'；
const PATH_METADATA = 'path'；

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
  }
}

const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
  }
}

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');
```

接着，创建一个函数，映射出 route：

``` ts
function mapRoute(instance: Object) {
  const prototype = Object.getPrototypeOf(instance);

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype)
                              .filter(item => !isConstructor(item) && isFunction(prototype[item]))；
  return methodsNames.map(methodName => {
    const fn = prototype[methodName];

    // 取出定义的 metadata
    const route = Reflect.getMetadata(PATH_METADATA, fn);
    const method = Reflect.getMetadata(METHOD_METADATA, fn)；
    return {
      route,
      method,
      fn,
      methodName
    }
  })
};
```


因此我们可以得到一些信息

``` ts
Reflect.getMetadata(PATH_METADATA, SomeClass); // '/test'

mapRoute(new SomeClass());

/**
 * [{
 *    route: '/a',
 *    method: 'GET',
 *    fn: someGetMethod() { ... },
 *    methodName: 'someGetMethod'
 *  },{
 *    route: '/b',
 *    method: 'POST',
 *    fn: somePostMethod() { ... },
 *    methodName: 'somePostMethod'
 * }]
 *
 */
```