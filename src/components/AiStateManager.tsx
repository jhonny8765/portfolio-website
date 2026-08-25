"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { Loader2 } from 'lucide-react';

// Loading fallback for accessibility and preventing CLS during dynamic import
const LoadingFallback = () => (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-label="Loading Ask My AI"
  >
    <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
      <div className="w-12 h-12 rounded-full bg-[var(--color-violet)]/20 border border-[var(--color-violet)]/50 flex items-center justify-center text-[var(--color-violet-light)]">
        <Loader2 size={24} className="animate-spin" aria-hidden="true" />
      </div>
      <p className="text-white font-medium text-center">Initializing AI Assistant...</p>
    </div>
  </div>
);

// Dynamically import AskMyAI so its heavy dependencies (react-markdown, ai/react) 
// are NOT included in the initial page bundle.
const AskMyAI = dynamic(() => import('@/components/AskMyAI'), {
  ssr: false, // Since this is an interactive modal, SSR is not needed and skipping it saves server resources
  loading: () => <LoadingFallback />
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
      
      <div className="w-full max-w-5xl px-6 sm:px-12 flex flex-col gap-24 sm:gap-32 pb-24 pt-32">
        <Hero onOpenAi={handleOpenAi} />
        {children}
      </div>

      {hasOpened && <AskMyAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />}
    </>
  );
}
