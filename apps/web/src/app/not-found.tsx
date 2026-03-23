import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: "#0d0b0a",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
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
        <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#0d0b0a" }}>?</span>
      </div>
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "8px",
          fontFamily: "DynaPuff, cursive",
        }}
      >
        404
      </h1>
      <p
        style={{
          color: "#968a84",
          maxWidth: "400px",
          lineHeight: 1.6,
          marginBottom: "24px",
        }}
      >
        This page doesn&apos;t exist. Maybe it was moved, or you followed a broken link.
      </p>
      <Link
        href="/dashboard"
        style={{
          padding: "12px 32px",
          background: "#ffb347",
          color: "#0d0b0a",
          border: "none",
          borderRadius: "12px",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
