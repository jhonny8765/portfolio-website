import React from 'react';
import Image from 'next/image';
import AnimatedSection from './AnimatedSection';
import { portfolioData } from '@/data/portfolioData';

export default function AboutReadme() {
  return (
    <AnimatedSection id="about" className="w-full flex flex-col scroll-mt-24">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-volt)]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--color-volt)]/5 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
          
          {/* Monogram Section */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center md:items-start justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 relative rounded-2xl overflow-hidden border border-[var(--color-volt)]/20 shadow-[0_0_30px_rgba(232,245,74,0.1)] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] p-4 flex items-center justify-center group">
              <div className="absolute inset-0 bg-[var(--color-volt)]/5 opacity-0 motion-safe:group-hover:opacity-100 motion-safe:transition-opacity duration-500" />
              <Image 
                src="/site-assets/brand/monogram-jr-cut.webp" 
                alt="Jhon Rey Consolacion Monogram" 
                width={160} 
                height={160}
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(232,245,74,0.2)] motion-safe:group-hover:scale-105 motion-safe:transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center text-center md:text-left">
            <h2 className="text-sm font-mono text-[var(--color-volt-light)] tracking-widest uppercase mb-4">
              README.md
            </h2>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              I&apos;m Jhon Rey Consolacion, an AI Developer & Automation Builder.
            </h3>
            
            <div className="space-y-4 text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
                {portfolioData.identity.shortBio}
            </div>
            
            <div className="p-6 border border-[var(--color-volt)]/20 rounded-xl bg-[var(--color-volt)]/5 relative">
              <div className="absolute -top-3 left-6 bg-[var(--bg-primary)] px-2 text-xs font-mono text-[var(--color-volt-light)] uppercase tracking-widest">
                Fun Fact
              </div>
              <p className="text-[var(--text-secondary)]">
                No CS degree. I learned to build by shipping — every tool on this page was something I figured out mid-project.
              </p>
            </div>

          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

