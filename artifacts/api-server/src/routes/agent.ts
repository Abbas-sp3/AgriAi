import { Router, type IRouter } from "express";
import { openai, isOpenAIConfigured } from "@workspace/integrations-openai-ai-server";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const GROQ_CHAT_MODEL =
  process.env.GROQ_CHAT_MODEL ??
  "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are SmartKisan AI's intelligent voice navigation agent for Indian farmers. Your job is to understand spoken commands and return a structured JSON action.

SUPPORTED LANGUAGES (detect which one the user is speaking):
- en: English — keywords: "English"
- hi: Hindi — keywords: "Hindi", "हिंदी", "hindi"
- mr: Marathi — keywords: "Marathi", "मराठी", "marathi"
- te: Telugu — keywords: "Telugu", "తెలుగు", "telugu"
- ta: Tamil — keywords: "Tamil", "தமிழ்", "tamil"
- kn: Kannada — keywords: "Kannada", "ಕನ್ನಡ", "kannada"
- gu: Gujarati — keywords: "Gujarati", "ગુજરાતી", "gujarati"
- pa: Punjabi — keywords: "Punjabi", "ਪੰਜਾਬੀ", "punjabi"

APP PAGES — map user intent to the correct path:
- /dashboard  → home, overview, main, dashboard, शुरुआत, ਘਰ
- /predict    → crop prediction, what to grow, soil analysis, fertilizer, NPK, फसल अनुशंसा, ਫਸਲ ਭਵਿੱਖਬਾਣੀ, పంట సూచన
- /advisor    → advice, chat, expert, ask, help, questions, सलाहकार, ਸਲਾਹਕਾਰ, సలహాదారు
- /weather    → weather, rain, temperature, forecast, climate, मौसम, ਮੌਸਮ, வானிலை, వాతావరణం, ಹವಾಮಾನ
- /news       → news, schemes, government, PM Kisan, Fasal Bima, subsidy, समाचार, योजना, ਸਕੀਮਾਂ, திட்டம்
- /calendar   → calendar, planting, harvest, sowing, season, कैलेंडर, ਕੈਲੰਡਰ, క్యాలెండర్
- /disease    → disease, sick plant, leaf spots, yellowing, blight, pest, crop infection, plant problem, रोग, बीमारी, ਬਿਮਾਰੀ, రోగ, ರೋಗ, நோய், रोग पहचान, मेरे पौधे में बीमारी, my plant is sick, plant disease detector

DECISION RULES:
1. LANGUAGE SWITCH: If the user says ONLY a language name (e.g. "Hindi", "हिंदी", "Gujarati") → action = "switch_language", set targetLang to that language code.
2. NAVIGATE: If user mentions a feature or page → action = "navigate", set target to the path.
3. ANSWER: If user asks a farming question → action = "answer", provide a brief helpful answer.
4. Always detect which language the user is speaking (even if imperfect transcription).
5. Respond in the "message" field using the DETECTED language. Keep messages short (1-2 sentences).

Return ONLY valid JSON (absolutely no markdown, no backticks):
{
  "detectedLang": "en",
  "action": "navigate",
  "target": "/disease",
  "targetLang": null,
  "message": "Taking you to the Crop Disease Detector now!"
}`;

interface AgentResponse {
  detectedLang: string;
  action: "navigate" | "switch_language" | "answer" | "none";
  target: string | null;
  targetLang: string | null;
  message: string;
}

router.post("/agent/command", async (req, res): Promise<void> => {
  if (!isOpenAIConfigured) {
    res.status(503).json({ error: "AI is not configured on this server." });
    return;
  }

  const { transcript, currentPage, lang } = req.body as {
    transcript?: string;
    currentPage?: string;
    lang?: string;
  };

  if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
    res.status(400).json({ error: "transcript is required" });
    return;
  }

  logger.info({ transcript: transcript.substring(0, 100), currentPage, lang }, "Agent command received");

  try {
    const completion = await openai.chat.completions.create({
      model: GROQ_CHAT_MODEL,
      max_completion_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Current page: ${currentPage || "/"}\nCurrent language: ${lang || "en"}\nUser said: "${transcript.trim()}"`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: AgentResponse;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      logger.warn({ raw }, "Failed to parse agent JSON");
      parsed = {
        detectedLang: lang || "en",
        action: "answer",
        target: null,
        targetLang: null,
        message: "I'm sorry, I didn't understand that. Could you please try again?",
      };
    }

    logger.info({ action: parsed.action, detectedLang: parsed.detectedLang, target: parsed.target }, "Agent response");
    res.json(parsed);
  } catch (err) {
    logger.error({ err }, "Agent command failed");
    res.status(500).json({ error: "Agent processing failed" });
  }
});

export default router;
