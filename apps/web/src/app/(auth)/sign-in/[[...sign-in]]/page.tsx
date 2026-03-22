"use client";

import { useAuth } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs/legacy";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  SVG Icons (inline, no dependency beyond what's in the project)     */
/* ------------------------------------------------------------------ */
function EmailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#968a84"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 6L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#968a84"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#968a84"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#968a84"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <path d="M21 12a9 9 0 11-6.219-8.56" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#968a84"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared inline style tokens                                         */
/* ------------------------------------------------------------------ */
const inputStyle = {
  width: "100%",
  height: "48px",
  background: "rgba(0,0,0,0.2)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "0.925rem",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
} as const;

/* ------------------------------------------------------------------ */
/*  Forgot-password flow steps                                         */
/* ------------------------------------------------------------------ */
type ForgotStep = "idle" | "email" | "code" | "newPassword";

/* ================================================================== */
/*  SignInPage                                                         */
/* ================================================================== */
export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  /* ---- form state ---- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---- forgot password state ---- */
  const [forgotStep, setForgotStep] = useState<ForgotStep>("idle");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  /* ---- auto-redirect if signed in ---- */
  if (isSignedIn) {
    router.replace(ROUTES.dashboard);
    return null;
  }

  /* ---- helpers ---- */
  function clerkError(err: unknown): string {
    if (
      err &&
      typeof err === "object" &&
      "errors" in err &&
      Array.isArray((err as { errors: unknown[] }).errors)
    ) {
      const first = (
        err as { errors: { longMessage?: string; message?: string }[] }
      ).errors[0];
      return first?.longMessage ?? first?.message ?? "Something went wrong.";
    }
    return "Something went wrong. Please try again.";
  }

  /* ================================================================ */
  /*  Sign-in submit                                                   */
  /* ================================================================ */
  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace(ROUTES.dashboard);
      }
    } catch (err) {
      setError(clerkError(err));
    } finally {
      setLoading(false);
    }
  }

  /* ================================================================ */
  /*  Google OAuth                                                     */
  /* ================================================================ */
  async function handleGoogle() {
    if (!isLoaded || !signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: ROUTES.dashboard,
      });
    } catch (err) {
      setError(clerkError(err));
    }
  }

  /* ================================================================ */
  /*  Forgot-password handlers                                         */
  /* ================================================================ */
  async function handleForgotSendCode(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setForgotError("");
    setForgotLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: forgotEmail,
      });
      setForgotStep("code");
    } catch (err) {
      setForgotError(clerkError(err));
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleForgotVerifyCode(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setForgotError("");
    setForgotLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode,
      });

      if (result.status === "needs_new_password") {
        setForgotStep("newPassword");
      }
    } catch (err) {
      setForgotError(clerkError(err));
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setForgotError("");
    setForgotLoading(true);

    try {
      const result = await signIn.resetPassword({
        password: newPassword,
        signOutOfOtherSessions: true,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace(ROUTES.dashboard);
      }
    } catch (err) {
      setForgotError(clerkError(err));
    } finally {
      setForgotLoading(false);
    }
  }

  function resetForgot() {
    setForgotStep("idle");
    setForgotEmail("");
    setResetCode("");
    setNewPassword("");
    setForgotError("");
  }

  /* ================================================================ */
  /*  Render: Forgot password flow                                     */
  /* ================================================================ */
  if (forgotStep !== "idle") {
    return (
      <div>
        <div className="auth-glass-card" style={{ padding: "32px" }}>
          <button
            type="button"
            onClick={resetForgot}
            style={{
              background: "none",
              border: "none",
              color: "#968a84",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.875rem",
              cursor: "pointer",
              padding: 0,
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            &larr; Back to sign in
          </button>

          <h1
            style={{
              fontFamily: "'DynaPuff', cursive",
              fontSize: "1.75rem",
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            Reset your password
          </h1>
          <p
            style={{
              fontSize: "0.925rem",
              color: "#968a84",
              marginBottom: "28px",
              lineHeight: 1.5,
            }}
          >
            {forgotStep === "email" &&
              "Enter your email to receive a reset code."}
            {forgotStep === "code" &&
              "We sent a code to your email. Enter it below."}
            {forgotStep === "newPassword" &&
              "Choose a new password for your account."}
          </p>

          {forgotError && (
            <div
              style={{
                background: "rgba(200, 75, 49, 0.12)",
                border: "1px solid rgba(200, 75, 49, 0.3)",
                borderRadius: "12px",
                padding: "12px 16px",
                color: "#ff6b6b",
                fontSize: "0.875rem",
                marginBottom: "20px",
              }}
            >
              {forgotError}
            </div>
          )}

          {/* Step 1: email */}
          {forgotStep === "email" && (
            <form onSubmit={handleForgotSendCode}>
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Email address
              </label>
              <input
                type="email"
                className="auth-glass-input"
                style={{ ...inputStyle, paddingLeft: "16px" }}
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                autoFocus
              />
              <button
                type="submit"
                className="auth-pill-btn"
                disabled={forgotLoading}
                style={{
                  width: "100%",
                  height: "48px",
                  background: "#ffb347",
                  color: "#0d0b0a",
                  border: "none",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "20px",
                  transition: "transform 0.2s ease, background 0.2s ease",
                  boxShadow: "0 0 20px rgba(255,179,71,0.3)",
                }}
              >
                {forgotLoading ? <SpinnerIcon /> : "Send reset code"}
              </button>
            </form>
          )}

          {/* Step 2: code */}
          {forgotStep === "code" && (
            <form onSubmit={handleForgotVerifyCode}>
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Verification code
              </label>
              <input
                type="text"
                inputMode="numeric"
                className="auth-glass-input"
                style={{
                  ...inputStyle,
                  paddingLeft: "16px",
                  textAlign: "center",
                  letterSpacing: "0.3em",
                }}
                placeholder="Enter 6-digit code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                autoFocus
              />
              <button
                type="submit"
                className="auth-pill-btn"
                disabled={forgotLoading}
                style={{
                  width: "100%",
                  height: "48px",
                  background: "#ffb347",
                  color: "#0d0b0a",
                  border: "none",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "20px",
                  transition: "transform 0.2s ease, background 0.2s ease",
                  boxShadow: "0 0 20px rgba(255,179,71,0.3)",
                }}
              >
                {forgotLoading ? <SpinnerIcon /> : "Verify code"}
              </button>
            </form>
          )}

          {/* Step 3: new password */}
          {forgotStep === "newPassword" && (
            <form onSubmit={handleResetPassword}>
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                New password
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                  }}
                >
                  <LockIcon />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="auth-glass-input"
                  style={{
                    ...inputStyle,
                    paddingLeft: "42px",
                    paddingRight: "42px",
                  }}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                  }}
                  tabIndex={-1}
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <button
                type="submit"
                className="auth-pill-btn"
                disabled={forgotLoading}
                style={{
                  width: "100%",
                  height: "48px",
                  background: "#ffb347",
                  color: "#0d0b0a",
                  border: "none",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "20px",
                  transition: "transform 0.2s ease, background 0.2s ease",
                  boxShadow: "0 0 20px rgba(255,179,71,0.3)",
                }}
              >
                {forgotLoading ? <SpinnerIcon /> : "Reset password"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Render: Main sign-in form                                        */
  /* ================================================================ */
  return (
    <div>
      {/* Glass card */}
      <div className="auth-glass-card" style={{ padding: "32px" }}>
        {/* Heading */}
        <h1
          style={{
            fontFamily: "'DynaPuff', cursive",
            fontSize: "1.75rem",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          Sign in to WealthMotley
        </h1>
        <p
          style={{
            fontSize: "0.925rem",
            color: "#968a84",
            marginBottom: "28px",
            lineHeight: 1.5,
          }}
        >
          Enter your credentials to continue
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(200, 75, 49, 0.12)",
              border: "1px solid rgba(200, 75, 49, 0.3)",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "#ff6b6b",
              fontSize: "0.875rem",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Google OAuth button */}
        <button
          type="button"
          className="auth-social-btn"
          onClick={handleGoogle}
          style={{
            width: "100%",
            height: "48px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            color: "#ffffff",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontFamily: "'Inter', sans-serif",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            margin: "24px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: "#968a84",
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: "nowrap",
            }}
          >
            or
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(255,255,255,0.08)",
            }}
          />
        </div>

        <form onSubmit={handleSignIn}>
          {/* Email */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Email address
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                }}
              >
                <EmailIcon />
              </div>
              <input
                type="email"
                className="auth-glass-input"
                style={{ ...inputStyle, paddingLeft: "42px" }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotStep("email");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffb347",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  padding: 0,
                }}
              >
                Forgot your password?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                }}
              >
                <LockIcon />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-glass-input"
                style={{
                  ...inputStyle,
                  paddingLeft: "42px",
                  paddingRight: "42px",
                }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                }}
                tabIndex={-1}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="auth-pill-btn"
            disabled={loading || !isLoaded}
            style={{
              width: "100%",
              height: "48px",
              background: "#ffb347",
              color: "#0d0b0a",
              border: "none",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "transform 0.2s ease, background 0.2s ease",
              boxShadow: "0 0 20px rgba(255,179,71,0.3)",
            }}
          >
            {loading ? <SpinnerIcon /> : "Sign in"}
          </button>
        </form>
      </div>

      {/* Sign up link */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.875rem",
          color: "#968a84",
          marginTop: "24px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.signUp}
          style={{
            color: "#ffb347",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Create account
        </Link>
      </p>

      {/* Trust signal */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginTop: "20px",
        }}
      >
        <ShieldCheckIcon />
        <span
          style={{
            fontSize: "0.75rem",
            color: "#968a84",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Secured with 256-bit encryption
        </span>
      </div>
    </div>
  );
}
