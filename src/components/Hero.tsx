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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        // Desktop: full cinematic entrance with opacity and word stagger
        gsap.to('.hero-text-item', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.1,
        });

        gsap.to('.hero-word', {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          delay: 0.4,
        });

        // Right console animation
        gsap.fromTo(
          '.hero-console-window',
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)', delay: 0.5 },
        );

        // Floating images initial animation and continuous floating
        gsap.fromTo(
          '.hero-floater',
          { opacity: 0, scale: 0.8, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'back.out(1.2)',
            delay: 0.8,
          },
        );

        // Continuous floating animation for images
        gsap.to('.hero-floater', {
          y: '-=15',
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          stagger: {
            each: 0.3,
            from: 'random',
          },
        });
      });

      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 767px)', () => {
        // Mobile: hero text is 100% visible on initial HTML paint (no JS delay for LCP).
        // Continuous floating animation for images only:
        gsap.to('.hero-floater', {
          y: '-=10',
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          stagger: 0.3,
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // No motion: everything stays at natural static position
      });

      return () => mm.revert();
    },
    { scope: container },
  );

  return (
    <section ref={container} className="relative w-full pt-16 pb-12 sm:pt-24">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
        {/* Left: Text Content */}
        <div className="z-10 flex flex-col items-start text-left">
          <div className="hero-text-item mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-volt)]/30 bg-[var(--color-volt)]/5 px-3 py-1.5 text-xs font-semibold tracking-widest text-[var(--color-volt-light)] uppercase">
            <Terminal size={14} />
            {portfolioData.identity.title}
          </div>

          <h1
            className="hero-text-item mb-6 flex flex-wrap gap-[0.25em] text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl"
            aria-label="I build with AI — websites, apps, & automations."
          >
            {'I build with AI —'.split(' ').map((word, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden">
                <span className="hero-word inline-block">{word}&nbsp;</span>
              </span>
            ))}
            <span className="h-0 w-full sm:hidden"></span>
            {'websites, apps, & automations.'.split(' ').map((word, i) => (
              <span key={`glow-${i}`} aria-hidden="true" className="inline-block overflow-hidden">
                <span className="hero-word inline-block bg-gradient-to-r from-[var(--color-volt-light)] to-[var(--color-volt-light)] bg-clip-text text-transparent">
                  {word}&nbsp;
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-text-item mb-8 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)] sm:text-xl">
            {portfolioData.identity.shortBio}
          </p>

          <div className="hero-text-item flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Magnetic strength={0.25}>
              <button
                onClick={onOpenAi}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-volt)] px-8 py-3.5 font-semibold text-[var(--bg-primary)] shadow-[0_0_20px_rgba(232,245,74,0.3)] transition-all hover:bg-[var(--color-volt)] hover:shadow-[0_0_30px_rgba(232,245,74,0.5)] sm:w-auto"
              >
                <Terminal size={18} />
                Ask My AI
              </button>
            </Magnetic>

            <Magnetic strength={0.25}>
              <a
                href="#projects"
                className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10 sm:w-auto"
              >
                Explore Projects
              </a>
            </Magnetic>
          </div>

          <div className="hero-text-item mt-3 flex items-center gap-1.5 font-mono text-xs text-[var(--color-volt-light)]/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-volt)]" />
            <span>Interactive AI chatbot trained on this portfolio</span>
          </div>

          <div className="hero-text-item mt-5 flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <span>Prefer email?</span>
            <a
              href="mailto:jhonreyc2001@gmail.com"
              className="font-medium text-white underline underline-offset-4 transition-colors hover:text-[var(--color-volt)]"
            >
              jhonreyc2001@gmail.com
            </a>
          </div>
        </div>

        {/* Right: Build Console & Floating Images */}
        <div className="hero-console relative z-10 mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute inset-0 z-[-1] rounded-full bg-[var(--color-volt)]/10 blur-[80px]" />

          {/* Floating Hero Assets (Outside the Console Window, Framing the Edges) */}
          <div className="hero-floater pointer-events-none absolute -top-16 left-8 z-[10] hidden w-[160px] mix-blend-screen md:block lg:-top-20 lg:left-12 lg:w-[190px]">
            <Image
              src="/site-assets/floating/workflow-nodes.webp"
              alt="Workflow nodes diagram"
              width={190}
              height={130}
              className="h-auto w-full object-contain mix-blend-screen"
            />
          </div>

          <div className="hero-floater pointer-events-none absolute -top-12 -right-10 z-[10] hidden w-[130px] mix-blend-screen md:block lg:-top-16 lg:-right-14 lg:w-[150px]">
            <Image
              src="/site-assets/floating/ai-braces.webp"
              alt="AI Braces logic block"
              width={150}
              height={110}
              className="h-auto w-full object-contain mix-blend-screen"
            />
          </div>

          <div className="hero-floater pointer-events-none absolute -right-8 -bottom-10 z-[10] hidden w-[120px] mix-blend-screen md:block lg:-right-12 lg:-bottom-12 lg:w-[140px]">
            <Image
              src="/site-assets/floating/chip-cut.webp"
              alt="Microchip module"
              width={140}
              height={95}
              className="h-auto w-full object-contain mix-blend-screen"
            />
          </div>

          <div className="hero-console-window relative z-[2] overflow-hidden rounded-2xl border border-white/10 bg-[#090a0f]/95 shadow-2xl backdrop-blur-xl">
            {/* Window Header */}
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full border border-red-500/50 bg-red-500/20" />
                <div className="h-3 w-3 rounded-full border border-yellow-500/50 bg-yellow-500/20" />
                <div className="h-3 w-3 rounded-full border border-green-500/50 bg-green-500/20" />
              </div>
              <div className="flex-1 text-center font-mono text-xs text-white/40">
                build-console.sh
              </div>
            </div>

            {/* Console Content */}
            <div className="p-5 font-mono text-sm">
              <div className="mb-5 flex items-center gap-3 text-white/70">
                <Cpu size={16} className="text-[var(--color-volt)]" />
                <span>Initializing build process...</span>
              </div>

              <div className="relative space-y-5 before:absolute before:inset-0 before:ml-[9px] before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[var(--color-volt)] before:via-[var(--color-volt)] before:to-white/10">
                {/* Step 1: Idea */}
                <div className="relative z-10 flex w-full items-center gap-4 pl-0">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-volt)] shadow-[0_0_10px_rgba(232,245,74,0.5)]">
                    <div className="h-2 w-2 rounded-full bg-[var(--bg-primary)]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">Idea & Planning</div>
                    <div className="text-xs text-white/40">Requirements gathered</div>
                  </div>
                </div>

                {/* Step 2: Build */}
                <div className="relative z-10 flex w-full items-center gap-4 pl-0">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-volt)] shadow-[0_0_10px_rgba(232,245,74,0.5)]">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--bg-primary)]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">AI-Assisted Build</div>
                    <div className="text-xs text-white/40">Next.js + Tailwind</div>
                  </div>
                </div>

                {/* Step 3: Product */}
                <div className="relative z-10 flex w-full items-center gap-4 pl-0 opacity-50">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white/20 bg-transparent"></div>
                  <div className="flex-1">
                    <div className="font-medium text-white/60">Live Deployment</div>
                    <div className="text-xs text-white/30">Awaiting final checks...</div>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="mt-6 space-y-3 border-t border-white/5 pt-5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 size={14} className="text-green-400" /> SukiSuite
                  </div>
                  <span className="rounded border border-green-400/20 bg-green-400/10 px-2 py-0.5 text-green-400/80">
                    Live
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-white/80">
                    <CircleDashed size={14} className="text-yellow-400" /> Barangay Arena
                  </div>
                  <span className="rounded border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 text-yellow-400/80">
                    Preview
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-white/80">
                    <PlayCircle size={14} className="text-[var(--color-volt)]" /> AI Playground
                  </div>
                  <span className="rounded border border-[var(--color-volt)]/20 bg-[var(--color-volt)]/10 px-2 py-0.5 text-[var(--color-volt)]/80">
                    Experimental
                  </span>
                </div>
              </div>

              {/* Blinking Cursor */}
              <div className="mt-4 flex items-center font-mono text-xs text-[var(--color-volt)]/70">
                <span>user@system:~$</span>
                <span className="ml-1.5 h-3.5 w-1.5 animate-pulse bg-[var(--color-volt)]/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
