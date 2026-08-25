"use client";

import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const NAV = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll state + progress bar
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section indicator
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const openAI = () => window.dispatchEvent(new CustomEvent("ask-ai-open"));

  return (
    <>
      <div
        className="progress-bar"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <div
          className={`mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-all duration-300 sm:px-5 ${
            scrolled ? "glass shadow-2xl shadow-black/40" : "border border-transparent"
          }`}
        >
          <a href="#top" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet font-mono text-sm font-bold text-white transition-transform duration-200 group-hover:-rotate-6">
              JC
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-semibold tracking-tight text-ink">
                Jhon Rey Consolacion
              </span>
              <span className="mono text-[0.68rem] text-faint">
                ~/ai-developer · PH
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-active={active === item.id}
                className="u-link mono text-[0.82rem] text-muted"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={openAI}
              className="btn btn-primary btn-sm"
              aria-label="Ask my AI about my work and services"
            >
              <Sparkles size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Ask My AI</span>
              <span className="sm:hidden">AI</span>
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong text-muted md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[90] flex flex-col bg-obsidian/95 backdrop-blur-xl md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between px-6 pt-6">
            <span className="mono text-sm text-faint">~/menu</span>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong text-ink"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-start justify-center gap-2 px-8" aria-label="Mobile">
            {NAV.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="mono w-full border-b border-line py-4 text-2xl text-ink"
                style={{ animation: `word-up .5s ${0.05 * i}s var(--ease-out-expo) both` }}
              >
                <span className="text-lilac mr-3 text-sm">0{i + 1}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <p className="mono px-8 pb-10 text-xs text-faint">
            tip: press ⌘K anytime for shortcuts
          </p>
        </div>
      )}
    </>
  );
}
