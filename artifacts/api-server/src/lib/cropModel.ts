// Crop prediction logic using rule-based model (simulates a Random Forest)

interface SoilParams {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  region?: string;
}

interface ExoticCropMatch {
  name: string;
  profitability: string;
  matchScore: number;
  suitableRegions: string[];
  reason: string;
}

interface PredictionResult {
  crop: string;
  confidence: number;
  alternativeCrops: string[];
  season: string;
  estimatedYield: string;
  exoticCrops?: ExoticCropMatch[];
}

// ─────────────────────────────────────────
// REGULAR CROP RULES
// ─────────────────────────────────────────
const CROP_RULES: Array<{
  crop: string;
  season: string;
  estimatedYield: string;
  check: (s: SoilParams) => number;
}> = [
  {
    crop: "Rice", season: "Kharif", estimatedYield: "20-25 quintals/acre",
    check: (s) => {
      let score = 0;
      if (s.N >= 80 && s.N <= 140) score += 0.2;
      if (s.P >= 40 && s.P <= 70) score += 0.15;
      if (s.K >= 40 && s.K <= 70) score += 0.15;
      if (s.temperature >= 22 && s.temperature <= 35) score += 0.15;
      if (s.humidity >= 80 && s.humidity <= 95) score += 0.15;
      if (s.ph >= 5.5 && s.ph <= 6.5) score += 0.1;
      if (s.rainfall >= 150 && s.rainfall <= 300) score += 0.1;
      return score;
    },
  },
  {
    crop: "Wheat", season: "Rabi", estimatedYield: "18-22 quintals/acre",
    check: (s) => {
      let score = 0;
      if (s.N >= 60 && s.N <= 120) score += 0.2;
      if (s.P >= 40 && s.P <= 80) score += 0.15;
      if (s.K >= 40 && s.K <= 80) score += 0.15;
      if (s.temperature >= 10 && s.temperature <= 25) score += 0.15;
      if (s.humidity >= 50 && s.humidity <= 70) score += 0.15;
      if (s.ph >= 6.0 && s.ph <= 7.5) score += 0.1;
      if (s.rainfall >= 50 && s.rainfall <= 100) score += 0.1;
      return score;
    },
  },
  {
    crop: "Maize", season: "Kharif", estimatedYield: "25-30 quintals/acre",
    check: (s) => {
      let score = 0;
      if (s.N >= 80 && s.N <= 130) score += 0.2;
      if (s.P >= 50 && s.P <= 90) score += 0.15;
      if (s.K >= 50 && s.K <= 100) score += 0.15;
      if (s.temperature >= 20 && s.temperature <= 30) score += 0.15;
      if (s.humidity >= 55 && s.humidity <= 75) score += 0.15;
      if (s.ph >= 5.5 && s.ph <= 7.5) score += 0.1;
      if (s.rainfall >= 60 && s.rainfall <= 110) score += 0.1;
      return score;
    },
  },
  {
    crop: "Cotton", season: "Kharif", estimatedYield: "8-12 quintals/acre",
    check: (s) => {
      let score = 0;
      if (s.N >= 60 && s.N <= 110) score += 0.2;
      if (s.P >= 40 && s.P <= 70) score += 0.15;
      if (s.K >= 40 && s.K <= 80) score += 0.15;
      if (s.temperature >= 25 && s.temperature <= 40) score += 0.15;
      if (s.humidity >= 50 && s.humidity <= 70) score += 0.15;
      if (s.ph >= 6.0 && s.ph <= 8.0) score += 0.1;
      if (s.rainfall >= 60 && s.rainfall <= 110) score += 0.1;
      return score;
    },
  },
  {
    crop: "Sugarcane", season: "Zaid", estimatedYield: "300-400 quintals/acre",
    check: (s) => {
      let score = 0;
      if (s.N >= 100 && s.N <= 150) score += 0.2;
      if (s.P >= 50 && s.P <= 80) score += 0.15;
      if (s.K >= 50 && s.K <= 90) score += 0.15;
      if (s.temperature >= 25 && s.temperature <= 38) score += 0.15;
      if (s.humidity >= 65 && s.humidity <= 85) score += 0.15;
      if (s.ph >= 6.0 && s.ph <= 7.5) score += 0.1;
      if (s.rainfall >= 100 && s.rainfall <= 200) score += 0.1;
      return score;
    },
  },
  {
    crop: "Chickpea", season: "Rabi", estimatedYield: "8-10 quintals/acre",
    check: (s) => {
      let score = 0;
      if (s.N >= 40 && s.N <= 80) score += 0.2;
      if (s.P >= 60 && s.P <= 100) score += 0.15;
      if (s.K >= 70 && s.K <= 110) score += 0.15;
      if (s.temperature >= 15 && s.temperature <= 29) score += 0.15;
      if (s.humidity >= 30 && s.humidity <= 50) score += 0.15;
      if (s.ph >= 6.0 && s.ph <= 8.0) score += 0.1;
      if (s.rainfall >= 40 && s.rainfall <= 80) score += 0.1;
      return score;
    },
  },
  {
    crop: "Groundnut", season: "Kharif", estimatedYield: "12-16 quintals/acre",
    check: (s) => {
      let score = 0;
      if (s.N >= 20 && s.N <= 50) score += 0.2;
      if (s.P >= 50 && s.P <= 90) score += 0.15;
      if (s.K >= 50 && s.K <= 90) score += 0.15;
      if (s.temperature >= 25 && s.temperature <= 35) score += 0.15;
      if (s.humidity >= 50 && s.humidity <= 70) score += 0.15;
      if (s.ph >= 5.5 && s.ph <= 7.0) score += 0.1;
      if (s.rainfall >= 50 && s.rainfall <= 100) score += 0.1;
      return score;
    },
  },
  {
    crop: "Soybean", season: "Kharif", estimatedYield: "10-14 quintals/acre",
    check: (s) => {
      let score = 0;
      if (s.N >= 50 && s.N <= 80) score += 0.2;
      if (s.P >= 40 && s.P <= 80) score += 0.15;
      if (s.K >= 40 && s.K <= 80) score += 0.15;
      if (s.temperature >= 20 && s.temperature <= 30) score += 0.15;
      if (s.humidity >= 60 && s.humidity <= 80) score += 0.15;
      if (s.ph >= 6.0 && s.ph <= 7.5) score += 0.1;
      if (s.rainfall >= 60 && s.rainfall <= 120) score += 0.1;
      return score;
    },
  },
  {
    crop: "Tomato", season: "Rabi", estimatedYield: "120-160 quintals/acre",
    check: (s) => {
      let score = 0;
      if (s.N >= 80 && s.N <= 120) score += 0.2;
      if (s.P >= 50 && s.P <= 90) score += 0.15;
      if (s.K >= 60 && s.K <= 100) score += 0.15;
      if (s.temperature >= 20 && s.temperature <= 30) score += 0.15;
      if (s.humidity >= 60 && s.humidity <= 80) score += 0.15;
      if (s.ph >= 6.0 && s.ph <= 7.0) score += 0.1;
      if (s.rainfall >= 40 && s.rainfall <= 80) score += 0.1;
      return score;
    },
  },
  {
    crop: "Mustard", season: "Rabi", estimatedYield: "8-10 quintals/acre",
    check: (s) => {
      let score = 0;
      if (s.N >= 60 && s.N <= 100) score += 0.2;
      if (s.P >= 40 && s.P <= 70) score += 0.15;
      if (s.K >= 40 && s.K <= 70) score += 0.15;
      if (s.temperature >= 10 && s.temperature <= 25) score += 0.15;
      if (s.humidity >= 40 && s.humidity <= 60) score += 0.15;
      if (s.ph >= 6.0 && s.ph <= 7.5) score += 0.1;
      if (s.rainfall >= 30 && s.rainfall <= 60) score += 0.1;
      return score;
    },
  },
];

