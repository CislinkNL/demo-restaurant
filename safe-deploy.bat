@echo off
setlocal enabledelayedexpansion

REM 防止意外部署到生产环境的保护脚本

for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i

echo ===================================
echo Firebase 部署保护检查
echo ===================================
echo 当前分支: %CURRENT_BRANCH%
echo.

if "%CURRENT_BRANCH%"=="multi-styling-version" (
    echo ❌ 错误: 不允许从测试分支 'multi-styling-version' 部署到生产环境!
    echo.
    echo 测试选项:
    echo 1. 使用本地模拟器: start-test-env.bat
    echo 2. 切换到主分支: git checkout main
    echo.
    pause
    exit /b 1
) else if "%CURRENT_BRANCH%"=="main" (
    echo ✅ 当前在主分支，允许部署
    echo 继续执行 firebase deploy...
    firebase deploy %*
) else (
    echo ⚠️  警告: 当前在分支 '%CURRENT_BRANCH%'
    choice /C YN /M "是否确认要从此分支部署"
    if errorlevel 2 (
        echo 取消部署
        exit /b 1
    ) else (
        firebase deploy %*
    )
)

endlocal