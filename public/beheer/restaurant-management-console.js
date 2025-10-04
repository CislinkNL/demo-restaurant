// Restaurant Management Console - User-friendly interface for restaurant managers
// Focuses on practical restaurant management tasks, hiding technical details

// Note: React hooks will be destructured inside the component function
// to ensure React is loaded first

// � MULTI-LANGUAGE SUPPORT SYSTEM
const LANGUAGE_TRANSLATIONS = {
    // Navigation and Main UI
    zh: {
        // Navigation
        navMenu: '菜单管理',
        navSettings: '系统设置', 
        navTables: '桌台管理',
        
        // Main Headers
        restaurantConsole: '餐厅管理控制台',
        menuManagement: '📋 菜单管理',
        settingsTitle: '🔧 餐厅设置',
        tablesTitle: '🍽️ 桌台管理',
        
        // Settings Panel
        basicSettings: '📋 基础设置',
        restaurantName: '餐厅名称:',
        maxTime: '最大时间 (分钟):',
        roundTime: '轮次时间 (分钟):',
        foodLimit: '食物限制:',
        dessertLimit: '甜品限制:',
        enableTimeLimit: '启用时间限制',
        requirePinToClose: '关闭桌台需要PIN',
        
        // Admin Password
        adminPassword: '🔐 管理员密码',
        currentPassword: '当前密码:',
        change: '修改',
        cancel: '取消',
        enterCurrentPassword: '输入当前密码:',
        newPassword: '新密码:',
        confirmPassword: '确认新密码:',
        updatePassword: '更新密码',
        
        // WhatsApp Settings
        whatsappSettings: '📱 WhatsApp设置',
        enableWhatsapp: '启用WhatsApp消息',
        whatsappRecipients: 'WhatsApp收件人:',
        addRecipient: '+ 添加',
        
        // Table Management
        tableManagement: '🍽️ 桌台管理',
        menuTypeControl: '🕒 菜单类型控制',
        currentTime: '当前时间:',
        autoMode: '自动模式:',
        autoModeRule: '16点前午餐,16点后晚餐',
        setAllLunch: '🌅 全部设为午餐',
        setAllDinner: '🌆 全部设为晚餐',
        autoTimeSwitch: '🔄 立即执行时间自动切换',
        bulkPinManagement: '🔐 批量PIN管理',
        allRandomPin: '🎲 All Random PIN',
        allFixedPin: '📌 All Fixed PIN',
        
        // Common Actions
        saveSettings: '💾 保存设置',
        confirm: '确认',
        
        // Confirm Messages
        confirmSetAllLunch: '确认将所有桌台设置为午餐模式?',
        confirmSetAllDinner: '确认将所有桌台设置为晚餐模式?',
        confirmAutoSwitch: '将根据时间规则设置所有桌台为{mode}模式，确认执行?',
        confirmRandomPin: '确认将所有桌 PIN 重置为随机 4 位?',
        confirmFixedPin: '确认将所有桌 PIN 设为 {pin}?',
        
        // Status Messages
        allTablesSetToLunch: '所有桌台已设置为午餐模式',
        allTablesSetToDinner: '所有桌台已设置为晚餐模式',
        autoSwitchComplete: '所有桌台已根据当前时间({hour}点)设置为{mode}模式',
        randomPinComplete: '全部随机 PIN 完成',
        fixedPinComplete: '全部固定 PIN 更新完成',
        settingsFailed: '设置失败: ',
        autoSwitchFailed: '自动切换失败: ',
        
        // Time-related
        lunch: '午餐',
        dinner: '晚餐',
        currentTimeIs: '当前时间',
        hour: '点'
    },
    
    en: {
        // Navigation
        navMenu: 'Menu Management',
        navSettings: 'Settings',
        navTables: 'Tables',
        
        // Main Headers
        restaurantConsole: 'Restaurant Management Console',
        menuManagement: '📋 Menu Management',
        settingsTitle: '🔧 Restaurant Settings',
        tablesTitle: '🍽️ Table Management',
        
        // Settings Panel
        basicSettings: '📋 Basic Settings',
        restaurantName: 'Restaurant Name:',
        maxTime: 'Max Time (minutes):',
        roundTime: 'Round Time (minutes):',
        foodLimit: 'Food Limit:',
        dessertLimit: 'Dessert Limit:',
        enableTimeLimit: 'Enable Time Limit',
        requirePinToClose: 'Require PIN to close tables',
        
        // Admin Password
        adminPassword: '🔐 Admin Password',
        currentPassword: 'Current Password:',
        change: 'Change',
        cancel: 'Cancel',
        enterCurrentPassword: 'Enter Current Password:',
        newPassword: 'New Password:',
        confirmPassword: 'Confirm New Password:',
        updatePassword: 'Update Password',
        
        // WhatsApp Settings
        whatsappSettings: '📱 WhatsApp Settings',
        enableWhatsapp: 'Enable WhatsApp Messages',
        whatsappRecipients: 'WhatsApp Recipients:',
        addRecipient: '+ Add',
        
        // Table Management
        tableManagement: '🍽️ Table Management',
        menuTypeControl: '🕒 Menu Type Control',
        currentTime: 'Current Time:',
        autoMode: 'Auto Mode:',
        autoModeRule: 'Lunch before 4PM, Dinner after 4PM',
        setAllLunch: '🌅 Set All to Lunch',
        setAllDinner: '🌆 Set All to Dinner',
        autoTimeSwitch: '🔄 Execute Auto Time Switch',
        bulkPinManagement: '🔐 Bulk PIN Management',
        allRandomPin: '🎲 All Random PIN',
        allFixedPin: '📌 All Fixed PIN',
        
        // Common Actions
        saveSettings: '💾 Save Settings',
        confirm: 'Confirm',
        
        // Confirm Messages
        confirmSetAllLunch: 'Confirm to set all tables to Lunch mode?',
        confirmSetAllDinner: 'Confirm to set all tables to Dinner mode?',
        confirmAutoSwitch: 'Will set all tables to {mode} mode based on time rule. Confirm execution?',
        confirmRandomPin: 'Confirm to reset all table PINs to random 4 digits?',
        confirmFixedPin: 'Confirm to set all table PINs to {pin}?',
        
        // Status Messages
        allTablesSetToLunch: 'All tables have been set to Lunch mode',
        allTablesSetToDinner: 'All tables have been set to Dinner mode',
        autoSwitchComplete: 'All tables have been set to {mode} mode based on current time ({hour} o\'clock)',
        randomPinComplete: 'All random PINs completed',
        fixedPinComplete: 'All fixed PINs updated',
        settingsFailed: 'Settings failed: ',
        autoSwitchFailed: 'Auto switch failed: ',
        
        // Time-related
        lunch: 'Lunch',
        dinner: 'Dinner',
        currentTimeIs: 'Current time is',
        hour: 'o\'clock'
    },
    
    nl: {
        // Navigation
        navMenu: 'Menu Beheer',
        navSettings: 'Instellingen',
        navTables: 'Tafels',
        
        // Main Headers
        restaurantConsole: 'Restaurant Beheerconsole',
        menuManagement: '📋 Menu Beheer',
        settingsTitle: '🔧 Restaurant Instellingen',
        tablesTitle: '🍽️ Tafel Beheer',
        
        // Settings Panel
        basicSettings: '📋 Basis Instellingen',
        restaurantName: 'Restaurant Naam:',
        maxTime: 'Max Tijd (minuten):',
        roundTime: 'Ronde Tijd (minuten):',
        foodLimit: 'Voedsel Limiet:',
        dessertLimit: 'Dessert Limiet:',
        enableTimeLimit: 'Tijd Limiet Inschakelen',
        requirePinToClose: 'PIN vereist om tafels te sluiten',
        
        // Admin Password
        adminPassword: '🔐 Beheerder Wachtwoord',
        currentPassword: 'Huidig Wachtwoord:',
        change: 'Wijzigen',
        cancel: 'Annuleren',
        enterCurrentPassword: 'Voer Huidig Wachtwoord In:',
        newPassword: 'Nieuw Wachtwoord:',
        confirmPassword: 'Bevestig Nieuw Wachtwoord:',
        updatePassword: 'Wachtwoord Bijwerken',
        
        // WhatsApp Settings
        whatsappSettings: '📱 WhatsApp Instellingen',
        enableWhatsapp: 'WhatsApp Berichten Inschakelen',
        whatsappRecipients: 'WhatsApp Ontvangers:',
        addRecipient: '+ Toevoegen',
        
        // Table Management
        tableManagement: '🍽️ Tafel Beheer',
        menuTypeControl: '🕒 Menu Type Controle',
        currentTime: 'Huidige Tijd:',
        autoMode: 'Auto Modus:',
        autoModeRule: 'Lunch voor 16:00, Diner na 16:00',
        setAllLunch: '🌅 Alles naar Lunch',
        setAllDinner: '🌆 Alles naar Diner',
        autoTimeSwitch: '🔄 Voer Auto Tijd Wissel Uit',
        bulkPinManagement: '🔐 Bulk PIN Beheer',
        allRandomPin: '🎲 Alle Willekeurige PIN',
        allFixedPin: '📌 Alle Vaste PIN',
        
        // Common Actions
        saveSettings: '💾 Instellingen Opslaan',
        confirm: 'Bevestigen',
        
        // Confirm Messages
        confirmSetAllLunch: 'Bevestig om alle tafels naar Lunch modus te zetten?',
        confirmSetAllDinner: 'Bevestig om alle tafels naar Diner modus te zetten?',
        confirmAutoSwitch: 'Zal alle tafels naar {mode} modus zetten op basis van tijdregel. Uitvoering bevestigen?',
        confirmRandomPin: 'Bevestig om alle tafel PINs te resetten naar willekeurige 4 cijfers?',
        confirmFixedPin: 'Bevestig om alle tafel PINs naar {pin} te zetten?',
        
        // Status Messages
        allTablesSetToLunch: 'Alle tafels zijn naar Lunch modus gezet',
        allTablesSetToDinner: 'Alle tafels zijn naar Diner modus gezet',
        autoSwitchComplete: 'Alle tafels zijn naar {mode} modus gezet op basis van huidige tijd ({hour} uur)',
        randomPinComplete: 'Alle willekeurige PINs voltooid',
        fixedPinComplete: 'Alle vaste PINs bijgewerkt',
        settingsFailed: 'Instellingen mislukt: ',
        autoSwitchFailed: 'Auto wissel mislukt: ',
        
        // Time-related
        lunch: 'Lunch',
        dinner: 'Diner',
        currentTimeIs: 'Huidige tijd is',
        hour: 'uur'
    }
};

