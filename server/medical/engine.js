const {
  SYMPTOM_BANK,
  BODY_PART_BANK,
  CONDITION_BANK,
  SYMPTOM_CONDITION_WEIGHTS,
  SEVERITY_TERMS,
  DURATION_REGEX,
} = require("./knowledgeBank");

let externalMedicalBank = {
  source: null,
  updatedAt: null,
  symptoms: [],
  conditions: {},
  weights: {},
};

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, " ");
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function getLanguageCandidates(language) {
  const normalized = String(language || "en").toLowerCase();
  return normalized === "en" ? ["en"] : [normalized, "en"];
}

function sanitizeSymptoms(symptoms) {
  if (!Array.isArray(symptoms)) return [];
  return symptoms
    .map((item) => {
      const id = String(item?.id || "").trim();
      if (!id) return null;

      const labels = item?.labels && typeof item.labels === "object" ? item.labels : {};
      const cleanLabels = {};

      for (const [lang, values] of Object.entries(labels)) {
        const clean = Array.isArray(values)
          ? values.map((v) => String(v || "").trim()).filter(Boolean)
          : [];
        if (clean.length > 0) cleanLabels[String(lang).toLowerCase()] = clean;
      }

      if (!cleanLabels.en) {
        const fallback = Object.values(cleanLabels).find((list) => list.length > 0);
        if (fallback) cleanLabels.en = fallback;
      }

      return Object.keys(cleanLabels).length > 0 ? { id, labels: cleanLabels } : null;
    })
    .filter(Boolean);
}

function sanitizeConditions(conditions) {
  if (!conditions || typeof conditions !== "object") return {};
  const clean = {};

  for (const [id, value] of Object.entries(conditions)) {
    const conditionId = String(id || "").trim();
    if (!conditionId) continue;

    const name = String(value?.name || conditionId).trim();
    const description = String(
      value?.description || "Condition imported from external terminology.",
    ).trim();
    const recommendations = Array.isArray(value?.recommendations)
      ? value.recommendations.map((r) => String(r || "").trim()).filter(Boolean).slice(0, 6)
      : ["Consult a healthcare professional for diagnosis"];

    clean[conditionId] = { name, description, recommendations };
  }

  return clean;
}

function sanitizeWeights(weights) {
  if (!weights || typeof weights !== "object") return {};
  const clean = {};

  for (const [symptomId, links] of Object.entries(weights)) {
    if (!links || typeof links !== "object") continue;
    const symptomKey = String(symptomId || "").trim();
    if (!symptomKey) continue;

    const cleanLinks = {};
    for (const [conditionId, rawWeight] of Object.entries(links)) {
      const conditionKey = String(conditionId || "").trim();
      if (!conditionKey) continue;
      const weight = Number(rawWeight);
      if (!Number.isFinite(weight)) continue;
      cleanLinks[conditionKey] = Math.max(0.05, Math.min(1, weight));
    }

    if (Object.keys(cleanLinks).length > 0) clean[symptomKey] = cleanLinks;
  }

  return clean;
}

function mergeSymptoms(staticSymptoms, dynamicSymptoms) {
  const byId = new Map();

  for (const item of staticSymptoms) {
    byId.set(item.id, { id: item.id, labels: { ...item.labels } });
  }

  for (const item of dynamicSymptoms) {
    const existing = byId.get(item.id);
    if (!existing) {
      byId.set(item.id, { id: item.id, labels: { ...item.labels } });
      continue;
    }

    const mergedLabels = { ...existing.labels };
    for (const [lang, values] of Object.entries(item.labels)) {
      const current = mergedLabels[lang] || [];
      mergedLabels[lang] = Array.from(new Set([...current, ...values]));
    }

    byId.set(item.id, { id: item.id, labels: mergedLabels });
  }

  return Array.from(byId.values());
}

function mergeWeights(staticWeights, dynamicWeights) {
  const merged = { ...staticWeights };

  for (const [symptomId, links] of Object.entries(dynamicWeights)) {
    merged[symptomId] = {
      ...(merged[symptomId] || {}),
      ...links,
    };
  }

  return merged;
}

function getCombinedSymptoms() {
  return mergeSymptoms(SYMPTOM_BANK, externalMedicalBank.symptoms);
}

