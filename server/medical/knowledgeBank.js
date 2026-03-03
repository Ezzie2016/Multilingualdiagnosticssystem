// ─── Supported languages: en, yo (Yoruba), ig (Igbo), ha (Hausa), pcm (Nigerian Pidgin)

const SYMPTOM_BANK = [
  {
    id: "headache",
    labels: {
      en:  ["headache", "head pain", "migraine", "head pressure", "my head is pounding"],
      yo:  ["orififo", "ori n dun mi", "ori mi n ran", "cephalgia", "ori mi ro"],
      ig:  ["isi ọwụwa", "isi na awa m", "isi mgbu", "isi na atọ m ọhụhụ"],
      ha:  ["ciwon kai", "kai yana ciwo", "kai na ture", "kai na yi min zafi"],
      pcm: ["head dey pain me", "my head dey do me", "head dey beat me", "head pain", "my head dey pound"],
    },
  },
  {
    id: "fever",
    labels: {
      en:  ["fever", "high temperature", "chills", "hot body", "running temperature", "feeling hot"],
      yo:  ["iba", "ara mi gbona", "iba n ba mi", "otutu n ba mi", "ara gbona"],
      ig:  ["ọkụ ahụ", "ahụ ọkụ", "oyi na ọkụ", "ahụ na ekpo ọkụ", "ahụ na-ekpo m ọkụ"],
      ha:  ["zazzabi", "jiki na zafi", "sanyi da zafi", "zazzabin jiki", "jikina na yi zafi"],
      pcm: ["fever", "my body dey hot", "temperature dey high", "i dey shiver", "hot body", "body dey do me"],
    },
  },
  {
    id: "cough",
    labels: {
      en:  ["cough", "coughing", "dry cough", "productive cough", "persistent cough", "chest cough"],
      yo:  ["ikọ", "mo n kọ", "iko gbigbe", "iko n ba mi", "mo ma n kọ kọ"],
      ig:  ["ọkwa", "na-akwa akwa", "ọkwa ọkwa", "a na m akwa", "ọkwa mmiri"],
      ha:  ["tari", "ina tari", "buhu", "tarin bushewa", "tarin amai"],
      pcm: ["cough", "i dey cough", "cough dey worry me", "dry cough", "i dey kof kof"],
    },
  },
  {
    id: "shortness_of_breath",
    labels: {
      en:  ["shortness of breath", "breathless", "difficulty breathing", "dyspnea", "can't breathe", "breathing problems"],
      yo:  ["mimi n ke mi", "mo n pari emi", "emi ko to mi", "isoro imi", "emi n ko mi le"],
      ig:  ["iku ume ike", "ume adịghị m", "o siri m ike iku ume", "ume a naghị abịa m"],
      ha:  ["wahalar numfashi", "numfashi yana wahala", "ina wahalar shakar iska", "ba zan iya numfashi ba"],
      pcm: ["i no fit breathe", "breath short", "breathing hard", "i dey struggle to breathe", "chest tight no let me breathe"],
    },
  },
  {
    id: "chest_pain",
    labels: {
      en:  ["chest pain", "chest tightness", "pressure in chest", "chest discomfort", "pain in chest"],
      yo:  ["irora àyà", "àyà n dun mi", "àyà mi n ro mi", "wiwọ àyà", "àyà di lile"],
      ig:  ["ọwụwa obi", "obi na awa m", "mgbu n'obi", "obi di m mgbu", "mgbu n'ọwụwa obi"],
      ha:  ["ciwon kirji", "kirji na ciwo", "kirjina yana ciwo", "matsin kirji", "zafi a kirji"],
      pcm: ["chest dey pain me", "my chest dey do me", "chest tight", "pain for chest", "something dey press my chest"],
    },
  },
  {
    id: "sore_throat",
    labels: {
      en:  ["sore throat", "throat pain", "painful swallowing", "scratchy throat", "throat is burning"],
      yo:  ["ọfun n dun mi", "irora ọfun", "ọfun mi n gbona", "gbigbẹ ọfun", "ọfun di lile"],
      ig:  ["ọnọ mgbu", "ọnọ na awa m", "mgbu n'ọnọ", "ọnọ na-awa m mgbu"],
      ha:  ["ciwon makogaro", "makogaro yana ciwo", "makogaro na yi min ciwo", "zafi a makogaro"],
      pcm: ["my throat dey pain me", "throat dey do me", "e pain me to swallow", "throat dey scratch", "sore throat"],
    },
  },
  {
    id: "runny_nose",
    labels: {
      en:  ["runny nose", "nasal congestion", "stuffy nose", "blocked nose", "nose running"],
      yo:  ["imu n ṣàn", "imu di dina", "imu n ta omi", "omi n jade lati imu mi"],
      ig:  ["imi na arịba", "imi na-arịba", "mmiri si n'imi m", "imi jị"],
      ha:  ["hanci ya zube", "hanci yana gudana", "hanci ya sumbuce", "ruwa daga hanci"],
      pcm: ["nose dey run", "catarrh", "nose block", "my nose dey run water", "my nose block"],
    },
  },
  {
    id: "nausea",
    labels: {
      en:  ["nausea", "queasy", "feel like vomiting", "stomach upset", "feeling sick"],
      yo:  ["inu riru", "inu mi n riru", "eebi fẹ jade", "inu mi n daru", "mo fẹ eebi"],
      ig:  ["ọfụfụ afọ", "afọ na-atọ m ọhụhụ", "ọnụ na-acha m ọcha", "a chọrọ m ị pụọ"],
      ha:  ["amai", "zukata tana tashi", "ina ji yunwar amai", "ciki yana tashin hankali"],
      pcm: ["i wan vomit", "nausea dey do me", "my stomach dey turn", "i feel like to vomit", "belle dey do me"],
    },
  },
  {
    id: "vomiting",
    labels: {
      en:  ["vomiting", "throwing up", "emesis", "puking", "been vomiting"],
      yo:  ["eebi", "mo n eebi", "gbigbe jade", "eebi n jade", "mo ti n eebi"],
      ig:  ["ịpụọ nri", "a pụọla m nri", "a na m apụọ", "ọ pụọla m n'ọnụ"],
      ha:  ["amai", "ina amai", "na yi amai", "abinci ya fito daga ciki"],
      pcm: ["i don vomit", "i dey purge for mouth", "i dey throw up", "vomiting", "food come back"],
    },
  },
  {
    id: "diarrhea",
    labels: {
      en:  ["diarrhea", "loose stool", "watery stool", "running stomach", "frequent stools"],
      yo:  ["igbe gbuuru", "igbe omi", "ikun mi n gbuuru", "mo n gbuuru", "igbe n ba mi"],
      ig:  ["afọ ọsọ", "afọ na-agba m ọsọ", "nsi mmiri", "afọ na-eme m ihe"],
      ha:  ["zawo", "ciki yana zuwa", "gudanar da najasa", "manyan amai", "ciki na gudana"],
      pcm: ["running stomach", "purging", "stooling anyhow", "my belle loose", "toilet dey worry me"],
    },
  },
  {
    id: "abdominal_pain",
    labels: {
      en:  ["abdominal pain", "stomach pain", "belly pain", "stomach cramps", "pain in stomach"],
      yo:  ["irora inú", "inú n dun mi", "ikun mi n dun", "inú mi ro mi", "inu dun"],
      ig:  ["ọwụwa afọ", "afọ na awa m", "mgbu n'afọ", "afọ di m mgbu", "afọ na-awa m"],
      ha:  ["ciwon ciki", "ciki yana ciwo", "cikina ya ciwo", "zafi a ciki", "ciki na zafi"],
      pcm: ["belle dey pain me", "my stomach dey do me", "belle dey worry me", "stomach pain", "my belle dey ache"],
    },
  },
  {
    id: "back_pain",
    labels: {
      en:  ["back pain", "lower back pain", "lumbar pain", "backache", "spine pain"],
      yo:  ["irora ẹhin", "ẹhin mi n dun", "egbọn mi n dun mi", "irora ẹhin isalẹ"],
      ig:  ["ọwụwa azụ", "azụ na awa m", "mgbu n'azụ", "azụ di m mgbu"],
      ha:  ["ciwon baya", "baya yana ciwo", "bayana ya ciwo", "zafi a baya"],
      pcm: ["back dey pain me", "my back dey do me", "back pain", "waist dey pain me", "my back dey ache"],
    },
  },
  {
    id: "joint_pain",
    labels: {
      en:  ["joint pain", "joint swelling", "arthralgia", "painful joints", "stiff joints"],
      yo:  ["irora iṣan", "irora ẹsẹ", "ara mi n dun", "arun egbọn", "iṣan n dun mi"],
      ig:  ["ọwụwa ọkpụkpụ", "ọkpụkpụ na awa m", "mgbu n'ọkpụkpụ", "ọkpụkpụ di m mgbu"],
      ha:  ["ciwon gabbai", "gabbai yana ciwo", "ciwon gabobi", "gabobi na yi ciwo"],
      pcm: ["my joint dey pain", "body dey ache", "my knee dey do me", "joint dey pain me", "body pain everywhere"],
    },
  },
  {
    id: "fatigue",
    labels: {
      en:  ["fatigue", "tiredness", "weakness", "exhaustion", "no energy", "feeling weak"],
      yo:  ["arẹwèsì", "ara mi rẹ", "ailera", "ara mi ko lagbara", "mo rẹ gidigidi"],
      ig:  ["aghara", "a rara m ike", "ike adịghị m", "ahụ adịghị m mma", "m rara ike"],
      ha:  ["gajiya", "jikin gajiya", "rashin karfi", "jikina ya gaji", "ina gajiya"],
      pcm: ["body weak", "i dey tired", "no energy", "weakness", "my body no get power", "i weak well well"],
    },
  },
  {
    id: "dizziness",
    labels: {
      en:  ["dizziness", "lightheaded", "vertigo", "spinning", "feeling faint"],
      yo:  ["iwọra", "ori mi n yi", "ori mi n yiyi", "aini iduro", "ori mi n gbọn"],
      ig:  ["isi ntụrụ", "isi na-atụrụ m", "a na m atụrụ", "isi na-agba m ume"],
      ha:  ["jiri jiri", "kaikayi", "kai na juyawa", "ji kamar za a fadi"],
      pcm: ["head dey spin", "i dey dizzy", "head dey turn turn", "everything dey whirl", "i feel like to fall"],
    },
  },
  {
    id: "rash",
    labels: {
      en:  ["rash", "skin rash", "itching", "hives", "skin irritation", "body itching"],
      yo:  ["ẹgbò awọ", "awọ ara n yun mi", "yun ara", "nkan n jade lori ara mi"],
      ig:  ["ọbara n'anụ ahụ", "anụ ahụ na-acha", "ọchịchọ anụ ahụ", "ihe na-apụ n'ahụ"],
      ha:  ["kurji", "fatar jiki na kaikayi", "ƙaiƙayin jiki", "kurjin fata"],
      pcm: ["rash dey my body", "my body dey scratch", "body dey itch me", "something dey come out for skin", "skin rash"],
    },
  },
  {
    id: "palpitations",
    labels: {
      en:  ["palpitations", "racing heart", "heart pounding", "heart beating fast", "irregular heartbeat"],
      yo:  ["ọkàn mi n lu yara", "ọkàn mi n lu pọ", "ọkàn mi n fo", "ọkàn lu ju"],
      ig:  ["obi na-akụ ọsọ", "obi na-akụ akụ", "obi na-akụ m ike", "obi di ihe"],
      ha:  ["zuciya na fada", "zuciya na bugawa da sauri", "zuciya na yi kamar za ta fado"],
      pcm: ["my heart dey beat fast", "heart dey race", "heart dey pound", "my heart dey do me"],
    },
  },
  {
    id: "urinary_pain",
    labels: {
      en:  ["painful urination", "burning urination", "dysuria", "pain when urinating", "stinging when peeing"],
      yo:  ["irora nigbati mo n tọ", "ito n jo mi", "gbigbona nigba ito", "ito dun"],
      ig:  ["ọwụwa mgbe m na-asa", "ọsọ mgbe m na-asa", "ịsa na-awa m mgbu"],
      ha:  ["zafi yayin fitsari", "fitsari yana ciwo", "kone yayin fitsari"],
      pcm: ["e burn me when i dey pee", "pain when i dey urinate", "my pee dey pain me", "burning when peeing"],
    },
  },
];

