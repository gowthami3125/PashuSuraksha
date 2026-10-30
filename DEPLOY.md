# PashuSuraksha — Production Deployment Guide (DEPLOY.md)

This document provides exact, click-by-click instructions for deploying the **PashuSuraksha** system across free-tier production cloud services (Vercel + Render + Neon PostgreSQL), as well as 1-command local containerized startup with Docker Compose.

---

## 1. Architecture Overview

```
                                  +-------------------------------------+
                                  |     Vercel / Netlify (Frontend)     |
                                  |    React 19 + Vite + Tailwind v4    |
                                  +------------------+------------------+
                                                     |
                                                     | HTTPS / WSS
                                                     v
+-------------------------------+ +------------------+------------------+
|     Open-Meteo Weather API    |<+      Render / Railway (Backend)     |
|   (Free, Live, No Key Req)    | |  Express REST + Socket.io WebRTC    |
+-------------------------------+ +------------------+------------------+
                                                     |
                                                     | PostgreSQL SSL
                                                     v
                                  +------------------+------------------+
                                  |        Neon / Supabase DB           |
                                  |     Relational Animal Health DB     |
                                  +-------------------------------------+
```

---

## 2. Step 1: Database Setup (Neon PostgreSQL)

1. Navigate to [Neon](https://neon.tech/) and create a free account.
2. Click **Create Project**, name it `pashusuraksha-db`, and choose AWS region `ap-south-1 (Mumbai)` or `eu-central-1`.
3. In the project dashboard, copy the **Connection string**:
   ```
   postgresql://username:password@ep-sample-123.ap-south-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this string for the `DATABASE_URL` environment variable.

---

## 3. Step 2: Backend Deployment (Render)

1. Push your repository to GitHub or GitLab.
2. Sign in to [Render](https://render.com/).
3. Click **New +** → **Web Service**.
4. Connect your repository and select the **Free** instance type.
5. Configure service settings:
   * **Name**: `pashusuraksha-backend`
   * **Root Directory**: `backend`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
6. Add the following **Environment Variables** in the Render dashboard:

| Variable Name | Value | Purpose |
|---|---|---|
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `5000` | Backend listening port |
| `DATABASE_URL` | *(Pasted from Step 1)* | Database connection |
| `JWT_SECRET` | *(Generate via `npm run generate-secrets`)* | Token encryption |
| `FRONTEND_URL` | `https://pashusuraksha.vercel.app` | Allowed web frontend |
| `ALLOWED_ORIGINS` | `https://pashusuraksha.vercel.app,http://localhost:5173` | Allowed CORS origins |
| `OTP_MODE` | `mock` | SMS OTP driver (mock for demo) |
| `DEMO_MODE` | `true` | Pre-seed test records |
| `STORAGE_MODE` | `local` | Upload storage mode |
| `AI_SERVICE` | `mock` | Fallback AI adapter mode |
| `AI_API_KEY` | *(Optional Gemini Key)* | Google AI Studio Key |
| `JITSI_BASE_URL` | `https://meet.jit.si` | Tele-consultation video host |

7. Click **Deploy Web Service**.
8. Once built, copy your backend URL (e.g., `https://pashusuraksha-backend.onrender.com`).

---

## 4. Step 3: Frontend Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com/) and click **Add New...** → **Project**.
2. Select your repository.
3. Configure project settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `./`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Add the **Environment Variable**:
   * `VITE_API_URL` = `https://pashusuraksha-backend.onrender.com`
5. Click **Deploy**.
6. The `vercel.json` included in the root directory ensures all single-page routes (`/triage`, `/outbreak`, `/surveillance`, `/vets`, `/guide`, `/history`, `/model-card`, `/vet/queue`, `/vet/consultations`) rewrite correctly to `index.html`.

---

## 5. Step 4: Interconnect & Verification

1. In your Render backend dashboard, ensure `FRONTEND_URL` matches your official Vercel domain (e.g., `https://pashusuraksha.vercel.app`).
2. Verify backend health endpoint in browser:
   ```
   https://pashusuraksha-backend.onrender.com/api/health
   ```
   Expected response:
   ```json
   {
     "status": "ONLINE",
     "system": "PashuSuraksha Backend Engine & Tele-Consultation Hub"
   }
   ```
3. Open your frontend web app and conduct the verification checklist below.

---

## 6. Verification Checklist

- [ ] **Health Endpoint**: Backend returns `{"status": "ONLINE"}` at `/api/health`.
- [ ] **Farmer Pre-Triage**: Navigate to `/triage`, select an animal and symptoms, and complete the 4-step wizard.
- [ ] **AI Lesion Check**: In camera modal or Step 4 review, click **Run AI Lesion Check** and verify the mandatory `AI suggestion — a vet will confirm` banner.
- [ ] **Server-Side PDF**: In `/results` or `/history`, click **Download Official Clinical Triage Report (PDF)**.
- [ ] **Doctor Queue**: Navigate to `/vet/queue`, inspect incoming cases, and click **Inspect Lesion Photo**.
- [ ] **Tele-Consultation**: Navigate to `/vet/consultations` and start a video consultation.
- [ ] **Surveillance & Spread Chain**: Check `/outbreak` and `/surveillance` for real-time district statistics and disease progression chains.
- [ ] **Multilingual & Text Sizing**: Switch languages (`EN`, `MR`, `HI`, `TE`) and text scaling (`A-`, `A`, `A+`) in utility bar.

---

## 7. 1-Command Local Startup (Docker Compose)

For offline development or containerized demonstrations without cloud dependencies:

```bash
# 1. Clone repository
git clone <repo-url>
cd pashusuraksha

# 2. Build and start containers
docker-compose up --build
```

Access locally:
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)
* **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 8. Free-Tier Production Warnings

* **Render Spin-Down**: Free Render web services spin down after 15 minutes of inactivity. The initial cold start may take 30–50 seconds.
* **Ephemeral Disk**: Local file uploads on free containers reset on instance restarts. For heavy multi-user production, set `STORAGE_MODE=cloud`.
* **HTTPS Requirement**: Camera access, microphone recording, geolocation, and Web Push notifications strictly require HTTPS (provided automatically by Vercel and Render).
