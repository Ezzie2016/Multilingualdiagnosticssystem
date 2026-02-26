const {
  SYMPTOM_BANK,
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

function toConfidence(score) {
  return Math.max(0.3, Math.min(0.95, 0.3 + score * 0.5));
}

function buildDiagnoses(conditionScores) {
  const conditionsMap = getCombinedConditions();

  const ranked = Array.from(conditionScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (ranked.length === 0) {
    return [
      {
        condition: "No clear match found",
        confidence: 0.3,
        description:
          "The submitted symptom text did not confidently match the current medical knowledge bank.",
        recommendations: [
          "Describe key symptoms explicitly",
          "Include severity and duration",
          "Consult a healthcare professional for diagnosis",
        ],
      },
    ];
  }

  return ranked.map(([conditionId, score]) => {
    const condition = conditionsMap[conditionId];
    return {
      condition: condition?.name || conditionId,
      confidence: toConfidence(score),
      description:
        condition?.description || "This condition requires clinical assessment.",
      recommendations: condition?.recommendations || [
        "Consult a healthcare professional",
      ],
    };
  });
}

function analyzeWithMedicalBank(symptoms, language) {
  const symptomEntities = findSymptomMatches(symptoms, language);
  const durationEntities = findDurationEntities(symptoms);
  const severityEntities = findSeverityEntities(symptoms, language);

  const conditionScores = scoreConditions(symptomEntities, severityEntities.length);
  const diagnoses = buildDiagnoses(conditionScores);

  return {
    id: `diag-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    timestamp: new Date().toISOString(),
    language,
    symptoms,
    diagnoses,
    entities: [...symptomEntities, ...durationEntities, ...severityEntities].map(
      ({ text, type, confidence }) => ({ text, type, confidence }),
    ),
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
