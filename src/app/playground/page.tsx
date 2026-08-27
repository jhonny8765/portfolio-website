import React from 'react';
import ImageGenerator from '@/components/ImageGenerator';
import { TransitionLink as Link } from '@/components/TransitionLink';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/playground',
  },
  title: 'AI Playground | Jhon Rey Consolacion',
  description: 'Experiment with AI image generation and prompt enhancement.',
  openGraph: {
    title: 'AI Playground | Jhon Rey Consolacion',
    description: 'Experiment with AI image generation and prompt enhancement.',
    url: 'https://jhonreyconsolacion.vercel.app/playground',
  },
  twitter: {
    title: 'AI Playground | Jhon Rey Consolacion',
    description: 'Experiment with AI image generation and prompt enhancement.',
  },
};

export default function PlaygroundPage() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--bg-primary)] px-4 pt-24 pb-12 selection:bg-[var(--color-volt)] selection:text-white sm:px-6"
    >
      {/* Background Glows (matching the main page) */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[400px] w-full max-w-4xl -translate-x-1/2 rounded-full bg-[var(--color-volt)]/10 blur-[100px]"></div>
      <div className="pointer-events-none absolute top-1/4 right-0 h-[300px] w-[300px] rounded-full bg-[var(--color-volt)]/5 blur-[120px]"></div>

      <div className="animate-in fade-in slide-in-from-bottom-8 relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col duration-700">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>

        {/* Header Section */}
        <div className="relative mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-volt)]/20 bg-[rgba(232,245,74,0.1)] px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-volt)]"></span>
            <span className="text-[10px] font-semibold tracking-wider text-[var(--color-volt-light)] uppercase">
              Experimental
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] sm:text-5xl lg:text-7xl">
            AI{' '}
            <span className="bg-gradient-to-r from-[var(--color-volt)] to-[var(--color-volt-light)] bg-clip-text text-transparent">
              Playground
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-[var(--text-secondary)] sm:text-xl">
            A sandbox for AI experimentation. Use the Gemini prompt enhancer to craft the perfect
            description, then generate unique images powered by Cloudflare Workers AI.
          </p>

          <div className="pointer-events-none absolute top-1/2 left-[5%] hidden w-[120px] -translate-y-1/2 opacity-20 mix-blend-screen md:block md:opacity-40">
            <Image
              src="/site-assets/floating/ai-braces.webp"
              alt="Decoration"
              width={120}
              height={80}
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* Console Framed Generator Component */}
        <div className="glass-panel relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:rounded-3xl">
          {/* Mac-style Window Header */}
          <div className="relative flex h-10 items-center gap-2 border-b border-white/10 bg-white/5 px-4">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full border border-red-500/50 bg-red-500/20"></div>
              <div className="h-3 w-3 rounded-full border border-yellow-500/50 bg-yellow-500/20"></div>
              <div className="h-3 w-3 rounded-full border border-green-500/50 bg-green-500/20"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 font-mono text-xs text-[var(--text-secondary)]">
              /usr/bin/generator --engine=cloudflare
            </div>
          </div>
          <div className="bg-black/40 p-4 sm:p-6 lg:p-8">
            <ImageGenerator />
          </div>
        </div>

        {/* Footer/Note */}
        <div className="mx-auto mt-16 max-w-md text-center text-xs text-[var(--text-secondary)]">
          Generations are strictly rate-limited per user and reset daily at UTC midnight to ensure
          fair usage. Generated images are not permanently stored.
        </div>
      </div>
    </main>
  );
}
