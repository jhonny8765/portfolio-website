"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient background:
 *  - CSS layers: aurora glow blobs + engineering grid (static, cheap)
 *  - Canvas layer: sparse violet data-stream (the site's signature)
 *
 * Performance contract:
 *  - devicePixelRatio capped at 1 (glyphs don't need retina)
 *  - throttled to ~20fps — rain reads fine, GPU/CPU sleeps between frames
 *  - pauses when the tab is hidden
 *  - prefers-reduced-motion: no animation at all
 *  - column density scales down on small screens
 */
export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    const GLYPHS = "01<>{}[]$#*+=/\\AI".split("");
    const FONT = 13;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width; // DPR 1 on purpose
      canvas.height = height;
      const cols = Math.floor(width / (width < 768 ? 42 : 30));
      drops = Array.from({ length: cols }, () => Math.random() * -80);
      speeds = Array.from({ length: cols }, () => 0.5 + Math.random() * 0.7);
      ctx.font = `${FONT}px monospace`;
    };

    resize();

    let last = 0;
    let raf = 0;
    let running = true;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!running) return;
      if (t - last < 50) return; // ~20fps
      last = t;

      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < drops.length; i++) {
        const x = i * (width / drops.length) + 6;
        const y = drops[i] * FONT;
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];

        // head glyph — slightly brighter
        ctx.fillStyle = Math.random() > 0.92 ? "rgba(196,181,253,0.16)" : "rgba(139,92,246,0.07)";
        ctx.fillText(ch, x, y);

        drops[i] += speeds[i];
        if (y > height && Math.random() > 0.976) drops[i] = Math.random() * -20;
      }
    };

    raf = requestAnimationFrame(draw);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) last = 0;
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      {/* base wash */}
      <div className="absolute inset-0 bg-obsidian" />
      {/* aurora blobs — static, GPU-composited */}
      <div
        className="absolute -top-40 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(109,40,217,0.55), rgba(139,92,246,0.18) 55%, transparent)",
        }}
      />
      <div
        className="absolute bottom-[-260px] right-[-180px] h-[520px] w-[640px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(59,130,246,0.4), transparent 70%)",
        }}
      />
      {/* engineering grid */}
      <div className="grid-texture absolute inset-0" />
      {/* data stream */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* vignette to keep edges quiet */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(9,10,15,0.85) 100%)",
        }}
      />
    </div>
  );
}
