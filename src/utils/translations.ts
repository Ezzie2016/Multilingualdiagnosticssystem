/**
 * translations.ts
 * UI string translations for MediLingua.
 * Active languages: English, Yoruba, Igbo, Hausa, Nigerian Pidgin
 */

export interface UIStrings {
  // Nav
  navHome:        string;
  navDiagnostic:  string;
  navResults:     string;
  navHistory:     string;
  logoSub:        string;

  // Disclaimer
  disclaimerLabel: string;
  disclaimerText:  string;

  // Landing — hero
  badgeText:      string;
  heroLine1:      string;
  heroLine2:      string;
  heroLine3:      string;
  bullet1:        string;
  bullet2:        string;
  bullet3:        string;
  bullet4:        string;
  ctaStart:       string;
  ctaHistory:     string;

  // Landing — stat floats
  stat1Label:     string;
  stat1Sub:       string;
  stat2Label:     string;
  stat2Sub:       string;
  stat3Label:     string;
  stat3Sub:       string;

  // Landing — feature cards
  featuresTitle:  string;
  feat1Title:     string;
  feat1Desc:      string;
  feat2Title:     string;
  feat2Desc:      string;
  feat3Title:     string;
  feat3Desc:      string;
  feat4Title:     string;
  feat4Desc:      string;
  feat5Title:     string;
  feat5Desc:      string;

  // Results page
  resultsSection:   string;
  resultsTitle:     string;
  resultsSub:       string;
  runNewAnalysis:   string;
  sessionProfile:   string;
  profilePatient:   string;
  profileAge:       string;
  profileGender:    string;
  profileLanguage:  string;
  profileGenderNA:  string;
  auditTrail:       string;
  auditEmpty:       string;

  // Empty / loading states
  loadingHistory:   string;
  emptyResultTitle: string;
  emptyResultSub:   string;
  startDiagnostic:  string;

  // Footer
  footerText:       string;

  // DiagnosticInterface
  diagSessionBadge:   string;
  diagHeadline:       string;
  diagHeadlineEm:     string;
  diagSubtext:        string;
  diagTextareaLabel:  string;
  diagAutoDetected:   string;
  diagCharLimit:      string;
  diagShortcut:       string;
  diagExamplesLabel:  string;
  diagRunBtn:         string;
  diagAnalyzing:      string;
  diagNotMedical:     string;
  diagNotMedicalBody: string;
  diagErrEmpty:       string;
  diagErrShort:       string;
  diagErrFailed:      string;
  diagSuggestionsLabel: string;
}

