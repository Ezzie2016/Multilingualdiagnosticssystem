/**
 * translations.ts
 * UI string translations for MediLingua.
 * Add more languages by extending the `translations` object.
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
}

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
  stat2Label: '16 Languages',
  stat2Sub:   'Multilingual intake',
  stat3Label: 'Instant Analysis',
  stat3Sub:   'Real-time NLP',

  featuresTitle: 'System Capabilities',
  feat1Title: 'Multilingual Intake',
  feat1Desc:  'Users can submit symptom narratives in 16 interface languages.',
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
  diagHeadlineEm:     'symptoms',
  diagSubtext:        'Enter a detailed symptom narrative. Include duration, severity, and any associated symptoms for the most accurate analysis.',
  diagTextareaLabel:  'Symptom Narrative',
  diagAutoDetected:   'Auto-detected:',
  diagCharLimit:      '/ 2000',
  diagShortcut:       '⌘ + Enter to submit',
  diagExamplesLabel:  'Example narratives',
  diagRunBtn:         'Run Analysis →',
  diagAnalyzing:      'Analyzing…',
  diagNotMedical:     'Not a medical device.',
  diagNotMedicalBody: 'This tool provides informational decision support only. Always consult a qualified healthcare professional for medical advice.',
  diagErrEmpty:       'Please describe your symptoms before submitting.',
  diagErrShort:       'Please provide more detail about your symptoms.',
  diagErrFailed:      'Analysis failed. Make sure the backend is running on port 4002.',
};

const es: UIStrings = {
  navHome:        'Inicio',
  navDiagnostic:  'Diagnóstico',
  navResults:     'Resultados',
  navHistory:     'Historial',
  logoSub:        'Sistema de Diagnóstico Multilingüe',

  disclaimerLabel: 'Aviso Clínico:',
  disclaimerText:  'Esta herramienta ofrece apoyo de decisión asistido por IA y no sustituye el diagnóstico médico profesional. Consulte siempre a un profesional de la salud.',

  badgeText:  'Soporte de Triaje con IA',
  heroLine1:  'Tu Asistente',
  heroLine2:  'de Salud',
  heroLine3:  'con IA.',
  bullet1:    'Analiza tus síntomas',
  bullet2:    'Comprende tu salud',
  bullet3:    'Prepárate para tu consulta',
  bullet4:    'Planifica tus próximos pasos',
  ctaStart:   'Iniciar Análisis Avanzado',
  ctaHistory: 'Ver Historial',

  stat1Label: 'Seguro y Privado',
  stat1Sub:   'Almacenamiento local',
  stat2Label: '16 Idiomas',
  stat2Sub:   'Entrada multilingüe',
  stat3Label: 'Análisis Instantáneo',
  stat3Sub:   'NLP en tiempo real',

  featuresTitle: 'Capacidades del Sistema',
  feat1Title: 'Entrada Multilingüe',
  feat1Desc:  'Los usuarios pueden enviar narrativas de síntomas en 16 idiomas.',
  feat2Title: 'Extracción NLP',
  feat2Desc:  'Las entidades se extraen como síntoma, parte del cuerpo, duración y gravedad.',
  feat3Title: 'Inferencia Híbrida',
  feat3Desc:  'Ejecuta primero la inferencia local con controles de respaldo.',
  feat4Title: 'Capa de Seguridad',
  feat4Desc:  'El respaldo basado en reglas mantiene el análisis disponible cuando los proveedores fallan.',
  feat5Title: 'Transparencia Clínica',
  feat5Desc:  'La confianza refleja la coincidencia de patrones de síntomas, no un diagnóstico final.',

  resultsSection:   'Resultado del Análisis',
  resultsTitle:     'Últimos Resultados del Diagnóstico',
  resultsSub:       'Análisis NLP y resultados de diagnóstico para la sesión actual.',
  runNewAnalysis:   'Nuevo Análisis',
  sessionProfile:   'Perfil de Sesión',
  profilePatient:   'Paciente',
  profileAge:       'Rango de Edad',
  profileGender:    'Género',
  profileLanguage:  'Idioma',
  profileGenderNA:  'No indicado',
  auditTrail:       'Registro de Auditoría',
  auditEmpty:       'Aún no hay eventos de auditoría.',

  loadingHistory:   'Cargando historial…',
  emptyResultTitle: 'Aún no hay resultado seleccionado.',
  emptyResultSub:   'Realiza un diagnóstico para ver los resultados aquí.',
  startDiagnostic:  'Iniciar Diagnóstico',

  footerText: 'MediLingua — Solo uso educativo. No es un dispositivo médico.',

  diagSessionBadge:   'Nueva Sesión de Diagnóstico',
  diagHeadline:       'Describe tus',
  diagHeadlineEm:     'síntomas',
  diagSubtext:        'Escribe una narrativa detallada de síntomas. Incluye duración, gravedad y síntomas asociados para un análisis más preciso.',
  diagTextareaLabel:  'Narrativa de Síntomas',
  diagAutoDetected:   'Detectado automáticamente:',
  diagCharLimit:      '/ 2000',
  diagShortcut:       '⌘ + Enter para enviar',
  diagExamplesLabel:  'Narrativas de ejemplo',
  diagRunBtn:         'Ejecutar Análisis →',
  diagAnalyzing:      'Analizando…',
  diagNotMedical:     'No es un dispositivo médico.',
  diagNotMedicalBody: 'Esta herramienta proporciona apoyo informativo únicamente. Consulte siempre a un profesional de la salud.',
  diagErrEmpty:       'Por favor describe tus síntomas antes de enviar.',
  diagErrShort:       'Por favor proporciona más detalles sobre tus síntomas.',
  diagErrFailed:      'Análisis fallido. Asegúrate de que el servidor esté activo en el puerto 4002.',
};

const fr: UIStrings = {
  navHome:        'Accueil',
  navDiagnostic:  'Diagnostic',
  navResults:     'Résultats',
  navHistory:     'Historique',
  logoSub:        'Système de Diagnostic Multilingue',

  disclaimerLabel: 'Avertissement Clinique :',
  disclaimerText:  "Cet outil fournit une aide à la décision assistée par IA et ne remplace pas un diagnostic médical professionnel. Consultez toujours un professionnel de santé qualifié.",

  badgeText:  'Aide au Triage par IA',
  heroLine1:  'Votre Assistant',
  heroLine2:  'Santé',
  heroLine3:  "Partout, toujours.",
  bullet1:    'Analysez vos symptômes',
  bullet2:    'Comprenez votre santé',
  bullet3:    'Préparez votre consultation',
  bullet4:    'Planifiez vos prochaines étapes',
  ctaStart:   'Démarrer un Bilan Avancé',
  ctaHistory: "Voir l'Historique",

  stat1Label: 'Sécurisé et Privé',
  stat1Sub:   'Stockage local',
  stat2Label: '16 Langues',
  stat2Sub:   'Saisie multilingue',
  stat3Label: 'Analyse Instantanée',
  stat3Sub:   'NLP en temps réel',

  featuresTitle: 'Capacités du Système',
  feat1Title: 'Saisie Multilingue',
  feat1Desc:  'Les utilisateurs peuvent soumettre des récits de symptômes en 16 langues.',
  feat2Title: 'Extraction NLP',
  feat2Desc:  "Les entités sont extraites comme symptôme, partie du corps, durée et gravité.",
  feat3Title: 'Inférence Hybride',
  feat3Desc:  "Exécute d'abord l'inférence locale avec des contrôles de secours.",
  feat4Title: 'Couche de Sécurité',
  feat4Desc:  "Le secours basé sur des règles maintient l'analyse disponible en cas d'échec.",
  feat5Title: 'Transparence Clinique',
  feat5Desc:  "La confiance reflète la correspondance des symptômes, pas un diagnostic final.",

  resultsSection:   "Résultat de l'Analyse",
  resultsTitle:     'Derniers Résultats Diagnostiques',
  resultsSub:       'Analyse NLP et résultats de diagnostic pour la session en cours.',
  runNewAnalysis:   'Nouvelle Analyse',
  sessionProfile:   'Profil de Session',
  profilePatient:   'Patient',
  profileAge:       "Tranche d'Âge",
  profileGender:    'Genre',
  profileLanguage:  'Langue',
  profileGenderNA:  'Non renseigné',
  auditTrail:       "Journal d'Audit",
  auditEmpty:       "Aucun événement d'audit pour le moment.",

  loadingHistory:   "Chargement de l'historique…",
  emptyResultTitle: 'Aucun résultat sélectionné pour le moment.',
  emptyResultSub:   'Lancez un diagnostic pour voir les résultats ici.',
  startDiagnostic:  'Démarrer le Diagnostic',

  footerText: "MediLingua — Usage éducatif uniquement. Pas un dispositif médical.",

  diagSessionBadge:   'Nouvelle Session de Diagnostic',
  diagHeadline:       'Décrivez vos',
  diagHeadlineEm:     'symptômes',
  diagSubtext:        'Rédigez un récit détaillé de vos symptômes. Incluez la durée, la gravité et tout symptôme associé pour une analyse plus précise.',
  diagTextareaLabel:  'Récit des Symptômes',
  diagAutoDetected:   'Détecté automatiquement :',
  diagCharLimit:      '/ 2000',
  diagShortcut:       '⌘ + Entrée pour soumettre',
  diagExamplesLabel:  'Exemples de récits',
  diagRunBtn:         "Lancer l'Analyse →",
  diagAnalyzing:      'Analyse en cours…',
  diagNotMedical:     'Pas un dispositif médical.',
  diagNotMedicalBody: "Cet outil fournit uniquement une aide informative. Consultez toujours un professionnel de santé.",
  diagErrEmpty:       'Veuillez décrire vos symptômes avant de soumettre.',
  diagErrShort:       'Veuillez fournir plus de détails sur vos symptômes.',
  diagErrFailed:      'Analyse échouée. Assurez-vous que le serveur fonctionne sur le port 4002.',
};

const de: UIStrings = {
  navHome:        'Startseite',
  navDiagnostic:  'Diagnose',
  navResults:     'Ergebnisse',
  navHistory:     'Verlauf',
  logoSub:        'Mehrsprachiges Diagnosesystem',

  disclaimerLabel: 'Klinischer Hinweis:',
  disclaimerText:  'Dieses Tool bietet KI-gestützte Entscheidungshilfe und ersetzt keine professionelle medizinische Diagnose. Konsultieren Sie stets einen qualifizierten Arzt.',

  badgeText:  'KI-gestützte Triage-Unterstützung',
  heroLine1:  'Ihr KI-',
  heroLine2:  'Gesundheits-',
  heroLine3:  'Assistent.',
  bullet1:    'Symptome analysieren',
  bullet2:    'Gesundheit verstehen',
  bullet3:    'Auf den Arztbesuch vorbereiten',
  bullet4:    'Nächste Schritte planen',
  ctaStart:   'Erweiterte Prüfung starten',
  ctaHistory: 'Verlauf anzeigen',

  stat1Label: 'Sicher & Privat',
  stat1Sub:   'Lokale Speicherung',
  stat2Label: '16 Sprachen',
  stat2Sub:   'Mehrsprachige Eingabe',
  stat3Label: 'Sofortanalyse',
  stat3Sub:   'Echtzeit-NLP',

  featuresTitle: 'Systemfähigkeiten',
  feat1Title: 'Mehrsprachige Eingabe',
  feat1Desc:  'Nutzer können Symptombeschreibungen in 16 Sprachen einreichen.',
  feat2Title: 'NLP-Extraktion',
  feat2Desc:  'Entitäten werden als Symptom, Körperteil, Dauer und Schweregrad extrahiert.',
  feat3Title: 'Hybride Inferenz',
  feat3Desc:  'Führt zunächst lokale Modellinferenz mit Fallback-Kontrollen durch.',
  feat4Title: 'Sicherheitsschicht',
  feat4Desc:  'Regelbasierter Fallback hält die Analyse verfügbar, wenn Anbieter ausfallen.',
  feat5Title: 'Klinische Transparenz',
  feat5Desc:  'Die Konfidenz spiegelt die Symptommuster-Übereinstimmung wider, keine endgültige Diagnose.',

  resultsSection:   'Analyseergebnis',
  resultsTitle:     'Neueste Diagnoseergebnisse',
  resultsSub:       'NLP-Analyse und Diagnoseergebnisse für die aktuelle Sitzung.',
  runNewAnalysis:   'Neue Analyse',
  sessionProfile:   'Sitzungsprofil',
  profilePatient:   'Patient',
  profileAge:       'Altersgruppe',
  profileGender:    'Geschlecht',
  profileLanguage:  'Sprache',
  profileGenderNA:  'Keine Angabe',
  auditTrail:       'Prüfprotokoll',
  auditEmpty:       'Noch keine Prüfereignisse.',

  loadingHistory:   'Verlauf wird geladen…',
  emptyResultTitle: 'Noch kein Ergebnis ausgewählt.',
  emptyResultSub:   'Führen Sie eine Diagnose durch, um Ergebnisse hier zu sehen.',
  startDiagnostic:  'Diagnose starten',

  footerText: 'MediLingua — Nur für Bildungszwecke. Kein Medizinprodukt.',

  diagSessionBadge:   'Neue Diagnosesitzung',
  diagHeadline:       'Beschreiben Sie Ihre',
  diagHeadlineEm:     'Symptome',
  diagSubtext:        'Geben Sie eine detaillierte Symptombeschreibung ein. Dauer, Schweregrad und Begleitsymptome erhöhen die Analysegenauigkeit.',
  diagTextareaLabel:  'Symptombeschreibung',
  diagAutoDetected:   'Automatisch erkannt:',
  diagCharLimit:      '/ 2000',
  diagShortcut:       '⌘ + Eingabe zum Absenden',
  diagExamplesLabel:  'Beispiel-Beschreibungen',
  diagRunBtn:         'Analyse starten →',
  diagAnalyzing:      'Wird analysiert…',
  diagNotMedical:     'Kein Medizinprodukt.',
  diagNotMedicalBody: 'Dieses Tool bietet nur informative Entscheidungsunterstützung. Konsultieren Sie immer einen Arzt.',
  diagErrEmpty:       'Bitte beschreiben Sie Ihre Symptome vor dem Absenden.',
  diagErrShort:       'Bitte geben Sie mehr Details zu Ihren Symptomen an.',
  diagErrFailed:      'Analyse fehlgeschlagen. Stellen Sie sicher, dass das Backend auf Port 4002 läuft.',
};

const ar: UIStrings = {
  navHome:        'الرئيسية',
  navDiagnostic:  'التشخيص',
  navResults:     'النتائج',
  navHistory:     'السجل',
  logoSub:        'نظام التشخيص متعدد اللغات',

  disclaimerLabel: 'تنبيه سريري:',
  disclaimerText:  'هذه الأداة توفر دعمًا للقرار بمساعدة الذكاء الاصطناعي وليست بديلاً عن التشخيص الطبي المهني. استشر دائمًا طبيبًا مؤهلاً.',

  badgeText:  'دعم الفرز بالذكاء الاصطناعي',
  heroLine1:  'مساعدك الصحي',
  heroLine2:  'الذكي',
  heroLine3:  'في أي وقت.',
  bullet1:    'تحليل أعراضك',
  bullet2:    'فهم صحتك',
  bullet3:    'الاستعداد لزيارة الطبيب',
  bullet4:    'التخطيط للخطوات القادمة',
  ctaStart:   'بدء الفحص المتقدم',
  ctaHistory: 'عرض السجل',

  stat1Label: 'آمن وخاص',
  stat1Sub:   'تخزين محلي',
  stat2Label: '16 لغة',
  stat2Sub:   'إدخال متعدد اللغات',
  stat3Label: 'تحليل فوري',
  stat3Sub:   'معالجة لغوية فورية',

  featuresTitle: 'إمكانيات النظام',
  feat1Title: 'إدخال متعدد اللغات',
  feat1Desc:  'يمكن للمستخدمين تقديم روايات الأعراض بـ 16 لغة.',
  feat2Title: 'استخراج اللغة الطبيعية',
  feat2Desc:  'تُستخرج الكيانات كأعراض وأجزاء الجسم والمدة والشدة.',
  feat3Title: 'استنتاج هجين',
  feat3Desc:  'يشغّل الاستدلال المحلي أولاً مع ضوابط احتياطية.',
  feat4Title: 'طبقة الأمان',
  feat4Desc:  'الاحتياط القائم على القواعد يبقي التحليل متاحاً عند فشل المزودين.',
  feat5Title: 'الشفافية السريرية',
  feat5Desc:  'تعكس الثقة تطابق نمط الأعراض وليس تشخيصاً نهائياً.',

  resultsSection:   'نتيجة التحليل',
  resultsTitle:     'آخر نتائج التشخيص',
  resultsSub:       'تحليل اللغة الطبيعية ونتائج التشخيص للجلسة الحالية.',
  runNewAnalysis:   'تحليل جديد',
  sessionProfile:   'ملف الجلسة',
  profilePatient:   'المريض',
  profileAge:       'الفئة العمرية',
  profileGender:    'الجنس',
  profileLanguage:  'اللغة',
  profileGenderNA:  'غير محدد',
  auditTrail:       'سجل المراجعة',
  auditEmpty:       'لا توجد أحداث مراجعة بعد.',

  loadingHistory:   'جارٍ تحميل السجل…',
  emptyResultTitle: 'لم يتم تحديد نتيجة بعد.',
  emptyResultSub:   'قم بإجراء تشخيص لرؤية النتائج هنا.',
  startDiagnostic:  'بدء التشخيص',

  footerText: 'MediLingua — للاستخدام التعليمي فقط. ليس جهازاً طبياً.',

  diagSessionBadge:   'جلسة تشخيص جديدة',
  diagHeadline:       'صف',
  diagHeadlineEm:     'أعراضك',
  diagSubtext:        'أدخل رواية تفصيلية للأعراض. أضف المدة والشدة وأي أعراض مصاحبة للحصول على تحليل أدق.',
  diagTextareaLabel:  'رواية الأعراض',
  diagAutoDetected:   'تم الكشف تلقائياً:',
  diagCharLimit:      '/ 2000',
  diagShortcut:       '⌘ + Enter للإرسال',
  diagExamplesLabel:  'أمثلة على الروايات',
  diagRunBtn:         'تشغيل التحليل ←',
  diagAnalyzing:      'جارٍ التحليل…',
  diagNotMedical:     'ليس جهازاً طبياً.',
  diagNotMedicalBody: 'توفر هذه الأداة دعمًا معلوماتيًا فقط. استشر دائمًا متخصصًا في الرعاية الصحية.',
  diagErrEmpty:       'يرجى وصف أعراضك قبل الإرسال.',
  diagErrShort:       'يرجى تقديم مزيد من التفاصيل حول أعراضك.',
  diagErrFailed:      'فشل التحليل. تأكد من تشغيل الخادم على المنفذ 4002.',
};

const zh: UIStrings = {
  navHome:        '首页',
  navDiagnostic:  '诊断',
  navResults:     '结果',
  navHistory:     '历史',
  logoSub:        '多语言诊断系统',

  disclaimerLabel: '临床声明：',
  disclaimerText:  '本工具提供AI辅助决策支持，不能替代专业医疗诊断。请务必咨询合格的医疗专业人员。',

  badgeText:  'AI驱动的分诊支持',
  heroLine1:  '您的AI健康',
  heroLine2:  '助手',
  heroLine3:  '随时随地。',
  bullet1:    '分析您的症状',
  bullet2:    '了解您的健康状况',
  bullet3:    '为就诊做好准备',
  bullet4:    '规划下一步行动',
  ctaStart:   '开始高级检查',
  ctaHistory: '查看历史',

  stat1Label: '安全私密',
  stat1Sub:   '本地存储',
  stat2Label: '16种语言',
  stat2Sub:   '多语言输入',
  stat3Label: '即时分析',
  stat3Sub:   '实时NLP',

  featuresTitle: '系统功能',
  feat1Title: '多语言输入',
  feat1Desc:  '用户可以用16种界面语言提交症状叙述。',
  feat2Title: 'NLP提取',
  feat2Desc:  '实体被提取为症状、身体部位、持续时间和严重程度。',
  feat3Title: '混合推理',
  feat3Desc:  '首先运行本地模型推理，具有优雅的回退控制。',
  feat4Title: '安全层',
  feat4Desc:  '基于规则的回退在模型提供者失败时保持分析可用。',
  feat5Title: '临床透明度',
  feat5Desc:  '置信度反映症状模式匹配质量，而非最终诊断。',

  resultsSection:   '分析输出',
  resultsTitle:     '最新诊断结果',
  resultsSub:       '当前会话的NLP分析和诊断输出。',
  runNewAnalysis:   '运行新分析',
  sessionProfile:   '会话档案',
  profilePatient:   '患者',
  profileAge:       '年龄段',
  profileGender:    '性别',
  profileLanguage:  '语言',
  profileGenderNA:  '未提供',
  auditTrail:       '审计跟踪',
  auditEmpty:       '暂无审计事件。',

  loadingHistory:   '正在加载历史…',
  emptyResultTitle: '尚未选择分析结果。',
  emptyResultSub:   '运行诊断以在此处查看结果。',
  startDiagnostic:  '开始诊断',

  footerText: 'MediLingua — 仅供教育使用。非医疗设备。',

  diagSessionBadge:   '新诊断会话',
  diagHeadline:       '描述您的',
  diagHeadlineEm:     '症状',
  diagSubtext:        '输入详细的症状叙述。包括持续时间、严重程度和任何相关症状，以获得最准确的分析。',
  diagTextareaLabel:  '症状叙述',
  diagAutoDetected:   '自动检测：',
  diagCharLimit:      '/ 2000',
  diagShortcut:       '⌘ + Enter 提交',
  diagExamplesLabel:  '示例叙述',
  diagRunBtn:         '运行分析 →',
  diagAnalyzing:      '分析中…',
  diagNotMedical:     '非医疗设备。',
  diagNotMedicalBody: '本工具仅提供信息决策支持。请务必咨询合格的医疗专业人员。',
  diagErrEmpty:       '提交前请描述您的症状。',
  diagErrShort:       '请提供更多关于症状的详细信息。',
  diagErrFailed:      '分析失败。请确保后端服务器在4002端口运行。',
};

// Nigerian languages — fall back to English for now with key terms translated
const ha: UIStrings = { ...en,
  navHome: 'Gida', navDiagnostic: 'Bincike', navResults: 'Sakamakon', navHistory: 'Tarihi',
  logoSub: 'Tsarin Ganewar Harsuna Dayawa',
  diagSessionBadge: 'Sabon Zaman Bincike',
  diagHeadlineEm: 'Alamomin Cuta',
  ctaStart: 'Fara Duba',
};

const yo: UIStrings = { ...en,
  navHome: 'Ile', navDiagnostic: 'Iwadii', navResults: 'Awọn Abajade', navHistory: 'Itan',
  logoSub: 'Eto Aisan Ede Pupọ',
  diagSessionBadge: 'Igba Iwadii Tuntun',
  diagHeadlineEm: 'Awọn Aisan',
  ctaStart: 'Bẹrẹ Idanwo',
};

const ig: UIStrings = { ...en,
  navHome: 'Ụlọ', navDiagnostic: 'Nyocha', navResults: 'Nsonaazụ', navHistory: 'Akụkọ',
  logoSub: 'Sistemu Nyocha Ọtụtụ Asụsụ',
  diagSessionBadge: 'Oge Nyocha Ọhụrụ',
  diagHeadlineEm: 'Mgbaàmà Ọrịa',
  ctaStart: 'Malite Nyocha',
};

// All others fall back to English
const fallback = en;

export const translations: Record<string, UIStrings> = {
  en, es, fr, de, ar, zh, ha, yo, ig,
  pcm: fallback, ff: fallback, kr: fallback,
  ibb: fallback, tiv: fallback, ijc: fallback, bin: fallback,
};

export function useTranslations(lang: string): UIStrings {
  return translations[lang] ?? en;
}
