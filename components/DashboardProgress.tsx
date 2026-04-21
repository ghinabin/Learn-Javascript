"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { TIER_META } from "@/lib/types";

const TIERS = [1, 2, 3, 4, 5, 6];

const TIER_DESC: Record<number, string> = {
  1: "Variables, functions, DOM, events — pure JavaScript, zero libraries.",
  2: "Arrays, objects, localStorage — data that persists between sessions.",
  3: "fetch(), Promises, async/await — real APIs and live data.",
  4: "Algorithms, patterns, and larger multi-feature apps.",
  5: "Classes, modules, and professional-grade architecture.",
  6: "Full-scale capstone projects that combine everything.",
};

export default function DashboardProgress() {
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const slugs = new Set<string>();
    PROJECTS.forEach((p) => {
      try {
        const saved = localStorage.getItem(`checklist-${p.slug}`);
        if (!saved) return;
        const done: string[] = JSON.parse(saved);
        const mainSteps = p.steps.filter((s) => !s.isBonus);
        if (mainSteps.length > 0 && mainSteps.every((s) => done.includes(s.id))) {
          slugs.add(p.slug);
        }
      } catch {}
    });
    setCompletedSlugs(slugs);
    setMounted(true);
  }, []);

  const completed = completedSlugs.size;
  const total = PROJECTS.length;
  const pct = Math.round((completed / total) * 100);
  const isNewUser = mounted && completed === 0;

  const nextUp = mounted ? PROJECTS.find((p) => {
    const prev = PROJECTS.find((x) => x.id === p.id - 1);
    const prevDone = p.id === 1 || (prev ? completedSlugs.has(prev.slug) : false);
    return prevDone && p.hasLesson && !completedSlugs.has(p.slug);
  }) : null;

  return (
    <div>

      {/* ── CTA / Progress bar ───────────────────────────── */}
      {!mounted ? (
        <div style={{ height: 80, marginBottom: 48 }} />
      ) : isNewUser ? (

        /* New user — minimal start CTA */
        <div style={{
          marginBottom: 40,
          padding: "14px 20px",
          background: "var(--surface)",
          border: "1px solid #22c55e44",
          borderLeft: "3px solid #22c55e",
          borderRadius: 10,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bright)", fontFamily: "var(--font-sans)" }}>
              Start with Project 01 — Color Flipper
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
              Learn variables, arrays, functions, and the DOM by building something real.
            </div>
          </div>
          <Link href="/projects/color-flipper" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 700,
            color: "#09090b", background: "#22c55e",
            borderRadius: 7, padding: "8px 16px",
            textDecoration: "none", whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            Start →
          </Link>
        </div>

      ) : (

        /* Returning user — progress bar with continue link */
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "baseline", marginBottom: 10,
          }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-sans)" }}>
                {completed} of {total} projects complete
              </span>
              <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>
                · {pct}%
              </span>
            </div>
            {nextUp && (
              <Link href={`/projects/${nextUp.slug}`} style={{
                fontSize: 12, fontWeight: 600,
                color: "#22c55e", textDecoration: "none",
              }}>
                Continue: {nextUp.name} →
              </Link>
            )}
          </div>
          <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: "linear-gradient(90deg, #22c55e, #3b82f6, #a855f7, #f59e0b, #ef4444)",
              borderRadius: 99, transition: "width 0.6s ease",
            }} />
          </div>
        </div>
      )}

      {/* ── Tier groups ──────────────────────────────────── */}
      {TIERS.map((tier, tierIndex) => {
        const meta = TIER_META[tier];
        const projects = PROJECTS.filter((p) => p.tier === tier);
        const tierDone = projects.filter((p) => completedSlugs.has(p.slug)).length;

        const projectStates = projects.map((p) => {
          const isDone = completedSlugs.has(p.slug);
          const prev = PROJECTS.find((x) => x.id === p.id - 1);
          const prevDone = p.id === 1 || (prev ? completedSlugs.has(prev.slug) : false);
          const isLocked = !prevDone && !isDone;
          const isComingSoon = prevDone && !p.hasLesson && !isDone;
          const isActive = prevDone && p.hasLesson && !isDone;
          const isClickable = isDone || isActive;
          return { p, isDone, isLocked, isComingSoon, isActive, isClickable };
        });

        return (
          <div key={tier} style={{
            marginBottom: 0,
            paddingTop: tierIndex === 0 ? 0 : 40,
            borderTop: tierIndex === 0 ? "none" : "1px solid var(--surface-2)",
          }}>

            {/* Tier header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>

                {/* Tier badge */}
                <span style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "1.5px", color: meta.color,
                  background: meta.badge + "33", padding: "3px 10px", borderRadius: 99,
                  flexShrink: 0,
                }}>
                  Tier {tier}
                </span>

                {/* Tier name — primary label */}
                <span style={{
                  fontSize: 15, fontWeight: 700, color: meta.color,
                  fontFamily: "var(--font-sans)",
                }}>
                  {meta.name}
                </span>

                {/* Completion count — secondary, right-aligned */}
                <span style={{
                  fontSize: 11, color: "var(--muted)",
                  marginLeft: "auto", fontVariantNumeric: "tabular-nums",
                }}>
                  {tierDone}/{projects.length}
                </span>
              </div>

              {/* Tier description — clearly below the name */}
              <p style={{
                fontSize: 12, color: "var(--subtle)",
                margin: 0, lineHeight: 1.6,
              }}>
                {TIER_DESC[tier]}
              </p>
            </div>

            {/* Card grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
              marginBottom: 40,
            }}>
              {projectStates.map(({ p, isDone, isLocked, isComingSoon, isActive, isClickable }) => {
                const card = (
                  <div style={{
                    position: "relative",
                    background: isDone ? meta.bg : isActive ? meta.bg : "var(--surface)",
                    border: `1px solid ${isDone ? meta.color + "88" : isActive ? meta.color : "var(--surface-2)"}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    cursor: isClickable ? "pointer" : "default",
                    opacity: isLocked ? 0.3 : isComingSoon ? 0.55 : 1,
                    transition: "transform 0.15s, box-shadow 0.15s",
                    height: "100%",
                    outline: "none",
                  }}
                    onMouseEnter={(e) => {
                      if (!isClickable) return;
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${meta.color}22`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                    onFocus={(e) => {
                      if (!isClickable) return;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 2px ${meta.color}66`;
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Active top accent bar */}
                    {isActive && (
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 2,
                        background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`,
                        borderRadius: "10px 10px 0 0",
                      }} />
                    )}

                    {/* Emoji + project number */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 14 }}>
                        {isDone ? "✅" : isActive ? "▶️" : isComingSoon ? "🔜" : "🔒"}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                        #{String(p.id).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Project name — primary card text */}
                    <div style={{
                      fontSize: 14, fontWeight: 700, lineHeight: 1.3,
                      fontFamily: "var(--font-sans)",
                      color: isDone ? meta.color : isActive ? "var(--bright)" : "var(--subtle)",
                      marginBottom: 6,
                    }}>
                      {p.name}
                    </div>

                    {/* Tagline — shown on all cards */}
                    <div className="line-clamp-2" style={{
                      fontSize: 11, color: "var(--muted)", lineHeight: 1.5,
                    }}>
                      {p.tagline}
                    </div>

                    {/* Status label — all states */}
                    <div style={{
                      marginTop: 10,
                      fontSize: 11, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.8px",
                      color: isDone ? meta.color : isActive ? meta.color : isComingSoon ? "var(--border)" : "var(--muted)",
                    }}>
                      {isDone ? "Done ✓" : isActive ? "Start →" : isComingSoon ? "Lesson coming soon" : "Locked"}
                    </div>
                  </div>
                );

                return isClickable ? (
                  <Link key={p.id} href={`/projects/${p.slug}`} style={{ textDecoration: "none" }}>
                    {card}
                  </Link>
                ) : (
                  <div key={p.id}>{card}</div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