// ─── English ──────────────────────────────────────────────────────────────────
const en: UIStrings = {
  navHome:        'Home',
  navDiagnostic:  'Diagnostic',
  navResults:     'Results',
  navHistory:     'History',
  logoSub:        'Multilingual Diagnostics System',

  disclaimerLabel: 'Clinical Disclaimer:',
  disclaimerText:  'This tool provides AI-assisted decision support and is not a substitute for professional medical diagnosis. Always consult a qualified healthcare professional.',

  badgeText:  'AI-Powered Triage Support',
  heroLine1:  'Your AI Health',
  heroLine2:  'Companion',
  heroLine3:  'Anytime.',
  bullet1:    'Analyze your symptoms',
  bullet2:    'Understand your health',
  bullet3:    'Get ready for your visit',
  bullet4:    'Plan your next steps',
  ctaStart:   'Start Advanced Check',
  ctaHistory: 'View History',

  stat1Label: 'Secure & Private',
  stat1Sub:   'Local-first storage',
  stat2Label: '5 Languages',
  stat2Sub:   'Multilingual intake',
  stat3Label: 'Instant Analysis',
  stat3Sub:   'Real-time NLP',

  featuresTitle: 'System Capabilities',
  feat1Title: 'Multilingual Intake',
  feat1Desc:  'Submit symptom narratives in English, Yoruba, Igbo, Hausa, or Nigerian Pidgin.',
  feat2Title: 'NLP Extraction',
  feat2Desc:  'Entities are extracted as symptom, body part, duration, and severity.',
  feat3Title: 'Hybrid Inference',
  feat3Desc:  'Runs local model inference first, with graceful fallback controls.',
  feat4Title: 'Safety Layer',
  feat4Desc:  'Rule-based fallback keeps analysis available when model providers fail.',
  feat5Title: 'Clinical Transparency',
  feat5Desc:  'Confidence reflects symptom-pattern fit and language extraction quality, not a final diagnosis.',

  resultsSection:   'Analysis Output',
  resultsTitle:     'Latest Diagnostic Results',
  resultsSub:       'NLP analysis and diagnosis outputs for the current session.',
  runNewAnalysis:   'Run New Analysis',
  sessionProfile:   'Session Profile',
  profilePatient:   'Patient',
  profileAge:       'Age Range',
  profileGender:    'Gender',
  profileLanguage:  'Language',
  profileGenderNA:  'Not provided',
  auditTrail:       'Audit Trail',
  auditEmpty:       'No audit events yet.',

  loadingHistory:   'Loading history…',
  emptyResultTitle: 'No analysis result selected yet.',
  emptyResultSub:   'Run a diagnostic to see results here.',
  startDiagnostic:  'Start Diagnostic',

  footerText: 'MediLingua — Educational use only. Not a medical device.',

  diagSessionBadge:   'New Diagnostic Session',
  diagHeadline:       'Describe your',
  diagHeadlineEm:     'Symptoms',
  diagSubtext:        'Enter a detailed symptom narrative. Include duration, severity, and any associated symptoms for the most accurate analysis.',
  diagTextareaLabel:  'Symptom Narrative',
  diagAutoDetected:   'Auto-detected:',
  diagCharLimit:      '/ 2000',
  diagShortcut:       'Enter to submit',
  diagExamplesLabel:  'Example narratives',
  diagRunBtn:         'Run Analysis →',
  diagAnalyzing:      'Analyzing…',
  diagNotMedical:     'Not a medical device.',
  diagNotMedicalBody: 'This tool provides informational decision support only. Always consult a qualified healthcare professional for medical advice.',
  diagErrEmpty:       'Please describe your symptoms before submitting.',
  diagErrShort:       'Please provide more detail about your symptoms.',
  diagErrFailed:      'Analysis failed. Make sure the backend is running on port 3001.',
  diagSuggestionsLabel: 'Medical Knowledge',
};

