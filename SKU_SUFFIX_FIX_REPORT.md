# SKU后缀问题修复报告

## 问题描述
在订单发送过程中，有时SKU会出现类似 `_default_z90bu7b5` 的后缀，这是由于Firebase的lineKey被错误地用作SKU导致的。

## 问题根因分析

### 1. LineKey生成机制
- `_buildLineKey()` 函数为了确保订单项的唯一性，会生成包含以下部分的key：
  - 原始SKU
  - 选项信息 (`__options`)
  - 设备ID后缀 (`_deviceId`)
- 格式：`sku__options_deviceId`

### 2. 问题发生点
在Firebase数据读取时，如果`v.sku`不存在，代码会错误地使用`child.key`(即lineKey)作为SKU：
```javascript
sku: v.sku || child.key  // ❌ 错误：child.key包含后缀
```

### 3. 影响范围
- 订单发送到后端时，SKU包含无关后缀
- 厨房打印系统可能无法识别正确的商品
- 库存管理可能出现问题

## 修复方案

### 1. 添加SKU提取函数
新增 `_extractSkuFromLineKey()` 函数，从lineKey中提取原始SKU：

```javascript
_extractSkuFromLineKey(lineKey) {
    if (!lineKey || typeof lineKey !== 'string') {
        return lineKey;
    }
    const parts = lineKey.split('__');
    return parts.length > 0 ? parts[0] : lineKey;
}
```

### 2. 修复数据读取逻辑
所有从Firebase读取SKU的地方都改为：
```javascript
sku: v.sku || this._extractSkuFromLineKey(child.key)  // ✅ 正确提取SKU
```

### 3. 强化SKU清理
在`sendingOrder.js`的`sanitizeSku`函数中添加后缀移除逻辑：
```javascript
// 移除设备ID和选项后缀
if (cleaned.includes('__')) {
    cleaned = cleaned.split('__')[0];
}
// 移除 _default_ 或 _unknown 等设备ID后缀
cleaned = cleaned.replace(/_default_[a-z0-9]+$/i, '').replace(/_unknown$/i, '');
```

## 修复的文件

### 主版本 (public/)
- `class-order-js.js`: 添加SKU提取函数，修复数据读取逻辑
- `sendingOrder.js`: 强化SKU清理函数

### 员工版本 (personeel/)  
- `class-order-js.js`: 同主版本修改
- `sendingOrder.js`: 添加SKU清理函数

## 预期效果

### 修复前
```
SKU: "26_default_z90bu7b5"  // ❌ 包含设备ID后缀
```

### 修复后  
```
SKU: "26"  // ✅ 清洁的原始SKU
```

## 测试建议

1. **功能测试**
   - 添加订单项，检查Firebase中存储的数据
   - 发送订单，验证后端收到的SKU格式
   - 检查不同设备间的订单同步

2. **边界情况测试**
   - 测试没有选项的商品
   - 测试有复杂选项的商品  
   - 测试多设备同时操作

3. **兼容性测试**
   - 验证现有订单数据的兼容性
   - 确认UI显示正常
   - 检查订单历史数据

## 风险评估
- ✅ 低风险：只影响SKU提取逻辑，不改变核心业务流程
- ✅ 向后兼容：现有数据继续正常工作
- ✅ 故障转移：如果提取失败，会使用原始值作为备用

## 监控要点
- 监控订单发送日志，确认SKU格式正确
- 检查厨房系统是否正确识别商品
- 观察是否还有其他异常后缀出现