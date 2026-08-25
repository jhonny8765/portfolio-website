import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AmbientBackground from "@/components/AmbientBackground";
import AskMyAI from "@/components/AskMyAI";
import CommandPalette from "@/components/CommandPalette";
import SnakeGame from "@/components/SnakeGame";
import { SITE } from "@/lib/content";

/* Self-hosted variable fonts (from Fontsource) — no runtime request to
   Google, no privacy leak, preloaded with font-display: swap. */
const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} | ${SITE.role}`,
  description:
    "I turn ideas into working digital products — websites, applications, and business automations, built with AI. Two live products and counting.",
  keywords: [
    "AI developer",
    "automation builder",
    "Next.js developer Philippines",
    "n8n automation",
    "freelance web developer",
  ],
  authors: [{ name: SITE.name, url: SITE.github }],
  openGraph: {
    title: `${SITE.name} | ${SITE.role}`,
    description:
      "Websites, applications, and automations — built with AI. Two live products and counting.",
    url: SITE.url,
    siteName: `${SITE.name} — Portfolio`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.role}`,
    description:
      "Websites, applications, and automations — built with AI. Two live products and counting.",
  },
};

export const viewport: Viewport = {
  themeColor: "#090a0f",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  jobTitle: SITE.role,
  address: { "@type": "PostalAddress", addressCountry: "PH" },
  sameAs: [SITE.github],
  knowsAbout: [
    "AI-assisted development",
    "n8n automation",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Supabase",
    "Firebase",
  ],
};

// Progressive enhancement gate for the reveal system (see globals.css).
const jsGate = `document.documentElement.setAttribute("data-js","true");`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: jsGate }} />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AmbientBackground />
        {children}
        <AskMyAI />
        <CommandPalette />
        <SnakeGame />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