// ─── Yoruba ───────────────────────────────────────────────────────────────────
const yo: UIStrings = {
  navHome:        'Ile',
  navDiagnostic:  'Iwadii',
  navResults:     'Awọn Abajade',
  navHistory:     'Itan',
  logoSub:        'Eto Aisan Ede Pupọ',

  disclaimerLabel: 'Ikilo Ilera:',
  disclaimerText:  'Irinṣẹ yii pese atilẹyin ipinnu ti AI ṣe o kii ṣe aropo fun iwadii iṣoogun ọjọgbọn. Nigbagbogbo kan si alamọdaju ilera to peye.',

  badgeText:  'Atilẹyin Triage ti AI',
  heroLine1:  'Alabaṣiṣẹpọ Ilera',
  heroLine2:  'AI Rẹ',
  heroLine3:  'Nigbakugba.',
  bullet1:    'Itupalẹ awọn aami aisan rẹ',
  bullet2:    'Loye ilera rẹ dara',
  bullet3:    'Mura silẹ fun abẹwo rẹ',
  bullet4:    'Gbero igbesẹ rẹ',
  ctaStart:   'Bẹrẹ Idanwo',
  ctaHistory: 'Wo Itan',

  stat1Label: 'Aabo & Ikọkọ',
  stat1Sub:   'Ipamọ aaye-akọkọ',
  stat2Label: '5 Ede',
  stat2Sub:   'Gbigba ede pupọ',
  stat3Label: 'Itupalẹ Lẹsẹkẹsẹ',
  stat3Sub:   'NLP gidi-akoko',

  featuresTitle: 'Agbara Eto Naa',
  feat1Title: 'Gbigba Ede Pupọ',
  feat1Desc:  'Fi awọn aami aisan silẹ ni Yoruba, Igbo, Hausa, Pidgin, tabi Gẹẹsi.',
  feat2Title: 'Iwakiri NLP',
  feat2Desc:  'A fa awọn ẹya jade gẹgẹbi aami aisan, apa ara, akoko, ati buru.',
  feat3Title: 'Ipinnu Adaṣe',
  feat3Desc:  'Nṣiṣẹ awoṣe agbegbe ni akọkọ, pẹlu awọn iṣakoso isubu irẹlẹ.',
  feat4Title: 'Ipele Aabo',
  feat4Desc:  'Isubu ofin-da jẹ ki itupalẹ wa nigba ti awọn olupese awoṣe kuna.',
  feat5Title: 'Gbangba Iwosan',
  feat5Desc:  'Igbẹkẹle ṣe afihan ibamu ilana-aami aisan kii ṣe iwadii ikẹhin.',

  resultsSection:   'Itupalẹ Jade',
  resultsTitle:     'Awọn Abajade Iwadii Tuntun',
  resultsSub:       'Awọn abajade itupalẹ NLP ati iwadii fun igba lọwọlọwọ.',
  runNewAnalysis:   'Ṣe Itupalẹ Tuntun',
  sessionProfile:   'Profaili Igba',
  profilePatient:   'Alaisan',
  profileAge:       'Ìpele Ọjọ ori',
  profileGender:    'Akọ tabi Abo',
  profileLanguage:  'Ede',
  profileGenderNA:  'A ko pese',
  auditTrail:       'Ipa Atunyẹwo',
  auditEmpty:       'Ko si awọn iṣẹlẹ atunyẹwo sibẹsibẹ.',

  loadingHistory:   'Ngbojuwo itan…',
  emptyResultTitle: 'Ko si abajade itupalẹ ti a yan sibẹsibẹ.',
  emptyResultSub:   'Ṣe iwadii lati rii awọn abajade nibi.',
  startDiagnostic:  'Bẹrẹ Iwadii',

  footerText: 'MediLingua — Fun ẹkọ nikan. Kii ṣe ẹrọ iṣoogun.',

  diagSessionBadge:   'Igba Iwadii Tuntun',
  diagHeadline:       'Ṣapejuwe',
  diagHeadlineEm:     'Awọn Aisan Rẹ',
  diagSubtext:        'Ṣapejuwe awọn aami aisan rẹ ni kikun. Fi akoko, buru, ati awọn aami aisan miiran sii fun itupalẹ to peye.',
  diagTextareaLabel:  'Apejuwe Aami Aisan',
  diagAutoDetected:   'A ṣe awari:',
  diagCharLimit:      '/ 2000',
  diagShortcut:       'Enter lati fi silẹ',
  diagExamplesLabel:  'Awọn apẹẹrẹ',
  diagRunBtn:         'Ṣe Itupalẹ →',
  diagAnalyzing:      'N ṣe itupalẹ…',
  diagNotMedical:     'Kii ṣe ẹrọ iṣoogun.',
  diagNotMedicalBody: 'Irinṣẹ yii pese atilẹyin ipinnu alaye nikan. Nigbagbogbo kan si alamọdaju ilera to peye.',
  diagErrEmpty:       'Jọwọ ṣapejuwe awọn aami aisan rẹ ṣaaju ki o to fi silẹ.',
  diagErrShort:       'Jọwọ pese alaye diẹ sii nipa awọn aami aisan rẹ.',
  diagErrFailed:      'Itupalẹ kuna. Rii daju pe ẹhin-ẹhin n ṣiṣẹ lori ibudo 3001.',
  diagSuggestionsLabel: 'Imọ Iṣoogun',
};

