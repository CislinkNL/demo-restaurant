#!/bin/bash

# 防止意外部署到生产环境的保护脚本

CURRENT_BRANCH=$(git branch --show-current)

echo "==================================="
echo "Firebase 部署保护检查"
echo "==================================="
echo "当前分支: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" = "multi-styling-version" ]; then
    echo "❌ 错误: 不允许从测试分支 'multi-styling-version' 部署到生产环境!"
    echo ""
    echo "测试选项:"
    echo "1. 使用本地模拟器: ./start-test-env.bat"
    echo "2. 切换到主分支: git checkout main"
    echo ""
    exit 1
elif [ "$CURRENT_BRANCH" = "main" ]; then
    echo "✅ 当前在主分支，允许部署"
    echo "继续执行 firebase deploy..."
    firebase deploy "$@"
else
    echo "⚠️  警告: 当前在分支 '$CURRENT_BRANCH'"
    read -p "是否确认要从此分支部署? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        firebase deploy "$@"
    else
        echo "取消部署"
        exit 1
    fi
fi