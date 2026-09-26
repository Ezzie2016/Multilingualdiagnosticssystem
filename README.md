# Multilingual Diagnostics System

A multilingual symptom checker. A user describes their symptoms in their own language, the system detects the language, extracts symptom entities, and returns ranked possible conditions with confidence scores and recommendations.

Built as a five-person team project at Babcock University (Feb to Mar 2026).

> Educational project. This is not a medical device and does not give clinical diagnoses. See [LIMITATIONS.md](LIMITATIONS.md).

## The problem

Most symptom checkers only work in one language, usually English. That locks out a large share of patients in multilingual countries like Nigeria. This project tests whether a symptom checker can accept input in several languages and still return a usable, structured result.

## How it works

```
User input -> Language detection -> NLP analysis -> Symptom entities -> Ranked conditions + recommendations
```

The system has three layers of fallback so the app keeps working when a model is unavailable:

1. **Primary:** frontend calls the backend, which runs the configured model (local Ollama, OpenAI, or auto)
2. **Backend fallback:** if the model fails, the backend returns a rule-based analysis
3. **Frontend fallback:** if the API is unreachable, a local rule engine in the browser takes over

It also has a Patient mode and a Clinician mode, where a reviewer can annotate results, adjust confidence, and export records.

Full architecture: [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) · API contract: [API_SPEC.md](API_SPEC.md)

## Tech stack

- **Frontend:** React, TypeScript, Vite, Radix UI
- **Backend:** Node.js HTTP server
- **NLP:** Ollama (local LLM) or OpenAI, with a rule-based fallback
- **Auth:** Supabase

## My role

Per the team's project documentation, I held three roles:

- **NLP Developer:** language detection and symptom analysis
- **Dataset Manager** (with Umaru Victor): collecting, cleaning, and managing the multilingual symptom datasets used for training and testing
- **UI Developer** (with Olaitan Temitayo): the interface users interact with

Umaru Victor was Project Manager and Olaitan Temitayo was Documentation Lead. The project used Google Colab for NLP and dataset work, so this repository's commit history does not show the full split of contributions.

## Running it locally

See [RUN_INSTRUCTIONS.md](RUN_INSTRUCTIONS.md) for full setup. Short version:

```bash
npm install
cp .env.example .env   # then fill in your Supabase URL and anon key
npm run dev
```

## Known limitations

- Model confidence scores are estimates, not calibrated clinical probabilities
- Accuracy is uneven across languages, and weaker for less-resourced languages
- History and clinician notes are stored in browser localStorage only, with no server-side database

Details in [LIMITATIONS.md](LIMITATIONS.md).
