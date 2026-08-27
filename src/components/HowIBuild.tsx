'use client';

import React, { useRef } from 'react';
import { Search, PenTool, Link2, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') {
  (window as unknown as { ScrollTrigger: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger;
}

const steps = [
  {
    num: '01',
    title: 'Discover',
    desc: 'Understand the idea and the real problem.',
    icon: Search,
  },
  {
    num: '02',
    title: 'Prototype',
    desc: 'Turn the concept into a working interface quickly.',
    icon: PenTool,
  },
  {
    num: '03',
    title: 'Integrate',
    desc: 'Connect APIs, AI, databases, and automations.',
    icon: Link2,
  },
  {
    num: '04',
    title: 'Improve',
    desc: 'Test, refine, secure, and deploy.',
    icon: TrendingUp,
  },
];

export default function HowIBuild() {
  const container = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (!container.current) return;
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        // Pin the entire section on desktop
        ScrollTrigger.create({
          trigger: container.current,
          start: 'top top',
          end: '+=150%', // Keep it pinned for a while
          pin: true,
          anticipatePin: 1,
        });

        // Animate the cards in sequentially
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            stagger: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container.current,
              start: 'top top',
              end: '+=150%',
              scrub: 1,
            },
          },
        );
      });

      mm.add('(max-width: 767px), (prefers-reduced-motion: reduce)', () => {
        gsap.set(cardsRef.current, { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: container },
  );

  return (
    <section
      id="how-i-build"
      ref={container}
      className="flex min-h-screen w-full flex-col justify-center py-16"
    >
      <div className="mb-12">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          How I <span className="text-[var(--color-volt)]">Build</span>
        </h2>
        <p className="max-w-2xl text-lg text-[var(--text-secondary)]">
          My transparent process for turning ideas into deployed digital products.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]"
            >
              {/* Decorative watermark number — aria-hidden (step title carries the
                  meaning). Opacity floored at /50 so the large digits still meet
                  WCAG 1.4.3's 3:1 large-text contrast (axe counts aria-hidden text
                  — 1.4.3 is a visual criterion; /20 measured 1.67:1 and failed). */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-4 right-6 text-5xl font-bold text-[var(--color-volt)]/50 transition-all group-hover:scale-110 group-hover:text-[var(--color-volt)]/60"
              >
                {step.num}
              </div>

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-volt)]/20 bg-[var(--color-volt)]/10 text-[var(--color-volt)]">
                <Icon size={24} />
              </div>

              <h3 className="mb-2 text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