// ─────────────────────────────────────────
// EXOTIC CROP RULES
// ─────────────────────────────────────────
const EXOTIC_CROP_RULES: Array<{
  name: string;
  profitability: string;
  suitableRegions: string[];
  check: (s: SoilParams) => { score: number; reason: string };
}> = [
  {
    name: "Dragon Fruit",
    profitability: "Very High (Rs.150-400/kg)",
    suitableRegions: ["Gujarat", "Rajasthan", "Andhra Pradesh", "Maharashtra", "Tamil Nadu"],
    check: (s) => {
      let score = 0; const reasons: string[] = [];
      if (s.temperature >= 25 && s.temperature <= 35) { score += 0.3; reasons.push("ideal warm temperature"); }
      if (s.humidity >= 50 && s.humidity <= 70) { score += 0.2; reasons.push("suitable humidity"); }
      if (s.rainfall >= 30 && s.rainfall <= 100) { score += 0.2; reasons.push("low water requirement met"); }
      if (s.ph >= 5.5 && s.ph <= 7.0) { score += 0.15; reasons.push("good soil pH"); }
      if (s.N <= 60) { score += 0.15; reasons.push("low N soil suits this crop"); }
      return { score, reason: reasons.length ? `Matches: ${reasons.join(", ")}` : "Partial climate match" };
    },
  },
  {
    name: "Avocado",
    profitability: "High (Rs.80-200/kg)",
    suitableRegions: ["Maharashtra", "Karnataka", "Tamil Nadu", "Kerala"],
    check: (s) => {
      let score = 0; const reasons: string[] = [];
      if (s.temperature >= 20 && s.temperature <= 30) { score += 0.3; reasons.push("optimal temperature range"); }
      if (s.humidity >= 60 && s.humidity <= 80) { score += 0.2; reasons.push("good humidity"); }
      if (s.rainfall >= 80 && s.rainfall <= 150) { score += 0.2; reasons.push("adequate rainfall"); }
      if (s.ph >= 5.5 && s.ph <= 7.0) { score += 0.15; reasons.push("suitable soil pH"); }
      if (s.K >= 50) { score += 0.15; reasons.push("good potassium levels"); }
      return { score, reason: reasons.length ? `Matches: ${reasons.join(", ")}` : "Partial climate match" };
    },
  },
  {
    name: "Quinoa",
    profitability: "High (Rs.100-250/kg)",
    suitableRegions: ["Rajasthan", "Madhya Pradesh", "Haryana", "Himachal Pradesh"],
    check: (s) => {
      let score = 0; const reasons: string[] = [];
      if (s.temperature >= 15 && s.temperature <= 30) { score += 0.3; reasons.push("suitable temperature"); }
      if (s.humidity >= 40 && s.humidity <= 60) { score += 0.25; reasons.push("ideal dry climate"); }
      if (s.rainfall >= 30 && s.rainfall <= 60) { score += 0.2; reasons.push("drought-tolerant low rainfall"); }
      if (s.ph >= 6.0 && s.ph <= 8.0) { score += 0.25; reasons.push("alkaline-tolerant soil"); }
      return { score, reason: reasons.length ? `Matches: ${reasons.join(", ")}` : "Partial climate match" };
    },
  },
  {
    name: "Chia Seeds",
    profitability: "High (Rs.120-300/kg)",
    suitableRegions: ["Telangana", "Madhya Pradesh", "Karnataka", "Rajasthan"],
    check: (s) => {
      let score = 0; const reasons: string[] = [];
      if (s.temperature >= 20 && s.temperature <= 30) { score += 0.3; reasons.push("good temperature match"); }
      if (s.humidity >= 50 && s.humidity <= 70) { score += 0.2; reasons.push("moderate humidity"); }
      if (s.rainfall >= 40 && s.rainfall <= 80) { score += 0.2; reasons.push("low water requirement"); }
      if (s.ph >= 6.0 && s.ph <= 8.0) { score += 0.3; reasons.push("pH suitable"); }
      return { score, reason: reasons.length ? `Matches: ${reasons.join(", ")}` : "Partial climate match" };
    },
  },
  {
    name: "Stevia",
    profitability: "High (Rs.200-500/kg dry leaf)",
    suitableRegions: ["Madhya Pradesh", "Telangana", "Andhra Pradesh", "Karnataka"],
    check: (s) => {
      let score = 0; const reasons: string[] = [];
      if (s.temperature >= 20 && s.temperature <= 30) { score += 0.3; reasons.push("ideal temperature"); }
      if (s.humidity >= 60 && s.humidity <= 80) { score += 0.2; reasons.push("suitable humidity"); }
      if (s.rainfall >= 60 && s.rainfall <= 120) { score += 0.2; reasons.push("adequate rainfall"); }
      if (s.ph >= 6.0 && s.ph <= 7.5) { score += 0.15; reasons.push("good pH"); }
      if (s.N <= 60) { score += 0.15; reasons.push("low N preferred"); }
      return { score, reason: reasons.length ? `Matches: ${reasons.join(", ")}` : "Partial climate match" };
    },
  },
  {
    name: "Passion Fruit",
    profitability: "High (Rs.60-150/kg)",
    suitableRegions: ["Maharashtra", "Karnataka", "Assam", "Kerala", "Tamil Nadu"],
    check: (s) => {
      let score = 0; const reasons: string[] = [];
      if (s.temperature >= 20 && s.temperature <= 30) { score += 0.3; reasons.push("tropical temperature"); }
      if (s.humidity >= 60 && s.humidity <= 80) { score += 0.2; reasons.push("humid climate"); }
      if (s.rainfall >= 80 && s.rainfall <= 150) { score += 0.2; reasons.push("good rainfall"); }
      if (s.ph >= 5.5 && s.ph <= 6.5) { score += 0.15; reasons.push("slightly acidic soil"); }
      if (s.K >= 50) { score += 0.15; reasons.push("good potassium"); }
      return { score, reason: reasons.length ? `Matches: ${reasons.join(", ")}` : "Partial climate match" };
    },
  },
  {
    name: "Vanilla",
    profitability: "Very High (Rs.3000-8000/kg cured)",
    suitableRegions: ["Kerala", "Karnataka", "Tamil Nadu", "Assam"],
    check: (s) => {
      let score = 0; const reasons: string[] = [];
      if (s.temperature >= 21 && s.temperature <= 32) { score += 0.3; reasons.push("tropical temperature match"); }
      if (s.humidity >= 70 && s.humidity <= 90) { score += 0.25; reasons.push("high humidity match"); }
      if (s.rainfall >= 150 && s.rainfall <= 300) { score += 0.25; reasons.push("high rainfall match"); }
      if (s.ph >= 6.0 && s.ph <= 7.0) { score += 0.2; reasons.push("ideal pH"); }
      return { score, reason: reasons.length ? `Matches: ${reasons.join(", ")}` : "Partial climate match" };
    },
  },
  {
    name: "Kiwi",
    profitability: "High (Rs.100-300/kg)",
    suitableRegions: ["Himachal Pradesh", "Assam", "Uttarakhand", "Jammu & Kashmir"],
    check: (s) => {
      let score = 0; const reasons: string[] = [];
      if (s.temperature >= 10 && s.temperature <= 25) { score += 0.35; reasons.push("cool temperature ideal"); }
      if (s.humidity >= 70 && s.humidity <= 85) { score += 0.25; reasons.push("high humidity"); }
      if (s.rainfall >= 120 && s.rainfall <= 150) { score += 0.2; reasons.push("adequate rainfall"); }
      if (s.ph >= 5.0 && s.ph <= 6.5) { score += 0.2; reasons.push("acidic soil suitable"); }
      return { score, reason: reasons.length ? `Matches: ${reasons.join(", ")}` : "Partial climate match" };
    },
  },
  {
    name: "Blueberry",
    profitability: "Very High (Rs.500-1500/kg)",
    suitableRegions: ["Karnataka", "Himachal Pradesh", "Uttarakhand"],
    check: (s) => {
      let score = 0; const reasons: string[] = [];
      if (s.temperature >= 15 && s.temperature <= 25) { score += 0.3; reasons.push("cool climate suitable"); }
      if (s.humidity >= 60 && s.humidity <= 80) { score += 0.2; reasons.push("moderate humidity"); }
      if (s.ph >= 4.5 && s.ph <= 5.5) { score += 0.35; reasons.push("highly acidic soil — ideal!"); }
      if (s.rainfall >= 80 && s.rainfall <= 120) { score += 0.15; reasons.push("adequate rainfall"); }
      return { score, reason: reasons.length ? `Matches: ${reasons.join(", ")}` : "Partial climate match" };
    },
  },
  {
    name: "Olive",
    profitability: "Medium (Rs.30-80/kg fruit, Rs.400-800/litre oil)",
    suitableRegions: ["Rajasthan", "Gujarat", "Haryana", "Punjab"],
    check: (s) => {
      let score = 0; const reasons: string[] = [];
      if (s.temperature >= 15 && s.temperature <= 30) { score += 0.3; reasons.push("Mediterranean-type climate"); }
      if (s.humidity >= 30 && s.humidity <= 50) { score += 0.25; reasons.push("dry conditions match"); }
      if (s.rainfall >= 30 && s.rainfall <= 70) { score += 0.25; reasons.push("low rainfall tolerant"); }
      if (s.ph >= 6.0 && s.ph <= 8.0) { score += 0.2; reasons.push("alkaline-tolerant"); }
      return { score, reason: reasons.length ? `Matches: ${reasons.join(", ")}` : "Partial climate match" };
    },
  },
];

