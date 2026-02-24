import { useEffect, useState } from "react";
import { DiagnosticInterface } from "./components/DiagnosticInterface";
import { LanguageSelector } from "./components/LanguageSelector";
import { DiagnosticHistory } from "./components/DiagnosticHistory";
import { NLPResults } from "./components/NLPResults";
import { UserMenu } from "./components/UserMenu";
import { useAuth } from "./context/AuthContext";
import { saveSession, loadSessions } from "./utils/sessionStorage";
import {
  Activity,
  ArrowRight,
  Cpu,
  FileSearch,
  Globe,
  Languages,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "zh"
  | "ar"
  | "ha"
  | "yo"
  | "ig"
  | "pcm"
  | "ff"
  | "kr"
  | "ibb"
  | "tiv"
  | "ijc"
  | "bin";
export type GenderOption =
  | "female"
  | "male"
  | "non_binary"
  | "prefer_not_to_say"
  | "";
export type AgeRangeOption = "0-12" | "13-17" | "18-35" | "36-55" | "56+";

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
  actor: "system" | "patient" | "doctor";
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
    type: "symptom" | "body_part" | "duration" | "severity";
    confidence: number;
  }[];
  patientId?: string;
  patientName?: string;
  patientProfile?: PatientProfile;
  clinicianReview?: ClinicianReview;
  auditTrail?: AuditEntry[];
}

