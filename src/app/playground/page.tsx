import React from 'react';
import ImageGenerator from '@/components/ImageGenerator';

import { Metadata } from 'next';

export const metadata: Metadata = {
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
  }
};

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4 sm:px-6 flex flex-col relative overflow-hidden selection:bg-[var(--color-violet)] selection:text-white">
      {/* Background Glows (matching the main page) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-violet)]/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-[var(--color-violet-light)]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(139,92,246,0.1)] border border-[var(--color-violet)]/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-violet)] animate-pulse"></span>
            <span className="text-[10px] uppercase font-semibold text-[var(--color-violet-light)] tracking-wider">Experimental</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-violet-light)] to-[var(--color-violet)]">Playground</span>
          </h1>
          
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-light leading-relaxed">
            A sandbox for AI experimentation. Use the Gemini prompt enhancer to craft the perfect description, then generate unique images powered by Cloudflare Workers AI.
          </p>
        </div>

        {/* Generator Component */}
        <ImageGenerator />
        
        {/* Footer/Note */}
        <div className="mt-16 text-center text-xs text-[var(--text-secondary)]/50 max-w-md mx-auto">
          Generations are strictly rate-limited per user and reset daily at UTC midnight to ensure fair usage. Generated images are not permanently stored.
        </div>
      </div>
    </main>
  );
}
