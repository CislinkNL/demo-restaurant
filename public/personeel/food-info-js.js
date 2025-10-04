
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
    
    // 强制恢复header位置（防止被顶出屏幕）
    setTimeout(() => {
        const header = document.querySelector('header');
        if (header) {
            header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 1000);
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
        
        // 强制恢复header位置（防止被顶出屏幕）
        setTimeout(() => {
            const header = document.querySelector('header');
            if (header) {
                header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 1000);
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
                document.querySelector(".item-description").textContent = newDescription;
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

            // Find the existing item in the order by SKU
            const existingItem = orderInstance.order.find(orderItem => orderItem.sku === sku);

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

                // ✅ Call deleteOrderLine with SKU and options for correct lineKey matching
                orderInstance.deleteOrderLine(sku, selectedChoices);

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
            
            // Only proceed if there's a quantity change
            if (quantityToAdd !== 0) {
                // 获取原始荷兰语描述
                let originalDescription = item.description;
                orderInstance.addOrderLine(quantityToAdd, finalDescription, item.group, item.allergy, sku, totalPrice, selectedChoices, originalDescription);
            }

            console.log("✅ Order added:", {
                sku,
                description: finalDescription,
                quantity: chosenQuantity,
                price: totalPrice,
                options: selectedChoices
            });

            // ✅ Check if SKU requires price input panel (188 or 1842)
            if (sku === "188" || sku === "1842") {
                console.log("🔢 Special SKU detected, showing price input panel for:", sku);
                
                // Close current modal first
                messageBarDynamic.remove();
                const overlay = document.getElementById('overlay-under');
                if (overlay) {
                    overlay.style.display = 'none';
                }
                
                // Show price input panel
                showPriceInputPanel((customPrice) => {
                    console.log(`💰 Custom price confirmed: €${customPrice} for SKU ${sku}`);
                    
                    // Find the added item in the order and update its price directly
                    const addedItem = orderInstance.order.find(orderItem => orderItem.sku === sku);
                    if (addedItem) {
                        // Update the price directly without adding more quantity
                        addedItem.price = customPrice;
                        addedItem.subtotal = customPrice * addedItem.quantity;
                        addedItem.taxAmount = addedItem.subtotal * (addedItem.taxRate / 100);
                        
                        console.log(`✅ Price updated for SKU ${sku}: €${customPrice}`);
                        
                        // Update Firebase with the new price
                        const restName = window.AppConfig?.restName || 'asianboulevard';
                        const tafelId = `Tafel-${document.getElementById("tafelNummer").innerText.trim()}`;
                        const safeKey = orderInstance._buildLineKey(sku, selectedChoices);
                        const lineRef = firebase.database().ref(`/${restName}/tafel/${tafelId}/orders/orderlist/${safeKey}`);
                        
                        lineRef.update({
                            price: customPrice,
                            subtotal: addedItem.subtotal,
                            taxAmount: addedItem.taxAmount
                        });
                        
                        // Refresh UI to show updated price
                        Ui.receiptDetails(orderInstance);
                        updateQuantityLabels(orderInstance.order);
                        Ui.summary(orderInstance);
                    } else {
                        console.warn("⚠️ Could not find added item to update price");
                    }
                });
                
                return; // Exit early, don't close modal or refresh UI here
            }

            // ✅ Close modal (for normal items)
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

/**
 * 🔢 Function to Show Price Input Panel
 */
function showPriceInputPanel(callback) {
    const popup = document.createElement('div');
    popup.id = "price-input-panel";
    popup.innerHTML = `
        <div class="popup-content">
            <h3>Voer een prijs p.p. in:</h3>
            <input type="text" id="price-input" placeholder="Bijv. 6 of 9">
            <div class="popup-buttons">
                <button id="confirm-price">Bevestigen</button>
                <button id="cancel-price">Sluiten</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    const confirmButton = document.getElementById("confirm-price");
    const cancelButton = document.getElementById("cancel-price");
    const priceInput = document.getElementById("price-input");

    function confirmPrice() {
        let priceValue = priceInput.value.trim();
        let formattedPrice = parseFloat(priceValue.replace(",", ".")); // Convert comma to dot

        if (!isNaN(formattedPrice) && formattedPrice > 0) {
            document.body.removeChild(popup);
            callback(formattedPrice); // Proceed with confirmed price
        } else {
            alert("Ongeldige prijs! Voer een geldig getal in.");
        }
    }

    // 🖱️ Click event for "Bevestigen" button
    confirmButton.addEventListener("click", confirmPrice);

    // 🔘 Click event for "Sluiten" button
    cancelButton.addEventListener("click", () => {
        document.body.removeChild(popup);
    });

    // ⌨️ **Enter key event for input field**
    priceInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            confirmPrice();
        }
    });

    // Focus input field automatically
    priceInput.focus();
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

                    // 强制恢复header位置（防止被顶出屏幕）
                    setTimeout(() => {
                        const header = document.querySelector('header');
                        if (header) {
                            header.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 1000);

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
