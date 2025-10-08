// Update the FAB send badge with the total quantity in the order
function updateSendBadgeFromOrder(orderArray) {
    const badge = document.getElementById('fab-send-badge');
    if (!badge) return;
    let count = 0;
    if (Array.isArray(orderArray)) {
        for (const item of orderArray) {
            const q = parseInt(item.quantity, 10);
            if (Number.isFinite(q)) count += q;
        }
    }
    if (count > 0) {
        badge.textContent = String(count);
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
    
    // 同步更新toggle按钮徽章
    if (typeof checkAndUpdateCartAnimation === 'function') {
        // 使用setTimeout确保DOM更新后再调用
        setTimeout(checkAndUpdateCartAnimation, 0);
    }
}
class Ui {
    static menu(orderInstance) {
        // Clear existing menu items before rendering new ones
        const menuContainer = document.getElementById("menu");
        if (menuContainer) {
            menuContainer.innerHTML = '';
        }
        
        let frag = document.createDocumentFragment();

        orderInstance.menu.forEach((item, index) => {
            // 现代卡片结构的HTML（不包含编号）
            let menuElement = `
                <div class="image-container">
                    <img src="${item.image}" alt="${item.displayName || item.description}" id="${item.id}" class="menu-img">
                </div>
                <div class="content">
                    <div class="item-name">${item.displayName || item.description}</div>
                    <div class="item-price">${Utilities.convertFloatToString(item.price)}</div>
                </div>`;

            let node = document.createElement("div");
            node.className = "menu-item";
            node.setAttribute("data-sku", item.sku);
            node.setAttribute("data-description", item.displayName || item.description);
            node.setAttribute("data-group", item.group);
            node.setAttribute("data-allergy", item.allergy);
            node.setAttribute("data-taxRate", item.taxRate);
            node.innerHTML = menuElement;
            frag.appendChild(node);
        });

        document.getElementById("menu").appendChild(frag);
        document.querySelectorAll(".menu-item").forEach(button => {
            button.addEventListener('click', () => {
                // ✅ 获取 SKU，确保能从 menu 里找到该项
                const sku = button.getAttribute("data-sku");

                // ✅ 从 `orderInstance.menu` 里查找完整数据
                const itemData = orderInstance.menu.find(item => item.sku === sku);
                if (!itemData) {
                    console.error(`❌ Item with SKU ${sku} not found in menu!`);
                    return;
                }

                // ✅ 创建 `itemDetails`，从 `itemData` 直接获取所有值
                const itemDetails = {
                    sku: itemData.sku,
                    image: itemData.image,
                    description: itemData.description,
                    group: itemData.group,
                    allergy: itemData.allergy,
                    taxRate: itemData.taxRate,
                    price: parseFloat(itemData.price) || 0, // ✅ 确保价格正确转换
                    hasOptions: itemData.hasOptions || false, // ✅ 直接使用 menuData 里的 `hasOptions`
                    options: itemData.options || {} // ✅ 确保 `options` 正确加载
                };

                // ✅ 读取当前设备的数量（简化版本）
                const quantityLabel = button.querySelector('.quantityLabel');
                const currentQuantity = quantityLabel ? parseInt(quantityLabel.textContent, 10) || 1 : 1;
                
                console.log(`🎯 简化版本 - SKU ${itemData.sku}:`, {
                    displayedQuantity: currentQuantity,
                    note: '仅显示当前设备数量'
                });

                // ✅ 调试日志，确保数据正确
                console.log("✅ Item clicked:", itemDetails);
                console.log("✅ Options passed to message bar:", itemDetails.options);

                // ✅ 传递数据到 `createAndShowMessageBar`
                createAndShowMessageBar(itemDetails, orderInstance, currentQuantity);
            });
        });


    }




    static receiptDetails(orderInstance) {
        // Render using current in-memory order; realtime listener updates _order when Firebase changes
        const orderArray = orderInstance.order || orderInstance._order || [];
        const receiptDetails = document.getElementById("receipt-details");
        if (!receiptDetails) return;

        // 🔧 确保orderInstance已完全初始化
        if (!orderInstance || !orderInstance._deviceId) {
            console.log('⏳ receiptDetails: orderInstance未完全初始化，延迟执行...');
            // 延迟50ms后重试，让orderInstance有时间初始化
            setTimeout(() => {
                if (orderInstance && orderInstance._deviceId) {
                    Ui.receiptDetails(orderInstance);
                } else {
                    console.log('⚠️ receiptDetails: orderInstance仍未初始化，使用localStorage备用方案');
                    Ui.receiptDetails(orderInstance); // 仍然执行，但会使用localStorage备用
                }
            }, 50);
            return;
        }

        // 🔧 安全获取当前设备ID，确保刷新后仍能正确识别
        let currentDeviceId;
        if (orderInstance && (orderInstance._deviceId || orderInstance.deviceId)) {
            currentDeviceId = orderInstance._deviceId || orderInstance.deviceId;
            console.log('✅ receiptDetails: 从orderInstance获取deviceId:', currentDeviceId);
        } else {
            // 如果orderInstance未初始化，直接从localStorage获取
            currentDeviceId = localStorage.getItem('deviceId');
            console.log('⚠️ receiptDetails: orderInstance设备ID未设置，从localStorage获取:', currentDeviceId);
        }
        
        // 🔍 调试信息：显示所有订单的设备ID
        console.log('🔍 receiptDetails调试信息:');
        console.log('  - 当前设备ID:', currentDeviceId);
        console.log('  - localStorage中的deviceId:', localStorage.getItem('deviceId'));
        console.log('  - orderInstance状态:', orderInstance ? '已初始化' : '未初始化');
        console.log('  - orderInstance._deviceId:', orderInstance?._deviceId);
        console.log('  - orderInstance.deviceId:', orderInstance?.deviceId);
        console.log('  - 订单总数:', orderArray.length);
        orderArray.forEach((order, index) => {
            console.log(`  - 订单${index}: sku=${order.sku}, deviceId="${order.deviceId}", 是否匹配=${order.deviceId === currentDeviceId}, lineKey=${order.lineKey}`);
        });
        
        // 🔄 按设备分组订单：我的订单在前，其他设备的在后
        const myOrders = [];
        const otherOrders = [];
        
        // 🔧 设备识别逻辑：使用设备ID的最后8位进行比较
        // 因为lineKey中只保存了设备ID的后8位，所以比较时也要用后8位
        const currentDeviceIdSuffix = currentDeviceId ? currentDeviceId.slice(-8) : null;
        
        orderArray.forEach((orderLine, originalIndex) => {
            const orderWithIndex = { ...orderLine, originalIndex };
            
            let isMyOrder = false;
            if (!orderLine.deviceId) {
                // 无deviceId的旧数据，归属当前设备
                isMyOrder = true;
            } else {
                // 比较设备ID的最后8位
                const orderDeviceIdSuffix = orderLine.deviceId.slice(-8);
                isMyOrder = (orderDeviceIdSuffix === currentDeviceIdSuffix);
                console.log(`  � 设备ID比较: ${orderLine.sku}, 订单后8位=${orderDeviceIdSuffix}, 当前后8位=${currentDeviceIdSuffix}, 匹配=${isMyOrder}`);
            }
            
            if (isMyOrder) {
                myOrders.push(orderWithIndex);
            } else {
                otherOrders.push(orderWithIndex);
            }
        });
        
        // 🎯 重新组织顺序：我的订单 + 其他设备的订单
        const sortedOrders = [...myOrders, ...otherOrders];

        let frag = document.createDocumentFragment();

        // 🎯 添加分组标题（如果有我的订单）
        if (myOrders.length > 0) {
            const myGroupHeader = document.createElement('tr');
            myGroupHeader.className = 'group-header my-group-header';
            myGroupHeader.innerHTML = `
                <td colspan="5" class="group-title">
                    <strong>👤 Mijn bestellingen</strong>
                </td>
            `;
            frag.appendChild(myGroupHeader);
        }

        // 🔵 渲染我的订单
        myOrders.forEach((orderLine) => {
            const row = document.createElement('tr');
            row.setAttribute('data-sku', orderLine.sku);
            row.setAttribute('data-index', orderLine.originalIndex);
            if (orderLine.lineKey) row.setAttribute('data-lineKey', orderLine.lineKey);
            row.className = 'my-order-item';
            
            const modifyButtons = `
                <td class="modify-quantity">
                  <button class="delete" data-index="${orderLine.originalIndex}" aria-label="verminderen">−</button>
                  <button class="increase-quantity" data-index="${orderLine.originalIndex}" aria-label="toevoegen">＋</button>
                </td>`;
            
            row.innerHTML = `
                <td class="sku">${orderLine.sku}</td>
                <td class="description">${orderLine.description}</td>
                <td class="quantity">${orderLine.quantity}</td>
                <td class="price">${Utilities.convertFloatToString((orderLine.price || 0) * (orderLine.quantity || 0))}</td>
                ${modifyButtons}
            `;
            frag.appendChild(row);
        });

        // 🎯 添加其他设备分组标题（如果有其他订单）
        if (otherOrders.length > 0) {
            const othersGroupHeader = document.createElement('tr');
            othersGroupHeader.className = 'group-header others-group-header';
            othersGroupHeader.innerHTML = `
                <td colspan="5" class="group-title">
                    <strong>👥 Bestellingen van anderen</strong>
                </td>
            `;
            frag.appendChild(othersGroupHeader);
        }

        // ⚪ 渲染其他设备的订单
        otherOrders.forEach((orderLine) => {
            const row = document.createElement('tr');
            row.setAttribute('data-sku', orderLine.sku);
            row.setAttribute('data-index', orderLine.originalIndex);
            if (orderLine.lineKey) row.setAttribute('data-lineKey', orderLine.lineKey);
            row.className = 'others-order-item';
            
            const modifyButtons = `
                <td class="modify-quantity">
                  <span class="no-modify">ander apparaat</span>
                </td>`;
            
            row.innerHTML = `
                <td class="sku">${orderLine.sku}</td>
                <td class="description">${orderLine.description}</td>
                <td class="quantity">${orderLine.quantity}</td>
                <td class="price">${Utilities.convertFloatToString((orderLine.price || 0) * (orderLine.quantity || 0))}</td>
                ${modifyButtons}
            `;
            frag.appendChild(row);
        });

        receiptDetails.innerHTML = '';
        receiptDetails.appendChild(frag);

        // Attach handlers (optimistic update + DB sync)
        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                const line = orderInstance._order[idx];
                if (!line) return;
                const key = line.lineKey || line.sku; // fallback
                orderInstance.adjustLineQuantity(key, 1);
            });
        });

        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                const line = orderInstance._order[idx];
                if (!line) return;
                const key = line.lineKey || line.sku;
                if (line.quantity > 1) {
                    orderInstance.adjustLineQuantity(key, -1);
                } else {
                    orderInstance.removeLine(key);
                }
            });
        });

        Ui.summary(orderInstance); // summary will be refreshed again by listener updates
        updateQuantityLabels(orderInstance._order);
        updateSendBadgeFromOrder(orderInstance._order);
        
        // 同步更新toggle按钮徽章和动画
        if (typeof checkAndUpdateCartAnimation === 'function') {
            checkAndUpdateCartAnimation();
        }
    }






    // Feature flag: disable/enable in-menu quantity badges (only on menu items, never inside receipt)
    static ENABLE_MENU_BADGES = true;



    static summary(orderInstance) {
        let subtotal = 0;
        let tax = 0;

        // Calculate the subtotal and tax (defensive against undefined / malformed data)
        (orderInstance.order || []).forEach(item => {
            const qty = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            // taxRate may be stored as percentage (e.g., 21) or decimal (e.g., 0.21). Normalize if >1.
            let taxRate = parseFloat(item.taxRate);
            taxRate = isNaN(taxRate) ? 0 : (taxRate > 1 ? taxRate / 100 : taxRate);
            const gross = qty * price; // gross (incl) if price already incl tax OR net if price is base – we treat as gross then split.
            // If price is tax-inclusive (common in menu), derive net = gross / (1+taxRate)
            const net = taxRate > 0 ? gross / (1 + taxRate) : gross;
            const itemTax = gross - net;
            subtotal += net;
            tax += itemTax;
        });

        if (!isFinite(subtotal)) subtotal = 0;
        if (!isFinite(tax)) tax = 0;
        const grandtotal = subtotal + tax;

        // ✅ Ensure elements exist before modifying them
        const subtotalElement = document.getElementById("subtotal-summary");
        const taxElement = document.getElementById("tax-summary");
        const grandtotalElement = document.getElementById("grandtotal-summary");

        if (!subtotalElement || !taxElement || !grandtotalElement) {
            console.warn("⚠️ Warning: One or more summary elements not found. Skipping update.");
            return;
        }

        // ✅ If order is empty, clear the summary
        if (orderInstance.order.length === 0) {
            console.log("🧹 Order is empty, clearing summary.");
            subtotalElement.textContent = "0.00";
            taxElement.textContent = "0.00";
            grandtotalElement.textContent = "0.00";
        } else {
            // ✅ Otherwise, update the UI with calculated values
            subtotalElement.textContent = Utilities.convertFloatToString(subtotal);
            taxElement.textContent = Utilities.convertFloatToString(tax);
            grandtotalElement.textContent = Utilities.convertFloatToString(grandtotal);
        }

        console.log("✅ Summary updated: ", { subtotal, tax, grandtotal });
    }



    static showPaypad(orderInstance) {
        const paypad = document.getElementById('payment-overlay');
        paypad.style.display = "grid";
    }

    static hidePaypad(orderInstance) {
        const paypad = document.getElementById('payment-overlay');
        paypad.style.display = "none";
    }

    static paymentSummary(orderInstance) {
        document.getElementById('amount-paid').textContent = Utilities.convertFloatToString(orderInstance.payment.amountPaid);

        const changeTipTitle = document.getElementById('tip-change-title');
        const paymentType = document.getElementById("payment-type");

        if (orderInstance.payment.type === "credit") {
            changeTipTitle.textContent = "Tip:";
            paymentType.textContent = "Pin/Creditcard";
        } else if (orderInstance.payment.type === "cash") {
            changeTipTitle.textContent = "Change:";
            paymentType.textContent = "Cash";
        } else {
            changeTipTitle.textContent = "Change:";
            paymentType.textContent = "";
        }
        document.getElementById("tip-change-value").textContent = Utilities.convertFloatToString(orderInstance.payment.changeTip);
    }




}







