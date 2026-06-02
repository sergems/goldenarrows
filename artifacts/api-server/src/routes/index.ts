import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import newsRouter from "./news";
import playersRouter from "./players";
import staffRouter from "./staff";
import fixturesRouter from "./fixtures";
import resultsRouter from "./results";
import leagueRouter from "./league";
import galleryRouter from "./gallery";
import sponsorsRouter from "./sponsors";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(newsRouter);
router.use(playersRouter);
router.use(staffRouter);
router.use(fixturesRouter);
router.use(resultsRouter);
router.use(leagueRouter);
router.use(galleryRouter);
router.use(sponsorsRouter);
router.use(statsRouter);

export default router;
