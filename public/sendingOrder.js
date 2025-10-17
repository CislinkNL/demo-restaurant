// sendingOrder.js  — optimized on top of version #2

async function sendDirect(timerText, tafelNr, orderLineCount, newInvoiceNumber, Bestelling) {
  console.log("sendDirect called with:", { Bestelling, newInvoiceNumber });

  // 🔒 第三层防护：最终Pincode验证（发送订单前）
  try {
    const rest = window.AppConfig?.restName || 'asianboulevard';
    const tafelId = `Tafel-${tafelNr}`;
    const savedPin = window.AppConfig?.pincode;

    if (!rest || !tafelId || !savedPin) {
      console.error("❌ 第三层防护：AppConfig不完整");
      return "Fout: Configuratie ontbreekt. Ververs de pagina.";
    }

    const db = firebase.database();
    const tableRef = db.ref(`${rest}/tafel/${tafelId}`);
    const snapshot = await tableRef.once('value');
    const tableData = snapshot.val();

    if (!tableData) {
      console.error("❌ 第三层防护：Tafelgegevens niet gevonden");
      return "Fout: Tafelgegevens niet gevonden.";
    }

    const tafelPin = tableData.Pincode || "";
    const status = tableData.Status || "gesloten";

    console.log(`🔐 第三层防护 - 最终PIN验证 — URL: ${savedPin}, Firebase: ${tafelPin}, 状态: ${status}`);

    if (String(savedPin) !== String(tafelPin)) {
      console.error("❌ 第三层防护：Pincode不匹配！");
      showNotification(`⚠️ Pincode is gewijzigd! Bestelling kan niet worden verzonden.`, "error", 5000);
      return "Fout: Pincode is niet geldig. Ververs de pagina met de nieuwe pincode.";
    }

    if (status !== 'open') {
      console.error("❌ 第三层防护：Tafel is gesloten");
      showNotification(`Tafel is gesloten. Bestelling kan niet worden verzonden.`, "error", 4000);
      return "Fout: Tafel is gesloten.";
    }

    console.log("✅ 第三层防护：Pincode验证通过，继续发送订单");
  } catch (error) {
    console.error("❌ 第三层防护验证失败:", error);
    return `Fout bij pincode verificatie: ${error.message || String(error)}`;
  }

  const WebHookEl = document.getElementById('webhook');
  const WebHook = WebHookEl?.innerText?.trim?.();
  if (!WebHook) {
    console.error("❌ WebHook URL 未设置（#webhook 元素不存在或无文本）");
    return "Fout: webhook niet ingesteld.";
  }

  const baseInfo = {
    taskNumber: AppConfig?.taskNumber || "3093921138",  // ✅ 从配置获取，提供默认值（与服务端一致）
    orderDrive: "S",
    printTicket: 1,
    tableNameString: tafelNr,
    allInOrderKeerPlus: 1,
    cashierID: 1,
    workerID: 3,
    articleCount: 0,
  };

  // —— 订单内容格式化（保持与原先逻辑一致）——
  function formatContent(BestellingInput, baseInfoRef) {
    console.log("Bestelling before processing:", BestellingInput);

    let arr = BestellingInput;
    if (typeof arr === "string") {
      try {
        arr = JSON.parse(arr);
        console.log("Parsed Bestelling:", arr);
      } catch (error) {
        console.error("Error parsing Bestelling:", error);
        return "";
      }
    }

    if (!Array.isArray(arr)) {
      console.error("Bestelling is not an array or could not be parsed as an array.");
      return "";
    }

    // ✅ 安全的SKU清理函数 - 防止违法字符导致打印失败
    function sanitizeSku(raw) {
      let cleaned = String(raw ?? 'N/A')
        .trim()
        .replace(/[\n\r\t]/g, '_')     // 替换换行符和制表符
        .replace(/[=]/g, '_')          // 替换等号(防止破坏key=value格式)
        .replace(/[^\x20-\x7E]/g, '_') // 替换非ASCII可打印字符
        .replace(/\s+/g, '_')          // 替换空格
        .substring(0, 50);             // 限制长度防止过长
      
      // 🔧 移除设备ID和选项后缀 (例如: sku__options_deviceId -> sku)
      if (cleaned.includes('__')) {
        cleaned = cleaned.split('__')[0];
      }
      
      // 🔧 移除 _default_ 或 _unknown 等设备ID后缀
      cleaned = cleaned.replace(/_default_[a-z0-9]+$/i, '').replace(/_unknown$/i, '');
      
      return cleaned;
    }

    // 转成对象数组
    const items = arr.map((item) => ({
      sku: sanitizeSku(item?.[1]), // ✅ 使用清理后的SKU
      price: item?.[3] ?? 0,
      quantity: item?.[2] ?? 0,
      description: item?.[5] ?? "No description",
      originalDescription: item?.[6] ?? item?.[5] ?? "No description", // 原始荷兰文描述
    }));
    baseInfoRef.articleCount = items.length;

    let formattedString =
      `TASKNUMBER=${baseInfoRef.taskNumber}\n` +
      `ORDER_DRIVE=${baseInfoRef.orderDrive}\n` +
      `PRINTTICKET=${baseInfoRef.printTicket}\n` +
      `TableNameString=${baseInfoRef.tableNameString}\n` +
      `AllInOrderKeerPlus=${baseInfoRef.allInOrderKeerPlus}\n` +
      `CashierID=${baseInfoRef.cashierID}\n` +
      `WorkerID=${baseInfoRef.workerID}\n`;

    items.forEach((item, index) => {
      const itemSku = item.sku; // ✅ 已经通过sanitizeSku清理过
      const itemPrice = (item.price !== undefined && item.price !== "")
        ? parseFloat(Number(item.price).toFixed(2))
        : 0;
      const itemQuantity = item.quantity ?? 0;
      const itemDescription = item.originalDescription ?? item.description ?? "No description";

      formattedString +=
        `${index}_ArtNRchar=${itemSku}\n` +
        `${index}_ArtCount=${itemQuantity}\n` +
        `${index}_ArtPrice=${itemPrice}\n` +
        `${index}_ArtEuroName=${itemDescription}\n`; //留空的意思是按照kassa的名称打印
    });

    formattedString += `\nArticleCount=${items.length}`;
    console.log("Formatted String:", formattedString);
    return formattedString;
  }

  // —— 仅用于消息文本：保证 Bestelling 为数组（防止未解析导致消息异常）——
  function normalizeBestellingForMessage(raw) {
    if (typeof raw === "string") {
      try { return JSON.parse(raw); } catch { return []; }
    }
    return Array.isArray(raw) ? raw : [];
  }

  // —— 获取本地 WhatsApp Web 状态（带超时）——
  async function isLocalWhatsAppOnline(statusUrl = "https://whatsapp.cislink.nl/status", timeoutMs = 2500) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const resp = await fetch(statusUrl, { signal: ctrl.signal });
      if (!resp.ok) return false;
      const data = await resp.json().catch(() => ({}));
      return data?.state === "CONNECTED";
    } catch (err) {
      console.warn("⚠️ 获取本地 WhatsApp 状态失败：", err?.message || err);
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  // —— 统一的发送 WhatsApp（本地优先→云端回退），不会 throw —— 
  async function sendWhatsAppWithFallback(recipients, messageText) {
    // 依赖注入校验
    const sendViaLocal = window?.sendOrderViaLocalWWeb;
    const sendViaCloud = window?.sendWhatsAppMessage;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      console.warn("⚠️ WhatsApp 收件人为空，跳过发送");
      return { success: false, reason: "no_recipients" };
    }
    if (typeof messageText !== "string" || !messageText.trim()) {
      console.warn("⚠️ WhatsApp 文本为空，跳过发送");
      return { success: false, reason: "empty_message" };
    }

    let used = "none";
    try {
      const localOnline = await isLocalWhatsAppOnline();
      if (localOnline && typeof sendViaLocal === "function") {
        used = "local";
        const r = await sendViaLocal(recipients, messageText);
        logWhatsAppResults(r, "本地 WhatsApp");
        // 新增：如果本地返回202，直接视为成功
        if (r && (r.status === 202 || isResultSuccess(r))) return { success: true, used };
        console.warn("⚠️ 本地 WhatsApp 发送失败，尝试云端回退…");
      }

      if (typeof sendViaCloud === "function") {
        used = "cloud";
        const r = await sendViaCloud(recipients, messageText);
        logWhatsAppResults(r, "WhatsApp Cloud");
        if (isResultSuccess(r)) return { success: true, used };
      } else {
        console.warn("⚠️ 未提供云端发送函数 sendWhatsAppMessage，无法回退");
      }

      return { success: false, used };
    } catch (err) {
      console.warn("⚠️ WhatsApp 发送异常：", err?.message || err);
      return { success: false, used, error: err?.message || String(err) };
    }
  }

  function isResultSuccess(result) {
    if (!result) return false;
    if (Array.isArray(result.results)) {
      // 批量：只要全部成功才算成功；如需“部分成功算成功”，可改为 some()
      return result.results.every(r => r?.success === true);
    }
    return !!result.success;
  }

  function logWhatsAppResults(result, label) {
    if (Array.isArray(result?.results)) {
      result.results.forEach(r => {
        if (!r?.success) console.warn(`⚠️ ${label} 失败:`, r?.to, r?.error);
      });
    } else if (!result?.success) {
      console.warn(`⚠️ ${label} 失败:`, result?.error);
    } else {
      console.log(`✅ ${label} 发送成功`);
    }
  }

  // —— 生成订单文本 —— 
  const formattedContent = formatContent(Bestelling, baseInfo);

  // —— 发送到 WebHook —— 
  const orderDetails = {
    fileName: `Order_${tafelNr}_C6K1.${newInvoiceNumber}`,
    content: formattedContent,
    serieNum: newInvoiceNumber,
    TafelNr: tafelNr,
  };
  console.log("Order details payload:", JSON.stringify(orderDetails));

  try {
    const response = await fetch(WebHook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderDetails),
    });

    console.log("Webhook response code:", response.status);

    if (!response.ok) {
      console.error("Unexpected response code:", response.status);
      if (response.status === 502) {
        throw new Error("502 Bad Gateway: De server is niet beschikbaar. Probeer later opnieuw.");
      }
      throw new Error(`Unexpected response code: ${response.status}`);
    }

    // —— WebHook 成功后：尝试发送 WhatsApp（不阻断主流程）——
    try {
      await (order?.waitForAppConfig?.()); // 等待配置加载（存在性可选）
      const recipientPhone = AppConfig?.whatsappPhone;
      const whatsappBerichtAan = AppConfig?.whatsappBerichtAan;

      if (whatsappBerichtAan) {
        if (recipientPhone) {
          const parsedForMsg = normalizeBestellingForMessage(Bestelling);
          if (typeof window?.buildWhatsAppMessageText === "function") {
            const messageText = window.buildWhatsAppMessageText(
              parsedForMsg, tafelNr, newInvoiceNumber, orderLineCount
            );
            const recipients = Array.isArray(recipientPhone) ? recipientPhone : [recipientPhone];
            const waResult = await sendWhatsAppWithFallback(recipients, messageText);
            if (!waResult.success) {
              console.warn("⚠️ WhatsApp 通知未成功（不影响下单成功）：", waResult);
            }
          } else {
            console.warn("⚠️ 缺少 buildWhatsAppMessageText 函数，跳过 WhatsApp 通知");
          }
        } else {
          console.warn("⚠️ AppConfig.whatsappPhone 未设置，跳过 WhatsApp 通知");
        }
      } else {
        console.log("ℹ️ whatsappBerichtAan is false, skipping WhatsApp notification.");
      }
    } catch (notifyErr) {
      console.warn("⚠️ 发送 WhatsApp 通知过程出现异常（不影响下单）：", notifyErr?.message || notifyErr);
    }

    // —— 与第一段保持一致：给调用方明确的成功返回值 —— 
    return "Bestelling succesvol verzonden!";

  } catch (error) {
    console.error("Error in sendDirect:", error?.toString?.() || error);
    return `Fout bij het verzenden van de bestelling: ${error.message || String(error)}`;
  }
}
