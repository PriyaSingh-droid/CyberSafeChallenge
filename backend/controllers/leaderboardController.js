import Participant from "../models/Participant.js";
import { calculateRank } from "../utils/calculateRank.js";

export async function getLeaderboard(req, res, next) {
    try {
        const participants = await Participant.find({ quizCompleted: true }).sort({ score: -1, timeTaken: 1, updatedAt: 1 }).limit(100).lean();
        const leaderboard = calculateRank(participants.map(({ fullName, college, score, percentage, timeTaken, badge }) => ({ participantName: fullName, college, score, percentage, timeTaken, badge })));
        return res.json({ leaderboard });
    } catch (error) { next(error); }
}
