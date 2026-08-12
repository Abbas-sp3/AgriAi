import { logger } from "./logger";
import { openai, isOpenAIConfigured } from "@workspace/integrations-openai-ai-server";

// Simple in-memory cache to avoid re-translating same JSON payloads
const translationCache = new Map<string, any>();

const LANGUAGE_NAMES: Record<string, string> = {
  hi: "Hindi (हिंदी)",
  mr: "Marathi (मराठी)",
  te: "Telugu (తెలుగు)",
  ta: "Tamil (தமிழ்)",
  kn: "Kannada (ಕನ್ನಡ)",
  gu: "Gujarati (ગુજરાતી)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
};

export async function translateJsonResponse<T>(data: T, targetLangCode: string | undefined): Promise<T> {
  if (!isOpenAIConfigured || !targetLangCode || targetLangCode === "en" || !LANGUAGE_NAMES[targetLangCode]) {
    return data;
  }

  const langName = LANGUAGE_NAMES[targetLangCode];
  const inputStr = JSON.stringify({ obj: data });
  
  // Use a string hash or length-based cache key to prevent huge memory bloat
  const cacheKey = `${targetLangCode}-${inputStr.length}-${inputStr.substring(0, 50)}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey) as T;
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.GROQ_CHAT_MODEL ?? "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `You are a professional agricultural translator. 
Translate all human-readable string values (e.g. titles, summaries, descriptions, crop names, advice, seasons, soil types) into ${langName}.
CRITICAL RULES:
1. ONLY translate the string values. DO NOT translate any JSON keys.
2. DO NOT translate URLs, IDs, timestamps, or system codes (like 'kharif', 'rabi', 'zaid' can be transliterated if needed, but english terms used as keys/values for logic should be kept if possible, actually it's fine to translate season names to local language).
3. The input JSON has a root key "obj". Your response MUST be valid JSON with the exact same "obj" root structure containing the translated data.
4. Keep the translation natural and farmer-friendly.`,
        },
        {
          role: "user",
          content: inputStr,
        },
      ],
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (content) {
      const parsed = JSON.parse(content);
      if (parsed && parsed.obj !== undefined) {
        // Cache for 1 hour approx (we just keep it in memory so it's fine for dev)
        translationCache.set(cacheKey, parsed.obj);
        return parsed.obj as T;
      }
    }
  } catch (err) {
    logger.error({ err, targetLangCode }, "JSON translation failed");
  }

  return data;
}
