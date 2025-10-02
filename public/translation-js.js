// Global initialization function (only called after user clicks “Yes”)
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'nl',
        includedLanguages: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

// Global store for translations
let customTranslations = {};

// Local storage key for caching translations
const TRANSLATIONS_CACHE_KEY = 'bluedragon_translations';
const CACHE_EXPIRY_KEY = 'bluedragon_translations_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Load translations from localStorage if available and valid
function loadTranslationsFromCache() {
    try {
        const cachedData = localStorage.getItem(TRANSLATIONS_CACHE_KEY);
        const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
        
        if (!cachedData || !cacheExpiry) {
            console.log("📂 No translation cache found");
            return null;
        }
        
        const expiryTime = parseInt(cacheExpiry);
        const timeLeft = expiryTime - Date.now();
        const hoursLeft = Math.round(timeLeft / (1000 * 60 * 60));
        
        if (Date.now() < expiryTime) {
            const translations = JSON.parse(cachedData);
            console.log("✅ Loaded translations from cache");
            console.log(`⏰ Cache expires in ${hoursLeft} hours`);
            console.log("📋 Cached languages:", Object.keys(translations));
            return translations;
        } else {
            console.log("⏰ Translation cache expired, will fetch from Firebase");
            return null;
        }
    } catch (error) {
        console.log("❌ Failed to load from cache:", error);
        return null;
    }
}

// Save translations to localStorage
function saveTranslationsToCache(translations) {
    try {
        localStorage.setItem(TRANSLATIONS_CACHE_KEY, JSON.stringify(translations));
        localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
        console.log("💾 Translations saved to cache");
    } catch (error) {
        console.log("❌ Failed to save to cache:", error);
    }
}

// Clear translations cache (for debugging or forcing refresh)
function clearTranslationsCache() {
    try {
        localStorage.removeItem(TRANSLATIONS_CACHE_KEY);
        localStorage.removeItem(CACHE_EXPIRY_KEY);
        console.log("🗑️ Translation cache cleared");
    } catch (error) {
        console.log("❌ Failed to clear cache:", error);
    }
}

// Force refresh translations (can be called from console)
window.refreshTranslations = async function() {
    console.log("🔄 手动刷新翻译数据...");
    clearTranslationsCache();
    await loadTranslationsFromFirebase(true);
    console.log("✅ 翻译数据已刷新");
};

// Load from Firebase
async function loadTranslationsFromFirebase(forceRefresh = false) {
    // Check if force refresh is requested or if debugging mode is active
    const isDebugging = window.location.search.includes('debug=1') || 
                       window.location.search.includes('refreshTranslations=1') ||
                       forceRefresh;
    
    if (isDebugging) {
        console.log("🔄 强制刷新翻译数据 (调试模式或手动刷新)");
        clearTranslationsCache();
    }

    // First try to load from cache (unless force refresh)
    const cachedTranslations = isDebugging ? null : loadTranslationsFromCache();
    if (cachedTranslations) {
        window.customTranslations = cachedTranslations;
        console.log("💿 使用缓存的翻译数据");
        applyCustomTranslations?.();
        return; // Use cached data, no need to fetch from Firebase
    }

    await waitForAppConfig();

    // Get restaurant name from AppConfig, use the same default as other files
    const rawRestName = window.AppConfig?.restName || 'asianboulevard';
    
    // Clean the restaurant name for Firebase path (remove spaces and special chars)
    const restName = rawRestName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    
    console.log("🔍 Raw restaurant name from AppConfig:", rawRestName);
    console.log("🔍 Cleaned restaurant name for path:", restName);
    console.log("🔍 window.AppConfig:", window.AppConfig);

    if (!restName) {
        console.error("❌ Cannot load translations: restName is missing.");
        return;
    }

    // Try multiple path structures to find translations
    const pathsToTry = [
        `${restName}/translations`,  // Standard path: RestaurantName/translations/
        `${restName}`,              // Direct path: RestaurantName/ (check for language keys)
        'translations'              // Root translations path
    ];

    let translationsData = null;
    let successfulPath = null;

    for (let translationsPath of pathsToTry) {
        try {
            console.log("🔄 Trying translation path:", translationsPath);
            
            const ref = firebase.database().ref(translationsPath);
            const snapshot = await ref.once("value");
            const data = snapshot.val();

            if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                // Check if this data has language keys (en, nl, etc.)
                const keys = Object.keys(data);
                const hasLanguageKeys = keys.some(key => ['en', 'nl', 'de', 'fr', 'es', 'zh', 'ja'].includes(key));
                
                if (hasLanguageKeys) {
                    translationsData = data;
                    successfulPath = translationsPath;
                    console.log("✅ Found translations at path:", translationsPath);
                    console.log("📋 Available languages:", keys.filter(key => ['en', 'nl', 'de', 'fr', 'es', 'zh', 'ja'].includes(key)));
                    break;
                }
            }
        } catch (error) {
            console.log(`❌ Failed to load from path ${translationsPath}:`, error.message);
        }
    }

    window.customTranslations = translationsData || {};
    console.log("✅ Final translations loaded from path:", successfulPath);
    console.log("🔍 Available languages:", Object.keys(window.customTranslations));

    if (Object.keys(window.customTranslations).length === 0) {
        console.warn("⚠️ No translations found for restaurant:", rawRestName);
    } else {
        // Save to cache for future use
        saveTranslationsToCache(window.customTranslations);
    }

    applyCustomTranslations?.();
}

