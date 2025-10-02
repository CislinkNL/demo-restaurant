
// Define your other functions and variables below...
// const DATABASE_PATH = 'Kokohili/menukaart'; //修改这个数据库路径，不同的餐厅有不同的以餐厅命名的路径

class Order {

    constructor() {
        this._menu = [];
        this._order = [];
        this._payment = {}; // Initialize payment object if needed
    this._orderInitialized = false; // 用于避免首次加载时的批量提示
    this._menuBootstrapped = false; // 防止首次监听重复加载
    this._initialBadgesSynced = false; // 首屏角标是否已成功同步

    // 暴露全局引用 & 兼容旧函数名（其它脚本可用）
    if (!window.__orderInstance) {
        window.__orderInstance = this;
    }
    if (!window.updateQuantityLabelsFromFirebase) {
        window.updateQuantityLabelsFromFirebase = () => {
            try {
                if (window.__orderInstance) {
                    updateQuantityLabels(window.__orderInstance._order);
                }
            } catch (e) {
                console.warn('updateQuantityLabelsFromFirebase 调用失败', e);
            }
        };
    }
    }

    get menu() {
        return this._menu;
    }

    setOrder(newOrderArray) {
        try {
            if (Array.isArray(newOrderArray)) {
                // ✅ SKU错误防护 - 验证整个订单数组
                if (window.SKUGuard) {
                    this._order = window.SKUGuard.validateOrderArray(newOrderArray);
                } else {
                    this._order = newOrderArray;
                }
            } else {
                console.error("Invalid order data. Expected an array.");
                this._order = [];
            }
        } catch (error) {
            console.error("设置订单时出错:", error);
            this._order = [];
        }
    }
    set menu(menuArray) {
        try {
            this._menu = []; // Clear current menu

            console.log('🍽️ Setting menu with', menuArray.length, 'items');

            // ✅ SKU错误防护 - 验证菜单数组
            let validatedMenuArray = menuArray;
            if (window.SKUGuard) {
                validatedMenuArray = window.SKUGuard.validateMenuArray(menuArray);
            }

            validatedMenuArray.forEach(menuItem => {
                let hasOptions = menuItem.hasOptions || (menuItem.options && Object.keys(menuItem.options).length > 0);
                let optionsData = menuItem.options || {};

                // ✅ 直接使用从loadMenuFromFirebase传来的已处理价格
                let displayPrice = menuItem.price || 0;
                
                // 如果价格为零，则不显示价格（可通过设置priceDisplay字段控制前端渲染）
                let priceDisplay = (typeof displayPrice === 'number' && displayPrice > 0) ? displayPrice : '';
                
                let currItem = {
                    sku: menuItem.sku,
                    description: menuItem.description,
                    displayName: `${menuItem.sku} - ${menuItem.description}`,
                    price: priceDisplay,
                    originalPrice: menuItem.originalPrice || displayPrice, // 保存原价
                    taxRate: menuItem.taxRate,
                    image: menuItem.image,
                    id: menuItem.id || menuItem.sku,
                    group: menuItem.group,
                    allergy: menuItem.allergy,
                    status: menuItem.status,
                    hasOptions: hasOptions, // ✅ Ensures it's true if options exist
                    options: optionsData, // ✅ Sets the options array
                    reason: menuItem.reason, // ✅ Include reason if available
                    priceAllinDranks: menuItem.priceAllinDranks, // ✅ 保留原始标记
                };

                this._menu.push(currItem);
            });

            console.log("Final Menu Data:", this._menu);
        } catch (error) {
            console.error('设置菜单时出错:', error);
            this._menu = [];
        }
    }





    get order() {
        return this._order;
    }

    get payment() {
        return this._payment;
    }

    set payment(payment) {
        this._payment = payment;
    }


    //等待app配置加载完成
    async waitForAppConfig() {
        while (!window.AppConfig?.configReady) {
            await new Promise(resolve => setTimeout(resolve, 50)); // 每 50ms 检查一次
        }
    }


    async authenticate() {

        await this.waitForAppConfig(); // ✅ 等待 AppConfig 加载完成

        const PythonAuthUrl = window.AppConfig?.pythonAuth;

        if (!PythonAuthUrl) {
            console.error("Missing 'pythonAuth' URL in AppConfig.");
            return;
        }

        try {
            const response = await fetch(PythonAuthUrl, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Failed to authenticate with the backend: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.token) {
                await firebase.auth().signInWithCustomToken(data.token);
                console.log("✅ Authenticated with custom token");
            } else {
                throw new Error("No token received from backend");
            }
        } catch (error) {
            console.error("Authentication error:", error.message);
        }
    }

    // 统一处理 tafelId，确保路径一致
    _getNormalizedTafelId(raw) {
        if (!raw) return '';
        return raw.startsWith('Tafel-') ? raw : `Tafel-${raw}`;
    }

