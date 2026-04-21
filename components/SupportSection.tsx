"use client";
// Drop real bank details in when ready; the card layout won't change.

export default function SupportSection() {
  return (
    <section
      id="support"
      style={{
        marginTop: 80,
        paddingTop: 48,
        borderTop: "1px solid var(--surface-2)",
      }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 48,
        alignItems: "center",
      }}
        className="support-grid"
      >
        {/* Left — cause copy */}
        <div style={{ maxWidth: 440 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "1.5px", color: "var(--yellow)", marginBottom: 12,
          }}>
            learnJS Fund
          </div>

          <h2 style={{
            fontFamily: "var(--font-sans)",
            fontSize: 22, fontWeight: 700,
            color: "var(--bright)", margin: "0 0 12px",
            letterSpacing: "-0.3px", lineHeight: 1.3,
          }}>
            Keep learnJS free —<br />help build the rest.
          </h2>

          <p style={{
            fontSize: 13, color: "var(--subtle)", lineHeight: 1.8,
            margin: "0 0 8px",
          }}>
            This platform is built by one developer, lesson by lesson.
            Currently <strong style={{ color: "var(--text)" }}>2 of 22 projects</strong> have
            full lessons. Every tip funds the hours to write the next one.
          </p>

          <p style={{
            fontSize: 12, color: "var(--muted)", lineHeight: 1.7, margin: "0 0 24px",
          }}>
            No ads. No paywalls. No upsells — and that&apos;s the plan forever.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 13, fontWeight: 700,
                color: "#09090b",
                background: "var(--yellow)",
                borderRadius: 8, padding: "10px 18px",
                cursor: "not-allowed",
                opacity: 0.7,
              }}
              title="Payment link coming soon"
            >
              ♥ Send a tip
            </span>

            <button
              onClick={() => {
                if (typeof navigator !== "undefined") {
                  navigator.share?.({ url: "https://learnjs.dev", title: "learnJS — learn JavaScript by building" })
                    ?? navigator.clipboard?.writeText("https://learnjs.dev");
                }
              }}
              style={{
                fontSize: 12, color: "var(--muted)",
                background: "transparent",
                border: "1px solid var(--surface-2)",
                borderRadius: 8, padding: "9px 16px",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Share instead ↗
            </button>
          </div>

          <p style={{ fontSize: 10, color: "var(--border)", marginTop: 12, lineHeight: 1.6 }}>
            100% goes toward writing lessons and keeping the platform ad-free.
          </p>
        </div>

        {/* Right — bank card */}
        <BankCard />
      </div>

      {/* Existing footer note */}
      <div style={{
        textAlign: "center", marginTop: 48, paddingTop: 24,
        borderTop: "1px solid var(--surface-2)",
        fontSize: 11, color: "var(--muted)", lineHeight: 1.8,
      }}>
        Click a project card to open its lesson.{" "}
        Tick off each step as you build. Progress saves automatically.
      </div>
    </section>
  );
}

function BankCard() {
  return (
    <div style={{
      width: 320,
      height: 200,
      borderRadius: 16,
      background: "linear-gradient(135deg, #18181b 0%, #232326 55%, #1a1f18 100%)",
      border: "1px solid #3f3f46",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      padding: "22px 24px 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    }}>

      {/* Background glow */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 180, height: 180, borderRadius: "50%",
        background: "radial-gradient(circle, #facc1508 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -20,
        width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle, #22c55e06 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Top row — logo + network mark */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700,
            color: "var(--bright)", letterSpacing: "-0.3px",
            lineHeight: 1,
          }}>
            learn<span style={{ color: "#facc15" }}>JS</span>
          </div>
          <div style={{
            fontSize: 8, fontWeight: 600, letterSpacing: "2px",
            textTransform: "uppercase", color: "#facc1566", marginTop: 3,
          }}>
            FUND
          </div>
        </div>

        {/* Decorative circles (Mastercard-ish) */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#facc1533", border: "1px solid #facc1544",
          }} />
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#22c55e22", border: "1px solid #22c55e33",
            marginLeft: -10,
          }} />
        </div>
      </div>

      {/* Chip + account row */}
      <div style={{ position: "relative" }}>
        {/* Chip */}
        <svg width="34" height="26" viewBox="0 0 34 26" fill="none" style={{ marginBottom: 10, display: "block" }}>
          <rect width="34" height="26" rx="4" fill="#facc1522" stroke="#facc1544" strokeWidth="1"/>
          <rect x="10" y="0" width="14" height="26" rx="0" fill="#facc1511"/>
          <rect x="0" y="9" width="34" height="8" fill="#facc1511"/>
          <rect x="12" y="9" width="10" height="8" fill="#facc1520"/>
        </svg>

        {/* Account number */}
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "2.5px",
          color: "var(--subtle)", display: "flex", gap: 10,
        }}>
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span style={{ color: "var(--muted)" }}>––––</span>
        </div>
      </div>

      {/* Bottom row — name + bank */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
        <div>
          <div style={{ fontSize: 8, color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 }}>
            Account holder
          </div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
            color: "var(--text)", letterSpacing: "0.5px",
          }}>
            learnJS Fund
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 8, color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 }}>
            Bank
          </div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 500,
            color: "var(--muted)", fontStyle: "italic",
          }}>
            [Bank Name]
          </div>
        </div>
      </div>
    </div>
  );
}
