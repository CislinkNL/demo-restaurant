
  function askQuestion(dishName, copyImgData, capturedAllergy) {
        showOverlay();
        createAndShowMessageBar();
        hideOverlay();
        document.getElementById("messageBar-dynamic").innerHTML = ''; // Clear previous answer

        var answerDiv = document.getElementById("messageBar-dynamic");
        var img = document.createElement("img");
        var allergyText = document.createElement("p");

        // Set image source
        img.src = copyImgData;
        img.alt = "Dish image";
        img.style.maxWidth = "80%";

        allergyText.innerText = capturedAllergy; // Use capturedAllergy here

        // Append image and allergy text to answerDiv
        answerDiv.appendChild(img);
        answerDiv.appendChild(allergyText);

        // Scroll to bottom of answerDiv
        answerDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }



    function callChatGPTWithPrompt(prompt, dishName) {
        google.script.run.withSuccessHandler(function (response) {
            var answerDiv = document.getElementById("messageBar-dynamic");
            // Append response text after the image if it exists
            var responseText = document.createElement("p");
            responseText.innerText = response;
            answerDiv.appendChild(responseText);
            hideOverlay();
            answerDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }).callChatGPT(prompt, dishName);
    }



    function showOverlay() {


        document.getElementById('overlay').style.display = "flex";


    }

    function hideOverlay(messageBarDynamic, overlay) {

        messageBarDynamic.remove(); // Ensure the element exists before calling remove
        overlay.style.display = 'none';
    }

