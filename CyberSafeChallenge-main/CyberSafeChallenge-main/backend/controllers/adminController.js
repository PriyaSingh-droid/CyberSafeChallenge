import bcrypt from "bcrypt";
import ExcelJS from "exceljs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Certificate from "../models/Certificate.js";
import Participant from "../models/Participant.js";
import QuizResult from "../models/QuizResult.js";

async function ensureConfiguredAdmin() {
    const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!username || !password) return;
    const admin = await Admin.findOne({ username }).select("+password");
    if (!admin) await Admin.create({ username, password: await bcrypt.hash(password, 12) });
}

export async function login(req, res, next) {
    try {
        await ensureConfiguredAdmin();
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Username and password are required." });
        const admin = await Admin.findOne({ username: String(username).toLowerCase() }).select("+password");
        if (!admin || !await bcrypt.compare(password, admin.password)) return res.status(401).json({ message: "Invalid admin credentials." });
        const token = jwt.sign({ sub: admin._id.toString(), role: admin.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
        return res.json({ token, admin: { username: admin.username, role: admin.role } });
    } catch (error) { next(error); }
}

export async function dashboard(req, res, next) {
    try {
        const [totalParticipants, completedQuizzes, certificatesIssued, aggregates, recent] = await Promise.all([
            Participant.countDocuments(), QuizResult.countDocuments(), Certificate.countDocuments(),
            QuizResult.aggregate([{ $group: { _id: null, averageScore: { $avg: "$percentage" }, highestScore: { $max: "$percentage" }, lowestScore: { $min: "$percentage" } } }]),
            QuizResult.find().sort({ completedAt: 1 }).populate("participantId", "fullName").lean()
        ]);
        const stats = aggregates[0] || { averageScore: 0, highestScore: 0, lowestScore: 0 };
        return res.json({ totalParticipants, completedQuizzes, certificatesIssued, averageScore: Math.round(stats.averageScore), highestScore: stats.highestScore, lowestScore: stats.lowestScore, completionRate: totalParticipants ? Math.round((completedQuizzes / totalParticipants) * 100) : 0, scoreDistribution: recent.map((item) => ({ name: item.participantId?.fullName || "Participant", percentage: item.percentage })), completionTrend: recent.map((item) => ({ date: item.completedAt.toISOString().slice(0, 10), percentage: item.percentage })) });
    } catch (error) { next(error); }
}

export async function searchParticipants(req, res, next) {
    try {
        const query = String(req.query.q || "").trim();
        const fields = ["fullName", "email", "phone", "college", "competitionCode"];
        const filter = query ? { $or: fields.map((field) => ({ [field]: { $regex: query, $options: "i" } })) } : {};
        const participants = await Participant.find(filter).sort({ registeredAt: -1 }).limit(100).lean();
        return res.json({ participants });
    } catch (error) { next(error); }
}

export async function exportParticipants(req, res, next) {
    try {
        const participants = await Participant.aggregate([{ $lookup: { from: "quizresults", localField: "_id", foreignField: "participantId", as: "results" } }, { $addFields: { latestResult: { $arrayElemAt: ["$results", -1] } } }]);
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Participants");
        sheet.columns = [["Name", "fullName"], ["Email", "email"], ["Phone", "phone"], ["College", "college"], ["Course", "course"], ["Score", "score"], ["Badge", "badge"], ["Time", "time"], ["Competition Code", "competitionCode"]].map(([header, key]) => ({ header, key, width: 24 }));
        participants.forEach((participant) => sheet.addRow({ fullName: participant.fullName, email: participant.email, phone: participant.phone, college: participant.college, course: participant.course, score: participant.latestResult?.score ?? "", badge: participant.latestResult?.badge ?? "", time: participant.latestResult?.timeTaken ?? "", competitionCode: participant.competitionCode }));
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=participants.xlsx");
        await workbook.xlsx.write(res);
        return res.end();
    } catch (error) { next(error); }
}
