import { useEffect, useRef, useState } from "react";
import { DiagnosticInterface } from "./components/DiagnosticInterface";
import { LanguageSelector } from "./components/LanguageSelector";
import { DiagnosticHistory } from "./components/DiagnosticHistory";
import { NLPResults } from "./components/NLPResults";
import { UserMenu } from "./components/UserMenu";
import { useTranslations } from "./utils/translations";
import { saveSession, loadSessions, deleteSession } from "./utils/sessionStorage";
import { useAuth } from "./context/AuthContext";
import {
  Activity, ChevronLeft, ChevronRight,
  Clock, FlaskConical, LayoutDashboard, Plus, Stethoscope,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────── */
export type Language = "en" | "yo" | "ig" | "ha" | "pcm";
export type GenderOption = "female" | "male" | "non_binary" | "prefer_not_to_say" | "";
export type AgeRangeOption = "0-12" | "13-17" | "18-35" | "36-55" | "56+";

export interface PatientProfile {
  ageRange: AgeRangeOption;
  gender: GenderOption;
  language: Language;
}
export interface AuditEntry {
  timestamp: Date;
  actor: "system" | "patient" | "doctor";
  action: string;
  details: string;
}
export interface DiagnosticResult {
  id: string;
  timestamp: Date | string;
  language: Language;
  symptoms: string;
  diagnoses: {
    condition: string; confidence: number;
    description: string; recommendations: string[];
  }[];
  entities: {
    text: string;
    type: "symptom" | "body_part" | "duration" | "severity";
    confidence: number;
  }[];
  patientId?: string;
  patientName?: string;
  patientProfile?: PatientProfile;
  auditTrail?: AuditEntry[];
  clinicianReview?: { reviewerName: string; reviewedAt: Date | string; notes?: string; };
  degradedMode?: boolean;
}

type View = "diagnostic" | "results" | "history";

/* ─── Helpers ────────────────────────────────────────────────────────── */
const LANGUAGE_OPTIONS: Array<{ code: Language; label: string }> = [
  { code: "en", label: "English" }, { code: "yo", label: "Yoruba" },
  { code: "ig", label: "Igbo" },   { code: "ha", label: "Hausa" },
  { code: "pcm", label: "Pidgin" },
];
const SUPPORTED = new Set<Language>(LANGUAGE_OPTIONS.map((o) => o.code));
function normalizeLanguage(code: string): Language {
  const n = code.trim().toLowerCase() as Language;
  return SUPPORTED.has(n) ? n : "en";
}
async function resolveInitialLanguage(stored: string | null): Promise<Language> {
  if (stored) return normalizeLanguage(stored);
  if (typeof navigator !== "undefined" && navigator.language)
    return normalizeLanguage(navigator.language.split("-")[0]);
  return "en";
}

/* ─── App ────────────────────────────────────────────────────────────── */
function App() {
  const [language,       setLanguage]       = useState<Language>("en");
  const [languageReady,  setLanguageReady]  = useState(false);
  const [history,        setHistory]        = useState<DiagnosticResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [view,           setView]           = useState<View>("diagnostic");
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [latestResult,   setLatestResult]   = useState<DiagnosticResult | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    ageRange: "18-35", gender: "", language: "en",
  });

  const promptHandledRef = useRef(false);
  const { user } = useAuth();
  const t = useTranslations(language);

  /* init language */
  useEffect(() => {
    if (promptHandledRef.current) return;
    promptHandledRef.current = true;
    let stored: string | null = null;
    try { stored = localStorage.getItem("mds_ui_language"); } catch {}
    resolveInitialLanguage(stored).then((lang) => {
      setLanguage(lang);
      try { localStorage.setItem("mds_ui_language", lang); } catch {}
      setLanguageReady(true);
    });
  }, []);

  useEffect(() => {
    if (!languageReady) return;
    try { localStorage.setItem("mds_ui_language", language); } catch {}
  }, [language, languageReady]);

  /* load history */
  useEffect(() => {
    setHistoryLoading(true);
    loadSessions()
      .then((s) => { setHistory(s); if (s.length > 0) setLatestResult(s[0]); })
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    setPatientProfile((prev) => ({ ...prev, language }));
  }, [language]);

  /* handlers */
  const handleLanguageChange = (code: string) => setLanguage(normalizeLanguage(code));

  const handleDiagnosticComplete = (result: DiagnosticResult) => {
    const enriched: DiagnosticResult = {
      ...result,
      patientName: result.patientName ?? "Patient",
      patientProfile: { ...patientProfile, language },
      auditTrail: [
        ...(result.auditTrail ?? []),
        { timestamp: new Date(), actor: "patient", action: "analysis_generated", details: "Analysis generated from patient session." },
      ],
    };
    setHistory((prev) => [enriched, ...prev]);
    setLatestResult(enriched);
    setView("results");
    if (user) saveSession(enriched, user.id).catch(console.error);
  };

  const handleDeleteSession = async (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
    if (latestResult?.id === id)
      setLatestResult(history.find((r) => r.id !== id) || null);
    if (user) deleteSession(id).catch(console.error);
  };

  const startNew = () => setView("diagnostic");

  if (!languageReady) return null;

  const NAV: { id: View; label: string; icon: React.ElementType; disabled?: boolean }[] = [
    { id: "diagnostic", label: t.navDiagnostic ?? "New Analysis", icon: FlaskConical },
    { id: "results",    label: t.navResults    ?? "Results",       icon: Activity,    disabled: !latestResult },
    { id: "history",    label: t.navHistory    ?? "History",       icon: Clock },
  ];

  return (
    <div className="shell">

      {/* ═══════════════ SIDEBAR ═══════════════════════════════════════ */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : "sidebar--collapsed"}`}>

        {/* Logo */}
        <div className="sidebar__logo">
          {sidebarOpen && (
            <div className="sidebar__brand">
              <div className="sidebar__icon"><Stethoscope size={14} color="#fff" /></div>
              <div>
                <p className="sidebar__app-name">MediLingua</p>
                <p className="sidebar__app-sub">{t.logoSub ?? "Multilingual Diagnosis"}</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="sidebar__icon"><Stethoscope size={14} color="#fff" /></div>
          )}
          <button className="sidebar__toggle" onClick={() => setSidebarOpen((o) => !o)}>
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* New analysis */}
        <div className="sidebar__new-wrap">
          <button className="sidebar__new-btn" onClick={startNew}>
            <Plus size={14} />
            {sidebarOpen && <span>{t.ctaStart ?? "New Analysis"}</span>}
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar__nav">
          {NAV.map(({ id, label, icon: Icon, disabled }) => (
            <button
              key={id}
              onClick={() => { if (!disabled) setView(id); }}
              disabled={disabled}
              title={!sidebarOpen ? label : undefined}
              className={`sidebar__nav-item${view === id ? " sidebar__nav-item--active" : ""}`}
            >
              <Icon size={15} />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Recent sessions */}
        {sidebarOpen && history.length > 0 && (
          <div className="sidebar__recent">
            <span className="sidebar__recent-label">{t.navHistory ?? "Recent"}</span>
            {history.slice(0, 6).map((r) => (
              <button
                key={r.id}
                onClick={() => { setLatestResult(r); setView("results"); }}
                className={`sidebar__session${latestResult?.id === r.id ? " sidebar__session--active" : ""}`}
              >
                <LayoutDashboard size={11} className="sidebar__session-icon" />
                <div className="sidebar__session-text">
                  <span className="sidebar__session-symptom">
                    {r.symptoms.slice(0, 28)}{r.symptoms.length > 28 ? "…" : ""}
                  </span>
                  <span className="sidebar__session-date">
                    {new Date(r.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Language + account */}
        <div className="sidebar__bottom">
          <LanguageSelector language={language} onLanguageChange={handleLanguageChange} />
          {sidebarOpen && <UserMenu />}
        </div>
      </aside>

      {/* ═══════════════ MAIN ══════════════════════════════════════════ */}
      <div className="main">

        {/* Disclaimer */}
        <div className="disclaimer-strip">
          <strong>{t.disclaimerLabel ?? "⚠ Not a medical device."}</strong>{" "}
          {t.disclaimerText ?? "For informational purposes only. Always consult a qualified healthcare professional."}
        </div>

        <div className="main__scroll">

          {/* ── DIAGNOSTIC ─────────────────────────────────────────── */}
          {view === "diagnostic" && (
            <div className="diagnostic-view">
              <div className="diagnostic-view__content" style={{ margin: "auto 0", width: "100%", maxWidth: 720 }}>
                {history.length === 0 && (
                  <div className="diagnostic-view__welcome">
                    <div className="welcome-badge">
                      <Stethoscope size={11} color="var(--teal)" />
                      <span>MediLingua</span>
                    </div>
                    <h1 className="welcome-heading">
                      {t.heroLine1 ?? "How can I help you today?"}
                    </h1>
                    <p className="welcome-sub">
                      {t.diagSubtext ?? "Describe your symptoms in any of our 5 supported languages."}
                    </p>
                  </div>
                )}
                <div className="diagnostic-view__input">
                  <DiagnosticInterface
                    language={language}
                    onLanguageChange={handleLanguageChange}
                    patientProfile={patientProfile}
                    onPatientProfileChange={setPatientProfile}
                    onDiagnosticComplete={handleDiagnosticComplete}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── RESULTS ────────────────────────────────────────────── */}
          {view === "results" && (
            <div className="content-view">
              <div className="content-view__header">
                <div>
                  <span className="content-view__label">{t.resultsSection ?? "Analysis"}</span>
                  <h2 className="content-view__title">{t.resultsTitle ?? "Diagnostic Results"}</h2>
                </div>
                <button className="btn-new" onClick={startNew}>
                  <Plus size={13} /> {t.runNewAnalysis ?? "New Analysis"}
                </button>
              </div>

              {latestResult ? (
                <>
                  <div className="card card--padded" style={{ marginBottom: 16 }}>
                    <span className="section-label">{t.sessionProfile ?? "Session Profile"}</span>
                    <div className="profile-grid">
                      {[
                        { label: t.profilePatient  ?? "Patient",  value: latestResult.patientName ?? "Patient" },
                        { label: t.profileAge      ?? "Age",      value: latestResult.patientProfile?.ageRange ?? "N/A" },
                        { label: t.profileGender   ?? "Gender",   value: latestResult.patientProfile?.gender || (t.profileGenderNA ?? "N/A") },
                        { label: t.profileLanguage ?? "Language", value: latestResult.language.toUpperCase() },
                      ].map(({ label, value }) => (
                        <div key={label} className="profile-cell">
                          <span className="profile-cell__label">{label}</span>
                          <p className="profile-cell__value">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <NLPResults result={latestResult} language={language} />

                  {(latestResult.auditTrail ?? []).length > 0 && (
                    <div className="card" style={{ marginTop: 16 }}>
                      <span className="section-label">{t.auditTrail ?? "Audit Trail"}</span>
                      <div className="audit-list">
                        {(latestResult.auditTrail ?? []).slice().reverse().map((entry, idx) => (
                          <div key={idx} className="audit-row">
                            <p className="audit-row__meta">
                              {entry.timestamp instanceof Date
                                ? entry.timestamp.toLocaleString()
                                : new Date(entry.timestamp).toLocaleString()}
                              {" · "}<span className="audit-row__actor">{entry.actor.toUpperCase()}</span>
                              {" · "}{entry.action}
                            </p>
                            <p className="audit-row__detail">{entry.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="card card--center">
                  <div className="empty-state">
                    <span className="empty-state__icon">🩺</span>
                    <p className="empty-state__title">{t.emptyResultTitle ?? "No results yet"}</p>
                    <p className="empty-state__sub">{t.emptyResultSub ?? "Run an analysis to see results here."}</p>
                    <button className="btn-cta empty-state__cta" onClick={startNew}>
                      {t.startDiagnostic ?? "Start Diagnosis"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── HISTORY ────────────────────────────────────────────── */}
          {view === "history" && (
            <div className="content-view">
              <div style={{ marginBottom: 22 }}>
                <span className="content-view__label">{t.navHistory ?? "History"}</span>
                <h2 className="content-view__title">{t.navHistory ?? "Diagnostic History"}</h2>
              </div>
              {historyLoading ? (
                <div className="loading-container">
                  <div className="loading-inner">
                    <div className="loading-spinner" />
                    <p className="loading-text">{t.loadingHistory ?? "Loading…"}</p>
                  </div>
                </div>
              ) : (
                <DiagnosticHistory language={language} history={history} onDelete={handleDeleteSession} />
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;