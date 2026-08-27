'use client';

import React, { useRef } from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Terminal, CheckCircle2, CircleDashed, Cpu, PlayCircle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { Magnetic } from './Magnetic';

interface HeroProps {
  onOpenAi: () => void;
}

export default function Hero({ onOpenAi }: HeroProps) {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      // Desktop: full cinematic entrance with opacity and word stagger
      gsap.to(".hero-text-item", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.1
      });

      gsap.to(".hero-word", {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.4
      });

      // Right console animation
      gsap.fromTo(
        ".hero-console-window",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)", delay: 0.5 }
      );

      // Floating images initial animation and continuous floating
      gsap.fromTo(
        ".hero-floater",
        { opacity: 0, scale: 0.8, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.2, ease: "back.out(1.2)", delay: 0.8 }
      );

      // Continuous floating animation for images
      gsap.to(".hero-floater", {
        y: "-=15",
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: {
          each: 0.3,
          from: "random"
        }
      });
    });

    mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
      // Mobile: hero text is 100% visible on initial HTML paint (no JS delay for LCP).
      // Continuous floating animation for images only:
      gsap.to(".hero-floater", {
        y: "-=10",
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.3
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // No motion: everything stays at natural static position
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <section ref={container} className="pt-16 sm:pt-24 pb-12 w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto relative z-10">
        
        {/* Left: Text Content */}
        <div className="flex flex-col items-start text-left z-10">
          <div className="hero-text-item inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-volt)]/30 bg-[var(--color-volt)]/5 text-[var(--color-volt-light)] text-xs font-semibold uppercase tracking-widest mb-6">
            <Terminal size={14} />
            {portfolioData.identity.title}
          </div>
          
          <h1 
            className="hero-text-item text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6 leading-[1.1] flex flex-wrap gap-[0.25em]"
            aria-label="I build with AI — websites, apps, & automations."
          >
            {"I build with AI —".split(' ').map((word, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden">
                <span className="hero-word inline-block">{word}{' '}</span>
              </span>
            ))}
            <span className="w-full h-0 sm:hidden"></span>
            {"websites, apps, & automations.".split(' ').map((word, i) => (
              <span key={`glow-${i}`} aria-hidden="true" className="inline-block overflow-hidden">
                <span className="hero-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-volt-light)] to-[var(--color-volt-light)]">{word}{' '}</span>
              </span>
            ))}
          </h1>
          
          <p className="hero-text-item text-[var(--text-secondary)] text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
            {portfolioData.identity.shortBio}
          </p>
          
          <div className="hero-text-item flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Magnetic strength={0.25}>
              <button 
                onClick={onOpenAi}
                className="w-full sm:w-auto min-h-[44px] px-8 py-3.5 rounded-xl bg-[var(--color-volt)] hover:bg-[var(--color-volt)] text-[var(--bg-primary)] font-semibold transition-all shadow-[0_0_20px_rgba(232,245,74,0.3)] hover:shadow-[0_0_30px_rgba(232,245,74,0.5)] flex items-center justify-center gap-2"
              >
                <Terminal size={18} />
                Ask My AI
              </button>
            </Magnetic>
            
            <Magnetic strength={0.25}>
              <a href="#projects" className="w-full sm:w-auto min-h-[44px] px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all flex items-center justify-center">
                Explore Projects
              </a>
            </Magnetic>
          </div>
          
          <div className="hero-text-item mt-3 text-xs text-[var(--color-volt-light)]/70 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-volt)] animate-pulse" />
            <span>Interactive AI chatbot trained on this portfolio</span>
          </div>
          
          <div className="hero-text-item mt-5 flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <span>Prefer email?</span>
            <a href="mailto:jhonreyc2001@gmail.com" className="text-white hover:text-[var(--color-volt)] underline underline-offset-4 transition-colors font-medium">
              jhonreyc2001@gmail.com
            </a>
          </div>
        </div>

        {/* Right: Build Console & Floating Images */}
        <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto z-10 hero-console">
          
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[var(--color-volt)]/10 blur-[80px] rounded-full pointer-events-none z-[-1]" />
          
          {/* Floating Hero Assets (Outside the Console Window, Framing the Edges) */}
          <div className="hidden md:block absolute -top-16 left-8 lg:-top-20 lg:left-12 w-[160px] lg:w-[190px] pointer-events-none hero-floater mix-blend-screen z-[10]">
            <Image src="/site-assets/floating/workflow-nodes.webp" alt="Workflow nodes diagram" width={190} height={130} className="w-full h-auto object-contain mix-blend-screen" />
          </div>

          <div className="hidden md:block absolute -top-12 -right-10 lg:-top-16 lg:-right-14 w-[130px] lg:w-[150px] pointer-events-none hero-floater mix-blend-screen z-[10]">
            <Image src="/site-assets/floating/ai-braces.webp" alt="AI Braces logic block" width={150} height={110} className="w-full h-auto object-contain mix-blend-screen" />
          </div>

          <div className="hidden md:block absolute -bottom-10 -right-8 lg:-bottom-12 lg:-right-12 w-[120px] lg:w-[140px] pointer-events-none hero-floater mix-blend-screen z-[10]">
            <Image src="/site-assets/floating/chip-cut.webp" alt="Microchip module" width={140} height={95} className="w-full h-auto object-contain mix-blend-screen" />
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-[#090a0f]/95 backdrop-blur-xl overflow-hidden shadow-2xl z-[2] hero-console-window">
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
                <Cpu size={16} className="text-[var(--color-volt)]" />
                <span>Initializing build process...</span>
              </div>
              
              <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[9px] before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[var(--color-volt)] before:via-[var(--color-volt)] before:to-white/10">
                
                {/* Step 1: Idea */}
                <div className="relative flex items-center gap-4 z-10 w-full pl-0">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-volt)] flex items-center justify-center shadow-[0_0_10px_rgba(232,245,74,0.5)] shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[var(--bg-primary)]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Idea & Planning</div>
                    <div className="text-xs text-white/40">Requirements gathered</div>
                  </div>
                </div>

                {/* Step 2: Build */}
                <div className="relative flex items-center gap-4 z-10 w-full pl-0">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-volt)] flex items-center justify-center shadow-[0_0_10px_rgba(232,245,74,0.5)] shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[var(--bg-primary)] animate-pulse" />
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
                    <PlayCircle size={14} className="text-[var(--color-volt)]" /> AI Playground
                  </div>
                  <span className="text-[var(--color-volt)]/80 bg-[var(--color-volt)]/10 border border-[var(--color-volt)]/20 px-2 py-0.5 rounded">Experimental</span>
                </div>
              </div>

              {/* Blinking Cursor */}
              <div className="mt-4 flex items-center text-[var(--color-volt)]/70 font-mono text-xs">
                <span>user@system:~$</span>
                <span className="w-1.5 h-3.5 bg-[var(--color-volt)]/70 ml-1.5 animate-pulse" />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

