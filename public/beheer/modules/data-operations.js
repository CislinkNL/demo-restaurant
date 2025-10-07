// 餐厅数据操作模块 - 修复版本
// Restaurant Data Operations Module - Fixed Version

// 立即定义并导出对象，避免重复声明问题
window.RestaurantDataOperations = {
    // Load restaurant data from Firebase Realtime Database
    async loadRestaurantData() {
        try {
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase 未加载');
            }
            
            const database = firebase.database();
            const data = {};

            // Load main collections from restaurant path
            const collections = ['config', 'menukaart', 'categorie', 'tafel'];
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';

            for (const collectionName of collections) {
                console.log(`Loading ${restaurantPath}/${collectionName}...`);
                const snapshot = await database.ref(`${restaurantPath}/${collectionName}`).once('value');
                const collectionData = snapshot.val();

                if (collectionData) {
                    // 对于 menukaart，排除 exceptions 键
                    if (collectionName === 'menukaart' && collectionData.exceptions) {
                        console.log('⚠️ 从 menukaart 数据中排除 exceptions');
                        const { exceptions, ...menukaartWithoutExceptions } = collectionData;
                        data[collectionName] = menukaartWithoutExceptions;
                    } else {
                        data[collectionName] = collectionData;
                    }
                } else {
                    data[collectionName] = {};
                }
            }

            console.log('Loaded restaurant data:', Object.keys(data));
            return data;
        } catch (error) {
            console.error('Error loading restaurant data:', error);
            throw error;
        }
    },

    // Save menu item (complete item data)
    async saveMenuItem(itemId, itemData) {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            
            // 检查sortingNrm是否与其他项重复
            let hasDuplicateSortingNrm = false;
            if (itemData.sortingNrm !== undefined) {
                const allItems = await database.ref(`${restaurantPath}/menukaart`).once('value');
                const menuData = allItems.val();
                
                if (menuData) {
                    // 检查是否有其他菜单项使用相同的sortingNrm(排除当前项)
                    hasDuplicateSortingNrm = Object.entries(menuData).some(([key, item]) => {
                        return key !== itemId &&                    // 排除当前编辑的项
                               key !== 'exceptions' && 
                               typeof item === 'object' && 
                               item !== null &&
                               item.sortingNrm === itemData.sortingNrm;
                    });
                    
                    if (hasDuplicateSortingNrm) {
                        console.log(`⚠️ 检测到重复的sortingNrm: ${itemData.sortingNrm}, 保存后将自动重新排序`);
                    }
                }
            }
            
            // 保存菜单项
            await database.ref(`${restaurantPath}/menukaart/${itemId}`).update(itemData);
            console.log(`✅ 菜单项已保存: SKU=${itemId}, sortingNrm=${itemData.sortingNrm}`);
            
            // 如果检测到重复的sortingNrm,自动运行重新排序
            if (hasDuplicateSortingNrm) {
                console.log('🔄 开始自动重新排序以解决重复序号...');
                try {
                    await this.renumberAllMenuItems();
                    console.log('✅ 自动重新排序完成');
                } catch (renumberError) {
                    console.warn('⚠️ 自动重新排序失败:', renumberError);
                    // 不抛出错误,因为菜单项已成功保存
                }
            }
            
            return itemId;
        } catch (error) {
            console.error('Error saving menu item:', error);
            throw error;
        }
    },

    // Add new menu item
    async addMenuItem(itemData) {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            
            // 使用SKU作为key，而不是随机生成的key
            if (!itemData.sku) {
                throw new Error('SKU is required to add menu item');
            }
            
            const itemId = itemData.sku; // 使用SKU作为Firebase key
            
            // 检查SKU是否已存在
            const existingItem = await database.ref(`${restaurantPath}/menukaart/${itemId}`).once('value');
            if (existingItem.exists()) {
                throw new Error(`SKU "${itemId}" already exists`);
            }
            
            // 检查sortingNrm是否与现有项重复
            let hasDuplicateSortingNrm = false;
            if (itemData.sortingNrm) {
                const allItems = await database.ref(`${restaurantPath}/menukaart`).once('value');
                const menuData = allItems.val();
                
                if (menuData) {
                    // 检查是否有其他菜单项使用相同的sortingNrm
                    hasDuplicateSortingNrm = Object.entries(menuData).some(([key, item]) => {
                        return key !== 'exceptions' && 
                               typeof item === 'object' && 
                               item !== null &&
                               item.sortingNrm === itemData.sortingNrm;
                    });
                    
                    if (hasDuplicateSortingNrm) {
                        console.log(`⚠️ 检测到重复的sortingNrm: ${itemData.sortingNrm}, 添加后将自动重新排序`);
                    }
                }
            }
            
            // 添加菜单项
            await database.ref(`${restaurantPath}/menukaart/${itemId}`).set({
                ...itemData,
                itemId: itemId, // itemId字段也设置为SKU
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            });
            
            console.log(`✅ 菜单项已添加: SKU=${itemId}, sortingNrm=${itemData.sortingNrm}`);
            
            // 如果检测到重复的sortingNrm,自动运行重新排序
            if (hasDuplicateSortingNrm) {
                console.log('🔄 开始自动重新排序以解决重复序号...');
                try {
                    await this.renumberAllMenuItems();
                    console.log('✅ 自动重新排序完成');
                } catch (renumberError) {
                    console.warn('⚠️ 自动重新排序失败:', renumberError);
                    // 不抛出错误,因为菜单项已成功添加
                }
            }
            
            return itemId;
        } catch (error) {
            console.error('Error adding menu item:', error);
            throw error;
        }
    },

    // Delete menu item
    async deleteMenuItem(itemId) {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            await database.ref(`${restaurantPath}/menukaart/${itemId}`).remove();
            return true;
        } catch (error) {
            console.error('Error deleting menu item:', error);
            throw error;
        }
    },

    // Save categories
    async saveCategories(categories) {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            await database.ref(`${restaurantPath}/categorie`).set(categories);
            return true;
        } catch (error) {
            console.error('Error saving categories:', error);
            throw error;
        }
    },

    // Save config
    async saveConfig(config) {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            await database.ref(`${restaurantPath}/config`).update(config);
            return true;
        } catch (error) {
            console.error('Error saving config:', error);
            throw error;
        }
    },

    // Get all tables
    async loadTables() {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            const snapshot = await database.ref(`${restaurantPath}/tafel`).once('value');
            return snapshot.val() || {};
        } catch (error) {
            console.error('Error loading tables:', error);
            throw error;
        }
    },

    // Save/Update table
    async saveTable(tableId, tableData) {
        try {
            console.log('🔧 [data-operations] saveTable 被调用:');
            console.log('  - tableId:', tableId);
            console.log('  - tableData:', tableData);
            console.log('  - tableData.orders:', tableData.orders);
            console.log('  - tableData.orders.menu:', tableData.orders?.menu);
            
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            
            const updates = {};
            
            if (tableData.Persons !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/Persons`] = parseInt(tableData.Persons) || 2;
            }
            if (tableData.Pincode !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/Pincode`] = tableData.Pincode;
            }
            if (tableData.Status !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/Status`] = tableData.Status;
            }
            if (tableData.URL !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/URL`] = tableData.URL;
            }
            if (tableData.menuType !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/menuType`] = tableData.menuType;
            }
            if (tableData.orders !== undefined) {
                console.log('  ✅ orders 字段存在，添加到 updates');
                updates[`${restaurantPath}/tafel/${tableId}/orders`] = tableData.orders;
            } else {
                console.log('  ⚠️ orders 字段不存在于 tableData');
            }
            
            console.log('🔧 [data-operations] 准备更新的数据:', updates);
            
            if (Object.keys(updates).length > 0) {
                await database.ref().update(updates);
                console.log('✅ [data-operations] 数据库更新完成');
            } else {
                console.log('⚠️ [data-operations] 没有需要更新的数据');
            }
            
            return tableId;
        } catch (error) {
            console.error('Error saving table:', error);
            throw error;
        }
    },

    // Exchange sorting positions between two menu items
    async exchangeSortingPositions(itemId1, itemId2, sort1, sort2) {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            
            const updates = {};
            updates[`${restaurantPath}/menukaart/${itemId1}/sortingNrm`] = sort2;
            updates[`${restaurantPath}/menukaart/${itemId2}/sortingNrm`] = sort1;
            
            await database.ref().update(updates);
            
            console.log(`✅ 成功交换排序位置: ${itemId1}(${sort1}->${sort2}) <-> ${itemId2}(${sort2}->${sort1})`);
            return true;
        } catch (error) {
            console.error('Error exchanging sorting positions:', error);
            throw error;
        }
    },

    /**
     * 生成4位数的桌台PIN码
     * @returns {string} 4位数的PIN码
     */
    generatePincode: function() {
        // 生成4位随机数字PIN码 (1000-9999)
        const pin = Math.floor(Math.random() * 9000) + 1000;
        return pin.toString();
    },

    /**
     * 更新桌台状态
     * @param {string} tableId - 桌台ID
     * @param {string} status - 新状态 ('occupied', 'available', 'reserved')
     * @param {string} pincode - 如果需要的话，PIN码
     * @returns {Promise<boolean>} 更新是否成功
     */
    updateTableStatus: async function(tableId, status, pincode = null) {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            
            const updates = {};
            updates[`${restaurantPath}/tafel/${tableId}/Status`] = status;
            
            if (pincode) {
                updates[`${restaurantPath}/tafel/${tableId}/pincode`] = pincode;
            }
            
            // 根据状态设置时间戳
            if (status === 'occupied') {
                updates[`${restaurantPath}/tafel/${tableId}/occupiedAt`] = Date.now();
            } else if (status === 'available') {
                updates[`${restaurantPath}/tafel/${tableId}/clearedAt`] = Date.now();
                // 清除PIN码
                updates[`${restaurantPath}/tafel/${tableId}/pincode`] = null;
            }
            
            await database.ref().update(updates);
            console.log(`✅ 桌台${tableId}状态已更新为: ${status}`);
            return true;
        } catch (error) {
            console.error('Error updating table status:', error);
            throw error;
        }
    },

    /**
     * 添加新桌台
     * @param {Object} tableData - 桌台数据
     * @returns {Promise<string>} 桌台ID
     */
    async addTable(tableData) {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            
            // 生成新的桌台ID
            const tableId = `Tafel-${tableData.TableOrder || Date.now()}`;
            
            // 当前时间戳作为startTime
            const now = Date.now();
            const startTime = now;
            const endTime = now + (1 * 60 * 1000); // startTime + 1分钟
            
            // 完整的桌台数据结构
            const completeTableData = {
                TableOrder: tableData.TableOrder || Object.keys(await this.loadTables()).length + 1,
                Status: tableData.Status || 'open',
                Persons: parseInt(tableData.Persons) || 4,
                Pincode: tableData.Pincode || null,
                URL: tableData.URL || '',
                orders: tableData.orders || { 
                    menu: '', 
                    totaalPrijs: 0, 
                    history: {} 
                },
                timer: {
                    duration: tableData.timer?.duration || 15,
                    startTime: startTime,
                    endTime: endTime
                },
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
            
            await database.ref(`${restaurantPath}/tafel/${tableId}`).set(completeTableData);
            console.log(`✅ 成功添加新桌台: ${tableId}`, completeTableData);
            return tableId;
        } catch (error) {
            console.error('Error adding table:', error);
            throw error;
        }
    },

    /**
     * 批量更新所有桌台的PIN码
     * @param {string} newPincode - 新的PIN码
     * @returns {Promise<boolean>} 更新是否成功
     */
    async batchUpdateTablePincodes(newPincode) {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            
            // 获取所有桌台
            const tablesSnapshot = await database.ref(`${restaurantPath}/tafel`).once('value');
            const tables = tablesSnapshot.val();
            
            if (!tables) {
                throw new Error('没有找到桌台数据');
            }
            
            // 准备批量更新
            const updates = {};
            Object.keys(tables).forEach(tableId => {
                updates[`${restaurantPath}/tafel/${tableId}/Pincode`] = newPincode;
            });
            
            // 添加更新时间戳
            updates[`${restaurantPath}/config/pincodeLastUpdated`] = firebase.database.ServerValue.TIMESTAMP;
            
            // 执行批量更新
            await database.ref().update(updates);
            
            console.log(`✅ 成功批量更新 ${Object.keys(tables).length} 个桌台的PIN码`);
            return true;
        } catch (error) {
            console.error('Error batch updating table pincodes:', error);
            throw error;
        }
    },

    /**
     * 生成随机PIN码
     * @param {number} length - PIN码长度 (3或4位)
     * @returns {string} 生成的PIN码
     */
    generateRandomPincode(length = 4) {
        const min = length === 3 ? 100 : 1000;
        const max = length === 3 ? 999 : 9999;
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    },

    // Automatically renumber all menu items to ensure sequential order
    // 重要原则: sortingNrm永远是SKU节点下的子项,不能作为独立key!
    async renumberAllMenuItems() {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            
            // 获取所有菜单数据
            const snapshot = await database.ref(`${restaurantPath}/menukaart`).once('value');
            const menuData = snapshot.val();
            
            if (!menuData) {
                console.log('No menu data found for renumbering');
                return false;
            }
            
            console.log('📋 开始重新排序,menukaart中的所有键:', Object.keys(menuData));
            
            // 筛选有效菜单项
            // 原则: 只有包含description字段的对象才是真实菜单项
            const validMenuItems = Object.entries(menuData)
                .filter(([sku, item]) => {
                    // 排除系统配置节点
                    if (sku === 'exceptions') {
                        console.log('⏭️ 跳过系统配置: exceptions');
                        return false;
                    }
                    
                    // 只接受对象类型且有description的项
                    if (typeof item !== 'object' || item === null) {
                        console.log(`❌ 跳过非对象节点: ${sku} (type: ${typeof item})`);
                        return false;
                    }
                    
                    if (!item.description) {
                        console.log(`❌ 跳过无description的节点: ${sku}`);
                        return false;
                    }
                    
                    return true;
                })
                .map(([sku, item]) => ({
                    sku: sku,  // SKU作为唯一标识
                    description: item.description,
                    currentSortingNrm: item.sortingNrm || 999
                }))
                .sort((a, b) => a.currentSortingNrm - b.currentSortingNrm);
            
            const totalItems = validMenuItems.length;
            console.log(`✅ 找到 ${totalItems} 个有效菜单项`);
            
            // 生成更新对象
            // 关键: 更新路径必须是 menukaart/{SKU}/sortingNrm
            const updates = {};
            
            validMenuItems.forEach((item, index) => {
                const newSortingNrm = index + 1; // 从1开始的连续序号
                const updatePath = `${restaurantPath}/menukaart/${item.sku}/sortingNrm`;
                updates[updatePath] = newSortingNrm;
                
                console.log(`📝 ${index + 1}/${totalItems}: SKU=${item.sku}, ${item.currentSortingNrm} → ${newSortingNrm}`);
            });
            
            // 清理可能存在的无效独立键
            // 如果menukaart下有sortingNrm, config等独立键(非对象),删除它们
            ['sortingNrm', 'config', 'settings'].forEach(key => {
                if (menuData.hasOwnProperty(key) && typeof menuData[key] !== 'object') {
                    updates[`${restaurantPath}/menukaart/${key}`] = null;
                    console.log(`🧹 删除无效独立键: ${key}`);
                }
            });
            
            // 执行批量更新
            console.log('� 开始更新数据库...');
            await database.ref().update(updates);
            
            console.log(`✅ 重新排序完成! 共更新 ${totalItems} 个菜单项, 序号范围: 1-${totalItems}`);
            return true;
            
        } catch (error) {
            console.error('❌ 重新排序失败:', error);
            throw error;
        }
    }
};

console.log('✅ RestaurantDataOperations 模块加载完成 - 包含桌台管理功能');
console.log('📋 可用方法:', Object.keys(window.RestaurantDataOperations));
console.log('🔍 saveConfig 方法类型:', typeof window.RestaurantDataOperations.saveConfig);