import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";
  const email = user?.email ?? "";

  // Calculate fixed position when opening
  const openMenu = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({
        top: r.bottom + 8,
        right: window.innerWidth - r.right,
      });
    }
    setOpen(true);
  };

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  const handleSignOut = async () => {
    setLoggingOut(true);
    setOpen(false);
    await signOut();
    setLoggingOut(false);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        ref={btnRef}
        onClick={open ? () => setOpen(false) : openMenu}
        title={email}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 10px 6px 6px",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: 10,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
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
        {/* Avatar */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0d9488, #0891b2)",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {initials}
        </span>

        {/* Email — visible on wider screens */}
        <span
          style={{
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {email}
        </span>

        <ChevronDown
          size={14}
          color="rgba(255,255,255,0.7)"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Fixed-position dropdown — always on top */}
      {open && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: pos.top,
            right: pos.right,
            zIndex: 9999,
            width: 240,
            background: "#fff",
            border: "1px solid var(--border, #dde8f5)",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(15,45,64,0.18)",
            overflow: "hidden",
          }}
        >
          {/* User info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px",
              borderBottom: "1px solid var(--border, #dde8f5)",
              background: "var(--surface-2, #f7fbff)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0d9488, #0891b2)",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink, #1a2332)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 160,
                }}
              >
                {email}
              </p>
              <p
                style={{
                  margin: 0,
                  marginTop: 2,
                  fontSize: 11,
                  color: "var(--ink-muted, #6b84a0)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Clinician
              </p>
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "12px 16px",
              background: "none",
              border: "none",
              cursor: loggingOut ? "not-allowed" : "pointer",
              color: "#dc2626",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              textAlign: "left",
              opacity: loggingOut ? 0.5 : 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!loggingOut)
                (e.currentTarget as HTMLElement).style.background = "#fef2f2";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "none";
            }}
          >
            <LogOut size={15} />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </>
  );
}
