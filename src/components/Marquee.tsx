'use client';

import React, { useRef, useState } from 'react';

const marqueeItems = [
  { prefix: 'Building', text: 'Kidapawan delivery app' },
  { prefix: 'Learning', text: 'Gemini token optimization' },
  { prefix: 'Next', text: 'POS for local shops' },
  { prefix: 'Live', text: 'SukiSuite' },
  { prefix: 'Experimental', text: 'AI Playground' },
];

export default function Marquee() {
  const container = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 35s linear infinite;
        }
        .marquee-track.paused {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
      <section
        id="live-marquee"
        ref={container}
        className="relative w-full cursor-default overflow-hidden border-y border-white/5 bg-white/[0.01] py-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`marquee-track flex w-max items-center whitespace-nowrap${paused ? ' paused' : ''}`}>
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
    </>
  );
}