// Helper function to get restaurant path
const getRestaurantPathConsole = () => (window.getRestaurantPath ? window.getRestaurantPath() : window.RESTAURANT_CONFIG?.restaurantPath);

const formatCurrencyConsole = (amount) => {
    if (typeof window.formatRestaurantCurrency === 'function') {
        return window.formatRestaurantCurrency(amount);
    }

    const config = window.RESTAURANT_CONFIG;
    const formatted = (amount || 0).toFixed(2);

    if (!config) {
        return formatted;
    }

    return config.currencyPosition === 'before'
        ? `${config.currency}${formatted}`
        : `${formatted} ${config.currency}`;
};

if (typeof window !== 'undefined' && typeof window.formatRestaurantCurrency !== 'function') {
    window.formatRestaurantCurrency = formatCurrencyConsole;
}

// Restaurant Data Operations
const RestaurantDataOperations = {
    // Load restaurant data from Firebase Realtime Database
    async loadRestaurantData() {
        try {
            const database = firebase.database();
            const data = {};

            // Load main collections from restaurant path
            const collections = ['config', 'menukaart', 'categorie', 'tafel'];
            const restaurantPath = getRestaurantPathConsole(); // Use centralized config

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
            const restaurantPath = getRestaurantPathConsole();
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
            const restaurantPath = getRestaurantPathConsole();
            const menuRef = database.ref(`${restaurantPath}/menukaart`);

            // Use SKU as the ID - no dynamic ID generation
            const itemId = itemData.sku;
            if (!itemId) {
                throw new Error('SKU is required and will be used as the item ID');
            }

            // Check if item with this SKU already exists
            const existingItemSnapshot = await database.ref(`${restaurantPath}/menukaart/${itemId}`).once('value');
            if (existingItemSnapshot.exists()) {
                throw new Error(`An item with SKU ${itemId} already exists`);
            }

            // Create the new item using SKU as both id and key
            const newItem = {
                id: itemId,  // Use SKU as ID
                description: itemData.description || 'New Item',
                price: itemData.price || 0,
                sku: itemId,  // SKU same as ID
                status: itemData.status || 'beschikbaar',
                sortingNrm: itemData.sortingNrm || 999,
                group: itemData.group || 'geen',
                taxRate: itemData.taxRate || 0,
                allergy: itemData.allergy || '',
                image: itemData.image || '',
                menuType: itemData.menuType || 'dinner',
                ...itemData,
                id: itemId,  // Ensure ID stays as SKU
                sku: itemId   // Ensure SKU stays as ID
            };

            await database.ref(`${restaurantPath}/menukaart/${itemId}`).set(newItem);
            return itemId;  // Return SKU as the ID
        } catch (error) {
            console.error('Error adding menu item:', error);
            throw error;
        }
    },

    // Delete menu item
    async deleteMenuItem(itemId) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            await database.ref(`${restaurantPath}/menukaart/${itemId}`).remove();
            return true;
        } catch (error) {
            console.error('Error deleting menu item:', error);
            throw error;
        }
    },

    // Smart sorting order update - handles position insertion and reordering
    async updateSortingOrderSmart(itemId, newSortingNrm, allMenuItems) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();

            // Get all items except the one being moved
            const otherItems = allMenuItems.filter(item => item.id !== itemId);
            const movingItem = allMenuItems.find(item => item.id === itemId);

            if (!movingItem) throw new Error('Item not found');

            // Sort other items by sortingNrm
            otherItems.sort((a, b) => (a.sortingNrm || 0) - (b.sortingNrm || 0));

            // Find insertion point
            let insertIndex = 0;
            for (let i = 0; i < otherItems.length; i++) {
                if ((otherItems[i].sortingNrm || 0) < newSortingNrm) {
                    insertIndex = i + 1;
                } else {
                    break;
                }
            }

            // Create new sorted array with the moved item inserted
            const newOrderedItems = [...otherItems];
            newOrderedItems.splice(insertIndex, 0, movingItem);

            // Update sortingNrm for all affected items
            const updates = {};
            newOrderedItems.forEach((item, index) => {
                const newSorting = (index + 1) * 10; // Use increments of 10
                if (item.sortingNrm !== newSorting) {
                    updates[`${restaurantPath}/menukaart/${item.id}/sortingNrm`] = newSorting;
                }
            });

            if (Object.keys(updates).length > 0) {
                await database.ref().update(updates);
            }

            return true;
        } catch (error) {
            console.error('Error updating sorting order:', error);
            throw error;
        }
    },

    // New function for simple position exchange between two items
    async exchangeSortingPositions(itemId1, itemId2, sortValue1, sortValue2) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();

            // Create updates object to exchange sorting values
            const updates = {};
            updates[`${restaurantPath}/menukaart/${itemId1}/sortingNrm`] = sortValue2;
            updates[`${restaurantPath}/menukaart/${itemId2}/sortingNrm`] = sortValue1;

            // Execute the exchange
            await database.ref().update(updates);
            return true;
        } catch (error) {
            console.error('Error exchanging sorting positions:', error);
            throw error;
        }
    },

    // Simple sorting order update (for move up/down buttons)
    async updateSortingOrder(itemId, newSortingNrm) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            await database.ref(`${restaurantPath}/menukaart/${itemId}/sortingNrm`).set(newSortingNrm);
            return true;
        } catch (error) {
            console.error('Error updating sorting order:', error);
            throw error;
        }
    },

    // Table Management Operations - Updated for TableOrder field structure
    // Update table order (for sorting) - TableOrder is a field within each table
    async updateTableOrder(tableId, newOrder) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            await database.ref(`${restaurantPath}/tafel/${tableId}/TableOrder`).set(newOrder);
            return true;
        } catch (error) {
            console.error('Error updating table order:', error);
            throw error;
        }
    },

    // Save table data (update TableOrder field within table)
    async saveTableOrder(tableId, tableOrderValue) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            await database.ref(`${restaurantPath}/tafel/${tableId}/TableOrder`).set(tableOrderValue);
            return tableId;
        } catch (error) {
            console.error('Error saving table order:', error);
            throw error;
        }
    },

    // Save table settings (order and menuType)
    async saveTableSettings(tableId, settings) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            const updates = {};
            
            if (settings.order !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/TableOrder`] = parseInt(settings.order);
            }
            if (settings.menuType !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/menuType`] = settings.menuType;
            }
            
            await database.ref().update(updates);
            return tableId;
        } catch (error) {
            console.error('Error saving table settings:', error);
            throw error;
        }
    },

    // Save complete table data including orders
    async saveTable(tableId, tableData) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            const updates = {};
            
            // 更新所有表格字段
            if (tableData.TableOrder !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/TableOrder`] = tableData.TableOrder;
            }
            if (tableData.Status !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/Status`] = tableData.Status;
            }
            if (tableData.Persons !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/Persons`] = tableData.Persons;
            }
            if (tableData.Pincode !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/Pincode`] = tableData.Pincode;
            }
            if (tableData.URL !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/URL`] = tableData.URL;
            }
            if (tableData.menuType !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/menuType`] = tableData.menuType;
            }
            // 重要：添加orders字段的详细更新支持 - 分别更新各个子字段
            if (tableData.orders !== undefined) {
                // 更新套餐数量
                if (tableData.orders.menu !== undefined) {
                    updates[`${restaurantPath}/tafel/${tableId}/orders/menu`] = tableData.orders.menu;
                }
                // 更新总价格
                if (tableData.orders.totaalPrijs !== undefined) {
                    updates[`${restaurantPath}/tafel/${tableId}/orders/totaalPrijs`] = tableData.orders.totaalPrijs;
                }
                // 更新历史记录
                if (tableData.orders.history !== undefined) {
                    updates[`${restaurantPath}/tafel/${tableId}/orders/history`] = tableData.orders.history;
                }
                // 如果只传递了orders对象但没有具体字段，则更新整个orders对象
                if (tableData.orders.menu === undefined && tableData.orders.totaalPrijs === undefined && tableData.orders.history === undefined) {
                    updates[`${restaurantPath}/tafel/${tableId}/orders`] = tableData.orders;
                }
            }
            // 重要：添加timer字段的详细更新支持 - 智能合并timer数据
            if (tableData.timer !== undefined) {
                // 获取当前timer数据作为基础
                const currentTimerSnapshot = await database.ref(`${restaurantPath}/tafel/${tableId}/timer`).once('value');
                const currentTimer = currentTimerSnapshot.val() || {};
                
                // 智能合并timer数据
                const newTimer = { ...currentTimer };
                
                // 更新duration时，同时更新startTime和endTime为当前时间
                if (tableData.timer.duration !== undefined) {
                    const currentTime = Date.now();
                    newTimer.duration = tableData.timer.duration;
                    newTimer.startTime = currentTime;
                    newTimer.endTime = currentTime;
                }
                
                // 保留其他现有字段，只覆盖明确提供的字段
                Object.keys(tableData.timer).forEach(key => {
                    if (key !== 'duration' && tableData.timer[key] !== undefined) {
                        newTimer[key] = tableData.timer[key];
                    }
                });
                
                updates[`${restaurantPath}/tafel/${tableId}/timer`] = newTimer;
            }
            
            console.log('🔄 保存桌台数据到数据库:', { tableId, updates });
            await database.ref().update(updates);
            return tableId;
        } catch (error) {
            console.error('Error saving table:', error);
            throw error;
        }
    },

    // Update restaurant settings
    async updateConfig(configData) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            await database.ref(`${restaurantPath}/config`).update(configData);
            return true;
        } catch (error) {
            console.error('Error updating config:', error);
            throw error;
        }
    },

    // Import menu data (replace all menu items)
    async importMenuData(menuData) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            await database.ref(`${restaurantPath}/menukaart`).set(menuData);
            return true;
        } catch (error) {
            console.error('Error importing menu data:', error);
            throw error;
        }
    }
};

