import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import localFont from 'next/font/local';
import './globals.css';

// Keep the same typefaces, but make builds independent of Google Fonts' network.
const inter = localFont({
  src: './fonts/inter-latin.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
});
const bricolage = localFont({
  src: './fonts/bricolage-grotesque-latin.woff2',
  variable: '--font-bricolage',
  weight: '200 800',
  display: 'swap',
});
const jetbrainsMono = localFont({
  src: './fonts/jetbrains-mono-latin.woff2',
  variable: '--font-jetbrains',
  weight: '100 800',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jhon Rey Consolacion',
  jobTitle: 'AI Developer & Automation Builder',
  url: siteUrl,
  email: 'mailto:jhonreyc2001@gmail.com',
  sameAs: ['https://github.com/jhonny8765'],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Jhon Rey Consolacion | AI Developer & Automation Builder',
  description: 'I build with AI — websites, applications, and automations.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Jhon Rey Consolacion | AI Developer & Automation Builder',
    description: 'I build with AI — websites, applications, and automations.',
    url: siteUrl,
    siteName: 'Jhon Rey Consolacion Portfolio',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Ensure you have this image in public/
        width: 1200,
        height: 630,
        alt: 'Jhon Rey Consolacion - AI Developer & Automation Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jhon Rey Consolacion | AI Developer & Automation Builder',
    description: 'I build with AI — websites, applications, and automations.',
    images: ['/og-image.jpg'],
  },
};

import { LenisProvider } from '@/components/LenisProvider';
import { EffectsLayer } from '@/components/EffectsLayer';
import RouteTransition from '@/components/RouteTransition';
import { Toaster } from 'sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} ${jetbrainsMono.variable}`}>
      <body className="isolate">
        {/* Structured data: Person schema for knowledge-panel/card eligibility */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <EffectsLayer />
        <LenisProvider>
          <RouteTransition>
            <NuqsAdapter>{children}</NuqsAdapter>
          </RouteTransition>
        </LenisProvider>
        {/* Toast feedback for contact form + playground (plan 5.5) */}
        <Toaster
          theme="dark"
          richColors
          closeButton
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#090a0f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