// ORDER INSTANTIATION
const order = new Order();
// order.loadMenuFromFirebase();

// 🎯 立即显示空的receipt，避免页面加载时显示空白
document.addEventListener('DOMContentLoaded', () => {
    // 等待receipt容器存在后立即显示空收据
    const checkReceiptContainer = () => {
        const receiptContainer = document.getElementById("receipt-details");
        if (receiptContainer) {
            console.log('🏁 页面加载完成，立即显示空receipt');
            Ui.receiptDetails(order); // 显示空的收据
        } else {
            // 如果容器还不存在，再等50ms
            setTimeout(checkReceiptContainer, 50);
        }
    };
    checkReceiptContainer();
    
    // 🔍 检查header初始状态
    const header = document.querySelector('header');
    if (header) {
        console.log('🏠 Header初始状态:');
        console.log('   display:', window.getComputedStyle(header).display);
        console.log('   visibility:', window.getComputedStyle(header).visibility);
        console.log('   opacity:', window.getComputedStyle(header).opacity);
        console.log('   position:', window.getComputedStyle(header).position);
        console.log('   z-index:', window.getComputedStyle(header).zIndex);
        console.log('   height:', window.getComputedStyle(header).height);
        console.log('   min-height:', window.getComputedStyle(header).minHeight);
        console.log('   flex-shrink:', window.getComputedStyle(header).flexShrink);
        console.log('   top:', window.getComputedStyle(header).top);
        
        // 确保header可见
        if (window.getComputedStyle(header).display === 'none') {
            console.warn('⚠️ Header被隐藏，强制显示');
            header.style.display = 'block';
        }
        
        // 监听header高度变化
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const height = entry.contentRect.height;
                console.log('📏 Header高度变化:', height + 'px');
                if (height < 50) {
                    console.warn('⚠️ Header高度过小，强制设置最小高度');
                    header.style.minHeight = '70px';
                    header.style.flexShrink = '0';
                }
            }
        });
        observer.observe(header);
        
    } else {
        console.warn('❌ 未找到header元素');
    }
});