// Apply translations if available, fallback to Google
function applyCustomTranslations(allowGoogleFallback = true) {
    const language = document.documentElement.lang || 'nl';
    
    console.log(`🔍 Current page language: ${language}`);
    console.log(`🔍 Available custom translations:`, Object.keys(window.customTranslations || {}));

    // Check if we have translations for the requested language
    if (window.customTranslations && window.customTranslations[language]) {
        console.log(`✅ Using custom translations for ${language} (with Google fallback: ${allowGoogleFallback})`);
        replaceTextInDocument(window.customTranslations[language], false, document.body, allowGoogleFallback);
        document.getElementById("google_translate_element").style.display = "none";
    } else {
        // If current language is 'nl' and we don't have 'nl' translations, 
        // this means the site is in its native Dutch language - no translation needed
        if (language === 'nl') {
            console.log("✅ Site is in native Dutch language - no translation needed");
            document.getElementById("google_translate_element").style.display = "none";
            return;
        }
        
        // For other languages, try to apply any available translations
        const availableLanguages = Object.keys(window.customTranslations || {});
        if (availableLanguages.length > 0) {
            // If we have any translations available and the page is not in Dutch,
            // assume user wants translation and apply the first available language
            const targetLang = availableLanguages[0];
            console.log(`🔄 No exact match for ${language}, applying ${targetLang} translations (with Google fallback: ${allowGoogleFallback})`);
            replaceTextInDocument(window.customTranslations[targetLang], false, document.body, allowGoogleFallback);
            document.getElementById("google_translate_element").style.display = "none";
        } else {
            console.warn(`No custom translations found for ${language}, ${allowGoogleFallback ? 'enabling' : 'not enabling'} Google Translate fallback.`);
            if (allowGoogleFallback) {
                // Initialize Google Translate if not already initialized
                initializeGoogleTranslateForFallback();
                document.getElementById("google_translate_element").style.display = "block";
            }
        }
        // ❌ Do NOT auto-init Google Translate here
    }
}

// DOM loaded: show popup if language differs
document.addEventListener("DOMContentLoaded", () => {
    // Check for debug/refresh parameters
    const urlParams = new URLSearchParams(window.location.search);
    const forceRefresh = urlParams.has('refreshTranslations') || urlParams.has('debug');
    
    if (forceRefresh) {
        console.log("🔧 检测到调试参数，将强制刷新翻译数据");
    }

    const userLang = navigator.language || navigator.userLanguage;
    const pageLang = 'nl';
    const langCode = userLang.slice(0, 2);

    const languageNativeNames = {
        'en': 'English'
    };

    if (langCode !== pageLang) {
        document.getElementById("translate-popup").style.display = "flex";

        // ✅ YES - initialize Translate only when user agrees
        document.getElementById("translate-yes").addEventListener("click", () => {
            document.getElementById("translate-popup").style.display = "none";
            document.getElementById("google_translate_element").style.display = "block";
            googleTranslateElementInit(); // ✅ Initialize
            setTimeout(() => {
                applyTranslation(languageNativeNames[langCode]);
            }, 1000);
        });

        // ✅ NO - completely remove all translate DOM
        document.getElementById("translate-no").addEventListener("click", () => {
            document.getElementById("translate-popup").style.display = "none";

            const iframe = document.querySelector("iframe.goog-te-banner-frame");
            if (iframe) iframe.remove();

            const container = document.getElementById("google_translate_element");
            if (container) container.innerHTML = "";
        });
    }

    loadTranslationsFromFirebase(forceRefresh);
    monitorLanguageChange();
    monitorDOMChanges(); // Add DOM change monitoring
});

