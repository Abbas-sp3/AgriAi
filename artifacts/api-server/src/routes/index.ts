import { Router, type IRouter } from "express";
import healthRouter from "./health";
import predictRouter from "./predict";
import advisorRouter from "./advisor";
import weatherRouter from "./weather";
import newsRouter from "./news";
import soilRouter from "./soil";
import cropRouter from "./crop";
import diseaseRouter from "./disease";
import agentRouter from "./agent";

const router: IRouter = Router();

router.use(healthRouter);
router.use(predictRouter);
router.use(advisorRouter);
router.use(weatherRouter);
router.use(newsRouter);
router.use(soilRouter);
router.use(cropRouter);
router.use(diseaseRouter);
router.use(agentRouter);

export default router;