// Enhanced Menu Item Edit Modal
function MenuItemEditModal({ item, isOpen, onClose, onSave, allMenuItems }) {
    // Ensure React hooks are available in this scope
    const useState = React.useState;
    const useEffect = React.useEffect;
    const useRef = React.useRef;
    const modalRef = useRef();
    const [formData, setFormData] = useState({
        description: '',
        price: 0,
        sku: '',
        status: 'beschikbaar',
        sortingNrm: null,
        group: 'geen',
        menuType: 'dinner',
        taxRate: 0,
        allergy: '',
        image: ''
    });
    const lastItemIdRef = useRef(null);

    // Prevent modal flicker by stabilizing the modal
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.style.opacity = '1';
            modalRef.current.style.visibility = 'visible';
        }
    }, [isOpen]);

    // Only reset form when modal opens with a different item or when switching between add/edit modes
    useEffect(() => {
        if (!isOpen) return;
        
        const currentId = item?.id || 'NEW_ITEM';
        if (currentId !== lastItemIdRef.current) {
            if (item) {
                setFormData({
                    description: item.description || '',
                    price: (item.price && item.price > 0) ? item.price : '',
                    sku: item.sku || item.id || '',
                    status: item.status || 'beschikbaar',
                    sortingNrm: item.sortingNrm || null,
                    group: item.group || 'geen',
                    menuType: item.menuType || item.mealType || item.mealtype || 'dinner',
                    taxRate: item.taxRate || 0,
                    allergy: item.allergy || '',
                    image: item.image || ''
                });
            } else {
                // New item - use a consistent identifier to prevent re-triggering
                setFormData({
                    description: '',
                    price: '',
                    sku: '',
                    status: 'beschikbaar',
                    sortingNrm: null,
                    group: 'geen',
                    menuType: 'dinner',
                    taxRate: 0,
                    allergy: '',
                    image: ''
                });
            }
            lastItemIdRef.current = currentId;
        }
    }, [isOpen, item]); // Simplified dependencies to prevent unnecessary re-renders

    const handleSave = async () => {
        try {
            // Validate required fields
            if (!formData.description.trim()) {
                alert('Description is required');
                return;
            }

            if (!formData.sku.trim()) {
                alert('SKU is required');
                return;
            }

            // Check for duplicate SKU (excluding current item)
            if (allMenuItems && formData.sku) {
                const duplicateSku = allMenuItems.find(i =>
                    i.sku === formData.sku && i.id !== item?.id
                );
                if (duplicateSku) {
                    alert(`SKU ${formData.sku} is already used by another item`);
                    return;
                }
            }

            // Prepare data for saving, ensuring price is a number
            const saveData = {
                ...formData,
                price: parseFloat(formData.price) || 0
            };

            await onSave(saveData);
            onClose();
        } catch (error) {
            console.error('Error in modal handleSave:', error);
            alert('Failed to save: ' + error.message);
        }
    };

    if (!isOpen) return null;

    return React.createElement('div', { 
        className: 'modal-overlay',
        onClick: onClose,
        ref: modalRef,
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 1,
            visibility: 'visible'
        }
    },
        React.createElement('div', {
            className: 'modal-content',
            onClick: (e) => e.stopPropagation(),
            style: {
                backgroundColor: 'white',
                borderRadius: '8px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: '500px',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                opacity: 1,
                transform: 'scale(1)',
                transition: 'none' // Remove any transitions that might cause flicker
            }
        },
            React.createElement('div', { className: 'modal-header' },
                React.createElement('h3', null, item ? '✏️ Edit Menu Item' : '➕ Add New Item'),
                React.createElement('button', {
                    className: 'close-btn',
                    onClick: onClose
                }, '❌')
            ),

            React.createElement('div', { className: 'modal-form' },
                // Description
                React.createElement('div', { className: 'form-row' },
                    React.createElement('label', null, 'Description *'),
                    React.createElement('input', {
                        type: 'text',
                        value: formData.description,
                        onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                        className: 'form-input',
                        placeholder: 'Enter item description'
                    })
                ),

        // Meal Type (menuType) selector
                React.createElement('div', { className: 'form-row' },
                    React.createElement('label', null, 'Meal Type'),
                    React.createElement('select', {
            value: formData.menuType,
            onChange: (e) => setFormData({ ...formData, menuType: e.target.value })
                    },
                        React.createElement('option', { value: 'lunch' }, 'Lunch'),
                        React.createElement('option', { value: 'dinner' }, 'Dinner'),
                        React.createElement('option', { value: 'all' }, 'All Day')
                    )
                ),

                // Price and SKU row
                React.createElement('div', { className: 'form-row-split' },
                    React.createElement('div', { className: 'form-col' },
                        React.createElement('label', null, 'Price (€)'),
                        React.createElement('input', {
                            type: 'number',
                            step: '0.01',
                            min: '0',
                            value: formData.price,
                            onChange: (e) => setFormData({ ...formData, price: e.target.value }),
                            className: 'form-input',
                            placeholder: 'Enter price...'
                        })
                    ),
                    React.createElement('div', { className: 'form-col' },
                        React.createElement('label', null, 'SKU (Stock Code) *'),
                        React.createElement('input', {
                            type: 'text',
                            value: formData.sku,
                            onChange: (e) => setFormData({ ...formData, sku: e.target.value }),
                            className: 'form-input',
                            placeholder: 'Unique product code',
                            title: 'Unique identifier for this menu item (must be unique)'
                        })
                    )
                ),

                // Status and Order row
                React.createElement('div', { className: 'form-row-split' },
                    React.createElement('div', { className: 'form-col' },
                        React.createElement('label', null, 'Availability'),
                        React.createElement('select', {
                            value: formData.status,
                            onChange: (e) => setFormData({ ...formData, status: e.target.value }),
                            className: 'form-select'
                        },
                            React.createElement('option', { value: 'beschikbaar' }, '✅ Available'),
                            React.createElement('option', { value: 'niet beschikbaar' }, '❌ Unavailable')
                        )
                    ),
                    React.createElement('div', { className: 'form-col' },
                        React.createElement('label', null, 'Display Order'),
                        React.createElement('input', {
                            type: 'number',
                            min: '1',
                            value: formData.sortingNrm || '',
                            onChange: (e) => setFormData({ ...formData, sortingNrm: parseInt(e.target.value) || null }),
                            className: 'form-input',
                            placeholder: 'Enter display order...',
                            title: 'Display order in menu (lower numbers appear first, duplicates allowed)'
                        })
                    )
                ),

                // Group and Tax Rate row
                React.createElement('div', { className: 'form-row-split' },
                    React.createElement('div', { className: 'form-col' },
                        React.createElement('label', null, 'Group'),
                        React.createElement('input', {
                            type: 'text',
                            value: formData.group,
                            onChange: (e) => setFormData({ ...formData, group: e.target.value }),
                            className: 'form-input',
                            placeholder: 'e.g., groep1, groep2'
                        })
                    ),
                    React.createElement('div', { className: 'form-col' },
                        React.createElement('label', null, 'Tax Rate'),
                        React.createElement('input', {
                            type: 'number',
                            step: '0.01',
                            min: '0',
                            max: '1',
                            value: formData.taxRate,
                            onChange: (e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 }),
                            className: 'form-input',
                            placeholder: '0.21 for 21%'
                        })
                    )
                ),

                // Image URL
                React.createElement('div', { className: 'form-row' },
                    React.createElement('label', null, 'Image URL'),
                    React.createElement('input', {
                        type: 'url',
                        value: formData.image,
                        onChange: (e) => setFormData({ ...formData, image: e.target.value }),
                        className: 'form-input',
                        placeholder: 'https://example.com/image.jpg'
                    })
                ),

                // Allergy Information
                React.createElement('div', { className: 'form-row' },
                    React.createElement('label', null, 'Allergy Information'),
                    React.createElement('textarea', {
                        value: formData.allergy,
                        onChange: (e) => setFormData({ ...formData, allergy: e.target.value }),
                        className: 'form-textarea',
                        rows: 3,
                        placeholder: 'Enter allergy information and ingredients...'
                    })
                )
            ),

            React.createElement('div', { className: 'modal-actions' },
                React.createElement('button', {
                    onClick: onClose,
                    className: 'cancel-btn'
                }, 'Cancel'),
                React.createElement('button', {
                    onClick: handleSave,
                    className: 'save-btn'
                }, item ? 'Save Changes' : 'Add Item')
            )
        )
    );
}

