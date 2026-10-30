# PashuSuraksha — Livestock Health, Disease Advisory & Biosecurity Surveillance Portal

An enterprise-grade, offline-first digital veterinary healthcare platform designed to provide automated clinical pre-triage, vector-borne disease forewarning, AI-assisted lesion screening, and tele-consultation support for farmers, field workers, and state veterinary officers across rural and semi-urban India.

---

## 1. Key Capabilities & Features

### 👨‍🌾 Farmer Portal & Clinical Pre-Triage
* **4-Step Multilingual Report Wizard**: Mobile-first interface for reporting illness across Cattle, Buffalo, Goat, Sheep, and Poultry.
* **Intelligent Diagnostic Triage Engine**: Transparent, weighted symptom-condition matcher with red-flag escalation (blood in dung, sudden mortality, dyspnea) without unprescribed drug dosing.
* **Adaptive Voice Subsystem**: Built-in speech recognition and audio synthesized replies across English, Marathi (मराठी), Hindi (हिंदी), and Telugu (తెలుగు).
* **AI Visual Lesion Pre-Screening**: Integrated camera capture with client-side canvas compression (<200 KB) and EXIF stripping; prominently tagged with the mandatory honesty label: `AI suggestion — a vet will confirm`.
* **Case History & Server-Side PDF**: Full incident audit log with real-time status progression (`Submitted` → `AI Pre-Triaged` → `Assigned to Dispensary` → `Prescription Issued`) and official downloadable HTML/PDF reports.

### 🩺 Veterinary Officer Command Hub
* **Real-Time Patient Queue**: Priority triage sorted by clinical urgency with attached compressed lesion photos and videos.
* **WebRTC Live Tele-Consultation**: Direct browser-to-browser audio/video rooms powered by Socket.io signaling.
* **Digital Prescription (Rx) Suite**: Formal veterinary prescription authoring with dosage instructions, withdrawal periods, and biosecurity protocols.
* **Laboratory Referrals**: Diagnostic sample dispatch tracking for confirmation via ELISA, RT-PCR, and histopathology.

### 🗺️ Spatiotemporal Outbreak Surveillance & Forewarning
* **Interactive Containment Mapping**: Leaflet-based visualization showing 5 km infected quarantine rings and 10 km buffer surveillance perimeters.
* **Vector-Borne Disease Forewarning**: Live temperature, humidity, and rainfall feeds via Open-Meteo API calculating biting fly (*Stomoxys*) and midge (*Culicoides*) transmission risks.
* **Livestock Census Overlay**: Official 20th Livestock Census population statistics at district and taluka levels for Maharashtra and Andhra Pradesh.
* **Disease Spread Progression Chains**: Multi-district epidemiological transmission tracking with anomaly detection.

### ⚡ Offline Capability & Resiliency
* **Offline Outbox & Auto-Sync**: Local storage queue allowing full symptom checking, disease browsing, and report logging even in complete network dead-zones (e.g. 2G remote pastoral terrains).
* **Accessibility Scaling**: Dynamic font scaling (`A-`, `A`, `A+`) persisting across user sessions without layout shifts or text truncation.

---

## 2. Technology Stack

* **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Recharts, Leaflet.
* **Backend**: Node.js, Express, Socket.io (WebRTC signaling), Multer.
* **Machine Learning**: Scikit-Learn validation harness, Gemini Multimodal Adapter with offline mock fallback.
* **External APIs**: Open-Meteo Weather API (public, no key required), OpenStreetMap.
* **Data Sources**: 20th Livestock Census (DAHD, data.gov.in), ICAR-NIVEDI published disease compendiums.

---

## 3. Directory Structure

```
pashusuraksha/
├── backend/
│   ├── routes/              # Express API routers (triage, outbreak, vets, etc.)
│   ├── server.js            # Express server and Socket.io WebRTC gateway
│   └── package.json         # Backend dependencies
├── data/
│   ├── test_cases.csv       # 50 published ground-truth veterinary benchmark cases
│   └── vets_verified.csv    # Authenticated government veterinary dispensaries
├── docs/
│   └── MASTER_PROMPT.md     # Architectural guidelines and color system
├── ml/
│   ├── dataset.csv          # Clinical training dataset
│   └── predict_disease.py   # Python ML inference engine
├── public/                  # Public static assets
├── scripts/
│   ├── check_env.js         # Environment configuration audit tool
│   ├── generate_secrets.js  # JWT and VAPID key generator
│   └── export_test_cases.js # Test case export script
├── src/
│   ├── components/          # React components (Triage, Map, Sahayak, etc.)
│   ├── data/                # Dictionary, diseases, and census records
│   ├── services/            # Triage engine, weather, offline sync, audio speaker
│   ├── App.jsx              # Main application root and navigation router
│   ├── index.css            # Design system, color tokens, and font scaling
│   └── main.jsx             # React entry point
├── DEPLOY.md                # Cloud production deployment instructions
├── Dockerfile               # Multi-stage container definition
├── docker-compose.yml       # 1-command local container orchestrator
├── vercel.json              # Vercel SPA routing rewrites
└── package.json             # Root dependencies and scripts
```

---

## 4. Local Setup & Quick Start

### Prerequisites
* Node.js v20+ 
* Git

### Step-by-Step Installation

```bash
# 1. Clone repository
git clone <repo-url>
cd pashusuraksha

# 2. Install root and backend dependencies
npm install
cd backend && npm install && cd ..

# 3. Verify environment variables
npm run check-env

# 4. Start local development servers
# Terminal 1 (Frontend):
npm run dev

# Terminal 2 (Backend):
cd backend
node server.js
```

The application will be running at:
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 5. Seeded Demo Accounts & Testing Personas

| Role | Name | Phone Number | Default View | Sample Task |
|---|---|---|---|---|
| **Farmer** | Anandrao Patil | `9822012345` | `/triage` | Report cattle blisters; upload lesion image |
| **Vet Officer** | Dr. S. K. Kulkarni | `9822012345` | `/vet/queue` | Review patient queue, inspect photo, write Rx |
| **Admin** | AH Dept Admin | N/A | `/admin/vets` | Approve veterinary license submissions |

*Quick Role Switcher*: Click the role buttons in the top header (`👨‍🌾 Farmer`, `🩺 Vet Officer`, `🛡️ Admin`) to switch perspectives instantly.

---

## 6. Model Card & Validation Benchmark

* **Benchmark Dataset**: 50 independent, ground-truth veterinary clinical cases curated from published literature (ICAR-NIVEDI annual reports, IVRI clinical records, WOAH Terrestrial Manuals).
* **Location**: Located at `data/test_cases.csv` and executable live in the browser via `/model-card`.
* **Performance Metrics**:
  * Top-1 Accuracy: **88.0%**
  * Top-3 Accuracy: **92.0%**
  * Dangerous Disease Recall: **84.2%**
  * Non-Specific Fever Handling Rate: **100.0%**

---

## 7. Compliance & Design Philosophy

1. **Mandatory Disclaimer**: All automated suggestions support, and never replace, physical examination by a registered veterinary practitioner.
2. **Strict Palette Consistency**: Official government portal styling adhering to Deep Navy (`#0F2F5C` / `#0B2447`), Saffron/Amber (`#E07B00`), Neutral Surface (`#F3F4F6`), and WCAG AA contrast standards.
3. **Emergency Access**: Prominent, one-click access to the **1962 Veterinary Emergency Helpline** across triage results, modals, and headers.
