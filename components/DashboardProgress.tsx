"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { TIER_META } from "@/lib/types";

const TIERS = [1, 2, 3, 4, 5, 6];

export default function DashboardProgress() {
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());

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
  }, []);

  const completed = completedSlugs.size;
  const total = PROJECTS.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div>
      {/* Progress bar */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--subtle)", marginBottom: 8 }}>
          <span>{completed} / {total} projects complete</span>
          <span>{pct}%</span>
        </div>
        <div style={{ height: 8, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, #22c55e, #3b82f6, #a855f7, #f59e0b, #ef4444)",
            borderRadius: 99,
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* Tier groups */}
      {TIERS.map((tier) => {
        const meta = TIER_META[tier];
        const projects = PROJECTS.filter((p) => p.tier === tier);
        const tierDone = projects.filter((p) => completedSlugs.has(p.slug)).length;

        return (
          <div key={tier} style={{ marginBottom: 28 }}>
            {/* Tier header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px",
                color: meta.color, background: meta.badge + "33", padding: "3px 10px", borderRadius: 99,
              }}>
                Tier {tier}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: meta.color, fontFamily: "var(--font-sans)" }}>
                {meta.name}
              </span>
              <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: "auto" }}>
                {tierDone}/{projects.length}
              </span>
            </div>

            {/* Cards grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: 10,
            }}>
              {projects.map((p) => {
                const isDone = completedSlugs.has(p.slug);
                const isCurrent = p.id === 1 && !isDone && completed === 0;
                const isLocked = !p.hasLesson && !isDone;

                return (
                  <Link
                    key={p.id}
                    href={p.hasLesson ? `/projects/${p.slug}` : "#"}
                    style={{ textDecoration: "none" }}
                  >
                    <div style={{
                      position: "relative",
                      background: isDone ? meta.bg : isCurrent ? meta.bg : "var(--surface)",
                      border: `1px solid ${isDone ? meta.color + "88" : isCurrent ? meta.color : "var(--surface-2)"}`,
                      borderRadius: 10,
                      padding: "14px 16px",
                      cursor: p.hasLesson ? "pointer" : "default",
                      opacity: isLocked ? 0.45 : 1,
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                      onMouseEnter={(e) => {
                        if (p.hasLesson) {
                          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${meta.color}22`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      }}
                    >
                      {/* Top accent bar for current */}
                      {isCurrent && (
                        <div style={{
                          position: "absolute", top: 0, left: 0, right: 0, height: 2,
                          background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`,
                          borderRadius: "10px 10px 0 0",
                        }} />
                      )}

                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 14 }}>
                          {isDone ? "✅" : isCurrent ? "▶️" : "🔒"}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>
                          #{String(p.id).padStart(2, "0")}
                        </span>
                      </div>

                      <div style={{
                        fontSize: 14, fontWeight: 600, lineHeight: 1.3,
                        fontFamily: "var(--font-sans)",
                        color: isDone ? meta.color : isCurrent ? "#fafafa" : "var(--subtle)",
                      }}>
                        {p.name}
                      </div>

                      {p.hasLesson && (
                        <div style={{
                          marginTop: 8, fontSize: 10, fontWeight: 700, color: meta.color,
                          textTransform: "uppercase", letterSpacing: "1px",
                        }}>
                          {isDone ? "Done ✓" : isCurrent ? "Start →" : "Open →"}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
