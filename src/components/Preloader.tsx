'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import Image from 'next/image';

export default function Preloader() {
  // Mount-gated: SSR emits NO preloader markup at all. The overlay only mounts
  // post-hydration when the browser can actually animate it away — so a no-JS
  // (or failed-JS) visitor is never trapped behind a stuck full-screen overlay,
  // and no <noscript> hack is required.
  const [shouldRender, setShouldRender] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Decide client-side whether to show (desktop only, once per session, motion allowed)
  useEffect(() => {
    if (pathname !== '/') return;

    const hasSeen = sessionStorage.getItem('hasSeenPreloader');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Skip on mobile — the animation is a desktop flourish and costs ~1.2s LCP on small screens.
    // Use matchMedia, not innerWidth — innerWidth can read 0 at hydration on some renderers.
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (hasSeen || prefersReducedMotion || isMobile) return;

    // rAF-deferred to avoid synchronous setState inside the effect body.
    const raf = requestAnimationFrame(() => setShouldRender(true));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Run the boot animation only once the overlay exists in the DOM.
  useEffect(() => {
    if (!shouldRender) return;

    // Lock scroll during preloader
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('hasSeenPreloader', 'true');
          document.body.style.overflow = '';
          setShouldRender(false);
        },
      });

      // Simple boot sequence animation — hard-capped at ~950ms total.
      // The old ~3s version directly inflated the desktop LCP measurement,
      // since the overlay obscured the page while it played.
      tl.to('.boot-text', {
        opacity: 1,
        duration: 0.08,
        stagger: 0.06,
        ease: 'none',
      })
        .to({}, { duration: 0.05 }) // beat before the wipe
        .to(container.current, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', // wipes up
          duration: 0.4,
          ease: 'power3.inOut',
        });
    }, container);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      ref={container}
      className="preloader-root fixed inset-0 z-[var(--z-preloader)] flex flex-col items-center justify-center bg-[var(--bg-primary)] font-mono text-[var(--color-volt)]"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
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
