import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Home, FolderGit2, FlaskConical, Mail, TriangleAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Route Not Found | Jhon Rey Consolacion',
  robots: { index: false, follow: false },
};

const suggestions = [
  { href: '/', label: 'cd ~', note: 'back to home', icon: Home },
  { href: '/#projects', label: 'ls ~/projects', note: 'proof of work', icon: FolderGit2 },
  {
    href: '/playground',
    label: './run playground',
    note: 'AI image generator',
    icon: FlaskConical,
  },
  { href: '/#contact', label: 'mail jhonrey', note: 'get in touch', icon: Mail },
];

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-primary)] px-4 selection:bg-[var(--color-volt)] selection:text-white"
    >
      {/* Decorative overlays (same grain/scanline assets as the preloader) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'url(/site-assets/overlays/grain.svg)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: 'url(/site-assets/overlays/scanlines.svg)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-volt)]/10 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090a0f]/95 shadow-2xl backdrop-blur-xl">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-white/60">404.sh — route resolver</span>
          </div>

          <div className="space-y-4 p-6 font-mono text-sm sm:p-8">
            <p className="text-[var(--text-secondary)]">
              <span className="text-[var(--color-volt)]">jhonrey@portfolio</span>
              <span className="text-white/50">:</span>
              <span className="text-blue-300">~</span>
              <span className="text-white/50">$</span> open /this-page
            </p>
            <p className="flex items-start gap-2 text-red-400">
              <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                ERR_404_ROUTE_NOT_FOUND
                <span className="block text-[var(--text-secondary)]">
                  The route you requested does not exist, was renamed, or never shipped.
                </span>
              </span>
            </p>

            <div
              aria-hidden="true"
              className="text-6xl font-bold text-[var(--color-volt)]/15 select-none sm:text-7xl"
            >
              404
            </div>

            <p className="text-white/70">Suggested commands:</p>
            <ul className="space-y-2">
              {suggestions.map(({ href, label, note, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex min-h-[44px] items-center gap-3 rounded-lg border border-transparent px-2 text-[var(--color-volt)] transition-colors hover:border-[var(--color-volt)]/30 hover:bg-[var(--color-volt)]/10 hover:text-[var(--color-volt-light)]"
                  >
                    <Icon size={16} aria-hidden="true" className="shrink-0 opacity-70" />
                    <span className="underline-offset-4 group-hover:underline">{label}</span>
                    <span className="text-xs text-[var(--text-secondary)]"># {note}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="flex items-center gap-2 pt-2 text-[var(--text-secondary)]">
              <span className="text-[var(--color-volt)]">jhonrey@portfolio</span>
              <span className="text-white/50">:~$</span>
              <span aria-hidden="true" className="h-4 w-2 animate-pulse bg-[var(--color-volt)]" />
              <span className="sr-only">awaiting input</span>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-[var(--text-secondary)]">
          exit code 404 · gracefully handled ·{' '}
          <Link href="/" className="text-[var(--color-volt)] underline-offset-4 hover:underline">
            return home
          </Link>
        </p>
      </div>
    </main>
  );
}
