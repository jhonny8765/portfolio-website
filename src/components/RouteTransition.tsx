'use client';

import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useCapabilities } from '@/hooks/useCapabilities';
import { lockPageScroll } from '@/lib/scroll-lock';

const TransitionContext = createContext<((navigate: () => void) => void) | null>(null);

export function useRouteTransition() {
  return useContext(TransitionContext);
}

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { prefersReducedMotion } = useCapabilities();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef(false);
  const navigationRef = useRef<(() => void) | null>(null);
  const releaseScrollRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    navigationRef.current = null;
    pendingRef.current = false;
    releaseScrollRef.current?.();
    releaseScrollRef.current = null;
    if (overlayRef.current) {
      gsap.killTweensOf(overlayRef.current);
      gsap.set(overlayRef.current, {
        y: 0,
        yPercent: 100,
        autoAlpha: 0,
        pointerEvents: 'none',
      });
    }
  }, []);

  const runNavigation = useCallback(() => {
    const navigate = navigationRef.current;
    navigationRef.current = null;
    navigate?.();
  }, []);

  const begin = useCallback(
    (navigate: () => void) => {
      const overlay = overlayRef.current;
      if (!overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        navigate();
        return;
      }
      if (pendingRef.current) return; // A double-click must not push two history entries.

      pendingRef.current = true;
      navigationRef.current = navigate;
      releaseScrollRef.current = lockPageScroll();
      gsap.killTweensOf(overlay);
      gsap.set(overlay, { y: 0, yPercent: 100, autoAlpha: 1, pointerEvents: 'auto' });
      gsap.to(overlay, {
        yPercent: 0,
        duration: 0.28,
        ease: 'power3.inOut',
        onComplete: runNavigation,
      });

      // Start the failsafe on CLICK, not only after a route commits. A slow or
      // failed navigation must never strand the visitor behind a full-screen wipe.
      timeoutRef.current = setTimeout(() => {
        runNavigation();
        reset();
      }, 2500);
    },
    [reset, runNavigation],
  );

  useEffect(() => {
    if (!pendingRef.current) return; // No wipe on initial load, hashes, or browser back.
    if (prefersReducedMotion) {
      runNavigation();
      reset();
      return;
    }
    gsap.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.35,
      ease: 'power3.inOut',
      overwrite: true,
      onComplete: reset,
    });
  }, [pathname, prefersReducedMotion, reset, runNavigation]);

  useEffect(() => {
    window.addEventListener('pagehide', reset);
    return () => {
      window.removeEventListener('pagehide', reset);
      reset();
    };
  }, [reset]);

  return (
    <TransitionContext.Provider value={begin}>
      <div
        ref={overlayRef}
        id="page-transition-overlay"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[var(--z-preloader)] bg-[var(--color-volt)]"
        // GSAP exclusively owns transform. Tailwind v4's translate utility is a
        // separate CSS property and used to add a second, incorrect translation.
        style={{ transform: 'translateY(100%)', visibility: 'hidden' }}
      />
      {children}
    </TransitionContext.Provider>
  );
}
