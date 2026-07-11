import express from "express";
import {
    joinCompetition,
    createAnonymousSession,
    getParticipant,
    getParticipantCertificate
} from "../controllers/participantController.js";

const router = express.Router();

router.post("/competition/join", joinCompetition);

router.post("/session", createAnonymousSession);

router.get("/participant/:id", getParticipant);

router.get("/participant/:id/certificate", getParticipantCertificate);

export default router;
