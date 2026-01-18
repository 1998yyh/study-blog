---
name: /git-commit-push
id: git-commit-push
category: Git
description: 自动提交代码到 Git 仓库，包括暂存、分析变更、生成提交信息、处理远程更新和推送。
---

<!-- GIT:START -->

**规则**

- 始终使用中文简体进行交互
- 在提交前分析代码变更，生成有意义的提交信息
- 如果远程有更新，优先使用 `git pull --rebase` 保持提交历史整洁
- 遇到冲突时立即停止，提示用户手动处理
- 提交信息应简洁明了，描述主要变更内容

**步骤**

1. **暂存所有变更**：

   - 执行 `git add .` 将所有变更添加到暂存区
   - 如果命令失败，停止并报告错误

2. **检查暂存区状态**：

   - 执行 `git status` 查看暂存的文件列表
   - 执行 `git diff --cached --stat` 查看变更统计
   - 执行 `git diff --cached` 查看具体变更内容（如果变更较少，可以查看完整 diff；如果变更较多，只查看关键文件）

3. **分析变更并生成提交信息**：

   - 根据暂存的文件和变更内容，分析本次提交的主要目的
   - **识别变更类型（type）**，必须从以下类型中选择：
     - `feat`: 新特性、新功能
     - `fix`: 修改bug
     - `refactor`: 代码重构
     - `perf`: 优化相关，比如提升性能、体验
     - `style`: 代码格式修改（不是 CSS 修改）
     - `docs`: 文档修改
     - `test`: 测试用例修改
     - `build`: 编译相关的修改，例如发布版本、对项目构建或者依赖的改动
     - `ci`: 持续集成修改
     - `chore`: 其他修改，比如改变构建流程、或者增加依赖库、工具等
     - `revert`: 回滚到上一个版本
   - **识别变更范围（scope）**（可选）：
     - 根据文件路径识别模块，例如：
       - `src/packageRevolving/` → `revolving`
       - `src/api/` → `api`
       - `src/store/` → `store`
       - `src/components/` → `components`
       - `.cursor/commands/` → `commands`
       - `task.md` 或技术方案文档 → `docs`
     - 如果变更涉及多个模块，选择最主要的模块或省略 scope
   - **生成主题（subject）**：
     - 一句话描述此次提交的主要内容，使用中文
     - 简洁明了，不超过 50 字
     - 不要以句号结尾
   - **生成符合 commitlint 规范的提交信息**：
     - 格式：`<type>(scope?): <subject>`
     - 第一行（header）：`<type>(scope): <subject>`，总长度不超过 72 字符
     - 空行
     - 详细描述（可选）：列出主要变更点，使用中文，每行以 `- ` 开头
   - **提交信息格式示例**：

     ```
     fix(revolving): 删除 applyContractList 相关逻辑

     - 删除 applyContractList 属性定义和初始化逻辑
     - 更新合同获取逻辑，仅从 before_revolve_apply_and_reserve_loan 接口获取
     - 更新技术方案文档，删除相关接口调用说明
     ```

   - **type 识别规则**：
     - 新增文件或功能 → `feat`
     - 修复错误或bug → `fix`
     - 重构代码结构 → `refactor`
     - 性能优化 → `perf`
     - 代码格式调整（如缩进、换行） → `style`
     - 文档更新（.md、注释） → `docs`
     - 测试相关 → `test`
     - 构建配置变更 → `build`
     - CI/CD 配置变更 → `ci`
     - 工具、依赖、配置等杂项 → `chore`
     - 回滚提交 → `revert`

4. **检查是否有未提交的变更**：

   - 如果暂存区为空（没有变更），提示用户并停止流程
   - 如果有变更，继续下一步

5. **检查远程仓库状态**：

   - 执行 `git fetch` 获取远程最新状态
   - 执行 `git status` 检查本地分支与远程分支的关系
   - 如果显示 "Your branch is behind"，说明远程有更新

6. **处理远程更新**（如果需要）：

   - 如果远程有更新：
     - 优先尝试 `git pull --rebase origin <branch-name>`（使用当前分支名）
     - 如果 rebase 失败或用户明确要求使用 merge，则使用 `git pull origin <branch-name>`
     - 检查命令输出，如果出现冲突：
       - 立即停止流程
       - 显示冲突文件列表
       - 提示用户：**检测到 Git 冲突，请手动解决冲突后重新执行此命令**
       - 提供冲突处理建议：运行 `git status` 查看冲突文件，解决后执行 `git add .` 和 `git rebase --continue`（或 `git commit`）
       - 不继续执行后续步骤

