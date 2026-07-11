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

## Deploy on Render

1. Push this project to GitHub.
2. Open Render and click `New +` then `Web Service`.
3. Connect your GitHub account and select this repository.
4. Set `Root Directory` to `backend`.
5. Set `Build Command` to `npm install`.
6. Set `Start Command` to `npm start`.
7. Add these environment variables in Render:
   - `PORT=5000`
   - `MONGODB_URI=your_mongodb_atlas_connection_string`
   - `CLIENT_ORIGIN=your_render_service_url`
   - `ADMIN_USERNAME=admin`
   - `ADMIN_PASSWORD=strong-password`
   - `JWT_SECRET=long-random-secret`
8. Click `Create Web Service` and wait for the deploy to finish.
9. Open the Render service URL to use the app.

Notes:

- Use MongoDB Atlas for `MONGODB_URI`; do not use a local MongoDB path for production.
- Open the app from the Render URL, not by opening `frontend/index.html` directly.
- If you change the Render URL later, update `CLIENT_ORIGIN` too.
