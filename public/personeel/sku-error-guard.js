// SKU 错误防护与验证模块
// 确保SKU相关操作的稳定性，防止客户端问题导致系统崩溃

class SKUErrorGuard {
    constructor() {
        this.validationRules = {
            // SKU格式验证规则
            skuPattern: /^[A-Za-z0-9\-_]+$/,
            maxLength: 50,
            minLength: 1
        };
        
        this.fallbackSKU = "ERROR_SKU";
        this.errorCount = 0;
        this.maxErrors = 10; // 最大错误次数
    }

    /**
     * 验证SKU格式是否有效
     * @param {*} sku - 待验证的SKU
     * @returns {boolean} - 是否有效
     */
    isValidSKU(sku) {
        try {
            // 基本类型检查
            if (!sku || typeof sku !== 'string' && typeof sku !== 'number') {
                return false;
            }
            
            // 转换为字符串
            const skuStr = String(sku).trim();
            
            // 长度检查
            if (skuStr.length < this.validationRules.minLength || 
                skuStr.length > this.validationRules.maxLength) {
                return false;
            }
            
            // 格式检查
            return this.validationRules.skuPattern.test(skuStr);
        } catch (error) {
            console.error('SKU验证过程出错:', error);
            return false;
        }
    }

    /**
     * 清理和标准化SKU
     * @param {*} sku - 原始SKU
     * @returns {string} - 标准化后的SKU
     */
    sanitizeSKU(sku) {
        try {
            if (!sku) return this.fallbackSKU;
            
            // 转换为字符串并清理
            let cleanSKU = String(sku)
                .trim()
                .replace(/[^A-Za-z0-9\-_]/g, '_') // 替换非法字符
                .substring(0, this.validationRules.maxLength); // 截断过长内容
            
            // 确保不为空
            if (!cleanSKU) {
                cleanSKU = this.fallbackSKU;
            }
            
            return cleanSKU;
        } catch (error) {
            console.error('SKU清理过程出错:', error);
            return this.fallbackSKU;
        }
    }

    /**
     * 验证菜单项的SKU完整性
     * @param {Object} menuItem - 菜单项
     * @returns {Object} - 验证并修复后的菜单项
     */
    validateMenuItem(menuItem) {
        try {
            if (!menuItem || typeof menuItem !== 'object') {
                throw new Error('无效的菜单项');
            }

            // 确保SKU存在且有效
            if (!this.isValidSKU(menuItem.sku)) {
                console.warn(`无效SKU检测到: ${menuItem.sku}, 使用清理后的版本`);
                menuItem.sku = this.sanitizeSKU(menuItem.sku);
            } else {
                // 标准化有效的SKU
                menuItem.sku = String(menuItem.sku).trim();
            }

            // 确保其他必需字段
            menuItem.description = menuItem.description || `商品 ${menuItem.sku}`;
            menuItem.price = typeof menuItem.price === 'number' ? menuItem.price : 0;
            menuItem.status = menuItem.status || 'beschikbaar';

            return menuItem;
        } catch (error) {
            this.logError('菜单项验证失败', error, menuItem);
            
            // 返回安全的默认菜单项
            return {
                sku: this.fallbackSKU,
                description: '错误商品',
                price: 0,
                status: 'niet_beschikbaar'
            };
        }
    }

    /**
     * 验证订单行的SKU完整性
     * @param {Object} orderLine - 订单行
     * @returns {Object} - 验证并修复后的订单行
     */
    validateOrderLine(orderLine) {
        try {
            if (!orderLine || typeof orderLine !== 'object') {
                throw new Error('无效的订单行');
            }

            // SKU验证和修复
            if (!this.isValidSKU(orderLine.sku)) {
                console.warn(`订单中发现无效SKU: ${orderLine.sku}`);
                orderLine.sku = this.sanitizeSKU(orderLine.sku);
            } else {
                orderLine.sku = String(orderLine.sku).trim();
            }

            // 数量验证
            orderLine.quantity = typeof orderLine.quantity === 'number' && orderLine.quantity > 0 
                ? orderLine.quantity : 1;

            // 价格验证
            orderLine.price = typeof orderLine.price === 'number' && orderLine.price >= 0 
                ? orderLine.price : 0;

            // 描述验证
            orderLine.description = orderLine.description || `商品 ${orderLine.sku}`;

            return orderLine;
        } catch (error) {
            this.logError('订单行验证失败', error, orderLine);
            
            // 返回安全的默认订单行
            return {
                sku: this.fallbackSKU,
                description: '错误商品',
                quantity: 1,
                price: 0
            };
        }
    }

    /**
     * 批量验证菜单数据
     * @param {Array} menuArray - 菜单数组
     * @returns {Array} - 验证后的菜单数组
     */
    validateMenuArray(menuArray) {
        try {
            if (!Array.isArray(menuArray)) {
                throw new Error('菜单数据不是数组格式');
            }

            const validatedMenu = menuArray
                .map(item => this.validateMenuItem(item))
                .filter(item => item.sku !== this.fallbackSKU); // 过滤掉错误项

            console.log(`菜单验证完成: ${validatedMenu.length}/${menuArray.length} 项有效`);
            return validatedMenu;
        } catch (error) {
            this.logError('菜单数组验证失败', error);
            return []; // 返回空数组避免崩溃
        }
    }

    /**
     * 批量验证订单数据
     * @param {Array} orderArray - 订单数组
     * @returns {Array} - 验证后的订单数组
     */
    validateOrderArray(orderArray) {
        try {
            if (!Array.isArray(orderArray)) {
                throw new Error('订单数据不是数组格式');
            }

            const validatedOrder = orderArray
                .map(line => this.validateOrderLine(line))
                .filter(line => line.sku !== this.fallbackSKU); // 过滤掉错误项

            console.log(`订单验证完成: ${validatedOrder.length}/${orderArray.length} 项有效`);
            return validatedOrder;
        } catch (error) {
            this.logError('订单数组验证失败', error);
            return []; // 返回空数组避免崩溃
        }
    }

    /**
     * 记录错误并判断是否需要紧急处理
     * @param {string} message - 错误消息
     * @param {Error} error - 错误对象
     * @param {*} data - 相关数据
     */
    logError(message, error, data = null) {
        this.errorCount++;
        
        console.error(`[SKU错误防护] ${message}:`, {
            error: error.message,
            stack: error.stack,
            data: data,
            errorCount: this.errorCount
        });

        // 错误次数过多时的紧急处理
        if (this.errorCount > this.maxErrors) {
            console.error('SKU错误次数过多，可能存在严重问题！');
            
            // 显示用户友好的错误提示
            if (typeof showNotification === 'function') {
                showNotification(
                    'Systeem heeft meerdere fouten gedetecteerd. Probeer de pagina te verversen.', 
                    'error', 
                    8000
                );
            }
            
            // 重置错误计数避免无限循环
            this.errorCount = 0;
        }
    }

    /**
     * 重置错误计数
     */
    resetErrorCount() {
        this.errorCount = 0;
    }

    /**
     * 获取系统状态
     * @returns {Object} - 状态信息
     */
    getStatus() {
        return {
            errorCount: this.errorCount,
            maxErrors: this.maxErrors,
            isHealthy: this.errorCount < this.maxErrors / 2
        };
    }
}

// 创建全局实例
const SKUGuard = new SKUErrorGuard();

// 导出到window对象供其他脚本使用
window.SKUGuard = SKUGuard;

console.log('✅ SKU错误防护模块已加载');