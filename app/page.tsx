import DashboardProgress from "@/components/DashboardProgress";
import AuthButton from "@/components/AuthButton";
import SupportSection from "@/components/SupportSection";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 0 80px" }}>

      {/* Nav */}
      <nav style={{
        borderBottom: "1px solid var(--surface-2)",
        position: "sticky", top: 0, zIndex: 10,
        background: "var(--bg)", backdropFilter: "blur(8px)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "var(--bright)" }}>
            learn<span style={{ color: "var(--yellow)" }}>JS</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="#support" className="support-nav-link" style={{
              fontSize: 11, fontWeight: 600, color: "var(--muted)",
              textDecoration: "none", letterSpacing: "0.3px",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <span style={{ fontSize: 10 }}>♥</span> Support
            </a>
            <AuthButton />
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 40px 0" }}>

        {/* ── Hero ─────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>

          {/* Brand label — not a heading, nav already has the logo */}
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "3px",
            textTransform: "uppercase", color: "var(--yellow)",
            marginBottom: 20,
          }}>
            learnJS
          </div>

          {/* Primary headline — this is the actual H1 */}
          <h1 style={{
            fontFamily: "var(--font-sans)",
            fontSize: 42, fontWeight: 800,
            letterSpacing: "-1.5px", color: "var(--bright)",
            margin: "0 0 16px", lineHeight: 1.1,
          }}>
            Build real things<br />in JavaScript.
          </h1>

          {/* Supporting value prop */}
          <p style={{
            fontSize: 16, color: "var(--subtle)", lineHeight: 1.75,
            maxWidth: 460, margin: "0 auto 36px",
            fontFamily: "var(--font-sans)", fontWeight: 400,
          }}>
            22 hands-on projects. One concept per lesson.<br />
            No fluff, no paywalls — just code.
          </p>

          {/* How it works — de-emphasised process row, not a UI card */}
          <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", gap: 6, flexWrap: "wrap",
          }}>
            {[
              { icon: "📖", label: "Read the concept" },
              { icon: "👁️", label: "See code examples" },
              { icon: "⌨️", label: "Build it yourself" },
              { icon: "✅", label: "Check off each step" },
            ].map(({ icon, label }, i, arr) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 13 }}>{icon}</span>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 400 }}>{label}</span>
                {i < arr.length - 1 && (
                  <span style={{ fontSize: 10, color: "var(--border)", margin: "0 4px" }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Dashboard (CTA + tier grids) ─────────────────── */}
        <DashboardProgress />

        {/* ── Support footer ────────────────────────────────── */}
        <SupportSection />

      </div>
    </main>
  );
}
