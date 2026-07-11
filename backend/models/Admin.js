import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" }
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
