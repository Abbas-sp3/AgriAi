import { logger } from "./logger";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  isScheme: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC FALLBACK — Indian government schemes that rarely change
// ─────────────────────────────────────────────────────────────────────────────
const STATIC_NEWS: NewsItem[] = [
  {
    id: "s1", title: "PM Kisan Samman Nidhi – 19th Installment Released",
    summary: "The 19th installment of PM-KISAN has been released. Eligible farmers receive Rs.2000 directly into bank accounts. Over 9.5 crore farmers benefit annually.",
    category: "schemes", source: "PM Kisan Portal", sourceUrl: "https://pmkisan.gov.in",
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(), isScheme: true,
  },
  {
    id: "s2", title: "PM Fasal Bima Yojana – Enrollment Open for Kharif 2025",
    summary: "Enroll in PM Fasal Bima Yojana for Kharif 2025 via your bank, CSC centers, or the PMFBY app. Premium starts at just 2% for kharif crops.",
    category: "schemes", source: "PMFBY Portal", sourceUrl: "https://pmfby.gov.in",
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(), isScheme: true,
  },
  {
    id: "s3", title: "MSP for Kharif 2025-26 – Paddy Rs.2300/q, Cotton Rs.7121/q",
    summary: "Cabinet approves MSP for Kharif crops 2025-26. Paddy Rs.2300/q, Jowar Rs.3371/q, Cotton Rs.7121/q, Maize Rs.2225/q. Sell on e-NAM for better price discovery.",
    category: "market", source: "Ministry of Agriculture", sourceUrl: "https://agricoop.nic.in",
    publishedAt: new Date(Date.now() - 1 * 86400000).toISOString(), isScheme: false,
  },
  {
    id: "s4", title: "Soil Health Card Scheme – Free Soil Testing Launched",
    summary: "New round of Soil Health Cards launched. Get soil tested free at nearest labs. Covers 6 key nutrients essential for crop productivity.",
    category: "schemes", source: "Soil Health Portal", sourceUrl: "https://soilhealth.dac.gov.in",
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(), isScheme: true,
  },
  {
    id: "s5", title: "IMD Issues Yellow Alert – Heavy Rainfall in Central India",
    summary: "IMD yellow alert for heavy rainfall in MP, Chhattisgarh, and Vidarbha over next 48 hours. Farmers advised to postpone harvesting and ensure proper drainage.",
    category: "weather", source: "India Meteorological Department", sourceUrl: "https://mausam.imd.gov.in",
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(), isScheme: false,
  },
  {
    id: "s6", title: "Fall Armyworm Alert – Advisory for Maize Farmers",
    summary: "ICAR-NBAIR advisory on Fall Armyworm in maize: pheromone traps (4/acre), spray Spinetoram 11.7 SC at 0.5 ml/litre. Early sowing avoids peak pest pressure.",
    category: "pest", source: "ICAR-NBAIR", sourceUrl: "https://nbair.res.in",
    publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(), isScheme: false,
  },
  {
    id: "s7", title: "Kisan Credit Card – 4% Interest on Short-Term Crop Loans",
    summary: "2% interest subvention for crop loans up to Rs.3 lakh under KCC. Prompt repayment gives extra 3% incentive — effective rate just 4% per annum.",
    category: "schemes", source: "NABARD", sourceUrl: "https://www.nabard.org",
    publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(), isScheme: true,
  },
  {
    id: "s8", title: "e-NAM Platform – 1500+ Mandis Onboarded for Better Prices",
    summary: "National Agriculture Market (e-NAM) now has 1500+ mandis. Sell online through auctions for competitive prices. Register free at enam.gov.in.",
    category: "market", source: "eNAM Portal", sourceUrl: "https://enam.gov.in",
    publishedAt: new Date(Date.now() - 8 * 86400000).toISOString(), isScheme: false,
  },
  {
    id: "s9", title: "PM Krishi Sinchayee Yojana – 55% Subsidy on Drip Irrigation",
    summary: "Small and marginal farmers get 55% subsidy on drip and sprinkler systems under PMKSY-PDMC. Other farmers eligible for 45%. Apply through state agriculture departments.",
    category: "schemes", source: "Ministry of Agriculture", sourceUrl: "https://pmksy.gov.in",
    publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(), isScheme: true,
  },
  {
    id: "s10", title: "Dragon Fruit Cultivation – High-Profit Exotic Crop for India",
    summary: "Dragon Fruit fetches Rs.150-400/kg and is now grown profitably in Gujarat, Rajasthan, Maharashtra and AP. State Horticulture Missions offer up to 50% subsidy.",
    category: "market", source: "National Horticulture Board", sourceUrl: "https://nhb.gov.in",
    publishedAt: new Date(Date.now() - 12 * 86400000).toISOString(), isScheme: false,
  },
  {
    id: "s11", title: "ICAR Releases HD-3385 – New High-Yield Wheat Variety",
    summary: "ICAR releases HD-3385 wheat variety with 15% higher yield and better disease resistance. Suitable for North-West India. Seed available through IFFCO and cooperative societies.",
    category: "general", source: "ICAR", sourceUrl: "https://icar.org.in",
    publishedAt: new Date(Date.now() - 14 * 86400000).toISOString(), isScheme: false,
  },
  {
    id: "s12", title: "Paramparagat Krishi Vikas Yojana – 50% Subsidy on Organic Certification",
    summary: "Under PKVY, farmer groups converting to organic farming get Rs.50,000/hectare for 3 years — covering inputs, training, and certification costs.",
    category: "schemes", source: "Ministry of Agriculture", sourceUrl: "https://pkvy.gov.in",
    publishedAt: new Date(Date.now() - 16 * 86400000).toISOString(), isScheme: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// APITUBE — Live India agriculture news (free tier: titles + descriptions only)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchApiTubeNews(): Promise<NewsItem[]> {
  const apiKey = process.env.APITUBE_API_KEY;
  if (!apiKey) {
    logger.warn("APITUBE_API_KEY not set – skipping live fetch");
    return [];
  }

  const queries = [
    { q: "india agriculture farming kisan crop", category: "general" },
    { q: "india farmer government scheme subsidy", category: "schemes" },
    { q: "india crop market price MSP mandi", category: "market" },
    { q: "india weather rainfall flood drought", category: "weather" },
    { q: "india pest disease crop protection", category: "pest" },
  ];

  const results: NewsItem[] = [];
  const seenTitles = new Set<string>();

  for (const { q, category } of queries) {
    try {
      const url = `https://api.apitube.io/v1/news/top-headlines?api_key=${apiKey}&language=en&q=${encodeURIComponent(q)}&limit=10`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!resp.ok) {
        logger.warn({ status: resp.status, q }, "APITube request failed");
        continue;
      }

      const data = await resp.json() as any;
      const articles: any[] = data.results || data.headlines || [];

      // Keywords to confirm the article is actually agriculture/farming related
      // Note: require 2+ matches OR at least one strong single keyword to reduce false positives
      const AGRI_KEYWORDS_STRONG = [
        "farmer", "kisan", "paddy", "irrigation", "fertilizer", "fertiliser", "pesticide", "msp",
        "horticulture", "sowing season", "rabi crop", "kharif crop", "drip irrigation", "sprinkler",
        "mandi price", "ministry of agriculture", "icar", "nabard", "agribusiness",
        "crop production", "crop yield", "agricultural", "farming practices",
      ];
      const AGRI_KEYWORDS_GENERAL = [
        "farm", "crop", "agri", "wheat", "rice", "harvest", "soil",
        "seed", "vegetable", "cattle", "dairy", "livestock", "manure",
        "organic farming", "market price", "subsidy scheme",
      ];

      for (const a of articles) {
        if (!a.title || a.language !== "en") continue;

        // Validate article is actually agriculture-related
        const combinedText = `${a.title} ${a.description || ""} ${a.summary || ""}`.toLowerCase();
        const hasStrong = AGRI_KEYWORDS_STRONG.some(kw => combinedText.includes(kw));
        const generalMatches = AGRI_KEYWORDS_GENERAL.filter(kw => combinedText.includes(kw)).length;
        if (!hasStrong && generalMatches < 2) continue;

        const titleKey = a.title.substring(0, 40).toLowerCase();
        if (seenTitles.has(titleKey)) continue;
        seenTitles.add(titleKey);

        // On free tier the href field is truncated — use home_page_url or fallback
        let sourceUrl = "https://agricoop.nic.in";
        const hrefRaw: string = a.href || "";
        if (hrefRaw && !hrefRaw.includes("hidden") && !hrefRaw.includes("Upgrade")) {
          sourceUrl = hrefRaw;
        } else if (a.source && a.source.home_page_url && !String(a.source.home_page_url).includes("Upgrade")) {
          sourceUrl = a.source.home_page_url;
        }

        const sourceName = (a.source && a.source.domain && !String(a.source.domain).includes("Upgrade"))
          ? String(a.source.domain).replace(/^www\./, "")
          : "News Feed";

        const summary = (a.description || a.summary || a.title).replace(/<[^>]+>/g, "").substring(0, 300);

        results.push({
          id: `apitube-${a.id || titleKey.replace(/\s/g, "-")}`,
          title: a.title,
          summary,
          category,
          source: sourceName,
          sourceUrl,
          publishedAt: a.published_at || new Date().toISOString(),
          isScheme: category === "schemes",
        });

        if (results.length >= 20) break;
      }
    } catch (err) {
      logger.warn({ err, q }, "APITube fetch error");
    }

    if (results.length >= 20) break;
  }

  logger.info({ count: results.length }, "APITube live articles fetched");
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// GUARDIAN — Free API (no key needed, global farming news with full URLs)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchGuardianNews(): Promise<NewsItem[]> {
  const queries = [
    { q: "india agriculture farmer crop", section: "world" },
    { q: "india farming kisan wheat rice", section: "environment" },
  ];

  const results: NewsItem[] = [];
  const seenTitles = new Set<string>();

  for (const { q, section } of queries) {
    try {
      const url = `https://content.guardianapis.com/search?q=${encodeURIComponent(q)}&page-size=6&api-key=test&order-by=newest&show-fields=trailText`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!resp.ok) continue;

      const data = await resp.json() as any;
      const articles: any[] = data.response?.results || [];

      for (const a of articles) {
        const key = a.webTitle.substring(0, 35).toLowerCase();
        if (seenTitles.has(key)) continue;
        seenTitles.add(key);

        // Filter: title must clearly relate to agriculture
        const title = a.webTitle.toLowerCase();
        const isAgri = ["farm", "farmer", "farming", "crop", "agri", "kisan", "wheat",
          "rice", "harvest", "irrigation", "soil", "horticulture", "seed",
          "cattle", "dairy", "livestock", "vegetable", "food price", "food production",
          "pesticide", "fertilizer", "organic", "food security"].some(kw => title.includes(kw));
        if (!isAgri) continue;

        results.push({
          id: `guardian-${results.length}`,
          title: a.webTitle,
          summary: a.fields?.trailText?.replace(/<[^>]+>/g, "") || a.webTitle,
          category: "general",
          source: "The Guardian",
          sourceUrl: a.webUrl,
          publishedAt: a.webPublicationDate,
          isScheme: false,
        });
      }
    } catch (err) {
      logger.warn({ err }, "Guardian fetch error");
    }
  }

  logger.info({ count: results.length }, "Guardian articles fetched");
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// CACHE
// ─────────────────────────────────────────────────────────────────────────────
let newsCache: NewsItem[] | null = null;
let newsCacheAt = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 min

async function buildNewsCache(): Promise<NewsItem[]> {
  if (newsCache && Date.now() - newsCacheAt < CACHE_TTL) {
    return newsCache;
  }

  // Fetch in parallel
  const [liveApiTube, liveGuardian] = await Promise.all([
    fetchApiTubeNews(),
    fetchGuardianNews(),
  ]);

  const seenTitles = new Set<string>();
  const combined: NewsItem[] = [];

  for (const item of [...liveApiTube, ...liveGuardian, ...STATIC_NEWS]) {
    const key = item.title.substring(0, 35).toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      combined.push(item);
    }
  }

  newsCache = combined;
  newsCacheAt = Date.now();
  logger.info({ total: combined.length, live: liveApiTube.length + liveGuardian.length }, "News cache built");
  return combined;
}

export async function getNews(category?: string, _language?: string): Promise<{ items: NewsItem[]; total: number }> {
  const all = await buildNewsCache();
  const filtered = category && category !== "all"
    ? all.filter(item => item.category === category)
    : all;
  return { items: filtered, total: filtered.length };
}
