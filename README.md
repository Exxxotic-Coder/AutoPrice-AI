# AutoPrice AI

Predict a used car's market value from its specs, with an explanation of
*why* the model landed on that number. Built as a three-service MERN + Python
app: React frontend, Express/MongoDB backend, and a FastAPI microservice
wrapping the XGBoost model from the original notebook.

## Architecture

```
┌─────────────┐        ┌──────────────────┐        ┌────────────────────┐
│   React     │  REST  │  Express API      │  REST  │  FastAPI ML svc    │
│  (Vite)     ├───────►│  (Node.js)         ├───────►│  (XGBoost model)   │
│  :5173      │        │  :5000             │        │  :8000             │
└─────────────┘        └─────────┬──────────┘        └────────────────────┘
                                  │
                                  ▼
                          ┌──────────────┐
                          │  MongoDB      │
                          │  Users +      │
                          │  Predictions  │
                          └──────────────┘
```

- **ml-service/** — FastAPI app. Loads the trained XGBoost model once at
  startup, exposes `/predict`, `/compare`, `/metadata`, `/health`. No
  knowledge of users or auth — the Express backend is its only client.
- **backend/** — Express + MongoDB (Mongoose). Handles JWT auth, proxies
  prediction requests to the ML service, persists prediction history,
  favorites, dashboard aggregation, and PDF report generation.
- **frontend/** — React (Vite). Landing page, predict form, compare view,
  login/register, history, dashboard with charts, dark mode.

The dataset (`ml-service/data/cars_data.csv`) is the classic 428-row
`sashelp.cars` set — the same columns your notebook used (Make, Model, Type,
Origin, DriveTrain, MSRP, Invoice, EngineSize, Cylinders, Horsepower,
MPG_City, MPG_Highway, Weight, Wheelbase, Length). If you have your own
`cars_data.csv`, drop it in that folder (same column names) and re-run
`train_model.py` — everything downstream (dropdowns, ranges, model) picks it
up automatically.

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ and pip
- A MongoDB connection string — either:
  - **MongoDB Atlas** (free tier, no local install needed) — recommended
    since you don't want Docker, or
  - a local `mongod` if you already have MongoDB installed

## 1. ML service (FastAPI)

```bash
cd ml-service
python3 -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt

# (Re)train the model - only needed once, or after changing the dataset
python train_model.py

# Run the API
uvicorn main:app --reload --port 8000
```

Verify: `curl http://localhost:8000/health` → `{"status":"ok","modelLoaded":true}`

## 2. Backend (Express)

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI to your Atlas connection string (or local mongod),
# and set JWT_SECRET to any long random string
npm install
npm run dev
```

Verify: `curl http://localhost:5000/api/health` → `{"status":"ok"}`

## 3. Frontend (React)

```bash
cd frontend
cp .env.example .env   # VITE_API_URL already points at localhost:5000/api
npm install
npm run dev
```

Open `http://localhost:5173`. Register an account, then head to **Predict**.

Run all three at once in three terminals, in this order: ML service →
backend → frontend (the backend needs the ML service reachable, and the
frontend needs the backend reachable).

## Deploying (no Docker, no Kubernetes)

Three independent deploys, wired together with environment variables. Free
tiers work fine for a student project.

### Step 1 — Database: MongoDB Atlas
1. Create a free cluster at mongodb.com/atlas.
2. Add a database user, and allow access from anywhere (0.0.0.0/0) under
   Network Access — simplest option while you're getting started.
3. Copy the connection string; you'll use it as `MONGO_URI`.

### Step 2 — ML service: Render (Web Service, Python)
1. Push this repo to GitHub.
2. On Render: **New → Web Service**, point it at the `ml-service/` folder
   (set "Root Directory" to `ml-service`).
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add an env var `ALLOWED_ORIGINS` = your backend's URL (set this after
   step 3, once you know it — Render lets you edit env vars any time).
6. Deploy. Note the resulting URL, e.g. `https://autoprice-ml.onrender.com`.

   Render's free tier spins down when idle, so the first request after a
   quiet period takes a few extra seconds — normal, not a bug.

### Step 3 — Backend: Render (Web Service, Node)
1. **New → Web Service**, root directory `backend`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Env vars: `MONGO_URI` (from Atlas), `JWT_SECRET` (any long random
   string), `ML_SERVICE_URL` (the URL from Step 2), `ALLOWED_ORIGINS` (your
   frontend's URL, filled in after Step 4), `NODE_ENV=production`.
5. Deploy. Note the URL, e.g. `https://autoprice-backend.onrender.com`.
6. Go back to the ML service's `ALLOWED_ORIGINS` env var if needed — it
   should match the backend's origin (only the backend calls it directly).

### Step 4 — Frontend: Vercel
1. Import the repo on vercel.com, set root directory to `frontend`.
2. Framework preset: Vite. Build command `npm run build`, output `dist`.
3. Env var: `VITE_API_URL` = `https://autoprice-backend.onrender.com/api`
4. Deploy. Then go back to the backend's `ALLOWED_ORIGINS` env var on
   Render and set it to this Vercel URL, and redeploy the backend so CORS
   allows it.

That's the whole chain: Vercel (frontend) → Render (backend) → Render (ML
service) → Atlas (database). Nothing here needs Docker or Kubernetes —
each platform builds straight from source using the commands above.

## Project structure

```
autoprice-ai/
├── ml-service/
│   ├── data/cars_data.csv
│   ├── model/              # generated by train_model.py
│   ├── train_model.py
│   ├── explain.py
│   ├── main.py
│   └── requirements.txt
├── backend/
│   └── src/
│       ├── config/db.js
│       ├── models/{User,Prediction}.js
│       ├── middleware/auth.js
│       ├── controllers/
│       ├── routes/
│       ├── services/mlClient.js
│       └── server.js
└── frontend/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        └── App.jsx
```

## API reference

| Method | Route                       | Auth | Description |
|--------|------------------------------|------|-------------|
| POST   | `/api/auth/register`         | –    | Create account |
| POST   | `/api/auth/login`            | –    | Log in, get JWT |
| GET    | `/api/metadata`               | –    | Dropdown options + numeric ranges |
| POST   | `/api/predict`                | ✓    | Predict price, saves to history |
| POST   | `/api/compare`                | ✓    | Predict two cars at once |
| GET    | `/api/history`                | ✓    | List your predictions (`?favoritesOnly=true`) |
| PATCH  | `/api/history/:id/favorite`   | ✓    | Toggle favorite |
| DELETE | `/api/history/:id`            | ✓    | Delete a prediction |
| GET    | `/api/dashboard`               | ✓    | Aggregated stats + chart data |
| GET    | `/api/report/:id`              | ✓    | Download a PDF valuation report |

## Notes on the model

- Trained with `XGBRegressor` on the same cleaning/one-hot pipeline as your
  notebook (drop `Invoice`, one-hot `Make`/`Model`/`Type`/`Origin`/
  `DriveTrain`). Current test-set metrics: **R² ≈ 0.87, MAE ≈ $4.3K**
  (printed again whenever you re-run `train_model.py`, saved to
  `model/metrics.json`).
- The "why this price" explanation is a lightweight heuristic (feature
  importance × z-score vs. the training mean), not SHAP — good enough for
  directionally honest bullet points without adding a heavy dependency. If
  you later want real SHAP values, swap the logic in `ml-service/explain.py`.
- If a user picks a Model your dataset has never seen, the model still
  predicts fine — it just won't get any Model-specific signal, only the
  Make/Type/Origin/DriveTrain/numeric specs.
