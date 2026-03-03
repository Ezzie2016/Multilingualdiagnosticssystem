/**
 * DocumentUpload.tsx
 * Drag-and-drop document upload panel for the Diagnostic page.
 * Extracts text from PDF, DOCX, TXT, or image files and passes
 * it up to DiagnosticInterface for analysis.
 */

import { useCallback, useRef, useState } from "react";
import { FileText, Image, Upload, X, CheckCircle2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import {
  extractFromDocument,
  UPLOAD_LABELS,
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE_MB,
  type ExtractionResult,
} from "../utils/documentExtractor";
import type { Language } from "../App";

interface DocumentUploadProps {
  language: Language;
  onExtracted: (result: ExtractionResult) => void;
  onClear: () => void;
  extracted: ExtractionResult | null;
}

// ─── File type icon helper ────────────────────────────────────────────────────
function FileIcon({ name, size = 20 }: { name: string; size?: number }) {
  const ext = name.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext ?? "");
  const color = isImage ? "#7c3aed" : "var(--teal)";
  return isImage
    ? <Image style={{ width: size, height: size, color }} />
    : <FileText style={{ width: size, height: size, color }} />;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DocumentUpload({ language, onExtracted, onClear, extracted }: DocumentUploadProps) {
  const [dragging,    setDragging]    = useState(false);
  const [processing,  setProcessing]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const l = UPLOAD_LABELS[language] ?? UPLOAD_LABELS.en;

  // ── Process a file ──────────────────────────────────────────────────────────
  const processFile = useCallback(async (file: File) => {
    setError(null);
    setProcessing(true);
    try {
      const result = await extractFromDocument(file, language);
      onExtracted(result);
    } catch (err: any) {
      setError(err?.message ?? l.errorRead);
    } finally {
      setProcessing(false);
    }
  }, [language, onExtracted, l.errorRead]);

  // ── Drag handlers ───────────────────────────────────────────────────────────
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); };
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = ""; // reset so same file can be re-selected
  };

  const handleClear = () => {
    setError(null);
    setShowPreview(false);
    onClear();
  };

  // ── Render: extracted state ─────────────────────────────────────────────────
  if (extracted) {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
        }}
      >
        {/* Success header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            background: "var(--green-dim)",
            borderBottom: "1px solid #a7f3d0",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle2 style={{ width: 18, height: 18, color: "var(--green)", flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>
                {l.ready}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>
                {extracted.fileName}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Preview toggle */}
            <button
              onClick={() => setShowPreview(p => !p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                background: "transparent",
                border: "1px solid #a7f3d0",
                borderRadius: "var(--radius)",
                color: "var(--green)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
            >
              {showPreview
                ? <><EyeOff style={{ width: 12, height: 12 }} /> Hide</>
                : <><Eye    style={{ width: 12, height: 12 }} /> {l.preview}</>
              }
            </button>
            {/* Remove */}
            <button
              onClick={handleClear}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                background: "transparent",
                border: "1px solid #fca5a5",
                borderRadius: "var(--radius)",
                color: "#dc2626",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
            >
              <X style={{ width: 12, height: 12 }} />
              {l.remove}
            </button>
          </div>
        </div>

        {/* Method badge */}
        <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <FileIcon name={extracted.fileName} size={16} />
          <span style={{ fontSize: 12, color: "var(--ink-muted)", fontFamily: "var(--font-mono)" }}>
            {extracted.method === "image-llm" ? "AI vision analysis" : "Text extracted"}
            {" · "}{extracted.fileName.split(".").pop()?.toUpperCase()}
          </span>
        </div>

        {/* Preview */}
        {showPreview && (
          <div
            style={{
              padding: "14px 18px",
              maxHeight: 180,
              overflowY: "auto",
              background: "var(--surface-2)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--ink-soft)",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {extracted.text.slice(0, 800)}{extracted.text.length > 800 ? "…" : ""}
            </p>
          </div>
        )}

        {/* Ready subtext */}
        <div style={{ padding: "10px 18px" }}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)" }}>
            {l.readySubtext}
          </p>
        </div>
      </div>
    );
  }

  // ── Render: upload zone ─────────────────────────────────────────────────────
  return (
    <div>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !processing && inputRef.current?.click()}
        style={{
          background: dragging ? "var(--teal-light)" : "var(--surface)",
          border: `2px dashed ${dragging ? "var(--teal)" : "var(--border-2)"}`,
          borderRadius: "var(--radius-xl)",
          padding: "48px 24px",
          textAlign: "center",
          cursor: processing ? "default" : "pointer",
          transition: "all 0.2s",
          position: "relative",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={onFileChange}
          style={{ display: "none" }}
        />

        {processing ? (
          /* Processing state */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "3px solid var(--border)",
                borderTopColor: "var(--teal)",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ margin: 0, fontSize: 14, color: "var(--teal)", fontFamily: "var(--font-mono)" }}>
              {l.processing}
            </p>
          </div>
        ) : (
          /* Idle / drag state */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: dragging ? "var(--teal)" : "var(--surface-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                border: "1px solid var(--border)",
              }}
            >
              <Upload style={{ width: 22, height: 22, color: dragging ? "#fff" : "var(--teal)" }} />
            </div>

            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--navy)", marginBottom: 4 }}>
                {l.title}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "var(--ink-soft)" }}>
                {l.subtitle}
              </p>
            </div>

            {/* Accepted type badges */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
              {["PDF", "DOCX", "TXT", "JPG", "PNG"].map((type) => (
                <span
                  key={type}
                  style={{
                    padding: "3px 9px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: 100,
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    color: "var(--ink-muted)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {type}
                </span>
              ))}
              <span
                style={{
                  padding: "3px 9px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 100,
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-muted)",
                }}
              >
                max {MAX_FILE_SIZE_MB}MB
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: 10,
            padding: "10px 14px",
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
          <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0 }} />
          {error}
        </div>
      )}
    </div>
  );
}