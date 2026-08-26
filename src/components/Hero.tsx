import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Terminal, CheckCircle2, CircleDashed, Cpu, PlayCircle } from 'lucide-react';

interface HeroProps {
  onOpenAi: () => void;
}

export default function Hero({ onOpenAi }: HeroProps) {
  return (
    <section className="pt-16 sm:pt-24 pb-12 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto">
        {/* Left: Text Content */}
        <div className="flex flex-col items-start text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-violet)]/30 bg-[var(--color-violet)]/5 text-[var(--color-violet-light)] text-xs font-semibold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Terminal size={14} />
            {portfolioData.identity.title}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
            I build with AI — <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-violet-light)] to-[#06B6D4]">
              websites, apps, & automations.
            </span>
          </h1>
          
          <p className="text-[var(--text-secondary)] text-lg sm:text-xl max-w-xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
            {portfolioData.identity.shortBio}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-both">
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
          
          <div className="mt-6 flex items-center gap-3 text-sm text-[var(--text-secondary)] animate-in fade-in slide-in-from-bottom-10 duration-700 delay-400 fill-mode-both">
            <span>Prefer email?</span>
            <a href="mailto:jhonreyc2001@gmail.com" className="text-white hover:text-[var(--color-violet-light)] underline underline-offset-4 transition-colors font-medium">
              jhonreyc2001@gmail.com
            </a>
          </div>
        </div>

        {/* Right: Build Console */}
        <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both z-10">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[var(--color-violet)]/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative rounded-2xl border border-white/10 bg-[#090a0f]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
            {/* Window Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="flex-1 text-center text-xs font-mono text-white/40">build-console.sh</div>
            </div>
            
            {/* Console Content */}
            <div className="p-5 font-mono text-sm">
              <div className="flex items-center gap-3 text-white/70 mb-5">
                <Cpu size={16} className="text-[var(--color-violet-light)]" />
                <span>Initializing build process...</span>
              </div>
              
              <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[9px] before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[var(--color-violet)] before:via-[#06B6D4] before:to-white/10">
                
                {/* Step 1: Idea */}
                <div className="relative flex items-center gap-4 z-10 w-full pl-0">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-violet)] flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.5)] shrink-0">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Idea & Planning</div>
                    <div className="text-xs text-white/40">Requirements gathered</div>
                  </div>
                </div>

                {/* Step 2: Build */}
                <div className="relative flex items-center gap-4 z-10 w-full pl-0">
                  <div className="w-5 h-5 rounded-full bg-[#06B6D4] flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)] shrink-0">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">AI-Assisted Build</div>
                    <div className="text-xs text-white/40">Next.js + Tailwind</div>
                  </div>
                </div>

                {/* Step 3: Product */}
                <div className="relative flex items-center gap-4 z-10 w-full pl-0 opacity-50">
                  <div className="w-5 h-5 rounded-full bg-transparent border-2 border-white/20 flex items-center justify-center shrink-0">
                  </div>
                  <div className="flex-1">
                    <div className="text-white/60 font-medium">Live Deployment</div>
                    <div className="text-xs text-white/30">Awaiting final checks...</div>
                  </div>
                </div>

              </div>

              {/* Status Indicators */}
              <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 size={14} className="text-green-400" /> SukiSuite
                  </div>
                  <span className="text-green-400/80 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded">Live</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-white/80">
                    <CircleDashed size={14} className="text-yellow-400" /> Barangay Arena
                  </div>
                  <span className="text-yellow-400/80 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded">Preview</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-white/80">
                    <PlayCircle size={14} className="text-[#06B6D4]" /> AI Playground
                  </div>
                  <span className="text-[#06B6D4]/80 bg-[#06B6D4]/10 border border-[#06B6D4]/20 px-2 py-0.5 rounded">Experimental</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
