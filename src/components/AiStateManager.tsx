'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import { Loader2 } from 'lucide-react';

// Loading fallback for accessibility and preventing CLS during dynamic import
const LoadingFallback = () => (
  <div
    className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
    role="dialog"
    aria-modal="true"
    aria-label="Loading Ask My AI"
  >
    <div className="animate-in fade-in zoom-in flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[var(--bg-secondary)] p-6 shadow-2xl duration-300 sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-volt)]/50 bg-[var(--color-volt)]/20 text-[var(--color-volt)]">
        <Loader2 size={24} className="animate-spin" aria-hidden="true" />
      </div>
      <p className="text-center font-medium text-white">Initializing AI Assistant...</p>
    </div>
  </div>
);

// Dynamically import AskMyAI so its heavy dependencies (react-markdown, ai/react)
// are NOT included in the initial page bundle.
const AskMyAI = dynamic(() => import('@/components/AskMyAI'), {
  ssr: false, // Since this is an interactive modal, SSR is not needed and skipping it saves server resources
  loading: () => <LoadingFallback />,
});

interface AiStateManagerProps {
  children: React.ReactNode;
}

export default function AiStateManager({ children }: AiStateManagerProps) {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const handleOpenAi = () => {
    setIsAiOpen(true);
    setHasOpened(true);
  };

  return (
    <>
      <Header onOpenAi={handleOpenAi} />

      {/* Full-width marquee strip — sits just below the fixed header */}
      <div className="mt-28 w-full">
        <Marquee />
      </div>

      <div className="flex w-full max-w-5xl flex-col gap-24 px-6 pt-8 pb-24 sm:gap-32 sm:px-12">
        <Hero onOpenAi={handleOpenAi} />
        {children}
      </div>

      {hasOpened && <AskMyAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />}
    </>
  );
}
