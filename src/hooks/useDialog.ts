'use client';

import { useEffect, useEffectEvent, type RefObject } from 'react';
import { useScrollLock } from './useScrollLock';

export function useDialog(
  isOpen: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement | null>,
  returnFocusRef?: RefObject<HTMLElement | null>,
) {
  const close = useEffectEvent(onClose);
  useScrollLock(isOpen);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    const previousFocus = returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
    const inertElements: { element: HTMLElement; wasInert: boolean }[] = [];
    // Make the rest of the page inert, even when the dialog is nested inside <main>.
    let node: HTMLElement = dialog;
    while (node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling !== node && sibling instanceof HTMLElement) {
          inertElements.push({ element: sibling, wasInert: sibling.inert });
          sibling.setAttribute('inert', '');
        }
      }
      node = node.parentElement;
      if (node === document.body) break;
    }

    const focusableElements = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex]',
        ),
      ).filter(
        (element) =>
          element.tabIndex >= 0 &&
          !element.matches(':disabled') &&
          !element.closest('[inert]') &&
          element.getClientRects().length > 0,
      );

    const frame = requestAnimationFrame(() => {
      const initial = initialFocusRef?.current;
      const target = initial && !initial.matches(':disabled') ? initial : focusableElements()[0];
      (target ?? dialog).focus({
        preventScroll: true,
      });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
      if (event.key !== 'Tab') return;

      const elements = focusableElements();
      const first = elements[0];
      const last = elements.at(-1);
      const active = document.activeElement;
      if (!first || !last) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
      } else if (!dialog.contains(active) || !elements.includes(active as HTMLElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus({ preventScroll: true });
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      inertElements.forEach(({ element, wasInert }) => {
        element.toggleAttribute('inert', wasInert);
      });
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen, dialogRef, initialFocusRef, returnFocusRef]);
}
