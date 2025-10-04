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

// Language Context and Hook
const LanguageContext = React.createContext();

function useLanguage() {
    const useContext = window.useContext || React.useContext;
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

function LanguageProvider({ children }) {
    const useState = window.useState || React.useState;
    const useEffect = window.useEffect || React.useEffect;
    const [currentLanguage, setCurrentLanguage] = useState('nl'); // Default to Dutch
    
    const t = (key, replacements = {}) => {
        let text = LANGUAGE_TRANSLATIONS[currentLanguage]?.[key] || LANGUAGE_TRANSLATIONS['en']?.[key] || key;
        
        // Handle replacements like {mode}, {pin}, {hour}
        Object.keys(replacements).forEach(replaceKey => {
            text = text.replace(new RegExp(`\\{${replaceKey}\\}`, 'g'), replacements[replaceKey]);
        });
        
        return text;
    };
    
    const changeLanguage = (lang) => {
        if (LANGUAGE_TRANSLATIONS[lang]) {
            setCurrentLanguage(lang);
            // Save to localStorage for persistence
            localStorage.setItem('restaurantConsoleLanguage', lang);
        }
    };
    
    // Initialize language from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('restaurantConsoleLanguage');
        if (savedLang && LANGUAGE_TRANSLATIONS[savedLang]) {
            setCurrentLanguage(savedLang);
        }
    }, []);
    
    return React.createElement(LanguageContext.Provider, {
        value: { currentLanguage, changeLanguage, t }
    }, children);
}

// �🏪 RESTAURANT CONFIGURATION - Modify these values for different restaurants
// 注意：此配置将被新的配置系统取代，如果全局配置可用则使用全局配置
const RESTAURANT_CONFIG = window.RESTAURANT_CONFIG || {
    // Firebase Database Path - CHANGE THIS for different restaurants
    restaurantPath: 'AsianBoulevard',
    
    // Display Names - CHANGE THESE for branding
    restaurantDisplayName: 'Asian Boulevard',
    systemTitle: 'Restaurant Management Console',
    
    // Currency Settings
    currency: '€',
    currencyPosition: 'before', // 'before' or 'after'
    
    // Default Settings
    defaultMaxTime: 120, // minutes
    defaultFoodLimit: 4,
    defaultDessertLimit: 2,
    defaultRoundTime: 15, // minutes for timing rounds
    defaultAdminPassword: '7788', // default admin password
    defaultWhatsappEnabled: false, // WhatsApp messaging enabled
    defaultTimeLimitEnabled: true, // time limit feature enabled
    defaultWhatsappRecipients: ['31619971032', '31683560665'], // default WhatsApp recipients
    
    // Table Prefix (used in database keys like "Tafel-1")
    tablePrefix: 'Tafel'
};

// Helper function to get restaurant path
const getRestaurantPath = () => RESTAURANT_CONFIG.restaurantPath;

// Helper function to format currency
const formatRestaurantCurrency = (amount) => {
    const formatted = (amount || 0).toFixed(2);
    return RESTAURANT_CONFIG.currencyPosition === 'before' 
        ? `${RESTAURANT_CONFIG.currency}${formatted}`
        : `${formatted}${RESTAURANT_CONFIG.currency}`;
};

