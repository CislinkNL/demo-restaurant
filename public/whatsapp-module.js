window.sendWhatsAppMessage = async function (recipientNumber, messageText) {
  const endpoint = "https://europe-west1-diditaxi-klantenservice.cloudfunctions.net/sendWhatsAppMessage";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ recipientNumber, messageText })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ WhatsApp 发送失败:", result);
      return { success: false, error: result.error || "发送失败" };
    }

    console.log("✅ WhatsApp 通知发送成功:", result);
    return { success: true };
  } catch (error) {
    console.error("❌ WhatsApp 通知异常:", error.message);
    return { success: false, error: error.message };
  }
}

window.buildWhatsAppMessageText = function (Bestelling, tafelNr, invoiceNumber, orderLineCount) {
  try {
    if (typeof Bestelling === "string") {
      Bestelling = JSON.parse(Bestelling);
    }

    if (!Array.isArray(Bestelling)) {
      console.warn("⚠️ Bestelling 格式不对，无法生成 WhatsApp 消息");
      return "❌ Ongeldige bestelgegevens.";
    }

    let message = `📩 Nieuwe bestelling (*Tafel ${tafelNr}*, *#${invoiceNumber}*)\n\n`;
    let totalPrice = 0;

    Bestelling.forEach(item => {
      const quantity = parseFloat(item[2]) || 0;
      const price = parseFloat(item[3]) || 0;
      const name = item[5] || "Onbekend";
      const lineTotal = quantity * price;
      totalPrice += lineTotal;

      message += `▶ ${quantity}x ${name} (€${price.toFixed(2)})\n\n`;
    });

    message += `🧾 Totaal items: ${orderLineCount}\n`;
    message += `💰 *Totaal bedrag: €${totalPrice.toFixed(2)}*`;

    return message;
  } catch (error) {
    console.error("❌ Fout bij bouwen van WhatsApp bericht:", error);
    return "❌ Fout bij het genereren van de bestelnotificatie.";
  }
};

window.sendWhatsAppTemplate = async function (recipientNumber, templateData) {
  const endpoint = "https://whatsapp-food-order-template-15705369993.europe-west1.run.app/send-template";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recipientNumber,
        templateData
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ WhatsApp 模板发送失败:", result);
      return { success: false, error: result.error || "发送失败" };
    }

    console.log("✅ WhatsApp 模板发送成功:", result);
    return { success: true };
  } catch (error) {
    console.error("❌ WhatsApp 模板请求异常:", error.message);
    return { success: false, error: error.message };
  }
};


window.sendOrderViaLocalWWeb = async function (phoneList, message) {
  const phones = Array.isArray(phoneList) ? phoneList : [phoneList];
  const results = [];

  for (const phone of phones) {
    try {
      const response = await fetch("https://whatsapp.cislink.nl/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: phone,
          message: message
        })
      });

      const result = await response.json();
      results.push({
        to: phone,
        success: result.success,
        error: result.error || null
      });
    } catch (error) {
      results.push({
        to: phone,
        success: false,
        error: error.message
      });
    }
  }

  return { success: results.every(r => r.success), results };
};



