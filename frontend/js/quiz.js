const quiz = [
    {
        category: "Passwords",
        question: "Which password is the strongest?",
        answers: ["password123", "12345678", "C@tBlue!River2026", "qwerty"],
        correct: 2,
        hint: "Length plus mixed character types is stronger than common words or sequences."
    },
    {
        category: "Web Safety",
        question: "What does HTTPS mainly provide?",
        answers: ["Encrypted connection", "Automatic virus protection", "Free internet", "A built-in firewall"],
        correct: 0,
        hint: "HTTPS protects data in transit, but it does not prove a site is honest."
    },
    {
        category: "Phishing",
        question: "Which one is most likely a phishing website?",
        answers: ["https://google.com", "https://amaz0n-login.com", "https://github.com", "https://microsoft.com"],
        correct: 1,
        hint: "Attackers often swap letters for numbers or add urgent login words."
    },
    {
        category: "Account Security",
        question: "Which is an example of multi-factor authentication?",
        answers: ["Password only", "Password plus one-time code", "Username only", "PIN only"],
        correct: 1,
        hint: "MFA combines something you know with something you have or are."
    },
    {
        category: "Email Safety",
        question: "Before opening an unknown attachment, you should first:",
        answers: ["Open it immediately", "Forward it to friends", "Verify the sender and scan it", "Disable your browser"],
        correct: 2,
        hint: "Unexpected attachments can carry malware even when the message looks familiar."
    },
    {
        category: "Networks",
        question: "Which protocol is secure for browsing?",
        answers: ["HTTP", "HTTPS", "FTP", "Telnet"],
        correct: 1,
        hint: "The S means the browser connection is encrypted."
    },
    {
        category: "Web Safety",
        question: "What should you check before logging into a website?",
        answers: ["The website URL", "The lock indicator", "The HTTPS connection", "All of these"],
        correct: 3,
        hint: "A safe decision usually combines multiple signals."
    },
    {
        category: "Malware",
        question: "Which one is a type of malware?",
        answers: ["Spreadsheet", "Ransomware", "Web browser", "Image editor"],
        correct: 1,
        hint: "Ransomware locks or steals data and demands payment."
    },
    {
        category: "Phishing",
        question: "What is phishing?",
        answers: ["A fishing game", "Stealing information using deceptive messages or sites", "A firewall mode", "A backup method"],
        correct: 1,
        hint: "Phishing is social engineering plus a technical-looking lure."
    },
    {
        category: "Networks",
        question: "Public Wi-Fi should be used carefully because:",
        answers: ["It may be insecure or monitored", "It is always faster", "It gives free antivirus", "It blocks all attackers"],
        correct: 0,
        hint: "Avoid sensitive tasks on unknown networks unless protections are in place."
    },
    {
        category: "Defensive Tools",
        question: "A firewall is mainly used to:",
        answers: ["Cook food", "Filter network traffic", "Charge a laptop", "Store passwords"],
        correct: 1,
        hint: "Firewalls enforce rules about what traffic is allowed."
    },
    {
        category: "Passwords",
        question: "Strong passwords should contain:",
        answers: ["Only numbers", "Only letters", "Letters, numbers, symbols, and enough length", "Only your name"],
        correct: 2,
        hint: "Uniqueness matters too: do not reuse passwords across accounts."
    },
    {
        category: "Scams",
        question: "A bank asks for your OTP through an unknown chat number. What is most likely happening?",
        answers: ["Normal bank support", "A scam attempt", "A software update", "A password manager check"],
        correct: 1,
        hint: "Legitimate services should not ask you to share OTPs with a person."
    },
    {
        category: "Malware",
        question: "Which file extension is commonly executable on Windows?",
        answers: [".jpg", ".exe", ".png", ".mp3"],
        correct: 1,
        hint: "Executable files can run code, so handle unexpected ones carefully."
    },
    {
        category: "Cybersecurity",
        question: "Cybersecurity mainly focuses on:",
        answers: ["Protecting systems, accounts, and data", "Making games", "Editing photos", "Watching videos"],
        correct: 0,
        hint: "The goal is confidentiality, integrity, availability, and user safety."
    }
];

let currentQuestion = 0;
const participantSession = CyberSafe.startAnonymousSession();
// Keep answers only for the current quiz attempt. A refreshed or newly opened
// quiz always begins with every option unselected.
const selected = Array(quiz.length).fill(undefined);
localStorage.removeItem("cybersafeAnswers");
const quizStartedAt = Number(sessionStorage.getItem("cybersafeQuizStartedAt")) || Date.now();
sessionStorage.setItem("cybersafeQuizStartedAt", quizStartedAt);

const question = document.getElementById("question");
const answers = document.getElementById("answers");
const next = document.getElementById("nextBtn");
const prev = document.getElementById("prevBtn");
const progress = document.getElementById("progressBar");
const qno = document.getElementById("questionNumber");
const categoryLabel = document.getElementById("categoryLabel");
const answeredCount = document.getElementById("answeredCount");
const remainingCount = document.getElementById("remainingCount");

function calculateScore() {
    return quiz.reduce((total, item, index) => total + (selected[index] === item.correct ? 1 : 0), 0);
}

function updateStats() {
    const answered = selected.filter((answer) => answer !== null && answer !== undefined).length;
    answeredCount.textContent = answered;
    remainingCount.textContent = quiz.length - answered;
}

function loadQuestion() {
    const item = quiz[currentQuestion];
    qno.textContent = `Question ${currentQuestion + 1} of ${quiz.length}`;
    categoryLabel.textContent = item.category;
    progress.style.width = `${((currentQuestion + 1) / quiz.length) * 100}%`;
    question.textContent = item.question;
    answers.innerHTML = "";

    item.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer";
        button.setAttribute("aria-pressed", selected[currentQuestion] === index ? "true" : "false");
        button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span><strong>${answer}</strong>`;
        button.addEventListener("click", () => {
            selected[currentQuestion] = index;
            loadQuestion();
        });
        answers.appendChild(button);
    });

    prev.disabled = currentQuestion === 0;
    next.textContent = currentQuestion === quiz.length - 1 ? "Submit" : "Next";
    updateStats();
}

next.addEventListener("click", async () => {
    if (selected[currentQuestion] === undefined) {
        return;
    }

    if (currentQuestion < quiz.length - 1) {
        currentQuestion += 1;
        loadQuestion();
        return;
    }

    const score = calculateScore();
    const timeTaken = Math.round((Date.now() - quizStartedAt) / 1000);
    next.disabled = true;
    try {
        const participant = await participantSession;
        const { result, certificate } = await CyberSafe.apiRequest("/quiz/submit", { method: "POST", body: JSON.stringify({ participantId: participant._id, score, totalQuestions: quiz.length, timeTaken }) });
        // The complete result and certificate are persisted by the API; only the
        // score display values are kept locally for the existing score screen.
    } catch (error) {
        alert(`Your result could not be submitted: ${error.message}`);
        next.disabled = false;
        return;
    }
    localStorage.setItem("score", score);
    localStorage.setItem("total", quiz.length);
    localStorage.setItem("cybersafeCompletedAt", new Date().toISOString());
    sessionStorage.removeItem("cybersafeQuizStartedAt");
    window.location.href = "score.html";
});

prev.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion -= 1;
        loadQuestion();
    }
});

loadQuestion();
