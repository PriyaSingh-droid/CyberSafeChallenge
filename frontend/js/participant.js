const PARTICIPANT_STORAGE_KEY = "cybersafeParticipant";
const API_BASE_URL = "/api";

function getParticipantSession() {
    try { return JSON.parse(localStorage.getItem(PARTICIPANT_STORAGE_KEY)); } catch { return null; }
}

let sessionRequest;
async function startAnonymousSession() {
    const existing = getParticipantSession();
    if (existing?._id) return existing;
    if (!sessionRequest) {
        sessionRequest = apiRequest("/session", { method: "POST" }).then(({ participant }) => {
            localStorage.setItem(PARTICIPANT_STORAGE_KEY, JSON.stringify(participant));
            return participant;
        }).catch((error) => {
            sessionRequest = undefined;
            throw error;
        });
    }
    return sessionRequest;
}

async function apiRequest(path, options = {}) {
    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, { headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options });
    } catch {
        throw new Error("The server is unavailable. Start the backend and open the app from the deployed service or http://localhost:5000.");
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || "Your result could not be saved.");
    return payload;
}

window.CyberSafe = { getParticipantSession, startAnonymousSession, apiRequest };
