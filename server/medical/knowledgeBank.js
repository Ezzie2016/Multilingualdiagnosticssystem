const SYMPTOM_BANK = [
  {
    id: "headache",
    labels: {
      en: ["headache", "head pain", "migraine", "head pressure"],
      fr: ["mal de tete", "migraine", "douleur a la tete"],
      es: ["dolor de cabeza", "migrana"],
      de: ["kopfschmerzen", "migrane"],
    },
  },
  {
    id: "fever",
    labels: {
      en: ["fever", "high temperature", "chills", "hot body"],
      fr: ["fievre", "temperature elevee"],
      es: ["fiebre", "temperatura alta"],
      de: ["fieber", "hohe temperatur"],
    },
  },
  {
    id: "cough",
    labels: {
      en: ["cough", "coughing", "dry cough", "productive cough"],
      fr: ["toux"],
      es: ["tos"],
      de: ["husten"],
    },
  },
  {
    id: "shortness_of_breath",
    labels: {
      en: ["shortness of breath", "breathless", "difficulty breathing", "dyspnea"],
      fr: ["essoufflement", "difficulte a respirer"],
      es: ["falta de aire", "dificultad para respirar"],
      de: ["atemnot", "kurzatmigkeit"],
    },
  },
  {
    id: "chest_pain",
    labels: {
      en: ["chest pain", "chest tightness", "pressure in chest"],
      fr: ["douleur thoracique", "douleur poitrine"],
      es: ["dolor en el pecho", "opresion en el pecho"],
      de: ["brustschmerzen", "enge in der brust"],
    },
  },
  {
    id: "sore_throat",
    labels: {
      en: ["sore throat", "throat pain", "painful swallowing"],
      fr: ["mal de gorge"],
      es: ["dolor de garganta"],
      de: ["halsschmerzen"],
    },
  },
  {
    id: "runny_nose",
    labels: {
      en: ["runny nose", "nasal congestion", "stuffy nose", "blocked nose"],
      fr: ["nez qui coule", "nez bouche"],
      es: ["nariz tapada", "secrecion nasal"],
      de: ["laufende nase", "verstopfte nase"],
    },
  },
  {
    id: "nausea",
    labels: {
      en: ["nausea", "queasy", "vomit feeling"],
      fr: ["nausee"],
      es: ["nauseas"],
      de: ["ubelkeit"],
    },
  },
  {
    id: "vomiting",
    labels: {
      en: ["vomiting", "throwing up", "emesis"],
      fr: ["vomissement"],
      es: ["vomitos"],
      de: ["erbrechen"],
    },
  },
  {
    id: "diarrhea",
    labels: {
      en: ["diarrhea", "loose stool", "watery stool"],
      fr: ["diarrhee"],
      es: ["diarrea"],
      de: ["durchfall"],
    },
  },
  {
    id: "abdominal_pain",
    labels: {
      en: ["abdominal pain", "stomach pain", "belly pain", "cramps"],
      fr: ["douleur abdominale", "mal au ventre"],
      es: ["dolor abdominal", "dolor de estomago"],
      de: ["bauchschmerzen"],
    },
  },
  {
    id: "back_pain",
    labels: {
      en: ["back pain", "lower back pain", "lumbar pain"],
      fr: ["douleur au dos", "mal de dos"],
      es: ["dolor de espalda"],
      de: ["ruckenschmerzen"],
    },
  },
  {
    id: "joint_pain",
    labels: {
      en: ["joint pain", "joint swelling", "arthralgia"],
      fr: ["douleur articulaire"],
      es: ["dolor articular"],
      de: ["gelenkschmerzen"],
    },
  },
  {
    id: "fatigue",
    labels: {
      en: ["fatigue", "tiredness", "weakness", "exhaustion"],
      fr: ["fatigue"],
      es: ["fatiga", "cansancio"],
      de: ["mudigkeit", "erschopfung"],
    },
  },
  {
    id: "dizziness",
    labels: {
      en: ["dizziness", "lightheaded", "vertigo"],
      fr: ["etourdissements", "vertige"],
      es: ["mareos", "vertigo"],
      de: ["schwindel"],
    },
  },
  {
    id: "rash",
    labels: {
      en: ["rash", "skin rash", "itching", "hives"],
      fr: ["eruption cutanee", "demangeaison"],
      es: ["sarpullido", "picazon"],
      de: ["hautausschlag", "juckreiz"],
    },
  },
  {
    id: "palpitations",
    labels: {
      en: ["palpitations", "racing heart", "heart pounding"],
      fr: ["palpitations"],
      es: ["palpitaciones"],
      de: ["herzrasen"],
    },
  },
  {
    id: "urinary_pain",
    labels: {
      en: ["painful urination", "burning urination", "dysuria"],
      fr: ["brulure urinaire"],
      es: ["ardor al orinar"],
      de: ["brennen beim wasserlassen"],
    },
  },
];