function createAndShowMessageBar(item, orderInstance, currentQuantity) {
    let existingMessageBar = document.getElementById('messageBar-dynamic');
    if (existingMessageBar) {
        existingMessageBar.remove();
    }

    const messageBar = document.createElement('div');
    messageBar.id = 'messageBar-dynamic';
    messageBar.classList.add('message-bar-dynamic');
    messageBar.style.cursor = 'pointer';

    // Center the messageBar on the screen
    messageBar.style.position = 'fixed';
    messageBar.style.top = '50%';
    messageBar.style.left = '50%';
    messageBar.style.transform = 'translate(-50%, -50%)';

    // Set max height, overflow, and other styles
    messageBar.style.maxHeight = '85vh';
    messageBar.style.overflowY = 'auto';
    messageBar.style.width = '80%';
    messageBar.style.padding = '1em';
    messageBar.style.backgroundColor = '#262620ed';
    messageBar.style.borderRadius = '8px';
    messageBar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

    // ✅ Store base price & initialize total price
    let basePrice = parseFloat(item.price) || 0;
    let totalPrice = basePrice;
    let selectedChoices = {}; // Store selected option choices

// ✅ UI Content
let optionsHTML = "";
if (item.hasOptions && Object.keys(item.options).length > 0) {
    optionsHTML = "<h4>Kies opties:</h4>";

    Object.keys(item.options).forEach(optionName => {
        let optionData = item.options[optionName];

        // Create label
        // optionsHTML += `<label>${optionData.label}</label>`;

        // Create select dropdown
        optionsHTML += `<select class="option-select" data-option="${optionName}">`;

        Object.keys(optionData.Keuzes).forEach(choice => {
            let priceAdjustment = optionData.Keuzes[choice];
            let displayPrice = priceAdjustment !== 0 ? ` (+€${priceAdjustment.toFixed(2)})` : "";
            
            // Add selected attribute if price is 0
            const selectedAttr = priceAdjustment === 0 ? ' selected' : '';
            
            optionsHTML += `<option value="${choice}" data-price="${priceAdjustment}"${selectedAttr}>${choice} ${displayPrice}</option>`;
        });

        optionsHTML += `</select><br>`;
    });
}

    // ✅ Populate messageBar
    messageBar.innerHTML = `
        <button id="closeMessageBar" class="close-message-bar">X</button>
        <img src="${item.image}" alt="${item.description}" class="item-image">
        
        <!-- ✅ Updated to allow dynamic description -->
        <div class="item-description" translate="yes">${item.description}</div>

        <div id="options-container">${optionsHTML}</div>
        <div class="allergy-info" translate="yes">${item.allergy}</div>

        <!-- ✅ Display Total Price Dynamically, only if > 0 -->
        <div class="total-price" style="${totalPrice > 0 ? '' : 'display:none;'}">Totaalprijs: <span id="total-price">€ ${totalPrice.toFixed(2)}</span></div>

        <div class="quantity-controls">
            <button class="quantity-adjust delete">-</button>
            <span class="item-quantity">${currentQuantity}</span>
            <button class="quantity-adjust increase-quantity">+</button>
        </div>
        <button class="add-to-order" translate="yes">Toevoegen</button>
    `;

    document.body.appendChild(messageBar);

    // ✅ 主要依赖DOM监听器，但添加一个备用机制
    setTimeout(() => {
        console.log("🌐 菜品弹窗已创建，DOM监听器应该已经检测到");
        
        // 如果DOM监听器没有工作，这是备用翻译机制
        const currentLang = document.documentElement.lang || 'nl';
        if (currentLang !== 'nl' && typeof window.translateDynamicContent === 'function') {
            console.log("🌐 备用翻译机制：直接调用翻译函数");
            window.translateDynamicContent(messageBar, true);
        }
    }, 200);

    // ✅ Ensure elements exist before adding event listeners
    const optionSelects = document.querySelectorAll(".option-select");
    if (optionSelects.length > 0) {
        optionSelects.forEach(select => {
            select.addEventListener("change", () => {
                totalPrice = basePrice; // Reset price
                selectedChoices = {}; // Reset choices

                optionSelects.forEach(optionSelect => {
                    let selectedOption = optionSelect.options[optionSelect.selectedIndex];
                    let optionName = optionSelect.getAttribute("data-option");
                    let selectedText = selectedOption.value;
                    let priceAdjustment = parseFloat(selectedOption.getAttribute("data-price")) || 0;

                    totalPrice += priceAdjustment; // Update total price
                    selectedChoices[optionName] = selectedText; // Store selected option
                });

                // ✅ Update price in UI
                const priceEl = document.getElementById("total-price");
                if (priceEl) {
                    priceEl.textContent = `€ ${totalPrice.toFixed(2)}`;
                }
                const priceContainer = document.querySelector('.total-price');
                if (priceContainer) {
                    priceContainer.style.display = totalPrice > 0 ? '' : 'none';
                }

                // ✅ Update description in UI
                let newDescription = item.description;
                Object.entries(selectedChoices).forEach(([optionName, choice]) => {
                    newDescription += `+ ${choice}`;
                });
                const descriptionElement = document.querySelector(".item-description");
                if (descriptionElement) {
                    descriptionElement.textContent = newDescription;
                    
                    // ✅ 选项更改时也依赖DOM监听器，但添加备用机制
                    setTimeout(() => {
                        console.log("🌐 描述已更新，等待DOM监听器翻译");
                        // 备用机制：如果DOM监听器没有检测到文本变化
                        const currentLang = document.documentElement.lang || 'nl';
                        if (currentLang !== 'nl' && typeof window.translateDynamicContent === 'function') {
                            window.translateDynamicContent(messageBar, true);
                        }
                    }, 150);
                }
            });

            select.dispatchEvent(new Event("change")); // Trigger change to set default
        });
    }

    // ✅ Add event listener for "Add to Order" button
    const addToOrderBtn = document.querySelector('.add-to-order');
if (addToOrderBtn) {
addToOrderBtn.addEventListener('click', () => {

    const chosenQuantity = parseInt(document.querySelector('.item-quantity').textContent, 10);
    const finalDescription = document.querySelector('.item-description').textContent;
    const sku = item.sku; // Unique identifier
    const messageBarDynamic = document.getElementById('messageBar-dynamic');

    // 🔧 安全获取当前设备ID，使用后8位进行比较
    let currentDeviceId;
    if (orderInstance && (orderInstance._deviceId || orderInstance.deviceId)) {
        currentDeviceId = orderInstance._deviceId || orderInstance.deviceId;
    } else {
        // 如果orderInstance未初始化，直接从localStorage获取
        currentDeviceId = localStorage.getItem('deviceId');
        console.log('⚠️ food-info中orderInstance设备ID未设置，从localStorage获取:', currentDeviceId);
    }
    
    const currentDeviceIdSuffix = currentDeviceId ? currentDeviceId.slice(-8) : null;
    
    const existingItem = orderInstance.order.find(orderItem => {
        // 🔧 提取原始SKU进行比较（移除设备ID后缀）
        let itemOriginalSku = orderItem.sku;
        if (itemOriginalSku && itemOriginalSku.includes('__')) {
            itemOriginalSku = itemOriginalSku.split('__')[0];
        }
        
        if (itemOriginalSku !== sku) return false;
        if (!orderItem.deviceId) return true; // 无deviceId的旧数据认为是当前设备
        return orderItem.deviceId.slice(-8) === currentDeviceIdSuffix; // 比较后8位
    });

    // 数量限制校验
    if (chosenQuantity > 0) {
        // 用sku+description作为key
        const orderListObj = {};
        orderInstance.order.forEach(orderItem => {
            const key = (orderItem.sku || '') + '||' + (orderItem.description || '');
            orderListObj[key] = orderItem;
        });
        const thisKey = (sku || '') + '||' + (finalDescription || '');
        if (window.exceedsOrderLimit && exceedsOrderLimit(orderListObj, item.group, thisKey, chosenQuantity)) {
            showNotification('Aantal bestelde hoofdgerechten of desserts overschrijdt het limiet per persoon!', 'error', 4000);
            return;
        }
    }

    // ✅ If quantity is 0, remove the item from the order
    if (chosenQuantity === 0 && existingItem) {
        console.log(`❌ Removing item: ${sku}`);

        // ✅ Call deleteOrderLine correctly (only with SKU)
        orderInstance.deleteOrderLine(sku);

        const receiptContainer = document.getElementById("receipt-details");
        const summaryContainer = document.getElementById("summary-table");

        // ✅ Check if the order list is empty, then clear UI
        if (orderInstance.order.length === 0) {
            console.log("🧹 No items left, clearing receipt and summary.");

            if (receiptContainer) {
                receiptContainer.innerHTML = ""; // ✅ Only modify if it exists
            } else {
                console.warn("⚠️ Warning: receipt-details not found.");
            }

            if (summaryContainer) {
                summaryContainer.innerHTML = ""; // ✅ Only modify if it exists
            } else {
                console.warn("⚠️ Warning: summary-table not found.");
            }

            Ui.summary(orderInstance); // ✅ Ensure the summary UI clears correctly
        } else {
            // ✅ Refresh UI normally if there are remaining items
            Ui.receiptDetails(orderInstance);
            Ui.summary(orderInstance);
            updateQuantityLabels(orderInstance.order);
        }

        // ✅ Close modal
        messageBarDynamic.remove();
        const overlay = document.getElementById('overlay-under');
        if (overlay) {
            overlay.style.display = 'none';
        } else {
            console.warn("⚠️ Overlay element not found!");
        }

        return; // Exit early, no need to add an order line
    }

    // ✅ Otherwise, add/update the order line
    // Calculate the difference between desired quantity and existing quantity
    let quantityToAdd = chosenQuantity;
    if (existingItem) {
        // If item exists, we need to set it to the chosen quantity
        // So we add the difference between chosen and current quantity
        quantityToAdd = chosenQuantity - existingItem.quantity;
    }
    
    // 获取原始荷兰语描述（不包含选项）
    let originalDescription = item.description;
    
    // Only proceed if there's a quantity change
    if (quantityToAdd !== 0) {
        // 使用finalDescription用于显示，originalDescription用于后端
        orderInstance.addOrderLine(quantityToAdd, finalDescription, item.group, item.allergy, sku, totalPrice, selectedChoices, originalDescription);
    }

    console.log("✅ Order added:", {
        sku,
        description: finalDescription,
        originalDescription: originalDescription,
        quantity: chosenQuantity,
        price: totalPrice,
        options: selectedChoices
    });

    // ✅ Close modal
    messageBarDynamic.remove();
    const overlay = document.getElementById('overlay-under');
    if (overlay) {
        overlay.style.display = 'none';
    } else {
        console.warn("⚠️ Overlay element not found!");
    }

    // ✅ Refresh UI components
    Ui.receiptDetails(orderInstance);
    updateQuantityLabels(orderInstance.order);
});


}
 else {
        console.error("❌ Error: 'add-to-order' button not found in the DOM.");
    }
    // ✅ Add event listener for quantity adjustments
    const quantitySpan = messageBar.querySelector(".item-quantity");
    const increaseBtn = messageBar.querySelector(".increase-quantity");
    const decreaseBtn = messageBar.querySelector(".delete");

    if (increaseBtn && decreaseBtn && quantitySpan) {
        increaseBtn.addEventListener('click', () => {
            let quantity = parseInt(quantitySpan.textContent, 10);
            quantitySpan.textContent = quantity + 1;
        });

        decreaseBtn.addEventListener('click', () => {
            let quantity = parseInt(quantitySpan.textContent, 10);
            quantity = Math.max(quantity - 1, 0);
            quantitySpan.textContent = quantity;
        });
    } else {
        console.warn("⚠️ Quantity controls not found in messageBar!");
    }

    // ✅ Close button functionality
    document.getElementById('closeMessageBar').addEventListener('click', () => {
        messageBar.remove();
        const overlay = document.getElementById('overlay-under');
        if (overlay) {
            overlay.style.display = 'none';
        } else {
            console.warn("⚠️ Overlay element not found!");
        }
    });
}

    ////////////////search bar, search items by entering id's or part of descriptions
    function searchItems(query) {


    // ✅ Close button functionality
    document.getElementById('closeMessageBar').addEventListener('click', () => {
    messageBar.remove();
    const overlay = document.getElementById('overlay-under');
    if (overlay) {
    overlay.style.display = 'none';
    } else {
    console.warn("⚠️ Overlay element not found!");
    }
    });
    }

    ////////////////search bar, search items by entering id's or part of descriptions
    function searchItems(query) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = ''; // Clear previous results

        // Filter items based on the query, checking both ID and description
        const filteredItems = order._menu.filter(item =>
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.id.toString().includes(query)
        );

        // Display matching items in the searchResults div
        // Assuming you have a function to display filtered items like this
        filteredItems.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.textContent = `${item.id} - ${item.description}`; // Display both ID and description
            resultItem.addEventListener('click', function (e) {
                e.preventDefault(); // Prevent the default link behavior

                // Adjust based on your data attribute
                const element = document.getElementById(item.id);
                if (element) {
                    setTimeout(() => { // Delay to ensure that any CSS transitions don't interfere
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Clear and hide search results
                        document.getElementById('searchResults').innerHTML = '';
                        document.getElementById('searchBar').value = '';
                        document.getElementById('searchContainer').classList.add('hidden');
                        document.getElementById('searchIcon').classList.remove('hidden');

                        // If you have an animation or visual cue to show, trigger it here
                        animateHighlight(element); // Adjust based on your implementation
                    }, 150); // Slightly longer delay to account for mobile browser behavior
                }
            });


            searchResults.appendChild(resultItem);
        });

    }

    // Event listener for the search bar for dynamic searching
    document.getElementById('searchBar').addEventListener('input', function (e) {
        const query = e.target.value.trim();
        if (query.length > 0) {
            searchItems(query);
        } else {
            document.getElementById('searchResults').innerHTML = ''; // Clear results if query is empty
        }
    });


    document.getElementById('searchIcon').addEventListener('click', function () {
        const searchBar = document.getElementById('searchBar');
        searchBar.setAttribute('readonly', true);
        document.getElementById('searchContainer').classList.remove('hidden'); // Show the search bar
        this.classList.add('hidden'); // Hide the search icon
        setTimeout(() => {
            searchBar.removeAttribute('readonly'); // Remove readonly attribute
            searchBar.focus(); // Then focus
        }, 300);
    });

    document.getElementById('closeSearch').addEventListener('click', function () {
        document.getElementById('searchContainer').classList.add('hidden'); // Hide the search bar
        document.getElementById('searchIcon').classList.remove('hidden'); // Show the search icon
        document.getElementById('searchBar').value = ''; // Optional: clear the search bar
        document.getElementById('searchResults').innerHTML = ''; // Optional: clear search results
    });


    function animateHighlight(element) {
        // Temporarily change the background color of the target element
        element.style.transition = 'background-color 0.5s ease';
        element.style.backgroundColor = '#ffeb3b'; // Highlight color

        // Revert to original color after a delay
        setTimeout(() => {
            element.style.backgroundColor = ''; // Reset background color
        }, 1500);
    }

    // 🔥 Removed legacy handleAddToOrder duplicate (incorrect parameters caused NaN)

function updateToggleButtonEffect() {
    const toggleButton = document.getElementById("toggle-order-list");
    const receiptDetails = document.getElementById("receipt-details");

    if (!toggleButton || !receiptDetails) return; // Ensure elements exist

    // Check if there are any items in the receipt list
    const hasItems = receiptDetails.querySelectorAll("tr").length > 0;

    if (hasItems) {
        toggleButton.classList.add("glow-effect"); // Add glow effect
    } else {
        toggleButton.classList.remove("glow-effect"); // Remove glow effect
    }
}

// Run the function initially and attach it to any event that updates the receipt
document.addEventListener("DOMContentLoaded", updateToggleButtonEffect);

// Example: If items are added dynamically, observe changes
const observer = new MutationObserver(updateToggleButtonEffect);
observer.observe(document.getElementById("receipt-details"), { childList: true });
