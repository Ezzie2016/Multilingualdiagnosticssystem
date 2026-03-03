import { useCallback, useEffect, useRef, useState } from "react";
import type { PatientProfile, AgeRangeOption, Language } from "../App";
import { detectLanguage } from "../utils/detectLanguage";
import { useTranslations } from "../utils/translations";
import { LanguageSelector } from "./LanguageSelector";
import { useVoice, VOICE_LISTENING } from "../utils/useVoice";
import { DocumentUpload } from "./DocumentUpload";
import type { ExtractionResult } from "../utils/documentExtractor";
import { Search, X, Mic, MicOff, Square, Paperclip, ChevronDown } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

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
  language: Language;
  symptoms: string;
  entities: Entity[];
  diagnoses: Diagnosis[];
  patientName?: string;
  patientProfile?: PatientProfile;
  auditTrail?: {
    timestamp: Date;
    actor: "system" | "patient" | "doctor";
    action: string;
    details: string;
  }[];
}

/* ─── Medical search result shape from /api/medical/search ──────────────── */

interface MedicalSearchResult {
  type: "symptom" | "condition" | string;
  code?: string;
  label: string;
  description?: string;
  relatedConditions?: string[];
  relatedSymptoms?: string[];
}

interface MedicalSearchResponse {
  query: string;
  language: string;
  results: MedicalSearchResult[];
}

/* ─── API helpers ────────────────────────────────────────────────────────── */

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

