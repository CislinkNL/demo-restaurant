// 完整餐厅管理组件 - 模块化版本
function RestaurantManagementConsoleFull() {
    const useState = window.useState || React.useState;
    const useEffect = window.useEffect || React.useEffect;
    const useRef = window.useRef || React.useRef;
    const useLanguage = window.useLanguage;
    
    // 配置管理状态
    const [config, setConfig] = useState(null);
    const [configLoaded, setConfigLoaded] = useState(false);
    
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    
    // 初始化配置
    useEffect(() => {
        const initConfig = async () => {
            try {
                if (window.BeheerConfig) {
                    const loadedConfig = await window.BeheerConfig.load();
                    setConfig(loadedConfig);
                    setConfigLoaded(true);
                    console.log('✅ 配置初始化完成');
                } else {
                    console.error('❌ 配置管理器未找到');
                    setConfigLoaded(true); // 继续运行，使用默认值
                }
            } catch (error) {
                console.error('❌ 配置初始化失败:', error);
                setConfigLoaded(true);
            }
        };
        
        initConfig();
    }, []);
    
    // 应用状态
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('menu');
    const [selectedCategory, setSelectedCategory] = useState('all');
    // 搜索状态 - 简化防抖处理
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    // 桌子管理状态
    const [tables, setTables] = useState({});
    const [editingTable, setEditingTable] = useState(null);
    const [viewingOrderHistory, setViewingOrderHistory] = useState(null);
    const [showTableEditModal, setShowTableEditModal] = useState(false);
    const [loadingTables, setLoadingTables] = useState(false);
    const [showQRCode, setShowQRCode] = useState(null); // 存储当前显示二维码的桌子信息
    
    // 批量密码更换状态
    const [showBatchPincodeModal, setShowBatchPincodeModal] = useState(false);
    const [batchPincodeLoading, setBatchPincodeLoading] = useState(false);
    
    // 防抖搜索效果 - 增强版本
    useEffect(() => {
        if (searchQuery === undefined || searchQuery === null) {
            setDebouncedSearchQuery('');
            return;
        }
        
        console.log('🔍 搜索查询变更:', searchQuery);
        
        const timer = setTimeout(() => {
            const newQuery = searchQuery || '';
            console.log('🔍 设置防抖搜索查询:', newQuery);
            setDebouncedSearchQuery(newQuery);
        }, 300);
        
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [searchQuery]);
    
    // 菜单编辑状态
    const [editingItem, setEditingItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    
    // 内联编辑状态
    const [inlineEditingPrice, setInlineEditingPrice] = useState(null); // 正在编辑价格的商品ID
    const [tempPrice, setTempPrice] = useState(''); // 临时价格值
    const [inlineEditingPriceRule, setInlineEditingPriceRule] = useState(null); // 正在编辑价格规则的商品ID
    const [tempPriceRule, setTempPriceRule] = useState(''); // 临时价格规则值
    
    // 餐厅设置状态
    const [settings, setSettings] = useState({});
    const [loadingSettings, setLoadingSettings] = useState(false);
    
    // 分类设置状态
    const [categories, setCategories] = useState({
        food: [],
        drinks: [],
        serviceCat: { directTarget: 16, displayName: "Services" }
    });
    const [loadingCategories, setLoadingCategories] = useState(false);
    
    // 对客户隐藏项目状态
    const [hiddenItems, setHiddenItems] = useState({});
    const [loadingHiddenItems, setLoadingHiddenItems] = useState(false);
    
    // 语言系统 - 使用完整的翻译功能
    const { currentLanguage, changeLanguage, t } = useLanguage ? useLanguage() : {
        currentLanguage: 'zh',
        changeLanguage: () => {},
        t: (key) => {
            const translations = window.LANGUAGE_TRANSLATIONS;
            return translations?.[currentLanguage]?.[key] || translations?.['zh']?.[key] || key;
        }
    };

    // 菜单项目处理 - 使用useMemo优化性能并确保搜索功能正常工作
    const menuItems = React.useMemo(() => {
        const menukaart = data?.menukaart;
        if (!menukaart) return [];
        
        try {
            const searchTerm = debouncedSearchQuery || '';
            console.log('🔍 搜索处理:', { 
                searchTerm, 
                debouncedSearchQuery, 
                searchQuery,
                menuItemsCount: Object.keys(menukaart).length 
            });
            
            // 过滤掉 exceptions 节点，避免隐藏项目数据变成菜单项
            const menuData = { ...menukaart };
            delete menuData.exceptions;
            
            let items = Object.entries(menuData)
                .map(([id, item]) => ({ ...item, id }));
            
            // 应用搜索过滤
            if (searchTerm && searchTerm.trim()) {
                const query = searchTerm.toLowerCase().trim();
                console.log('🔍 应用搜索过滤器:', query);
                
                // 扩展搜索字段 - 确保所有字段都转换为字符串
                items = items.filter(item => {
                    const searchFields = [
                        String(item.description || ''),          // 菜品名称
                        String(item.sku || ''),                 // SKU
                        String(item.menuType || ''),            // 菜单类型
                        String(item.allergy || ''),             // 过敏信息
                        String(item.group || ''),               // 分组
                        String(item.image || '')                // 图片路径（可能包含有用信息）
                    ];
                    
                    // 检查是否任何字段包含搜索词
                    const matches = searchFields.some(field => 
                        field.toLowerCase().includes(query)
                    );
                    
                    if (matches) {
                        console.log('🎯 搜索匹配项:', item.description, item.sku);
                    }
                    
                    return matches;
                });
                
                console.log('🔍 搜索结果数量:', items.length);
            }
            
            // 排序
            const sortedItems = items.sort((a, b) => (a.sortingNrm || 0) - (b.sortingNrm || 0));
            
            return sortedItems;
        } catch (error) {
            console.error('Error filtering menu items:', error);
            return [];
        }
    }, [data, debouncedSearchQuery]); // 使用整个data对象而不是data?.menukaart

    // 认证状态监听
    useEffect(() => {
        const auth = firebase?.auth?.();
        if (!auth) {
            setLoading(false);
            setAuthError('Auth library not loaded');
            return;
        }

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            console.log('Auth state changed:', user ? user.email : 'Not logged in');
            setCurrentUser(user);

            if (!user) {
                setLoading(false);
                return;
            }

            // 用户登录后加载数据
            try {
                setLoading(true);
                await loadData();
                
                // 设置实时监听
                const cleanupListener = setupTablesListener();
                
                // 保存清理函数，以便在用户注销或组件卸载时清理
                return cleanupListener;
            } catch (e) {
                console.error('Initial load failed:', e);
                setError(`Failed to load data: ${e.message}`);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe && unsubscribe();
    }, []);

    // 配置辅助函数
    const getConfig = (path, defaultValue = null) => {
        if (window.BeheerConfig && configLoaded) {
            return window.BeheerConfig.get(path, defaultValue);
        }
        return defaultValue;
    };
    
    const getApiUrl = (endpoint) => {
        if (window.BeheerConfig && configLoaded) {
            return window.BeheerConfig.getApiUrl(endpoint);
        }
        // 后备默认值 (backup defaults - should match beheer-config.json)
        const baseUrl = 'https://europe-west1-placeholder.cloudfunctions.net/app'; // Configure in beheer-config.json
        const endpoints = {
            cloudflareUpdatePolicy: '/api/cloudflare/update-policy',
            cloudflareGetPolicy: '/api/cloudflare/get-policy'
        };
        return baseUrl + (endpoints[endpoint] || '');
    };
    
    const getCloudflareConfig = () => {
        if (window.BeheerConfig && configLoaded) {
            return window.BeheerConfig.getCloudflareConfig();
        }
        // 后备默认值 (backup defaults - should match beheer-config.json)
        return {
            policyId: '00000000-0000-0000-0000-000000000000', // Placeholder - configure in beheer-config.json
            defaultAccountId: '00000000000000000000000000000000', // Placeholder - configure in beheer-config.json
            region: 'europe-west1'
        };
    };

    // 加载餐厅数据
    const loadData = async () => {
        try {
            console.log("🔄 开始加载餐厅数据...");
            
            if (!firebase?.database) {
                throw new Error(t('firebaseUnavailable'));
            }
            
            const currentUser = firebase.auth()?.currentUser;
            if (!currentUser) {
                throw new Error(t('userNotAuthenticated'));
            }
            
            console.log(`🔄 为用户 ${currentUser.email} 加载数据...`);
            
            const loadedData = await window.RestaurantDataOperations.loadRestaurantData();
            
            // 确保数据结构完整
            const completeData = {
                config: loadedData.config || { restName: 'Asian Boulevard' },
                menukaart: loadedData.menukaart || {},
                categorie: loadedData.categorie || {},
                tafel: loadedData.tafel || {},
                TableOrder: {}
            };
            
            console.log("✅ 数据加载成功:", Object.keys(completeData));
            setData(completeData);
            
            // 加载桌台数据 - 处理数据结构确保包含id字段
            setLoadingTables(true);
            const rawTablesData = completeData.tafel || {};
            
            // 转换数据结构，确保每个桌台对象都有id字段
            const processedTables = {};
            Object.entries(rawTablesData).forEach(([key, data]) => {
                processedTables[key] = {
                    id: key, // 确保包含id字段
                    TableOrder: data.TableOrder || 999,
                    Status: data.Status || 'closed',
                    Persons: data.Persons || 0,
                    Pincode: data.Pincode || '',
                    URL: data.URL || '',
                    menuType: data.menuType || 'dinner',
                    orders: data.orders || {
                        menu: '',
                        totaalPrijs: 0,
                        history: {}
                    },
                    timer: data.timer || {
                        duration: 15
                    }
                };
            });

            console.log('🔍 桌台数据处理完成:');
            console.log('原始数据键名:', Object.keys(rawTablesData));
            console.log('处理后数据键名:', Object.keys(processedTables));
            console.log('第一个桌台示例:', Object.values(processedTables)[0]);
            
            // 详细检查每个桌台的数据
            const displayNumberCounts = {};
            Object.entries(processedTables).forEach(([key, table]) => {
                let displayNumber = 'N/A';
                if (key && key.includes('Tafel-')) {
                    const keyMatch = key.match(/Tafel-(.+)/);
                    if (keyMatch) {
                        displayNumber = keyMatch[1];
                    }
                }
                console.log(`🔍 桌台数据检查 - Key: ${key}, 显示号码: ${displayNumber}, TableOrder: ${table.TableOrder}`);
                
                // 统计显示号码
                if (!displayNumberCounts[displayNumber]) {
                    displayNumberCounts[displayNumber] = [];
                }
                displayNumberCounts[displayNumber].push(key);
            });
            
            // 检查是否有重复的显示号码
            Object.entries(displayNumberCounts).forEach(([displayNumber, keys]) => {
                if (keys.length > 1) {
                    console.warn(`⚠️ 检测到重复显示号码 "${displayNumber}":`, keys);
                }
            });

            setTables(processedTables);
            setLoadingTables(false);
            
            // 加载设置数据
            setLoadingSettings(true);
            const settingsData = completeData.config || {};
            setSettings(settingsData);
            setLoadingSettings(false);
            
            // 加载分类数据
            setLoadingCategories(true);
            try {
                console.log('🔄 开始加载分类数据...');
                
                // 检查Firebase是否可用
                if (!window.firebase || !window.firebase.database) {
                    throw new Error(t('firebaseServiceUnavailable'));
                }
                
                const database = window.firebase.database();
                const restaurantPath = getRestaurantPath();
                
                // 测试Firebase连接
                console.log('🔗 测试Firebase连接...');
                try {
                    const testSnapshot = await database.ref('.info/connected').once('value');
                    console.log('📡 Firebase连接状态:', testSnapshot.val());
                    
                    if (!testSnapshot.val()) {
                        throw new Error(t('firebaseNotConnected'));
                    }
                } catch (connectionError) {
                    console.error('❌ Firebase连接测试失败:', connectionError);
                    throw new Error(t('firebaseConnectionError'));
                }
                
                console.log('🔍 检查config路径:', `${restaurantPath}/config`);
                
                // 从config中读取分类数据
                const configSnapshot = await database.ref(`${restaurantPath}/config`).once('value');
                const configData = configSnapshot.val() || {};
                
                console.log('📋 Config数据:', configData);
                
                // 临时：直接从categorie加载，跳过config检查
                console.log('⚠️ 临时跳过config检查，直接从categorie路径读取...');
                
                // 从categorie路径读取并迁移
                const categoriesSnapshot = await database.ref(`${restaurantPath}/categorie`).once('value');
                const categoriesData = categoriesSnapshot.val();
                
                console.log('📋 Categorie数据:', categoriesData);
                console.log('📊 数据是否存在:', !!categoriesData);
                console.log('📊 数据键数量:', categoriesData ? Object.keys(categoriesData).length : 0);
                console.log('📊 数据类型:', typeof categoriesData);
                
                if (categoriesData) {
                    console.log('📊 检查数据结构...');
                    console.log('  - drinks存在:', !!categoriesData.drinks);
                    console.log('  - food存在:', !!categoriesData.food);
                    console.log('  - drinks类型:', typeof categoriesData.drinks);
                    console.log('  - food类型:', typeof categoriesData.food);
                    
                    if (categoriesData.drinks) {
                        console.log('  - drinks长度:', Array.isArray(categoriesData.drinks) ? categoriesData.drinks.length : Object.keys(categoriesData.drinks).length);
                    }
                    if (categoriesData.food) {
                        console.log('  - food长度:', Array.isArray(categoriesData.food) ? categoriesData.food.length : Object.keys(categoriesData.food).length);
                    }
                }
                
                if (categoriesData && Object.keys(categoriesData).length > 0) {
                        // 转换现有categorie结构到我们的格式
                        const processedCategories = {
                            food: [],
                            drinks: [],
                            serviceCat: { directTarget: 16, displayName: "Services" }
                        };
                        
                        console.log('📊 Firebase数据结构:', categoriesData);
                        
                        // 检查数据结构 - Firebase中是 drinks/food 作为父键
                        if (categoriesData.drinks) {
                            console.log('🍷 处理drinks数据:', categoriesData.drinks);
                            console.log('🍷 drinks是数组吗:', Array.isArray(categoriesData.drinks));
                            
                            if (Array.isArray(categoriesData.drinks)) {
                                // 如果是数组，直接处理
                                categoriesData.drinks.forEach((value, index) => {
                                    if (value && typeof value === 'object' && value.id && value.name && value.target !== undefined) {
                                        processedCategories.drinks.push({
                                            id: value.id,
                                            name: value.name,
                                            target: parseInt(value.target) || 0
                                        });
                                        console.log(`    添加饮料 ${index}: ${value.name}`);
                                    }
                                });
                            } else {
                                // 如果是对象，按键值对处理
                                Object.entries(categoriesData.drinks).forEach(([key, value]) => {
                                    if (value && typeof value === 'object' && value.id && value.name && value.target !== undefined) {
                                        processedCategories.drinks.push({
                                            id: value.id,
                                            name: value.name,
                                            target: parseInt(value.target) || 0
                                        });
                                        console.log(`    添加饮料 ${key}: ${value.name}`);
                                    }
                                });
                            }
                        }
                        
                        if (categoriesData.food) {
                            console.log('🍜 处理food数据:', categoriesData.food);
                            console.log('🍜 food是数组吗:', Array.isArray(categoriesData.food));
                            
                            if (Array.isArray(categoriesData.food)) {
                                // 如果是数组，直接处理
                                categoriesData.food.forEach((value, index) => {
                                    if (value && typeof value === 'object' && value.id && value.name && value.target !== undefined) {
                                        processedCategories.food.push({
                                            id: value.id,
                                            name: value.name,
                                            target: parseInt(value.target) || 0
                                        });
                                        console.log(`    添加食物 ${index}: ${value.name}`);
                                    }
                                });
                            } else {
                                // 如果是对象，按键值对处理
                                Object.entries(categoriesData.food).forEach(([key, value]) => {
                                    if (value && typeof value === 'object' && value.id && value.name && value.target !== undefined) {
                                        processedCategories.food.push({
                                            id: value.id,
                                            name: value.name,
                                            target: parseInt(value.target) || 0
                                        });
                                        console.log(`    添加食物 ${key}: ${value.name}`);
                                    }
                                });
                            }
                        }
                        
                        // 如果没有drinks/food结构，尝试旧的扁平结构
                        if (!categoriesData.drinks && !categoriesData.food) {
                            console.log('📋 使用旧的扁平结构');
                            Object.entries(categoriesData).forEach(([key, value]) => {
                                if (typeof value === 'object' && value.name && value.target !== undefined) {
                                    const category = {
                                        id: key,
                                        name: value.name,
                                        target: parseInt(value.target) || 0
                                    };
                                    
                                    // 默认都放到food分类，用户可以手动移动到drinks
                                    processedCategories.food.push(category);
                                }
                            });
                        }
                        
                        // 按target值排序
                        processedCategories.food.sort((a, b) => a.target - b.target);
                        processedCategories.drinks.sort((a, b) => a.target - b.target);
                        
                        console.log('✅ 从categorie迁移分类数据:', {
                            总分类数量: processedCategories.food.length + processedCategories.drinks.length,
                            食物分类: processedCategories.food.length,
                            饮料分类: processedCategories.drinks.length,
                            食物列表: processedCategories.food.map(f => `${f.name}(${f.target})`),
                            饮料列表: processedCategories.drinks.map(d => `${d.name}(${d.target})`)
                        });
                        
                        setCategories(processedCategories);
                        console.log('📋 Categories状态已更新:', processedCategories);
                        
                        // 立即验证状态是否真的被设置
                        setTimeout(() => {
                            console.log('🔍 验证状态设置 - 1秒后检查:', {
                                categories: categories,
                                foodLength: categories?.food?.length,
                                drinksLength: categories?.drinks?.length
                            });
                        }, 100);
                        
                        try {
                            // 自动保存到config中
                            await database.ref(`${restaurantPath}/config/categories`).set(processedCategories);
                            console.log('✅ 已将分类数据保存到config中');
                        } catch (saveError) {
                            console.warn('⚠️ 保存到config失败，但数据已加载:', saveError);
                        }
                    } else {
                        console.log('⚠️ Categorie中也无数据，使用默认结构');
                        // 如果都没有数据，使用默认结构
                        const defaultCategories = {
                            food: [],
                            drinks: [],
                            serviceCat: { directTarget: 16, displayName: "Services" }
                        };
                        setCategories(defaultCategories);
                    }
                
                console.log('✅ 分类数据加载完成');
            } catch (error) {
                console.error('❌ 加载分类数据失败:', error);
                
                // 设置默认的空分类数据
                setCategories({
                    food: [],
                    drinks: [],
                    serviceCat: { directTarget: 16, displayName: "Services" }
                });
                
                // 检查是否是特定错误
                if (error.message && error.message.includes('Firebase')) {
                    alert(t('firebaseConnectionFailed'));
                } else {
                    alert(`${t('categoryDataLoadFailed')}: ${error.message || t('unknownError')}`);
                }
            } finally {
                setLoadingCategories(false);
            }
            
            // 加载隐藏项目数据
            setLoadingHiddenItems(true);
            try {
                console.log('🔄 开始加载隐藏项目数据...');
                
                const database = window.firebase.database();
                const restaurantPath = getRestaurantPath();
                
                // 从menukaart/exceptions读取现有隐藏项目数据
                const exceptionsSnapshot = await database.ref(`${restaurantPath}/menukaart/exceptions`).once('value');
                const exceptionsData = exceptionsSnapshot.val() || {};
                
                // 转换为我们需要的格式
                const hiddenItemsData = {};
                Object.keys(exceptionsData).forEach(sku => {
                    hiddenItemsData[sku] = {
                        sku: sku,
                        reason: exceptionsData[sku].reason || t('hiddenItem'),
                        hiddenAt: exceptionsData[sku].hiddenAt || new Date().toISOString()
                    };
                });
                
                console.log('✅ 隐藏项目数据加载成功:', hiddenItemsData);
                console.log('📊 找到隐藏项目数量:', Object.keys(hiddenItemsData).length);
                setHiddenItems(hiddenItemsData);
                
            } catch (error) {
                console.error('❌ 隐藏项目数据加载失败:', error);
                setHiddenItems({});
            } finally {
                setLoadingHiddenItems(false);
            }
            
            setError(null);
            
        } catch (error) {
            console.error('❌ 数据加载错误:', error);
            throw error;
        }
    };

    // 设置桌台数据实时监听
    const setupTablesListener = () => {
        try {
            if (!firebase?.database) {
                console.warn('Firebase database not available for real-time listening');
                return;
            }

            const database = firebase.database();
            const restaurantPath = getRestaurantPath();
            const tablesRef = database.ref(`${restaurantPath}/tafel`);

            console.log('🔔 设置桌台数据实时监听...');

            // 监听桌台数据变化
            tablesRef.on('value', (snapshot) => {
                const rawTablesData = snapshot.val() || {};
                
                // 转换数据结构，确保每个桌台对象都有id字段
                const processedTables = {};
                Object.entries(rawTablesData).forEach(([key, data]) => {
                    processedTables[key] = {
                        id: key,
                        TableOrder: data.TableOrder || 999,
                        Status: data.Status || 'closed',
                        Persons: data.Persons || 0,
                        Pincode: data.Pincode || '',
                        URL: data.URL || '',
                        menuType: data.menuType || 'dinner',
                        orders: data.orders || {
                            menu: '',
                            totaalPrijs: 0,
                            history: {}
                        },
                        timer: data.timer || {
                            duration: 15
                        }
                    };
                });

                console.log('🔔 桌台数据实时更新:', Object.keys(processedTables));
                setTables(processedTables);
            });

            // 返回清理函数
            return () => {
                console.log('🔇 清理桌台数据监听...');
                tablesRef.off();
            };
        } catch (error) {
            console.error('❌ 设置桌台监听失败:', error);
            return null;
        }
    };

    const handleLogin = async (e) => {
        e && e.preventDefault();
        if (!authEmail || !authPassword) {
            setAuthError(t('pleaseEnterEmailPassword'));
            return;
        }
        
        setAuthLoading(true);
        setAuthError(null);
        
        try {
            await firebase.auth().signInWithEmailAndPassword(authEmail.trim(), authPassword);
        } catch (err) {
            setAuthError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        if (firebase && typeof firebase.auth === 'function') {
            try { 
                await firebase.auth().signOut(); 
            } catch (e) { 
                console.warn('Sign out failed', e); 
            }
        }
    };

    // 保存菜单项目
    const handleSaveMenuItem = async (formData) => {
        try {
            if (editingItem) {
                // 编辑现有项目
                const savedItem = { ...editingItem, ...formData };
                await window.RestaurantDataOperations.saveMenuItem(editingItem.id, savedItem);
                
                // 更新本地数据
                setData(prev => ({
                    ...prev,
                    menukaart: {
                        ...prev.menukaart,
                        [editingItem.id]: savedItem
                    }
                }));
            } else {
                // 添加新项目
                const newId = await window.RestaurantDataOperations.addMenuItem(formData);
                const newItem = { ...formData, id: newId };
                
                // 更新本地数据
                setData(prev => ({
                    ...prev,
                    menukaart: {
                        ...prev.menukaart,
                        [newId]: newItem
                    }
                }));
                
                // 自动重新排序所有菜单项目以避免重复排序号
                try {
                    await window.RestaurantDataOperations.renumberAllMenuItems();
                    console.log('✅ 自动重新排序菜单项目完成');
                } catch (renumberError) {
                    console.warn('⚠️ 自动重新排序失败，但菜单项目已添加:', renumberError);
                }
            }
            
            setShowEditModal(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Error saving menu item:', error);
            
            // 提供更具体的错误消息
            let errorMessage = t('saveFailed');
            if (error.message.includes('SKU is required')) {
                errorMessage = t('skuRequired');
            } else if (error.message.includes('already exists')) {
                errorMessage = t('skuExists');
            } else {
                errorMessage = `${t('saveFailed')}: ${error.message}`;
            }
            
            alert(errorMessage);
        }
    };

    // 内联编辑价格规则处理函数
    const handleStartEditPriceRule = (itemId, currentValue) => {
        setInlineEditingPriceRule(itemId);
        setTempPriceRule(currentValue);
    };

    const handleSavePriceRule = async (itemId) => {
        try {
            if (!data?.menukaart?.[itemId]) {
                throw new Error('菜单项目不存在');
            }

            const updatedItem = { 
                ...data.menukaart[itemId], 
                priceAllinDranks: tempPriceRule 
            };
            
            await window.RestaurantDataOperations.saveMenuItem(itemId, updatedItem);
            
            // 更新本地数据
            setData(prev => ({
                ...prev,
                menukaart: {
                    ...prev.menukaart,
                    [itemId]: updatedItem
                }
            }));

            setInlineEditingPriceRule(null);
            setTempPriceRule('');
        } catch (error) {
            console.error('Error saving price rule:', error);
            alert(`保存价格规则失败: ${error.message}`);
            setInlineEditingPriceRule(null);
            setTempPriceRule('');
        }
    };

    const handleCancelEditPriceRule = () => {
        setInlineEditingPriceRule(null);
        setTempPriceRule('');
    };

    // 重新排序所有菜单项目
    const handleRenumberMenuItems = async () => {
        if (!confirm(t('confirmRenumberMenu') || '确定要重新排列所有菜单项目的排序号码吗？这将重置所有项目的顺序。')) {
            return;
        }
        
        try {
            await window.RestaurantDataOperations.renumberAllMenuItems();
            // 重新加载数据以显示更新
            await loadData();
            alert(t('renumberSuccess') || '菜单项目排序号码已成功重新排列！');
        } catch (error) {
            console.error('Error renumbering menu items:', error);
            alert(`${t('renumberFailed') || '重新排列失败'}: ${error.message}`);
        }
    };

    // 删除菜单项目
    const handleDeleteMenuItem = async (itemId) => {
        if (!confirm(t('confirmDeleteMenu'))) return;
        
        try {
            await window.RestaurantDataOperations.deleteMenuItem(itemId);
            
            // 更新本地数据
            setData(prev => {
                const newMenukaart = { ...prev.menukaart };
                delete newMenukaart[itemId];
                return {
                    ...prev,
                    menukaart: newMenukaart
                };
            });
            
            // 自动重新排序所有菜单项目以保持连续序号
            try {
                await window.RestaurantDataOperations.renumberAllMenuItems();
                await loadData(); // 重新加载以显示更新的排序号
                console.log('✅ 删除后自动重新排序菜单项目完成');
            } catch (renumberError) {
                console.warn('⚠️ 删除后自动重新排序失败:', renumberError);
            }
        } catch (error) {
            console.error('Error deleting menu item:', error);
            alert(`${t('deleteFailed')}: ${error.message}`);
        }
    };

    // ============ 桌台管理功能 ============
    
    // 保存桌台 (添加或编辑)
    const handleSaveTable = async (tableData) => {
        try {
            console.log('🔧 handleSaveTable 开始执行:');
            console.log('- editingTable:', editingTable);
            console.log('- editingTable?.id:', editingTable?.id);
            console.log('- tableData:', tableData);
            console.log('- tableData?.id:', tableData?.id);
            
            if (editingTable) {
                // 编辑现有桌台 - 直接使用RestaurantDataOperations.saveTable
                const tableKey = tableData.id || editingTable.id;
                
                console.log('🔧 计算出的tableKey:', tableKey);
                
                if (!tableKey) {
                    console.error('❌ 桌台键名不能为空:');
                    console.error('- editingTable?.id:', editingTable?.id);
                    console.error('- tableData?.id:', tableData?.id);
                    throw new Error(t('tableIdentifierMissing'));
                }
                
                console.log('🔧 使用RestaurantDataOperations.saveTable保存:');
                console.log('- tableKey:', tableKey);
                console.log('- tableData:', tableData);
                console.log('- window.RestaurantDataOperations:', window.RestaurantDataOperations);
                console.log('- window.RestaurantDataOperations.saveTable:', typeof window.RestaurantDataOperations?.saveTable);
                
                // 检查RestaurantDataOperations是否可用
                if (!window.RestaurantDataOperations) {
                    console.error('❌ window.RestaurantDataOperations 不可用');
                    throw new Error('RestaurantDataOperations not available');
                }
                
                if (!window.RestaurantDataOperations.saveTable) {
                    console.error('❌ window.RestaurantDataOperations.saveTable 不可用');
                    throw new Error('RestaurantDataOperations.saveTable not available');
                }
                
                // 直接使用RestaurantDataOperations.saveTable方法
                await window.RestaurantDataOperations.saveTable(tableKey, tableData);
                
                console.log('✅ RestaurantDataOperations.saveTable 完成');
                
                // 验证数据是否真的写入
                const database = window.firebase.database();
                const restaurantPath = getRestaurantPath();
                const verifyRef = database.ref(`${restaurantPath}/tafel/${tableKey}`);
                const snapshot = await verifyRef.once('value');
                const updatedData = snapshot.val();
                console.log('🔎 验证数据库中的数据:', updatedData);
                console.log('🔎 验证orders.menu:', updatedData?.orders?.menu);
                
                // 更新本地数据
                setTables(prev => ({
                    ...prev,
                    [tableKey]: { ...prev[tableKey], ...tableData, id: tableKey }
                }));
                
            } else {
                // 添加新桌台 - 使用正确的桌台键值格式
                if (!tableData.TableOrder) {
                    throw new Error(t('tableNumberRequired'));
                }
                
                // 检查桌台号码是否已存在
                const tableKey = `Tafel-${tableData.TableOrder}`;
                if (tables[tableKey]) {
                    throw new Error(`${t('tableNumberExists')} ${tableData.TableOrder} ${t('tableNumberExists2')}`);
                }
                
                console.log('🔧 添加新桌台:');
                console.log('- tableKey:', tableKey);
                console.log('- tableData:', tableData);
                
                const database = window.firebase.database();
                const restaurantPath = getRestaurantPath();
                
                // 生成完整的timer数据，包含startTime和endTime
                const now = Date.now();
                const newTableData = {
                    TableOrder: tableData.TableOrder,
                    Status: tableData.Status || 'open',
                    Persons: tableData.Persons || 4,
                    Pincode: tableData.Pincode || Math.floor(Math.random() * 9000) + 1000,
                    URL: tableData.URL || generateTableUrl(tableData.TableOrder),
                    menuType: tableData.menuType || 'dinner',
                    orders: tableData.orders || {
                        menu: '',
                        totaalPrijs: 0,
                        history: {}
                    },
                    timer: tableData.timer || {
                        duration: 15,
                        startTime: now,
                        endTime: now + (1 * 60 * 1000) // 添加1分钟（毫秒）
                    }
                };
                
                await database.ref(`${restaurantPath}/tafel/${tableKey}`).set(newTableData);
                
                console.log('✅ 新桌台添加完成:', tableKey);
                
                // 更新本地数据
                setTables(prev => ({
                    ...prev,
                    [tableKey]: { ...newTableData, id: tableKey }
                }));
            }
            
            setShowTableEditModal(false);
            setEditingTable(null);
            alert(t('tableSaveSuccess'));
        } catch (error) {
            console.error('Error saving table:', error);
            alert(`${t('saveTableFailed')}: ${error.message}`);
        }
    };

    // 删除桌台
    const handleDeleteTable = async (tableId) => {
        const table = tables[tableId];
        if (!table) return;
        
        // 直接从Firebase键名中提取桌台号码用于确认消息
        let tableNumber = 'N/A';
        
        if (tableId && tableId.includes('Tafel-')) {
            const keyMatch = tableId.match(/Tafel-(.+)/);
            if (keyMatch) {
                tableNumber = keyMatch[1]; // 例如从 "Tafel-10A" 提取 "10A"
            }
        }
        
        const confirmMessage = `确认删除桌台 ${tableNumber}?`;
        if (!confirm(confirmMessage)) return;

        try {
            const database = window.firebase.database();
            const restaurantPath = getRestaurantPath();
            
            // 从Firebase删除桌台
            await database.ref(`${restaurantPath}/tafel/${tableId}`).remove();
            
            // 更新本地数据
            setTables(prev => {
                const newTables = { ...prev };
                delete newTables[tableId];
                return newTables;
            });
            
            // 同时更新主数据
            setData(prev => {
                const newTafel = { ...prev.tafel };
                delete newTafel[tableId];
                return {
                    ...prev,
                    tafel: newTafel
                };
            });
            
            alert(t('tableDeleteSuccess'));
        } catch (error) {
            console.error('Error deleting table:', error);
            alert(`${t('deleteTableFailed')}: ${error.message}`);
        }
    };

    // 更新桌台状态
    const handleUpdateTableStatus = async (tableId, status) => {
        try {
            console.log('Updating table status:', { tableId, status });
            
            // 获取当前桌台数据
            const currentTable = data.tafel[tableId];
            if (!currentTable) {
                throw new Error(t('tableDataNotFound'));
            }
            
            // 构建完整的桌台数据，只更新状态
            const updatedTableData = {
                ...currentTable,
                Status: status
            };
            
            // 使用现有的保存桌台函数，它有正确的权限处理
            await window.RestaurantDataOperations.saveTable(tableId, updatedTableData);
            
            // 更新本地数据 - 使用正确的属性名 Status (大写)
            setTables(prev => ({
                ...prev,
                [tableId]: { ...prev[tableId], Status: status }
            }));
            
            // 同时更新主数据
            setData(prev => ({
                ...prev,
                tafel: {
                    ...prev.tafel,
                    [tableId]: { ...prev.tafel[tableId], Status: status }
                }
            }));
            
            console.log('Table status updated successfully');
        } catch (error) {
            console.error('Error updating table status:', error);
            alert(`${t('updateTableStatusFailed')}: ${error.message}`);
        }
    };

    // 桌台状态变更处理（简化版包装器）
    const handleStatusChange = async (tableId, status) => {
        try {
            console.log('handleStatusChange called:', { tableId, status });
            
            // 检查RestaurantDataOperations是否可用
            if (!window.RestaurantDataOperations) {
                console.error('❌ RestaurantDataOperations not available');
                alert('数据操作模块未加载，请刷新页面重试');
                return;
            }
            
            // 检查updateTableStatus函数是否存在
            if (typeof window.RestaurantDataOperations.updateTableStatus !== 'function') {
                console.error('❌ updateTableStatus function not available');
                alert('桌台状态更新功能未加载，请刷新页面重试');
                return;
            }
            
            // 根据状态生成或清除PIN码
            let pincode = null;
            if (status === 'occupied') {
                // 检查generatePincode函数是否存在
                if (typeof window.RestaurantDataOperations.generatePincode !== 'function') {
                    console.error('❌ generatePincode function not available');
                    alert('密码生成功能未加载，请刷新页面重试');
                    return;
                }
                // 生成新的PIN码用于点餐
                pincode = window.RestaurantDataOperations.generatePincode();
                console.log('Generated pincode:', pincode);
            }
            
            // 使用数据操作模块更新状态
            await window.RestaurantDataOperations.updateTableStatus(tableId, status, pincode);
            
            // 更新本地状态
            setTables(prev => ({
                ...prev,
                [tableId]: { 
                    ...prev[tableId], 
                    Status: status,
                    ...(pincode && { pincode })
                }
            }));
            
            // 同时更新主数据
            setData(prev => ({
                ...prev,
                tafel: {
                    ...prev.tafel,
                    [tableId]: { 
                        ...prev.tafel[tableId], 
                        Status: status,
                        ...(pincode && { pincode })
                    }
                }
            }));
            
            console.log(`✅ 桌台 ${tableId} 状态已更新为: ${status}`);
            
        } catch (error) {
            console.error('Error in handleStatusChange:', error);
            alert(`更新桌台状态失败: ${error.message}`);
        }
    };

    // ============ 餐厅设置功能 ============
    
    // 保存餐厅设置
    const handleSaveSettings = async (settingsData) => {
        try {
            setLoadingSettings(true);
            await window.RestaurantDataOperations.saveConfig(settingsData);
            
            // 更新本地数据
            setSettings(prev => ({ ...prev, ...settingsData }));
            
            // 同时更新主数据
            setData(prev => ({
                ...prev,
                config: { ...prev.config, ...settingsData }
            }));
            
            alert(t('settingsSaved'));
        } catch (error) {
            console.error('Error saving settings:', error);
            alert(`${t('saveSettingsFailed')}: ${error.message}`);
        } finally {
            setLoadingSettings(false);
        }
    };

    // 保存分类设置
    const handleSaveCategories = async (categoriesData) => {
        try {
            setLoadingCategories(true);
            const database = window.firebase.database();
            const restaurantPath = getRestaurantPath();
            
            // 将我们的格式转换回Firebase的原始格式（嵌套结构）
            const firebaseCategories = {
                food: {},
                drinks: {},
                serviceCat: categoriesData.serviceCat || { directTarget: 16, displayName: "Services" }
            };
            
            // 添加食物分类 - 按数组索引存储
            categoriesData.food.forEach((cat, index) => {
                firebaseCategories.food[index] = {
                    id: cat.id,
                    name: cat.name,
                    target: cat.target
                };
            });
            
            // 添加饮料分类 - 按数组索引存储
            categoriesData.drinks.forEach((cat, index) => {
                firebaseCategories.drinks[index] = {
                    id: cat.id,
                    name: cat.name,
                    target: cat.target
                };
            });
            
            // 如果没有数据，确保至少有空对象
            if (categoriesData.food.length === 0) {
                firebaseCategories.food = {};
            }
            if (categoriesData.drinks.length === 0) {
                firebaseCategories.drinks = {};
            }
            
            console.log('💾 保存分类数据到 /categorie:', {
                '保存的数据': firebaseCategories,
                'serviceCat详细信息': {
                    'displayName': categoriesData.serviceCat?.displayName,
                    'directTarget': categoriesData.serviceCat?.directTarget,
                    '已包含在保存中': true
                }
            });
            
            // 只保存到categorie路径
            await database.ref(`${restaurantPath}/categorie`).set(firebaseCategories);
            
            // 更新本地数据
            setCategories(categoriesData);
            
            // 更新主数据的categorie字段
            setData(prev => ({
                ...prev,
                categorie: firebaseCategories
            }));
            
            alert(t('categorySaveSuccess'));
        } catch (error) {
            console.error('Error saving categories:', error);
            alert(`${t('saveCategoryFailed')}: ${error.message}`);
        } finally {
            setLoadingCategories(false);
        }
    };

    // 保存隐藏项目设置
    const handleSaveHiddenItems = async (hiddenItemsData) => {
        try {
            setLoadingHiddenItems(true);
            const database = window.firebase.database();
            const restaurantPath = getRestaurantPath();
            
            // 转换为exceptions格式（客户端使用的格式）
            const exceptionsData = {};
            Object.entries(hiddenItemsData).forEach(([sku, item]) => {
                exceptionsData[sku] = {
                    reason: item.reason || '管理员隐藏',
                    hiddenAt: item.hiddenAt || new Date().toISOString()
                };
            });
            
            console.log('💾 保存隐藏项目数据到 /menukaart/exceptions:', exceptionsData);
            
            // 保存到menukaart/exceptions路径（客户端读取的路径）
            await database.ref(`${restaurantPath}/menukaart/exceptions`).set(exceptionsData);
            
            // 更新本地数据
            setHiddenItems(hiddenItemsData);
            
            // 同时更新主数据
            setData(prev => ({
                ...prev,
                menukaart: {
                    ...prev.menukaart,
                    exceptions: exceptionsData
                }
            }));
            
            alert(`${t('hiddenItemsSaveSuccess')} (${t('hiddenItemsCount2')}${Object.keys(hiddenItemsData).length}${t('hiddenItemsCount3')})`);
        } catch (error) {
            console.error('Error saving hidden items:', error);
            alert(`${t('saveHiddenItemsFailed')}: ${error.message}`);
        } finally {
            setLoadingHiddenItems(false);
        }
    };

    // 添加隐藏项目
    const addHiddenItem = () => {
        const sku = prompt('请输入要隐藏的商品SKU:');
        if (sku && sku.trim()) {
            const trimmedSku = sku.trim();
            setHiddenItems(prev => ({
                ...prev,
                [trimmedSku]: {
                    sku: trimmedSku,
                    reason: '管理员隐藏',
                    hiddenAt: new Date().toISOString()
                }
            }));
        }
    };

    // 移除隐藏项目
    const removeHiddenItem = (sku) => {
        if (confirm(`${t('confirmRemoveHiddenItem')} "${sku}" 吗？`)) {
            setHiddenItems(prev => {
                const newItems = { ...prev };
                delete newItems[sku];
                return newItems;
            });
        }
    };

    // 更新隐藏项目原因
    const updateHiddenItemReason = (sku, reason) => {
        setHiddenItems(prev => ({
            ...prev,
            [sku]: {
                ...prev[sku],
                reason: reason
            }
        }));
    };

    // 加载分类设置
    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const database = window.firebase.database();
            const restaurantPath = getRestaurantPath();
            
            // 从categorie路径读取分类数据（与系统其他部分保持一致）
            const categoriesSnapshot = await database.ref(`${restaurantPath}/categorie`).once('value');
            const categoriesData = categoriesSnapshot.val() || {};
            
            console.log('📋 LoadCategories - 从categorie路径读取数据:', categoriesData);
            
            if (categoriesData && (categoriesData.food || categoriesData.drinks || categoriesData.serviceCat)) {
                // 转换Firebase格式为UI格式
                const uiCategories = {
                    food: [],
                    drinks: [],
                    serviceCat: categoriesData.serviceCat || { directTarget: 16, displayName: "Services" }
                };
                
                // 转换食物分类
                if (categoriesData.food) {
                    Object.values(categoriesData.food).forEach(cat => {
                        if (cat && cat.id && cat.name) {
                            uiCategories.food.push(cat);
                        }
                    });
                }
                
                // 转换饮料分类
                if (categoriesData.drinks) {
                    Object.values(categoriesData.drinks).forEach(cat => {
                        if (cat && cat.id && cat.name) {
                            uiCategories.drinks.push(cat);
                        }
                    });
                }
                
                setCategories(uiCategories);
            } else {
                // 如果categorie中没有数据，使用默认结构
                const defaultCategories = {
                    food: [],
                    drinks: [],
                    serviceCat: { directTarget: 16, displayName: "Services" }
                };
                setCategories(defaultCategories);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            alert(`${t('loadCategoryFailed')}: ${error.message}`);
        } finally {
            setLoadingCategories(false);
        }
    };

    // 添加新的食物分类
    const addFoodCategory = () => {
        const newCategory = {
            id: `Cat${Date.now()}`,
            name: "新分类",
            target: 1
        };
        setCategories(prev => ({
            ...prev,
            food: [...prev.food, newCategory]
        }));
    };

    // 添加新的饮料分类
    const addDrinkCategory = () => {
        const newCategory = {
            id: `Cat${Date.now()}`,
            name: "新饮料分类",
            target: 200
        };
        setCategories(prev => ({
            ...prev,
            drinks: [...prev.drinks, newCategory]
        }));
    };

    // 删除分类
    const removeCategory = (type, id) => {
        if (confirm(t('confirmDeleteCategory'))) {
            setCategories(prev => ({
                ...prev,
                [type]: prev[type].filter(cat => cat.id !== id)
            }));
        }
    };

    // 更新分类
    const updateCategory = (type, id, field, value) => {
        setCategories(prev => ({
            ...prev,
            [type]: prev[type].map(cat => 
                cat.id === id ? { ...cat, [field]: value } : cat
            )
        }));
    };

    // 移动分类（在食物和饮料之间移动）
    const moveCategory = (fromType, toType, id) => {
        setCategories(prev => {
            const categoryToMove = prev[fromType].find(cat => cat.id === id);
            if (!categoryToMove) return prev;
            
            return {
                ...prev,
                [fromType]: prev[fromType].filter(cat => cat.id !== id),
                [toType]: [...prev[toType], categoryToMove].sort((a, b) => a.target - b.target)
            };
        });
    };

    // ============ 桌台管理功能 ============
    
    // 桌子状态工具函数
    const getStatusText = (status) => {
        const statusMap = {
            open: t('statusOpen'),
            occupied: t('statusOccupied'),
            reserved: t('statusReserved'),
            closed: t('statusClosed')
        };
        return statusMap[status] || t('statusOpen');
    };
    
    const getStatusButtonClass = (status) => {
        const classMap = {
            open: 'btn-success',
            occupied: 'btn-warning',
            reserved: 'btn-info',
            closed: 'btn-danger'
        };
        return classMap[status] || 'btn-success';
    };
    
    // 加载桌子数据
    const loadTables = async () => {
        try {
            setLoadingTables(true);
            const database = window.firebase.database();
            const restaurantPath = getRestaurantPath();
            
            const tafelSnapshot = await database.ref(`${restaurantPath}/tafel`).once('value');
            const tafelData = tafelSnapshot.val() || {};

            // 转换数据结构，与restaurant-management-console.js保持一致
            const processedTables = {};
            Object.entries(tafelData).forEach(([key, data]) => {
                processedTables[key] = {
                    id: key,
                    TableOrder: data.TableOrder || 999,
                    Status: data.Status || 'closed',
                    Persons: data.Persons || 0,
                    Pincode: data.Pincode || '',
                    URL: data.URL || '',
                    menuType: data.menuType || 'dinner',
                    orders: data.orders || {
                        menu: '',
                        totaalPrijs: 0,
                        history: {}
                    },
                    timer: data.timer || {
                        duration: 15
                    }
                };
            });

            console.log('🔍 桌台数据加载完成:');
            console.log('原始数据键名:', Object.keys(tafelData));
            console.log('处理后数据键名:', Object.keys(processedTables));
            console.log('第一个桌台示例:', Object.values(processedTables)[0]);

            setTables(processedTables);
        } catch (error) {
            console.error('Failed to load tables:', error);
        } finally {
            setLoadingTables(false);
        }
    };
    
    // 切换桌子状态
    const toggleTableStatus = async (tableId) => {
        const table = tables[tableId];
        if (!table) return;
        
        const statusOrder = ['open', 'occupied', 'reserved', 'closed'];
        const currentIndex = statusOrder.indexOf(table.Status || 'open');
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        
        try {
            const updatedTable = { ...table, Status: nextStatus };
            await window.RestaurantDataOperations.saveTable(tableId, updatedTable);
            
            setTables(prev => ({
                ...prev,
                [tableId]: updatedTable
            }));
        } catch (error) {
            console.error('Failed to toggle table status:', error);
            alert(t('updateTableStatusFailedShort'));
        }
    };
    
    // 添加新桌子
    const addTable = async () => {
        try {
            const tableId = await window.RestaurantDataOperations.addTable({
                TableOrder: Object.keys(tables).length + 1,
                Status: 'open',
                Persons: 4,
                Pincode: null,
                URL: '',
                orders: { menu: '', quantity: 0, totaalPrijs: 0, history: {} },
                timer: { duration: 15 } // startTime和endTime将在addTable方法中自动设置
            });
            
            await loadTables();
            console.log('✅ 成功添加新桌台:', tableId);
        } catch (error) {
            console.error('Failed to add table:', error);
            alert(t('addTableFailed'));
        }
    };
    
    // 删除桌子
    const deleteTable = async (tableId) => {
        if (!confirm(t('confirmDeleteTable'))) return;
        
        try {
            await window.RestaurantDataOperations.deleteTable(tableId);
            setTables(prev => {
                const newTables = { ...prev };
                delete newTables[tableId];
                return newTables;
            });
        } catch (error) {
            console.error('Failed to delete table:', error);
            alert(t('deleteTableFailedShort'));
        }
    };
    
    // 保存桌子信息
    const saveTable = async (tableData) => {
        try {
            let tableId;
            if (editingTable?.id) {
                tableId = editingTable.id;
                await window.RestaurantDataOperations.saveTable(tableId, tableData);
                console.log('✅ 桌台更新完成:', tableId);
            } else {
                tableId = await window.RestaurantDataOperations.addTable(tableData);
                console.log('✅ 新桌台添加完成:', tableId);
            }
            
            setTables(prev => ({
                ...prev,
                [tableId]: { ...tableData, id: tableId }
            }));
            
            setShowTableEditModal(false);
            setEditingTable(null);
            alert(t('tableSaveSuccess'));
        } catch (error) {
            console.error('Failed to save table:', error);
            alert(t('saveTableFailedShort'));
        }
    };
    
    // 初始化时加载桌子数据
    useEffect(() => {
        if (currentUser) {
            loadTables();
        }
    }, [currentUser]);

    // 批量更换密码相关功能
    const showBatchPincodeModalHandler = () => {
        console.log('批量更换密码按钮被点击');
        setShowBatchPincodeModal(true);
    };

    const generateRandomPincode = () => {
        const newPincode = window.RestaurantDataOperations.generateRandomPincode(batchPincodeLength);
        setBatchPincode(newPincode);
    };

    const handleBatchPincodeConfirm = async (options) => {
        setBatchPincodeLoading(true);
        try {
            console.log('开始批量更换密码，选项:', options);
            
            // Get admin password from Firebase config
            let expectedAdminPassword;
            try {
                const database = firebase.database();
                const restaurantPath = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
                console.log('正在从路径获取管理员密码:', `${restaurantPath}/config/adminPassword`);
                
                const adminPasswordSnapshot = await database
                    .ref(`${restaurantPath}/config/adminPassword`)
                    .once('value');
                expectedAdminPassword = adminPasswordSnapshot.val();
                
                console.log('从config获取的管理员密码:', expectedAdminPassword ? '已获取' : '为空');
            } catch (error) {
                console.error('获取管理员密码失败:', error);
                alert('无法验证管理员密码，请检查网络连接后重试');
                setBatchPincodeLoading(false);
                return;
            }

            if (!expectedAdminPassword) {
                alert('系统中未设置管理员密码，请联系系统管理员配置');
                setBatchPincodeLoading(false);
                return;
            }

            console.log('输入的密码长度:', options.adminPassword ? options.adminPassword.length : 0);
            console.log('期望的密码长度:', expectedAdminPassword ? expectedAdminPassword.length : 0);
            
            if (options.adminPassword !== expectedAdminPassword) {
                alert('管理员密码错误，请重新输入正确的密码');
                setBatchPincodeLoading(false);
                return;
            }

            console.log('管理员密码验证成功，开始更新PIN码');
            
            let pincodeToUse;
            if (options.method === 'custom') {
                pincodeToUse = options.pincode;
            } else {
                // Generate random pincode
                pincodeToUse = window.RestaurantDataOperations.generateRandomPincode(options.digits);
            }

            console.log('即将使用的PIN码:', pincodeToUse);
            
            await window.RestaurantDataOperations.batchUpdateTablePincodes(pincodeToUse);
            
            // Update local table state
            setTables(prev => {
                const updatedTables = { ...prev };
                Object.keys(updatedTables).forEach(tableId => {
                    updatedTables[tableId] = {
                        ...updatedTables[tableId],
                        Pincode: pincodeToUse
                    };
                });
                return updatedTables;
            });

            alert(`成功更新所有桌台的PIN码为: ${pincodeToUse}`);
            setShowBatchPincodeModal(false);
        } catch (error) {
            console.error('批量更新PIN码失败:', error);
            alert('批量更新PIN码失败，请重试');
        } finally {
            setBatchPincodeLoading(false);
        }
    };

    // 生成二维码
    const generateQRCode = (table) => {
        if (!table.URL) return;
        
        // 生成完整的访问URL（包含pincode）
        const fullUrl = table.Pincode ? `${table.URL}&pincode=${table.Pincode}` : table.URL;
        
        // 从URL参数中提取真实的桌台号码
        let tableNumber = 'N/A';
        
        if (table.URL) {
            const urlMatch = table.URL.match(/tafel=([^&]+)/);
            if (urlMatch) {
                tableNumber = urlMatch[1]; // 例如从 "tafel=10A" 提取 "10A"
            }
        }
        
        // 备选方案：从Firebase键名中提取
        if (tableNumber === 'N/A' && table.id) {
            const keyMatch = table.id.match(/Tafel-(.+)/);
            if (keyMatch) {
                tableNumber = keyMatch[1]; // 例如从 "Tafel-10A" 提取 "10A"
            }
        }
        
        console.log('🔍 QR码生成 - 桌台:', table.id, 'URL:', table.URL, '显示号码:', tableNumber);
        
        setShowQRCode({
            tableId: table.id,
            tableName: `${t('table')} ${tableNumber}`,
            url: fullUrl,
            pincode: table.Pincode
        });
    };

    // ============ 菜单排序功能 ============
    
    // 处理向上移动菜单项
    const handleMoveUp = async (item) => {
        const currentIndex = menuItems.findIndex(i => i.id === item.id);
        if (currentIndex > 0) {
            const currentItem = menuItems[currentIndex];
            const targetItem = menuItems[currentIndex - 1];
            
            // 交换排序号
            const currentSort = currentItem.sortingNrm || 999;
            const targetSort = targetItem.sortingNrm || 999;
            
            try {
                await window.RestaurantDataOperations.exchangeSortingPositions(
                    currentItem.id, targetItem.id, currentSort, targetSort
                );
                
                // 重新加载数据以更新显示
                await loadData();
                
            } catch (error) {
                console.error('Failed to move item up:', error);
                alert(t('moveUpFailed'));
            }
        }
    };

    // 处理向下移动菜单项
    const handleMoveDown = async (item) => {
        const currentIndex = menuItems.findIndex(i => i.id === item.id);
        if (currentIndex < menuItems.length - 1) {
            const currentItem = menuItems[currentIndex];
            const targetItem = menuItems[currentIndex + 1];
            
            // 交换排序号
            const currentSort = currentItem.sortingNrm || 999;
            const targetSort = targetItem.sortingNrm || 999;
            
            try {
                await window.RestaurantDataOperations.exchangeSortingPositions(
                    currentItem.id, targetItem.id, currentSort, targetSort
                );
                
                // 重新加载数据以更新显示
                await loadData();
                
            } catch (error) {
                console.error('Failed to move item down:', error);
                alert(t('moveDownFailed'));
            }
        }
    };

    // ============ 餐厅设置功能 ============
    
    // 显示登录界面
    if (!currentUser) {
        return React.createElement('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontFamily: 'Arial, sans-serif',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }
        },
            React.createElement('div', {
                style: {
                    background: '#ffffff',
                    padding: '32px 28px',
                    borderRadius: '14px',
                    width: '100%',
                    maxWidth: '360px',
                    boxShadow: '0 8px 30px -5px rgba(0,0,0,0.15)'
                }
            },
                React.createElement('h2', {
                    style: { margin: '0 0 1.2rem', fontWeight: '600', fontSize: '1.4rem' }
                }, `🔐 ${t('loginTitle')}`),
                
                authError && React.createElement('div', {
                    style: {
                        background: '#fee2e2',
                        color: '#b91c1c',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        marginBottom: '10px',
                        lineHeight: '1.3'
                    }
                }, authError),
                
                React.createElement('form', { onSubmit: handleLogin },
                    React.createElement('div', { style: { marginBottom: '1rem' } },
                        React.createElement('label', {
                            style: {
                                display: 'block',
                                fontSize: '0.75rem',
                                letterSpacing: '.5px',
                                fontWeight: '600',
                                marginBottom: '6px',
                                color: '#555',
                                textTransform: 'uppercase'
                            }
                        }, t('email')),
                        React.createElement('input', {
                            type: 'email',
                            value: authEmail,
                            onChange: e => setAuthEmail(e.target.value),
                            placeholder: 'you@example.com',
                            autoComplete: 'username',
                            style: {
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d0d6e0',
                                borderRadius: '8px',
                                background: '#f8fafc',
                                fontSize: '0.9rem'
                            }
                        })
                    ),
                    React.createElement('div', { style: { marginBottom: '1rem' } },
                        React.createElement('label', {
                            style: {
                                display: 'block',
                                fontSize: '0.75rem',
                                letterSpacing: '.5px',
                                fontWeight: '600',
                                marginBottom: '6px',
                                color: '#555',
                                textTransform: 'uppercase'
                            }
                        }, t('password')),
                        React.createElement('input', {
                            type: 'password',
                            value: authPassword,
                            onChange: e => setAuthPassword(e.target.value),
                            placeholder: '••••••••',
                            autoComplete: 'current-password',
                            style: {
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #d0d6e0',
                                borderRadius: '8px',
                                background: '#f8fafc',
                                fontSize: '0.9rem'
                            }
                        })
                    ),
                    React.createElement('button', {
                        type: 'submit',
                        disabled: authLoading,
                        style: {
                            width: '100%',
                            background: '#6366f1',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 14px',
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: authLoading ? 'not-allowed' : 'pointer',
                            opacity: authLoading ? 0.6 : 1
                        }
                    }, authLoading ? t('loggingIn') : t('loginButton'))
                ),
                
                React.createElement('div', {
                    style: {
                        marginTop: '1.25rem',
                        fontSize: '0.7rem',
                        color: '#6b7280',
                        textAlign: 'center'
                    }
                }, t('unauthorizedAccess'))
            )
        );
    }

    // 显示加载状态
    if (loading) {
        return React.createElement('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontFamily: 'Arial, sans-serif'
            }
        },
            React.createElement('div', null,
                React.createElement('div', { style: { fontSize: '2rem', marginBottom: '1rem' } }, '🍱'),
                React.createElement('p', null, 'Loading restaurant data...'),
                React.createElement('button', {
                    onClick: handleLogout,
                    style: {
                        marginTop: '16px',
                        background: '#eee',
                        border: '1px solid #ccc',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }
                }, 'Logout')
            )
        );
    }

    // 显示错误状态
    if (error) {
        return React.createElement('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontFamily: 'Arial, sans-serif'
            }
        },
            React.createElement('div', {
                style: { textAlign: 'center', color: '#d32f2f' }
            },
                React.createElement('h3', null, '⚠️ 错误'),
                React.createElement('p', null, error),
                React.createElement('button', {
                    onClick: loadData,
                    style: {
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }
                }, '重试')
            )
        );
    }

    // 菜单编辑弹窗组件
    const MenuEditModal = ({ item, onSave, onClose }) => {
        const [formData, setFormData] = useState({
            description: item?.description || '',
            price: item?.price || 0,
            sku: item?.sku || '',
            status: item?.status || 'beschikbaar',
            sortingNrm: item?.sortingNrm || 999,
            group: item?.group || 'geen',
            taxRate: item?.taxRate || 0,
            allergy: item?.allergy || '',
            image: item?.image || '',
            menuType: item?.menuType || 'dinner',
            priceAllinDranks: item?.priceAllinDranks || 'normal' // 新增套餐定价字段
        });
        
        // 图片上传状态
        const [imageUploading, setImageUploading] = useState(false);
        const [imageUploadError, setImageUploadError] = useState(null);

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.description || !formData.sku) {
                alert(t('pleaseEnterItemNameAndSKU'));
                return;
            }
            onSave(formData);
        };

        const handleChange = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
        };
        
        // 图片上传处理函数
        const handleImageUpload = async (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            setImageUploading(true);
            setImageUploadError(null);

            try {
                // 使用新的 JavaScript 图片上传管理器
                if (!window.imageUploadManager) {
                    throw new Error('图片上传管理器未加载');
                }

                console.log('🔄 开始上传图片:', file.name);
                const result = await window.imageUploadManager.upload(file);

                if (result.success) {
                    // 上传成功，更新图片字段
                    handleChange('image', result.url);
                    
                    // 显示成功信息
                    let successMessage = `图片上传成功！\n` +
                                       `文件名: ${result.filename}\n` +
                                       `尺寸: ${result.dimensions}\n` +
                                       `大小: ${result.size}`;
                    
                    if (result.storage === 'firebase') {
                        successMessage += `\n存储: Firebase Storage`;
                    } else if (result.storage === 'local-simulation') {
                        successMessage += `\n注意: 这是本地预览，生产环境将使用云存储`;
                    }
                    
                    alert(successMessage);
                } else {
                    throw new Error(result.error || '图片上传失败');
                }
            } catch (error) {
                console.error('图片上传错误:', error);
                setImageUploadError(error.message || '上传过程中发生错误，请重试');
            } finally {
                setImageUploading(false);
            }
        };

        return React.createElement('div', {
            style: {
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10000
            },
            onClick: onClose
        },
            React.createElement('div', {
                style: {
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                },
                onClick: (e) => e.stopPropagation()
            },
                React.createElement('div', {
                    style: { 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        borderBottom: '1px solid #eee',
                        paddingBottom: '1rem'
                    }
                },
                    React.createElement('h3', { 
                        style: { margin: 0, fontSize: '1.3rem', color: '#333' }
                    }, item ? '✏️ 编辑菜品' : '➕ 添加新菜品'),
                    React.createElement('button', {
                        onClick: onClose,
                        style: {
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#999'
                        }
                    }, '×')
                ),
                
                React.createElement('form', { onSubmit: handleSubmit },
                    // 菜品图片预览
                    formData.image && React.createElement('div', {
                        style: { marginBottom: '1rem', textAlign: 'center' }
                    },
                        React.createElement('img', {
                            src: formData.image.startsWith('http') ? formData.image : `../images/${formData.image}`,
                            alt: formData.description,
                            style: {
                                maxWidth: '200px',
                                maxHeight: '150px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            },
                            onError: (e) => { e.target.style.display = 'none'; }
                        })
                    ),
                    
                    // 表单字段
                    [
                        { label: t('itemName') + ' *', field: 'description', type: 'text' },
                        { label: 'SKU *', field: 'sku', type: 'text', disabled: !!item },
                        { label: t('price') + ' (€)', field: 'price', type: 'number', step: '0.01' },
                        { label: t('sortNumber'), field: 'sortingNrm', type: 'number' },
                        { label: t('group'), field: 'group', type: 'text' },
                        { label: t('taxRate'), field: 'taxRate', type: 'number', step: '0.01' },
                        { label: t('allergyInfo'), field: 'allergy', type: 'text' }
                    ].map(({ label, field, type, step, disabled }) =>
                        React.createElement('div', {
                            key: field,
                            style: { marginBottom: '1rem' }
                        },
                            React.createElement('label', {
                                style: {
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#555'
                                }
                            }, label),
                            React.createElement('input', {
                                type: type || 'text',
                                step,
                                value: formData[field],
                                onChange: (e) => handleChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value),
                                disabled,
                                style: {
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem',
                                    background: disabled ? '#f5f5f5' : 'white'
                                }
                            })
                        )
                    ),
                    
                    // 状态和菜单类型选择
                    React.createElement('div', {
                        style: { 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '1rem', 
                            marginBottom: '1rem' 
                        }
                    },
                        React.createElement('div', null,
                            React.createElement('label', {
                                style: {
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#555'
                                }
                            }, t('status')),
                            React.createElement('select', {
                                value: formData.status,
                                onChange: (e) => handleChange('status', e.target.value),
                                style: {
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem'
                                }
                            },
                                React.createElement('option', { value: 'beschikbaar' }, t('available')),
                                React.createElement('option', { value: 'uitverkocht' }, t('soldOut')),
                                React.createElement('option', { value: 'niet beschikbaar' }, t('unavailable'))
                            )
                        ),
                        React.createElement('div', null,
                            React.createElement('label', {
                                style: {
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#555'
                                }
                            }, t('menuType')),
                            React.createElement('select', {
                                value: formData.menuType,
                                onChange: (e) => handleChange('menuType', e.target.value),
                                style: {
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem'
                                }
                            },
                                React.createElement('option', { value: 'dinner' }, t('dinner')),
                                React.createElement('option', { value: 'lunch' }, t('lunch')),
                                React.createElement('option', { value: 'both' }, t('allDay'))
                            )
                        )
                    ),
                    
                    // 套餐饮料定价选择器 - 只在饮料类别时显示
                    formData.group === 'geen' && React.createElement('div', {
                        style: { marginBottom: '1rem' }
                    },
                        React.createElement('label', {
                            style: {
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#555'
                            }
                        }, t('packagePricingRule')),
                        React.createElement('select', {
                            value: formData.priceAllinDranks,
                            onChange: (e) => handleChange('priceAllinDranks', e.target.value),
                            style: {
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                background: 'white'
                            }
                        },
                            React.createElement('option', { value: 'normal' }, t('priceNormal')),
                            React.createElement('option', { value: 'half' }, t('priceHalf')),
                            React.createElement('option', { value: 'free' }, t('priceFree'))
                        ),
                        React.createElement('div', {
                            style: {
                                fontSize: '0.8rem',
                                color: '#666',
                                marginTop: '0.3rem'
                            }
                        }, t('packagePricingDesc'))
                    ),
                    
                    // 图片上传区域
                    React.createElement('div', {
                        style: { marginBottom: '1rem' }
                    },
                        React.createElement('label', {
                            style: {
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#555'
                            }
                        }, '📸 ' + t('itemImage')),
                        
                        // 当前图片路径输入框
                        React.createElement('input', {
                            type: 'text',
                            value: formData.image,
                            onChange: (e) => handleChange('image', e.target.value),
                            placeholder: 'https://example.com/image.jpg 或 image-filename.webp',
                            style: {
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                marginBottom: '0.5rem'
                            }
                        }),
                        
                        // 图片上传区域
                        React.createElement('div', {
                            style: {
                                border: '2px dashed #ddd',
                                borderRadius: '8px',
                                padding: '1rem',
                                textAlign: 'center',
                                background: '#fafafa',
                                position: 'relative'
                            }
                        },
                            React.createElement('input', {
                                type: 'file',
                                accept: 'image/png,image/webp,image/jpg,image/jpeg',
                                onChange: handleImageUpload,
                                disabled: imageUploading,
                                style: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: imageUploading ? 'not-allowed' : 'pointer'
                                }
                            }),
                            React.createElement('div', {
                                style: {
                                    pointerEvents: 'none',
                                    color: imageUploading ? '#999' : '#666'
                                }
                            },
                                React.createElement('div', {
                                    style: { fontSize: '2rem', marginBottom: '0.5rem' }
                                }, imageUploading ? '⏳' : '📤'),
                                React.createElement('div', {
                                    style: { fontWeight: '500', marginBottom: '0.2rem' }
                                }, imageUploading ? '上传中...' : '点击或拖拽上传图片'),
                                React.createElement('div', {
                                    style: { fontSize: '0.8rem', color: '#888' }
                                }, '支持 PNG、WEBP、JPG、JPEG 格式，最大 5MB')
                            )
                        ),
                        
                        // 上传错误信息
                        imageUploadError && React.createElement('div', {
                            style: {
                                color: '#d32f2f',
                                fontSize: '0.8rem',
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                background: '#ffebee',
                                borderRadius: '4px',
                                border: '1px solid #ffcdd2'
                            }
                        }, imageUploadError)
                    ),
                    
                    // 按钮组
                    React.createElement('div', {
                        style: {
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid #eee'
                        }
                    },
                        React.createElement('button', {
                            type: 'button',
                            onClick: onClose,
                            style: {
                                padding: '10px 20px',
                                border: '1px solid #ddd',
                                background: 'white',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }
                        }, t('cancel')),
                        React.createElement('button', {
                            type: 'submit',
                            style: {
                                padding: '10px 20px',
                                border: 'none',
                                background: '#10b981',
                                color: 'white',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }
                        }, item ? t('saveChanges') : t('addMenuItem'))
                    )
                )
            )
        );
    };

    // 桌台编辑模态框 - 更新为真实数据结构
    const TableEditModal = ({ table, onSave, onClose }) => {
        const [formData, setFormData] = useState({
            id: table?.id || '', // 编辑时用现有ID，新增时为空
            Persons: table?.Persons || 2,
            Pincode: table?.Pincode || '',
            Status: table?.Status || 'open',
            URL: table?.URL || '',
            menuType: table?.menuType || 'dinner',
            TableOrder: table?.TableOrder || '', // 添加TableOrder字段
            orders: {
                menu: table?.orders?.menu || 0,
                totaalPrijs: table?.orders?.totaalPrijs || 0
            },
            timer: {
                duration: table?.timer?.duration || 15
            }
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.Persons || formData.Persons < 1) {
                alert(t('pleaseEnterValidPersons'));
                return;
            }
            
            // 新增桌台时，需要桌台号码
            if (!table && !formData.TableOrder) {
                alert(t('pleaseEnterTableNumber'));
                return;
            }
            
            console.log('🔧 桌台编辑表单提交:');
            console.log('- table:', table);
            console.log('- table?.id:', table?.id);
            console.log('- table?.TableOrder:', table?.TableOrder);
            console.log('- formData:', formData);
            console.log('- formData.id:', formData.id);
            
            let saveData;
            
            if (table) {
                // 编辑现有桌台 - 保持原有的ID和TableOrder
                console.log('🔧 编辑现有桌台，使用table.id:', table.id);
                saveData = {
                    ...formData,
                    id: table.id,
                    TableOrder: table.TableOrder
                };
            } else {
                // 添加新桌台 - 根据TableOrder生成ID
                const newTableId = `Tafel-${formData.TableOrder}`;
                console.log('🔧 添加新桌台，生成ID:', newTableId);
                saveData = {
                    ...formData,
                    id: newTableId,
                    TableOrder: formData.TableOrder,
                    // 自动生成URL
                    URL: formData.URL || generateTableUrl(formData.TableOrder)
                };
            }
            
            console.log('🔧 构建的保存数据:', saveData);
            onSave(saveData);
        };

        // 生成新密码
        const generateNewPincode = () => {
            const newPincode = window.RestaurantDataOperations.generatePincode(3);
            setFormData(prev => ({...prev, Pincode: newPincode}));
        };

        // 生成/更新URL
        const updateURL = () => {
            // 优先使用TableOrder，如果没有则从id中提取
            let tableNumber = formData.TableOrder;
            if (!tableNumber && formData.id) {
                const match = formData.id.match(/Tafel-(.+)/);
                if (match) {
                    tableNumber = match[1];
                }
            }
            
            if (tableNumber) {
                const newUrl = generateTableUrl(tableNumber);
                setFormData(prev => ({...prev, URL: newUrl}));
            } else {
                alert(t('pleaseSetTableNumberFirst'));
            }
        };

        return React.createElement('div', {
            style: {
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }
        },
            React.createElement('div', {
                style: {
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    width: '90%',
                    maxWidth: '600px',
                    maxHeight: '85vh',
                    overflow: 'auto'
                }
            },
                React.createElement('h3', {
                    style: { marginTop: 0, marginBottom: '1.5rem', color: '#333' }
                }, table ? t('editTable') : t('addNewTable')),
                
                React.createElement('form', { onSubmit: handleSubmit },
                    React.createElement('div', { 
                        style: { 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                            gap: '1rem', 
                            marginBottom: '1rem' 
                        } 
                    },
                        // 基本信息列
                        React.createElement('div', null,
                            React.createElement('h4', { style: { margin: '0 0 1rem', color: '#666' } }, t('basicInfo')),
                            
                            // 桌台号码 (仅新增时显示)
                            !table && React.createElement('div', { style: { marginBottom: '1rem' } },
                                React.createElement('label', {
                                    style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                                }, t('tableNumberColon')),
                                React.createElement('input', {
                                    type: 'number',
                                    value: formData.TableOrder,
                                    onChange: (e) => {
                                        const tableOrder = e.target.value;
                                        setFormData(prev => ({
                                            ...prev, 
                                            TableOrder: tableOrder,
                                            // 自动更新URL
                                            URL: tableOrder ? generateTableUrl(tableOrder) : prev.URL
                                        }));
                                    },
                                    placeholder: t('tableNumberPlaceholderOld'),
                                    style: {
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }
                                })
                            ),
                            
                            // 人数
                            React.createElement('div', { style: { marginBottom: '1rem' } },
                                React.createElement('label', {
                                    style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                                }, t('personsColon')),
                                React.createElement('input', {
                                    type: 'number',
                                    min: '1',
                                    max: '20',
                                    value: formData.Persons,
                                    onChange: (e) => setFormData(prev => ({...prev, Persons: parseInt(e.target.value) || 2})),
                                    style: {
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }
                                })
                            ),
                            
                            // 密码
                            React.createElement('div', { style: { marginBottom: '1rem' } },
                                React.createElement('label', {
                                    style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                                }, t('pinCodeColon')),
                                React.createElement('div', { style: { display: 'flex', gap: '0.5rem' } },
                                    React.createElement('input', {
                                        type: 'text',
                                        value: formData.Pincode,
                                        onChange: (e) => setFormData(prev => ({...prev, Pincode: e.target.value})),
                                        style: {
                                            flex: 1,
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }
                                    }),
                                    React.createElement('button', {
                                        type: 'button',
                                        onClick: generateNewPincode,
                                        style: {
                                            padding: '8px 12px',
                                            background: '#f59e0b',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }
                                    }, t('randomGenerate'))
                                )
                            ),
                            
                            // 状态
                            React.createElement('div', { style: { marginBottom: '1rem' } },
                                React.createElement('label', {
                                    style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                                }, t('statusColon')),
                                React.createElement('select', {
                                    value: formData.Status,
                                    onChange: (e) => setFormData(prev => ({...prev, Status: e.target.value})),
                                    style: {
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }
                                },
                                    React.createElement('option', { value: 'open' }, t('openAvailable')),
                                    React.createElement('option', { value: 'closed' }, t('closedStatus')),
                                    React.createElement('option', { value: 'occupied' }, t('occupiedStatus')),
                                    React.createElement('option', { value: 'reserved' }, t('reservedStatus'))
                                )
                            ),
                            
                            // 菜单类型
                            React.createElement('div', { style: { marginBottom: '1rem' } },
                                React.createElement('label', {
                                    style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                                }, t('menuTypeColon')),
                                React.createElement('select', {
                                    value: formData.menuType,
                                    onChange: (e) => setFormData(prev => ({...prev, menuType: e.target.value})),
                                    style: {
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }
                                },
                                    React.createElement('option', { value: 'dinner' }, t('dinnerMenu')),
                                    React.createElement('option', { value: 'lunch' }, t('lunchMenu')),
                                    React.createElement('option', { value: 'weekend' }, t('weekendMenu'))
                                )
                            )
                        ),
                        
                        // 订单和设置列
                        React.createElement('div', null,
                            React.createElement('h4', { style: { margin: '0 0 1rem', color: '#666' } }, t('orderSettings')),
                            
                            // 套餐数量
                            React.createElement('div', { style: { marginBottom: '1rem' } },
                                React.createElement('label', {
                                    style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                                }, t('menuQuantity')),
                                React.createElement('input', {
                                    type: 'number',
                                    min: '0',
                                    value: formData.orders.quantity || 0,
                                    onChange: (e) => setFormData(prev => ({
                                        ...prev, 
                                        orders: { ...prev.orders, quantity: parseInt(e.target.value) || 0 }
                                    })),
                                    style: {
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }
                                })
                            ),
                            
                            // 订单总额
                            React.createElement('div', { style: { marginBottom: '1rem' } },
                                React.createElement('label', {
                                    style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                                }, t('orderTotalAmount')),
                                React.createElement('input', {
                                    type: 'number',
                                    min: '0',
                                    step: '0.01',
                                    value: formData.orders.totaalPrijs,
                                    onChange: (e) => setFormData(prev => ({
                                        ...prev, 
                                        orders: { ...prev.orders, totaalPrijs: parseFloat(e.target.value) || 0 }
                                    })),
                                    style: {
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }
                                })
                            ),
                            
                            // 计时器时长
                            React.createElement('div', { style: { marginBottom: '1rem' } },
                                React.createElement('label', {
                                    style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                                }, t('timerDurationMinutes')),
                                React.createElement('input', {
                                    type: 'number',
                                    min: '5',
                                    max: '180',
                                    value: formData.timer.duration,
                                    onChange: (e) => setFormData(prev => ({
                                        ...prev, 
                                        timer: { ...prev.timer, duration: parseInt(e.target.value) || 15 }
                                    })),
                                    style: {
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }
                                })
                            ),
                            
                            // URL设置
                            React.createElement('div', { style: { marginBottom: '1rem' } },
                                React.createElement('label', {
                                    style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                                }, t('tableUrl')),
                                React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' } },
                                    React.createElement('input', {
                                        type: 'url',
                                        value: formData.URL,
                                        onChange: (e) => setFormData(prev => ({...prev, URL: e.target.value})),
                                        style: {
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem'
                                        }
                                    }),
                                    React.createElement('button', {
                                        type: 'button',
                                        onClick: updateURL,
                                        style: {
                                            padding: '6px 10px',
                                            background: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }
                                    }, t('regenerateUrl'))
                                )
                            )
                        )
                    ),
                    
                    // 按钮组
                    React.createElement('div', {
                        style: {
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid #eee'
                        }
                    },
                        React.createElement('button', {
                            type: 'button',
                            onClick: onClose,
                            style: {
                                padding: '10px 20px',
                                border: '1px solid #ddd',
                                background: 'white',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }
                        }, t('cancel')),
                        React.createElement('button', {
                            type: 'submit',
                            style: {
                                padding: '10px 20px',
                                border: 'none',
                                background: '#10b981',
                                color: 'white',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }
                        }, table ? t('saveChanges') : t('addTable'))
                    )
                )
            )
        );
    };

    // 批量更换密码模态框组件
    function BatchPincodeModal({ isOpen, onClose, onConfirm, isLoading }) {
        const [pincodeMethod, setPincodeMethod] = React.useState('random');
        const [customPincode, setCustomPincode] = React.useState('');
        const [adminPassword, setAdminPassword] = React.useState('');
        const [pincodeDigits, setPincodeDigits] = React.useState(4);
        const [error, setError] = React.useState('');

        React.useEffect(() => {
            if (isOpen) {
                setPincodeMethod('random');
                setCustomPincode('');
                setAdminPassword('');
                setPincodeDigits(4);
                setError('');
            }
        }, [isOpen]);

        const handleSubmit = () => {
            if (!adminPassword) {
                setError(t('adminPasswordRequired'));
                return;
            }

            if (pincodeMethod === 'custom' && !customPincode) {
                setError(t('customPincodeRequired'));
                return;
            }

            if (pincodeMethod === 'custom' && (customPincode.length < 3 || customPincode.length > 4)) {
                setError(t('pincodeLength3to4'));
                return;
            }

            setError('');
            onConfirm({
                method: pincodeMethod,
                pincode: pincodeMethod === 'custom' ? customPincode : null,
                digits: pincodeMethod === 'random' ? pincodeDigits : null,
                adminPassword
            });
        };

        if (!isOpen) return null;

        return React.createElement('div', {
            style: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }
        },
            React.createElement('div', {
                style: {
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }
            },
                React.createElement('div', {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid #eee'
                    }
                },
                    React.createElement('h3', {
                        style: { margin: 0, color: '#333' }
                    }, t('batchChangePincode')),
                    React.createElement('button', {
                        onClick: onClose,
                        style: {
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#666'
                        }
                    }, '×')
                ),

                // Pincode generation method selection
                React.createElement('div', {
                    style: { marginBottom: '1.5rem' }
                },
                    React.createElement('h4', {
                        style: { margin: '0 0 1rem', color: '#666' }
                    }, t('pincodeGenerationMethod')),
                    
                    // Random generation option
                    React.createElement('div', {
                        style: { marginBottom: '1rem' }
                    },
                        React.createElement('label', {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                marginBottom: '0.5rem'
                            }
                        },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'pincodeMethod',
                                value: 'random',
                                checked: pincodeMethod === 'random',
                                onChange: (e) => setPincodeMethod(e.target.value),
                                style: { marginRight: '0.5rem' }
                            }),
                            React.createElement('span', null, t('generateRandomPincode'))
                        ),
                        
                        // Digits selection (only shown when random generation is selected)
                        pincodeMethod === 'random' && React.createElement('div', {
                            style: { marginLeft: '1.5rem' }
                        },
                            React.createElement('label', {
                                style: {
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    color: '#666'
                                }
                            }, t('pincodeDigits')),
                            React.createElement('select', {
                                value: pincodeDigits,
                                onChange: (e) => setPincodeDigits(parseInt(e.target.value)),
                                style: {
                                    padding: '4px 8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }
                            },
                                React.createElement('option', { value: 3 }, '3'),
                                React.createElement('option', { value: 4 }, '4')
                            )
                        )
                    ),
                    
                    // Custom input option
                    React.createElement('div', null,
                        React.createElement('label', {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                marginBottom: '0.5rem'
                            }
                        },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'pincodeMethod',
                                value: 'custom',
                                checked: pincodeMethod === 'custom',
                                onChange: (e) => setPincodeMethod(e.target.value),
                                style: { marginRight: '0.5rem' }
                            }),
                            React.createElement('span', null, t('enterCustomPincode'))
                        ),
                        
                        // Custom PIN code input (only shown when custom is selected)
                        pincodeMethod === 'custom' && React.createElement('div', {
                            style: { marginLeft: '1.5rem' }
                        },
                            React.createElement('input', {
                                type: 'text',
                                placeholder: t('enter3or4DigitPincode'),
                                value: customPincode,
                                onChange: (e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 4) {
                                        setCustomPincode(value);
                                    }
                                },
                                style: {
                                    width: '120px',
                                    padding: '6px 10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '1.1rem',
                                    textAlign: 'center'
                                }
                            })
                        )
                    )
                ),

                // Administrator password verification
                React.createElement('div', {
                    style: { marginBottom: '1.5rem' }
                },
                    React.createElement('label', {
                        style: {
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '500',
                            color: '#333'
                        }
                    }, t('adminPasswordVerification')),
                    React.createElement('input', {
                        type: 'password',
                        placeholder: t('enterAdminPassword'),
                        value: adminPassword,
                        onChange: (e) => setAdminPassword(e.target.value),
                        style: {
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '1rem'
                        }
                    })
                ),

                // Error message
                error && React.createElement('div', {
                    style: {
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem'
                    }
                }, error),

                // Warning message
                React.createElement('div', {
                    style: {
                        backgroundColor: '#fef3cd',
                        color: '#856404',
                        padding: '1rem',
                        borderRadius: '4px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem'
                    }
                },
                    React.createElement('strong', null, t('warning')), ': ',
                    t('batchPincodeWarning')
                ),

                // 按钮组
                React.createElement('div', {
                    style: {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #eee'
                    }
                },
                    React.createElement('button', {
                        type: 'button',
                        onClick: onClose,
                        disabled: isLoading,
                        style: {
                            padding: '10px 20px',
                            border: '1px solid #ddd',
                            background: 'white',
                            borderRadius: '6px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.6 : 1
                        }
                    }, t('cancel')),
                    React.createElement('button', {
                        type: 'button',
                        onClick: handleSubmit,
                        disabled: isLoading,
                        style: {
                            padding: '10px 20px',
                            border: 'none',
                            background: isLoading ? '#94a3b8' : '#dc2626',
                            color: 'white',
                            borderRadius: '6px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            minWidth: '120px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    },
                        isLoading && React.createElement('div', {
                            style: {
                                width: '16px',
                                height: '16px',
                                border: '2px solid transparent',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginRight: '0.5rem'
                            }
                        }),
                        isLoading ? t('updating') : t('confirmBatchUpdate')
                    )
                )
            )
        );
    };

    // 主要管理界面
    return React.createElement('div', {
        style: {
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }
    },
        // 头部
        React.createElement('div', {
            style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: window.innerWidth <= 768 ? '1rem' : '1.5rem 2rem',
                display: 'flex',
                flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: window.innerWidth <= 768 ? '1rem' : '0',
                textAlign: window.innerWidth <= 768 ? 'center' : 'left'
            }
        },
            React.createElement('h1', {
                style: { 
                    margin: 0, 
                    fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem', 
                    fontWeight: '300',
                    textAlign: 'center'
                }
            }, t('restaurantConsole')),
            React.createElement('div', {
                style: { 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: window.innerWidth <= 768 ? '0.5rem' : '1rem',
                    flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
                    width: window.innerWidth <= 768 ? '100%' : 'auto',
                    justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-end'
                }
            }, [
                // 语言选择器
                React.createElement('div', {
                    key: 'language-selector',
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        // 移动端使用更深的背景色以提供更好的对比度
                        background: window.innerWidth <= 768 ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)',
                        padding: window.innerWidth <= 768 ? '0.4rem 0.8rem' : '0.3rem 0.8rem',
                        borderRadius: '15px',
                        fontSize: window.innerWidth <= 768 ? '0.9rem' : '0.85rem',
                        minHeight: window.innerWidth <= 768 ? '44px' : 'auto',
                        // 移动端添加边框以增强可见性
                        border: window.innerWidth <= 768 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                    }
                }, [
                    React.createElement('span', {
                        key: 'label',
                        style: { 
                            opacity: 0.8,
                            display: window.innerWidth <= 480 ? 'none' : 'inline',
                            color: 'white' // 确保文字颜色为白色
                        }
                    }, t('language')),
                    React.createElement('select', {
                        key: 'select',
                        value: currentLanguage,
                        onChange: (e) => changeLanguage(e.target.value),
                        style: {
                            // 移动端使用更深的背景和更好的对比度
                            background: window.innerWidth <= 768 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                            border: window.innerWidth <= 768 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                            color: window.innerWidth <= 768 ? '#333' : 'white', // 移动端使用深色文字
                            padding: window.innerWidth <= 768 ? '0.4rem 0.6rem' : '0.2rem 0.4rem',
                            borderRadius: '8px',
                            fontSize: window.innerWidth <= 768 ? '0.9rem' : '0.8rem',
                            cursor: 'pointer',
                            minHeight: window.innerWidth <= 768 ? '36px' : 'auto',
                            // 移动端增强可见性
                            boxShadow: window.innerWidth <= 768 ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                        }
                    }, [
                        React.createElement('option', { key: 'zh', value: 'zh', style: { color: '#333', background: 'white' } }, '中文'),
                        React.createElement('option', { key: 'en', value: 'en', style: { color: '#333', background: 'white' } }, 'English'),
                        React.createElement('option', { key: 'nl', value: 'nl', style: { color: '#333', background: 'white' } }, 'Nederlands')
                    ])
                ]),
                // 系统更新按钮
                React.createElement('button', {
                    key: 'updates-button',
                    style: {
                        fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.85rem',
                        background: 'linear-gradient(45deg, #28a745, #20c997)',
                        color: 'white',
                        border: 'none',
                        padding: window.innerWidth <= 768 ? '0.5rem 0.8rem' : '0.4rem 0.8rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        minHeight: window.innerWidth <= 768 ? '40px' : 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
                    },
                    onClick: () => {
                        // 在新窗口中打开更新说明页面
                        window.open('/beheer/updates-showcase.html', 'updates-showcase', 'width=1200,height=800,scrollbars=yes,resizable=yes');
                    },
                    onMouseEnter: (e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
                    },
                    onMouseLeave: (e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.3)';
                    }
                }, [
                    React.createElement('i', { 
                        key: 'icon',
                        className: 'fas fa-rocket',
                        style: { fontSize: '0.8rem' }
                    }),
                    React.createElement('span', { key: 'text' }, window.innerWidth <= 480 ? 'Updates' : 'Systeem Updates')
                ]),
                
                // 用户信息和退出
                React.createElement('div', {
                    key: 'user-info',
                    style: {
                        fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem',
                        opacity: 0.9,
                        background: 'rgba(255,255,255,0.1)',
                        padding: window.innerWidth <= 768 ? '0.6rem 1rem' : '0.5rem 1rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        minHeight: window.innerWidth <= 768 ? '44px' : 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        whiteSpace: window.innerWidth <= 480 ? 'nowrap' : 'normal',
                        overflow: window.innerWidth <= 480 ? 'hidden' : 'visible',
                        textOverflow: window.innerWidth <= 480 ? 'ellipsis' : 'initial'
                    },
                    onClick: handleLogout
                }, `👤 ${currentUser.email} | ${t('logout')}`)
            ])
        ),
        
        // 导航标签
        React.createElement('div', {
            style: {
                display: 'flex',
                background: 'white',
                borderBottom: '1px solid #dee2e6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflowX: window.innerWidth <= 768 ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch'
            }
        },
            ['menu', 'tables', 'settings'].map(tab =>
                React.createElement('button', {
                    key: tab,
                    onClick: () => setActiveTab(tab),
                    style: {
                        padding: window.innerWidth <= 768 ? '0.8rem 1.5rem' : '1rem 2rem',
                        border: 'none',
                        background: activeTab === tab ? '#667eea' : 'transparent',
                        color: activeTab === tab ? 'white' : '#666',
                        cursor: 'pointer',
                        fontSize: window.innerWidth <= 768 ? '0.85rem' : '0.9rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        minWidth: window.innerWidth <= 768 ? '100px' : 'auto',
                        flex: window.innerWidth <= 768 ? '1' : 'none',
                        minHeight: window.innerWidth <= 768 ? '48px' : 'auto',
                        transition: 'all 0.2s ease',
                        borderRadius: window.innerWidth <= 768 && activeTab === tab ? '0' : '0'
                    }
                }, t(tab === 'menu' ? 'menuManagement' : tab === 'tables' ? 'tablesTitle' : 'settingsTitle'))
            )
        ),
        
        // 主要内容区域
        React.createElement('div', {
            style: { 
                padding: window.innerWidth <= 768 ? '1rem' : '2rem',
                paddingBottom: window.innerWidth <= 768 ? '2rem' : '2rem'
            }
        },
            activeTab === 'menu' && React.createElement('div', null,
                // 菜单管理标题和搜索
                React.createElement('div', {
                    style: {
                        display: 'flex',
                        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: window.innerWidth <= 768 ? 'stretch' : 'center',
                        marginBottom: '2rem',
                        gap: window.innerWidth <= 768 ? '1rem' : '0'
                    }
                },
                    React.createElement('h2', {
                        style: { 
                            margin: 0, 
                            fontSize: window.innerWidth <= 768 ? '1.3rem' : '1.5rem', 
                            color: '#333',
                            textAlign: window.innerWidth <= 768 ? 'center' : 'left'
                        }
                    }, t('menuManagement')),
                    React.createElement('div', {
                        style: { 
                            display: 'flex', 
                            gap: window.innerWidth <= 768 ? '0.5rem' : '1rem', 
                            alignItems: 'center',
                            flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
                        }
                    },
                        React.createElement('input', {
                            type: 'text',
                            placeholder: t('searchMenuItems'),
                            value: searchQuery,
                            onChange: (e) => {
                                const value = e.target.value;
                                console.log('🔍 搜索输入变更:', value);
                                setSearchQuery(value);
                            },
                            onInput: (e) => {
                                // 额外的输入事件处理，确保兼容性
                                const value = e.target.value;
                                setSearchQuery(value);
                            },
                            style: {
                                padding: window.innerWidth <= 768 ? '12px 16px' : '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: window.innerWidth <= 768 ? '1rem' : '0.9rem',
                                minHeight: window.innerWidth <= 768 ? '44px' : 'auto',
                                width: window.innerWidth <= 480 ? '100%' : 'auto',
                                minWidth: window.innerWidth <= 768 && window.innerWidth > 480 ? '200px' : 'auto'
                            }
                        }),
                        React.createElement('button', {
                            onClick: () => {
                                setEditingItem(null);
                                setShowEditModal(true);
                            },
                            style: {
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: window.innerWidth <= 768 ? '12px 20px' : '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: window.innerWidth <= 768 ? '1rem' : '0.9rem',
                                minHeight: window.innerWidth <= 768 ? '44px' : 'auto',
                                width: window.innerWidth <= 480 ? '100%' : 'auto',
                                whiteSpace: 'nowrap'
                            }
                        }, t('addMenuItem')),
                        React.createElement('button', {
                            onClick: handleRenumberMenuItems,
                            style: {
                                background: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                padding: window.innerWidth <= 768 ? '12px 20px' : '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: window.innerWidth <= 768 ? '1rem' : '0.9rem',
                                minHeight: window.innerWidth <= 768 ? '44px' : 'auto',
                                width: window.innerWidth <= 480 ? '100%' : 'auto',
                                whiteSpace: 'nowrap'
                            },
                            title: t('confirmRenumberMenu')
                        }, '🔢 ' + t('renumberMenuItems'))
                    )
                ),
                
                // 菜单项目列表
                React.createElement('div', {
                    style: {
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        // 宽屏时限制最大宽度，避免过度拉伸
                        maxWidth: window.innerWidth > 768 ? '1200px' : '100%',
                        margin: window.innerWidth > 768 ? '0 auto' : '0'
                    }
                },
                    menuItems.length > 0 ? menuItems.map(item =>
                        React.createElement('div', {
                            key: item.id,
                            style: {
                                display: 'flex',
                                flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                                alignItems: window.innerWidth <= 768 ? 'stretch' : 'flex-start',
                                padding: window.innerWidth <= 768 ? '1rem' : '1rem',
                                borderBottom: '1px solid #f0f0f0',
                                gap: window.innerWidth <= 768 ? '0.8rem' : '1rem',
                                // 宽屏时限制容器宽度，避免过度拉伸
                                maxWidth: window.innerWidth > 768 ? '1200px' : '100%',
                                margin: window.innerWidth > 768 ? '0 auto' : '0'
                            }
                        },
                            // 宽屏时：左侧图片+信息区域
                            window.innerWidth > 768 ? 
                                React.createElement('div', {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem',
                                        flex: 1,
                                        minWidth: 0
                                    }
                                },
                                    // 第一行：图片 + 标题
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }
                                    },
                                        // 菜品图片
                                        React.createElement('div', {
                                            style: {
                                                flexShrink: 0,
                                                width: '80px',
                                                height: '60px',
                                                background: '#f5f5f5',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }
                                        },
                                            item.image ? React.createElement('img', {
                                                src: item.image.startsWith('http') ? item.image : `../images/${item.image}`,
                                                alt: item.description,
                                                style: {
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                },
                                                onError: (e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `<span style="color: #999; font-size: 0.8rem;">${t('noImage')}</span>`;
                                                }
                                            }) : React.createElement('span', {
                                                style: { color: '#999', fontSize: '0.8rem' }
                                            }, t('noImage'))
                                        ),
                                        // 菜品标题
                                        React.createElement('h4', {
                                            style: { 
                                                margin: '0', 
                                                color: '#333',
                                                fontSize: '1rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                flex: 1,
                                                minWidth: 0
                                            }
                                        }, item.description || 'No Description')
                                    ),
                                    // 第二行：详细信息（SKU、价格、状态、分组）
                                    React.createElement('div', {
                                        style: { 
                                            display: 'flex', 
                                            gap: '2rem',
                                            fontSize: '0.85rem',
                                            color: '#666',
                                            alignItems: 'center',
                                            marginLeft: '96px' // 对齐图片右边缘
                                        }
                                    },
                                        React.createElement('span', null, `SKU: ${item.sku || 'N/A'}`),
                                        React.createElement('span', { 
                                            style: { fontWeight: '500' }
                                        }, `${t('priceLabel')}: €${parseFloat(item.price || 0).toFixed(2)}`),
                                        React.createElement('span', {
                                            style: {
                                                color: item.status === 'beschikbaar' ? '#10b981' : 
                                                      item.status === 'uitverkocht' ? '#f59e0b' : 
                                                      item.status === 'niet beschikbaar' ? '#ef4444' : '#6b7280',
                                                fontWeight: '500'
                                            }
                                        }, `${t('statusLabel')}: ${item.status || 'N/A'}`),
                                        React.createElement('span', null, `${t('groupLabel')}: ${item.group || 'geen'}`),
                                        
                                        // All-in价格规则显示和内联编辑
                                        React.createElement('div', {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }
                                        },
                                            React.createElement('span', {
                                                style: { fontSize: '0.8rem' }
                                            }, `${t('packagePricingRule')}:`),
                                            
                                            inlineEditingPriceRule === item.id ? 
                                                // 编辑模式
                                                React.createElement('div', {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.3rem'
                                                    }
                                                },
                                                    React.createElement('select', {
                                                        value: tempPriceRule,
                                                        onChange: (e) => setTempPriceRule(e.target.value),
                                                        style: {
                                                            padding: '2px 4px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '3px',
                                                            fontSize: '0.8rem',
                                                            background: 'white'
                                                        }
                                                    },
                                                        React.createElement('option', { value: 'normal' }, t('priceNormal')),
                                                        React.createElement('option', { value: 'half' }, t('priceHalf')),
                                                        React.createElement('option', { value: 'free' }, t('priceFree'))
                                                    ),
                                                    React.createElement('button', {
                                                        onClick: () => handleSavePriceRule(item.id),
                                                        style: {
                                                            background: '#10b981',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '2px 6px',
                                                            borderRadius: '3px',
                                                            fontSize: '0.7rem',
                                                            cursor: 'pointer'
                                                        }
                                                    }, '✓'),
                                                    React.createElement('button', {
                                                        onClick: handleCancelEditPriceRule,
                                                        style: {
                                                            background: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '2px 6px',
                                                            borderRadius: '3px',
                                                            fontSize: '0.7rem',
                                                            cursor: 'pointer'
                                                        }
                                                    }, '✕')
                                                ) :
                                                // 显示模式
                                                React.createElement('span', {
                                                    onClick: () => handleStartEditPriceRule(item.id, item.priceAllinDranks || 'normal'),
                                                    style: {
                                                        background: '#f0f9ff',
                                                        color: '#0369a1',
                                                        padding: '2px 6px',
                                                        borderRadius: '3px',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer',
                                                        border: '1px solid #0ea5e9',
                                                        fontWeight: '500'
                                                    },
                                                    title: '点击编辑价格规则'
                                                }, 
                                                    item.priceAllinDranks === 'normal' ? t('priceNormal') :
                                                    item.priceAllinDranks === 'half' ? t('priceHalf') :
                                                    item.priceAllinDranks === 'free' ? t('priceFree') :
                                                    t('priceNormal')
                                                )
                                        )
                                    )
                                ) :
                            // 窄屏时：原有的布局
                            React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    width: '100%'
                                }
                            },
                                // 菜品图片
                                React.createElement('div', {
                                    style: {
                                        flexShrink: 0,
                                        width: window.innerWidth <= 768 ? '60px' : '80px',
                                        height: '60px',
                                        background: '#f5f5f5',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }
                                },
                                    item.image ? React.createElement('img', {
                                        src: item.image.startsWith('http') ? item.image : `../images/${item.image}`,
                                        alt: item.description,
                                        style: {
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        },
                                        onError: (e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `<span style="color: #999; font-size: 0.7rem;">${t('noImage')}</span>`;
                                        }
                                    }) : React.createElement('span', {
                                        style: { color: '#999', fontSize: '0.7rem' }
                                    }, t('noImage'))
                                ),
                                // 标题和信息
                                React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                                    React.createElement('h4', {
                                        style: { 
                                            margin: '0 0 0.2rem', 
                                            color: '#333',
                                            fontSize: '0.9rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }
                                    }, item.description || 'No Description'),
                                    React.createElement('div', {
                                        style: {
                                            fontSize: '0.7rem',
                                            color: '#666'
                                        }
                                    }, `#${item.sortingNrm || 999} | SKU: ${item.sku || 'N/A'}`)
                                )
                            ),
                            
                            // 窄屏：菜品详细信息（价格、状态等）
                            window.innerWidth <= 768 ? React.createElement('div', { 
                                style: { 
                                    flex: 1,
                                    minWidth: 0,
                                    marginTop: '0.5rem'
                                } 
                            },
                                React.createElement('div', {
                                    style: { 
                                        display: 'flex', 
                                        gap: '0.5rem', 
                                        flexWrap: 'wrap',
                                        fontSize: '0.75rem',
                                        color: '#666',
                                        alignItems: 'center'
                                    }
                                },
                                    React.createElement('span', null, `${t('priceLabel')}: €${parseFloat(item.price || 0).toFixed(2)}`),
                                    React.createElement('span', {
                                        style: {
                                            color: item.status === 'beschikbaar' ? '#10b981' : 
                                                  item.status === 'uitverkocht' ? '#f59e0b' : 
                                                  item.status === 'niet beschikbaar' ? '#ef4444' : '#6b7280'
                                        }
                                    }, `${t('statusLabel')}: ${item.status || 'N/A'}`),
                                    React.createElement('span', null, `${t('groupLabel')}: ${item.group || 'geen'}`),
                                    item.allergy && React.createElement('span', {
                                        style: { color: '#ef4444' }
                                    }, `${t('allergyLabel')}: ${item.allergy}`),
                                    
                                    // 窄屏版All-in价格规则显示和内联编辑
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            marginTop: '0.3rem',
                                            width: '100%'
                                        }
                                    },
                                        React.createElement('span', {
                                            style: { fontSize: '0.7rem', color: '#555' }
                                        }, `${t('packagePricingRule')}:`),
                                        
                                        inlineEditingPriceRule === item.id ? 
                                            // 编辑模式
                                            React.createElement('div', {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.2rem',
                                                    flex: 1
                                                }
                                            },
                                                React.createElement('select', {
                                                    value: tempPriceRule,
                                                    onChange: (e) => setTempPriceRule(e.target.value),
                                                    style: {
                                                        padding: '2px 4px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '3px',
                                                        fontSize: '0.7rem',
                                                        background: 'white',
                                                        flex: 1
                                                    }
                                                },
                                                    React.createElement('option', { value: 'normal' }, t('priceNormal')),
                                                    React.createElement('option', { value: 'half' }, t('priceHalf')),
                                                    React.createElement('option', { value: 'free' }, t('priceFree'))
                                                ),
                                                React.createElement('button', {
                                                    onClick: () => handleSavePriceRule(item.id),
                                                    style: {
                                                        background: '#10b981',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '2px 4px',
                                                        borderRadius: '2px',
                                                        fontSize: '0.6rem',
                                                        cursor: 'pointer'
                                                    }
                                                }, '✓'),
                                                React.createElement('button', {
                                                    onClick: handleCancelEditPriceRule,
                                                    style: {
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '2px 4px',
                                                        borderRadius: '2px',
                                                        fontSize: '0.6rem',
                                                        cursor: 'pointer'
                                                    }
                                                }, '✕')
                                            ) :
                                            // 显示模式
                                            React.createElement('span', {
                                                onClick: () => handleStartEditPriceRule(item.id, item.priceAllinDranks || 'normal'),
                                                style: {
                                                    background: '#f0f9ff',
                                                    color: '#0369a1',
                                                    padding: '1px 4px',
                                                    borderRadius: '2px',
                                                    fontSize: '0.7rem',
                                                    cursor: 'pointer',
                                                    border: '1px solid #0ea5e9',
                                                    fontWeight: '500'
                                                },
                                                title: '点击编辑价格规则'
                                            }, 
                                                item.priceAllinDranks === 'normal' ? t('priceNormal') :
                                                item.priceAllinDranks === 'half' ? t('priceHalf') :
                                                item.priceAllinDranks === 'free' ? t('priceFree') :
                                                t('priceNormal')
                                            )
                                    )
                                )
                            ) : null,
                            
                            // 窄屏上分成两行显示按钮
                            window.innerWidth <= 768 ? 
                                React.createElement('div', {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.8rem',
                                        width: '100%'
                                    }
                                },
                                    // 第一行：排序按钮和排序号
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }
                                    },
                                        React.createElement('div', {
                                            style: {
                                                display: 'flex',
                                                gap: '4px'
                                            }
                                        },
                                            React.createElement('button', {
                                                onClick: () => handleMoveUp(item),
                                                disabled: menuItems.findIndex(i => i.id === item.id) === 0,
                                                style: {
                                                    background: menuItems.findIndex(i => i.id === item.id) === 0 ? '#ccc' : '#6b7280',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '6px 8px',
                                                    borderRadius: '4px',
                                                    cursor: menuItems.findIndex(i => i.id === item.id) === 0 ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.8rem',
                                                    minWidth: '32px',
                                                    minHeight: '32px'
                                                },
                                                title: t('moveUpTitle')
                                            }, '⬆'),
                                            React.createElement('button', {
                                                onClick: () => handleMoveDown(item),
                                                disabled: menuItems.findIndex(i => i.id === item.id) === menuItems.length - 1,
                                                style: {
                                                    background: menuItems.findIndex(i => i.id === item.id) === menuItems.length - 1 ? '#ccc' : '#6b7280',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '6px 8px',
                                                    borderRadius: '4px',
                                                    cursor: menuItems.findIndex(i => i.id === item.id) === menuItems.length - 1 ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.8rem',
                                                    minWidth: '32px',
                                                    minHeight: '32px'
                                                },
                                                title: t('moveDownTitle')
                                            }, '⬇')
                                        ),
                                        React.createElement('div', {
                                            style: {
                                                fontSize: '0.7rem',
                                                color: '#666',
                                                background: '#f5f5f5',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontWeight: '500'
                                            }
                                        }, `#${item.sortingNrm || 999}`)
                                    ),
                                    // 第二行：编辑和删除按钮
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            gap: '0.5rem',
                                            width: '100%'
                                        }
                                    },
                                        React.createElement('button', {
                                            onClick: () => {
                                                setEditingItem(item);
                                                setShowEditModal(true);
                                            },
                                            style: {
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                minHeight: '40px',
                                                flex: 1,
                                                fontWeight: '500'
                                            }
                                        }, t('editButton')),
                                        React.createElement('button', {
                                            onClick: () => handleDeleteMenuItem(item.id),
                                            style: {
                                                background: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                minHeight: '40px',
                                                flex: 1,
                                                fontWeight: '500'
                                            }
                                        }, t('deleteButton'))
                                    )
                                ) :
                                // 宽屏版：水平布局
                                React.createElement('div', {
                                    style: { 
                                        display: 'flex', 
                                        gap: '8px',
                                        flexShrink: 0,
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        flexWrap: 'nowrap'
                                    }
                                },
                                    // 排序按钮组
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            gap: '4px',
                                            alignItems: 'center'
                                        }
                                    },
                                        React.createElement('button', {
                                            onClick: () => handleMoveUp(item),
                                            disabled: menuItems.findIndex(i => i.id === item.id) === 0,
                                            style: {
                                                background: menuItems.findIndex(i => i.id === item.id) === 0 ? '#ccc' : '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 8px',
                                                borderRadius: '4px',
                                                cursor: menuItems.findIndex(i => i.id === item.id) === 0 ? 'not-allowed' : 'pointer',
                                                fontSize: '0.8rem',
                                                minWidth: '32px',
                                                minHeight: '32px'
                                            },
                                            title: t('moveUpTitle')
                                        }, '⬆'),
                                        React.createElement('button', {
                                            onClick: () => handleMoveDown(item),
                                            disabled: menuItems.findIndex(i => i.id === item.id) === menuItems.length - 1,
                                            style: {
                                                background: menuItems.findIndex(i => i.id === item.id) === menuItems.length - 1 ? '#ccc' : '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 8px',
                                                borderRadius: '4px',
                                                cursor: menuItems.findIndex(i => i.id === item.id) === menuItems.length - 1 ? 'not-allowed' : 'pointer',
                                                fontSize: '0.8rem',
                                                minWidth: '32px',
                                                minHeight: '32px'
                                            },
                                            title: t('moveDownTitle')
                                        }, '⬇')
                                    ),
                                    // 排序号
                                    React.createElement('div', {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: '#666',
                                            background: '#f5f5f5',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontWeight: '500',
                                            minWidth: '35px',
                                            textAlign: 'center'
                                        }
                                    }, `#${item.sortingNrm || 999}`),
                                    // 编辑按钮
                                    React.createElement('button', {
                                        onClick: () => {
                                            setEditingItem(item);
                                            setShowEditModal(true);
                                        },
                                        style: {
                                            background: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            whiteSpace: 'nowrap'
                                        }
                                    }, t('editButton')),
                                    // 删除按钮
                                    React.createElement('button', {
                                        onClick: () => handleDeleteMenuItem(item.id),
                                        style: {
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            whiteSpace: 'nowrap'
                                        }
                                    }, t('deleteButton'))
                                )
                        )
                    ) : React.createElement('div', {
                        style: { padding: '2rem', textAlign: 'center', color: '#666' }
                    }, searchQuery ? `${t('noMatchFound')} "${searchQuery}" ${t('menuItems')}` : t('noMenuItems'))
                ),
                
                // 编辑弹窗
                showEditModal && React.createElement(MenuEditModal, {
                    item: editingItem,
                    onSave: handleSaveMenuItem,
                    onClose: () => {
                        setShowEditModal(false);
                        setEditingItem(null);
                    }
                })
            ),
            
            activeTab === 'tables' && React.createElement('div', null,
                // 桌台管理标题和按钮组
                React.createElement('div', {
                    style: {
                        display: 'flex',
                        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: window.innerWidth <= 768 ? 'stretch' : 'center',
                        marginBottom: '2rem',
                        gap: window.innerWidth <= 768 ? '1rem' : '0'
                    }
                },
                    React.createElement('h2', {
                        style: { 
                            margin: 0, 
                            fontSize: window.innerWidth <= 768 ? '1.3rem' : '1.5rem', 
                            color: '#333',
                            textAlign: window.innerWidth <= 768 ? 'center' : 'left'
                        }
                    }, t('tablesTitle')),
                    
                    // 按钮组
                    React.createElement('div', {
                        style: {
                            display: 'flex',
                            flexDirection: window.innerWidth <= 568 ? 'column' : 'row',
                            gap: '10px',
                            alignItems: 'stretch'
                        }
                    },
                        // 批量更换密码按钮
                        React.createElement('button', {
                            onClick: showBatchPincodeModalHandler,
                            style: {
                                background: 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)',
                                color: 'white',
                                border: 'none',
                                padding: window.innerWidth <= 768 ? '12px 20px' : '10px 20px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: window.innerWidth <= 768 ? '1rem' : '0.9rem',
                                fontWeight: '500',
                                minHeight: window.innerWidth <= 768 ? '44px' : 'auto',
                                whiteSpace: 'nowrap'
                            }
                        }, t('batchChangePincode')),
                        
                        // 添加新桌台按钮
                        React.createElement('button', {
                            onClick: () => {
                                setEditingTable(null);
                                setShowTableEditModal(true);
                            },
                            style: {
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: window.innerWidth <= 768 ? '12px 20px' : '10px 20px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: window.innerWidth <= 768 ? '1rem' : '0.9rem',
                                fontWeight: '500',
                                minHeight: window.innerWidth <= 768 ? '44px' : 'auto'
                            }
                        }, t('addNewTable'))
                    )
                ),
                
                // 桌台网格显示
                loadingTables 
                    ? React.createElement('div', {
                        style: { textAlign: 'center', padding: '2rem' }
                    }, t('loading'))
                    : Object.keys(tables).length === 0
                        ? React.createElement('div', {
                            style: {
                                textAlign: 'center',
                                padding: '3rem',
                                background: 'white',
                                borderRadius: '8px',
                                color: '#666'
                            }
                        }, t('noTablesFound'))
                        : React.createElement('div', {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: window.innerWidth <= 480 
                                    ? '1fr' 
                                    : window.innerWidth <= 768 
                                        ? 'repeat(auto-fill, minmax(250px, 1fr))' 
                                        : 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: window.innerWidth <= 768 ? '1rem' : '1.5rem'
                            }
                        },
                            // 按TableOrder排序桌台列表
                            Object.entries(tables)
                                .sort(([, a], [, b]) => {
                                    const orderA = a.TableOrder || 999;
                                    const orderB = b.TableOrder || 999;
                                    return orderA - orderB;
                                })
                                .map(([tableId, table]) => {
                                // 先提取桌台号用于检查重复
                                let tableNumber = 'N/A';
                                if (tableId && tableId.includes('Tafel-')) {
                                    const keyMatch = tableId.match(/Tafel-(.+)/);
                                    if (keyMatch) {
                                        tableNumber = keyMatch[1];
                                    }
                                }
                                
                                console.log(`🎯 渲染桌台 - ID: ${tableId}, 显示号码: ${tableNumber}, TableOrder: ${table.TableOrder}`);
                                
                                const statusColor = {
                                    open: '#28a745',
                                    occupied: '#dc3545', 
                                    reserved: '#ffc107',
                                    closed: '#6c757d'
                                }[table.Status] || '#28a745';
                                
                                return React.createElement('div', {
                                    key: tableId,
                                    style: {
                                        background: 'white',
                                        padding: window.innerWidth <= 768 ? '1rem' : '1.5rem',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        border: `3px solid ${statusColor}`,
                                        position: 'relative'
                                    }
                                },
                                    // 桌台号码和状态 - 窄屏上更紧凑显示
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: window.innerWidth <= 768 ? '0.5rem' : '0.5rem'
                                        }
                                    },
                                        React.createElement('div', {
                                            style: {
                                                fontSize: window.innerWidth <= 768 ? '1rem' : '1.2rem',
                                                fontWeight: 'bold',
                                                color: statusColor
                                            }
                                        }, (() => {
                                            // 直接从Firebase键名中提取桌台号码进行显示
                                            let tableNumber = 'N/A';
                                            
                                            if (tableId && tableId.includes('Tafel-')) {
                                                const keyMatch = tableId.match(/Tafel-(.+)/);
                                                if (keyMatch) {
                                                    tableNumber = keyMatch[1]; // 例如从 "Tafel-10A" 提取 "10A"
                                                }
                                            }

                                            return window.innerWidth <= 768 
                                                ? `T${tableNumber}` 
                                                : `${t('table')} ${tableNumber}`;
                                        })()),
                                        React.createElement('div', { 
                                            style: { 
                                                color: statusColor,
                                                fontWeight: 'bold',
                                                fontSize: window.innerWidth <= 768 ? '0.7rem' : '0.8rem',
                                                background: `${statusColor}20`,
                                                padding: '2px 6px',
                                                borderRadius: '12px',
                                                textTransform: 'uppercase'
                                            }
                                        }, table.Status || 'open')
                                    ),
                                    
                                    // 桌台基本信息 - 窄屏上使用单列布局
                                    React.createElement('div', {
                                        style: { 
                                            display: 'grid',
                                            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
                                            gap: window.innerWidth <= 768 ? '0.3rem' : '0.5rem',
                                            marginBottom: window.innerWidth <= 768 ? '0.8rem' : '1rem',
                                            fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.8rem'
                                        }
                                    },
                                        React.createElement('div', {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }
                                        },
                                            React.createElement('span', null, `${t('personsCount')}:`),
                                            React.createElement('strong', null, table.Persons || 2)
                                        ),
                                        React.createElement('div', {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                color: '#666'
                                            }
                                        },
                                            React.createElement('span', null, 'PIN:'),
                                            React.createElement('code', {
                                                style: {
                                                    background: '#f5f5f5',
                                                    padding: '1px 4px',
                                                    borderRadius: '3px',
                                                    fontSize: '0.7em'
                                                }
                                            }, table.Pincode || 'N/A')
                                        ),
                                        React.createElement('div', {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }
                                        },
                                            React.createElement('span', null, `${t('menuSet')}:`),
                                            React.createElement('strong', null, table.orders?.quantity || 0)
                                        ),
                                        React.createElement('div', {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                color: '#10b981',
                                                fontWeight: 'bold'
                                            }
                                        },
                                            React.createElement('span', null, t('total') + ':'),
                                            React.createElement('span', null, `€${parseFloat(table.orders?.totaalPrijs || 0).toFixed(2)}`)
                                        ),
                                        window.innerWidth <= 768 ? null : React.createElement('div', { style: { color: '#666' } }, 
                                            `${t('menuType')}: ${table.menuType || 'dinner'}`
                                        )
                                    ),
                                    
                                    // 二维码和计时器信息
                                    React.createElement('div', {
                                        style: { 
                                            marginBottom: window.innerWidth <= 768 ? '0.8rem' : '1rem',
                                            padding: window.innerWidth <= 768 ? '0.4rem' : '0.5rem',
                                            background: '#f8f9fa',
                                            borderRadius: '4px',
                                            fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.8rem'
                                        }
                                    },
                                        // 二维码生成按钮
                                        table.URL && React.createElement('div', {
                                            style: { marginBottom: '0.5rem' }
                                        },
                                            React.createElement('button', {
                                                onClick: () => generateQRCode(table),
                                                style: {
                                                    background: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: window.innerWidth <= 768 ? '6px 10px' : '4px 8px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: window.innerWidth <= 768 ? '0.75rem' : '0.8rem',
                                                    width: window.innerWidth <= 768 ? '100%' : 'auto',
                                                    minHeight: window.innerWidth <= 768 ? '36px' : 'auto',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px'
                                                }
                                            },
                                                window.innerWidth <= 768 ? '📱 QR' : t('generateQRCode'),
                                                table.Pincode && React.createElement('span', {
                                                    style: { 
                                                        fontSize: '0.7rem',
                                                        background: 'rgba(255,255,255,0.2)',
                                                        padding: '1px 3px',
                                                        borderRadius: '2px'
                                                    }
                                                }, t('passwordFree'))
                                            )
                                        ),
                                        table.timer && React.createElement('div', null,
                                            React.createElement('strong', null, t('timer') + ': '),
                                            `${table.timer.duration || 15}${t('minutes')}`
                                        )
                                    ),
                                    
                                    // 状态快速切换按钮
                                    React.createElement('div', {
                                        style: { 
                                            display: 'grid', 
                                            gridTemplateColumns: window.innerWidth <= 768 ? '1fr 1fr' : 'repeat(4, 1fr)',
                                            gap: window.innerWidth <= 768 ? '0.3rem' : '0.5rem', 
                                            marginBottom: window.innerWidth <= 768 ? '0.8rem' : '1rem'
                                        }
                                    },
                                        ['open', 'occupied', 'reserved', 'closed'].map(status =>
                                            React.createElement('button', {
                                                key: status,
                                                onClick: () => handleStatusChange(tableId, status),
                                                style: {
                                                    background: table.Status === status ? statusColor : '#e9ecef',
                                                    color: table.Status === status ? 'white' : '#495057',
                                                    border: 'none',
                                                    padding: window.innerWidth <= 768 ? '6px 4px' : '4px 8px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: window.innerWidth <= 768 ? '0.65rem' : '0.7rem',
                                                    fontWeight: table.Status === status ? 'bold' : 'normal',
                                                    minHeight: window.innerWidth <= 768 ? '32px' : 'auto',
                                                    textTransform: 'uppercase'
                                                }
                                            }, window.innerWidth <= 768 ? t(status).substr(0, 3) : t(status))
                                        )
                                    ),
                                    
                                    // 操作按钮
                                    React.createElement('div', {
                                        style: { 
                                            display: 'flex', 
                                            gap: window.innerWidth <= 768 ? '0.3rem' : '0.5rem',
                                            flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
                                        }
                                    },
                                        React.createElement('button', {
                                            onClick: () => {
                                                console.log('🔧 设置编辑桌台:', table);
                                                console.log('🔧 桌台ID:', table?.id);
                                                setEditingTable(table);
                                                setShowTableEditModal(true);
                                            },
                                            style: {
                                                flex: 1,
                                                padding: window.innerWidth <= 768 ? '10px' : '8px',
                                                background: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: window.innerWidth <= 768 ? '0.85rem' : '0.8rem',
                                                minHeight: window.innerWidth <= 768 ? '40px' : 'auto'
                                            }
                                        }, t('edit')),
                                        
                                        React.createElement('button', {
                                            onClick: () => {
                                                // 从tableId中提取正确的桌台号
                                                const match = tableId.match(/Tafel-(.+)/);
                                                const tableNumber = match ? match[1] : table.TableOrder || tableId;
                                                
                                                setViewingOrderHistory({
                                                    tableId: tableId,
                                                    tableName: `${t('table')} ${tableNumber}`,
                                                    history: table.orders?.history || {}
                                                });
                                            },
                                            style: {
                                                flex: 1,
                                                padding: window.innerWidth <= 768 ? '10px' : '8px',
                                                background: '#17a2b8',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: window.innerWidth <= 768 ? '0.85rem' : '0.8rem',
                                                minHeight: window.innerWidth <= 768 ? '40px' : 'auto'
                                            }
                                        }, t('orderHistory')),
                                        
                                        React.createElement('button', {
                                            onClick: () => handleDeleteTable(tableId),
                                            style: {
                                                flex: 1,
                                                padding: window.innerWidth <= 768 ? '10px' : '8px',
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: window.innerWidth <= 768 ? '0.85rem' : '0.8rem',
                                                minHeight: window.innerWidth <= 768 ? '40px' : 'auto'
                                            }
                                        }, t('delete'))
                                    )
                                );
                            })
                        ),
                
                // 桌台编辑弹窗
                showTableEditModal && React.createElement(TableEditModal, {
                    table: editingTable,
                    onSave: saveTable,
                    onClose: () => {
                        setShowTableEditModal(false);
                        setEditingTable(null);
                    }
                }),
                
                // 批量更换密码弹窗
                showBatchPincodeModal && React.createElement(BatchPincodeModal, {
                    isOpen: showBatchPincodeModal,
                    isLoading: batchPincodeLoading,
                    onConfirm: handleBatchPincodeConfirm,
                    onClose: () => setShowBatchPincodeModal(false)
                }),
                
                // 二维码显示弹窗
                showQRCode && React.createElement(QRCodeModal, {
                    qrData: showQRCode,
                    onClose: () => setShowQRCode(null)
                }),
                
                // 订单历史查看弹窗
                viewingOrderHistory && React.createElement(OrderHistoryModal, {
                    orderHistory: viewingOrderHistory.history,
                    tableName: viewingOrderHistory.tableName,
                    onClose: () => setViewingOrderHistory(null)
                })
            ),
            
            activeTab === 'settings' && React.createElement('div', {
                className: 'settings-container'
            },
                // 餐厅设置标题
                React.createElement('div', {
                    style: { 
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }
                },
                    React.createElement('h2', {
                        style: { 
                            margin: 0, 
                            fontSize: '1.5rem',
                            color: '#333'
                        }
                    }, t('settingsTitle'))
                ),
                
                loadingSettings 
                    ? React.createElement('div', {
                        style: { textAlign: 'center', padding: '2rem' }
                    }, t('loading'))
                    : React.createElement('div', {
                        className: 'settings-grid'
                    },
                        // 基础设置面板
                        React.createElement('div', {
                            className: 'settings-panel'
                        },
                            React.createElement('h3', {
                                style: { marginTop: 0, marginBottom: '1rem', color: '#333' }
                            }, t('basicSettings')),
                            
                            // 餐厅名称 (restNaam)
                            React.createElement('div', { 
                                className: 'settings-field'
                            },
                                React.createElement('label', {
                                    className: 'settings-label'
                                }, t('restaurantName') + ':'),
                                React.createElement('input', {
                                    type: 'text',
                                    value: settings.restNaam || '',
                                    onChange: (e) => setSettings(prev => ({...prev, restNaam: e.target.value})),
                                    className: 'settings-input'
                                })
                            ),
                            
                            // 管理员密码 (adminPassword)
                            React.createElement('div', { 
                                className: 'settings-field'
                            },
                                React.createElement('label', {
                                    className: 'settings-label'
                                }, t('adminPassword') + ':'),
                                React.createElement('input', {
                                    type: 'password',
                                    value: settings.adminPassword || '',
                                    onChange: (e) => setSettings(prev => ({...prev, adminPassword: e.target.value})),
                                    className: 'settings-input'
                                })
                            ),
                            
                            // 最大时间 (maxTijd) - 秒为单位
                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('label', { className: 'settings-label' }, t('maxTimeSeconds') + ':'),
                                React.createElement('input', {
                                    type: 'number',
                                    min: '300',
                                    max: '7200',
                                    value: settings.maxTijd || 600,
                                    onChange: (e) => setSettings(prev => ({...prev, maxTijd: parseInt(e.target.value) || 600})),
                                    className: 'settings-input'
                                })
                            ),
                            
                            // 轮次时间 (round_time) - 分钟为单位
                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('label', { className: 'settings-label' }, t('roundTimeMinutes') + ':'),
                                React.createElement('input', {
                                    type: 'number',
                                    min: '5',
                                    max: '60',
                                    value: settings.round_time || 15,
                                    onChange: (e) => setSettings(prev => ({...prev, round_time: parseInt(e.target.value) || 15})),
                                    className: 'settings-input'
                                })
                            ),
                            
                            // 食物限制 (etenLimiet)
                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('label', { className: 'settings-label' }, t('foodLimit') + ':'),
                                React.createElement('input', {
                                    type: 'number',
                                    min: '0',
                                    max: '50',
                                    value: settings.etenLimiet || 4,
                                    onChange: (e) => setSettings(prev => ({...prev, etenLimiet: parseInt(e.target.value) || 4})),
                                    className: 'settings-input'
                                })
                            ),
                            
                            // 甜品限制 (dessertLimiet)
                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('label', { className: 'settings-label' }, t('dessertLimit') + ':'),
                                React.createElement('input', {
                                    type: 'number',
                                    min: '0',
                                    max: '20',
                                    value: settings.dessertLimiet || 2,
                                    onChange: (e) => setSettings(prev => ({...prev, dessertLimiet: parseInt(e.target.value) || 2})),
                                    className: 'settings-input'
                                })
                            ),
                            
                            // 开关设置
                            React.createElement('div', { className: 'settings-checkbox-field' },
                                React.createElement('input', {
                                    type: 'checkbox',
                                    checked: settings.timeLimit || false,
                                    onChange: (e) => setSettings(prev => ({...prev, timeLimit: e.target.checked})),
                                    className: 'settings-checkbox'
                                }),
                                t('enableTimeLimit')
                            ),
                            
                            React.createElement('div', { className: 'settings-checkbox-field' },
                                React.createElement('input', {
                                    type: 'checkbox',
                                    checked: settings.requirePinToClose || false,
                                    onChange: (e) => setSettings(prev => ({...prev, requirePinToClose: e.target.checked})),
                                    className: 'settings-checkbox'
                                }),
                                t('requirePinToClose')
                            ),
                            
                            React.createElement('div', { className: 'settings-checkbox-field' },
                                React.createElement('input', {
                                    type: 'checkbox',
                                    checked: settings.translateOn || false,
                                    onChange: (e) => setSettings(prev => ({...prev, translateOn: e.target.checked})),
                                    className: 'settings-checkbox'
                                }),
                                t('enableTranslation')
                            ),
                            
                            React.createElement('div', { className: 'settings-checkbox-field' },
                                React.createElement('input', {
                                    type: 'checkbox',
                                    checked: settings.whatsappBerichtAan || false,
                                    onChange: (e) => setSettings(prev => ({...prev, whatsappBerichtAan: e.target.checked})),
                                    className: 'settings-checkbox'
                                }),
                                t('enableWhatsApp')
                            ),
                            
                            // WhatsApp收件人 (whatsappRecipients) - 文本区域
                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('label', { className: 'settings-label' }, t('whatsappRecipients') + ':'),
                                React.createElement('textarea', {
                                    placeholder: '+31612345678\n+31687654321',
                                    value: settings.whatsappRecipients || '',
                                    onChange: (e) => setSettings(prev => ({...prev, whatsappRecipients: e.target.value})),
                                    rows: 3,
                                    className: 'settings-input settings-textarea'
                                })
                            ),

                            // Cloudflare Zero Trust Email Management
                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('label', { className: 'settings-label' }, 'Cloudflare Zero Trust Configuratie:')
                            ),
                            
                            // Cloudflare API Token
                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('label', { className: 'settings-label' }, 'Cloudflare API Token:'),
                                React.createElement('input', {
                                    type: 'password',
                                    placeholder: 'Voer je Cloudflare API token in...',
                                    value: settings.cloudflareApiToken || '',
                                    onChange: (e) => setSettings(prev => ({...prev, cloudflareApiToken: e.target.value})),
                                    className: 'settings-input'
                                }),
                                React.createElement('small', {
                                    style: { 
                                        display: 'block', 
                                        marginTop: '4px', 
                                        color: '#666', 
                                        fontSize: '0.85em' 
                                    }
                                }, 'Genereer een API token in Cloudflare Dashboard > My Profile > API Tokens')
                            ),

                            // Cloudflare Account ID
                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('label', { className: 'settings-label' }, 'Cloudflare Account ID:'),
                                React.createElement('input', {
                                    type: 'text',
                                    placeholder: 'Je Cloudflare Account ID...',
                                    value: settings.cloudflareAccountId || '',
                                    onChange: (e) => setSettings(prev => ({...prev, cloudflareAccountId: e.target.value})),
                                    className: 'settings-input'
                                }),
                                React.createElement('small', {
                                    style: { 
                                        display: 'block', 
                                        marginTop: '4px', 
                                        color: '#666', 
                                        fontSize: '0.85em' 
                                    }
                                }, 'Te vinden in Cloudflare Dashboard > rechterkant van je domein overzicht')
                            ),

                            // Allowed Email Addresses
                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('label', { className: 'settings-label' }, 'Toegestane Email Adressen:'),
                                React.createElement('textarea', {
                                    placeholder: 'user1@example.com\nuser2@example.com\nadmin@restaurant.com',
                                    value: settings.allowedEmails || '',
                                    onChange: (e) => setSettings(prev => ({...prev, allowedEmails: e.target.value})),
                                    rows: 4,
                                    className: 'settings-input settings-textarea'
                                }),
                                React.createElement('small', {
                                    style: { 
                                        display: 'block', 
                                        marginTop: '4px', 
                                        color: '#666', 
                                        fontSize: '0.85em' 
                                    }
                                }, 'Voer één email adres per regel in. Deze adressen krijgen toegang tot de beveiligde secties.')
                            ),

                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('div', {
                                    style: {
                                        display: 'flex',
                                        gap: '10px',
                                        flexWrap: 'wrap'
                                    }
                                },
                                    React.createElement('button', {
                                        onClick: async (event) => {
                                            try {
                                                // Validation
                                                if (!settings.cloudflareApiToken || !settings.cloudflareAccountId) {
                                                    alert('Vul eerst je Cloudflare API Token en Account ID in.');
                                                    return;
                                                }

                                                const emails = (settings.allowedEmails || '').split('\n')
                                                    .map(email => email.trim())
                                                    .filter(email => email && email.includes('@'));
                                                
                                                if (emails.length === 0) {
                                                    alert('Voer minimaal één geldig email adres in.');
                                                    return;
                                                }

                                                // Show loading state
                                                const button = event.target;
                                                const originalText = button.textContent;
                                                button.disabled = true;
                                                button.textContent = 'Bezig met bijwerken...';

                                                // Get configuration
                                                const cloudflareConfig = getCloudflareConfig();
                                                
                                                // Prepare API call data
                                                const updateData = {
                                                    policyId: cloudflareConfig.policyId,
                                                    allowedEmails: emails,
                                                    apiToken: settings.cloudflareApiToken,
                                                    accountId: settings.cloudflareAccountId || cloudflareConfig.defaultAccountId
                                                };

                                                // Call backend API endpoint
                                                const updatePolicyUrl = getApiUrl('cloudflareUpdatePolicy');
                                                const response = await fetch(updatePolicyUrl, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${settings.cloudflareApiToken}`
                                                    },
                                                    body: JSON.stringify(updateData)
                                                });

                                                if (response.ok) {
                                                    const result = await response.json();
                                                    alert(`✅ ${emails.length} email adres(sen) succesvol bijgewerkt in Cloudflare Zero Trust policy!\\n\\nUpdated emails:\\n${emails.join('\\n')}`);
                                                    
                                                    // Save to Firebase as well (without sensitive data)
                                                    const settingsToSave = {...settings};
                                                    delete settingsToSave.cloudflareApiToken; // Don't save API token to Firebase
                                                    await handleSaveSettings(settingsToSave);
                                                } else {
                                                    const errorData = await response.json().catch(() => ({}));
                                                    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                                                }

                                                button.disabled = false;
                                                button.textContent = originalText;
                                            } catch (error) {
                                                console.error('Cloudflare policy update failed:', error);
                                                alert(`❌ Fout bij bijwerken Cloudflare beleid:\\n\\n${error.message}\\n\\nControleer je API token en Account ID.`);
                                                event.target.disabled = false;
                                                event.target.textContent = 'Bijwerk Cloudflare Beleid';
                                            }
                                        },
                                        style: {
                                            padding: '8px 16px',
                                            backgroundColor: '#ff6b35',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }
                                    }, 'Bijwerk Cloudflare Beleid'),

                                    React.createElement('button', {
                                        onClick: async (event) => {
                                            try {
                                                if (!settings.cloudflareApiToken || !settings.cloudflareAccountId) {
                                                    alert('Vul eerst je Cloudflare API Token en Account ID in.');
                                                    return;
                                                }

                                                const button = event.target;
                                                const originalText = button.textContent;
                                                button.disabled = true;
                                                button.textContent = 'Ophalen...';

                                                // Get configuration
                                                const cloudflareConfig = getCloudflareConfig();
                                                const accountId = settings.cloudflareAccountId || cloudflareConfig.defaultAccountId;
                                                const getPolicyUrl = getApiUrl('cloudflareGetPolicy');
                                                
                                                const response = await fetch(`${getPolicyUrl}?policyId=${cloudflareConfig.policyId}&accountId=${accountId}`, {
                                                    headers: {
                                                        'Authorization': `Bearer ${settings.cloudflareApiToken}`
                                                    }
                                                });

                                                if (response.ok) {
                                                    const data = await response.json();
                                                    const currentEmails = data.policy?.rules?.[0]?.include?.[0]?.email || [];
                                                    
                                                    if (currentEmails.length > 0) {
                                                        alert(`📋 Huidige toegestane emails in Cloudflare Zero Trust:\\n\\n${currentEmails.join('\\n')}`);
                                                    } else {
                                                        alert('⚠️ Geen email adressen gevonden in het huidige beleid.');
                                                    }
                                                } else {
                                                    const errorData = await response.json().catch(() => ({}));
                                                    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                                                }

                                                button.disabled = false;
                                                button.textContent = originalText;
                                            } catch (error) {
                                                console.error('Failed to fetch Cloudflare policy:', error);
                                                alert(`❌ Fout bij ophalen Cloudflare beleid:\\n\\n${error.message}\\n\\nControleer je API token en Account ID.`);
                                                event.target.disabled = false;
                                                event.target.textContent = 'Bekijk Huidig Beleid';
                                            }
                                        },
                                        style: {
                                            padding: '8px 16px',
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }
                                    }, 'Bekijk Huidig Beleid'),

                                    React.createElement('button', {
                                        onClick: () => {
                                            const instructions = `🔧 Cloudflare Zero Trust Setup Instructies:

1. **API Token aanmaken:**
   • Ga naar Cloudflare Dashboard
   • Klik rechtsboven op je profiel > "My Profile"
   • Ga naar "API Tokens" tab
   • Klik "Create Token"
   • Gebruik "Custom token" template
   • Permissions: Account:Cloudflare Access:Edit, Zone:Zone Settings:Read
   • Account Resources: Include All accounts
   • Kopieer de gegenereerde token

2. **Account ID vinden:**
   • Ga naar je Cloudflare Dashboard
   • Selecteer je domein
   • Rechts zie je "Account ID" - kopieer deze

3. **Application Policy ID:**
   • Huidige Policy ID: ${getCloudflareConfig().policyId}
   • Deze is al ingesteld in de configuratie

4. **Veiligheid:**
   • API tokens worden NIET opgeslagen in Firebase
   • Alleen lokaal gebruikt voor API calls
   • Account ID wordt wel opgeslagen (niet gevoelig)`;
                                            alert(instructions);
                                        },
                                        style: {
                                            padding: '8px 16px',
                                            backgroundColor: '#17a2b8',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }
                                    }, 'Setup Instructies')
                                )
                            ),
                            
                            // 标题图像 URL (titleImage)
                            React.createElement('div', { className: 'settings-field' },
                                React.createElement('label', { className: 'settings-label' }, t('restaurantLogoUrl') + ':'),
                                React.createElement('input', {
                                    type: 'url',
                                    placeholder: 'https://example.com/logo.png',
                                    value: settings.titleImage || '',
                                    onChange: (e) => setSettings(prev => ({...prev, titleImage: e.target.value})),
                                    className: 'settings-input'
                                })
                            ),
                            
                            // 保存按钮
                            React.createElement('button', {
                                onClick: () => handleSaveSettings(settings),
                                disabled: loadingSettings,
                                className: 'settings-button'
                            }, loadingSettings ? t('loading') : t('save'))
                        ),
                        
                        // 分类管理面板
                        React.createElement('div', {
                            className: 'settings-panel'
                        },
                            React.createElement('div', {
                                style: { 
                                    display: window.innerWidth <= 768 ? 'block' : 'flex',
                                    justifyContent: window.innerWidth <= 768 ? 'flex-start' : 'space-between', 
                                    alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center',
                                    marginTop: 0, 
                                    marginBottom: window.innerWidth <= 768 ? '1.2rem' : '1rem' 
                                }
                            },
                                React.createElement('h3', {
                                    style: { 
                                        margin: 0, 
                                        marginBottom: window.innerWidth <= 768 ? '1rem' : 0,
                                        color: '#333',
                                        fontSize: window.innerWidth <= 768 ? '1.2rem' : 'inherit'
                                    }
                                }, t('categoryManagement')),
                                React.createElement('div', {
                                    style: {
                                        display: 'flex',
                                        gap: window.innerWidth <= 768 ? '0.5rem' : '8px',
                                        flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap'
                                    }
                                },
                                    React.createElement('button', {
                                        onClick: async () => {
                                            try {
                                                console.log('🔧 手动测试Firebase连接...');
                                                const database = window.firebase.database();
                                                
                                                // 测试连接状态
                                                const connectedSnapshot = await database.ref('.info/connected').once('value');
                                                console.log('连接状态:', connectedSnapshot.val());
                                                
                                                // 测试读取权限
                                                const testSnapshot = await database.ref(getRestaurantPath()).limitToFirst(1).once('value');
                                                console.log('读取测试:', testSnapshot.val());
                                                
                                                alert('Firebase连接正常！检查控制台日志查看详细信息。');
                                            } catch (error) {
                                                console.error('Firebase测试失败:', error);
                                                alert(`Firebase测试失败: ${error.message}`);
                                            }
                                        },
                                        style: {
                                            padding: window.innerWidth <= 768 ? '8px 12px' : '4px 8px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: window.innerWidth <= 768 ? '14px' : '12px',
                                            cursor: 'pointer',
                                            minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                        }
                                    }, t('testConnection')),
                                    React.createElement('button', {
                                        onClick: () => {
                                            console.log('🔄 手动重新加载分类数据...');
                                            loadData();
                                        },
                                        style: {
                                            padding: window.innerWidth <= 768 ? '8px 12px' : '4px 8px',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: window.innerWidth <= 768 ? '14px' : '12px',
                                            cursor: 'pointer',
                                            minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                        }
                                    }, t('reload'))
                                )
                            ),
                            
                            loadingCategories 
                                ? React.createElement('div', {
                                    style: { textAlign: 'center', padding: '1rem' }
                                }, t('loading'))
                                : (!categories || !categories.food || !categories.drinks || 
                                   categories.food.length === 0 && categories.drinks.length === 0) 
                                    ? React.createElement('div', {
                                        style: { textAlign: 'center', padding: '1rem', color: '#666' }
                                    }, React.createElement('div', null,
                                        t('categoryDataInitializing'),
                                        React.createElement('br'),
                                        React.createElement('small', {
                                            style: { fontSize: '12px', color: '#999' }
                                        }, `${t('debugInfo')}: categories=${!!categories}, food=${categories?.food?.length || 0}, drinks=${categories?.drinks?.length || 0}`)
                                    ))
                                    : React.createElement('div', null,
                                    
                                    // 食物分类部分
                                    React.createElement('div', { 
                                        style: { 
                                            marginBottom: window.innerWidth <= 768 ? '2rem' : '1.5rem' 
                                        } 
                                    },
                                        React.createElement('div', {
                                            style: { 
                                                display: window.innerWidth <= 768 ? 'block' : 'flex',
                                                justifyContent: window.innerWidth <= 768 ? 'flex-start' : 'space-between', 
                                                alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center',
                                                marginBottom: window.innerWidth <= 768 ? '1rem' : '0.5rem'
                                            }
                                        },
                                            React.createElement('h4', {
                                                style: { 
                                                    margin: 0, 
                                                    marginBottom: window.innerWidth <= 768 ? '0.8rem' : 0,
                                                    color: '#555',
                                                    fontSize: window.innerWidth <= 768 ? '1.1rem' : 'inherit'
                                                }
                                            }, t('foodCategories')),
                                            React.createElement('button', {
                                                onClick: addFoodCategory,
                                                style: {
                                                    padding: window.innerWidth <= 768 ? '8px 16px' : '4px 8px',
                                                    background: '#10b981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    fontSize: window.innerWidth <= 768 ? '14px' : '12px',
                                                    cursor: 'pointer',
                                                    minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                                }
                                            }, t('addCategory'))
                                        ),
                                        
                                        React.createElement('div', {
                                            style: { 
                                                maxHeight: window.innerWidth <= 768 ? '250px' : '200px',
                                                overflowY: 'auto',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '4px',
                                                padding: window.innerWidth <= 768 ? '0.8rem' : '0.5rem'
                                            }
                                        },
                                            (!categories.food || categories.food.length === 0)
                                                ? React.createElement('div', {
                                                    style: { 
                                                        textAlign: 'center', 
                                                        color: '#666', 
                                                        padding: window.innerWidth <= 768 ? '1.5rem' : '1rem',
                                                        fontSize: window.innerWidth <= 768 ? '0.95rem' : 'inherit'
                                                    }
                                                }, t('noFoodCategories'))
                                                : categories.food.map((cat, index) =>
                                                    React.createElement('div', {
                                                        key: cat.id,
                                                        style: {
                                                            display: 'flex',
                                                            gap: window.innerWidth <= 768 ? '0.6rem' : '0.5rem',
                                                            alignItems: 'center',
                                                            marginBottom: window.innerWidth <= 768 ? '0.8rem' : '0.5rem',
                                                            padding: window.innerWidth <= 768 ? '0.8rem' : '0.5rem',
                                                            background: '#f9fafb',
                                                            borderRadius: '4px',
                                                            flexWrap: window.innerWidth <= 480 ? 'wrap' : 'nowrap'
                                                        }
                                                    },
                                                        React.createElement('input', {
                                                            type: 'text',
                                                            value: cat.name,
                                                            onChange: (e) => updateCategory('food', cat.id, 'name', e.target.value),
                                                            style: {
                                                                flex: 1,
                                                                minWidth: window.innerWidth <= 480 ? '100%' : 'auto',
                                                                padding: window.innerWidth <= 768 ? '8px' : '4px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '3px',
                                                                fontSize: window.innerWidth <= 768 ? '16px' : '12px',
                                                                minHeight: window.innerWidth <= 768 ? '36px' : 'auto',
                                                                marginBottom: window.innerWidth <= 480 ? '0.5rem' : 0
                                                            }
                                                        }),
                                                        React.createElement('input', {
                                                            type: 'number',
                                                            value: cat.target,
                                                            onChange: (e) => updateCategory('food', cat.id, 'target', parseInt(e.target.value) || 1),
                                                            style: {
                                                                width: window.innerWidth <= 768 ? '80px' : '60px',
                                                                padding: window.innerWidth <= 768 ? '8px' : '4px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '3px',
                                                                fontSize: window.innerWidth <= 768 ? '16px' : '12px',
                                                                minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                                            }
                                                        }),
                                                        React.createElement('button', {
                                                            onClick: () => moveCategory('food', 'drinks', cat.id),
                                                            title: t('moveToDrinksTitle'),
                                                            style: {
                                                                padding: window.innerWidth <= 768 ? '8px 12px' : '4px 6px',
                                                                background: '#3b82f6',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '3px',
                                                                fontSize: window.innerWidth <= 768 ? '14px' : '12px',
                                                                cursor: 'pointer',
                                                                minHeight: window.innerWidth <= 768 ? '36px' : 'auto',
                                                                whiteSpace: 'nowrap'
                                                            }
                                                        }, window.innerWidth <= 480 ? '→饮' : t('moveToDrinks')),
                                                        React.createElement('button', {
                                                            onClick: () => removeCategory('food', cat.id),
                                                            style: {
                                                                padding: window.innerWidth <= 768 ? '8px 12px' : '4px 6px',
                                                                background: '#ef4444',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '3px',
                                                                fontSize: window.innerWidth <= 768 ? '16px' : '12px',
                                                                cursor: 'pointer',
                                                                minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                                            }
                                                        }, '×')
                                                    )
                                                )
                                        )
                                    ),
                                    
                                    // 饮料分类部分
                                    React.createElement('div', { 
                                        style: { 
                                            marginBottom: window.innerWidth <= 768 ? '2rem' : '1.5rem' 
                                        } 
                                    },
                                        React.createElement('div', {
                                            style: { 
                                                display: window.innerWidth <= 768 ? 'block' : 'flex',
                                                justifyContent: window.innerWidth <= 768 ? 'flex-start' : 'space-between', 
                                                alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center',
                                                marginBottom: window.innerWidth <= 768 ? '1rem' : '0.5rem'
                                            }
                                        },
                                            React.createElement('h4', {
                                                style: { 
                                                    margin: 0, 
                                                    marginBottom: window.innerWidth <= 768 ? '0.8rem' : 0,
                                                    color: '#555',
                                                    fontSize: window.innerWidth <= 768 ? '1.1rem' : 'inherit'
                                                }
                                            }, t('drinkCategories')),
                                            React.createElement('button', {
                                                onClick: addDrinkCategory,
                                                style: {
                                                    padding: window.innerWidth <= 768 ? '8px 16px' : '4px 8px',
                                                    background: '#3b82f6',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    fontSize: window.innerWidth <= 768 ? '14px' : '12px',
                                                    cursor: 'pointer',
                                                    minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                                }
                                            }, t('addCategory'))
                                        ),
                                        
                                        React.createElement('div', {
                                            style: { 
                                                maxHeight: window.innerWidth <= 768 ? '250px' : '200px',
                                                overflowY: 'auto',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '4px',
                                                padding: window.innerWidth <= 768 ? '0.8rem' : '0.5rem'
                                            }
                                        },
                                            (!categories.drinks || categories.drinks.length === 0)
                                                ? React.createElement('div', {
                                                    style: { 
                                                        textAlign: 'center', 
                                                        color: '#666', 
                                                        padding: window.innerWidth <= 768 ? '1.5rem' : '1rem',
                                                        fontSize: window.innerWidth <= 768 ? '0.95rem' : 'inherit'
                                                    }
                                                }, t('noDrinkCategories'))
                                                : categories.drinks.map((cat, index) =>
                                                    React.createElement('div', {
                                                        key: cat.id,
                                                        style: {
                                                            display: 'flex',
                                                            gap: window.innerWidth <= 768 ? '0.6rem' : '0.5rem',
                                                            alignItems: 'center',
                                                            marginBottom: window.innerWidth <= 768 ? '0.8rem' : '0.5rem',
                                                            padding: window.innerWidth <= 768 ? '0.8rem' : '0.5rem',
                                                            background: '#f0f9ff',
                                                            borderRadius: '4px',
                                                            flexWrap: window.innerWidth <= 480 ? 'wrap' : 'nowrap'
                                                        }
                                                    },
                                                        React.createElement('input', {
                                                            type: 'text',
                                                            value: cat.name,
                                                            onChange: (e) => updateCategory('drinks', cat.id, 'name', e.target.value),
                                                            style: {
                                                                flex: 1,
                                                                minWidth: window.innerWidth <= 480 ? '100%' : 'auto',
                                                                padding: window.innerWidth <= 768 ? '8px' : '4px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '3px',
                                                                fontSize: window.innerWidth <= 768 ? '16px' : '12px',
                                                                minHeight: window.innerWidth <= 768 ? '36px' : 'auto',
                                                                marginBottom: window.innerWidth <= 480 ? '0.5rem' : 0
                                                            }
                                                        }),
                                                        React.createElement('input', {
                                                            type: 'number',
                                                            value: cat.target,
                                                            onChange: (e) => updateCategory('drinks', cat.id, 'target', parseInt(e.target.value) || 200),
                                                            style: {
                                                                width: window.innerWidth <= 768 ? '80px' : '60px',
                                                                padding: window.innerWidth <= 768 ? '8px' : '4px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '3px',
                                                                fontSize: window.innerWidth <= 768 ? '16px' : '12px',
                                                                minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                                            }
                                                        }),
                                                        React.createElement('button', {
                                                            onClick: () => moveCategory('drinks', 'food', cat.id),
                                                            title: t('moveToFoodTitle'),
                                                            style: {
                                                                padding: window.innerWidth <= 768 ? '8px 12px' : '4px 6px',
                                                                background: '#10b981',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '3px',
                                                                fontSize: window.innerWidth <= 768 ? '14px' : '12px',
                                                                cursor: 'pointer',
                                                                minHeight: window.innerWidth <= 768 ? '36px' : 'auto',
                                                                whiteSpace: 'nowrap'
                                                            }
                                                        }, window.innerWidth <= 480 ? '→食' : t('moveToFood')),
                                                        React.createElement('button', {
                                                            onClick: () => removeCategory('drinks', cat.id),
                                                            style: {
                                                                padding: window.innerWidth <= 768 ? '8px 12px' : '4px 6px',
                                                                background: '#ef4444',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '3px',
                                                                fontSize: window.innerWidth <= 768 ? '16px' : '12px',
                                                                cursor: 'pointer',
                                                                minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                                            }
                                                        }, '×')
                                                    )
                                                )
                                        )
                                    ),
                                    
                                    // 服务分类部分
                                    React.createElement('div', { 
                                        style: { 
                                            marginBottom: window.innerWidth <= 768 ? '2rem' : '1.5rem' 
                                        } 
                                    },
                                        React.createElement('h4', {
                                            style: { 
                                                margin: '0 0 0.5rem 0', 
                                                color: '#555',
                                                fontSize: window.innerWidth <= 768 ? '1.1rem' : 'inherit'
                                            }
                                        }, t('serviceCategory')),
                                        
                                        React.createElement('div', {
                                            style: {
                                                display: 'flex',
                                                gap: window.innerWidth <= 768 ? '0.8rem' : '0.5rem',
                                                alignItems: 'center',
                                                padding: window.innerWidth <= 768 ? '0.8rem' : '0.5rem',
                                                background: '#fef3c7',
                                                borderRadius: '4px',
                                                flexWrap: window.innerWidth <= 480 ? 'wrap' : 'nowrap'
                                            }
                                        },
                                            React.createElement('input', {
                                                type: 'text',
                                                value: categories.serviceCat.displayName || '',
                                                onChange: (e) => setCategories(prev => ({
                                                    ...prev,
                                                    serviceCat: { ...prev.serviceCat, displayName: e.target.value }
                                                })),
                                                style: {
                                                    flex: 1,
                                                    minWidth: window.innerWidth <= 480 ? '100%' : 'auto',
                                                    padding: window.innerWidth <= 768 ? '8px' : '4px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '3px',
                                                    fontSize: window.innerWidth <= 768 ? '16px' : '12px',
                                                    minHeight: window.innerWidth <= 768 ? '36px' : 'auto',
                                                    marginBottom: window.innerWidth <= 480 ? '0.5rem' : 0
                                                }
                                            }),
                                            React.createElement('input', {
                                                type: 'number',
                                                value: categories.serviceCat.directTarget || 16,
                                                onChange: (e) => setCategories(prev => ({
                                                    ...prev,
                                                    serviceCat: { ...prev.serviceCat, directTarget: parseInt(e.target.value) || 16 }
                                                })),
                                                style: {
                                                    width: window.innerWidth <= 768 ? '80px' : '60px',
                                                    padding: window.innerWidth <= 768 ? '8px' : '4px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '3px',
                                                    fontSize: window.innerWidth <= 768 ? '16px' : '12px',
                                                    minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                                }
                                            })
                                        )
                                    ),
                                    
                                    // 保存按钮
                                    React.createElement('button', {
                                        onClick: () => handleSaveCategories(categories),
                                        disabled: loadingCategories,
                                        style: {
                                            width: '100%',
                                            padding: window.innerWidth <= 768 ? '16px' : '12px',
                                            background: loadingCategories ? '#ccc' : '#f59e0b',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: loadingCategories ? 'not-allowed' : 'pointer',
                                            fontSize: window.innerWidth <= 768 ? '1.1rem' : '1rem',
                                            fontWeight: '500',
                                            minHeight: window.innerWidth <= 768 ? '48px' : 'auto'
                                        }
                                    }, loadingCategories ? t('saving') : t('saveCategorySettings'))
                                )
                        ),
                        
                        // 对客户隐藏的项目面板
                        React.createElement('div', {
                            style: {
                                background: 'white',
                                padding: window.innerWidth <= 768 ? '1rem' : '1.5rem',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                width: '100%',
                                maxWidth: window.innerWidth <= 768 ? 'none' : '100%'
                            }
                        },
                            React.createElement('div', {
                                style: { 
                                    display: window.innerWidth <= 768 ? 'block' : 'flex',
                                    justifyContent: window.innerWidth <= 768 ? 'flex-start' : 'space-between', 
                                    alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center',
                                    marginTop: 0, 
                                    marginBottom: window.innerWidth <= 768 ? '1.2rem' : '1rem' 
                                }
                            },
                                React.createElement('h3', {
                                    style: { 
                                        margin: 0, 
                                        marginBottom: window.innerWidth <= 768 ? '1rem' : 0,
                                        color: '#333',
                                        fontSize: window.innerWidth <= 768 ? '1.2rem' : 'inherit'
                                    }
                                }, t('hiddenItemsManagement')),
                                React.createElement('div', {
                                    style: { 
                                        display: 'flex', 
                                        gap: window.innerWidth <= 768 ? '0.5rem' : '8px',
                                        flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap'
                                    }
                                },
                                    React.createElement('button', {
                                        onClick: async () => {
                                            console.log('🔄 ' + t('manualReload') + '...');
                                            setLoadingHiddenItems(true);
                                            try {
                                                const database = window.firebase.database();
                                                const exceptionsSnapshot = await database.ref(`${getRestaurantPath()}/menukaart/exceptions`).once('value');
                                                const exceptionsData = exceptionsSnapshot.val() || {};
                                                
                                                const hiddenItemsData = {};
                                                Object.keys(exceptionsData).forEach(sku => {
                                                    hiddenItemsData[sku] = {
                                                        sku: sku,
                                                        reason: exceptionsData[sku].reason || t('hiddenItem'),
                                                        hiddenAt: exceptionsData[sku].hiddenAt || new Date().toISOString()
                                                    };
                                                });
                                                
                                                setHiddenItems(hiddenItemsData);
                                                alert(`${t('refreshSuccess')} ${Object.keys(hiddenItemsData).length} ${t('hiddenItemsCount')}`);
                                            } catch (error) {
                                                console.error(t('refreshFailed') + ':', error);
                                                alert(`${t('refreshFailed')}: ${error.message}`);
                                            } finally {
                                                setLoadingHiddenItems(false);
                                            }
                                        },
                                        style: {
                                            padding: window.innerWidth <= 768 ? '8px 12px' : '4px 8px',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: window.innerWidth <= 768 ? '14px' : '12px',
                                            cursor: 'pointer',
                                            minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                        }
                                    }, t('refresh')),
                                    React.createElement('button', {
                                        onClick: addHiddenItem,
                                        style: {
                                            padding: window.innerWidth <= 768 ? '8px 16px' : '6px 12px',
                                            background: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: window.innerWidth <= 768 ? '14px' : '14px',
                                            cursor: 'pointer',
                                            minHeight: window.innerWidth <= 768 ? '36px' : 'auto'
                                        }
                                    }, t('addHiddenItem'))
                                )
                            ),
                            
                            loadingHiddenItems 
                                ? React.createElement('div', {
                                    style: { textAlign: 'center', padding: '1rem' }
                                }, t('loading'))
                                : React.createElement('div', null,
                                    React.createElement('div', {
                                        style: {
                                            marginBottom: window.innerWidth <= 768 ? '1.5rem' : '1rem',
                                            fontSize: window.innerWidth <= 768 ? '0.95rem' : '14px',
                                            color: '#666',
                                            background: '#f8f9fa',
                                            padding: window.innerWidth <= 768 ? '16px' : '12px',
                                            borderRadius: '4px',
                                            border: '1px solid #e9ecef',
                                            lineHeight: window.innerWidth <= 768 ? '1.5' : '1.4'
                                        }
                                    },
                                        React.createElement('strong', null, t('description') + '：'), 
                                        ' ' + t('hiddenItemsDescription')
                                    ),
                                    
                                    // 隐藏项目列表
                                    React.createElement('div', {
                                        style: {
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px'
                                        }
                                    },
                                        Object.keys(hiddenItems).length === 0 
                                            ? React.createElement('div', {
                                                style: {
                                                    textAlign: 'center',
                                                    color: '#666',
                                                    padding: '2rem',
                                                    fontStyle: 'italic'
                                                }
                                            }, t('noHiddenItems'))
                                            : Object.entries(hiddenItems).map(([sku, item]) =>
                                                React.createElement('div', {
                                                    key: sku,
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        padding: '12px 16px',
                                                        borderBottom: '1px solid #f1f3f4'
                                                    }
                                                },
                                                    React.createElement('div', {
                                                        style: {
                                                            minWidth: '120px',
                                                            fontWeight: '600',
                                                            color: '#1f2937',
                                                            fontFamily: 'monospace',
                                                            backgroundColor: '#f3f4f6',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '13px'
                                                        }
                                                    }, sku),
                                                    React.createElement('input', {
                                                        type: 'text',
                                                        placeholder: t('hiddenReason'),
                                                        value: item.reason || '',
                                                        onChange: (e) => updateHiddenItemReason(sku, e.target.value),
                                                        style: {
                                                            flex: 1,
                                                            padding: '6px 10px',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '4px',
                                                            fontSize: '13px'
                                                        }
                                                    }),
                                                    React.createElement('div', {
                                                        style: {
                                                            fontSize: '11px',
                                                            color: '#6b7280',
                                                            minWidth: '80px'
                                                        }
                                                    }, new Date(item.hiddenAt).toLocaleDateString()),
                                                    React.createElement('button', {
                                                        onClick: () => removeHiddenItem(sku),
                                                        style: {
                                                            padding: '4px 8px',
                                                            background: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '3px',
                                                            fontSize: '12px',
                                                            cursor: 'pointer'
                                                        }
                                                    }, t('deleteButton'))
                                                )
                                            )
                                    ),
                                    
                                    // 保存按钮
                                    React.createElement('button', {
                                        onClick: () => handleSaveHiddenItems(hiddenItems),
                                        disabled: loadingHiddenItems,
                                        style: {
                                            width: '100%',
                                            padding: '12px',
                                            marginTop: '1rem',
                                            background: loadingHiddenItems ? '#ccc' : '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: loadingHiddenItems ? 'not-allowed' : 'pointer',
                                            fontSize: '1rem',
                                            fontWeight: '500'
                                        }
                                    }, loadingHiddenItems ? t('saving') : t('saveHiddenItems'))
                                )
                        )
                    )
            )
        )
    );
}

// 二维码显示模态组件
function QRCodeModal({ qrData, onClose }) {
    const useEffect = window.useEffect || React.useEffect;
    const useRef = window.useRef || React.useRef;
    const useLanguage = window.useLanguage;
    const { t } = useLanguage ? useLanguage() : { t: (key) => key };
    const qrCodeRef = useRef(null);
    
    useEffect(() => {
        if (qrData && qrCodeRef.current && window.QRCode) {
            // 清空之前的二维码
            qrCodeRef.current.innerHTML = '';
            
            // 生成新的二维码
            const qr = new window.QRCode(qrCodeRef.current, {
                text: qrData.url,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: window.QRCode.CorrectLevel.M
            });
        }
    }, [qrData]);
    
    if (!qrData) return null;
    
    return React.createElement('div', {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        onClick: (e) => {
            if (e.target === e.currentTarget) onClose();
        }
    },
        React.createElement('div', {
            style: {
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }
        },
            React.createElement('h3', {
                style: { 
                    marginTop: 0, 
                    marginBottom: '1.5rem',
                    color: '#333'
                }
            }, `${qrData.tableName} - 二维码`),
            
            // 二维码容器
            React.createElement('div', {
                ref: qrCodeRef,
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                }
            }),
            
            // 信息显示
            React.createElement('div', {
                style: {
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    color: '#666'
                }
            },
                qrData.pincode && React.createElement('div', {
                    style: {
                        background: '#d4edda',
                        color: '#155724',
                        padding: '8px',
                        borderRadius: '4px',
                        marginBottom: '8px',
                        border: '1px solid #c3e6cb'
                    }
                }, `✅ 免密访问 (PIN: ${qrData.pincode})`),
                
                React.createElement('div', {
                    style: { fontSize: '0.8rem' }
                }, '客人扫描此二维码即可直接点餐')
            ),
            
            // 操作按钮
            React.createElement('div', {
                style: { 
                    display: 'flex', 
                    gap: '1rem', 
                    justifyContent: 'center' 
                }
            },
                React.createElement('button', {
                    onClick: () => {
                        // 下载二维码功能（可选）
                        const canvas = qrCodeRef.current.querySelector('canvas');
                        if (canvas) {
                            const link = document.createElement('a');
                            link.download = `table-${qrData.tableId}-qr.png`;
                            link.href = canvas.toDataURL();
                            link.click();
                        }
                    },
                    style: {
                        padding: '8px 16px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }
                }, '💾 下载'),
                
                React.createElement('button', {
                    onClick: onClose,
                    style: {
                        padding: '8px 16px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }
                }, t('close'))
            )
        )
    );
}

// 订单历史查看模态组件
function OrderHistoryModal({ orderHistory, tableName, onClose }) {
    const useLanguage = window.useLanguage;
    const { t } = useLanguage ? useLanguage() : { t: (key) => key };
    
    return React.createElement('div', {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        onClick: (e) => {
            if (e.target === e.currentTarget) onClose();
        }
    },
        React.createElement('div', {
            style: {
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '90%',
                overflow: 'auto'
            }
        },
            React.createElement('h3', {
                style: { marginTop: 0, marginBottom: '1.5rem' }
            }, `${t('orderHistory')} - ${tableName ? `${tableName}` : '未知桌子'}`),
            
            !orderHistory || Object.keys(orderHistory).length === 0
                ? React.createElement('div', {
                    style: { textAlign: 'center', padding: '2rem', color: '#666' }
                }, t('noOrderHistory'))
                : React.createElement('div', {
                    style: { maxHeight: '500px', overflowY: 'auto' }
                },
                    // Handle array-based order history structure
                    (() => {
                        const orders = Object.values(orderHistory).filter(order => order !== null);
                        console.log('Processing orders:', orders);
                        
                        if (orders.length === 0) {
                            return React.createElement('div', {
                                style: { textAlign: 'center', padding: '2rem', color: '#666' }
                            }, t('noOrderHistory'));
                        }
                        
                        return orders.map((order, orderIndex) => {
                            console.log('Processing order:', order);
                            
                            // Calculate total from paymentDetails
                            const totalAmount = order.paymentDetails && order.paymentDetails.length > 0 
                                ? Object.values(order.paymentDetails[0])[0] || 0
                                : 0;
                            
                            return React.createElement('div', {
                                key: order.invoiceNumber || orderIndex,
                                style: {
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '1rem',
                                    marginBottom: '1rem',
                                    background: '#f9f9f9'
                                }
                            },
                                React.createElement('div', {
                                    style: { 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginBottom: '0.5rem',
                                        borderBottom: '1px solid #eee',
                                        paddingBottom: '0.5rem'
                                    }
                                },
                                    React.createElement('strong', {
                                        style: { fontSize: '1.1rem' }
                                    }, order.invoiceNumber || `订单 #${orderIndex + 1}`),
                                    React.createElement('span', {
                                        style: { 
                                            color: '#10b981', 
                                            fontWeight: 'bold',
                                            fontSize: '1.1rem'
                                        }
                                    }, `€${parseFloat(totalAmount).toFixed(2)}`)
                                ),
                                
                                // Enhanced timestamp display
                                React.createElement('div', {
                                    style: { 
                                        fontSize: '0.9rem', 
                                        color: '#666', 
                                        marginBottom: '0.5rem',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }
                                },
                                    React.createElement('span', null, `时间: ${new Date(order.date).toLocaleDateString()} ${new Date(order.date).toLocaleTimeString()}`),
                                    React.createElement('span', {
                                        style: { fontSize: '0.75rem' }
                                    }, `商品总数: ${order.totalItems || 0}`)
                                ),
                                
                                // Display order items
                                React.createElement('div', {
                                    style: { marginTop: '0.5rem' }
                                },
                                    React.createElement('div', {
                                        style: { fontWeight: '500', marginBottom: '0.25rem' }
                                    }, '订单项目:'),
                                    React.createElement('div', {
                                        style: { paddingLeft: '1rem' }
                                    },
                                        order.orderDetails && order.orderDetails.map((item, itemIndex) => {
                                            // item structure: [timestamp, sku, quantity, price, discount, name]
                                            const [itemTimestamp, sku, quantity, price, discount, name] = item;
                                            const itemTotal = parseFloat(price) * parseInt(quantity);
                                            
                                            return React.createElement('div', {
                                                key: itemIndex,
                                                style: { 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '0.25rem 0',
                                                    fontSize: '0.9rem',
                                                    borderBottom: '1px solid #f0f0f0'
                                                }
                                            },
                                                React.createElement('div', {
                                                    style: { flex: 1 }
                                                },
                                                    React.createElement('div', {
                                                        style: { fontWeight: '500' }
                                                    }, name || '未知项目'),
                                                    React.createElement('div', {
                                                        style: { fontSize: '0.75rem', color: '#666' }
                                                    }, `SKU: ${sku} | 单价: €${parseFloat(price).toFixed(2)}`)
                                                ),
                                                React.createElement('div', {
                                                    style: { 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }
                                                },
                                                    React.createElement('span', {
                                                        style: { 
                                                            background: '#e5e7eb',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.75rem'
                                                        }
                                                    }, `× ${quantity}`),
                                                    React.createElement('span', {
                                                        style: { 
                                                            color: '#10b981',
                                                            fontWeight: 'bold'
                                                        }
                                                    }, `€${itemTotal.toFixed(2)}`)
                                                )
                                            );
                                        })
                                    )
                                )
                            );
                        });
                    })()
                ),
            
            // Summary Statistics
            orderHistory && Object.keys(orderHistory).length > 0 && React.createElement('div', {
                style: {
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '6px',
                    marginTop: '1rem',
                    border: '1px solid #e9ecef'
                }
            },
                React.createElement('h4', {
                    style: { 
                        margin: '0 0 0.5rem 0',
                        fontSize: '1rem',
                        color: '#495057'
                    }
                }, '订单统计'),
                React.createElement('div', {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '1rem'
                    }
                },
                    React.createElement('div', {
                        style: { textAlign: 'center' }
                    },
                        React.createElement('div', {
                            style: {
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#007bff'
                            }
                        }, Object.values(orderHistory).filter(order => order !== null).length),
                        React.createElement('div', {
                            style: {
                                fontSize: '0.8rem',
                                color: '#6c757d'
                            }
                        }, '总订单数')
                    ),
                    React.createElement('div', {
                        style: { textAlign: 'center' }
                    },
                        React.createElement('div', {
                            style: {
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#28a745'
                            }
                        }, `€${Object.values(orderHistory)
                            .filter(order => order !== null)
                            .reduce((sum, order) => {
                                const totalAmount = order.paymentDetails && order.paymentDetails.length > 0 
                                    ? Object.values(order.paymentDetails[0])[0] || 0
                                    : 0;
                                return sum + parseFloat(totalAmount);
                            }, 0).toFixed(2)}`),
                        React.createElement('div', {
                            style: {
                                fontSize: '0.8rem',
                                color: '#6c757d'
                            }
                        }, '总金额')
                    ),
                    React.createElement('div', {
                        style: { textAlign: 'center' }
                    },
                        React.createElement('div', {
                            style: {
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#ffc107'
                            }
                        }, `€${(() => {
                            const validOrders = Object.values(orderHistory).filter(order => order !== null);
                            const totalAmount = validOrders.reduce((sum, order) => {
                                const orderTotal = order.paymentDetails && order.paymentDetails.length > 0 
                                    ? Object.values(order.paymentDetails[0])[0] || 0
                                    : 0;
                                return sum + parseFloat(orderTotal);
                            }, 0);
                            const avgAmount = validOrders.length > 0 ? totalAmount / validOrders.length : 0;
                            return avgAmount.toFixed(2);
                        })()}`),
                        React.createElement('div', {
                            style: {
                                fontSize: '0.8rem',
                                color: '#6c757d'
                            }
                        }, '平均订单额')
                    )
                )
            ),
            
            React.createElement('div', {
                style: { 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #eee'
                }
            },
                React.createElement('button', {
                    onClick: onClose,
                    style: {
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }
                }, t('close'))
            )
        )
    );
}

