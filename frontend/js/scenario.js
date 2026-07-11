const scenarios = [
    {
        title: "Fake Internship Email",
        story: [
            "You receive an email claiming you have been selected for a cybersecurity internship.",
            "Sender: careers@google-careers-job.example",
            "Subject: Congratulations! Complete verification within 30 minutes."
        ],
        choices: [
            "Click immediately.",
            "Verify the sender and visit the company's official careers website.",
            "Forward it to friends.",
            "Ignore everything forever."
        ],
        correct: 1,
        topic: "phishing emails",
        safeReason: "Always verify internship opportunities through the official company website before entering information.",
        attackerReason: "Attackers use urgency, trusted brand names, and fake domains to rush people into clicking."
    },
    {
        title: "Password Reset",
        story: [
            "You receive an unexpected password reset email for an account you use."
        ],
        choices: [
            "Click Reset Password.",
            "Ignore.",
            "Open the official website yourself and check your account.",
            "Reply to the email."
        ],
        correct: 2,
        topic: "account recovery",
        safeReason: "Opening the official website yourself avoids malicious reset links and lets you verify account activity safely.",
        attackerReason: "Reset emails create anxiety and can route victims to credential-stealing pages."
    },
    {
        title: "QR Code Scam",
        story: [
            "You see a poster offering free Wi-Fi with a QR code."
        ],
        choices: [
            "Scan immediately.",
            "Preview where the QR code leads before opening it.",
            "Share it with friends.",
            "Ignore all QR codes forever."
        ],
        correct: 1,
        topic: "QR code safety",
        safeReason: "Previewing the destination helps you avoid hidden phishing links or malicious downloads.",
        attackerReason: "QR codes hide the destination until after the user scans, reducing healthy suspicion."
    },
    {
        title: "Unknown USB",
        story: [
            "You find a USB drive labelled Final Year Project outside your classroom."
        ],
        choices: [
            "Plug it into your laptop.",
            "Throw it away.",
            "Hand it to IT or test it only in an isolated environment.",
            "Take it home."
        ],
        correct: 2,
        topic: "unknown devices",
        safeReason: "IT teams can inspect unknown devices safely without exposing your personal machine.",
        attackerReason: "Dropped USB attacks exploit curiosity and can run malware when connected."
    },
    {
        title: "Public Wi-Fi",
        story: [
            "You are connected to free airport Wi-Fi."
        ],
        choices: [
            "Open banking.",
            "Login to work email.",
            "Use a VPN or avoid sensitive activities.",
            "Download random software."
        ],
        correct: 2,
        topic: "public Wi-Fi",
        safeReason: "A VPN and avoiding sensitive tasks reduce exposure on networks you do not control.",
        attackerReason: "Public networks can be spoofed or monitored to capture traffic and session data."
    },
    {
        title: "OTP Scam",
        story: [
            "Someone claiming to be from your bank asks for your OTP."
        ],
        choices: [
            "Share the OTP.",
            "Hang up.",
            "Call the official customer support number.",
            "Both B and C."
        ],
        correct: 3,
        topic: "OTP scams",
        safeReason: "Ending the call and contacting the official number protects you from impersonation.",
        attackerReason: "Attackers need the OTP to complete a login, payment, or account takeover in real time."
    },
    {
        title: "Fake Software Update",
        story: [
            "A popup appears saying:",
            "Adobe Flash Player",
            "Update Required",
            "Install Now"
        ],
        choices: [
            "Install immediately.",
            "Close the popup.",
            "Download updates only from the official vendor website.",
            "Both B and C."
        ],
        correct: 3,
        topic: "fake software updates",
        safeReason: "Closing the popup and using official vendor sources prevents malware disguised as updates.",
        attackerReason: "Fake update prompts exploit trust in familiar software names and urgent maintenance messages."
    }
];

const XP_PER_CORRECT = 20;
let currentScenario = Number(localStorage.getItem("scenarioCurrent") || 0);
let xp = Number(localStorage.getItem("scenarioXp") || 0);
let completed = JSON.parse(localStorage.getItem("scenarioCompleted") || "[]");
let results = JSON.parse(localStorage.getItem("scenarioResults") || "[]");
let selectedThisRound = null;

const scenarioProgress = document.getElementById("scenarioProgress");
const xpCounter = document.getElementById("xpCounter");
const badgeLabel = document.getElementById("badgeLabel");
const scenarioNumber = document.getElementById("scenarioNumber");
const scenarioBadge = document.getElementById("scenarioBadge");
const scenarioProgressBar = document.getElementById("scenarioProgressBar");
const scenarioTitle = document.getElementById("scenarioTitle");
const scenarioStory = document.getElementById("scenarioStory");
const scenarioChoices = document.getElementById("scenarioChoices");
const explanationCard = document.getElementById("explanationCard");
const feedbackTitle = document.getElementById("feedbackTitle");
const safeReason = document.getElementById("safeReason");
const attackerReason = document.getElementById("attackerReason");
const nextScenarioBtn = document.getElementById("nextScenarioBtn");

function getBadge(value) {
    if (value >= 140) return "Cyber Guardian";
    if (value >= 120) return "Cyber Analyst";
    if (value >= 80) return "Cyber Defender";
    if (value >= 40) return "Security Learner";
    return "Cyber Rookie";
}

