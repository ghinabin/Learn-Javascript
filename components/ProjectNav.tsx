"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Props {
  projectId: number;
  projectName: string;
  tierNumber: number;
  tierName: string;
  tierColor: string;
  tierBadge: string;
  children: React.ReactNode; // AuthButton slot
}

export default function ProjectNav({
  projectId, projectName, tierNumber, tierName, tierColor, tierBadge, children,
}: Props) {
  const [titleHidden, setTitleHidden] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("title-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setTitleHidden(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <nav style={{
      borderBottom: "1px solid var(--surface-2)",
      position: "sticky", top: 0, zIndex: 10,
      background: "var(--bg)",
      backdropFilter: "blur(8px)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "14px 40px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/" style={{
          fontSize: 12, color: "var(--muted)", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 6,
          flexShrink: 0,
        }}>
          ← Dashboard
        </Link>

        <span style={{ color: "var(--surface-2)", flexShrink: 0 }}>|</span>

        <span style={{
          fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px",
          color: tierColor, background: tierBadge + "33", padding: "2px 8px", borderRadius: 99,
          flexShrink: 0,
        }}>
          Tier {tierNumber} · {tierName}
        </span>

        {/* Project identity — slides in when title scrolls under header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          opacity: titleHidden ? 1 : 0,
          transform: titleHidden ? "translateY(0)" : "translateY(5px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          pointerEvents: titleHidden ? "auto" : "none",
          overflow: "hidden",
          minWidth: 0,
        }}>
          <span style={{ color: "var(--surface-2)", flexShrink: 0 }}>|</span>
          <span style={{
            fontSize: 11, color: "var(--muted)", fontWeight: 600, flexShrink: 0,
            fontFamily: "var(--font-mono)",
          }}>
            #{String(projectId).padStart(2, "0")}
          </span>
          <span style={{
            fontSize: 13, fontWeight: 700, color: "var(--text)",
            fontFamily: "var(--font-sans)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {projectName}
          </span>
        </div>

        <div style={{ marginLeft: "auto", flexShrink: 0 }}>
          {children}
        </div>
      </div>
    </nav>
  );
}
