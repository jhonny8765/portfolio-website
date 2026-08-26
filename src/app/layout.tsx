import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-[var(--color-violet)] text-white rounded-md font-medium">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
