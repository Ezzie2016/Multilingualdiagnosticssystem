import { useEffect, useState } from 'react';
import { DiagnosticInterface } from './components/DiagnosticInterface';
import { LanguageSelector } from './components/LanguageSelector';
import { DiagnosticHistory } from './components/DiagnosticHistory';
import { NLPResults } from './components/NLPResults';
import { Activity, Cpu, FileSearch, Globe, Languages, ShieldCheck } from 'lucide-react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar' | 'ha' | 'yo' | 'ig' | 'pcm' | 'ff' | 'kr' | 'ibb' | 'tiv' | 'ijc' | 'bin';
export type GenderOption = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say' | '';
export type AgeRangeOption = '0-12' | '13-17' | '18-35' | '36-55' | '56+';

export interface PatientProfile {
  ageRange: AgeRangeOption;
  gender: GenderOption;
  language: Language;
}

export interface ClinicianReview {
  reviewerId: string;
  reviewerName: string;
  notes: string;
  reviewedAt: Date;
  confidenceOverrides: Record<number, number>;
}

export interface AuditEntry {
  timestamp: Date;
  actor: 'system' | 'patient' | 'doctor';
  action: string;
  details: string;
}

export interface DiagnosticResult {
  id: string;
  timestamp: Date;
  language: Language;
  symptoms: string;
  diagnoses: {
    condition: string;
    confidence: number;
    description: string;
    recommendations: string[];
  }[];
  entities: {
    text: string;
    type: 'symptom' | 'body_part' | 'duration' | 'severity';
    confidence: number;
  }[];
  patientId?: string;
  patientName?: string;
  patientProfile?: PatientProfile;
  clinicianReview?: ClinicianReview;
  auditTrail?: AuditEntry[];
}

const HISTORY_STORAGE_KEY = 'multilingual-diagnostics-history-v2';
const LEGACY_HISTORY_STORAGE_KEY = 'multilingual-diagnostics-history-v1';

function loadHistory(): DiagnosticResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY) ?? localStorage.getItem(LEGACY_HISTORY_STORAGE_KEY);
    if (!raw) return [];

    type PersistedRecord = Omit<DiagnosticResult, 'timestamp' | 'auditTrail' | 'clinicianReview'> & {
      timestamp: string;
      auditTrail?: Array<Omit<AuditEntry, 'timestamp'> & { timestamp: string }>;
      clinicianReview?: Omit<ClinicianReview, 'reviewedAt'> & { reviewedAt: string };
    };

    const parsed = JSON.parse(raw) as PersistedRecord[];

    return parsed.map((record) => ({
      ...record,
      timestamp: new Date(record.timestamp),
      clinicianReview: record.clinicianReview
        ? {
            ...record.clinicianReview,
            reviewedAt: new Date(record.clinicianReview.reviewedAt)
          }
        : undefined,
      auditTrail: Array.isArray(record.auditTrail)
        ? record.auditTrail.map((entry) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }))
        : []
    }));
  } catch {
    return [];
  }
}