    // ====== Key 规范工具（来自 Kokohili 版本，做轻量适配） ======
    safeKey(raw) {
        return String(raw ?? '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[.#$\[\]\/\u0000-\u001F\u007F]/g, '-')
            .replace(/-+/g, '-');
    }

    optionsKeyFrom(options) {
        if (!options || typeof options !== 'object') return 'default';
        const pairs = Object.entries(options)
            .filter(([k, v]) => v !== undefined && v !== null && v !== '')
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${this.safeKey(k)}:${this.safeKey(typeof v === 'object' ? JSON.stringify(v) : v)}`);
        return pairs.length ? pairs.join('|') : 'default';
    }

    _buildLineKey(sku, optionsObj) {
        const base = this.safeKey(sku);
        const opts = this.optionsKeyFrom(optionsObj || {});
        const rawKey = `${base}__${opts}`; // 与旧格式保持基本兼容：sku__k:v|k2:v2
        return rawKey.replace(/[^A-Za-z0-9_:\-|]/g, '_').substring(0, 180);
    }

    // 从lineKey中提取原始SKU，去除设备ID和选项后缀
    _extractSkuFromLineKey(lineKey) {
        if (!lineKey || typeof lineKey !== 'string') {
            return lineKey;
        }
        
        // lineKey格式通常是: sku__options
        // 我们需要提取sku部分
        const parts = lineKey.split('__');
        if (parts.length > 0) {
            return parts[0]; // 返回第一部分作为原始SKU
        }
        return lineKey;
    }

    // (Deprecated) _scheduleBadgeSync replaced by BadgeManager.scheduleInitial



    async loadMenuFromFirebase() {
        const restName = window.AppConfig?.restName || 'asianboulevard';
    const rawTafelId = window.AppConfig?.tafelId;
    const tafelId = this._getNormalizedTafelId(rawTafelId);

        if (!restName || !tafelId) {
            console.error("Missing restName or tafelId in AppConfig.");
            return;
        }

    const MENU_DATABASE_PATH = `${restName}/menukaart`;
    const EXCEPTIONS_PATH = `${restName}/menukaart/exceptions`;
    const ORDER_DATABASE_PATH = `${restName}/tafel/${tafelId}/orders/orderlist`;
    const ORDER_NUMBER_PATH = `${restName}/tafel/${tafelId}/orders/orderNumbers`;
    const SERVER_ACCESS_PATH = `${restName}/server_access`;
    const DINNER_ONLY_PATH = `${restName}/dinnerOnlyDishes`;
    const TABLE_PATH = `${restName}/tafel/${tafelId}`;
    console.log('[loadMenuFromFirebase] Using paths:', { MENU_DATABASE_PATH, ORDER_DATABASE_PATH });

        const db = firebase.database();
        const menuRef = db.ref(MENU_DATABASE_PATH);
        const exceptionsRef = db.ref(EXCEPTIONS_PATH);
        const orderRef = db.ref(ORDER_DATABASE_PATH);
        const orderNumRef = db.ref(ORDER_NUMBER_PATH);
        const serverAccessRef = db.ref(SERVER_ACCESS_PATH);
        const dinnerOnlyRef = db.ref(DINNER_ONLY_PATH);
        const tableRef = db.ref(TABLE_PATH);

        try {
            // ✅ 验证 server_access
            const serverAccessSnapshot = await serverAccessRef.once("value");
            const serverAccess = serverAccessSnapshot.val();

            if (serverAccess !== "Time9changeit") {
                console.error("Access denied: server_access is invalid.");
                showNotification('Toegang tot het menu is beperkt. Neem contact op met de ondersteuning.', 'error', 6000);
                return;
            }

            // ✅ 获取 all-in met dranken 状态
            const ALL_IN_MET_PATH = `${restName}/tafel/${tafelId}/orders/all_in_met`;
            const allInMetRef = db.ref(ALL_IN_MET_PATH);
            const allInMetSnapshot = await allInMetRef.once("value");
            const allInMet = allInMetSnapshot.val() || false;
            
            console.log("🍷 All-in met dranken status:", allInMet);

            // 读取当前桌台信息
            const tableSnapshot = await tableRef.once("value");
            const tableData = tableSnapshot.val();
            const menuType = tableData?.menuType || "dinner";

            // 获取 dinnerOnly SKU 列表（全部转为字符串，确保类型一致）
            const dinnerSkusSnapshot = await dinnerOnlyRef.once("value");
            const dinnerOnlySkus = dinnerSkusSnapshot.exists() ? Object.keys(dinnerSkusSnapshot.val()).map(String) : [];
            


            // ✅ 获取 exceptions 列表（也转为字符串确保一致性）
            const exceptionsSnapshot = await exceptionsRef.once("value");
            const exceptionsData = exceptionsSnapshot.val();
            const exceptionSkus = exceptionsData ? Object.keys(exceptionsData).map(String) : [];
            console.log("Fetched exceptions:", exceptionSkus);

            // ✅ 获取菜单数据
            const menuSnapshot = await menuRef.once("value");
            const menuData = menuSnapshot.val();

            if (menuData) {
                const itemsArray = Object.keys(menuData)
                    .map((sku) => {
                        let menuItem = menuData[sku];
                        
                        // ✅ SKU错误防护 - 验证菜单项
                        if (window.SKUGuard) {
                            try {
                                menuItem = window.SKUGuard.validateMenuItem({...menuItem, sku});
                                if (!menuItem || menuItem.sku === window.SKUGuard.fallbackSKU) {
                                    console.warn(`跳过无效菜单项: ${sku}`);
                                    return null;
                                }
                            } catch (error) {
                                console.error(`SKU验证失败: ${sku}`, error);
                                return null;
                            }
                        }
                        
                        let optionsData = menuItem.options || {};

                        let hasOptions = menuItem.hasOptions !== undefined
                            ? menuItem.hasOptions
                            : Object.keys(optionsData).length > 0;

                        // ✅ 全局价格转换逻辑 - 应用于所有商品类别
                        let finalPrice = parseFloat(menuItem.price) || 0;
                        let originalPrice = finalPrice;

                        if (allInMet && menuItem.priceAllinDranks) {
                            switch (menuItem.priceAllinDranks) {
                                case "free":
                                    finalPrice = 0;
                                    console.log(`🆓 ${menuItem.description}: All-in 免费 (${originalPrice}€ -> 0€)`);
                                    break;
                                case "half":
                                    finalPrice = originalPrice * 0.5;
                                    console.log(`💰 ${menuItem.description}: All-in 半价 (${originalPrice}€ -> ${finalPrice.toFixed(2)}€)`);
                                    break;
                                case "normal":
                                default:
                                    finalPrice = originalPrice;
                                    console.log(`💲 ${menuItem.description}: All-in 正常价 (${finalPrice}€)`);
                                    break;
                            }
                        }

                        return {
                            ...menuItem,
                            sku: String(sku), // ✅ 统一转换为字符串
                            group: menuItem.group || "unknown",
                            hasOptions: hasOptions,
                            options: optionsData,
                            price: finalPrice, // ✅ 使用转换后的价格
                            originalPrice: originalPrice, // ✅ 保存原价以供参考
                            priceAllinDranks: menuItem.priceAllinDranks, // ✅ 保留原始标记
                            // 生成显示名称：编号 + 名称
                            displayName: `${sku} ${menuItem.description || 'Geen naam'}`
                        };
                    })
                    .filter((item) => {
                        const isAvailable = item.status === "beschikbaar";
                        if (!isAvailable) return false;

                        // ✅ 基于 exceptions 下的 reason 字段的动态过滤逻辑
                        const currentDay = new Date().getDay();
                        const isWeekend = (currentDay >= 5 || currentDay === 0); // Friday=5, Saturday=6, Sunday=0
                        
                        // 从 exceptions 数据中获取该 SKU 的 reason 字段
                        const exceptionData = exceptionsData && exceptionsData[item.sku];
                        const reason = exceptionData?.reason || ""; // 获取 exceptions 下的 reason 字段，默认为空字符串
                        
                        console.log(`SKU ${item.sku}: reason = "${reason}"`); // 调试日志

                        if (isWeekend) {
                            // 周末 (周五/周六/周日): 显示包含 "weekend" 的套餐 OR 不包含 "doordeweeks" 的通用套餐
                            return reason.includes("weekend") || !reason.includes("doordeweeks");
                        } else {
                            // 工作日 (周一-周四): 显示包含 "doordeweeks" 的套餐 OR 不包含 "weekend" 的通用套餐
                            return reason.includes("doordeweeks") || !reason.includes("weekend");
                        }
                    });

                itemsArray.sort((a, b) => a.sortingNrm - b.sortingNrm);

                this.menu = itemsArray;
                console.log("✅ 加载的菜单数据:", itemsArray);
            } else {
                console.warn("No menu data available in Firebase for this restaurant.");
            }

            // ✅ 渲染菜单 UI
            Ui.menu(this);

            // ✅ 获取订单数据
            const orderSnapshot = await orderRef.once("value");
            const orderData = orderSnapshot.val();

        if (orderData) {
        console.log('[loadMenuFromFirebase] orderlist snapshot keys:', Object.keys(orderData).length);
                const orderArray = Array.isArray(orderData)
                    ? orderData
                    : Object.keys(orderData).map((key) => ({
                        description: orderData[key].description || "No description",
                        originalDescription: orderData[key].originalDescription || orderData[key].description || "No description", // 加载原始描述
                        quantity: orderData[key].quantity || 0,
                        price: parseFloat(orderData[key].price) || "",
                        group: orderData[key].group || "unknown",
                        allergy: orderData[key].allergy || "",
                        taxRate: parseFloat(orderData[key].taxRate) || 0, // ensure taxRate present to avoid NaN in summary
            sku: orderData[key].sku || this._extractSkuFromLineKey(key), // 使用正确的SKU
            lineKey: key // ✅ 保持与实时监听使用的 lineKey 一致
                    }));

                this._order = orderArray;
                Ui.receiptDetails(this);
                Ui.summary(this); // ✅ 初次加载时立即计算与显示汇总
                if (window.BadgeManager) {
                    window.BadgeManager.scheduleInitial(this._order, ()=> { this._initialBadgesSynced = true; });
                } else {
                    if (window.BadgeManager) { window.BadgeManager.update(this._order); } else { updateQuantityLabels(this._order); }
                    this._initialBadgesSynced = true;
                }
            } else {
                console.log("No orders found for the current table.");
                this._order = [];
                Ui.receiptDetails(this);
                Ui.summary(this); // ✅ 空订单也刷新汇总（清空显示）
                if (window.BadgeManager) {
                    window.BadgeManager.scheduleInitial(this._order, ()=> { this._initialBadgesSynced = true; });
                } else {
                    if (window.BadgeManager) { window.BadgeManager.update(this._order); } else { updateQuantityLabels(this._order); }
                    this._initialBadgesSynced = true;
                }
            }
        } catch (error) {
            console.error("Error fetching menu or order data from Firebase:", error);
        }
    }







    async setupRealtimeListeners() {
        // ✅ 清除之前的监听器以防止重复
        if (this._activeListeners) {
            console.log('🧹 清除之前的 Firebase 监听器...');
            this._activeListeners.forEach(ref => {
                try {
                    ref.off();
                } catch (error) {
                    console.warn('清除监听器时出错:', error);
                }
            });
            this._activeListeners = [];
        } else {
            this._activeListeners = [];
        }
        
        const RestNameUrl = window.AppConfig?.restName || 'asianboulevard';
    const rawTafelId = window.AppConfig?.tafelId;
    const tafelId = this._getNormalizedTafelId(rawTafelId);
        if (!RestNameUrl || !tafelId) {
            console.error("Missing restName or tafelId in AppConfig.");
            return;
        }
    const MENU_DATABASE_PATH = `${RestNameUrl}/menukaart`;
        const databasePath = `/${RestNameUrl}/tafel/${tafelId}`;
        console.log(`Setting up real-time listener for path: ${databasePath} (台号: ${tafelId})`);

        // Setup a real-time listener on the `/tafel` path
        const tafelIdRef = firebase.database().ref(databasePath);
        try {
            // Authenticate the user
            await this.authenticate();
        } catch (error) {
            console.error("Failed to authenticate. Cannot load menu:", error);
            return;
        }


        const db = firebase.database();
        // Initialize debounce timeout variable
        let debounceTimeout;

        const menuRef = db.ref(MENU_DATABASE_PATH);

    // ✅ 先进行一次即时加载，确保页面初次打开就显示 orderlist
        try {
            await this.loadMenuFromFirebase();
            this._menuBootstrapped = true; // 标记已手动完成首次加载
        } catch (e) {
            console.error('Initial loadMenuFromFirebase failed:', e);
        }

        // ✅ Add a single listener to the entire `menukaart` node and track it
        menuRef.on('value', async (snapshot) => {
            // 首次 listener 触发：我们已经在 setupRealtimeListeners 里主动加载过菜单与订单，这里直接跳过，避免重复清空 DOM 导致角标闪一下后消失。
            if (this._menuBootstrapped) {
                console.log('[menuRef] Skip initial value event (already bootstrapped)');
                this._menuBootstrapped = false; // 复位，允许后续真实更新
                return;
            }

            console.log('[menuRef] Firebase menu value change detected; scheduling reload');

            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(async () => {
                console.log('[menuRef] Debounced reload executing');
                // 清空旧菜单
                this.menu = [];
                const menuContainer = document.getElementById('menu');
                if (menuContainer) {
                    menuContainer.innerHTML = '';
                    console.log('[menuRef] Menu container cleared');
                }
                // 重新加载（内部会在加载完成后安全同步角标）
                await this.loadMenuFromFirebase();
                console.log('[menuRef] Menu reloaded');
                showNotification('Menukaart is bijgewerkt.', 'info', 3000);
            }, 200);
        });
        this._activeListeners.push(menuRef); // Track this listener



        // ✅ Listen for changes to the children of the specified table ID and track it
        tafelIdRef.on('child_changed', (snapshot) => {
            const key = snapshot.key; // Changed field key (e.g., Status or Pincode)
            const data = snapshot.val(); // New value of the field

            console.log(`Key changed: ${key}, New Value: ${data}`);

            // Handle status updates
            if (key === 'Status' && data) {
                const statusInput = document.querySelector('input[name="status"]'); // Input element for Status
                const tafelStatusElement = document.getElementById("tafelStatus");

                if (statusInput) {
                    statusInput.value = data; // Update the input's value with the Status data
                    console.log(`Input 'status' updated to: ${data}`);
                }

                if (tafelStatusElement) {
                    tafelStatusElement.innerText = `${tafelId} is ${data}`;
                    console.log(`Tafel status updated to: ${tafelId} is ${data}`);
                }
                if (data === "afgesloten") {
                    showNotification(`Tafel is afgesloten`, "error", 5000);
                }
                if (data === 'open') {
                    showNotification(`Tafel is nu open`, "success", 5000);
                }
            }

            // Handle pincode updates
            if (key === 'Pincode' && data) {
                const pincodeInput = document.querySelector('input[name="pincode"]'); // Input element for Pincode

                if (pincodeInput) {
                    pincodeInput.value = data; // Update the input's value with the Pincode data
                    showNotification(`Uw pincode is - ${data}`, "info", 5000);
                    console.log(`Input 'pincode' updated to: ${data}`);
                } else {
                    showNotification(`Tafel pincode is gewijzigd`, "info", 15000);
                }
            }


            // Handle pincode updates
            if (key === 'Persons' && data) {

                const personenInput = document.getElementById('aantal_pers'); // Input element for Pincode

                if (personenInput) {
                    personenInput.innerText = data; // Update the input's value with the Pincode data
                    showNotification(`Het aantal personen is aangepast naar ${data} personen.`, "info", 5000);
                    console.log(`Input 'pincode' updated to: ${data}`);
                } else {
                    showNotification(`Het aantal personen is aangepast naar ${data} personen.`, "info", 15000);
                }

            }
        });
        this._activeListeners.push(tafelIdRef); // Track this listener

        const ORDER_DATABASE_PATH = `${RestNameUrl}/tafel/${tafelId}/orders/orderlist`;
        const orderRef = db.ref(ORDER_DATABASE_PATH);


        let isUpdatingFromListener = false; // Flag to track listener updates

    // ✅ Listen for order changes and track the listener
    orderRef.on('value', async (snapshot) => {
            isUpdatingFromListener = true;
            const currentOrder = [...this._order];
            if (snapshot.exists()) {
                const orderArray = [];
                snapshot.forEach(child => {
                    const v = child.val() || {};
                    orderArray.push({
                        lineKey: child.key,
                        sku: v.sku || this._extractSkuFromLineKey(child.key), // 从lineKey中提取原始SKU
                        description: v.description || 'No description',
                        originalDescription: v.originalDescription || v.description || 'No description', // 包含原始描述
                        quantity: v.quantity || 0,
                        price: parseFloat(v.price) || 0,
                        group: v.group || 'unknown',
                        allergy: v.allergy || '',
                        options: v.options || {},
                        taxRate: v.taxRate || 0,
                        subtotal: v.subtotal || 0,
                        taxAmount: v.taxAmount || 0
                    });
                });
                // Detect removals
                currentOrder.forEach(item => {
                    const stillThere = orderArray.find(n => n.lineKey === item.lineKey);
                    if (!stillThere) {
                        showNotification(`${item.description} is verwijderd uit de lijst`, 'removeFoodInfo', 2000);
                    }
                });
                const changed = JSON.stringify(this._order) !== JSON.stringify(orderArray);
                if (changed) {
                    // 构建旧行映射 (lineKey -> line)
                    const prevMap = {};
                    currentOrder.forEach(l => { if (l.lineKey) prevMap[l.lineKey] = l; });

                    this._order = orderArray;
                    Ui.receiptDetails(this);
                    setTimeout(() => {
                        if (this._initialBadgesSynced) {
                            if (window.BadgeManager) {
                                window.BadgeManager.update(this._order);
                            } else {
                                if (window.BadgeManager) { window.BadgeManager.update(this._order); } else { updateQuantityLabels(this._order); }
                            }
                        } else {
                            if (window.BadgeManager) {
                                window.BadgeManager.scheduleInitial(this._order, ()=> { this._initialBadgesSynced = true; });
                            } else {
                                if (window.BadgeManager) { window.BadgeManager.update(this._order); } else { updateQuantityLabels(this._order); }
                                this._initialBadgesSynced = true;
                            }
                        }
                    }, 50);

                    // 首次加载不弹成功提示
                    if (this._orderInitialized) {
                        orderArray.forEach(line => {
                            const prev = line.lineKey ? prevMap[line.lineKey] : undefined;
                            if (!prev) {
                                // 新增行
                                showNotification(`${line.description} x ${line.quantity} toegevoegd`, 'addFoodInfo', 2000);
                            } else if (line.quantity > prev.quantity) {
                                const delta = line.quantity - prev.quantity;
                                if (delta > 0) {
                                    showNotification(`${line.description} +${delta} (totaal ${line.quantity})`, 'addFoodInfo', 2000);
                                }
                            }
                        });
                    } else {
                        this._orderInitialized = true;
                    }
                }
            } else {
                if (this._order.length) {
                    this._order = [];
                    Ui.receiptDetails(this);
                    setTimeout(() => {
                        if (window.BadgeManager) {
                            window.BadgeManager.update(this._order);
                        } else {
                            if (window.BadgeManager) { window.BadgeManager.update(this._order); } else { updateQuantityLabels(this._order); }
                        }
                    }, 50);
                }
            }
            isUpdatingFromListener = false;
        });
        this._activeListeners.push(orderRef); // Track this listener





        const ORDER_Number_PATH = `${RestNameUrl}/tafel/${tafelId}/orders/orderNumbers`;
        const orderNumberRef = db.ref(ORDER_Number_PATH);

        // ✅ Listen for changes to the order number and track the listener
        orderNumberRef.on('value', snapshot => {
            const newOrderNumber = snapshot.val();
            if (newOrderNumber !== null) {
                // Update the div on the page
                document.getElementById('lastInvoiceNum').innerText = newOrderNumber;
                document.getElementById('invoice-number').textContent = `Bestel#  ${newOrderNumber}`;
                console.log(`📋 Order number updated to ${newOrderNumber} for 台号: ${tafelId}`);
            }
        });
        this._activeListeners.push(orderNumberRef); // Track this listener

        const refreshPath = `${RestNameUrl}/refresh/`;
        const refreshRef = db.ref(refreshPath);

        // Get the URL to refresh from an element on the page
        const refreshUrl = document.getElementById("refreshURL").innerText.trim();

        // ✅ Subscribe to value changes (listener remains active) and track the listener
        refreshRef.on('value', (snapshot) => {
            console.log("Snapshot received:", snapshot);

            // Check if snapshot exists and has a valid value

            const refreshValue = snapshot.val();
            console.log("Refresh Value:", refreshValue);

            // Trigger refresh only if value is 1 and hasn't already been reloaded in this session
            if (refreshValue === 1) {
                console.log("Refreshing page to:", refreshUrl);


                // Reset the refresh value in Firebase
                refreshRef.set(0).then(() => {
                    console.log("Refresh value reset successfully.");
                    // Redirect to the specified URL
                    window.location.href = refreshUrl;
                }).catch((error) => {
                    console.error("Error resetting refresh value:", error);
                });
            }

        });
        this._activeListeners.push(refreshRef); // Track this listener
        
        // ✅ 监听 orders/all_in_met 标志变化
        const ALL_IN_MET_PATH = `${RestNameUrl}/tafel/${tafelId}/orders/all_in_met`;
        const allInMetRef = db.ref(ALL_IN_MET_PATH);
        
        let allInMetDebounceTimeout;
        let isInitialAllInMetLoad = true;
        
        allInMetRef.on('value', (snapshot) => {
            const allInMet = snapshot.val();
            console.log("🍷 All-in met dranken flag changed:", allInMet);
            
            // 跳过初始加载事件，避免重复渲染
            if (isInitialAllInMetLoad) {
                console.log("🍷 Skipping initial all_in_met load event");
                isInitialAllInMetLoad = false;
                return;
            }
            
            // 清除之前的防抖定时器
            clearTimeout(allInMetDebounceTimeout);
            
            // 使用防抖机制，避免频繁重新加载
            allInMetDebounceTimeout = setTimeout(async () => {
                console.log("🍷 All-in status changed, updating menu prices...");
                
                // 显示更新通知
                showNotification(
                    allInMet ? 'All-in menu ingeschakeld, prijzen bijgewerkt' : 'All-in menu uitgeschakeld, prijzen bijgewerkt', 
                    'info', 
                    3000
                );
                
                // 清空当前菜单显示
                const menuContainer = document.getElementById('menu');
                if (menuContainer) {
                    menuContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Menu prijzen worden bijgewerkt...</div>';
                }
                
                try {
                    // 重新加载菜单以更新价格显示
                    await this.loadMenuFromFirebase();
                    console.log("✅ Menu prices updated successfully for all-in status:", allInMet);
                } catch (error) {
                    console.error("❌ Failed to update menu prices:", error);
                    showNotification('Menu prijs bijwerken mislukt, ververs de pagina', 'error', 5000);
                }
            }, 300); // 300ms 防抖延迟
        });
        this._activeListeners.push(allInMetRef); // Track this listener
        
        // ✅ 监听菜单类型变化
        const MENU_TYPE_PATH = `${RestNameUrl}/tafel/${tafelId}/menuType`;
        const menuTypeRef = db.ref(MENU_TYPE_PATH);
        
        let menuTypeDebounceTimeout;
        let isInitialMenuTypeLoad = true;
        
        menuTypeRef.on('value', (snapshot) => {
            const menuType = snapshot.val() || 'dinner';
            console.log("🍽️ Menu type flag changed:", menuType);
            
            // 跳过初始加载事件，避免重复渲染
            if (isInitialMenuTypeLoad) {
                console.log("🍽️ Skipping initial menuType load event");
                isInitialMenuTypeLoad = false;
                return;
            }
            
            // 清除之前的防抖定时器
            clearTimeout(menuTypeDebounceTimeout);
            
            // 使用防抖机制，避免频繁重新加载
            menuTypeDebounceTimeout = setTimeout(async () => {
                console.log("🍽️ Menu type changed, reloading menu...");
                
                // 移除notification，因为已经有toast显示了
                
                // 清空当前菜单显示
                const menuContainer = document.getElementById('menu');
                if (menuContainer) {
                    menuContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Menu wordt bijgewerkt...</div>';
                }
                
                try {
                    // 重新加载菜单以更新显示的菜品
                    await this.loadMenuFromFirebase();
                    console.log("✅ Menu reloaded successfully for menu type:", menuType);
                } catch (error) {
                    console.error("❌ Failed to reload menu for menu type:", error);
                    showNotification('Menu bijwerken mislukt, ververs de pagina', 'error', 5000);
                }
            }, 300); // 300ms 防抖延迟
        });
        this._activeListeners.push(menuTypeRef); // Track this listener
        
        console.log("✅ Real-time listener for order list set up successfully.");
    }






    addOrderLine(quantity, description, group, allergy, sku, price, selectedOptions, originalDescription = null) {
        // New concurrency-safe transactional implementation
        const menuItem = this.menu.find(item => item.sku.toString() === sku.toString());
        if (!menuItem) {
            console.error(`Menu item not found for SKU: ${sku}`);
            return;
        }
        
        // 套餐价格计算 - 确保使用正确的价格
        let effectivePrice = parseFloat(price) || parseFloat(menuItem.price) || 0;
        
        // 获取当前套餐类型
        let packageType = 'normal';
        try {
            const packageTypeElement = document.getElementById('packageType');
            if (packageTypeElement) {
                packageType = packageTypeElement.innerText.trim() || 'normal';
            }
        } catch (e) {
            console.log('addOrderLine: 套餐类型获取失败，使用默认值:', e.message);
        }
        
        // 对饮料在All-in套餐中应用特殊定价
        if (group === 'geen' && packageType === 'allin' && menuItem.priceAllinDranks) {
            const originalPrice = parseFloat(menuItem.originalPrice) || effectivePrice;
            switch (menuItem.priceAllinDranks) {
                case 'free':
                    effectivePrice = 0;
                    console.log(`🛒 ${description}: 套餐免费添加 (原价${originalPrice}€ -> 0€)`);
                    break;
                case 'half':
                    effectivePrice = originalPrice * 0.5;
                    console.log(`🛒 ${description}: 套餐半价添加 (原价${originalPrice}€ -> ${effectivePrice.toFixed(2)}€)`);
                    break;
                case 'normal':
                default:
                    effectivePrice = originalPrice;
                    console.log(`🛒 ${description}: 套餐正常价添加 (${effectivePrice}€)`);
                    break;
            }
        }
        
        const taxRate = parseFloat(menuItem.taxRate) || 0;
        const unitPrice = effectivePrice;
        const normalizedOptions = selectedOptions || {};

    // 使用标准化 key 生成规则（稳定、排序、避免非法字符）
    const safeKey = this._buildLineKey(sku, normalizedOptions);

        const restName = AppConfig?.restName || 'asianboulevard';
        const tafelId = `Tafel-${document.getElementById("tafelNummer").innerText.trim()}`;
        if (!restName || !tafelId) {
            console.error('Missing restName or tafelId for transaction.');
            return;
        }
        const lineRef = firebase.database().ref(`/${restName}/tafel/${tafelId}/orders/orderlist/${safeKey}`);

        // Pre-calc intended delta (support negative for future use)
        const delta = quantity;
        if (delta === 0) return;

                // Pre-check limits (best-effort, may still race but reduces violations)
                // hoofdgerechten = groep1 + 2*groep4, desserts = groep3
                const parsePosInt = (s) => {
                    const n = parseInt(s, 10);
                    return Number.isFinite(n) && n >= 0 ? n : null;
                };
                const etenEl = document.getElementById('limiet_eten');
                const dessertEl = document.getElementById('limiet_dessert');
                const personsEl = document.getElementById('aantal_pers');
                const persons = parsePosInt(personsEl?.innerText) ?? 1;
                const etenPer  = parsePosInt(etenEl?.innerText);
                const desPer   = parsePosInt(dessertEl?.innerText);
                const etenLimitTotal    = etenPer == null ? Infinity : etenPer * persons;
                const dessertLimitTotal = desPer  == null ? Infinity : desPer  * persons;

        // Compute projected counts from current in-memory order
        const currentHoofd = this._order.reduce((acc, l)=> acc + (l.group==='groep1'? l.quantity:0) + (l.group==='groep4'? l.quantity*2:0), 0);
        const currentDessert = this._order.reduce((acc, l)=> acc + (l.group==='groep3'? l.quantity:0), 0);
        const projectedHoofd = currentHoofd + (group==='groep1'? quantity:0) + (group==='groep4'? quantity*2:0);
        const projectedDessert = currentDessert + (group==='groep3'? quantity:0);
        if ((group==='groep1' || group==='groep4') && projectedHoofd > etenLimitTotal) {
            showNotification('Hoofdgerechten limiet bereikt', 'error', 4000); return; }
        if (group==='groep3' && projectedDessert > dessertLimitTotal) {
            showNotification('Desserts limiet bereikt', 'error', 4000); return; }

        lineRef.transaction(current => {
            if (current === null) {
                if (delta <= 0) return; // nothing to create
                return {
                    sku,
                    description,
                    originalDescription: originalDescription || description, // 保存原始荷兰语描述
                    quantity: delta,
                    price: unitPrice,
                    taxRate,
                    taxAmount: unitPrice * (taxRate / 100) * delta,
                    subtotal: unitPrice * delta,
                    group,
                    allergy,
                    options: normalizedOptions
                };
            } else {
                const newQty = (current.quantity || 0) + delta;
                if (newQty <= 0) {
                    // Remove line if quantity goes to zero
                    return null;
                }
                current.quantity = newQty;
                current.subtotal = unitPrice * newQty;
                current.taxAmount = current.subtotal * (taxRate / 100);
                return current;
            }
        }, (error, committed, snapshot) => {
            if (error) {
                console.error('❌ Transaction failed for line', safeKey, error);
                showNotification('Fout bij opslaan (concurrentie). Probeer opnieuw.', 'error', 4000);
                return;
            }
            if (!committed) {
                console.warn('⚠️ Transaction aborted (possibly limit check to add later)', safeKey);
                return;
            }
            const val = snapshot.val();
            console.log('✅ Transaction applied', safeKey, val);
            // Local optimistic merge (listener will reconcile authoritative state)
            const localIndex = this._order.findIndex(l => l.sku === sku && JSON.stringify(l.options||{}) === JSON.stringify(normalizedOptions));
            if (val) {
                if (localIndex === -1) {
                    this._order.push({
                        sku,
                        description,
                        originalDescription: originalDescription || description,
                        quantity: val.quantity,
                        price: val.price,
                        taxRate: val.taxRate,
                        taxAmount: val.taxAmount,
                        subtotal: val.subtotal,
                        group,
                        allergy,
                        options: normalizedOptions
                    });
                } else {
                    this._order[localIndex].quantity = val.quantity;
                    this._order[localIndex].subtotal = val.subtotal;
                    this._order[localIndex].taxAmount = val.taxAmount;
                }
            } else if (localIndex !== -1) {
                this._order.splice(localIndex, 1);
            }
            Ui.receiptDetails(this);
            Ui.summary(this);
            if (window.BadgeManager) {
                if (this._initialBadgesSynced) {
                    window.BadgeManager.update(this._order);
                } else {
                    window.BadgeManager.scheduleInitial(this._order, ()=> { this._initialBadgesSynced = true; });
                }
            } else {
                if (window.BadgeManager) { window.BadgeManager.update(this._order); } else { updateQuantityLabels(this._order); }
                this._initialBadgesSynced = true;
            }
        });
        Ui.summary(this);
        if (window.BadgeManager) {
            if (this._initialBadgesSynced) {
                window.BadgeManager.update(this._order);
            } else {
                window.BadgeManager.scheduleInitial(this._order, ()=> { this._initialBadgesSynced = true; });
            }
        } else {
            if (window.BadgeManager) { window.BadgeManager.update(this._order); } else { updateQuantityLabels(this._order); }
            this._initialBadgesSynced = true;
        }
    }






    // Helper function to display error messages
    displayErrorMessage(description, message) {
        showNotification(`${description} - ${message}`, "error", 4500);

    }

    // Helper function to display success messages
    displaySuccessMessage(description, currentTotals) {
        const message = `Totaal: ${currentTotals.newCombinedGroep1And4Total} hoofdgerechten, ${currentTotals.newGroep3Total} bijgerechten`;
        showNotification(message, "success", 4500);
        Ui.receiptDetails(this);
    if (window.BadgeManager) { window.BadgeManager.update(this._order); } else { updateQuantityLabels(this._order); }

    }

    // (Deprecated) syncWithFirebase/updateOrderInDatabase removed due to per-line transactions.

    calculateGroupTotals(group, description, quantity) {
        // Calculate the total quantity for groep1, excluding the current item (by description)
        const groep1Count = this._order
            .filter(item => item.group === 'groep1' && item.description !== description)
            .reduce((total, item) => total + item.quantity, 0);

        // Calculate the total quantity for groep3, excluding the current item (by description)
        const groep3Count = this._order
            .filter(item => item.group === 'groep3' && item.description !== description)
            .reduce((total, item) => total + item.quantity, 0);

        // Calculate the total quantity for groep4, excluding the current item (by description)
        const groep4Count = this._order
            .filter(item => item.group === 'groep4' && item.description !== description)
            .reduce((total, item) => total + item.quantity * 2, 0); // Count groep4 items as double

        // Determine new totals by adding the current quantity to the appropriate group
        const newGroep1Total = group === 'groep1' ? groep1Count + quantity : groep1Count;
        const newGroep3Total = group === 'groep3' ? groep3Count + quantity : groep3Count;
        const newGroep4Total = group === 'groep4' ? groep4Count + quantity * 2 : groep4Count;

        // Combined total for groep1 and groep4
        const newCombinedGroep1And4Total = newGroep1Total + newGroep4Total;

        // Debugging logs to verify totals
        console.log("Group Totals:", {
            groep1Count,
            groep3Count,
            groep4Count,
            newGroep1Total,
            newGroep3Total,
            newGroep4Total,
            newCombinedGroep1And4Total
        });

        // Return the new totals for all groups and the combined total for groep1 and groep4
        return {
            newGroep1Total,
            newGroep3Total,
            newGroep4Total,
            newCombinedGroep1And4Total
        };
    }










    triggerItemAddedBehavior(description, totalQuantity, totalAllowed, allergy) {
        // Get the clicked menu item by its description
        const menuItem = document.querySelector(`[data-description="${description}"]`);

        // Get the position of the clicked menu item
        const menuItemRect = menuItem.getBoundingClientRect();

        // Create a copy of the menu item's image
        const copyImg = menuItem.querySelector('.menu-img').cloneNode(true); // Clone the node with all attributes and child nodes

        // Add the 'copy' class to the copied image
        copyImg.classList.add('copy');

        // Set the initial position of the copied image to match the clicked menu item
        copyImg.style.top = `${menuItemRect.top - 20}px`;
        copyImg.style.left = `${menuItemRect.left}px`;

        // Append the copy to the body
        document.body.appendChild(copyImg);

        // After a brief delay, add a class to initiate the animation
        setTimeout(() => {
            copyImg.classList.add('animate');
        }, 50);

        // After the animation duration, remove the copy from the DOM
        setTimeout(() => {
            if (copyImg.parentNode) {
                copyImg.parentNode.removeChild(copyImg);
            }
        }, 500);

        // Locate the container where the messageBar will be placed
        const messageContainer = document.getElementById('message-container');
        messageContainer.style.display = 'block';

        // Remove any existing messageBar from the container
        const existingMessageBar = messageContainer.querySelector('#messageBar');
        if (existingMessageBar) {
            existingMessageBar.remove();
        }

        // Create a new message bar element
        const messageBar = document.createElement('div');
        messageBar.classList.add('message-bar');
        messageBar.id = 'messageBar';
        messageBar.style.whiteSpace = 'normal';
        messageBar.style.wordWrap = 'break-word';
        messageBar.style.overflowWrap = 'break-word';
        messageBar.style.maxWidth = '95vw'; // Limit the width to 80% of the viewport
        messageBar.style.margin = '0 auto'; // Center align the message bar

        // Conditionally set the innerHTML based on the provided parameters
        if (totalQuantity !== undefined && totalAllowed !== undefined) {
            messageBar.innerHTML = `<font color="white" size="2.5rem">${description}</font><br><font size="2.2rem">toegevoegd<br/> Totaal：</font> <font color="#9DC183" size="2.5rem">
        ${totalQuantity}/${totalAllowed}</font><br/>`;
            applyCustomTranslations();
        } else {
            messageBar.innerHTML = `<font color="white">${description}</font><br>is toegevoegd<br/>`;
            applyCustomTranslations();
        }

        // Append the new messageBar to the messageContainer
        messageContainer.appendChild(messageBar);

        // Ensure the message bar is shown by adding the 'show' class
        setTimeout(() => {
            messageBar.classList.add('show');
        }, 10); // Small delay to ensure the class is added after appending
        applyCustomTranslations();
        // Hide the message bar and container after 3.5 seconds
        setTimeout(() => {
            messageBar.classList.remove('show'); // Remove the 'show' class to trigger any fade-out effect
            setTimeout(() => {
                if (messageBar.parentNode) {
                    messageBar.remove();
                }
                // Check if there are no more children in the messageContainer before hiding it
                if (messageContainer.children.length === 0) {
                    messageContainer.style.display = 'none';
                }
            }, 500); // Adjust this delay to match the CSS transition duration for fading out
        }, 3500);

        const descriptionButton = document.getElementById('descriptionButton');
        if (descriptionButton) {
            descriptionButton.addEventListener('click', function () {
                const copyImgData = copyImg.src;
                const capturedAllergy = allergy;

                console.log("Allergy:", allergy);
                askQuestion(description, copyImgData, capturedAllergy); // Or pass whatever parameter is necessary
            });
        }
        ui.receiptDetails(this);
    if (window.BadgeManager) { window.BadgeManager.update(this._order); } else { updateQuantityLabels(this._order); }
        // For demonstration purposes, let's log it to the console
        console.log(`"${description}" is toegevoegd`);

    }


    triggerItemNotAddedBehavior(description) {
        // Get the clicked menu item by its description
        const menuItem = document.querySelector(`[data-description="${description}"]`);

        // Get the position of the clicked menu item
        const menuItemRect = menuItem.getBoundingClientRect();

        // Create a copy of the menu item's image
        const copyImg = menuItem.querySelector('.menu-img').cloneNode();

        // Add the 'copy' class to the copied image
        copyImg.classList.add('copy');

        // Set the initial position of the copied image to match the clicked menu item
        copyImg.style.top = `${menuItemRect.top - 20}px`;
        copyImg.style.left = `${menuItemRect.left}px`;

        // Append the copy to the body
        document.body.appendChild(copyImg);

        // After a brief delay, add a class to initiate the animation
        setTimeout(() => {
            copyImg.classList.add('animate');
        }, 50); // A short delay to allow for positioning before starting the animation

        // After the animation duration, remove the copy from the DOM
        setTimeout(() => {
            copyImg.parentNode.removeChild(copyImg);
        }, 500); // 500 milliseconds is the duration of the animation

        // Create a new message bar element
        const messageBar = document.createElement('div');
        messageBar.classList.add('message-bar-notAdd');
        messageBar.innerHTML = `<br/> <span style="color: #FF0000;
        background-color: #222; text-align: center; font-size: 1.3rem;
         display: block; padding: 5px;">Toevoegen mislukt:</span><br/><span style="color: goldenrod; background-color: #222;
         text-align: left; font-size: 1.1rem; display: block; padding: 8px;">Maximum aantal gerechten bereikt. 
         <br/>U kunt echter nog wel dranken of <br/>bijgerechten bestellen.</span>
`; // Using innerHTML to include a line break

        // Append the message bar to the container
        const messageContainer = document.getElementById('message-container-notAdd');
        messageContainer.style.display = 'block';
        messageContainer.appendChild(messageBar);

        // Ensure the message bar is shown by adding the 'show' class
        setTimeout(() => {
            messageBar.classList.add('show');
        }, 10); // Small delay to ensure the class is added after appending

        // Hide the message bar and container after 4 seconds
        setTimeout(() => {
            messageBar.classList.remove('show'); // Remove the 'show' class to trigger any fade-out effect
            setTimeout(() => {
                messageBar.remove();
                // Check if there are no more children in the messageContainer before hiding it
                if (messageContainer.children.length === 0) {
                    messageContainer.style.display = 'none';
                }
            }, 500); // Adjust this delay to match the CSS transition duration for fading out
        }, 4000);

        // Logic to trigger the behavior when an item is added
        // For example, updating the UI to show "+added" next to the description
        ui.receiptDetails(this);
    if (window.BadgeManager) { window.BadgeManager.update(this._order); } else { updateQuantityLabels(this._order); }
        // For demonstration purposes, let's log it to the console
        console.log(`"${description}" <br>het max aantal bereikt`);
    }

    deleteOrderLine(sku, options = {}) {
        const db = firebase.database();

        const RestNameUrl = AppConfig?.restName || 'asianboulevard';
        if (!RestNameUrl) {
            console.error('Missing restName in AppConfig.');
            return;
        }
        const tafelId = `Tafel-${document.getElementById("tafelNummer")?.innerText.trim()}`;
        const orderPath = `/${RestNameUrl}/tafel/${tafelId}/orders/orderlist`;

        // ✅ Generate the correct lineKey using the same method as addOrderLine
        const lineKey = this._buildLineKey(sku, options);
        console.log(`🔍 Looking for item with lineKey: ${lineKey}`);

        // Find the item index using lineKey (from Firebase) or fallback to SKU matching
        let itemIndex = this._order.findIndex(orderItem => orderItem.lineKey === lineKey);
        
        // Fallback: if no lineKey match, try to find by SKU (for backward compatibility)
        if (itemIndex === -1) {
            itemIndex = this._order.findIndex(orderItem => orderItem.sku === sku);
            if (itemIndex !== -1) {
                console.warn(`⚠️ Found item by SKU fallback, but lineKey mismatch may cause issues`);
            }
        }

        if (itemIndex === -1) {
            console.error(`❌ Error: Item with SKU ${sku} and lineKey ${lineKey} not found.`);
            return;
        }

        // Remove the item from the local array
        const removedItem = this._order.splice(itemIndex, 1)[0];
        console.log(`✅ Removed item: ${JSON.stringify(removedItem)}`);

        // ✅ Use transaction to safely delete from Firebase by lineKey
        const itemRef = db.ref(`${orderPath}/${lineKey}`);
        itemRef.transaction(() => {
            return null; // Delete the item
        }, (error, committed, snapshot) => {
            if (error) {
                console.error('❌ Transaction failed for deletion:', lineKey, error);
            } else if (committed) {
                console.log(`✅ Successfully deleted ${lineKey} from Firebase`);
            } else {
                console.warn('⚠️ Delete transaction aborted:', lineKey);
            }
        });

        // **Check if order list is empty & clear UI safely**
        const receiptContainer = document.getElementById("receipt-details");
        const summaryContainer = document.getElementById("summary-table");

        if (this._order.length === 0) {
            console.log("🧹 No items left, clearing receipt and summary.");

            if (receiptContainer) {
                receiptContainer.innerHTML = ""; // ✅ Only modify if it exists
            } else {
                console.warn("⚠️ Warning: receipt-details not found in the DOM.");
            }

            if (summaryContainer) {
                summaryContainer.innerHTML = ""; // ✅ Only modify if it exists
            } else {
                console.warn("⚠️ Warning: summary-table not found in the DOM.");
            }

            Ui.summary(this); // ✅ Ensure the summary UI clears correctly
        }

        // ✅ Refresh UI safely
        if (receiptContainer) Ui.receiptDetails(this);
        if (summaryContainer) Ui.summary(this);
        updateQuantityLabels(this._order);
    }








    clearOrder() {
        this._order = [];

        Ui.receiptDetails(this);

    }

    getSummary() {
        const summary = {
            subtotal: 0,
            tax: 0,
            grandtotal: 0
        }

        this.order.forEach(orderLine => {
            summary.subtotal += orderLine.subtotal;
            summary.tax += orderLine.tax;
        })
        summary.grandtotal = summary.subtotal;

        return summary;
    }

    paypad(input) {
        if (!isNaN(parseInt(input))) {
            Utilities.numberPaypad(parseInt(input), this);
        } else if (input === "back") {
            Utilities.backPaypad(this);
        } else if (input === "clear") {
            Utilities.clearPaypad(this);
        }
    }

    changePayment(input) {

        const orderGrandTotal = this.getSummary().grandtotal;
        if (input.invoiceNumber != null) this.payment.invoiceNumber = inputInvoiceNumber;
        if (input.amountPaid != null) this.payment.amountPaid = parseFloat(input.amountPaid);
        if (input.type != null) this.payment.type = input.type;
        if (this.payment.amountPaid >= orderGrandTotal) {
            this.payment.changeTip = this.payment.amountPaid - orderGrandTotal;
            Ui.closeButton(false);
        } else {
            this.payment.changeTip = 0;
            Ui.closeButton(true);
        }

        Ui.paymentSummary(this);
    }

    clearPayment() {
        this._payment = {
            invoiceNumber: 0,
            amountPaid: 0,
            type: "",
            changeTip: 0
        };

        Ui.paymentSummary(this);
    }

    async exportOrder(date, orderItems = null) {
        let exportData = [];
        
        // ✅ 使用传入的订单项或默认的this.order
        const orderToExport = orderItems || this.order;
        // ✅ 获取当前all_in_met状态，用于重新计算价格
        const restName = window.AppConfig?.restName || 'asianboulevard';
        const rawTafelId = window.AppConfig?.tafelId;
        const tafelId = this._getNormalizedTafelId(rawTafelId);
        
        let allInMet = false;
        try {
            if (restName && tafelId) {
                const ALL_IN_MET_PATH = `${restName}/tafel/${tafelId}/orders/all_in_met`;
                const db = firebase.database();
                const allInMetSnapshot = await db.ref(ALL_IN_MET_PATH).once("value");
                allInMet = allInMetSnapshot.val() || false;
                console.log("🍷 ExportOrder: All-in met status:", allInMet);
            }
        } catch (error) {
            console.warn("Failed to get all_in_met status for export:", error);
        }

        orderToExport.forEach(orderLine => {
            console.log("Processing orderLine:", orderLine);

            if (orderLine.tax === undefined) {
                console.warn(`Undefined tax for orderLine:`, orderLine);
            }

            // ✅ 计算finalPrice：根据all_in_met状态重新计算价格
            let finalPrice = parseFloat(orderLine.price) || 0;
            
            // 查找菜单项以获取priceAllinDranks信息
            const menuItem = this.menu.find(item => item.sku === orderLine.sku);
            if (menuItem && allInMet && menuItem.priceAllinDranks) {
                const originalPrice = parseFloat(menuItem.originalPrice) || parseFloat(menuItem.price) || finalPrice;
                switch (menuItem.priceAllinDranks) {
                    case "free":
                        finalPrice = 0;
                        console.log(`🆓 Export ${menuItem.description}: All-in 免费 (${originalPrice}€ -> 0€)`);
                        break;
                    case "half":
                        finalPrice = originalPrice * 0.5;
                        console.log(`💰 Export ${menuItem.description}: All-in 半价 (${originalPrice}€ -> ${finalPrice.toFixed(2)}€)`);
                        break;
                    case "normal":
                    default:
                        finalPrice = originalPrice;
                        console.log(`💲 Export ${menuItem.description}: All-in 正常价 (${finalPrice}€)`);
                        break;
                }
            }

            let currentLine = [];
            currentLine[0] = date.toISOString();
            currentLine[1] = orderLine.sku;
            currentLine[2] = orderLine.quantity;
            currentLine[3] = finalPrice; // ✅ 使用重新计算的finalPrice
            currentLine[4] = orderLine.taxRate; // Log if undefined here
            currentLine[5] = orderLine.originalDescription || orderLine.description; // 使用原始荷兰语描述

            exportData.push(currentLine);
        });

        console.log("Exported order data with finalPrice:", exportData);
        return exportData;
    }

    exportPayment(date) {
        const currentPayment = [[]];


        currentPayment[0][0] = date;

        currentPayment[0][2] = this.getSummary().grandtotal;



        return currentPayment;

    }

    /**
     * Handle menu updates for orders containing special SKUs from exceptions
     * @param {Array} orderItems - Array of order items
     * @param {string} tafelId - Table ID (e.g., "Tafel-1")
     */
    async handleSpecialSkuMenuUpdates(orderItems, tafelId) {
        try {
            const restName = window.AppConfig?.restName || 'asianboulevard';
            const EXCEPTIONS_PATH = `${restName}/menukaart/exceptions`;
            const db = firebase.database();

            // Fetch special SKUs from exceptions dynamically
            const exceptionsSnapshot = await db.ref(EXCEPTIONS_PATH).once('value');
            const exceptionsData = exceptionsSnapshot.val();
            const specialSkus = exceptionsData ? Object.keys(exceptionsData).map(String) : [];
            
            console.log("Special SKUs from exceptions:", specialSkus);

            // Calculate total quantity for items with special SKUs
            let totalQuantity = orderItems.reduce((total, item) => {
                return specialSkus.includes(item.sku) ? total + item.quantity : total;
            }, 0);

            console.log(`Special SKU items quantity: ${totalQuantity}`);

            if (totalQuantity > 0) {
                const menuPath = `${restName}/tafel/${tafelId}/orders/menu`;
                const personsPath = `${restName}/tafel/${tafelId}/Persons`;

                // Step 1: Update 'menu' value first to prevent race conditions
                const menuSnapshot = await db.ref(menuPath).once('value');
                const currentMenuValue = menuSnapshot.val() || 0;
                console.log(`Current menu value: ${currentMenuValue}`);

                await db.ref(menuPath).transaction(currentValue => (currentValue || 0) + totalQuantity);
                console.log(`Updated 'Menu' value in Firebase with quantity: ${totalQuantity}`);

                // Step 2: Update 'Persons' count based on the updated menu value
                if (isNaN(currentMenuValue) || currentMenuValue === 0) {
                    await db.ref(personsPath).set(totalQuantity);
                    console.log(`menuPath is 0, replacing Persons count with ${totalQuantity}`);
                } else {
                    await db.ref(personsPath).transaction(currentPersons => {
                        let currentCount = Number(currentPersons) || 0;
                        let newCount = currentCount + totalQuantity;
                        console.log(`menuPath > 0, updating Persons from ${currentCount} to ${newCount}`);
                        return newCount;
                    });
                    console.log(`menuPath > 0, increased Persons count by ${totalQuantity}`);
                }

                // Step 3: Run `setupFirebaseListeners` AFTER everything is updated
                if (typeof setupFirebaseListeners === 'function') {
                    setupFirebaseListeners(tafelId);
                } else {
                    console.warn('setupFirebaseListeners function not found');
                }
            } else {
                console.log("No special SKU items found in order, skipping menu updates");
            }
        } catch (error) {
            console.error("Error handling special SKU menu updates:", error);
        }
    }

    /**
     * Check for "all-in met dranken" items and set Firebase flag
     * @param {Array} orderItems - Array of order items
     * @param {string} tafelId - Table ID (e.g., "Tafel-1")
     */
    async handleAllInMetDrankenFlag(orderItems, tafelId) {
        try {
            const restName = window.AppConfig?.restName || 'asianboulevard';
            const EXCEPTIONS_PATH = `${restName}/menukaart/exceptions`;
            const db = firebase.database();

            // Fetch exceptions data to check reasons
            const exceptionsSnapshot = await db.ref(EXCEPTIONS_PATH).once('value');
            const exceptionsData = exceptionsSnapshot.val();

            if (!exceptionsData) {
                console.log("No exceptions data found, setting all_in_met to false");
                await this.setAllInMetFlag(tafelId, false);
                return;
            }

            // Find SKUs with reason containing "all-in met dranken"
            const allInMetDrankenSkus = [];
            Object.keys(exceptionsData).forEach(sku => {
                const exception = exceptionsData[sku];
                if (exception.reason && exception.reason.toLowerCase().includes("all-in met dranken")) {
                    allInMetDrankenSkus.push(sku);
                }
            });

            console.log("All-in met dranken SKUs:", allInMetDrankenSkus);

            // Check if any order item has an "all-in met dranken" SKU
            const hasAllInMetDranken = orderItems.some(item => 
                allInMetDrankenSkus.includes(item.sku.toString())
            );

            console.log(`Order contains all-in met dranken items: ${hasAllInMetDranken}`);

            // Set the flag in Firebase
            await this.setAllInMetFlag(tafelId, hasAllInMetDranken);

        } catch (error) {
            console.error("Error handling all-in met dranken flag:", error);
            // Set to false on error to be safe
            await this.setAllInMetFlag(tafelId, false);
        }
    }

    /**
     * Set the all_in_met flag in Firebase orders node
     * @param {string} tafelId - Table ID (e.g., "Tafel-1")
     * @param {boolean} value - True if order contains all-in met dranken items
     */
    async setAllInMetFlag(tafelId, value) {
        try {
            const restName = window.AppConfig?.restName || 'asianboulevard';
            const allInMetPath = `${restName}/tafel/${tafelId}/orders/all_in_met`;
            const db = firebase.database();

            await db.ref(allInMetPath).set(value);
            console.log(`✅ Set all_in_met flag to ${value} for ${tafelId}`);

        } catch (error) {
            console.error("Error setting all_in_met flag:", error);
        }
    }




    async closeSale(timerText, InvoiceNumber, tafelNr) {
        try {
            const date = new Date();
            const tafelId = `Tafel-${tafelNr}`;

            // Use all items in the order
            const availableOrderItems = this._order;

            // Debugging: Log all order items and their group values
            console.log("Order items with groups:", availableOrderItems.map(item => item.group));

            // Check if all items are drinks (group 'geen')
            const allItemsFromGroepGeen = availableOrderItems.length > 0 && availableOrderItems.every(item => item.group === "geen");
            // Check if there are any non-drink (food) items
            const hasNonDrinkItems = availableOrderItems.some(item => item.group !== "geen");

            // Export order and payment data
            const orderData = await this.exportOrder(date, availableOrderItems);
            const paymentData = this.exportPayment(date);
            const exportData = {
                order: orderData,
                payment: paymentData,
            };

            const orderLineCount = orderData.length;

            // ✅ Dynamic detection of special SKUs and menu update logic
            await this.handleSpecialSkuMenuUpdates(availableOrderItems, tafelId);

            // ✅ Check for "all-in met dranken" items and update Firebase flag
            await this.handleAllInMetDrankenFlag(availableOrderItems, tafelId);

            const newInvoiceNumber = parseInt(InvoiceNumber, 10);
            const Bestelling = JSON.stringify(orderData); // Include full order data with descriptions

            console.log("Bestellingen from closeSale:", Bestelling);
        document.getElementById("overlay").style.display = 'block';

        // Notify the user that the order is being processed
        showNotification(`Verzenden...`, "info", 2000);

        try {
            // Check server status
            const serverStatus = await this.getServerStatus(); // Call the JavaScript function to get server status

            if (serverStatus === "online") {
                // Server is online, proceed to send the order
                document.getElementById("mainBody").style.display = 'none';
                document.getElementById("overlay").style.display = 'none';
                showNotification(`Uw bestelling is succesvol verzonden!`, "success", 2500);

                try {
                    // Send the order data to the server
                    const response = await sendDirect(
                        timerText,
                        tafelNr,
                        orderLineCount,
                        newInvoiceNumber,
                        Bestelling
                    );

                    console.log("sendDirect executed successfully:", response);
                    
                    // Save order history to Firebase - 单独处理错误，不影响订单清理
                    try {
                        await this.saveOrderHistoryToFirebase(
                            tafelId,
                            newInvoiceNumber,
                            date,
                            orderData,
                            paymentData,
                            orderLineCount
                        );
                        console.log("✅ Order history saved successfully");
                    } catch (historyError) {
                        console.error("❌ Failed to save order history:", historyError);
                        // 历史保存失败不应该阻止订单清理流程
                        // 用户已经通过saveOrderHistoryToFirebase方法内的通知了解了问题
                    }

                    // Successfully sent the order - 继续清理流程
                    console.log("🧹 Clearing order list for:", tafelId);
                    this.clearOrderList(tafelId);
                    
                    console.log("🔢 Generating new order number for:", tafelId);
                    await generateNewOrderNumber(tafelId);
                    
                    this.orderSent = true;

                    // Clear order and payment data
                    this.clearPayment();
                    this.clearOrder();
                    this.resetQuantityLabels();
                    Ui.summary(this);

                    // **Skip resetTimerAfterOrder() if all items are drinks (groep 'geen')**
                    // Only reset timer if there are any non-drink (food) items in the order
                    if (hasNonDrinkItems) {
                        console.log("Order contains food. Resetting timer...");
                        await this.resetTimerAfterOrder();
                    } else {
                        console.log("Order contains only drinks. Skipping timer reset.");
                    }



                    console.log("Export data successfully sent to the server.");
                } catch (error) {
                    console.error("Error executing sendDirect:", error.message || error);
                    showNotification(
                        "发送订单遇到技术问题： " + (error.message || "服务器可能被意外关闭"),
                        "error",
                        5500
                    );
                }
            } else {
                // Server is offline
                showNotification("Server is momenteel offline, probeer het later nog eens...", "error", 5500);
                document.getElementById("mainBody").style.display = 'none';
                document.getElementById("overlay").style.display = 'none';
            }
        } catch (error) {
            console.error("Error fetching server status:", error.message || error);
            showNotification(
                "无法获取服务器状态，请检查您的网络连接。",
                "error",
                5500
            );
            document.getElementById("overlay").style.display = 'none';
        }
        } catch (error) {
            console.error("Error in closeSale function:", error);
            showNotification("Er is een onverwachte fout opgetreden bij het afronden van de verkoop.", "error", "5000");
        }
    }


    async getServerStatus() {
        const WebHookStatus = document.getElementById("webhookHealthUrl").innerText.trim(); // Read the URL from HTML
        const healthCheckUrl = WebHookStatus; // Use the provided URL for the health check

        try {
            // Perform the HTTP GET request using fetch
            const response = await fetch(healthCheckUrl, {
                method: "GET", // HTTP GET method
            });

            // Check the HTTP response status
            if (response.ok) { // response.ok checks if status is in the range 200-299
                console.log("Server is online");
                return "online";
            } else {
                console.log("Server is offline");
                return "offline";
            }
        } catch (error) {
            // Catch and handle any errors during the fetch request
            console.error("Error during server status check:", error);
            return "offline";
        }
    }

    clearOrderList(tafelId) {
        const RestNameUrl = AppConfig?.restName || 'asianboulevard';
        const orderListPath = `/${RestNameUrl}/tafel/${tafelId}/orders/orderlist`;

        const db = firebase.database();
        db.ref(orderListPath)
            .remove()
            .then(() => {
                console.log("Orderlist key removed from Firebase.");
            })
            .catch((error) => {
                console.error("Failed to remove orderlist key from Firebase:", error);
            });

    }

    async saveOrderHistoryToFirebase(tafelId, invoiceNumber, date, orderData, paymentData, orderLineCount) {
        const RestNameUrl = window.AppConfig?.restName || 'asianboulevard';
        const historyPath = `${RestNameUrl}/tafel/${tafelId}/orders/history/`;
        const historyRef = firebase.database().ref(historyPath);

        const orderHistoryData = {
            date: date.toISOString(), // ISO format for consistency
            timestamp: Date.now(), // For sorting/filtering
            orderDetails: orderData,
            paymentDetails: paymentData,
            totalItems: orderLineCount,
            invoiceNumber: invoiceNumber,
        };

        try {
            await historyRef.child(invoiceNumber).set(orderHistoryData);
            console.log("✅ Order history saved to Firebase:", orderHistoryData);
        } catch (error) {
            console.error("❌ Error saving order history to Firebase:", error);
            // 显示用户友好的错误信息
            showNotification(
                "Bestelling is verzonden maar geschiedenis kon niet worden opgeslagen. Controleer uw internetverbinding.",
                "warning",
                4000
            );
            // 重新抛出错误让调用方知道失败了
            throw error;
        }
    }



    //重要的功能，不能删除， 重新设回label

    resetQuantityLabels() {
        document.querySelectorAll('.quantityLabel').forEach(label => {
            label.textContent = 0;
            label.style.display = "none"; // Corrected property name
        });
    }

    adjustLineQuantity(lineKey, delta) {
        if (!delta) return;
        const restName = window.AppConfig?.restName || 'asianboulevard';
        const tafelId = `Tafel-${document.getElementById("tafelNummer").innerText.trim()}`;
        const ref = firebase.database().ref(`/${restName}/tafel/${tafelId}/orders/orderlist/${lineKey}`);
        // Optional pre-check using in-memory order for increments
        if (delta>0) {
            const line = this._order.find(l=> l.lineKey===lineKey);
            const group = line?.group;
            if (group){
                const parsePosInt = (s) => {
                  const n = parseInt(s, 10);
                  return Number.isFinite(n) && n >= 0 ? n : null;
                };
                const etenEl = document.getElementById('limiet_eten');
                const dessertEl = document.getElementById('limiet_dessert');
                const personsEl = document.getElementById('aantal_pers');
                const persons = parsePosInt(personsEl?.innerText) ?? 1;
                const etenPer  = parsePosInt(etenEl?.innerText);
                const desPer   = parsePosInt(dessertEl?.innerText);
                const etenLimitTotal    = etenPer == null ? Infinity : etenPer * persons;
                const dessertLimitTotal = desPer  == null ? Infinity : desPer  * persons;
                const currentHoofd = this._order.reduce((acc, l)=> acc + (l.group==='groep1'? l.quantity:0) + (l.group==='groep4'? l.quantity*2:0), 0);
                const currentDessert = this._order.reduce((acc, l)=> acc + (l.group==='groep3'? l.quantity:0), 0);
                if ((group==='groep1'||group==='groep4') && currentHoofd + (group==='groep1'?1:2) > etenLimitTotal) {
                    showNotification('Hoofdgerechten limiet bereikt', 'error', 4000); return; }
                if (group==='groep3' && currentDessert +1 > dessertLimitTotal) {
                    showNotification('Desserts limiet bereikt', 'error', 4000); return; }
            }
        }
        ref.transaction(cur => {
            if (cur == null) return cur; // line vanished
            const newQty = (cur.quantity || 0) + delta;
            if (newQty <= 0) return null;
            cur.quantity = newQty;
            cur.subtotal = (cur.price || 0) * newQty;
            cur.taxAmount = cur.subtotal * ((cur.taxRate || 0) / 100);
            return cur;
        }, (err, committed, snap) => { 
            if (err) console.error('Adjust quantity failed', lineKey, err); 
            if (committed && snap && snap.val()) {
                this._mergeLocalLineAfterTxn(lineKey, snap.val(), snap.val().options||{});
                this.updateAggregates();
            } else if (committed && snap && snap.val()===null) {
                this._removeLocalLine(lineKey);
                this.updateAggregates();
            }
        });
    }

    removeLine(lineKey) {
        const restName = window.AppConfig?.restName || 'asianboulevard';
        const tafelId = `Tafel-${document.getElementById("tafelNummer").innerText.trim()}`;
        firebase.database().ref(`/${restName}/tafel/${tafelId}/orders/orderlist/${lineKey}`).remove()
            .then(()=> { this._removeLocalLine(lineKey); this.updateAggregates(); })
            .catch(e => console.error('Remove line failed', lineKey, e));
    }

    _mergeLocalLineAfterTxn(lineKey, val, optionsObj){
        const idx = this._order.findIndex(l=> l.lineKey===lineKey);
        if (idx===-1){
            this._order.push({
                lineKey,
                sku: val.sku || this._extractSkuFromLineKey(lineKey), // 提取正确的SKU
                description: val.description || 'No description',
                quantity: val.quantity||0,
                price: parseFloat(val.price)||0,
                taxRate: val.taxRate||0,
                taxAmount: val.taxAmount||0,
                subtotal: val.subtotal||0,
                group: val.group||'unknown',
                allergy: val.allergy||'',
                options: optionsObj||{}
            });
        } else {
            Object.assign(this._order[idx], {
                quantity: val.quantity||0,
                taxAmount: val.taxAmount||0,
                subtotal: val.subtotal||0
            });
        }
        Ui.receiptDetails(this);
    }

    _removeLocalLine(lineKey){
        const idx = this._order.findIndex(l=> l.lineKey===lineKey);
        if (idx!==-1){ this._order.splice(idx,1); Ui.receiptDetails(this); }
    }

    updateAggregates(){
        const restName = window.AppConfig?.restName || 'asianboulevard';
        const tafelId = AppConfig.tableId;
        if (!restName || !tafelId) return;
        const hoofd = this._order.reduce((a,l)=> a + (l.group==='groep1'? l.quantity:0) + (l.group==='groep4'? l.quantity*2:0),0);
        const dessert = this._order.reduce((a,l)=> a + (l.group==='groep3'? l.quantity:0),0);
        const totaalPrijs = this._order.reduce((a,l)=> a + (l.price||0)*(l.quantity||0),0);
        firebase.database().ref(`/${restName}/tafel/${tafelId}/orders/aggregates`).update({
            hoofdgerechten: hoofd,
            desserts: dessert,
            totaalPrijs: totaalPrijs,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        }).catch(e=> console.error('Update aggregates failed', e));
    }
    async resetTimerAfterOrder() {
        try {
            const RestNameUrl = window.AppConfig?.restName || 'asianboulevard';
            const tafelId = `Tafel-${document.getElementById('tafelNummer').innerText.trim()}`;

            const db = firebase.database();
            const timerRef = db.ref(`${RestNameUrl}/tafel/${tafelId}/timer`);
            // Prefer new config node; fallback to legacy settings for backward compatibility
            const roundTimeConfigRef = db.ref(`${RestNameUrl}/config/round_time`);
            let roundTimeRef = roundTimeConfigRef;
            let roundTimeSnapshot = await roundTimeConfigRef.once("value");
            if (roundTimeSnapshot.val() == null) {
                const legacyRef = db.ref(`${RestNameUrl}/settings/round_time`);
                const legacySnap = await legacyRef.once('value');
                if (legacySnap.val() != null) {
                    roundTimeRef = legacyRef;
                    roundTimeSnapshot = legacySnap;
                    console.info('[round_time] Using legacy settings/round_time path (config missing)');
                }
            }

            function normalizeRoundTimeToMinutes(val) {
                const n = Number(val);
                if (!Number.isFinite(n)) return null;
                return n > 1000 ? Math.round(n / 60000) : n; // >1000 视为毫秒
            }
            const raw = roundTimeSnapshot.val();
            const countDownMinutes = normalizeRoundTimeToMinutes(raw) ?? 1;

            const newStartTime = Date.now();
            const newEndTime = newStartTime + countDownMinutes * 60 * 1000;

            // 🔥 **Update Firebase with new timer values**
            await timerRef.update({
                startTime: newStartTime,
                duration: countDownMinutes,
                endTime: newEndTime
            });

            console.log(`✅ Timer reset after order: Duration = ${countDownMinutes} minutes, New End Time = ${new Date(newEndTime).toLocaleString()}`);

            // Restart countdown immediately for the user - 员工版本禁用
            if (AppConfig && AppConfig.timeLimit) {
                startCountdown();
            } else {
                console.log("✅ 员工版本：跳过订单后重启定时器");
            }
        } catch (error) {
            console.error("❌ Error resetting timer:", error);
        }
    }


}



