"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#0d0b0a",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          margin: 0,
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#ffb347",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              boxShadow: "0 0 40px rgba(255,179,71,0.2)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0d0b0a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "12px" }}>
            Something went wrong
          </h1>
          <p
            style={{
              color: "#968a84",
              maxWidth: "400px",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            We hit an unexpected error. Don&apos;t worry &mdash; your data is safe. Try
            refreshing, or contact support if the issue persists.
          </p>
          {error.digest && (
            <p
              style={{
                color: "#968a84",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                marginBottom: "16px",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              padding: "12px 32px",
              background: "#ffb347",
              color: "#0d0b0a",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
