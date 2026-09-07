'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useCapabilities, useMediaQuery } from '@/hooks/useCapabilities';

const CustomCursor = dynamic(
  () => import('@/components/CustomCursor').then((m) => m.CustomCursor),
  { ssr: false },
);
const Preloader = dynamic(() => import('@/components/Preloader'), { ssr: false });
const AnimatedBackground = dynamic(() => import('@/components/AnimatedBackground'), {
  ssr: false,
});

export function EffectsLayer() {
  const { hasFinePointer, prefersReducedMotion } = useCapabilities();
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!hasFinePointer || prefersReducedMotion) return null;

  return (
    <>
      <CustomCursor />
      {pathname === '/' && isDesktop && <Preloader />}
      {pathname === '/' && <AnimatedBackground />}
    </>
  );
}
