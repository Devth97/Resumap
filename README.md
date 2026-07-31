# ResuMap — AI Resume & Job-Readiness Analyzer (HireLens)

**ResuMap (HireLens)** is an AI-powered student career-readiness analyzer built for Android (React Native + Expo) and supported by a Node.js + Fastify + TypeScript backend with NVIDIA NIM AI microservices and Supabase PostgreSQL.

---

## 🏗️ Architecture Overview

```text
ResuMap Workspace
├── hirelens-api/        # Node.js 22 + Fastify + TypeScript Backend
│   ├── src/
│   │   ├── config/      # Env & constants validation
│   │   ├── routes/      # REST API endpoints (sessions, resumes, roles, analyses, feedback)
│   │   ├── services/    # File validation, PDF extraction, Sharp OCR prep, PII redaction, Scoring engine
│   │   ├── providers/   # NVIDIA Nemotron OCR v2 & Llama 3.3 70B Instruct adapters
│   │   └── db/          # Supabase PostgreSQL migration script (001_initial_schema.sql)
│   └── tests/           # Vitest unit & integration test suite
│
└── hirelens-mobile/     # React Native + Expo Mobile Application
    ├── app/             # Expo Router file-based pages (Welcome, Privacy, Upload, Role, Context, Results, Feedback)
    ├── components/      # Inspira UI-inspired components (Glow buttons, Glass cards, Score gauges, Roadmap timeline)
    ├── services/        # ApiClient, AsyncStorage, Analytics, AdMob test ads
    └── constants/       # Dark theme tokens (#090D16, #6366F1, #06B6D4)
```

---

## 🚀 Quick Start Guide

### 1. Fastify Backend API Setup

```bash
cd hirelens-api

# Install dependencies
npm install

# Run unit tests
npm test

# Launch development server
npm run dev
```

### 2. Expo Mobile App Setup

```bash
cd hirelens-mobile

# Install dependencies
npm install

# Start Expo development client
npm run android
```

---

## 🔐 Environment Variables

### Backend (`hirelens-api/.env`)

```env
NODE_ENV=development
PORT=8080
NVIDIA_API_KEY=nvapi-xxxx # Optional in offline test mode
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxx
```

---

## 📄 License & Ownership

Developed by **Ornalens LLP**.
