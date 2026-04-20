"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { BuildStep } from "@/lib/types";

interface NextProjectInfo {
  slug: string;
  name: string;
  id: number;
}

interface Props {
  projectSlug: string;
  steps: BuildStep[];
  nextProject?: NextProjectInfo | null;
}

export default function BuildChecklist({ projectSlug, steps, nextProject }: Props) {
  const storageKey = `checklist-${projectSlug}`;
  const { data: session } = useSession();
  const isAuthed = !!session?.user;

  const [done, setDone] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);

  // Load: DB when signed in, localStorage when not
  useEffect(() => {
    if (isAuthed) {
      fetch(`/api/progress?slug=${projectSlug}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data.completedSteps)) {
            setDone(new Set(data.completedSteps));
          }
        })
        .catch(() => {});
    } else {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) setDone(new Set(JSON.parse(saved)));
      } catch {}
    }
  }, [isAuthed, projectSlug, storageKey]);

  // Save to DB (debounced via useCallback)
  const syncToDB = useCallback(
    (steps: string[]) => {
      setSyncing(true);
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: projectSlug, completedSteps: steps }),
      })
        .catch(() => {})
        .finally(() => setSyncing(false));
    },
    [projectSlug]
  );

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      const arr = [...next];
      // Always keep localStorage as offline fallback
      try { localStorage.setItem(storageKey, JSON.stringify(arr)); } catch {}
      // Sync to DB when signed in
      if (isAuthed) syncToDB(arr);
      return next;
    });
  }

  const mainSteps = steps.filter((s) => !s.isBonus);
  const bonusSteps = steps.filter((s) => s.isBonus);
  const completed = mainSteps.filter((s) => done.has(s.id)).length;
  const pct = mainSteps.length ? Math.round((completed / mainSteps.length) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>

      {/* Sticky header — progress title + bar */}
      <div style={{ padding: "20px 20px 16px", flexShrink: 0, borderBottom: "1px solid var(--surface-2)" }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: "var(--subtle)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
            Build Checklist
          </span>
          <span style={{ fontSize: 12, color: "var(--subtle)", display: "flex", alignItems: "center", gap: 6 }}>
            {syncing && (
              <span style={{ fontSize: 10, color: "var(--muted)" }}>saving…</span>
            )}
            {isAuthed && !syncing && (
              <span style={{ fontSize: 10, color: "#22c55e66" }}>☁ synced</span>
            )}
            {completed}/{mainSteps.length} · {pct}%
          </span>
        </div>

      </div>

      {/* Scrollable checklist body */}
      <div style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: "16px 20px 20px" }}>

      {/* Main steps */}
      <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {mainSteps.map((step, i) => {
          const checked = done.has(step.id);
          return (
            <li key={step.id}>
              <button
                onClick={() => toggle(step.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  background: checked ? "#22c55e0d" : "var(--surface)",
                  border: `1px solid ${checked ? "#22c55e33" : "var(--surface-2)"}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                {/* Checkbox */}
                <span style={{
                  flexShrink: 0,
                  width: 22, height: 22,
                  borderRadius: 6,
                  border: `2px solid ${checked ? "#22c55e" : "var(--border)"}`,
                  background: checked ? "#22c55e" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, color: "#09090b",
                  transition: "all 0.15s",
                  marginTop: 1,
                }}>
                  {checked && "✓"}
                </span>

                <div style={{ flex: 1 }}>
                  {/* Step number + title */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, flexShrink: 0 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{
                      fontSize: 13, fontWeight: 500,
                      color: checked ? "var(--muted)" : "var(--text)",
                      textDecoration: checked ? "line-through" : "none",
                      lineHeight: 1.5,
                    }}>
                      {step.title}
                    </span>
                  </div>

                  {/* Hint */}
                  {step.hint && !checked && (
                    <div style={{
                      marginTop: 6, fontSize: 12,
                      color: "var(--muted)", lineHeight: 1.6,
                      fontFamily: "var(--font-mono)",
                    }}>
                      💡 {step.hint}
                    </div>
                  )}
                  {/* Common error */}
                  {step.commonError && !checked && (
                    <div style={{
                      marginTop: 4, fontSize: 12,
                      color: "#f87171", lineHeight: 1.6,
                    }}>
                      ⚠ {step.commonError}
                    </div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Bonus steps */}
      {bonusSteps.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontSize: 11, color: "#facc15", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10,
          }}>
            ⚡ Bonus Challenges
          </div>
          <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {bonusSteps.map((step) => {
              const checked = done.has(step.id);
              return (
                <li key={step.id}>
                  <button
                    onClick={() => toggle(step.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      background: checked ? "#facc150d" : "var(--surface)",
                      border: `1px solid ${checked ? "#facc1533" : "var(--surface-2)"}`,
                      borderRadius: 10,
                      padding: "12px 16px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{
                      flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                      border: `2px solid ${checked ? "#facc15" : "var(--border)"}`,
                      background: checked ? "#facc15" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, color: "#09090b", transition: "all 0.15s", marginTop: 1,
                    }}>
                      {checked && "✓"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontSize: 13, color: checked ? "var(--muted)" : "#fafafa",
                        textDecoration: checked ? "line-through" : "none", lineHeight: 1.5,
                      }}>
                        {step.title}
                      </span>
                      {step.hint && !checked && (
                        <div style={{ marginTop: 4, fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                          💡 {step.hint}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* All done message */}
      {pct === 100 && (
        <div style={{
          marginTop: 20, padding: "20px",
          background: "#22c55e10", border: "1px solid #22c55e33",
          borderRadius: 12, textAlign: "center",
        }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>🎉</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#4ade80" }}>Project Complete!</div>
          {nextProject ? (
            <>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, marginBottom: 14 }}>
                Ready for the next challenge?
              </div>
              <a
                href={`/projects/${nextProject.slug}`}
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  background: "#22c55e",
                  color: "#09090b",
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: 8,
                  textDecoration: "none",
                  letterSpacing: "0.2px",
                }}
              >
                Next: {String(nextProject.id).padStart(2, "0")} · {nextProject.name} →
              </a>
            </>
          ) : (
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              You&apos;ve completed all projects. Back to the{" "}
              <a href="/" style={{ color: "#4ade80" }}>dashboard</a>.
            </div>
          )}
        </div>
      )}

      </div>{/* end scrollable body */}
    </div>
  );
}
