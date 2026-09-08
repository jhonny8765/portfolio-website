'use client';

import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';

const marqueeItems = [
  { prefix: 'Building', text: 'Kidapawan delivery app' },
  { prefix: 'Learning', text: 'Gemini token optimization' },
  { prefix: 'Next', text: 'POS for local shops' },
  { prefix: 'Live', text: 'SukiSuite' },
  { prefix: 'Experimental', text: 'AI Playground' },
];

function MarqueeRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className="marquee-row flex shrink-0 items-center gap-8 px-4"
      aria-hidden={duplicate || undefined}
    >
      {marqueeItems.map((item) => (
        <React.Fragment key={item.prefix}>
          <span className="flex items-center gap-3 font-sans text-xl font-medium tracking-wide text-white/60 md:text-3xl">
            <span className="font-bold text-[var(--color-volt)]/80">{item.prefix}</span>
            <span aria-hidden="true">&middot;</span>
            {item.text}
          </span>
          <span
            aria-hidden="true"
            className="marquee-separator mx-4 px-2 font-bold text-[var(--color-volt)]/50"
          >
            &middot;
          </span>
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
      aria-label="Current work and updates"
      className="marquee relative w-full cursor-default overflow-hidden border-y border-white/5 bg-white/[0.01] py-6"
    >
      <div
        className={`marquee-animate flex w-max items-center whitespace-nowrap ${paused ? 'marquee-paused' : ''}`}
      >
        <MarqueeRow />
        <MarqueeRow duplicate />
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? 'Resume live updates' : 'Pause live updates'}
        className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[var(--color-bg)] text-[var(--color-volt)] shadow-lg transition-colors hover:bg-[var(--color-bg-alt)] motion-reduce:hidden"
      >
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </section>
  );
}
