const http = require("node:http");
const { URL } = require("node:url");
const {
  analyzeWithMedicalBank,
  getKnowledgeContextForPrompt,
  searchMedicalBank,
  upsertExternalMedicalData,
  getExternalMedicalDataStatus,
  getMedicalBankStats,
} = require("./medical/engine");
const { syncTerminologyFromFhir } = require("./medical/terminologyClient");

const PORT = Number(process.env.API_PORT || 3001);
const NLP_PROVIDER = process.env.NLP_PROVIDER || "ollama";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";
const FHIR_TERMINOLOGY_BASE_URL = process.env.FHIR_TERMINOLOGY_BASE_URL || "";

// ─── Condition catalog (rule-based fallback) ──────────────────────────────────

const conditionCatalog = {
  headache: {
    name: "Migraine / Tension Headache",
    description:
      "A recurring headache pattern that can be severe and disabling. Tension headaches are the most common type and are often described as a tight band around the head.",
    recommendations: [
      "Rest in a quiet, dark room",
      "Stay well hydrated",
      "Apply a cold or warm compress to the head",
      "Try over-the-counter pain relief (e.g. ibuprofen, paracetamol)",
      "Consult a clinician if headaches are frequent or severe",
    ],
  },
  fever: {
    name: "Influenza (Flu) / Viral Infection",
    description:
      "A viral respiratory illness characterised by sudden onset of fever, chills, muscle aches, and fatigue. Can range from mild to severe.",
    recommendations: [
      "Rest and stay hydrated",
      "Monitor body temperature regularly",
      "Take antipyretics (e.g. paracetamol) to manage fever",
      "Seek care if temperature exceeds 39.5°C or breathing worsens",
      "Isolate to avoid spreading infection",
    ],
  },
  cough: {
    name: "Bronchitis / Upper Respiratory Infection",
    description:
      "Inflammation of the bronchial airways, often following a viral infection. May produce mucus and cause chest tightness.",
    recommendations: [
      "Drink warm fluids and use steam inhalation",
      "Avoid smoke and air pollutants",
      "Use a humidifier if air is dry",
      "See a clinician if cough persists beyond 3 weeks or produces blood",
      "Rest and avoid strenuous activity",
    ],
  },
  sore_throat: {
    name: "Pharyngitis / Tonsillitis",
    description:
      "Inflammation of the pharynx or tonsils, usually caused by viral or bacterial infection. Causes pain on swallowing and throat redness.",
    recommendations: [
      "Gargle with warm salt water",
      "Drink warm liquids and use throat lozenges",
      "Rest your voice",
      "Seek care if symptoms persist beyond 7 days or if high fever develops",
      "Antibiotics may be needed if streptococcal infection is suspected",
    ],
  },
  nausea: {
    name: "Gastroenteritis / Dyspepsia",
    description:
      "Digestive irritation or infection causing nausea, vomiting, and abdominal discomfort. Often self-limiting.",
    recommendations: [
      "Use oral rehydration salts to prevent dehydration",
      "Eat bland foods (e.g. rice, toast, bananas)",
      "Avoid dairy, fatty, and spicy foods temporarily",
      "Seek care if vomiting persists beyond 24 hours or signs of dehydration appear",
      "Rest and avoid strenuous activity",
    ],
  },
  dizziness: {
    name: "Vertigo / Vestibular Disorder",
    description:
      "A sensation of spinning or imbalance, commonly linked to inner-ear dysfunction (benign paroxysmal positional vertigo) or low blood pressure.",
    recommendations: [
      "Sit or lie down immediately to prevent falls",
      "Avoid sudden head movements",
      "Stay hydrated and maintain regular meals",
      "Seek clinical evaluation if vertigo is recurrent or accompanied by hearing loss",
      "Avoid driving or operating machinery during episodes",
    ],
  },
  chest_pain: {
    name: "Chest Pain Syndrome",
    description:
      "Chest pain can have many causes ranging from musculoskeletal strain to cardiac conditions. Requires careful and prompt medical assessment.",
    recommendations: [
      "Stop all activity immediately and rest",
      "Seek urgent medical assessment — call emergency services if pain is severe or radiates to the arm/jaw",
      "Do not drive yourself to hospital",
      "Avoid eating or drinking until assessed",
      "Note the character, duration, and triggers of the pain",
    ],
  },
  back_pain: {
    name: "Musculoskeletal Back Strain",
    description:
      "Musculoskeletal strain of the lumbar or thoracic spine, often caused by poor posture, lifting, or prolonged sitting.",
    recommendations: [
      "Rest but avoid prolonged bed rest — gentle movement aids recovery",
      "Apply ice for the first 48 hours, then switch to heat",
      "Take over-the-counter anti-inflammatories if tolerated",
      "Seek care if pain radiates down the leg, causes numbness, or affects bladder/bowel function",
      "Consider physiotherapy for recurring episodes",
    ],
  },
  fatigue: {
    name: "Fatigue / Chronic Fatigue",
    description:
      "Persistent tiredness that is not relieved by rest. Can be caused by anaemia, thyroid dysfunction, infection, depression, or sleep disorders.",
    recommendations: [
      "Maintain a consistent sleep schedule",
      "Stay hydrated and eat balanced meals",
      "Reduce caffeine and alcohol",
      "Track fatigue patterns and report to a clinician if persistent beyond 2 weeks",
      "Blood tests may be needed to rule out anaemia or thyroid issues",
    ],
  },
  shortness_of_breath: {
    name: "Dyspnoea / Respiratory Distress",
    description:
      "Difficulty breathing or breathlessness can indicate conditions ranging from anxiety and asthma to cardiac or pulmonary disease. Requires urgent assessment.",
    recommendations: [
      "Sit upright and try to remain calm",
      "Use prescribed inhalers if available (asthma/COPD)",
      "Call emergency services immediately if symptoms are severe or sudden",
      "Avoid triggers such as smoke, allergens, or cold air",
      "Seek urgent clinical evaluation — do not delay",
    ],
  },
  abdominal_pain: {
    name: "Abdominal Pain / Colic",
    description:
      "Pain in the abdominal region with many possible causes including indigestion, irritable bowel syndrome, appendicitis, or kidney stones.",
    recommendations: [
      "Rest and avoid solid food if pain is severe",
      "Apply a warm compress to the abdomen for cramping",
      "Seek emergency care immediately if pain is sudden, severe, or accompanied by fever and rigidity",
      "Note the location, character, and timing of pain",
      "Avoid painkillers that may mask serious conditions until assessed",
    ],
  },
  joint_pain: {
    name: "Arthralgia / Arthritis",
    description:
      "Pain, swelling, or stiffness in one or more joints. Can be due to osteoarthritis, rheumatoid arthritis, gout, or infection.",
    recommendations: [
      "Rest the affected joint and avoid aggravating activities",
      "Apply ice for swelling and heat for stiffness",
      "Take anti-inflammatory medication if tolerated",
      "Seek care if the joint is hot, red, and swollen — this may indicate infection or gout",
      "Physiotherapy and lifestyle changes can help chronic joint conditions",
    ],
  },
  rash: {
    name: "Dermatitis / Skin Rash",
    description:
      "A skin rash can indicate allergic reaction, contact dermatitis, viral infection, or an autoimmune condition.",
    recommendations: [
      "Avoid scratching to prevent secondary infection",
      "Apply soothing, fragrance-free moisturiser or calamine lotion",
      "Avoid known allergens or irritants",
      "Seek care if rash is spreading rapidly, blistering, or accompanied by fever",
      "Antihistamines may help with allergic rashes",
    ],
  },
};


