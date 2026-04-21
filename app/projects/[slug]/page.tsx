import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, getAdjacentProjects } from "@/lib/projects";
import { TIER_META, Concept, BuildStep } from "@/lib/types";
import BuildChecklist from "@/components/BuildChecklist";
import CodeBlock from "@/components/CodeBlock";
import ProgressBar from "@/components/ProgressBar";
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

      {/* Full-width progress bar — always visible under nav */}
      <ProgressBar
        projectSlug={project.slug}
        mainStepIds={project.steps.filter((s) => !s.isBonus).map((s) => s.id)}
        accentColor={meta.color}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px 0" }}>

        {/* Project header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>
              Project #{String(project.id).padStart(2, "0")}
            </div>
            {project.previewPath && (
              <a
                href={project.previewPath}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12, color: meta.color,
                  background: meta.badge + "22",
                  border: `1px solid ${meta.color}44`,
                  borderRadius: 99, padding: "4px 12px",
                  textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                ▶ See it live
              </a>
            )}
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
        <div className="grid items-start gap-[32px] lg:gap-[48px] lg:[grid-template-columns:minmax(0,1fr)_420px]">

          {/* LEFT — Concepts */}
          <div>
            {/* Project Setup — collapsible, shown only when a lesson exists */}
            {project.setupInfo && (
              <ProjectSetup setupInfo={project.setupInfo} accentColor={meta.color} />
            )}

            <SectionHeading>Concepts</SectionHeading>
            <p style={{ fontSize: 13, color: "var(--subtle)", marginBottom: 28, lineHeight: 1.7 }}>
              Read each concept and its examples first. Then open the Build Guide and work through each step — the concept pills on each step will bring you straight back here if you need a reminder.
            </p>

            {project.concepts.map((concept, i) => (
              <ConceptSection
                key={concept.id}
                concept={concept}
                index={i}
                accentColor={meta.color}
                badgeColor={meta.badge}
                mainSteps={project.steps.filter((s) => !s.isBonus)}
              />
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
                  conceptTitles={Object.fromEntries(project.concepts.map((c) => [c.id, c.title]))}
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

          {nextProject ? (
            <Link href={`/projects/${nextProject.slug}`} style={{
              textDecoration: "none",
              display: "flex", flexDirection: "column", gap: 4,
              padding: "16px 20px",
              background: "var(--surface)",
              border: "1px solid var(--surface-2)",
              borderRadius: 12,
              transition: "border-color 0.15s",
              textAlign: "right",
            }}>
              <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.5px" }}>Next →</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                {String(nextProject.id).padStart(2, "0")} · {nextProject.name}
              </span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                Tier {nextProject.tier} · {TIER_META[nextProject.tier].name}
              </span>
            </Link>
          ) : <div />}
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
  concept, index, accentColor, badgeColor, mainSteps,
}: {
  concept: Concept;
  index: number;
  accentColor: string;
  badgeColor: string;
  mainSteps: BuildStep[];
}) {
  return (
    <div
      id={`concept-${concept.id}`}
      style={{
        marginBottom: 20,
        scrollMarginTop: 80,
        background: "var(--surface)",
        border: "1px solid var(--surface-2)",
        borderLeft: `3px solid ${accentColor}66`,
        borderRadius: 10,
        padding: "24px",
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
          <CodeBlock code={ex.code} />
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

      {/* Footer: used-in-steps + MDN link */}
      {(() => {
        const usedIn = mainSteps
          .map((s, i) => ({ step: s, num: i + 1 }))
          .filter(({ step }) => step.relatedConceptIds?.includes(concept.id));
        return (usedIn.length > 0 || concept.mdnUrl) ? (
          <div style={{
            marginTop: 20, paddingTop: 14,
            borderTop: "1px solid var(--surface-2)",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
          }}>
            {usedIn.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                  Used in
                </span>
                {usedIn.map(({ step, num }) => (
                  <span key={step.id} style={{
                    fontSize: 11, fontWeight: 700,
                    color: accentColor,
                    background: accentColor + "15",
                    border: `1px solid ${accentColor}33`,
                    borderRadius: 99,
                    padding: "2px 9px",
                  }}>
                    Step {String(num).padStart(2, "0")}
                  </span>
                ))}
              </div>
            )}
            {concept.mdnUrl && (
              <a
                href={concept.mdnUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11, color: "var(--muted)", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 4,
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: 1,
                }}
              >
                MDN Reference ↗
              </a>
            )}
          </div>
        ) : null;
      })()}
    </div>
  );
}

function ProjectSetup({ setupInfo, accentColor }: { setupInfo: NonNullable<import("@/lib/types").Project["setupInfo"]>; accentColor: string }) {
  return (
    <details open style={{ marginBottom: 32 }}>
      <summary style={{
        cursor: "pointer", userSelect: "none",
        listStyle: "none", display: "flex", alignItems: "center", gap: 8,
        marginBottom: 0,
      }}>
        <span style={{
          width: 16, height: 16, borderRadius: 4,
          background: accentColor + "22", border: `1px solid ${accentColor}44`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, color: accentColor, flexShrink: 0,
        }}>▶</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
          Project Setup
        </span>
      </summary>

      <div style={{
        marginTop: 14,
        background: "var(--surface)",
        border: "1px solid var(--surface-2)",
        borderLeft: `3px solid ${accentColor}44`,
        borderRadius: 10,
        padding: "20px",
      }}>
        {/* Folder structure */}
        <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
          Your starter files
        </div>
        <pre style={{
          fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--subtle)",
          background: "#0d0d0f", border: "1px solid var(--surface-2)",
          borderRadius: 8, padding: "12px 16px", margin: "0 0 20px", lineHeight: 1.8,
          overflowX: "auto",
        }}>
{`${setupInfo.folder}/\n├── index.html   — HTML structure  (already written)\n├── style.css    — Styling          (already written)\n└── app.js       — Your JavaScript  (write here ←)`}
        </pre>

        {/* Key HTML elements */}
        <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
          Key HTML elements you&apos;ll target
        </div>
        <CodeBlock code={setupInfo.htmlSnippet} />

        {/* JS scaffold */}
        <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", margin: "20px 0 8px" }}>
          What&apos;s already in app.js
        </div>
        <CodeBlock code={setupInfo.jsScaffold} />

        {/* Download CTA */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--surface-2)" }}>
          <a
            href={`/starters/${setupInfo.folder}.zip`}
            download
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 700,
              color: accentColor,
              background: accentColor + "18",
              border: `1px solid ${accentColor}44`,
              borderRadius: 8, padding: "10px 18px",
              textDecoration: "none",
            }}
          >
            ⬇ Download Starter Files
            <span style={{ fontSize: 11, color: accentColor + "99", fontWeight: 400 }}>
              {setupInfo.folder}.zip
            </span>
          </a>
        </div>
      </div>
    </details>
  );
}