// Enhanced Menu Item Card Component
function MenuItemCard({ item, onEdit, onDelete, onSortChange, onPositionExchange, allMenuItems }) {
    const useState = React.useState;
    const useEffect = React.useEffect;
    const [isEditing, setIsEditing] = useState(false);
    const [sortingNrm, setSortingNrm] = useState(item.sortingNrm);

    // Sync local state with item prop changes
    useEffect(() => {
        setSortingNrm(item.sortingNrm);
    }, [item.sortingNrm]);

    const handleSortChange = async (newSort) => {
        if (newSort === sortingNrm) return;

        setSortingNrm(newSort);
        try {
            await onSortChange(item.id, newSort, allMenuItems);
        } catch (error) {
            console.error('Failed to update sorting:', error);
            // Reset on error
            setSortingNrm(item.sortingNrm);
        }
    };

    const handleMoveUp = async () => {
        const currentIndex = allMenuItems.findIndex(i => i.id === item.id);
        if (currentIndex > 0) {
            const currentItem = allMenuItems[currentIndex];
            const targetItem = allMenuItems[currentIndex - 1];
            
            // Exchange sorting numbers between the two items
            const currentSort = currentItem.sortingNrm || 999;
            const targetSort = targetItem.sortingNrm || 999;
            
            try {
                // Use the new exchange function - this will update both items' states optimistically
                await onPositionExchange(currentItem.id, targetItem.id, currentSort, targetSort);
                
                // Local state will be updated by the parent's optimistic update
                // No need to manually set state here as it's handled in handlePositionExchange
            } catch (error) {
                console.error('Failed to exchange sorting positions:', error);
                alert('Failed to move item up');
            }
        }
    };

    const handleMoveDown = async () => {
        const currentIndex = allMenuItems.findIndex(i => i.id === item.id);
        if (currentIndex < allMenuItems.length - 1) {
            const currentItem = allMenuItems[currentIndex];
            const targetItem = allMenuItems[currentIndex + 1];
            
            // Exchange sorting numbers between the two items
            const currentSort = currentItem.sortingNrm || 999;
            const targetSort = targetItem.sortingNrm || 999;
            
            try {
                // Use the new exchange function - this will update both items' states optimistically
                await onPositionExchange(currentItem.id, targetItem.id, currentSort, targetSort);
                
                // Local state will be updated by the parent's optimistic update
                // No need to manually set state here as it's handled in handlePositionExchange
            } catch (error) {
                console.error('Failed to exchange sorting positions:', error);
                alert('Failed to move item down');
            }
        }
    };

    return React.createElement('div', {
        className: `menu-item-card ${item.status === 'beschikbaar' ? 'available' : 'unavailable'}`
    },
        // Item image
        React.createElement('div', { className: 'item-image' },
            item.image ?
                React.createElement('img', {
                    src: item.image,
                    alt: item.description,
                    className: 'menu-image',
                    onError: (e) => { e.target.style.display = 'none'; }
                }) :
                React.createElement('div', { className: 'no-image' },
                    React.createElement('span', { style: { fontSize: '1rem' } }, '🍽️'),
                    React.createElement('span', { style: { fontSize: '0.7rem', marginTop: '2px' } }, 'No Image')
                )
        ),

        // Item details
        React.createElement('div', { className: 'item-details' },
            React.createElement('h4', { className: 'item-title' },
                item.description || item.sku || `Item ${item.id || 'Unknown'}`
            ),
            React.createElement('div', { className: 'item-meta' },
                React.createElement('p', { className: 'item-price' }, `€${(item.price || 0).toFixed(2)}`),
                React.createElement('p', { className: 'item-sku' }, `SKU: ${item.sku || item.id}`)
            ),
            React.createElement('span', {
                className: `status-badge ${item.status === 'beschikbaar' ? 'available' : 'unavailable'}`
            }, item.status === 'beschikbaar' ? '✅ Available' : '❌ Unavailable'),

            item.allergy && React.createElement('p', {
                className: 'allergy-info',
                dangerouslySetInnerHTML: { __html: item.allergy }
            })
        ),

        // Sorting controls
        React.createElement('div', { className: 'sorting-controls' },
            React.createElement('div', { className: 'order-display' },
                React.createElement('label', null, 'Display Order: '),
                React.createElement('span', {
                    className: 'order-number',
                    title: 'Display position in menu'
                }, sortingNrm || 'N/A')
            ),
            React.createElement('div', { className: 'sort-buttons' },
                React.createElement('button', {
                    onClick: handleMoveUp,
                    className: 'sort-btn',
                    title: 'Move up one position',
                    disabled: allMenuItems.findIndex(i => i.id === item.id) === 0
                }, '⬆'),
                React.createElement('button', {
                    onClick: handleMoveDown,
                    className: 'sort-btn',
                    title: 'Move down one position',
                    disabled: allMenuItems.findIndex(i => i.id === item.id) === allMenuItems.length - 1
                }, '⬇')
            )
        ),

        // Action buttons
        React.createElement('div', { className: 'item-actions' },
            React.createElement('button', {
                onClick: () => onEdit(item),
                className: 'edit-btn'
            }, '✏️ Edit'),
            React.createElement('button', {
                onClick: () => {
                    if (confirm(`Are you sure you want to delete "${item.description}"?`)) {
                        onDelete(item.id);
                    }
                },
                className: 'delete-btn'
            }, '🗑️ Delete')
        )
    );
}