const CONDITION_BANK = {
  common_cold: {
    name: "Common Cold",
    description:
      "A viral upper respiratory infection with runny nose, sore throat, cough, and mild fatigue.",
    recommendations: [
      "Hydrate well and rest",
      "Use saline nasal spray for congestion",
      "Use symptomatic relief for fever or pain",
      "Seek care if symptoms worsen after day 5",
    ],
  },
  influenza: {
    name: "Influenza",
    description:
      "An acute viral respiratory infection with fever, body aches, cough, and fatigue.",
    recommendations: [
      "Rest and oral hydration",
      "Monitor fever and breathing",
      "Use antipyretics if needed",
      "Seek urgent care for breathing difficulty or persistent high fever",
    ],
  },
  covid19: {
    name: "COVID-19",
    description:
      "A viral respiratory illness that may include fever, cough, sore throat, fatigue, and breathing symptoms.",
    recommendations: [
      "Self-isolate while symptomatic",
      "Hydrate and monitor oxygen/breathing",
      "Seek urgent care for shortness of breath or chest pain",
      "Follow local public health guidance",
    ],
  },
  acute_bronchitis: {
    name: "Acute Bronchitis",
    description:
      "Inflammation of bronchi, often after viral infection, causing cough and chest discomfort.",
    recommendations: [
      "Rest and hydrate",
      "Avoid smoke and irritants",
      "Use warm fluids or humidified air",
      "See clinician if cough persists beyond 3 weeks",
    ],
  },
  asthma_exacerbation: {
    name: "Asthma Exacerbation",
    description:
      "Worsening airway inflammation causing shortness of breath, wheeze, and cough.",
    recommendations: [
      "Use prescribed rescue inhaler",
      "Avoid known triggers",
      "Monitor response within minutes",
      "Seek emergency care if symptoms are severe or persistent",
    ],
  },
  angina_or_acs: {
    name: "Possible Angina / Acute Coronary Syndrome",
    description:
      "Chest discomfort and breathlessness may indicate cardiac ischemia and requires urgent evaluation.",
    recommendations: [
      "Stop activity and sit down",
      "Seek emergency care immediately",
      "Do not self-drive if severe symptoms are present",
      "Report symptom onset time and radiation pattern",
    ],
  },
  gastroenteritis: {
    name: "Acute Gastroenteritis",
    description:
      "GI infection or irritation with nausea, vomiting, diarrhea, and abdominal cramps.",
    recommendations: [
      "Use oral rehydration solution",
      "Eat bland foods as tolerated",
      "Avoid high-fat or spicy foods temporarily",
      "Seek care if dehydration signs appear",
    ],
  },
  gastritis_or_dyspepsia: {
    name: "Gastritis / Dyspepsia",
    description:
      "Upper abdominal discomfort with nausea and bloating due to gastric irritation.",
    recommendations: [
      "Avoid trigger foods and alcohol",
      "Try small frequent meals",
      "Use clinician-advised acid suppression if needed",
      "Seek care for persistent pain or GI bleeding signs",
    ],
  },
  migraine: {
    name: "Migraine",
    description:
      "A recurrent headache disorder often associated with nausea, light sensitivity, and functional impairment.",
    recommendations: [
      "Rest in a dark and quiet room",
      "Hydrate",
      "Use clinician-approved analgesia early",
      "Seek care for sudden worst-ever headache",
    ],
  },
  tension_headache: {
    name: "Tension-Type Headache",
    description:
      "Common bilateral pressure-like headache often linked to stress, sleep disruption, or muscle tension.",
    recommendations: [
      "Hydrate and rest",
      "Neck/shoulder stretching",
      "Limit prolonged screen strain",
      "Seek review if headaches become frequent",
    ],
  },
  vertigo_disorder: {
    name: "Vertigo / Vestibular Disorder",
    description:
      "Dizziness with motion sensation can arise from vestibular dysfunction or blood pressure changes.",
    recommendations: [
      "Sit or lie down during episodes",
      "Avoid sudden head movements",
      "Maintain hydration",
      "Seek clinical review for recurrent or severe episodes",
    ],
  },
  musculoskeletal_back_pain: {
    name: "Musculoskeletal Back Pain",
    description:
      "Back pain from muscle strain or mechanical stress, common after overuse or posture strain.",
    recommendations: [
      "Relative rest with gentle movement",
      "Use heat or cold packs",
      "Avoid heavy lifting temporarily",
      "Seek urgent care for weakness, numbness, or bladder changes",
    ],
  },
  arthritis: {
    name: "Arthralgia / Arthritis Pattern",
    description:
      "Joint pain and stiffness can result from inflammatory or degenerative joint disorders.",
    recommendations: [
      "Reduce high-impact activity",
      "Use local heat/cold",
      "Track swollen or painful joints",
      "Consult clinician for persistent symptoms",
    ],
  },
  dermatitis: {
    name: "Dermatitis / Allergic Rash",
    description:
      "Skin inflammation may present with rash and itching due to allergy, irritation, or infection.",
    recommendations: [
      "Avoid suspected irritants",
      "Use fragrance-free moisturizers",
      "Avoid scratching",
      "Seek care if spreading, painful, or fever-associated",
    ],
  },
  uti: {
    name: "Possible Urinary Tract Infection",
    description:
      "Painful urination with urinary discomfort can indicate lower urinary tract infection.",
    recommendations: [
      "Hydrate well",
      "Seek clinician for urinalysis and treatment",
      "Avoid delaying care with fever or flank pain",
      "Complete prescribed antibiotics if diagnosed",
    ],
  },
  anxiety_related: {
    name: "Anxiety-Related Somatic Symptoms",
    description:
      "Palpitations, chest discomfort, and breathlessness can occur with anxiety but organic causes must be excluded.",
    recommendations: [
      "Use slow breathing techniques",
      "Reduce caffeine and stimulants",
      "Seek urgent care if chest pain is severe or new",
      "Arrange clinical follow-up for persistent symptoms",
    ],
  },
  chronic_fatigue_pattern: {
    name: "Fatigue Syndrome Pattern",
    description:
      "Persistent fatigue may be due to sleep issues, endocrine factors, mood disorders, or chronic illness.",
    recommendations: [
      "Track sleep and fatigue patterns",
      "Optimize hydration and nutrition",
      "Reduce alcohol and late caffeine",
      "Seek clinical workup if symptoms persist beyond 2 weeks",
    ],
  },
};

