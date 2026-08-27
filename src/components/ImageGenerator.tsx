'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  RefreshCw,
  Download,
} from 'lucide-react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [altText, setAltText] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cleanup object URLs on unmount or URL change
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [prompt]);

  const handleEnhance = async () => {
    if (!prompt.trim() || prompt.length > 200) return;

    setIsEnhancing(true);
    setError(null);

    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to enhance prompt.');
      }

      setPrompt(data.enhancedPrompt);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred during enhancement.';
      setError(errorMessage);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.length > 500) return;

    setIsGenerating(true);
    setError(null);

    // Revoke old object URL to prevent memory leaks
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: 'Failed to parse error response.' }));
        throw new Error(errorData.error || 'An unexpected error occurred.');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      setAltText(prompt.substring(0, 100) + (prompt.length > 100 ? '...' : '')); // Safe, truncated alt
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate image.';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
    setError(null);
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!imageUrl) return;

    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'ai-generated-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      {/* Input Section */}
      <div className="glass-panel group relative overflow-hidden rounded-3xl border border-white/10 p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-volt)]/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100"></div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="mb-2 flex items-end justify-between">
            <label
              htmlFor="prompt-input"
              className="text-lg font-semibold tracking-tight text-white"
            >
              Describe your image
            </label>
            <span
              className={`font-mono text-xs ${prompt.length > 500 ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}
            >
              {prompt.length}/500
            </span>
          </div>

          <textarea
            id="prompt-input"
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city in the clouds, cyberpunk style..."
            className="max-h-[200px] min-h-[100px] w-full resize-y rounded-2xl border border-white/10 bg-black/40 p-4 text-white transition-all placeholder:text-white/30 focus:border-[var(--color-volt)] focus:ring-1 focus:ring-[var(--color-volt)] focus:outline-none"
            disabled={isGenerating || isEnhancing}
          />

          <div className="mt-2 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <button
              onClick={handleReset}
              disabled={(!prompt && !imageUrl) || isGenerating || isEnhancing}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw size={14} /> Reset
            </button>

            <div className="flex w-full items-center gap-3 sm:w-auto">
              <button
                onClick={handleEnhance}
                disabled={!prompt.trim() || prompt.length > 200 || isEnhancing || isGenerating}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-volt)]/30 bg-white/5 px-5 py-2.5 text-sm font-medium whitespace-nowrap text-[var(--color-volt)] transition-all hover:bg-[var(--color-volt)]/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isEnhancing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                Enhance with AI
              </button>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || prompt.length > 500 || isGenerating || isEnhancing}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-volt)] px-6 py-2.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(232,245,74,0.3)] transition-all hover:bg-[var(--color-volt-light)] hover:shadow-[0_0_30px_rgba(232,245,74,0.5)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isGenerating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ImageIcon size={16} />
                )}
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="animate-in fade-in slide-in-from-top-4 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400 duration-300">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm leading-relaxed font-medium">{error}</p>
        </div>
      )}

      {/* Output Section */}
      <div className="glass-panel relative flex aspect-square min-h-[300px] w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-xl transition-all duration-500 md:aspect-video">
        {isGenerating ? (
          <div className="flex animate-pulse flex-col items-center gap-4 text-[var(--text-secondary)]">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-[var(--color-volt)]/20"></div>
              <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-[var(--color-volt)] border-t-transparent"></div>
            </div>
            <p className="font-mono text-sm tracking-widest uppercase">Generating</p>
          </div>
        ) : imageUrl ? (
          <div className="animate-in fade-in group relative h-full w-full duration-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={altText}
              className="pointer-events-none h-full w-full object-contain md:object-cover"
            />
            {/* Hover overlay for download */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl bg-black/40 opacity-0 transition-opacity duration-300 md:rounded-none md:group-hover:opacity-100"></div>

            <a
              href={imageUrl}
              onClick={handleDownload}
              download="ai-generated-image.png"
              className="absolute right-4 bottom-4 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--color-volt)] p-3 text-white opacity-100 shadow-lg backdrop-blur-md transition-all hover:bg-[var(--color-volt)] md:bg-black/60 md:opacity-0 md:group-hover:opacity-100"
              title="Download Image"
            >
              <Download size={18} />
              <span className="hidden pr-1 text-sm font-medium sm:inline">Download</span>
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/20">
            <ImageIcon size={48} strokeWidth={1} />
            <p className="text-sm font-medium">Your image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