// 🔥 异步初始化 - 等待AppConfig就绪后再设置监听器
(async () => {
    await waitForAppConfig(); // 等待配置加载完成
    order.setupRealtimeListeners();
})();




// STATIC EVENT LISTENERS
//  document.getElementById("clear-order").addEventListener("click", () => {
//         order.clearOrder();
//     });

// One-click clear cart handler (transaction-safe removal of entire orderlist)
(() => {
    const clearBtn = document.getElementById('order-clear');
    if (!clearBtn) return; // Button not present
    // Toast-style async confirmation (returns Promise<boolean>)
    async function confirmClearOrder(message) {
        return new Promise(resolve => {
            // If an existing confirm toast exists, remove it first
            const existing = document.querySelector('.toast-confirm');
            if (existing) existing.remove();
            const wrap = document.createElement('div');
            wrap.className = 'toast-confirm';
            wrap.innerHTML = `
                <div class="toast-confirm-message">${message}</div>
                <div class="toast-confirm-buttons">
                    <button type="button" class="toast-confirm-ok">Ja</button>
                    <button type="button" class="toast-confirm-cancel">Nee</button>
                </div>`;
            document.body.appendChild(wrap);
            const okBtn = wrap.querySelector('.toast-confirm-ok');
            const cancelBtn = wrap.querySelector('.toast-confirm-cancel');
            const cleanup = (val) => { wrap.classList.add('hide'); setTimeout(() => wrap.remove(), 150); resolve(val); };
            okBtn.addEventListener('click', () => cleanup(true));
            cancelBtn.addEventListener('click', () => cleanup(false));
            // ESC to cancel
            const keyHandler = (e) => { if (e.key === 'Escape') { document.removeEventListener('keydown', keyHandler); cleanup(false); } };
            document.addEventListener('keydown', keyHandler);
            // Auto-cancel after 15s
            setTimeout(() => { if (document.body.contains(wrap)) cleanup(false); }, 15000);
        });
    }
    clearBtn.addEventListener('click', async () => {
        try {
            if (order._order.length === 0) {
                showNotification('Bestel lijst is al leeg', 'info', 2500);
                return;
            }
            const confirmMsg = 'Weet u zeker dat u alle items wilt verwijderen?';
            const ok = await confirmClearOrder(confirmMsg);
            if (!ok) return;

            const restName = window.AppConfig?.restName || 'asianboulevard';
            const tafelEl = document.getElementById('tafelNummer');
            const tafelId = tafelEl ? `Tafel-${tafelEl.innerText.trim()}` : null;
            if (!restName || !tafelId) {
                showNotification('Kan restaurant of tafel niet bepalen', 'error', 4000);
                return;
            }
            const db = firebase.database();
            const orderlistRef = db.ref(`/${restName}/tafel/${tafelId}/orders/orderlist`);
            const aggregatesRef = db.ref(`/${restName}/tafel/${tafelId}/orders/aggregates`);

            await orderlistRef.remove();
            // Reset aggregates to zero (so any waiter view sees immediate reset)
            await aggregatesRef.update({
                hoofdgerechten: 0,
                desserts: 0,
                totaalPrijs: 0,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            }).catch(() => { });

            // Local state + UI
            order._order = [];
            Ui.receiptDetails(order);
            Ui.summary(order);
            updateQuantityLabels(order._order);
            showNotification('Alle items zijn verwijderd', 'removeFoodInfo', 3000);
        } catch (e) {
            console.error('Clear order failed', e);
            showNotification('Verwijderen mislukt, probeer opnieuw', 'error', 4000);
        }
    });
})();

