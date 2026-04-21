"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  previewPath: string;
  accentColor: string;
  badgeColor: string;
}

export default function PreviewModal({ previewPath, accentColor, badgeColor }: Props) {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const modal = open ? createPortal(
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 1100,
          height: "90vh",
          background: "#09090b",
          border: "1px solid var(--surface-2)",
          borderRadius: 14,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Modal toolbar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid var(--surface-2)",
          background: "var(--surface)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Traffic lights decoration */}
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
            <span style={{
              marginLeft: 12,
              fontSize: 11, color: "var(--muted)", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "1px",
            }}>
              Live Preview
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href={previewPath}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11, color: "var(--muted)", textDecoration: "none",
                padding: "4px 10px", borderRadius: 6,
                border: "1px solid var(--surface-2)",
              }}
            >
              Open in tab ↗
            </a>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close preview"
              style={{
                width: 28, height: 28, borderRadius: 6,
                border: "1px solid var(--surface-2)",
                background: "transparent",
                color: "var(--muted)",
                fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* iframe */}
        <iframe
          src={previewPath}
          title="Live preview"
          style={{
            flex: 1,
            width: "100%",
            border: "none",
            background: "#fff",
          }}
        />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          fontSize: 12, color: accentColor,
          background: badgeColor + "22",
          border: `1px solid ${accentColor}44`,
          borderRadius: 99, padding: "4px 12px",
          textDecoration: "none",
          display: "flex", alignItems: "center", gap: 6,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        ▶ See it live
      </button>
      {modal}
    </>
  );
}
