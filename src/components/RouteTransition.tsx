'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function RouteTransition() {
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
      const mm = gsap.matchMedia();
      
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(overlay, {
          y: "-100%",
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(overlay, { y: "100%" });
          }
        });
      });
      
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(overlay, { y: "-100%" });
        setTimeout(() => {
          gsap.set(overlay, { y: "100%" });
        }, 50);
      });

      // Failsafe: force retraction after 1.2s in case of any interrupted state
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        gsap.set(overlay, { y: "100%" });
      }, 1200);

      return () => {
        mm.revert();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [pathname]);

  return null;
}