// Toggle send button highlight based on order contents (uses order._order)
function updateSendButtonHighlight() {
    const desktopBtn = document.getElementById('order-verzend');
    const fabSend = document.querySelector('.fab-action[data-action="send"]');
    const hasItems = Array.isArray(order._order) && order._order.length > 0;
    if (desktopBtn) {
        if (hasItems) {
            desktopBtn.classList.add('send-highlight');
            desktopBtn.setAttribute('aria-label', 'Verzend bestelling');
        } else {
            desktopBtn.classList.remove('send-highlight');
        }
    }
    if (fabSend) {
        if (hasItems) {
            fabSend.classList.add('send-highlight');
            fabSend.setAttribute('aria-label', 'Verzend bestelling');
        } else {
            fabSend.classList.remove('send-highlight');
        }
    }
}

// Hook into receipt render to keep in sync
const originalReceipt = Ui.receiptDetails;
Ui.receiptDetails = function (o) {
    originalReceipt.call(Ui, o);
    updateSendButtonHighlight();
};
// Initial
updateSendButtonHighlight();

document.querySelectorAll(".paypad-show").forEach((button) => {
    button.addEventListener("click", () => {
        Ui.showPaypad(order);
        order.changePayment(JSON.parse(button.getAttribute("data-payment-type")));
    });
});



document.querySelectorAll(".paypad-btn").forEach((button) => {
    button.addEventListener("click", () => {
        order.paypad(button.getAttribute("data-id"));
    });
});

function bevestigen() {
    const confirm = document.getElementById("lastOrderFrame");

    confirm.style.display = "grid";

    google.script.run.withSuccessHandler(function (orderData) {
        showConform();
    }).createTxt();
}



function refreshMainBodyContent() {
    // Code to refresh the content of the mainBody div
    $('#mainBody').load(location.href + ' #mainBody>*', '');
}




async function generateNewOrderNumber() {
    // Fetch restaurant and table details
    const RestNameUrl = window.AppConfig?.restName || 'asianboulevard';
    const tafelIdElement = document.getElementById('tafelNummer');

    // Validate elements
    if (!RestNameUrl || !tafelIdElement) {
        console.error("Required elements (restName or tafelNummer) are missing.");
        throw new Error("Elements missing");
    }

    const tafelId = `Tafel-${tafelIdElement.innerText.trim()}`; // Add "Tafel-" prefix

    const db = firebase.database();
    const ORDER_Number_PATH = `${RestNameUrl}/tafel/${tafelId}/orders/orderNumbers`;
    const orderNumberRef = db.ref(ORDER_Number_PATH);

    try {
        // Retrieve the current order number from Firebase
        const snapshot = await orderNumberRef.once('value');
        let currentNumber = snapshot.val() || 0;
        let newOrderNumber = currentNumber + 1;

        // Update the database with the new order number
        await orderNumberRef.set(newOrderNumber);
        console.log(`New order number ${newOrderNumber} updated in Firebase.`);
        return newOrderNumber; // Return the new order number for further use
    } catch (error) {
        console.error("Error generating new order number:", error);
        throw error; // Re-throw the error for upstream handling
    }
}


//=========================================================================
// 轮数归零的功能，可能要在menukaar里面使用
//=========================================================================
function deleteOrderNumber() {
    const RestNameUrl = window.AppConfig?.restName || 'asianboulevard';
    const tafelIdElement = document.getElementById('tafelNummer');

    // Validate elements
    if (!RestNameUrl || !tafelIdElement) {
        console.error("Required elements (restName or tafelNummer) are missing.");
        return;
    }

    const tafelId = `Tafel-${tafelIdElement.innerText.trim()}`; // Add "Tafel-" prefix
    const OrderNumberPath = `${RestNameUrl}/tafel/${tafelId}/orderNumbers`;
    const orderNumberRef = firebase.database().ref(OrderNumberPath);

    // Ensure user is authenticated before performing delete
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("User is authenticated:", user.uid);

            // Delete the `newordernumber` field
            orderNumberRef.remove()
                .then(() => {
                    console.log(`Order number successfully deleted from Firebase.`);
                })
                .catch(error => {
                    console.error("Error deleting order number:", error);
                });

        } else {
            console.error("User is not authenticated. Cannot delete order number.");
        }
    });
}







function showConform2() {
    const confirm = document.getElementById('orderHistoryFrame');

    confirm.style.display = "grid";
    document.getElementById('close-btn').style.display = 'none';
    google.script.run.withSuccessHandler(function (orderData) {

        document.getElementById('lastOrderPage').innerHTML = `${orderData}`; // 先运行这个功能，把订单信息呈现出来
        document.getElementById('close-btn').style.display = 'block';
        // reload();
        document.getElementById('confirm-close').scrollIntoView({ block: 'start', behavior: 'smooth' }); //自动滚动到关闭窗口的按钮位置
    }).lastOrderInfo();
    google.script.run.createRecordHistory();

    document.getElementById('confirm-close').addEventListener('click', () => {
        $('#mainBody').hide();
        hideComfirm();
    });
}

function showIframe() {
    const confirm = document.getElementById('lastOrderFrame');

    confirm.style.display = "grid";

}






function hideComfirm() {
    const confirm = document.getElementById('orderHistoryFrame');

    confirm.style.display = "none";

}


function hideIframe() {
    const confirm = document.getElementById('lastOrderFrame');

    confirm.style.display = "none";

}