// ─── Igbo ─────────────────────────────────────────────────────────────────────
const ig: UIStrings = {
  navHome:        'Ụlọ',
  navDiagnostic:  'Nyocha',
  navResults:     'Nsonaazụ',
  navHistory:     'Akụkọ',
  logoSub:        'Sistemụ Nyocha Ọtụtụ Asụsụ',

  disclaimerLabel: 'Nkwupụta Ahụike:',
  disclaimerText:  'Ngwaọrụ a na-enye nkwado mkpebi nke AI na ọ bụghị nnọchi maka nyocha ahụike ọkachamara. Biko kpọtụrụ ọkachamara ahụike oge ọ bụla.',

  badgeText:  'Nkwado Triage nke AI',
  heroLine1:  'Onye Mmekọ Ahụike',
  heroLine2:  'AI Gị',
  heroLine3:  'Oge Ọ Bụla.',
  bullet1:    'Nyochaa mgbaàmà gị',
  bullet2:    'Ghọta ahụike gị',
  bullet3:    'Kwado onwe gị maka nleta',
  bullet4:    'Chee ihe ị ga-eme',
  ctaStart:   'Malite Nyocha',
  ctaHistory: 'Hụ Akụkọ',

  stat1Label: 'Nchekwa & Nzuzo',
  stat1Sub:   'Nchekwa ọbụna mbụ',
  stat2Label: 'Asụsụ 5',
  stat2Sub:   'Nnata ọtụtụ asụsụ',
  stat3Label: 'Nyocha Ozugbo',
  stat3Sub:   'NLP oge niile',

  featuresTitle: 'Ikike Sistemụ',
  feat1Title: 'Nnata Ọtụtụ Asụsụ',
  feat1Desc:  'Ziga akụkọ mgbaàmà n\'Igbo, Yoruba, Hausa, Pidgin, ma ọ bụ Bekee.',
  feat2Title: 'Nhọpụta NLP',
  feat2Desc:  'A na-ewepụ ihe dị ka mgbaàmà, akụkụ ahụ, oge, na ịdị njọ.',
  feat3Title: 'Mkpebi Ojuju',
  feat3Desc:  'Na-agba ọsọ ụdị mpaghara nke mbụ, nwere njikwa idasị irè.',
  feat4Title: 'Ọkwa Nchekwa',
  feat4Desc:  'Idasị ọchịchọ na-ejide nyocha dị mfe mgbe ndị na-enye ụdị dakwasị.',
  feat5Title: 'Ọhịara Ahụike',
  feat5Desc:  'Ntụkwasị obi na-egosi ịdị iche nke usoro-mgbaàmà, ọ bụghị nyocha ikpeazụ.',

  resultsSection:   'Nsonaazụ Nyocha',
  resultsTitle:     'Nsonaazụ Nyocha Ọhụrụ',
  resultsSub:       'Nsonaazụ nyocha NLP na nchọpụta maka oge ugbu a.',
  runNewAnalysis:   'Mee Nyocha Ọhụrụ',
  sessionProfile:   'Profaịlụ Oge',
  profilePatient:   'Onye Ọrịa',
  profileAge:       'Ọnụọgụ Afọ',
  profileGender:    'Okike',
  profileLanguage:  'Asụsụ',
  profileGenderNA:  'Enweghị',
  auditTrail:       'Ụzọ Nyochaa',
  auditEmpty:       'Enweghị ihe omume nyocha ọ bụla.',

  loadingHistory:   'Na-ebu akụkọ…',
  emptyResultTitle: 'Enweghị nsonaazụ nyocha etọzọ.',
  emptyResultSub:   'Mee nyocha iji hụ nsonaazụ ebe a.',
  startDiagnostic:  'Malite Nyocha',

  footerText: 'MediLingua — Maka mmụta naanị. Ọ bụghị ngwaọrụ ahụike.',

  diagSessionBadge:   'Oge Nyocha Ọhụrụ',
  diagHeadline:       'Kọọ',
  diagHeadlineEm:     'Mgbaàmà Gị',
  diagSubtext:        'Kọọ akụkọ mgbaàmà gị n\'ozuzu. Tinye oge, ịdị njọ, na mgbaàmà ndị ọzọ maka nyocha kachasị mma.',
  diagTextareaLabel:  'Akụkọ Mgbaàmà',
  diagAutoDetected:   'A chọpụtara:',
  diagCharLimit:      '/ 2000',
  diagShortcut:       'Enter iji zipu',
  diagExamplesLabel:  'Ihe atụ',
  diagRunBtn:         'Mee Nyocha →',
  diagAnalyzing:      'Na-enyocha…',
  diagNotMedical:     'Ọ bụghị ngwaọrụ ahụike.',
  diagNotMedicalBody: 'Ngwaọrụ a na-enye naanị nkwado mkpebi ozi. Biko kpọtụrụ ọkachamara ahụike oge ọ bụla.',
  diagErrEmpty:       'Biko kọọ mgbaàmà gị tupu ị zipu.',
  diagErrShort:       'Biko nye nkọwa ọzọ banyere mgbaàmà gị.',
  diagErrFailed:      'Nyocha dara. Jisie ike na azụ-azụ na-arụ ọrụ na ọdụ 3001.',
  diagSuggestionsLabel: 'Ihe Ọmụma Ahụike',
};