// Settings Panel Component
function SettingsPanel({ config, onSave }) {
    const useState = React.useState;
    const useEffect = React.useEffect;
    const { t } = window.useLanguage(); // Use language context from translations module
    const [settings, setSettings] = useState({
        restName: config.restName || window.RESTAURANT_CONFIG.restaurantDisplayName,
        maxTijd: config.maxTijd || window.RESTAURANT_CONFIG.defaultMaxTime,
        etenLimiet: config.etenLimiet || window.RESTAURANT_CONFIG.defaultFoodLimit,
        dessertLimiet: config.dessertLimiet || window.RESTAURANT_CONFIG.defaultDessertLimit,
        requirePinToClose: config.requirePinToClose || false,
        // New settings
        roundTime: config.roundTime || window.RESTAURANT_CONFIG.defaultRoundTime,
        adminPassword: config.adminPassword || window.RESTAURANT_CONFIG.defaultAdminPassword,
        whatsappBerichtAan: config.whatsappBerichtAan || window.RESTAURANT_CONFIG.defaultWhatsappEnabled,
        timeLimit: config.timeLimit !== undefined ? config.timeLimit : window.RESTAURANT_CONFIG.defaultTimeLimitEnabled,
        whatsappRecipients: config.whatsappRecipients || [...window.RESTAURANT_CONFIG.defaultWhatsappRecipients]
    });

    // Password change states
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // WhatsApp recipients management
    const [newRecipient, setNewRecipient] = useState('');

    // Table management states
    const [bulkFixedPinValue, setBulkFixedPinValue] = useState('');

    // Table names constant
    const TABLE_NAMES = [
        'Tafel-1','Tafel-2','Tafel-3','Tafel-4','Tafel-5','Tafel-5A','Tafel-6','Tafel-7','Tafel-8','Tafel-9','Tafel-10','Tafel-10A',
        'Tafel-11','Tafel-12','Tafel-13','Tafel-14','Tafel-15','Tafel-16','Tafel-17','Tafel-18','Tafel-19','Tafel-21','Tafel-22',
        'Tafel-23','Tafel-24','Tafel-25','Tafel-25A','Tafel-31','Tafel-31A','Tafel-32','Tafel-32A','Tafel-33','Tafel-34',
        'Tafel-35','Tafel-35A','Tafel-36','Tafel-41','Tafel-42','Tafel-43','Tafel-44','Tafel-45','Tafel-46','Tafel-47',
        'Tafel-51','Tafel-52','Tafel-53','Tafel-54','Tafel-55','Tafel-56','Tafel-61','Tafel-62','Tafel-63','Tafel-64',
        'Tafel-65','Tafel-65A','Tafel-66','Tafel-66A','Tafel-67','Tafel-67A','Tafel-68','Tafel-69','Tafel-71','Tafel-72',
        'Tafel-73','Tafel-74','Tafel-75','Tafel-76','Tafel-76A','Tafel-77','Tafel-78','Tafel-79','Tafel-81','Tafel-82',
        'Tafel-83','Tafel-84','Tafel-85','Tafel-91','Tafel-92'
    ];



    // Table management functions
    const handleBulkMenuTypeUpdate = async (menuType) => {
        const typeName = t(menuType); // Use translation
        if (!confirm(t(menuType === 'lunch' ? 'confirmSetAllLunch' : 'confirmSetAllDinner'))) return;
        
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            const updates = {};
            
            TABLE_NAMES.forEach(tableName => {
                updates[`${restaurantPath}/tafel/${tableName}/menuType`] = menuType;
            });
            
            await database.ref().update(updates);
            alert(t(menuType === 'lunch' ? 'allTablesSetToLunch' : 'allTablesSetToDinner'));
        } catch (error) {
            alert(t('settingsFailed') + error.message);
        }
    };

    const handleAutoMenuTypeUpdate = async () => {
        const now = new Date();
        const hour = now.getHours();
        const menuType = hour < 16 ? 'lunch' : 'dinner';
        const typeName = t(menuType);
        
        if (!confirm(t('confirmAutoSwitch', { mode: typeName }))) return;
        
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            const updates = {};
            
            TABLE_NAMES.forEach(tableName => {
                updates[`${restaurantPath}/tafel/${tableName}/menuType`] = menuType;
            });
            
            await database.ref().update(updates);
            alert(t('autoSwitchComplete', { mode: typeName, hour: hour }));
        } catch (error) {
            alert(t('autoSwitchFailed') + error.message);
        }
    };

    const handleBulkRandomPin = async () => {
        if (!confirm(t('confirmRandomPin'))) return;
        
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            const updates = {};
            
            TABLE_NAMES.forEach(tableName => {
                const randomPin = String(Math.floor(1000 + Math.random() * 9000));
                updates[`${restaurantPath}/tafel/${tableName}/Pincode`] = randomPin;
            });
            
            await database.ref().update(updates);
            alert(t('randomPinComplete'));
        } catch (error) {
            alert(t('settingsFailed') + error.message);
        }
    };

    const handleBulkSetPin = async (pin) => {
        const val = pin.trim();
        if (!/^\d{3,4}$/.test(val)) {
            alert('Please enter 3-4 digits for fixed PIN'); // Keep this in current language context
            return;
        }
        if (!confirm(t('confirmFixedPin', { pin: val }))) return;
        
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPathConsole();
            const updates = {};
            
            TABLE_NAMES.forEach(tableName => {
                updates[`${restaurantPath}/tafel/${tableName}/Pincode`] = val;
            });
            
            await database.ref().update(updates);
            alert(t('fixedPinComplete'));
        } catch (error) {
            alert(t('settingsFailed') + error.message);
        }
    };

    const handlePasswordChange = () => {
        if (currentPassword !== settings.adminPassword) {
            alert('Current password is incorrect!');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('New password confirmation does not match!');
            return;
        }
        if (newPassword.length < 4) {
            alert('Password must be at least 4 characters long!');
            return;
        }
        
        setSettings({ ...settings, adminPassword: newPassword });
        setShowPasswordChange(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        alert('Password changed successfully!');
    };

    const addWhatsappRecipient = () => {
        if (newRecipient.trim() && !settings.whatsappRecipients.includes(newRecipient.trim())) {
            setSettings({
                ...settings,
                whatsappRecipients: [...settings.whatsappRecipients, newRecipient.trim()]
            });
            setNewRecipient('');
        }
    };

    const removeWhatsappRecipient = (index) => {
        const updatedRecipients = settings.whatsappRecipients.filter((_, i) => i !== index);
        setSettings({ ...settings, whatsappRecipients: updatedRecipients });
    };

    const handleSave = async () => {
        try {
            await onSave(settings);
            alert('Settings saved successfully!'); // Keep basic success messages in English
        } catch (error) {
            alert('Failed to save settings: ' + error.message);
        }
    };

    return React.createElement('div', { className: 'settings-panel' },
        React.createElement('h3', null, t('settingsTitle')),

        React.createElement('div', { className: 'settings-form' },
            // Basic Settings Section
            React.createElement('h4', { style: { marginTop: '20px', marginBottom: '15px', color: '#333' } }, t('basicSettings')),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, t('restaurantName')),
                React.createElement('input', {
                    type: 'text',
                    value: settings.restName,
                    onChange: (e) => setSettings({ ...settings, restName: e.target.value }),
                    className: 'form-input'
                })
            ),

            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, t('maxTime')),
                React.createElement('input', {
                    type: 'number',
                    value: settings.maxTijd,
                    onChange: (e) => setSettings({ ...settings, maxTijd: parseInt(e.target.value) || 120 }),
                    className: 'form-input'
                })
            ),

            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, t('roundTime')),
                React.createElement('input', {
                    type: 'number',
                    value: settings.roundTime,
                    onChange: (e) => setSettings({ ...settings, roundTime: parseInt(e.target.value) || 15 }),
                    className: 'form-input',
                    min: '1',
                    max: '60'
                }),
                React.createElement('small', { style: { color: '#666', fontSize: '12px' } }, 'Time interval for rounds (1-60 minutes)')
            ),

            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, t('foodLimit')),
                React.createElement('input', {
                    type: 'number',
                    value: settings.etenLimiet,
                    onChange: (e) => setSettings({ ...settings, etenLimiet: parseInt(e.target.value) || 4 }),
                    className: 'form-input'
                })
            ),

            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, t('dessertLimit')),
                React.createElement('input', {
                    type: 'number',
                    value: settings.dessertLimiet,
                    onChange: (e) => setSettings({ ...settings, dessertLimiet: parseInt(e.target.value) || 2 }),
                    className: 'form-input'
                })
            ),

            React.createElement('div', { className: 'form-group checkbox-group' },
                React.createElement('label', null,
                    React.createElement('input', {
                        type: 'checkbox',
                        checked: settings.timeLimit,
                        onChange: (e) => setSettings({ ...settings, timeLimit: e.target.checked })
                    }),
                    ' ' + t('enableTimeLimit')
                )
            ),

            React.createElement('div', { className: 'form-group checkbox-group' },
                React.createElement('label', null,
                    React.createElement('input', {
                        type: 'checkbox',
                        checked: settings.requirePinToClose,
                        onChange: (e) => setSettings({ ...settings, requirePinToClose: e.target.checked })
                    }),
                    ' ' + t('requirePinToClose')
                )
            ),

            // Admin Password Section
            React.createElement('h4', { style: { marginTop: '30px', marginBottom: '15px', color: '#333' } }, t('adminPassword')),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, t('currentPassword')),
                React.createElement('input', {
                    type: 'password',
                    value: '****',
                    readOnly: true,
                    className: 'form-input',
                    style: { backgroundColor: '#f5f5f5' }
                }),
                React.createElement('button', {
                    type: 'button',
                    onClick: () => setShowPasswordChange(!showPasswordChange),
                    className: 'change-password-btn',
                    style: { 
                        marginLeft: '10px', 
                        padding: '5px 10px', 
                        fontSize: '12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }
                }, showPasswordChange ? t('cancel') : t('change'))
            ),

            // Password change form
            showPasswordChange && React.createElement('div', { 
                style: { 
                    backgroundColor: '#f9f9f9', 
                    padding: '15px', 
                    borderRadius: '5px', 
                    marginTop: '10px',
                    border: '1px solid #ddd'
                } 
            },
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', null, t('enterCurrentPassword')),
                    React.createElement('input', {
                        type: 'password',
                        value: currentPassword,
                        onChange: (e) => setCurrentPassword(e.target.value),
                        className: 'form-input',
                        placeholder: 'Current password'
                    })
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', null, t('newPassword')),
                    React.createElement('input', {
                        type: 'password',
                        value: newPassword,
                        onChange: (e) => setNewPassword(e.target.value),
                        className: 'form-input',
                        placeholder: 'New password'
                    })
                ),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', null, t('confirmPassword')),
                    React.createElement('input', {
                        type: 'password',
                        value: confirmPassword,
                        onChange: (e) => setConfirmPassword(e.target.value),
                        className: 'form-input',
                        placeholder: 'Confirm new password'
                    })
                ),
                React.createElement('button', {
                    type: 'button',
                    onClick: handlePasswordChange,
                    style: { 
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }
                }, t('updatePassword'))
            ),

            // WhatsApp Settings Section
            React.createElement('h4', { style: { marginTop: '30px', marginBottom: '15px', color: '#333' } }, t('whatsappSettings')),
            
            React.createElement('div', { className: 'form-group checkbox-group' },
                React.createElement('label', null,
                    React.createElement('input', {
                        type: 'checkbox',
                        checked: settings.whatsappBerichtAan,
                        onChange: (e) => setSettings({ ...settings, whatsappBerichtAan: e.target.checked })
                    }),
                    ' ' + t('enableWhatsapp')
                )
            ),

            // WhatsApp Recipients Section
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, t('whatsappRecipients')),
                React.createElement('div', { style: { border: '1px solid #ddd', borderRadius: '4px', padding: '10px', backgroundColor: '#fafafa' } },
                    // Existing recipients
                    ...settings.whatsappRecipients.map((recipient, index) =>
                        React.createElement('div', { 
                            key: index,
                            style: { 
                                display: 'flex', 
                                alignItems: 'center', 
                                marginBottom: '5px',
                                padding: '5px',
                                backgroundColor: 'white',
                                borderRadius: '3px'
                            } 
                        },
                            React.createElement('span', { style: { flex: 1 } }, recipient),
                            React.createElement('button', {
                                type: 'button',
                                onClick: () => removeWhatsappRecipient(index),
                                style: { 
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '2px 8px',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }
                            }, '✕')
                        )
                    ),
                    // Add new recipient
                    React.createElement('div', { 
                        style: { 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginTop: '10px' 
                        } 
                    },
                        React.createElement('input', {
                            type: 'text',
                            value: newRecipient,
                            onChange: (e) => setNewRecipient(e.target.value),
                            placeholder: '31612345678',
                            style: { 
                                flex: 1, 
                                padding: '5px', 
                                border: '1px solid #ccc', 
                                borderRadius: '3px' 
                            }
                        }),
                        React.createElement('button', {
                            type: 'button',
                            onClick: addWhatsappRecipient,
                            style: { 
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                marginLeft: '5px'
                            }
                        }, t('addRecipient'))
                    )
                )
            ),

            // Table Management Section
            React.createElement('h4', { style: { marginTop: '30px', marginBottom: '15px', color: '#333' } }, t('tableManagement')),
            
            // Menu Type Control
            React.createElement('div', { 
                style: { 
                    marginBottom: '20px', 
                    padding: '15px', 
                    background: '#f8f9fa', 
                    borderRadius: '8px', 
                    border: '2px solid #e9ecef' 
                } 
            },
                React.createElement('h5', { style: { marginBottom: '15px', color: '#495057' } }, t('menuTypeControl')),
                
                React.createElement('div', { 
                    style: { 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '15px', 
                        flexWrap: 'wrap', 
                        marginBottom: '10px' 
                    } 
                },
                    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '5px' } },
                        React.createElement('span', { style: { fontWeight: 'bold' } }, t('currentTime')),
                        React.createElement('span', { 
                            id: 'currentTimeDisplay', 
                            style: { color: '#007bff', fontFamily: 'monospace' }
                        }, new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }))
                    ),
                    
                    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '5px' } },
                        React.createElement('span', { style: { fontWeight: 'bold' } }, t('autoMode')),
                        React.createElement('span', { 
                            style: { color: '#28a745', fontWeight: 'bold' }
                        }, t('autoModeRule'))
                    )
                ),
                
                React.createElement('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } },
                    React.createElement('button', {
                        type: 'button',
                        onClick: () => handleBulkMenuTypeUpdate('lunch'),
                        style: { 
                            backgroundColor: '#ffc107',
                            color: '#000',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }
                    }, t('setAllLunch')),
                    React.createElement('button', {
                        type: 'button',
                        onClick: () => handleBulkMenuTypeUpdate('dinner'),
                        style: { 
                            backgroundColor: '#17a2b8',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }
                    }, t('setAllDinner')),
                    React.createElement('button', {
                        type: 'button',
                        onClick: handleAutoMenuTypeUpdate,
                        style: { 
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }
                    }, t('autoTimeSwitch'))
                )
            ),

            // PIN Management
            React.createElement('div', { 
                style: { 
                    marginBottom: '20px', 
                    padding: '15px', 
                    background: '#f8f9fa', 
                    borderRadius: '8px', 
                    border: '2px solid #e9ecef' 
                } 
            },
                React.createElement('h5', { style: { marginBottom: '15px', color: '#495057' } }, t('bulkPinManagement')),
                
                React.createElement('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' } },
                    React.createElement('button', {
                        type: 'button',
                        onClick: handleBulkRandomPin,
                        style: { 
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }
                    }, t('allRandomPin')),
                    React.createElement('button', {
                        type: 'button',
                        onClick: () => handleBulkSetPin(bulkFixedPinValue),
                        style: { 
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }
                    }, t('allFixedPin')),
                    React.createElement('input', {
                        type: 'text',
                        value: bulkFixedPinValue,
                        onChange: (e) => setBulkFixedPinValue(e.target.value),
                        placeholder: '1234',
                        maxLength: 4,
                        style: { 
                            width: '80px', 
                            padding: '6px 8px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px',
                            textAlign: 'center'
                        }
                    })
                )
            ),

            React.createElement('button', {
                onClick: handleSave,
                className: 'save-settings-btn',
                style: { 
                    marginTop: '30px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }
            }, t('saveSettings'))
        )
    );
}

// Main App with Language Provider
function RestaurantManagementApp() {
    return React.createElement(window.LanguageProvider, null,
        React.createElement(RestaurantManagementConsole)
    );
}

// Export for use in index.html
window.RestaurantManagementConsole = RestaurantManagementApp;

// Export RestaurantDataOperations for use by other modules
window.RestaurantDataOperations = RestaurantDataOperations;

// For debug purposes, also export the individual components
window.RestaurantManagementComponents = {
    RestaurantManagementConsole,
    RestaurantManagementApp,
    RestaurantDataOperations
};