function monitorLanguageChange() {
    const observer = new MutationObserver(applyCustomTranslations);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
}

function monitorDOMChanges() {
    // Debounce function to avoid excessive calls
    let translationTimeout;
    
    const applyTranslationWithDelay = (targetNode = document.body) => {
        clearTimeout(translationTimeout);
        translationTimeout = setTimeout(() => {
            const currentLang = document.documentElement.lang || 'nl';
            if (currentLang !== 'nl' && window.customTranslations && window.customTranslations[currentLang]) {
                console.log("🌐 DOM监听器触发翻译...");
                if (typeof replaceTextInDocument === 'function') {
                    replaceTextInDocument(window.customTranslations[currentLang], false, targetNode, true);
                }
            }
        }, 100); // 更短的延迟确保及时响应
    };

    // Monitor for dynamically added elements (like food modals)
    const observer = new MutationObserver((mutations) => {
        let shouldTranslate = false;
        let targetNodes = new Set();

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    // Check if the added node is an element
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // ✅ 特别检测菜品弹窗
                        const isFoodModal = (
                            node.id === 'messageBar-dynamic' ||
                            node.classList.contains('message-bar-dynamic')
                        );
                        
                        // ✅ 检测其他可翻译内容
                        const hasTranslatableContent = (
                            // 明确标记要翻译的元素
                            node.hasAttribute && node.getAttribute('translate') === 'yes' ||
                            node.querySelector && node.querySelector('[translate="yes"]') ||
                            // 菜品弹窗相关内容
                            isFoodModal ||
                            node.querySelector && (
                                node.querySelector('.item-description') ||
                                node.querySelector('.add-to-order') ||
                                node.querySelector('.allergy-info')
                            )
                        );
                        
                        if (hasTranslatableContent || isFoodModal) {
                            shouldTranslate = true;
                            targetNodes.add(node);
                            console.log("🔍 DOM监听器检测到新的可翻译内容:", {
                                id: node.id || 'no-id',
                                class: node.className || 'no-class',
                                isFoodModal: isFoodModal,
                                hasTranslatableContent: hasTranslatableContent
                            });
                        }
                    }
                });
            }
        });

        if (shouldTranslate) {
            console.log(`🌐 DOM监听器准备翻译 ${targetNodes.size} 个新元素`);
            // If we have specific target nodes, translate each one
            targetNodes.forEach(node => {
                console.log(`🌐 开始翻译节点: ${node.id || node.className || 'unnamed'}`);
                applyTranslationWithDelay(node);
            });
        }
    });
    
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });

    // ✅ 额外监听文本内容变化（用于选项更新等场景）
    const textChangeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const target = mutation.target;
                // 检查是否是菜品弹窗中的文本变化
                if (target.nodeType === Node.TEXT_NODE && target.parentElement) {
                    const modal = target.parentElement.closest('#messageBar-dynamic');
                    if (modal) {
                        console.log("🔍 检测到菜品弹窗内文本变化，准备翻译");
                        setTimeout(() => applyTranslationWithDelay(modal), 50);
                    }
                }
            }
        });
    });
    
    textChangeObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    console.log("🔍 DOM change monitoring activated - 实时监听动态内容");
}

// Function to manually trigger translation for specific elements
function translateDynamicContent(targetElement = document.body, allowGoogleFallback = true) {
    const currentLang = document.documentElement.lang || 'nl';
    
    // Don't translate if page is in Dutch (original language)
    if (currentLang === 'nl') {
        return;
    }
    
    if (window.customTranslations && window.customTranslations[currentLang]) {
        console.log(`🌐 Manually translating content to ${currentLang} (with Google fallback: ${allowGoogleFallback})...`);
        if (typeof replaceTextInDocument === 'function') {
            replaceTextInDocument(window.customTranslations[currentLang], false, targetElement, allowGoogleFallback);
        }
    } else {
        console.log(`⚠️ No custom translations available for ${currentLang}, trying Google Translate only...`);
        // If no custom translations but Google is available, try pure Google Translate
        if (allowGoogleFallback && window.google && window.google.translate) {
            triggerGoogleTranslateForElement(targetElement);
        }
    }
}

