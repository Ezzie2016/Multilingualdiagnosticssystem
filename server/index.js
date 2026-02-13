const http = require('node:http');

const PORT = Number(process.env.API_PORT || 3001);
const NLP_PROVIDER = process.env.NLP_PROVIDER || 'ollama';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b';

const conditionCatalog = {
  headache: {
    name: 'Migraine',
    description: 'A recurring headache pattern that can be severe and disabling.',
    recommendations: ['Hydrate and rest in a quiet room', 'Avoid bright light', 'Consult a clinician if severe or persistent']
  },
  fever: {
    name: 'Influenza (Flu)',
    description: 'A viral respiratory illness that often causes fever and fatigue.',
    recommendations: ['Rest and hydrate', 'Monitor body temperature', 'Seek care if breathing worsens']
  },
  cough: {
    name: 'Bronchitis',
    description: 'Inflammation in the airways that can cause persistent cough.',
    recommendations: ['Drink warm fluids', 'Avoid smoke exposure', 'See a clinician if cough persists']
  },
  sore_throat: {
    name: 'Pharyngitis',
    description: 'Irritation or inflammation of the throat, often with pain when swallowing.',
    recommendations: ['Warm fluids and rest', 'Use soothing lozenges', 'Consult care if fever is high']
  },
  nausea: {
    name: 'Gastroenteritis',
    description: 'Digestive irritation that can cause nausea and stomach discomfort.',
    recommendations: ['Use oral rehydration fluids', 'Eat bland foods', 'Seek care if dehydration signs appear']
  },
  dizziness: {
    name: 'Vertigo',
    description: 'A sensation of spinning or imbalance often linked to inner-ear causes.',
    recommendations: ['Sit or lie down safely', 'Avoid sudden movement', 'Get clinical evaluation if recurrent']
  },
  chest_pain: {
    name: 'Chest Pain Syndrome',
    description: 'Chest pain has many causes and requires careful medical assessment.',
    recommendations: ['Stop activity immediately', 'Seek urgent medical assessment', 'Use emergency care for severe pain']
  },
  back_pain: {
    name: 'Muscle Strain',
    description: 'Musculoskeletal strain can lead to localized back discomfort.',
    recommendations: ['Rest and avoid heavy lifting', 'Use cold/warm compresses', 'Seek care if neurologic symptoms appear']
  },
  fatigue: {
    name: 'Fatigue Syndrome',
    description: 'Persistent tiredness can have infectious, metabolic, or stress-related causes.',
    recommendations: ['Improve sleep and hydration', 'Track duration and severity', 'Consult a clinician if persistent']
  },
  shortness_of_breath: {
    name: 'Respiratory Distress',
    description: 'Difficulty breathing can indicate a serious condition.',
    recommendations: ['Stop exertion and sit upright', 'Use urgent care for moderate/severe symptoms', 'Call emergency services if severe']
  }
};

const languageKeywordMap = {
  en: {
    headache: 'headache',
    fever: 'fever',
    cough: 'cough',
    sore_throat: 'sore throat',
    nausea: 'nausea',
    dizziness: 'dizziness',
    chest_pain: 'chest pain',
    back_pain: 'back pain',
    fatigue: 'fatigue',
    shortness_of_breath: 'shortness of breath'
  },
  es: {
    headache: 'dolor de cabeza',
    fever: 'fiebre',
    cough: 'tos',
    sore_throat: 'dolor de garganta',
    nausea: 'náuseas',
    dizziness: 'mareos',
    chest_pain: 'dolor en el pecho',
    back_pain: 'dolor de espalda',
    fatigue: 'fatiga',
    shortness_of_breath: 'falta de aire'
  },
  fr: {
    headache: 'mal de tête',
    fever: 'fièvre',
    cough: 'toux',
    sore_throat: 'mal de gorge',
    nausea: 'nausées',
    dizziness: 'étourdissements',
    chest_pain: 'douleur thoracique',
    back_pain: 'douleur au dos',
    fatigue: 'fatigue',
    shortness_of_breath: 'essoufflement'
  },
  de: {
    headache: 'kopfschmerzen',
    fever: 'fieber',
    cough: 'husten',
    sore_throat: 'halsschmerzen',
    nausea: 'übelkeit',
    dizziness: 'schwindel',
    chest_pain: 'brustschmerzen',
    back_pain: 'rückenschmerzen',
    fatigue: 'müdigkeit',
    shortness_of_breath: 'atemnot'
  },
  zh: {
    headache: '头痛',
    fever: '发烧',
    cough: '咳嗽',
    sore_throat: '喉咙痛',
    nausea: '恶心',
    dizziness: '头晕',
    chest_pain: '胸痛',
    back_pain: '背痛',
    fatigue: '疲劳',
    shortness_of_breath: '呼吸困难'
  }
};