/////////////////////////////////////////////////////////////////////////////


function showImmediateConfirmation() {
    const newInvoiceNumber = document.getElementById("invoice-number").innerText.trim();
    document.getElementById('overlay').style.display = "block";

    // Create a confirmation message
    const confirmationMessage = document.createElement('div');
    confirmationMessage.id = 'confirmationMessage';
    confirmationMessage.classList.add('fade-in'); // Apply the fade-in animation
    confirmationMessage.style.position = 'fixed';
    confirmationMessage.style.top = '30%';
    confirmationMessage.style.left = '50%';
    confirmationMessage.style.transform = 'translate(-50%, -50%)';
    confirmationMessage.style.backgroundColor = '#222';
    confirmationMessage.style.color = 'goldenrod';
    confirmationMessage.style.padding = '20px';
    confirmationMessage.style.zIndex = '99999'; // Make sure it's above other elements
    confirmationMessage.style.borderRadius = '10px';
    confirmationMessage.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    confirmationMessage.style.fontSize = '1.5em';
    confirmationMessage.style.width = '80%';
    confirmationMessage.style.textAlign = 'center'; // Horizontally center-align text
    confirmationMessage.style.justifyContent = 'center'; // Center horizontally
    confirmationMessage.style.alignItems = 'center'; // Center vertically
    confirmationMessage.innerHTML = "<strong>Uw bestelling " + newInvoiceNumber + "</strong><br> is succesvol verzonden.";
    // Reset the round timer with a fresh start using configured round_time
    (async () => {
        try {
            if (window.orderInstance && typeof orderInstance.resetTimerAfterOrder === 'function') {
                await orderInstance.resetTimerAfterOrder();
            } else if (window.order && typeof order.resetTimerAfterOrder === 'function') {
                await order.resetTimerAfterOrder();
            } else {
                // Fallback: manually reset based on config/round_time (or legacy settings/round_time)
                const RestNameUrl = window.AppConfig?.restName || 'asianboulevard';
                const tafelId = `Tafel-${document.getElementById('tafelNummer').innerText.trim()}`;
                const db = firebase.database();
                let roundTimeRef = db.ref(`${RestNameUrl}/config/round_time`);
                let snap = await roundTimeRef.once('value');
                if (snap.val() == null) { // legacy support
                    roundTimeRef = db.ref(`${RestNameUrl}/settings/round_time`);
                    snap = await roundTimeRef.once('value');
                }
                function normalizeRoundTimeToMinutes(val) {
                    const n = Number(val);
                    if (!Number.isFinite(n)) return null;
                    return n > 1000 ? Math.round(n / 60000) : n; // >1000 视为毫秒
                }
                const raw = snap.val();
                const countDownMinutes = normalizeRoundTimeToMinutes(raw) ?? 15;
                const timerRef = db.ref(`${RestNameUrl}/tafel/${tafelId}/timer`);
                const now = Date.now();
                await timerRef.update({ startTime: now, duration: countDownMinutes, endTime: now + countDownMinutes*60*1000 });
                // 员工版本禁用定时器重启
                if (AppConfig && AppConfig.timeLimit) {
                    startCountdown();
                } else {
                    console.log("✅ 员工版本：跳过定时器重启");
                }
            }
        } catch(e){ console.warn('Timer reset fallback error', e); }
    })();

    google.script.run.createRecord(newInvoiceNumber);
    // Append to body
    document.body.appendChild(confirmationMessage);

    // Assuming confirmationMessage is the message panel element
    confirmationMessage.style.opacity = '1'; // Ensure the panel is visible

    // Function to hide and remove the confirmation message panel
    function hideConfirmationMessage() {
        confirmationMessage.style.opacity = '0'; // Fade out effect
        setTimeout(() => {
            confirmationMessage.remove(); // Remove the element after fade out
            document.getElementById('overlay').style.display = "none";
            document.getElementById('mainBody').style.display = "none";
        }, 500); // Short delay to allow fade-out effect
    }

    // Close the message when clicking directly on it
    confirmationMessage.addEventListener("click", hideConfirmationMessage);

    // Close the message when clicking outside of it
    document.addEventListener("click", function (event) {
        if (!confirmationMessage.contains(event.target)) {
            hideConfirmationMessage();
        }
    }, { once: true });
}



