import Competition from "../models/Competition.js";
import Participant from "../models/Participant.js";

export async function joinCompetition(req, res, next) {
    try {
        const { fullName, email, phone, college = "", course = "" } = req.body;
        if (![fullName, email, phone].every((value) => String(value || "").trim())) return res.status(400).json({ message: "Full name, email, and phone are required." });

        const competition = await Competition.findOne({ status: "active" });
        if (!competition) return res.status(404).json({ message: "No active competition is available right now." });

        const normalizedEmail = String(email).trim().toLowerCase();
        const normalizedPhone = String(phone).trim();
        const existing = await Participant.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] });
        if (existing) {
            if (existing.email === normalizedEmail && existing.phone === normalizedPhone) return res.json({ message: "Welcome back to the competition.", participantId: existing._id, participant: existing });
            return res.status(409).json({ message: "That email address or phone number is already registered." });
        }

        const count = await Participant.countDocuments({ competitionCode: competition.competitionCode });
        if (count >= competition.maximumParticipants) return res.status(403).json({ message: "This competition has reached its participant limit." });

        const participant = await Participant.create({ fullName, email: normalizedEmail, phone: normalizedPhone, college, course, competitionCode: competition.competitionCode });
        return res.status(201).json({ message: "Competition joined successfully.", participantId: participant._id, participant });
    } catch (error) { next(error); }
}

export async function getParticipant(req, res, next) {
    try {
        const participant = await Participant.findById(req.params.id);
        if (!participant) return res.status(404).json({ message: "Participant not found." });
        return res.json({ participant });
    } catch (error) { next(error); }
}
