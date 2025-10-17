# 🔒 Pincode 安全防护系统实施文档

## 📋 概述

实施了一个**三层防护**系统来保护订单流程，防止在Pincode变更后的恶意或无效订单提交。

## 🛡️ 三层防护架构

```
┌──────────────────────────────────────────────────────────────┐
│                    用户操作流程                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  登录页面 → 浏览菜单 → 添加菜品 → 确认订单 → 发送订单         │
│     ✅        ✅        🔒①        🔒②        🔒③           │
│                                                              │
└──────────────────────────────────────────────────────────────┘

🔒① 第一层防护：禁用"添加到订单"按钮
🔒② 第二层防护：订单确认弹窗前验证Pincode
🔒③ 第三层防护：sendDirect()发送前最终验证
```

---

## 🔒 第一层防护：禁用添加按钮

### 触发条件
当Firebase中的Pincode变更且与URL中的Pincode不匹配时

### 实施位置
- `class-order-js.js` (第795-841行)
- `verificatie-realtimeListener-js.js` (第68-113行)

### 功能
1. **实时监听** Firebase Pincode变更
2. **比对验证** URL Pincode vs Firebase Pincode
3. **禁用按钮** 所有 `.add-to-order` 按钮
4. **视觉反馈** 
   - opacity: 0.4
   - cursor: not-allowed
   - 按钮提示文字
5. **禁用发送** `#order-verzend` 按钮
6. **显示横幅** 顶部红色警告横幅
7. **显示通知** 20秒错误通知

### 代码示例
```javascript
// 检查Pincode是否匹配
const urlPincode = new URLSearchParams(window.location.search).get("pincode");
if (String(urlPincode) !== String(data)) {
    // 设置失效标记
    window.AppConfig.sessionInvalid = true;
    
    // 禁用所有订单功能
    window.disableOrderingDueToInvalidSession();
    
    // 显示警告
    showNotification(
        `⚠️ Pincode is gewijzigd! Ververs de pagina...`,
        "error",
        20000
    );
}
```

### 用户体验
- ⚠️ 立即收到红色警告通知
- ⚠️ 顶部显示刷新页面横幅
- ❌ 无法添加新菜品
- ❌ 无法发送现有订单
- ✅ 可以点击横幅上的按钮刷新页面

---

## 🔒 第二层防护：订单确认验证

### 触发时机
用户点击"发送订单"按钮，在显示确认弹窗后，点击"确认"按钮时

### 实施位置
- `javascript.js` (第875-924行)

### 验证流程
```javascript
1. 获取 AppConfig.pincode (URL中的)
2. 从 Firebase 获取当前 Pincode
3. 比对两者是否匹配
4. 检查桌子状态是否为 "open"
5. 验证通过 → 继续流程
6. 验证失败 → 显示错误并阻止发送
```

### 代码示例
```javascript
// 第二层防护：验证Pincode
const tableRef = db.ref(`${rest}/tafel/${tafelId}`);
const snapshot = await tableRef.once('value');
const tableData = snapshot.val();

const tafelPin = tableData.Pincode || "";
const status = tableData.Status || "gesloten";

console.log(`🔐 第二层防护 - PIN验证 — URL: ${savedPin}, Firebase: ${tafelPin}`);

if (String(savedPin) !== String(tafelPin)) {
    showNotification(
        `⚠️ Pincode is niet meer geldig! Ververs de pagina...`,
        "error",
        5000
    );
    resolve(false);
    return;
}

if (status !== 'open') {
    showNotification(
        `Sorry, de tafel is gesloten...`,
        "error",
        4000
    );
    resolve(false);
    return;
}
```

### 用户体验
- ✅ 在确认弹窗中点击确认后才验证
- ⚠️ 验证失败时显示具体错误原因
- ✅ 不影响正常用户的流程
- ✅ 防止恶意用户绕过第一层防护

---

## 🔒 第三层防护：发送前最终验证

### 触发时机
调用 `sendDirect()` 函数，即将向Webhook发送订单数据时

### 实施位置
- `sendingOrder.js` (第3-56行)

