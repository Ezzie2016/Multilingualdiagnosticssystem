import { DiagnosticResult, Language } from '../App';
import { Brain, Activity, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface NLPResultsProps {
  result: DiagnosticResult;
  language: Language;
}

export function NLPResults({ result, language }: NLPResultsProps) {
  const translations = {
    en: {
      nlpAnalysis: 'NLP Analysis',
      entitiesDetected: 'Detected Entities',
      diagnosticResults: 'Diagnostic Results',
      confidence: 'Confidence',
      recommendations: 'Recommendations',
      symptom: 'Symptom',
      bodyPart: 'Body Part',
      duration: 'Duration',
      severity: 'Severity',
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    es: {
      nlpAnalysis: 'Análisis PLN',
      entitiesDetected: 'Entidades Detectadas',
      diagnosticResults: 'Resultados del Diagnóstico',
      confidence: 'Confianza',
      recommendations: 'Recomendaciones',
      symptom: 'Síntoma',
      bodyPart: 'Parte del Cuerpo',
      duration: 'Duración',
      severity: 'Gravedad',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    },
    fr: {
      nlpAnalysis: 'Analyse TAL',
      entitiesDetected: 'Entités Détectées',
      diagnosticResults: 'Résultats du Diagnostic',
      confidence: 'Confiance',
      recommendations: 'Recommandations',
      symptom: 'Symptôme',
      bodyPart: 'Partie du Corps',
      duration: 'Durée',
      severity: 'Gravité',
      high: 'Élevée',
      medium: 'Moyenne',
      low: 'Faible'
    },
    de: {
      nlpAnalysis: 'NLP-Analyse',
      entitiesDetected: 'Erkannte Entitäten',
      diagnosticResults: 'Diagnoseergebnisse',
      confidence: 'Vertrauen',
      recommendations: 'Empfehlungen',
      symptom: 'Symptom',
      bodyPart: 'Körperteil',
      duration: 'Dauer',
      severity: 'Schweregrad',
      high: 'Hoch',
      medium: 'Mittel',
      low: 'Niedrig'
    },
    zh: {
      nlpAnalysis: '自然语言处理分析',
      entitiesDetected: '检测到的实体',
      diagnosticResults: '诊断结果',
      confidence: '置信度',
      recommendations: '建议',
      symptom: '症状',
      bodyPart: '身体部位',
      duration: '持续时间',
      severity: '严重程度',
      high: '高',
      medium: '中',
      low: '低'
    },
    ar: {
      nlpAnalysis: 'تحليل معالجة اللغة الطبيعية',
      entitiesDetected: 'الكيانات المكتشفة',
      diagnosticResults: 'نتائج التشخيص',
      confidence: 'الثقة',
      recommendations: 'التوصيات',
      symptom: 'عرض',
      bodyPart: 'جزء الجسم',
      duration: 'المدة',
      severity: 'الشدة',
      high: 'عالية',
      medium: 'متوسطة',
      low: 'منخفضة'
    },
    ha: {
      nlpAnalysis: 'Binciken NLP',
      entitiesDetected: 'Abubuwan Da Aka Gano',
      diagnosticResults: 'Sakamakon Bincike',
      confidence: 'Aminci',
      recommendations: 'Shawarwari',
      symptom: 'Alama',
      bodyPart: 'Sashen Jiki',
      duration: 'Tsawon Lokaci',
      severity: 'Tsanani',
      high: 'Babba',
      medium: 'Matsakaici',
      low: 'Ƙarami'
    },
    yo: {
      nlpAnalysis: 'Itupalẹ NLP',
      entitiesDetected: 'Awọn Nkan Ti A Rii',
      diagnosticResults: 'Awọn Abajade Iwadii',
      confidence: 'Igbẹkẹle',
      recommendations: 'Awọn Imọran',
      symptom: 'Ami',
      bodyPart: 'Apakan Ara',
      duration: 'Akoko',
      severity: 'Ipọnju',
      high: 'Giga',
      medium: 'Aarin',
      low: 'Kekere'
    },
    ig: {
      nlpAnalysis: 'Nyocha NLP',
      entitiesDetected: 'Ihe Ndị A Chọpụtara',
      diagnosticResults: 'Nsonaazụ Nyocha',
      confidence: 'Ntụkwasị Obi',
      recommendations: 'Ndụmọdụ',
      symptom: 'Mgbaàmà',
      bodyPart: 'Akụkụ Ahụ',
      duration: 'Oge',
      severity: 'Ịdị Njọ',
      high: 'Elu',
      medium: 'Etiti',
      low: 'Ala'
    },
    pcm: {
      nlpAnalysis: 'NLP Analysis',
      entitiesDetected: 'Wetin We Find',
      diagnosticResults: 'Results Wey We Get',
      confidence: 'How Sure We Be',
      recommendations: 'Wetin We Advice',
      symptom: 'Symptom',
      bodyPart: 'Body Part',
      duration: 'How Long',
      severity: 'How E Bad',
      high: 'Plenty',
      medium: 'So-So',
      low: 'Small'
    },
    ff: {
      nlpAnalysis: 'Yiytorgol NLP',
      entitiesDetected: 'Goɗɗe Njiytaama',
      diagnosticResults: 'Keeɓe Patnugol',
      confidence: 'Jaabawol',
      recommendations: 'Hollitanɗe',
      symptom: 'Siifo',
      bodyPart: 'Nokku Gorko',
      duration: 'Sahaa',
      severity: 'Ɓeydugol',
      high: 'Mawndu',
      medium: 'Hakkunde',
      low: 'Famɗi'
    },
    kr: {
      nlpAnalysis: 'Tǝla NLP',
      entitiesDetected: 'Ngamnaye Kǝlǝnaro',
      diagnosticResults: 'Shǝddǝ Ngara',
      confidence: 'Ngamtoro',
      recommendations: 'Shawarnaye',
      symptom: 'Wuye',
      bodyPart: 'Kashik Kǝla',
      duration: 'Kursi',
      severity: 'Ngadaro',
      high: 'Fal',
      medium: 'Kǝlǝ',
      low: 'Kambe'
    },
    ibb: {
      nlpAnalysis: 'Mmọ NLP',
      entitiesDetected: 'Ntre Emi Awọp',
      diagnosticResults: 'Mkpukpru Unwana',
      confidence: 'Ubọk Mkpa',
      recommendations: 'Ntre Ikọ',
      symptom: 'Mkpọ',
      bodyPart: 'Edisọñ Ubọk',
      duration: 'Ufọk',
      severity: 'Nkpọ Mkpa',
      high: 'Nkpọ',
      medium: 'Kiet',
      low: 'Kamit'
    },
    tiv: {
      nlpAnalysis: 'Inkiahar NLP',
      entitiesDetected: 'Ishima Ya U Ôô',
      diagnosticResults: 'Ishima Ya U Kwaghyan',
      confidence: 'U Kwagh Or',
      recommendations: 'U Ter Sha',
      symptom: 'Kwaghyan',
      bodyPart: 'U Mngerem',
      duration: 'U Tar',
      severity: 'U Ken',
      high: 'Sha',
      medium: 'Kwaghyan',
      low: 'Nahan'
    },
    ijc: {
      nlpAnalysis: 'Tọrụ NLP',
      entitiesDetected: 'Bụọ Tari Kọmị',
      diagnosticResults: 'Sẹbiri Bụọ',
      confidence: 'Bari Tọrụ',
      recommendations: 'Sọyọ Bụọ',
      symptom: 'Tẹin',
      bodyPart: 'Biri Yem',
      duration: 'Tari',
      severity: 'Bara',
      high: 'Pụọ',
      medium: 'Kẹ',
      low: 'Bịrị'
    },
    bin: {
      nlpAnalysis: 'Imẹ NLP',
      entitiesDetected: 'Ọ Kọlọ Ye',
      diagnosticResults: 'Uhan Imẹ',
      confidence: 'Ebọ Khian',
      recommendations: 'Sọyọ Ye',
      symptom: 'Ukpọn',
      bodyPart: 'Ebọ Yem',
      duration: 'Ukpọn',
      severity: 'Guẹguẹ',
      high: 'Nkpọ',
      medium: 'Kpọlọ',
      low: 'Kamit'
    }
  };

  const t = translations[language] || translations.en;

  const entityTypeTranslations = {
    symptom: t.symptom,
    body_part: t.bodyPart,
    duration: t.duration,
    severity: t.severity
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-emerald-700 bg-emerald-100';
    if (confidence >= 0.4) return 'text-amber-700 bg-amber-100';
    return 'text-rose-700 bg-rose-100';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.7) return t.high;
    if (confidence >= 0.4) return t.medium;
    return t.low;
  };

  return (
    <div className="space-y-6">
      {/* NLP Entity Detection */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[var(--surface-3)] p-2 rounded-lg">
            <Brain className="w-6 h-6 text-[var(--teal)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--navy)]" style={{ fontFamily: 'var(--font-display)' }}>{t.nlpAnalysis}</h2>
        </div>

        <div className="space-y-3">
          <h3 className="section-label mb-2">{t.entitiesDetected}:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.entities.map((entity, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--teal)] mt-1 sm:mt-0 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium text-[var(--ink)] break-words">{entity.text}</span>
                    <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                      {entityTypeTranslations[entity.type]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--teal)]" />
                  <span className="text-sm font-medium text-[var(--teal)]">
                    {Math.round(entity.confidence * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diagnostic Results */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[var(--surface-3)] p-2 rounded-lg">
            <Activity className="w-6 h-6 text-[var(--teal)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--navy)]" style={{ fontFamily: 'var(--font-display)' }}>{t.diagnosticResults}</h2>
        </div>
        <p className="text-sm text-[var(--ink-muted)] mb-4">
          Confidence is estimated from symptom/entity match density, duration and severity cues, and model certainty signals.
        </p>

        <div className="space-y-4">
          {result.diagnoses.map((diagnosis, index) => (
            <div
              key={index}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[var(--navy)] mb-1.5 break-words">
                    {diagnosis.condition}
                  </h3>
                  <p className="text-[var(--ink-soft)] text-sm leading-relaxed">{diagnosis.description}</p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <div className={`inline-block px-3 py-1.5 rounded-lg font-medium text-sm ${getConfidenceColor(diagnosis.confidence)}`}>
                    {getConfidenceLabel(diagnosis.confidence)} {Math.round(diagnosis.confidence * 100)}%
                  </div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-1">
                  <span>{t.confidence}</span>
                  <span>{Math.round(diagnosis.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-[var(--border)] rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${diagnosis.confidence * 100}%`,
                      background: 'linear-gradient(90deg, var(--teal) 0%, var(--teal-mid) 100%)'
                    }}
                  />
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-[var(--ink)] mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--green)]" />
                  {t.recommendations}:
                </h4>
                <ul className="space-y-2">
                  {diagnosis.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="flex items-start gap-2 text-sm text-[var(--ink-soft)]">
                      <span className="mt-0.5 text-[var(--teal)]">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="mt-6 disclaimer">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--amber)]" />
            <p>
              {language === 'en' && 'These results are generated by an AI system. Please consult a healthcare professional for proper diagnosis and treatment.'}
              {language === 'es' && 'Estos resultados son generados por un sistema de IA. Consulte a un profesional de la salud para un diagnóstico y tratamiento adecuados.'}
              {language === 'fr' && 'Ces résultats sont générés par un système d\'IA. Veuillez consulter un professionnel de la santé pour un diagnostic et un traitement appropriés.'}
              {language === 'de' && 'Diese Ergebnisse werden von einem KI-System generiert. Bitte konsultieren Sie einen Arzt für eine ordnungsgemäße Diagnose und Behandlung.'}
              {language === 'zh' && '这些结果由AI系统生成。请咨询医疗专业人员以获得正确的诊断和治疗。'}
              {language === 'ar' && 'هذه النتائج مولدة بواسطة نظام ذكاء اصطناعي. يرجى استشارة أخصائي رعاية صحية للحصول على التشخيص والعلاج المناسبين.'}
              {language === 'ha' && 'Waɗannan sakamakon tsarin AI ne. Don Allah ku tuntubi ƙwararren likita don samun ingantaccen bincike da magani.'}
              {language === 'yo' && 'Awọn abajade wọnyi jẹ ẹya ti eto AI. Jọwọ kan si oṣiṣẹ ilera alamọdaju fun iwadii ati itọju to peye.'}
              {language === 'ig' && 'Nsonaazụ ndị a bụ nke sistemụ AI mepụtara. Biko kpọtụrụ ọkachamara ahụike maka nyocha na ọgwụgwọ ziri ezi.'}
              {language === 'pcm' && 'Na AI system generate these results. Abeg go see proper doctor for correct check-up and treatment.'}
              {language === 'ff' && 'Ɗee keeɓe ko yuɓɓo AI waɗi ɗum. Tiiɗno jokkondiru jiyaaɗo ngam patnugol e caggal ɗuuɗal.'}
              {language === 'kr' && 'Ani shǝddǝ fal AI kǝlǝ. Shawar likita ngam tǝla ye lawul ngamtoro.'}
              {language === 'ibb' && 'Unwana ami AI emi akpa. Dọñọ dọkita nte ndinam unwana ye mmọ nte ntinya.'}
              {language === 'tiv' && 'U kwaghyan ve AI u kpa. Doo u dooshima sha u kwaghyan nan u ter nahan.'}
              {language === 'ijc' && 'Sẹbiri beni AI tari kọmị. Yẹ dọkita ọkọrọ tọrụ kẹ sọyọ ọkọrọ.'}
              {language === 'bin' && 'Imẹ ye AI ọ kpa. Yọọ ọkaemwẹn vbe unwana ye imẹ nte ntinya.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
