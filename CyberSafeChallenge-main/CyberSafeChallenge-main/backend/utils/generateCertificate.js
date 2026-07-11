import Certificate from "../models/Certificate.js";

/** Creates one stable, human-readable certificate number for each participant. */
export async function generateCertificate(participantId) {
    const existing = await Certificate.findOne({ participantId });
    if (existing) return existing;

    const year = new Date().getFullYear();
    const sequence = await Certificate.countDocuments({ certificateNumber: new RegExp(`^CSC${year}`) }) + 1;
    return Certificate.create({ participantId, certificateNumber: `CSC${year}${String(sequence).padStart(5, "0")}` });
}
