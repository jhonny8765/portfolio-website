import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Terminal } from 'lucide-react';

interface HeroProps {
  onOpenAi: () => void;
}

export default function Hero({ onOpenAi }: HeroProps) {
  return (
    <section className="flex flex-col items-center justify-center pt-16 sm:pt-24 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-violet)]/30 bg-[var(--color-violet)]/5 text-[var(--color-violet-light)] text-xs font-semibold uppercase tracking-widest mb-6">
        <Terminal size={14} />
        {portfolioData.identity.title}
      </div>
      
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
        I build with AI — websites, <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-violet-light)] to-[#06B6D4]">
          applications, and automations.
        </span>
      </h1>
      
      <p className="text-[var(--text-secondary)] text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
        {portfolioData.identity.shortBio}
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        {/* Ask My AI Trigger */}
        <button 
          onClick={onOpenAi}
          className="w-full sm:w-auto min-h-[44px] px-8 py-3.5 rounded-xl bg-[var(--color-violet)] hover:bg-[var(--color-violet-light)] text-white font-semibold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2"
        >
          <Terminal size={18} />
          Ask My AI
        </button>
        
        <a href="#projects" className="w-full sm:w-auto min-h-[44px] px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all flex items-center justify-center">
          Explore Projects
        </a>
      </div>
    </section>
  );
}
