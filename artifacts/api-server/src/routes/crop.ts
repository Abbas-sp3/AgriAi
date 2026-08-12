import { Router, type IRouter } from "express";
import {
  GetCropCalendarQueryParams,
  GetCropCalendarResponse,
  GetCropDetailsQueryParams,
  GetCropDetailsResponse,
} from "@workspace/api-zod";
import { getCropDetails } from "../lib/cropData";

const router: IRouter = Router();

type CalendarEntry = {
  crop: string;
  season: string;
  sowingMonths: string[];
  harvestMonths: string[];
  waterRequirement: string;
  soilType: string;
  isExotic?: boolean;
  regions?: string[];
  profitability?: string;
};

const CALENDAR_DATA: Record<string, CalendarEntry[]> = {
  kharif: [
    { crop: "Rice",               season: "kharif", sowingMonths: ["June","July"],            harvestMonths: ["October","November"],            waterRequirement: "High",        soilType: "Clay, clay loam" },
    { crop: "Maize",              season: "kharif", sowingMonths: ["June","July"],            harvestMonths: ["September","October"],           waterRequirement: "Medium",      soilType: "Loamy" },
    { crop: "Cotton",             season: "kharif", sowingMonths: ["April","May","June"],     harvestMonths: ["October","November","December"], waterRequirement: "Medium",      soilType: "Black cotton soil" },
    { crop: "Soybean",            season: "kharif", sowingMonths: ["June","July"],            harvestMonths: ["September","October"],           waterRequirement: "Medium",      soilType: "Loamy, clay loam" },
    { crop: "Groundnut",          season: "kharif", sowingMonths: ["June","July"],            harvestMonths: ["September","October"],           waterRequirement: "Medium",      soilType: "Sandy loam" },
    { crop: "Arhar (Pigeon Pea)", season: "kharif", sowingMonths: ["June","July"],            harvestMonths: ["January","February"],            waterRequirement: "Low",         soilType: "Well-drained loamy" },
  ],
  rabi: [
    { crop: "Wheat",     season: "rabi", sowingMonths: ["October","November"],          harvestMonths: ["March","April"],             waterRequirement: "Medium",      soilType: "Loamy, clay loam" },
    { crop: "Mustard",   season: "rabi", sowingMonths: ["October","November"],          harvestMonths: ["February","March"],          waterRequirement: "Low",         soilType: "Sandy loam, loamy" },
    { crop: "Chickpea",  season: "rabi", sowingMonths: ["October","November"],          harvestMonths: ["February","March"],          waterRequirement: "Low",         soilType: "Loamy" },
    { crop: "Potato",    season: "rabi", sowingMonths: ["October","November"],          harvestMonths: ["January","February"],        waterRequirement: "Medium",      soilType: "Well-drained loamy" },
    { crop: "Pea",       season: "rabi", sowingMonths: ["October","November"],          harvestMonths: ["January","February"],        waterRequirement: "Low-Medium",  soilType: "Well-drained loamy" },
    { crop: "Tomato",    season: "rabi", sowingMonths: ["September","October","November"], harvestMonths: ["January","February","March"], waterRequirement: "Medium",   soilType: "Sandy loam to loam" },
  ],
  zaid: [
    { crop: "Sugarcane",    season: "zaid", sowingMonths: ["February","March"],  harvestMonths: ["December","January","February"],  waterRequirement: "High",   soilType: "Loamy to clay loam" },
    { crop: "Watermelon",   season: "zaid", sowingMonths: ["February","March"],  harvestMonths: ["May","June"],                     waterRequirement: "Medium", soilType: "Sandy loam" },
    { crop: "Cucumber",     season: "zaid", sowingMonths: ["February","March"],  harvestMonths: ["April","May"],                    waterRequirement: "Medium", soilType: "Sandy loam" },
    { crop: "Bitter Gourd", season: "zaid", sowingMonths: ["February","March"],  harvestMonths: ["April","May","June"],             waterRequirement: "Medium", soilType: "Well-drained loamy" },
  ],
};

