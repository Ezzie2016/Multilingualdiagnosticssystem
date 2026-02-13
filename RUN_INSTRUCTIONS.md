# Run Instructions

## 1) Prerequisites

- Node.js and npm installed
- Ollama installed (for local model mode)

Install project dependencies:
```bash
npm install
```

## 2) Environment Variables

Create/update `.env` in repo root:

```env
NLP_PROVIDER=ollama
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.1:8b
API_PORT=4002
```

Optional cloud mode:
```env
NLP_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini
API_PORT=4002
```

## 3) Ollama Setup (Local Model Path)

Install/launch Ollama and pull a model:

```bash
ollama pull llama3.1:8b
```

Performance note for lower-memory machines:
- Use `llama3.2:3b` if `llama3.1:8b` is too slow/hot.

## 4) Start Services (Two Terminals)

Terminal 1 (backend):
```bash
cd /Users/subomi/Desktop/Multilingualdiagnosticssystem-main
set -a
source .env
set +a
npm run dev:server
```

Terminal 2 (frontend):
```bash
cd /Users/subomi/Desktop/Multilingualdiagnosticssystem-main
npm run dev:client
```

Open app:
```text
http://localhost:3000
```

## 5) Verify Backend Health

```text
http://127.0.0.1:4002/health
```

Expected shape:
```json
{
  "status": "ok",
  "mode": "ollama",
  "model": "llama3.1:8b"
}
```

## 6) Use the App

1. Open **Overview** tab.
2. Click **Launch Diagnostic Module**.
3. Submit symptoms on **New Diagnostic** page.
4. View NLP Analysis + Diagnosis on the dedicated **Results** page.
5. Review past sessions in **History** page.
6. Switch to **Clinician Mode** (header toggle) to:
   - Add reviewer name + clinician notes
   - Adjust diagnosis confidence values
   - Export record as JSON / CSV / PDF (print-to-PDF)

## 7) Common Issues

### `EADDRINUSE`
Port already in use.
- Stop existing process or change `API_PORT` and matching Vite proxy target.

### `command not found: ollama`
Ollama is not installed or shell was not reloaded.

### Very slow local inference
Switch to a smaller model:
```env
OLLAMA_MODEL=llama3.2:3b
```

### Fallback messages in backend logs
`Falling back to rule-based analysis: ...`
- Provider call failed; check Ollama availability, model pull, or API quota (OpenAI mode).

## 8) Production Build

```bash
npm run build
```

Output directory:
```text
build/
```
