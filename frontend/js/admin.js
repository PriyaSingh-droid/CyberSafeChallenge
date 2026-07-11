const adminLogin = document.getElementById("adminLogin");
const adminDashboard = document.getElementById("adminDashboard");
const adminMessage = document.getElementById("adminMessage");
let adminHeaders = null;
let charts = [];

async function adminRequest(path, options = {}) {
    const response = await fetch(`/api/admin${path}`, { headers: { ...adminHeaders, ...(options.headers || {}) }, ...options });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Admin request failed.");
    return data;
}

function renderCharts(data) {
    charts.forEach((chart) => chart.destroy());
    const labels = data.scoreDistribution.map((entry) => entry.name);
    charts = [
        new Chart(document.getElementById("scoreChart"), { type: "bar", data: { labels, datasets: [{ label: "Score %", data: data.scoreDistribution.map((entry) => entry.percentage), backgroundColor: "#22c55e" }] }, options: { responsive: true } }),
        new Chart(document.getElementById("completionChart"), { type: "doughnut", data: { labels: ["Completed", "Remaining"], datasets: [{ data: [data.completedQuizzes, Math.max(data.totalParticipants - data.completedQuizzes, 0)], backgroundColor: ["#38bdf8", "#26384d"] }] }, options: { responsive: true } }),
        new Chart(document.getElementById("trendChart"), { type: "line", data: { labels: data.completionTrend.map((entry) => entry.date), datasets: [{ label: "Score %", data: data.completionTrend.map((entry) => entry.percentage), borderColor: "#22c55e", tension: 0.25 }] }, options: { responsive: true } })
    ];
}

function renderParticipants(participants) {
    document.getElementById("participantBody").innerHTML = participants.map((participant) => `<tr><td>${participant.fullName}</td><td>${participant.sessionId}</td><td>${participant.competitionCode}</td><td>${new Date(participant.registeredAt).toLocaleString()}</td></tr>`).join("");
}

async function loadDashboard() {
    const data = await adminRequest("/dashboard");
    const cards = [["Total Players", data.totalParticipants], ["Completed Quizzes", data.completedQuizzes], ["Average Score", `${data.averageScore}%`], ["Highest Score", `${data.highestScore}%`], ["Lowest Score", `${data.lowestScore}%`], ["Completion Rate", `${data.completionRate}%`]];
    document.getElementById("dashboardGrid").innerHTML = cards.map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("");
    renderCharts(data);
    const participants = await adminRequest("/participants");
    renderParticipants(participants.participants);
}

document.getElementById("adminLoginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: document.getElementById("adminUsername").value, password: document.getElementById("adminPassword").value }) });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Unable to sign in.");
        adminHeaders = { Authorization: `Bearer ${data.token}` };
        await loadDashboard();
        adminLogin.hidden = true;
        adminDashboard.hidden = false;
    } catch (error) { adminMessage.textContent = error.message; adminMessage.className = "form-message error"; }
});
document.getElementById("participantSearch").addEventListener("input", async (event) => { try { renderParticipants((await adminRequest(`/participants?q=${encodeURIComponent(event.target.value)}`)).participants); } catch (error) { console.error(error); } });
document.getElementById("exportButton").addEventListener("click", async () => { const response = await fetch("/api/admin/export", { headers: adminHeaders }); if (!response.ok) return; const url = URL.createObjectURL(await response.blob()); const link = document.createElement("a"); link.href = url; link.download = "participants.xlsx"; link.click(); URL.revokeObjectURL(url); });