document.getElementById('confirm-close').addEventListener('click', () => {

    hideComfirm();

})





async function waitForAppConfig() {
    while (!window.AppConfig?.configReady) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function startCountdown() {
    try {
        await waitForAppConfig(); // ✅ 等待 AppConfig 初始化完成

        const rest = AppConfig?.restName || 'asianboulevard';
        const tafelId = AppConfig?.tafelId;

        if (!rest || !tafelId) {
            console.error("❌ Missing restName or tafelId in AppConfig.");
            return;
        }

        const timerElement = document.getElementById("timer");
        function showTimer() {
            if (timerElement) timerElement.style.display = "block";
        }
        function hideTimer() {
            if (timerElement) timerElement.style.display = "none";
        }
        // 默认先隐藏 timer，只有倒计时才显示
        if (timerElement) hideTimer();

        const db = firebase.database();
        const timerRef = db.ref(`${rest}/tafel/${tafelId}/timer`);
        const allowOrderRef = db.ref(`${rest}/tafel/settings/allow_self_order`);
        // ✅ 新节点 config/round_time，保留对旧 settings/round_time 的兼容
        const roundTimeConfigRef = db.ref(`${rest}/config/round_time`);
        const roundTimeLegacyRef = db.ref(`${rest}/settings/round_time`); // legacy fallback

        let [timerSnapshot, allowOrderSnapshot, roundTimeSnapshot] = await Promise.all([
            timerRef.once('value'),
            allowOrderRef.once('value'),
            roundTimeConfigRef.once('value')
        ]);
        if (roundTimeSnapshot.val() == null) {
            const legacySnap = await roundTimeLegacyRef.once('value');
            if (legacySnap.val() != null) {
                roundTimeSnapshot = legacySnap;
                console.info('[round_time] Using legacy settings/round_time path (config missing)');
            }
        }

        const timerData = timerSnapshot.val();
        const allowSelfOrder = allowOrderSnapshot.val();
        function normalizeRoundTimeToMinutes(val) {
            const n = Number(val);
            if (!Number.isFinite(n)) return null;
            return n > 1000 ? Math.round(n / 60000) : n; // >1000 视为毫秒
        }

        let configuredRoundTime = normalizeRoundTimeToMinutes(roundTimeSnapshot.val()); // → 分钟

        if (!timerData || !timerData.startTime || !timerData.duration || !timerData.endTime) {
            console.warn("⚠️ No valid timer data found in Firebase.");
            if (timerElement) hideTimer();
            return;
        }

        const timestamp = timerData.startTime;
        let countDownMinutes = timerData.duration;
        let endTime = timerData.endTime;
        const currentTime = Date.now();
        let remainingTime = endTime - currentTime;

        // ✅ 如果配置的 round_time 与当前 timer 中的 duration 不一致（例如配置改成15，timer 还是10），则自动矫正
        if (configuredRoundTime && configuredRoundTime !== countDownMinutes) {
            console.log(`🔄 Detected mismatch: timer.duration=${countDownMinutes} vs config.round_time=${configuredRoundTime}. Updating timer node.`);
            const newEndTime = timestamp + configuredRoundTime * 60 * 1000;
            await timerRef.update({ duration: configuredRoundTime, endTime: newEndTime });
            countDownMinutes = configuredRoundTime;
            endTime = newEndTime;
            remainingTime = endTime - Date.now();
        }

        console.log(`🕒 Timer Data for ${tafelId}:`, {
            timestamp: new Date(timestamp).toLocaleString(),
            countDownMinutes,
            endTime: new Date(endTime).toLocaleString(),
            remainingTime
        });

        if (remainingTime <= 0) {
            if (timerElement) {
                timerElement.innerHTML = "U kunt nu bestellen";
                showTimer();
                setTimeout(hideTimer, 3000); // 3秒后隐藏
            }
            console.log("✅ Timer expired, showing immediate message.");
        } else {
            showTimer();
            updateTimer(endTime, 'timer', "U kunt nu bestellen", function () {
                if (timerElement) {
                    setTimeout(hideTimer, 3000); // 3秒后隐藏
                }
                console.log("✅ Countdown finished!");
            });
        }

        // ✅ 实时监听计时器更新
        timerRef.on('value', (snapshot) => {
            const updatedData = snapshot.val();
            if (updatedData && updatedData.endTime) {
                const newRemainingTime = updatedData.endTime - Date.now();
                if (newRemainingTime > 0) {
                    showTimer();
                    updateTimer(updatedData.endTime, 'timer', "U kunt nu bestellen", function () {
                        if (timerElement) {
                            setTimeout(hideTimer, 3000); // 3秒后隐藏
                        }
                        console.log("⏳ Timer updated dynamically.");
                    });
                } else {
                    if (timerElement) {
                        timerElement.innerHTML = "U kunt nu bestellen";
                        showTimer();
                        setTimeout(hideTimer, 3000); // 3秒后隐藏
                    }
                    console.log("✅ Timer expired, displaying final message.");
                }
            } else {
                if (timerElement) hideTimer();
            }
        });

    } catch (error) {
        console.error("🚨 Error in startCountdown:", error);
    }
}







// Helper function to update timer display and handle completion
function updateTimer(endTime, elementId, finalMessage, onComplete) {
    console.log("Starting timer with end time:", endTime);

    var timerElement = document.getElementById(elementId);
    if (!timerElement) {
        console.error(`Timer element '${elementId}' not found.`);
        return;
    }

    // Clear any existing interval to avoid multiple timers running simultaneously
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }

    window.timerInterval = setInterval(function () {
        var currentTime = Date.now();
        var distance = endTime - currentTime;

        console.log("Current time:", currentTime, "Remaining time:", distance);

        if (distance <= 0) {
            clearInterval(window.timerInterval);
            timerElement.innerHTML = finalMessage || "U kunt nu bestellen"; // Default message when timer finishes
            applyCustomTranslations();
            console.log("Timer completed.");
            if (onComplete) onComplete();
            return;
        }

        var minutes = Math.floor(distance / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Ensure two-digit formatting
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerElement.innerHTML = `<br> <span class="countdown">${minutes}:${seconds}</span>`;
        console.log("Timer running:", `${minutes}:${seconds}`);

    }, 1000);
}




function updateTimerSessie(endTime, elementId, finalMessage, onComplete) {
    var messageShown = false; // Flag to track if the message has been shown
    var timerInterval = setInterval(function () {
        var currentTime = new Date().getTime();
        var distance = endTime - currentTime;

        var hours = Math.floor(distance / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var formattedEndTime = new Date(endTime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

        // Ensure two-digit formatting
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        var timerElement = document.getElementById(elementId);
        if (distance < 0) {
            clearInterval(timerInterval);
            timerElement.innerHTML = finalMessage;
            if (onComplete) onComplete(); // Call the completion callback
        } else {
            timerElement.innerHTML = `<br> <span class="countdown">${hours}:${minutes}:${seconds}</span>`;
            if (hours === '00' && minutes <= '15' && !messageShown) {
                document.getElementById('message-container').innerHTML = 'Het is bijna 2,5 uur geweest. Wilt u nog iets bijbestellen? Uw huidige sessie eindigt rondom <b><font color="goldenrod">' + formattedEndTime + '</font></b>.';
                document.getElementById('message-container').classList.add('visible');
                document.getElementById('overlay-2').classList.add('visible');
                messageShown = true; // Set flag to true to prevent re-display
            }
        }
    }, 1000);
}

document.getElementById('overlay-2').addEventListener('click', function () {
    document.getElementById('message-container').classList.remove('visible');
    this.classList.remove('visible');
});


// ===== BadgeManager (debounced badge quantity updates) =====
// Provides a unified, debounced interface to update menu item quantity badges,
// plus an initial safe sync that waits for DOM rendering to finish.
// Usage: window.BadgeManager.update(orderArray) for debounced updates,
//        window.BadgeManager.updateImmediate(orderArray) for immediate flush,
//        window.BadgeManager.scheduleInitial(orderArray, markSyncedCb) for first paint.
(function () {
    if (window.BadgeManager) return; // singleton guard

    function coreApplyQuantityLabels(orderData) {
        console.log('🏷️ [coreApplyQuantityLabels] 开始处理，订单数组长度:', Array.isArray(orderData) ? orderData.length : 'not array', orderData);
        if (!Ui.ENABLE_MENU_BADGES) {
            document.querySelectorAll('.menu-item .quantityLabel').forEach(l => l.style.display = 'none');
            return;
        }
        const orders = Array.isArray(orderData) ? orderData : [];
        
        // 🔄 安全获取当前设备ID，使用后8位进行比较
        let currentDeviceId;
        if (window.__orderInstance && (window.__orderInstance._deviceId || window.__orderInstance.deviceId)) {
            currentDeviceId = window.__orderInstance._deviceId || window.__orderInstance.deviceId;
        } else {
            // 如果orderInstance未初始化，直接从localStorage获取
            currentDeviceId = localStorage.getItem('deviceId');
            console.log('⚠️ BadgeManager从localStorage获取设备ID:', currentDeviceId);
        }
        
        const currentDeviceIdSuffix = currentDeviceId ? currentDeviceId.slice(-8) : null;
        console.log('🏷️ 当前设备ID后8位:', currentDeviceIdSuffix);
        console.log('🏷️ 可用的菜单项数量:', document.querySelectorAll('.menu-item').length);
        
        // 🎯 只计算当前设备的SKU数量（简化版本）
        const mySkuQuantityMap = new Map();
        
        orders.forEach(orderItem => {
            // 🔧 使用设备ID后8位进行比较
            let isMyOrder = false;
            if (!orderItem.deviceId) {
                isMyOrder = true; // 无deviceId的旧数据
            } else {
                isMyOrder = (orderItem.deviceId.slice(-8) === currentDeviceIdSuffix);
            }
            
            if (isMyOrder) {
                // 🔧 从lineKey中提取原始SKU（移除设备ID后缀）
                let originalSku = orderItem.sku;
                if (originalSku && originalSku.includes('__')) {
                    // 移除 "__default_xxxxxxxx" 后缀
                    originalSku = originalSku.split('__')[0];
                }
                console.log(`🏷️ 我的订单项: 原始SKU=${originalSku}, 描述=${orderItem.description}, 数量=${orderItem.quantity}`);
                const currentQuantity = mySkuQuantityMap.get(originalSku) || 0;
                mySkuQuantityMap.set(originalSku, currentQuantity + (orderItem.quantity || 0));
            }
        });
        
        const currentSKUs = Array.from(mySkuQuantityMap.keys());
        console.log('🏷️ 当前设备的SKU数量映射:', Object.fromEntries(mySkuQuantityMap));
        
        // Remove stray labels in receipt
        document.querySelectorAll('#receipt-details .quantityLabel').forEach(l => l.remove());
        
        // 🎯 使用当前设备的数量更新标签（简化显示）
        let labelsProcessed = 0;
        mySkuQuantityMap.forEach((myQuantity, sku) => {
            const itemElement = document.querySelector(`.menu-item[data-sku="${sku}"]`);
            if (!itemElement) return;
            let quantityLabel = itemElement.querySelector('.quantityLabel');
            if (!quantityLabel) {
                quantityLabel = createQuantityLabel(itemElement);
            }
            
            quantityLabel.textContent = myQuantity;
            quantityLabel.style.display = myQuantity > 0 ? 'inline-block' : 'none';
            quantityLabel.style.color = '#4ecdc4'; // 统一青色，简洁清晰
            quantityLabel.title = `我的数量: ${myQuantity}`;
            labelsProcessed++;
        });
        
        console.log(`✅ 成功处理了${labelsProcessed}个数量标签`);
        
        // 清理不再需要的标签
        document.querySelectorAll('.menu-item .quantityLabel').forEach(label => {
            const parent = label.closest('.menu-item');
            const sku = parent ? parent.getAttribute('data-sku') : null;
            if (!currentSKUs.includes(sku)) {
                label.textContent = 0;
                label.style.display = 'none';
            }
        });
    }

    window.BadgeManager = {
        debounceMs: 90,
        _timer: null,
        _lastData: null,
        update(orderData) {
            this._lastData = orderData;
            if (this._timer) clearTimeout(this._timer);
            this._timer = setTimeout(() => { this._flush(); }, this.debounceMs);
        },
        updateImmediate(orderData) {
            if (this._timer) { clearTimeout(this._timer); this._timer = null; }
            this._lastData = orderData;
            this._flush(true);
        },
        _flush(isImmediate) {
            const data = this._lastData || [];
            this._timer = null;
            try { coreApplyQuantityLabels(data); }
            catch (e) { console.warn('[BadgeManager] apply error', e); }
            if (!isImmediate) this._lastData = null; // keep last data only if immediate can reuse
        },
        scheduleInitial(orderData, markSyncedCb) {
            const maxAttempts = 15; // 增加重试次数
            let attempt = 0;
            const snapshot = Array.isArray(orderData) ? [...orderData] : [];
            const trySync = () => {
                const menuItems = document.querySelectorAll('.menu-item');
                if (menuItems.length) {
                    // 确保DOM完全就绪后再应用标签
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        try {
                            this.updateImmediate(snapshot);
                            if (typeof markSyncedCb === 'function') {
                                try { markSyncedCb(); } catch (e) { console.warn('markSyncedCb error', e); }
                            }
                            console.log(`✅ [BadgeManager] 初始数量标签同步完成 (尝试 ${attempt + 1})`);
                            
                            // 验证数量标签是否真的显示了，如果没有则再次强制应用
                            setTimeout(() => {
                                const visibleLabels = document.querySelectorAll('.menu-item .quantityLabel[style*="inline-block"]');
                                if (visibleLabels.length === 0 && snapshot.length > 0) {
                                    console.log('⚠️ [BadgeManager] 数量标签未显示，强制重新应用');
                                    setTimeout(() => this.updateImmediate(snapshot), 50);
                                }
                            }, 50);
                        } catch (error) {
                            console.error('❌ [BadgeManager] updateImmediate执行失败:', error);
                            // 出错时重试
                            if (attempt < maxAttempts - 1) {
                                attempt++;
                                setTimeout(trySync, 100);
                            }
                        }
                    }));
                } else if (attempt < maxAttempts) {
                    attempt++;
                    const delay = Math.min(50 + attempt * 10, 200); // 渐进式延迟
                    setTimeout(trySync, delay);
                } else {
                    console.error('❌ [BadgeManager] 初始同步失败：找不到菜单元素');
                }
            };
            trySync();
        }
    };

    // Backward compatible function direct call path
    window._applyQuantityLabelsCore = coreApplyQuantityLabels;
})();

