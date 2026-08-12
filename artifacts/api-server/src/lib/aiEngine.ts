import { logger } from "./logger";
import { openai, isOpenAIConfigured } from "@workspace/integrations-openai-ai-server";

const GROQ_CHAT_MODEL =
  process.env.GROQ_CHAT_MODEL ??
  "llama-3.3-70b-versatile";

interface AdvisorContext {
  location?: string;
  crop?: string;
  season?: string;
  language?: string;
}

interface ConversationMessage {
  role: string;
  content: string;
}

// ─────────────────────────────────────────
// LANGUAGE NAMES
// ─────────────────────────────────────────
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिंदी)",
  mr: "Marathi (मराठी)",
  te: "Telugu (తెలుగు)",
  ta: "Tamil (தமிழ்)",
  kn: "Kannada (ಕನ್ನಡ)",
  gu: "Gujarati (ગુજરાતી)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
};

// ─────────────────────────────────────────
// INDIA REGIONAL DATA
// ─────────────────────────────────────────
const INDIA_REGIONAL_DATA: Record<string, {
  temperature: string; humidity: string; rainfall: string;
  normal_crops: string[]; exotic_crops: string[];
}> = {
  "Punjab":           { temperature:"30-38°C", humidity:"35-55%", rainfall:"30-50mm",   normal_crops:["Wheat","Maize","Sugarcane","Barley"],               exotic_crops:["Broccoli","Bell Pepper","Zucchini"] },
  "Haryana":          { temperature:"30-39°C", humidity:"30-50%", rainfall:"25-45mm",   normal_crops:["Wheat","Bajra","Cotton","Sugarcane"],               exotic_crops:["Zucchini","Cherry Tomato","Parsley"] },
  "Uttar Pradesh":    { temperature:"32-40°C", humidity:"40-60%", rainfall:"20-40mm",   normal_crops:["Rice","Sugarcane","Maize","Pulses"],                exotic_crops:["Strawberry","Baby Corn","Broccoli"] },
  "Rajasthan":        { temperature:"35-42°C", humidity:"20-40%", rainfall:"5-20mm",    normal_crops:["Millets (Bajra)","Moong","Guar","Sesame"],          exotic_crops:["Dragon Fruit","Aloe Vera","Quinoa"] },
  "Madhya Pradesh":   { temperature:"33-40°C", humidity:"30-50%", rainfall:"15-35mm",   normal_crops:["Soybean","Maize","Pulses","Wheat"],                 exotic_crops:["Quinoa","Chia Seeds","Stevia"] },
  "Maharashtra":      { temperature:"32-38°C", humidity:"50-70%", rainfall:"20-60mm",   normal_crops:["Cotton","Soybean","Sugarcane","Groundnut"],         exotic_crops:["Avocado","Dragon Fruit","Passion Fruit"] },
  "Gujarat":          { temperature:"34-40°C", humidity:"40-65%", rainfall:"10-30mm",   normal_crops:["Groundnut","Cotton","Bajra","Wheat"],               exotic_crops:["Dragon Fruit","Date Palm","Olive"] },
  "Karnataka":        { temperature:"28-35°C", humidity:"50-75%", rainfall:"40-80mm",   normal_crops:["Ragi","Maize","Pulses","Groundnut"],                exotic_crops:["Blueberry","Avocado","Dragon Fruit"] },
  "Tamil Nadu":       { temperature:"30-36°C", humidity:"55-75%", rainfall:"20-50mm",   normal_crops:["Rice","Groundnut","Banana","Sugarcane"],            exotic_crops:["Dragon Fruit","Papaya Hybrid","Moringa"] },
  "Kerala":           { temperature:"28-34°C", humidity:"65-85%", rainfall:"80-150mm",  normal_crops:["Rice","Coconut","Black Pepper","Cardamom"],         exotic_crops:["Vanilla","Nutmeg","Cocoa"] },
  "West Bengal":      { temperature:"30-36°C", humidity:"60-80%", rainfall:"50-100mm",  normal_crops:["Rice","Jute","Vegetables","Pulses"],                exotic_crops:["Dragon Fruit","Mushroom","Baby Corn"] },
  "Bihar":            { temperature:"32-38°C", humidity:"50-70%", rainfall:"30-70mm",   normal_crops:["Rice","Maize","Pulses","Vegetables"],               exotic_crops:["Mushroom","Strawberry","Baby Corn"] },
  "Odisha":           { temperature:"30-36°C", humidity:"60-80%", rainfall:"60-120mm",  normal_crops:["Rice","Pulses","Groundnut","Vegetables"],           exotic_crops:["Cashew","Dragon Fruit","Papaya Hybrid"] },
  "Assam":            { temperature:"25-32°C", humidity:"70-90%", rainfall:"150-250mm", normal_crops:["Tea","Rice","Mustard","Vegetables"],                exotic_crops:["Kiwi","Passion Fruit","Dragon Fruit"] },
  "Telangana":        { temperature:"32-38°C", humidity:"40-65%", rainfall:"20-50mm",   normal_crops:["Cotton","Maize","Pulses","Groundnut"],              exotic_crops:["Chia Seeds","Stevia","Dragon Fruit"] },
  "Andhra Pradesh":   { temperature:"30-36°C", humidity:"55-75%", rainfall:"30-60mm",   normal_crops:["Rice","Groundnut","Sugarcane","Pulses"],            exotic_crops:["Dragon Fruit","Papaya Hybrid","Banana"] },
  "Himachal Pradesh": { temperature:"15-25°C", humidity:"50-75%", rainfall:"40-80mm",   normal_crops:["Apple","Wheat","Maize","Potato"],                   exotic_crops:["Kiwi","Olive","Blueberry"] },
  "Jharkhand":        { temperature:"28-36°C", humidity:"55-75%", rainfall:"50-100mm",  normal_crops:["Rice","Maize","Pulses","Vegetables"],               exotic_crops:["Mushroom","Dragon Fruit","Papaya"] },
  "Chhattisgarh":     { temperature:"30-38°C", humidity:"50-70%", rainfall:"60-120mm",  normal_crops:["Rice","Maize","Pulses","Soybean"],                  exotic_crops:["Mushroom","Dragon Fruit","Chia Seeds"] },
};

