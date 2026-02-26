function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/fhir+json, application/json" },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`FHIR request failed ${response.status}: ${body}`);
  }

  return response.json();
}

function flattenContains(contains, output = []) {
  if (!Array.isArray(contains)) return output;
  for (const item of contains) {
    output.push(item);
    if (Array.isArray(item?.contains)) flattenContains(item.contains, output);
  }
  return output;
}

async function expandValueSet({
  fhirBaseUrl,
  valueSetUrl,
  filter = "",
  count = 250,
  displayLanguage = "en",
}) {
  const root = String(fhirBaseUrl || "").replace(/\/+$/, "");
  const endpoint = `${root}/ValueSet/$expand`;
  const params = new URLSearchParams();
  params.set("url", valueSetUrl);
  params.set("count", String(count));
  params.set("displayLanguage", displayLanguage);
  if (filter) params.set("filter", filter);

  const bundle = await fetchJson(`${endpoint}?${params.toString()}`);
  const contains = flattenContains(bundle?.expansion?.contains || []);

  return contains
    .map((concept) => ({
      code: String(concept?.code || "").trim(),
      display: String(concept?.display || "").trim(),
      system: String(concept?.system || "").trim(),
    }))
    .filter((concept) => concept.display);
}

function conceptsToSymptomEntries(concepts, language) {
  const entries = [];
  for (const concept of concepts) {
    const base = concept.display || concept.code;
    const id = `ext_symptom_${slugify(base)}`;
    if (!id || id === "ext_symptom_") continue;
    entries.push({
      id,
      labels: {
        [language]: [base],
        en: [base],
      },
    });
  }
  return entries;
}

function conceptsToConditionEntries(concepts) {
  const entries = {};
  for (const concept of concepts) {
    const base = concept.display || concept.code;
    const id = `ext_condition_${slugify(base)}`;
    if (!id || id === "ext_condition_") continue;
    entries[id] = {
      name: base,
      description: `Imported clinical concept (${concept.system || "FHIR terminology"}).`,
      recommendations: [
        "Correlate with clinical history and examination",
        "Consider relevant diagnostic testing",
        "Consult a licensed healthcare professional",
      ],
    };
  }
  return entries;
}

function buildHeuristicWeights(symptoms, conditions) {
  const conditionEntries = Object.entries(conditions);
  const weights = {};

  for (const symptom of symptoms) {
    const label =
      symptom?.labels?.en?.[0] ||
      Object.values(symptom?.labels || {}).flat()[0] ||
      "";
    const symptomTokens = String(label).toLowerCase().split(/\s+/).filter(Boolean);
    if (symptomTokens.length === 0) continue;

    const links = {};
    for (const [conditionId, condition] of conditionEntries) {
      const nameTokens = String(condition?.name || "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      const overlap = symptomTokens.filter((token) => nameTokens.includes(token))
        .length;
      if (overlap > 0) {
        links[conditionId] = Math.min(0.6, 0.2 + overlap * 0.15);
      }
    }

    if (Object.keys(links).length > 0) weights[symptom.id] = links;
  }

  return weights;
}

async function syncTerminologyFromFhir({
  fhirBaseUrl,
  symptomValueSetUrl,
  conditionValueSetUrl,
  language = "en",
  filter = "",
  count = 250,
}) {
  if (!fhirBaseUrl) throw new Error("fhirBaseUrl is required");
  if (!symptomValueSetUrl && !conditionValueSetUrl) {
    throw new Error("Provide symptomValueSetUrl and/or conditionValueSetUrl");
  }

  const symptomConcepts = symptomValueSetUrl
    ? await expandValueSet({
        fhirBaseUrl,
        valueSetUrl: symptomValueSetUrl,
        filter,
        count,
        displayLanguage: language,
      })
    : [];

  const conditionConcepts = conditionValueSetUrl
    ? await expandValueSet({
        fhirBaseUrl,
        valueSetUrl: conditionValueSetUrl,
        filter,
        count,
        displayLanguage: language,
      })
    : [];

  const symptoms = conceptsToSymptomEntries(symptomConcepts, language);
  const conditions = conceptsToConditionEntries(conditionConcepts);
  const weights = buildHeuristicWeights(symptoms, conditions);

  return {
    source: `FHIR:${fhirBaseUrl}`,
    symptoms,
    conditions,
    weights,
    meta: {
      symptomConcepts: symptomConcepts.length,
      conditionConcepts: conditionConcepts.length,
    },
  };
}

module.exports = {
  syncTerminologyFromFhir,
};
