import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { type: String, required: true, trim: true, unique: true, match: /^[0-9+\-\s()]{7,20}$/ },
    college: { type: String, trim: true, default: "", maxlength: 150 },
    course: { type: String, trim: true, default: "", maxlength: 100 },
    competitionCode: { type: String, required: true, trim: true, uppercase: true, index: true },
    score: { type: Number, default: 0, min: 0 },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    timeTaken: { type: Number, default: 0, min: 0 },
    scenarioXP: { type: Number, default: 0, min: 0 },
    badge: { type: String, default: "", trim: true },
    quizCompleted: { type: Boolean, default: false },
    certificateIssued: { type: Boolean, default: false }
}, { timestamps: true });

participantSchema.index({ score: -1, timeTaken: 1 });
export default mongoose.model("Participant", participantSchema);
