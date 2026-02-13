import { DiagnosticResult, Language } from '../App';
import { Clock, FileText, TrendingUp, Calendar } from 'lucide-react';

interface DiagnosticHistoryProps {
  language: Language;
  history: DiagnosticResult[];
}

export function DiagnosticHistory({ language, history }: DiagnosticHistoryProps) {
  const translations = {
    en: {
      title: 'Diagnostic History',
      noHistory: 'No diagnostic history yet',
      noHistoryDesc: 'Your previous diagnostic sessions will appear here',
      symptoms: 'Symptoms',
      diagnoses: 'Diagnoses',
      confidence: 'Confidence',
      timestamp: 'Date & Time'
    },
    es: {
      title: 'Historial de Diagnósticos',
      noHistory: 'Sin historial de diagnósticos',
      noHistoryDesc: 'Sus sesiones de diagnóstico anteriores aparecerán aquí',
      symptoms: 'Síntomas',
      diagnoses: 'Diagnósticos',
      confidence: 'Confianza',
      timestamp: 'Fecha y Hora'
    },
    fr: {
      title: 'Historique des Diagnostics',
      noHistory: 'Aucun historique de diagnostic',
      noHistoryDesc: 'Vos sessions de diagnostic précédentes apparaîtront ici',
      symptoms: 'Symptômes',
      diagnoses: 'Diagnostics',
      confidence: 'Confiance',
      timestamp: 'Date et Heure'
    },
    de: {
      title: 'Diagnoseverlauf',
      noHistory: 'Noch kein Diagnoseverlauf',
      noHistoryDesc: 'Ihre vorherigen Diagnosesitzungen werden hier angezeigt',
      symptoms: 'Symptome',
      diagnoses: 'Diagnosen',
      confidence: 'Vertrauen',
      timestamp: 'Datum & Uhrzeit'
    },
    zh: {
      title: '诊断历史',
      noHistory: '暂无诊断历史',
      noHistoryDesc: '您之前的诊断会话将显示在这里',
      symptoms: '症状',
      diagnoses: '诊断',
      confidence: '置信度',
      timestamp: '日期和时间'
    },
    ar: {
      title: 'سجل التشخيص',
      noHistory: 'لا يوجد سجل تشخيص بعد',
      noHistoryDesc: 'ستظهر جلسات التشخيص السابقة هنا',
      symptoms: 'الأعراض',
      diagnoses: 'التشخيصات',
      confidence: 'الثقة',
      timestamp: 'التاريخ والوقت'
    },
    ha: {
      title: 'Tarihin Bincike',
      noHistory: 'Babu tarihin bincike tukuna',
      noHistoryDesc: 'Binciken da aka yi a baya za su bayyana nan',
      symptoms: 'Alamun',
      diagnoses: 'Bincike',
      confidence: 'Aminci',
      timestamp: 'Ranar & Lokaci'
    },
    yo: {
      title: 'Itan Iwadii',
      noHistory: 'Ko si itan iwadii sibẹsibẹ',
      noHistoryDesc: 'Awọn igbeyewo iwadii rẹ ti tẹlẹ yoo han nibi',
      symptoms: 'Awọn Ami',
      diagnoses: 'Awọn Iwadii',
      confidence: 'Igbẹkẹle',
      timestamp: 'Ọjọ & Akoko'
    },
    ig: {
      title: 'Akụkọ Nyocha',
      noHistory: 'Enweghị akụkọ nyocha ugbu a',
      noHistoryDesc: 'Nyocha gị nke gara aga ga-apụta ebe a',
      symptoms: 'Mgbaàmà',
      diagnoses: 'Nyocha',
      confidence: 'Ntụkwasị Obi',
      timestamp: 'Ụbọchị & Oge'
    },
    pcm: {
      title: 'Old Check-Up Records',
      noHistory: 'No old check-up record yet',
      noHistoryDesc: 'Your old check-up go show for here',
      symptoms: 'Symptoms',
      diagnoses: 'Check-Up Results',
      confidence: 'How Sure',
      timestamp: 'Date & Time'
    },
    ff: {
      title: 'Taariikh Patnugol',
      noHistory: 'Alaa taariikh patnugol jooni',
      noHistoryDesc: 'Patnugol maa ɓennuɗe ɗoo yaltude ɗoo',
      symptoms: 'Siiftooji',
      diagnoses: 'Patnugol',
      confidence: 'Jaabawol',
      timestamp: 'Ñalawma & Sahaa'
    },
    kr: {
      title: 'Tǝla Kawi Shǝddǝ',
      noHistory: 'Kambe tǝla kawi shǝddǝ',
      noHistoryDesc: 'Shǝddǝ ngamnaro kawiro yaye kǝlǝ',
      symptoms: 'Wuye',
      diagnoses: 'Shǝddǝ',
      confidence: 'Ngamtoro',
      timestamp: 'Lā & Kursi'
    },
    ibb: {
      title: 'Usem Unwana',
      noHistory: 'Akpa usem unwana',
      noHistoryDesc: 'Unwana fo emi anam yak ndak edi',
      symptoms: 'Mkpọ Ukut',
      diagnoses: 'Unwana',
      confidence: 'Ubọk Mkpa',
      timestamp: 'Usọñ & Ufọk'
    },
    tiv: {
      title: 'Ishima Ya U Ian',
      noHistory: 'Kpa ishima ya u ian',
      noHistoryDesc: 'U kwaghyan or ya u ian ga tor ahan',
      symptoms: 'Kwaghyan',
      diagnoses: 'U Kwaghyan',
      confidence: 'U Kwagh',
      timestamp: 'U Soo & U Tar'
    },
    ijc: {
      title: 'Tuwo Tein Sẹbiri',
      noHistory: 'Yẹ tuwo tein sẹbiri',
      noHistoryDesc: 'Sẹbiri bụọ tein yem yẹ kọmị ọdọ',
      symptoms: 'Tẹin',
      diagnoses: 'Sẹbiri',
      confidence: 'Tọrụ',
      timestamp: 'Ụbọ & Tari'
    },
    bin: {
      title: 'Itan Imẹ Igho',
      noHistory: 'Khian itan imẹ',
      noHistoryDesc: 'Imẹ ọ kpa tein yak kọmị ọdọ',
      symptoms: 'Ukpọn',
      diagnoses: 'Imẹ',
      confidence: 'Ebọ',
      timestamp: 'Ẹvbọ & Ukpọn'
    }
  };

  const t = translations[language] || translations.en;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : language === 'zh' ? 'zh-CN' : language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.noHistory}</h3>
        <p className="text-gray-600">{t.noHistoryDesc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((record) => (
        <div key={record.id} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {formatDate(record.timestamp)}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              {record.language.toUpperCase()}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">{t.symptoms}:</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{record.symptoms}</p>
          </div>

          {record.patientProfile && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Patient Profile:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                  <p className="text-gray-500">Age Range</p>
                  <p className="font-semibold text-gray-900">{record.patientProfile.ageRange}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                  <p className="text-gray-500">Gender</p>
                  <p className="font-semibold text-gray-900">{record.patientProfile.gender || 'Not provided'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                  <p className="text-gray-500">Language</p>
                  <p className="font-semibold text-gray-900">{record.patientProfile.language.toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{t.diagnoses}:</h3>
            <div className="space-y-2">
              {record.diagnoses.map((diagnosis, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
                >
                  <span className="font-medium text-gray-900">{diagnosis.condition}</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round(diagnosis.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {record.clinicianReview && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Clinician Review by {record.clinicianReview.reviewerName}
              </p>
              <p className="text-xs text-amber-800 mt-1">
                {new Date(record.clinicianReview.reviewedAt).toLocaleString()}
              </p>
              <p className="text-sm text-amber-900 mt-2">
                {record.clinicianReview.notes || 'No clinician notes provided.'}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
