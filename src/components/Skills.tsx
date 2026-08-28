'use client';

import React from 'react';
import AnimatedSection from './AnimatedSection';
import { portfolioData } from '@/data/portfolioData';
import Image from 'next/image';
import { Magnetic } from './Magnetic';

export default function Skills() {
  return (
    <AnimatedSection id="skills" className="flex w-full scroll-mt-32 flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="flex items-center gap-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <Image
            src="/site-assets/floating/chip-cut.webp"
            alt="Chip logic"
            width={48}
            height={48}
            className="object-contain drop-shadow-lg"
          />
          Technical Arsenal
        </h2>
        <p className="text-lg text-[var(--text-secondary)]">
          Credential-backed capabilities I use to build products.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Magnetic strength={0.2}>
          <div className="glass-panel flex cursor-default flex-col gap-5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-volt)]/30 hover:bg-white/[0.05] hover:shadow-[0_10px_30px_-15px_rgba(232,245,74,0.2)] sm:p-8">
            <h3 className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              Active Building With
            </h3>
            <div className="flex flex-wrap gap-3">
              {portfolioData.skills.active.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-[var(--color-volt)]/20 bg-[var(--color-volt)]/10 px-4 py-2 font-medium text-white shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Magnetic>

        <Magnetic strength={0.2}>
          <div className="glass-panel flex cursor-default flex-col gap-5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] sm:p-8">
            <h3 className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
              Currently Exploring
            </h3>
            <div className="flex flex-wrap gap-3">
              {portfolioData.skills.exploring.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-medium text-[var(--text-secondary)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Magnetic>
      </div>
    </AnimatedSection>
  );
}
