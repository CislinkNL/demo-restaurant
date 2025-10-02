# 原始荷兰语描述保存功能实现

## 问题描述
用户要求在发送订单到后端时保留原始的荷兰语描述，而不是发送翻译后的描述。这对于厨房显示屏、收据打印等后端处理非常重要，同时保持前端UI的翻译功能正常工作。

## 解决方案概述
实现了双重描述系统：
- `description`: 用于前端UI显示的翻译后描述
- `originalDescription`: 保存原始荷兰语描述，用于后端处理

## 修改的文件

### 1. 主文件夹 (public/)
- **food-info-js.js**: 修改订单添加逻辑，传递原始描述
- **class-order-js.js**: 
  - 更新 `addOrderLine()` 函数接受原始描述参数
  - 修改Firebase事务逻辑保存原始描述
  - 更新`exportOrder()`函数使用原始描述导出
  - 更新订单数据加载和同步逻辑
- **sendingOrder.js**: 
  - 修改数组映射逻辑支持原始描述字段
  - 更新格式化逻辑使用原始描述

### 2. 员工文件夹 (personeel/)
- **food-info-js.js**: 同主文件夹的修改
- **class-order-js.js**: 同主文件夹的修改
- **sendingOrder.js**: 同主文件夹的修改

## 技术实现细节

### 1. 数据结构扩展
订单项对象现在包含：
```javascript
{
  sku: "item_sku",
  description: "Translated Description", // UI显示用
  originalDescription: "Originele Nederlandse Beschrijving", // 后端用
  quantity: 1,
  price: 10.50,
  // ... 其他字段
}
```

### 2. Firebase存储
在Firebase Realtime Database中，每个订单项现在存储：
- `description`: 翻译后的描述
- `originalDescription`: 原始荷兰语描述

### 3. 订单导出
`exportOrder()` 函数中的 `currentLine[5]` 现在使用 `originalDescription`：
```javascript
currentLine[5] = orderLine.originalDescription || orderLine.description;
```

### 4. 发送格式化
`sendingOrder.js` 中的 `formatContent()` 函数现在使用原始描述：
```javascript
const itemDescription = item.originalDescription ?? item.description ?? "No description";
```

## 向后兼容性
- 如果 `originalDescription` 不存在，自动回退到 `description`
- 现有数据将正常工作，新数据将包含两个描述字段
- 所有UI功能保持不变

## 测试建议
1. 添加新订单项，验证Firebase中同时保存了两个描述字段
2. 切换语言，确认UI显示翻译后的描述
3. 发送订单，验证后端收到原始荷兰语描述
4. 检查现有订单数据的兼容性

## 影响范围
- ✅ 前端UI翻译功能正常
- ✅ 后端接收原始荷兰语描述
- ✅ 厨房显示和收据将使用正确的荷兰语术语
- ✅ 向后兼容现有数据

## 注意事项
- 原始描述来自菜单项的 `item.description` 字段
- Firebase存储空间轻微增加（每项多一个字段）
- 系统性能影响微乎其微