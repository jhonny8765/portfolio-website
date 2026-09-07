'use client';

import React, { lazy, Suspense, useCallback, useRef, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import { Loader2, X } from 'lucide-react';
import { useDialog } from '@/hooks/useDialog';

function LoadingFallback({
  onClose,
  returnFocusRef,
}: {
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(true, dialogRef, onClose, undefined, returnFocusRef);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      data-lenis-prevent
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Loading Ask My AI"
    >
      <div className="animate-in fade-in relative flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[var(--bg-secondary)] px-8 pt-16 pb-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-2 right-2 flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <Loader2 size={28} className="animate-spin text-[var(--color-volt)]" aria-hidden="true" />
        <p role="status" className="text-center font-medium text-white">
          Initializing AI Assistant...
        </p>
      </div>
    </div>
  );
}

// Fetch the heavy chat/markdown bundle only when needed. Suspense lets the real
// loading state remain dismissible and focus-trapped, even on a slow connection.
const AskMyAI = lazy(() => import('@/components/AskMyAI'));

export default function AiStateManager({ children }: { children: React.ReactNode }) {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const handleOpenAi = useCallback(() => {
    const active = document.activeElement as HTMLElement | null;
    // The mobile-menu action unmounts when selected; return to its persistent trigger.
    returnFocusRef.current = active?.closest('#mobile-menu')
      ? document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]')
      : active;
    setIsAiOpen(true);
    setHasOpened(true);
  }, []);
  const handleCloseAi = useCallback(() => setIsAiOpen(false), []);

  return (
    <>
      <Header onOpenAi={handleOpenAi} />
      <div className="mt-28 w-full">
        <Marquee />
      </div>
      <main
        id="main-content"
        tabIndex={-1}
        className="flex w-full max-w-5xl flex-col gap-24 px-6 pt-8 pb-24 sm:gap-32 sm:px-12"
      >
        <Hero onOpenAi={handleOpenAi} />
        {children}
      </main>
      {hasOpened && (
        <Suspense
          fallback={
            isAiOpen ? (
              <LoadingFallback onClose={handleCloseAi} returnFocusRef={returnFocusRef} />
            ) : null
          }
        >
          <AskMyAI isOpen={isAiOpen} onClose={handleCloseAi} returnFocusRef={returnFocusRef} />
        </Suspense>
      )}
    </>
  );
}
