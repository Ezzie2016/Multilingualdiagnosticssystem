# Limitations

## 1) Clinical Scope

- This application is **not** a medical device.
- It is **not** intended to provide definitive diagnosis.
- Output should be treated as informational decision support only.

## 2) Model Quality and Consistency

- NLP output quality varies by provider/model (`ollama`, `openai`, `auto`).
- Smaller local models can be faster but less accurate on complex symptom narratives.
- Model confidence values are estimated signals, not calibrated clinical probabilities.

## 3) Language Coverage Quality

- UI supports multiple languages, but NLP performance may not be uniform across all supported languages.
- Less-resourced languages can have lower entity extraction/diagnosis consistency.

## 4) Fallback Behavior

- If provider inference fails, backend falls back to rule-based analysis.
- Rule-based mode can miss nuanced phrasing and synonyms outside known patterns.
- This fallback improves availability but reduces semantic depth.

## 5) Data and Persistence

- History is stored in browser `localStorage` only.
- Clinician notes, confidence overrides, and audit entries are currently local to browser storage.
- No server-side persistent database currently exists.
- Clearing browser storage removes local history.

## 6) Security and Privacy

- No authentication/authorization layer is implemented.
- No role-based access control, audit log, or tenant separation exists.
- The current architecture is not suitable for production PHI workflows without major hardening.

## 7) Operational Constraints

- Local inference can be CPU/RAM intensive, especially with larger models.
- Performance and latency depend on device capability and chosen model size.
- API dependency failures (provider down/quota issues) can degrade to fallback quality.

## 8) Validation and Governance

- No formal clinical validation studies are included.
- No regulatory compliance framework is implemented in this repo.
- No automated benchmarking pipeline currently tracks cross-language diagnostic quality.
