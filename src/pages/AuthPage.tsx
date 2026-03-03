import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type AuthMode = "login" | "signup" | "reset";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const clearState = () => {
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate(from, { replace: true });
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }
        const { error } = await signUp(email, password);
        if (error) throw error;
        setMessage(
          "Account created! Check your email to confirm your address before logging in.",
        );
      } else if (mode === "reset") {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setMessage("Password reset link sent. Check your email inbox.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearState();
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes authSpin { to { transform: rotate(360deg); } }
        input::placeholder { color: #2e3150; }
        input:focus { outline: none; }
      `}</style>
      {/* Background grid */}
      <div style={styles.grid} />
      {/* Glow orb */}
      <div style={styles.glow} />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⬡</span>
          </div>
          <h1 style={styles.appName}>MediLingua</h1>
          <p style={styles.appTagline}>Multilingual Diagnosis System</p>
        </div>

        {/* Card */}
        <div style={styles.card}>
          {/* Mode tabs */}
          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tab,
                ...(mode === "login" ? styles.tabActive : {}),
              }}
              onClick={() => switchMode("login")}
            >
              Sign In
            </button>
            <button
              style={{
                ...styles.tab,
                ...(mode === "signup" ? styles.tabActive : {}),
              }}
              onClick={() => switchMode("signup")}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {mode === "reset" && (
              <div style={styles.resetBanner}>
                <span style={{ color: "#00e5b4", marginRight: 8 }}>↩</span>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  style={styles.backLink}
                >
                  Back to sign in
                </button>
                <span style={{ flex: 1 }} />
                <span style={{ color: "#8b8fa8", fontSize: 12 }}>
                  Password Reset
                </span>
              </div>
            )}

            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinician@hospital.org"
                required
                style={styles.input}
                onFocus={(e) =>
                  Object.assign(e.target.style, styles.inputFocus)
                }
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Password */}
            {mode !== "reset" && (
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "signup" ? "Min. 8 characters" : "••••••••"
                  }
                  required
                  style={styles.input}
                  onFocus={(e) =>
                    Object.assign(e.target.style, styles.inputFocus)
                  }
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              </div>
            )}

            {/* Confirm Password */}
            {mode === "signup" && (
              <div style={styles.field}>
                <label style={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  style={styles.input}
                  onFocus={(e) =>
                    Object.assign(e.target.style, styles.inputFocus)
                  }
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              </div>
            )}

            {/* Forgot password link */}
            {mode === "login" && (
              <button
                type="button"
                onClick={() => switchMode("reset")}
                style={styles.forgotLink}
              >
                Forgot password?
              </button>
            )}

            {/* Error */}
            {error && (
              <div style={styles.errorBox}>
                <span style={{ color: "#ff4d6d", marginRight: 8 }}>✕</span>
                {error}
              </div>
            )}

            {/* Success */}
            {message && (
              <div style={styles.successBox}>
                <span style={{ color: "#00e5b4", marginRight: 8 }}>✓</span>
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : {}),
              }}
            >
              {loading ? (
                <span style={styles.spinner} />
              ) : (
                <>
                  {mode === "login" && "Sign In →"}
                  {mode === "signup" && "Create Account →"}
                  {mode === "reset" && "Send Reset Link →"}
                </>
              )}
            </button>
          </form>
        </div>

        <p style={styles.footer}>
          Secure access · HIPAA-aware · Powered by Supabase
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#080810",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: '"DM Sans", "Segoe UI", system-ui, sans-serif',
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,229,180,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,180,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    top: "-20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "600px",
    height: "400px",
    background:
      "radial-gradient(ellipse, rgba(0,229,180,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "420px",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "32px",
  },
  header: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: "14px",
    background: "linear-gradient(135deg, #00e5b4 0%, #00b4d8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    boxShadow: "0 0 30px rgba(0,229,180,0.3)",
  },
  logoIcon: {
    fontSize: 26,
    color: "#080810",
  },
  appName: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    color: "#f0f2ff",
    letterSpacing: "-0.5px",
  },
  appTagline: {
    margin: 0,
    fontSize: "12px",
    color: "#4a4e6a",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  card: {
    width: "100%",
    background: "rgba(14,14,24,0.9)",
    border: "1px solid rgba(0,229,180,0.12)",
    borderRadius: "20px",
    backdropFilter: "blur(20px)",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  tab: {
    flex: 1,
    padding: "16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#4a4e6a",
    fontSize: "14px",
    fontWeight: 500,
    transition: "color 0.2s",
    letterSpacing: "0.02em",
  },
  tabActive: {
    color: "#00e5b4",
    borderBottom: "2px solid #00e5b4",
    marginBottom: "-1px",
  },
  form: {
    padding: "28px 28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  resetBanner: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    background: "rgba(0,229,180,0.05)",
    border: "1px solid rgba(0,229,180,0.15)",
    borderRadius: "8px",
    marginBottom: 4,
  },
  backLink: {
    background: "none",
    border: "none",
    color: "#00e5b4",
    cursor: "pointer",
    fontSize: 13,
    padding: 0,
    textDecoration: "underline",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  label: {
    fontSize: "11px",
    color: "#6b7194",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  input: {
    padding: "11px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#e8eaf6",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  inputFocus: {
    padding: "11px 14px",
    background: "rgba(0,229,180,0.04)",
    border: "1px solid rgba(0,229,180,0.35)",
    borderRadius: "10px",
    color: "#e8eaf6",
    fontSize: "14px",
    outline: "none",
    boxShadow: "0 0 0 3px rgba(0,229,180,0.08)",
    width: "100%",
    boxSizing: "border-box",
  },
  forgotLink: {
    alignSelf: "flex-end",
    background: "none",
    border: "none",
    color: "#4a4e6a",
    cursor: "pointer",
    fontSize: "12px",
    padding: 0,
    marginTop: -8,
    textDecoration: "underline",
    transition: "color 0.2s",
  },
  errorBox: {
    padding: "11px 14px",
    background: "rgba(255,77,109,0.08)",
    border: "1px solid rgba(255,77,109,0.25)",
    borderRadius: "8px",
    color: "#ff8fa3",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
  },
  successBox: {
    padding: "11px 14px",
    background: "rgba(0,229,180,0.07)",
    border: "1px solid rgba(0,229,180,0.25)",
    borderRadius: "8px",
    color: "#00e5b4",
    fontSize: "13px",
    display: "flex",
    alignItems: "flex-start",
  },
  submitBtn: {
    padding: "13px",
    background: "linear-gradient(135deg, #00e5b4, #00b4d8)",
    border: "none",
    borderRadius: "10px",
    color: "#080810",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.03em",
    transition: "opacity 0.2s, transform 0.1s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(0,229,180,0.25)",
    marginTop: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  spinner: {
    display: "inline-block",
    width: 18,
    height: 18,
    border: "2px solid rgba(8,8,16,0.3)",
    borderTopColor: "#080810",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  footer: {
    fontSize: "11px",
    color: "#2e3150",
    letterSpacing: "0.05em",
    textAlign: "center",
  },
};
