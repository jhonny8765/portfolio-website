'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const marqueeItems = [
  { prefix: 'Building', text: 'Kidapawan delivery app' },
  { prefix: 'Learning', text: 'Gemini token optimization' },
  { prefix: 'Next', text: 'POS for local shops' },
  { prefix: 'Live', text: 'SukiSuite' },
  { prefix: 'Experimental', text: 'AI Playground' },
];

export default function Marquee() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      if (!track.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tween = gsap.to(track.current, {
        xPercent: -50,
        ease: 'none',
        duration: 35,
        repeat: -1,
      });
      tweenRef.current = tween;

      return () => {
        tween.kill();
        tweenRef.current = null;
      };
    },
    { scope: container },
  );

  const handleMouseEnter = () => {
    tweenRef.current?.pause();
  };

  const handleMouseLeave = () => {
    tweenRef.current?.resume();
  };

  return (
    <section
      id="live-marquee"
      ref={container}
      className="relative w-full cursor-default overflow-hidden border-y border-white/5 bg-white/[0.01] py-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={track} className="marquee-track flex w-max items-center whitespace-nowrap">
        <div className="flex items-center gap-8 px-4">
          {marqueeItems.map((item, i) => (
            <React.Fragment key={`first-${i}`}>
              <span className="flex items-center gap-3 font-sans text-xl font-medium tracking-wide text-white/60 md:text-3xl">
                <span className="font-bold text-[var(--color-volt)]/80">{item.prefix}</span>
                <span>&middot;</span>
                {item.text}
              </span>
              <span className="mx-4 px-2 font-bold text-[var(--color-volt)]/50">&middot;</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-8 px-4">
          {marqueeItems.map((item, i) => (
            <React.Fragment key={`second-${i}`}>
              <span className="flex items-center gap-3 font-sans text-xl font-medium tracking-wide text-white/60 md:text-3xl">
                <span className="font-bold text-[var(--color-volt)]/80">{item.prefix}</span>
                <span>&middot;</span>
                {item.text}
              </span>
              <span className="mx-4 px-2 font-bold text-[var(--color-volt)]/50">&middot;</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
