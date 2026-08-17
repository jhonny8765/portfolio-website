import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://noble-planck-blue.vercel.app"),
  title: "Jhon Rey Consolacion | Senior Software Engineer",
  description: "Building high-performance SaaS platforms, enterprise data pipelines, and intelligent automation systems. Specializing in Next.js, Node, and AI.",
  openGraph: {
    title: "Jhon Rey Consolacion | Senior Software Engineer",
    description: "Building high-performance SaaS platforms, enterprise data pipelines, and intelligent automation systems.",
    url: "https://noble-planck-blue.vercel.app",
    siteName: "Jhon Rey Consolacion Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jhon Rey Consolacion - Senior Software Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jhon Rey Consolacion | Senior Software Engineer",
    description: "Building high-performance SaaS platforms, enterprise data pipelines, and intelligent automation systems.",
    images: ["/og-image.jpg"],
  },
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
