import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema({
    competitionName: { type: String, required: true, trim: true },
    competitionCode: { type: String, required: true, trim: true, uppercase: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    maximumParticipants: { type: Number, required: true, min: 1 }
}, { timestamps: true });

export default mongoose.model("Competition", competitionSchema);
