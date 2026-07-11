import express from "express";
import {
    joinCompetition,
    createAnonymousSession
} from "../controllers/participantController.js";

const router = express.Router();

router.post("/competition/join", joinCompetition);

router.post("/session", createAnonymousSession);

export default router;