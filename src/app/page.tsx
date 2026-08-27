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
import AnimatedBackground from '@/components/AnimatedBackground';
import Marquee from '@/components/Marquee';
import AboutReadme from '@/components/AboutReadme';

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center w-full overflow-x-hidden selection:bg-[var(--color-volt)] selection:text-white relative">
      <AnimatedBackground />

      <AiStateManager>
        <div className="relative w-full">
          {/* Decorative Progress Line */}
          <div className="absolute -left-4 sm:-left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[var(--color-volt)]/20 to-transparent pointer-events-none hidden md:block" />
          
          <div className="flex flex-col gap-24 sm:gap-32 w-full">
            <Marquee />
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