function buildRuleBasedResponse(symptoms, language) {
  const normalized = String(symptoms || '').toLowerCase();
  const keywords = languageKeywordMap[language] || languageKeywordMap.en;
  const entities = [];
  const conditionScores = {};

  Object.entries(keywords).forEach(([conditionKey, keyword]) => {
    if (normalized.includes(keyword.toLowerCase())) {
      entities.push({
        text: keyword,
        type: 'symptom',
        confidence: 0.9
      });
      conditionScores[conditionKey] = (conditionScores[conditionKey] || 0) + 1;
    }
  });

  const durationMatches = normalized.match(/\d+\s*(days?|hours?|weeks?|months?|minutes?)/g) || [];
  durationMatches.forEach((match) => {
    entities.push({
      text: match,
      type: 'duration',
      confidence: 0.9
    });
  });

  const diagnoses = Object.entries(conditionScores)
    .map(([conditionKey, score]) => {
      const info = conditionCatalog[conditionKey];
      return {
        condition: info?.name || conditionKey,
        confidence: Math.min(0.95, 0.45 + score * 0.2),
        description: info?.description || 'Condition requires clinical assessment.',
        recommendations: info?.recommendations || ['Consult a healthcare professional']
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  if (diagnoses.length === 0) {
    diagnoses.push({
      condition: 'No clear match found',
      confidence: 0.3,
      description: 'The submitted symptom text did not match known patterns in this demo model.',
      recommendations: [
        'Use clear symptom terms (for example: fever, cough, chest pain)',
        'Add duration/severity details',
        'Consult a healthcare professional for proper diagnosis'
      ]
    });
  }

  return {
    id: `diag-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    timestamp: new Date().toISOString(),
    language,
    symptoms,
    diagnoses,
    entities
  };
}

function clampConfidence(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 0.3;
  return Math.max(0, Math.min(0.99, numeric));
}

function normalizeModelResponse(symptoms, language, parsed) {
  const entities = Array.isArray(parsed?.entities) ? parsed.entities : [];
  const diagnoses = Array.isArray(parsed?.diagnoses) ? parsed.diagnoses : [];

  const safeEntities = entities.map((entity) => ({
    text: String(entity?.text || ''),
    type: ['symptom', 'body_part', 'duration', 'severity'].includes(entity?.type) ? entity.type : 'symptom',
    confidence: clampConfidence(entity?.confidence)
  })).filter((entity) => entity.text.length > 0);

  const safeDiagnoses = diagnoses.map((diagnosis) => ({
    condition: String(diagnosis?.condition || 'No clear match found'),
    confidence: clampConfidence(diagnosis?.confidence),
    description: String(diagnosis?.description || 'Condition requires clinical assessment.'),
    recommendations: Array.isArray(diagnosis?.recommendations)
      ? diagnosis.recommendations.slice(0, 5).map((item) => String(item))
      : ['Consult a healthcare professional']
  })).filter((diagnosis) => diagnosis.condition.length > 0).slice(0, 3);

  const normalizedDiagnoses = safeDiagnoses.length > 0
    ? safeDiagnoses
    : [{
        condition: 'No clear match found',
        confidence: 0.3,
        description: 'The submitted symptom text could not be confidently matched to known conditions.',
        recommendations: [
          'Use clearer symptom wording',
          'Add severity and duration details',
          'Consult a healthcare professional for proper diagnosis'
        ]
      }];

  return {
    id: `diag-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    timestamp: new Date().toISOString(),
    language,
    symptoms,
    diagnoses: normalizedDiagnoses,
    entities: safeEntities
  };
}

function getMedicalJsonPrompt(symptoms, language) {
  return [
    'Return ONLY strict JSON. No markdown.',
    'Extract medical symptom entities and suggest up to 3 possible conditions.',
    'Do not claim certainty. Use conservative confidence scores (0-0.99).',
    'Schema:',
    '{"entities":[{"text":"string","type":"symptom|body_part|duration|severity","confidence":0.0}],',
    '"diagnoses":[{"condition":"string","confidence":0.0,"description":"string","recommendations":["string"]}]}',
    `Input: ${JSON.stringify({ symptoms, language })}`
  ].join('\n');
}

function extractJsonObject(text) {
  const raw = String(text || '').trim();
  if (!raw) {
    throw new Error('Model response is empty');
  }

  // Try plain JSON first.
  try {
    return JSON.parse(raw);
  } catch {
    // Continue with extraction.
  }

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start >= 0 && end > start) {
    const slice = raw.slice(start, end + 1);
    return JSON.parse(slice);
  }

  throw new Error('Could not parse JSON from model response');
}

async function analyzeWithOpenAI(symptoms, language) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const schema = {
    name: 'diagnostic_analysis',
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['entities', 'diagnoses'],
      properties: {
        entities: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['text', 'type', 'confidence'],
            properties: {
              text: { type: 'string' },
              type: { type: 'string', enum: ['symptom', 'body_part', 'duration', 'severity'] },
              confidence: { type: 'number' }
            }
          }
        },
        diagnoses: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['condition', 'confidence', 'description', 'recommendations'],
            properties: {
              condition: { type: 'string' },
              confidence: { type: 'number' },
              description: { type: 'string' },
              recommendations: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          }
        }
      }
    }
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      response_format: {
        type: 'json_schema',
        json_schema: schema
      },
      messages: [
        {
          role: 'system',
          content: [
            'You are a medical symptom analysis assistant.',
            'If unclear, return one diagnosis: "No clear match found".'
          ].join(' ')
        },
        {
          role: 'user',
          content: getMedicalJsonPrompt(symptoms, language)
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
  }

  const completion = await response.json();
  const content = completion?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI response did not include content');
  }

  const parsed = extractJsonObject(content);
  return normalizeModelResponse(symptoms, language, parsed);
}

