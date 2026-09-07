'use client';

import { useCallback, useSyncExternalStore } from 'react';

export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCapabilities() {
  // Opt in after hydration instead of briefly starting effects on touch/reduced-motion devices.
  // Listen for changes too: accessibility preferences and connected pointers can change at runtime.
  const allowsMotion = useMediaQuery('(prefers-reduced-motion: no-preference)');
  const hasFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)');

  return { prefersReducedMotion: !allowsMotion, hasFinePointer };
}
