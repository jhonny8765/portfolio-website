import React from 'react';
import { Github, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] py-16 relative">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Jhon Rey Consolacion
          </h2>
          
          <div className="flex gap-8 flex-wrap justify-center">
            <a href="https://github.com/jhonny8765" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200">
              <Github size={20} /> GitHub
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200">
              <Facebook size={20} /> Facebook
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200">
              <Youtube size={20} /> YouTube
            </a>
          </div>

          <p className="text-[var(--color-text-tertiary)] text-sm mt-4">
            &copy; {new Date().getFullYear()} Jhon Rey Consolacion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