function saveProgress() {
    localStorage.setItem("scenarioCurrent", currentScenario);
    localStorage.setItem("scenarioXp", xp);
    localStorage.setItem("scenarioCompleted", JSON.stringify(completed));
    localStorage.setItem("scenarioResults", JSON.stringify(results));
    localStorage.setItem("scenarioBadge", getBadge(xp));
}

function animateXp(start, end) {
    const duration = 420;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.round(start + (end - start) * progress);
        xpCounter.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

function updateSummary(previousXp = xp) {
    const badge = getBadge(xp);
    scenarioProgress.textContent = `Scenario ${currentScenario + 1} of ${scenarios.length}`;
    scenarioNumber.textContent = `Scenario ${currentScenario + 1} of ${scenarios.length}`;
    badgeLabel.textContent = badge;
    scenarioBadge.textContent = badge;
    scenarioProgressBar.style.width = `${((currentScenario + 1) / scenarios.length) * 100}%`;
    animateXp(previousXp, xp);
}

function renderScenario() {
    const scenario = scenarios[currentScenario];
    const storedResult = results[currentScenario];
    selectedThisRound = null;
    scenarioTitle.textContent = scenario.title;
    scenarioStory.innerHTML = "";
    scenarioChoices.innerHTML = "";
    explanationCard.hidden = true;
    explanationCard.classList.remove("success", "failure");
    nextScenarioBtn.disabled = true;
    nextScenarioBtn.textContent = currentScenario === scenarios.length - 1 ? "View Report" : "Next";

    scenario.story.forEach((line) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = line;
        scenarioStory.appendChild(paragraph);
    });

    scenario.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer scenario-choice";
        button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span><strong>${choice}</strong>`;
        button.addEventListener("click", () => selectChoice(index));
        scenarioChoices.appendChild(button);
    });

    if (storedResult) {
        selectedThisRound = storedResult.selected;
        [...scenarioChoices.children].forEach((choiceButton, choiceIndex) => {
            choiceButton.disabled = true;
            if (choiceIndex === scenario.correct) {
                choiceButton.classList.add("correct");
            } else if (choiceIndex === storedResult.selected) {
                choiceButton.classList.add("incorrect");
            }
        });

        feedbackTitle.textContent = storedResult.isCorrect ? "Correct decision. Threat avoided." : "Risky decision. Review the safer response.";
        safeReason.textContent = scenario.safeReason;
        attackerReason.textContent = scenario.attackerReason;
        explanationCard.hidden = false;
        explanationCard.classList.add(storedResult.isCorrect ? "success" : "failure");
        nextScenarioBtn.disabled = false;
    }

    updateSummary();
}

function selectChoice(index) {
    if (selectedThisRound !== null) return;

    selectedThisRound = index;
    const scenario = scenarios[currentScenario];
    const isCorrect = index === scenario.correct;
    const previousXp = xp;

    if (isCorrect) {
        xp += XP_PER_CORRECT;
    }

    completed[currentScenario] = true;
    results[currentScenario] = {
        title: scenario.title,
        topic: scenario.topic,
        selected: index,
        correct: scenario.correct,
        isCorrect
    };

    [...scenarioChoices.children].forEach((choiceButton, choiceIndex) => {
        choiceButton.disabled = true;
        if (choiceIndex === scenario.correct) {
            choiceButton.classList.add("correct");
        } else if (choiceIndex === index) {
            choiceButton.classList.add("incorrect");
        }
    });

    feedbackTitle.textContent = isCorrect ? "Correct decision. Threat avoided." : "Risky decision. Review the safer response.";
    safeReason.textContent = scenario.safeReason;
    attackerReason.textContent = scenario.attackerReason;
    explanationCard.hidden = false;
    explanationCard.classList.add(isCorrect ? "success" : "failure");
    nextScenarioBtn.disabled = false;

    saveProgress();
    updateSummary(previousXp);
}

async function finishScenarioLab() {
    const threatsAvoided = results.filter((result) => result && result.isCorrect).length;
    const accuracy = Math.round((threatsAvoided / scenarios.length) * 100);
    const incorrectTopics = results
        .filter((result) => result && !result.isCorrect)
        .map((result) => result.topic);

    localStorage.setItem("scenarioFinalScore", threatsAvoided);
    localStorage.setItem("scenarioAccuracy", accuracy);
    localStorage.setItem("scenarioThreatsAvoided", threatsAvoided);
    localStorage.setItem("scenarioIncorrectTopics", JSON.stringify(incorrectTopics));
    localStorage.setItem("scenarioCompletedAt", new Date().toISOString());
    localStorage.setItem("scenarioBadge", getBadge(xp));
    try {
        const participant = await CyberSafe.startAnonymousSession();
        const data = await CyberSafe.apiRequest("/scenario/submit", { method: "POST", body: JSON.stringify({ participantId: participant._id, xp, correctAnswers: threatsAvoided, wrongAnswers: scenarios.length - threatsAvoided }) });
        localStorage.setItem("cybersafeScenarioResult", JSON.stringify(data.result || data));
    } catch (error) {
        alert(`Your scenario result could not be submitted: ${error.message}`);
        return;
    }
    window.location.href = "scenario-result.html";
}

nextScenarioBtn.addEventListener("click", () => {
    if (currentScenario < scenarios.length - 1) {
        currentScenario += 1;
        saveProgress();
        renderScenario();
        return;
    }

    nextScenarioBtn.disabled = true;
    finishScenarioLab();
});

if (currentScenario >= scenarios.length) {
    currentScenario = 0;
}

renderScenario();