// ─── Rule-based fallback ──────────────────────────────────────────────────────

function buildRuleBasedResponse(symptoms, language) {
  return analyzeWithMedicalBank(symptoms, language);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clampConfidence(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 0.3;
  return Math.max(0, Math.min(0.99, numeric));
}

function normalizeModelResponse(symptoms, language, parsed) {
  const entities = Array.isArray(parsed?.entities) ? parsed.entities : [];
  const diagnoses = Array.isArray(parsed?.diagnoses) ? parsed.diagnoses : [];

  const safeEntities = entities
    .map((entity) => ({
      text: String(entity?.text || ""),
      type: ["symptom", "body_part", "duration", "severity"].includes(
        entity?.type,
      )
        ? entity.type
        : "symptom",
      confidence: clampConfidence(entity?.confidence),
    }))
    .filter((entity) => entity.text.length > 0);

  const safeDiagnoses = diagnoses
    .map((diagnosis) => ({
      condition: String(diagnosis?.condition || "No clear match found"),
      confidence: clampConfidence(diagnosis?.confidence),
      description: String(
        diagnosis?.description || "Condition requires clinical assessment.",
      ),
      recommendations: Array.isArray(diagnosis?.recommendations)
        ? diagnosis.recommendations.slice(0, 6).map((item) => String(item))
        : ["Consult a healthcare professional"],
    }))
    .filter((diagnosis) => diagnosis.condition.length > 0)
    .slice(0, 3);

  const normalizedDiagnoses =
    safeDiagnoses.length > 0
      ? safeDiagnoses
      : [
          {
            condition: "No clear match found",
            confidence: 0.3,
            description:
              "The submitted symptom text could not be confidently matched to known conditions.",
            recommendations: [
              "Try describing key symptoms more clearly",
              "Include duration and severity details",
              "Consult a healthcare professional for proper diagnosis",
            ],
          },
        ];

  return {
    id: `diag-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    timestamp: new Date().toISOString(),
    language,
    symptoms,
    diagnoses: normalizedDiagnoses,
    entities: safeEntities,
  };
}

function extractJsonObject(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("Model response is empty");

  try {
    return JSON.parse(raw);
  } catch {
    // fall through to extraction
  }

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(raw.slice(start, end + 1));
  }

  throw new Error("Could not parse JSON from model response");
}

// ─── UPGRADED SYSTEM PROMPT ───────────────────────────────────────────────────

function getSystemPrompt() {
  return `You are a clinical NLP assistant specialised in medical symptom analysis and differential diagnosis.

Your job is to:
1. Extract all medical entities from the patient's symptom narrative.
2. Generate up to 3 ranked differential diagnoses based on the symptoms described.

ENTITY EXTRACTION RULES:
- Extract every symptom mentioned (e.g. "fever", "chest tightness", "productive cough")
- Extract body parts referenced (e.g. "chest", "lower back", "right knee")
- Extract duration expressions (e.g. "3 days", "two weeks", "since yesterday")
- Extract severity descriptors (e.g. "severe", "mild", "worsening", "constant")
- Assign confidence 0.70–0.99 for clearly stated entities
- Assign confidence 0.40–0.69 for implied or ambiguous entities

DIAGNOSIS RULES:
- Rank diagnoses by clinical likelihood given the symptom combination
- Each diagnosis must include a specific medical condition name (not vague like "infection")
- Description must explain the condition and why it fits the symptoms
- Recommendations must be specific, actionable, and clinically appropriate (4–6 steps)
- Confidence scoring: 0.75–0.95 = strong match, 0.50–0.74 = moderate, 0.30–0.49 = low/speculative
- Always consider the most common diagnosis first, then serious conditions that must not be missed
- For chest pain, always consider cardiac causes. For severe headache, consider meningitis/haemorrhage.
- NEVER diagnose with certainty — this is decision support, not a final diagnosis
- If symptoms are vague or insufficient, still provide the most likely differential with low confidence

LANGUAGE OUTPUT RULES:
- The patient's language is specified in the user prompt.
- You MUST write ALL condition names, descriptions, and recommendations in that SAME language.
- If the language is Yoruba, respond in Yoruba. If Igbo, respond in Igbo. If Hausa, respond in Hausa. If Nigerian Pidgin, respond in Pidgin. If English, respond in English.
- Do NOT mix languages. Every word of every diagnosis field must be in the patient's language.
- Entity "text" fields must be the exact phrase from the narrative, keep those as written.

IMPORTANT:
- Respond ONLY with valid JSON. No markdown, no explanation, no preamble.
- Always return at least 1 diagnosis and at least 1 entity.`;
}

function getMedicalJsonPrompt(symptoms, language) {
  const langNames = {
    en:  "English",
    yo:  "Yoruba",
    ig:  "Igbo",
    ha:  "Hausa",
    pcm: "Nigerian Pidgin English",
  };

  const langName = langNames[language] || language;
  const context = getKnowledgeContextForPrompt(symptoms, language);
  const symptomContext =
    context.matchedSymptoms.length > 0
      ? context.matchedSymptoms.join(", ")
      : "none";
  const conditionContext =
    context.candidateConditions.length > 0
      ? context.candidateConditions.join(", ")
      : "none";

  return `RESPOND ENTIRELY IN ${langName.toUpperCase()}. All condition names, descriptions, and recommendations must be written in ${langName}.

Patient symptom narrative (language: ${langName}):
"${symptoms}"

Medical knowledge bank hints:
- Matched symptom terms: ${symptomContext}
- Candidate conditions: ${conditionContext}

Return ONLY this JSON structure with no other text:
{
  "entities": [
    {"text": "exact phrase from narrative", "type": "symptom|body_part|duration|severity", "confidence": 0.0}
  ],
  "diagnoses": [
    {
      "condition": "Specific Medical Condition Name",
      "confidence": 0.0,
      "description": "2-3 sentence clinical description explaining the condition and why it fits these symptoms.",
      "recommendations": [
        "Specific actionable recommendation 1",
        "Specific actionable recommendation 2",
        "Specific actionable recommendation 3",
        "Specific actionable recommendation 4"
      ]
    }
  ]
}`;
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

async function analyzeWithOpenAI(symptoms, language) {
  if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");

  const schema = {
    name: "diagnostic_analysis",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["entities", "diagnoses"],
      properties: {
        entities: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["text", "type", "confidence"],
            properties: {
              text: { type: "string" },
              type: {
                type: "string",
                enum: ["symptom", "body_part", "duration", "severity"],
              },
              confidence: { type: "number" },
            },
          },
        },
        diagnoses: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: [
              "condition",
              "confidence",
              "description",
              "recommendations",
            ],
            properties: {
              condition: { type: "string" },
              confidence: { type: "number" },
              description: { type: "string" },
              recommendations: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    },
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.3,
      response_format: { type: "json_schema", json_schema: schema },
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: getMedicalJsonPrompt(symptoms, language) },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
  }

  const completion = await response.json();
  const content = completion?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI response did not include content");

  const parsed = extractJsonObject(content);
  return normalizeModelResponse(symptoms, language, parsed);
}

// ─── Ollama ───────────────────────────────────────────────────────────────────

async function analyzeWithOllama(symptoms, language) {
  const prompt = `${getSystemPrompt()}\n\n${getMedicalJsonPrompt(symptoms, language)}`;

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.3 },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Ollama API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const parsed = extractJsonObject(data?.response);
  return normalizeModelResponse(symptoms, language, parsed);
}

// ─── Provider router ──────────────────────────────────────────────────────────

async function resolveAnalysis(symptoms, language) {
  if (NLP_PROVIDER === "ollama") return analyzeWithOllama(symptoms, language);
  if (NLP_PROVIDER === "openai") return analyzeWithOpenAI(symptoms, language);

  if (NLP_PROVIDER === "auto") {
    try {
      return await analyzeWithOllama(symptoms, language);
    } catch (ollamaError) {
      try {
        return await analyzeWithOpenAI(symptoms, language);
      } catch (openaiError) {
        throw new Error(
          `Auto mode failed. Ollama: ${ollamaError.message} | OpenAI: ${openaiError.message}`,
        );
      }
    }
  }

  throw new Error(`Unsupported NLP_PROVIDER: ${NLP_PROVIDER}`);
}

// ─── HTTP server ──────────────────────────────────────────────────────────────

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const requestUrl = new URL(url || "/", "http://127.0.0.1");
  const pathname = requestUrl.pathname;

  if (method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === "GET" && pathname === "/health") {
    sendJson(res, 200, {
      status: "ok",
      mode: NLP_PROVIDER,
      model: NLP_PROVIDER === "ollama" ? OLLAMA_MODEL : OPENAI_MODEL,
      terminologyBaseUrl: FHIR_TERMINOLOGY_BASE_URL || null,
      externalMedicalData: getExternalMedicalDataStatus(),
      medicalBank: getMedicalBankStats(),
    });
    return;
  }

  if (method === "GET" && pathname === "/api/medical/search") {
    const query = requestUrl.searchParams.get("q") || "";
    const language = requestUrl.searchParams.get("language") || "en";
    sendJson(res, 200, searchMedicalBank(query, language));
    return;
  }

  if (method === "GET" && pathname === "/api/medical/status") {
    sendJson(res, 200, {
      externalMedicalData: getExternalMedicalDataStatus(),
      medicalBank: getMedicalBankStats(),
    });
    return;
  }

  if (method === "POST" && pathname === "/api/medical/sync-terminology") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) req.destroy();
    });

    req.on("end", async () => {
      try {
        const parsed = JSON.parse(body || "{}");
        const payload = await syncTerminologyFromFhir({
          fhirBaseUrl:
            String(parsed.fhirBaseUrl || "").trim() || FHIR_TERMINOLOGY_BASE_URL,
          symptomValueSetUrl: String(parsed.symptomValueSetUrl || "").trim(),
          conditionValueSetUrl: String(parsed.conditionValueSetUrl || "").trim(),
          language: String(parsed.language || "en").trim(),
          filter: String(parsed.filter || "").trim(),
          count: Number(parsed.count || 250),
        });

        const status = upsertExternalMedicalData(payload);
        sendJson(res, 200, {
          ok: true,
          source: payload.source,
          imported: payload.meta,
          externalMedicalData: status,
          medicalBank: getMedicalBankStats(),
        });
      } catch (error) {
        sendJson(res, 400, { error: error.message || "Sync failed" });
      }
    });

    return;
  }

  if (method === "POST" && pathname === "/api/analyze") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) req.destroy();
    });

    req.on("end", async () => {
      try {
        const parsed = JSON.parse(body || "{}");
        const symptoms = String(parsed.symptoms || "").trim();
        const language = String(parsed.language || "en");

        if (!symptoms) {
          sendJson(res, 400, { error: "symptoms is required" });
          return;
        }

        let result;
        try {
          result = await resolveAnalysis(symptoms, language);
        } catch (error) {
          console.error("Falling back to rule-based analysis:", error.message);
          result = buildRuleBasedResponse(symptoms, language);
        }

        sendJson(res, 200, result);
      } catch {
        sendJson(res, 400, { error: "Invalid JSON body" });
      }
    });

    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`NLP API server running at http://127.0.0.1:${PORT}`);
});