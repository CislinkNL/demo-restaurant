# 🚀 新餐厅部署指南 - New Restaurant Deployment Guide

## 📋 部署前准备清单

你已经完成了餐厅配置！现在我们来进行部署步骤。

### 当前配置状态检查
- ✅ Blue Dragon (现有餐厅): `'BlueDragon'`
- ✅ 新餐厅配置: `'NewRestaurant'` (示例配置)
- ⚠️ **当前活动配置**: `CURRENT_RESTAURANT = 'BlueDragon'`

## 🔧 部署步骤

### 步骤1: 切换到新餐厅配置

在 `public/beheer/restaurant-config.js` 中，将第99行修改为：

```javascript
// 从这个
const CURRENT_RESTAURANT = 'BlueDragon';

// 改为你的新餐厅ID (例如)
const CURRENT_RESTAURANT = 'NewRestaurant';
```

### 步骤2: Firebase项目设置

#### 选项A: 创建新Firebase项目（推荐）
```bash
# 1. 创建新Firebase项目
firebase projects:create your-new-restaurant-id

# 2. 设置为当前项目
firebase use your-new-restaurant-id

# 3. 初始化Hosting（如果需要）
firebase init hosting
```

#### 选项B: 使用现有项目但不同站点
```bash
# 1. 添加新站点到现有项目
firebase hosting:sites:create your-new-restaurant-site

# 2. 更新firebase.json中的site配置
```

### 步骤3: 更新Firebase配置文件

如果使用新站点，更新 `firebase.json`:

```json
{
  "hosting": {
    "site": "your-new-restaurant-site-id",  // ← 修改这里
    "public": "public",
    // ... 其他配置保持不变
  }
}
```

### 步骤4: 本地测试
```bash
# 启动本地开发服务器
firebase serve

# 在浏览器中测试这些URL:
# http://localhost:5000/?rest=NewRestaurant&tafel=1
# http://localhost:5000/beheer
# http://localhost:5000/personeel
```

### 步骤5: 部署到生产环境
```bash
# 部署到Firebase
firebase deploy

# 如果只部署Hosting
firebase deploy --only hosting
```

## 🌐 域名配置

### 自定义域名设置（可选）
1. 在Firebase控制台 → Hosting → 添加自定义域名
2. 更新餐厅配置中的 `baseUrl` 和 `domain`
3. 配置DNS记录

## ✅ 部署后验证清单

### 基本功能测试
- [ ] **首页加载**: `https://your-domain.web.app`
- [ ] **桌台页面**: `https://your-domain.web.app/?rest=NewRestaurant&tafel=1`
- [ ] **管理后台**: `https://your-domain.web.app/beheer`
- [ ] **员工端**: `https://your-domain.web.app/personeel`

### 配置验证
- [ ] 餐厅名称显示正确
- [ ] 货币格式正确 ($10.00)
- [ ] 语言设置正确 (English)
- [ ] 桌台前缀正确 (Table-1)

### 控制台检查
打开浏览器开发者工具，检查控制台输出：
```
✅ 当前餐厅配置加载成功: New Restaurant Name (NewRestaurant)
📋 餐厅配置系统已加载到全局作用域
🏪 餐厅配置系统初始化完成
```

## 🔄 多餐厅切换

### 在不同餐厅间切换部署
只需修改 `restaurant-config.js` 中的一行：

```javascript
// 切换到 Blue Dragon
const CURRENT_RESTAURANT = 'BlueDragon';

// 切换到新餐厅
const CURRENT_RESTAURANT = 'NewRestaurant';
```

然后重新部署：
```bash
firebase deploy
```

## 📱 生成桌台二维码

部署成功后，可以使用管理后台 `/beheer` 生成桌台二维码。

**URL格式**:
```
https://your-domain.web.app/?rest=NewRestaurant&tafel=桌台号
```

## 🛠️ 常见问题解决

### 问题1: 配置未生效
- 确认 `CURRENT_RESTAURANT` 设置正确
- 清除浏览器缓存
- 检查控制台是否有错误

### 问题2: 404错误
- 确认Firebase部署成功
- 检查 `firebase.json` 配置
- 确认站点ID正确

### 问题3: 数据不显示
- 检查Firebase Database规则
- 确认数据库路径匹配餐厅配置
- 验证Firebase项目权限

### 问题4: 域名访问失败
- 检查DNS配置
- 确认SSL证书状态
- 验证Firebase Hosting设置

## 📞 快速命令参考

```bash
# 查看当前项目
firebase projects:list

# 切换项目
firebase use project-id

# 本地测试
firebase serve

# 部署
firebase deploy

# 查看部署历史
firebase hosting:deployments:list

# 回滚到前一版本
firebase hosting:rollback
```

## 🎯 下一步

部署成功后，你可能需要：
1. **设置菜单数据**: 在Firebase Database中添加菜单项
2. **配置员工权限**: 设置管理员和员工访问权限
3. **测试订单流程**: 完整测试从点餐到厨房的流程
4. **WhatsApp集成**: 如果启用了WhatsApp通知功能
5. **定制化调整**: 根据实际需求微调配置参数

---

**🔥 重要提醒**:
- 部署前务必在本地测试所有功能
- 生产环境使用安全的管理员密码
- 定期备份Firebase数据
- 监控应用性能和错误日志