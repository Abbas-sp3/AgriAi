// Regional soil data for Indian states and regions

interface RegionalSoil {
  region: string;
  state: string;
  soilType: string;
  avgN: number;
  avgP: number;
  avgK: number;
  avgPh: number;
  commonCrops: string[];
}

const REGIONAL_SOIL: RegionalSoil[] = [
  {
    region: "Punjab",
    state: "Punjab",
    soilType: "Alluvial Soil",
    avgN: 105,
    avgP: 55,
    avgK: 65,
    avgPh: 7.8,
    commonCrops: ["Wheat", "Rice", "Maize", "Cotton"],
  },
  {
    region: "Haryana",
    state: "Haryana",
    soilType: "Alluvial Soil",
    avgN: 95,
    avgP: 48,
    avgK: 60,
    avgPh: 7.6,
    commonCrops: ["Wheat", "Rice", "Sugarcane", "Mustard"],
  },
  {
    region: "Uttar Pradesh",
    state: "Uttar Pradesh",
    soilType: "Alluvial Soil",
    avgN: 90,
    avgP: 45,
    avgK: 55,
    avgPh: 7.5,
    commonCrops: ["Wheat", "Rice", "Sugarcane", "Potato"],
  },
  {
    region: "Maharashtra",
    state: "Maharashtra",
    soilType: "Black Cotton Soil",
    avgN: 75,
    avgP: 40,
    avgK: 50,
    avgPh: 7.2,
    commonCrops: ["Cotton", "Soybean", "Jowar", "Sugarcane"],
  },
  {
    region: "Andhra Pradesh",
    state: "Andhra Pradesh",
    soilType: "Red Laterite Soil",
    avgN: 80,
    avgP: 35,
    avgK: 55,
    avgPh: 6.5,
    commonCrops: ["Rice", "Groundnut", "Cotton", "Tobacco"],
  },
  {
    region: "Telangana",
    state: "Telangana",
    soilType: "Red Laterite Soil",
    avgN: 78,
    avgP: 38,
    avgK: 52,
    avgPh: 6.8,
    commonCrops: ["Rice", "Cotton", "Maize", "Soybean"],
  },
  {
    region: "Tamil Nadu",
    state: "Tamil Nadu",
    soilType: "Red Sandy Soil",
    avgN: 70,
    avgP: 30,
    avgK: 48,
    avgPh: 6.2,
    commonCrops: ["Rice", "Sugarcane", "Groundnut", "Banana"],
  },
  {
    region: "Karnataka",
    state: "Karnataka",
    soilType: "Red Laterite Soil",
    avgN: 72,
    avgP: 32,
    avgK: 50,
    avgPh: 6.4,
    commonCrops: ["Rice", "Ragi", "Sugarcane", "Cotton"],
  },
  {
    region: "Madhya Pradesh",
    state: "Madhya Pradesh",
    soilType: "Black Cotton Soil",
    avgN: 80,
    avgP: 42,
    avgK: 55,
    avgPh: 7.0,
    commonCrops: ["Wheat", "Soybean", "Cotton", "Gram"],
  },
  {
    region: "Gujarat",
    state: "Gujarat",
    soilType: "Black Cotton Soil",
    avgN: 68,
    avgP: 38,
    avgK: 48,
    avgPh: 7.4,
    commonCrops: ["Cotton", "Groundnut", "Wheat", "Tobacco"],
  },
  {
    region: "Rajasthan",
    state: "Rajasthan",
    soilType: "Desert Sandy Soil",
    avgN: 55,
    avgP: 25,
    avgK: 45,
    avgPh: 8.2,
    commonCrops: ["Mustard", "Bajra", "Wheat", "Cumin"],
  },
  {
    region: "Bihar",
    state: "Bihar",
    soilType: "Alluvial Soil",
    avgN: 88,
    avgP: 42,
    avgK: 58,
    avgPh: 7.3,
    commonCrops: ["Rice", "Wheat", "Maize", "Lentil"],
  },
  {
    region: "West Bengal",
    state: "West Bengal",
    soilType: "Alluvial Soil",
    avgN: 92,
    avgP: 40,
    avgK: 52,
    avgPh: 6.8,
    commonCrops: ["Rice", "Jute", "Potato", "Mustard"],
  },
  {
    region: "Kerala",
    state: "Kerala",
    soilType: "Laterite Soil",
    avgN: 65,
    avgP: 28,
    avgK: 45,
    avgPh: 5.8,
    commonCrops: ["Rice", "Coconut", "Rubber", "Banana"],
  },
  {
    region: "Odisha",
    state: "Odisha",
    soilType: "Red Laterite Soil",
    avgN: 78,
    avgP: 32,
    avgK: 50,
    avgPh: 6.3,
    commonCrops: ["Rice", "Pulses", "Groundnut", "Vegetables"],
  },
  {
    region: "Assam",
    state: "Assam",
    soilType: "Acidic Alluvial Soil",
    avgN: 85,
    avgP: 35,
    avgK: 42,
    avgPh: 5.5,
    commonCrops: ["Tea", "Rice", "Mustard", "Jute"],
  },
  {
    region: "Himachal Pradesh",
    state: "Himachal Pradesh",
    soilType: "Brown Forest Soil",
    avgN: 88,
    avgP: 30,
    avgK: 58,
    avgPh: 6.0,
    commonCrops: ["Apple", "Wheat", "Maize", "Potato"],
  },
  {
    region: "Jharkhand",
    state: "Jharkhand",
    soilType: "Red Laterite Soil",
    avgN: 72,
    avgP: 28,
    avgK: 46,
    avgPh: 6.1,
    commonCrops: ["Rice", "Maize", "Pulses", "Vegetables"],
  },
  {
    region: "Chhattisgarh",
    state: "Chhattisgarh",
    soilType: "Red Sandy Soil",
    avgN: 68,
    avgP: 30,
    avgK: 45,
    avgPh: 6.5,
    commonCrops: ["Rice", "Maize", "Pulses", "Soybean"],
  },
  {
    region: "Default",
    state: "India",
    soilType: "Alluvial Soil",
    avgN: 82,
    avgP: 40,
    avgK: 55,
    avgPh: 7.0,
    commonCrops: ["Wheat", "Rice", "Maize", "Soybean"],
  },
];

export function getSoilByRegion(region: string, state?: string): RegionalSoil {
  const searchTerm = (region || state || "").toLowerCase();

  const match = REGIONAL_SOIL.find(
    (s) =>
      s.region.toLowerCase() === searchTerm ||
      s.state.toLowerCase() === searchTerm ||
      s.region.toLowerCase().includes(searchTerm) ||
      (state && s.state.toLowerCase().includes(state.toLowerCase())),
  );

  return match || REGIONAL_SOIL.find((s) => s.region === "Default")!;
}
