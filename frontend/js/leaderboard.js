const leaderboardBody = document.getElementById("leaderboardBody");
const leaderboardMessage = document.getElementById("leaderboardMessage");

async function loadLeaderboard() {
    try {
        const { leaderboard } = await CyberSafe.apiRequest("/leaderboard");
        leaderboardBody.innerHTML = leaderboard.map((entry) => `<tr><td>${entry.rank}</td><td>${entry.participantName}</td><td>${entry.score}</td><td>${entry.percentage}%</td><td>${Math.round(entry.timeTaken)}s</td><td>${entry.badge}</td></tr>`).join("");
        leaderboardBody.classList.remove("fade-in");
        void leaderboardBody.offsetWidth;
        leaderboardBody.classList.add("fade-in");
        if (!leaderboard.length) leaderboardMessage.textContent = "No completed quiz results yet.";
    } catch (error) { leaderboardMessage.textContent = error.message; leaderboardMessage.className = "form-message error"; }
}
loadLeaderboard();
