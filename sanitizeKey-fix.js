// 修改后的 sanitizeKey 函数 - 保持原始大小写
function sanitizeKey(key) {
  if (typeof key !== "string") {
    key = String(key); // ✅ Convert non-string values to a string
  }

  return key
    .trim() // Remove leading/trailing spaces
    .replace(/[.#$\[\]\/]/g, "_") // Replace Firebase-restricted characters with underscores
    .replace(/\s+/g, "_"); // Replace spaces with underscores for consistency
    // ❌ 移除了 .toLowerCase() - 保持原始大小写
}

// 或者，如果您想要更智能的处理：
function sanitizeKeyWithSmartCase(key) {
  if (typeof key !== "string") {
    key = String(key); // ✅ Convert non-string values to a string
  }

  let sanitized = key
    .trim() // Remove leading/trailing spaces
    .replace(/[.#$\[\]\/]/g, "_") // Replace Firebase-restricted characters with underscores
    .replace(/\s+/g, "_"); // Replace spaces with underscores for consistency

  // 选择：保持原始大小写 或 转换为小写用于一致性
  // 如果您的翻译系统已经支持大小写不敏感匹配，可以保持原始大小写
  return sanitized; // 保持原始大小写
  // return sanitized.toLowerCase(); // 或转换为小写保持一致性
}