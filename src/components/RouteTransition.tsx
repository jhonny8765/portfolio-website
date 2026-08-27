'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function RouteTransition() {
  const pathname = usePathname();

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

      return () => mm.revert();
    }
  }, [pathname]);

  return null;
}
