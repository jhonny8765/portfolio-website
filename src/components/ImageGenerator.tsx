'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { toast } from 'sonner';
import {
  Sparkles,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  RefreshCw,
  Download,
} from 'lucide-react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useQueryState(
    'prompt',
    parseAsString.withDefault('').withOptions({ history: 'replace', throttleMs: 300 }),
  );
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('ai-generated-image.png');
  const [error, setError] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const imageUrlRef = useRef<string | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isGenerating) return;
    const start = performance.now();
    const tick = setInterval(() => setElapsed((performance.now() - start) / 1000), 200);
    return () => clearInterval(tick);
  }, [isGenerating]);

  const stageText =
    elapsed < 2
      ? 'Warming up the model'
      : elapsed < 6
        ? 'Generating image'
        : 'Refining details & rendering';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [prompt]);

  const replaceImage = (url: string | null) => {
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
    imageUrlRef.current = url;
    setImageUrl(url);
  };

  const handleEnhance = async () => {
    if (!prompt.trim() || prompt.length > 200 || requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 45_000);
    setIsEnhancing(true);
    setError(null);

    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to enhance prompt. Please try again.');
      if (
        typeof data.enhancedPrompt !== 'string' ||
        !data.enhancedPrompt.trim() ||
        data.enhancedPrompt.length > 500
      ) {
        throw new Error('The enhancer returned an invalid prompt. Please try again.');
      }
      if (mountedRef.current) await setPrompt(data.enhancedPrompt.trim());
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      const message = controller.signal.aborted
        ? 'Enhancement timed out. Please try again.'
        : err instanceof Error
          ? err.message
          : 'An error occurred during enhancement.';
      setError(message);
      toast.error('Enhancement failed', { description: message });
    } finally {
      clearTimeout(timeout);
      if (requestRef.current === controller) requestRef.current = null;
      if (mountedRef.current) setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.length > 500 || requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 45_000);
    const startedAt = performance.now();
    const imagePrompt = prompt.trim();
    setElapsed(0);
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate image. Please try again.');
      }
      const blob = await res.blob();
      if (!blob.size || !['image/png', 'image/jpeg', 'image/webp'].includes(blob.type)) {
        throw new Error('The image provider returned an invalid image. Please try again.');
      }
      if (!mountedRef.current) return;
      replaceImage(URL.createObjectURL(blob));
      const extension =
        blob.type === 'image/jpeg' ? 'jpg' : blob.type === 'image/webp' ? 'webp' : 'png';
      setDownloadName(`ai-generated-image.${extension}`);
      setAltText(imagePrompt.substring(0, 100) + (imagePrompt.length > 100 ? '...' : ''));
      // `elapsed` in this async closure was the OLD render's value (usually 0.0).
      const duration = (performance.now() - startedAt) / 1000;
      setElapsed(duration);
      toast.success('Image ready', {
        description: `Generated in ${duration.toFixed(1)}s — use Download to save it.`,
      });
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      const message = controller.signal.aborted
        ? 'Generation timed out. Please try again.'
        : err instanceof Error
          ? err.message
          : 'Failed to generate image.';
      setError(message);
      toast.error('Generation failed', { description: message });
    } finally {
      clearTimeout(timeout);
      if (requestRef.current === controller) requestRef.current = null;
      if (mountedRef.current) setIsGenerating(false);
    }
  };

  const handleReset = () => {
    void setPrompt('');
    replaceImage(null);
    setError(null);
    setElapsed(0);
    textareaRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      {/* Input Section */}
      <div className="glass-panel group relative overflow-hidden rounded-3xl border border-white/10 p-6 shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-volt)]/10 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100"></div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="mb-2 flex items-end justify-between gap-3">
            <label
              htmlFor="prompt-input"
              className="text-lg font-semibold tracking-tight text-white"
            >
              Describe your image
            </label>
            <span
              id="prompt-count"
              className={`shrink-0 font-mono text-xs ${prompt.length > 500 ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}
            >
              {prompt.length}/500
            </span>
          </div>

          <textarea
            id="prompt-input"
            ref={textareaRef}
            maxLength={500}
            aria-describedby="prompt-help prompt-count"
            aria-invalid={prompt.length > 500}
            data-lenis-prevent
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city in the clouds, cyberpunk style..."
            className="max-h-[200px] min-h-[100px] w-full resize-y rounded-2xl border border-white/10 bg-black/40 p-4 text-white transition-all placeholder:text-white/50 focus:border-[var(--color-volt)] focus:ring-1 focus:ring-[var(--color-volt)] focus:outline-none"
            disabled={isGenerating || isEnhancing}
          />

          <p id="prompt-help" className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Enhance up to 200 characters; generate with up to 500.
          </p>
          <div className="mt-2 flex flex-col items-center justify-between gap-3 md:flex-row">
            <button
              onClick={handleReset}
              disabled={(!prompt && !imageUrl) || isGenerating || isEnhancing}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            >
              <RefreshCw size={14} /> Reset
            </button>

            <div className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row">
              <button
                onClick={handleEnhance}
                disabled={!prompt.trim() || prompt.length > 200 || isEnhancing || isGenerating}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[var(--color-volt)]/30 bg-white/5 px-5 py-2.5 text-sm font-medium whitespace-nowrap text-[var(--color-volt)] transition-all hover:bg-[var(--color-volt)]/20 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
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
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-volt)] px-6 py-2.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(232,245,74,0.3)] transition-all hover:bg-[var(--color-volt-light)] hover:shadow-[0_0_30px_rgba(232,245,74,0.5)] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
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
        <div
          role="alert"
          className="animate-in fade-in slide-in-from-top-4 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400 duration-300"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p className="text-sm leading-relaxed font-medium">{error}</p>
        </div>
      )}

      {/* Output Section */}
      <div className="glass-panel relative flex aspect-square min-h-[300px] w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-xl transition-all duration-500 md:aspect-video">
        {isGenerating ? (
          <div className="flex w-full animate-pulse flex-col items-center gap-4 px-4 text-center text-[var(--text-secondary)]">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-[var(--color-volt)]/20"></div>
              <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-[var(--color-volt)] border-t-transparent"></div>
            </div>
            <p
              className="max-w-full font-mono text-xs leading-relaxed tracking-wider uppercase sm:text-sm"
              role="status"
              aria-live="polite"
            >
              {stageText}&hellip;
            </p>
            {/* Ticking timer is visual only — announcing it every 200ms would
                spam screen readers; the stage text above carries the status. */}
            <p aria-hidden="true" className="font-mono text-xs text-[var(--text-secondary)]">
              {elapsed.toFixed(1)}s elapsed
            </p>
          </div>
        ) : imageUrl ? (
          <div className="animate-in fade-in group relative h-full w-full duration-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={altText}
              className="pointer-events-none h-full w-full object-contain"
            />
            {/* Hover overlay for download */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl bg-black/40 opacity-0 transition-opacity duration-300 md:rounded-none md:group-hover:opacity-100"></div>

            <a
              href={imageUrl}
              download={downloadName}
              aria-label="Download generated image"
              className="absolute right-4 bottom-4 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--color-volt)] p-3 text-[var(--color-bg)] opacity-100 shadow-lg backdrop-blur-md transition-all hover:bg-[var(--color-volt-light)]"
              title="Download Image"
            >
              <Download size={18} />
              <span className="hidden pr-1 text-sm font-medium sm:inline">Download</span>
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/60">
            <ImageIcon size={48} strokeWidth={1} />
            <p className="text-sm font-medium">Your image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
