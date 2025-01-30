import axios from "axios";

const TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const TRANSLATE_API_URL =
  "https://translation.googleapis.com/language/translate/v2";

export async function translateText(text, targetLang, sourceLang = "en") {
  try {
    const response = await axios.post(
      `${TRANSLATE_API_URL}?key=${TRANSLATE_API_KEY}`,
      {
        q: text,
        target: targetLang,
        source: sourceLang,
      }
    );

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

export async function detectLanguage(text) {
  try {
    const response = await axios.post(
      `${TRANSLATE_API_URL}/detect?key=${TRANSLATE_API_KEY}`,
      {
        q: text,
      }
    );

    return response.data.data.detections[0][0].language;
  } catch (error) {
    console.error("Language detection error:", error);
    throw error;
  }
}
