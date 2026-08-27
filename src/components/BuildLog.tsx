import React from 'react';
import Image from 'next/image';

const logItems = [
  {
    image: "/site-assets/floating/delivery-pin-cut.webp",
    label: "Currently Building",
    text: "A local delivery application for Kidapawan City. Driven by the growth of independent riders using Messenger, it features a web app for quick ordering and precise location-based deliveries.",
    color: "text-[var(--color-volt)]",
    bg: "bg-[var(--color-volt)]/10",
    border: "border-blue-400/20"
  },
  {
    image: "/site-assets/floating/chip-cut.webp",
    label: "Currently Learning",
    text: "Techniques and architectures to minimize token usage and optimize costs when building with the Gemini Pro API.",
    color: "text-[var(--color-volt)]",
    bg: "bg-[var(--color-volt)]/10",
    border: "border-emerald-400/20"
  },
  {
    image: "/site-assets/brand/preloader-glyph.webp",
    label: "Recent Experiment",
    text: "The AI Playground (/playground), an interactive testing environment to experiment with AI models and custom system prompts.",
    color: "text-[var(--color-volt)]",
    bg: "bg-[var(--color-volt)]/10",
    border: "border-[var(--color-volt)]/20"
  },
  {
    images: ["/site-assets/floating/pos-cut.webp", "/site-assets/floating/milk-tea-cut.webp"],
    label: "Next Up",
    text: "A Point of Sale (POS) system designed for easier business management, inspired by the growing number of milk tea shops in Kidapawan City.",
    color: "text-[var(--color-volt)]",
    bg: "bg-[var(--color-volt)]/10",
    border: "border-orange-400/20"
  }
];

export default function BuildLog() {
  return (
    <section className="w-full py-16">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          Build <span className="text-[var(--color-volt)]">Log</span>
        </h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
          A snapshot of what I&apos;m working on and exploring right now.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden border border-white/10 bg-[#0c0c0e] shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#151518]">
          <div className="flex gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono flex-1 text-center pr-12">
            ~/projects/status.sh
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 md:p-8 font-mono text-sm md:text-base space-y-8">
          {logItems.map((item, index) => {
            const opacityClass = ["opacity-100", "opacity-80 md:opacity-70", "opacity-60 md:opacity-50", "opacity-50 md:opacity-40"][index] || "opacity-100";
            return (
              <div key={index} className={`group ${opacityClass} hover:opacity-100 transition-opacity duration-300`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[var(--color-volt)]">jhonrey@system:</span>
                  <span className="text-blue-400">~/log</span>
                  <span className="text-white">$</span>
                  <span className="text-white ml-2">cat {item.label.toLowerCase().replace(' ', '_')}.txt</span>
                </div>
                <div className="pl-4 md:pl-0 border-l-2 md:border-l-0 border-[var(--color-volt)]/20 text-[var(--text-secondary)] leading-relaxed flex gap-4 mt-4">
                  <div className={`hidden md:flex w-16 h-16 rounded bg-white/5 border border-white/10 items-center justify-center shrink-0 group-hover:border-[var(--color-volt)]/30 group-hover:bg-[var(--color-volt)]/5 transition-all p-2 overflow-hidden`}>
                    {item.images ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image src={item.images[0]} alt="Log asset" width={36} height={36} className="object-contain -ml-1" />
                        <Image src={item.images[1]} alt="Log asset" width={36} height={36} className="object-contain ml-1" />
                      </div>
                    ) : (
                      item.image && <Image src={item.image} alt={item.label} width={48} height={48} className="object-contain" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-semibold inline-block mb-1">{item.label}</span>
                    <br />
                    {item.text}
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="flex items-center gap-2 mt-8 opacity-70">
            <span className="text-[var(--color-volt)]">jhonrey@system:</span>
            <span className="text-blue-400">~/log</span>
            <span className="text-white">$</span>
            <span className="w-2 h-4 bg-[var(--color-volt)] animate-pulse ml-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
