import React from 'react';
import { FileSignature } from 'lucide-react';

export default function ResumeService() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="glass-panel text-center max-w-4xl mx-auto py-16 px-8 rounded-[40px] reveal relative overflow-hidden">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[var(--color-accent-glow)] to-transparent opacity-20 pointer-events-none" />

          <div className="inline-flex p-4 rounded-3xl bg-white/[0.03] border border-white/10 mb-8 text-[var(--color-text-primary)] shadow-lg relative z-10">
            <FileSignature size={36} />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-medium mb-6 relative z-10 tracking-tight">
            Need a <span className="text-strong">Resume That Gets Noticed?</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed relative z-10">
            Beyond development and automation, I help professionals stand out. Get your career materials polished by someone who understands what hiring managers and automated systems (ATS) look for.
          </p>
          
          <div className="flex gap-3 justify-center flex-wrap mb-12 relative z-10">
            {['Resume', 'CV', 'Cover Letter', 'LinkedIn Profile', 'Complete Package'].map(item => (
              <span key={item} className="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-full text-sm text-[var(--color-text-secondary)] font-medium">
                {item}
              </span>
            ))}
          </div>

          <a href="#contact" className="relative z-10 inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-base transition-all duration-500 bg-[var(--color-text-primary)] text-[var(--color-bg-main)] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Request Resume Services
          </a>
        </div>
      </div>
    </section>
  );
}