const CONDITION_BANK = {
  common_cold: {
    name: "Common Cold",
    description: "A viral upper respiratory infection with runny nose, sore throat, cough, and mild fatigue.",
    recommendations: [
      "Hydrate well and rest",
      "Use saline nasal spray for congestion",
      "Use symptomatic relief for fever or pain",
      "Seek care if symptoms worsen after day 5",
    ],
  },
  influenza: {
    name: "Influenza",
    description: "An acute viral respiratory infection with fever, body aches, cough, and fatigue.",
    recommendations: [
      "Rest and drink plenty of fluids",
      "Monitor fever and breathing",
      "Use paracetamol or ibuprofen to manage fever",
      "Seek urgent care for breathing difficulty or persistent high fever",
    ],
  },
  covid19: {
    name: "COVID-19",
    description: "A viral respiratory illness that may include fever, cough, sore throat, fatigue, and breathing symptoms.",
    recommendations: [
      "Self-isolate while symptomatic",
      "Hydrate and monitor oxygen and breathing",
      "Seek urgent care for shortness of breath or chest pain",
      "Follow local public health guidance",
    ],
  },
  acute_bronchitis: {
    name: "Acute Bronchitis",
    description: "Inflammation of bronchi, often after viral infection, causing cough and chest discomfort.",
    recommendations: [
      "Rest and hydrate",
      "Avoid smoke and irritants",
      "Use warm fluids or steam inhalation",
      "See a clinician if cough persists beyond 3 weeks",
    ],
  },
  asthma_exacerbation: {
    name: "Asthma Exacerbation",
    description: "Worsening airway inflammation causing shortness of breath, wheeze, and cough.",
    recommendations: [
      "Use your prescribed rescue inhaler immediately",
      "Avoid known triggers such as dust and smoke",
      "Monitor your response within minutes",
      "Seek emergency care if symptoms are severe or not improving",
    ],
  },
  angina_or_acs: {
    name: "Possible Angina / Acute Coronary Syndrome",
    description: "Chest discomfort and breathlessness may indicate cardiac ischemia and requires urgent evaluation.",
    recommendations: [
      "Stop all activity and sit or lie down",
      "Seek emergency care immediately — call an ambulance",
      "Do not drive yourself to the hospital",
      "Note the time symptoms started and whether pain spreads to arm or jaw",
    ],
  },
  gastroenteritis: {
    name: "Acute Gastroenteritis",
    description: "GI infection or irritation with nausea, vomiting, diarrhea, and abdominal cramps.",
    recommendations: [
      "Use oral rehydration solution (ORS) to replace fluids",
      "Eat bland foods like rice, banana, or toast when able",
      "Avoid fatty or spicy foods temporarily",
      "Seek care if signs of dehydration appear — dry mouth, no urine, sunken eyes",
    ],
  },
  gastritis_or_dyspepsia: {
    name: "Gastritis / Dyspepsia",
    description: "Upper abdominal discomfort with nausea and bloating due to gastric irritation.",
    recommendations: [
      "Avoid spicy foods, alcohol, and NSAIDs",
      "Try small and frequent meals",
      "Use clinician-advised antacids if needed",
      "Seek care for persistent pain or any signs of GI bleeding",
    ],
  },
  migraine: {
    name: "Migraine",
    description: "A recurrent headache disorder often associated with nausea, light sensitivity, and functional impairment.",
    recommendations: [
      "Rest in a dark, quiet room",
      "Hydrate and avoid triggers like bright lights or loud noise",
      "Use clinician-approved analgesia early in the episode",
      "Seek urgent care for any sudden severe or worst-ever headache",
    ],
  },
  tension_headache: {
    name: "Tension-Type Headache",
    description: "Common bilateral pressure-like headache often linked to stress, sleep disruption, or muscle tension.",
    recommendations: [
      "Hydrate and rest",
      "Try neck and shoulder stretches",
      "Limit prolonged screen use",
      "Seek review if headaches become frequent or severe",
    ],
  },
  vertigo_disorder: {
    name: "Vertigo / Vestibular Disorder",
    description: "Dizziness with motion sensation can arise from vestibular dysfunction or blood pressure changes.",
    recommendations: [
      "Sit or lie down immediately during episodes",
      "Avoid sudden head movements",
      "Stay well hydrated",
      "Seek clinical review for recurrent or severe dizzy episodes",
    ],
  },
  musculoskeletal_back_pain: {
    name: "Musculoskeletal Back Pain",
    description: "Back pain from muscle strain or mechanical stress, common after overuse or poor posture.",
    recommendations: [
      "Rest but keep gently moving — avoid prolonged bed rest",
      "Apply heat or cold pack to the painful area",
      "Avoid heavy lifting temporarily",
      "Seek urgent care for leg weakness, numbness, or bladder/bowel changes",
    ],
  },
  arthritis: {
    name: "Arthralgia / Arthritis Pattern",
    description: "Joint pain and stiffness can result from inflammatory or degenerative joint disorders.",
    recommendations: [
      "Reduce high-impact activity during flare-ups",
      "Apply local heat for stiffness or cold for swelling",
      "Track which joints are affected and when",
      "Consult a clinician for persistent or worsening joint symptoms",
    ],
  },
  dermatitis: {
    name: "Dermatitis / Allergic Rash",
    description: "Skin inflammation may present with rash and itching due to allergy, irritation, or infection.",
    recommendations: [
      "Avoid suspected irritants or allergens",
      "Use fragrance-free moisturiser on affected skin",
      "Avoid scratching to prevent infection",
      "Seek care if rash is spreading, blistering, or associated with fever",
    ],
  },
  uti: {
    name: "Possible Urinary Tract Infection",
    description: "Painful or burning urination with urinary discomfort can indicate a lower urinary tract infection.",
    recommendations: [
      "Drink plenty of water",
      "See a clinician for urine test and appropriate treatment",
      "Do not delay if you also have fever or flank pain — may indicate kidney involvement",
      "Complete any prescribed antibiotic course in full",
    ],
  },
  anxiety_related: {
    name: "Anxiety-Related Somatic Symptoms",
    description: "Palpitations, chest discomfort, and breathlessness can occur with anxiety but serious causes must first be excluded.",
    recommendations: [
      "Try slow, controlled breathing — in for 4 counts, out for 6",
      "Reduce caffeine and stimulants",
      "Seek urgent care if chest pain is severe, new, or radiates",
      "Arrange clinical follow-up for ongoing symptoms",
    ],
  },
  chronic_fatigue_pattern: {
    name: "Fatigue Syndrome Pattern",
    description: "Persistent fatigue may be due to sleep problems, anaemia, thyroid issues, mood disorders, or chronic illness.",
    recommendations: [
      "Track your sleep and energy patterns",
      "Stay well hydrated and eat balanced meals",
      "Reduce late caffeine and alcohol intake",
      "See a clinician for blood tests if fatigue persists beyond 2 weeks",
    ],
  },
};

