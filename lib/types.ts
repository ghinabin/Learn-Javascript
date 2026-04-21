export type ProjectStatus = "locked" | "current" | "done";

export interface CodeExample {
  label?: string;
  code: string;
}

export interface Concept {
  id: string;
  title: string;
  explanation: string;
  examples: CodeExample[];
  keyPoint?: string;
  whyItMatters?: string;
  commonMistake?: string;
  mdnUrl?: string;         // canonical MDN reference link
}

export interface BuildStep {
  id: string;
  title: string;
  hint?: string;
  isBonus?: boolean;
  commonError?: string;
  relatedConceptIds?: string[];  // which concept cards to reference for this step
}

export interface SetupInfo {
  folder: string;          // e.g. "01-color-flipper"
  htmlSnippet: string;     // the key HTML elements the user will target
  jsScaffold: string;      // what's pre-written in the JS starter file
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  tier: number;
  tierName: string;
  tagline: string;
  previewPath?: string;
  concepts: Concept[];
  steps: BuildStep[];
  hasLesson: boolean;
  setupInfo?: SetupInfo;
}

export const TIER_META: Record<number, { name: string; color: string; bg: string; badge: string }> = {
  1: { name: "Fundamentals",   color: "#22c55e", bg: "#0d1f12", badge: "#15803d" },
  2: { name: "Data & Storage", color: "#3b82f6", bg: "#0f172a", badge: "#1d4ed8" },
  3: { name: "Async & APIs",   color: "#a855f7", bg: "#1a0f2e", badge: "#7e22ce" },
  4: { name: "Intermediate",   color: "#f59e0b", bg: "#1f1305", badge: "#b45309" },
  5: { name: "Advanced",       color: "#ef4444", bg: "#1f0505", badge: "#b91c1c" },
  6: { name: "Capstone",       color: "#e2e8f0", bg: "#0f1419", badge: "#475569" },
};
