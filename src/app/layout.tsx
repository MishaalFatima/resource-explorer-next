// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Resource Explorer",
  description: "Explore Rick & Morty characters",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