const SYMPTOM_CONDITION_WEIGHTS = {
  headache:            { migraine: 0.8, tension_headache: 0.7, influenza: 0.35, covid19: 0.35 },
  fever:               { influenza: 0.85, covid19: 0.75, gastroenteritis: 0.45, common_cold: 0.25, uti: 0.3 },
  cough:               { common_cold: 0.5, influenza: 0.65, covid19: 0.65, acute_bronchitis: 0.8, asthma_exacerbation: 0.45 },
  shortness_of_breath: { asthma_exacerbation: 0.9, angina_or_acs: 0.85, anxiety_related: 0.55, covid19: 0.55 },
  chest_pain:          { angina_or_acs: 0.95, anxiety_related: 0.55, acute_bronchitis: 0.3, gastritis_or_dyspepsia: 0.3 },
  sore_throat:         { common_cold: 0.7, influenza: 0.45, covid19: 0.55 },
  runny_nose:          { common_cold: 0.8, influenza: 0.35, covid19: 0.25 },
  nausea:              { gastroenteritis: 0.8, gastritis_or_dyspepsia: 0.7, migraine: 0.5, influenza: 0.3 },
  vomiting:            { gastroenteritis: 0.85, gastritis_or_dyspepsia: 0.6, migraine: 0.4 },
  diarrhea:            { gastroenteritis: 0.9, covid19: 0.25 },
  abdominal_pain:      { gastroenteritis: 0.75, gastritis_or_dyspepsia: 0.7, uti: 0.25 },
  back_pain:           { musculoskeletal_back_pain: 0.85, uti: 0.25, arthritis: 0.25 },
  joint_pain:          { arthritis: 0.9, influenza: 0.35, covid19: 0.25 },
  fatigue:             { influenza: 0.55, covid19: 0.5, chronic_fatigue_pattern: 0.8, anxiety_related: 0.35 },
  dizziness:           { vertigo_disorder: 0.85, anxiety_related: 0.4, angina_or_acs: 0.2 },
  rash:                { dermatitis: 0.9, covid19: 0.2 },
  palpitations:        { anxiety_related: 0.7, angina_or_acs: 0.6 },
  urinary_pain:        { uti: 0.95 },
};

