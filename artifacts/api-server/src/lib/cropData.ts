// Detailed crop data including local names, cultivation info, diseases, and schemes

interface CropDisease {
  name: string;
  symptoms: string;
  treatment: string;
}

interface CropDetails {
  name: string;
  localNames: Record<string, string>;
  description: string;
  season: string;
  duration: string;
  soilRequirement: string;
  waterRequirement: string;
  fertilizers: string[];
  diseases: CropDisease[];
  govtSchemes: string[];
  marketPrice: string;
  yieldPerAcre: string;
}

const CROP_DATABASE: Record<string, CropDetails> = {
  rice: {
    name: "Rice",
    localNames: {
      hi: "धान / चावल",
      mr: "भात / तांदूळ",
      te: "వరి / అన్నం",
      ta: "நெல் / அரிசி",
      kn: "ಭತ್ತ / ಅಕ್ಕಿ",
      gu: "ડાંગર / ચોખા",
      pa: "ਝੋਨਾ / ਚਾਵਲ",
      en: "Rice / Paddy",
    },
    description:
      "Rice is the most important cereal crop in India and is the staple food for more than 50% of the population. India is one of the world's largest producers and exporters of rice.",
    season: "Kharif (June-November)",
    duration: "90-150 days depending on variety",
    soilRequirement: "Heavy clay or clay loam soil with good water retention. pH 5.5-6.5",
    waterRequirement: "1200-2000 mm total water requirement. Maintain 2-5 cm standing water during vegetative stage",
    fertilizers: [
      "Apply 40kg N/acre in 3 split doses (1/3 at basal, 1/3 at tillering, 1/3 at PI stage)",
      "Phosphorus: 20kg P2O5/acre as basal application",
      "Potassium: 20kg K2O/acre as basal application",
      "Zinc sulphate: 10kg/acre if Zn deficiency observed",
    ],
    diseases: [
      {
        name: "Blast (Pyricularia oryzae)",
        symptoms:
          "Diamond-shaped lesions with gray centers and brown margins on leaves. Neck and panicle blast causes grain filling failure",
        treatment:
          "Spray Tricyclazole 75WP at 0.6g/litre or Isoprothiolane 40EC at 1.5ml/litre. Repeat after 10 days if needed",
      },
      {
        name: "Bacterial Leaf Blight (Xanthomonas oryzae)",
        symptoms:
          "Water-soaked to yellowish stripes along leaf margins that turn white/yellow and dry up",
        treatment:
          "Spray Copper oxychloride 50WP at 3g/litre. Use resistant varieties. Avoid excessive N application",
      },
      {
        name: "Brown Plant Hopper",
        symptoms: "Hopper burn - circular yellowing patches in field. Plants dry up rapidly",
        treatment:
          "Spray Buprofezin 25SC at 1ml/litre or Thiamethoxam 25WG at 0.3g/litre. Drain field for 3-4 days",
      },
    ],
    govtSchemes: [
      "PM Fasal Bima Yojana - crop insurance at 2% premium for Kharif",
      "PM Kisan Samman Nidhi - Rs.6000/year direct benefit",
      "Paramparagat Krishi Vikas Yojana - support for organic rice cultivation",
      "MSP procurement by state procurement agencies at declared MSP",
    ],
    marketPrice: "MSP 2024-25: Rs.2300/quintal; Market price: Rs.2100-2800/quintal",
    yieldPerAcre: "20-30 quintals/acre (irrigated HYV varieties)",
  },
  wheat: {
    name: "Wheat",
    localNames: {
      hi: "गेहूं",
      mr: "गहू",
      te: "గోధుమ",
      ta: "கோதுமை",
      kn: "ಗೋಧಿ",
      gu: "ઘઉં",
      pa: "ਕਣਕ",
      en: "Wheat",
    },
    description:
      "Wheat is the second most important cereal crop in India after rice. It is primarily grown in the Indo-Gangetic plains during the Rabi season.",
    season: "Rabi (October-March)",
    duration: "100-150 days depending on variety",
    soilRequirement: "Well-drained loam or clay loam soil. pH 6.0-7.5",
    waterRequirement:
      "400-500 mm total. 5-6 critical irrigations: CRI (21 days), Tillering (45 days), Jointing (65 days), Flowering (80 days), Milking (90 days), Dough stage (105 days)",
    fertilizers: [
      "Nitrogen: 50-60kg N/acre in two splits (half basal + half at CRI)",
      "Phosphorus: 25kg P2O5/acre as basal",
      "Potassium: 12kg K2O/acre as basal if deficient",
      "Zinc: 5kg ZnSO4/acre if Zn deficient",
    ],
    diseases: [
      {
        name: "Yellow Rust (Puccinia striiformis)",
        symptoms:
          "Yellow to orange stripes on leaves arranged in rows parallel to leaf veins",
        treatment:
          "Spray Propiconazole 25EC at 1ml/litre or Tebuconazole 25.9EC at 1ml/litre. Use resistant varieties",
      },
      {
        name: "Karnal Bunt (Tilletia indica)",
        symptoms: "Partial conversion of wheat grains into black, smutty masses",
        treatment:
          "Seed treatment with Carboxin 37.5% + Thiram 37.5% at 3g/kg seed. Avoid stubble burning",
      },
      {
        name: "Loose Smut (Ustilago tritici)",
        symptoms: "Entire spike replaced by black powdery mass visible at heading",
        treatment:
          "Seed treatment with Carboxin + Thiram (Vitavax Power) at 2.5g/kg. Hot water treatment also effective",
      },
    ],
    govtSchemes: [
      "PM Fasal Bima Yojana - crop insurance at 1.5% premium for Rabi",
      "Central sector scheme for procurement at MSP through FCI and state agencies",
      "National Food Security Mission - Wheat component for yield enhancement",
      "PM Kisan Samman Nidhi - Rs.6000/year",
    ],
    marketPrice: "MSP 2024-25: Rs.2275/quintal; Market price: Rs.2200-2600/quintal",
    yieldPerAcre: "18-25 quintals/acre (irrigated conditions)",
  },
  maize: {
    name: "Maize",
    localNames: {
      hi: "मक्का",
      mr: "मका",
      te: "మొక్కజొన్న",
      ta: "மக்காச்சோளம்",
      kn: "ಮೆಕ್ಕೆ ಜೋಳ",
      gu: "મકાઈ",
      pa: "ਮੱਕੀ",
      en: "Maize / Corn",
    },
    description:
      "Maize is a versatile crop used for food, feed, and industrial purposes. India is the third largest producer of maize globally.",
    season: "Kharif (June-September) and Rabi (October-February)",
    duration: "80-110 days",
    soilRequirement: "Well-drained loamy soil. pH 5.8-7.0",
    waterRequirement: "500-600 mm. Critical stages: germination, knee-high, tasseling, silking, and grain filling",
    fertilizers: [
      "Nitrogen: 60-80kg N/acre in 3 splits",
      "Phosphorus: 25-30kg P2O5/acre as basal",
      "Potassium: 20kg K2O/acre as basal",
      "Apply zinc @ 10kg ZnSO4/acre if deficient",
    ],
    diseases: [
      {
        name: "Fall Armyworm (Spodoptera frugiperda)",
        symptoms:
          "Ragged feeding damage on leaves, rows of holes, whorl damage, wet sawdust-like frass",
        treatment:
          "Spray Spinetoram 11.7SC at 0.5ml/litre or Emamectin benzoate 5SG at 0.4g/litre. Use pheromone traps",
      },
      {
        name: "Turcicum Leaf Blight (Exserohilum turcicum)",
        symptoms: "Long, cigar-shaped tan to brown lesions with wavy margins on leaves",
        treatment:
          "Spray Mancozeb 75WP at 2g/litre or Propiconazole 25EC at 1ml/litre. Use resistant varieties",
      },
    ],
    govtSchemes: [
      "PM Fasal Bima Yojana for both Kharif and Rabi seasons",
      "National Food Security Mission - Coarse Cereals component",
      "PM Kisan Samman Nidhi",
      "PM Krishi Sinchayee Yojana for irrigation support",
    ],
    marketPrice: "MSP 2024-25: Rs.2225/quintal; Market price: Rs.1800-2500/quintal",
    yieldPerAcre: "25-35 quintals/acre (hybrid varieties)",
  },
  cotton: {
    name: "Cotton",
    localNames: {
      hi: "कपास",
      mr: "कापूस",
      te: "పత్తి",
      ta: "பருத்தி",
      kn: "ಹತ್ತಿ",
      gu: "કપાસ",
      pa: "ਕਪਾਹ",
      en: "Cotton",
    },
    description:
      "Cotton is India's most important commercial crop and is known as 'White Gold'. India is the world's largest producer and second largest exporter of cotton.",
    season: "Kharif (April-November in North, June-November in Peninsular)",
    duration: "150-180 days",
    soilRequirement: "Deep black cotton soil (Vertisols). pH 6.0-8.0. Good moisture retention",
    waterRequirement:
      "600-700 mm. Critical stages: germination, squaring, flowering, and boll development",
    fertilizers: [
      "Nitrogen: 60-80kg N/acre in splits",
      "Phosphorus: 30kg P2O5/acre as basal",
      "Potassium: 30kg K2O/acre as basal",
      "Foliar spray of Boron 0.2% at squaring and boll development stages",
    ],
    diseases: [
      {
        name: "Pink Bollworm (Pectinophora gossypiella)",
        symptoms: "Circular exit holes on bolls, rosette flowers, damaged seeds inside bolls",
        treatment:
          "Pheromone traps at 5/acre for monitoring. Spray Chlorpyriphos 20EC at 2ml/litre or Indoxacarb 15.8SC at 1ml/litre",
      },
      {
        name: "Cotton Leaf Curl Virus",
        symptoms:
          "Upward/downward curling of leaves, dark green enations on undersurface, stunted plants",
        treatment:
          "Control whitefly vector with Imidacloprid 70WG at 0.3g/litre. Remove and destroy infected plants. Use CLCuD resistant varieties",
      },
    ],
    govtSchemes: [
      "PM Fasal Bima Yojana at 2% premium",
      "Technology Mission on Cotton (TMC) for improving quality",
      "PM Kisan Samman Nidhi",
      "MSP procurement through CCI (Cotton Corporation of India)",
    ],
    marketPrice: "MSP 2024-25: Rs.7121/quintal (medium staple); Market: Rs.6500-9000/quintal",
    yieldPerAcre: "8-15 quintals lint/acre",
  },
  sugarcane: {
    name: "Sugarcane",
    localNames: {
      hi: "गन्ना",
      mr: "ऊस",
      te: "చెరకు",
      ta: "கரும்பு",
      kn: "ಕಬ್ಬು",
      gu: "શેરડી",
      pa: "ਗੰਨਾ",
      en: "Sugarcane",
    },
    description:
      "Sugarcane is the main source of sugar and jaggery in India. India is the world's largest consumer and second largest producer of sugar.",
    season: "Planted October-March (autumn/spring plant), harvested 12-14 months later",
    duration: "12-18 months",
    soilRequirement: "Deep, well-drained loamy or clay loam soil. pH 6.0-8.5",
    waterRequirement:
      "2000-2500 mm total. About 40-45 irrigations for ratoon, 35-40 for plant crop",
    fertilizers: [
      "Nitrogen: 120-150kg N/acre in 3-4 splits over growing season",
      "Phosphorus: 40kg P2O5/acre at planting",
      "Potassium: 50kg K2O/acre, half at planting, half at 4 months",
      "Trash mulching and green manuring recommended",
    ],
    diseases: [
      {
        name: "Red Rot (Colletotrichum falcatum)",
        symptoms: "Reddening of internal stalk tissues with white patches, stalk rotting, sour smell",
        treatment:
          "Use disease-free setts from certified seed cane. Hot water treatment of setts at 50°C for 2 hours",
      },
      {
        name: "Pyrilla (Pyrilla perpusilla)",
        symptoms: "Yellowing and drying of leaves. Sooty mold growth due to honeydew excretion",
        treatment: "Biological control with Epiricania melanoleuca (egg parasite). Spray Quinalphos 25EC at 2ml/litre",
      },
    ],
    govtSchemes: [
      "Fair and Remunerative Price (FRP) guaranteed by Central Government",
      "Sugar Development Fund loans for mill modernization",
      "PM Kisan Samman Nidhi",
      "State Advised Price (SAP) in UP, Punjab, Haryana - higher than FRP",
    ],
    marketPrice: "FRP 2024-25: Rs.340/quintal; Gur/Khandsari: Rs.3500-5000/quintal",
    yieldPerAcre: "300-500 quintals/acre",
  },
  chickpea: {
    name: "Chickpea",
    localNames: {
      hi: "चना",
      mr: "हरभरा",
      te: "శనగ",
      ta: "கொண்டைக்கடலை",
      kn: "ಕಡಲೆ",
      gu: "ચણા",
      pa: "ਛੋਲੇ / ਚਣੇ",
      en: "Chickpea / Bengal Gram",
    },
    description:
      "Chickpea (Chana) is the most important pulse crop in India, occupying about 40% of total pulse area. It is a rich source of protein (20-25%).",
    season: "Rabi (October-March)",
    duration: "90-120 days",
    soilRequirement: "Well-drained loamy or sandy loam soil. pH 6.0-8.0. Avoids waterlogging",
    waterRequirement: "350-450 mm. 1-2 irrigation(s) needed: at branching and pod filling stages",
    fertilizers: [
      "Apply 8-10 tonnes FYM/acre before sowing",
      "Nitrogen: 8-10kg N/acre (starter dose only - Rhizobium fixes atmospheric N)",
      "Phosphorus: 16-20kg P2O5/acre as basal",
      "Rhizobium + PSB bio-fertilizer seed treatment is essential",
    ],
    diseases: [
      {
        name: "Fusarium Wilt (Fusarium oxysporum)",
        symptoms:
          "Yellowing, wilting, and browning of leaves. Brown discoloration of stem base and roots",
        treatment:
          "Seed treatment with Trichoderma viride 4g/kg + Carbendazim 2g/kg. Use wilt-resistant varieties",
      },
      {
        name: "Pod Borer (Helicoverpa armigera)",
        symptoms: "Caterpillars feed on leaves and bore into pods eating developing seeds",
        treatment:
          "Spray HaNPV at 250 LE/acre as a first option. Follow up with Indoxacarb 14.5SC at 1ml/litre if needed. Pheromone traps for monitoring",
      },
    ],
    govtSchemes: [
      "National Food Security Mission - Pulses component",
      "PM Fasal Bima Yojana at 1.5% premium",
      "PM Kisan Samman Nidhi",
      "Price Stabilization Fund interventions when prices fall",
    ],
    marketPrice: "MSP 2024-25: Rs.5440/quintal; Market: Rs.4800-8000/quintal",
    yieldPerAcre: "8-12 quintals/acre",
  },
  groundnut: {
    name: "Groundnut",
    localNames: {
      hi: "मूंगफली",
      mr: "भुईमूग",
      te: "వేరుశనగ",
      ta: "வேர்க்கடலை",
      kn: "ಕಡಲೆ ಕಾಯಿ",
      gu: "મગફળી",
      pa: "ਮੂੰਗਫਲੀ",
      en: "Groundnut / Peanut",
    },
    description:
      "Groundnut is India's most important oilseed crop. It accounts for about 25-35% of total oilseed production. India is the second largest producer globally.",
    season: "Kharif (June-October) and Rabi (October-March) in some states",
    duration: "105-130 days",
    soilRequirement: "Well-drained sandy loam or loamy soil. pH 5.5-7.0. Light colored soils preferred",
    waterRequirement:
      "500-600 mm. Critical stages: pegging, pod development and maturity. Requires good drainage",
    fertilizers: [
      "Nitrogen: 8-10kg N/acre as starter dose",
      "Phosphorus: 25-30kg P2O5/acre as basal",
      "Potassium: 20kg K2O/acre if deficient",
      "Apply gypsum @ 80-100kg/acre at flowering for better pod fill and calcium supply",
    ],
    diseases: [
      {
        name: "Tikka Leaf Spot (Cercospora spp.)",
        symptoms: "Dark brown circular spots with yellow halo. Premature defoliation in severe cases",
        treatment:
          "Spray Mancozeb 75WP at 2.5g/litre or Chlorothalonil 75WP at 2g/litre at 15-day intervals",
      },
      {
        name: "Groundnut Rosette Virus",
        symptoms: "Stunting, yellow mottling, chlorosis, and mosaic patterns on leaves",
        treatment:
          "Control aphid vector with Dimethoate 30EC at 1ml/litre. Use healthy certified seed. Remove and destroy infected plants",
      },
    ],
    govtSchemes: [
      "National Mission on Oilseeds and Oil Palm (NMOOP)",
      "PM Fasal Bima Yojana",
      "PM Kisan Samman Nidhi",
      "MSP procurement through NAFED and NCCF",
    ],
    marketPrice: "MSP 2024-25: Rs.6783/quintal; Market: Rs.5500-8000/quintal",
    yieldPerAcre: "12-18 quintals/acre (pods)",
  },
  soybean: {
    name: "Soybean",
    localNames: {
      hi: "सोयाबीन",
      mr: "सोयाबीन",
      te: "సోయా బీన్",
      ta: "சோயா பீன்",
      kn: "ಸೋಯಾ ಬೀನ್",
      gu: "સોયાબીન",
      pa: "ਸੋਇਆਬੀਨ",
      en: "Soybean",
    },
    description:
      "Soybean is the most important oilseed-cum-pulse crop in India. It is called the 'Golden Bean' due to its high protein content (40%) and oil content (20%).",
    season: "Kharif (June-October)",
    duration: "90-110 days",
    soilRequirement: "Well-drained loamy to clay loam soil. pH 6.0-7.5. Avoid waterlogging",
    waterRequirement:
      "450-700 mm. Critical stages: flowering, pod formation, and seed filling",
    fertilizers: [
      "Nitrogen: 8-10kg N/acre as starter dose (Rhizobium fixes 60-80kg N/acre)",
      "Phosphorus: 30kg P2O5/acre as basal",
      "Potassium: 20kg K2O/acre if deficient",
      "Rhizobium + PSB bio-fertilizer seed treatment is must",
    ],
    diseases: [
      {
        name: "Yellow Mosaic Virus",
        symptoms: "Yellow-green mosaic pattern on leaves, plant stunting, reduced pod set",
        treatment:
          "Control whitefly vector. Spray Thiamethoxam 25WG at 0.3g/litre. Remove infected plants immediately",
      },
      {
        name: "Stem Fly (Melanagromyza sojae)",
        symptoms: "Yellowing of leaves, wilting of growing point, stem mining, plant death",
        treatment:
          "Seed treatment with Thiamethoxam 30FS at 10ml/kg. Spray Dimethoate 30EC at 1.5ml/litre if needed",
      },
    ],
    govtSchemes: [
      "National Mission on Oilseeds and Oil Palm",
      "PM Fasal Bima Yojana at 2% premium",
      "PM Kisan Samman Nidhi",
      "Technology Mission on Oilseeds support",
    ],
    marketPrice: "MSP 2024-25: Rs.4892/quintal; Market: Rs.3800-5200/quintal",
    yieldPerAcre: "10-16 quintals/acre",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// EXOTIC CROPS
// ─────────────────────────────────────────────────────────────────────────────
const EXOTIC_CROP_DATABASE: Record<string, CropDetails> = {
  dragonfruit: {
    name: "Dragon Fruit",
    localNames: { hi: "ड्रैगन फ्रूट", mr: "ड्रॅगन फ्रूट", en: "Dragon Fruit / Pitaya", ta: "டிராகன் பழம்", te: "డ్రాగన్ ఫ్రూట్", gu: "ડ્રેગન ફ્રૂટ", kn: "ಡ್ರ್ಯಾಗನ್ ಹಣ್ಣು", pa: "ਡਰੈਗਨ ਫਰੂਟ" },
    description: "Dragon Fruit (Hylocereus spp.) is a fast-growing cactus native to Mexico/Central America, now thriving in semi-arid India. Fetches Rs.150-400/kg with very high export demand. Minimal water and low maintenance make it highly profitable.",
    season: "Planting: Feb–Apr, Fruiting: Year-round after 12-18 months",
    duration: "First harvest in 12-18 months; productive for 20+ years",
    soilRequirement: "Well-drained sandy loam or red soil. pH 5.5-7.0. Avoid waterlogging at all costs",
    waterRequirement: "500-800 mm/year. Drip irrigation recommended. Drought-tolerant once established",
    fertilizers: [
      "Organic manure: 10-15 kg/plant/year",
      "NPK 10:10:10 at 50g/plant initially, scaling to 200g/plant by Year 3",
      "Potassium sulphate at fruiting stage: 25g/plant",
      "Boron and Zinc foliar spray once in 2 months",
    ],
    diseases: [
      { name: "Stem Canker (Colletotrichum gloeosporioides)", symptoms: "Brown-orange sunken lesions on stems; soft rot in humid conditions", treatment: "Spray Carbendazim 50WP at 1g/litre. Remove affected stems. Improve drainage and aeration" },
      { name: "Bacterial Soft Rot (Erwinia carotovora)", symptoms: "Mushy, water-soaked lesions on stems and fruits after rain", treatment: "Apply Copper oxychloride 50WP at 3g/litre. Avoid overhead irrigation; use drip only" },
      { name: "Mealybug", symptoms: "White cottony masses on stems; yellowing and wilting", treatment: "Spray Imidacloprid 17.8SL at 0.3ml/litre or neem oil 3% solution" },
    ],
    govtSchemes: [
      "National Horticulture Mission (NHM) — 50% subsidy on planting material",
      "PM Krishi Sinchayee Yojana — 55% subsidy on drip irrigation",
      "APEDA export support for exotic fruits",
      "State Horticulture Mission subsidies (Gujarat: up to Rs.47,000/ha)",
    ],
    marketPrice: "Rs.150-400/kg (domestic); Rs.300-600/kg (export grade). Growing demand in Tier-1 cities",
    yieldPerAcre: "4-8 tonnes/acre from Year 3 onwards",
  },
  avocado: {
    name: "Avocado",
    localNames: { hi: "एवोकाडो / मक्खन फल", mr: "अवोकॅडो", en: "Avocado / Butter Fruit", ta: "வெண்ணெய் பழம்", te: "అవకాడో", gu: "એવોકાડો", kn: "ಬೆಣ್ಣೆ ಹಣ್ಣು", pa: "ਐਵੋਕਾਡੋ" },
    description: "Avocado is a high-value tropical fruit with exceptional demand in urban markets and health food industry. Rich in healthy fats; commands premium pricing. Suited to Western Ghats and similar tropical highlands.",
    season: "Planting: June–August (monsoon). Harvest: Year 3-5 onwards, Feb-May peak",
    duration: "First commercial yield in 3-5 years; productive for 50+ years",
    soilRequirement: "Deep, well-drained loamy or laterite soil. pH 5.5-7.0. Avoid clay or waterlogged soil",
    waterRequirement: "1000-1500 mm annual rainfall. Critical irrigation during dry summer. Mulching essential",
    fertilizers: [
      "FYM: 50 kg/tree/year",
      "N: 400-500g/tree/year in 4 splits (Urea or Ammonium Sulphate)",
      "P: 250g/tree as single basal dose",
      "K: 500-600g/tree/year in 2 splits (important for fruit quality)",
      "Zinc: 25g ZnSO4/tree twice a year",
    ],
    diseases: [
      { name: "Phytophthora Root Rot (Phytophthora cinnamomi)", symptoms: "Wilting, yellowing, branch dieback; black-brown roots", treatment: "Soil drench with Metalaxyl 72WP at 2g/litre. Improve drainage. Use resistant rootstocks" },
      { name: "Anthracnose (Colletotrichum gloeosporioides)", symptoms: "Dark sunken lesions on mature fruit; post-harvest rotting", treatment: "Spray Carbendazim 50WP at 1g/litre at fortnightly intervals during fruit development" },
    ],
    govtSchemes: [
      "National Horticulture Mission — assistance for area expansion",
      "APEDA — export promotion support",
      "PM Fasal Bima Yojana for fruit crops",
      "Soil Health Card scheme for optimal nutrition management",
    ],
    marketPrice: "Rs.80-200/kg (local market); Rs.200-500/kg (premium/export grade). Demand growing 20%/year",
    yieldPerAcre: "2-5 tonnes/acre from Year 5 onwards",
  },
  quinoa: {
    name: "Quinoa",
    localNames: { hi: "क्विनोआ", mr: "क्विनोआ", en: "Quinoa", ta: "கினோவா", te: "క్వినోవా", gu: "ક્વિનોઆ", kn: "ಕ್ವಿನೋವಾ", pa: "ਕੁਇਨੋਆ" },
    description: "Quinoa is a protein-rich pseudo-cereal from South America, gaining massive popularity in India as a health food. Extremely drought-tolerant and grows well in semi-arid areas where conventional crops struggle. Called the 'super grain' for its complete amino acid profile.",
    season: "Rabi season: Sow Oct-Nov, Harvest Feb-Mar. Suitable for dry areas",
    duration: "90-120 days",
    soilRequirement: "Sandy loam to loamy soil. pH 6.0-8.5. Extremely tolerant of poor, saline and alkaline soils",
    waterRequirement: "300-600 mm. Very drought-resistant. Minimal irrigation required compared to wheat",
    fertilizers: [
      "FYM: 4-5 tonnes/acre before sowing",
      "Nitrogen: 20-25 kg N/acre (low requirement — avoids lodging)",
      "Phosphorus: 20 kg P2O5/acre as basal",
      "No heavy chemical fertilizers needed — responds well to organic",
    ],
    diseases: [
      { name: "Downy Mildew (Peronospora farinosa)", symptoms: "Purple-grey powdery coating on underside of leaves; stunting", treatment: "Spray Mancozeb 75WP at 2g/litre or Cymoxanil + Mancozeb at 2.5g/litre" },
      { name: "Aphids", symptoms: "Clusters of small insects on stems; yellowing and curling of leaves", treatment: "Spray neem oil 3% or Imidacloprid 17.8SL at 0.3ml/litre" },
    ],
    govtSchemes: [
      "ICAR research support for quinoa cultivation in India",
      "National Mission for Sustainable Agriculture (NMSA) — dryland farming support",
      "PM Fasal Bima Yojana for oilseeds and other crops",
    ],
    marketPrice: "Rs.100-250/kg (organic premium). Institutional buyers (health food brands) pay Rs.150-300/kg",
    yieldPerAcre: "6-12 quintals/acre in well-managed conditions",
  },
  chiaseeds: {
    name: "Chia Seeds",
    localNames: { hi: "चिया बीज", mr: "चिया बिया", en: "Chia Seeds", ta: "சியா விதைகள்", te: "చియా విత్తనాలు", gu: "ચિયા બીજ", kn: "ಚಿಯಾ ಬೀಜ", pa: "ਚੀਆ ਬੀਜ" },
    description: "Chia seeds are tiny superfood seeds from Salvia hispanica, packed with omega-3 fatty acids, protein, and fiber. Commanding premium health food prices and very high export demand. Low input, moderate climate crop gaining traction in India.",
    season: "Rabi: Sow Nov-Dec, Harvest Feb-Mar",
    duration: "100-130 days",
    soilRequirement: "Well-drained loamy or sandy loam soil. pH 6.0-8.0. Sensitive to waterlogging",
    waterRequirement: "500-800 mm. Moderate water requirement. Drip irrigation preferred",
    fertilizers: [
      "FYM: 3-4 tonnes/acre before sowing",
      "Nitrogen: 20-25 kg N/acre (basal + 30 DAS)",
      "Phosphorus: 20 kg P2O5/acre as basal",
      "Potassium: 15 kg K2O/acre if deficient",
    ],
    diseases: [
      { name: "Powdery Mildew", symptoms: "White powdery coating on leaves and stems; premature leaf fall", treatment: "Spray Sulphur 80WP at 3g/litre or Tebuconazole 25.9EC at 1ml/litre" },
      { name: "Root Rot (Rhizoctonia solani)", symptoms: "Dark brown lesions at stem base; wilting even when watered", treatment: "Seed treatment with Trichoderma viride 4g/kg. Avoid waterlogging. Drench Carbendazim at 1g/litre" },
    ],
    govtSchemes: [
      "National Mission on Oilseeds and Oil Palm (NMOOP) support",
      "APEDA export assistance for functional food ingredients",
      "Organic certification support under PKVY",
    ],
    marketPrice: "Rs.120-300/kg (regular); Rs.200-400/kg (organic certified). Strong export markets",
    yieldPerAcre: "4-8 quintals/acre",
  },
  vanilla: {
    name: "Vanilla",
    localNames: { hi: "वनीला", mr: "व्हॅनिला", en: "Vanilla", ta: "வெண்ணிலா", te: "వనిల్లా", gu: "વેનીલા", kn: "ವೆನಿಲ್ಲಾ", pa: "ਵਨੀਲਾ" },
    description: "Vanilla (Vanilla planifolia) is the world's most expensive spice after saffron. Hand-pollination required in India since natural pollinators are absent. High-value crop grown under shade/areca nut gardens. Kerala and Karnataka are primary states.",
    season: "Planting: July-Aug. Flowering: Jan-Mar. Harvest: 8-9 months after pollination",
    duration: "3 years to first harvest; productive for 12-15 years",
    soilRequirement: "Well-drained humus-rich laterite or loamy soil. pH 6.0-7.0. Rich in organic matter",
    waterRequirement: "1500-3000 mm. High humidity essential. Shade required (50-70%) — grows as climbing vine",
    fertilizers: [
      "Rich organic manure essential: 10-15 kg compost/plant/year",
      "N: 50-60g/plant in 4 splits (avoid excess nitrogen)",
      "K: 80-100g/plant in 2 splits (critical for flavour development)",
      "Micronutrients: Zinc, Boron, Copper foliar spray quarterly",
    ],
    diseases: [
      { name: "Fusarium Stem Rot (Fusarium oxysporum)", symptoms: "Yellowing, wilting, brown discoloration of vines from base upward", treatment: "Apply Carbendazim 50WP (1g/litre) as soil drench. Remove and burn infected vines" },
      { name: "Phytophthora Rot", symptoms: "Black water-soaked lesions on stems; rapid collapse in wet conditions", treatment: "Spray Metalaxyl 72WP at 2g/litre. Improve canopy drainage. Avoid waterlogging" },
    ],
    govtSchemes: [
      "Spices Board of India — development support and buy-back schemes",
      "National Horticulture Mission — planting material subsidy",
      "GI tag protection for Indian vanilla",
      "APEDA export certification support",
    ],
    marketPrice: "Rs.3000-8000/kg cured beans. Green beans: Rs.300-800/kg. Among highest value spice crops",
    yieldPerAcre: "200-500 kg cured beans/acre (well-established plantations)",
  },
  stevia: {
    name: "Stevia",
    localNames: { hi: "स्टेविया / मीठी तुलसी", mr: "स्टेव्हिया", en: "Stevia / Sweet Leaf", ta: "ஸ்டீவியா", te: "స్టెవియా", gu: "સ્ટેવિયા", kn: "ಸ್ಟೆವಿಯಾ", pa: "ਸਟੇਵੀਆ" },
    description: "Stevia is a natural zero-calorie sweetener (300x sweeter than sugar) with rapidly growing demand in the food and pharmaceutical industries. Contract farming with guaranteed buyback is common. Short crop cycle and perennial nature make it lucrative.",
    season: "Planted any time (Feb-Mar best). Multiple harvests per year",
    duration: "First harvest in 3-4 months; 5-6 harvests/year possible",
    soilRequirement: "Well-drained sandy loam soil. pH 6.0-7.5. Sensitive to waterlogging. Light soils preferred",
    waterRequirement: "600-1200 mm. Regular irrigation essential for leaf quality. Drip preferred",
    fertilizers: [
      "FYM: 8-10 tonnes/acre before planting",
      "N: 30-40 kg/acre/year in splits after each harvest",
      "P: 20 kg P2O5/acre as basal",
      "K: 20-25 kg K2O/acre in splits",
    ],
    diseases: [
      { name: "Septoria Leaf Spot", symptoms: "Small brown circular spots with yellow halo on leaves", treatment: "Spray Mancozeb 75WP at 2g/litre. Avoid overhead irrigation" },
      { name: "Root Rot", symptoms: "Yellowing, wilting; brown discoloration of roots", treatment: "Improve drainage. Drench Carbendazim 50WP at 1g/litre at planting" },
    ],
    govtSchemes: [
      "National Medicinal Plants Board (NMPB) — support for medicinal and aromatic plants",
      "Contract farming schemes with PepsiCo, Zydus Wellness, etc.",
      "State horticulture missions — planting subsidy",
      "Organic certification support under PKVY",
    ],
    marketPrice: "Dry leaf: Rs.200-500/kg. Extract: Rs.2000-5000/kg. Strong institutional demand",
    yieldPerAcre: "4-6 tonnes dry leaf/year (multiple cuts)",
  },
  passionfruit: {
    name: "Passion Fruit",
    localNames: { hi: "पैशन फ्रूट / कृष्णफल", mr: "पॅशन फ्रूट", en: "Passion Fruit", ta: "நன்னாரி பழம்", te: "పాషన్ ఫ్రూట్", gu: "પૅશન ફ્રૂટ", kn: "ಪ್ಯಾಷನ್ ಫ್ರೂಟ್", pa: "ਪੈਸ਼ਨ ਫਰੂਟ" },
    description: "Passion fruit is a fast-growing vine producing highly profitable tropical fruits. Both yellow (Passiflora edulis f. flavicarpa) and purple varieties are grown. High demand from juice industry, restaurants, and health markets. Quick returns within 6-8 months.",
    season: "Planting: June-July (monsoon) or Feb-Mar. Harvest begins 6-8 months after planting",
    duration: "First harvest 6-8 months; productive for 4-5 years",
    soilRequirement: "Well-drained loamy or sandy loam soil. pH 5.5-6.5. Trellising/support structure required",
    waterRequirement: "800-1500 mm. Regular irrigation critical during dry spells. Avoid waterlogging",
    fertilizers: [
      "FYM: 15-20 kg/plant/year",
      "N: 100-150g/plant in 4 splits",
      "P: 80g P2O5/plant as basal",
      "K: 150-200g/plant in 2 splits (key for fruit development)",
      "Foliar spray of micronutrients during flowering",
    ],
    diseases: [
      { name: "Phytophthora Blight", symptoms: "Dark water-soaked lesions on collar region; sudden plant death in wet weather", treatment: "Drench Metalaxyl 72WP at 2g/litre around stem base. Ensure drainage around plants" },
      { name: "Woodiness Virus (Cowpea aphid-borne mosaic virus)", symptoms: "Distorted, woody, small fruits; mosaic patterns on leaves", treatment: "Control aphid vectors with Imidacloprid 17.8SL at 0.3ml/litre. Remove infected plants" },
    ],
    govtSchemes: [
      "National Horticulture Mission — planting material and area expansion subsidy",
      "PM Krishi Sinchayee Yojana — drip/sprinkler subsidy",
      "State horticulture missions (Maharashtra, Karnataka) offer input subsidy",
      "APEDA export support for tropical fruits",
    ],
    marketPrice: "Rs.60-150/kg fresh fruit; Rs.150-300/kg for juice concentrate. Year-round demand",
    yieldPerAcre: "8-15 tonnes/acre/year from established vines",
  },
  olive: {
    name: "Olive",
    localNames: { hi: "जैतून", mr: "ऑलिव्ह", en: "Olive", ta: "ஆலிவ்", te: "ఆలివ్", gu: "ઓલિવ", kn: "ಆಲಿವ್", pa: "ਜ਼ੈਤੂਨ" },
    description: "Olive cultivation was successfully introduced in Rajasthan in 2007 with Israeli expertise. Suited to the Mediterranean-like climate of NW India. The RAJMACO (Rajasthan Olive Cultivation Ltd) model provides buyback. Olive oil commands premium Rs.400-800/litre.",
    season: "Planting: Oct-Nov or Feb-Mar. Harvest: Dec-Feb (mature fruit)",
    duration: "3-4 years to first fruit; productive for 100+ years",
    soilRequirement: "Well-drained alkaline or neutral soil. pH 6.0-8.0. Tolerates poor, rocky soil. Dislikes waterlogging",
    waterRequirement: "400-700 mm. Drip irrigation essential in India. Very drought-tolerant once established",
    fertilizers: [
      "FYM: 20-25 kg/tree/year",
      "N: 100-200g/tree/year (low requirement)",
      "P: 100g P2O5/tree/year as basal",
      "K: 150-200g/tree/year (important for oil quality)",
      "Boron: 20g borax/tree twice a year (prevents fruit drop)",
    ],
    diseases: [
      { name: "Olive Knot (Pseudomonas savastanoi)", symptoms: "Rough woody galls/knots on branches and trunk", treatment: "Prune and destroy infected material. Apply Copper hydroxide 50WP. Avoid mechanical injuries" },
      { name: "Peacock Spot (Spilocaea oleagina)", symptoms: "Circular dark spots with yellow halo on upper leaf surface", treatment: "Spray Copper oxychloride 50WP at 3g/litre in autumn and spring" },
    ],
    govtSchemes: [
      "Rajasthan Olive Cultivation Ltd (RAJMACO) — buyback and technical support",
      "National Horticulture Mission — area expansion support",
      "ICAR-CIAH research collaboration for olive varieties",
      "PM Krishi Sinchayee Yojana — subsidy on drip irrigation",
    ],
    marketPrice: "Table olives: Rs.30-80/kg. Virgin olive oil: Rs.400-800/litre. Premium health product",
    yieldPerAcre: "3-6 tonnes fruit/acre (mature orchards, 10+ years)",
  },
  kiwi: {
    name: "Kiwi",
    localNames: { hi: "कीवी / चाइनीज़ गूज़बेरी", mr: "किवी", en: "Kiwi / Chinese Gooseberry", ta: "கிவி", te: "కివి", gu: "કિવી", kn: "ಕಿವಿ", pa: "ਕਿਵੀ" },
    description: "Kiwi (Actinidia deliciosa) thrives in the cooler subtropical highlands of NE India and Himachal Pradesh. Highly nutritious (Vitamin C, K, E) with rising domestic demand. India imports large quantities, creating excellent opportunities for domestic growers.",
    season: "Planting: Dec-Jan (bare root). Harvest: Oct-Dec",
    duration: "4-5 years to first commercial harvest; 25+ years productive life",
    soilRequirement: "Deep, well-drained loamy soil. pH 5.0-6.5 (slightly acidic). Rich in organic matter",
    waterRequirement: "1200-1500 mm. Adequate rainfall needed; irrigation during dry periods. Frost protection required",
    fertilizers: [
      "FYM: 25-30 kg/vine/year",
      "N: 200-250g/vine/year in 3 splits",
      "P: 100g P2O5/vine",
      "K: 200g K2O/vine in 2 splits",
      "Important: Calcium (50g/vine) for fruit quality",
    ],
    diseases: [
      { name: "Botrytis Blight (Botrytis cinerea)", symptoms: "Grey mold on flowers and young shoots in cool humid weather", treatment: "Spray Carbendazim 50WP at 1g/litre. Ensure good canopy aeration. Remove infected material" },
      { name: "Pseudomonas Canker", symptoms: "Oozing cankers on trunk; gummosis; branch dieback", treatment: "Apply Copper oxychloride paste on pruning cuts. Spray Streptomycin sulphate 90SP at 1g/litre in winter" },
    ],
    govtSchemes: [
      "National Horticulture Mission — NE India and Himachal Pradesh — planting support",
      "ICAR-CITH (Central Institute of Temperate Horticulture) technical support",
      "PM Fasal Bima Yojana for fruit crops",
      "APEDA export support",
    ],
    marketPrice: "Rs.100-300/kg. Premium organic kiwi fetches Rs.250-500/kg. Import substitution opportunity",
    yieldPerAcre: "4-8 tonnes/acre (established orchards)",
  },
  blueberry: {
    name: "Blueberry",
    localNames: { hi: "ब्लूबेरी / नीलबदरी", mr: "ब्लूबेरी", en: "Blueberry", ta: "ப்ளூபெர்ரி", te: "బ్లూబెర్రీ", gu: "બ્લૂબેરી", kn: "ಬ್ಲೂಬೆರ್ರಿ", pa: "ਬਲੂਬੇਰੀ" },
    description: "Blueberry is a premium superfruit with the highest antioxidant content among common fruits. Karnataka's laterite acidic soils (pH 4.5-5.5) are uniquely suited. Experimental success in Himachal Pradesh too. Commands very high prices of Rs.500-1500/kg.",
    season: "Planting: Oct-Nov or Feb-Mar. Harvest: Mar-May (Southern India)",
    duration: "2-3 years to first crop; productive for 15-20 years",
    soilRequirement: "Critical: HIGHLY ACIDIC soil pH 4.5-5.5 is mandatory. Sandy loam or loamy with organic matter. Poor drainage is fatal",
    waterRequirement: "800-1200 mm. Consistent moisture critical. Drip or micro-sprinkler recommended. Mulching essential",
    fertilizers: [
      "Acidifying fertilizers ONLY: Ammonium Sulphate (not Urea) for N",
      "N: 30-40g/plant as Ammonium Sulphate — split 4 times",
      "P: Superphosphate 30g/plant",
      "K: Potassium sulphate 20g/plant",
      "Soil acidification: Elemental sulphur 250g/plant if pH >5.5 (essential!)",
    ],
    diseases: [
      { name: "Mummy Berry (Monilinia vaccinii-corymbosi)", symptoms: "Wilted shoots; fruit becomes shrivelled and mummified", treatment: "Remove mummified fruits. Spray Iprodione 50WP at 2g/litre at early bloom" },
      { name: "Botrytis Blight", symptoms: "Grey fuzzy mold on flowers; fruit rotting after harvest", treatment: "Spray Fenhexamid 50WG at 1g/litre. Ensure good air circulation through pruning" },
    ],
    govtSchemes: [
      "National Horticulture Mission Karnataka — exotic fruit development support",
      "ICAR-IIHR (Bangalore) — technical guidance and variety trials",
      "PM Krishi Sinchayee Yojana — drip irrigation subsidy",
      "Organic certification support — PKVY",
    ],
    marketPrice: "Rs.500-1500/kg (domestic). Export to Middle East and Southeast Asia: Rs.800-2000/kg",
    yieldPerAcre: "2-4 tonnes/acre (established plants after Year 3)",
  },
};

export function getCropDetails(cropName: string): CropDetails | null {
  const key = cropName.toLowerCase().replace(/[\s-_]/g, "");

  // Check regular crops first
  if (CROP_DATABASE[key]) return CROP_DATABASE[key];
  const partialKey = Object.keys(CROP_DATABASE).find(
    (k) => k.includes(key) || key.includes(k),
  );
  if (partialKey) return CROP_DATABASE[partialKey];

  // Check exotic crops
  if (EXOTIC_CROP_DATABASE[key]) return EXOTIC_CROP_DATABASE[key];
  const exoticKey = Object.keys(EXOTIC_CROP_DATABASE).find(
    (k) => k.includes(key) || key.includes(k),
  );
  if (exoticKey) return EXOTIC_CROP_DATABASE[exoticKey];

  return null;
}

export function getAllCropNames(): string[] {
  return Object.values(CROP_DATABASE).map((c) => c.name);
}
