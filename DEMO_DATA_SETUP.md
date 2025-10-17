# DEMO 系统开发说明

## 🎯 核心需求

**使用完整生产数据 + 自动生成 Demo 桌号**

### 方案概述

- ✅ 使用 `/Develop/` 下的**所有真实数据**（menukaart、config 等）
- 🔥 **后端自动生成新桌号**（每次 Demo 访问时创建真实桌号）
- 📊 完全真实的餐厅系统体验，不是模拟演示

---

## 🔧 需要开发的功能

### 1. Demo 桌号自动生成 API

**功能**：创建真实的 Demo 桌号并写入数据库

**建议路径**：`/Develop/tafel/Tafel-DEMO-{timestamp}`

**数据结构示例**：
```json
{
  "Pincode": "0000",
  "Status": "open",
  "MaxTijdMinuten": 120,
  "BestellingVoedselLimit": 5,
  "BestellingNagerechtenLimit": 2,
  "Gasten": 2,
  "TafelNaam": "DEMO-{timestamp}",
  "CreatedAt": 1706000000000,
  "DemoMode": true
}
```

**关键点**：
- 桌号必须是**唯一的**（建议使用时间戳）
- 必须**实际写入数据库** `/Develop/tafel/` 下
- 返回完整的访问 URL：`https://democislink.web.app/?tafel=DEMO-{timestamp}`

---

### 2. Demo 展示页面集成

**Demo 页面需要**：
1. 调用后端 API 创建新桌号
2. 获取返回的桌号和 URL
3. 在 3 个 iframe 中加载：
   - 顾客端：`https://democislink.web.app/?tafel=DEMO-XXX`
   - 员工端：`https://democislink.web.app/personeel/?tafel=DEMO-XXX`
   - 管理端：`https://democislink.web.app/beheer/`

**实时数据同步**：
- 因为使用真实数据库，3 个界面会自动实时同步
- 用户在顾客端点餐 → 员工端立即看到 → 管理端可以管理

---

### 3. 可选：Demo 数据清理机制

**建议功能**：
- 定期清理过期的 Demo 桌号（例如：创建后 30 分钟）
- 或保留用于展示历史订单
- Cloud Function 定时任务：`cleanupDemoTables()`

---

## 💻 技术实现方案

### 方案 A：Cloud Function（推荐）

**优点**：
- 官方推荐，性能好
- 易于扩展和维护
- 支持身份验证

