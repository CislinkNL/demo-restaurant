// Restaurant Management Console - User-friendly interface for restaurant managers
// Focuses on practical restaurant management tasks, hiding technical details

// Note: React hooks will be destructured inside the component function
// to ensure React is loaded first

// 🌐 MULTI-LANGUAGE SUPPORT SYSTEM
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
        setAllDinner: '全部设为晚餐',
        setAllLunch: '全部设为午餐',
        
        // Menu Management
        addNewItem: '➕ 添加新菜品',
        editItem: '✏️ 编辑菜品',
        deleteItem: '🗑️ 删除菜品',
        saveItem: '💾 保存菜品',
        category: '分类:',
        description: '描述:',
        price: '价格:',
        allergyInfo: '过敏信息:',
        
        // Table Status
        tableNumber: '桌号:',
        status: '状态:',
        persons: '人数:',
        pincode: 'PIN码:',
        url: 'URL:',
        orders: '订单:',
        menuQuantity: '套餐数量:',
        totalAmount: '总金额:',
        orderTotalAmount: '订单总额:',
        timerDuration: '计时器时长 (分钟):',
        orderSettings: '订单设置',
        
        // Common Actions
        save: '保存',
        edit: '编辑',
        delete: '删除',
        cancel: '取消',
        close: '关闭',
        add: '添加',
        update: '更新',
        refresh: '刷新',
        
        // Status Values
        open: '开放',
        occupied: '占用',
        closed: '关闭',
        dinner: '晚餐',
        lunch: '午餐',
        
        // Messages
        saveSuccess: '保存成功',
        saveFailed: '保存失败',
        deleteSuccess: '删除成功',
        deleteFailed: '删除失败',
        confirmDelete: '确认删除',
        areYouSure: '您确定要删除这个项目吗？',
        pleaseEnterValidPersons: '请输入有效的人数',
        pleaseEnterTableNumber: '请输入桌台号码',
        tableNumberRequired: '桌台号码是必需的',
        tableNumberExists: '桌台号码',
        tableNumberExists2: '已存在',
        tableIdentifierMissing: '桌台标识符缺失',
        
        // Authentication
        authRequired: '需要认证',
        signIn: '登录',
        signOut: '登出',
        email: '邮箱:',
        password: '密码:',
        invalidCredentials: '无效的凭据',
        authError: '认证错误',
        
        // Loading
        loading: '加载中...',
        loadingData: '正在加载数据...',
        loadingMenu: '正在加载菜单...',
        loadingTables: '正在加载桌台...',
        
        // Errors
        errorOccurred: '发生错误',
        failedToLoad: '加载失败',
        failedToSave: '保存失败',
        noDataFound: '未找到数据',
        
        // Settings
        saveSettings: '保存设置',
        settingsUpdated: '设置已更新',
        settingsUpdateFailed: '设置更新失败',
        
        // Restaurant Config
        restaurantConfig: '餐厅配置',
        basicInfo: '基本信息',
        operatingHours: '营业时间',
        menuSettings: '菜单设置',
        
        // Time Display
        currentTime: '当前时间',
        currentTimeIs: '当前时间是',
        hour: '点'
    },
    
    nl: {
        // Navigation
        navMenu: 'Menu Beheer',
        navSettings: 'Instellingen',
        navTables: 'Tafel Beheer',
        
        // Main Headers
        restaurantConsole: 'Restaurant Beheer Console',
        menuManagement: '📋 Menu Beheer',
        settingsTitle: '🔧 Restaurant Instellingen',
        tablesTitle: '🍽️ Tafel Beheer',
        
        // Settings Panel
        basicSettings: '📋 Basis Instellingen',
        restaurantName: 'Restaurant Naam:',
        maxTime: 'Maximale Tijd (minuten):',
        roundTime: 'Ronde Tijd (minuten):',
        foodLimit: 'Eten Limiet:',
        dessertLimit: 'Dessert Limiet:',
        enableTimeLimit: 'Tijdslimiet Inschakelen',
        requirePinToClose: 'PIN Vereist om Tafel te Sluiten',
        
        // Admin Password
        adminPassword: '🔐 Beheerder Wachtwoord',
        currentPassword: 'Huidig Wachtwoord:',
        change: 'Wijzigen',
        cancel: 'Annuleren',
        enterCurrentPassword: 'Voer huidig wachtwoord in:',
        newPassword: 'Nieuw Wachtwoord:',
        confirmPassword: 'Bevestig Wachtwoord:',
        updatePassword: 'Update Wachtwoord',
        
        // WhatsApp Settings
        whatsappSettings: '📱 WhatsApp Instellingen',
        enableWhatsapp: 'WhatsApp Berichten Inschakelen',
        whatsappRecipients: 'WhatsApp Ontvangers:',
        addRecipient: '+ Toevoegen',
        
        // Table Management
        tableManagement: '🍽️ Tafel Beheer',
        menuTypeControl: '🕒 Menu Type Controle',
        setAllDinner: 'Alles naar Diner',
        setAllLunch: 'Alles naar Lunch',
        
        // Menu Management
        addNewItem: '➕ Nieuw Item Toevoegen',
        editItem: '✏️ Item Bewerken',
        deleteItem: '🗑️ Item Verwijderen',
        saveItem: '💾 Item Opslaan',
        category: 'Categorie:',
        description: 'Beschrijving:',
        price: 'Prijs:',
        allergyInfo: 'Allergie Informatie:',
        
        // Table Status
        tableNumber: 'Tafel Nummer:',
        status: 'Status:',
        persons: 'Personen:',
        pincode: 'PIN Code:',
        url: 'URL:',
        orders: 'Bestellingen:',
        menuQuantity: 'Menu Hoeveelheid:',
        totalAmount: 'Totaal Bedrag:',
        orderTotalAmount: 'Bestelling Totaal Bedrag:',
        timerDuration: 'Timer Duur (minuten):',
        orderSettings: 'Bestelling Instellingen',
        
        // Common Actions
        save: 'Opslaan',
        edit: 'Bewerken',
        delete: 'Verwijderen',
        cancel: 'Annuleren',
        close: 'Sluiten',
        add: 'Toevoegen',
        update: 'Bijwerken',
        refresh: 'Vernieuwen',
        
        // Status Values
        open: 'Open',
        occupied: 'Bezet',
        closed: 'Gesloten',
        dinner: 'Diner',
        lunch: 'Lunch',
        
        // Messages
        saveSuccess: 'Succesvol Opgeslagen',
        saveFailed: 'Opslaan Mislukt',
        deleteSuccess: 'Succesvol Verwijderd',
        deleteFailed: 'Verwijderen Mislukt',
        confirmDelete: 'Bevestig Verwijdering',
        areYouSure: 'Weet je zeker dat je dit item wilt verwijderen?',
        pleaseEnterValidPersons: 'Voer een geldig aantal personen in',
        pleaseEnterTableNumber: 'Voer tafel nummer in',
        tableNumberRequired: 'Tafel nummer is vereist',
        tableNumberExists: 'Tafel nummer',
        tableNumberExists2: 'bestaat al',
        tableIdentifierMissing: 'Tafel identifier ontbreekt',
        
        // Authentication
        authRequired: 'Authenticatie Vereist',
        signIn: 'Inloggen',
        signOut: 'Uitloggen',
        email: 'E-mail:',
        password: 'Wachtwoord:',
        invalidCredentials: 'Ongeldige Gegevens',
        authError: 'Authenticatie Fout',
        
        // Loading
        loading: 'Laden...',
        loadingData: 'Data Laden...',
        loadingMenu: 'Menu Laden...',
        loadingTables: 'Tafels Laden...',
        
        // Errors
        errorOccurred: 'Er is een fout opgetreden',
        failedToLoad: 'Laden Mislukt',
        failedToSave: 'Opslaan Mislukt',
        noDataFound: 'Geen Data Gevonden',
        
        // Settings
        saveSettings: 'Instellingen Opslaan',
        settingsUpdated: 'Instellingen Bijgewerkt',
        settingsUpdateFailed: 'Instellingen Update Mislukt',
        
        // Restaurant Config
        restaurantConfig: 'Restaurant Configuratie',
        basicInfo: 'Basis Informatie',
        operatingHours: 'Openingstijden',
        menuSettings: 'Menu Instellingen',
        
        // Time Display
        currentTime: 'Huidige Tijd',
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

    // Translation function
    const t = (key) => {
        const translation = LANGUAGE_TRANSLATIONS[currentLanguage]?.[key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
            return key;
        }
        return translation;
    };

    // Function to change language
    const changeLanguage = (lang) => {
        if (LANGUAGE_TRANSLATIONS[lang]) {
            setCurrentLanguage(lang);
            localStorage.setItem('preferredLanguage', lang);
        }
    };

    // Load preferred language from localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && LANGUAGE_TRANSLATIONS[savedLang]) {
            setCurrentLanguage(savedLang);
        }
    }, []);

    const value = {
        currentLanguage,
        changeLanguage,
        t,
        availableLanguages: Object.keys(LANGUAGE_TRANSLATIONS)
    };

    return React.createElement(LanguageContext.Provider, {
        value
    }, children);
}

