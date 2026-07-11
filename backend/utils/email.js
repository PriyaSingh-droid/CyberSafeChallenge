import nodemailer from "nodemailer";

export async function sendCompletionEmail(participant, result, certificate) {
    if (process.env.MAIL_ENABLED !== "true") return;
    const transporter = nodemailer.createTransport({ host: process.env.MAIL_HOST, port: Number(process.env.MAIL_PORT || 587), secure: false, auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD } });
    await transporter.sendMail({ from: process.env.MAIL_FROM, to: participant.email, subject: "Your CyberSafe Challenge result", text: `Thank you for participating. Score: ${result.score}/${result.totalQuestions} (${result.percentage}%). Certificate: ${certificate.certificateNumber}.` });
}
