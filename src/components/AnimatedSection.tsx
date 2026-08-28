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
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: delay,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%', // Equivalent to margin "-50px"
              once: true,
            },
          },
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // Reveal immediately — no scroll gating for users who prefer reduced motion
        gsap.set(sectionRef.current, { opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id={id} className={className}>
      {children}
    </section>
  );
}
