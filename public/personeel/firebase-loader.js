(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const restName = urlParams.get("rest") || "AsianBouelevard"; // 默认餐厅
  const tafelRaw = "1"; // 员工版本默认桌号1，可通过选择器更改
  const pincode = null; // 员工版本不需要PIN码
  const tafelId = "1"; // 员工版本默认桌号ID，可通过选择器更改

  window.AppConfig = {
    restName,
    tafelRaw,
    tafelId,
    pincode,
    taskNumber: "3093921138", // ✅ POS系统任务编号，可根据餐厅配置
    configReady: false,
    isStaffMode: true, // 标记为员工模式
    updateTableId: function(newTableId) {
      this.tafelId = newTableId;
      this.tafelRaw = newTableId;
      console.log("✅ Staff mode: Table updated to", newTableId);
    }
  };

  // 员工版本不需要检查URL参数
  console.log("✅ Staff mode initialized for restaurant:", restName);

  const database = firebase.database();

  const loadFirebaseConfig = async () => {
    try {
      // 员工版本：使用简化的匿名身份验证
      console.log("🔐 Staff mode: Using anonymous authentication...");
      
      // 使用匿名身份验证（更可靠）
      await firebase.auth().signInAnonymously();
      console.log("✅ Staff mode: Authenticated anonymously");
      
      // 获取配置数据
      console.log("📡 Loading config for restaurant:", restName);
      const configSnapshot = await database.ref(`/${restName}/config`).once("value");
      const config = configSnapshot.val();
      
      if (!config) {
        console.warn("⚠️ No config found in Firebase for:", restName);
        AppConfig.configReady = true;
        return;
      }
      
      console.log("✅ Config loaded successfully");

      AppConfig.pythonAuth = config.pythonAuth || "";
      AppConfig.taskNumber = config.taskNumber || "3093921138"; // ✅ 从Firebase配置加载，提供默认值
      AppConfig.restNaam = config.restNaam || "";
      AppConfig.whatsappPhone = config.whatsappRecipients || [];
      AppConfig.whatsappBerichtAan = config.whatsappBerichtAan === true;
      AppConfig.translateOn = false; // 员工版本禁用翻译功能
      AppConfig.restUrlName = config.restUrlName || "";
      AppConfig.titleImage = config.titleImage || "";
      AppConfig.serverAccessKey = config.server_access || "";
      AppConfig.timeLimit = false; // 员工版本禁用时间限制
      AppConfig.configReady = true;

      console.log("✅ Staff mode AppConfig ready:", {
        restName: AppConfig.restName,
        tafelId: AppConfig.tafelId,
        isStaffMode: AppConfig.isStaffMode,
        pincode: AppConfig.pincode
      });

      if (config.restNaam) document.title = config.restNaam;

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
      setText("tafelNummer", "1"); // 员工版本默认桌号1

      setImage("logo-img-receipt", config.titleImage);
      setText("tafel-nummer", "Tafel - 1"); // 员工版本默认显示桌号1
      
    } catch (error) {
      console.error("❌ Staff mode: Firebase authentication failed:", error);
      // Continue without config but show error
      AppConfig.configReady = true;
      console.log("✅ Staff mode AppConfig ready (fallback):", {
        restName: AppConfig.restName,
        tafelId: AppConfig.tafelId,
        isStaffMode: AppConfig.isStaffMode,
        pincode: AppConfig.pincode
      });
    }
  };

  const loadCategories = () => {
    return database.ref(`/${restName}/categorie`).once("value").then(snapshot => {
      const catData = snapshot.val();
      if (!catData) return;

      document.getElementById("btn-food-main").textContent = "Eten";
      document.getElementById("btn-drink-main").textContent = "Dranken";

      const foodContainer = document.getElementById("foodSubMenu");
      const drinkContainer = document.getElementById("drinksSubMenu");
      foodContainer.innerHTML = "";
      drinkContainer.innerHTML = "";

      const renderCat = (container, type, list) => {
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

      // === 员工端专用：动态Menu's按钮初始化 ===
      // 延迟调用以确保DOM和配置都准备就绪
      console.log('🔄 Firebase配置完成，准备初始化Menu\'s按钮...');
      setTimeout(() => {
        console.log('⏰ 开始尝试初始化Menu\'s按钮 (从firebase-loader)');
        if (typeof window.initDynamicMenusButton === 'function') {
          try { 
            console.log('✅ 找到initDynamicMenusButton函数，开始执行...');
            window.initDynamicMenusButton(); 
          } catch (e) { 
            console.error('❌ initDynamicMenusButton执行失败:', e); 
            // 失败时隐藏按钮
            const btn = document.getElementById('btn-service-main');
            if (btn) {
              btn.style.display = 'none';
              console.log('🙈 已隐藏Menu\'s按钮');
            }
          }
        } else {
          // 如果函数不存在，隐藏按钮
          console.warn('⚠️ initDynamicMenusButton函数未找到');
          const btn = document.getElementById('btn-service-main');
          if (btn) {
            btn.style.display = 'none';
            console.log('🙈 已隐藏Menu\'s按钮');
          }
        }
      }, 1500); // 增加延迟时间
    });
  };

  const setupCategoryClickAutoHide = () => {
    const foodBtns = document.querySelectorAll('.btn-foodlvl2');
    const drinkBtns = document.querySelectorAll('.btn-drinkslvl2');

    foodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('categorie').style.display = 'none';
      });
    });

    drinkBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('categorie').style.display = 'none';
      });
    });
  };

  const loadAantalPers = () => {
    // 员工版本不需要监控特定桌子的人数
    console.log("✅ Staff mode: Skip loading specific table persons count");
  };

  document.addEventListener("DOMContentLoaded", async () => {
    // 谷歌翻译开关逻辑
    function maybeEnableGoogleTranslate() {
      if (window.AppConfig && window.AppConfig.translateOn === false) {
        // 禁用谷歌翻译脚本
        var script = document.getElementById('google-translate-script');
        if (script) script.parentNode.removeChild(script);
      } else {
        // 显示谷歌翻译脚本（如有）
        var script = document.getElementById('google-translate-script');
        if (script) script.style.display = '';
      }
    }
    
    // 员工版本不需要PIN验证，直接初始化
    console.log("✅ Staff mode: Skip PIN verification");
    
    await loadFirebaseConfig();
    maybeEnableGoogleTranslate();
    await loadAantalPers();
    await loadCategories();
    setupCategoryClickAutoHide();
    console.log("✅ firebase-loader.js staff mode initialization complete");
  });
})();