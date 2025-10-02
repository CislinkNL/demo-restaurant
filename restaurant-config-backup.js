/**
 * 餐厅配置管理系统 - Restaurant Configuration Management System
 * 
 * 此文件管理所有餐厅的配置参数，支持多餐厅部署。
 * 要为新餐厅配置系统，请：
 * 1. 在 RESTAURANT_CONFIGS 中添加新餐厅配置
 * 2. 修改 CURRENT_RESTAURANT 为新餐厅ID
 * 3. 部署时确保Firebase数据库路径匹配
 * 
 * This file manages all restaurant configuration parameters for multi-restaurant deployment.
 * To configure for a new restaurant:
 * 1. Add new restaurant config to RESTAURANT_CONFIGS
 * 2. Change CURRENT_RESTAURANT to new restaurant ID  
 * 3. Ensure Firebase database paths match when deploying
 */

// 多餐厅配置定义 - Multiple Restaurant Configurations
const RESTAURANT_CONFIGS = {
    // Asian Boulevard 现有配置
    'BlueDragon': {
        // 基础信息 - Basic Information
        restaurantId: 'BlueDragon',
        restaurantPath: 'BlueDragon', // Firebase数据库路径
        displayName: 'Blue Dragon Amsterdam',
        systemTitle: 'Blue Dragon Restaurant Management',
        
        // 网站配置 - Website Configuration
        baseUrl: 'https://bluedragon-ams.web.app',
        domain: 'bluedragon-ams.web.app',
        
        // 货币设置 - Currency Settings
        currency: '€',
        currencyPosition: 'before', // 'before' or 'after'
        
        // 默认业务设置 - Default Business Settings
        defaultMaxTime: 120, // 分钟 - minutes
        defaultFoodLimit: 5,
        defaultDessertLimit: 2,
        defaultRoundTime: 10, // 计时轮次分钟数 - minutes for timing rounds
        defaultAdminPassword: '7788', // 默认管理员密码
        defaultWhatsappEnabled: false, // WhatsApp消息功能
        defaultTimeLimitEnabled: true, // 时间限制功能
        defaultWhatsappRecipients: ['31619971032', '31683560665'], // 默认WhatsApp接收者
        
        // 桌台配置 - Table Configuration  
        tablePrefix: 'Tafel', // 数据库键前缀 (如 "Tafel-1")
        
        // 语言设置 - Language Configuration
        defaultLanguage: 'nl', // 默认语言：'zh' = 中文, 'en' = English, 'nl' = Nederlands
        
        // Firebase配置 - Firebase Configuration
        firebaseConfig: {
            // 如果需要不同餐厅使用不同Firebase项目，在这里配置
            // 否则使用全局Firebase配置
        }
    },
    
    // 新餐厅配置示例 - Example New Restaurant Configuration
    'NewRestaurant': {
        // 基础信息 - Basic Information
        restaurantId: 'NewRestaurant',
        restaurantPath: 'NewRestaurant', // Firebase数据库路径
        displayName: 'New Restaurant Name',
        systemTitle: 'New Restaurant 餐厅管理系统',
        
        // 网站配置 - Website Configuration
        baseUrl: 'https://newrestaurant.web.app',
        domain: 'newrestaurant.web.app',
        
        // 货币设置 - Currency Settings
        currency: '$',
        currencyPosition: 'before',
        
        // 默认业务设置 - Default Business Settings
        defaultMaxTime: 90, // 不同的时间限制
        defaultFoodLimit: 3,
        defaultDessertLimit: 1,
        defaultRoundTime: 10,
        defaultAdminPassword: '1234', // 不同的管理员密码
        defaultWhatsappEnabled: true, // 启用WhatsApp
        defaultTimeLimitEnabled: true,
        defaultWhatsappRecipients: ['1234567890'], // 不同的WhatsApp号码
        
        // 桌台配置 - Table Configuration
        tablePrefix: 'Table', // 英文前缀
        
        // 语言设置 - Language Configuration
        defaultLanguage: 'en', // 默认语言：'zh' = 中文, 'en' = English, 'nl' = Nederlands
        
        // Firebase配置
        firebaseConfig: {
            // 如果使用不同的Firebase项目，在这里配置
        }
    }
};

// 当前餐厅配置 - Current Restaurant Configuration
// 🔧 部署时修改此行以切换餐厅 - Change this line when deploying for different restaurants
const CURRENT_RESTAURANT = 'BlueDragon'; // 例如 'AsianBoulevard' 或 'NewRestaurant'

// 获取当前餐厅配置 - Get Current Restaurant Configuration
const RESTAURANT_CONFIG = RESTAURANT_CONFIGS[CURRENT_RESTAURANT];

// 验证配置有效性 - Validate Configuration
if (!RESTAURANT_CONFIG) {
    console.error(`❌ 餐厅配置不存在: ${CURRENT_RESTAURANT}`);
    console.error('可用配置:', Object.keys(RESTAURANT_CONFIGS));
    throw new Error(`Restaurant configuration not found: ${CURRENT_RESTAURANT}`);
}

console.log(`✅ 当前餐厅配置加载成功: ${RESTAURANT_CONFIG.displayName} (${CURRENT_RESTAURANT})`);

// ============ 配置访问函数 - Configuration Access Functions ============

/**
 * 获取餐厅数据库路径
 * @returns {string} Firebase数据库路径
 */
const getRestaurantPath = () => RESTAURANT_CONFIG.restaurantPath;

/**
 * 获取餐厅ID
 * @returns {string} 餐厅标识符
 */
const getRestaurantId = () => RESTAURANT_CONFIG.restaurantId;

/**
 * 获取餐厅显示名称
 * @returns {string} 餐厅显示名称
 */
