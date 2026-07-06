import axios from "axios";

/**
 * ترجمه متن با استفاده از API رایگان LibreTranslate
 * زبان ورودی به صورت خودکار تشخیص داده می‌شود.
 * خروجی: متن ترجمه‌شده
 */

export async function translateText(text, targetLang = "fa") {
  if (!text) return "";

  try {
    const res = await axios.post(
      "https://libretranslate.com/translate",
      {
        q: text,
        source: "auto",
        target: targetLang,
        format: "text",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.data.translatedText;
  } catch (error) {
    console.error("Error translating text:", error.message);
    return text; // اگر خطایی شد، متن اصلی را برگرداند
  }
}
