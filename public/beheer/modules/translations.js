// 完整语言翻译模块 - 支持中英荷三语言
// Complete Language Translations Module - Support Chinese, English, Dutch
// Version: 2024-10-04-v2 (React fix)

// 完整的三语言翻译对象
window.LANGUAGE_TRANSLATIONS = {
    zh: {
        // 基础操作
        loading: '加载中...',
        save: '保存',
        cancel: '取消',
        delete: '删除',
        edit: '编辑',
        add: '添加',
        search: '搜索',
        retry: '重试',
        
        // 主导航
        restaurantConsole: '餐厅管理控制台',
        menuManagement: '菜单管理',
        settingsTitle: '餐厅设置',
        tablesTitle: '桌台管理',
        
        // 认证相关
        loginTitle: '员工登录',
        email: '邮箱',
        password: '密码',
        loginButton: '登录',
        loggingIn: '登录中...',
        logout: '退出',
        unauthorizedAccess: '仅限授权员工使用',
        pleaseEnterEmailPassword: '请输入邮箱和密码',
        userNotAuthenticated: '用户未认证',
        
        // 菜单管理
        menuItems: '菜单项目',
        addMenuItem: '添加菜品',
        editMenuItem: '编辑菜品',
        saveChanges: '保存修改',
        itemName: '项目名称',
        price: '价格',
        description: '描述',
        category: '分类',
        sortNumber: '排序号',
        group: '分组',
        taxRate: '税率',
        allergyInfo: '过敏信息',
        imagePath: '图片路径',
        status: '状态',
        menuType: '菜单类型',
        available: '可用',
        soldOut: '售罄',
        unavailable: '不可用',
        dinner: '晚餐',
        lunch: '午餐',
        allDay: '全天',
        moveUp: '上移',
        moveDown: '下移',
        
        // 套餐定价设置
        packagePricing: '套餐定价',
        packagePricingRule: '套餐All-in含饮料价格规则',
        packagePricingDesc: '设置该饮料在All-in套餐中的定价规则',
        priceNormal: '正常价格',
        priceHalf: '半价',
        priceFree: '免费',
        allinPackage: 'All-in套餐',
        normalMenu: '正常菜单',
        
        // 菜单排序
        renumberMenuItems: '重新排列菜单',
        confirmRenumberMenu: '确定要重新排列所有菜单项目的排序号码吗？这将按当前顺序重置所有项目的序号。',
        renumberSuccess: '菜单项目排序号码已成功重新排列！',
        renumberFailed: '重新排列菜单失败',
        
        // SKU管理
        skuRequired: 'SKU不能为空',
        skuExists: 'SKU已存在，请使用不同的SKU',
        skuInvalid: 'SKU格式无效',
        
        // 桌台管理
        tableManagement: '桌台管理',
        addTable: '添加桌台',
        editTable: '编辑桌台',
        tableNumber: '桌台号码',
        capacity: '人数',
        tableStatus: '桌台状态',
        statusOpen: '空闲',
        statusOccupied: '有客',
        statusReserved: '预定',
        statusClosed: '关闭',
        qrCode: '二维码',
        orderHistory: '订单历史',
        generateQR: '生成二维码',
        viewHistory: '查看历史',
        
        // 设置管理
        restaurantSettings: '餐厅设置',
        categories: '分类设置',
        hiddenItems: '隐藏项目',
        addCategory: '添加分类',
        foodCategories: '食物分类',
        drinkCategories: '饮料分类',
        newCategory: '新分类',
        newDrinkCategory: '新饮料分类',
        categoryName: '分类名称',
        hideFromCustomers: '对客户隐藏项目',
        hiddenReason: '隐藏原因',
        adminHidden: '管理员隐藏',
        alreadyHidden: '已隐藏项目',
        
        // 消息提示
        settingsSaved: '设置保存成功',
        loadingFailed: '加载失败',
        saveFailed: '保存失败',
        dataLoadFailed: '数据加载失败',
        unknownError: '未知错误',
        tableNumberRequired: '桌台号码不能为空',
        pleaseEnterValidCapacity: '请输入有效的人数',
        pleaseEnterTableNumber: '请输入桌台号码',
        pleaseSetTableNumber: '请先设置桌台号码',
        tableDataNotFound: '桌台数据未找到',
        updateTableStatusFailed: '更新桌子状态失败',
        addTableFailed: '添加桌子失败',
        deleteTableFailed: '删除桌子失败',
        saveTableFailed: '保存桌子失败',
        moveUpFailed: '向上移动菜品失败',
        moveDownFailed: '向下移动菜品失败',
        categoryLoadFailed: '分类数据加载失败',
        firebaseUnavailable: 'Firebase数据库服务不可用',
        
        // 桌台管理详细功能
        generateQRCode: '📱 生成二维码',
        passwordFree: '免密',
        timer: '计时',
        minutes: '分钟',
        persons: '人数',
        pinCode: 'PIN',
        menu: '套餐',
        menuType: '菜单',
        totalPrice: '总价',
        table: '桌台',
        
        // 桌台编辑表单
        basicInfo: '基本信息',
        tableNumberRequired: '桌台号码 *',
        tableNumberPlaceholder: '请输入桌台号码，如: T01, T02',
        diningPersons: '就餐人数',
        statusOpenIdle: '开放 空闲',
        statusOccupiedBusy: '占用 有客',
        statusReserved: '预定',
        statusClosed: '关闭',
        pinCodeAutoGenerate: 'PIN码 (自动生成)',
        leaveBlankAutoGenerate: '留空自动生成',
        timerMinutes: '计时器(分钟)',
        currentMenu: '当前菜单',
        totalPriceEuro: '总价 (€)',
        qrLinkAutoGenerate: 'QR链接 (自动生成)',
        
        // 旧版桌台编辑表单翻译
        pleaseEnterValidPersons: '请输入有效的人数',
        pleaseEnterTableNumber: '请输入桌台号码',
        tableNumberColon: '桌台号码: *',
        tableNumberPlaceholderOld: '输入桌台号码，如: 1, 2, 10',
        personsColon: '人数:',
        pinCodeColon: 'PIN码:',
        randomGenerate: '随机生成',
        statusColon: '状态:',
        menuTypeColon: '菜单类型:',
        openAvailable: 'Open 开放',
        closedStatus: 'Closed 关闭',
        occupiedStatus: 'Occupied 占用',
        reservedStatus: 'Reserved 预订',
        dinnerMenu: 'Dinner 晚餐',
        lunchMenu: 'Lunch 午餐',
        weekendMenu: 'Weekend 周末',
        orderSettings: '订单与设置',
        menuQuantity: '套餐数量:',
        orderTotalAmount: '订单总额 (€):',
        timerDurationMinutes: '计时器时长 (分钟):',
        tableUrl: '桌台URL:',
        regenerateUrl: '重新生成URL',
        pleaseSetTableNumberFirst: '请先设置桌台号码',
        saveChanges: '保存修改',
        addTable: '添加桌台',
        
        // 搜索和占位符
        searchMenuItems: '查找菜品...',
        
        // 基本设置和管理
        basicSettings: '基本设置',
        addNewTable: '添加新桌台',
        editTable: '编辑桌台',
        
        // 表单验证消息
        pleaseEnterItemNameAndSKU: '请填写菜品名称和SKU',
        
        // 桌台卡片显示翻译
        personsCount: '人数',
        menuSet: '套餐',
        
        // 设置页面翻译
        restaurantName: '餐厅名称',
        adminPassword: '管理员密码',
        maxTimeSeconds: '最大时间 (秒)',
        roundTimeMinutes: '轮次时间 (分钟)',
        foodLimit: '食物限制',
        dessertLimit: '甜品限制',
        enableTimeLimit: '启用时间限制',
        requirePinToClose: '关闭桌台需要PIN',
        enableTranslation: '启用翻译功能',
        enableWhatsApp: '启用WhatsApp消息',
        whatsappRecipients: 'WhatsApp收件人 (每行一个)',
        restaurantLogoUrl: '餐厅徽标图像 URL',
        categoryManagement: '分类管理',
        testConnection: '测试连接',
        reload: '重新加载',
        foodCategories: '食物分类',
        drinkCategories: '饮料分类',
        serviceCategory: '服务分类',
        addCategory: '+ 添加',
        moveToFood: '←食物',
        moveToDrinks: '→饮料',
        noFoodCategories: '暂无食物分类',
        noDrinkCategories: '暂无饮料分类',
        saveCategorySettings: '保存分类设置',
        hiddenItemsManagement: '对客户隐藏的项目',
        refresh: '🔄 刷新',
        addHiddenItem: '+ 添加隐藏项目',
        hiddenItemsDescription: '这里管理对客户端隐藏的菜单项目。项目以SKU为标识存储在 /menukaart/exceptions 路径下，客户端加载菜单时会自动排除这些SKU。',
        noHiddenItems: '暂无隐藏项目',
        hiddenReason: '隐藏原因',
        saveHiddenItems: '保存隐藏项目设置',
        categoryDataInitializing: '分类数据初始化中...',
        debugInfo: '调试信息',
        saving: '保存中...',
        manualReload: '手动重新加载隐藏项目数据',
        hiddenItem: '已隐藏项目',
        refreshSuccess: '刷新成功！找到',
        hiddenItemsCount: '个隐藏项目',
        refreshFailed: '刷新失败',
        
        // 确认和错误消息
        confirmDeleteMenu: '确定要删除这个菜单项目吗？',
        firebaseConnectionFailed: 'Firebase数据库连接失败，请检查网络连接和权限设置',
        categoryDataLoadFailed: '分类数据加载失败',
        unknownError: '未知错误',
        moveToDrinksTitle: '移动到饮料分类',
        moveToFoodTitle: '移动到食物分类',
        
        // 操作结果消息
        saveFailed: '保存失败',
        deleteFailed: '删除失败',
        saveTableFailed: '保存桌台失败',
        tableDeleteSuccess: '桌台删除成功!',
        deleteTableFailed: '删除桌台失败',
        updateTableStatusFailed: '更新桌台状态失败',
        saveSettingsFailed: '保存设置失败',
        categorySaveSuccess: '分类设置保存成功 (包括Services分类)',
        saveCategoryFailed: '保存分类设置失败',
        hiddenItemsSaveSuccess: '隐藏项目设置保存成功',
        hiddenItemsCount2: '共',
        hiddenItemsCount3: '个项目',
        saveHiddenItemsFailed: '保存隐藏项目设置失败',
        confirmRemoveHiddenItem: '确定要移除隐藏项目',
        loadCategoryFailed: '加载分类设置失败',
        confirmDeleteCategory: '确定要删除这个分类吗？',
        updateTableStatusFailedShort: '更新桌子状态失败',
        addTableFailed: '添加桌子失败',
        confirmDeleteTable: '确定要删除这张桌子吗？',
        deleteTableFailedShort: '删除桌子失败',
        saveTableFailedShort: '保存桌子失败',
        moveUpFailed: '向上移动菜品失败',
        moveDownFailed: '向下移动菜品失败',
        
        // 错误对象消息
        firebaseServiceUnavailable: 'Firebase数据库服务不可用',
        firebaseNotConnected: 'Firebase未连接', 
        firebaseConnectionError: 'Firebase连接失败，请检查网络和权限',
        tableIdentifierMissing: '桌台标识符缺失，无法更新',
        tableNumberExists: '桌台',
        tableNumberExists2: '已存在，请选择其他号码',
        tableDataNotFound: '桌台数据未找到',
        tableSaveSuccess: '桌台保存成功!',
        moveToDrinksTitle: '移动到饮料分类',
        moveToFoodTitle: '移动到食物分类',
        
        // 菜单项显示翻译
        priceLabel: '价格',
        statusLabel: '状态',
        groupLabel: '分组',
        allergyLabel: '过敏',
        noImage: '无图片',
        moveUpTitle: '向上移动',
        moveDownTitle: '向下移动',
        editButton: '编辑',
        deleteButton: '删除',
        noMenuItems: '暂无菜单项目',
        noMatchFound: '没有找到匹配',
        description: '说明',
        
        // 语言选择器
        language: '语言',
        chinese: '中文',
        english: 'English',
        dutch: 'Nederlands',
        
        // 批量密码更改
        batchChangePincode: '批量更换密码',
        pincodeGenerationMethod: 'PIN码生成方式',
        generateRandomPincode: '随机生成PIN码',
        enterCustomPincode: '输入统一PIN码',
        pincodeDigits: 'PIN码位数',
        enter3or4DigitPincode: '请输入3-4位数字',
        adminPasswordVerification: '管理员密码验证',
        adminPasswordRequired: '请输入管理员密码进行验证',
        customPincodeRequired: '请输入要设置的PIN码',
        pincodeLength3to4: 'PIN码必须为3-4位数字',
        enterAdminPassword: '请输入管理员密码',
        warning: '重要提醒',
        batchPincodeWarning: '此操作将同时更改所有桌台的PIN码，操作后客人需使用新密码，请谨慎操作！',
        confirmBatchUpdate: '确认批量更新',
        updating: '正在更新中...'
    },
    en: {
        // Basic operations
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search',
        retry: 'Retry',
        
        // Main navigation
        restaurantConsole: 'Restaurant Management Console',
        menuManagement: 'Menu Management',
        settingsTitle: 'Restaurant Settings',
        tablesTitle: 'Table Management',
        
        // Authentication
        loginTitle: 'Staff Login',
        email: 'Email',
        password: 'Password',
        loginButton: 'Login',
        loggingIn: 'Logging in...',
        logout: 'Logout',
        unauthorizedAccess: 'Authorized staff only',
        pleaseEnterEmailPassword: 'Please enter email and password',
        userNotAuthenticated: 'User not authenticated',
        
        // Menu management
        menuItems: 'Menu Items',
        addMenuItem: 'Add Menu Item',
        editMenuItem: 'Edit Menu Item',
        saveChanges: 'Save Changes',
        itemName: 'Item Name',
        price: 'Price',
        description: 'Description',
        category: 'Category',
        sortNumber: 'Sort Number',
        group: 'Group',
        taxRate: 'Tax Rate',
        allergyInfo: 'Allergy Information',
        imagePath: 'Image Path',
        status: 'Status',
        menuType: 'Menu Type',
        available: 'Available',
        soldOut: 'Sold Out',
        unavailable: 'Unavailable',
        dinner: 'Dinner',
        lunch: 'Lunch',
        allDay: 'All Day',
        moveUp: 'Move Up',
        moveDown: 'Move Down',
        
        // Package pricing settings
        packagePricing: 'Package Pricing',
        packagePricingRule: 'All-in Package Drink Pricing Rule',
        packagePricingDesc: 'Set pricing rule for this drink in All-in packages',
        priceNormal: 'Normal Price',
        priceHalf: 'Half Price',
        priceFree: 'Free',
        allinPackage: 'All-in Package',
        normalMenu: 'Normal Menu',
        
        // Menu sorting
        renumberMenuItems: 'Renumber Menu Items',
        confirmRenumberMenu: 'Are you sure you want to renumber all menu items? This will reset the order numbers based on current sequence.',
        renumberSuccess: 'Menu items have been successfully renumbered!',
        renumberFailed: 'Failed to renumber menu items',
        
        // SKU management
        skuRequired: 'SKU is required',
        skuExists: 'SKU already exists, please use a different SKU',
        skuInvalid: 'Invalid SKU format',
        
        // Table management
        tableManagement: 'Table Management',
        addTable: 'Add Table',
        editTable: 'Edit Table',
        tableNumber: 'Table Number',
        capacity: 'Capacity',
        tableStatus: 'Table Status',
        statusOpen: 'Available',
        statusOccupied: 'Occupied',
        statusReserved: 'Reserved',
        statusClosed: 'Closed',
        qrCode: 'QR Code',
        orderHistory: 'Order History',
        generateQR: 'Generate QR',
        viewHistory: 'View History',
        
        // Settings management
        restaurantSettings: 'Restaurant Settings',
        categories: 'Category Settings',
        hiddenItems: 'Hidden Items',
        addCategory: 'Add Category',
        foodCategories: 'Food Categories',
        drinkCategories: 'Drink Categories',
        newCategory: 'New Category',
        newDrinkCategory: 'New Drink Category',
        categoryName: 'Category Name',
        hideFromCustomers: 'Hide Items from Customers',
        hiddenReason: 'Hidden Reason',
        adminHidden: 'Hidden by Admin',
        alreadyHidden: 'Already Hidden Item',
        
        // Messages
        settingsSaved: 'Settings saved successfully',
        loadingFailed: 'Loading failed',
        saveFailed: 'Save failed',
        dataLoadFailed: 'Data loading failed',
        unknownError: 'Unknown error',
        tableNumberRequired: 'Table number cannot be empty',
        pleaseEnterValidCapacity: 'Please enter valid capacity',
        pleaseEnterTableNumber: 'Please enter table number',
        pleaseSetTableNumber: 'Please set table number first',
        tableDataNotFound: 'Table data not found',
        updateTableStatusFailed: 'Failed to update table status',
        addTableFailed: 'Failed to add table',
        deleteTableFailed: 'Failed to delete table',
        saveTableFailed: 'Failed to save table',
        moveUpFailed: 'Failed to move item up',
        moveDownFailed: 'Failed to move item down',
        categoryLoadFailed: 'Failed to load category data',
        firebaseUnavailable: 'Firebase database service unavailable',
        
        // Table management detailed features
        generateQRCode: '📱 Generate QR Code',
        passwordFree: 'Password Free',
        timer: 'Timer',
        minutes: 'minutes',
        persons: 'Persons',
        pinCode: 'PIN',
        menu: 'Menu',
        menuType: 'Menu Type',
        totalPrice: 'Total Price',
        table: 'Table',
        
        // Table edit form
        basicInfo: 'Basic Information',
        tableNumberRequired: 'Table Number *',
        tableNumberPlaceholder: 'Enter table number, e.g.: T01, T02',
        diningPersons: 'Dining Persons',
        statusOpenIdle: 'Open Available',
        statusOccupiedBusy: 'Occupied Busy',
        statusReserved: 'Reserved',
        statusClosed: 'Closed',
        pinCodeAutoGenerate: 'PIN Code (Auto Generate)',
        leaveBlankAutoGenerate: 'Leave blank to auto generate',
        timerMinutes: 'Timer (Minutes)',
        currentMenu: 'Current Menu',
        totalPriceEuro: 'Total Price (€)',
        qrLinkAutoGenerate: 'QR Link (Auto Generate)',
        
        // Old table edit form translations
        pleaseEnterValidPersons: 'Please enter valid number of persons',
        pleaseEnterTableNumber: 'Please enter table number',
        tableNumberColon: 'Table Number: *',
        tableNumberPlaceholderOld: 'Enter table number, e.g.: 1, 2, 10',
        personsColon: 'Persons:',
        pinCodeColon: 'PIN Code:',
        randomGenerate: 'Random Generate',
        statusColon: 'Status:',
        menuTypeColon: 'Menu Type:',
        openAvailable: 'Open Available',
        closedStatus: 'Closed',
        occupiedStatus: 'Occupied',
        reservedStatus: 'Reserved',
        dinnerMenu: 'Dinner',
        lunchMenu: 'Lunch',
        weekendMenu: 'Weekend',
        orderSettings: 'Order Settings',
        menuQuantity: 'Menu Quantity:',
        orderTotalAmount: 'Order Total Amount (€):',
        timerDurationMinutes: 'Timer Duration (Minutes):',
        tableUrl: 'Table URL:',
        regenerateUrl: 'Regenerate URL',
        pleaseSetTableNumberFirst: 'Please set table number first',
        saveChanges: 'Save Changes',
        addTable: 'Add Table',
        
        // Search and placeholders
        searchMenuItems: 'Search menu items...',
        
        // Basic settings and management
        basicSettings: 'Basic Settings',
        addNewTable: 'Add New Table',
        editTable: 'Edit Table',
        
        // Form validation messages
        pleaseEnterItemNameAndSKU: 'Please enter item name and SKU',
        
        // Table card display translations
        personsCount: 'Persons',
        menuSet: 'Set Menu',
        
        // Settings page translations
        restaurantName: 'Restaurant Name',
        adminPassword: 'Admin Password',
        maxTimeSeconds: 'Max Time (seconds)',
        roundTimeMinutes: 'Round Time (minutes)',
        foodLimit: 'Food Limit',
        dessertLimit: 'Dessert Limit',
        enableTimeLimit: 'Enable Time Limit',
        requirePinToClose: 'Require PIN to Close',
        enableTranslation: 'Enable Translation',
        enableWhatsApp: 'Enable WhatsApp Messages',
        whatsappRecipients: 'WhatsApp Recipients (one per line)',
        restaurantLogoUrl: 'Restaurant Logo URL',
        categoryManagement: 'Category Management',
        testConnection: 'Test Connection',
        reload: 'Reload',
        foodCategories: 'Food Categories',
        drinkCategories: 'Drink Categories',
        serviceCategory: 'Service Category',
        addCategory: '+ Add',
        moveToFood: '←Food',
        moveToDrinks: '→Drinks',
        noFoodCategories: 'No food categories',
        noDrinkCategories: 'No drink categories',
        saveCategorySettings: 'Save Category Settings',
        hiddenItemsManagement: 'Hidden Items from Customers',
        refresh: '🔄 Refresh',
        addHiddenItem: '+ Add Hidden Item',
        hiddenItemsDescription: 'Manage menu items hidden from customers. Items are stored by SKU at /menukaart/exceptions path, and will be excluded when clients load the menu.',
        noHiddenItems: 'No hidden items',
        hiddenReason: 'Hidden Reason',
        saveHiddenItems: 'Save Hidden Items Settings',
        categoryDataInitializing: 'Category data initializing...',
        debugInfo: 'Debug info',
        saving: 'Saving...',
        manualReload: 'Manually reload hidden items data',
        hiddenItem: 'Hidden item',
        refreshSuccess: 'Refresh successful! Found',
        hiddenItemsCount: ' hidden items',
        refreshFailed: 'Refresh failed',
        
        // 确认和错误消息
        confirmDeleteMenu: 'Are you sure you want to delete this menu item?',
        firebaseConnectionFailed: 'Firebase database connection failed, please check network connection and permission settings',
        categoryDataLoadFailed: 'Category data loading failed',
        unknownError: 'Unknown error',
        moveToDrinksTitle: 'Move to drinks category',
        moveToFoodTitle: 'Move to food category',
        
        // 操作结果消息
        saveFailed: 'Save failed',
        deleteFailed: 'Delete failed',
        saveTableFailed: 'Save table failed',
        tableDeleteSuccess: 'Table deleted successfully!',
        deleteTableFailed: 'Delete table failed',
        updateTableStatusFailed: 'Update table status failed',
        saveSettingsFailed: 'Save settings failed',
        categorySaveSuccess: 'Category settings saved successfully (including Services category)',
        saveCategoryFailed: 'Save category settings failed',
        hiddenItemsSaveSuccess: 'Hidden items settings saved successfully',
        hiddenItemsCount2: 'Total',
        hiddenItemsCount3: ' items',
        saveHiddenItemsFailed: 'Save hidden items settings failed',
        confirmRemoveHiddenItem: 'Are you sure you want to remove hidden item',
        loadCategoryFailed: 'Load category settings failed',
        confirmDeleteCategory: 'Are you sure you want to delete this category?',
        updateTableStatusFailedShort: 'Update table status failed',
        addTableFailed: 'Add table failed',
        confirmDeleteTable: 'Are you sure you want to delete this table?',
        deleteTableFailedShort: 'Delete table failed',
        saveTableFailedShort: 'Save table failed',
        moveUpFailed: 'Move up menu item failed',
        moveDownFailed: 'Move down menu item failed',
        
        // 错误对象消息
        firebaseServiceUnavailable: 'Firebase database service unavailable',
        firebaseNotConnected: 'Firebase not connected', 
        firebaseConnectionError: 'Firebase connection failed, please check network and permissions',
        tableIdentifierMissing: 'Table identifier missing, cannot update',
        tableNumberExists: 'Table',
        tableNumberExists2: 'already exists, please choose another number',
        tableDataNotFound: 'Table data not found',
        tableSaveSuccess: 'Table saved successfully!',
        
        // Menu item display translations
        priceLabel: 'Price',
        statusLabel: 'Status',
        groupLabel: 'Group',
        allergyLabel: 'Allergy',
        noImage: 'No Image',
        moveUpTitle: 'Move Up',
        moveDownTitle: 'Move Down',
        editButton: 'Edit',
        deleteButton: 'Delete',
        noMenuItems: 'No menu items',
        noMatchFound: 'No matches found for',
        description: 'Description',
        
        // Language selector
        language: 'Language',
        chinese: '中文',
        english: 'English',
        dutch: 'Nederlands',
        
        // Batch pincode change
        batchChangePincode: 'Batch Change Table PIN Codes',
        pincodeGenerationMethod: 'PIN Code Generation Method',
        generateRandomPincode: 'Generate Random PIN Codes',
        enterCustomPincode: 'Set Uniform PIN Code',
        pincodeDigits: 'PIN Code Digits',
        enter3or4DigitPincode: 'Enter 3-4 digit number',
        adminPasswordVerification: 'Administrator Password Verification',
        adminPasswordRequired: 'Please enter administrator password for verification',
        customPincodeRequired: 'Please enter the PIN code to set',
        pincodeLength3to4: 'PIN code must be 3-4 digits',
        enterAdminPassword: 'Please enter administrator password',
        warning: 'Important Notice',
        batchPincodeWarning: 'This operation will change all table PIN codes simultaneously. Customers will need the new password after this change. Please proceed with caution!',
        confirmBatchUpdate: 'Confirm Batch Update',
        updating: 'Updating in progress...'
    },
    nl: {
        // Basis bewerkingen
        loading: 'Laden...',
        save: 'Opslaan',
        cancel: 'Annuleren',
        delete: 'Verwijderen',
        edit: 'Bewerken',
        add: 'Toevoegen',
        search: 'Zoeken',
        retry: 'Opnieuw proberen',
        
        // Hoofdnavigatie
        restaurantConsole: 'Restaurant Management Console',
        menuManagement: 'Menu Beheer',
        settingsTitle: 'Restaurant Instellingen',
        tablesTitle: 'Tafel Beheer',
        
        // Authenticatie
        loginTitle: 'Personeel Login',
        email: 'E-mail',
        password: 'Wachtwoord',
        loginButton: 'Inloggen',
        loggingIn: 'Inloggen...',
        logout: 'Uitloggen',
        unauthorizedAccess: 'Alleen geautoriseerd personeel',
        pleaseEnterEmailPassword: 'Voer e-mail en wachtwoord in',
        userNotAuthenticated: 'Gebruiker niet geauthenticeerd',
        
        // Menu beheer
        menuItems: 'Menu Items',
        addMenuItem: 'Menu Item Toevoegen',
        editMenuItem: 'Menu Item Bewerken',
        saveChanges: 'Wijzigingen Opslaan',
        itemName: 'Item Naam',
        price: 'Prijs',
        description: 'Beschrijving',
        category: 'Categorie',
        sortNumber: 'Sorteernummer',
        group: 'Groep',
        taxRate: 'Belastingtarief',
        allergyInfo: 'Allergie Informatie',
        imagePath: 'Afbeelding Pad',
        status: 'Status',
        menuType: 'Menu Type',
        available: 'Beschikbaar',
        soldOut: 'Uitverkocht',
        unavailable: 'Niet beschikbaar',
        dinner: 'Diner',
        lunch: 'Lunch',
        allDay: 'Hele dag',
        moveUp: 'Omhoog',
        moveDown: 'Omlaag',
        
        // Pakket pricing instellingen
        packagePricing: 'Pakket Prijzen',
        packagePricingRule: 'All-in Pakket Drank Prijsregel',
        packagePricingDesc: 'Stel prijsregel in voor deze drank in All-in pakketten',
        priceNormal: 'Normale Prijs',
        priceHalf: 'Halve Prijs',
        priceFree: 'Gratis',
        allinPackage: 'All-in Pakket',
        normalMenu: 'Normale Menu',
        
        // Menu sorteren
        renumberMenuItems: 'Menu Items Hernummeren',
        confirmRenumberMenu: 'Weet je zeker dat je alle menu items wilt hernummeren? Dit zal de volgordenummers resetten op basis van de huidige volgorde.',
        renumberSuccess: 'Menu items zijn succesvol hernummerd!',
        renumberFailed: 'Menu items hernummeren mislukt',
        
        // SKU beheer
        skuRequired: 'SKU is verplicht',
        skuExists: 'SKU bestaat al, gebruik een andere SKU',
        skuInvalid: 'Ongeldig SKU formaat',
        
        // Tafel beheer
        tableManagement: 'Tafel Beheer',
        addTable: 'Tafel Toevoegen',
        editTable: 'Tafel Bewerken',
        tableNumber: 'Tafelnummer',
        capacity: 'Capaciteit',
        tableStatus: 'Tafel Status',
        statusOpen: 'Beschikbaar',
        statusOccupied: 'Bezet',
        statusReserved: 'Gereserveerd',
        statusClosed: 'Gesloten',
        qrCode: 'QR Code',
        orderHistory: 'Bestelgeschiedenis',
        generateQR: 'QR Genereren',
        viewHistory: 'Geschiedenis Bekijken',
        
        // Instellingen beheer
        restaurantSettings: 'Restaurant Instellingen',
        categories: 'Categorie Instellingen',
        hiddenItems: 'Verborgen Items',
        addCategory: 'Categorie Toevoegen',
        foodCategories: 'Eten Categorieën',
        drinkCategories: 'Drank Categorieën',
        newCategory: 'Nieuwe Categorie',
        newDrinkCategory: 'Nieuwe Drank Categorie',
        categoryName: 'Categorie Naam',
        hideFromCustomers: 'Items Verbergen voor Klanten',
        hiddenReason: 'Verborgen Reden',
        adminHidden: 'Verborgen door Admin',
        alreadyHidden: 'Reeds Verborgen Item',
        
        // Berichten
        settingsSaved: 'Instellingen succesvol opgeslagen',
        loadingFailed: 'Laden mislukt',
        saveFailed: 'Opslaan mislukt',
        dataLoadFailed: 'Gegevens laden mislukt',
        unknownError: 'Onbekende fout',
        tableNumberRequired: 'Tafelnummer kan niet leeg zijn',
        pleaseEnterValidCapacity: 'Voer geldige capaciteit in',
        pleaseEnterTableNumber: 'Voer tafelnummer in',
        pleaseSetTableNumber: 'Stel eerst tafelnummer in',
        tableDataNotFound: 'Tafelgegevens niet gevonden',
        updateTableStatusFailed: 'Bijwerken tafelstatus mislukt',
        addTableFailed: 'Tafel toevoegen mislukt',
        deleteTableFailed: 'Tafel verwijderen mislukt',
        saveTableFailed: 'Tafel opslaan mislukt',
        moveUpFailed: 'Item omhoog verplaatsen mislukt',
        moveDownFailed: 'Item omlaag verplaatsen mislukt',
        categoryLoadFailed: 'Laden categoriegegevens mislukt',
        firebaseUnavailable: 'Firebase database service niet beschikbaar',
        
        // Tafel beheer gedetailleerde functies
        generateQRCode: '📱 QR Code Genereren',
        passwordFree: 'Wachtwoord Vrij',
        timer: 'Timer',
        minutes: 'minuten',
        persons: 'Personen',
        pinCode: 'PIN',
        menu: 'Menu',
        menuType: 'Menu Type',
        totalPrice: 'Totaalprijs',
        table: 'Tafel',
        
        // Tafel bewerkingsformulier
        basicInfo: 'Basis Informatie',
        tableNumberRequired: 'Tafelnummer *',
        tableNumberPlaceholder: 'Voer tafelnummer in, bijv.: T01, T02',
        diningPersons: 'Aantal Personen',
        statusOpenIdle: 'Open Beschikbaar',
        statusOccupiedBusy: 'Bezet Druk',
        statusReserved: 'Gereserveerd',
        statusClosed: 'Gesloten',
        pinCodeAutoGenerate: 'PIN Code (Automatisch Genereren)',
        leaveBlankAutoGenerate: 'Laat leeg voor automatisch genereren',
        timerMinutes: 'Timer (Minuten)',
        currentMenu: 'Huidige Menu',
        totalPriceEuro: 'Totaalprijs (€)',
        qrLinkAutoGenerate: 'QR Link (Automatisch Genereren)',
        
        // Oude tafel bewerkingsformulier vertalingen
        pleaseEnterValidPersons: 'Voer geldig aantal personen in',
        pleaseEnterTableNumber: 'Voer tafelnummer in',
        tableNumberColon: 'Tafelnummer: *',
        tableNumberPlaceholderOld: 'Voer tafelnummer in, bijv.: 1, 2, 10',
        personsColon: 'Personen:',
        pinCodeColon: 'PIN Code:',
        randomGenerate: 'Willekeurig Genereren',
        statusColon: 'Status:',
        menuTypeColon: 'Menu Type:',
        openAvailable: 'Open Beschikbaar',
        closedStatus: 'Gesloten',
        occupiedStatus: 'Bezet',
        reservedStatus: 'Gereserveerd',
        dinnerMenu: 'Diner',
        lunchMenu: 'Lunch',
        weekendMenu: 'Weekend',
        orderSettings: 'Bestelling Instellingen',
        menuQuantity: 'Menu Hoeveelheid:',
        orderTotalAmount: 'Bestelling Totaal Bedrag (€):',
        timerDurationMinutes: 'Timer Duur (Minuten):',
        tableUrl: 'Tafel URL:',
        regenerateUrl: 'URL Opnieuw Genereren',
        pleaseSetTableNumberFirst: 'Stel eerst tafelnummer in',
        saveChanges: 'Wijzigingen Opslaan',
        addTable: 'Tafel Toevoegen',
        
        // Zoeken en tijdelijke aanduidingen
        searchMenuItems: 'Menu-items zoeken...',
        
        // Basis instellingen en beheer
        basicSettings: 'Basis Instellingen',
        addNewTable: 'Nieuwe Tafel Toevoegen',
        editTable: 'Tafel Bewerken',
        
        // Formulier validatie berichten
        pleaseEnterItemNameAndSKU: 'Voer item naam en SKU in',
        
        // Tafelkaart weergave vertalingen
        personsCount: 'Personen',
        menuSet: 'Menu Set',
        
        // Instellingenpagina vertalingen
        restaurantName: 'Restaurant Naam',
        adminPassword: 'Beheerder Wachtwoord',
        maxTimeSeconds: 'Max Tijd (seconden)',
        roundTimeMinutes: 'Ronde Tijd (minuten)',
        foodLimit: 'Eten Limiet',
        dessertLimit: 'Dessert Limiet',
        enableTimeLimit: 'Tijd Limiet Inschakelen',
        requirePinToClose: 'PIN Vereist om te Sluiten',
        enableTranslation: 'Vertaling Inschakelen',
        enableWhatsApp: 'WhatsApp Berichten Inschakelen',
        whatsappRecipients: 'WhatsApp Ontvangers (één per regel)',
        restaurantLogoUrl: 'Restaurant Logo URL',
        categoryManagement: 'Categorie Beheer',
        testConnection: 'Verbinding Testen',
        reload: 'Herladen',
        foodCategories: 'Eten Categorieën',
        drinkCategories: 'Drank Categorieën',
        serviceCategory: 'Service Categorie',
        addCategory: '+ Toevoegen',
        moveToFood: '←Eten',
        moveToDrinks: '→Dranken',
        noFoodCategories: 'Geen eten categorieën',
        noDrinkCategories: 'Geen drank categorieën',
        saveCategorySettings: 'Categorie Instellingen Opslaan',
        hiddenItemsManagement: 'Verborgen Items voor Klanten',
        refresh: '🔄 Vernieuwen',
        addHiddenItem: '+ Verborgen Item Toevoegen',
        hiddenItemsDescription: 'Beheer menu-items verborgen voor klanten. Items worden opgeslagen per SKU op /menukaart/exceptions pad, en worden uitgesloten wanneer klanten het menu laden.',
        noHiddenItems: 'Geen verborgen items',
        hiddenReason: 'Verborgen Reden',
        saveHiddenItems: 'Verborgen Items Instellingen Opslaan',
        categoryDataInitializing: 'Categorie gegevens initialiseren...',
        debugInfo: 'Debug informatie',
        saving: 'Opslaan...',
        manualReload: 'Handmatig verborgen items data herladen',
        hiddenItem: 'Verborgen item',
        refreshSuccess: 'Vernieuwen gelukt! Gevonden',
        hiddenItemsCount: ' verborgen items',
        refreshFailed: 'Vernieuwen mislukt',
        
        // 确认和错误消息
        confirmDeleteMenu: 'Weet je zeker dat je dit menu-item wilt verwijderen?',
        firebaseConnectionFailed: 'Firebase database verbinding mislukt, controleer netwerk verbinding en rechten instellingen',
        categoryDataLoadFailed: 'Categorie gegevens laden mislukt',
        unknownError: 'Onbekende fout',
        moveToDrinksTitle: 'Verplaats naar dranken categorie',
        moveToFoodTitle: 'Verplaats naar voedsel categorie',
        
        // 操作结果消息
        saveFailed: 'Opslaan mislukt',
        deleteFailed: 'Verwijderen mislukt',
        saveTableFailed: 'Tafel opslaan mislukt',
        tableDeleteSuccess: 'Tafel succesvol verwijderd!',
        deleteTableFailed: 'Tafel verwijderen mislukt',
        updateTableStatusFailed: 'Tafelstatus bijwerken mislukt',
        saveSettingsFailed: 'Instellingen opslaan mislukt',
        categorySaveSuccess: 'Categorie instellingen succesvol opgeslagen (inclusief Services categorie)',
        saveCategoryFailed: 'Categorie instellingen opslaan mislukt',
        hiddenItemsSaveSuccess: 'Verborgen items instellingen succesvol opgeslagen',
        hiddenItemsCount2: 'Totaal',
        hiddenItemsCount3: ' items',
        saveHiddenItemsFailed: 'Verborgen items instellingen opslaan mislukt',
        confirmRemoveHiddenItem: 'Weet je zeker dat je verborgen item wilt verwijderen',
        loadCategoryFailed: 'Categorie instellingen laden mislukt',
        confirmDeleteCategory: 'Weet je zeker dat je deze categorie wilt verwijderen?',
        updateTableStatusFailedShort: 'Tafelstatus bijwerken mislukt',
        addTableFailed: 'Tafel toevoegen mislukt',
        confirmDeleteTable: 'Weet je zeker dat je deze tafel wilt verwijderen?',
        deleteTableFailedShort: 'Tafel verwijderen mislukt',
        saveTableFailedShort: 'Tafel opslaan mislukt',
        moveUpFailed: 'Menu-item omhoog verplaatsen mislukt',
        moveDownFailed: 'Menu-item omlaag verplaatsen mislukt',
        
        // 错误对象消息
        firebaseServiceUnavailable: 'Firebase database service niet beschikbaar',
        firebaseNotConnected: 'Firebase niet verbonden', 
        firebaseConnectionError: 'Firebase verbinding mislukt, controleer netwerk en rechten',
        tableIdentifierMissing: 'Tafel identificatie ontbreekt, kan niet bijwerken',
        tableNumberExists: 'Tafel',
        tableNumberExists2: 'bestaat al, kies een ander nummer',
        tableDataNotFound: 'Tafelgegevens niet gevonden',
        tableSaveSuccess: 'Tafel succesvol opgeslagen!',
        
        // Menu item weergave vertalingen
        priceLabel: 'Prijs',
        statusLabel: 'Status',
        groupLabel: 'Groep',
        allergyLabel: 'Allergie',
        noImage: 'Geen Afbeelding',
        moveUpTitle: 'Naar Boven',
        moveDownTitle: 'Naar Beneden',
        editButton: 'Bewerken',
        deleteButton: 'Verwijderen',
        noMenuItems: 'Geen menu-items',
        noMatchFound: 'Geen overeenkomsten gevonden voor',
        description: 'Beschrijving',
        
        // Taalkiezer
        language: 'Taal',
        chinese: '中文',
        english: 'English',
        dutch: 'Nederlands',
        
        // Batch pincode wijzigen
        batchChangePincode: 'Batch Tafel PIN-codes Wijzigen',
        pincodeGenerationMethod: 'PIN-code Generatie Methode',
        generateRandomPincode: 'Genereer Willekeurige PIN-codes',
        enterCustomPincode: 'Stel Uniforme PIN-code In',
        pincodeDigits: 'PIN-code Cijfers',
        enter3or4DigitPincode: 'Voer 3-4 cijferig nummer in',
        adminPasswordVerification: 'Administrator Wachtwoord Verificatie',
        adminPasswordRequired: 'Voer administrator wachtwoord in voor verificatie',
        customPincodeRequired: 'Voer de in te stellen PIN-code in',
        pincodeLength3to4: 'PIN-code moet 3-4 cijfers zijn',
        enterAdminPassword: 'Voer administrator wachtwoord in',
        warning: 'Belangrijke Melding',
        batchPincodeWarning: 'Deze bewerking zal alle tafel PIN-codes tegelijkertijd wijzigen. Klanten hebben het nieuwe wachtwoord nodig na deze wijziging. Ga voorzichtig te werk!',
        confirmBatchUpdate: 'Bevestig Batch Update',
        updating: 'Bezig met bijwerken...'
    }
};

