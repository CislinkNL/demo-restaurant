# DEMO 桌号数据准备说明

## 📋 需要在 Firebase Database 中创建的数据

### 路径：`/Develop/tafel/Tafel-DEMO`

```json
{
  "Pincode": "0000",
  "Status": "open",
  "MaxTijdMinuten": 120,
  "BestellingVoedselLimit": 5,
  "BestellingNagerechtenLimit": 2,
  "Gasten": 2,
  "TafelNaam": "DEMO",
  "CreatedAt": 1706000000000,
  "LastUpdated": 1706000000000
}
```

## 🎨 可选：添加示例订单数据

### 路径：`/Develop/tafel/Tafel-DEMO/orders`

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

## 📝 菜单数据（如果还没有）

### 路径：`/Develop/menu`

```json
{
  "voorgerechten": {
    "name": "开胃菜",
    "name_nl": "Voorgerechten",
    "name_en": "Appetizers",
    "items": {
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
5. **图片 URL**：使用 cislink.nl 的示例图片，或者替换为实际图片 URL

## 🚀 快速导入（可选）

如果需要，可以使用 Firebase Console 的导入功能：
1. 将上述 JSON 保存为文件
2. 在 Firebase Console 的 Realtime Database 中选择 "导入 JSON"
3. 选择对应的节点路径导入

或者通过 Apps Script 代码导入这些数据。