// Restaurant Data Operations
const RestaurantDataOperations = {
    // Load restaurant data from Firebase Realtime Database
    async loadRestaurantData() {
        try {
            const database = firebase.database();
            const data = {};

            // Load main collections from restaurant path
            const collections = ['config', 'menukaart', 'categorie', 'tafel'];
            const restaurantPath = getRestaurantPath(); // Use centralized config

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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();

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
            const restaurantPath = getRestaurantPath();

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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();
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
            if (tableData.timer !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/timer`] = tableData.timer;
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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();
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
    const { t } = useLanguage(); // Use language context
    const [settings, setSettings] = useState({
        restName: config.restName || RESTAURANT_CONFIG.restaurantDisplayName,
        maxTijd: config.maxTijd || RESTAURANT_CONFIG.defaultMaxTime,
        etenLimiet: config.etenLimiet || RESTAURANT_CONFIG.defaultFoodLimit,
        dessertLimiet: config.dessertLimiet || RESTAURANT_CONFIG.defaultDessertLimit,
        requirePinToClose: config.requirePinToClose || false,
        // New settings
        roundTime: config.roundTime || RESTAURANT_CONFIG.defaultRoundTime,
        adminPassword: config.adminPassword || RESTAURANT_CONFIG.defaultAdminPassword,
        whatsappBerichtAan: config.whatsappBerichtAan || RESTAURANT_CONFIG.defaultWhatsappEnabled,
        timeLimit: config.timeLimit !== undefined ? config.timeLimit : RESTAURANT_CONFIG.defaultTimeLimitEnabled,
        whatsappRecipients: config.whatsappRecipients || [...RESTAURANT_CONFIG.defaultWhatsappRecipients]
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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();
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
            const restaurantPath = getRestaurantPath();
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

// Table Edit Modal - Simplified for TableOrder editing only
function TableEditModal({ table, isOpen, onClose, onSave, allTables }) {
    const useState = React.useState;
    const useEffect = React.useEffect;
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (table) {
            setFormData({
                order: table.order || table.TableOrder || 999,
                menuType: table.menuType || 'dinner'
            });
        } else {
            setFormData({
                order: 999,
                menuType: 'dinner'
            });
        }
    }, [table, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        // Basic validation
        if (!formData.order || isNaN(formData.order)) {
            alert('Please enter a valid order number');
            return;
        }

        try {
            setLoading(true);
            await onSave(formData);
        } catch (error) {
            alert('Failed to save table data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!isOpen) return null;

    return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
        React.createElement('div', {
            className: 'modal-content table-edit-modal',
            onClick: (e) => e.stopPropagation()
        },
            React.createElement('div', { className: 'modal-header' },
                React.createElement('h3', null, `✏️ Edit Table ${table?.id || ''} Settings`),
                React.createElement('button', {
                    className: 'close-btn',
                    onClick: onClose,
                    disabled: loading
                }, '❌')
            ),

            React.createElement('form', { onSubmit: handleSubmit, className: 'table-edit-form' },

                // Table Info Display
                React.createElement('div', { className: 'table-info-display' },
                    React.createElement('h4', null, `Table: ${table?.id || 'Unknown'}`),
                    React.createElement('p', null, `Current Status: ${table?.Status || 'Unknown'}`),
                    React.createElement('p', null, `Current Persons: ${table?.currentPersons || 0}`)
                ),

                // Order Input
                React.createElement('div', { className: 'form-row' },
                    React.createElement('div', { className: 'form-group full-width' },
                        React.createElement('label', null, '📋 Display Order'),
                        React.createElement('input', {
                            type: 'number',
                            value: formData.order,
                            onChange: (e) => handleInputChange('order', parseInt(e.target.value) || 0),
                            placeholder: 'Enter display order...',
                            title: 'Lower numbers will appear first in the table list',
                            required: true,
                            min: '1',
                            max: '9999',
                            disabled: loading
                        }),
                        React.createElement('small', { className: 'help-text' },
                            'Lower numbers appear first. Current order: ', table?.order || table?.TableOrder || 'Not set'
                        )
                    )
                ),

                // Menu Type Selection
                React.createElement('div', { className: 'form-row' },
                    React.createElement('div', { className: 'form-group full-width' },
                        React.createElement('label', null, '🍽️ Menu Type'),
                        React.createElement('select', {
                            value: formData.menuType,
                            onChange: (e) => handleInputChange('menuType', e.target.value),
                            disabled: loading,
                            style: {
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                                width: '100%'
                            }
                        },
                            React.createElement('option', { value: 'lunch' }, '🌅 Lunch (午餐)'),
                            React.createElement('option', { value: 'dinner' }, '🌆 Dinner (晚餐)')
                        ),
                        React.createElement('small', { className: 'help-text' },
                            'Current menu type: ', (table?.menuType || 'dinner'), 
                            '. Controls which menu items are shown to customers at this table.'
                        )
                    )
                ),

                // Action buttons
                React.createElement('div', { className: 'form-actions' },
                    React.createElement('button', {
                        type: 'button',
                        onClick: onClose,
                        className: 'cancel-btn',
                        disabled: loading
                    }, 'Cancel'),
                    React.createElement('button', {
                        type: 'submit',
                        className: 'save-btn',
                        disabled: loading
                    }, loading ? '⏳ Saving...' : 'Update Settings')
                )
            )
        )
    );
}

// Order History Modal Component
function OrderHistoryModal({ tableId, orderHistory, loading, onClose }) {
    console.log('OrderHistoryModal rendered for table:', tableId, 'History count:', orderHistory?.length);
    const useState = React.useState;
    const useEffect = React.useEffect;
    const useRef = React.useRef;
    const modalRef = useRef();
    
    // Prevent modal flicker by stabilizing the modal
    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.style.opacity = '1';
        }
    }, []);
    
    const handleOverlayClick = (e) => {
        // Only close if clicking the overlay, not the modal content
        if (e.target.className === 'modal-overlay') {
            onClose();
        }
    };
    
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown time';
        const date = new Date(timestamp);
        return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return formatRestaurantCurrency(amount);
    };

    const getTotalItems = (items) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((total, item) => total + (item.quantity || 1), 0);
    };

    const getTotalAmount = (items) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((total, item) => total + (item.totalPrice || item.unitPrice || 0), 0);
    };

    return React.createElement('div', { 
        className: 'modal-overlay',
        onClick: handleOverlayClick,
        style: { 
            opacity: 1,
            visibility: 'visible',
            display: 'flex',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            alignItems: 'center',
            justifyContent: 'center'
        }
    },
        React.createElement('div', { 
            className: 'order-history-modal',
            ref: modalRef,
            onClick: (e) => e.stopPropagation(),
            style: {
                backgroundColor: 'white',
                borderRadius: '8px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: '600px',
                padding: '0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                opacity: 1,
                transform: 'scale(1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }
        },
            React.createElement('div', { className: 'modal-header' },
                React.createElement('h3', null, `📜 Order History - Table ${tableId.replace('Tafel-', '')}`),
                React.createElement('button', {
                    onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose();
                    },
                    className: 'close-btn',
                    style: { 
                        transition: 'none',
                        cursor: 'pointer'
                    }
                }, '✖️')
            ),

            React.createElement('div', { 
                className: 'modal-content',
                style: {
                    padding: '20px',
                    maxHeight: 'calc(90vh - 80px)',
                    overflowY: 'auto'
                }
            },
                loading ?
                    React.createElement('div', { className: 'loading-history' },
                        React.createElement('div', { className: 'loading-spinner' }, '⏳'),
                        'Loading order history...'
                    )
                    : orderHistory.length === 0 ?
                        React.createElement('div', { className: 'no-history' },
                            React.createElement('div', { className: 'no-history-icon' }, '📝'),
                            React.createElement('h4', null, 'No Order History'),
                            React.createElement('p', null, 'This table has no recorded order history.')
                        )
                        :
                        React.createElement('div', { className: 'history-list' },
                            React.createElement('div', { className: 'history-summary' },
                                `Total Orders: ${orderHistory.length} | Recent Activity: ${formatDate(orderHistory[0]?.timestamp)}`
                            ),

                            orderHistory.map(order =>
                                React.createElement('div', {
                                    key: order.id,
                                    className: 'history-item',
                                    style: {
                                        marginBottom: '20px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }
                                },
                                    React.createElement('div', { 
                                        className: 'order-header',
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '15px 20px',
                                            backgroundColor: '#f8f9fa',
                                            borderBottom: '1px solid #ddd',
                                            borderRadius: '8px 8px 0 0'
                                        }
                                    },
                                        React.createElement('div', { className: 'order-info' },
                                            React.createElement('span', { 
                                                className: 'order-number',
                                                style: {
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    color: '#007bff'
                                                }
                                            },
                                                `Order #${order.invoiceNumber}`
                                            ),
                                            React.createElement('span', { 
                                                className: 'order-date',
                                                style: {
                                                    fontSize: '14px',
                                                    color: '#666',
                                                    marginLeft: '10px'
                                                }
                                            },
                                                formatDate(order.timestamp)
                                            )
                                        ),
                                        React.createElement('div', { className: 'order-totals' },
                                            React.createElement('span', { 
                                                className: 'item-count',
                                                style: {
                                                    fontSize: '14px',
                                                    color: '#fff',
                                                    backgroundColor: '#17a2b8',
                                                    padding: '3px 8px',
                                                    borderRadius: '14px',
                                                    marginRight: '15px',
                                                    fontWeight: '500'
                                                }
                                            },
                                                `${getTotalItems(order.items)} items`
                                            ),
                                            React.createElement('span', { 
                                                className: 'order-total',
                                                style: {
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    color: '#28a745'
                                                }
                                            },
                                                formatCurrency(order.totalAmount || getTotalAmount(order.items))
                                            )
                                        )
                                    ),

                                    order.items && order.items.length > 0 &&
                                    React.createElement('div', { 
                                        className: 'order-items',
                                        style: {
                                            marginTop: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }
                                    },
                                        React.createElement('div', { 
                                            className: 'items-header',
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '60px 1fr 80px 80px 80px',
                                                gap: '8px',
                                                padding: '12px 10px',
                                                backgroundColor: '#343a40',
                                                color: '#fff',
                                                borderBottom: '1px solid #ddd',
                                                fontWeight: 'bold',
                                                fontSize: '12px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }
                                        },
                                            React.createElement('span', { className: 'item-qty-header' }, 'Qty'),
                                            React.createElement('span', { className: 'item-name-header' }, 'Item Name'),
                                            React.createElement('span', { className: 'item-sku-header' }, 'SKU'),
                                            React.createElement('span', { className: 'item-price-header' }, 'Unit €'),
                                            React.createElement('span', { className: 'item-total-header' }, 'Total €')
                                        ),
                                        order.items.map((item, index) =>
                                            React.createElement('div', {
                                                key: index,
                                                className: 'order-item detailed',
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: '60px 1fr 80px 80px 80px',
                                                    gap: '8px',
                                                    padding: '8px 10px',
                                                    borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none',
                                                    fontSize: '13px',
                                                    backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                                                    alignItems: 'center'
                                                }
                                            },
                                                React.createElement('span', { 
                                                    className: 'item-quantity',
                                                    style: { 
                                                        fontWeight: 'bold', 
                                                        color: '#fff',
                                                        backgroundColor: '#28a745',
                                                        padding: '2px 6px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        textAlign: 'center',
                                                        minWidth: '30px',
                                                        display: 'inline-block'
                                                    }
                                                },
                                                    `${item.quantity}×`
                                                ),
                                                React.createElement('span', { 
                                                    className: 'item-name',
                                                    title: item.name || 'Unknown Item',
                                                    style: { 
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }
                                                },
                                                    item.name || 'Unknown Item'
                                                ),
                                                React.createElement('span', { 
                                                    className: 'item-sku',
                                                    style: { 
                                                        color: '#6c757d',
                                                        fontSize: '11px',
                                                        textAlign: 'center',
                                                        backgroundColor: '#e9ecef',
                                                        padding: '2px 4px',
                                                        borderRadius: '3px',
                                                        fontFamily: 'monospace'
                                                    }
                                                },
                                                    item.sku || 'N/A'
                                                ),
                                                React.createElement('span', { 
                                                    className: 'item-unit-price',
                                                    style: { textAlign: 'right' }
                                                },
                                                    formatCurrency(item.unitPrice || 0)
                                                ),
                                                React.createElement('span', { 
                                                    className: 'item-total-price',
                                                    style: { 
                                                        textAlign: 'right',
                                                        fontWeight: 'bold'
                                                    }
                                                },
                                                    formatCurrency(item.totalPrice || (item.unitPrice * item.quantity) || 0)
                                                )
                                            )
                                        ),
                                        React.createElement('div', { 
                                            className: 'order-summary',
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '12px 10px',
                                                backgroundColor: '#f8f9fa',
                                                borderTop: '1px solid #ddd',
                                                fontWeight: 'bold'
                                            }
                                        },
                                            React.createElement('span', { 
                                                className: 'summary-label',
                                                style: { color: '#666' }
                                            }, 'Order Total:'),
                                            React.createElement('span', { 
                                                className: 'summary-amount',
                                                style: { 
                                                    fontSize: '16px',
                                                    color: '#007bff'
                                                }
                                            },
                                                formatCurrency(order.totalAmount || getTotalAmount(order.items))
                                            )
                                        )
                                    )
                                )
                            )
                        )
            )
        )
    );
}