// Function to fetch verspillingBericht from Google Apps Script

function checkStatusAndPincodeFromServer(timerText, orderLineCount, allItemsFromGroep3, newInvoiceNumber, Bestelling) {
    console.log("number from checkStatusAndPincode:", newInvoiceNumber)
    document.getElementById('overlay').style.display = "block";

    // Create the confirmation message element
    const defaultConfirmationMessage = document.createElement('div');
    defaultConfirmationMessage.id = 'defaultConfirmationMessage';
    defaultConfirmationMessage.classList.add('fade-in');
    defaultConfirmationMessage.style.position = 'fixed';
    defaultConfirmationMessage.style.top = '30%';
    defaultConfirmationMessage.style.left = '50%';
    defaultConfirmationMessage.style.transform = 'translate(-50%, -50%)';
    defaultConfirmationMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 50% transparent black background
    defaultConfirmationMessage.style.color = 'goldenrod';
    defaultConfirmationMessage.style.padding = '20px';
    defaultConfirmationMessage.style.zIndex = '99999';
    defaultConfirmationMessage.style.borderRadius = '10px';
    defaultConfirmationMessage.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    defaultConfirmationMessage.style.fontSize = '1.5em';
    defaultConfirmationMessage.style.width = '80%';
    defaultConfirmationMessage.style.textAlign = 'center'; // Horizontally center-align text
    defaultConfirmationMessage.style.display = 'flex'; // Flex display for centering
    defaultConfirmationMessage.style.justifyContent = 'center'; // Center horizontally
    defaultConfirmationMessage.style.alignItems = 'center'; // Center vertically

    // Append the message to the document
    document.body.appendChild(defaultConfirmationMessage);

    // Run server function and handle both response and verspillingBericht in the callback
    google.script.run
        .withSuccessHandler(function (result) {
            const { response, verspillingBericht } = result;

            // Show a default message during processing
            if (allItemsFromGroep3) {
                defaultConfirmationMessage.innerHTML = `<strong><span>aan het verzenden...</span></strong><br>`;
                applyCustomTranslations();
            } else {
                defaultConfirmationMessage.innerHTML = `<strong><span>aan het verzenden...</span><br>`;
                applyCustomTranslations();
            }

            // Handle the response
            if (response === "ok") {
                setTimeout(() => {
                    showImmediateConfirmation(newInvoiceNumber);
                }, 500);
            } else if (response === "server_offline") {
                showNotification(`Server is nog niet aan!`, "error", 10000);
            } else if (response === "invalid_pincode") {
                showNotification(`Uw pincode is verlopen`, "error", 10000);
            } else if (response === "table_not_open") {
                showNotification(`Uw tafel is nog niet geopend voor bestellingen`, "error", 10000);
            } else {
                showNotification(`Er is iets mis met onze verbinding, wilt u nogmaals proberen aub.`, "error", 10000);
                console.error(`Unexpected response: ${response}`);
            }

            // Remove the message after fade-out
            setTimeout(() => {
                defaultConfirmationMessage.style.opacity = "0";
                setTimeout(() => {
                    defaultConfirmationMessage.remove();
                    document.getElementById("overlay").style.display = "none";
                    document.getElementById("mainBody").style.display = "none";
                }, 500);
            }, 500);
        })
        .checkStatusAndPincode(timerText, orderLineCount, allItemsFromGroep3, Bestelling, newInvoiceNumber);

}





