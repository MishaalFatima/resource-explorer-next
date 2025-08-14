// src/app/layout.tsx
import "./globals.css";
import React from "react";
import Providers from "./providers";

export const metadata = {
  title: "Resource Explorer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
