import React from 'react';
import { portfolioData } from '@/data/portfolioData';

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 text-sm text-[var(--text-secondary)] sm:flex-row sm:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-volt)] font-mono text-[10px] font-bold text-white">
            JC
          </div>
          <span>
            &copy; {new Date().getFullYear()} {portfolioData.identity.name}. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={portfolioData.identity.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
          <a href="#contact" className="transition-colors hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
