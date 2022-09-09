# 处理多个继承的typescript

原文地址: <https://blog.bitsrc.io/multiple-inheritance-or-typescript-mixins-10076c4f136a>

## 问题 

如果我们想创建不同的 UI 组件，如“按钮”、“输入”、“操作列表项”和“菜单项”，该怎么办？所有这些组件都有不同的行为和外观。但是，它们都可以被禁用，可以有一个基色，以及最后两个通用的基类。我们是优秀的开发人员，希望编写干净、干燥的代码。所以，让我们看看我们能在这种情况下做些什么。


## 扩展

比方说，我们有三个提供三种方法的类，我们想要构造第四个类来公开所有这三种方法。

``` ts

class A {
  a(): void {
    // some logic
  }
}

class B {
  b(): void {
    // some logic
  }
}

class C {
  c(): void {
    // some logic
  }
}
```

最合乎逻辑的的应该是

``` ts
class extends A,B,C{}
```

但是他不起作用 typescript 只允许扩展一个基类, 因此 我们需要将他们逐一扩展

``` js
class A {
  a(): void {
    // some logic
  }
}

class B extends A {
  b(): void {
    // some logic
  }
}

class C extends B {
  c(): void {
    // some logic
  }
}

class D extends C {}

const d = new D();
d.a();
```

但是如果在某些结果类中我们不需要方法怎么办b？我们仍然会拥有它，因为类C扩展了类B，没有它就没有a来自类的方法A。当然，我们可以创建类组合AC，比如可以扩展A和不扩展B的类等等，但是这些代码很快就会变得不可读和不可维护。

## 混合

首先我们需要定义类和实现的类型`constructor`和接口 A C

``` ts
type Constructor<T = any> = new (...args: any[]) => T;

interface HasMethodA {
  propA: number;
  a(): void;
}

interface HasMethodC {
  c(): void;
}
```

现在我们可以创建一个mixin函数 a

``` ts
function mixinA<T extends Constructor>(base:T):Constructor(HasMethodA) & T {
 return class extends base {
    protected _propA: number;

    get propA(): number {
      return this._propA;
    }

    constructor(...args: any[]) {
      super(...args);
    }

    a(): void {
      console.log('Method "a"');
      this._propA = 42;
    }
  };
}
```

该函数mixinA需要一个匿名类作为参数，并返回一个类表达式模式，该模式扩展了我们作为参数提供的类。在这个表达式模式中，我们定义了我们希望类A拥有的所有属性和方法。


``` ts
function mixinC<T extends Constructor>(base: T): Constructor<HasMethodC> & T {
  return class extends base {
    constructor(...args: any[]) {
      super(...args);
    }

    c(): void {
      console.log('Method "c"');
    }
  };
}


const Dbase = mixinC(mixinA(class {}));

class D extends Dbase {}

const d = new D();
d.a();
d.c();
console.log(d.propA);
```