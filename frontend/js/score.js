const score = Number(localStorage.getItem("score") || 0);
const total = Number(localStorage.getItem("total") || 15);
const percent = total ? Math.round((score / total) * 100) : 0;

const scoreRing = document.getElementById("scoreRing");
const scorePercent = document.getElementById("scorePercent");
const scoreTitle = document.getElementById("scoreTitle");
const scoreMessage = document.getElementById("scoreMessage");
const certScore = document.getElementById("certScore");
const certDate = document.getElementById("certDate");
const retryBtn = document.getElementById("retryBtn");
const certParticipant = document.getElementById("certParticipant");
const certNumber = document.getElementById("certNumber");

let title = "Strong foundation";
let message = "You understand several core safety habits. Review the guide to make those habits automatic.";

if (percent >= 85) {
    title = "Excellent cyber instincts";
    message = "Great work. You spotted the major risks and are ready to coach others on the basics.";
} else if (percent >= 60) {
    title = "Good progress";
    message = "You are on the right path. Revisit phishing signs, public Wi-Fi safety, and MFA habits.";
} else {
    title = "Needs more practice";
    message = "That is exactly why this lab exists. Review the guide, retake the quiz, and focus on the warning signs.";
}

scorePercent.textContent = `${percent}%`;
scoreRing.style.setProperty("--score", `${percent * 3.6}deg`);
scoreTitle.textContent = title;
scoreMessage.textContent = message;
certScore.textContent = `Score: ${score}/${total}`;

const completedAt = localStorage.getItem("cybersafeCompletedAt");
if (completedAt) {
    certDate.textContent = `Completed: ${new Date(completedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}`;
}

retryBtn.addEventListener("click", () => {
    localStorage.removeItem("score");
    localStorage.removeItem("total");
    localStorage.removeItem("cybersafeAnswers");
    localStorage.removeItem("cybersafeCompletedAt");
    window.location.href = "quiz.html";
});

async function loadCertificateDetails() {
    const session = CyberSafe.getParticipantSession();
    if (!session) return;
    try {
        const [{ participant }, { certificate }] = await Promise.all([
            CyberSafe.apiRequest(`/participant/${session._id}`),
            CyberSafe.apiRequest(`/participant/${session._id}/certificate`)
        ]);
        certParticipant.textContent = participant.fullName;
        certNumber.textContent = `Certificate: ${certificate.certificateNumber}`;
    } catch (error) {
        certParticipant.textContent = session.fullName;
    }
}
loadCertificateDetails();