// Public (debounced) API used across legacy code.
function updateQuantityLabels(orderData = null) {
    console.log('🔄 [updateQuantityLabels] 被调用，orderData:', orderData);
    if (window.BadgeManager) {
        console.log('🔄 [updateQuantityLabels] 使用BadgeManager.update');
        window.BadgeManager.update(orderData);
    } else {
        console.log('🔄 [updateQuantityLabels] 使用window._applyQuantityLabelsCore直接调用');
        // Fallback: direct apply (should not normally happen)
        window._applyQuantityLabelsCore(orderData);
    }
}




// Helper function to create a quantity label dynamically if it doesn't exist
function createQuantityLabel(itemElement) {
    console.log("Creating quantity label for:", itemElement);
    const quantityLabel = document.createElement('span');
    quantityLabel.className = 'quantityLabel';
    itemElement.appendChild(quantityLabel);
    return quantityLabel;
}







//////////////////////////here under new testing for functions/////////////

// Function to detect and log the user's browser language
function detectUserLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    console.log("User's browser language is:", userLang);
    document.getElementById("translate-popup").style.display = "none";
    return userLang;
}

// Function to show translation popup if user language is not Dutch
function showTranslationPopupIfNeeded() {
    const userLang = detectUserLanguage();
    if (!userLang.startsWith("nl")) { // Show the popup if language is not Dutch
        document.getElementById("translate-popup").style.display = "flex";
    } else {
        return;
    }
}

