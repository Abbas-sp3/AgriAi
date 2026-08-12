import { Router, type IRouter } from "express";
import { GetNewsQueryParams, GetNewsResponse } from "@workspace/api-zod";
import { getNews } from "../lib/newsService";

const router: IRouter = Router();

router.get("/news", async (req, res): Promise<void> => {
  const parsed = GetNewsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, language } = parsed.data;
  const result = await getNews(category, language);
  res.json(GetNewsResponse.parse(result));
});

export default router;