// Enhanced Table Card Component with inline editing (fixed)
function TableCard({ table, onEdit, onDelete, onLocalUpdate, globalMenuType }) {
  // 确保在函数内解构 React hooks，避免 useState/useEffect 未定义
  const useState = React.useState;
  const useEffect = React.useEffect;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [orderHistoryCache, setOrderHistoryCache] = useState(new Map());
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [hasActiveOrders, setHasActiveOrders] = useState(false);

  // DB 键：使用 table.id（例如 "Tafel-12"）
  const tableKey = table.id;
  // 显示标签：优先显示数字部分
  const tableLabel = table.TableNumber || (typeof table.id === 'string' ? table.id.replace('Tafel-', '') : table.id);

  const tableStatus = table.status || 'active';
  const liveStatus = table.Status || 'closed';

  useEffect(() => {
    checkActiveOrders();
  }, [table]);

  const checkActiveOrders = async () => {
    try {
      const database = firebase.database();
      const ordersSnapshot = await database.ref(`${getRestaurantPath()}/tafel/${tableKey}/orders`).once('value');
      const orders = ordersSnapshot.val();
      if (orders) {
        const activeOrders = Object.keys(orders).filter(key => key !== 'history');
        setHasActiveOrders(activeOrders.length > 0);
      } else {
        setHasActiveOrders(false);
      }
    } catch (error) {
      console.error('Error checking active orders:', error);
      setHasActiveOrders(false);
    }
  };

  const loadOrderHistory = async () => {
    // Check cache first to prevent unnecessary reloads
    if (orderHistoryCache.has(tableKey)) {
      const cached = orderHistoryCache.get(tableKey);
      setOrderHistory(cached);
      return;
    }
    
    try {
      setLoadingHistory(true);
      const database = firebase.database();
      const historySnapshot = await database.ref(`${getRestaurantPath()}/tafel/${tableKey}/orders/history`).once('value');
      const historyData = historySnapshot.val() || {};
      
      // Convert history data to array and process each order
      const historyArray = Object.entries(historyData)
        .map(([orderId, orderData]) => {
          if (!orderData) return null; // Skip null entries
          
          // Parse order details if available
          let parsedItems = [];
          let totalAmount = 0;
          let itemCount = 0;
          
          if (orderData.orderDetails && Array.isArray(orderData.orderDetails)) {
            parsedItems = orderData.orderDetails.map(detail => {
              if (Array.isArray(detail) && detail.length >= 6) {
                const [timestamp, sku, quantity, price, tax, name] = detail;
                const itemPrice = parseFloat(price) || 0;
                const qty = parseInt(quantity) || 1;
                itemCount += qty;
                totalAmount += itemPrice * qty;
                
                return {
                  name: name || 'Unknown Item',
                  sku: sku,
                  quantity: qty,
                  unitPrice: itemPrice,
                  totalPrice: itemPrice * qty,
                  timestamp: timestamp
                };
              }
              return null;
            }).filter(item => item !== null);
          }
          
          // Get payment details total if available
          if (orderData.paymentDetails && Array.isArray(orderData.paymentDetails)) {
            orderData.paymentDetails.forEach(payment => {
              if (payment && typeof payment === 'object') {
                Object.values(payment).forEach(amount => {
                  if (typeof amount === 'number') {
                    totalAmount = Math.max(totalAmount, amount); // Use payment total if higher
                  }
                });
              }
            });
          }
          
          return {
            id: orderId,
            invoiceNumber: orderData.invoiceNumber || orderId,
            timestamp: orderData.timestamp || Date.now(),
            date: orderData.date,
            items: parsedItems,
            totalAmount: totalAmount,
            totalItems: orderData.totalItems || itemCount,
            status: orderData.status || 'completed'
          };
        })
        .filter(order => order !== null) // Remove null entries
        .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp, newest first
      
      setOrderHistory(historyArray);
      // Cache the result
      setOrderHistoryCache(prev => new Map(prev.set(tableKey, historyArray)));
    } catch (error) {
      console.error('Error loading order history:', error);
      setOrderHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

    const handleShowHistory = () => {
        const tableNumber = table.TableNumber || table.number || tableKey;
        console.log('History button clicked for table:', tableNumber);
        console.log('Current showOrderHistory state:', showOrderHistory);
        console.log('Setting showOrderHistory to true');
        setShowOrderHistory(true);
        
        // Force a re-render check
        setTimeout(() => {
            console.log('After timeout, showOrderHistory state:', showOrderHistory);
        }, 100);
    };

    // Load history once when modal first shown - debounce to prevent flicker
    useEffect(() => {
        if (showOrderHistory) {
            // Small delay to allow modal to render first
            const timer = setTimeout(() => {
                loadOrderHistory();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [showOrderHistory, tableKey]);

  useEffect(() => {
    if (isEditing) {
      setEditData({
        order: table.order || table.TableOrder || 999,
        persons: table.currentPersons || table.Persons || 0,
        status: liveStatus,
        pincode: table.Pincode || ''
      });
    }
  }, [isEditing, table]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => { setIsEditing(false); setEditData({}); };

  const generatePincode = () => {
    const digits = Math.random() < 0.5 ? 3 : 4;
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const pincode = Math.floor(Math.random() * (max - min + 1)) + min;
    setEditData(prev => ({ ...prev, pincode: pincode.toString() }));
  };

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const database = firebase.database();
      const restaurantPath = getRestaurantPath();
      const updates = {};

      if (editData.order !== undefined) {
        updates[`${restaurantPath}/tafel/${tableKey}/TableOrder`] = parseInt(editData.order);
      }
      if (editData.persons !== undefined) {
        updates[`${restaurantPath}/tafel/${tableKey}/Persons`] = parseInt(editData.persons);
      }
      if (editData.status !== undefined) {
        updates[`${restaurantPath}/tafel/${tableKey}/Status`] = editData.status;
      }
      if (editData.pincode !== undefined) {
        updates[`${restaurantPath}/tafel/${tableKey}/Pincode`] = editData.pincode;
      }

      await database.ref().update(updates);
      // Optimistically update parent state with correct table ID
      if (onLocalUpdate) {
        onLocalUpdate(table.id, {
          TableOrder: parseInt(editData.order),
          Persons: parseInt(editData.persons),
          Status: editData.status,
          Pincode: editData.pincode,
          // Also update display values
          order: parseInt(editData.order),
          currentPersons: parseInt(editData.persons)
        });
      }

      setIsEditing(false);
      setEditData({});
    // Remove full page reload; rely on realtime listener to update. Provide a brief visual feedback.
    // Optionally we could optimistically patch local table state via onEdit callback if provided.
    } catch (error) {
      alert('Failed to save changes: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete Table ${tableLabel}?`)) {
      onDelete(tableLabel); // 你原来的删除逻辑是按数字删：Tafel-${tableNumber}
    }
  };

  return React.createElement(React.Fragment, null,
    React.createElement('div', {
      className: `table-management-card ${tableStatus} ${liveStatus} ${isEditing ? 'editing' : ''} ${hasActiveOrders ? 'has-orders' : ''}`,
      id: `table-card-${tableLabel}`
    },
      // 有活动订单指示
      hasActiveOrders && React.createElement('div', {
        className: 'order-indicator',
        title: 'This table has active orders'
      }, '🔥'),

      // Header
      React.createElement('div', { className: 'table-card-header' },
        React.createElement('div', { className: 'table-number' },
          React.createElement('span', { className: 'table-icon' }, '🍽️'),
                    React.createElement('span', { className: 'table-id' }, `Table ${tableLabel}`),
                    (() => {
                        const badgeType = (table.menuType || globalMenuType || '').toLowerCase();
                        if (!badgeType) return null;
                        return React.createElement('span', {
                            className: `menu-type-badge menu-type-${badgeType}`,
                            title: `Menu Type: ${badgeType}`
                        }, badgeType);
                    })()
        ),
        React.createElement('div', { className: 'table-actions' },
          // 历史按钮
          React.createElement('button', {
            onClick: handleShowHistory,
            className: 'history-btn',
            title: 'View order history',
            style: {
              cursor: 'pointer',
              pointerEvents: 'auto',
              zIndex: 10,
              position: 'relative',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px'
            }
          }, '📜 History'),
          // 编辑/保存区
          !isEditing
            ? React.createElement('button', {
                onClick: handleEdit,
                className: 'edit-table-btn',
                title: 'Edit table'
              }, '✏️')
            : React.createElement('div', { className: 'edit-actions' },
                React.createElement('button', {
                  onClick: handleCancel,
                  className: 'cancel-edit-btn',
                  disabled: saving,
                  title: 'Cancel editing'
                }, '❌'),
                React.createElement('button', {
                  onClick: handleSave,
                  className: 'save-edit-btn',
                  disabled: saving,
                  title: 'Save changes'
                }, saving ? '⏳' : '💾')
              )
        )
      ),

      // Info
      React.createElement('div', { className: 'table-info' },
        // 排序
        React.createElement('div', { className: 'detail-item' },
          React.createElement('span', { className: 'detail-label' }, '📋 Display Order: '),
          isEditing
            ? React.createElement('input', {
                type: 'number',
                value: editData.order || '',
                onChange: (e) => setEditData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 })),
                className: 'inline-edit-input',
                min: '1',
                max: '9999'
              })
            : React.createElement('span', { className: 'detail-value order-number' }, table.order || table.TableOrder || 999)
        ),

        // 人数
        React.createElement('div', { className: 'detail-item' },
          React.createElement('span', { className: 'detail-label' }, '👥 Current Persons: '),
          isEditing
            ? React.createElement('div', { className: 'number-control' },
                React.createElement('button', {
                  onClick: () => setEditData(prev => ({ ...prev, persons: Math.max(0, (prev.persons || 0) - 1) })),
                  className: 'number-btn minus',
                  disabled: (editData.persons || 0) <= 0
                }, '−'),
                React.createElement('span', { className: 'number-display' }, editData.persons || 0),
                React.createElement('button', {
                  onClick: () => setEditData(prev => ({ ...prev, persons: Math.min(20, (prev.persons || 0) + 1) })),
                  className: 'number-btn plus',
                  disabled: (editData.persons || 0) >= 20
                }, '+')
              )
            : React.createElement('span', { className: 'detail-value' }, table.currentPersons || table.Persons || 0)
        ),

        // 状态
        React.createElement('div', { className: 'detail-item' },
          React.createElement('span', { className: 'detail-label' }, '🏷️ Status: '),
          isEditing
            ? React.createElement('button', {
                onClick: () => setEditData(prev => ({ ...prev, status: prev.status === 'open' ? 'closed' : 'open' })),
                className: `status-toggle ${editData.status || liveStatus}`
              }, (editData.status || liveStatus) === 'open' ? '🟢 Open' : '🔴 Closed')
            : React.createElement('span', { className: `detail-value status-indicator ${liveStatus}` },
                liveStatus === 'open' ? '🟢 Open' : '🔴 Closed'
              )
        ),

        // PIN
        React.createElement('div', { className: 'detail-item pincode-item' },
          React.createElement('span', { className: 'detail-label' }, '🔐 PIN Code: '),
          isEditing
            ? React.createElement('div', { className: 'pincode-edit' },
                React.createElement('input', {
                  type: 'text',
                  value: editData.pincode || '',
                  onChange: (e) => setEditData(prev => ({
                    ...prev,
                    pincode: e.target.value.replace(/\D/g, '').substring(0, 4)
                  })),
                  className: 'pincode-input',
                  placeholder: 'PIN',
                  maxLength: '4'
                }),
                React.createElement('button', {
                  onClick: generatePincode,
                  className: 'generate-pin-btn',
                  title: 'Generate random PIN'
                }, '🎲')
              )
            : React.createElement('span', { className: 'detail-value pincode-display' },
                table.Pincode || 'Not Set'
              )
        )
      )
    ),

    // 历史弹窗
    showOrderHistory && React.createElement(OrderHistoryModal, {
      tableId: tableKey,
      orderHistory: orderHistory,
      loading: loadingHistory,
      onClose: () => setShowOrderHistory(false)
    })
  );
}


// Table Management Panel - Standalone version with inline editing
function TableManagementPanel({ tableOrderData, liveTableData, onEdit, onDelete, onAdd, onCreateSamples }) {
    const useState = React.useState;
    const useEffect = React.useEffect;
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [globalMenuType, setGlobalMenuType] = useState(null);

    useEffect(() => {
        // derive global menu type by time (fallback only, tables may override)
        const update = () => {
            const hour = new Date().getHours();
            setGlobalMenuType(hour < 16 ? 'lunch' : 'dinner');
        };
        update();
        const timer = setInterval(update, 5 * 60 * 1000);
        return () => clearInterval(timer);
    }, []);

    const handleTableLocalUpdate = (tableId, fields) => {
        console.log('Optimistic update:', tableId, fields);
        setTables(prev => prev.map(t => {
            if (t.id === tableId) {
                return { ...t, ...fields };
            }
            return t;
        }));
    };

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            setLoading(true);
            const database = firebase.database();
            const tafelSnapshot = await database.ref(`${getRestaurantPath()}/tafel`).once('value');
            const tafelData = tafelSnapshot.val() || {};

            const tablesList = Object.entries(tafelData).map(([key, data]) => ({
                id: key,
                TableNumber: key.replace('Tafel-', ''),
                order: data.TableOrder || 999,
                TableOrder: data.TableOrder || 999,
                status: 'active',
                Status: data.Status || 'closed',
                currentPersons: data.Persons || 0,
                Persons: data.Persons || 0,
                Pincode: data.Pincode || '',
                maxPersons: 4,
                menuType: data.menuType || data.mealType || data.mealtype || null
            }));

            tablesList.sort((a, b) => (a.TableOrder || 999) - (b.TableOrder || 999));
            setTables(tablesList);
        } catch (err) {
            setError('Failed to load tables: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTable = async (tableId) => {
        try {
            const database = firebase.database();
            await database.ref(`${getRestaurantPath()}/tafel/${RESTAURANT_CONFIG.tablePrefix}-${tableId}`).remove();
            setTables(prev => prev.filter(t => t.TableNumber !== tableId));
            alert('Table deleted successfully!');
        } catch (error) {
            alert('Failed to delete table: ' + error.message);
        }
    };

    const scrollToTable = (tableNumber) => {
        const element = document.getElementById(`table-card-${tableNumber}`);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            element.style.border = '3px solid #FFD700';
            element.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';

            setTimeout(() => {
                element.style.border = '';
                element.style.boxShadow = '';
            }, 2000);
        }
    };

    const filteredTables = tables.filter(table =>
        table.TableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return React.createElement('div', { className: 'loading' }, 'Loading tables...');
    if (error) return React.createElement('div', { className: 'error' }, error);

    return React.createElement('div', { className: 'table-management-panel' },
        React.createElement('div', { className: 'table-management-header' },
            React.createElement('h3', null, '🍽️ Table Management'),
            React.createElement('div', { className: 'table-header-info' },
                `Total Tables: ${tables.length} | Active: ${tables.filter(t => t.Status === 'open').length} | Available: ${tables.filter(t => t.Status === 'closed').length}`
            )
        ),

        // Enhanced Search
        React.createElement('div', { className: 'table-search-section' },
            React.createElement('input', {
                type: 'text',
                placeholder: '🔍 Search tables by number or name...',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: 'enhanced-search-input'
            })
        ),

        // Tables Grid
        React.createElement('div', { className: 'tables-management-grid' },
            filteredTables.map(table =>
                React.createElement(TableCard, {
                    key: table.id,
                    table: table,
                    onDelete: handleDeleteTable,
                    onLocalUpdate: handleTableLocalUpdate,
                    globalMenuType: globalMenuType
                })
            )
        ),

        filteredTables.length === 0 && React.createElement('div', {
            className: 'no-results'
        }, 'No tables found matching your search.')
    );
}

// Main Restaurant Management Console
function RestaurantManagementConsole() {
    // Use React hooks from global scope (set up in index.html)
    const useState = window.useState || React.useState;
    const useEffect = window.useEffect || React.useEffect;
    const useCallback = window.useCallback || React.useCallback;
    
    const { t, currentLanguage, changeLanguage } = useLanguage(); // Use language context

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('menu');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentUser, setCurrentUser] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Auth form state
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    // Table management states
    const [editingTable, setEditingTable] = useState(null);
    const [showTableEditModal, setShowTableEditModal] = useState(false);

    // Initialize auth listener: only load data after login; show login form when not logged in
    useEffect(() => {
        const auth = firebase?.auth?.();
        if (!auth) {
            setLoading(false);
            setAuthError('Auth library not loaded');
            return;
        }

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user);

            if (!user) {
                // not logged in: stop loading and show the login card
                setLoading(false);
                return;
            }

            // logged in: do the initial one-shot load (always release loading in finally)
            try {
                setLoading(true);
                await loadData();
            } catch (e) {
                console.error('Initial load failed:', e);
                setError(`Failed to load data: ${e.message}`);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe && unsubscribe();
    }, []);


    const handleLogin = async (e) => {
        e && e.preventDefault();
        if (!authEmail || !authPassword) {
            setAuthError('请输入邮箱和密码');
            return;
        }
        if (!(firebase && typeof firebase.auth === 'function')) {
            setAuthError('Auth library not loaded');
            return;
        }
        try {
            setAuthLoading(true);
            setAuthError(null);
            await firebase.auth().signInWithEmailAndPassword(authEmail.trim(), authPassword);
        } catch (err) {
            setAuthError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        if (firebase && typeof firebase.auth === 'function') {
            try { await firebase.auth().signOut(); } catch (e) { console.warn('Sign out failed', e); }
        }
    };

    // Legacy one-shot loader (still used as fallback)
// 替换 restaurant-management-console.js 中的 loadData 函数（约第1057行）
// Also update the loadData function to be more robust:
const loadData = async () => {
    try {
        console.log("🔄 开始加载餐厅数据...");
        
        // Check if Firebase is ready
        if (!firebase?.database) {
            throw new Error('Firebase数据库服务不可用');
        }
        
        // Check if user is still authenticated
        const currentUser = firebase.auth()?.currentUser;
        if (!currentUser) {
            throw new Error('用户未认证');
        }
        
        console.log(`🔄 为用户 ${currentUser.email} 加载数据...`);
        
        const loadedData = await RestaurantDataOperations.loadRestaurantData();
        
        // 确保数据结构完整
        const completeData = {
            config: loadedData.config || { restName: RESTAURANT_CONFIG.restaurantDisplayName },
            menukaart: loadedData.menukaart || {},
            categorie: loadedData.categorie || {},
            tafel: loadedData.tafel || {},
            TableOrder: {}
        };
        
        console.log("✅ 数据加载成功:", Object.keys(completeData));
        setData(completeData);
        setError(null);
        
    } catch (error) {
        console.error('❌ 数据加载错误:', error);
        throw error; // Re-throw to be handled by caller
    }
};

        // Realtime listeners: apply incremental updates only; never toggle loading here
        useEffect(() => {
            if (!currentUser) return;

            const db = firebase.database();
            const base = getRestaurantPath();

            const menukaartRef = db.ref(`${base}/menukaart`);
            const configRef   = db.ref(`${base}/config`);
            const tafelRef    = db.ref(`${base}/tafel`);
            const orderRef    = db.ref(`${base}/TableOrder`);

            const apply = (key, snap) => {
                const val = snap.val() || {};
                setData(prev => ({ ...(prev || {}), [key]: val }));
            };

            const onErr = (key) => (err) => {
                console.error('Realtime listener error:', key, err);
                setError(err.message); // record the error; do NOT set loading here
            };

            menukaartRef.on('value', (s) => apply('menukaart', s), onErr('menukaart'));
            configRef.on('value',   (s) => apply('config', s),     onErr('config'));
            tafelRef.on('value',    (s) => apply('tafel', s),      onErr('tafel'));
            orderRef.on('value',    (s) => apply('TableOrder', s), onErr('TableOrder'));

            return () => {
                menukaartRef.off(); configRef.off(); tafelRef.off(); orderRef.off();
            };
        }, [currentUser, editingItem?.id]);

    const handleMenuItemEdit = (item) => {
        setEditingItem(item);
        setShowEditModal(true);
    };

    const handleAddNewItem = () => {
        setEditingItem(null);
        setShowEditModal(true);
    };

    const handleSaveItem = async (formData) => {
        try {
            let savedItem;
            if (editingItem) {
                // Update existing item
                savedItem = {
                    ...editingItem,
                    ...formData
                };
                await RestaurantDataOperations.saveMenuItem(editingItem.id, savedItem);
                
                // Optimistic update - update the local state immediately
                setData(prevData => ({
                    ...prevData,
                    menukaart: {
                        ...prevData.menukaart,
                        [editingItem.id]: savedItem
                    }
                }));
            } else {
                // Add new item - use SKU as ID
                const newId = await RestaurantDataOperations.addMenuItem(formData);
                savedItem = {
                    id: newId,
                    sku: newId,  // Ensure SKU matches ID
                    ...formData,
                    id: newId,   // Ensure ID is SKU
                    sku: newId   // Ensure SKU is ID
                };
                
                // Optimistic update - add the new item to local state using SKU as key
                setData(prevData => ({
                    ...prevData,
                    menukaart: {
                        ...prevData.menukaart,
                        [newId]: savedItem  // Use SKU as key
                    }
                }));
            }
            
            setShowEditModal(false);
            setEditingItem(null);
        } catch (error) {
            // If there's an error, the real-time listener will eventually correct the state
            console.error('Error saving menu item:', error);
            alert('Failed to save item: ' + error.message);
            throw error;
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            // Optimistic update - remove from local state immediately
            setData(prevData => {
                const newMenukaart = { ...prevData.menukaart };
                delete newMenukaart[itemId];
                return {
                    ...prevData,
                    menukaart: newMenukaart
                };
            });
            
            await RestaurantDataOperations.deleteMenuItem(itemId);
        } catch (error) {
            // If there's an error, reload the data to restore correct state
            console.error('Error deleting menu item:', error);
            alert('Failed to delete item: ' + error.message);
            // The real-time listener should restore the correct state
        }
    };

    const handleSortingChangeSmart = async (itemId, newSorting, allMenuItems) => {
        try {
            // Optimistic update - update sorting immediately in local state
            setData(prevData => {
                if (prevData.menukaart && prevData.menukaart[itemId]) {
                    return {
                        ...prevData,
                        menukaart: {
                            ...prevData.menukaart,
                            [itemId]: {
                                ...prevData.menukaart[itemId],
                                sortingNrm: newSorting
                            }
                        }
                    };
                }
                return prevData;
            });
            
            await RestaurantDataOperations.updateSortingOrderSmart(itemId, newSorting, allMenuItems);
        } catch (error) {
            console.error('Error updating sorting:', error);
            // The real-time listener should restore the correct state
            throw error;
        }
    };

    // New handler for position exchange between two items
    const handlePositionExchange = async (itemId1, itemId2, sortValue1, sortValue2) => {
        try {
            // Optimistic update - exchange positions in local state immediately
            setData(prevData => {
                const newData = { ...prevData };
                if (newData.menukaart && newData.menukaart[itemId1] && newData.menukaart[itemId2]) {
                    newData.menukaart = {
                        ...newData.menukaart,
                        [itemId1]: {
                            ...newData.menukaart[itemId1],
                            sortingNrm: sortValue2
                        },
                        [itemId2]: {
                            ...newData.menukaart[itemId2],
                            sortingNrm: sortValue1
                        }
                    };
                }
                return newData;
            });
            
            await RestaurantDataOperations.exchangeSortingPositions(itemId1, itemId2, sortValue1, sortValue2);
        } catch (error) {
            console.error('Error exchanging positions:', error);
            // The real-time listener should restore the correct state
            throw error;
        }
    };

    const handleExportMenu = () => {
        try {
            const menuData = data.menukaart || {};
            const dataStr = JSON.stringify(menuData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `menu-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert('Menu exported successfully!');
        } catch (error) {
            alert('Failed to export menu: ' + error.message);
        }
    };

    const handleImportMenu = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const menuData = JSON.parse(text);

            if (confirm('This will replace all current menu items. Are you sure?')) {
                await RestaurantDataOperations.importMenuData(menuData);
                alert('Menu imported successfully!');
            }
        } catch (error) {
            alert('Failed to import menu: ' + error.message);
        }

        // Reset file input
        event.target.value = '';
    };

    const handleConfigSave = async (configData) => {
        try {
            // Optimistic update - update config in local state immediately
            setData(prevData => ({
                ...prevData,
                config: {
                    ...prevData.config,
                    ...configData
                }
            }));
            
            await RestaurantDataOperations.updateConfig(configData);
        } catch (error) {
            console.error('Error saving config:', error);
            // The real-time listener should restore the correct state
            throw error;
        }
    };

    // Table Management Functions - Updated for TableOrder field structure
    const handleTableEdit = (table) => {
        setEditingTable(table);
        setShowTableEditModal(true);
    };

    const handleAddNewTable = () => {
        // For now, just show message since tables are created through restaurant system
        alert('Tables are managed through the restaurant ordering system. This interface is for adjusting display order only.');
    };

    const handleSaveTable = async (formData) => {
        try {
            if (editingTable) {
                // Update both TableOrder and menuType fields
                await RestaurantDataOperations.saveTableSettings(editingTable.id, formData);
                setShowTableEditModal(false);
                setEditingTable(null);
                alert('Table settings updated successfully!');
            }
        } catch (error) {
            throw error;
        }
    };

    const handleDeleteTable = async (tableId) => {
        alert('Tables cannot be deleted from this interface. Use the restaurant management system to remove tables.');
    };

    const handleCreateSampleTables = async () => {
        alert('Sample tables are created through the restaurant ordering system, not this management interface.');
    };

    if (!currentUser) {
        return React.createElement('div', { className: 'auth-wrapper' },
            React.createElement('style', { dangerouslySetInnerHTML: { __html: `
                .auth-wrapper { display:flex; align-items:center; justify-content:center; min-height:80vh; font-family:Arial, sans-serif; }
                .auth-card { background:#ffffff; padding:32px 28px; border-radius:14px; width:100%; max-width:360px; box-shadow:0 8px 30px -5px rgba(0,0,0,0.15); }
                .auth-card h2 { margin:0 0 1.2rem; font-weight:600; font-size:1.4rem; }
                .auth-field { margin-bottom:1rem; }
                .auth-field label { display:block; font-size:0.75rem; letter-spacing:.5px; font-weight:600; margin-bottom:6px; color:#555; text-transform:uppercase; }
                .auth-field input { width:100%; padding:10px 12px; border:1px solid #d0d6e0; border-radius:8px; background:#f8fafc; font-size:0.9rem; transition:border .2s, background .2s; }
                .auth-field input:focus { outline:none; border-color:#6366f1; background:#fff; }
                .auth-btn { width:100%; background:#6366f1; color:#fff; border:none; padding:12px 14px; border-radius:8px; font-size:0.95rem; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 2px 8px rgba(99,102,241,0.35); }
                .auth-btn:disabled { opacity:.6; cursor:not-allowed; }
                .auth-error { background:#fee2e2; color:#b91c1c; padding:10px 12px; border-radius:8px; font-size:0.75rem; margin-bottom:10px; line-height:1.3; }
                .auth-meta { margin-top:1.25rem; font-size:0.7rem; color:#6b7280; text-align:center; }
            ` } }),
            React.createElement('div', { className: 'auth-card' },
                React.createElement('h2', null, '🔐 管理登录'),
                authError && React.createElement('div', { className: 'auth-error' }, authError),
                React.createElement('form', { onSubmit: handleLogin },
                    React.createElement('div', { className: 'auth-field' },
                        React.createElement('label', null, 'Email'),
                        React.createElement('input', { type: 'email', value: authEmail, onChange: e => setAuthEmail(e.target.value), placeholder: 'you@example.com', autoComplete: 'username' })
                    ),
                    React.createElement('div', { className: 'auth-field' },
                        React.createElement('label', null, 'Password'),
                        React.createElement('input', { type: 'password', value: authPassword, onChange: e => setAuthPassword(e.target.value), placeholder: '••••••••', autoComplete: 'current-password' })
                    ),
                    React.createElement('button', { type: 'submit', className: 'auth-btn', disabled: authLoading }, authLoading ? '登录中...' : '登录')
                ),
                React.createElement('div', { className: 'auth-meta' }, '仅限授权员工使用')
            )
        );
    }

    if (loading) {
        return React.createElement('div', { className: 'loading-screen' },
            React.createElement('div', { className: 'loading-spinner' }, '🍱'),
            React.createElement('p', null, 'Loading restaurant data...'),
            React.createElement('button', { onClick: handleLogout, style: { marginTop:'16px', background:'#eee', border:'1px solid #ccc', padding:'6px 12px', borderRadius:'6px', cursor:'pointer' } }, 'Logout')
        );
    }

    if (error) {
        return React.createElement('div', { className: 'error-screen' },
            React.createElement('h3', null, '⚠️ Error'),
            React.createElement('p', null, error),
            React.createElement('button', { onClick: loadData }, 'Try Again')
        );
    }

    // Get menu items sorted by sortingNrm and filtered by search query
    console.log('Current search query:', searchQuery); // Debug log
    const menuItems = data.menukaart
      ? Object.entries(data.menukaart)
          .map(([id, item]) => {
            if (!item || typeof item !== 'object') return null;
            if (!item.description && !item.sku) return null;
            return { ...item, id }; // keep original id (string-compatible, e.g., SKU-like)
          })
            .filter(item => {
                if (item) {
                    console.log('Menu item fields:', Object.keys(item)); // Debug: show available fields
                }
                return item !== null;
            }) // Remove invalid items
            .filter(item => {
                try {
                    if (!searchQuery.trim()) return true;

                    const query = searchQuery.toLowerCase();

                    // Check all possible field names (more comprehensive search)
                    const searchableFields = [
                        item.description,
                        item.sku,
                        item.group,
                        item.allergy,
                        item.name,        // Alternative name field
                        item.title,       // Alternative title field
                        item.category,    // Alternative category field
                        item.ingredients,  // Alternative ingredients field
                        item.menuType || item.mealType || item.mealtype
                    ];

                    const matches = searchableFields.some(field => {
                        if (!field) return false;
                        return String(field).toLowerCase().includes(query);
                    });

                    // Debug logging
                    if (searchQuery.trim()) {
                        console.log(`Search debug - Query: "${query}", Item: ${item.description || item.name || 'No name'}, All fields:`, searchableFields, 'Matches:', matches);
                    }

                    return matches;
                } catch (error) {
                    console.error('Search filter error for item:', item, error);
                    return true; // Include item if search fails
                }
            })
            .filter(item => {
                // 默认显示所有类型的菜单项，不按时间过滤
                return true;
            })
        .sort((a, b) => (a.sortingNrm || 0) - (b.sortingNrm || 0))
    : [];

    return React.createElement('div', { className: 'restaurant-console' },
        // Header
        React.createElement('div', { className: 'console-header' },
            React.createElement('h1', null, '🍱 ', data.config?.restName || RESTAURANT_CONFIG.restaurantDisplayName),
            React.createElement('div', { className: 'header-controls' },
                // Language Selector
                React.createElement('div', { className: 'language-selector' },
                    React.createElement('label', { style: { fontSize: '12px', color: '#666', marginRight: '5px' } }, '🌐'),
                    React.createElement('select', {
                        value: currentLanguage,
                        onChange: (e) => changeLanguage(e.target.value),
                        style: {
                            padding: '4px 8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: '#fff'
                        }
                    },
                        React.createElement('option', { value: 'nl' }, 'Nederlands'),
                        React.createElement('option', { value: 'en' }, 'English'),
                        React.createElement('option', { value: 'zh' }, '中文')
                    )
                ),
                React.createElement('div', { className: 'user-info' },
                    '👤 ', currentUser?.email || 'Manager'
                )
            )
        ),

        // Navigation Tabs
        React.createElement('div', { className: 'nav-tabs' },
            React.createElement('button', {
                className: `tab ${activeTab === 'menu' ? 'active' : ''}`,
                onClick: () => setActiveTab('menu')
            }, '🍜 ' + t('navMenu')),
            React.createElement('button', {
                className: `tab ${activeTab === 'settings' ? 'active' : ''}`,
                onClick: () => setActiveTab('settings')
            }, '⚙️ ' + t('navSettings')),
            React.createElement('button', {
                className: `tab ${activeTab === 'tables' ? 'active' : ''}`,
                onClick: () => setActiveTab('tables')
            }, '🍽️ ' + t('navTables'))
        ),

        // Content Area
        React.createElement('div', { className: 'content-area' },
            // Menu Tab
            activeTab === 'menu' && React.createElement('div', { className: 'menu-management' },
                React.createElement('div', { className: 'menu-header' },
                    React.createElement('h2', null, '📋 Menu Management'),
                    React.createElement('div', { className: 'menu-search' },
                        React.createElement('input', {
                            type: 'text',
                            placeholder: '🔍 Search menu items...',
                            value: searchQuery,
                            onChange: (e) => setSearchQuery(e.target.value),
                            className: 'search-input'
                        })
                    ),
                    React.createElement('div', { className: 'menu-header-actions' },
                        React.createElement('button', {
                            onClick: handleAddNewItem,
                            className: 'add-item-btn'
                        }, '➕ Add New Item'),
                        React.createElement('button', {
                            onClick: handleExportMenu,
                            className: 'export-btn'
                        }, '📤 Export Menu'),
                        React.createElement('input', {
                            type: 'file',
                            accept: '.json',
                            onChange: handleImportMenu,
                            style: { display: 'none' },
                            id: 'import-file'
                        }),
                        React.createElement('button', {
                            onClick: () => document.getElementById('import-file').click(),
                            className: 'import-btn'
                        }, '📥 Import Menu'),
                        React.createElement('p', { className: 'menu-subtitle' },
                            searchQuery ?
                                `${menuItems.length} items found • Searching for "${searchQuery}"` :
                                `${menuItems.length} items • Change display order numbers to reposition items`
                        )
                    )
                ),

                // Menu Items Grid
                React.createElement('div', { className: 'menu-grid' },
                    menuItems.length > 0 ?
                        menuItems.map(item =>
                            React.createElement(MenuItemCard, {
                                key: item.id,
                                item: item,
                                allMenuItems: menuItems,
                                onEdit: handleMenuItemEdit,
                                onDelete: handleDeleteItem,
                                onSortChange: handleSortingChangeSmart,
                                onPositionExchange: handlePositionExchange
                            })
                        ) :
                        React.createElement('div', { className: 'no-results' },
                            searchQuery ?
                                React.createElement('div', null,
                                    React.createElement('h3', null, '🔍 No Results Found'),
                                    React.createElement('p', null, `No menu items found for "${searchQuery}"`),
                                    React.createElement('p', null, 'Try searching with different keywords')
                                ) :
                                React.createElement('div', null,
                                    React.createElement('h3', null, '📋 No Menu Items'),
                                    React.createElement('p', null, 'Click "Add New Item" to create your first menu item')
                                )
                        )
                )
            ),

            // Settings Tab
            activeTab === 'settings' && React.createElement(SettingsPanel, {
                config: data.config || {},
                onSave: handleConfigSave
            }),

            // Tables Tab
            activeTab === 'tables' && React.createElement(TableManagementPanel, {
                tableOrderData: null, // TableOrder is now a field in each table
                liveTableData: data.tafel || {},
                onEdit: handleTableEdit,
                onDelete: handleDeleteTable,
                onAdd: handleAddNewTable,
                onCreateSamples: handleCreateSampleTables
            })
        ),

        // Edit Modal
        showEditModal && React.createElement(MenuItemEditModal, {
            key: editingItem ? `edit-${editingItem.id}` : 'add-new', // Stable key to prevent remounting
            item: editingItem,
            isOpen: showEditModal,
            onClose: () => {
                setShowEditModal(false);
                // Delay clearing editingItem to prevent flicker
                setTimeout(() => setEditingItem(null), 0);
            },
            onSave: handleSaveItem,
            allMenuItems: menuItems
        }),

        // Table Edit Modal
        React.createElement(TableEditModal, {
            table: editingTable,
            isOpen: showTableEditModal,
            onClose: () => {
                setShowTableEditModal(false);
                setEditingTable(null);
            },
            onSave: handleSaveTable,
            allTables: data.TableOrder ? Object.values(data.TableOrder) : []
        })
    );
}

// Main App with Language Provider
function RestaurantManagementApp() {
    return React.createElement(LanguageProvider, null,
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
    LanguageProvider,
    RestaurantDataOperations
};
