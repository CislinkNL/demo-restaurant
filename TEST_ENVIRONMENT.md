# Blue Dragon 测试环境说明

## 🚫 生产部署保护

在 `multi-styling-version` 测试分支上，已配置防止意外部署到生产环境的保护机制。

## 📋 测试分支使用指南

### 1. 本地测试环境启动

```bash
# Windows
start-test-env.bat

# 或者手动启动
firebase emulators:start --config firebase.test.json
```

### 2. 模拟器访问地址

- **网站预览**: http://localhost:5000
- **Firebase UI**: http://localhost:4000  
- **数据库模拟器**: http://localhost:9000
- **存储模拟器**: http://localhost:9199

### 3. 安全部署

如需部署到生产环境，请使用安全部署脚本：

```bash
# Windows
safe-deploy.bat

# Linux/Mac
./safe-deploy.sh
```

## ⚠️ 重要注意事项

1. **测试分支保护**: `multi-styling-version` 分支被配置为仅用于测试，不能直接部署到生产环境
2. **配置文件**: 测试环境使用 `firebase.test.json` 配置文件
3. **数据隔离**: 测试环境使用本地模拟器，不会影响生产数据
4. **分支切换**: 如需部署生产环境，请先切换到 `main` 分支

## 🔄 分支管理

```bash
# 切换到测试分支
git checkout multi-styling-version

# 切换回主分支
git checkout main

# 查看当前分支
git branch --show-current

# 查看所有分支
git branch -v
```

## 🧪 测试流程建议

1. 在 `multi-styling-version` 分支开发新功能
2. 使用本地模拟器测试功能
3. 功能完成后合并到 `main` 分支
4. 从 `main` 分支部署到生产环境

这样可以确保测试代码不会意外影响生产环境。