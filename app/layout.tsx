import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mizumi Chat Starter",
  description: "Minimal Next.js chat app powered by Mizumi (OpenAI-compatible API)",
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
