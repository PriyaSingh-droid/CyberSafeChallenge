import Participant from "../models/Participant.js";
import { getScenarioBadge } from "../utils/badges.js";

export async function submitScenario(req, res, next) {
    try {
        const { participantId, xp, correctAnswers, wrongAnswers } = req.body;
        if (!participantId || ![xp, correctAnswers, wrongAnswers].every((value) => Number.isInteger(value) && value >= 0)) return res.status(400).json({ message: "Invalid scenario submission." });
        const participant = await Participant.findByIdAndUpdate(participantId, { scenarioXP: xp }, { new: true, runValidators: true });
        if (!participant) return res.status(404).json({ message: "Participant not found." });
        return res.json({ participant, badge: getScenarioBadge(xp), correctAnswers, wrongAnswers });
    } catch (error) { next(error); }
}
