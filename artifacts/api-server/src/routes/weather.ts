import { Router, type IRouter } from "express";
import { GetWeatherQueryParams, GetWeatherResponse } from "@workspace/api-zod";
import { fetchWeather } from "../lib/weatherService";

const router: IRouter = Router();

router.get("/weather", async (req, res): Promise<void> => {
  const parsed = GetWeatherQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { lat, lon, location } = parsed.data;
  const data = await fetchWeather(lat, lon, location);
  res.json(GetWeatherResponse.parse(data));
});

export default router;
