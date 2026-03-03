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
  Activity,
  ArrowRight,
  Cpu,
  FileSearch,
  Languages,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────── */
export type Language =
  | "en"
  | "yo"
  | "ig"
  | "ha"
  | "pcm";

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
  auditTrail?: AuditEntry[];
  clinicianReview?: {
    reviewerName: string;
    reviewedAt: Date | string;
    notes?: string;
  };
}

type View = "landing" | "diagnostic" | "results" | "history";

const LANGUAGE_OPTIONS: Array<{ code: Language; label: string }> = [
  { code: "en",  label: "English" },
  { code: "yo",  label: "Yoruba" },
  { code: "ig",  label: "Igbo" },
  { code: "ha",  label: "Hausa" },
  { code: "pcm", label: "Pidgin" },
];

const SUPPORTED_LANGUAGE_CODES = new Set<Language>(
  LANGUAGE_OPTIONS.map((option) => option.code),
);

function normalizeLanguage(code: string): Language {
  const normalized = code.trim().toLowerCase() as Language;
  return SUPPORTED_LANGUAGE_CODES.has(normalized) ? normalized : "en";
}

async function resolveInitialLanguage(stored: string | null): Promise<Language> {
  if (stored) {
    return normalizeLanguage(stored);
  }
  if (typeof navigator !== "undefined" && navigator.language) {
    const browserLang = navigator.language.split("-")[0];
    return normalizeLanguage(browserLang);
  }
  return "en";
}


