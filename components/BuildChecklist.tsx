"use client";

import { useState, useEffect } from "react";
import { BuildStep } from "@/lib/types";

interface Props {
  projectSlug: string;
  steps: BuildStep[];
}

export default function BuildChecklist({ projectSlug, steps }: Props) {
  const storageKey = `checklist-${projectSlug}`;
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setDone(new Set(JSON.parse(saved)));
    } catch {}
  }, [storageKey]);

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  const mainSteps = steps.filter((s) => !s.isBonus);
  const bonusSteps = steps.filter((s) => s.isBonus);
  const completed = mainSteps.filter((s) => done.has(s.id)).length;
  const pct = mainSteps.length ? Math.round((completed / mainSteps.length) * 100) : 0;

  return (
    <div>
      {/* Progress header */}
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "var(--subtle)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
          Build Checklist
        </span>
        <span style={{ fontSize: 12, color: "var(--subtle)" }}>
          {completed}/{mainSteps.length} steps · {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 99, marginBottom: 20, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, #22c55e, #3b82f6)",
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>

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
          marginTop: 20, padding: "16px 20px",
          background: "#22c55e10", border: "1px solid #22c55e33",
          borderRadius: 12, textAlign: "center",
        }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>🎉</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#4ade80" }}>Project Complete!</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            Head back to the dashboard and unlock Project 02.
          </div>
        </div>
      )}
    </div>
  );
}
