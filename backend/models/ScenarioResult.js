import mongoose from "mongoose";

const scenarioResultSchema = new mongoose.Schema({
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Participant", required: true, index: true },
    xp: { type: Number, required: true, min: 0 },
    correctAnswers: { type: Number, required: true, min: 0 },
    wrongAnswers: { type: Number, required: true, min: 0 },
    badge: { type: String, required: true, trim: true },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("ScenarioResult", scenarioResultSchema);