/* ─── Component ──────────────────────────────────────────────────────── */
function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [languageReady, setLanguageReady] = useState(false);
  const [history, setHistory] = useState<DiagnosticResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [view, setView] = useState<View>("landing");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [latestResult, setLatestResult] = useState<DiagnosticResult | null>(
    null,
  );
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    ageRange: "18-35",
    gender: "",
    language: "en",
  });
  const promptHandledRef = useRef(false);
  const { user } = useAuth();

  // All UI strings for the current language
  const t = useTranslations(language);


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
    try {
      localStorage.setItem("mds_ui_language", language);
    } catch {}
  }, [language, languageReady]);

  useEffect(() => {
    setHistoryLoading(true);
    loadSessions()
      .then((sessions) => {
        setHistory(sessions);
        if (sessions.length > 0) setLatestResult(sessions[0]);
      })
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    setPatientProfile((prev) => ({ ...prev, language }));
  }, [language]);

  const handleLanguageChange = (code: string) => {
    setLanguage(normalizeLanguage(code));
  };

  const handleDiagnosticComplete = (result: DiagnosticResult) => {
    const enriched: DiagnosticResult = {
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
    const updated = [enriched, ...history];
    setHistory(updated);
    setLatestResult(enriched);
    setView("results");
    if (user) {
      saveSession(enriched, user.id).catch((err) =>
        console.error("Failed to persist session:", err),
      );
    }
  };

  const handleDeleteSession = async (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
    if (latestResult?.id === id) {
      setLatestResult(
        history.find((r) => r.id !== id) || null
      );
    }
    if (user) {
      deleteSession(id).catch((err) =>
        console.error("Failed to delete session:", err),
      );
    }
  };

  const navItems = [
    { label: t.navHome, view: "landing" as View },
    { label: t.navDiagnostic, view: "diagnostic" as View },
    { label: t.navResults, view: "results" as View, disabled: !latestResult },
    { label: t.navHistory, view: "history" as View },
  ];

  const SYSTEM_CARDS = [
    {
      title: t.feat1Title,
      description: t.feat1Desc,
      icon: Languages,
      accent: "#0d9488",
      bg: "#0d948814",
    },
    {
      title: t.feat2Title,
      description: t.feat2Desc,
      icon: Activity,
      accent: "#0891b2",
      bg: "#0891b214",
    },
    {
      title: t.feat3Title,
      description: t.feat3Desc,
      icon: Cpu,
      accent: "#7c3aed",
      bg: "#7c3aed14",
    },
    {
      title: t.feat4Title,
      description: t.feat4Desc,
      icon: ShieldCheck,
      accent: "#059669",
      bg: "#05966914",
    },
    {
      title: t.feat5Title,
      description: t.feat5Desc,
      icon: FileSearch,
      accent: "#d97706",
      bg: "#d9770614",
    },
  ];

  const STAT_FLOATS = [
    {
      label: t.stat1Label,
      sub: t.stat1Sub,
      dotColor: "#059669",
      bg: "#ecfdf5",
    },
    {
      label: t.stat2Label,
      sub: t.stat2Sub,
      dotColor: "#0d9488",
      bg: "#ccfbf1",
    },
    {
      label: t.stat3Label,
      sub: t.stat3Sub,
      dotColor: "#7c3aed",
      bg: "#f3e8ff",
    },
  ];

  if (!languageReady) return null;

  return (
    <div className="app-shell">
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-inner">
          <button className="logo-btn" onClick={() => setView("landing")}>
            <div className="logo-mark">
              <span style={{ fontSize: 18, color: "#fff", lineHeight: 1 }}>
                ⬡
              </span>
            </div>
            <div>
              <p className="logo-name">MediLingua</p>
              <p className="logo-sub">{t.logoSub}</p>
            </div>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className={`app-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
            {navItems.map(({ label, view: v, disabled }) => (
              <button
                key={v}
                onClick={() => {
                  if (!disabled) {
                    setView(v);
                    setIsMenuOpen(false);
                  }
                }}
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
              onLanguageChange={handleLanguageChange}
            />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* ── MAIN ───────────────────────────────────────────────────────── */}
      <main className="app-main">
        <p className="disclaimer anim-in">
          <strong>{t.disclaimerLabel}</strong> {t.disclaimerText}
        </p>

        {/* ── LANDING ──────────────────────────────────────────────────── */}
        {view === "landing" && (
          <div className="landing-page">
            <section className="hero-card anim-up">
              <div className="hero-top-bar" />
              <div className="hero-inner">
                <div>
                  <div className="hero-badge anim-up anim-up-1">
                    <Sparkles size={13} color="var(--teal)" />
                    <span className="hero-badge__text">{t.badgeText}</span>
                  </div>
                  <h1 className="hero-title anim-up anim-up-2">
                    {t.heroLine1}
                    <br />
                    <em>{t.heroLine2}</em>,<br />
                    {t.heroLine3}
                  </h1>
                  <ul className="hero-bullets anim-up anim-up-3">
                    {[t.bullet1, t.bullet2, t.bullet3, t.bullet4].map(
                      (item) => (
                        <li key={item} className="hero-bullet">
                          <span className="hero-bullet__dot" />
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                  <div className="hero-cta-row anim-up anim-up-4">
                    <button
                      className="btn-cta"
                      onClick={() => setView("diagnostic")}
                    >
                      {t.ctaStart} <ArrowRight size={16} />
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setView("history")}
                    >
                      {t.ctaHistory}
                    </button>
                  </div>
                </div>

                <div className="stat-floats">
                  {STAT_FLOATS.map((s, i) => (
                    <div
                      key={s.label}
                      className={`stat-float anim-up anim-up-${i + 2}`}
                    >
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
              <span className="section-label">{t.featuresTitle}</span>
              <div className="features-grid">
                {SYSTEM_CARDS.map(
                  ({ title, description, icon: Icon, accent, bg }, i) => (
                    <article
                      key={title}
                      className={`feat-card anim-up anim-up-${Math.min(i + 1, 6)}`}
                    >
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
              onLanguageChange={handleLanguageChange}
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
                  <p className="loading-text">{t.loadingHistory}</p>
                </div>
              </div>
            ) : (
              <DiagnosticHistory language={language} history={history} onDelete={handleDeleteSession} />
            )}
          </div>
        )}

        {/* ── RESULTS ──────────────────────────────────────────────────── */}
        {view === "results" && (
          <div className="results-page anim-in">
            <div className="card card--padded">
              <div className="results-header">
                <div>
                  <span className="section-label">{t.resultsSection}</span>
                  <h2 className="results-title">{t.resultsTitle}</h2>
                  <p className="results-subtitle">{t.resultsSub}</p>
                </div>
                <button
                  className="btn-sm"
                  onClick={() => setView("diagnostic")}
                >
                  <ArrowRight size={14} /> {t.runNewAnalysis}
                </button>
              </div>
            </div>

            {latestResult ? (
              <>
                <div className="card">
                  <span className="section-label">{t.sessionProfile}</span>
                  <div className="profile-grid">
                    {[
                      {
                        label: t.profilePatient,
                        value: latestResult.patientName || "Patient",
                      },
                      {
                        label: t.profileAge,
                        value: latestResult.patientProfile?.ageRange ?? "N/A",
                      },
                      {
                        label: t.profileGender,
                        value:
                          latestResult.patientProfile?.gender ||
                          t.profileGenderNA,
                      },
                      {
                        label: t.profileLanguage,
                        value: latestResult.language.toUpperCase(),
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="profile-cell">
                        <span className="profile-cell__label">{label}</span>
                        <p className="profile-cell__value">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <NLPResults result={latestResult} language={language} />

                <div className="card">
                  <span className="section-label">{t.auditTrail}</span>
                  {(latestResult.auditTrail ?? []).length === 0 ? (
                    <p className="loading-text" style={{ marginTop: 14 }}>
                      {t.auditEmpty}
                    </p>
                  ) : (
                    <div className="audit-list">
                      {(latestResult.auditTrail ?? [])
                        .slice()
                        .reverse()
                        .map((entry, idx) => (
                          <div
                            key={`${entry.timestamp instanceof Date ? entry.timestamp.toISOString() : entry.timestamp}-${idx}`}
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
                  <p className="empty-state__title">{t.emptyResultTitle}</p>
                  <p className="empty-state__sub">{t.emptyResultSub}</p>
                  <button
                    className="btn-cta empty-state__cta"
                    onClick={() => setView("diagnostic")}
                  >
                    {t.startDiagnostic} <ArrowRight size={15} />
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
              <span style={{ fontSize: 11, color: "#fff", lineHeight: 1 }}>
                ⬡
              </span>
            </div>
            {t.footerText}
          </div>
          <span className="footer-version">v0.1.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;