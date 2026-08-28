'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// The decorative effects layer pulls in GSAP + ScrollTrigger. Importing it
// dynamically (ssr: false) keeps that JS out of the initial parse/eval path
// (TBT), and the gate below skips the work entirely where the effects cannot
// or should not run: touch/coarse-pointer devices and reduced-motion users.
// SSR and the first hydration render both emit null (no hydration mismatch);
// the layer only mounts after the client capability check resolves.
const CustomCursor = dynamic(
  () => import('@/components/CustomCursor').then((m) => m.CustomCursor),
  { ssr: false },
);
const Preloader = dynamic(() => import('@/components/Preloader'), { ssr: false });
const AnimatedBackground = dynamic(() => import('@/components/AnimatedBackground'), {
  ssr: false,
});

export function EffectsLayer() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const raf = requestAnimationFrame(() => setEnabled(fine && !reduced));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <CustomCursor />
      <Preloader />
      {/* Visual parity: before this refactor the background only existed on
          the homepage, so keep it route-scoped instead of making it global. */}
      {pathname === '/' && <AnimatedBackground />}
    </>
  );
}
