'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Terminal, Menu, X, FileText, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenAi: () => void;
}

export default function Header({ onOpenAi }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Prevent background scrolling when open
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeMenu();
          return;
        }
        
        if (e.key === 'Tab' && menuRef.current) {
          const focusableElements = menuRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      // Move focus into the menu (specifically the close button)
      setTimeout(() => {
        const closeBtn = menuRef.current?.querySelector('button[aria-label="Close navigation menu"]') as HTMLElement;
        closeBtn?.focus();
      }, 50);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else if (previousFocusRef.current) {
      // Restore focus to the hamburger button when closed
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isMenuOpen]);

  const handleAskMyAiClick = () => {
    closeMenu();
    // Use timeout to prevent AskMyAI modal and Mobile menu from overlapping/focus clashing
    setTimeout(() => {
      onOpenAi();
    }, 100);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 py-4 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between glass-panel rounded-full px-4 sm:px-6 py-3 pointer-events-auto shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-violet)] flex items-center justify-center font-mono font-bold text-sm shadow-[0_0_15px_var(--color-violet)] text-white">
              JC
            </div>
            <span className="font-semibold tracking-tight hidden sm:block text-white">Jhon Rey</span>
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-[rgba(139,92,246,0.1)] border border-[var(--color-violet)]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-violet)] animate-pulse"></span>
              <span className="text-[10px] uppercase font-semibold text-[var(--color-violet-light)] tracking-wider">Available</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/#projects" className="text-[var(--text-secondary)] hover:text-white transition-colors">Work</Link>
            <Link href="/#services" className="text-[var(--text-secondary)] hover:text-white transition-colors">Services</Link>
            <Link href="/#skills" className="text-[var(--text-secondary)] hover:text-white transition-colors">Skills</Link>
            <Link href="/playground" className="flex items-center gap-1.5 text-[var(--color-violet-light)] hover:text-white transition-colors">
              <Sparkles size={14} /> Playground
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={onOpenAi}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-violet)]/10 text-[var(--color-violet-light)] border border-[var(--color-violet)]/20 hover:bg-[var(--color-violet)] hover:text-white transition-all text-sm font-medium pointer-events-auto"
            >
              <Terminal size={14} aria-hidden="true" />
              Ask My AI
            </button>
            

            <a href="#contact" className="px-5 py-2 min-h-[44px] flex items-center rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors pointer-events-auto shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              Contact
            </a>

            {/* Mobile Menu Trigger */}
            <button
              ref={triggerRef}
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 pointer-events-auto transition-colors ml-1"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-primary)]/95 backdrop-blur-xl overflow-hidden animate-in fade-in duration-200"
          style={{ 
            height: '100dvh',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
        >
          <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 shrink-0">
            <h2 id="mobile-menu-title" className="text-xl font-bold text-white tracking-tight">Navigation</h2>
            <button 
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col justify-center gap-12">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-6 text-2xl font-medium text-center">
              <Link href="/#projects" onClick={closeMenu} className="text-white hover:text-[var(--color-violet-light)] transition-colors inline-flex min-h-[44px] items-center justify-center">Work</Link>
              <Link href="/#services" onClick={closeMenu} className="text-white hover:text-[var(--color-violet-light)] transition-colors inline-flex min-h-[44px] items-center justify-center">Services</Link>
              <Link href="/#skills" onClick={closeMenu} className="text-white hover:text-[var(--color-violet-light)] transition-colors inline-flex min-h-[44px] items-center justify-center">Skills</Link>
              <Link href="/playground" onClick={closeMenu} className="flex items-center justify-center gap-2 text-[var(--color-violet-light)] hover:text-white transition-colors min-h-[44px]">
                <Sparkles size={20} /> Playground
              </Link>
              <Link href="/#contact" onClick={closeMenu} className="text-[var(--color-violet-light)] hover:text-white transition-colors inline-flex min-h-[44px] items-center justify-center mt-2">Contact</Link>
            </nav>

            <div className="flex flex-col gap-4 mt-4 w-full max-w-sm mx-auto">
              <button 
                onClick={handleAskMyAiClick}
                className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[var(--color-violet)]/10 text-[var(--color-violet-light)] border border-[var(--color-violet)]/20 hover:bg-[var(--color-violet)] hover:text-white transition-all font-semibold flex items-center justify-center gap-2"
              >
                <Terminal size={18} aria-hidden="true" />
                Ask My AI
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