// ─────────────────────────────────────────
// HELPER: Detect Region from text
// ─────────────────────────────────────────
function detectRegion(text: string): string | null {
  const lower = text.toLowerCase();
  for (const region of Object.keys(INDIA_REGIONAL_DATA)) {
    if (lower.includes(region.toLowerCase())) return region;
  }
  return null;
}

// ─────────────────────────────────────────
// BUILD SYSTEM PROMPT
// ─────────────────────────────────────────
function buildSystemPrompt(context: AdvisorContext, history: ConversationMessage[]): string {
  const langName = LANGUAGE_NAMES[context.language || "en"] || "English";
  const allText = [context.location || "", ...history.map(h => h.content)].join(" ");
  const region = detectRegion(allText);
  const regionData = region ? INDIA_REGIONAL_DATA[region] : null;

  let regionContext = "";
  if (regionData) {
    regionContext = `
User's Region: ${region}
Current Conditions (April 2026): Temp ${regionData.temperature}, Humidity ${regionData.humidity}, Rainfall ${regionData.rainfall}
Normal Crops Now: ${regionData.normal_crops.slice(0, 4).join(", ")}
Exotic Crops Opportunity: ${regionData.exotic_crops.slice(0, 3).join(", ")}`;
  }

  return `You are KisanMitra (किसान मित्र), a highly knowledgeable Indian agriculture advisor for Indian farmers. You help with crop selection, soil management, pest control, govt schemes, and profitable farming.

CRITICAL: Always respond ENTIRELY in ${langName}. Never mix languages.
CRITICAL: Use simple words, a friendly tone, and step-by-step guidance.

KNOWLEDGE BASE:
- Current Season (April 2026): Kharif preparation begins. Sow Kharif crops June-July. Rabi sowing: Oct-Nov.
- MSP 2024-25: Wheat Rs.2275/q | Paddy Rs.2300/q | Cotton Rs.7121/q | Maize Rs.2225/q | Soybean Rs.4892/q
- Govt Schemes: PM Kisan (Rs.6000/yr) | PM Fasal Bima (2% premium) | Soil Health Card (free) | Drip Irrigation (55% subsidy) | Kisan Credit Card (4% interest) | PM KISAN Samman Nidhi
- Exotic High-Value Crops: Dragon Fruit (Rs.150-400/kg, Rajasthan/Gujarat), Vanilla (Rs.3000-8000/kg, Kerala), Blueberry (Rs.500-1500/kg, Karnataka), Avocado (Rs.80-200/kg, Maharashtra/Karnataka), Quinoa (Rs.100-250/kg, Rajasthan/MP), Stevia (Rs.200-500/kg dry leaf), Kiwi (Rs.100-300/kg, Himachal/Assam)
- Soil correction: Lime for acidic (pH<6) | Gypsum for alkaline (pH>7.5) | Drip irrigation saves 40-50% water
- Contact: Kisan Call Centre 1800-180-1551 (toll-free, 6AM-10PM, all Indian languages)
${regionContext}

RESPONSE FORMAT — STRICTLY FOLLOW:
• NEVER write long paragraphs. Always break into short lines.
• Use bullet points (•) for every list, every reason, every step.
• Structure EVERY answer like this:
  - 1 short greeting/intro line (max 10 words)
  - 3-6 bullet points with specific info (doses, prices, timings)
  - 1 action tip line starting with "✅ टिप:" (in the response language)
• Max 150 words total. Be concise and precise.
• For soil/crop questions: list top 3 crops as bullets with why.
• For schemes: list scheme name • benefit amount • how to apply.
• Respond ONLY in ${langName} — this is mandatory.
• Be warm — use "भाई" in Hindi, "शेतकरी मित्र" in Marathi, etc.`;
}

