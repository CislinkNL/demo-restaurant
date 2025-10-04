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
}
class Ui {
    static menu(orderInstance) {
        // Clear existing menu items before rendering new ones
        const menuContainer = document.getElementById("menu");
        if (menuContainer) {
            menuContainer.innerHTML = '';
        }
        
        let frag = document.createDocumentFragment();

        orderInstance.menu.forEach(item => {
            // ✅ 确保image路径有效，提供默认值
            const imageUrl = item.image || '/images/placeholder.webp';
            
            let menuElement = `<img src="${imageUrl}" alt="${item.displayName || item.description}" id="${item.id}" class="menu-img">
        <figcaption>${item.displayName || item.description}</figcaption>
        <figcaption class="menu-price">${Utilities.convertFloatToString(item.price)}</figcaption>`;

            let node = document.createElement("figure");
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
                let itemData = null; // ✅ 将变量定义移到外面
                
                try {
                    // ✅ 获取 SKU，确保能从 menu 里找到该项
                    const sku = button.getAttribute("data-sku");

                    // ✅ SKU验证
                    if (window.SKUGuard && !window.SKUGuard.isValidSKU(sku)) {
                        console.error(`❌ 无效的SKU: ${sku}`);
                        if (typeof showNotification === 'function') {
                            showNotification('商品信息错误，请刷新页面重试', 'error', 3000);
                        }
                        return;
                    }

                    // ✅ 从 `orderInstance.menu` 里查找完整数据
                    itemData = orderInstance.menu.find(item => item.sku === sku);
                    if (!itemData) {
                        console.error(`❌ Item with SKU ${sku} not found in menu!`);
                        if (typeof showNotification === 'function') {
                            showNotification('找不到该商品，请刷新页面重试', 'error', 3000);
                        }
                        return;
                    }
                } catch (error) {
                    console.error('菜单项点击处理出错:', error);
                    if (typeof showNotification === 'function') {
                        showNotification('操作失败，请重试', 'error', 3000);
                    }
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

                // ✅ 读取当前数量（默认值 1）
                const quantityLabel = button.querySelector('.quantityLabel');
                const currentQuantity = quantityLabel ? parseInt(quantityLabel.textContent, 10) || 1 : 1;

                // ✅ 调试日志，确保数据正确
                console.log("✅ Item clicked:", itemDetails);
                console.log("✅ Options passed to message bar:", itemDetails.options);

                // ✅ 传递数据到 `createAndShowMessageBar`
                createAndShowMessageBar(itemDetails, orderInstance, currentQuantity);
            });
        });


    }




    static receiptDetails(orderInstance) {
        try {
            // Render using current in-memory order; realtime listener updates _order when Firebase changes
            const orderArray = orderInstance.order || orderInstance._order || [];
            const receiptDetails = document.getElementById("receipt-details");
            if (!receiptDetails) return;

            let frag = document.createDocumentFragment();

            orderArray.forEach((orderLine, index) => {
                // ✅ SKU错误防护 - 验证订单行
                let validatedOrderLine = orderLine;
                if (window.SKUGuard) {
                    try {
                        validatedOrderLine = window.SKUGuard.validateOrderLine(orderLine);
                        if (validatedOrderLine.sku === window.SKUGuard.fallbackSKU) {
                            console.warn(`跳过显示无效订单行: ${orderLine.sku}`);
                            return;
                        }
                    } catch (error) {
                        console.error(`订单行验证失败: ${orderLine.sku}`, error);
                        return;
                    }
                }
                const row = document.createElement('tr');
                row.setAttribute('data-sku', validatedOrderLine.sku);
                row.setAttribute('data-index', index);
                if (validatedOrderLine.lineKey) row.setAttribute('data-lineKey', validatedOrderLine.lineKey);
                row.innerHTML = `
                <td class="sku">${validatedOrderLine.sku}</td>
                <td class="description">${validatedOrderLine.description}</td>
                <td class="quantity">${validatedOrderLine.quantity}</td>
                <td class="price">${Utilities.convertFloatToString((validatedOrderLine.price || 0) * (validatedOrderLine.quantity || 0))}</td>
<td class="modify-quantity">
  <button class="delete" data-index="${index}" aria-label="减少">−</button>
  <button class="increase-quantity" data-index="${index}" aria-label="增加">＋</button>
</td>
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
        } catch (error) {
            console.error('订单详情显示出错:', error);
            if (typeof showNotification === 'function') {
                showNotification('订单显示错误，请刷新页面', 'error', 3000);
            }
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
order.setupRealtimeListeners();




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




async function generateNewOrderNumber(providedTafelId = null) {
    // Fetch restaurant and table details
    const RestNameUrl = window.AppConfig?.restName || 'asianboulevard';
    const tafelIdElement = document.getElementById('tafelNummer');

    // Validate elements
    if (!RestNameUrl || !tafelIdElement) {
        console.error("Required elements (restName or tafelNummer) are missing.");
        throw new Error("Elements missing");
    }
    
    // 员工版本：使用传入的tafelId或从DOM获取当前桌号
    let tafelId;
    if (providedTafelId) {
        // 如果已经传入了完整的tafelId（如 "Tafel-5"），直接使用
        tafelId = providedTafelId;
    } else {
        // 否则从DOM获取并添加前缀
        tafelId = `Tafel-${tafelIdElement.innerText.trim()}`;
    }

    console.log(`🔢 生成新订单号 for ${tafelId}`);

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
        console.log(`✅ New order number ${newOrderNumber} updated in Firebase for ${tafelId}`);
        
        // 更新UI显示
        document.getElementById('lastInvoiceNum').innerText = newOrderNumber;
        document.getElementById('invoice-number').textContent = `Bestel#  ${newOrderNumber}`;
        
        return newOrderNumber; // Return the new order number for further use
    } catch (error) {
        console.error("❌ Error generating new order number:", error);
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
        
        // 强制恢复header位置（防止被顶出屏幕）
        setTimeout(() => {
            const header = document.querySelector('header');
            if (header) {
                header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 1000);
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
        if (!Ui.ENABLE_MENU_BADGES) {
            document.querySelectorAll('.menu-item .quantityLabel').forEach(l => l.style.display = 'none');
            return;
        }
        const orders = Array.isArray(orderData) ? orderData : [];
        const currentSKUs = orders.map(item => item.sku);
        // Remove stray labels in receipt
        document.querySelectorAll('#receipt-details .quantityLabel').forEach(l => l.remove());
        orders.forEach(orderItem => {
            const itemElement = document.querySelector(`.menu-item[data-sku="${orderItem.sku}"]`);
            if (!itemElement) return;
            let quantityLabel = itemElement.querySelector('.quantityLabel');
            if (!quantityLabel) quantityLabel = createQuantityLabel(itemElement);
            quantityLabel.textContent = orderItem.quantity;
            quantityLabel.style.display = orderItem.quantity > 0 ? 'inline-block' : 'none';
        });
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
            const maxAttempts = 10;
            let attempt = 0;
            const snapshot = Array.isArray(orderData) ? [...orderData] : [];
            const trySync = () => {
                const menuItems = document.querySelectorAll('.menu-item');
                if (menuItems.length) {
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        this.updateImmediate(snapshot);
                        if (typeof markSyncedCb === 'function') {
                            try { markSyncedCb(); } catch (e) { console.warn('markSyncedCb error', e); }
                        }
                        console.log(`[BadgeManager] initial sync success attempt ${attempt + 1}`);
                    }));
                } else if (attempt < maxAttempts) {
                    attempt++;
                    setTimeout(trySync, 50);
                } else {
                    console.warn('[BadgeManager] initial sync failed (no menu items)');
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
    if (window.BadgeManager) {
        window.BadgeManager.update(orderData);
    } else {
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

// 翻译功能已禁用 - Translation functions disabled for staff interface



// Main function to run on document load
function onDocumentLoad() {
    // 员工版本禁用倒计时器 - 延迟检查确保AppConfig已加载
    setTimeout(() => {
        if (window.AppConfig && AppConfig.timeLimit === false) {
            console.log("✅ 员工版本：倒计时器已禁用");
            // 设置定时器为"可以下单"状态
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.innerHTML = "U kunt nu bestellen";
            }
        } else {
            // Start countdown only if time limit is enabled or AppConfig not loaded yet
            startCountdown();
            setupTimerListener();
        }
    }, 500); // 等待AppConfig加载
    
    // 翻译功能已禁用 - Translation functions disabled
    console.log("员工界面：翻译功能已禁用");
}


    // ===== Smooth scroll with highlight effect =====
    document.addEventListener('click', function (e) {
        const target = e.target.closest('.btn-foodlvl2, .btn-drinkslvl2, .btn-lvl3, #service-btn, #btn-service-main');
        if (!target) return;

        e.preventDefault();
        const targetId = target.getAttribute('href')?.replace('#', '');
        let targetElement = document.getElementById(targetId);
        
        // 如果找不到精确的目标元素，尝试查找对应分组的第一个菜单项
        if (!targetElement && targetId) {
            // 尝试根据分类名称查找对应的菜单项
            const menuItems = document.querySelectorAll('.menu-item[data-group]');
            for (const item of menuItems) {
                const itemGroup = item.getAttribute('data-group');
                // 检查分组名称是否匹配（忽略大小写和特殊字符）
                if (itemGroup && (itemGroup.toLowerCase().includes(targetId.toLowerCase()) || 
                    targetId.toLowerCase().includes(itemGroup.toLowerCase()))) {
                    targetElement = item;
                    break;
                }
            }
            
            // 如果还没找到，根据按钮类型查找对应的菜单项
            if (!targetElement) {
                const buttonText = target.textContent.toLowerCase().trim();
                for (const item of menuItems) {
                    const itemGroup = item.getAttribute('data-group');
                    if (itemGroup && itemGroup.toLowerCase().includes(buttonText)) {
                        targetElement = item;
                        break;
                    }
                }
            }
        }
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 强制恢复header位置（防止被顶出屏幕）
            setTimeout(() => {
                const header = document.querySelector('header');
                if (header) {
                    header.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 1000);
            
            animateHighlight(targetElement);
        } else {
            console.warn(`未找到目标元素: ${targetId}`);
        }
    });

    function animateHighlight(element) {
        element.style.transition = 'background-color 0.5s ease';
        element.style.backgroundColor = '#ffeb3b';
        setTimeout(() => {
            element.style.backgroundColor = '';
        }, 1500);
    }

    ///////prevent overlay-2 to refresh the page by touchmove action from the users
    const layers = document.querySelectorAll('.prevent-scroll');
    const touchThreshold = 50; // Set a threshold in pixels
    let overlayStartY = 0; // Renamed to avoid conflict with javascript.js

    layers.forEach(layer => {
        layer.addEventListener('touchstart', (event) => {
            overlayStartY = event.touches[0].clientY; // Record the initial Y position
        });

        layer.addEventListener('touchmove', (event) => {
            const currentY = event.touches[0].clientY;
            const deltaY = Math.abs(currentY - overlayStartY);

            if (deltaY > touchThreshold) {
                event.preventDefault(); // Prevent the default behavior if the threshold is exceeded
            }
        }, { passive: false });
    });

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

    // 翻译功能已禁用 - Translation popup handlers disabled
    console.log("员工界面：翻译弹窗处理已禁用");
});



// Run onDocumentLoad when the document is fully loaded
document.addEventListener("DOMContentLoaded", onDocumentLoad);

// ===== 控制面板功能 =====

// 获取当前桌号的辅助函数
function getTableNumber() {
    // 优先从 window.tableNumber 获取
    if (window.tableNumber) {
        return window.tableNumber;
    }
    
    // 从 DOM 元素获取
    const tafelNummerElement = document.getElementById('tafelNummer');
    if (tafelNummerElement && tafelNummerElement.textContent.trim()) {
        return tafelNummerElement.textContent.trim();
    }
    
    // 从下拉选择器获取
    const tableSelect = document.getElementById('table-select');
    if (tableSelect && tableSelect.value) {
        return tableSelect.value;
    }
    
    // 默认返回 1
    console.warn('⚠️ Unable to get table number, using default: 1');
    return '1';
}

class ControlPanel {
    constructor() {
        console.log('🏗️ 创建控制面板实例...');
        
        // 防止重复创建
        if (window.controlPanelInstance && window.controlPanelInstance !== this) {
            console.warn('⚠️ 控制面板实例已存在，返回现有实例');
            return window.controlPanelInstance;
        }
        
        this.overlay = document.getElementById('control-panel-overlay');
        this.modal = document.getElementById('control-panel-modal');
        this.tableInfoSpan = document.getElementById('current-table-info');
        this.personCountInput = document.getElementById('person-count');
        this.menuCountInput = document.getElementById('menu-count');
        this.allinToggle = document.getElementById('all-in-toggle');
        this.statusText = document.getElementById('all-in-status');
        this.menuTypeToggle = document.getElementById('menu-type-toggle');
        this.menuTypeStatusText = document.getElementById('menu-type-status');
        this.eventListenersInitialized = false; // 添加标记防止重复初始化
        
        // 确保面板初始状态为隐藏
        if (this.overlay) {
            this.overlay.style.display = 'none';
            this.overlay.classList.remove('active');
            console.log('✅ 控制面板初始状态设置为隐藏');
        } else {
            console.error('❌ 无法找到控制面板overlay元素');
        }
        
        this.initializeEventListeners();
        
        // 延迟加载当前值，给Firebase更多时间初始化
        setTimeout(() => {
            this.loadCurrentValues();
        }, 500);
        
        // 将实例保存到全局
        window.controlPanelInstance = this;
        console.log('✅ 控制面板构造完成');
    }

    initializeEventListeners() {
        // 防止重复初始化事件监听器
        if (this.eventListenersInitialized) {
            console.log('⚠️ 事件监听器已初始化，跳过重复初始化');
            return;
        }
        
        console.log('🔗 初始化控制面板事件监听器...');
        
        // 打开控制面板
        const controlPanelBtn = document.getElementById('open-control-panel');
        if (controlPanelBtn) {
            // 移除之前的监听器（如果有）
            controlPanelBtn.removeEventListener('click', this.openPanelHandler);
            // 创建绑定的处理函数
            this.openPanelHandler = () => {
                console.log('🖱️ 控制面板按钮被点击');
                this.openPanel();
            };
            controlPanelBtn.addEventListener('click', this.openPanelHandler);
            console.log('✅ 控制面板打开按钮事件绑定成功');
        } else {
            console.error('❌ 无法找到控制面板打开按钮');
        }

        // 关闭控制面板
        const closeControlPanel = document.getElementById('close-control-panel');
        if (closeControlPanel) {
            closeControlPanel.addEventListener('click', () => {
                console.log('🖱️ 控制面板关闭按钮被点击');
                this.closePanel();
            });
            console.log('✅ 控制面板关闭按钮事件绑定成功');
        } else {
            console.error('❌ 无法找到控制面板关闭按钮');
        }

        // 关闭控制面板（底部按钮）
        const closeControlPanelFooter = document.getElementById('close-control-panel-footer');
        if (closeControlPanelFooter) {
            closeControlPanelFooter.addEventListener('click', () => {
                this.closePanel();
            });
        }

        // 点击遮罩层关闭
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.closePanel();
                }
            });
        }

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay && this.overlay.classList.contains('active')) {
                this.closePanel();
            }
        });

        // 人数调整按钮
        const decreasePersons = document.getElementById('decrease-persons');
        if (decreasePersons) {
            decreasePersons.addEventListener('click', () => {
                this.adjustPersonCount(-1);
            });
        }

        const increasePersons = document.getElementById('increase-persons');
        if (increasePersons) {
            increasePersons.addEventListener('click', () => {
                this.adjustPersonCount(1);
            });
        }

        // 人数输入框
        this.personCountInput = document.getElementById('person-count');
        if (this.personCountInput) {
            this.personCountInput.addEventListener('change', () => {
                this.validatePersonCount();
            });
        }

        // 套餐数量调整按钮
        const decreaseMenu = document.getElementById('decrease-menu');
        if (decreaseMenu) {
            decreaseMenu.addEventListener('click', () => {
                this.adjustMenuCount(-1);
            });
        }

        const increaseMenu = document.getElementById('increase-menu');
        if (increaseMenu) {
            increaseMenu.addEventListener('click', () => {
                this.adjustMenuCount(1);
            });
        }

        // 套餐数量输入框
        this.menuCountInput = document.getElementById('menu-count');
        if (this.menuCountInput) {
            this.menuCountInput.addEventListener('change', () => {
                this.validateMenuCount();
            });
        }

        // 全包套餐开关
        this.allinToggle = document.getElementById('all-in-toggle');
        if (this.allinToggle) {
            this.allinToggle.addEventListener('change', () => {
                this.toggleAllinPackage();
            });
        }

        // 菜单类型开关
        this.menuTypeToggle = document.getElementById('menu-type-toggle');
        if (this.menuTypeToggle) {
            this.menuTypeToggle.addEventListener('change', () => {
                this.toggleMenuType();
            });
        }

        // 功能按钮
        const updatePersons = document.getElementById('update-persons');
        if (updatePersons) {
            updatePersons.addEventListener('click', () => {
                this.updatePersonCount();
            });
        }

        const updateMenuCount = document.getElementById('update-menu-count');
        if (updateMenuCount) {
            updateMenuCount.addEventListener('click', () => {
                this.updateMenuCount();
            });
        }

        const updateAllin = document.getElementById('update-all-in');
        if (updateAllin) {
            updateAllin.addEventListener('click', () => {
                this.updateAllinStatus();
            });
        }

        const clearCurrentOrders = document.getElementById('clear-current-orders');
        if (clearCurrentOrders) {
            clearCurrentOrders.addEventListener('click', () => {
                this.clearCurrentOrder();
            });
        }

        const clearOrderHistory = document.getElementById('clear-order-history');
        if (clearOrderHistory) {
            clearOrderHistory.addEventListener('click', () => {
                this.clearOrderHistory();
            });
        }

        const resetOrderNumber = document.getElementById('reset-order-number');
        if (resetOrderNumber) {
            resetOrderNumber.addEventListener('click', () => {
                this.resetOrderNumbers();
            });
        }

        const resetAllSettings = document.getElementById('reset-all-settings');
        if (resetAllSettings) {
            // 移除之前的监听器（如果有）
            resetAllSettings.removeEventListener('click', this.resetAllSettingsHandler);
            // 创建绑定的处理函数
            this.resetAllSettingsHandler = () => {
                this.resetAllSettings();
            };
            resetAllSettings.addEventListener('click', this.resetAllSettingsHandler);
        }
        
        // 标记事件监听器已初始化
        this.eventListenersInitialized = true;
        console.log('✅ 所有事件监听器初始化完成');
    }

    async loadCurrentValues() {
        try {
            // 获取餐厅名和桌号
            const restName = window.AppConfig?.restName || 'asianboulevard';
            const tableNumber = getTableNumber();
            const tafelId = `Tafel-${tableNumber}`;
            
            if (this.tableInfoSpan) {
                this.tableInfoSpan.textContent = `Tafel - ${tableNumber}`;
            }

            // 获取当前人数 - 修正路径
            const personCountRef = firebase.database().ref(`${restName}/tafel/${tafelId}/Persons`);
            const personSnapshot = await personCountRef.once('value');
            const currentPersonCount = personSnapshot.val() || 2;
            if (this.personCountInput) {
                this.personCountInput.value = currentPersonCount;
            }

            // 获取菜单计数 - 修正路径到 orders/menu
            const menuCountRef = firebase.database().ref(`${restName}/tafel/${tafelId}/orders/menu`);
            const menuSnapshot = await menuCountRef.once('value');
            const menuCount = menuSnapshot.val() || 0;
            if (this.menuCountInput) {
                this.menuCountInput.value = menuCount;
            }

            // 获取全包套餐状态 - 修正路径到 orders/all_in_met
            const allinRef = firebase.database().ref(`${restName}/tafel/${tafelId}/orders/all_in_met`);
            const allinSnapshot = await allinRef.once('value');
            const isAllinActive = allinSnapshot.val() || false;
            if (this.allinToggle) {
                this.allinToggle.checked = isAllinActive;
            }
            this.updateAllinStatusText(isAllinActive);

            // 获取菜单类型状态
            const menuTypeRef = firebase.database().ref(`${restName}/tafel/${tafelId}/menuType`);
            const menuTypeSnapshot = await menuTypeRef.once('value');
            const menuType = menuTypeSnapshot.val() || 'dinner';
            const isLunchActive = menuType === 'lunch';
            if (this.menuTypeToggle) {
                this.menuTypeToggle.checked = isLunchActive;
            }
            this.updateMenuTypeStatusText(isLunchActive);

        } catch (error) {
            console.error('❌ Error loading control panel values:', error);
            this.showNotification('Fout bij laden van gegevens: ' + error.message, 'error');
        }
    }

    openPanel() {
        console.log('🔓 打开控制面板');
        if (this.overlay) {
            this.overlay.style.display = 'flex';
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.loadCurrentValues(); // 重新加载当前值
        } else {
            console.error('❌ 控制面板overlay元素未找到');
        }
    }

    closePanel() {
        console.log('🔒 关闭控制面板');
        if (this.overlay) {
            this.overlay.classList.remove('active');
            // 延迟隐藏，等待CSS动画完成
            setTimeout(() => {
                if (!this.overlay.classList.contains('active')) {
                    this.overlay.style.display = 'none';
                }
            }, 300);
            document.body.style.overflow = '';
        } else {
            console.error('❌ 控制面板overlay元素未找到');
        }
    }

    adjustPersonCount(delta) {
        if (this.personCountInput) {
            const currentValue = parseInt(this.personCountInput.value) || 2;
            const newValue = Math.max(1, Math.min(20, currentValue + delta));
            this.personCountInput.value = newValue;
        }
    }

    validatePersonCount() {
        if (this.personCountInput) {
            const value = parseInt(this.personCountInput.value);
            if (isNaN(value) || value < 1) {
                this.personCountInput.value = 1;
            } else if (value > 20) {
                this.personCountInput.value = 20;
            }
        }
    }

    updateAllinStatusText(isActive) {
        if (this.statusText) {
            this.statusText.textContent = isActive ? 'Aan' : 'Uit';
            this.statusText.classList.toggle('active', isActive);
        }
    }

    updateMenuTypeStatusText(isLunch) {
        if (this.menuTypeStatusText) {
            this.menuTypeStatusText.textContent = isLunch ? 'Lunch' : 'Dinner';
            this.menuTypeStatusText.classList.toggle('active', isLunch);
        }
    }

    async toggleMenuType() {
        if (!this.menuTypeToggle) return;
        
        const restName = window.AppConfig?.restName || 'asianboulevard';
        const tableNumber = getTableNumber();
        const tafelId = `Tafel-${tableNumber}`;
        const isLunch = this.menuTypeToggle.checked;
        const menuType = isLunch ? 'lunch' : 'dinner';
        
        try {
            const menuTypeRef = firebase.database().ref(`${restName}/tafel/${tafelId}/menuType`);
            await menuTypeRef.set(menuType);
            
            console.log(`✅ Menu type bijgewerkt: ${menuType} naar pad ${restName}/tafel/${tafelId}/menuType`);
            this.updateMenuTypeStatusText(isLunch);
            // 移除notification，因为已经有toast显示了
            
        } catch (error) {
            console.error('❌ Fout bij wijzigen menu type:', error);
            this.menuTypeToggle.checked = !isLunch; // 回滚状态
            this.showNotification('Wijzigen van menu type mislukt: ' + error.message, 'error');
        }
    }

    async toggleAllinPackage() {
        if (!this.allinToggle) return;
        
        const restName = window.AppConfig?.restName || 'asianboulevard';
        const tableNumber = getTableNumber();
        const tafelId = `Tafel-${tableNumber}`;
        const isActive = this.allinToggle.checked;
        
        try {
            const allinRef = firebase.database().ref(`${restName}/tafel/${tafelId}/orders/all_in_met`);
            await allinRef.set(isActive);
            
            console.log(`✅ All-in状态已更新: ${isActive} 到路径 ${restName}/tafel/${tafelId}/orders/all_in_met`);
            this.updateAllinStatusText(isActive);
            this.showNotification(`All-in menu ${isActive ? 'ingeschakeld' : 'uitgeschakeld'}`, 'success');
            
        } catch (error) {
            console.error('❌ Error toggling all-in package:', error);
            this.allinToggle.checked = !isActive; // 回滚状态
            this.showNotification('Wijzigen van All-in menu status mislukt: ' + error.message, 'error');
        }
    }

    async updatePersonCount() {
        if (!this.personCountInput) return;
        
        const restName = window.AppConfig?.restName || 'asianboulevard';
        const tableNumber = getTableNumber();
        const tafelId = `Tafel-${tableNumber}`;
        const personCount = parseInt(this.personCountInput.value);
        
        if (isNaN(personCount) || personCount < 1 || personCount > 20) {
            this.showNotification('Voer een geldig aantal personen in (1-20)', 'error');
            return;
        }

        try {
            const personRef = firebase.database().ref(`${restName}/tafel/${tafelId}/Persons`);
            await personRef.set(personCount);
            
            this.showNotification(`Aantal personen bijgewerkt naar ${personCount}`, 'success');
            
        } catch (error) {
            console.error('❌ Error updating person count:', error);
            this.showNotification('Bijwerken van aantal personen mislukt: ' + error.message, 'error');
        }
    }

    async clearCurrentOrder() {
        if (!confirm('Weet u zeker dat u de huidige bestelling wilt wissen? Deze actie kan niet ongedaan worden gemaakt.')) {
            return;
        }

        const restName = window.AppConfig?.restName || 'asianboulevard';
        const tableNumber = getTableNumber();
        const tafelId = `Tafel-${tableNumber}`;
        
        try {
            const orderRef = firebase.database().ref(`${restName}/tafel/${tafelId}/order`);
            await orderRef.remove();
            
            // 更新UI
            if (window.order) {
                window.order._order = [];
                Ui.receiptDetails(window.order);
                updateSendBadgeFromOrder([]);
            }
            
            this.showNotification('Huidige bestelling gewist', 'success');
            
        } catch (error) {
            console.error('❌ Error clearing current order:', error);
            this.showNotification('Wissen van bestelling mislukt: ' + error.message, 'error');
        }
    }

    async clearOrderHistory() {
        if (!confirm('Weet u zeker dat u de bestelgeschiedenis wilt wissen? Deze actie kan niet ongedaan worden gemaakt.')) {
            return;
        }

        const restName = window.AppConfig?.restName || 'asianboulevard';
        const tableNumber = getTableNumber();
        const tafelId = `Tafel-${tableNumber}`;
        
        try {
            // 修正历史订单路径为 /tafel/Tafel-xxx/orders/history
            const historyRef = firebase.database().ref(`${restName}/tafel/${tafelId}/orders/history`);
            await historyRef.remove();
            
            console.log(`✅ 历史订单已清空，路径: ${restName}/tafel/${tafelId}/orders/history`);
            this.showNotification('Bestelgeschiedenis gewist', 'success');
            
        } catch (error) {
            console.error('❌ Error clearing order history:', error);
            this.showNotification('Wissen van bestelgeschiedenis mislukt: ' + error.message, 'error');
        }
    }

    async resetOrderNumbers() {
        if (!confirm('Weet u zeker dat u het bestelnummer wilt resetten? Dit zal alle volgende bestellingen beïnvloeden.')) {
            return;
        }

        const restName = window.AppConfig?.restName || 'asianboulevard';
        const tableNumber = getTableNumber();
        const tafelId = `Tafel-${tableNumber}`;

        try {
            // 修正订单号路径为特定桌台的 /tafel/Tafel-xxx/orders/orderNumbers
            const orderNumberRef = firebase.database().ref(`${restName}/tafel/${tafelId}/orders/orderNumbers`);
            await orderNumberRef.set(1);
            
            console.log(`✅ 订单编号已重置为1，路径: ${restName}/tafel/${tafelId}/orders/orderNumbers`);
            this.showNotification('Bestelnummer gereset naar 1', 'success');
            
        } catch (error) {
            console.error('❌ Error resetting order numbers:', error);
            this.showNotification('Resetten van bestelnummer mislukt: ' + error.message, 'error');
        }
    }

    async resetAllSettings() {
        if (!confirm('Weet u zeker dat u alle instellingen wilt resetten? Dit zal het aantal personen, geschiedenis, menu-aantallen en andere instellingen resetten, maar belangrijke gegevens behouden. Deze actie kan niet ongedaan worden gemaakt!')) {
            return;
        }

        const restName = window.AppConfig?.restName || 'asianboulevard';
        const tableNumber = getTableNumber();
        const tafelId = `Tafel-${tableNumber}`;
        
        try {
            const tableRef = firebase.database().ref(`${restName}/tafel/${tafelId}`);
            
            // 使用 update() 而不是 set() 来只更新指定字段，保留其他数据
            await tableRef.update({
                'Persons': 1,
                'orders/history': '',
                'orders/all_in_met': 'false', 
                'orders/menu': 0,
                'orders/orderNumbers': 1,
                'menuType': 'dinner'
            });
            
            console.log(`✅ 指定设置已重置，路径: ${restName}/tafel/${tafelId}`);
            console.log('重置字段: Persons=1, orders/history="", orders/all_in_met="false", orders/menu=0, orders/orderNumbers=1, menuType="dinner"');
            
            // 重新加载控制面板数据
            await this.loadCurrentValues();
            
            // 更新UI
            if (window.order) {
                window.order._order = [];
                Ui.receiptDetails(window.order);
                updateSendBadgeFromOrder([]);
            }
            
            this.showNotification('Instellingen gereset', 'success');
            
        } catch (error) {
            console.error('❌ Error resetting all settings:', error);
            this.showNotification('Resetten van alle instellingen mislukt: ' + error.message, 'error');
        }
    }

    // 套餐数量调整方法
    adjustMenuCount(delta) {
        if (this.menuCountInput) {
            const currentValue = parseInt(this.menuCountInput.value) || 0;
            const newValue = Math.max(0, Math.min(10, currentValue + delta));
            this.menuCountInput.value = newValue;
        }
    }

    // 验证套餐数量输入
    validateMenuCount() {
        if (this.menuCountInput) {
            const value = parseInt(this.menuCountInput.value);
            if (isNaN(value) || value < 0) {
                this.menuCountInput.value = 0;
            } else if (value > 10) {
                this.menuCountInput.value = 10;
            }
        }
    }

    // 更新套餐数量到Firebase
    async updateMenuCount() {
        try {
            const menuCount = parseInt(this.menuCountInput.value) || 0;
            const restName = window.AppConfig?.restName || 'asianboulevard';
            const tableNumber = getTableNumber();
            const tafelId = `Tafel-${tableNumber}`;

            console.log(`🍽️ 更新套餐数量: ${menuCount} 到路径 ${restName}/tafel/${tafelId}/orders/menu`);

            // 更新到正确的Firebase路径
            const menuRef = firebase.database().ref(`${restName}/tafel/${tafelId}/orders/menu`);
            await menuRef.set(menuCount);
            
            this.showNotification(`Aantal menu's bijgewerkt naar ${menuCount}`, 'success');
        } catch (error) {
            console.error('❌ 更新套餐数量失败:', error);
            this.showNotification('Bijwerken van aantal menu\'s mislukt: ' + error.message, 'error');
        }
    }

    // 更新All-in状态按钮方法
    async updateAllinStatus() {
        try {
            const isActive = this.allinToggle.checked;
            const restName = window.AppConfig?.restName || 'asianboulevard';
            const tableNumber = getTableNumber();
            const tafelId = `Tafel-${tableNumber}`;

            console.log(`🔄 手动更新All-in状态: ${isActive} 到路径 ${restName}/tafel/${tafelId}/orders/all_in_met`);

            const allinRef = firebase.database().ref(`${restName}/tafel/${tafelId}/orders/all_in_met`);
            await allinRef.set(isActive);
            
            this.updateAllinStatusText(isActive);
            this.showNotification(`All-in menu status bijgewerkt naar ${isActive ? 'aan' : 'uit'}`, 'success');
        } catch (error) {
            console.error('❌ 更新All-in状态失败:', error);
            this.showNotification('Bijwerken van All-in status mislukt: ' + error.message, 'error');
        }
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `control-panel-notification ${type}`;
        notification.textContent = message;
        
        // 样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '10001',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // 根据类型设置背景色
        switch (type) {
            case 'success':
                notification.style.background = '#10b981';
                break;
            case 'error':
                notification.style.background = '#ef4444';
                break;
            case 'warning':
                notification.style.background = '#f59e0b';
                break;
            default:
                notification.style.background = '#6366f1';
        }

        document.body.appendChild(notification);

        // 动画显示
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 初始化控制面板 - 添加单例模式防止重复初始化
let controlPanelInitialized = false;
function initializeControlPanel() {
    // 防止重复初始化
    if (controlPanelInitialized) {
        console.log('⚠️ 控制面板已初始化，跳过重复初始化');
        return;
    }
    
    console.log('🔧 正在初始化控制面板...');
    
    // 检查必需的元素是否存在
    const overlay = document.getElementById('control-panel-overlay');
    const openBtn = document.getElementById('open-control-panel');
    
    if (!overlay) {
        console.error('❌ 控制面板overlay元素未找到');
        return;
    }
    
    if (!openBtn) {
        console.error('❌ 控制面板打开按钮未找到');
        return;
    }
    
    // 确保overlay默认隐藏
    overlay.classList.remove('active');
    overlay.style.display = 'none';
    
    console.log('✅ 控制面板元素检查完成，开始创建实例...');
    
    // 检查Firebase是否可用
    if (typeof firebase !== 'undefined' && firebase.database) {
        try {
            // 只创建一次实例
            if (!window.controlPanelInstance) {
                window.controlPanelInstance = new ControlPanel();
                console.log('✅ 控制面板实例创建成功');
            }
            controlPanelInitialized = true;
            console.log('✅ 控制面板初始化成功');
        } catch (error) {
            console.error('❌ 控制面板初始化失败:', error);
        }
    } else {
        console.error('❌ Firebase not available for control panel');
        // 稍后重试一次
        if (!controlPanelInitialized) {
            setTimeout(initializeControlPanel, 2000);
        }
    }
}

// 只初始化一次
setTimeout(initializeControlPanel, 1500);

// Quick Reset Button Functionality (in Control Panel) - 防止重复初始化
let quickResetButtonInitialized = false;
function initializeQuickResetButton() {
    // 防止重复初始化
    if (quickResetButtonInitialized) {
        console.log('⚠️ 快速重置按钮已初始化，跳过重复初始化');
        return;
    }
    
    const quickResetButton = document.getElementById('quick-reset-button');
    if (quickResetButton) {
        // 移除之前可能存在的事件监听器
        quickResetButton.removeEventListener('click', quickResetHandler);
        
        // 添加新的事件监听器
        quickResetButton.addEventListener('click', quickResetHandler);
        
        quickResetButtonInitialized = true;
        console.log('✅ Quick reset button initialized');
    } else {
        console.log('⚠️ Quick reset button not found');
    }
}

// 快速重置按钮处理函数
async function quickResetHandler() {
    try {
        // 使用全局控制面板实例
        if (window.controlPanelInstance) {
            await window.controlPanelInstance.resetAllSettings();
        } else {
            console.error('❌ 控制面板实例未找到');
            alert('Controlepaneel niet geïnitialiseerd, ververs de pagina en probeer opnieuw');
        }
    } catch (error) {
        console.error('❌ Quick reset button error:', error);
        // Fallback notification
        if (window.showNotification) {
            window.showNotification('Reset mislukt: ' + error.message, 'error');
        } else {
            alert('Reset mislukt: ' + error.message);
        }
    }
}

// 只在DOM加载完成后初始化一次
document.addEventListener("DOMContentLoaded", initializeQuickResetButton);

