import React from 'react';
import { TransitionLink as Link } from './TransitionLink';
import { Sparkles, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function PlaygroundTeaser() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-8 w-full py-12 duration-700">
      <div className="group relative w-full overflow-hidden rounded-3xl border border-[var(--color-volt)]/20 bg-gradient-to-br from-[#090a0f] to-[#161821] p-8 shadow-2xl sm:p-12">
        {/* Glow effect */}
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-[var(--color-volt)]/10 opacity-50 blur-[100px] transition-opacity duration-700 group-hover:opacity-100" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="max-w-xl flex-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8F54A]/30 bg-[#E8F54A]/5 px-3 py-1.5 text-xs font-semibold tracking-widest text-[#E8F54A] uppercase">
              <Sparkles size={14} />
              Experimental
            </div>

            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              AI Image{' '}
              <span className="bg-gradient-to-r from-[var(--color-volt)] to-[var(--color-volt-light)] bg-clip-text text-transparent">
                Playground
              </span>
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-[var(--text-secondary)]">
              Test my integration of Cloudflare Workers AI and Google Gemini. Craft enhanced prompts
              and generate unique images in real-time.
            </p>

            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black shadow-lg transition-colors hover:bg-gray-200"
            >
              <ImageIcon size={18} />
              Enter Playground
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative flex aspect-square w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/50 md:w-1/3">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-volt)]/20 to-[#E8F54A]/20 opacity-50" />
            <Sparkles size={48} className="animate-pulse text-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
