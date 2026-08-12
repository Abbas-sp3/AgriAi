<div align="center">

# 🌾 SMARTKISAN AI — Digital Krishi Officer

**AI-powered farming companion for real-time, multilingual agricultural advisory**

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4.1-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![BharatTech](https://img.shields.io/badge/BharatTech_Xperience-3.0-FF6B35?style=flat-square)](https://bharattech.in)

<br/>

> *Empowering every farmer with intelligent, accessible, real-time advisory*

<br/>

[🚀 Features](#-key-features) · [🏗️ Architecture](#️-architecture) · [⚡ Quick Start](#-quick-start) · [📡 API Reference](#-api-reference) · [🌐 Languages](#-supported-languages) · [🤝 Contributing](#-contributing)

</div>

---

## 📌 Overview

**SmartKisan AI** is a full-stack, production-grade agricultural advisory platform built to digitize the role of a *Krishi Officer* (agricultural extension officer) using Artificial Intelligence. Designed specifically for India's diverse farming community, it breaks down barriers of language, literacy, and connectivity to deliver precision agricultural guidance at scale.

Farmers interact via **voice or text in their native language** and receive instant, context-aware advice powered by GPT-4.1 Vision, real-time weather data, government scheme databases, and an intelligent crop recommendation engine.

```
📱 Farmer speaks in Hindi  →  🧠 AI processes query  →  🌦️ Fetches real-time data  →  🔊 Responds in Hindi
```

---

## 🎯 Problem Statement

India has over **146 million farming households**, yet access to quality agricultural advisory remains critically limited:

| Challenge | Impact |
|-----------|--------|
| 🗣️ Language barriers | 78% of farmers are non-English speakers |
| 📚 Low digital literacy | Voice-first interaction is essential |
| 🌾 Crop disease losses | ₹50,000 crore annual loss from preventable diseases |
| 📡 Information gap | Delayed awareness of government schemes |
| 🌡️ Climate uncertainty | Unpredictable weather affects crop planning |
| 🧑‍🌾 Advisor shortage | 1 Krishi Officer per 1,000+ farmers |

---

## ✨ Key Features

### 🤖 Multilingual AI Chatbot
- Supports **8 major Indian languages**
- Voice ↔ Voice, Voice ↔ Text, Text ↔ Voice, Text ↔ Text
- Auto language detection and response matching
- Powered by OpenAI GPT-4.1-mini

### 🌿 Crop Disease Detection
- Upload or capture crop images
- GPT-4.1-mini Vision for diagnosis
- Returns: disease name, severity, confidence score
- Actionable treatment & prevention steps

### 🌱 Crop Recommendation Engine
- Soil-data based recommendations
- Falls back to government regional data
- Exotic crop advisory (dragon fruit, avocado)
- Income maximization guidance

### 🌦️ Real-Time Weather & Alerts
- Location-based weather via Open-Meteo API
- Farming-specific advisory per forecast
- Regional disaster warnings
- Seasonal crop calendar

### 📰 Government Schemes & News
- Live RSS/APItube news feeds
- Curated government scheme database
- Regional agriculture updates
- Policy change notifications

### 📅 Seasonal Crop Calendar
- Crop planning by season and region
- Sowing and harvesting schedules
- Regional variety recommendations
- Climate-adjusted planning

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SMARTKISAN AI                            │
├───────────────────────┬─────────────────────────────────────────┤
│     FRONTEND          │              BACKEND                    │
│   (SmartKisan Web)    │           (API Server)                  │
│                       │                                         │
│  React 18 + Vite      │  Express 5 (TypeScript)                 │
│  Tailwind + shadcn    │  PostgreSQL (data layer)                │
│  TanStack Query       │  Zod validation                         │
│  Wouter routing       │  Pino logging                           │
│  i18n (8 languages)   │  esbuild                                │
│                       │                                         │
│  ┌─────────────────┐  │  ┌──────────────────────────────────┐  │
│  │  Voice Agent    │  │  │  AI Engine (OpenAI GPT-4.1)      │  │
│  │  Web Speech API │◄─┼─►│  Vision API (Disease Detection)  │  │
│  │  OpenAI TTS     │  │  │  TTS / Transcription             │  │
│  └─────────────────┘  │  └──────────────────────────────────┘  │
│                       │                                         │
│                       │  ┌──────────────────────────────────┐  │
│                       │  │  External Services               │  │
│                       │  │  • Open-Meteo (Weather)          │  │
│                       │  │  • RSS/APItube (News)            │  │
│                       │  │  • Gov Schemes Dataset           │  │
│                       │  └──────────────────────────────────┘  │
└───────────────────────┴─────────────────────────────────────────┘
```

### Disease Detection Pipeline

```
📷 Camera (getUserMedia)         🖼️ File Upload (fallback)
         │                                │
         └──────────────┬─────────────────┘
                        ▼
              Canvas resize (max 1024px)
                        │
                        ▼
              Base64 encoding
                        │
                        ▼
              POST /api/disease/detect
                        │
                        ▼
         GPT-4.1-mini Vision Model
                        │
                        ▼
    ┌───────────────────────────────────┐
    │ • Disease Name & Confidence Score │
    │ • Severity Level                  │
    │ • Root Causes                     │
    │ • Treatment Steps                 │
    │ • Prevention Methods              │
    │ • Estimated Yield Impact          │
    └───────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend — `artifacts/smartkisan`

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7 | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| shadcn/ui | latest | Component library |
| TanStack Query | 5 | Server state management |
| Wouter | 3 | Lightweight routing |
| React Hook Form | 7 | Form management |
| Zod | 3 | Schema validation |
| Lucide React | latest | Icon library |
| Web Speech API | native | Speech-to-text |

### Backend — `artifacts/api-server`

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express | 5 | HTTP framework |
| TypeScript | 5.9 | Type safety |
| PostgreSQL | 16 | Database |
| Zod | 3 | Request validation |
| Pino | latest | Structured logging |
| esbuild | 0.27 | Fast bundling |

### AI & ML Services

| Service | Model | Usage |
|---------|-------|-------|
| OpenAI Chat | GPT-4.1-mini | Crop advisory, Q&A |
| OpenAI Vision | GPT-4.1-mini Vision | Disease detection |
| OpenAI TTS | tts-1 | Text-to-speech output |
| Web Speech API | native | Speech-to-text input |

### External Data Sources

| Source | Purpose |
|--------|---------|
| Open-Meteo API | Real-time weather data (free, no API key) |
| RSS / APItube | Agricultural news feeds |
| Government datasets | Schemes, regional crop data |

---

## 🌐 Supported Languages

| Language | Code | Script |
|----------|------|--------|
| 🇬🇧 English | `en` | Latin |
| 🇮🇳 Hindi | `hi` | Devanagari |
| Marathi | `mr` | Devanagari |
| Telugu | `te` | Telugu |
| Tamil | `ta` | Tamil |
| Kannada | `kn` | Kannada |
| Gujarati | `gu` | Gujarati |
| Punjabi | `pa` | Gurmukhi |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 20+
- **pnpm** 10+ (`npm install -g pnpm`)
- **PostgreSQL** 16+ (or a connection URL)
- **OpenAI API Key**

### 1. Clone the Repository

```bash
git clone https://github.com/Abbas-sp3/AgriAi.git
cd AgriAi
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

```bash
cp artifacts/api-server/.env.example artifacts/api-server/.env
```

Edit `artifacts/api-server/.env`:

```env
# Required
OPENAI_API_KEY=sk-...your-key-here...
DATABASE_URL=postgresql://user:password@localhost:5432/smartkisan

# Optional
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

### 4. Run Development Servers

```bash
pnpm run dev
```

This starts both servers concurrently:
- 🌐 **Frontend** → http://localhost:5173
- 🔴 **API Server** → http://localhost:3000

### 5. Build for Production

```bash
pnpm run build
```

---

## 📡 API Reference

Base URL: `http://localhost:3000/api`

### Chat & Advisory

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/advisor/chat` | Send a message to the AI advisor |
| `POST` | `/advisor/recommend` | Get crop recommendations |
| `GET` | `/advisor/schemes` | Fetch government schemes |

### Disease Detection

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/disease/detect` | Analyze crop image for disease |

### Weather

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/weather?lat=&lon=` | Get location-based weather |

### Voice & Audio

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/agent/transcribe` | Speech-to-text conversion |
| `POST` | `/agent/tts` | Text-to-speech synthesis |

### Example — Disease Detection Request

```bash
curl -X POST http://localhost:3000/api/disease/detect \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQ...",
    "language": "hi"
  }'
```

**Response:**
```json
{
  "disease": "Leaf Blight",
  "confidence": 0.94,
  "severity": "moderate",
  "causes": ["Fungal infection (Helminthosporium)", "Excess moisture"],
  "treatment": ["Apply Mancozeb 75% WP", "Remove infected leaves"],
  "prevention": ["Proper spacing", "Avoid overhead irrigation"],
  "yieldImpact": "15-25% reduction if untreated"
}
```

---

## 📁 Project Structure

```
AgriAi/
├── artifacts/
│   ├── api-server/              # Express API backend
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── advisor.ts   # Crop advisory endpoints
│   │   │   │   ├── disease.ts   # Disease detection endpoint
│   │   │   │   └── agent.ts     # Voice agent endpoints
│   │   │   ├── lib/
│   │   │   │   ├── aiEngine.ts  # OpenAI integration
│   │   │   │   ├── weatherService.ts
│   │   │   │   └── translator.ts
│   │   │   └── index.ts         # Server entry point
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── smartkisan/              # React frontend
│       ├── src/
│       │   ├── components/      # Reusable UI components
│       │   │   └── voice-agent.tsx
│       │   ├── pages/           # Route pages
│       │   │   ├── advisor.tsx
│       │   │   ├── calendar.tsx
│       │   │   └── ...
│       │   └── lib/
│       │       ├── date-locale.ts
│       │       └── weather-locales.ts
│       └── package.json
│
├── lib/                         # Shared workspace libraries
│   ├── api-spec/                # API type definitions
│   ├── api-zod/                 # Zod schemas
│   ├── db/                      # Database schema & queries
│   └── integrations-openai-*/   # OpenAI integration modules
│
├── scripts/                     # Build & dev scripts
├── package.json                 # Workspace root
├── pnpm-workspace.yaml
└── README.md
```

---

## 🔧 Development Guide

### Running Individual Packages

```bash
# Run only the frontend
pnpm --filter @workspace/smartkisan run dev

# Run only the API server
pnpm --filter @workspace/api-server run dev

# Type-check all packages
pnpm run typecheck
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | ✅ | — | OpenAI API key |
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `PORT` | ❌ | `3000` | API server port |
| `NODE_ENV` | ❌ | `development` | Environment |
| `LOG_LEVEL` | ❌ | `info` | Pino log level |

---

## 🚀 Deployment

### Replit (Recommended)

This project is pre-configured for Replit deployment via `.replit` config:

1. Import the repository on Replit
2. Set `OPENAI_API_KEY` and `DATABASE_URL` as Secrets
3. Click **Run**

---

## 🧠 How It Works — End-to-End Flow

```
1. 🎙️  Farmer speaks / types in local language
         │
2. 🔍  Language detection (auto / user-selected)
         │
3. 🌐  Input sent to API server
         │
4. 🤖  GPT-4.1-mini processes query with context:
         ├─ Weather data (Open-Meteo)
         ├─ Crop/soil database
         ├─ Government scheme dataset
         └─ Conversation history
         │
5. 📝  Response generated in farmer's language
         │
6. 🔊  Output delivered:
         ├─ Text on screen
         └─ Voice via OpenAI TTS
```

---

## 🌟 Unique Selling Points

### 🦠 AI Disease Detection
Unlike generic plant apps, SmartKisan AI provides **actionable, region-specific treatment protocols** with confidence scores and yield impact estimation — not just a label.

### 🗣️ True Multilingual Voice AI
Not a translation wrapper — the AI **reasons and responds natively** in the farmer's language, with culturally appropriate advice tailored to Indian agricultural contexts.

### 🧑‍🌾 Built for Bharat
Every design decision prioritizes low-literacy users, low-end devices, and intermittent connectivity — features often ignored by mainstream agri-tech platforms.

---

## 📊 Impact Metrics (Projected)

| Metric | Value |
|--------|-------|
| Languages Supported | 8 |
| Potential Farmer Reach | 100M+ (Hindi belt alone) |
| Disease Detection Accuracy | ~94% (GPT-4.1 Vision) |
| Advisory Response Time | < 3 seconds |
| Government Schemes Covered | 50+ |

---

## 🗺️ Roadmap

- [ ] **Offline Mode** — PWA with cached AI responses for low-connectivity regions
- [ ] **AgriStack Integration** — Link with India's national farmer database
- [ ] **IoT Support** — Soil sensor data integration for precision farming
- [ ] **More Languages** — Odia, Assamese, Bhojpuri, Maithili
- [ ] **Mobile App** — React Native cross-platform app
- [ ] **Mandi Price Integration** — Real-time market prices from AGMARK
- [ ] **Pest Calendar** — Predictive pest outbreak alerts by region
- [ ] **Insurance Advisory** — PM Fasal Bima Yojana guidance

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes
refactor: Code refactoring
test:     Adding tests
chore:    Build/tooling changes
```

---

## 👥 Team

| Name | Role |
|------|------|
| **Mohd Abbas** | Full Stack Development, AI Integration |
| **Sanskar Soni** | Backend & API Architecture |
| **Yuvraj Pandey** | Frontend & UI/UX |
| **Ritesh Ranjan Mishra** | Data & ML Pipeline |

---

## 🏆 Hackathon

**Event:** BharatTech Xperience 3.0  
**Track:** AgriTech / AI for Social Good  
**Theme:** Empowering Bharat through Technology

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [OpenAI](https://openai.com) — GPT-4.1-mini & Vision API
- [Open-Meteo](https://open-meteo.com) — Free weather API
- [shadcn/ui](https://ui.shadcn.com) — Beautiful component library
- Government of India — Agricultural datasets and scheme data

---

<div align="center">

**Built with ❤️ for India's 146 million farming families**

⭐ Star this repo if SmartKisan AI inspires you!

</div>