**实现示例**：
```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createDemoTable = functions.https.onCall(async (data, context) => {
  try {
    // 1. 生成唯一桌号
    const timestamp = Date.now();
    const tableNumber = `DEMO-${timestamp}`;
    const tableKey = `Tafel-${tableNumber}`;
    
    // 2. 准备数据
    const tableData = {
      Pincode: "0000",
      Status: "open",
      TafelNaam: tableNumber,
      MaxTijdMinuten: 120,
      BestellingVoedselLimit: 5,
      BestellingNagerechtenLimit: 2,
      Gasten: 2,
      CreatedAt: timestamp,
      DemoMode: true,
      ExpiresAt: timestamp + (30 * 60 * 1000) // 30分钟后过期
    };
    
    // 3. 写入数据库
    await admin.database()
      .ref(`Develop/tafel/${tableKey}`)
      .set(tableData);
    
    // 4. 返回结果
    return {
      success: true,
      tableKey,
      tableNumber,
      urls: {
        customer: `https://democislink.web.app/?tafel=${tableNumber}`,
        staff: `https://democislink.web.app/personeel/?tafel=${tableNumber}`,
        admin: `https://democislink.web.app/beheer/`
      }
    };
  } catch (error) {
    console.error('Error creating demo table:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// 清理过期 Demo 桌号
exports.cleanupDemoTables = functions.pubsub
  .schedule('every 10 minutes')
  .onRun(async (context) => {
    const now = Date.now();
    const tablesRef = admin.database().ref('Develop/tafel');
    const snapshot = await tablesRef.once('value');
    
    const promises = [];
    snapshot.forEach(child => {
      const data = child.val();
      if (data.DemoMode && data.ExpiresAt && data.ExpiresAt < now) {
        console.log(`Cleaning up expired demo table: ${child.key}`);
        promises.push(child.ref.remove());
      }
    });
    
    await Promise.all(promises);
    console.log(`Cleaned up ${promises.length} demo tables`);
  });
```

---

### 方案 B：Google Apps Script

**优点**：
- 你已经在使用 Apps Script
- 可以复用现有代码
- 不需要额外部署

**实现示例**：
```javascript
// Google Apps Script - Code.gs
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    
    if (params.action === 'createDemoTable') {
      return createDemoTable();
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Unknown action' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function createDemoTable() {
  const timestamp = new Date().getTime();
  const tableNumber = `DEMO-${timestamp}`;
  const tableKey = `Tafel-${tableNumber}`;
  
  const tableData = {
    Pincode: "0000",
    Status: "open",
    TafelNaam: tableNumber,
    MaxTijdMinuten: 120,
    BestellingVoedselLimit: 5,
    BestellingNagerechtenLimit: 2,
    Gasten: 2,
    CreatedAt: timestamp,
    DemoMode: true
  };
  
  // 写入 Firebase（使用你现有的 Firebase 连接代码）
  const firebaseUrl = 'https://cislink-default-rtdb.europe-west1.firebasedatabase.app';
  const path = `/Develop/tafel/${tableKey}.json`;
  
  const options = {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(tableData)
  };
  
  UrlFetchApp.fetch(firebaseUrl + path, options);
  
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      tableKey,
      tableNumber,
      urls: {
        customer: `https://democislink.web.app/?tafel=${tableNumber}`,
        staff: `https://democislink.web.app/personeel/?tafel=${tableNumber}`,
        admin: `https://democislink.web.app/beheer/`
      }
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

---

## � Demo 工作流程

1. **用户访问 Demo 页面**（在 Cislink Website 上）
2. **点击"开始 Demo"按钮**
3. **前端调用后端 API** 创建新桌号
4. **后端返回 3 个 URL**
5. **Demo 页面加载 3 个 iframe**
6. **用户体验完整系统**：
   - 在顾客端点餐（真实操作）
   - 在员工端查看订单（实时同步）
   - 在管理端查看数据（真实数据）
7. **可选：30 分钟后自动清理**

---

## 🎨 旧方案：手动示例订单数据（已弃用）

如果需要预设示例订单，可以参考以下结构：

### 路径：`/Develop/tafel/Tafel-DEMO-XXX/orders`

```json
{
  "order_001": {
    "items": [
      {
        "name": "春卷",
        "name_nl": "Loempia",
        "name_en": "Spring Roll",
        "price": 5.50,
        "quantity": 2,
        "category": "voorgerechten"
      },
      {
        "name": "宫保鸡丁",
        "name_nl": "Kung Pao Kip",
        "name_en": "Kung Pao Chicken",
        "price": 12.50,
        "quantity": 1,
        "category": "hoofdgerechten"
      }
    ],
    "status": "preparing",
    "timestamp": 1706001000000,
    "totalAmount": 23.50,
    "staffOrder": false
  },
  "order_002": {
    "items": [
      {
        "name": "冰淇淋",
        "name_nl": "IJs",
        "name_en": "Ice Cream",
        "price": 4.50,
        "quantity": 2,
        "category": "nagerechten"
      }
    ],
    "status": "completed",
    "timestamp": 1706002000000,
    "totalAmount": 9.00,
    "staffOrder": false
  }
}
```

## 📝 菜单数据说明

### ⚠️ 重要：实际路径是 `/Develop/menukaart/`

**说明**：
- `/Develop/menukaart/` 应该已经包含现有的所有产品数据
- **无需创建新菜单**，从现有产品中挑选 6-8 个适合 Demo 的即可
- 前端代码读取路径：`${restName}/menukaart`

**如果需要参考菜单结构**，以下是示例格式：

### 参考路径：`/Develop/menukaart`

```json
{
  "item_001": {
    "name": "开胃菜",
    "name_nl": "Voorgerechten",
    "name_en": "Appetizers",
      "item_001": {
        "name": "春卷",
        "name_nl": "Loempia",
        "name_en": "Spring Roll",
        "price": 5.50,
        "description": "传统中式春卷",
        "description_nl": "Traditionele Chinese loempia",
        "description_en": "Traditional Chinese spring roll",
        "image": "https://cislink.nl/menufoto/spring-roll.jpg",
        "allergens": ["gluten", "soja"]
      },
      "item_002": {
        "name": "虾饺",
        "name_nl": "Garnalendumplings",
        "name_en": "Shrimp Dumplings",
        "price": 6.50,
        "description": "鲜虾蒸饺",
        "description_nl": "Gestoomde garnalendumplings",
        "description_en": "Steamed shrimp dumplings",
        "image": "https://cislink.nl/menufoto/shrimp-dumpling.jpg",
        "allergens": ["schaaldieren"]
      }
    }
  },
  "hoofdgerechten": {
    "name": "主菜",
    "name_nl": "Hoofdgerechten",
    "name_en": "Main Courses",
    "items": {
      "item_001": {
        "name": "宫保鸡丁",
        "name_nl": "Kung Pao Kip",
        "name_en": "Kung Pao Chicken",
        "price": 12.50,
        "description": "四川风味辣子鸡",
        "description_nl": "Sichuan-stijl pittige kip",
        "description_en": "Sichuan-style spicy chicken",
        "image": "https://cislink.nl/menufoto/kung-pao.jpg",
        "allergens": ["pinda", "soja"]
      },
      "item_002": {
        "name": "糖醋排骨",
        "name_nl": "Sweet & Sour Spareribs",
        "name_en": "Sweet & Sour Pork Ribs",
        "price": 14.50,
        "description": "酸甜可口的排骨",
        "description_nl": "Zoet-zure spareribs",
        "description_en": "Sweet and sour pork ribs",
        "image": "https://cislink.nl/menufoto/sweet-sour-ribs.jpg",
        "allergens": ["soja"]
      }
    }
  },
  "nagerechten": {
    "name": "甜点",
    "name_nl": "Nagerechten",
    "name_en": "Desserts",
    "items": {
      "item_001": {
        "name": "冰淇淋",
        "name_nl": "IJs",
        "name_en": "Ice Cream",
        "price": 4.50,
        "description": "各种口味冰淇淋",
        "description_nl": "Diverse smaken ijs",
        "description_en": "Various flavors ice cream",
        "image": "https://cislink.nl/menufoto/ice-cream.jpg",
        "allergens": ["melk"]
      },
      "item_002": {
        "name": "芒果布丁",
        "name_nl": "Mango Pudding",
        "name_en": "Mango Pudding",
        "price": 5.00,
        "description": "新鲜芒果布丁",
        "description_nl": "Verse mango pudding",
        "description_en": "Fresh mango pudding",
        "image": "https://cislink.nl/menufoto/mango-pudding.jpg",
        "allergens": ["melk"]
      }
    }
  }
}
```

## 🔧 配置数据

### 路径：`/Develop/config`

```json
{
  "maxTime": 120,
  "foodLimit": 5,
  "dessertLimit": 2,
  "whatsappEnabled": false,
  "timeLimitEnabled": true,
  "restaurantName": "Demo Restaurant",
  "restaurantName_nl": "Demo Restaurant",
  "restaurantName_en": "Demo Restaurant",
  "currency": "EUR",
  "currencySymbol": "€"
}
```

## 📌 注意事项

1. **Pincode 设置为 0000**：方便演示，用户可以直接访问
2. **Status 设置为 open**：确保桌台可用
3. **示例订单**：包含不同状态（preparing, completed），展示订单流程
4. **多语言支持**：所有文本都包含中文、荷兰语、英语三个版本
5. **⚠️ 菜单数据路径**：实际是 `/Develop/menukaart/`（不是 `/Develop/menu/`）
6. **图片处理**：如果图片 URL 失效，前端会自动显示占位图

## 🚀 快速导入（可选）

如果需要，可以使用 Firebase Console 的导入功能：
1. 将上述 JSON 保存为文件
2. 在 Firebase Console 的 Realtime Database 中选择 "导入 JSON"
3. 选择对应的节点路径导入

或者通过 Apps Script 代码导入这些数据。
