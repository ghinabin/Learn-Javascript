import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, getAdjacentProjects } from "@/lib/projects";
import { TIER_META, Concept } from "@/lib/types";
import BuildChecklist from "@/components/BuildChecklist";
import AuthButton from "@/components/AuthButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const meta = TIER_META[project.tier];
  const { prev: prevProject, next: nextProject } = getAdjacentProjects(slug);

  return (
    <main style={{ minHeight: "100vh", padding: "0 0 80px" }}>

      {/* Top nav — content aligned to same container as page body */}
      <nav style={{
        borderBottom: "1px solid var(--surface-2)",
        position: "sticky", top: 0, zIndex: 10,
        background: "var(--bg)",
        backdropFilter: "blur(8px)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 40px", display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{
            fontSize: 12, color: "var(--muted)", textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            ← Dashboard
          </Link>
          <span style={{ color: "var(--surface-2)" }}>|</span>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px",
            color: meta.color, background: meta.badge + "33", padding: "2px 8px", borderRadius: 99,
          }}>
            Tier {project.tier} · {meta.name}
          </span>
          <div style={{ marginLeft: "auto" }}>
            <AuthButton />
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px 0" }}>

        {/* Project header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
            Project #{String(project.id).padStart(2, "0")}
          </div>
          <h1 style={{
            fontFamily: "var(--font-sans)",
            fontSize: 36, fontWeight: 700, color: "var(--bright)",
            letterSpacing: "-0.5px", margin: "0 0 12px",
          }}>
            {project.name}
          </h1>
          <p style={{ fontSize: 15, color: "var(--subtle)", lineHeight: 1.6, maxWidth: 560 }}>
            {project.tagline}
            {project.previewPath && (
              <>
                {" "}
                <a
                  href={project.previewPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: meta.color, textDecoration: "none", fontSize: 13 }}
                >
                  ▶ See it live
                </a>
              </>
            )}
          </p>

          {/* Concept pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
            {project.concepts.map((c) => (
              <a key={c.id} href={`#concept-${c.id}`} style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 99, textDecoration: "none",
                background: meta.badge + "22", color: meta.color,
                border: `1px solid ${meta.color}33`,
              }}>
                {c.title.split("—")[0].trim()}
              </a>
            ))}
          </div>
        </div>

        {/* Two-column layout: concepts left, checklist right */}
        <div className="grid items-start gap-[32px] lg:gap-[48px] lg:[grid-template-columns:minmax(0,1fr)_360px]">

          {/* LEFT — Concepts */}
          <div>
            <SectionHeading>Concepts</SectionHeading>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32, lineHeight: 1.6 }}>
              Read each concept, understand the examples, then go build. You don&apos;t need to memorise — just understand well enough to write the code with the checklist beside you.
            </p>

            {project.concepts.map((concept, i) => (
              <ConceptSection key={concept.id} concept={concept} index={i} accentColor={meta.color} badgeColor={meta.badge} />
            ))}

            {project.concepts.length === 0 && (
              <div style={{
                padding: "32px", textAlign: "center",
                background: "var(--surface)", borderRadius: 12,
                color: "var(--muted)", fontSize: 14,
              }}>
                Lesson coming soon — complete Project 01 first to unlock it.
              </div>
            )}
          </div>

          {/* RIGHT — Checklist (sticky on desktop, static on tablet) */}
          <div className="lg:sticky lg:top-[68px]" style={{ display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 68px)" }}>
            <SectionHeading>Build Guide</SectionHeading>
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--surface-2)",
              borderRadius: 14,
              overflow: "hidden",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
            }}>
              {project.steps.length > 0 ? (
                <BuildChecklist
                  projectSlug={project.slug}
                  steps={project.steps}
                  nextProject={nextProject ? { slug: nextProject.slug, name: nextProject.name, id: nextProject.id } : null}
                />
              ) : (
                <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
                  Steps will appear here once the lesson is ready.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        <div style={{
          marginTop: 64,
          paddingTop: 32,
          borderTop: "1px solid var(--surface-2)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}>
          {prevProject ? (
            <Link href={`/projects/${prevProject.slug}`} style={{
              textDecoration: "none",
              display: "flex", flexDirection: "column", gap: 4,
              padding: "16px 20px",
              background: "var(--surface)",
              border: "1px solid var(--surface-2)",
              borderRadius: 12,
              transition: "border-color 0.15s",
            }}>
              <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.5px" }}>← Previous</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                {String(prevProject.id).padStart(2, "0")} · {prevProject.name}
              </span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                Tier {prevProject.tier} · {TIER_META[prevProject.tier].name}
              </span>
            </Link>
          ) : <div />}

          <div />
        </div>
      </div>
    </main>
  );
}

/* ── Sub-components ────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: "var(--muted)",
      textTransform: "uppercase", letterSpacing: "1.5px",
      marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

function ConceptSection({
  concept, index, accentColor, badgeColor,
}: {
  concept: Concept;
  index: number;
  accentColor: string;
  badgeColor: string;
}) {
  return (
    <div
      id={`concept-${concept.id}`}
      style={{
        marginBottom: 48,
        scrollMarginTop: 80,
      }}
    >
      {/* Concept header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span style={{
          width: 28, height: 28, borderRadius: 8,
          background: badgeColor + "33",
          border: `1px solid ${accentColor}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: accentColor,
          flexShrink: 0,
        }}>
          {index + 1}
        </span>
        <h2 style={{
          fontFamily: "var(--font-sans)",
          fontSize: 18, fontWeight: 700,
          color: "var(--bright)", margin: 0,
        }}>
          {concept.title}
        </h2>
      </div>

      {/* Explanation */}
      <div style={{
        fontSize: 14, color: "var(--subtle)", lineHeight: 1.8,
        marginBottom: 20, whiteSpace: "pre-line",
      }}>
        {concept.explanation}
      </div>

      {/* Code examples */}
      {concept.examples.map((ex, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          {ex.label && (
            <div style={{
              fontSize: 11, color: "var(--muted)", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "1px",
              marginBottom: 8,
            }}>
              {ex.label}
            </div>
          )}
          <pre style={{
            background: "#0d0d0f",
            border: "1px solid var(--surface-2)",
            borderRadius: 10,
            padding: "18px 20px",
            fontFamily: "var(--font-mono)",
            fontSize: 13, lineHeight: 1.7,
            color: "#e4e4e7",
            overflowX: "auto",
            margin: 0,
            whiteSpace: "pre",
          }}>
            {ex.code}
          </pre>
        </div>
      ))}

      {/* Why it matters */}
      {concept.whyItMatters && (
        <div style={{
          marginTop: 12,
          padding: "12px 16px",
          background: "#3b82f610",
          border: "1px solid #3b82f633",
          borderRadius: 8,
          fontSize: 13, color: "#60a5fa", lineHeight: 1.6,
        }}>
          <span style={{ fontWeight: 700 }}>Why it matters: </span>
          {concept.whyItMatters}
        </div>
      )}

      {/* Common mistake */}
      {concept.commonMistake && (
        <div style={{
          marginTop: 8,
          padding: "12px 16px",
          background: "#ef444410",
          border: "1px solid #ef444433",
          borderRadius: 8,
          fontSize: 13, color: "#f87171", lineHeight: 1.6,
        }}>
          <span style={{ fontWeight: 700 }}>Common mistake: </span>
          {concept.commonMistake}
        </div>
      )}

      {/* Key point callout */}
      {concept.keyPoint && (
        <div style={{
          marginTop: 8,
          padding: "12px 16px",
          background: accentColor + "10",
          border: `1px solid ${accentColor}33`,
          borderRadius: 8,
          fontSize: 13, color: accentColor, lineHeight: 1.6,
        }}>
          <span style={{ fontWeight: 700 }}>Key point: </span>
          {concept.keyPoint}
        </div>
      )}
    </div>
  );
}
