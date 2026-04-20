"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "var(--surface-2)", animation: "pulse 1.5s infinite",
      }} />
    );
  }

  if (session?.user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name ?? "avatar"}
            style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--surface-2)" }}
          />
        )}
        <span style={{ fontSize: 12, color: "var(--subtle)" }}>
          {session.user.name}
        </span>
        <button
          onClick={() => signOut()}
          style={{
            fontSize: 11, color: "var(--muted)", background: "none",
            border: "1px solid var(--surface-2)", borderRadius: 99,
            padding: "4px 10px", cursor: "pointer", fontFamily: "var(--font-mono)",
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      style={{
        fontSize: 11, fontWeight: 700, color: "#09090b",
        background: "var(--bright)", border: "none",
        borderRadius: 99, padding: "6px 14px",
        cursor: "pointer", fontFamily: "var(--font-mono)",
        display: "flex", alignItems: "center", gap: 6,
        transition: "opacity 0.15s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
    >
      <GitHubIcon />
      Sign in with GitHub
    </button>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
