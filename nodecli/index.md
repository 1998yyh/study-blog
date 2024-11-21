#  node cli



## about publish

发布相关的 


1. 在package.json中我们可以设置


``` json
{
  // 不发布这个库到仓库
  "private": true,
  // 表示可以公开访问的库
  "publishConfig": {
    "access": "public"
  },
}
```


2. `pnpm -w` 可以在分包中安装主包内的依赖
3. `pnpm --filter cli add @guang-cli/create --workspace` 

--filter 指定在 cli 包下执行 add 命令

加上 --workspace 就是从本地查找


