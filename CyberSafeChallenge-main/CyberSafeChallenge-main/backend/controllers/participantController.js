import Competition from "../models/Competition.js";
import Certificate from "../models/Certificate.js";
import Participant from "../models/Participant.js";

export async function joinCompetition(req, res, next) {
    try {
        const {
            fullName,
            email,
            phone,
            college = "",
            course = ""
        } = req.body;

        if (!fullName || !email || !phone) {
            return res.status(400).json({
                message: "Full name, email and phone are required."
            });
        }

        const competition = await Competition.findOne({
            status: "active"
        });

        if (!competition) {
            return res.status(404).json({
                message: "No active competition is available right now."
            });
        }

        const participant = await Participant.create({
            fullName,
            email,
            phone,
            college,
            course,
            competitionCode: competition.competitionCode
        });

        return res.status(201).json({
            success: true,
            message: "Competition Joined Successfully.",
            participantId: participant._id,
            participant
        });

    } catch (error) {
        next(error);
    }
}

export async function createAnonymousSession(req, res, next) {

    try {

        const competition = await Competition.findOne({
            status: "active"
        });

        if (!competition) {
            return res.status(404).json({
                message: "No active competition found."
            });
        }

        const participant = await Participant.create({

            fullName: "Guest User",

            email: `guest${Date.now()}@cybersafe.com`,

            phone: `${Date.now()}`,

            college: "",

            course: "",

            competitionCode: competition.competitionCode

        });

        return res.status(201).json({

            participant

        });

    }

    catch (error) {

        next(error);

    }

}

export async function getParticipant(req, res, next) {

    try {

        const participant = await Participant.findById(req.params.id);

        if (!participant) {

            return res.status(404).json({

                message: "Participant not found."

            });

        }

        return res.json({

            participant

        });

    }

    catch (error) {

        next(error);

    }

}

export async function getParticipantCertificate(req, res, next) {
    try {
        const certificate = await Certificate.findOne({ participantId: req.params.id }).lean();

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate not found."
            });
        }

        return res.json({
            certificate
        });
    } catch (error) {
        next(error);
    }
}
