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
                    data[collectionName] = collectionData;
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
            await database.ref(`${restaurantPath}/menukaart/${itemId}`).update(itemData);
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
            
            await database.ref(`${restaurantPath}/menukaart/${itemId}`).set({
                ...itemData,
                itemId: itemId, // itemId字段也设置为SKU
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            });
            
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
            
            if (Object.keys(updates).length > 0) {
                await database.ref().update(updates);
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
    async renumberAllMenuItems() {
        try {
            const database = firebase.database();
            const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
            
            // First, get all menu items
            const snapshot = await database.ref(`${restaurantPath}/menukaart`).once('value');
            const menuData = snapshot.val();
            
            if (!menuData) {
                console.log('No menu data found for renumbering');
                return false;
            }
            
            // Convert to array and sort by current sortingNrm
            const menuItems = Object.entries(menuData)
                .map(([id, item]) => ({ id, ...item }))
                .filter(item => item.id !== 'exceptions') // Exclude exceptions node
                .sort((a, b) => (a.sortingNrm || 999) - (b.sortingNrm || 999));
            
            // Create batch updates for sequential numbering
            const updates = {};
            menuItems.forEach((item, index) => {
                const newSortingNrm = index + 1; // Start from 1
                updates[`${restaurantPath}/menukaart/${item.id}/sortingNrm`] = newSortingNrm;
            });
            
            // Apply all updates at once
            await database.ref().update(updates);
            
            console.log(`✅ Successfully renumbered ${menuItems.length} menu items`);
            return true;
        } catch (error) {
            console.error('Error renumbering menu items:', error);
            throw error;
        }
    }
};

console.log('✅ RestaurantDataOperations 模块加载完成 - 包含桌台管理功能');