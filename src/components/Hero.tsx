"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowDown, Zap, Database, Brain, Rocket } from "lucide-react";
import Reveal from "./Reveal";
import { SITE, STATS } from "@/lib/content";

/* ---------------- Manila clock ---------------- */
function useManilaTime() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: SITE.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ---------------- typed terminal ---------------- */
const TERMINAL_SCRIPT: { prompt?: boolean; text: string }[] = [
  { prompt: true, text: "whoami" },
  { text: "jhon-rey · ai developer · philippines" },
  { prompt: true, text: "ls ./products --live" },
  { text: "sukisuite.app    barangay-arena.app" },
  { prompt: true, text: "n8n deploy client-workflow.json" },
  { text: "✓ workflow live — running 24/7" },
];

function useTypedScript(active: boolean) {
  const [lines, setLines] = useState<{ prompt?: boolean; text: string; done: boolean }[]>([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(
        () => setLines(TERMINAL_SCRIPT.map((l) => ({ ...l, done: true }))),
        0
      );
      return () => clearTimeout(t);
    }

    let line = 0;
    let char = 0;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (line >= TERMINAL_SCRIPT.length) return;
      const target = TERMINAL_SCRIPT[line].text;
      char += 1;
      setCurrent(target.slice(0, char));
      if (char >= target.length) {
        setLines((prev) => [...prev, { ...TERMINAL_SCRIPT[line], done: true }]);
        setCurrent("");
        line += 1;
        char = 0;
        timer = setTimeout(step, TERMINAL_SCRIPT[line]?.prompt ? 500 : 260);
      } else {
        timer = setTimeout(step, TERMINAL_SCRIPT[line].prompt ? 34 : 12);
      }
    };

    timer = setTimeout(step, 700);
    return () => clearTimeout(timer);
  }, [active]);

  return { lines, current, finished: lines.length === TERMINAL_SCRIPT.length };
}

