import React from 'react';
import Image from 'next/image';

const logItems = [
  {
    image: '/site-assets/floating/delivery-pin-cut.webp',
    label: 'Currently Building',
    text: 'A local delivery application for Kidapawan City. Driven by the growth of independent riders using Messenger, it features a web app for quick ordering and precise location-based deliveries.',
    color: 'text-[var(--color-volt)]',
    bg: 'bg-[var(--color-volt)]/10',
    border: 'border-blue-400/20',
  },
  {
    image: '/site-assets/floating/chip-cut.webp',
    label: 'Currently Learning',
    text: 'Techniques and architectures to minimize token usage and optimize costs when building with the Gemini Pro API.',
    color: 'text-[var(--color-volt)]',
    bg: 'bg-[var(--color-volt)]/10',
    border: 'border-emerald-400/20',
  },
  {
    image: '/site-assets/brand/preloader-glyph.webp',
    label: 'Recent Experiment',
    text: 'The AI Playground (/playground), an interactive testing environment to experiment with AI models and custom system prompts.',
    color: 'text-[var(--color-volt)]',
    bg: 'bg-[var(--color-volt)]/10',
    border: 'border-[var(--color-volt)]/20',
  },
  {
    images: ['/site-assets/floating/pos-cut.webp', '/site-assets/floating/milk-tea-cut.webp'],
    label: 'Next Up',
    text: 'A Point of Sale (POS) system designed for easier business management, inspired by the growing number of milk tea shops in Kidapawan City.',
    color: 'text-[var(--color-volt)]',
    bg: 'bg-[var(--color-volt)]/10',
    border: 'border-orange-400/20',
  },
];

export default function BuildLog() {
  return (
    <section className="w-full py-16">
      <div className="mb-12 text-center md:text-left">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Build <span className="text-[var(--color-volt)]">Log</span>
        </h2>
        <p className="max-w-2xl text-lg text-[var(--text-secondary)]">
          A snapshot of what I&apos;m working on and exploring right now.
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-[#0c0c0e] shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center border-b border-white/10 bg-[#151518] px-4 py-3">
          <div className="mr-4 flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="flex-1 pr-12 text-center font-mono text-xs text-[var(--text-secondary)]">
            ~/projects/status.sh
          </div>
        </div>

        {/* Terminal Body */}
        <div className="space-y-8 p-6 font-mono text-sm md:p-8 md:text-base">
          {logItems.map((item, index) => {
            const opacityClass =
              [
                'opacity-100',
                'opacity-80 md:opacity-70',
                'opacity-60 md:opacity-50',
                'opacity-50 md:opacity-40',
              ][index] || 'opacity-100';
            return (
              <div
                key={index}
                className={`group ${opacityClass} transition-opacity duration-300 hover:opacity-100`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[var(--color-volt)]">jhonrey@system:</span>
                  <span className="text-blue-400">~/log</span>
                  <span className="text-white">$</span>
                  <span className="ml-2 text-white">
                    cat {item.label.toLowerCase().replace(' ', '_')}.txt
                  </span>
                </div>
                <div className="mt-4 flex gap-4 border-l-2 border-[var(--color-volt)]/20 pl-4 leading-relaxed text-[var(--text-secondary)] md:border-l-0 md:pl-0">
                  <div
                    className={`hidden h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-white/10 bg-white/5 p-2 transition-all group-hover:border-[var(--color-volt)]/30 group-hover:bg-[var(--color-volt)]/5 md:flex`}
                  >
                    {item.images ? (
                      <div className="relative flex h-full w-full items-center justify-center">
                        <Image
                          src={item.images[0]}
                          alt="Log asset"
                          width={36}
                          height={36}
                          className="-ml-1 object-contain"
                        />
                        <Image
                          src={item.images[1]}
                          alt="Log asset"
                          width={36}
                          height={36}
                          className="ml-1 object-contain"
                        />
                      </div>
                    ) : (
                      item.image && (
                        <Image
                          src={item.image}
                          alt={item.label}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      )
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="mb-1 inline-block font-semibold text-white">{item.label}</span>
                    <br />
                    {item.text}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-8 flex items-center gap-2 opacity-70">
            <span className="text-[var(--color-volt)]">jhonrey@system:</span>
            <span className="text-blue-400">~/log</span>
            <span className="text-white">$</span>
            <span className="ml-2 h-4 w-2 animate-pulse bg-[var(--color-volt)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
