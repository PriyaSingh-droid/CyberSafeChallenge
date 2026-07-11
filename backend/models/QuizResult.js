import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Participant", required: true, index: true },
    score: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 1 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    badge: { type: String, required: true, trim: true },
    timeTaken: { type: Number, required: true, min: 0 },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

quizResultSchema.index({ score: -1, timeTaken: 1 });
export default mongoose.model("QuizResult", quizResultSchema);
