import { Router } from "express";
import { submitScenario } from "../controllers/scenarioController.js";

const router = Router();
router.post("/scenario/submit", submitScenario);

export default router;
