'use client';

import React, { ReactNode, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  id,
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Do not hide already-visible content on hydration, back navigation, or deep links.
        if (sectionRef.current!.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        // Keep the section/anchor in normal geometry. Translating the anchor
        // itself made smooth-scroll destinations drift as the reveal finished.
        gsap.fromTo(
          Array.from(sectionRef.current!.children),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay,
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 90%',
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [delay], revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} id={id} className={className}>
      {children}
    </section>
  );
}