function App() {
  type View = "landing" | "diagnostic" | "results" | "history";

  const { user } = useAuth();

  const [language, setLanguage] = useState<Language>("en");
  const [history, setHistory] = useState<DiagnosticResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [view, setView] = useState<View>("landing");
  const [latestResult, setLatestResult] = useState<DiagnosticResult | null>(
    null,
  );

  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    ageRange: "18-35",
    gender: "",
    language: "en",
  });

  useEffect(() => {
    setHistoryLoading(true);
    loadSessions()
      .then((sessions) => {
        setHistory(sessions);
        if (sessions.length > 0) {
          setLatestResult(sessions[0]);
        }
      })
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    setPatientProfile((prev) => ({ ...prev, language }));
  }, [language]);

  const translations = {
    en: {
      subtitle: "AI-Powered NLP Symptom Analysis",
      tabHistory: "History",
    },
  };

  const t = translations.en;

  const systemCards = [
    {
      title: "Multilingual Intake",
      description:
        "Users can submit symptom narratives in 16 interface languages.",
      icon: Languages,
    },
    {
      title: "NLP Extraction",
      description:
        "Entities are extracted as symptom, body part, duration, and severity.",
      icon: Activity,
    },
    {
      title: "Hybrid Inference",
      description:
        "Runs local model inference first, with graceful fallback controls.",
      icon: Cpu,
    },
    {
      title: "Safety Layer",
      description:
        "Rule-based fallback keeps analysis available when model providers fail.",
      icon: ShieldCheck,
    },
    {
      title: "Clinical Transparency",
      description:
        "Confidence reflects symptom-pattern fit and language extraction quality, not a final diagnosis.",
      icon: FileSearch,
    },
  ];

  const handleDiagnosticComplete = (result: DiagnosticResult) => {
    const enrichedResult: DiagnosticResult = {
      ...result,
      patientName: result.patientName ?? "Patient",
      patientProfile: { ...patientProfile, language },
      auditTrail: [
        ...(result.auditTrail ?? []),
        {
          timestamp: new Date(),
          actor: "patient",
          action: "analysis_generated",
          details: "Analysis generated from patient session.",
        },
      ],
    };

    setHistory((prev) => [enrichedResult, ...prev]);
    setLatestResult(enrichedResult);
    setView("results");

    if (user) {
      saveSession(enrichedResult, user.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#ebf2f9] text-slate-900">
      <div className="bg-[#118be7] shadow-lg">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-300">
              <Globe className="h-5 w-5 text-[#116db8]" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">MedAssist AI</p>
              <p className="text-xs text-blue-100">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              onClick={() => setView("landing")}
              className={`rounded-full px-4 py-2 font-semibold transition-colors ${
                view === "landing"
                  ? "bg-white text-[#118be7]"
                  : "text-white/90 hover:bg-white/15"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setView("diagnostic")}
              className={`rounded-full px-4 py-2 font-semibold transition-colors ${
                view === "diagnostic"
                  ? "bg-white text-[#118be7]"
                  : "text-white/90 hover:bg-white/15"
              }`}
            >
              How it works
            </button>
            <button
              onClick={() => setView("results")}
              disabled={!latestResult}
              className={`rounded-full px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                view === "results"
                  ? "bg-white text-[#118be7]"
                  : "text-white/90 hover:bg-white/15"
              }`}
            >
              Results
            </button>
            <button
              onClick={() => setView("history")}
              className={`rounded-full px-4 py-2 font-semibold transition-colors ${
                view === "history"
                  ? "bg-white text-[#118be7]"
                  : "text-white/90 hover:bg-white/15"
              }`}
            >
              {t.tabHistory}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector
              language={language}
              onLanguageChange={setLanguage}
            />
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="mb-6 rounded-xl border border-[#b9ddff] bg-[#dff0ff] px-4 py-3 text-sm text-[#0f4f84]">
          Clinical disclaimer: This tool provides AI-assisted decision support
          and is not a substitute for professional medical diagnosis.
        </div>

        {view === "landing" && (
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[28px] border border-[#b7dfff] bg-gradient-to-r from-[#f5f9ff] via-[#edf6ff] to-[#ebf2f9] p-6 shadow-sm lg:p-10">
              <div className="pointer-events-none absolute bottom-0 left-[52%] top-0 hidden w-8 bg-lime-300/90 lg:block" />
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#9fd0ff] bg-white px-4 py-2 text-sm font-semibold text-[#0b5ca3]">
                    <Sparkles className="h-4 w-4" />
                    AI triage support
                  </div>
                  <h1 className="mt-5 text-5xl font-bold leading-[1.02] text-[#1089e4] md:text-6xl">
                    Your AI Health Companion, Anytime.
                  </h1>
                  <div className="mt-6 grid grid-cols-1 gap-3 text-[20px] text-[#0f2940] sm:grid-cols-2">
                    <p>Analyze your symptoms</p>
                    <p>Understand your health</p>
                    <p>Get ready for your visit</p>
                    <p>Plan your next steps</p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      onClick={() => setView("diagnostic")}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1289e5] px-7 py-3 text-lg font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
                    >
                      Start Advanced Check
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setView("history")}
                      className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-lg font-semibold text-slate-800 shadow-sm"
                    >
                      View History
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="ml-auto w-fit rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-md">
                    <p className="text-lg font-semibold text-slate-900">
                      Secure
                    </p>
                  </div>
                  <div className="mx-auto w-fit rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-md">
                    <p className="text-lg font-semibold text-slate-900">
                      Fast Analysis
                    </p>
                  </div>
                  <div className="mr-auto w-fit rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-md">
                    <p className="text-lg font-semibold text-slate-900">
                      Multilingual Intake
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              {systemCards.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-[#b9defb] bg-white p-5 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <div className="inline-flex rounded-lg bg-[#dff0ff] p-2">
                    <Icon className="h-5 w-5 text-[#118be7]" />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                </article>
              ))}
            </section>
          </div>
        )}

        {view === "diagnostic" && (
          <DiagnosticInterface
            language={language}
            patientProfile={patientProfile}
            onPatientProfileChange={setPatientProfile}
            onDiagnosticComplete={handleDiagnosticComplete}
          />
        )}

        {view === "history" &&
          (historyLoading ? (
            <div className="flex items-center justify-center py-20 text-sm text-slate-500">
              Loading history...
            </div>
          ) : (
            <DiagnosticHistory language={language} history={history} />
          ))}

        {view === "results" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#b9defb] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Latest Diagnostic Results
                  </h2>
                  <p className="text-sm text-slate-600">
                    NLP analysis and diagnosis outputs for the current session.
                  </p>
                </div>
                <button
                  onClick={() => setView("diagnostic")}
                  className="inline-flex items-center justify-center rounded-lg bg-[#1289e5] px-4 py-2 text-sm font-semibold text-white"
                >
                  Run New Analysis
                </button>
              </div>
            </div>

            {latestResult ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#b9defb] bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Session Profile
                  </h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-slate-500">Patient</p>
                      <p className="font-semibold text-slate-900">
                        {latestResult.patientName || "Patient"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-slate-500">Age Range</p>
                      <p className="font-semibold text-slate-900">
                        {latestResult.patientProfile?.ageRange ?? "N/A"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-slate-500">Gender</p>
                      <p className="font-semibold text-slate-900">
                        {latestResult.patientProfile?.gender || "Not provided"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-slate-500">Language</p>
                      <p className="font-semibold text-slate-900">
                        {latestResult.language.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                <NLPResults result={latestResult} language={language} />

                <div className="rounded-2xl border border-[#b9defb] bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Audit Trail
                  </h3>
                  <div className="mt-3 space-y-2">
                    {(latestResult.auditTrail ?? []).length === 0 && (
                      <p className="text-sm text-slate-600">
                        No audit events yet.
                      </p>
                    )}
                    {(latestResult.auditTrail ?? [])
                      .slice()
                      .reverse()
                      .map((entry, idx) => (
                        <div
                          key={`${entry.timestamp instanceof Date ? entry.timestamp.toISOString() : entry.timestamp}-${idx}`}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <p className="text-xs text-slate-500">
                            {entry.timestamp instanceof Date
                              ? entry.timestamp.toLocaleString()
                              : new Date(entry.timestamp).toLocaleString()}{" "}
                            - {entry.actor.toUpperCase()} - {entry.action}
                          </p>
                          <p className="mt-1 text-sm text-slate-800">
                            {entry.details}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#b9defb] bg-white p-8 text-center text-slate-600 shadow-sm">
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
