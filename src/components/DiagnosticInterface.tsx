import { useCallback, useEffect, useRef, useState } from "react";
import { detectLanguage } from "../utils/detectLanguage";
import { useTranslations } from "../utils/translations";
import { LanguageSelector } from "./LanguageSelector";

interface Entity {
  text: string;
  type: "symptom" | "body_part" | "duration" | "severity";
  confidence: number;
}

interface Diagnosis {
  condition: string;
  confidence: number;
  description: string;
  recommendations: string[];
}

export interface DiagnosticResult {
  id: string;
  timestamp: string | Date;
  language: string;
  symptoms: string;
  entities: Entity[];
  diagnoses: Diagnosis[];
  patientName?: string;
  patientProfile?: { ageRange: string; gender: string; language: string };
  auditTrail?: {
    timestamp: Date;
    actor: "system" | "patient" | "doctor";
    action: string;
    details: string;
  }[];
}

async function analyzeSymptoms(
  symptoms: string,
  language: string,
): Promise<DiagnosticResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms, language }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

interface Props {
  language?: string;
  onLanguageChange?: (code: string) => void;
  patientProfile?: { ageRange: string; gender: string; language: string };
  onPatientProfileChange?: (p: {
    ageRange: string;
    gender: string;
    language: string;
  }) => void;
  onDiagnosticComplete: (result: DiagnosticResult) => void;
}

const EXAMPLE_PROMPTS: Record<string, string[]> = {
  en: [
    "I have severe chest pain radiating to my left arm for 2 hours with shortness of breath",
    "Persistent headache and fever for 3 days, mild nausea in the mornings",
    "Sharp abdominal pain lower right side, started yesterday, getting worse",
    "Extreme fatigue, dizziness when standing, muscle weakness for 1 week",
  ],
  es: [
    "Tengo dolor de pecho severo que se irradia al brazo izquierdo desde hace 2 horas con dificultad para respirar",
    "Dolor de cabeza persistente y fiebre por 3 días, náuseas leves por las mañanas",
    "Dolor abdominal agudo en el lado inferior derecho, comenzó ayer, empeorando",
    "Fatiga extrema, mareos al levantarse, debilidad muscular por 1 semana",
  ],
  fr: [
    "J'ai une douleur thoracique sévère irradiant vers le bras gauche depuis 2 heures avec essoufflement",
    "Maux de tête persistants et fièvre depuis 3 jours, légères nausées le matin",
    "Douleur abdominale aiguë côté inférieur droit, commencée hier, s'aggravant",
    "Fatigue extrême, vertiges en se levant, faiblesse musculaire depuis 1 semaine",
  ],
  de: [
    "Ich habe seit 2 Stunden starke Brustschmerzen, die in den linken Arm ausstrahlen, mit Atemnot",
    "Anhaltende Kopfschmerzen und Fieber seit 3 Tagen, leichte Übelkeit am Morgen",
    "Stechende Bauchschmerzen rechts unten, seit gestern, werden schlimmer",
    "Extreme Müdigkeit, Schwindel beim Aufstehen, Muskelschwäche seit 1 Woche",
  ],
  ar: [
    "لدي ألم شديد في الصدر يمتد إلى ذراعي اليسرى منذ ساعتين مع ضيق في التنفس",
    "صداع مستمر وحمى منذ 3 أيام وغثيان خفيف في الصباح",
    "ألم حاد في البطن في الجانب الأيمن السفلي بدأ أمس ويزداد سوءًا",
    "إرهاق شديد ودوخة عند الوقوف وضعف عضلي منذ أسبوع",
  ],
  zh: [
    "我左臂有放射性胸痛已经2小时，伴有呼吸急促",
    "持续头痛和发烧3天，早晨轻微恶心",
    "右下腹剧烈疼痛，昨天开始，越来越严重",
    "极度疲劳，站立时头晕，肌肉无力持续1周",
  ],
};

const DETECT_DEBOUNCE_MS = 500;
const TOAST_DURATION_MS = 2800;

