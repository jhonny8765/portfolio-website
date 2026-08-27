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

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      });

      gsap.to(follower, {
        x: mouseX,
        y: mouseY,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);

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

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
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
