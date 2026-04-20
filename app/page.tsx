import DashboardProgress from "@/components/DashboardProgress";
import AuthButton from "@/components/AuthButton";
import { LAYOUT } from "@/lib/layout";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 0 80px" }}>
      {/* Site nav */}
      <nav style={{
        borderBottom: "1px solid var(--surface-2)",
        position: "sticky", top: 0, zIndex: 10,
        background: "var(--bg)", backdropFilter: "blur(8px)",
      }}>
        <div style={{
          maxWidth: LAYOUT.containerMaxWidth, margin: "0 auto",
          padding: "14px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "var(--bright)",
          }}>
            learn<span style={{ color: "var(--yellow)" }}>JS</span>
          </span>
          <AuthButton />
        </div>
      </nav>

      <div style={{ maxWidth: LAYOUT.containerMaxWidth, margin: "0 auto", padding: `40px 40px 0` }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{
            fontFamily: "var(--font-sans)",
            fontSize: 32, fontWeight: 700,
            letterSpacing: "-0.5px", color: "var(--bright)",
            margin: 0,
          }}>
            learn<span style={{ color: "var(--yellow)" }}>JavaScript</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>
            22 projects · build by doing · one concept at a time
          </p>

          {/* How it works */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 24, marginTop: 24,
            flexWrap: "wrap",
          }}>
            {[
              { icon: "📖", label: "Read the concept" },
              { icon: "👁️", label: "See a code example" },
              { icon: "⌨️", label: "Build it yourself" },
              { icon: "✅", label: "Check off each step" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 12, color: "var(--subtle)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard — client component (reads localStorage) */}
        <DashboardProgress />

        {/* Footer */}
        <div style={{
          textAlign: "center", marginTop: 48,
          fontSize: 11, color: "var(--border)", lineHeight: 1.8,
        }}>
          Click a project card to open its lesson.<br />
          Tick off each step as you build. Progress saves automatically.
        </div>
      </div>
    </main>
  );
}
