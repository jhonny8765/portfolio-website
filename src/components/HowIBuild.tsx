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
    num: "01",
    title: "Discover",
    desc: "Understand the idea and the real problem.",
    icon: Search
  },
  {
    num: "02",
    title: "Prototype",
    desc: "Turn the concept into a working interface quickly.",
    icon: PenTool
  },
  {
    num: "03",
    title: "Integrate",
    desc: "Connect APIs, AI, databases, and automations.",
    icon: Link2
  },
  {
    num: "04",
    title: "Improve",
    desc: "Test, refine, secure, and deploy.",
    icon: TrendingUp
  }
];

export default function HowIBuild() {
  const container = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!container.current) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Pin the entire section
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=150%", // Keep it pinned for a while
        pin: true,
        anticipatePin: 1,
      });

      // Animate the cards in sequentially
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 1, // stagger works with scrub if timeline is used, but for simple scrollTrigger we can just map them
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
          }
        }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(cardsRef.current, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <section ref={container} className="w-full py-16 min-h-screen flex flex-col justify-center">
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          How I <span className="text-[var(--color-volt)]">Build</span>
        </h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
          My transparent process for turning ideas into deployed digital products.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div 
              key={step.num}
              ref={el => { cardsRef.current[index] = el; }}
              className="relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
            >
              <div className="text-[var(--color-volt)]/20 text-5xl font-bold absolute top-4 right-6 pointer-events-none transition-all group-hover:scale-110 group-hover:text-[var(--color-volt)]/30">
                {step.num}
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-[var(--color-volt)]/10 flex items-center justify-center text-[var(--color-volt)] mb-6 border border-[var(--color-volt)]/20">
                <Icon size={24} />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
