"use client";

// Rendered only when the root layout itself throws. No Clerk, no header,
// no global CSS — must stand alone.
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
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "#fff",
          color: "#0D0D0D",
          padding: "48px 16px",
          textAlign: "center",
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              fontFamily: "ui-monospace, monospace",
              textTransform: "uppercase",
              letterSpacing: ".14em",
              color: "rgba(13,13,13,0.5)",
            }}
          >
            500 · root error
          </p>
          <h1 style={{ fontSize: 32, lineHeight: 1.1, margin: "12px 0" }}>
            Something went very wrong.
          </h1>
          <p style={{ color: "rgba(13,13,13,0.64)", fontSize: 15 }}>
            The application failed to render. This is rare and has been logged.
          </p>
          {error.digest && (
            <p
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 12,
                color: "rgba(13,13,13,0.5)",
                margin: "16px 0",
              }}
            >
              Reference · {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "10px 20px",
              background: "#2B7BFF",
              color: "#fff",
              border: 0,
              borderRadius: 10,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
