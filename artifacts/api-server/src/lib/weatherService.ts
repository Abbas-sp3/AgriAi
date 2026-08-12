import { logger } from "./logger";

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Heavy drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

function getFarmingAdvice(temp: number, precipitation: number, humidity: number): string {
  if (precipitation > 20) {
    return "Heavy rainfall expected. Avoid field operations. Check drainage to prevent waterlogging. Consider delaying fertilizer application.";
  } else if (precipitation > 5) {
    return "Moderate rainfall expected. Good time for transplanting seedlings. Hold off on pesticide spraying.";
  } else if (temp > 38) {
    return "High temperature alert. Irrigate early morning or evening. Mulch soil to conserve moisture. Monitor for heat stress in crops.";
  } else if (temp < 10) {
    return "Cool weather alert. Protect sensitive crops from frost. Good conditions for wheat and mustard growth.";
  } else if (humidity > 85) {
    return "High humidity conditions. Watch for fungal diseases. Ensure proper ventilation in polyhouses. Spray fungicide preventively if needed.";
  } else if (humidity < 30) {
    return "Low humidity. Increase irrigation frequency. Monitor crops for wilting. Mulching will help retain soil moisture.";
  } else {
    return "Favorable weather conditions for field operations. Good time for sowing, fertilizing, and crop monitoring.";
  }
}

export async function fetchWeather(lat?: number, lon?: number, location?: string) {
  // Default to India center if no location
  const latitude = lat ?? 20.5937;
  const longitude = lon ?? 78.9629;
  const locationName = location ?? (lat && lon ? `${lat.toFixed(2)}, ${lon.toFixed(2)}` : "India");

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo API returned ${response.status}`);
    }

    const data = await response.json() as {
      current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        precipitation: number;
        weather_code: number;
      };
      daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
      };
    };

    const current = data.current;
    const daily = data.daily;

    const forecast = daily.time.map((date, i) => ({
      date,
      maxTemp: daily.temperature_2m_max[i],
      minTemp: daily.temperature_2m_min[i],
      precipitation: daily.precipitation_sum[i],
      description: WMO_DESCRIPTIONS[daily.weather_code[i]] ?? "Unknown",
    }));

    return {
      location: locationName,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windspeed: current.wind_speed_10m,
      precipitation: current.precipitation,
      weatherCode: current.weather_code,
      description: WMO_DESCRIPTIONS[current.weather_code] ?? "Unknown",
      forecast,
      farmingAdvice: getFarmingAdvice(current.temperature_2m, current.precipitation, current.relative_humidity_2m),
    };
  } catch (err) {
    logger.error({ err }, "Failed to fetch from Open-Meteo");
    throw err;
  }
}
