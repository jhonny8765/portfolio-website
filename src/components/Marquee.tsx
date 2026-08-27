'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const marqueeItems = [
  { prefix: "Building", text: "Kidapawan delivery app" },
  { prefix: "Learning", text: "Gemini token optimization" },
  { prefix: "Next", text: "POS for local shops" },
  { prefix: "Live", text: "SukiSuite" },
  { prefix: "Experimental", text: "AI Playground" }
];

export default function Marquee() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (!track.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.to(track.current, {
      xPercent: -50,
      ease: "none",
      duration: 35,
      repeat: -1,
    });
    tweenRef.current = tween;

    return () => {
      tween.kill();
      tweenRef.current = null;
    };
  }, { scope: container });

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
      className="w-full relative overflow-hidden py-6 border-y border-white/5 bg-white/[0.01] cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={track} 
        className="marquee-track flex whitespace-nowrap items-center w-max"
      >
        <div className="flex gap-8 items-center px-4">
          {marqueeItems.map((item, i) => (
            <React.Fragment key={`first-${i}`}>
              <span className="text-xl md:text-3xl font-sans font-medium text-white/60 tracking-wide flex items-center gap-3">
                <span className="text-[var(--color-volt)]/80 font-bold">{item.prefix}</span> 
                <span>&middot;</span> 
                {item.text}
              </span>
              <span className="text-[var(--color-volt)]/50 mx-4 font-bold px-2">&middot;</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-8 items-center px-4">
          {marqueeItems.map((item, i) => (
            <React.Fragment key={`second-${i}`}>
              <span className="text-xl md:text-3xl font-sans font-medium text-white/60 tracking-wide flex items-center gap-3">
                <span className="text-[var(--color-volt)]/80 font-bold">{item.prefix}</span> 
                <span>&middot;</span> 
                {item.text}
              </span>
              <span className="text-[var(--color-volt)]/50 mx-4 font-bold px-2">&middot;</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
