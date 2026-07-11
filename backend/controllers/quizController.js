import Participant from "../models/Participant.js";
import { getQuizBadge } from "../utils/badges.js";
import { getOrCreateCertificate } from "../utils/certificate.js";

export async function submitQuiz(req, res, next) {
    try {
        const { participantId, score, totalQuestions, timeTaken } = req.body;
        if (!participantId || !Number.isInteger(score) || !Number.isInteger(totalQuestions) || score < 0 || score > totalQuestions || !Number.isFinite(timeTaken) || timeTaken < 0) return res.status(400).json({ message: "Invalid quiz submission." });
        const percentage = Math.round((score / totalQuestions) * 100);
        const participant = await Participant.findByIdAndUpdate(participantId, { score, percentage, timeTaken, badge: getQuizBadge(percentage), quizCompleted: true, certificateIssued: true }, { new: true, runValidators: true });
        if (!participant) return res.status(404).json({ message: "Participant not found." });
        const certificate = await getOrCreateCertificate(participant._id);
        return res.status(200).json({ participant, certificate });
    } catch (error) { next(error); }
}
