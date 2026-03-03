import { DiagnosticResult, Language } from '../App';
import { FileText, TrendingUp, Calendar, User, Globe, Trash2 } from 'lucide-react';

interface DiagnosticHistoryProps {
  language: Language;
  history: DiagnosticResult[];
  onDelete?: (id: string) => void;
}

export function DiagnosticHistory({ language, history, onDelete }: DiagnosticHistoryProps) {
  const translations: Record<string, Record<string, string>> = {
    en:  { title: 'Diagnostic History', noHistory: 'No diagnostic history yet', noHistoryDesc: 'Your previous diagnostic sessions will appear here', symptoms: 'Symptoms', diagnoses: 'Diagnoses', timestamp: 'Date & Time', patientProfile: 'Patient Profile', ageRange: 'Age Range', gender: 'Gender', genderNA: 'Not provided', lang: 'Language', clinicianReview: 'Clinician Review', noNotes: 'No clinician notes provided.' },
    es:  { title: 'Historial de Diagnósticos', noHistory: 'Sin historial de diagnósticos', noHistoryDesc: 'Sus sesiones de diagnóstico anteriores aparecerán aquí', symptoms: 'Síntomas', diagnoses: 'Diagnósticos', timestamp: 'Fecha y Hora', patientProfile: 'Perfil del Paciente', ageRange: 'Rango de Edad', gender: 'Género', genderNA: 'No proporcionado', lang: 'Idioma', clinicianReview: 'Revisión Clínica', noNotes: 'No se proporcionaron notas clínicas.' },
    fr:  { title: 'Historique des Diagnostics', noHistory: 'Aucun historique de diagnostic', noHistoryDesc: 'Vos sessions de diagnostic précédentes apparaîtront ici', symptoms: 'Symptômes', diagnoses: 'Diagnostics', timestamp: 'Date et Heure', patientProfile: 'Profil du Patient', ageRange: "Tranche d'âge", gender: 'Genre', genderNA: 'Non fourni', lang: 'Langue', clinicianReview: 'Avis Clinique', noNotes: 'Aucune note clinique fournie.' },
    de:  { title: 'Diagnoseverlauf', noHistory: 'Noch kein Diagnoseverlauf', noHistoryDesc: 'Ihre vorherigen Diagnosesitzungen werden hier angezeigt', symptoms: 'Symptome', diagnoses: 'Diagnosen', timestamp: 'Datum und Uhrzeit', patientProfile: 'Patientenprofil', ageRange: 'Altersbereich', gender: 'Geschlecht', genderNA: 'Nicht angegeben', lang: 'Sprache', clinicianReview: 'Klinische Überprüfung', noNotes: 'Keine klinischen Notizen vorhanden.' },
    zh:  { title: '诊断历史', noHistory: '暂无诊断历史', noHistoryDesc: '您之前的诊断会话将显示在这里', symptoms: '症状', diagnoses: '诊断', timestamp: '日期和时间', patientProfile: '患者档案', ageRange: '年龄范围', gender: '性别', genderNA: '未提供', lang: '语言', clinicianReview: '临床审查', noNotes: '未提供临床备注。' },
    ar:  { title: 'سجل التشخيص', noHistory: 'لا يوجد سجل تشخيص بعد', noHistoryDesc: 'ستظهر جلسات التشخيص السابقة هنا', symptoms: 'الأعراض', diagnoses: 'التشخيصات', timestamp: 'التاريخ والوقت', patientProfile: 'ملف المريض', ageRange: 'الفئة العمرية', gender: 'الجنس', genderNA: 'غير محدد', lang: 'اللغة', clinicianReview: 'المراجعة السريرية', noNotes: 'لا توجد ملاحظات سريرية.' },
    ha:  { title: 'Tarihin Bincike', noHistory: 'Babu tarihin bincike tukuna', noHistoryDesc: 'Binciken da aka yi a baya za su bayyana nan', symptoms: 'Alamun', diagnoses: 'Bincike', timestamp: 'Ranar & Lokaci', patientProfile: 'Bayanan Majinyaci', ageRange: 'Kewayon Shekaru', gender: 'Jinsi', genderNA: 'Ba a bayar da shi ba', lang: 'Harshe', clinicianReview: 'Nazarin Likita', noNotes: 'Babu bayanan likita.' },
    yo:  { title: 'Itan Iwadii', noHistory: 'Ko si itan iwadii sibẹsibẹ', noHistoryDesc: 'Awọn igbeyewo iwadii rẹ ti tẹlẹ yoo han nibi', symptoms: 'Awọn Ami', diagnoses: 'Awọn Iwadii', timestamp: 'Ọjọ & Akoko', patientProfile: 'Profaili Alaisan', ageRange: 'Ìpele Ọjọ ori', gender: 'Akọ tabi Abo', genderNA: 'A ko pese', lang: 'Ede', clinicianReview: 'Atunyẹwo Dokita', noNotes: 'Ko si awọn akọsilẹ dokita.' },
    ig:  { title: 'Akụkọ Nyocha', noHistory: 'Enweghị akụkọ nyocha ugbu a', noHistoryDesc: 'Nyocha gị nke gara aga ga-apụta ebe a', symptoms: 'Mgbaàmà', diagnoses: 'Nyocha', timestamp: 'Ụbọchị & Oge', patientProfile: 'Profaịlụ Onye Ọrịa', ageRange: 'Ọnụọgụ Afọ', gender: 'Okike', genderNA: 'Enweghị', lang: 'Asụsụ', clinicianReview: 'Nyocha Dọkịta', noNotes: 'Enweghị ndetu dọkịta.' },
    pcm: { title: 'Old Check-Up Records', noHistory: 'No old check-up record yet', noHistoryDesc: 'Your old check-up go show for here', symptoms: 'Symptoms', diagnoses: 'Check-Up Results', timestamp: 'Date & Time', patientProfile: 'Patient Info', ageRange: 'Age Range', gender: 'Gender', genderNA: 'No provide am', lang: 'Language', clinicianReview: 'Doctor Review', noNotes: 'Doctor no write anything.' },
    ff:  { title: 'Taariikh Patnugol', noHistory: 'Alaa taariikh patnugol jooni', noHistoryDesc: 'Patnugol maa ɓennuɗe ɗoo yaltude ɗoo', symptoms: 'Siiftooji', diagnoses: 'Patnugol', timestamp: 'Ñalawma & Sahaa', patientProfile: 'Tiitoonde Gorko', ageRange: 'Duuɓi', gender: 'Suɓe', genderNA: 'Alaa', lang: 'Lamde', clinicianReview: 'Yiytorgol Jiyaaɗo', noNotes: 'Alaa binndanɗe jiyaaɗo.' },
    kr:  { title: 'Tǝla Kawi Shǝddǝ', noHistory: 'Kambe tǝla kawi shǝddǝ', noHistoryDesc: 'Shǝddǝ ngamnaro kawiro yaye kǝlǝ', symptoms: 'Wuye', diagnoses: 'Shǝddǝ', timestamp: 'Lā & Kursi', patientProfile: 'Ngamnaro Kǝla', ageRange: 'Shekara', gender: 'Ngo', genderNA: 'Kambe', lang: 'Luwa', clinicianReview: 'Tǝla Likita', noNotes: 'Kambe tǝla likita.' },
    ibb: { title: 'Usem Unwana', noHistory: 'Akpa usem unwana', noHistoryDesc: 'Unwana fo emi anam yak ndak edi', symptoms: 'Mkpọ Ukut', diagnoses: 'Unwana', timestamp: 'Usọñ & Ufọk', patientProfile: 'Ndinam Unwana', ageRange: 'Ndito Mfon', gender: 'Isọñ', genderNA: 'Enye akpa', lang: 'Oro', clinicianReview: 'Mmọ Dọkita', noNotes: 'Dọkita enye akpa ntre.' },
    tiv: { title: 'Ishima Ya U Ian', noHistory: 'Kpa ishima ya u ian', noHistoryDesc: 'U kwaghyan or ya u ian ga tor ahan', symptoms: 'Kwaghyan', diagnoses: 'U Kwaghyan', timestamp: 'U Soo & U Tar', patientProfile: 'Ishima Or', ageRange: 'Wan Ihiir', gender: 'Igba', genderNA: 'Kpa', lang: 'Iyol', clinicianReview: 'U Dooshima', noNotes: 'Kpa u dooshima.' },
    ijc: { title: 'Tuwo Tein Sẹbiri', noHistory: 'Yẹ tuwo tein sẹbiri', noHistoryDesc: 'Sẹbiri bụọ tein yem yẹ kọmị ọdọ', symptoms: 'Tẹin', diagnoses: 'Sẹbiri', timestamp: 'Ụbọ & Tari', patientProfile: 'Biri Sẹbiri', ageRange: 'Oru Tari', gender: 'Gboro', genderNA: 'Yẹ kọmị', lang: 'Ebe', clinicianReview: 'Tọrụ Dọkita', noNotes: 'Dọkita yẹ kọmị ọrọ.' },
    bin: { title: 'Itan Imẹ Igho', noHistory: 'Khian itan imẹ', noHistoryDesc: 'Imẹ ọ kpa tein yak kọmị ọdọ', symptoms: 'Ukpọn', diagnoses: 'Imẹ', timestamp: 'Ẹvbọ & Ukpọn', patientProfile: 'Ẹtin Imẹ', ageRange: 'Ẹdẹ Afọ', gender: 'Okpia', genderNA: 'Ọ ghẹ rẹn', lang: 'Ẹdo', clinicianReview: 'Imẹ Dọkita', noNotes: 'Dọkita ọ ghẹ ree ẹtin.' },
  };

  const t = translations[language] || translations.en;

  const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    const lang = language as string;
    const locale =
      lang === 'ar' ? 'ar-SA'
      : lang === 'zh' ? 'zh-CN'
      : ['en', 'es', 'fr', 'de'].includes(lang) ? lang
      : 'en';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(d);
  };

  const getConfidenceMeta = (confidence: number) => {
    if (confidence >= 0.7) return { color: 'var(--green)', bg: 'var(--green-dim)', border: '#a7f3d0' };
    if (confidence >= 0.4) return { color: 'var(--amber)', bg: 'var(--amber-dim)', border: '#fde68a' };
    return { color: 'var(--red)', bg: 'var(--red-dim)', border: '#fecaca' };
  };

  /* ── Empty state ─────────────────────────────────────────────────────── */
  if (history.length === 0) {
    return (
      <div className="card card--center">
        <div className="empty-state">
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--surface-3)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <FileText style={{ width: 28, height: 28, color: 'var(--ink-muted)' }} />
          </div>
          <p className="empty-state__title">{t.noHistory}</p>
          <p className="empty-state__sub">{t.noHistoryDesc}</p>
        </div>
      </div>
    );
  }

  /* ── Record list ─────────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {history.map((record, recordIndex) => (
        <div key={record.id} className={`card anim-up anim-up-${Math.min(recordIndex + 1, 6)}`}>

          {/* Header: date + language badge */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 10, marginBottom: 16,
            paddingBottom: 14, borderBottom: '1px solid var(--border)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 13, color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)',
            }}>
              <Calendar style={{ width: 14, height: 14, flexShrink: 0 }} />
              {formatDate(record.timestamp)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--teal-light)', border: '1px solid #99f6e4',
                borderRadius: 20, padding: '4px 10px',
              }}>
                <Globe style={{ width: 12, height: 12, color: 'var(--teal-hover)' }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                  color: 'var(--teal-hover)', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{record.language}</span>
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(record.id)}
                  title={t.delete || 'Delete'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: 'none', padding: 6,
                    color: 'var(--red)', cursor: 'pointer',
                    borderRadius: '50%', transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--red-dim)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 style={{ width: 16, height: 16 }} />
                </button>
              )}
            </div>
          </div>

          {/* Symptoms */}
          <div style={{ marginBottom: 14 }}>
            <span className="section-label" style={{ display: 'block', marginBottom: 6 }}>
              {t.symptoms}
            </span>
            <p style={{
              fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6,
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '10px 14px', margin: 0,
            }}>{record.symptoms}</p>
          </div>

          {/* Patient Profile */}
          {record.patientProfile && (
            <div style={{ marginBottom: 14 }}>
              <span className="section-label" style={{
                display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8,
              }}>
                <User style={{ width: 11, height: 11 }} />
                {t.patientProfile}
              </span>
              <div className="profile-grid">
                <div className="profile-cell">
                  <span className="profile-cell__label">{t.ageRange}</span>
                  <p className="profile-cell__value">{record.patientProfile.ageRange}</p>
                </div>
                <div className="profile-cell">
                  <span className="profile-cell__label">{t.gender}</span>
                  <p className="profile-cell__value">{record.patientProfile.gender || t.genderNA}</p>
                </div>
                <div className="profile-cell">
                  <span className="profile-cell__label">{t.lang}</span>
                  <p className="profile-cell__value">{record.patientProfile.language.toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Diagnoses */}
          <div style={{ marginBottom: record.clinicianReview ? 14 : 0 }}>
            <span className="section-label" style={{ display: 'block', marginBottom: 8 }}>
              {t.diagnoses}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {record.diagnoses.map((diagnosis, index) => {
                const cm = getConfidenceMeta(diagnosis.confidence);
                return (
                  <div key={index} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 12, flexWrap: 'wrap',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '10px 14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 10,
                        color: 'var(--ink-muted)', flexShrink: 0,
                      }}>#{index + 1}</span>
                      <span style={{
                        fontSize: 14, fontWeight: 600, color: 'var(--ink)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{diagnosis.condition}</span>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: cm.bg, border: `1px solid ${cm.border}`,
                      borderRadius: 20, padding: '3px 10px', flexShrink: 0,
                    }}>
                      <TrendingUp style={{ width: 12, height: 12, color: cm.color }} />
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        fontWeight: 700, color: cm.color,
                      }}>{Math.round(diagnosis.confidence * 100)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinician Review */}
          {record.clinicianReview && (
            <div style={{
              background: 'var(--amber-dim)', border: '1px solid #fde68a',
              borderRadius: 'var(--radius)', padding: '12px 14px',
            }}>
              <span className="section-label" style={{
                display: 'block', color: 'var(--amber)', marginBottom: 6,
              }}>{t.clinicianReview}</span>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#92400e', margin: '0 0 2px' }}>
                {record.clinicianReview.reviewerName}
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: '#a16207', margin: '0 0 8px',
              }}>
                {new Date(record.clinicianReview.reviewedAt).toLocaleString()}
              </p>
              <p style={{ fontSize: 13, color: '#92400e', margin: 0, lineHeight: 1.55 }}>
                {record.clinicianReview.notes || t.noNotes}
              </p>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}