// Trigger Google Translate for an entire element (when no custom translations available)
function triggerGoogleTranslateForElement(targetElement) {
    console.log("🔄 尝试对整个元素使用Google翻译...");
    
    // Mark element for Google Translate
    if (targetElement && targetElement.setAttribute) {
        targetElement.removeAttribute('translate');
        targetElement.classList.remove('notranslate');
        
        // Force Google Translate to re-process this element
        if (window.google && window.google.translate) {
            setTimeout(() => {
                try {
                    // Trigger Google Translate re-scan
                    const event = new Event('DOMNodeInserted', { bubbles: true });
                    targetElement.dispatchEvent(event);
                } catch (error) {
                    console.error("❌ Google翻译元素处理失败:", error);
                }
            }, 100);
        }
    }
}

// Make translateDynamicContent available globally
window.translateDynamicContent = translateDynamicContent;

// Function to clear translation cache (useful for development or updates)
function clearTranslationCache() {
    try {
        localStorage.removeItem(TRANSLATIONS_CACHE_KEY);
        localStorage.removeItem(CACHE_EXPIRY_KEY);
        console.log("🗑️ Translation cache cleared");
    } catch (error) {
        console.log("❌ Failed to clear cache:", error);
    }
}

// Make cache functions available globally for debugging
window.clearTranslationCache = clearTranslationCache;
window.loadTranslationsFromCache = loadTranslationsFromCache;

function applyCustomTranslationsMessageBar(selector = '.add-to-order', targetElement = document.body) {
    const language = document.documentElement.lang || 'nl';
    const targetElements = targetElement.querySelectorAll(selector);

    if (window.customTranslations && window.customTranslations[language]) {
        targetElements.forEach(el => {
            replaceTextInDocument(window.customTranslations[language], false, el);
        });
    }
}

function replaceTextInDocument(dictionary, revert = false, targetElement = document.body, allowGoogleFallback = true) {
    if (!dictionary || typeof dictionary !== 'object') return;

    const sortedDictionary = Object.entries(dictionary).sort(([a], [b]) => b.length - a.length);
    const currentLang = document.documentElement.lang || 'nl';
    
    // Collect untranslated text for Google Translate fallback
    const untranslatedElements = [];

    function translateText(text) {
        let translated = text;
        let changed = false;
        for (const [original, translatedStr] of sortedDictionary) {
            // Case-insensitive matching with case preservation
            const regex = new RegExp(revert ? translatedStr : original, "gi");
            if (regex.test(translated)) {
                const replacement = revert ? original : translatedStr;
                // Preserve original case (first letter capitalization)
                translated = translated.replace(regex, (match) => {
                    if (match.charAt(0) === match.charAt(0).toUpperCase()) {
                        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
                    }
                    return replacement;
                });
                changed = true;
                console.log(`✅ 翻译成功: '${text}' → '${translated}'`);
            }
        }
        return { translated, changed };
    }

    function translateElement(element) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (parent) {
                // ✅ 第一原则：严格遵守 translate="no" 和 notranslate 类
                const hasNoTranslateAttribute = parent.getAttribute("translate") === "no";
                const hasNoTranslateClass = parent.classList.contains("notranslate");
                const hasYesTranslateAttribute = parent.getAttribute("translate") === "yes";
                
                // 如果明确标记不翻译，则跳过
                if (hasNoTranslateAttribute || hasNoTranslateClass) {
                    continue;
                }
                
                // 只翻译明确标记要翻译的，或没有标记的元素
                const shouldTranslate = hasYesTranslateAttribute || !parent.hasAttribute("translate");
                
                if (shouldTranslate) {
                    const originalText = node.nodeValue.trim();
                    
                    // Skip empty text or whitespace-only nodes
                    if (!originalText) continue;
                    
                    const { translated, changed } = translateText(originalText);
                    if (changed && originalText !== translated) {
                        node.nodeValue = translated;
                        // 标记为已翻译，防止重复翻译
                        parent.classList.add("notranslate");
                        console.log(`✅ 自定义翻译成功: '${originalText}' → '${translated}'`);
                    } else if (allowGoogleFallback && !changed && currentLang !== 'nl' && originalText.length > 2) {
                        // 第二原则：没有自定义翻译时使用Google翻译
                        console.log(`⚠️ 未找到自定义翻译: '${originalText}' - 将使用Google翻译`);
                        untranslatedElements.push({ element: parent, originalText });
                    }
                }
            }
        }
    }

    translateElement(targetElement);
    
    // Apply Google Translate to untranslated elements if any
    if (allowGoogleFallback && untranslatedElements.length > 0 && currentLang !== 'nl') {
        console.log(`🔄 发现 ${untranslatedElements.length} 个未翻译文本，尝试使用Google翻译...`);
        applyGoogleTranslateToElements(untranslatedElements);
    }
}

