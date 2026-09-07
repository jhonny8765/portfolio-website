let lockCount = 0;
let restoreStyles: (() => void) | undefined;
const listeners = new Set<() => void>();

export function isPageScrollLocked() {
  return lockCount > 0;
}

export function subscribeToScrollLock(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Reference-count locks so a closing menu/preloader cannot unlock another open dialog.
// The returned release function is safe to call more than once (animation + failsafe cleanup).
export function lockPageScroll() {
  if (lockCount === 0) {
    const root = document.documentElement;
    const body = document.body;
    const rootOverflow = root.style.overflow;
    const bodyOverflow = body.style.overflow;
    // Cancel a native smooth-scroll already in flight without changing position.
    window.scrollTo({ left: window.scrollX, top: window.scrollY, behavior: 'instant' });
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    restoreStyles = () => {
      root.style.overflow = rootOverflow;
      body.style.overflow = bodyOverflow;
    };
  }
  lockCount += 1;
  listeners.forEach((listener) => listener());

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount -= 1;
    if (lockCount === 0) {
      restoreStyles?.();
      restoreStyles = undefined;
    }
    listeners.forEach((listener) => listener());
  };
}
