'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCapabilities } from '@/hooks/useCapabilities';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
}

export function Magnetic({ children, strength = 0.3 }: MagneticProps) {
  const magneticRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion, isTouchDevice } = useCapabilities();

  useEffect(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    const element = magneticRef.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(element, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

    // Cache the element's UN-transformed center once per hover. Reading
    // getBoundingClientRect() inside every mousemove forces a layout query per
    // event (~120/sec); the rect only changes on scroll/resize, so invalidate there.
    // gsap x/y is subtracted because getBoundingClientRect() includes the active
    // magnetic transform (it would otherwise look like the center was drifting).
    let cachedCenter: { x: number; y: number } | null = null;

    const readCenter = () => {
      const rect = element.getBoundingClientRect();
      cachedCenter = {
        x: rect.left + rect.width / 2 - (Number(gsap.getProperty(element, 'x')) || 0),
        y: rect.top + rect.height / 2 - (Number(gsap.getProperty(element, 'y')) || 0),
      };
    };

    const invalidate = () => {
      cachedCenter = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cachedCenter) readCenter();
      if (!cachedCenter) return;
      const x = (e.clientX - cachedCenter.x) * strength;
      const y = (e.clientY - cachedCenter.y) * strength;
      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      invalidate();
      xTo(0);
      yTo(0);
    };

    element.addEventListener('mouseenter', readCenter, { passive: true });
    element.addEventListener('mousemove', handleMouseMove as EventListener, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave as EventListener, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true, capture: true });
    window.addEventListener('resize', invalidate, { passive: true });

    return () => {
      element.removeEventListener('mouseenter', readCenter);
      element.removeEventListener('mousemove', handleMouseMove as EventListener);
      element.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      window.removeEventListener('scroll', invalidate, { capture: true } as EventListenerOptions);
      window.removeEventListener('resize', invalidate);
    };
  }, [prefersReducedMotion, isTouchDevice, strength]);

  return React.cloneElement(children, { ref: magneticRef } as React.HTMLAttributes<HTMLElement> & {
    ref: React.Ref<HTMLElement>;
  });
}
