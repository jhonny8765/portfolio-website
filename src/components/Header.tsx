import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 pointer-events-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between backdrop-blur-md bg-black/40 border border-white/10 rounded-full px-6 py-3 pointer-events-auto shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center border border-[var(--color-accent)]/50">
            <span className="text-[var(--color-accent)] font-bold text-sm">JC</span>
          </div>
          <span className="font-semibold text-white tracking-tight hidden sm:block">Jhon Rey Consolacion</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#services" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Services</a>
          <a href="#portfolio" className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Case Studies</a>
        </nav>

        <a href="#contact" className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors pointer-events-auto">
          Book a Call
        </a>
      </div>
    </header>
  );
}