async function analyzeWithOllama(symptoms, language) {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: getMedicalJsonPrompt(symptoms, language),
      stream: false,
      options: {
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Ollama API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const output = data?.response;
  const parsed = extractJsonObject(output);
  return normalizeModelResponse(symptoms, language, parsed);
}

async function resolveAnalysis(symptoms, language) {
  if (NLP_PROVIDER === 'ollama') {
    return analyzeWithOllama(symptoms, language);
  }

  if (NLP_PROVIDER === 'openai') {
    return analyzeWithOpenAI(symptoms, language);
  }

  if (NLP_PROVIDER === 'auto') {
    try {
      return await analyzeWithOllama(symptoms, language);
    } catch (ollamaError) {
      try {
        return await analyzeWithOpenAI(symptoms, language);
      } catch (openaiError) {
        throw new Error(`Auto mode failed. Ollama: ${ollamaError.message} | OpenAI: ${openaiError.message}`);
      }
    }
  }

  throw new Error(`Unsupported NLP_PROVIDER: ${NLP_PROVIDER}`);
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (method === 'GET' && url === '/health') {
    sendJson(res, 200, {
      status: 'ok',
      mode: NLP_PROVIDER,
      model: NLP_PROVIDER === 'ollama' ? OLLAMA_MODEL : OPENAI_MODEL
    });
    return;
  }

  if (method === 'POST' && url === '/api/analyze') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const symptoms = String(parsed.symptoms || '').trim();
        const language = String(parsed.language || 'en');

        if (!symptoms) {
          sendJson(res, 400, { error: 'symptoms is required' });
          return;
        }

        let result;
        try {
          result = await resolveAnalysis(symptoms, language);
        } catch (error) {
          console.error('Falling back to rule-based analysis:', error.message);
          result = buildRuleBasedResponse(symptoms, language);
        }

        sendJson(res, 200, result);
      } catch {
        sendJson(res, 400, { error: 'Invalid JSON body' });
      }
    });

    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`NLP API server running at http://127.0.0.1:${PORT}`);
});