const SYMPTOM_CONDITION_WEIGHTS = {
  headache: { migraine: 0.8, tension_headache: 0.7, influenza: 0.35, covid19: 0.35 },
  fever: { influenza: 0.85, covid19: 0.75, gastroenteritis: 0.45, common_cold: 0.25, uti: 0.3 },
  cough: { common_cold: 0.5, influenza: 0.65, covid19: 0.65, acute_bronchitis: 0.8, asthma_exacerbation: 0.45 },
  shortness_of_breath: { asthma_exacerbation: 0.9, angina_or_acs: 0.85, anxiety_related: 0.55, covid19: 0.55 },
  chest_pain: { angina_or_acs: 0.95, anxiety_related: 0.55, acute_bronchitis: 0.3, gastritis_or_dyspepsia: 0.3 },
  sore_throat: { common_cold: 0.7, influenza: 0.45, covid19: 0.55 },
  runny_nose: { common_cold: 0.8, influenza: 0.35, covid19: 0.25 },
  nausea: { gastroenteritis: 0.8, gastritis_or_dyspepsia: 0.7, migraine: 0.5, influenza: 0.3 },
  vomiting: { gastroenteritis: 0.85, gastritis_or_dyspepsia: 0.6, migraine: 0.4 },
  diarrhea: { gastroenteritis: 0.9, covid19: 0.25 },
  abdominal_pain: { gastroenteritis: 0.75, gastritis_or_dyspepsia: 0.7, uti: 0.25 },
  back_pain: { musculoskeletal_back_pain: 0.85, uti: 0.25, arthritis: 0.25 },
  joint_pain: { arthritis: 0.9, influenza: 0.35, covid19: 0.25 },
  fatigue: { influenza: 0.55, covid19: 0.5, chronic_fatigue_pattern: 0.8, anxiety_related: 0.35 },
  dizziness: { vertigo_disorder: 0.85, anxiety_related: 0.4, angina_or_acs: 0.2 },
  rash: { dermatitis: 0.9, covid19: 0.2 },
  palpitations: { anxiety_related: 0.7, angina_or_acs: 0.6 },
  urinary_pain: { uti: 0.95 },
};

const SEVERITY_TERMS = {
  en: ["severe", "worst", "intense", "crushing", "sharp", "worsening", "persistent"],
  fr: ["severe", "intense", "grave", "aggravation", "persistant"],
  es: ["severo", "intenso", "grave", "empeorando", "persistente"],
  de: ["stark", "schlimm", "intensiv", "zunehmend", "anhaltend"],
};

const DURATION_REGEX = /\b(\d+)\s*(minutes?|hours?|days?|weeks?|months?)\b/gi;

module.exports = {
  SYMPTOM_BANK,
  CONDITION_BANK,
  SYMPTOM_CONDITION_WEIGHTS,
  SEVERITY_TERMS,
  DURATION_REGEX,
};
