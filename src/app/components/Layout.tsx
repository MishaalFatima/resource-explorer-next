// src/components/Layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "../hooks/useTheme";
import useMounted from "../hooks/useMounted";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Prevent hydration mismatch by waiting for client mount before rendering dynamic UI bits.
  const mounted = useMounted();

  // useTheme throws if ThemeProvider is missing; call inside try/catch to be robust.
  let theme: "dark" | "light" | undefined;
  let toggle: (() => void) | undefined;
  try {
    const th = useTheme();
    theme = th.theme;
    toggle = th.toggle;
  } catch {
    theme = undefined;
    toggle = undefined;
  }

  return (
    <div>
      <header className="app-header" role="banner">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/" className="brand">
            Resource Explorer
          </Link>
          <span className="header-sub">Rick &amp; Morty • Explore characters</span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          <small className="muted">Fast • Search • Favorites</small>

          {toggle ? (
            mounted ? (
              // Render real button only after mount — avoids SSR/CSR mismatch
              <button
                className="theme-toggle"
                onClick={() => toggle && toggle()}
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
            ) : (
              // Neutral placeholder rendered on server / before mount
              <button className="theme-toggle" aria-hidden="true" title="" />
            )
          ) : null}
        </div>
      </header>

      <main className="app-main" role="main">
        {children}
      </main>

      <footer className="app-footer">
        <small>Data from the Rick &amp; Morty API • Demo</small>
      </footer>
    </div>
  );
}
