# git 子模块处理方式


## submodule

### 添加

使用 `git submodule add <repo url> <local path>` 添加, 在这之后, 跟目录下会产生一个`.gitmodule`文件夹,文件结构如下

``` gitconfig
[submodule "repoName"]
  path = repoName
  url = https://repoName.git
```

`.gitmodule` 文件中标记了每一个 `submodule` 的 `path` 与 `url`.


### 不同分支

创建的时候经常需要不同的分支来处理,有三种方式来处理

1. 创建模块的时候通过 -b 来指定分支

```
git submodule add -b master <repo url>
```

2. 在`.gitsubmodule`文件中设置分支

```
git config -f .gitmodules submodule.DbConnector.branch stable
```

其中 DbConnector 对应上面内容的 repoName , stable 是分支名


3. 主目录中进入子模块 通过`git checkout` 切换分支


### 初始化

当我们clone 一个带submodule的项目时候 可以使用`git clone --recurse-submodules <repo url>` 来进行初始化,

或者

clone


2. 当项目使用了submodule 第一次拉取代码的时候


## subtree


