'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCapabilities } from '@/hooks/useCapabilities';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isTouchDevice } = useCapabilities();

  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    // quickTo-created tweeners are allocated ONCE and reused per move —
    // the previous gsap.to() allocated 2 tween objects per pointer event
    // (~120/sec), which was GC churn on the main thread during interaction.
    const cursorXTo = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
    const cursorYTo = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });
    const followerXTo = gsap.quickTo(follower, 'x', { duration: 0.5, ease: 'power2.out' });
    const followerYTo = gsap.quickTo(follower, 'y', { duration: 0.5, ease: 'power2.out' });

    const onPointerMove = (e: PointerEvent) => {
      cursorXTo(e.clientX);
      cursorYTo(e.clientY);
      followerXTo(e.clientX);
      followerYTo(e.clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Handle interactive elements (hover states)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer');

      if (isClickable) {
        gsap.to(cursor, { scale: 1.5, opacity: 0.5, duration: 0.2 });
        gsap.to(follower, { scale: 0.5, opacity: 0, duration: 0.2 });
      }
    };

    const handleMouseOut = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
      gsap.to(follower, { scale: 1, opacity: 1, duration: 0.2 });
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isTouchDevice, prefersReducedMotion]);

  if (isTouchDevice || prefersReducedMotion) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-2 w-2 rounded-full bg-[var(--color-volt)] mix-blend-screen [@media(pointer:fine)]:block"
      />
      <div
        ref={followerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden h-8 w-8 rounded-full border border-[var(--color-volt)] opacity-50 mix-blend-screen [@media(pointer:fine)]:block"
      />
    </>
  );
}
