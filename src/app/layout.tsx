import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap', adjustFontFallback: true, preload: true });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Jhon Rey Consolacion | AI Developer & Automation Builder",
  description: "I build with AI — websites, applications, and automations.",
  openGraph: {
    title: "Jhon Rey Consolacion | AI Developer & Automation Builder",
    description: "I build with AI — websites, applications, and automations.",
    url: siteUrl,
    siteName: "Jhon Rey Consolacion Portfolio",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Ensure you have this image in public/
        width: 1200,
        height: 630,
        alt: "Jhon Rey Consolacion - AI Developer & Automation Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jhon Rey Consolacion | AI Developer & Automation Builder",
    description: "I build with AI — websites, applications, and automations.",
    images: ["/og-image.jpg"],
  },
};

import { LenisProvider } from '@/components/LenisProvider';
import { CustomCursor } from '@/components/CustomCursor';
import Preloader from '@/components/Preloader';
import RouteTransition from '@/components/RouteTransition';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[var(--z-skiplink)] px-4 py-2 bg-[var(--color-volt)] text-[var(--color-bg)] rounded-md font-medium">
          Skip to main content
        </a>
        <Preloader />
        <LenisProvider>
          <CustomCursor />
          {/* Global Page Transition Overlay */}
          <div 
            id="page-transition-overlay"
            className="fixed inset-0 bg-[var(--color-volt)] z-[var(--z-preloader)] pointer-events-none translate-y-full"
            aria-hidden="true"
          ></div>
          <RouteTransition />
          {children}
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
