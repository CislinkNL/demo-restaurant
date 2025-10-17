# Demo Restaurant - 域名和参数更新完成

## 更新摘要 (2025-01-23)

已成功将所有链接从旧的 boss-beemster 域名更新为新的 democislink.web.app 域名，并将数据库路径参数从 `rest=BossRestaurant` 更新为 `rest=Develop`。

## 更新的文件

### 1. `public/beheer/restaurant-config.js`
**更改内容:**
- ✅ 餐厅ID: `BossRestaurant` → `Develop`
- ✅ 餐厅路径: `BossRestaurant` → `Develop`
- ✅ 显示名称: `Boss Restaurant` → `Demo Restaurant`
- ✅ 系统标题: `Boss Restaurant Management` → `Demo Restaurant Management`
- ✅ 基础URL: `https://bossrestaurant.web.app` → `https://democislink.web.app`
- ✅ 域名: `bossrestaurant.web.app` → `democislink.web.app`
- ✅ 当前餐厅常量: `CURRENT_RESTAURANT = 'BossRestaurant'` → `CURRENT_RESTAURANT = 'Develop'`

**影响范围:**
- QR码生成器会使用新的URL格式
- 桌台链接格式: `https://democislink.web.app/?rest=Develop&tafel={号码}`
- Firebase数据库路径会使用 `Develop` 节点

### 2. `public/beheer/beheer-config.json`
**更改内容:**
- ✅ 应用名称: `Boss Restaurant Management` → `Demo Restaurant Management`
- ✅ Firebase数据库路径: `BossRestaurant` → `Develop`
- ✅ 餐厅默认名称: `Boss Restaurant` → `Demo Restaurant`

**影响范围:**
- 管理后台的数据库查询路径
- 配置管理器使用的默认路径
- API调用时的路径参数

### 3. `public/beheer/updates-showcase.html`
**更改内容:**
- ✅ 客户访问链接: `../index.html?rest=Develop&tafel=1`
- ✅ 员工端链接: `https://democislink.web.app/personeel/?rest=Develop`
- ✅ JavaScript QR生成: `staffUrl = 'https://democislink.web.app/personeel/?rest=Develop'`

**影响范围:**
- 展示页面的所有访问链接
- 员工端QR码生成
- 演示环境的一致性

## URL格式规范

### 客户端访问
```
https://democislink.web.app/?rest=Develop&tafel={桌号}
```
示例: `https://democislink.web.app/?rest=Develop&tafel=1`

### 员工端访问
```
https://democislink.web.app/personeel/?rest=Develop
```

### 管理端访问
```
https://democislink.web.app/beheer/
```

## Firebase数据库结构

```
cislink-default-rtdb (项目)
└── Develop (餐厅路径)
    ├── config (配置)
    │   ├── maxTime
    │   ├── foodLimit
    │   └── ...
    ├── menu (菜单数据)
    └── Tafel-{号码} (桌台数据)
        ├── orders
        ├── status
        └── ...
```

## 验证结果

### ✅ 已完成的验证
1. **域名搜索** - 无残留的旧域名引用
   - 无 `boss-personeel.cislink.nl`
   - 无 `bossrestaurant.web.app`
   - 无 `boss-beemster` 引用

2. **参数搜索** - 无残留的旧餐厅参数
   - 无 `rest=BossRestaurant`
   - 所有引用都是 `rest=Develop`

3. **配置一致性** - 所有配置文件已同步
   - `restaurant-config.js` ✓
   - `beheer-config.json` ✓
   - `updates-showcase.html` ✓

## 下一步操作建议

### 1. 推送更新到GitHub
```powershell
git add .
git commit -m "Update all links to democislink.web.app with rest=Develop parameter"
git push origin main
```

### 2. 部署到Firebase Hosting
```powershell
firebase deploy --only hosting:democislink
```

### 3. 测试链接
- [ ] 客户端: `https://democislink.web.app/?rest=Develop&tafel=1`
- [ ] 员工端: `https://democislink.web.app/personeel/?rest=Develop`
- [ ] 管理端: `https://democislink.web.app/beheer/`

### 4. 验证数据库访问
- [ ] 检查是否正确读取 `Develop` 节点数据
- [ ] 验证订单是否写入正确路径
- [ ] 确认配置读取正常

## 技术说明

### URL参数说明
- `rest=Develop` - Firebase Realtime Database 的餐厅路径参数
- `tafel=X` - 桌台编号参数（客户端必需）
- `pincode=XXXX` - 可选的访问密码（如果启用）

### 多餐厅配置支持
系统保留了多餐厅配置能力，通过修改 `restaurant-config.js` 中的 `CURRENT_RESTAURANT` 常量即可切换：
```javascript
const CURRENT_RESTAURANT = 'Develop'; // 当前为Demo环境
```

### Firebase项目结构
- **项目ID**: cislink
- **Hosting站点**: democislink
- **Database实例**: cislink-default-rtdb
- **Cloud Functions区域**: europe-west1

## 注意事项

⚠️ **重要**: 这是Demo环境配置
- 使用 `Develop` 数据库路径以隔离测试数据
- 不要将生产数据写入此路径
- 适用于演示、开发和测试

⚠️ **数据库权限**: 确保Firebase规则允许访问 `Develop` 节点
```json
{
  "rules": {
    "Develop": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 完成时间
2025-01-23

## 更新人员
GitHub Copilot
