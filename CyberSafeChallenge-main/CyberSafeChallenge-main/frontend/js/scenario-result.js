const totalScenarios = 7;
const xp = Number(localStorage.getItem("scenarioXp") || 0);
const threatsAvoided = Number(localStorage.getItem("scenarioThreatsAvoided") || 0);
const accuracy = Number(localStorage.getItem("scenarioAccuracy") || 0);
const badge = localStorage.getItem("scenarioBadge") || "Cyber Rookie";
const incorrectTopics = JSON.parse(localStorage.getItem("scenarioIncorrectTopics") || "[]");

const reportRing = document.getElementById("reportRing");
const reportAccuracy = document.getElementById("reportAccuracy");
const reportBadge = document.getElementById("reportBadge");
const reportMessage = document.getElementById("reportMessage");
const reportXp = document.getElementById("reportXp");
const reportAvoided = document.getElementById("reportAvoided");
const reportBadgeMini = document.getElementById("reportBadgeMini");
const reportAccuracyMini = document.getElementById("reportAccuracyMini");
const recommendations = document.getElementById("recommendations");
const retakeScenarioBtn = document.getElementById("retakeScenarioBtn");
const downloadReportBtn = document.getElementById("downloadReportBtn");

function addRecommendation(text) {
    const item = document.createElement("li");
    item.textContent = text;
    recommendations.appendChild(item);
}

reportRing.style.setProperty("--score", `${accuracy * 3.6}deg`);
reportAccuracy.textContent = `${accuracy}%`;
reportBadge.textContent = badge;
reportXp.textContent = xp;
reportAvoided.textContent = `${threatsAvoided}/${totalScenarios}`;
reportBadgeMini.textContent = badge;
reportAccuracyMini.textContent = `${accuracy}%`;

if (accuracy >= 85) {
    reportMessage.textContent = "Excellent decision-making. You avoided most high-risk actions.";
} else if (accuracy >= 60) {
    reportMessage.textContent = "Good progress. A few scenarios still need sharper verification habits.";
} else {
    reportMessage.textContent = "Keep practicing. Focus on pausing before clicks, downloads, codes, and unknown devices.";
}

if (incorrectTopics.length === 0) {
    addRecommendation("You handled every scenario safely. Keep using the same verification habits in real life.");
} else {
    const uniqueTopics = [...new Set(incorrectTopics)];
    uniqueTopics.forEach((topic) => {
        addRecommendation(`You struggled with ${topic}. Practice identifying warning signs before taking action.`);
    });

    if (uniqueTopics.includes("phishing emails")) {
        addRecommendation("Practice identifying suspicious domains, urgent wording, and brand impersonation.");
    }

    if (uniqueTopics.includes("public Wi-Fi")) {
        addRecommendation("Avoid sensitive logins on unknown networks unless you have strong protections in place.");
    }
}

retakeScenarioBtn.addEventListener("click", () => {
    localStorage.removeItem("scenarioCurrent");
    localStorage.removeItem("scenarioXp");
    localStorage.removeItem("scenarioCompleted");
    localStorage.removeItem("scenarioResults");
    localStorage.removeItem("scenarioFinalScore");
    localStorage.removeItem("scenarioAccuracy");
    localStorage.removeItem("scenarioThreatsAvoided");
    localStorage.removeItem("scenarioIncorrectTopics");
    localStorage.removeItem("scenarioCompletedAt");
    localStorage.removeItem("scenarioBadge");
    window.location.href = "scenario.html";
});

downloadReportBtn.addEventListener("click", () => {
    window.print();
});
