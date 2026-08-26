'use client';

import React from 'react';
import AnimatedSection from './AnimatedSection';
import { portfolioData } from '@/data/portfolioData';
import { Layers } from 'lucide-react';

export default function Skills() {
  return (
    <AnimatedSection id="skills" className="w-full flex flex-col gap-10 scroll-mt-24">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          <Layers className="text-[var(--color-violet)]" />
          Technical Arsenal
        </h2>
        <p className="text-[var(--text-secondary)] text-lg">Tools and technologies I use to build products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col gap-5">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            Active Building With
          </h3>
          <div className="flex flex-wrap gap-3">
            {portfolioData.skills.active.map((skill) => (
              <span key={skill} className="px-4 py-2 rounded-lg bg-[var(--color-violet)]/10 border border-[var(--color-violet)]/20 text-white font-medium shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col gap-5">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
            Currently Exploring
          </h3>
          <div className="flex flex-wrap gap-3">
            {portfolioData.skills.exploring.map((skill) => (
              <span key={skill} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[var(--text-secondary)] font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