function getCombinedConditions() {
  return {
    ...CONDITION_BANK,
    ...externalMedicalBank.conditions,
  };
}

function getCombinedWeights() {
  return mergeWeights(SYMPTOM_CONDITION_WEIGHTS, externalMedicalBank.weights);
}

function findSymptomMatches(symptomsText, language) {
  const normalizedText = normalizeText(symptomsText);
  const languages = getLanguageCandidates(language);
  const matches = [];
  const combinedSymptoms = getCombinedSymptoms();

  for (const symptom of combinedSymptoms) {
    for (const lang of languages) {
      const labels = symptom.labels[lang] || [];
      const found = labels.find((label) =>
        normalizedText.includes(normalizeText(label)),
      );
      if (found) {
        matches.push({
          id: symptom.id,
          text: found,
          type: "symptom",
          confidence: 0.86,
        });
        break;
      }
    }
  }

  return uniqueById(matches);
}

function findBodyPartEntities(symptomsText, language) {
  const normalizedText = normalizeText(symptomsText);
  const languages = getLanguageCandidates(language);
  const matches = [];

  for (const bodyPart of BODY_PART_BANK) {
    for (const lang of languages) {
      const labels = bodyPart.labels[lang] || [];
      const found = labels.find((label) =>
        normalizedText.includes(normalizeText(label)),
      );
      if (found) {
        matches.push({
          id: bodyPart.id,
          text: found,
          type: "body_part",
          confidence: 0.84,
        });
        break;
      }
    }
  }

  return uniqueById(matches);
}

function findSeverityEntities(symptomsText, language) {
  const normalizedText = normalizeText(symptomsText);
  const languages = getLanguageCandidates(language);
  const entities = [];

  for (const lang of languages) {
    const terms = SEVERITY_TERMS[lang] || [];
    for (const term of terms) {
      if (normalizedText.includes(normalizeText(term))) {
        entities.push({
          id: `severity_${term}`,
          text: term,
          type: "severity",
          confidence: 0.82,
        });
      }
    }
  }

  return uniqueById(entities);
}

function findDurationEntities(symptomsText) {
  const matches = [];
  const raw = String(symptomsText || "");
  let result = DURATION_REGEX.exec(raw);

  while (result) {
    matches.push({
      id: `duration_${result[0]}`,
      text: result[0],
      type: "duration",
      confidence: 0.9,
    });
    result = DURATION_REGEX.exec(raw);
  }

  DURATION_REGEX.lastIndex = 0;
  return uniqueById(matches);
}

function scoreConditions(symptomMatches, severityCount) {
  const scores = new Map();
  const weightsMap = getCombinedWeights();

  for (const match of symptomMatches) {
    const weights = weightsMap[match.id] || {};
    for (const [conditionId, weight] of Object.entries(weights)) {
      scores.set(conditionId, (scores.get(conditionId) || 0) + weight);
    }
  }

  if (severityCount > 0) {
    for (const [conditionId, base] of scores.entries()) {
      const severeBoost = ["angina_or_acs", "asthma_exacerbation"].includes(conditionId)
        ? 0.12
        : 0.06;
      scores.set(conditionId, base + severeBoost * Math.min(2, severityCount));
    }
  }

  return scores;
}

/**
 * Convert a raw symptom-match score into a calibrated confidence value.
 *
 * Two adjustments are applied on top of the base linear mapping:
 *
 * 1. Entity-count penalty: when the fallback engine detects very few
 *    entities (< 2 symptoms) the extraction quality is likely poor —
 *    either because the user wrote very little, or because the phrase
 *    didn't match any keyword. We cap confidence at 0.55 in that case
 *    so the UI cannot show a "High" badge on a single-symptom match.
 *
 * 2. Hard floor/ceiling: confidence is always kept in [0.30, 0.95] to
 *    avoid implying certainty or complete uselessness.
 *
 * @param {number} score       - raw weighted symptom-condition score
 * @param {number} entityCount - total number of extracted entities
 */
function toConfidence(score, entityCount = 0) {
  const base = 0.3 + score * 0.5;

  // Penalise weak extraction: fewer than 2 symptom entities → cap at 0.55
  const extractionCap = entityCount < 2 ? 0.55 : 0.95;

  return Math.max(0.3, Math.min(extractionCap, base));
}

