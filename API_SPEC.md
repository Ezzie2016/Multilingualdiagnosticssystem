# API Specification

## Base URL

Local development (current setup):
```text
http://127.0.0.1:4002
```

Frontend calls `/api/*` through Vite proxy when running `npm run dev:client`.

## Endpoint: `GET /health`

### Purpose
Returns backend status and active model/provider mode.

### Example Request
```bash
curl http://127.0.0.1:4002/health
```

### Example Response (`200`)
```json
{
  "status": "ok",
  "mode": "ollama",
  "model": "llama3.1:8b"
}
```

## Endpoint: `POST /api/analyze`

### Purpose
Analyzes symptom text and returns normalized entities and diagnosis candidates.

### Request Body
```json
{
  "symptoms": "I have chest pain for 2 hours and shortness of breath",
  "language": "en"
}
```

### Request Fields
- `symptoms` (string, required)
- `language` (string, optional; defaults to `"en"` if omitted)

### Success Response (`200`)
```json
{
  "id": "diag-1739385982494-ab12cd34",
  "timestamp": "2026-02-12T12:34:56.000Z",
  "language": "en",
  "symptoms": "I have chest pain for 2 hours and shortness of breath",
  "entities": [
    {
      "text": "chest pain",
      "type": "symptom",
      "confidence": 0.84
    },
    {
      "text": "2 hours",
      "type": "duration",
      "confidence": 0.88
    }
  ],
  "diagnoses": [
    {
      "condition": "Chest Pain Syndrome",
      "confidence": 0.72,
      "description": "Chest pain has many causes and requires careful medical assessment.",
      "recommendations": [
        "Stop activity immediately",
        "Seek urgent medical assessment",
        "Use emergency care for severe pain"
      ]
    }
  ]
}
```

### Validation Errors (`400`)

If body is not valid JSON:
```json
{
  "error": "Invalid JSON body"
}
```

If `symptoms` is empty/missing:
```json
{
  "error": "symptoms is required"
}
```

### Not Found (`404`)
```json
{
  "error": "Not found"
}
```

## CORS / Preflight

Backend handles:
- `OPTIONS` with `200` and `{ "ok": true }`
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET,POST,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Notes on Fallback Behavior

`POST /api/analyze` may still return `200` even if provider inference fails because backend falls back to rule-based analysis for resilience. In this case, diagnosis quality may be lower and often looks keyword-driven.
