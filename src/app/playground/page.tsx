import React from 'react';
import ImageGenerator from '@/components/ImageGenerator';
import { TransitionLink as Link } from '@/components/TransitionLink';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

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
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4 sm:px-6 flex flex-col relative overflow-hidden selection:bg-[var(--color-volt)] selection:text-white">
      {/* Background Glows (matching the main page) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-volt)]/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-[var(--color-volt)]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-12">
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(232,245,74,0.1)] border border-[var(--color-volt)]/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-volt)] animate-pulse"></span>
            <span className="text-[10px] uppercase font-semibold text-[var(--color-volt-light)] tracking-wider">Experimental</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-volt)] to-[var(--color-volt-light)]">Playground</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-light leading-relaxed">
            A sandbox for AI experimentation. Use the Gemini prompt enhancer to craft the perfect description, then generate unique images powered by Cloudflare Workers AI.
          </p>
          
          <div className="absolute top-1/2 left-[5%] -translate-y-1/2 w-[120px] pointer-events-none opacity-20 md:opacity-40 mix-blend-screen hidden md:block">
             <Image src="/site-assets/floating/ai-braces.webp" alt="Decoration" width={120} height={80} className="w-full h-auto" />
          </div>
        </div>

        {/* Console Framed Generator Component */}
        <div className="glass-panel rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl">
          {/* Mac-style Window Header */}
          <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2 relative">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-xs font-mono text-[var(--text-secondary)]">
              /usr/bin/generator --engine=cloudflare
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 bg-black/40">
            <ImageGenerator />
          </div>
        </div>
        
        {/* Footer/Note */}
        <div className="mt-16 text-center text-xs text-[var(--text-secondary)]/50 max-w-md mx-auto">
          Generations are strictly rate-limited per user and reset daily at UTC midnight to ensure fair usage. Generated images are not permanently stored.
        </div>
      </div>
    </main>
  );
}

