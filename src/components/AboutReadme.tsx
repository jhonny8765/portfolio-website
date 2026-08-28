import React from 'react';
import Image from 'next/image';
import AnimatedSection from './AnimatedSection';
import { portfolioData } from '@/data/portfolioData';

export default function AboutReadme() {
  return (
    <AnimatedSection id="about" className="flex w-full scroll-mt-24 flex-col">
      <div className="glass-panel relative overflow-hidden rounded-3xl p-8 sm:p-12">
        {/* Background Decorative Element */}
        <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-volt)]/5 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--color-volt)]/5 blur-[80px]" />

        <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Monogram Section */}
          <div className="flex flex-col items-center justify-center md:col-span-4 md:items-start lg:col-span-3">
            <div className="group relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-volt)]/20 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] p-4 shadow-[0_0_30px_rgba(232,245,74,0.1)] sm:h-56 sm:w-56">
              <div className="absolute inset-0 bg-[var(--color-volt)]/5 opacity-0 duration-500 motion-safe:transition-opacity motion-safe:group-hover:opacity-100" />
              <Image
                src="/site-assets/brand/monogram-jr-cut.webp"
                alt="Jhon Rey Consolacion Monogram"
                width={160}
                height={160}
                className="h-full w-full object-contain drop-shadow-[0_0_15px_rgba(232,245,74,0.2)] filter duration-700 ease-out motion-safe:transition-transform motion-safe:group-hover:scale-105"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center text-center md:col-span-8 md:text-left lg:col-span-9">
            <h2 className="mb-4 font-mono text-sm tracking-widest text-[var(--color-volt-light)] uppercase">
              README.md
            </h2>
            <h3 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              I&apos;m Jhon Rey Consolacion, an AI Developer & Automation Builder.
            </h3>

            <div className="mb-8 space-y-4 text-lg leading-relaxed text-[var(--text-secondary)]">
              {portfolioData.identity.shortBio}
            </div>

            <div className="relative rounded-xl border border-[var(--color-volt)]/20 bg-[var(--color-volt)]/5 p-6">
              <div className="absolute -top-3 left-6 bg-[var(--bg-primary)] px-2 font-mono text-xs tracking-widest text-[var(--color-volt-light)] uppercase">
                Fun Fact
              </div>
              <p className="text-[var(--text-secondary)]">
                No CS degree. I learned to build by shipping — every tool on this page was something
                I figured out mid-project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
