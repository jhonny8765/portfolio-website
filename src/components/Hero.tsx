import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-0 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full z-10 pt-20">
        <div className="max-w-4xl relative reveal">
          <div className="inline-flex items-center px-5 py-2 mb-8 glass-panel rounded-full">
            <span className="text-[var(--color-text-secondary)] font-medium tracking-widest uppercase text-xs">
              Jhon Rey Consolacion
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8">
            <span className="text-strong">AI-Powered</span> <br />
            <span className="text-[var(--color-text-primary)]">Full-Stack Developer</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-12 max-w-2xl leading-relaxed">
            I engineer premium digital solutions—from high-performance web applications to intelligent SaaS platforms and business automation.
          </p>
          
          <div className="flex flex-wrap gap-4 reveal delay-1">
            <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-base transition-all duration-500 bg-[var(--color-text-primary)] text-[var(--color-bg-main)] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] gap-2">
              Let's Discuss Your Project <ArrowRight size={18} />
            </a>
            <a href="#portfolio" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-base transition-all duration-500 glass-panel hover:text-white">
              View My Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
