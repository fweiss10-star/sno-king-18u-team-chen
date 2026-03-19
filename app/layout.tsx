import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2025 - 26 Sno-King 18U Team Chen Stats",
  description: "Sno-King 18U Team Chen stats dashboard for players, parents, and coaches.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