// Apply Google Translate to specific elements that weren't found in custom dictionary
function applyGoogleTranslateToElements(untranslatedElements) {
    const currentLang = document.documentElement.lang || 'nl';
    
    // Only proceed if page language is not Dutch
    if (currentLang === 'nl') {
        console.log("⚠️ 页面为荷兰语，无需Google翻译");
        return;
    }
    
    // 对于动态内容，优先使用简化的翻译方法
    const isDynamicContent = untranslatedElements.some(item => 
        item.element.closest('#messageBar-dynamic') || 
        item.element.closest('.message-bar-dynamic')
    );
    
    if (isDynamicContent) {
        console.log("🍜 检测到动态菜品面板，使用简化翻译策略");
        applySimplifiedTranslation(untranslatedElements);
        return;
    }

    // Check if Google Translate is available, if not, try to initialize
    if (!window.google || !window.google.translate) {
        console.log("🔄 Google翻译未初始化，正在初始化...");
        initializeGoogleTranslateForFallback();
        // Use simplified translation as fallback
        setTimeout(() => {
            applySimplifiedTranslation(untranslatedElements);
        }, 1000);
        return;
    }

    // Create a temporary container for Google Translate
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.visibility = 'hidden';
    tempContainer.setAttribute('class', 'temp-translate-container');
    document.body.appendChild(tempContainer);

    // Add untranslated text to temp container
    untranslatedElements.forEach((item, index) => {
        const tempElement = document.createElement('span');
        tempElement.textContent = item.originalText;
        tempElement.setAttribute('data-original-index', index);
        tempContainer.appendChild(tempElement);
    });

    // Try to trigger Google Translate on the temp container
    setTimeout(() => {
        try {
            // Check if Google Translate widget exists and is functional
            const googleTranslateElement = document.getElementById('google_translate_element');
            const googleTranslateCombo = document.querySelector('.goog-te-combo');
            const hasWorkingTranslate = googleTranslateElement && 
                                      (googleTranslateElement.querySelector('select') || googleTranslateCombo) &&
                                      window.google && 
                                      window.google.translate &&
                                      window.google.translate.TranslateElement;
            
            if (hasWorkingTranslate) {
                console.log("✅ Google翻译小部件可用，开始翻译...");
                // Force Google Translate to process the temp container
                const event = new Event('DOMContentLoaded', { bubbles: true });
                tempContainer.dispatchEvent(event);
                
                // Monitor for translation completion
                let checkCount = 0;
                const maxChecks = 20;
                
                const checkTranslation = () => {
                    checkCount++;
                    const tempElements = tempContainer.querySelectorAll('span[data-original-index]');
                    let translatedCount = 0;
                    
                    tempElements.forEach(tempElement => {
                        const translatedText = tempElement.textContent;
                        const originalIndex = parseInt(tempElement.getAttribute('data-original-index'));
                        const originalItem = untranslatedElements[originalIndex];
                        
                        if (translatedText && translatedText !== originalItem.originalText) {
                            // Translation successful, apply to original element
                            const textNode = findTextNodeInElement(originalItem.element, originalItem.originalText);
                            if (textNode) {
                                textNode.nodeValue = translatedText;
                                console.log(`✅ Google翻译成功: '${originalItem.originalText}' → '${translatedText}'`);
                                translatedCount++;
                            }
                        }
                    });
                    
                    if (translatedCount > 0 || checkCount >= maxChecks) {
                        // Clean up temp container
                        if (document.body.contains(tempContainer)) {
                            document.body.removeChild(tempContainer);
                        }
                        if (translatedCount > 0) {
                            console.log(`✅ Google翻译完成: ${translatedCount}/${untranslatedElements.length} 个文本已翻译`);
                        } else {
                            console.log("⚠️ Google翻译超时，部分文本可能未翻译");
                        }
                    } else {
                        // Continue checking
                        setTimeout(checkTranslation, 200);
                    }
                };
                
                setTimeout(checkTranslation, 500);
            } else {
                console.log("⚠️ Google翻译小部件不可用，正在尝试重新初始化...");
                initializeGoogleTranslateForFallback();
                if (document.body.contains(tempContainer)) {
                    document.body.removeChild(tempContainer);
                }
            }
        } catch (error) {
            console.error("❌ Google翻译回退失败:", error);
            if (tempContainer.parentNode) {
                document.body.removeChild(tempContainer);
            }
        }
    }, 100);
}

