'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Loader2, AlertCircle, RefreshCw, Download } from 'lucide-react';

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
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during enhancement.';
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
        const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response.' }));
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
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      {/* Input Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-violet)]/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-end mb-2">
            <label htmlFor="prompt-input" className="text-lg font-semibold text-white tracking-tight">
              Describe your image
            </label>
            <span className={`text-xs font-mono ${prompt.length > 500 ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>
              {prompt.length}/500
            </span>
          </div>
          
          <textarea
            id="prompt-input"
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city in the clouds, cyberpunk style..."
            className="w-full min-h-[100px] max-h-[200px] resize-y bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-violet)] focus:ring-1 focus:ring-[var(--color-violet)] transition-all"
            disabled={isGenerating || isEnhancing}
          />
          
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 justify-between">
            <button
              onClick={handleReset}
              disabled={!prompt && !imageUrl || isGenerating || isEnhancing}
              className="w-full sm:w-auto px-4 py-2 rounded-full border border-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={14} /> Reset
            </button>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleEnhance}
                disabled={!prompt.trim() || prompt.length > 200 || isEnhancing || isGenerating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/5 border border-[var(--color-violet)]/30 text-[var(--color-violet-light)] hover:bg-[var(--color-violet)]/20 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                {isEnhancing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Enhance with AI
              </button>
              
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || prompt.length > 500 || isGenerating || isEnhancing}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[var(--color-violet)] text-white hover:bg-[var(--color-violet-light)] shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed font-medium">{error}</p>
        </div>
      )}

      {/* Output Section */}
      <div className="w-full aspect-square md:aspect-video rounded-3xl overflow-hidden glass-panel border border-white/10 relative flex items-center justify-center bg-black/20 shadow-xl transition-all duration-500 min-h-[300px]">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-4 text-[var(--text-secondary)] animate-pulse">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[var(--color-violet)]/20"></div>
              <div className="w-16 h-16 rounded-full border-4 border-[var(--color-violet)] border-t-transparent animate-spin absolute inset-0"></div>
            </div>
            <p className="font-mono text-sm tracking-widest uppercase">Generating</p>
          </div>
        ) : imageUrl ? (
          <div className="relative w-full h-full animate-in fade-in duration-700 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt={altText}
              className="w-full h-full object-contain md:object-cover pointer-events-none"
            />
            {/* Hover overlay for download */}
            <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none rounded-3xl md:rounded-none"></div>
            
            <a
              href={imageUrl}
              onClick={handleDownload}
              download="ai-generated-image.png"
              className="absolute bottom-4 right-4 bg-[var(--color-violet)] md:bg-black/60 hover:bg-[var(--color-violet)] text-white p-3 rounded-xl backdrop-blur-md transition-all z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-lg border border-white/10 flex items-center gap-2"
              title="Download Image"
            >
              <Download size={18} />
              <span className="text-sm font-medium pr-1 hidden sm:inline">Download</span>
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
