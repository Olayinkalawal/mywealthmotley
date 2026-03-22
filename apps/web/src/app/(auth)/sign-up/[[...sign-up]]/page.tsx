"use client";

import { useAuth } from "@clerk/nextjs";
import { useSignUp } from "@clerk/nextjs/legacy";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                          */
/* ------------------------------------------------------------------ */
function UserIcon() {
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
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

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
/*  Password strength                                                  */
/* ------------------------------------------------------------------ */
interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "Contains a number", test: (pw) => /\d/.test(pw) },
  { label: "Contains uppercase", test: (pw) => /[A-Z]/.test(pw) },
  {
    label: "Contains special character",
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

function getStrength(pw: string): number {
  if (!pw) return 0;
  return PASSWORD_RULES.filter((r) => r.test(pw)).length;
}

const STRENGTH_COLORS: Record<number, string> = {
  0: "rgba(255,255,255,0.08)",
  1: "#C84B31",
  2: "#E5930C",
  3: "#D4A843",
  4: "#5B9A6D",
};

const STRENGTH_LABELS: Record<number, string> = {
  0: "",
  1: "Weak",
  2: "Fair",
  3: "Good",
  4: "Strong",
};

function PasswordStrengthBars({ password }: { password: string }) {
  const strength = getStrength(password);
  if (!password) return null;

  const activeColor = STRENGTH_COLORS[strength] ?? "rgba(255,255,255,0.08)";

  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "2px",
              background:
                i <= strength ? activeColor : "rgba(255,255,255,0.08)",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontSize: "0.75rem",
          fontFamily: "'JetBrains Mono', monospace",
          color: activeColor,
        }}
      >
        {STRENGTH_LABELS[strength] ?? ""}
      </span>
    </div>
  );
}

/* ================================================================== */
/*  SignUpPage                                                         */
/* ================================================================== */
export default function SignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  /* ---- form state ---- */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---- verification state ---- */
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  /* ---- auto-redirect if signed in ---- */
  if (isSignedIn) {
    router.replace(ROUTES.onboarding);
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
  /*  Google OAuth                                                     */
  /* ================================================================ */
  async function handleGoogle() {
    if (!isLoaded || !signUp) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: ROUTES.onboarding,
      });
    } catch (err) {
      setError(clerkError(err));
    }
  }

  /* ================================================================ */
  /*  Sign-up submit                                                   */
  /* ================================================================ */
  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setError("");
    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err) {
      setError(clerkError(err));
    } finally {
      setLoading(false);
    }
  }

  /* ================================================================ */
  /*  Verify email code                                                */
  /* ================================================================ */
  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setVerifyError("");
    setVerifyLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace(ROUTES.onboarding);
      }
    } catch (err) {
      setVerifyError(clerkError(err));
    } finally {
      setVerifyLoading(false);
    }
  }

  /* ================================================================ */
  /*  Render: Verification step                                        */
  /* ================================================================ */
  if (verifying) {
    return (
      <div>
        <div className="auth-glass-card" style={{ padding: "32px" }}>
          <h1
            style={{
              fontFamily: "'DynaPuff', cursive",
              fontSize: "1.75rem",
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: "0.925rem",
              color: "#968a84",
              marginBottom: "28px",
              lineHeight: 1.5,
            }}
          >
            We sent a verification code to{" "}
            <span style={{ color: "#ffffff", fontWeight: 500 }}>{email}</span>
          </p>

          {verifyError && (
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
              {verifyError}
            </div>
          )}

          <form onSubmit={handleVerify}>
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
                fontSize: "1.25rem",
              }}
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
            />

            <button
              type="submit"
              className="auth-pill-btn"
              disabled={verifyLoading}
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
              {verifyLoading ? <SpinnerIcon /> : "Verify email"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#968a84",
              marginTop: "16px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={async () => {
                if (!isLoaded || !signUp) return;
                try {
                  await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                  });
                } catch (err) {
                  setVerifyError(clerkError(err));
                }
              }}
              style={{
                background: "none",
                border: "none",
                color: "#ffb347",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.8rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Render: Sign-up form                                             */
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
          Create your account
        </h1>
        <p
          style={{
            fontSize: "0.925rem",
            color: "#968a84",
            marginBottom: "28px",
            lineHeight: 1.5,
          }}
        >
          Set up your identity to start building wealth
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

        <form onSubmit={handleSignUp}>
          {/* Full Name */}
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
              Full name
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                  }}
                >
                  <UserIcon />
                </div>
                <input
                  type="text"
                  className="auth-glass-input"
                  style={{ ...inputStyle, paddingLeft: "42px" }}
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  className="auth-glass-input"
                  style={{ ...inputStyle, paddingLeft: "16px" }}
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>
          </div>

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
              Password
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
                type={showPassword ? "text" : "password"}
                className="auth-glass-input"
                style={{
                  ...inputStyle,
                  paddingLeft: "42px",
                  paddingRight: "42px",
                }}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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
            <PasswordStrengthBars password={password} />
          </div>

          {/* Terms checkbox */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <input
              type="checkbox"
              className="auth-checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
              style={{ marginTop: "2px" }}
            />
            <label
              htmlFor="terms"
              style={{
                fontSize: "0.8rem",
                color: "#968a84",
                lineHeight: 1.5,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                style={{
                  color: "#ffffff",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                target="_blank"
                style={{
                  color: "#ffffff",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                }}
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="auth-pill-btn"
            disabled={loading || !isLoaded || !agreedToTerms}
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
            {loading ? <SpinnerIcon /> : "Create account"}
          </button>
        </form>
      </div>

      {/* Sign in link */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.875rem",
          color: "#968a84",
          marginTop: "24px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Already have an account?{" "}
        <Link
          href={ROUTES.signIn}
          style={{
            color: "#ffb347",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Sign in
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
