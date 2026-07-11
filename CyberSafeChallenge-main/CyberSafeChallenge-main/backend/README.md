# CyberSafe Challenge Backend

## Setup

1. Run `npm install` from this directory.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB Atlas connection string, including the `CyberSafeChallenge` database name.
3. Set strong `ADMIN_PASSWORD` and `JWT_SECRET` values.
4. Run `npm run seed:competition` to create the default active competition.
5. Run `npm start` (or `npm run dev` during development), then open `http://localhost:5000`.

## API checks

- `POST /api/register` registers a participant.
- `POST /api/quiz/submit` and `POST /api/scenario/submit` save results.
- `GET /api/leaderboard` returns ranked quiz results.
- `POST /api/admin/login` returns a JWT; use it as `Authorization: Bearer <token>` for admin endpoints.
- `GET /api/export` downloads `participants.xlsx` for an authenticated admin.

## Deployment

Set the same environment variables in your hosting provider, allow the deployed frontend URL in `CLIENT_ORIGIN`, and use `npm start` as the start command. Never commit a real `.env` file or MongoDB credentials.
