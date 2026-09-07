import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isPageScrollLocked, lockPageScroll, subscribeToScrollLock } from './scroll-lock';

const releases: (() => void)[] = [];

beforeEach(() => {
  vi.stubGlobal('window', { scrollX: 0, scrollY: 480, scrollTo: vi.fn() });
  vi.stubGlobal('document', {
    documentElement: { style: { overflow: 'auto' } },
    body: { style: { overflow: 'scroll' } },
  });
});
afterEach(() => {
  releases.splice(0).forEach((release) => release());
  vi.unstubAllGlobals();
});

function acquire() {
  const release = lockPageScroll();
  releases.push(release);
  return release;
}

describe('page scroll locks', () => {
  it('interrupts native smooth scrolling at its current position', () => {
    acquire();
    acquire();
    expect(window.scrollTo).toHaveBeenCalledExactlyOnceWith({
      left: 0,
      top: 480,
      behavior: 'instant',
    });
  });

  it('locks both scroll roots and restores their original inline styles', () => {
    const release = acquire();
    expect(isPageScrollLocked()).toBe(true);
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe('hidden');
    release();
    expect(isPageScrollLocked()).toBe(false);
    expect(document.documentElement.style.overflow).toBe('auto');
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('does not unlock a dialog when an overlapping menu or preloader closes', () => {
    const closeMenu = acquire();
    const closeDialog = acquire();
    closeMenu();
    expect(isPageScrollLocked()).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    closeDialog();
    expect(isPageScrollLocked()).toBe(false);
  });

  it('is idempotent and notifies smooth scrolling of the current lock state', () => {
    const states: boolean[] = [];
    const unsubscribe = subscribeToScrollLock(() => states.push(isPageScrollLocked()));
    const release = acquire();
    release();
    release();
    expect(states).toEqual([true, false]);
    unsubscribe();
    acquire()();
    expect(states).toEqual([true, false]);
    expect(isPageScrollLocked()).toBe(false);
  });
});
