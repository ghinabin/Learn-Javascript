"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
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
  conceptTitles?: Record<string, string>;
  solutionPath?: string;
}

interface PopoverState {
  stepId: string;
  hint: string;
  buttonEl: HTMLButtonElement;
}

function HintPopoverPortal({ popover }: { popover: PopoverState }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function updatePos() {
      const rect = popover.buttonEl.getBoundingClientRect();
      setPos({ x: rect.right, y: rect.top - 8 });
    }
    updatePos();
    // capture:true catches scroll from any scrollable ancestor, not just window
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [popover.buttonEl]);

  if (!pos) return null;

  const top = Math.max(8, pos.y - 8);

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        right: `calc(100vw - ${pos.x}px)`,
        top,
        width: 260,
        background: "#0e0c01",
        border: "1px solid #facc1530",
        borderRadius: 10,
        padding: "12px 14px",
        fontSize: 12,
        color: "var(--subtle)",
        lineHeight: 1.75,
        fontFamily: "var(--font-mono)",
        zIndex: 9999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        transform: "translateY(-100%)",
      }}
    >
      <div style={{
        fontSize: 10, fontWeight: 700, color: "#facc15",
        marginBottom: 6, letterSpacing: "0.5px", textTransform: "uppercase",
      }}>
        💡 Hint
      </div>
      {popover.hint}
    </div>,
    document.body
  );
}

function BulbButton({
  stepId,
  hint,
  isOpen,
  onToggle,
}: {
  stepId: string;
  hint: string;
  isOpen: boolean;
  onToggle: (stepId: string, hint: string, el: HTMLButtonElement) => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={btnRef}
      onClick={(e) => {
        e.stopPropagation();
        if (btnRef.current) onToggle(stepId, hint, btnRef.current);
      }}
      aria-label={isOpen ? "Hide hint" : "Show hint"}
      style={{
        flexShrink: 0,
        alignSelf: "center",
        width: 28, height: 28,
        borderRadius: 6,
        border: `1px solid ${isOpen ? "#facc1550" : "transparent"}`,
        background: isOpen ? "#facc1512" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14,
        cursor: "pointer",
        transition: "all 0.15s",
        opacity: isOpen ? 1 : 0.45,
      }}
    >
      💡
    </button>
  );
}

