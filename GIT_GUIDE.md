# Git 仓库源配置与提交指南

本文档记录了当前项目的远程仓库配置，以及如何向不同仓库提交代码的操作指南。

## 1. 当前远程仓库配置 (Remotes)

本项目配置了三个远程仓库源：

| 仓库名称 | 说明 | 仓库地址 (URL) | 用途 |
| :--- | :--- | :--- | :--- |
| **origin** | **个人仓库** | `git@github.com:chen-rong1/infographic-pro.git` | 主要开发分支，日常代码提交和保存。 |
| **upstream** | **官方仓库** | `https://github.com/antvis/Infographic.git` | 上游官方源，用于拉取官方最新更新 (fetch only)。 |
| **company** | **公司仓库** | `https://github.com/husky-dot/hengyi-Infographic.git` | 公司内部源，用于同步公司业务代码。 |

### 查看当前配置
随时可以使用以下命令查看当前的远程仓库状态：
```bash
git remote -v
```

---

## 2. 代码提交指南

### 场景一：提交到自己的个人仓库 (origin)
这是最常用的操作，用于保存您的日常开发进度。

```bash
# 1. 添加修改到暂存区
git add .

# 2. 提交修改 (附带说明信息)
git commit -m "您的修改说明"

# 3. 推送到个人仓库的 main 分支
git push origin main
```

### 场景二：提交到公司仓库 (company)
当需要将代码同步给公司时使用。

```bash
# 前提：确保本地 main 分支已经是最新且合并好的代码

# 推送到公司仓库的 main 分支
git push company main
```

> **注意**：如果遇到网络问题（如 `Connection reset`），请检查网络连接或尝试多试几次。

### 场景三：从官方仓库拉取最新更新 (upstream)
当官方代码有更新，您希望同步到本地时使用。通常**不**直接向 upstream 推送代码。

```bash
# 1. 从官方仓库获取最新状态
git fetch upstream

# 2. 切换到本地 main 分支
git checkout main

# 3. 合并官方更新到本地
git merge upstream/main

# 4. (可选) 将合并后的最新代码推送到自己的仓库备份
git push origin main
```