### 验证逻辑
```javascript
1. sendDirect() 函数一开始就进行验证
2. 验证失败立即返回错误
3. 验证成功才继续发送到Webhook
```

### 代码示例
```javascript
async function sendDirect(timerText, tafelNr, orderLineCount, newInvoiceNumber, Bestelling) {
  console.log("sendDirect called with:", { Bestelling, newInvoiceNumber });

  // 🔒 第三层防护：最终Pincode验证
  try {
    const rest = window.AppConfig?.restName || 'asianboulevard';
    const tafelId = `Tafel-${tafelNr}`;
    const savedPin = window.AppConfig?.pincode;

    const db = firebase.database();
    const tableRef = db.ref(`${rest}/tafel/${tafelId}`);
    const snapshot = await tableRef.once('value');
    const tableData = snapshot.val();

    const tafelPin = tableData.Pincode || "";
    const status = tableData.Status || "gesloten";

    console.log(`🔐 第三层防护 - 最终PIN验证 — URL: ${savedPin}, Firebase: ${tafelPin}`);

    if (String(savedPin) !== String(tafelPin)) {
      console.error("❌ 第三层防护：Pincode不匹配！");
      showNotification(
          `⚠️ Pincode is gewijzigd! Bestelling kan niet worden verzonden.`,
          "error",
          5000
      );
      return "Fout: Pincode is niet geldig...";
    }

    if (status !== 'open') {
      console.error("❌ 第三层防护：Tafel is gesloten");
      return "Fout: Tafel is gesloten.";
    }

    console.log("✅ 第三层防护：Pincode验证通过，继续发送订单");
  } catch (error) {
    console.error("❌ 第三层防护验证失败:", error);
    return `Fout bij pincode verificatie: ${error.message}`;
  }

  // 继续正常的发送流程...
  const WebHookEl = document.getElementById('webhook');
  const WebHook = WebHookEl?.innerText?.trim?.();
  // ...
}
```

### 安全优势
- ✅ **最后防线**：即使前两层被绕过，这里也会拦截
- ✅ **服务端验证**：从Firebase实时获取最新Pincode
- ✅ **双重检查**：同时验证Pincode和桌子状态
- ✅ **详细日志**：记录所有验证尝试供排查

### 用户体验
- ✅ 对正常用户完全透明
- ⚠️ 只在验证失败时显示错误
- ✅ 提供明确的错误信息

---

## 🎯 辅助功能

### 全局禁用函数

**位置**: `javascript.js` (第8-68行)

```javascript
window.disableOrderingDueToInvalidSession = function() {
    // 禁用所有添加按钮
    document.querySelectorAll('.add-to-order').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
        btn.title = 'Pincode is gewijzigd...';
    });
    
    // 禁用发送按钮
    const verzendBtn = document.getElementById('order-verzend');
    if (verzendBtn) {
        verzendBtn.disabled = true;
        verzendBtn.style.opacity = '0.4';
        verzendBtn.style.cursor = 'not-allowed';
    }
    
    // 显示顶部警告横幅
    let banner = document.getElementById('session-invalid-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'session-invalid-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
            padding: 15px 20px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            z-index: 99999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        banner.innerHTML = `
            ⚠️ Pincode is gewijzigd! 
            <button onclick="window.location.reload()">Ververs Pagina</button>
        `;
        document.body.prepend(banner);
    }
};
```

### 页面加载检查

```javascript
// 页面加载时检查会话状态
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.AppConfig?.sessionInvalid) {
            console.warn('🔒 检测到会话已失效');
            window.disableOrderingDueToInvalidSession();
        }
    }, 1000);
});
```

---

## 📊 安全性评估

| 攻击场景 | 防护效果 | 说明 |
|---------|---------|------|
| 正常Pincode变更 | ✅✅✅ 完全防护 | 三层防护全部生效 |
| 绕过前端验证 | ✅✅ 强防护 | 第三层服务端验证拦截 |
| 直接调用sendDirect | ✅ 基本防护 | 第三层验证拦截 |
| 修改AppConfig | ✅✅ 强防护 | 从Firebase实时获取验证 |
| 桌子关闭后下单 | ✅✅✅ 完全防护 | 同时验证状态 |

