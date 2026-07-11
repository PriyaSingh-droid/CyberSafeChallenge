import { Router } from "express";
import { submitQuiz } from "../controllers/quizController.js";
const router = Router();
router.post("/quiz/submit", submitQuiz);
export default router;
