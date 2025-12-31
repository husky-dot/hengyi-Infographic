# Git 远程源使用说明

## 远程源配置

| 名称 | URL | 说明 |
|------|-----|------|
| origin | `https://github.com/husky-dot/hengyi-Infographic.git` | 自己的仓库 |
| upstream | `https://github.com/antvis/Infographic.git` | 官方仓库 |

## 日常开发流程

### 1. 提交代码到自己的仓库

```bash
# 查看修改状态
git status

# 添加所有修改
git add .

# 提交修改
git commit -m "提交说明"

# 推送到自己的仓库
git push origin main
```

### 2. 拉取官方最新更新

```bash
# 获取官方仓库最新代码
git fetch upstream

# 合并官方更新到本地（确保当前在 main 分支）
git checkout main
git merge upstream/main

# 如果有冲突，解决冲突后
git add .
git commit -m "merge upstream"

# 推送合并后的代码到自己的仓库
git push origin main
```

### 3. 常用命令

```bash
# 查看所有远程源
git remote -v

# 查看当前分支
git branch

# 切换分支
git checkout <分支名>
```
