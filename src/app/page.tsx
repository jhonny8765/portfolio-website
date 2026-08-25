import React from 'react';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AiStateManager from '@/components/AiStateManager';

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center w-full overflow-x-hidden selection:bg-[var(--color-violet)] selection:text-white relative">
      {/* Background gradients for Dark Obsidian / Electric Violet theme */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[var(--bg-primary)]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-violet)]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-violet)]/10 rounded-full blur-[120px]"></div>
      </div>

      <AiStateManager>
        <Projects />
        <Services />
        <Skills />
        <Contact />
      </AiStateManager>

      <Footer />
    </main>
  );
}