// 桌子编辑模态组件
function TableEditModal({ table, onSave, onClose }) {
    const useState = window.useState || React.useState;
    const useLanguage = window.useLanguage;
    const { t } = useLanguage ? useLanguage() : { t: (key) => key };
    const [formData, setFormData] = useState({
        TableOrder: '',
        Status: 'open',
        Persons: 4,
        Pincode: '',
        URL: '',
        menuType: 'dinner',
        orders: {
            menu: 0,
            totaalPrijs: 0,
            history: {}
        },
        timer: {
            duration: 15,
            startTime: null,
            endTime: null
        }
    });

    // 初始化表单数据
    useEffect(() => {
        if (table) {
            // 编辑现有桌台
            setFormData({
                TableOrder: table.TableOrder || '',
                Status: table.Status || 'open',
                Persons: table.Persons || 4,
                Pincode: table.Pincode || '',
                URL: table.URL || '',
                menuType: table.menuType || 'dinner',
                orders: {
                    menu: table.orders?.menu || '',
                    quantity: table.orders?.quantity || 0,
                    totaalPrijs: table.orders?.totaalPrijs || 0,
                    history: table.orders?.history || {}
                },
                timer: {
                    duration: table.timer?.duration || 15,
                    startTime: table.timer?.startTime,
                    endTime: table.timer?.endTime
                }
            });
        } else {
            // 添加新桌台，重置为默认值
            setFormData({
                TableOrder: '',
                Status: 'open',
                Persons: 4,
                Pincode: '',
                URL: '',
                menuType: 'dinner',
                orders: {
                    menu: 0,
                    totaalPrijs: 0,
                    history: {}
                },
                timer: {
                    duration: 15,
                    startTime: null,
                    endTime: null
                }
            });
        }
    }, [table]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 生成PIN码和URL（如果需要）
        let finalData = { ...formData };
        
        if (!finalData.Pincode && finalData.TableOrder) {
            finalData.Pincode = Math.floor(Math.random() * 9000) + 1000;
        }
        
        if (!finalData.URL && finalData.TableOrder) {
            const baseUrl = window.location.origin;
            finalData.URL = `${baseUrl}/bestel.html?tafel=${finalData.TableOrder}`;
        }
        
        await onSave(finalData);
    };

    return React.createElement('div', {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        onClick: (e) => {
            if (e.target === e.currentTarget) onClose();
        }
    },
        React.createElement('div', {
            style: {
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90%',
                overflow: 'auto'
            }
        },
            React.createElement('h3', {
                style: { marginTop: 0, marginBottom: '1.5rem' }
            }, table ? t('editTable') : t('addNewTable')),
            
            React.createElement('form', { onSubmit: handleSubmit },
                // 桌台基本信息标题
                React.createElement('h4', { 
                    style: { marginTop: 0, marginBottom: '1rem', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' } 
                }, t('basicInfo')),
                
                React.createElement('div', {
                    style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }
                },
                    // 桌号 - 放在第一位，更突出
                    React.createElement('div', {},
                        React.createElement('label', {
                            style: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#d32f2f' }
                        }, t('tableNumberRequired')),
                        React.createElement('input', {
                            type: 'text',
                            value: formData.TableOrder,
                            onChange: (e) => setFormData(prev => ({ ...prev, TableOrder: e.target.value })),
                            placeholder: t('tableNumberPlaceholder'),
                            style: {
                                width: '100%',
                                padding: '10px',
                                border: '2px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px'
                            },
                            required: true
                        })
                    ),
                    
                    // 人数
                    React.createElement('div', {},
                        React.createElement('label', {
                            style: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }
                        }, t('diningPersons')),
                        React.createElement('input', {
                            type: 'number',
                            min: '1',
                            max: '20',
                            value: formData.Persons,
                            onChange: (e) => setFormData(prev => ({ ...prev, Persons: parseInt(e.target.value) || 1 })),
                            style: {
                                width: '100%',
                                padding: '10px',
                                border: '2px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }
                        })
                    )
                ),
                
                React.createElement('div', {
                    style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }
                },
                    // 状态
                    React.createElement('div', {},
                        React.createElement('label', {
                            style: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }
                        }, t('tableStatus')),
                        React.createElement('select', {
                            value: formData.Status,
                            onChange: (e) => setFormData(prev => ({ ...prev, Status: e.target.value })),
                            style: {
                                width: '100%',
                                padding: '10px',
                                border: '2px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }
                        },
                            React.createElement('option', { value: 'open' }, t('statusOpenIdle')),
                            React.createElement('option', { value: 'occupied' }, t('statusOccupiedBusy')),
                            React.createElement('option', { value: 'reserved' }, t('statusReserved')),
                            React.createElement('option', { value: 'closed' }, t('statusClosed'))
                        )
                    ),
                    
                    // 菜单类型
                    React.createElement('div', {},
                        React.createElement('label', {
                            style: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }
                        }, t('menuType')),
                        React.createElement('select', {
                            value: formData.menuType,
                            onChange: (e) => setFormData(prev => ({ ...prev, menuType: e.target.value })),
                            style: {
                                width: '100%',
                                padding: '10px',
                                border: '2px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }
                        },
                            React.createElement('option', { value: 'dinner' }, t('dinner')),
                            React.createElement('option', { value: 'lunch' }, t('lunch')),
                            React.createElement('option', { value: 'all-day' }, t('allDay'))
                        )
                    )
                ),
                
                // PIN码和计时器
                React.createElement('div', {
                    style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }
                },
                    React.createElement('div', {},
                        React.createElement('label', {
                            style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                        }, t('pinCodeAutoGenerate')),
                        React.createElement('input', {
                            type: 'text',
                            value: formData.Pincode,
                            onChange: (e) => setFormData(prev => ({ ...prev, Pincode: e.target.value })),
                            placeholder: t('leaveBlankAutoGenerate'),
                            style: {
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }
                        })
                    ),
                    
                    React.createElement('div', {},
                        React.createElement('label', {
                            style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                        }, t('timerMinutes')),
                        React.createElement('input', {
                            type: 'number',
                            min: '5',
                            max: '60',
                            value: formData.timer.duration,
                            onChange: (e) => setFormData(prev => ({
                                ...prev,
                                timer: { ...prev.timer, duration: parseInt(e.target.value) || 15 }
                            })),
                            style: {
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }
                        })
                    )
                ),
                
                // 订单信息
                React.createElement('div', {
                    style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }
                },
                    React.createElement('div', {},
                        React.createElement('label', {
                            style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                        }, t('currentMenu')),
                        React.createElement('input', {
                            type: 'text',
                            value: formData.orders.menu,
                            onChange: (e) => setFormData(prev => ({
                                ...prev,
                                orders: { ...prev.orders, menu: e.target.value }
                            })),
                            style: {
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }
                        })
                    ),
                    
                    React.createElement('div', {},
                        React.createElement('label', {
                            style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                        }, t('totalPriceEuro')),
                        React.createElement('input', {
                            type: 'number',
                            step: '0.01',
                            min: '0',
                            value: formData.orders.totaalPrijs,
                            onChange: (e) => setFormData(prev => ({
                                ...prev,
                                orders: { ...prev.orders, totaalPrijs: parseFloat(e.target.value) || 0 }
                            })),
                            style: {
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }
                        })
                    )
                ),
                
                // URL显示
                formData.TableOrder && React.createElement('div', {
                    style: { marginBottom: '1rem' }
                },
                    React.createElement('label', {
                        style: { display: 'block', marginBottom: '0.5rem', fontWeight: '500' }
                    }, t('qrLinkAutoGenerate')),
                    React.createElement('input', {
                        type: 'text',
                        value: formData.URL || `${window.location.origin}/bestel.html?tafel=${formData.TableOrder}`,
                        readOnly: true,
                        style: {
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            background: '#f8f9fa',
                            fontSize: '0.9rem'
                        }
                    })
                ),
                
                // 按钮
                React.createElement('div', {
                    style: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' }
                },
                    React.createElement('button', {
                        type: 'button',
                        onClick: onClose,
                        style: {
                            padding: '10px 20px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            background: 'white',
                            cursor: 'pointer'
                        }
                    }, t('cancel')),
                    React.createElement('button', {
                        type: 'submit',
                        style: {
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }
                    }, t('save'))
                )
            )
        )
    );
}

// 模块化版本的主应用
function RestaurantManagementApp() {
    return React.createElement(window.LanguageProvider, null,
        React.createElement(RestaurantManagementConsoleFull)
    );
}

// 导出完整版本
window.RestaurantManagementConsole = RestaurantManagementApp;
