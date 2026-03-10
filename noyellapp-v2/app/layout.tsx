import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoYell – Discover Your Child's Emotional Type",
  description: "Get expert-backed parenting insights in 3 minutes. Understand your child's emotional patterns and find strategies that actually work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
