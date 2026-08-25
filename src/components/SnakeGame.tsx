"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Play, Pause, RotateCcw } from "lucide-react";

/**
 * Snake — rescued from the repo's Windows-XP era and re-skinned for the
 * Signal design system. Opened via the ⌘K command palette ("Play Snake").
 */

const GRID = 20;
const CELL = 18;
const SIZE = GRID * CELL;
const TICK_MS = 110;

type Pt = { x: number; y: number };

const eq = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y;

function randomFood(snake: Pt[]): Pt {
  while (true) {
    const p = {
      x: (Math.random() * GRID) | 0,
      y: (Math.random() * GRID) | 0,
    };
    if (!snake.some((s) => eq(s, p))) return p;
  }
}

export default function SnakeGame() {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [state, setState] = useState<"idle" | "running" | "paused" | "over">("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Pt[]>([]);
  const dirRef = useRef<Pt>({ x: 1, y: 0 });
  const nextDirRef = useRef<Pt>({ x: 1, y: 0 });
  const foodRef = useRef<Pt>({ x: 10, y: 10 });
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("snake-open", onOpen);
    return () => window.removeEventListener("snake-open", onOpen);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const stored = localStorage.getItem("snake-best");
        if (stored) setBest(parseInt(stored, 10) || 0);
      } catch {
        /* private mode — ignore */
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#0b0c12";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // faint grid
    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL + 0.5);
      ctx.lineTo(SIZE, i * CELL + 0.5);
      ctx.stroke();
    }

    // food
    const f = foodRef.current;
    ctx.fillStyle = "#34d399";
    ctx.shadowColor = "#34d399";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // snake — head brighter, body fades
    snakeRef.current.forEach((s, i) => {
      const t = i / Math.max(snakeRef.current.length, 1);
      ctx.fillStyle = i === 0 ? "#c4b5fd" : `rgba(139, 92, 246, ${0.9 - t * 0.55})`;
      const pad = i === 0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 4);
      ctx.fill();
    });
  }, []);

  const reset = useCallback(() => {
    snakeRef.current = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    foodRef.current = randomFood(snakeRef.current);
    setScore(0);
    setState("running");
  }, []);

  // main loop
  useEffect(() => {
    if (!open) return;

    const step = (t: number) => {
      rafRef.current = requestAnimationFrame(step);
      if (state !== "running") {
        draw();
        return;
      }
      if (t - lastTickRef.current < TICK_MS) return;
      lastTickRef.current = t;

      // apply queued direction, rejecting 180° reversals
      const queued = nextDirRef.current;
      if (
        !(dirRef.current.x === -queued.x && dirRef.current.y === -queued.y)
      ) {
        dirRef.current = queued;
      }
      const head = snakeRef.current[0];
      const next = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };

      const hitWall =
        next.x < 0 || next.y < 0 || next.x >= GRID || next.y >= GRID;
      const hitSelf = snakeRef.current.some((s) => eq(s, next));
      if (hitWall || hitSelf) {
        setState("over");
        setScore((sc) => {
          setBest((b) => {
            const nb = Math.max(b, sc);
            try {
              localStorage.setItem("snake-best", String(nb));
            } catch {
              /* ignore */
            }
            return nb;
          });
          return sc;
        });
        return;
      }

      snakeRef.current = [next, ...snakeRef.current];
      if (eq(next, foodRef.current)) {
        setScore((s) => s + 1);
        foodRef.current = randomFood(snakeRef.current);
      } else {
        snakeRef.current.pop();
      }
      draw();
    };

    // initial board
    if (snakeRef.current.length === 0) {
      snakeRef.current = [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 },
      ];
      foodRef.current = randomFood(snakeRef.current);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [open, state, draw]);

  // keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const set = (x: number, y: number) => {
        // 180° reversals are rejected in the game loop
        nextDirRef.current = { x, y };
      };
      if (["arrowup", "w"].includes(k)) {
        e.preventDefault();
        set(0, -1);
      } else if (["arrowdown", "s"].includes(k)) {
        e.preventDefault();
        set(0, 1);
      } else if (["arrowleft", "a"].includes(k)) {
        e.preventDefault();
        set(-1, 0);
      } else if (["arrowright", "d"].includes(k)) {
        e.preventDefault();
        set(1, 0);
      } else if (k === " ") {
        e.preventDefault();
        setState((st) => (st === "running" ? "paused" : st === "paused" ? "running" : st));
      } else if (k === "escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Snake game"
    >
      <div
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-md"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div className="surface-raised relative w-full max-w-[420px] overflow-hidden rounded-2xl!">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="mono text-sm text-ink">
            snake.exe <span className="text-faint">— rescued from the XP era</span>
          </p>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close game"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong text-muted hover:text-ink"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5">
          <div className="mono mb-3 flex items-center justify-between text-[0.72rem] text-faint">
            <span>
              score <span className="text-lilac-strong">{score}</span>
            </span>
            <span>
              best <span className="text-mint">{best}</span>
            </span>
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={SIZE}
              height={SIZE}
              className="w-full rounded-xl border border-line"
              aria-label="Snake game board"
              role="img"
            />
            {state !== "running" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-obsidian/80">
                <p className="mono text-sm text-ink">
                  {state === "idle" && "ready to play?"}
                  {state === "paused" && "paused"}
                  {state === "over" && (
                    <>
                      game over — <span className="text-lilac">{score} pts</span>
                    </>
                  )}
                </p>
                <button
                  onClick={() => (state === "paused" ? setState("running") : reset())}
                  className="btn btn-primary btn-sm"
                >
                  {state === "paused" ? (
                    <>
                      <Play size={13} /> resume
                    </>
                  ) : (
                    <>
                      <RotateCcw size={13} /> {state === "over" ? "play again" : "start"}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* controls */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="grid grid-cols-3 grid-rows-3 gap-1 sm:hidden">
              <span />
              <button aria-label="Up" onClick={() => { nextDirRef.current = { x: 0, y: -1 }; }} className="flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong text-muted active:bg-violet/20">↑</button>
              <span />
              <button aria-label="Left" onClick={() => { nextDirRef.current = { x: -1, y: 0 }; }} className="flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong text-muted active:bg-violet/20">←</button>
              <button aria-label="Down" onClick={() => { nextDirRef.current = { x: 0, y: 1 }; }} className="flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong text-muted active:bg-violet/20">↓</button>
              <button aria-label="Right" onClick={() => { nextDirRef.current = { x: 1, y: 0 }; }} className="flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong text-muted active:bg-violet/20">→</button>
            </div>
            <p className="mono hidden text-[0.68rem] leading-relaxed text-faint sm:block">
              arrows / WASD to steer · space to pause
              <br />
              esc to exit
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setState((st) =>
                    st === "running" ? "paused" : st === "paused" ? "running" : st
                  )
                }
                className="btn btn-ghost btn-sm"
                aria-label={state === "running" ? "Pause" : "Resume"}
              >
                {state === "running" ? <Pause size={13} /> : <Play size={13} />}
              </button>
              <button onClick={reset} className="btn btn-ghost btn-sm" aria-label="Restart">
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
