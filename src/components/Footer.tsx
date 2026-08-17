import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] py-16 relative">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Jhon Rey Consolacion
          </h2>
          
          <div className="flex gap-8 flex-wrap justify-center font-medium">
            <a href="https://github.com/jhonny8765" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:-translate-y-0.5 transition-all duration-200">
              GitHub
            </a>
            <a href="https://linkedin.com/in/#" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:-translate-y-0.5 transition-all duration-200">
              LinkedIn
            </a>
            <a href="https://wa.me/#" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:-translate-y-0.5 transition-all duration-200">
              WhatsApp
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
