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

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center w-full overflow-x-hidden selection:bg-[var(--color-violet)] selection:text-white relative">
      {/* Background gradients for Dark Obsidian / Electric Violet theme */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[var(--bg-primary)]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-violet)]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-violet)]/10 rounded-full blur-[120px]"></div>
      </div>

      <AiStateManager>
        <div className="relative w-full">
          {/* Decorative Progress Line */}
          <div className="absolute -left-4 sm:-left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[var(--color-violet)]/20 to-transparent pointer-events-none hidden md:block" />
          
          <div className="flex flex-col gap-24 sm:gap-32 w-full">
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
