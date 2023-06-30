# git 子模块处理方式

工作中的项目需要包含并使用另一个项目。 也许是第三方库，或者你独立开发的，用于多个父项目的库。 现在问题来了：你想要把它们当做两个独立的项目，同时又想在一个项目中使用另一个。

## submodule

### 添加

使用 `git submodule add <repo url> <local path>` 添加, 在这之后, 跟目录下会产生一个`.gitmodule`文件夹,文件结构如下

``` gitconfig
[submodule "repoName"]
  path = repoName
  url = https://repoName.git
```

`.gitmodule`  该配置文件保存了项目 URL 与已经拉取的本地目录之间的映射

``` js
[submodule "bjxy-xcx-common"]
	path = bjxy-xcx-common
	url = https://git.yingzhongtong.com/bj_fe/miniprogram/bjxy-xcx-components/bjxy-xcx-common.git

```

### 初始化

如果我们直接使用 `git clone ` 克隆带有submodule的项目 时, 默认会包含子模块 但是子模块没有任何文件 我们需要执行

`git submodule init ` 来初始化本地文件, 

`git submodule update` 则从该项目中抓取所有数据并检出父项目中列出的合适的提交。

以上两步可以合为一步` git submodule update --init` 

如果存在嵌套模块 `git submodule update --init --recursive`

或者我们可以在clone的时候 使用`git clone --recurse-submodules <repo url>` 来进行初始化


### 更新
<!-- 问题在于 怎么感知有子模块更新 -->
当子模块有更新时我们需要 我们需要进入到目录里面 运行git fetch / git merge  合并上游分支来更新本地代码

然后退回到主项目的时候 会发现有变动 


``` js
//  ### 不同分支
Submodule bjxy-xcx-common 175334b..5b8f789:
```

我们如果在此时提交，那么你会将子模块锁定为其他人更新时的新代码。

如果不想在子目录中手动抓去与合并 那么还有一种更容易的方式 ` 运行git submodule update --remote` 


### update --remote

此命令默认会假定你想要更新并检出子模块仓库的 master 分支。 不过你也可以设置为想要的其他分支。

比如我们想跟踪`xcx-common`的 `feature-multiCard-1111509` 分支 我们可以在 `.gitmodule` 里设置 这样其他人也可以跟踪他

也可以只在本地的`.git/config` 文件中设置 

``` js
git config <-f .gitmodules> submodule.DbConnector.branch stable
```

如果不使用 -f .gitmodules 的话 只会为你本地设置 如果使用了 则会在submodule 中设置


### 子模块上工作


到目前为止，当我们运行 git submodule update 从子模块仓库中抓取修改时， Git 将会获得这些改动并更新子目录中的文件，但是会将子仓库留在一个称作“游离的 HEAD”的状态。这意味着没有本地工作分支（例如 “master” ）跟踪改动。 如果没有工作分支跟踪更改，也就意味着即便你将更改提交到了子模块，这些更改也很可能会在下次运行 git submodule update 时丢失。如果你想要在子模块中跟踪这些修改，还需要一些额外的步骤


为了将子模块设置得更容易进入并修改，你需要做两件事。

 首先，进入每个子模块并检出其相应的工作分支。 接着，若你做了更改就需要告诉 Git 它该做什么
 
 然后运行 git submodule update --remote 来从上游拉取新工作。 你可以选择将它们合并到你的本地工作中，也可以尝试将你的工作变基到新的更改上。


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


### 删除submodule

1. git rm --cached 'submodule_name'

2. rm -rf 'submodule_name'

3. 修改.gitmodules 删除对应submodule

4. 删除 .git/config 的 submodule

5. 删除 .git/modules/'submodule_name'


### 变更托管平台
```
# 将新的 URL 复制到本地配置中
$ git submodule sync --recursive
# 从新 URL 更新子模块
$ git submodule update --init --recursive
```

## subtree

```js
git subtree add   --prefix=<prefix> <commit>
git subtree add   --prefix=<prefix> <repository> <ref>
git subtree pull  --prefix=<prefix> <repository> <ref>
git subtree push  --prefix=<prefix> <repository> <ref>
git subtree merge --prefix=<prefix> <commit>
git subtree split --prefix=<prefix> [OPTIONS] [<commit>]
```

我们用subtree 的命令添加子项目 

``` js
git subtree add --prefix=foo git地址 <分支> <ref>
```

解释：

--squash 是将 subtree 的改动合并到一个 commit，不用拉取子项目完整的历史纪录

这里 --prefix 后面的 = 也可以使用空格，注意这里的 foo 就是项目克隆后在本地的目录名

命令中的 master 指的是 subtree 项目的分支名

可以使用 git status 和 git log 查看提交

使用 git subtree 添加项目后，subtree 就将原来的项目作为这个主项目的一个普通文件夹来看待了，对于父级项目而言完全无缝透明。上面
的命令就是将 foo 这个项目添加到主项目中 foo 文件夹下。

日常更新的时候，正常的提交代码，如果更改了 foo 目录中的内容也正常的提交即可。



### 更新子项目

``` js
git subtree pull --prefix=foo git地址 <分支>
```


### 推送子项目

``` js
git subtree push --prefix=foo git地址<分支>
```


### 简化

我们已经知道了git subtree 的命令的基本用法，但是上述几个命令还是显得有点复杂，特别是子仓库的源仓库地址，特别不方便记忆。
这里我们把子仓库的地址作为一个remote，方便记忆：

git remote add -f libpng https://github.com/test/libpng.git