// Localised strings for the no-match fallback and generic fallback recommendations
const FALLBACK_STRINGS = {
  en: {
    condition:       "No clear match found",
    description:     "The submitted symptom text did not confidently match the current medical knowledge bank.",
    rec1:            "Describe your key symptoms more explicitly",
    rec2:            "Include how long symptoms have lasted and how severe they are",
    rec3:            "Consult a healthcare professional for a proper diagnosis",
    genericRec:      "Consult a healthcare professional",
    genericDesc:     "This condition requires clinical assessment.",
  },
  yo: {
    condition:       "Ko si ibamu to pe",
    description:     "Apejuwe aami aisan ti a fi silẹ ko baamu si ohun ti o wa ninu ile-iṣẹ iṣoogun lọwọlọwọ.",
    rec1:            "Ṣapejuwe awọn aami aisan akọkọ rẹ ni kedere",
    rec2:            "Fi kun bi o ṣe pẹ to ati bii o ṣe burú",
    rec3:            "Kan si alamọdaju ilera fun iwadii to peye",
    genericRec:      "Kan si alamọdaju ilera",
    genericDesc:     "Ipo yii nilo iṣayẹwo ile-iwosan.",
  },
  ig: {
    condition:       "Enweghị njikọ doro anya",
    description:     "Akụkọ mgbaàmà e nyefere adabaghị nke ọma na ụlọ ọrụ ahụike ugbu a.",
    rec1:            "Kọọ mgbaàmà ndị isi gị n'ụzọ doro anya",
    rec2:            "Tinye oge o ruo na ịdị njọ ya",
    rec3:            "Kpọtụrụ ọkachamara ahụike maka nyocha ziri ezi",
    genericRec:      "Kpọtụrụ ọkachamara ahụike",
    genericDesc:     "Ọnọdụ a chọrọ nyocha ụlọ ọgwụ.",
  },
  ha: {
    condition:       "Ba a sami dacewa ba",
    description:     "Rubutun alamomin cuta da aka aika bai yi dacewa da bayanan ƙwaƙwalwa na asibiti na yanzu ba.",
    rec1:            "Bayyana alamomin cutar ku a sarari",
    rec2:            "Haɗa da tsawon lokaci da tsananin ciwo",
    rec3:            "Tuntubi ƙwararren ma'aikacin lafiya don ganewar da ta dace",
    genericRec:      "Tuntubi ƙwararren ma'aikacin lafiya",
    genericDesc:     "Wannan yanayin yana buƙatar kimantawa na asibiti.",
  },
  pcm: {
    condition:       "We no find any match",
    description:     "The symptoms wey you write no match anything wey dey inside our medical system now.",
    rec1:            "Describe your symptoms clearly",
    rec2:            "Add how long e don dey and how e bad",
    rec3:            "Abeg go see proper doctor for correct diagnosis",
    genericRec:      "Go see proper doctor",
    genericDesc:     "This condition need doctor to check am.",
  },
};

function getFallback(language) {
  return FALLBACK_STRINGS[language] || FALLBACK_STRINGS.en;
}