// ─────────────────────────────────────────
// OPENAI GPT CALL
// ─────────────────────────────────────────
async function getGPTResponse(
  query: string,
  context: AdvisorContext,
  history: ConversationMessage[],
): Promise<string> {
  if (!isOpenAIConfigured) {
    const lang = context.language || "en";
    if (lang === "hi") {
      return [
        "अभी लोकल पर AI सेटअप नहीं है।",
        "• `OPENAI_API_KEY` सेट करें (या Replit integration env vars)",
        "• फिर server restart करें",
        "✅ टिप: अभी Weather/News/Calendar/Predict जैसे फीचर्स काम करेंगे।",
      ].join("\n");
    }
    return [
      "AI isn't configured locally yet.",
      "- Set `OPENAI_API_KEY` (or the Replit integration env vars) and restart the API server.",
      "Tip: Weather/News/Calendar/Predict will still work without AI.",
    ].join("\n");
  }

  const systemPrompt = buildSystemPrompt(context, history);

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
    // Include last 4 messages for conversation context (speed)
    ...history.slice(-4).map(h => ({
      role: (h.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
      content: h.content,
    })),
    { role: "user", content: query },
  ];

  const response = await openai.chat.completions.create({
    model: GROQ_CHAT_MODEL,
    max_completion_tokens: 500,
    messages,
  });

  return response.choices[0]?.message?.content?.trim()
    || "माफ़ करें, आपके प्रश्न का उत्तर देने में समस्या हुई। कृपया फिर से प्रयास करें।";
}

// ─────────────────────────────────────────
// GENERATE FOLLOW-UP SUGGESTIONS
// ─────────────────────────────────────────
function generateSuggestions(query: string): string[] {
  const l = query.toLowerCase();
  if (l.match(/soil|ph|nitrogen|phosphorus|potassium|n=|p=|k=/i)) {
    return ["Best fertilizer for this soil?", "How to improve soil pH?", "Exotic crops for these values?"];
  }
  if (l.match(/exotic|dragon fruit|avocado|vanilla|kiwi|blueberry|quinoa/i)) {
    return ["Govt subsidy for exotic farming?", "How to market exotic crops?", "Training for exotic crop cultivation?"];
  }
  if (l.match(/pest|insect|disease|fungal|blight/i)) {
    return ["Which pesticide is safe?", "How to do integrated pest management?", "Organic pest control methods?"];
  }
  if (l.match(/scheme|yojana|subsid|insurance/i)) {
    return ["PM Kisan eligibility?", "How to apply for Soil Health Card?", "Kisan Credit Card interest rate?"];
  }
  if (l.match(/market|price|sell|msp/i)) {
    return ["How to sell on e-NAM?", "When is the best time to sell?", "Export market for my crop?"];
  }
  return [
    "Best crop for my region?",
    "How to increase yield?",
    "Available government schemes?",
    "Organic farming tips?",
  ];
}

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────
export async function getAdvisorResponse(
  query: string,
  context: AdvisorContext = {},
  history: ConversationMessage[] = [],
): Promise<{
  answer: string;
  language: string;
  suggestions: string[];
  relatedTopics: string[];
  voiceText: string;
  isExoticPrompt?: boolean;
}> {
  const lang = context.language || "en";

  logger.info({ lang, location: context.location }, "Advisor query via GPT");

  const answer = await getGPTResponse(query, context, history);

  const suggestions = generateSuggestions(query);

  const relatedTopics = ["Crop rotation", "Soil health", "Govt schemes", "Organic farming", "Market prices"];

  // Detect if we should show the exotic crops prompt card
  const l = query.toLowerCase();
  const mentionsRegion = detectRegion([query, context.location || ""].join(" ")) !== null;
  const isCropQuery = l.match(/which crop|best crop|what.*grow|what.*plant|crop recommend|कौन सी फसल|क्या बोएं/i);
  const isExoticPrompt = !!(mentionsRegion && isCropQuery);

  return {
    answer,
    language: lang,
    suggestions,
    relatedTopics,
    voiceText: answer,
    isExoticPrompt,
  };
}
