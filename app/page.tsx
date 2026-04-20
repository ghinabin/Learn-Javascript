import DashboardProgress from "@/components/DashboardProgress";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", padding: "32px 16px 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

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