/////////////////////////////////////////////////////////////speedup the order confirmation progress.////////////
function showConfirm() {
    // This function now focuses on showing the confirmation and initial setup
    const confirm = document.getElementById('orderHistoryFrame');
    confirm.style.display = "grid";

    document.getElementById('confirm-close').addEventListener('click', () => {
        $('#mainBody').hide();
        hideConfirm();
    });

    // Load the last order info asynchronously
    loadLastOrderInfo();

}

function loadLastOrderInfo() {
    console.log('loadLastOrderInfo called'); // Debugging line
    google.script.run.withSuccessHandler(function (orderData) {
        console.log('Order data received:', orderData); // Debugging line
        document.getElementById('overlay').style.display = "none";

        document.getElementById('lastOrderPage').innerHTML = orderData;
        document.getElementById('confirm-close').scrollIntoView({ block: 'start', behavior: 'smooth' });

        document.querySelectorAll('.quantityLabel').forEach(label => {
            label.style.display = 'none';
        });
        // Start the countdown timer after successful execution - 员工版本禁用
        if (AppConfig && AppConfig.timeLimit) {
            startCountdown();
        } else {
            console.log("✅ 员工版本：跳过订单加载后定时器启动");
        }
    }).lastOrderInfo();
}




//////////////////////////////////////////////////////////////////////////////////
class Utilities {

    static convertFloatToString(float) {
        let priceParams = {
            style: "currency",
            currency: "EUR"
        };

        return float.toLocaleString("nl-NL", priceParams);
    }

    static roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    static numberPaypad(input, orderInstance) {
        const currentInput = this.roundToTwo(input * .01);
        const currentAmountPaid = this.roundToTwo(orderInstance.payment.amountPaid);
        const newAmountPaid = this.roundToTwo((currentAmountPaid * 10) + currentInput);

        if (currentAmountPaid === 0) {
            orderInstance.changePayment({ amountPaid: currentInput });
        } else {
            orderInstance.changePayment({ amountPaid: newAmountPaid });
        }
    }

    static backPaypad(orderInstance) {
        const currentPayment = orderInstance.payment.amountPaid;

        if (currentPayment > 0) {
            const toSubtract = ((currentPayment * 100) % 10) * 0.01;
            const newAmount = (currentPayment - toSubtract) * 0.1;
            orderInstance.changePayment({ amountPaid: newAmount });
        }
    }

    static clearPaypad(orderInstance) {
        orderInstance.changePayment({ amountPaid: 0 });
    }
}
