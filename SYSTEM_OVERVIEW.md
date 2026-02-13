# Multilingual Diagnostics System: System Overview

## 1) Objective
This repository contains a multilingual symptom-analysis web application that:

- Accepts symptom narratives in multiple languages
- Extracts symptom-related entities
- Produces top diagnosis candidates with confidence
- Shows recommendations
- Stores session history locally in the browser
- Supports Patient/Public and Clinician review modes
- Captures pre-EHR patient profile fields (age range, optional gender, language)
- Tracks per-session audit events and clinician review metadata

This system is for educational/engineering use and is not a clinical diagnosis tool.

## 2) High-Level Architecture

### Frontend (`React + Vite`)
- `src/main.tsx`: app bootstrap
- `src/App.tsx`: layout, navigation, landing page, diagnostic/history/results page switching
- `src/components/DiagnosticInterface.tsx`: symptom capture and analysis trigger
- `src/components/NLPResults.tsx`: dedicated results rendering
- `src/components/DiagnosticHistory.tsx`: historical sessions view
- `src/components/LanguageSelector.tsx`: language switching
- `src/utils/nlpApi.ts`: backend API client (`/api/analyze`)
- `src/utils/nlpEngine.ts`: local rule-based fallback analyzer (frontend-side fallback)

### Backend (`Node HTTP server`)
- `server/index.js`
- Endpoints:
  - `GET /health`
  - `POST /api/analyze`
- NLP provider strategy:
  - `ollama` (local model inference)
  - `openai` (cloud model inference)
  - `auto` (try Ollama, then OpenAI)
- Final safety fallback:
  - If provider inference fails, backend falls back to internal rule-based response builder

## 3) NLP Paths and Fallback Layers

The app has layered resilience:

1. **Primary path**: frontend -> backend -> configured provider (`ollama`/`openai`/`auto`)
2. **Backend fallback**: provider fails -> backend returns rule-based analysis
3. **Frontend fallback**: API call fails -> frontend local rule engine (`nlpEngine.ts`)

This keeps the UI functional even when providers are unavailable.

## 4) Data Flow

1. User submits symptom text in `DiagnosticInterface`.
2. Frontend posts `{ symptoms, language }` to `/api/analyze`.
3. Backend runs provider inference and normalizes output format.
4. Frontend stores returned diagnostic result in app state.
5. App routes user to dedicated **Results** page.
6. Result is persisted to `localStorage` history for later review.
7. In Clinician Mode, reviewer can annotate notes, adjust confidence, and export records.

## 5) Core Data Contract (Normalized)

Response object shape used by frontend:

```json
{
  "id": "diag-...",
  "timestamp": "ISO-8601 string",
  "language": "en",
  "symptoms": "raw user text",
  "entities": [
    {
      "text": "chest pain",
      "type": "symptom",
      "confidence": 0.86
    }
  ],
  "diagnoses": [
    {
      "condition": "Chest Pain Syndrome",
      "confidence": 0.71,
      "description": "string",
      "recommendations": ["string", "string"]
    }
  ]
}
```

## 6) Configuration

Configured via `.env`:

- `NLP_PROVIDER` = `ollama` | `openai` | `auto`
- `OLLAMA_URL` = Ollama server URL
- `OLLAMA_MODEL` = local model identifier (currently `llama3.1:8b`)
- `OPENAI_API_KEY` = required only for `openai`/`auto` cloud path
- `OPENAI_MODEL` = cloud model name
- `API_PORT` = backend listening port (currently `4002`)

## 7) Current Product Features

- Official landing/overview page
- Dedicated diagnostic input page
- Dedicated results page (NLP Analysis + Diagnosis Results)
- Clinician Review Mode (notes + confidence adjustment)
- Export actions in clinician mode (JSON, CSV, print-to-PDF)
- History page with persisted local records
- Multilingual UI and multilingual symptom handling
- Confidence explanation text in results

## 8) What This Is Not

- Not a medical device
- Not a regulated clinical decision support system
- No EMR/EHR integration
- No server-side user accounts or protected health record storage