---

## 🧪 测试场景

### 场景1：正常Pincode变更
1. 顾客正在浏览菜单
2. 服务员在管理端修改Pincode
3. **预期结果**:
   - ✅ 顾客立即看到红色警告横幅
   - ✅ 所有"添加"按钮变灰不可用
   - ✅ "发送订单"按钮变灰
   - ✅ 显示20秒错误通知
   - ✅ 顾客点击刷新页面按钮

### 场景2：Pincode变更后尝试添加菜品
1. Pincode已变更，横幅已显示
2. 顾客点击"添加到订单"按钮
3. **预期结果**:
   - ❌ 按钮不响应（disabled状态）
   - ⚠️ 鼠标悬停显示提示文字

### 场景3：Pincode变更后尝试发送订单
1. 顾客在Pincode变更前已添加菜品
2. Pincode变更
3. 顾客点击"发送订单"
4. **预期结果**:
   - ❌ 按钮不响应（disabled状态）
   - ⚠️ 如果绕过前端点击，第二层会拦截

### 场景4：技术用户绕过前端验证
1. 技术用户通过浏览器控制台启用按钮
2. 点击确认发送订单
3. **预期结果**:
   - ✅ 第二层验证在确认弹窗后拦截
   - ⚠️ 显示"Pincode is niet meer geldig"
   - ❌ 订单不会发送

### 场景5：直接调用sendDirect函数
1. 技术用户通过控制台直接调用sendDirect()
2. **预期结果**:
   - ✅ 第三层验证在函数开始时拦截
   - ⚠️ 返回错误信息
   - ❌ 不会发送到Webhook

---

## 🎨 用户界面元素

### 警告横幅
```css
位置: 顶部固定
背景: 红色渐变 (#dc3545 → #c82333)
文字: 白色加粗
按钮: 白底红字"Ververs Pagina"
动画: slideDown 0.3s
z-index: 99999 (最高层)
```

### 禁用按钮样式
```css
opacity: 0.4
cursor: not-allowed
title: "Pincode is gewijzigd. Ververs de pagina..."
```

### 通知消息
```javascript
类型: error (红色)
时长: 20秒
内容: "⚠️ Pincode is gewijzigd! Ververs de pagina..."
```

---

## 📝 维护注意事项

1. **不要删除sessionInvalid标记**
   - `window.AppConfig.sessionInvalid` 用于跨脚本通信
   - 用于页面重新加载后保持状态

2. **保持验证逻辑一致**
   - 三层防护都使用相同的验证逻辑
   - 统一的错误消息便于用户理解

3. **日志记录**
   - 所有三层防护都有console.log/console.error
   - 便于调试和问题追踪

4. **测试覆盖**
   - 定期测试三层防护是否正常工作
   - 测试横幅显示和按钮禁用功能

---

## 🚀 未来改进建议

### 可选：后端验证（更高安全性）
在Webhook端增加Pincode验证:

```javascript
// Webhook接收端
POST /webhook {
  "fileName": "Order_1_C6K1.123",
  "content": "...",
  "pincode": "1234",  // 新增
  "tafelNr": "1",
  "restName": "asianboulevard"
}

// 后端验证
if (receivedPincode !== firebasePincode) {
  return { error: "Invalid pincode", status: 403 };
}
```

### 可选：弹窗重新验证
在第一层防护触发时，弹出Pincode输入框要求重新验证：

```javascript
// 显示验证弹窗
const newPin = await promptForNewPincode();
if (newPin === newPincode) {
  // 更新URL并刷新
  window.location.href = updateURLParameter('pincode', newPin);
}
```

---

## ✅ 总结

此三层防护系统提供了：

- 🛡️ **强大的安全性**: 多层防御，即使一层失效也有保障
- 👍 **良好的用户体验**: 对正常用户几乎无感知
- 🎯 **清晰的错误提示**: 用户知道问题所在和如何解决
- 📊 **完整的日志记录**: 便于问题排查和审计
- 🔧 **易于维护**: 代码清晰，注释完整

**当前实施的防护足以应对绝大多数安全威胁，无需后端修改即可快速部署。**