export default function BuildChecklist({ projectSlug, steps, nextProject, conceptTitles = {}, solutionPath }: Props) {
  const storageKey = `checklist-${projectSlug}`;
  const { data: session } = useSession();
  const isAuthed = !!session?.user;

  const [done, setDone] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [solutionConfirmed, setSolutionConfirmed] = useState(false);

  // Close popover on outside click
  useEffect(() => {
    if (!popover) return;
    function handleOutside() { setPopover(null); }
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, [popover]);

  // Auto-close when the bulb button scrolls out of view
  useEffect(() => {
    if (!popover) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) setPopover(null); },
      { threshold: 0 }
    );
    observer.observe(popover.buttonEl);
    return () => observer.disconnect();
  }, [popover]);

  // Load progress
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
    setPopover(null);
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      const arr = [...next];
      try { localStorage.setItem(storageKey, JSON.stringify(arr)); } catch {}
      if (isAuthed) syncToDB(arr);
      return next;
    });
    // Dispatch outside the updater — firing inside caused setState-during-render
    window.dispatchEvent(new CustomEvent("progress-update"));
  }

  function handleBulbToggle(stepId: string, hint: string, el: HTMLButtonElement) {
    setPopover((prev) => prev?.stepId === stepId ? null : { stepId, hint, buttonEl: el });
  }

  const mainSteps = steps.filter((s) => !s.isBonus);
  const bonusSteps = steps.filter((s) => s.isBonus);
  const completed = mainSteps.filter((s) => done.has(s.id)).length;
  const pct = mainSteps.length ? Math.round((completed / mainSteps.length) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>

      {/* Sticky header */}
      <div style={{ padding: "20px 20px 16px", flexShrink: 0, borderBottom: "1px solid var(--surface-2)" }}>
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: "var(--subtle)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
            Build Guide
          </span>
          <span style={{ fontSize: 12, color: "var(--subtle)", display: "flex", alignItems: "center", gap: 6 }}>
            {syncing && <span style={{ fontSize: 10, color: "var(--muted)" }}>saving…</span>}
            {isAuthed && !syncing && <span style={{ fontSize: 10, color: "#22c55e66" }}>☁ synced</span>}
            {completed}/{mainSteps.length} · {pct}%
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: "16px 20px 20px" }}>

        {/* Main steps */}
        <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {mainSteps.map((step, i) => {
            const checked = done.has(step.id);
            const isHintOpen = popover?.stepId === step.id;
            return (
              <li key={step.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggle(step.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(step.id); } }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    background: checked ? "#22c55e18" : "var(--surface)",
                    border: `1px solid ${checked ? "#22c55e55" : "var(--surface-2)"}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s, border-color 0.15s",
                    userSelect: "none",
                  }}
                >
                  <span style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                    border: `2px solid ${checked ? "#22c55e" : "var(--border)"}`,
                    background: checked ? "#22c55e" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: "#09090b", transition: "all 0.15s", marginTop: 1,
                  }}>
                    {checked && "✓"}
                  </span>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "var(--subtle)", fontWeight: 600, flexShrink: 0 }}>
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

                    {step.commonError && !checked && (
                      <div style={{ marginTop: 4, fontSize: 12, color: "#f87171", lineHeight: 1.6 }}>
                        ⚠ {step.commonError}
                      </div>
                    )}

                    {!checked && step.relatedConceptIds && step.relatedConceptIds.length > 0 && (
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
                        {step.relatedConceptIds.map((cid) => {
                          const title = conceptTitles[cid];
                          if (!title) return null;
                          return (
                            <a
                              key={cid}
                              href={`#concept-${cid}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                fontSize: 10, fontWeight: 600,
                                color: "var(--muted)",
                                background: "var(--bg)",
                                border: "1px solid var(--border)",
                                borderRadius: 99,
                                padding: "2px 8px",
                                textDecoration: "none",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              ↑ {title.split("—")[0].trim()}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {step.hint && !checked && (
                    <BulbButton stepId={step.id} hint={step.hint} isOpen={isHintOpen} onToggle={handleBulbToggle} />
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Bonus steps */}
        {bonusSteps.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ color: "#facc15" }}>⚡ Bonus Challenges</span>
              <span style={{ color: "var(--muted)", fontWeight: 400 }}>
                {bonusSteps.filter(s => done.has(s.id)).length}/{bonusSteps.length}
              </span>
            </div>
            <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {bonusSteps.map((step) => {
                const checked = done.has(step.id);
                const isHintOpen = popover?.stepId === step.id;
                return (
                  <li key={step.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(step.id)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(step.id); } }}
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
                        transition: "background 0.15s, border-color 0.15s",
                        userSelect: "none",
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
                      </div>
                      {step.hint && !checked && (
                        <BulbButton stepId={step.id} hint={step.hint} isOpen={isHintOpen} onToggle={handleBulbToggle} />
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Compare Your Solution */}
        {solutionPath && (
          <div style={{ marginTop: 24 }}>
            {!solutionOpen ? (
              <button
                onClick={() => setSolutionOpen(true)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "1px dashed var(--border)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "var(--muted)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span>Compare your solution</span>
                <span style={{ fontSize: 10, opacity: 0.5 }}>↓</span>
              </button>
            ) : !solutionConfirmed ? (
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--surface-2)",
                borderRadius: 10,
                padding: "16px",
              }}>
                <div style={{ fontSize: 12, color: "var(--subtle)", lineHeight: 1.7, marginBottom: 12 }}>
                  Try the hints first — they&apos;re there for a reason. The solution is most useful after you&apos;ve attempted each step yourself.
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setSolutionConfirmed(true)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12, fontWeight: 600,
                      color: "var(--subtle)",
                      cursor: "pointer",
                    }}
                  >
                    Show reference implementation
                  </button>
                  <button
                    onClick={() => setSolutionOpen(false)}
                    style={{
                      padding: "8px 12px",
                      background: "transparent",
                      border: "none",
                      fontSize: 12,
                      color: "var(--muted)",
                      cursor: "pointer",
                    }}
                  >
                    Go back
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--surface-2)",
                borderRadius: 10,
                padding: "16px",
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: "var(--muted)",
                  textTransform: "uppercase", letterSpacing: "1px",
                  marginBottom: 8,
                }}>
                  Reference Implementation
                </div>
                <div style={{ fontSize: 12, color: "var(--subtle)", lineHeight: 1.6, marginBottom: 14 }}>
                  This is one way to write it. Yours might look different — that&apos;s fine. Compare patterns, not syntax.
                </div>
                <a
                  href={solutionPath}
                  download
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 12, fontWeight: 700,
                    color: "var(--subtle)",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 8, padding: "9px 14px",
                    textDecoration: "none",
                  }}
                >
                  ⬇ Download solution
                </a>
              </div>
            )}
          </div>
        )}

        {/* All done */}
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

      </div>

      {/* Portal popover — rendered at body, tracks button position through scroll */}
      {popover && <HintPopoverPortal popover={popover} />}
    </div>
  );
}
