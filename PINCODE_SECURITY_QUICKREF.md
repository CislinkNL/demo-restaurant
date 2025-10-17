# 🔒 三层Pincode安全防护 - 快速参考

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                   三层安全防护                            │
└─────────────────────────────────────────────────────────┘

🔒 第一层：禁用添加按钮
   ├─ 触发：Pincode变更时（实时监听）
   ├─ 效果：禁用.add-to-order按钮
   ├─ 效果：禁用#order-verzend按钮  
   ├─ 效果：显示红色警告横幅
   └─ 文件：class-order-js.js, verificatie-realtimeListener-js.js

🔒 第二层：订单确认验证
   ├─ 触发：点击确认弹窗的"确认"按钮
   ├─ 效果：验证Pincode和桌子状态
   ├─ 效果：失败时阻止订单发送
   └─ 文件：javascript.js (第875-924行)

🔒 第三层：发送前最终验证
   ├─ 触发：调用sendDirect()函数时
   ├─ 效果：最后防线，验证Pincode
   ├─ 效果：失败时返回错误，不发送到Webhook
   └─ 文件：sendingOrder.js (第3-56行)
```

## 代码位置

| 防护层 | 文件 | 行数 | 功能 |
|-------|------|------|------|
| 第一层 | `class-order-js.js` | 795-841 | Pincode变更监听 + 禁用UI |
| 第一层 | `verificatie-realtimeListener-js.js` | 68-113 | Pincode变更监听 + 禁用UI |
| 辅助 | `javascript.js` | 8-68 | 全局禁用函数 + 警告横幅 |
| 第二层 | `javascript.js` | 875-924 | 确认弹窗验证 |
| 第三层 | `sendingOrder.js` | 3-56 | 发送前最终验证 |

## 关键函数

### 1. 全局禁用函数
```javascript
// 位置: javascript.js
window.disableOrderingDueToInvalidSession()
```
功能：
- 禁用所有订单按钮
- 显示顶部警告横幅
- 提供刷新页面按钮

### 2. Pincode变更检测
```javascript
// 位置: class-order-js.js, verificatie-realtimeListener-js.js
if (key === 'Pincode' && data) {
    const urlPincode = new URLSearchParams(window.location.search).get("pincode");
    if (String(urlPincode) !== String(data)) {
        // 会话失效处理
        window.AppConfig.sessionInvalid = true;
        window.disableOrderingDueToInvalidSession();
    }
}
```

### 3. 订单确认验证
```javascript
// 位置: javascript.js
const tableRef = db.ref(`${rest}/tafel/${tafelId}`);
const snapshot = await tableRef.once('value');
const tableData = snapshot.val();

if (String(savedPin) !== String(tafelPin)) {
    showNotification(`⚠️ Pincode is niet meer geldig!`, "error", 5000);
    return;
}
```

### 4. 发送前验证
```javascript
// 位置: sendingOrder.js
async function sendDirect(...) {
    // 🔒 第三层防护验证
    const snapshot = await tableRef.once('value');
    if (String(savedPin) !== String(tafelPin)) {
        return "Fout: Pincode is niet geldig...";
    }
    // 继续发送...
}
```

## 测试命令

### 测试1: 触发Pincode变更
```javascript
// 在管理端修改Pincode
// 观察客户端是否显示警告横幅
```

### 测试2: 尝试添加菜品
```javascript
// Pincode变更后
// 点击"添加到订单"按钮
// 预期：按钮不响应（disabled）
```

### 测试3: 尝试发送订单
```javascript
// Pincode变更后
// 点击"发送订单"
// 预期：按钮禁用或验证失败
```

### 测试4: 绕过前端验证
```javascript
// 控制台执行
document.getElementById('order-verzend').disabled = false;
document.getElementById('order-verzend').click();
// 预期：第二层或第三层验证拦截
```

## 日志标识

查找日志时搜索以下关键字：

- `🔐 第一层防护` - 禁用按钮时
- `🔐 第二层防护` - 确认验证时
- `🔐 第三层防护` - 发送验证时
- `🔒 Pincode不匹配` - 检测到变更时
- `✅ Pincode验证通过` - 验证成功时
- `❌ 第X层防护` - 验证失败时

## 部署清单

- [x] 修改 `javascript.js`
- [x] 修改 `class-order-js.js`
- [x] 修改 `verificatie-realtimeListener-js.js`
- [x] 修改 `sendingOrder.js`
- [ ] 测试三层防护
- [ ] 部署到生产环境
- [ ] 监控日志

## 常见问题

**Q: 为什么需要三层防护？**
A: 多层防御确保即使某层被绕过，仍有其他层保护。

**Q: 会影响正常用户吗？**
A: 不会。正常情况下三层验证都是透明的。

**Q: Pincode变更后用户该怎么办？**
A: 点击顶部横幅的"刷新页面"按钮，使用新Pincode重新登录。

**Q: 如何查看验证日志？**
A: 打开浏览器控制台，搜索"🔐"或"第X层防护"。

---

**最后更新**: 2025-10-17
**版本**: v2.1.0
**状态**: ✅ 已实施