function buildDiagnoses(conditionScores, entityCount = 0, language = "en") {
  const conditionsMap = getCombinedConditions();
  const fb = getFallback(language);

  const ranked = Array.from(conditionScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (ranked.length === 0) {
    return [
      {
        condition:   fb.condition,
        confidence:  0.3,
        description: fb.description,
        recommendations: [fb.rec1, fb.rec2, fb.rec3],
      },
    ];
  }

  return ranked.map(([conditionId, score]) => {
    const condition = conditionsMap[conditionId];
    return {
      condition:   condition?.name    || conditionId,
      confidence:  toConfidence(score, entityCount),
      description: condition?.description || fb.genericDesc,
      recommendations: condition?.recommendations || [fb.genericRec],
    };
  });
}

function analyzeWithMedicalBank(symptoms, language) {
  const symptomEntities  = findSymptomMatches(symptoms, language);
  const bodyPartEntities = findBodyPartEntities(symptoms, language);
  const durationEntities = findDurationEntities(symptoms);
  const severityEntities = findSeverityEntities(symptoms, language);

  const allEntities = [
    ...symptomEntities,
    ...bodyPartEntities,
    ...durationEntities,
    ...severityEntities,
  ];

  // Entity count used to calibrate confidence — only symptom entities count
  // toward extraction quality (body parts / duration / severity are supplemental)
  const entityCount = symptomEntities.length;

  const conditionScores = scoreConditions(symptomEntities, severityEntities.length);
  const diagnoses = buildDiagnoses(conditionScores, entityCount, language);

  return {
    id: `diag-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    timestamp: new Date().toISOString(),
    language,
    symptoms,
    diagnoses,
    entities: allEntities.map(({ text, type, confidence }) => ({ text, type, confidence })),
  };
}

function getKnowledgeContextForPrompt(symptoms, language, maxConditions = 6) {
  const symptomEntities = findSymptomMatches(symptoms, language);
  const severityEntities = findSeverityEntities(symptoms, language);
  const conditionScores = scoreConditions(symptomEntities, severityEntities.length);
  const conditionsMap = getCombinedConditions();

  const topConditions = Array.from(conditionScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxConditions)
    .map(([conditionId]) => conditionsMap[conditionId]?.name || conditionId);

  return {
    matchedSymptoms: symptomEntities.map((item) => item.text),
    candidateConditions: topConditions,
  };
}

function searchMedicalBank(query, language) {
  const q = normalizeText(query);
  if (!q) return { symptoms: [], conditions: [] };

  const languages = getLanguageCandidates(language);
  const combinedSymptoms = getCombinedSymptoms();
  const conditionsMap = getCombinedConditions();

  const symptoms = combinedSymptoms.flatMap((symptom) => {
    for (const lang of languages) {
      const labels = symptom.labels[lang] || [];
      const label = labels.find((value) => normalizeText(value).includes(q));
      if (label) {
        return [{ id: symptom.id, label, language: lang }];
      }
    }
    return [];
  });

  const conditions = Object.entries(conditionsMap)
    .filter(([_, value]) => {
      const hay = `${value.name} ${value.description}`.toLowerCase();
      return hay.includes(q);
    })
    .slice(0, 12)
    .map(([id, value]) => ({
      id,
      name: value.name,
      description: value.description,
    }));

  return { symptoms: symptoms.slice(0, 20), conditions };
}

function upsertExternalMedicalData(payload) {
  const symptoms = sanitizeSymptoms(payload?.symptoms);
  const conditions = sanitizeConditions(payload?.conditions);
  const weights = sanitizeWeights(payload?.weights);

  externalMedicalBank = {
    source: String(payload?.source || "external-import"),
    updatedAt: new Date().toISOString(),
    symptoms,
    conditions,
    weights,
  };

  return getExternalMedicalDataStatus();
}

function getExternalMedicalDataStatus() {
  return {
    source: externalMedicalBank.source,
    updatedAt: externalMedicalBank.updatedAt,
    symptomEntries: externalMedicalBank.symptoms.length,
    conditionEntries: Object.keys(externalMedicalBank.conditions).length,
    weightedLinks: Object.values(externalMedicalBank.weights).reduce(
      (acc, links) => acc + Object.keys(links).length,
      0,
    ),
  };
}

function getMedicalBankStats() {
  const staticLinks = Object.values(SYMPTOM_CONDITION_WEIGHTS).reduce(
    (acc, links) => acc + Object.keys(links).length,
    0,
  );

  const externalLinks = Object.values(externalMedicalBank.weights).reduce(
    (acc, links) => acc + Object.keys(links).length,
    0,
  );

  return {
    symptomEntries: SYMPTOM_BANK.length + externalMedicalBank.symptoms.length,
    conditionEntries:
      Object.keys(CONDITION_BANK).length +
      Object.keys(externalMedicalBank.conditions).length,
    weightedLinks: staticLinks + externalLinks,
  };
}

module.exports = {
  analyzeWithMedicalBank,
  getKnowledgeContextForPrompt,
  searchMedicalBank,
  upsertExternalMedicalData,
  getExternalMedicalDataStatus,
  getMedicalBankStats,
};