// Helper function to find text node within element
function findTextNodeInElement(element, targetText) {
    const walker = document.createTreeWalker(
        element, 
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while ((node = walker.nextNode())) {
        if (node.nodeValue.trim() === targetText.trim()) {
            return node;
        }
    }
    return null;
}

// Initialize Google Translate specifically for fallback functionality
function initializeGoogleTranslateForFallback() {
    // Check if Google Translate is already initialized
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        console.log("✅ Google翻译已经初始化");
        return;
    }
    
    console.log("🔄 为回退功能初始化Google翻译...");
    
    const googleTranslateElement = document.getElementById("google_translate_element");
    if (!googleTranslateElement) {
        console.warn("⚠️ Google翻译元素未找到");
        return;
    }
    
    // Try to initialize Google Translate
    try {
        // First, make sure the script is loaded
        if (typeof google === 'undefined' || !google.translate) {
            console.log("📥 Google翻译脚本尚未加载，等待加载...");
            
            // Wait for script to load and retry
            let retryCount = 0;
            const maxRetries = 10;
            
            const waitForScript = () => {
                retryCount++;
                if (typeof google !== 'undefined' && google.translate) {
                    console.log("✅ Google翻译脚本已加载");
                    performInitialization();
                } else if (retryCount < maxRetries) {
                    console.log(`⏳ 等待Google翻译脚本加载... (${retryCount}/${maxRetries})`);
                    setTimeout(waitForScript, 500);
                } else {
                    console.error("❌ Google翻译脚本加载超时");
                }
            };
            
            waitForScript();
        } else {
            performInitialization();
        }
        
    } catch (error) {
        console.error("❌ Google翻译初始化失败:", error);
    }
    
    function performInitialization() {
        try {
            // Show translate element temporarily for initialization
            const originalDisplay = googleTranslateElement.style.display;
            googleTranslateElement.style.display = "block";
            
            // Initialize Google Translate with a simple configuration
            new google.translate.TranslateElement({
                pageLanguage: 'nl',
                includedLanguages: 'en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
            
            console.log("✅ Google翻译成功初始化");
            
            // Hide it again after initialization
            setTimeout(() => {
                googleTranslateElement.style.display = originalDisplay || "none";
                console.log("🔧 Google翻译已隐藏但保持功能");
            }, 2000);
            
        } catch (initError) {
            console.error("❌ Google翻译实际初始化失败:", initError);
        }
    }
}

// Auto click Google Translate language
function applyTranslation(languageNativeName) {
    const spanElements = document.querySelectorAll('span');
    const selectLang = Array.from(spanElements).find(span => span.textContent.trim() === "Select Language");

    if (selectLang) {
        selectLang.click();
        setTimeout(() => {
            const observer = new MutationObserver((_, obs) => {
                const updated = document.querySelectorAll('.VIpgJd-ZVi9od-xl07Ob-lTBxed a span');
                const target = Array.from(updated).find(span => span.textContent.includes(languageNativeName));
                if (target) {
                    target.click();
                    document.getElementById("google_translate_element").style.display = "none";
                    
                    // Force apply custom translations after a delay
                    setTimeout(() => {
                        console.log("🔄 Forcing custom translation application...");
                        if (window.customTranslations && Object.keys(window.customTranslations).length > 0) {
                            const targetLang = Object.keys(window.customTranslations)[0];
                            console.log(`🎯 Force applying ${targetLang} translations`);
                            replaceTextInDocument(window.customTranslations[targetLang], false);
                        }
                    }, 500);
                    
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }, 1000);
    }
}

// Simplified translation strategy for dynamic content (more reliable than Google Translate widget)
function applySimplifiedTranslation(untranslatedElements) {
    console.log(`🔧 使用简化翻译策略处理 ${untranslatedElements.length} 个未翻译文本`);
    
    // Basic Dutch to English translation dictionary for common food terms
    const basicTranslations = {
        // Common food terms
        'salade': 'salad',
        'soep': 'soup',
        'vlees': 'meat',
        'vis': 'fish',
        'kip': 'chicken',
        'rundvlees': 'beef',
        'varkensvlees': 'pork',
        'groenten': 'vegetables',
        'rijst': 'rice',
        'noedels': 'noodles',
        'tofu': 'tofu',
        'garnalen': 'shrimp',
        'eend': 'duck',
        'lam': 'lamb',
        
        // Price and quantity terms
        'prijs': 'price',
        'totaal': 'total',
        'subtotaal': 'subtotal',
        'btw': 'vat',
        'per stuk': 'per piece',
        'per portie': 'per serving',
        
        // Common interface terms
        'toevoegen': 'add',
        'verwijderen': 'remove',
        'bestellen': 'order',
        'betalen': 'pay',
        'annuleren': 'cancel',
        'bevestigen': 'confirm',
        'wijzigen': 'modify',
        'terug': 'back',
        'volgende': 'next',
        'vorige': 'previous',
        'sluiten': 'close',
        'openen': 'open',
        
        // Descriptive terms
        'vers': 'fresh',
        'warm': 'warm',
        'koud': 'cold',
        'pittig': 'spicy',
        'zoet': 'sweet',
        'zuur': 'sour',
        'zout': 'salty',
        'krokant': 'crispy',
        'zacht': 'soft',
        'mals': 'tender',
        'sappig': 'juicy',
        'gemarineerd': 'marinated',
        'gebakken': 'fried',
        'gegrild': 'grilled',
        'gestoomd': 'steamed',
        
        // Time and service terms
        'bereidingstijd': 'preparation time',
        'wachttijd': 'waiting time',
        'minuten': 'minutes',
        'uur': 'hour',
        'dag': 'day',
        'week': 'week',
        'maand': 'month',
        
        // Common phrases
        'niet beschikbaar': 'not available',
        'uitverkocht': 'sold out',
        'nieuw': 'new',
        'populair': 'popular',
        'aanbevolen': 'recommended',
        'speciaal': 'special',
        'seizoen': 'season',
        'dagelijks': 'daily',
        
        // Additional common terms
        'inclusief': 'including',
        'exclusief': 'excluding',
        'extra': 'extra',
        'gratis': 'free',
        'optioneel': 'optional',
        'verplicht': 'required'
    };
    
    let translatedCount = 0;
    
    untranslatedElements.forEach(item => {
        const originalText = item.originalText.toLowerCase().trim();
        let translatedText = null;
        
        // Direct match
        if (basicTranslations[originalText]) {
            translatedText = basicTranslations[originalText];
        } else {
            // Try to find partial matches for compound terms
            for (const [dutch, english] of Object.entries(basicTranslations)) {
                if (originalText.includes(dutch)) {
                    translatedText = originalText.replace(new RegExp(dutch, 'gi'), english);
                    break;
                }
            }
        }
        
        if (translatedText) {
            // Preserve original capitalization
            if (item.originalText[0] === item.originalText[0].toUpperCase()) {
                translatedText = translatedText.charAt(0).toUpperCase() + translatedText.slice(1);
            }
            
            // Apply translation to the text node
            const textNode = findTextNodeInElement(item.element, item.originalText);
            if (textNode) {
                textNode.nodeValue = translatedText;
                console.log(`✅ 简化翻译成功: '${item.originalText}' → '${translatedText}'`);
                translatedCount++;
            }
        } else {
            console.log(`⚠️ 未找到翻译: '${item.originalText}'`);
        }
    });
    
    if (translatedCount > 0) {
        console.log(`✅ 简化翻译完成: ${translatedCount}/${untranslatedElements.length} 个文本已翻译`);
    } else {
        console.log("⚠️ 简化翻译未找到匹配项");
    }
}
