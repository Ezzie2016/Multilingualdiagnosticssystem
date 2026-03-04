import sys

def patch_file():
    filepath = 'src/components/DiagnosticInterface.tsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update imports
    content = content.replace(
        'import { Search, X, Mic, MicOff, Square, Paperclip, ChevronDown } from "lucide-react";',
        'import { Search, X, Mic, MicOff, Square, Paperclip, ChevronDown, ArrowUp } from "lucide-react";'
    )

    # 2. Extract parts
    # We want to replace everything from "      {/* ── Voice input bar" to the end of the input card div.
    # We know the voice input starts exactly at: "      {/* \u2500\u2500 Voice input bar"
    # And the end of input card is exactly the closing tag "      </div>" right before "      {/* Voice error */}"
    
    start_marker = "      {/* ── Voice input bar ────────────────────────────────────────────── */}"
    end_marker = "      {/* Voice error */}"
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find Voice input bar or Voice error marker")
        return

    new_ui = """      {/* ── Settings Row (above input) ─────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          padding: "0 4px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {detectedLabel && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "2px 8px",
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
        <span
          style={{
            fontSize: 11,
            color: charCount > 1800 ? "var(--amber)" : "var(--ink-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {charCount} {t.diagCharLimit}
        </span>
      </div>

      {/* ── Main Input Container (ChatGPT Style) ───────────────────────── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: "var(--surface)",
          border: isFocused ? "1px solid var(--teal)" : isHovered ? "1px solid var(--border-2)" : "1px solid var(--border)",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: isFocused 
            ? "inset 0 0 0 1px var(--teal), 0 0 0 4px rgba(20, 184, 166, 0.15), var(--shadow-lg)" 
            : isHovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
          transition: "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
          transform: isFocused || isHovered ? "translateY(-2px)" : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Upload panel (slides open above textarea) */}
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
                  setUploadOpen(false);
                }
              }}
              onClear={handleDocClear}
              extracted={extractedDoc}
            />
          </div>
        )}

        <div style={{ display: "flex", alignItems: "flex-end", padding: "8px 12px", gap: 8 }}>
          {/* Upload Button */}
          <button
            onClick={() => setUploadOpen(o => !o)}
            title="Upload a document"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: uploadOpen || extractedDoc ? "var(--teal-light)" : "transparent",
              color: uploadOpen || extractedDoc ? "var(--teal)" : "var(--ink-muted)",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
              marginBottom: 2,
            }}
          >
            <Paperclip size={18} />
          </button>

          {/* Textarea */}
          <textarea
            value={symptoms}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={isListening ? (VOICE_LISTENING[language] ?? VOICE_LISTENING.en) : examples[0]}
            rows={1}
            maxLength={2000}
            style={{
              flex: 1,
              minWidth: 0,
              padding: "10px 0",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: "var(--ink)",
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.5,
              direction: isRTL ? "rtl" : "ltr",
              maxHeight: "200px",
              minHeight: "40px",
            }}
            ref={(el) => {
              if (el) {
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 200) + "px";
              }
            }}
          />

          {/* Right Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            {recognitionSupported && (
              <button
                onClick={toggleListening}
                title={isListening ? "Stop recording" : "Start voice input"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  background: isListening ? "var(--teal)" : "transparent",
                  color: isListening ? "#fff" : "var(--ink-muted)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {isListening ? <Square size={14} fill="currentColor" /> : <Mic size={18} />}
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !symptoms.trim()}
              title={t.diagShortcut}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: (symptoms.trim() && !loading) ? "var(--teal)" : "var(--surface-2)",
                color: (symptoms.trim() && !loading) ? "#fff" : "var(--border-2)",
                cursor: (loading || !symptoms.trim()) ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {loading ? (
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              ) : (
                <ArrowUp size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>

"""
    content = content[:int(start_idx)] + new_ui + content[int(end_idx):]  # type: ignore

    # 3. Remove standalone submit button
    submit_marker = "      {/* ── Submit ─────────────────────────────────────────────────────── */}"
    end_submit_marker = "    </div>\n  );\n}"
    
    sub_start_idx = content.find(submit_marker)
    sub_end_idx = content.find(end_submit_marker)
    if sub_start_idx != -1 and sub_end_idx != -1:
        content = content[:int(sub_start_idx)] + content[int(sub_end_idx):]  # type: ignore

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Patched successfully!")

if __name__ == '__main__':
    patch_file()
