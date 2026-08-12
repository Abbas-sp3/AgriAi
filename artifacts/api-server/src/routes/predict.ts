import { Router, type IRouter } from "express";
import { PredictCropBody, PredictCropResponse } from "@workspace/api-zod";
import { predictCrop } from "../lib/cropModel";

const router: IRouter = Router();

router.post("/predict", async (req, res): Promise<void> => {
  const parsed = PredictCropBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = predictCrop(parsed.data);
  res.json(PredictCropResponse.parse(result));
});

export default router;