/* ---------------- count-up ---------------- */
function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setDisplay(value), 0);
      return () => clearTimeout(t);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1100;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(2, -10 * p); // ease-out-expo
          setDisplay(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ---------------- flow nodes ---------------- */
const FLOW = [
  { icon: Zap, label: "trigger", sub: "a new idea or brief" },
  { icon: Database, label: "data", sub: "apis · db · integrations" },
  { icon: Brain, label: "ai", sub: "generate · assist · decide" },
  { icon: Rocket, label: "shipped", sub: "live product on vercel" },
];

/* ---------------- hero ---------------- */
export default function Hero() {
  const time = useManilaTime();
  const [terminalActive, setTerminalActive] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);
  const { lines, current, finished } = useTypedScript(terminalActive);

  useEffect(() => {
    const node = termRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setTerminalActive(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTerminalActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const openAI = () => window.dispatchEvent(new CustomEvent("ask-ai-open"));

  const headline: { text: string; gradient?: boolean }[][] = [
    [
      { text: "I " },
      { text: "build", gradient: true },
      { text: " with AI —" },
    ],
    [{ text: "websites, applications" }],
    [{ text: "& " }, { text: "automations.", gradient: true }],
  ];

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center pb-20 pt-[calc(var(--header-h)+2rem)]"
    >
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ------------ left: copy ------------ */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="status-pill">
                <span className="status-dot" aria-hidden="true" />
                <span>Available for new projects</span>
                <span className="text-faint" aria-hidden="true">
                  ·
                </span>
                <span className="text-faint">
                  PH {time} MNL
                </span>
              </div>
            </Reveal>

            <h1
              className="mt-6 font-sans text-[length:var(--text-hero)] font-bold leading-[1.04] tracking-[-0.03em] text-ink"
              aria-label="I build with AI — websites, applications and automations."
            >
              {headline.map((line, li) => (
                <span key={li} className="block">
                  {line.map((word, wi) => (
                    <span key={wi} className="word-mask">
                      <span
                        className={word.gradient ? "text-gradient" : undefined}
                        style={{ "--word-delay": `${120 + li * 160 + wi * 90}ms` } as React.CSSProperties}
                      >
                        {word.text}&nbsp;
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <Reveal delay={420}>
              <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-muted">
                I&apos;m{" "}
                <span className="font-medium text-ink">Jhon Rey</span> — an AI
                developer &amp; automation builder from the Philippines. I turn
                ideas into working digital products:{" "}
                <span className="text-ink">two are live right now</span>, more
                in progress. Fast, because AI accelerates every step. Solid,
                because shipping is the point.
              </p>
            </Reveal>

            <Reveal delay={540}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button onClick={openAI} className="btn btn-primary">
                  <Sparkles size={16} aria-hidden="true" />
                  Ask My AI
                </button>
                <a href="#work" className="btn btn-ghost">
                  Explore projects
                  <ArrowDown size={15} aria-hidden="true" />
                </a>
              </div>
            </Reveal>

            {/* stats */}
            <Reveal delay={660}>
              <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-7">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="mono text-3xl font-semibold text-lilac-strong">
                      <CountUp value={s.value} suffix={s.suffix} />
                    </dd>
                    <dd className="mono mt-1 text-[0.72rem] uppercase tracking-wider text-faint">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* ------------ right: terminal ------------ */}
          <Reveal delay={300} className="lg:col-span-5">
            <div
              ref={termRef}
              className="surface-raised spotlight overflow-hidden"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              <div className="browser-bar">
                <div className="browser-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="browser-url">
                  jhonrey@ph:~ — zsh
                </span>
              </div>
              <div
                className="mono min-h-[218px] px-5 py-4 text-[0.82rem] leading-[1.9]"
                aria-label="Terminal: whoami; ls products; n8n deploy workflow"
              >
                {lines.map((l, i) => (
                  <p key={i} className={l.prompt ? "text-ink" : "text-faint"}>
                    {l.prompt && <span className="mr-2 text-lilac">$</span>}
                    {l.text}
                  </p>
                ))}
                <p className="text-ink">
                  <span className="mr-2 text-lilac">$</span>
                  {current}
                  <span className="caret" aria-hidden="true" />
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-line px-5 py-2.5">
                <span className="mono text-[0.68rem] text-faint">
                  {finished ? "session idle — ask the AI →" : "running…"}
                </span>
                <button
                  onClick={openAI}
                  className="mono text-[0.68rem] text-lilac transition-colors hover:text-lilac-strong"
                >
                  ./ask-my-ai.sh
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ------------ automation flow ------------ */}
        <Reveal delay={200} className="mt-16 md:mt-20">
          <div className="surface px-6 py-7 md:px-10">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <p className="mono text-[0.72rem] uppercase tracking-[0.14em] text-faint">
                how i work — the automation loop
              </p>
              <p className="mono hidden text-[0.72rem] text-faint md:block">
                trigger → data → ai → shipped
              </p>
            </div>

            <div className="flow relative">
              {/* the wire */}
              <div
                className="pointer-events-none absolute left-0 top-[26px] hidden h-px w-full bg-line-strong md:block"
                aria-hidden="true"
              >
                <span className="flow-dot absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-glow shadow-[0_0_12px_3px_rgba(139,92,246,0.55)]" />
              </div>

              <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-8">
                {FLOW.map((node, i) => (
                  <li key={node.label} className="flex items-start gap-3 md:block">
                    <span
                      className="flow-node flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-line-strong bg-raised text-lilac md:mb-4"
                      style={{ "--node-delay": `${i * 1.05}s` } as React.CSSProperties}
                    >
                      <node.icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="mono text-sm font-semibold text-ink md:mt-0 mt-0.5">
                        <span className="mr-2 text-faint">0{i + 1}</span>
                        {node.label}
                      </p>
                      <p className="mono mt-1 text-[0.72rem] leading-relaxed text-faint">
                        {node.sub}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