7. **用户确认提交信息**：

   - 显示生成的提交信息（格式化的，易于阅读）：
     ```
     提交信息预览：
     ┌─────────────────────────────────────────────────────────────┐
     │ <type>(scope): <subject>                                    │
     │                                                             │
     │ - 变更点1                                                   │
     │ - 变更点2                                                   │
     │ - 变更点3                                                   │
     └─────────────────────────────────────────────────────────────┘
     ```
   - 显示变更统计信息（文件数量、增删行数等）
   - **等待用户确认**：
     - 提示用户："请确认提交信息是否正确，输入 'y' 或 'yes' 确认提交，输入 'n' 或 'no' 取消提交"
     - 如果用户确认（y/yes）：
       - 继续执行步骤8
     - 如果用户拒绝（n/no）：
       - 停止流程
       - 提示用户："已取消提交，您可以手动修改提交信息后重新执行此命令"
       - 不执行后续步骤
     - 如果用户输入其他内容：
       - 提示："请输入 'y' 或 'n' 来确认或取消提交"
       - 重新等待用户输入

8. **执行提交**（仅在用户确认后执行）：

   - 使用生成的提交信息执行 `git commit -m "<header>" -m "<详细描述>"`（如果有详细描述）
   - 或者使用 `git commit -m "<完整提交信息>"`（包含 header 和详细描述，用空行分隔）
   - 如果提交失败：
     - 检查是否是 commitlint 验证失败
     - 如果是格式问题，显示错误信息并建议修正格式
     - 停止流程，等待用户确认或修正
   - 显示提交成功的确认信息

9. **推送到远程仓库**：

   - 获取当前分支名（使用 `git branch --show-current` 或 `git rev-parse --abbrev-ref HEAD`）
   - 执行 `git push origin <branch-name>`
   - 如果推送失败：
     - 检查错误信息
     - 如果是权限问题，提示用户检查权限
     - 如果是远程有更新，回到步骤6重新处理
     - 其他错误，报告具体错误信息

10. **完成确认**：

- 显示提交和推送成功的确认信息
- 显示提交的 commit hash 和分支名

**注意事项**

- **重要**：提交前必须等待用户手动确认，不要自动执行提交
- 提交信息必须符合 commitlint 规范：`<type>(scope?): <subject>`
- type 必须从允许的类型列表中选择（feat, fix, refactor, perf, style, docs, test, build, ci, chore, revert）
- header 总长度不超过 72 字符
- subject 使用中文，简洁明了，不超过 50 字，不以句号结尾
- 如果用户明确指定了提交信息，优先使用用户指定的信息，但需要验证是否符合规范
- 如果用户指定的提交信息不符合规范，提示用户并建议修正格式
- 如果变更涉及多个不相关的功能，建议用户分别提交
- 推送前必须确保本地代码与远程同步（无冲突）
- 遇到任何错误都应停止流程并报告，不要自动重试
- 用户取消提交后，流程应立即停止，不执行任何后续操作

**错误处理**

- `git add` 失败：报告错误并停止
- 暂存区为空：提示用户没有变更需要提交
- `git pull/rebase` 冲突：停止流程，提示用户手动处理
- `git commit` 失败：报告错误并停止
- `git push` 失败：根据错误类型给出相应提示

**示例流程**

```
1. git add .
2. git status
3. git diff --cached --stat
4. 分析变更：
   - 类型：fix（删除未使用的代码）
   - 范围：revolving（主要变更在 packageRevolving 目录）
   - 主题：删除 applyContractList 相关逻辑
   - 生成：fix(revolving): 删除 applyContractList 相关逻辑
5. git fetch
6. git status（检查远程更新）
7. git pull --rebase origin main（如果有更新）
8. 显示提交信息预览，等待用户确认
   ┌─────────────────────────────────────────────────────────────┐
   │ fix(revolving): 删除 applyContractList 相关逻辑             │
   │                                                             │
   │ - 删除 applyContractList 属性定义和初始化逻辑               │
   │ - 更新合同获取逻辑，仅从接口获取                            │
   │ - 更新技术方案文档                                          │
   └─────────────────────────────────────────────────────────────┘
   请确认提交信息是否正确，输入 'y' 确认提交，输入 'n' 取消提交: y
9. git commit -m "fix(revolving): 删除 applyContractList 相关逻辑" -m "- 删除 applyContractList 属性定义和初始化逻辑\n- 更新合同获取逻辑，仅从接口获取\n- 更新技术方案文档"
10. git push origin main
```

**提交信息格式验证**

- 格式：`<type>(scope?): <subject>`
- 示例：
  - `feat(revolving): 新增循环产品一键进件要款功能`
  - `fix(api): 修复 submitApply 接口参数错误`
  - `refactor(store): 重构 repayPlan 数据管理逻辑`
  - `docs: 更新技术方案文档`
  - `chore: 更新依赖版本`
  <!-- GIT:END -->
