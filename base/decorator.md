# decorator

语义化，可以非常清晰看出装饰器为对象添加了什么功能
装饰器不改变原对象的结构，原对象代码简洁、易维护。


## 类的装饰

```javascript
function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}
```

## 方法的装饰

```javascript
function log(target, name, descriptor) {
  var oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling ${name} with`, arguments);
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}
```


## 装饰器应用

### CatchError

正常写await异步的时候，错误捕获需要通过try...catch来实现
```javascript
export default class TestForm extends Vue {

  async submitForm() {
    try {
      await this.handleTest();
    } catch(error) {
      console.log(error);
    }
  }
}
```

我们定义一个装饰器

```javascript
export function CatchError() {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    const fn = target[name];
    descriptor.value = async function (...args: any[]) {
      try {
        await fn.call(this, ...args);
      } catch (error) {
        console.log('error', error);
      }
    };
    return descriptor;
  };
}

```

然后在对应的函数使用

```javascript
import { CatchError } from "module";


export default class TestForm extends Vue {

@CatchError()
async submitForm() {
    await this.handleTest();
  }
}
```


### Validate

我们在提交表单的时候需要验证数据

```javascript
submitForm() {
  this.$refs['formName'].validate(async (valid) => {
    if (valid) {
      try {
        // 调用接口
        await this.handleTest();
        this.$message.success('Submit Successfully!')
      } catch(error) {
        console.log(error);
      }
    } else {
      console.log('error submit!!');
      return false;
    }
  });
},

```


封装成一个装饰器
```javascript
function Validate(formName){
  return function(target,name,descriptor){
    const fn = target[name]
    descriptor.value = function(...args){
      this.$refs[formName].validate((valid)=>{
        if(valid){
          fn.apply(this,args)
        }else{
          return false
        }
      })
    }
  }
} 

```
