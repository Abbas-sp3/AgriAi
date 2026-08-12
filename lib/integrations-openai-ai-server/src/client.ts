import OpenAI from "openai";

const baseURL =
  process.env.AI_INTEGRATIONS_OPENAI_BASE_URL ??
  process.env.GROQ_BASE_URL ??
  process.env.OPENAI_BASE_URL ??
  (process.env.GROQ_API_KEY ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1");

const apiKey =
  process.env.AI_INTEGRATIONS_OPENAI_API_KEY ??
  process.env.GROQ_API_KEY ??
  process.env.OPENAI_API_KEY ??
  "";

export const isOpenAIConfigured = apiKey.length > 0;

export const openai = new OpenAI({
  apiKey,
  baseURL,
});
