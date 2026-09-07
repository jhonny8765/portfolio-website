'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { useCapabilities } from '@/hooks/useCapabilities';
import { isPageScrollLocked, subscribeToScrollLock } from '@/lib/scroll-lock';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const { prefersReducedMotion, hasFinePointer } = useCapabilities();
  const pathname = usePathname();

  useEffect(() => {
    // Touch keeps its native scrolling/overscroll; reduced motion never starts a smoothing loop.
    if (prefersReducedMotion || !hasFinePointer) return;

    const lenis = new Lenis({
      duration: 1,
      smoothWheel: true,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    const syncLock = () => {
      if (isPageScrollLocked()) lenis.stop();
      else lenis.start();
    };
    const unsubscribe = subscribeToScrollLock(syncLock);
    syncLock();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);

    return () => {
      unsubscribe();
      // Remove the SAME function that was registered, including in React Strict Mode.
      gsap.ticker.remove(tick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
    };
  }, [prefersReducedMotion, hasFinePointer]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <>{children}</>;
}