const getRestaurantDisplayName = () => RESTAURANT_CONFIG.displayName;

/**
 * 获取系统标题
 * @returns {string} 管理系统标题
 */
const getSystemTitle = () => RESTAURANT_CONFIG.systemTitle;

/**
 * 获取基础URL
 * @returns {string} 餐厅网站基础URL
 */
const getBaseUrl = () => RESTAURANT_CONFIG.baseUrl;

/**
 * 获取域名
 * @returns {string} 餐厅网站域名
 */
const getDomain = () => RESTAURANT_CONFIG.domain;

/**
 * 格式化货币
 * @param {number} amount - 金额
 * @returns {string} 格式化后的货币字符串
 */
const formatRestaurantCurrency = (amount) => {
    const formatted = (amount || 0).toFixed(2);
    return RESTAURANT_CONFIG.currencyPosition === 'before' 
        ? `${RESTAURANT_CONFIG.currency}${formatted}`
        : `${formatted}${RESTAURANT_CONFIG.currency}`;
};

/**
 * 获取桌台前缀
 * @returns {string} 桌台键名前缀
 */
const getTablePrefix = () => RESTAURANT_CONFIG.tablePrefix;

/**
 * 获取默认语言
 * @returns {string} 默认语言代码 ('zh', 'en', 'nl')
 */
const getDefaultLanguage = () => RESTAURANT_CONFIG.defaultLanguage || 'zh';

/**
 * 生成桌台键名
 * @param {string|number} tableNumber - 桌台号码
 * @returns {string} 完整的桌台键名 (如 "Tafel-1")
 */
const generateTableKey = (tableNumber) => `${getTablePrefix()}-${tableNumber}`;

/**
 * 生成完整的桌台URL
 * @param {string|number} tableNumber - 桌台号码
 * @param {string} pincode - 可选的PIN码
 * @returns {string} 完整的桌台访问URL
 */
const generateTableUrl = (tableNumber, pincode = null) => {
    const baseUrl = getBaseUrl();
    const restaurantPath = getRestaurantPath();
    let url = `${baseUrl}/?rest=${restaurantPath}&tafel=${tableNumber}`;
    
    if (pincode) {
        url += `&pincode=${pincode}`;
    }
    
    return url;
};

/**
 * 生成Firebase数据库完整路径
 * @param {...string} paths - 路径片段
 * @returns {string} 完整的Firebase路径
 */
const generateDbPath = (...paths) => {
    const restaurantPath = getRestaurantPath();
    return [restaurantPath, ...paths].filter(p => p).join('/');
};

/**
 * 获取所有可用餐厅配置
 * @returns {Object} 所有餐厅配置
 */
const getAllRestaurantConfigs = () => RESTAURANT_CONFIGS;

/**
 * 检查是否为多餐厅部署
 * @returns {boolean} 是否有多个餐厅配置
 */
const isMultiRestaurant = () => Object.keys(RESTAURANT_CONFIGS).length > 1;

// ============ 导出配置 - Export Configuration ============

// 将配置和函数添加到全局作用域，供其他文件使用
if (typeof window !== 'undefined') {
    // 浏览器环境
    window.RESTAURANT_CONFIG = RESTAURANT_CONFIG;
    window.RESTAURANT_CONFIGS = RESTAURANT_CONFIGS;
    window.CURRENT_RESTAURANT = CURRENT_RESTAURANT;
    
    // 配置访问函数
    window.getRestaurantPath = getRestaurantPath;
    window.getRestaurantId = getRestaurantId;
    window.getRestaurantDisplayName = getRestaurantDisplayName;
    window.getSystemTitle = getSystemTitle;
    window.getBaseUrl = getBaseUrl;
    window.getDomain = getDomain;
    window.formatRestaurantCurrency = formatRestaurantCurrency;
    window.getTablePrefix = getTablePrefix;
    window.getDefaultLanguage = getDefaultLanguage;
    window.generateTableKey = generateTableKey;
    window.generateTableUrl = generateTableUrl;
    window.generateDbPath = generateDbPath;
    window.getAllRestaurantConfigs = getAllRestaurantConfigs;
    window.isMultiRestaurant = isMultiRestaurant;
    
    console.log('📋 餐厅配置系统已加载到全局作用域');
} else {
    // Node.js环境 (如果需要)
    module.exports = {
        RESTAURANT_CONFIG,
        RESTAURANT_CONFIGS,
        CURRENT_RESTAURANT,
        getRestaurantPath,
        getRestaurantId,
        getRestaurantDisplayName,
        getSystemTitle,
        getBaseUrl,
        getDomain,
        formatRestaurantCurrency,
        getTablePrefix,
        getDefaultLanguage,
        generateTableKey,
        generateTableUrl,
        generateDbPath,
        getAllRestaurantConfigs,
        isMultiRestaurant
    };
}

// ============ 配置验证和调试信息 - Configuration Validation and Debug Info ============

console.log('🏪 餐厅配置系统初始化完成');
console.log('📊 配置详情:');
console.log(`  - 餐厅ID: ${getRestaurantId()}`);
console.log(`  - 显示名称: ${getRestaurantDisplayName()}`);
console.log(`  - 数据库路径: ${getRestaurantPath()}`);
console.log(`  - 网站URL: ${getBaseUrl()}`);
console.log(`  - 货币: ${RESTAURANT_CONFIG.currency} (${RESTAURANT_CONFIG.currencyPosition})`);
console.log(`  - 桌台前缀: ${getTablePrefix()}`);
console.log(`  - 默认语言: ${getDefaultLanguage()}`);
console.log(`  - 多餐厅模式: ${isMultiRestaurant() ? '是' : '否'}`);
console.log(`  - 可用餐厅: ${Object.keys(RESTAURANT_CONFIGS).join(', ')}`);