// 增强的语言上下文系统
const LanguageContext = window.React ? window.React.createContext() : null;

// 增强的语言钩子
function useLanguage() {
    if (!window.React || !LanguageContext) {
        // Fallback when React is not available
        return {
            t: (key) => {
                const lang = localStorage.getItem('restaurant-language') || 'zh';
                return (window.LANGUAGE_TRANSLATIONS[lang] || window.LANGUAGE_TRANSLATIONS.zh)[key] || key;
            },
            language: localStorage.getItem('restaurant-language') || 'zh',
            setLanguage: (lang) => localStorage.setItem('restaurant-language', lang)
        };
    }
    
    const context = window.React.useContext(LanguageContext);
    if (!context) {
        return {
            currentLanguage: 'zh',
            changeLanguage: () => {},
            t: (key) => key
        };
    }
    return context;
}

// 增强的语言提供者组件
function LanguageProvider({ children }) {
    if (!window.React || !LanguageContext) {
        // Fallback when React is not available
        return children;
    }
    
    // 从localStorage获取保存的语言，如果没有则使用配置文件中的默认语言
    const [currentLanguage, setCurrentLanguage] = window.React.useState(() => {
        try {
            const savedLanguage = localStorage.getItem('restaurant-language');
            if (savedLanguage) {
                return savedLanguage;
            }
            
            // 尝试从餐厅配置获取默认语言
            const defaultLang = window.getDefaultLanguage ? window.getDefaultLanguage() : 'zh';
            console.log(`📋 使用餐厅配置的默认语言: ${defaultLang}`);
            return defaultLang;
        } catch (error) {
            console.warn('无法读取本地存储或配置的语言设置:', error);
            return 'zh';
        }
    });
    
    const changeLanguage = (lang) => {
        if (window.LANGUAGE_TRANSLATIONS[lang]) {
            setCurrentLanguage(lang);
            try {
                localStorage.setItem('restaurant-language', lang);
            } catch (error) {
                console.warn('无法保存语言设置到本地存储:', error);
            }
            console.log(`✅ 语言切换到: ${lang}`);
        } else {
            console.warn(`⚠️ 不支持的语言: ${lang}`);
        }
    };
    
    const t = (key) => {
        const translations = window.LANGUAGE_TRANSLATIONS[currentLanguage] || window.LANGUAGE_TRANSLATIONS.zh;
        return translations[key] || key;
    };

    return window.React.createElement(LanguageContext.Provider, {
        value: { currentLanguage, changeLanguage, t }
    }, children);
}

// 语言选择器组件
function LanguageSelector() {
    const { currentLanguage, changeLanguage, t } = useLanguage();
    
    if (!window.React) {
        return null; // No React, no component
    }
    
    const languages = [
        { code: 'zh', name: '中文' },
        { code: 'en', name: 'English' },
        { code: 'nl', name: 'Nederlands' }
    ];
    
    return window.React.createElement('div', {
        className: 'language-selector',
        style: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
        }
    }, [
        window.React.createElement('label', {
            key: 'label',
            style: {
                fontSize: '12px',
                color: '#666',
                marginRight: '8px',
                fontWeight: '500'
            }
        }, t('language')),
        window.React.createElement('select', {
            key: 'select',
            value: currentLanguage,
            onChange: (e) => changeLanguage(e.target.value),
            style: {
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                background: 'white'
            }
        }, languages.map(lang => 
            window.React.createElement('option', {
                key: lang.code,
                value: lang.code
            }, lang.name)
        ))
    ]);
}

// 导出到全局
window.LanguageContext = LanguageContext;
window.useLanguage = useLanguage;
window.LanguageProvider = LanguageProvider;
window.LanguageSelector = LanguageSelector;

console.log('✅ 完整语言翻译模块加载完成 - 支持中英荷三语言');