// Restaurant configuration with fallback values
const RESTAURANT_CONFIG = {
    restaurantDisplayName: 'Boss Restaurant'
};

function getRestaurantPath() {
    // Unified path logic - always use 'bossrestaurant' for this instance
    return 'restaurants/bossrestaurant';
}

// Data operations class for handling Firebase operations
const RestaurantDataOperations = {
    // Get restaurant configuration
    async getRestaurantConfig() {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            const configRef = database.ref(`${restaurantPath}/config`);
            const snapshot = await configRef.once('value');
            return snapshot.val() || {};
        } catch (error) {
            console.error('Error getting restaurant config:', error);
            return {};
        }
    },

    // Save restaurant configuration
    async saveConfig(configData) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            await database.ref(`${restaurantPath}/config`).update(configData);
            return true;
        } catch (error) {
            console.error('Error saving config:', error);
            throw error;
        }
    },

    // Table operations
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

    async saveTableSettings(tableId, settings) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            const updates = {};
            
            // Update only provided settings
            if (settings.Status !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/Status`] = settings.Status;
            }
            if (settings.Persons !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/Persons`] = settings.Persons;
            }
            if (settings.Pincode !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/Pincode`] = settings.Pincode;
            }
            if (settings.URL !== undefined) {
                updates[`${restaurantPath}/tafel/${tableId}/URL`] = settings.URL;
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

    async updateTableStatus(tableId, status, pincode = null) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            const updates = {};
            
            updates[`${restaurantPath}/tafel/${tableId}/Status`] = status;
            if (pincode !== null) {
                updates[`${restaurantPath}/tafel/${tableId}/Pincode`] = pincode;
            }
            
            await database.ref().update(updates);
            return tableId;
        } catch (error) {
            console.error('Error updating table status:', error);
            throw error;
        }
    },

    async addTable(tableData) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            const tableId = `Tafel-${tableData.TableOrder}`;
            
            const completeTableData = {
                TableOrder: tableData.TableOrder,
                Status: tableData.Status || 'open',
                Persons: tableData.Persons || 2,
                Pincode: tableData.Pincode || this.generatePincode(3),
                URL: tableData.URL || `https://bossrestaurant.web.app/?tafel=${tableData.TableOrder}`,
                menuType: tableData.menuType || 'dinner',
                orders: tableData.orders || { menu: 0, totaalPrijs: 0 },
                timer: tableData.timer || { duration: 15 }
            };
            
            await database.ref(`${restaurantPath}/tafel/${tableId}`).set(completeTableData);
            return tableId;
        } catch (error) {
            console.error('Error adding table:', error);
            throw error;
        }
    },

    async deleteTable(tableId) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            await database.ref(`${restaurantPath}/tafel/${tableId}`).remove();
            return true;
        } catch (error) {
            console.error('Error deleting table:', error);
            throw error;
        }
    },

    // Menu operations
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

    async addMenuItem(itemData) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            const newItemRef = database.ref(`${restaurantPath}/menukaart`).push();
            await newItemRef.set(itemData);
            return newItemRef.key;
        } catch (error) {
            console.error('Error adding menu item:', error);
            throw error;
        }
    },

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

    // Utility functions
    generatePincode(length = 3) {
        return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
    },

    generateRandomPincode(length = 3) {
        return this.generatePincode(length);
    },

    // Batch operations
    async batchUpdateTablePincodes(pincode) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            
            // Get all tables first
            const tablesSnapshot = await database.ref(`${restaurantPath}/tafel`).once('value');
            const tables = tablesSnapshot.val() || {};
            
            const updates = {};
            Object.keys(tables).forEach(tableId => {
                updates[`${restaurantPath}/tafel/${tableId}/Pincode`] = pincode;
            });
            
            await database.ref().update(updates);
            return true;
        } catch (error) {
            console.error('Error batch updating table pincodes:', error);
            throw error;
        }
    },

    async renumberAllMenuItems() {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            
            // Get all menu items
            const menuSnapshot = await database.ref(`${restaurantPath}/menukaart`).once('value');
            const menuItems = menuSnapshot.val() || {};
            
            // Sort by current order and reassign
            const sortedItems = Object.entries(menuItems)
                .sort(([, a], [, b]) => (a.order || 999) - (b.order || 999));
            
            const updates = {};
            sortedItems.forEach(([itemId, item], index) => {
                updates[`${restaurantPath}/menukaart/${itemId}/order`] = index + 1;
            });
            
            await database.ref().update(updates);
            return true;
        } catch (error) {
            console.error('Error renumbering menu items:', error);
            throw error;
        }
    },

    async exchangeSortingPositions(itemId1, itemId2) {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            
            // Get both items
            const item1Snapshot = await database.ref(`${restaurantPath}/menukaart/${itemId1}`).once('value');
            const item2Snapshot = await database.ref(`${restaurantPath}/menukaart/${itemId2}`).once('value');
            
            const item1 = item1Snapshot.val();
            const item2 = item2Snapshot.val();
            
            if (!item1 || !item2) {
                throw new Error('One or both items not found');
            }
            
            const order1 = item1.order || 999;
            const order2 = item2.order || 999;
            
            // Exchange orders
            const updates = {};
            updates[`${restaurantPath}/menukaart/${itemId1}/order`] = order2;
            updates[`${restaurantPath}/menukaart/${itemId2}/order`] = order1;
            
            await database.ref().update(updates);
            return true;
        } catch (error) {
            console.error('Error exchanging sorting positions:', error);
            throw error;
        }
    },

    // Load all restaurant data
    async loadRestaurantData() {
        try {
            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            const snapshot = await database.ref(restaurantPath).once('value');
            const data = snapshot.val() || {};
            
            return {
                config: data.config || { restName: RESTAURANT_CONFIG.restaurantDisplayName },
                menukaart: data.menukaart || {},
                categorie: data.categorie || {},
                tafel: data.tafel || {},
                TableOrder: data.TableOrder || {}
            };
        } catch (error) {
            console.error('Error loading restaurant data:', error);
            throw error;
        }
    }
};

// Main App with Language Provider
function RestaurantManagementApp() {
    return React.createElement(LanguageProvider, null,
        React.createElement(RestaurantManagementConsole)
    );
}

// Simple console component for now
function RestaurantManagementConsole() {
    const { t } = useLanguage();
    
    return React.createElement('div', {
        style: { padding: '20px', fontFamily: 'Arial, sans-serif' }
    },
        React.createElement('h1', null, t('restaurantConsole')),
        React.createElement('p', null, 'Console is loading...')
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