export function DiagnosticInterface({
  language: langProp = "en",
  onLanguageChange,
  onDiagnosticComplete,
}: Props) {
  const [symptoms, setSymptoms] = useState("");
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const charCount = symptoms.length;
  const language = langProp;

  const detectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (detectTimer.current) clearTimeout(detectTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // Translations for the current language
  const t = useTranslations(language);

  // Example prompts for current language (fall back to English)
  const examples = EXAMPLE_PROMPTS[language] ?? EXAMPLE_PROMPTS.en;

  // ── Language detection ──────────────────────────────────────────────────
  const runDetection = useCallback((text: string) => {
    if (detectTimer.current) clearTimeout(detectTimer.current);
    detectTimer.current = setTimeout(() => {
      const result = detectLanguage(text);
      if (!result) return;
      if (result.code === language) return;
      setDetectedLabel(result.label);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(
        () => setDetectedLabel(null),
        TOAST_DURATION_MS,
      );
      onLanguageChange?.(result.code);
    }, DETECT_DEBOUNCE_MS);
  }, [language, onLanguageChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSymptoms(value);
    if (error) setError("");
    runDetection(value);
  };

  const handleLanguageChange = (code: string) => {
    onLanguageChange?.(code);
    if (detectTimer.current) clearTimeout(detectTimer.current);
    setDetectedLabel(null);
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const trimmed = symptoms.trim();
    if (!trimmed) {
      setError(t.diagErrEmpty);
      return;
    }
    if (trimmed.length < 10) {
      setError(t.diagErrShort);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await analyzeSymptoms(trimmed, language);
      onDiagnosticComplete(result);
    } catch {
      setError(t.diagErrFailed);
    } finally {
      setLoading(false);
    }
  };

  const isRTL = language === "ar";

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
            padding: "5px 14px",
            background: "linear-gradient(90deg, #ccfbf1, #d1fae5)",
            border: "1px solid #5eead4",
            borderRadius: 100,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--teal)",
              display: "block",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "var(--teal)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {t.diagSessionBadge}
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 600,
            lineHeight: 1.2,
            color: "var(--navy)",
            marginBottom: 10,
          }}
        >
          {t.diagHeadline}{" "}
          <em style={{ fontStyle: "italic", color: "var(--teal)" }}>
            {t.diagHeadlineEm}
          </em>
        </h1>
        <p
          style={{
            color: "var(--ink-soft)",
            fontSize: 15,
            lineHeight: 1.65,
            maxWidth: 520,
          }}
        >
          {t.diagSubtext}
        </p>
      </div>

      {/* Input card */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface-2)",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--ink-muted)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {t.diagTextareaLabel}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {detectedLabel && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  background: "#ccfbf1",
                  border: "1px solid #5eead4",
                  borderRadius: 100,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: 13 }}>🌐</span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    color: "var(--teal)",
                  }}
                >
                  {t.diagAutoDetected} <strong>{detectedLabel}</strong>
                </span>
              </div>
            )}
            <LanguageSelector
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={symptoms}
          onChange={handleChange}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
          }}
          placeholder={examples[0]}
          rows={7}
          maxLength={2000}
          style={{
            width: "100%",
            padding: "20px",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "vertical",
            color: "var(--ink)",
            fontFamily: "var(--font-body)",
            fontSize: 15,
            lineHeight: 1.7,
            direction: isRTL ? "rtl" : "ltr",
          }}
        />

        {/* Footer bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 16px",
            borderTop: "1px solid var(--border)",
            background: "var(--surface-2)",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              color: charCount > 1800 ? "var(--amber)" : "var(--ink-muted)",
            }}
          >
            {charCount} {t.diagCharLimit}
          </span>
          <span style={{ fontSize: 11, color: "var(--ink-muted)" }}>
            {t.diagShortcut}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: 12,
            padding: "12px 16px",
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "var(--radius)",
            color: "#dc2626",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Example prompts */}
      <div style={{ marginTop: 24 }}>
        <p
          style={{
            fontSize: 11,
            color: "var(--ink-muted)",
            marginBottom: 10,
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {t.diagExamplesLabel}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {examples.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setSymptoms(prompt);
                setError("");
                runDetection(prompt);
              }}
              style={{
                textAlign: isRTL ? "right" : "left",
                padding: "10px 14px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--ink-soft)",
                cursor: "pointer",
                fontSize: 13,
                lineHeight: 1.5,
                fontFamily: "var(--font-body)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--surface-2)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border-2)";
                (e.currentTarget as HTMLElement).style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--surface)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--ink-soft)";
              }}
            >
              <span
                style={{
                  color: "var(--ink-muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                }}
              >
                #{String(i + 1).padStart(2, "0")}{" "}
              </span>
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div
        style={{
          marginTop: 28,
          display: "flex",
          justifyContent: isRTL ? "flex-start" : "flex-end",
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={loading || !symptoms.trim()}
          className={!loading && symptoms.trim() ? "btn-cta" : ""}
          style={
            loading || !symptoms.trim()
              ? {
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "13px 28px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--ink-muted)",
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "not-allowed",
                }
              : {
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "13px 28px",
                }
          }
        >
          {loading ? (
            <>
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: "2px solid var(--border-2)",
                  borderTopColor: "var(--teal)",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  display: "block",
                }}
              />
              {t.diagAnalyzing}
            </>
          ) : (
            t.diagRunBtn
          )}
        </button>
      </div>

      <p
        style={{
          marginTop: 20,
          fontSize: 12,
          color: "var(--ink-muted)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--amber)", fontWeight: 600 }}>
          {t.diagNotMedical}
        </strong>{" "}
        {t.diagNotMedicalBody}
      </p>
    </div>
  );
}

export default DiagnosticInterface;
