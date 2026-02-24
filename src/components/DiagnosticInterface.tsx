import { useState } from 'react';
import { AgeRangeOption, DiagnosticResult, GenderOption, Language, PatientProfile } from '../App';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { analyzeSymptoms } from '../utils/nlpEngine';
import { analyzeSymptomsViaApi } from '../utils/nlpApi';

interface DiagnosticInterfaceProps {
  language: Language;
  patientProfile: PatientProfile;
  onPatientProfileChange: (profile: PatientProfile) => void;
  onDiagnosticComplete: (result: DiagnosticResult) => void;
}

export function DiagnosticInterface({
  language,
  patientProfile,
  onPatientProfileChange,
  onDiagnosticComplete
}: DiagnosticInterfaceProps) {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const translations = {
    en: {
      inputLabel: 'Describe Your Symptoms',
      inputPlaceholder: 'Example: I have a severe headache for 3 days, fever, and sore throat...',
      analyzeButton: 'Analyze Symptoms',
      analyzing: 'Analyzing...',
      disclaimer: 'This is an AI-powered diagnostic tool and should not replace professional medical advice.',
      examples: 'Examples:',
      example1: 'I have a persistent cough and chest pain',
      example2: 'Experiencing dizziness and nausea for 2 hours',
      example3: 'Sharp pain in lower back when bending'
    },
    es: {
      inputLabel: 'Describa Sus Síntomas',
      inputPlaceholder: 'Ejemplo: Tengo un dolor de cabeza severo durante 3 días, fiebre y dolor de garganta...',
      analyzeButton: 'Analizar Síntomas',
      analyzing: 'Analizando...',
      disclaimer: 'Esta es una herramienta de diagnóstico con IA y no debe reemplazar el consejo médico profesional.',
      examples: 'Ejemplos:',
      example1: 'Tengo tos persistente y dolor en el pecho',
      example2: 'Experimentando mareos y náuseas durante 2 horas',
      example3: 'Dolor agudo en la parte baja de la espalda al doblarme'
    },
    fr: {
      inputLabel: 'Décrivez Vos Symptômes',
      inputPlaceholder: 'Exemple: J\'ai un mal de tête sévère depuis 3 jours, de la fièvre et un mal de gorge...',
      analyzeButton: 'Analyser les Symptômes',
      analyzing: 'Analyse en cours...',
      disclaimer: 'Ceci est un outil de diagnostic alimenté par l\'IA et ne doit pas remplacer un avis médical professionnel.',
      examples: 'Exemples:',
      example1: 'J\'ai une toux persistante et des douleurs thoraciques',
      example2: 'Je ressens des étourdissements et des nausées depuis 2 heures',
      example3: 'Douleur aiguë dans le bas du dos en me penchant'
    },
    de: {
      inputLabel: 'Beschreiben Sie Ihre Symptome',
      inputPlaceholder: 'Beispiel: Ich habe seit 3 Tagen starke Kopfschmerzen, Fieber und Halsschmerzen...',
      analyzeButton: 'Symptome Analysieren',
      analyzing: 'Analysiere...',
      disclaimer: 'Dies ist ein KI-gestütztes Diagnosetool und sollte professionellen medizinischen Rat nicht ersetzen.',
      examples: 'Beispiele:',
      example1: 'Ich habe anhaltenden Husten und Brustschmerzen',
      example2: 'Seit 2 Stunden Schwindel und Übelkeit',
      example3: 'Stechender Schmerz im unteren Rücken beim Bücken'
    },
    zh: {
      inputLabel: '描述您的症状',
      inputPlaceholder: '例如：我已经头痛3天了，还有发烧和喉咙痛...',
      analyzeButton: '分析症状',
      analyzing: '分析中...',
      disclaimer: '这是一个AI诊断工具，不应替代专业医疗建议。',
      examples: '示例：',
      example1: '我持续咳嗽并且胸痛',
      example2: '头晕和恶心已经2小时了',
      example3: '弯腰时下背部剧痛'
    },
    ar: {
      inputLabel: 'صف أعراضك',
      inputPlaceholder: 'مثال: لدي صداع شديد منذ 3 أيام، حمى، والتهاب في الحلق...',
      analyzeButton: 'تحليل الأعراض',
      analyzing: 'جاري التحليل...',
      disclaimer: 'هذه أداة تشخيصية مدعومة بالذكاء الاصطناعي ولا ينبغي أن تحل محل المشورة الطبية المهنية.',
      examples: 'أمثلة:',
      example1: 'لدي سعال مستمر وألم في الصدر',
      example2: 'أشعر بالدوار والغثيان منذ ساعتين',
      example3: 'ألم حاد في أسفل الظهر عند الانحناء'
    },
    ha: {
      inputLabel: 'Bayyana Alamun Rashin Lafiyarka',
      inputPlaceholder: 'Misali: Ina da ciwon kai mai tsanani kwana 3, zazzabi, da ciwon makogwaro...',
      analyzeButton: 'Bincika Alamun',
      analyzing: 'Ana Bincikewa...',
      disclaimer: 'Wannan kayan aikin bincike ne wanda AI ke gudanarwa kuma bai kamata ya maye gurbin shawarar likita ba.',
      examples: 'Misalai:',
      example1: 'Ina da tari mai dawwama da ciwon kirji',
      example2: 'Ina jin suma da tashin zuciya na awanni 2',
      example3: 'Ciwon baya mai kaifi lokacin sunkuyarwa'
    },
    yo: {
      inputLabel: 'Ṣe Apejuwe Awọn Ami-aisan Rẹ',
      inputPlaceholder: 'Apẹẹrẹ: Mo ni irori ori nla fun ọjọ 3, iba, ati ọfun ọfun...',
      analyzeButton: 'Ṣe Itupalẹ Awọn Ami',
      analyzing: 'N ṣe Itupalẹ...',
      disclaimer: 'Eyi jẹ ohun elo iwadii ti AI ṣe ati pe ko yẹ ki o ropo imọran oṣiṣẹ ilera alamọdaju.',
      examples: 'Awọn Apẹẹrẹ:',
      example1: 'Mo ni ikọ ti o tẹsiwaju ati irora ọkan',
      example2: 'Mo n ni irora ori ati ikorira fun wakati 2',
      example3: 'Irora didasilẹ ni ẹhin isalẹ nigbati mo ba tẹ'
    },
    ig: {
      inputLabel: 'Kọwaa Mgbaàmà Ọrịa Gị',
      inputPlaceholder: 'Ọmụmaatụ: Enwere m isi ọwụwa siri ike ụbọchị 3, ahụ ọkụ, na akpịrị mgbu...',
      analyzeButton: 'Nyochaa Mgbaàmà',
      analyzing: 'Na-enyocha...',
      disclaimer: 'Nke a bụ ngwa nyocha AI na ekwesịghị ịnọchi ọrụ ndụmọdụ dọkịta ọkachamara.',
      examples: 'Ọmụmaatụ:',
      example1: 'Enwere m ụkwara na-adịgide adịgide na mgbu obi',
      example2: 'Ana m enwe isi ọwụwa na ọgbụgbọ awa 2',
      example3: 'Mgbu dị nkọ n\'azụ mgbe m na-ehulata'
    },
    pcm: {
      inputLabel: 'Talk Wetin Dey Worry You',
      inputPlaceholder: 'Example: I get serious headache for 3 days, fever, and sore throat...',
      analyzeButton: 'Check Am',
      analyzing: 'Dey Check Am...',
      disclaimer: 'Na AI tool be dis and e no suppose replace proper doctor advice.',
      examples: 'Examples:',
      example1: 'I get cough wey no wan stop and chest pain',
      example2: 'My head dey turn and belle dey pain me for 2 hours',
      example3: 'Sharp pain for my back when I bend'
    },
    ff: {
      inputLabel: 'Hollir Siifto-yejji Maa',
      inputPlaceholder: 'Wano: Mi heɓii hoore yejjitee sukaaɓe 3, jummirde, e yejji kunnde...',
      analyzeButton: 'Yiyto Siiftooji',
      analyzing: 'Ko Yiytaa...',
      disclaimer: 'Oo ko kuutorgal AI kadi foti woppude anniyagol jiyaaɗo.',
      examples: 'Wanooji:',
      example1: 'Mi heɓii tuttungol mo woppi e yejji heccere',
      example2: 'Mi heɓi hoore yejjitaare e ɓeynugol sahaa ɗiɗi',
      example3: 'Yejji ceertuɗo e layɗo am so mi yettii'
    },
    kr: {
      inputLabel: 'Gana Shǝddǝ Wuye Ngamnaro',
      inputPlaceholder: 'Misali: Wuye kashikro kǝnǝ kashiri 3, kurowa, ye wuye kelǝ...',
      analyzeButton: 'Tǝla Shǝddǝ Wuye',
      analyzing: 'Tǝla Kǝlǝ...',
      disclaimer: 'Ani fal AI law ye kambe ngam shawar likita ngam.',
      examples: 'Misalai:',
      example1: 'Wuye toshi kǝlǝ ye kashikro wuye',
      example2: 'Kashikro tawar ye kǝra kursi 2',
      example3: 'Wuye kashikro kambe ngalaro layiwa'
    },
    ibb: {
      inputLabel: 'Sọñọ Mkpọ Ukut Fo',
      inputPlaceholder: 'Ntinya: Ndinam mkpọ ukọ nkpọ ke usọñ 3, ukut emi asịsọñ, ye mkpọ ufọk...',
      analyzeButton: 'Tọp Mkpọ Ukut',
      analyzing: 'Emi Ntọp...',
      disclaimer: 'Nka ete ukpeme AI ke ikpa ikwọrọ ndisịọñọ unwana dọkita nte ntinya.',
      examples: 'Ntinya:',
      example1: 'Ndinam ntufọk emi akpa ikpa ye mkpọ obot',
      example2: 'Ukọ yem emi ndiwụt ye nkpọ ikọt ke awa iba',
      example3: 'Mkpọ nkpọ ke ayara yem ke ndiyet'
    },
    tiv: {
      inputLabel: 'Kôô U Kwaghyan Nahan Or',
      inputPlaceholder: 'Nahan: M ga u ter i ken sha hembe ahar atar, ikumen, nan u ter i gwaghwa...',
      analyzeButton: 'Inkiahar U Kwaghyan',
      analyzing: 'Ga Inkiahar...',
      disclaimer: 'Iyo ve u kwaghyan AI ka i kpa mzough u ter sha i dooshima ka.',
      examples: 'Nahan:',
      example1: 'M ga u tuen nan u ter i gbaange',
      example2: 'Ken yem ga ikyume nan ikumen sha utar iwa',
      example3: 'U ter ken i uveren yem ka m ne ga iorkyaa'
    },
    ijc: {
      inputLabel: 'Sọ Tẹin Sẹbiri Bụọ',
      inputPlaceholder: 'Ọmụma: Mị kiri tẹin ụrụ bara ụbọ 3, ọwọrọ gbanị, kẹ tẹin kpọn...',
      analyzeButton: 'Tọrụ Tẹin Sẹbiri',
      analyzing: 'Tọrụ Kẹ...',
      disclaimer: 'Beni tuwo AI bi kẹ iyẹ gbara ikemị sọyọ dọkita ọkọrọ.',
      examples: 'Ọmụma:',
      example1: 'Mị kiri kọfị tari kẹ tẹin ọkaka',
      example2: 'Ụrụ yem tẹin kẹ ẹkpụ bara awa iba',
      example3: 'Tẹin bara bẹlẹ yem sọ mị yebọ'
    },
    bin: {
      inputLabel: 'Kpọlọ Uhan Ọkpa Ọ',
      inputPlaceholder: 'Ikhuan: Mẹ rrẹn ukpọn ukpọ guẹguẹ ukpọn ẹvbọ ẹrha, ọwọrọ, ye ukpọn ẹhọn...',
      analyzeButton: 'Mẹ Uhan Ọkpa',
      analyzing: 'Ọ Mẹ...',
      disclaimer: 'Beni imẹ AI vbe ọ khian gbee ọ tie sọyọ ọkaemwẹn.',
      examples: 'Ikhuan:',
      example1: 'Mẹ rrẹn uku guẹguẹ ye ukpọn okhuo',
      example2: 'Ukpọn yem ọ koko ye ẹkpụ vbe ọwọ iba',
      example3: 'Ukpọn bara bẹlẹ yem sọ mẹ yẹ'
    }
  };

  const t = translations[language] || translations.en;

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);

    let diagnosticResult: DiagnosticResult;
    try {
  diagnosticResult = await analyzeSymptomsViaApi(symptoms, language);
  if (!diagnosticResult.diagnoses.length) {
    diagnosticResult = analyzeSymptoms(symptoms, language); // frontend fallback
  }
} catch {
  diagnosticResult = analyzeSymptoms(symptoms, language); // frontend fallback
}

    onDiagnosticComplete(diagnosticResult);
    setIsAnalyzing(false);
  };

  const handleExampleClick = (example: string) => {
    setSymptoms(example);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-[#b9defb] bg-white p-5 shadow-sm">
        <h2 className="text-5xl font-bold leading-tight text-[#1089e4]">AI Symptom Checker</h2>
        <p className="mt-2 text-2xl leading-tight text-slate-700">
          Get a preliminary assessment of your symptoms and potential conditions to discuss with your healthcare provider.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.05fr_1.45fr]">
        <div className="rounded-3xl border border-[#9dcff8] bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">Patient Profile</h3>
            <p className="text-sm text-slate-600">Captured for session records and export.</p>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">Age Range</label>
                <select
                  value={patientProfile.ageRange}
                  onChange={(event) =>
                    onPatientProfileChange({
                      ...patientProfile,
                      ageRange: event.target.value as AgeRangeOption
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-[#118be7] focus:border-transparent"
                >
                  <option value="0-12">0-12</option>
                  <option value="13-17">13-17</option>
                  <option value="18-35">18-35</option>
                  <option value="36-55">36-55</option>
                  <option value="56+">56+</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Gender (Optional)</label>
                <select
                  value={patientProfile.gender}
                  onChange={(event) =>
                    onPatientProfileChange({
                      ...patientProfile,
                      gender: event.target.value as GenderOption
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-[#118be7] focus:border-transparent"
                >
                  <option value="">Not provided</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non_binary">Non-binary</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Language</label>
                <div className="mt-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                  {language.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <label className="mb-3 block text-xl font-semibold text-slate-900">
            {t.inputLabel}
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={t.inputPlaceholder}
            rows={7}
            className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-base text-slate-800 focus:ring-2 focus:ring-[#118be7] focus:border-transparent"
          />

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-slate-700">{t.examples}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleExampleClick(t.example1)}
                className="rounded-full border border-[#b9defb] bg-[#e8f5ff] px-3 py-1.5 text-sm text-[#0f5d9d]"
              >
                {t.example1}
              </button>
              <button
                onClick={() => handleExampleClick(t.example2)}
                className="rounded-full border border-[#b9defb] bg-[#e8f5ff] px-3 py-1.5 text-sm text-[#0f5d9d]"
              >
                {t.example2}
              </button>
              <button
                onClick={() => handleExampleClick(t.example3)}
                className="rounded-full border border-[#b9defb] bg-[#e8f5ff] px-3 py-1.5 text-sm text-[#0f5d9d]"
              >
                {t.example3}
              </button>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!symptoms.trim() || isAnalyzing}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#118be7] px-6 py-3 text-lg font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t.analyzing}
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                {t.analyzeButton}
              </>
            )}
          </button>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">{t.disclaimer}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#9dcff8] bg-[#edf6ff] p-8 shadow-sm">
          <div className="flex h-full min-h-[560px] flex-col items-center justify-center text-center">
            <div className="text-7xl text-[#6f91af]">✧</div>
            <h3 className="mt-5 text-4xl font-semibold text-slate-700">Your generated content will appear here</h3>
            <p className="mt-2 text-lg text-slate-600">Fill in the inputs and click Analyze Symptoms</p>
          </div>
        </div>
      </div>
    </div>
  );
}
