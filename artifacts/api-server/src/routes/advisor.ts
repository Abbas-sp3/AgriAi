import { Router, type IRouter } from "express";
import { AskAdvisorBody, AskAdvisorResponse } from "@workspace/api-zod";
import { getAdvisorResponse } from "../lib/aiEngine";
import { isOpenAIConfigured, textToSpeech } from "@workspace/integrations-openai-ai-server/audio";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/ask", async (req, res): Promise<void> => {
  const parsed = AskAdvisorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { query, context, conversationHistory } = parsed.data;
  const result = await getAdvisorResponse(
    query,
    context ?? {},
    conversationHistory ?? [],
  );

  res.json(AskAdvisorResponse.parse(result));
});

router.post("/advisor/tts", async (req, res): Promise<void> => {
  if (!isOpenAIConfigured) {
    res.status(503).json({ error: "AI is not configured on this server." });
    return;
  }

  const { text } = req.body as { text?: string };
  if (!text || typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  try {
    // Limit to 800 chars to keep TTS fast
    const trimmed = text.trim().substring(0, 800);
    logger.info({ chars: trimmed.length }, "TTS request");

    const audioBuffer = await textToSpeech(trimmed, "nova", "mp3");
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.length);
    res.setHeader("Cache-Control", "no-store");
    res.send(audioBuffer);
  } catch (err) {
    logger.error({ err }, "TTS failed");
    res.status(500).json({ error: "TTS generation failed" });
  }
});

export default router;
