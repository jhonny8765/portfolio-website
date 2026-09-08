'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCapabilities } from '@/hooks/useCapabilities';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, hasFinePointer } = useCapabilities();

  useEffect(() => {
    if (!hasFinePointer || prefersReducedMotion) return;
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const cursorX = gsap.quickTo(cursor, 'x', { duration: 0.08, ease: 'power2.out' });
    const cursorY = gsap.quickTo(cursor, 'y', { duration: 0.08, ease: 'power2.out' });
    const followerX = gsap.quickTo(follower, 'x', { duration: 0.3, ease: 'power2.out' });
    const followerY = gsap.quickTo(follower, 'y', { duration: 0.3, ease: 'power2.out' });
    let visible = false;
    let hovering = false;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const firstMove = !visible;
      if (firstMove) {
        // Never fly in from (0, 0) on the first move or after re-entering the page.
        gsap.set([cursor, follower], { x: event.clientX, y: event.clientY });
        gsap.set(cursor, { autoAlpha: 1 });
        gsap.set(follower, { autoAlpha: 0.5 });
        visible = true;
      }
      cursorX(event.clientX, firstMove ? event.clientX : undefined);
      cursorY(event.clientY, firstMove ? event.clientY : undefined);
      followerX(event.clientX, firstMove ? event.clientX : undefined);
      followerY(event.clientY, firstMove ? event.clientY : undefined);

      const target = event.target;
      const clickable =
        target instanceof Element && !!target.closest('a, button:not(:disabled), [role="button"]');
      if (clickable !== hovering) {
        hovering = clickable;
        gsap.to(cursor, {
          scale: clickable ? 1.5 : 1,
          opacity: clickable ? 0.5 : 1,
          duration: 0.15,
          overwrite: 'auto',
        });
        gsap.to(follower, {
          scale: clickable ? 0.6 : 1,
          opacity: clickable ? 0 : 0.5,
          duration: 0.15,
          overwrite: 'auto',
        });
      }
    };
    const hide = () => {
      visible = false;
      hovering = false;
      gsap.set([cursor, follower], { autoAlpha: 0, scale: 1 });
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    document.addEventListener('visibilitychange', hide);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      document.removeEventListener('visibilitychange', hide);
      [cursorX, cursorY, followerX, followerY].forEach((to) => to.tween.kill());
      gsap.killTweensOf([cursor, follower]);
    };
  }, [hasFinePointer, prefersReducedMotion]);

  if (!hasFinePointer || prefersReducedMotion) return null;

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        data-custom-cursor
        className="pointer-events-none invisible fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-[var(--color-volt)] mix-blend-screen"
      />
      <div
        ref={followerRef}
        aria-hidden="true"
        data-custom-cursor
        className="pointer-events-none invisible fixed top-0 left-0 z-[9998] h-8 w-8 rounded-full border border-[var(--color-volt)] mix-blend-screen"
      />
    </>
  );
}
