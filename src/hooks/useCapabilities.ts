'use client';

import { useState, useEffect } from 'react';

export function useCapabilities() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touchQuery = window.matchMedia('(any-pointer: coarse)');

    // We update state asynchronously to avoid React warnings about sync setState in effects
    requestAnimationFrame(() => {
      setPrefersReducedMotion(mediaQuery.matches);
      setIsTouchDevice(
        touchQuery.matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      );
    });

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    const handleTouchChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    touchQuery.addEventListener('change', handleTouchChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      touchQuery.removeEventListener('change', handleTouchChange);
    };
  }, []);

  return { prefersReducedMotion, isTouchDevice };
}
