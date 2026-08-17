import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jhon Rey Consolacion | AI-Powered Full-Stack Developer",
  description: "An all-rounder who knows technology and AI — from websites and SaaS platforms to automation, recruitment, resumes, and virtual assistance.",
};

import DataStreamBackground from "@/components/DataStreamBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <DataStreamBackground />
        {children}
      </body>
    </html>
  );
}