function App() {
  type View = 'landing' | 'diagnostic' | 'results' | 'history';

  const [language, setLanguage] = useState<Language>('en');
  const [history, setHistory] = useState<DiagnosticResult[]>(() => loadHistory());
  const [view, setView] = useState<View>('landing');
  const [latestResult, setLatestResult] = useState<DiagnosticResult | null>(null);

  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    ageRange: '18-35',
    gender: '',
    language: 'en'
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    setPatientProfile((prev) => ({
      ...prev,
      language
    }));
  }, [language]);

  useEffect(() => {
    if (!latestResult && history.length > 0) {
      setLatestResult(history[0]);
    }
  }, [history, latestResult]);

  const translations = {
    en: {
      title: 'Multilingual Medical Diagnostics System',
      subtitle: 'AI-Powered NLP Symptom Analysis',
      tabDiagnostic: 'Analyze',
      tabHistory: 'History'
    }
  };

  const t = translations.en;

  const systemCards = [
    {
      title: 'Multilingual Intake',
      description: 'Users can submit symptom narratives in 16 interface languages.',
      icon: Languages
    },
    {
      title: 'NLP Extraction',
      description: 'Entities are extracted as symptom, body part, duration, and severity.',
      icon: Activity
    },
    {
      title: 'Hybrid Inference',
      description: 'Runs local model inference first, with graceful fallback controls.',
      icon: Cpu
    },
    {
      title: 'Safety Layer',
      description: 'Rule-based fallback keeps analysis available when model providers fail.',
      icon: ShieldCheck
    },
    {
      title: 'Clinical Transparency',
      description: 'Confidence reflects symptom-pattern fit and language extraction quality, not a final diagnosis.',
      icon: FileSearch
    }
  ];

  const handleDiagnosticComplete = (result: DiagnosticResult) => {
    const enrichedResult: DiagnosticResult = {
      ...result,
      patientName: result.patientName ?? 'Patient',
      patientProfile: {
        ...patientProfile,
        language
      },
      auditTrail: [
        ...(result.auditTrail ?? []),
        {
          timestamp: new Date(),
          actor: 'patient',
          action: 'analysis_generated',
          details: 'Analysis generated from patient session.'
        }
      ]
    };

    setHistory((prev) => [enrichedResult, ...prev]);
    setLatestResult(enrichedResult);
    setView('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
                <p className="text-gray-600 mt-1">{t.subtitle}</p>
              </div>
            </div>

            <div className="ml-auto flex w-full flex-wrap items-end justify-end gap-3 lg:flex-nowrap">
              <div className="flex items-center gap-2 whitespace-nowrap lg:shrink-0">
                <button
                  onClick={() => setView('landing')}
                  className={`px-3 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${view === 'landing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  Home
                </button>
                <button
                  onClick={() => setView('diagnostic')}
                  className={`px-3 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${view === 'diagnostic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  {t.tabDiagnostic}
                </button>
                <button
                  onClick={() => setView('results')}
                  disabled={!latestResult}
                  className={`px-3 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${view === 'results' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  Results
                </button>
                <button
                  onClick={() => setView('history')}
                  className={`px-3 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${view === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                >
                  {t.tabHistory}
                </button>
              </div>
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Clinical disclaimer: This tool provides AI-assisted decision support and is not a substitute for professional medical diagnosis.
        </div>

        {view === 'landing' && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {systemCards.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="inline-flex rounded-lg bg-cyan-50 p-2">
                    <Icon className="h-5 w-5 text-cyan-700" />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">{description}</p>
                </article>
              ))}
            </section>
          </div>
        )}

        {view === 'diagnostic' && (
          <DiagnosticInterface
            language={language}
            patientProfile={patientProfile}
            onPatientProfileChange={setPatientProfile}
            onDiagnosticComplete={handleDiagnosticComplete}
          />
        )}

        {view === 'history' && <DiagnosticHistory language={language} history={history} />}

        {view === 'results' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Latest Diagnostic Results</h2>
                <p className="text-sm text-gray-600">
                  NLP Analysis and diagnosis outputs are displayed on this dedicated page.
                </p>
              </div>
              <button
                onClick={() => setView('diagnostic')}
                className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Run New Analysis
              </button>
            </div>

            {latestResult ? (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Session Profile</h3>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
                    <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
                      <p className="text-gray-500">Patient</p>
                      <p className="font-semibold text-gray-900">{latestResult.patientName || 'Patient'}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
                      <p className="text-gray-500">Age Range</p>
                      <p className="font-semibold text-gray-900">{latestResult.patientProfile?.ageRange ?? 'N/A'}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
                      <p className="text-gray-500">Gender</p>
                      <p className="font-semibold text-gray-900">{latestResult.patientProfile?.gender || 'Not provided'}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
                      <p className="text-gray-500">Language</p>
                      <p className="font-semibold text-gray-900">{latestResult.language.toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                <NLPResults result={latestResult} language={language} />

                <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
                  <div className="mt-3 space-y-2">
                    {(latestResult.auditTrail ?? []).length === 0 && (
                      <p className="text-sm text-gray-600">No audit events yet.</p>
                    )}
                    {(latestResult.auditTrail ?? []).slice().reverse().map((entry, index) => (
                      <div key={`${entry.timestamp.toISOString()}-${index}`} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          {entry.timestamp.toLocaleString()} • {entry.actor.toUpperCase()} • {entry.action}
                        </p>
                        <p className="text-sm text-gray-800 mt-1">{entry.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-600">
                No analysis result selected yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
