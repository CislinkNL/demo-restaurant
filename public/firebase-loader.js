(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const restName = urlParams.get("rest");
  const tafelRaw = urlParams.get("tafel");
  const pincode = urlParams.get("pincode");
  const tafelId = tafelRaw ? `Tafel-${tafelRaw}` : null;

  // 🔥 立即设置AppConfig，确保其他脚本可以立即访问
  window.AppConfig = {
    restName,
    tafelRaw,
    tafelId,
    pincode,
    taskNumber: "3093921138",
    configReady: false
  };

  console.log('🚀 AppConfig set immediately on script load:', {
    restName: window.AppConfig.restName,
    tafelId: window.AppConfig.tafelId,
    tafelRaw: window.AppConfig.tafelRaw
  });

  // 🔒 智能Pincode验证helper函数
  const validatePincode = async (pincode, restName, tafelId) => {
    try {
      const db = firebase.database();
      const tableRef = db.ref(`${restName}/tafel/${tafelId}`);
      const snapshot = await tableRef.once('value');
      const tableData = snapshot.val();

      if (!tableData) {
        console.log('🔒 桌台数据不存在');
        return false;
      }

      const tafelPin = tableData.Pincode || "";
      const status = tableData.Status || "gesloten";
      
      console.log(`🔒 PIN验证 - URL: ${pincode}, Firebase: ${tafelPin}, 状态: ${status}`);
      
      // 验证pincode是否匹配和桌台是否开放
      return String(pincode) === String(tafelPin) && status === 'open';
    } catch (error) {
      console.error('🔒 PIN验证失败:', error);
      return false;
    }
  };

  // 🔒 显示pincode验证弹窗
  const showPincodeModal = (errorMsg = 'Voer een 3- of 4-cijferige pincode in om verder te gaan.', isError = false) => {
    const modal = document.getElementById('pin-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
    
    const input = document.getElementById('pin-input');
    const error = document.getElementById('pin-error');
    
    if (input) {
      input.value = '';
      input.focus();
    }
    
    if (error) {
      error.textContent = errorMsg;
      
      // 如果是错误消息，设置醒目的红色样式
      if (isError || errorMsg.includes('onjuist') || errorMsg.includes('gesloten')) {
        error.style.color = 'red';
        error.style.fontWeight = 'bold';
        error.style.fontSize = '16px';
        error.style.setProperty('color', 'red', 'important');
        error.style.setProperty('font-weight', 'bold', 'important');
        error.style.setProperty('font-size', '16px', 'important');
      } else {
        // 普通提示使用默认样式
        error.style.color = '';
        error.style.fontWeight = '';
        error.style.fontSize = '';
      }
    }
    
    const submitBtn = document.getElementById('pin-submit');
    if (submitBtn) {
      submitBtn.onclick = function() {
        const val = input ? input.value.trim() : '';
        if (!/^\d{3,4}$/.test(val)) {
          if (error) {
            error.textContent = 'Voer een geldige 3- of 4-cijferige pincode in.';
            // 设置错误样式
            error.style.color = 'red';
            error.style.fontWeight = 'bold';
            error.style.fontSize = '16px';
            error.style.setProperty('color', 'red', 'important');
            error.style.setProperty('font-weight', 'bold', 'important');
            error.style.setProperty('font-size', '16px', 'important');
          }
          if (input) input.focus();
          return;
        }
        if (error) error.textContent = '';
        const url = new URL(window.location.href);
        url.searchParams.set('pincode', val);
        window.location.href = url.toString();
      };
    }
    
    if (input) {
      input.onkeydown = function(e) {
        if (e.key === 'Enter' && submitBtn) {
          submitBtn.click();
        }
      };
    }
  };

  // 🔥 主要的初始化逻辑
  const initializeApp = async () => {
    console.log('🔥 Starting app initialization...');

    if (!restName || !tafelRaw) {
      console.warn("⚠️ Missing ?rest or ?tafel in URL");
      return;
    }

    // 🔒 pincode验证逻辑 - 必须验证通过才能继续
    console.log('🔒 开始pincode验证流程...');
    
    // 等待Firebase初始化
    let retryCount = 0;
    const maxRetries = 10;
    
    while (!firebase?.database && retryCount < maxRetries) {
      console.log(`🔒 等待Firebase初始化... (${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 500));
      retryCount++;
    }
    
    if (!firebase?.database) {
      console.error('🔒 Firebase初始化失败');
      showPincodeModal('系统初始化失败，请输入pincode。');
      return;
    }
    
    // 如果URL有pincode参数，验证它
    if (pincode) {
      console.log('🔒 检测到URL中的pincode，开始验证...');
      const isValid = await validatePincode(pincode, restName, tafelId);
      
      if (isValid) {
        console.log('✅ URL中的pincode验证成功，继续加载页面');
        // 隐藏可能存在的弹窗
        const modal = document.getElementById('pin-modal');
        if (modal) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      } else {
        console.log('❌ URL中的pincode验证失败，显示验证弹窗');
        showPincodeModal('Uw pincode is onjuist of de tafel is gesloten. Voer een geldige pincode in.', true);
        return;
      }
    } else {
      console.log('🔒 URL中没有pincode参数，显示验证弹窗');
      showPincodeModal('Voer een 3- of 4-cijferige pincode in om verder te gaan.');
      return;
    }

    // 🔥 继续正常的Firebase加载流程
    await loadFirebaseContent();
  };

  // 🔥 Firebase内容加载函数
  const loadFirebaseContent = async () => {
    const database = firebase.database();

    // 加载配置
    try {
      const configSnapshot = await database.ref(`/${restName}/config`).once("value");
      const config = configSnapshot.val();
      
      if (!config) {
        console.warn("No config found in Firebase for:", restName);
        return;
      }

      // 更新AppConfig
      window.AppConfig.pythonAuth = config.pythonAuth || "";
      window.AppConfig.taskNumber = config.taskNumber || "3093921138";
      window.AppConfig.restNaam = config.restNaam || "";
      window.AppConfig.whatsappPhone = config.whatsappRecipients || [];
      window.AppConfig.whatsappBerichtAan = config.whatsappBerichtAan === true;
      window.AppConfig.translateOn = config.translateOn !== false;
      window.AppConfig.restUrlName = config.restUrlName || "";
      window.AppConfig.titleImage = config.titleImage || "";
      window.AppConfig.serverAccessKey = config.server_access || "";
      window.AppConfig.timeLimit = config.timeLimit !== undefined ? config.timeLimit : true;
      window.AppConfig.round_time = config.round_time || "15";
      window.AppConfig.etenLimiet = config.etenLimiet || "5";
      window.AppConfig.dessertLimiet = config.dessertLimiet || "2";
      window.AppConfig.maxTijd = config.maxTijd || "150";
      window.AppConfig.configReady = true;

      if (config.restNaam) document.title = config.restNaam;

      // 设置页面元素
      const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
      };
      const setImage = (id, url) => {
        const el = document.getElementById(id);
        if (el) el.src = url;
      };

      setImage("titleImage", config.titleImage);
      setText("restName", config.restUrlName);
      setText("restNaam", config.restUrlName);
      setText("limiet_eten", config.etenLimiet);
      setText("limiet_dessert", config.dessertLimiet);
      setText("refreshURL", config.url2);
      setText("webhook", config.WebHook);
      setText("webhookHealthUrl", config.WebHookStatus);
      setText("maxTijd", config.maxTijd);
      setText("eerste_ronde_tijd", config.eerste_ronde_tijd);
      setText("pythonAuth", config.pythonAuth);
      setText("savedPin", config.savedPincode);
      setText("tafelNummer", tafelRaw);

      setImage("logo-img-receipt", config.titleImage);
      setText("tafel-nummer", `Tafel - ${tafelRaw}`);

      console.log("✅ Firebase config loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load Firebase config:", error);
    }

    // 🔥 加载其他重要内容
    await loadCategories();
    setupCategoryClickAutoHide();
    await loadAantalPers();
    maybeEnableGoogleTranslate();
    
    console.log("✅ firebase-loader.js initialization complete");
  };

  // 🔥 加载分类功能
  const loadCategories = () => {
    return database.ref(`/${restName}/categorie`).once("value").then(snapshot => {
      const catData = snapshot.val();
      if (!catData) return;

      document.getElementById("btn-food-main").textContent = "Eten";
      document.getElementById("btn-drink-main").textContent = "Dranken";

      const foodContainer = document.getElementById("foodSubMenu");
      const drinkContainer = document.getElementById("drinksSubMenu");
      if (foodContainer) foodContainer.innerHTML = "";
      if (drinkContainer) drinkContainer.innerHTML = "";

      const renderCat = (container, type, list) => {
        if (!container) return;
        list.forEach(cat => {
          const btn = document.createElement("a");
          btn.className = `btn btn-outline-success btn-lg active btn-menu btn-lvl2 ${type === 'food' ? 'btn-foodlvl2' : 'btn-drinkslvl2'}`;
          btn.href = `#${cat.target}`;
          btn.id = cat.id;
          btn.setAttribute("role", "button");
          btn.setAttribute("aria-pressed", "true");
          btn.textContent = cat.name;
          container.appendChild(btn);
        });
      };

      if (catData.food) renderCat(foodContainer, 'food', catData.food);
      if (catData.drinks) renderCat(drinkContainer, 'drinks', catData.drinks);

      // 加载服务分类配置
      if (catData.serviceCat) {
        window.AppConfig.serviceCat = {
          displayName: catData.serviceCat.displayName || catData.serviceCat.name || 'Service',
          directTarget: catData.serviceCat.directTarget || undefined,
          directLink: catData.serviceCat.directLink || undefined,
          items: Array.isArray(catData.serviceCat.items) ? catData.serviceCat.items : undefined
        };
        
        setTimeout(() => {
          if (typeof window.initServiceCategoryFromConfig === 'function') {
            try { window.initServiceCategoryFromConfig(); } catch (e) { console.warn('initServiceCategoryFromConfig rerun failed', e); }
          } else {
            const btn = document.getElementById('btn-service-main');
            if (btn && window.AppConfig.serviceCat.displayName) btn.textContent = window.AppConfig.serviceCat.displayName;
          }
        }, 80);
      } else {
        const btn = document.getElementById('btn-service-main');
        if (btn) btn.style.display = 'none';
      }
    });
  };

  // 🔥 设置分类点击自动隐藏
  const setupCategoryClickAutoHide = () => {
    const foodBtns = document.querySelectorAll('.btn-foodlvl2');
    const drinkBtns = document.querySelectorAll('.btn-drinkslvl2');

    foodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const categorie = document.getElementById('categorie');
        if (categorie) categorie.style.display = 'none';
      });
    });

    drinkBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const categorie = document.getElementById('categorie');
        if (categorie) categorie.style.display = 'none';
      });
    });
  };

  // 🔥 加载人数
  const loadAantalPers = () => {
    const database = firebase.database();
    const ref = database.ref(`${restName}/tafel/${tafelId}/Persons`);
    return new Promise((resolve) => {
      ref.on("value", snapshot => {
        const value = snapshot.val();
        if (value !== null) {
          const el = document.getElementById("aantal_pers");
          if (el) el.textContent = value;
          console.log(`✅ Aantal personen geladen: ${value}`);
        }
        resolve();
      });
    });
  };

  // 🔥 谷歌翻译开关逻辑
  const maybeEnableGoogleTranslate = () => {
    if (window.AppConfig && window.AppConfig.translateOn === false) {
      const script = document.getElementById('google-translate-script');
      if (script) script.parentNode.removeChild(script);
    } else {
      const script = document.getElementById('google-translate-script');
      if (script) script.style.display = '';
    }
  };

  // 🔥 启动应用
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

})();