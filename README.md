# CyberSafe Challenge

A cybersecurity awareness competition platform with a safe phishing-login simulation, interactive quiz, scenario lab, leaderboard, and administrator reporting.

## Pages

- `index.html` - landing dashboard and training path
- `login.html` - safe fake-login awareness simulation
- `quiz.html` - 15-question cybersecurity quiz
- `scenario.html` - scenario-based decision lab with XP and badges
- `scenario-result.html` - cyber readiness report for the scenario lab
- `score.html` - score summary and completion certificate
- `tips.html` - practical cybersecurity defense checklist

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set a working `MONGODB_URI` plus secure admin credentials. Registration cannot save participant data until MongoDB is configured.
2. In `backend`, run `npm install`.
3. Start the application from the `backend` folder with `npm start`, then open `http://localhost:5000` (do not open the HTML file directly or use a separate Live Server port). The backend automatically creates the active event and anonymous player sessions.

The frontend is served by Express so registration, results, certificates, leaderboard, and admin reporting can use the API.