// ─────────────────────────────────────────
// EXOTIC CROPS CALENDAR
// ─────────────────────────────────────────
const EXOTIC_CALENDAR: CalendarEntry[] = [
  {
    crop: "Dragon Fruit", season: "exotic",
    sowingMonths: ["February","March","April"],
    harvestMonths: ["July","August","September","October","November"],
    waterRequirement: "Low (Drip)", soilType: "Sandy loam, Red soil",
    isExotic: true, profitability: "Very High (Rs.150-400/kg)",
    regions: ["Gujarat","Rajasthan","Maharashtra","Andhra Pradesh","Tamil Nadu"],
  },
  {
    crop: "Avocado", season: "exotic",
    sowingMonths: ["June","July","August"],
    harvestMonths: ["February","March","April","May"],
    waterRequirement: "Medium", soilType: "Deep loamy, Laterite",
    isExotic: true, profitability: "High (Rs.80-200/kg)",
    regions: ["Maharashtra","Karnataka","Tamil Nadu","Kerala"],
  },
  {
    crop: "Quinoa", season: "exotic",
    sowingMonths: ["October","November"],
    harvestMonths: ["February","March"],
    waterRequirement: "Very Low", soilType: "Sandy loam, Alkaline",
    isExotic: true, profitability: "High (Rs.100-250/kg)",
    regions: ["Rajasthan","Madhya Pradesh","Haryana","Himachal Pradesh"],
  },
  {
    crop: "Chia Seeds", season: "exotic",
    sowingMonths: ["November","December"],
    harvestMonths: ["February","March"],
    waterRequirement: "Low-Medium", soilType: "Well-drained loamy",
    isExotic: true, profitability: "High (Rs.120-300/kg)",
    regions: ["Telangana","Madhya Pradesh","Karnataka","Rajasthan"],
  },
  {
    crop: "Vanilla", season: "exotic",
    sowingMonths: ["July","August"],
    harvestMonths: ["September","October","November"],
    waterRequirement: "High (Shade crop)", soilType: "Humus-rich Laterite",
    isExotic: true, profitability: "Very High (Rs.3000-8000/kg cured)",
    regions: ["Kerala","Karnataka","Tamil Nadu","Assam"],
  },
  {
    crop: "Stevia", season: "exotic",
    sowingMonths: ["February","March","September","October"],
    harvestMonths: ["May","June","December","January"],
    waterRequirement: "Medium (Drip)", soilType: "Sandy loam, pH 6-7.5",
    isExotic: true, profitability: "High (Rs.200-500/kg dry leaf)",
    regions: ["Madhya Pradesh","Telangana","Karnataka","Andhra Pradesh"],
  },
  {
    crop: "Passion Fruit", season: "exotic",
    sowingMonths: ["June","July","February","March"],
    harvestMonths: ["December","January","February","August","September"],
    waterRequirement: "Medium-High", soilType: "Well-drained loamy",
    isExotic: true, profitability: "High (Rs.60-150/kg)",
    regions: ["Maharashtra","Karnataka","Kerala","Tamil Nadu","Assam"],
  },
  {
    crop: "Olive", season: "exotic",
    sowingMonths: ["October","November","February","March"],
    harvestMonths: ["December","January","February"],
    waterRequirement: "Low (Drip)", soilType: "Alkaline, well-drained",
    isExotic: true, profitability: "Medium-High (Rs.30-80/kg fruit)",
    regions: ["Rajasthan","Gujarat","Haryana","Punjab"],
  },
  {
    crop: "Kiwi", season: "exotic",
    sowingMonths: ["December","January"],
    harvestMonths: ["October","November","December"],
    waterRequirement: "Medium-High", soilType: "Acidic loamy (pH 5-6.5)",
    isExotic: true, profitability: "High (Rs.100-300/kg)",
    regions: ["Himachal Pradesh","Assam","Uttarakhand","Jammu & Kashmir"],
  },
  {
    crop: "Blueberry", season: "exotic",
    sowingMonths: ["October","November","February","March"],
    harvestMonths: ["March","April","May"],
    waterRequirement: "Medium (Drip + Mulch)", soilType: "Highly acidic (pH 4.5-5.5)",
    isExotic: true, profitability: "Very High (Rs.500-1500/kg)",
    regions: ["Karnataka","Himachal Pradesh","Uttarakhand"],
  },
];

router.get("/crop/calendar", async (req, res): Promise<void> => {
  const parsed = GetCropCalendarQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { season, region } = parsed.data;
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  let entries: CalendarEntry[] = [];

  if (season && CALENDAR_DATA[season.toLowerCase()]) {
    entries = CALENDAR_DATA[season.toLowerCase()];
  } else {
    // Return all seasons + exotic crops
    entries = [
      ...CALENDAR_DATA["kharif"],
      ...CALENDAR_DATA["rabi"],
      ...CALENDAR_DATA["zaid"],
      ...EXOTIC_CALENDAR,
    ];
  }

  // Filter by region if provided (for exotic crops, check their regions array)
  if (region && region !== "India" && region !== "all") {
    entries = entries.filter((e) => {
      if (!e.isExotic) return true; // regular crops always included
      return e.regions && e.regions.some((r) => r.toLowerCase().includes(region.toLowerCase()));
    });
  }

  const recommendations = [
    `It's currently ${currentMonth}. Plan your Kharif sowing activities.`,
    "Ensure soil testing before the new season for best results.",
    "Register for PM Fasal Bima Yojana before the deadline for crop insurance.",
    "Stock up on certified seeds from your nearest cooperative society.",
    "Consider exotic crops like Dragon Fruit and Stevia for higher income.",
  ];

  res.json(
    GetCropCalendarResponse.parse({
      region: region ?? "India",
      season: season ?? "all",
      entries,
      currentMonth,
      recommendations,
    }),
  );
});

router.get("/crop/details", async (req, res): Promise<void> => {
  const parsed = GetCropDetailsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const details = getCropDetails(parsed.data.crop);
  if (!details) {
    res.status(404).json({ error: `Crop '${parsed.data.crop}' not found` });
    return;
  }

  res.json(GetCropDetailsResponse.parse(details));
});

export default router;
