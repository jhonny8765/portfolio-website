'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import Image from 'next/image';

export default function Preloader() {
  const [shouldRender, setShouldRender] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const textContainer = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldRender(false);
      return;
    }

    // Check if already seen in this session
    const hasSeen = sessionStorage.getItem('hasSeenPreloader');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Skip on mobile — the animation is a desktop flourish and costs ~1.2s LCP on small screens.
    // Use matchMedia, not innerWidth — innerWidth can read 0 at hydration on some renderers.
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    
    if (hasSeen || prefersReducedMotion || isMobile) {
      setShouldRender(false);
      return;
    }

    // Lock scroll during preloader
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('hasSeenPreloader', 'true');
          document.body.style.overflow = '';
          setShouldRender(false);
        }
      });

      // Simple boot sequence animation
      tl.to('.boot-text', {
        opacity: 1,
        duration: 0.1,
        stagger: 0.2,
        ease: 'none'
      })
      .to({}, { duration: 0.4 }) // pause
      .to(container.current, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', // wipes up
        duration: 1,
        ease: 'power3.inOut'
      });

    }, container);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [pathname]);

  if (!shouldRender) return null;

  return (
    <div 
      ref={container}
      className="preloader-root fixed inset-0 z-[var(--z-preloader)] bg-[var(--bg-primary)] flex flex-col justify-center items-center text-[var(--color-volt)] font-mono"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      {/* Decorative grain for the preloader itself */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'url(/site-assets/overlays/grain.svg)' }} />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'url(/site-assets/overlays/scanlines.svg)' }} />
      
      <div className="relative z-10 w-full max-w-2xl px-6" ref={textContainer}>
        <div className="flex justify-center mb-10 opacity-0 boot-text">
          <Image src="/site-assets/brand/preloader-glyph.webp" alt="System Glyph" width={80} height={80} className="object-contain opacity-90 drop-shadow-[0_0_15px_rgba(232,245,74,0.3)]" priority />
        </div>
        <div className="flex items-center gap-2 mb-6 opacity-0 boot-text border-b border-[var(--color-volt)]/20 pb-2">
          <Image src="/site-assets/brand/preloader-glyph.webp" alt="System Glyph" width={16} height={16} className="object-contain opacity-80" />
          <span className="text-sm tracking-widest uppercase text-white/80">build-console.sh</span>
        </div>
        
        <div className="space-y-3 text-sm md:text-base">
          <div className="opacity-0 boot-text flex gap-4"><span className="opacity-50">[0.00]</span> <span className="text-[var(--text-secondary)]">Initializing kernel...</span></div>
          <div className="opacity-0 boot-text flex gap-4"><span className="opacity-50">[0.12]</span> <span className="text-[var(--text-secondary)]">Mounting neural interface...</span></div>
          <div className="opacity-0 boot-text flex gap-4"><span className="opacity-50">[0.34]</span> <span className="text-[var(--text-secondary)]">Loading portfolio data...</span></div>
          <div className="opacity-0 boot-text flex gap-4"><span className="opacity-50">[0.89]</span> <span className="text-[var(--text-secondary)]">Compiling visual assets...</span></div>
          <div className="opacity-0 boot-text flex gap-4"><span className="opacity-50">[1.04]</span> <span className="text-white">System ready.</span></div>
        </div>

        <div className="mt-8 opacity-0 boot-text flex items-center">
          <span className="text-sm mr-2 text-[var(--color-volt)]">user@system:~$</span>
          <span className="w-2 h-4 bg-[var(--color-volt)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
