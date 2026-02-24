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

/* ─── Types ──────────────────────────────────────────────────────────── */
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

/* ─── Static data ────────────────────────────────────────────────────── */
const SYSTEM_CARDS = [
  {
    title: "Multilingual Intake",
    description:
      "Users can submit symptom narratives in 16 interface languages.",
    icon: Languages,
    accent: "#0d9488",
    bg: "#0d948814",
  },
  {
    title: "NLP Extraction",
    description:
      "Entities are extracted as symptom, body part, duration, and severity.",
    icon: Activity,
    accent: "#0891b2",
    bg: "#0891b214",
  },
  {
    title: "Hybrid Inference",
    description:
      "Runs local model inference first, with graceful fallback controls.",
    icon: Cpu,
    accent: "#7c3aed",
    bg: "#7c3aed14",
  },
  {
    title: "Safety Layer",
    description:
      "Rule-based fallback keeps analysis available when model providers fail.",
    icon: ShieldCheck,
    accent: "#059669",
    bg: "#05966914",
  },
  {
    title: "Clinical Transparency",
    description:
      "Confidence reflects symptom-pattern fit and language extraction quality, not a final diagnosis.",
    icon: FileSearch,
    accent: "#d97706",
    bg: "#d9770614",
  },
] as const;

const STAT_FLOATS = [
  {
    label: "Secure & Private",
    sub: "Local-first storage",
    dotColor: "#059669",
    bg: "#ecfdf5",
  },
  {
    label: "16 Languages",
    sub: "Multilingual intake",
    dotColor: "#0d9488",
    bg: "#ccfbf1",
  },
  {
    label: "Instant Analysis",
    sub: "Real-time NLP",
    dotColor: "#7c3aed",
    bg: "#f3e8ff",
  },
] as const;

const PROFILE_FIELDS = (result: DiagnosticResult) => [
  { label: "Patient", value: result.patientName || "Patient" },
  { label: "Age Range", value: result.patientProfile?.ageRange ?? "N/A" },
  { label: "Gender", value: result.patientProfile?.gender || "Not provided" },
  { label: "Language", value: result.language.toUpperCase() },
];

/* ─── Component ──────────────────────────────────────────────────────── */
type View = "landing" | "diagnostic" | "results" | "history";

