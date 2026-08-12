# SmartKisan AI Workspace

## Overview

pnpm workspace monorepo using TypeScript. SmartKisan AI is a full-stack AI-powered agriculture advisory web application for Indian farmers.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/smartkisan)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Weather**: Open-Meteo API (free, no key required)

## Features

- **Crop Predictor**: AI-based crop recommendation using soil data (N, P, K, pH, rainfall, temperature, humidity)
- **AI Advisor**: Multilingual farming chatbot supporting 8 languages with voice input/output
- **Weather**: Real-time weather via Open-Meteo API with 7-day forecast and farming advice
- **News & Schemes**: Government farming schemes and news from reliable sources
- **Crop Calendar**: Seasonal crop planting/harvesting calendar with detailed crop info
- **GPS Location**: Auto-detects farmer location for weather data
- **Full i18n**: All UI translated to 8 languages via global language selector (sidebar + mobile header)

## Architecture

- `artifacts/smartkisan/` - React + Vite frontend (green/blue nature theme)
- `artifacts/api-server/` - Express 5 backend API
- `lib/api-spec/openapi.yaml` - OpenAPI contract
- `lib/api-client-react/` - Generated React Query hooks
- `lib/api-zod/` - Generated Zod validation schemas
- `lib/db/` - Drizzle ORM database

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## AI Advisor Architecture

- **aiEngine.ts** — Calls OpenAI `gpt-5-mini` (via `@workspace/integrations-openai-ai-server`) for real LLM answers. Builds dynamic system prompt with language, regional crop data, MSP prices, govt schemes. Returns `{ answer, suggestions, relatedTopics, voiceText, isExoticPrompt }`.
- **TTS** — `POST /api/advisor/tts` endpoint calls `textToSpeech()` from the OpenAI audio module (model: `gpt-audio`, voice: `nova`, format: `mp3`). Returns `audio/mpeg` binary. Frontend plays it via `Audio` element from a blob URL. **Web Speech API (SpeechSynthesisUtterance) is FORBIDDEN** — all TTS uses OpenAI only.
- **Voice Input** — Still uses Web Speech API `SpeechRecognition` (STT is allowed); auto-plays TTS response when voice input was used.

## API Endpoints

- `POST /api/predict` — Crop prediction from soil data
- `POST /api/ask` — AI farming advisor (multilingual, GPT-5-mini)
- `POST /api/advisor/tts` — Text-to-speech (OpenAI gpt-audio, returns audio/mpeg)
- `GET /api/weather` — Weather data via Open-Meteo
- `GET /api/news` — Farming news and government schemes
- `GET /api/soil/region` — Regional soil averages
- `GET /api/crop/calendar` — Seasonal crop calendar
- `GET /api/crop/details` — Detailed crop information

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