// Function to remove Google Translate popup
function removeGoogleTranslatePopup() {
    // Check and remove the pop-up by ID
    const popup = document.getElementById('goog-gt-tt');
    if (popup) {
        popup.remove();
    }

    // Check and remove the pop-up by specific class
    const classPopup = document.querySelector('.VIpgJd-suEOdc.VIpgJd-yAWNEb-L7lbkb.skiptranslate');
    if (classPopup) {
        classPopup.remove();
    }
}

// Function to hide Google Translate banner
function hideGoogleTranslateBanner() {
    const googleTranslateBanner = document.querySelector('.goog-te-banner-frame');
    if (googleTranslateBanner) {
        googleTranslateBanner.style.display = 'none';
    }
}



// Main function to run on document load
function onDocumentLoad() {
    // Start countdown

    startCountdown();
    setupTimerListener();
    // Show translation popup if needed
    showTranslationPopupIfNeeded();

    // Remove any Google Translate pop-ups or banners immediately
    removeGoogleTranslatePopup();
    hideGoogleTranslateBanner();

    // Set intervals to catch any delayed pop-ups or banners
    setInterval(removeGoogleTranslatePopup, 1000);
    setInterval(hideGoogleTranslateBanner, 1000);


    // ===== Smooth scroll with highlight effect =====
    document.addEventListener('click', function (e) {
        console.log('🖱️ 点击检测:', e.target);
        
        const target = e.target.closest('.btn-foodlvl2, .btn-drinkslvl2, .btn-lvl3, #service-btn, #btn-service-main');
        if (!target) {
            console.log('❌ 未找到匹配的按钮目标');
            return;
        }

        console.log('✅ 找到按钮目标:', target.className, target.textContent.trim());
        e.preventDefault();
        const targetId = target.getAttribute('href')?.replace('#', '');
        console.log('🎯 目标ID:', targetId);
        
        let targetElement = document.getElementById(targetId);
        console.log('📍 通过ID找到的元素:', targetElement);
        
        // 如果找不到精确的目标元素，尝试查找对应分组的第一个菜单项
        if (!targetElement && targetId) {
            console.log('🔍 没有找到精确目标，开始查找备用元素...');
            // 尝试根据分类名称查找对应的菜单项
            const menuItems = document.querySelectorAll('.menu-item[data-group]');
            console.log('📋 找到菜单项数量:', menuItems.length);
            
            for (const item of menuItems) {
                const itemGroup = item.getAttribute('data-group');
                console.log('🏷️ 检查菜单项分组:', itemGroup);
                // 检查分组名称是否匹配（忽略大小写和特殊字符）
                if (itemGroup && (itemGroup.toLowerCase().includes(targetId.toLowerCase()) || 
                    targetId.toLowerCase().includes(itemGroup.toLowerCase()))) {
                    targetElement = item;
                    console.log('✅ 通过分组匹配找到目标元素');
                    break;
                }
            }
            
            // 如果还没找到，根据按钮类型查找对应的菜单项
            if (!targetElement) {
                const buttonText = target.textContent.toLowerCase().trim();
                console.log('🔍 尝试通过按钮文本查找:', buttonText);
                for (const item of menuItems) {
                    const itemGroup = item.getAttribute('data-group');
                    if (itemGroup && itemGroup.toLowerCase().includes(buttonText)) {
                        targetElement = item;
                        console.log('✅ 通过按钮文本找到目标元素');
                        break;
                    }
                }
            }
        }
        
        if (targetElement) {
            console.log('🎯 最终找到目标元素:', targetElement);
            
            // 记录header的原始位置和状态
            const header = document.querySelector('header');
            const originalHeaderStyle = {
                position: header.style.position || window.getComputedStyle(header).position,
                top: header.style.top || window.getComputedStyle(header).top,
                zIndex: header.style.zIndex || window.getComputedStyle(header).zIndex
            };
            
            console.log('📝 记录header原始状态:', originalHeaderStyle);
            
            // 执行滚动
            targetElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
            
            // 滚动完成后强制恢复header位置
            setTimeout(() => {
                forceHeaderToTop();
                console.log('✅ Header位置已强制恢复');
            }, 800); // 等待滚动动画完成
            
            animateHighlight(targetElement);
        } else {
            console.warn(`❌ 未找到目标元素: ${targetId}`);
        }
    });

    // 自定义滚动函数，确保header不被挤出
    function scrollToElementWithHeaderOffset(element) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 70; // 默认70px
        
        // 获取元素相对于文档的绝对位置
        const elementRect = element.getBoundingClientRect();
        const elementTop = elementRect.top + window.pageYOffset;
        const scrollTop = elementTop - headerHeight - 20; // 额外20px间距
        
        console.log('📏 Header高度:', headerHeight);
        console.log('📍 目标元素绝对位置:', elementTop);
        console.log('📍 当前滚动位置:', window.pageYOffset);
        console.log('🎯 滚动到位置:', scrollTop);
        
        // 检查是否真的需要滚动
        const targetScrollTop = Math.max(0, scrollTop);
        if (Math.abs(window.pageYOffset - targetScrollTop) > 10) {
            window.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
            });
        } else {
            console.log('📌 目标已经在合适位置，无需滚动');
        }
    }

    // 强制重置header位置的函数
    function forceHeaderToTop() {
        const header = document.querySelector('header');
        if (!header) return;
        
        console.log('🔧 强制重置header到顶部');
        
        // 强制设置header样式
        header.style.position = 'relative';
        header.style.top = '0';
        header.style.left = '0';
        header.style.right = '0';
        header.style.zIndex = '1000';
        header.style.transform = 'none';
        header.style.marginTop = '0';
        header.style.marginBottom = '0';
        
        // 确保body的滚动不会影响header
        document.body.style.paddingTop = '0';
        
        // 检查header是否真的在顶部
        const headerRect = header.getBoundingClientRect();
        console.log('📏 Header当前位置:', headerRect.top);
        
        if (headerRect.top < -10) {
            console.log('⚠️ Header仍然被挤出，强制滚动页面');
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    function animateHighlight(element) {
        console.log('🎨 开始高亮动画，目标元素:', element);
        console.log('🎨 元素类名:', element.className);
        console.log('🎨 元素ID:', element.id);
        
        // 使用更高优先级的样式来覆盖主题CSS
        element.style.setProperty('background', '#ffeb3b', 'important');
        element.style.setProperty('background-color', '#ffeb3b', 'important');
        element.style.transition = 'background-color 0.5s ease';
        
        console.log('🎨 已设置高优先级背景色');
        
        setTimeout(() => {
            element.style.removeProperty('background');
            element.style.removeProperty('background-color');
            console.log('🎨 已清除高亮背景色');
        }, 1500);
    }

    ///////prevent overlay-2 to refresh the page by touchmove action from the users
    const layers = document.querySelectorAll('.prevent-scroll');
    const touchThreshold = 50; // Set a threshold in pixels
    let startY = 0;

    layers.forEach(layer => {
        layer.addEventListener('touchstart', (event) => {
            startY = event.touches[0].clientY; // Record the initial Y position
        });

        layer.addEventListener('touchmove', (event) => {
            const currentY = event.touches[0].clientY;
            const deltaY = Math.abs(currentY - startY);

            if (deltaY > touchThreshold) {
                event.preventDefault(); // Prevent the default behavior if the threshold is exceeded
            }
        }, { passive: false });
    });
}

// Event listeners for the buttons in the translation popup,目前的問題是用了翻譯功能的話，console裡面會有報錯，不過不影響使用。
document.addEventListener("DOMContentLoaded", () => {
    // ✅ 函数：设置辅助属性（避免因翻译或动态加载导致属性丢失）
    function applyAttributes() {
        const elements = document.querySelectorAll(
            ".add-to-order, .quantity-adjust.increase-quantity, .quantity-adjust.delete, .menu-item, .close-message-bar, .btn-outline-success"
        );

        elements.forEach((element) => {
            try {
                // ✅ 确保该元素支持 setAttribute（跳过 SVG 或 null）
                if (element && typeof element.setAttribute === "function") {
                    element.setAttribute("aria-pressed", "false");
                }
            } catch (err) {
                console.warn("⚠️ Failed to apply attributes:", element, err);
            }
        });
    }

    // ✅ 初次调用，确保页面加载后立即执行一次
    applyAttributes();

    // ✅ 延迟调用一次，用于兼容 Google Translate 动态修改后的情况
    setTimeout(applyAttributes, 1000);

    // ✅ MutationObserver：监听 DOM 变化，持续修复翻译后的元素属性
    const observer = new MutationObserver((mutations) => {
        applyAttributes();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ✅ 处理 Google Translate 弹窗按钮
    const yesBtn = document.getElementById("translate-yes");
    const noBtn = document.getElementById("translate-no");
    const popup = document.getElementById("translate-popup");
    const widget = document.getElementById("google_translate_element");

    if (yesBtn && widget && popup) {
        yesBtn.addEventListener("click", () => {
            widget.style.display = "block";
            popup.style.display = "none";
            console.log("✅ User accepted translation.");
        });
    }

    if (noBtn && popup) {
        noBtn.addEventListener("click", () => {
            popup.style.display = "none";
            console.log("❎ User declined translation.");
        });
    }
});



// Run onDocumentLoad when the document is fully loaded
document.addEventListener("DOMContentLoaded", onDocumentLoad);

