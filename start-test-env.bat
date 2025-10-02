@echo off
echo ================================
echo Blue Dragon 测试环境启动脚本
echo ================================
echo.
echo 注意: 此脚本仅用于本地测试，不会部署到生产环境
echo.

REM 检查是否在测试分支
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i

if not "%CURRENT_BRANCH%"=="multi-styling-version" (
    echo 警告: 当前不在测试分支 multi-styling-version
    echo 当前分支: %CURRENT_BRANCH%
    echo.
    choice /C YN /M "是否继续启动测试环境"
    if errorlevel 2 exit /b
)

echo 启动Firebase模拟器...
echo 使用配置文件: firebase.test.json
echo.
echo 模拟器地址:
echo - 网站: http://localhost:5000
echo - 管理界面: http://localhost:4000
echo - 数据库: http://localhost:9000
echo - 存储: http://localhost:9199
echo.
echo 按 Ctrl+C 停止模拟器
echo.

firebase emulators:start --config firebase.test.json