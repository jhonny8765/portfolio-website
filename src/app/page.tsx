import React from 'react';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AiStateManager from '@/components/AiStateManager';
import PlaygroundTeaser from '@/components/PlaygroundTeaser';
import HowIBuild from '@/components/HowIBuild';
import BuildLog from '@/components/BuildLog';
import AboutReadme from '@/components/AboutReadme';

export default function Home() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen w-full flex-col items-center overflow-x-hidden selection:bg-[var(--color-volt)] selection:text-white"
    >
      <AiStateManager>
        <div className="relative w-full">
          {/* Decorative Progress Line */}
          <div className="pointer-events-none absolute top-0 bottom-0 -left-4 hidden w-[2px] bg-gradient-to-b from-transparent via-[var(--color-volt)]/20 to-transparent sm:-left-8 md:block" />

          <div className="flex w-full flex-col gap-24 sm:gap-32">
            <AboutReadme />
            <BuildLog />
            <HowIBuild />
            <Projects />
            <PlaygroundTeaser />
            <Services />
            <Skills />
            <Contact />
          </div>
        </div>
      </AiStateManager>

      <Footer />
    </main>
  );
}
