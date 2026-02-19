import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";
  const email = user?.email ?? "";

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={styles.trigger}
        title={email}
      >
        <span style={styles.avatar}>{initials}</span>
        <span style={styles.email}>{email}</span>
        <span style={{ color: "#4a4e6a", marginLeft: 4 }}>▾</span>
      </button>

      {open && (
        <>
          <div style={styles.backdrop} onClick={() => setOpen(false)} />
          <div style={styles.dropdown}>
            <div style={styles.dropdownHeader}>
              <div style={styles.avatarLarge}>{initials}</div>
              <div>
                <div style={styles.dropdownEmail}>{email}</div>
                <div style={styles.dropdownRole}>Clinician</div>
              </div>
            </div>
            <div style={styles.divider} />
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              style={styles.signOutBtn}
            >
              {loggingOut ? "Signing out..." : "→  Sign Out"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  trigger: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(14,14,24,0.8)",
    border: "1px solid rgba(0,229,180,0.15)",
    borderRadius: 10,
    padding: "6px 12px 6px 6px",
    cursor: "pointer",
    color: "#8b8fa8",
    fontSize: 13,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #00e5b4, #00b4d8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#080810",
    fontWeight: 700,
    fontSize: 11,
  },
  email: {
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 10,
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    width: 240,
    background: "#0e0e18",
    border: "1px solid rgba(0,229,180,0.15)",
    borderRadius: 12,
    boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
    zIndex: 11,
    overflow: "hidden",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px",
  },
  avatarLarge: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #00e5b4, #00b4d8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#080810",
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  dropdownEmail: {
    color: "#e8eaf6",
    fontSize: 13,
    fontWeight: 500,
    maxWidth: 160,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  dropdownRole: {
    color: "#4a4e6a",
    fontSize: 11,
    marginTop: 2,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.06)",
  },
  signOutBtn: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    background: "none",
    border: "none",
    textAlign: "left",
    color: "#ff6b8a",
    fontSize: 13,
    cursor: "pointer",
    transition: "background 0.15s",
  },
};