async function searchMedical(
  q: string,
  language: string,
): Promise<MedicalSearchResponse> {
  const params = new URLSearchParams({ q, language });
  const res = await fetch(`/api/medical/search?${params}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

/* ─── Props ─────────────────────────────────────────────────────────────── */

interface Props {
  language?: Language;
  onLanguageChange?: (code: string) => void;
  patientProfile?: PatientProfile;
  onPatientProfileChange?: (p: PatientProfile) => void;
  onDiagnosticComplete: (result: DiagnosticResult) => void;
}

/* ─── Example prompts ────────────────────────────────────────────────────── */

const EXAMPLE_PROMPTS: Record<string, string[]> = {
  en: [
    "I have severe chest pain radiating to my left arm for 2 hours with shortness of breath",
    "Persistent headache and fever for 3 days, mild nausea in the mornings",
    "Sharp abdominal pain lower right side, started yesterday, getting worse",
    "Extreme fatigue, dizziness when standing, muscle weakness for 1 week",
  ],
  yo: [
    "Irora àyà lile ti n lọ si apa osi mi fun wakati 2 pẹlu iṣoro imi",
    "Orififo ati iba fun ọjọ 3, inu riru kekere ni owurọ",
    "Irora inú lile ni apa isalẹ otun, bẹrẹ lana, n buru sii",
    "Arẹwèsì nla, ori n yi nigba ti mo dide, ailera iṣan fun ọsẹ 1",
  ],
  ig: [
    "Ọwụwa obi ike na-agba n'aka ekpe m maka awa 2 na iku ume ike",
    "Isi ọwụwa na ọkụ ahụ maka ụbọchị 3, ọfụfụ afọ n'ụtụtụ",
    "Mgbu n'afọ n'akụkụ aka nri n'okpuru, bidoro n'echi, na-abawanye",
    "Aghara ike, isi na-atụrụ mgbe m na-eguzo, ike adịghị n'ahụ maka izu 1",
  ],
  ha: [
    "Ciwon kirji mai tsanani da ke tafiya zuwa hannuna na hagu tsawon sa'o'i 2 tare da wahalar numfashi",
    "Ciwon kai mai dawwama da zazzabi tsawon kwana 3, ɗan amai a safiya",
    "Ciwon ciki mai tsini a gefen dama na ƙasa, ya fara jiya, yana ƙara muni",
    "Gajiya mai tsanani, jiri jiri yayin tashi, rashin karfi na kwana 7",
  ],
  pcm: [
    "My chest dey pain me well well, e dey go my left arm for 2 hours, e hard to breathe",
    "Head dey pain me and fever dey for 3 days, small belle dey do me for morning",
    "Sharp pain for right side of my belly down, e start yesterday, e dey worse",
    "Body weak well well, head dey spin when I stand up, muscle no get power for 1 week",
  ],
};

const DETECT_DEBOUNCE_MS = 500;
const TOAST_DURATION_MS = 2800;
const SEARCH_DEBOUNCE_MS = 600;
const SEARCH_MIN_CHARS = 3;

/* ─── Component ─────────────────────────────────────────────────────────── */

export function DiagnosticInterface({
  language = "en" as Language,
  onLanguageChange,
  onDiagnosticComplete,
}: Props) {
  const [symptoms, setSymptoms] = useState("");
  const [uploadOpen,   setUploadOpen]   = useState(false);
  const [extractedDoc, setExtractedDoc] = useState<ExtractionResult | null>(null);
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Medical search state
  const [searchResults, setSearchResults] = useState<MedicalSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDismissed, setSearchDismissed] = useState(false);

  const charCount = symptoms.length;

  // ── Voice input ────────────────────────────────────────────────────────────
  const handleTranscript = useCallback((text: string) => {
    setSymptoms(text);
    if (error) setError("");
    runDetection(text);
    runSearch(text, language);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, language]);

  const {
    isListening,
    isSpeaking: _isSpeaking,
    recognitionSupported,
    error: voiceError,
    startListening,
    stopListening,
  } = useVoice(language, handleTranscript);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const detectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (detectTimer.current) clearTimeout(detectTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  // Reset dismissed state when symptoms are cleared
  useEffect(() => {
    if (symptoms.length === 0) {
      setSearchResults([]);
      setSearchDismissed(false);
      setSearchQuery("");
    }
  }, [symptoms]);

  const t = useTranslations(language);
  const examples = EXAMPLE_PROMPTS[language] ?? EXAMPLE_PROMPTS.en;

  /* ── Medical search ──────────────────────────────────────────────────── */

  const runSearch = useCallback(
    (text: string, lang: string) => {
      if (searchTimer.current) clearTimeout(searchTimer.current);

      // Extract the last meaningful word/phrase to search for
      const words = text.trim().split(/\s+/);
      const lastWords = words.slice(-3).join(" "); // last 3 words as query

      if (lastWords.length < SEARCH_MIN_CHARS || searchDismissed) return;

      searchTimer.current = setTimeout(async () => {
        setSearchLoading(true);
        try {
          const data = await searchMedical(lastWords, lang);
          if (data.results && data.results.length > 0) {
            setSearchResults(data.results.slice(0, 5));
            setSearchQuery(lastWords);
          } else {
            setSearchResults([]);
          }
        } catch {
          // Silently fail — search is enhancement only
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, SEARCH_DEBOUNCE_MS);
    },
    [searchDismissed],
  );

  /* ── Language detection ──────────────────────────────────────────────── */

  const runDetection = useCallback(
    (text: string) => {
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
    },
    [language, onLanguageChange],
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSymptoms(value);
    if (error) setError("");
    runDetection(value);
    runSearch(value, language);
  };

  const handleLanguageChange = (code: string) => {
    onLanguageChange?.(code);
    if (detectTimer.current) clearTimeout(detectTimer.current);
    setDetectedLabel(null);
    // Re-run search with new language
    if (symptoms.trim().length >= SEARCH_MIN_CHARS) {
      runSearch(symptoms, code);
    }
  };

  /* ── Insert suggestion into textarea ────────────────────────────────── */

  const insertSuggestion = (label: string) => {
    setSymptoms((prev) => {
      const trimmed = prev.trimEnd();
      // If ends with a comma or period already, just add the term
      const sep = trimmed.length > 0 && !trimmed.match(/[,.]$/) ? ", " : " ";
      return trimmed + sep + label;
    });
    setSearchResults([]);
    setSearchDismissed(true);
  };

  /* ── Submit ──────────────────────────────────────────────────────────── */

  // ── Document upload handler ──────────────────────────────────────────────────
  const handleDocExtracted = (result: ExtractionResult) => {
    setExtractedDoc(result);
    setError("");
    // Pre-fill textarea so user can see/edit the extracted text
    if (result.method !== "image-llm") {
      setSymptoms(result.text.slice(0, 2000));
      runDetection(result.text);
    }
  };

  const handleDocClear = () => {
    setExtractedDoc(null);
    setSymptoms("");
    setError("");
    setUploadOpen(false);
  };

  const handleSubmit = async () => {
    // Determine text to analyse
    // Use extracted document text if one has been loaded, else fall back to typed symptoms
    const sourceText = extractedDoc ? extractedDoc.text : symptoms;

    const trimmed = sourceText.trim();
    if (!trimmed) {
      setError(extractedDoc === null && !symptoms.trim() ? t.diagErrEmpty : t.diagErrEmpty);
      return;
    }
    if (trimmed.length < 10) {
      setError(t.diagErrShort);
      return;
    }
    setLoading(true);
    setError("");
    setSearchResults([]);
    try {
      const result = await analyzeSymptoms(trimmed, language);
      onDiagnosticComplete(result);
    } catch {
      setError(t.diagErrFailed);
    } finally {
      setLoading(false);
    }
  };

  const isRTL = (language as string) === "ar";
  const showSuggestions =
    !searchDismissed && searchResults.length > 0 && symptoms.trim().length > 0;

  /* ── Badge colour per result type ───────────────────────────────────── */

  const typeBadge = (type: string) => {
    switch (type) {
      case "symptom":
        return { bg: "#ccfbf1", color: "#0d9488", label: "Symptom" };
      case "condition":
        return { bg: "#e0f2fe", color: "#0369a1", label: "Condition" };
      default:
        return { bg: "#f1f5f9", color: "#475569", label: type };
    }
  };

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
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

      {/* ── Voice input bar ────────────────────────────────────────────── */}
      {recognitionSupported && (
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            background: isListening ? "var(--teal-light)" : "var(--surface-2)",
            border: isListening ? "1px solid var(--teal)" : "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            transition: "all 0.25s",
          }}
        >
          {/* Mic toggle button */}
          <button
            onClick={toggleListening}
            title={isListening ? "Stop recording" : "Start voice input"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              background: isListening ? "var(--teal)" : "var(--surface)",
              color: isListening ? "#fff" : "var(--ink-muted)",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
              boxShadow: isListening
                ? "0 0 0 6px rgba(20,184,166,0.18)"
                : "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            {isListening ? <Square size={15} /> : <Mic size={15} />}
          </button>

          {/* Status text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {isListening ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--teal)",
                    display: "inline-block",
                    animation: "pulse 1.1s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--teal)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  {VOICE_LISTENING[language] ?? VOICE_LISTENING.en}
                </span>
              </div>
            ) : (
              <span
                style={{
                  fontSize: 13,
                  color: "var(--ink-muted)",
                }}
              >
                {language === "yo" && "Tẹ bọtini ki o sọ awọn aami aisan rẹ"}
                {language === "ig" && "Pịa bọtịnụ were kwuo mgbaàmà gị"}
                {language === "ha" && "Danna maɓallin ka yi magana game da alamominka"}
                {language === "pcm" && "Press button, talk your symptoms"}
                {language === "en" && "Press the button and speak your symptoms"}
              </span>
            )}
          </div>

          {/* Right: mic label */}
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: isListening ? "var(--teal)" : "var(--ink-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            {isListening ? "● REC" : "VOICE"}
          </span>
        </div>
      )}

      {/* ── Input card ─────────────────────────────────────────────────── */}
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

            {/* Upload button */}
            <button
              onClick={() => setUploadOpen(o => !o)}
              title="Upload a document"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 11px",
                background: uploadOpen || extractedDoc
                  ? "var(--teal-light)"
                  : "var(--surface)",
                border: uploadOpen || extractedDoc
                  ? "1px solid var(--teal)"
                  : "1px solid var(--border-2)",
                borderRadius: 100,
                color: uploadOpen || extractedDoc ? "var(--teal)" : "var(--ink-muted)",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                transition: "all 0.18s",
                whiteSpace: "nowrap",
              }}
            >
              <Paperclip style={{ width: 13, height: 13 }} />
              {extractedDoc
                ? extractedDoc.fileName.slice(0, 16) + (extractedDoc.fileName.length > 16 ? "…" : "")
                : (language === "yo" ? "Gbe Iwe" : language === "ig" ? "Bulite" : language === "ha" ? "Loda" : language === "pcm" ? "Upload" : "Upload")
              }
              <ChevronDown
                style={{
                  width: 11,
                  height: 11,
                  transform: uploadOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.18s",
                }}
              />
            </button>
          </div>
        </div>

        {/* ── Upload panel (slides open above textarea) ──────────────────── */}
        {uploadOpen && (
          <div
            style={{
              borderBottom: "1px solid var(--border)",
              background: "var(--surface-2)",
              padding: "16px",
            }}
          >
            <DocumentUpload
              language={language}
              onExtracted={(result) => {
                handleDocExtracted(result);
                if (result.method !== "image-llm") {
                  setUploadOpen(false); // auto-close after successful extraction
                }
              }}
              onClear={handleDocClear}
              extracted={extractedDoc}
            />
          </div>
        )}

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

        {/* Footer bar — char count + shortcut only */}
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

      {/* Voice error */}
      {voiceError && (
        <div
          style={{
            marginTop: 8,
            padding: "9px 14px",
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "var(--radius)",
            color: "#dc2626",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <MicOff size={14} />
          {voiceError}
        </div>
      )}

      {/* ── Medical Knowledge Suggestions ─────────────────────────────── */}
      {(showSuggestions || searchLoading) && (
        <div
          style={{
            marginTop: 10,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderBottom: "1px solid var(--border)",
              background: "var(--surface-2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Search size={13} color="var(--teal)" />
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--teal)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {t.diagSuggestionsLabel ?? "Medical Knowledge"}
              </span>
              {searchLoading && (
                <span
                  style={{
                    width: 10,
                    height: 10,
                    border: "1.5px solid var(--border-2)",
                    borderTopColor: "var(--teal)",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
              )}
              {searchQuery && !searchLoading && (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--ink-muted)",
                    fontStyle: "italic",
                  }}
                >
                  — "{searchQuery}"
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSearchResults([]);
                setSearchDismissed(true);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ink-muted)",
                padding: 2,
                display: "flex",
                alignItems: "center",
              }}
              title="Dismiss suggestions"
            >
              <X size={14} />
            </button>
          </div>

          {/* Results */}
          {showSuggestions && (
            <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
              {searchResults.map((result, i) => {
                const badge = typeBadge(result.type);
                return (
                  <button
                    key={i}
                    onClick={() => insertSuggestion(result.label)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "9px 12px",
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.12s",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#f0fdf4";
                      (e.currentTarget as HTMLElement).style.borderColor = "#5eead4";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    }}
                  >
                    {/* Type badge */}
                    <span
                      style={{
                        flexShrink: 0,
                        marginTop: 2,
                        padding: "2px 7px",
                        borderRadius: 100,
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        background: badge.bg,
                        color: badge.color,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {badge.label}
                    </span>

                    {/* Label + description */}
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--ink)",
                          lineHeight: 1.4,
                        }}
                      >
                        {result.label}
                      </p>
                      {result.description && (
                        <p
                          style={{
                            margin: 0,
                            marginTop: 2,
                            fontSize: 12,
                            color: "var(--ink-muted)",
                            lineHeight: 1.4,
                          }}
                        >
                          {result.description}
                        </p>
                      )}
                      {result.relatedConditions &&
                        result.relatedConditions.length > 0 && (
                          <p
                            style={{
                              margin: 0,
                              marginTop: 3,
                              fontSize: 11,
                              color: "var(--ink-muted)",
                              fontStyle: "italic",
                            }}
                          >
                            Related:{" "}
                            {result.relatedConditions.slice(0, 3).join(", ")}
                          </p>
                        )}
                    </div>

                    {/* Insert hint */}
                    <span
                      style={{
                        flexShrink: 0,
                        marginLeft: "auto",
                        fontSize: 10,
                        color: "var(--teal)",
                        fontFamily: "var(--font-mono)",
                        alignSelf: "center",
                        opacity: 0.7,
                      }}
                    >
                      + add
                    </span>
                  </button>
                );
              })}

              <p
                style={{
                  margin: "4px 4px 2px",
                  fontSize: 11,
                  color: "var(--ink-muted)",
                  lineHeight: 1.5,
                }}
              >
                Click a term to add it to your symptom description.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────────── */}
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

      {/* ── Example prompts ────────────────────────────────────────────── */}
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
                setSearchDismissed(false);
                runDetection(prompt);
                runSearch(prompt, language);
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

      {/* ── Submit ─────────────────────────────────────────────────────── */}
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