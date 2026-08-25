import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { STACK_ACTIVE, STACK_EXPLORING } from "@/lib/content";

function Marquee() {
  const items = [...STACK_ACTIVE, ...STACK_ACTIVE]; // duplicated for seamless loop
  return (
    <div className="marquee border-y border-line py-4" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mono flex items-center gap-3 text-[0.8rem] text-faint"
          >
            <span className="h-1 w-1 rounded-full bg-glow" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechArsenal() {
  return (
    <section id="stack" className="section pt-0!" aria-labelledby="stack-heading">
      <Marquee />

      <div className="container pt-[var(--space-section)]">
        <SectionHeading
          kicker="03 · technical arsenal"
          title={
            <span id="stack-heading">
              The stack behind the <span className="text-gradient">shipping</span>.
            </span>
          }
          sub="What I build with every day — and what I'm deliberately going deep on next."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="surface h-full p-7">
              <div className="flex items-center justify-between">
                <h3 className="mono text-sm font-semibold uppercase tracking-wider text-ink">
                  Active building with
                </h3>
                <span className="status-pill px-3! py-1! text-[0.66rem]!">
                  <span className="status-dot" aria-hidden="true" />
                  daily
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {STACK_ACTIVE.map((tech, i) => (
                  <span
                    key={tech}
                    className="chip"
                    style={{ "--reveal-delay": `${i * 55}ms` } as React.CSSProperties}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="mono mt-6 text-[0.72rem] leading-relaxed text-faint">
                <span className="mr-2 text-lilac">$</span>uptime: every day ·
                used across both live products
              </p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="surface h-full p-7">
              <div className="flex items-center justify-between">
                <h3 className="mono text-sm font-semibold uppercase tracking-wider text-ink">
                  Currently exploring
                </h3>
                <span className="status-pill px-3! py-1! text-[0.66rem]!">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber" aria-hidden="true" />
                  learning
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {STACK_EXPLORING.map((tech, i) => (
                  <span
                    key={tech}
                    className="chip chip-learning"
                    style={{ "--reveal-delay": `${i * 55}ms` } as React.CSSProperties}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="mono mt-6 text-[0.72rem] leading-relaxed text-faint">
                <span className="mr-2 text-amber">~</span>direction: deeper AI —
                retrieval, agents, pipelines
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
