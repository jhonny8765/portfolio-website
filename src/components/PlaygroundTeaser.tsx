import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function PlaygroundTeaser() {
  return (
    <section className="w-full py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative w-full rounded-3xl border border-[var(--color-violet)]/20 bg-gradient-to-br from-[#090a0f] to-[#161821] p-8 sm:p-12 overflow-hidden shadow-2xl group">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-violet)]/10 blur-[100px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/5 text-[#06B6D4] text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles size={14} />
              Experimental
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              AI Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-violet-light)] to-[var(--color-violet)]">Playground</span>
            </h2>
            
            <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
              Test my integration of Cloudflare Workers AI and Google Gemini. Craft enhanced prompts and generate unique images in real-time.
            </p>
            
            <Link 
              href="/playground"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors shadow-lg"
            >
              <ImageIcon size={18} />
              Enter Playground
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="w-full md:w-1/3 aspect-square max-w-xs rounded-2xl border border-white/10 bg-black/50 overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-violet)]/20 to-[#06B6D4]/20 opacity-50" />
            <Sparkles size={48} className="text-white/20 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
