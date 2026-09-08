'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { useScrollLock } from '@/hooks/useScrollLock';
import { isPageScrollLocked } from '@/lib/scroll-lock';

export default function Preloader() {
  const [shouldRender, setShouldRender] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  useScrollLock(shouldRender);

  useEffect(() => {
    // An optional flourish must not crash the app when storage is blocked, or
    // interrupt visitors following a deep link or opening a dialog during load.
    try {
      if (sessionStorage.getItem('hasSeenPreloader') || location.hash || window.scrollY > 0) return;
    } catch {
      return;
    }
    const frame = requestAnimationFrame(() => {
      if (isPageScrollLocked() || window.scrollY > 0) return;
      try {
        // Mark admission, not completion: an interrupted animation won't replay.
        sessionStorage.setItem('hasSeenPreloader', 'true');
      } catch {
        return;
      }
      setShouldRender(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!shouldRender) return;
    const finish = () => setShouldRender(false);
    const failsafe = setTimeout(finish, 1500);
    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: finish })
        .to('.boot-text', { opacity: 1, duration: 0.08, stagger: 0.06, ease: 'none' })
        .to(container.current, {
          yPercent: -100,
          duration: 0.35,
          ease: 'power3.inOut',
        });
    }, container);
    return () => {
      clearTimeout(failsafe);
      ctx.revert();
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      ref={container}
      className="preloader-root fixed inset-0 z-[var(--z-preloader)] flex flex-col items-center justify-center bg-[var(--bg-primary)] font-mono text-[var(--color-volt)]"
      aria-hidden="true"
    >
      {/* Decorative grain for the preloader itself */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{ backgroundImage: 'url(/site-assets/overlays/grain.svg)' }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
        style={{ backgroundImage: 'url(/site-assets/overlays/scanlines.svg)' }}
      />

      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="boot-text mb-10 flex justify-center opacity-0">
          <Image
            src="/site-assets/brand/preloader-glyph.webp"
            alt="System Glyph"
            width={80}
            height={80}
            className="object-contain opacity-90 drop-shadow-[0_0_15px_rgba(232,245,74,0.3)]"
            priority
          />
        </div>
        <div className="boot-text mb-6 flex items-center gap-2 border-b border-[var(--color-volt)]/20 pb-2 opacity-0">
          <Image
            src="/site-assets/brand/preloader-glyph.webp"
            alt="System Glyph"
            width={16}
            height={16}
            className="object-contain opacity-80"
          />
          <span className="text-sm tracking-widest text-white/80 uppercase">build-console.sh</span>
        </div>

        <div className="space-y-3 text-sm md:text-base">
          <div className="boot-text flex gap-4 opacity-0">
            <span className="opacity-50">[0.00]</span>{' '}
            <span className="text-[var(--text-secondary)]">Initializing kernel...</span>
          </div>
          <div className="boot-text flex gap-4 opacity-0">
            <span className="opacity-50">[0.12]</span>{' '}
            <span className="text-[var(--text-secondary)]">Mounting neural interface...</span>
          </div>
          <div className="boot-text flex gap-4 opacity-0">
            <span className="opacity-50">[0.34]</span>{' '}
            <span className="text-[var(--text-secondary)]">Loading portfolio data...</span>
          </div>
          <div className="boot-text flex gap-4 opacity-0">
            <span className="opacity-50">[0.89]</span>{' '}
            <span className="text-[var(--text-secondary)]">Compiling visual assets...</span>
          </div>
          <div className="boot-text flex gap-4 opacity-0">
            <span className="opacity-50">[1.04]</span>{' '}
            <span className="text-white">System ready.</span>
          </div>
        </div>

        <div className="boot-text mt-8 flex items-center opacity-0">
          <span className="mr-2 text-sm text-[var(--color-volt)]">user@system:~$</span>
          <span className="h-4 w-2 animate-pulse bg-[var(--color-volt)]" />
        </div>
      </div>
    </div>
  );
}
