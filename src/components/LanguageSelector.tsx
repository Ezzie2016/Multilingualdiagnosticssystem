import { useState, useRef, useEffect } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ha", label: "Hausa", flag: "🇳🇬" },
  { code: "yo", label: "Yorùbá", flag: "🇳🇬" },
  { code: "ig", label: "Igbo", flag: "🇳🇬" },
  { code: "pcm", label: "Pidgin", flag: "🇳🇬" },
  { code: "ff", label: "Fula", flag: "🇳🇬" },
  { code: "kr", label: "Kanuri", flag: "🇳🇬" },
];

interface Props {
  language?: string;
  value?: string;
  onLanguageChange?: (code: string) => void;
  onChange?: (code: string) => void;
}

export function LanguageSelector({
  language,
  value,
  onLanguageChange,
  onChange,
}: Props) {
  const current = language ?? value ?? "en";
  const handleChange = onLanguageChange ?? onChange ?? (() => {});
  const selected = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  // Recalculate position whenever the dropdown opens
  const openDropdown = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({
        top: r.bottom + 8,
        right: window.innerWidth - r.right,
      });
    }
    setOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("mousedown", close);
    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={open ? () => setOpen(false) : openDropdown}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 12px",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: 8,
          color: "#fff",
          cursor: "pointer",
          fontFamily: "var(--font-body, sans-serif)",
          fontSize: 13,
          fontWeight: 500,
          transition: "background 0.15s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
        }
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{selected.flag}</span>
        <span>{selected.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Fixed-position dropdown — renders on top of everything */}
      {open && (
        <div
          onMouseDown={(e) => e.stopPropagation()} // prevent close handler firing on the list itself
          style={{
            position: "fixed",
            top: pos.top,
            right: pos.right,
            zIndex: 9999,
            background: "#fff",
            border: "1px solid var(--border, #dde8f5)",
            borderRadius: 12,
            padding: 6,
            minWidth: 180,
            boxShadow: "0 8px 32px rgba(15,45,64,0.18)",
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                handleChange(lang.code);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "8px 10px",
                background: lang.code === current ? "#ccfbf1" : "transparent",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                color: lang.code === current ? "#0d9488" : "#1a2332",
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: 13,
                textAlign: "left",
                fontWeight: lang.code === current ? 600 : 400,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                if (lang.code !== current)
                  (e.currentTarget as HTMLElement).style.background = "#f7fbff";
              }}
              onMouseLeave={(e) => {
                if (lang.code !== current)
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
              }}
            >
              <span style={{ fontSize: 15 }}>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default LanguageSelector;
