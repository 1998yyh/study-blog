# 2024 css总结


## 新用户

## 新技巧

### 1. lh

lh 是 一个单位，代表和行高一致的高度。

``` css
p {
	line-height: 1.2;
  height: 1lh;
}
```


🤔 后续如果`@container` 可以支持查询高度，可以用作处理 

检测某一个container里面的文本的行数，从而根据文本行数给包含这个container的组件渲染出不同的layout呢