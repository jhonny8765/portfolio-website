'use client';

import { useEffect } from 'react';
import { lockPageScroll } from '@/lib/scroll-lock';

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (active) return lockPageScroll();
  }, [active]);
}
