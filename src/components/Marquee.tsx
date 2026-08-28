'use client';

import React, { useState } from 'react';

const marqueeItems = [
  { prefix: 'Building', text: 'Kidapawan delivery app' },
  { prefix: 'Learning', text: 'Gemini token optimization' },
  { prefix: 'Next', text: 'POS for local shops' },
  { prefix: 'Live', text: 'SukiSuite' },
  { prefix: 'Experimental', text: 'AI Playground' },
];

function MarqueeRow() {
  return (
    <div className="flex items-center gap-8 px-4">
      {marqueeItems.map((item, i) => (
        <React.Fragment key={i}>
          <span className="flex items-center gap-3 font-sans text-xl font-medium tracking-wide text-white/60 md:text-3xl">
            <span className="font-bold text-[var(--color-volt)]/80">{item.prefix}</span>
            <span>&middot;</span>
            {item.text}
          </span>
          <span className="mx-4 px-2 font-bold text-[var(--color-volt)]/50">&middot;</span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Marquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      id="live-marquee"
      className="relative w-full cursor-default overflow-hidden border-y border-white/5 bg-white/[0.01] py-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Two identical copies inside one animated container — CSS moves by -50% for a seamless loop */}
      <div
        className={`marquee-animate flex w-max items-center whitespace-nowrap${paused ? 'marquee-paused' : ''}`}
      >
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </section>
  );
}