// ─── Hausa ────────────────────────────────────────────────────────────────────
const ha: UIStrings = {
  navHome:        'Gida',
  navDiagnostic:  'Bincike',
  navResults:     'Sakamakon',
  navHistory:     'Tarihi',
  logoSub:        'Tsarin Ganewar Harsuna Dayawa',

  disclaimerLabel: 'Gargaɗin Lafiya:',
  disclaimerText:  'Wannan kayan aiki yana ba da tallafin ƙididdiga na AI kuma ba madadin ganewar lafiya na ƙwararru ba ne. Koyaushe ka tuntubi ƙwararren ma\'aikacin lafiya.',

  badgeText:  'Tallafin Triage na AI',
  heroLine1:  'Abokina na Lafiya',
  heroLine2:  'na AI',
  heroLine3:  'A Kowane Lokaci.',
  bullet1:    'Nazari alamomin jikinki',
  bullet2:    'Fahimci lafiyarku',
  bullet3:    'Yi shiri don ziyarar likita',
  bullet4:    'Shirya matakan gaba',
  ctaStart:   'Fara Bincike',
  ctaHistory: 'Duba Tarihin',

  stat1Label: 'Aminci & Sirri',
  stat1Sub:   'Adana a wurin',
  stat2Label: 'Harsuna 5',
  stat2Sub:   'Karɓar harsuna da yawa',
  stat3Label: 'Nazarin Nan Take',
  stat3Sub:   'NLP na ainihi',

  featuresTitle: 'Iyawar Tsarin',
  feat1Title: 'Karɓar Harsuna Dayawa',
  feat1Desc:  'Aika labarin alamomin cuta da Hausa, Yoruba, Igbo, Pidgin, ko Turanci.',
  feat2Title: 'Fitar NLP',
  feat2Desc:  'Ana fitar da abubuwa a matsayin alama, ɓangaren jiki, tsawon lokaci, da tsanani.',
  feat3Title: 'Ƙididdiga Hadaddiya',
  feat3Desc:  'Yana gudanar da tsarin gida na farko tare da dabarun faɗuwa.',
  feat4Title: 'Mataki na Aminci',
  feat4Desc:  'Faɗuwar dokar da ke ci gaba da samuwar nazari lokacin da masu ba da ƙirar suka kasa.',
  feat5Title: 'Bayyanawa na Asibiti',
  feat5Desc:  'Amincewar tana nuna dacewa da alama ba ganewar ƙarshe ba.',

  resultsSection:   'Sakamakon Nazari',
  resultsTitle:     'Sakamakon Bincike na Ƙarshe',
  resultsSub:       'Sakamakon nazarin NLP da ganewar don zaman yanzu.',
  runNewAnalysis:   'Gudanar da Nazari Sabon',
  sessionProfile:   'Bayanan Zama',
  profilePatient:   'Majinyaci',
  profileAge:       'Kewayon Shekaru',
  profileGender:    'Jinsi',
  profileLanguage:  'Harshe',
  profileGenderNA:  'Ba a bayar ba',
  auditTrail:       'Hanyar Bincike',
  auditEmpty:       'Babu abubuwan bincike tukuna.',

  loadingHistory:   'Ana loda tarihi…',
  emptyResultTitle: 'Babu sakamakon nazari da aka zaɓa tukuna.',
  emptyResultSub:   'Gudanar da bincike don ganin sakamako anan.',
  startDiagnostic:  'Fara Bincike',

  footerText: 'MediLingua — Don ilimi kawai. Ba na\'urar likita ba ce.',

  diagSessionBadge:   'Sabon Zaman Bincike',
  diagHeadline:       'Bayyana',
  diagHeadlineEm:     'Alamomin Jikinku',
  diagSubtext:        'Shigar da cikakken labarin alamomin cuta. Haɗa da tsawon lokaci, tsanani, da kowane alama mai alaƙa don ingantaccen nazari.',
  diagTextareaLabel:  'Labarin Alamomin Cuta',
  diagAutoDetected:   'An gano kai tsaye:',
  diagCharLimit:      '/ 2000',
  diagShortcut:       'Enter don aika',
  diagExamplesLabel:  'Misalai',
  diagRunBtn:         'Gudanar da Nazari →',
  diagAnalyzing:      'Ana nazari…',
  diagNotMedical:     'Ba na\'urar likita ba ce.',
  diagNotMedicalBody: 'Wannan kayan aiki yana ba da tallafin yanke shawara na bayanai kawai. Koyaushe ka tuntubi ƙwararren ma\'aikacin lafiya.',
  diagErrEmpty:       'Da fatan za a bayyana alamomin cutar ku kafin aika.',
  diagErrShort:       'Da fatan za a ba da ƙarin bayani game da alamomin cutar ku.',
  diagErrFailed:      'Nazarin ya kasa. Tabbatar da cewa bayan yana aiki akan tashar 3001.',
  diagSuggestionsLabel: 'Ilimin Lafiya',
};

