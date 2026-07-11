import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Participant", required: true, unique: true },
    certificateNumber: { type: String, required: true, unique: true },
    issuedDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Certificate", certificateSchema);