// Threshold below which we don't recommend an exotic crop
const EXOTIC_MIN_SCORE = 0.55;

export function predictCrop(params: SoilParams): PredictionResult {
  // ── Regular crops ──
  const scores = CROP_RULES.map((rule) => ({
    ...rule,
    score: rule.check(params),
  }));
  scores.sort((a, b) => b.score - a.score);

  const top = scores[0];
  const confidence = Math.min(0.95, Math.max(0.55, top.score + Math.random() * 0.1));
  const alternativeCrops = scores.slice(1, 4).map((s) => s.crop);

  // ── Exotic crops ──
  const exoticMatches: ExoticCropMatch[] = [];
  for (const rule of EXOTIC_CROP_RULES) {
    const { score, reason } = rule.check(params);
    if (score >= EXOTIC_MIN_SCORE) {
      exoticMatches.push({
        name: rule.name,
        profitability: rule.profitability,
        matchScore: Math.round(score * 100) / 100,
        suitableRegions: rule.suitableRegions,
        reason,
      });
    }
  }
  exoticMatches.sort((a, b) => b.matchScore - a.matchScore);

  return {
    crop: top.crop,
    confidence: Math.round(confidence * 100) / 100,
    alternativeCrops,
    season: top.season,
    estimatedYield: top.estimatedYield,
    exoticCrops: exoticMatches.length > 0 ? exoticMatches.slice(0, 4) : undefined,
  };
}
