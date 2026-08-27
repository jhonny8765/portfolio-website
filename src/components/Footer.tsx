import React from 'react';
import { portfolioData } from '@/data/portfolioData';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 mt-auto py-8">
      <div className="max-w-5xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-[var(--text-secondary)] text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--color-volt)] flex items-center justify-center font-mono font-bold text-[10px] text-white">
            JC
          </div>
          <span>&copy; {new Date().getFullYear()} {portfolioData.identity.name}. All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href={portfolioData.identity.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
