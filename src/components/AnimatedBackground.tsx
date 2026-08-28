'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedBackground() {
  const container = useRef<HTMLDivElement>(null);
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);
  const orb3 = useRef<HTMLDivElement>(null);
  const wrap1 = useRef<HTMLDivElement>(null);
  const wrap2 = useRef<HTMLDivElement>(null);
  const wrap3 = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Parallax scrolling
        gsap.to(wrap1.current, {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to(wrap2.current, {
          yPercent: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to(wrap3.current, {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Continuous animations
        gsap.to(orb1.current, {
          x: () => 50 * (Math.random() > 0.5 ? 1 : -1),
          y: () => 30 * (Math.random() > 0.5 ? 1 : -1),
          scale: 1.1,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        gsap.to(orb2.current, {
          x: () => 40 * (Math.random() > 0.5 ? 1 : -1),
          y: () => -50 * (Math.random() > 0.5 ? 1 : -1),
          scale: 1.1,
          duration: 12.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2,
        });

        gsap.to(orb3.current, {
          x: () => 60 * (Math.random() > 0.5 ? 1 : -1),
          y: () => 60 * (Math.random() > 0.5 ? 1 : -1),
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 5,
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // For reduced motion, elements just stay static
        gsap.set([orb1.current, orb2.current, orb3.current], { opacity: 0.5 });
      });

      return () => mm.revert();
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Orb 1 */}
      <div ref={wrap1} className="absolute inset-0">
        <div
          ref={orb1}
          className="absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-[var(--color-volt)]/10 blur-[120px]"
        />
      </div>

      {/* Orb 2 */}
      <div ref={wrap2} className="absolute inset-0">
        <div
          ref={orb2}
          className="absolute right-[-10%] bottom-[-20%] h-[50%] w-[50%] rounded-full bg-[var(--color-volt)]/10 blur-[120px]"
        />
      </div>

      {/* Orb 3 */}
      <div ref={wrap3} className="absolute inset-0 z-0">
        <div
          ref={orb3}
          className="absolute top-[30%] left-[40%] h-[30%] w-[30%] rounded-full bg-[var(--color-volt)]/5 blur-[100px]"
        />
      </div>

      {/* Global Grain and Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-[var(--z-overlay)] opacity-[0.04]"
        style={{ backgroundImage: 'url(/site-assets/overlays/grain.svg)' }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-[var(--z-overlay)] opacity-[0.02]"
        style={{ backgroundImage: 'url(/site-assets/overlays/scanlines.svg)' }}
      />
    </div>
  );
}