// ─── Nigerian Pidgin ──────────────────────────────────────────────────────────
const pcm: UIStrings = {
  navHome:        'Home',
  navDiagnostic:  'Check-Up',
  navResults:     'Results',
  navHistory:     'Old Records',
  logoSub:        'Many-Language Sickness Checker',

  disclaimerLabel: 'Health Warning:',
  disclaimerText:  'This tool na AI wey dey help you think, e no replace proper doctor. Make sure you always see qualified doctor.',

  badgeText:  'AI Triage Help',
  heroLine1:  'Your Health',
  heroLine2:  'AI Paddy',
  heroLine3:  'Anytime.',
  bullet1:    'Check your symptoms',
  bullet2:    'Understand your body',
  bullet3:    'Ready yourself for doctor',
  bullet4:    'Plan wetin you go do next',
  ctaStart:   'Start Check-Up',
  ctaHistory: 'See Old Records',

  stat1Label: 'Safe & Private',
  stat1Sub:   'Your data dey safe',
  stat2Label: '5 Languages',
  stat2Sub:   'Many language dey work',
  stat3Label: 'Quick Results',
  stat3Sub:   'Real-time NLP',

  featuresTitle: 'Wetin This System Fit Do',
  feat1Title: 'Many Language',
  feat1Desc:  'You fit describe your sickness for Pidgin, Yoruba, Igbo, Hausa, or English.',
  feat2Title: 'NLP Search',
  feat2Desc:  'E go find symptom, body part, how long, and how e bad from wetin you write.',
  feat3Title: 'Smart Analysis',
  feat3Desc:  'E go use AI first, then switch to rule check if AI no work.',
  feat4Title: 'Safety Net',
  feat4Desc:  'Even if AI fail, the rule-based system go still give answer.',
  feat5Title: 'Honest Results',
  feat5Desc:  'The confidence score show how well your symptoms match, no be final diagnosis.',

  resultsSection:   'Analysis Results',
  resultsTitle:     'Your Latest Check-Up Results',
  resultsSub:       'NLP analysis and findings for this session.',
  runNewAnalysis:   'Do New Check-Up',
  sessionProfile:   'Session Info',
  profilePatient:   'Patient',
  profileAge:       'Age Range',
  profileGender:    'Gender',
  profileLanguage:  'Language',
  profileGenderNA:  'No provide am',
  auditTrail:       'Check Trail',
  auditEmpty:       'No check event yet.',

  loadingHistory:   'Loading records…',
  emptyResultTitle: 'No result selected yet.',
  emptyResultSub:   'Do a check-up to see results here.',
  startDiagnostic:  'Start Check-Up',

  footerText: 'MediLingua — For learning only. No be real medical device.',

  diagSessionBadge:   'New Check-Up Session',
  diagHeadline:       'Describe',
  diagHeadlineEm:     'Your Symptoms',
  diagSubtext:        'Write wetin dey do you. Add how long e don dey, how e bad, and any other thing you feel for better result.',
  diagTextareaLabel:  'Your Symptoms',
  diagAutoDetected:   'We detect:',
  diagCharLimit:      '/ 2000',
  diagShortcut:       'Enter to submit',
  diagExamplesLabel:  'Examples',
  diagRunBtn:         'Run Check-Up →',
  diagAnalyzing:      'Checking…',
  diagNotMedical:     'No be medical device.',
  diagNotMedicalBody: 'This tool na just for information. Always see proper doctor for real advice.',
  diagErrEmpty:       'Abeg describe your symptoms before you submit.',
  diagErrShort:       'Abeg add more detail about wetin dey do you.',
  diagErrFailed:      'Check-up fail. Make sure backend dey run on port 3001.',
  diagSuggestionsLabel: 'Medical Knowledge',
};

export const translations: Record<string, UIStrings> = {
  en, yo, ig, ha, pcm,
};

export function useTranslations(lang: string): UIStrings {
  return translations[lang] ?? en;
}