const SEVERITY_TERMS = {
  en:  ["severe", "worst", "intense", "crushing", "sharp", "worsening", "persistent", "unbearable", "terrible", "very bad"],
  yo:  ["pupọ", "buruju", "gidigidi", "buru ju", "lagbara", "ni igba gbogbo", "lewaju", "julo"],
  ig:  ["ike", "ọjọọ", "nke ukwuu", "nke ọma", "na-abawanye", "na-adịghị mma", "egwu"],
  ha:  ["sosai", "muni", "da yawa", "karfi", "tsanani", "bai tsaya ba", "na kullum"],
  pcm: ["plenty", "well well", "serious", "very bad", "e bad die", "too much", "no dey stop", "e don reach", "terrible"],
};

// English time words + Yoruba + Igbo + Hausa + Pidgin duration terms
const DURATION_REGEX = /\b(\d+)\s*(minutes?|hours?|days?|weeks?|months?|awa|ọjọ|izu|ọnwa|wakati|kwana|mako|wata|mins?|hrs?)\b/gi;

// ─── Body Part Bank ───────────────────────────────────────────────────────────
const BODY_PART_BANK = [
  {
    id: "head",
    labels: {
      en:  ["head", "skull", "scalp", "temple", "forehead"],
      yo:  ["ori", "iwaju ori", "ẹgbọn ori", "afọnù"],
      ig:  ["isi", "ihu isi", "ọnụ isi"],
      ha:  ["kai", "goshi", "goshin kai"],
      pcm: ["head", "my head", "for head"],
    },
  },
  {
    id: "chest",
    labels: {
      en:  ["chest", "breast", "thorax", "sternum", "ribs"],
      yo:  ["àyà", "ẹyẹ àyà", "inu àyà"],
      ig:  ["obi", "ọwụwa obi", "ọkpụkpụ obi"],
      ha:  ["kirji", "nono", "ƙashin kirji"],
      pcm: ["chest", "my chest", "for chest"],
    },
  },
  {
    id: "abdomen",
    labels: {
      en:  ["abdomen", "stomach", "belly", "tummy", "gut", "navel"],
      yo:  ["inú", "ikun", "ẹnu inú", "ipamo"],
      ig:  ["afọ", "ọnụ afọ", "ime afọ"],
      ha:  ["ciki", "tumbi", "ƙwanon ciki"],
      pcm: ["belle", "stomach", "my belle", "tummy"],
    },
  },
  {
    id: "back",
    labels: {
      en:  ["back", "lower back", "upper back", "spine", "lumbar", "waist"],
      yo:  ["ẹhin", "egbọn", "ẹhin isalẹ", "ọrun ẹhin"],
      ig:  ["azụ", "azụ n'okpuru", "ọkpụkpụ azụ"],
      ha:  ["baya", "ƙasan baya", "kashin baya", "kuɓi"],
      pcm: ["back", "my back", "waist", "for back", "down back"],
    },
  },
  {
    id: "throat",
    labels: {
      en:  ["throat", "neck", "tonsils", "gullet", "windpipe"],
      yo:  ["ọfun", "ọrùn", "inu ọfun"],
      ig:  ["ọnọ", "olu", "ime ọnọ"],
      ha:  ["makogaro", "wuya", "ciki makogaro"],
      pcm: ["throat", "neck", "my throat", "my neck"],
    },
  },
  {
    id: "head_nose",
    labels: {
      en:  ["nose", "nostril", "nasal", "sinus"],
      yo:  ["imu", "ihò imu", "ẹnu imu"],
      ig:  ["imi", "oghere imi"],
      ha:  ["hanci", "ƙofar hanci"],
      pcm: ["nose", "my nose"],
    },
  },
  {
    id: "joints",
    labels: {
      en:  ["joint", "knee", "elbow", "shoulder", "ankle", "wrist", "hip"],
      yo:  ["iṣan", "orunkun", "igbonwo", "ejika", "kokosẹ"],
      ig:  ["ọkpụkpụ", "ikpere", "ikpere aka", "egbe", "olu ụkwụ"],
      ha:  ["gabbai", "gwiwa", "gwiwar hannu", "kafaɗa", "idon ƙafa"],
      pcm: ["joint", "knee", "elbow", "shoulder", "ankle", "my knee", "my joint"],
    },
  },
  {
    id: "leg_foot",
    labels: {
      en:  ["leg", "foot", "feet", "calf", "thigh", "shin", "toe"],
      yo:  ["ẹsẹ", "atẹlẹsẹ", "itan", "ẹsẹ isalẹ"],
      ig:  ["ụkwụ", "ala ụkwụ", "ọrịa ụkwụ", "ikpere ụkwụ"],
      ha:  ["ƙafa", "takalmi", "ƙafar ciki", "gwiwar ƙafa"],
      pcm: ["leg", "foot", "my leg", "my foot", "for leg"],
    },
  },
  {
    id: "arm_hand",
    labels: {
      en:  ["arm", "hand", "finger", "wrist", "forearm", "palm"],
      yo:  ["ọwọ", "ika ọwọ", "apa", "atẹlẹwọ"],
      ig:  ["aka", "mkpịsị aka", "ogwe aka", "ọkpa aka"],
      ha:  ["hannu", "yatsun hannu", "dafin hannu", "'yar hannu"],
      pcm: ["arm", "hand", "my arm", "my hand", "for hand"],
    },
  },
  {
    id: "eye",
    labels: {
      en:  ["eye", "eyes", "vision", "eyelid", "pupil"],
      yo:  ["ojú", "oju mi", "iranwo"],
      ig:  ["anya", "anya m", "ọhụhụ"],
      ha:  ["ido", "idona", "gani"],
      pcm: ["eye", "my eye", "for eye", "my vision"],
    },
  },
  {
    id: "ear",
    labels: {
      en:  ["ear", "ears", "hearing", "eardrum"],
      yo:  ["etí", "eti mi", "igbọran"],
      ig:  ["nti", "nti m", "ụtọ nti"],
      ha:  ["kunne", "ji kunne", "ji"],
      pcm: ["ear", "my ear", "for ear", "hearing"],
    },
  },
  {
    id: "skin",
    labels: {
      en:  ["skin", "scalp", "dermis", "surface", "body surface"],
      yo:  ["awọ ara", "ita ara", "awọ"],
      ig:  ["anụ ahụ", "ihe elu ahụ", "akpụkpọ ahụ"],
      ha:  ["fata", "jikin fata", "saman jiki"],
      pcm: ["skin", "body", "outside body", "my skin"],
    },
  },
];

module.exports = {
  SYMPTOM_BANK,
  BODY_PART_BANK,
  CONDITION_BANK,
  SYMPTOM_CONDITION_WEIGHTS,
  SEVERITY_TERMS,
  DURATION_REGEX,
};