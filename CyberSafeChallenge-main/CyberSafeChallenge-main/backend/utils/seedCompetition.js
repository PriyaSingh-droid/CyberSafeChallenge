import "dotenv/config";
import { connectDatabase } from "../config/db.js";
import Competition from "../models/Competition.js";

await connectDatabase();
await Competition.findOneAndUpdate(
    { competitionCode: "CYBERSAFE2026" },
    { competitionName: "CyberSafe Challenge 2026", competitionCode: "CYBERSAFE2026", startDate: new Date(), endDate: new Date(Date.now() + 86400000), duration: 60, status: "active", maximumParticipants: 1000 },
    { upsert: true, new: true, setDefaultsOnInsert: true }
);
console.log("Competition CYBERSAFE2026 is active.");
process.exit(0);
