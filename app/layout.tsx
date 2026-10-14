import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beacon Commerce — Orders (Prototype)",
  description:
    "Before/After prototype demonstrating the Preserve → Simplify approach to legacy ERP screens.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
