import { Router, type IRouter } from "express";
import { openai, isOpenAIConfigured } from "@workspace/integrations-openai-ai-server";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", mr: "Marathi", te: "Telugu",
  ta: "Tamil",   kn: "Kannada", gu: "Gujarati", pa: "Punjabi",
};

interface DiseaseInfo {
  name: string;
  confidence: string;
  severity: string;
  symptoms: string;
  cause: string;
  treatment: string[];
  prevention: string[];
}

interface DetectionResult {
  cropIdentified: string;
  isHealthy: boolean;
  diseases: DiseaseInfo[];
  immediateAction: string;
  estimatedYieldImpact: string;
}

router.post("/disease/detect", async (req, res): Promise<void> => {
  if (!isOpenAIConfigured) {
    res.status(503).json({ error: "AI is not configured on this server." });
    return;
  }

  const { imageBase64, mimeType, lang = "en" } = req.body as {
    imageBase64?: string;
    mimeType?: string;
    lang?: string;
  };

  if (!imageBase64 || typeof imageBase64 !== "string") {
    res.status(400).json({ error: "imageBase64 is required" });
    return;
  }

  const mime = (mimeType || "image/jpeg").replace(/[^a-z/]/gi, "");
  const languageName = LANGUAGE_NAMES[lang] || "English";

  logger.info({ lang, mime }, "Disease detection request");

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.GROQ_VISION_MODEL ?? "llama-3.2-11b-vision-preview",
      max_completion_tokens: 900,
      messages: [
        {
          role: "system",
          content: `You are an expert agricultural plant pathologist AI. Your job is to analyze crop photos and identify diseases, pest damage, or nutritional deficiencies. Always respond with valid JSON only — no markdown, no extra text.`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mime};base64,${imageBase64}`,
                detail: "high",
              },
            },
            {
              type: "text",
              text: `Analyze this crop image and identify any diseases, pests, or nutritional problems. Respond in ${languageName} language.

Return ONLY this JSON structure (no markdown wrapping):
{
  "cropIdentified": "crop name",
  "isHealthy": false,
  "diseases": [
    {
      "name": "disease name",
      "confidence": "High",
      "severity": "Moderate",
      "symptoms": "visible symptoms description",
      "cause": "fungal / bacterial / viral / pest / nutritional",
      "treatment": ["step 1", "step 2", "step 3"],
      "prevention": ["tip 1", "tip 2"]
    }
  ],
  "immediateAction": "most urgent action the farmer should take today",
  "estimatedYieldImpact": "e.g. 20-30% loss if untreated"
}

If the crop is healthy, set isHealthy to true and diseases to []. If you cannot identify it as a crop or plant, set cropIdentified to "Unknown" and isHealthy to true.`,
            },
          ],
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let result: DetectionResult;
    try {
      result = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      logger.warn({ raw }, "Failed to parse disease detection JSON");
      result = {
        cropIdentified: "Unknown",
        isHealthy: true,
        diseases: [],
        immediateAction: "",
        estimatedYieldImpact: "",
      };
    }

    logger.info({ crop: result.cropIdentified, diseaseCount: result.diseases?.length }, "Disease detection complete");

    res.json(result);
  } catch (err) {
    logger.error({ err }, "Disease detection failed");
    res.status(500).json({ error: "Detection failed. Please try again." });
  }
});

export default router;