function App() {
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
        if (sessions.length > 0) setLatestResult(sessions[0]);
      })
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    setPatientProfile((prev) => ({ ...prev, language }));
  }, [language]);

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
    if (user) saveSession(enrichedResult, user.id);
  };

  const navItems: { label: string; view: View; disabled?: boolean }[] = [
    { label: "Home", view: "landing" },
    { label: "Diagnostic", view: "diagnostic" },
    { label: "Results", view: "results", disabled: !latestResult },
    { label: "History", view: "history" },
  ];

  return (
    <div className="app-shell">
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-inner">
          <button className="logo-btn" onClick={() => setView("landing")}>
            <div className="logo-mark">
              <Globe size={18} color="#fff" />
            </div>
            <div>
              <p className="logo-name">MedAssist AI</p>
              <p className="logo-sub">AI-Powered NLP Symptom Analysis</p>
            </div>
          </button>

          <nav className="app-nav">
            {navItems.map(({ label, view: v, disabled }) => (
              <button
                key={v}
                onClick={() => !disabled && setView(v)}
                disabled={disabled}
                className={`nav-pill${view === v ? " active" : ""}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="header-controls">
            <LanguageSelector
              language={language}
              onLanguageChange={setLanguage}
            />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* ── MAIN ───────────────────────────────────────────────────────── */}
      <main className="app-main">
        <p className="disclaimer anim-in">
          <strong>Clinical Disclaimer:</strong> This tool provides AI-assisted
          decision support and is not a substitute for professional medical
          diagnosis. Always consult a qualified healthcare professional.
        </p>

        {/* ── LANDING ────────────────────────────────────────────────── */}
        {view === "landing" && (
          <div className="landing-page">
            <section className="hero-card anim-up">
              <div className="hero-top-bar" />
              <div className="hero-inner">
                <div>
                  <div className="hero-badge anim-up anim-up-1">
                    <Sparkles size={13} color="var(--teal)" />
                    <span className="hero-badge__text">
                      AI-Powered Triage Support
                    </span>
                  </div>

                  <h1 className="hero-title anim-up anim-up-2">
                    Your AI Health
                    <br />
                    <em>Companion</em>,<br />
                    Anytime.
                  </h1>

                  <ul className="hero-bullets anim-up anim-up-3">
                    {[
                      "Analyze your symptoms",
                      "Understand your health",
                      "Get ready for your visit",
                      "Plan your next steps",
                    ].map((item) => (
                      <li key={item} className="hero-bullet">
                        <span className="hero-bullet__dot" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="hero-cta-row anim-up anim-up-4">
                    <button
                      className="btn-cta"
                      onClick={() => setView("diagnostic")}
                    >
                      Start Advanced Check <ArrowRight size={16} />
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setView("history")}
                    >
                      View History
                    </button>
                  </div>
                </div>

                <div className="stat-floats">
                  {STAT_FLOATS.map((s, i) => (
                    <div
                      key={s.label}
                      className={`stat-float anim-up anim-up-${i + 2}`}
                    >
                      {/*
                        These two inline styles are intentional exceptions:
                        they're dynamic per-item color values that cannot be
                        expressed as static CSS classes without Tailwind's
                        arbitrary value syntax or CSS-in-JS.
                      */}
                      <div
                        className="stat-float__icon"
                        style={{ background: s.bg }}
                      >
                        <span
                          className="stat-float__dot"
                          style={{ background: s.dotColor }}
                        />
                      </div>
                      <div>
                        <p className="stat-float__name">{s.label}</p>
                        <p className="stat-float__sub">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="features-section">
              <span className="section-label">System Capabilities</span>
              <div className="features-grid">
                {SYSTEM_CARDS.map(
                  ({ title, description, icon: Icon, accent, bg }, i) => (
                    <article
                      key={title}
                      className={`feat-card anim-up anim-up-${Math.min(i + 1, 6)}`}
                    >
                      {/* Dynamic per-card accent colors — intentional inline style */}
                      <div
                        className="feat-card__icon"
                        style={{ background: bg }}
                      >
                        <Icon size={18} color={accent} />
                      </div>
                      <h3 className="feat-card__title">{title}</h3>
                      <p className="feat-card__desc">{description}</p>
                    </article>
                  ),
                )}
              </div>
            </section>
          </div>
        )}

        {/* ── DIAGNOSTIC ───────────────────────────────────────────────── */}
        {view === "diagnostic" && (
          <div className="anim-up">
            <DiagnosticInterface
              language={language}
              patientProfile={patientProfile}
              onPatientProfileChange={setPatientProfile}
              onDiagnosticComplete={handleDiagnosticComplete}
            />
          </div>
        )}

        {/* ── HISTORY ──────────────────────────────────────────────────── */}
        {view === "history" && (
          <div className="anim-up">
            {historyLoading ? (
              <div className="loading-container">
                <div className="loading-inner">
                  <div className="loading-spinner" />
                  <p className="loading-text">Loading history…</p>
                </div>
              </div>
            ) : (
              <DiagnosticHistory language={language} history={history} />
            )}
          </div>
        )}

        {/* ── RESULTS ──────────────────────────────────────────────────── */}
        {view === "results" && (
          <div className="results-page anim-in">
            <div className="card card--padded">
              <div className="results-header">
                <div>
                  <span className="section-label">Analysis Output</span>
                  <h2 className="results-title">Latest Diagnostic Results</h2>
                  <p className="results-subtitle">
                    NLP analysis and diagnosis outputs for the current session.
                  </p>
                </div>
                <button
                  className="btn-sm"
                  onClick={() => setView("diagnostic")}
                >
                  <ArrowRight size={14} />
                  Run New Analysis
                </button>
              </div>
            </div>

            {latestResult ? (
              <>
                <div className="card">
                  <span className="section-label">Session Profile</span>
                  <div className="profile-grid">
                    {PROFILE_FIELDS(latestResult).map(({ label, value }) => (
                      <div key={label} className="profile-cell">
                        <span className="profile-cell__label">{label}</span>
                        <p className="profile-cell__value">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <NLPResults result={latestResult} language={language} />

                <div className="card">
                  <span className="section-label">Audit Trail</span>
                  {(latestResult.auditTrail ?? []).length === 0 ? (
                    <p className="loading-text" style={{ marginTop: 14 }}>
                      No audit events yet.
                    </p>
                  ) : (
                    <div className="audit-list">
                      {(latestResult.auditTrail ?? [])
                        .slice()
                        .reverse()
                        .map((entry, idx) => (
                          <div
                            key={`${
                              entry.timestamp instanceof Date
                                ? entry.timestamp.toISOString()
                                : entry.timestamp
                            }-${idx}`}
                            className="audit-row"
                          >
                            <p className="audit-row__meta">
                              {entry.timestamp instanceof Date
                                ? entry.timestamp.toLocaleString()
                                : new Date(entry.timestamp).toLocaleString()}
                              {" · "}
                              <span className="audit-row__actor">
                                {entry.actor.toUpperCase()}
                              </span>
                              {" · "}
                              {entry.action}
                            </p>
                            <p className="audit-row__detail">{entry.details}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="card card--center">
                <div className="empty-state">
                  <span className="empty-state__icon">🩺</span>
                  <p className="empty-state__title">
                    No analysis result selected yet.
                  </p>
                  <p className="empty-state__sub">
                    Run a diagnostic to see results here.
                  </p>
                  <button
                    className="btn-cta empty-state__cta"
                    onClick={() => setView("diagnostic")}
                  >
                    Start Diagnostic <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo-mark">
              <Globe size={11} color="#fff" />
            </div>
            MedAssist AI — Educational use only. Not a medical device.
          </div>
          <span className="footer-version">v0.1.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
