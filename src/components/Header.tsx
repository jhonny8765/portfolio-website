'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TransitionLink as Link } from './TransitionLink';
import { Menu, X, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Magnetic } from './Magnetic';

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
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
        const closeBtn = menuRef.current?.querySelector(
          'button[aria-label="Close navigation menu"]',
        ) as HTMLElement;
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
      <header className="pointer-events-none fixed top-0 right-0 left-0 z-[var(--z-header)] px-4 py-4 sm:px-6">
        <div className="pointer-events-auto mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/10 bg-[#07080A]/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-6">
          <Magnetic strength={0.25}>
            <div className="flex cursor-pointer items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <Image
                  src="/site-assets/brand/monogram-jr-cut.webp"
                  alt="JR Logo"
                  width={24}
                  height={24}
                  className="object-contain opacity-90"
                />
              </div>
              <span className="hidden font-semibold tracking-tight text-white sm:block">
                Jhon Rey
              </span>
              <div className="ml-2 hidden items-center gap-1.5 rounded-full border border-[var(--color-volt)]/20 bg-[rgba(232,245,74,0.1)] px-2.5 py-1 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-volt)]"></span>
                <span className="text-[10px] font-semibold tracking-wider text-[var(--color-volt-light)] uppercase">
                  Available
                </span>
              </div>
            </div>
          </Magnetic>

          {/* Desktop Nav */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 text-sm font-medium md:flex"
          >
            <Magnetic strength={0.25}>
              <Link
                href="/#projects"
                className="text-[var(--text-secondary)] transition-colors hover:text-white"
              >
                Work
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link
                href="/#services"
                className="text-[var(--text-secondary)] transition-colors hover:text-white"
              >
                Services
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link
                href="/#skills"
                className="text-[var(--text-secondary)] transition-colors hover:text-white"
              >
                Skills
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link
                href="/playground"
                className="flex items-center gap-1.5 text-[var(--color-volt)] transition-colors hover:text-white"
              >
                <Sparkles size={14} /> Playground
              </Link>
            </Magnetic>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Magnetic strength={0.25}>
              <button
                onClick={onOpenAi}
                className="pointer-events-auto hidden items-center gap-2 rounded-full border border-[var(--color-volt)]/20 bg-[var(--color-volt)]/10 px-4 py-2 text-sm font-medium text-[var(--color-volt)] transition-all hover:bg-[var(--color-volt)] hover:text-[var(--color-bg)] md:flex"
              >
                <Image
                  src="/site-assets/brand/preloader-glyph.webp"
                  alt="Glyph"
                  width={16}
                  height={16}
                  className="object-contain opacity-70 brightness-0 invert transition-opacity group-hover:opacity-100"
                />
                Ask My AI
              </button>
            </Magnetic>

            <Magnetic strength={0.25}>
              <a
                href="#contact"
                className="pointer-events-auto flex min-h-[44px] items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-colors hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                Contact
              </a>
            </Magnetic>

            {/* Mobile Menu Trigger */}
            <button
              ref={triggerRef}
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="pointer-events-auto ml-1 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
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
          className="animate-in fade-in fixed inset-0 z-[var(--z-menu)] flex flex-col overflow-hidden bg-[var(--bg-primary)]/95 backdrop-blur-xl duration-200"
          style={{
            height: '100dvh',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-4 px-6">
            <h2 id="mobile-menu-title" className="text-xl font-bold tracking-tight text-white">
              Navigation
            </h2>
            <button
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white transition-colors hover:bg-white/10"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-12 overflow-y-auto px-6 py-8">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-6 text-center text-2xl font-medium"
            >
              <Link
                href="/#projects"
                onClick={closeMenu}
                className="inline-flex min-h-[44px] items-center justify-center text-white transition-colors hover:text-[var(--color-volt)]"
              >
                Work
              </Link>
              <Link
                href="/#services"
                onClick={closeMenu}
                className="inline-flex min-h-[44px] items-center justify-center text-white transition-colors hover:text-[var(--color-volt)]"
              >
                Services
              </Link>
              <Link
                href="/#skills"
                onClick={closeMenu}
                className="inline-flex min-h-[44px] items-center justify-center text-white transition-colors hover:text-[var(--color-volt)]"
              >
                Skills
              </Link>
              <Link
                href="/playground"
                onClick={closeMenu}
                className="flex min-h-[44px] items-center justify-center gap-2 text-[var(--color-volt)] transition-colors hover:text-white"
              >
                <Sparkles size={20} /> Playground
              </Link>
              <Link
                href="/#contact"
                onClick={closeMenu}
                className="mt-2 inline-flex min-h-[44px] items-center justify-center text-[var(--color-volt)] transition-colors hover:text-white"
              >
                Contact
              </Link>
            </nav>

            <div className="mx-auto mt-4 flex w-full max-w-sm flex-col gap-4">
              <button
                onClick={handleAskMyAiClick}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-volt)]/20 bg-[var(--color-volt)]/10 px-6 py-3 font-semibold text-[var(--color-volt)] transition-all hover:bg-[var(--color-volt)] hover:text-[var(--color-bg)]"
              >
                <Image
                  src="/site-assets/brand/preloader-glyph.webp"
                  alt="Glyph"
                  width={20}
                  height={20}
                  className="object-contain opacity-70 brightness-0 invert"
                />
                Ask My AI
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
