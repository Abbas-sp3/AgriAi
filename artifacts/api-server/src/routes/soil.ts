import { Router, type IRouter } from "express";
import { GetSoilByRegionQueryParams, GetSoilByRegionResponse } from "@workspace/api-zod";
import { getSoilByRegion } from "../lib/soilData";

const router: IRouter = Router();

router.get("/soil/region", async (req, res): Promise<void> => {
  const parsed = GetSoilByRegionQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { region, state } = parsed.data;
  const result = getSoilByRegion(region, state);
  res.json(GetSoilByRegionResponse.parse(result));
});

export default router;
