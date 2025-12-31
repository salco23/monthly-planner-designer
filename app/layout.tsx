import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monthly Planner Builder",
  description: "A printable monthly wall planner (row-per-day) with adjustable column widths and paper presets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
