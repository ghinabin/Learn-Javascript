"use client";

import { useState, useEffect } from "react";

interface Props {
  projectSlug: string;
  mainStepIds: string[];
  accentColor: string;
}

export default function ProgressBar({ projectSlug, mainStepIds, accentColor }: Props) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const storageKey = `checklist-${projectSlug}`;

    function compute() {
      try {
        const saved = localStorage.getItem(storageKey);
        const done: string[] = saved ? JSON.parse(saved) : [];
        const completed = mainStepIds.filter((id) => done.includes(id)).length;
        setPct(mainStepIds.length ? Math.round((completed / mainStepIds.length) * 100) : 0);
      } catch {}
    }

    compute();
    window.addEventListener("progress-update", compute);
    return () => window.removeEventListener("progress-update", compute);
  }, [projectSlug, mainStepIds]);

  return (
    <div style={{ height: 3, background: "var(--surface-2)" }}>
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: pct === 100 ? "#22c55e" : accentColor,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}
