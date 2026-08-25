"use client";

import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { SERVICES } from "@/lib/content";
import { MonitorSmartphone, Workflow, Sparkles } from "lucide-react";

const ICONS = [MonitorSmartphone, Workflow, Sparkles];

export default function Services() {
  return (
    <section id="services" className="section" aria-labelledby="services-heading">
      <div className="container">
        <SectionHeading
          kicker="02 · services"
          title={
            <span id="services-heading">
              Ways we can <span className="text-gradient">ship together</span>.
            </span>
          }
          sub="Three ways to hire me — each one starts with your idea and ends with something deployed."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={service.id} delay={i * 140}>
                <article className="surface spotlight card-hover group flex h-full flex-col p-7"
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line-strong bg-raised text-lilac transition-all duration-300 group-hover:border-glow/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="mono text-[0.72rem] text-faint">0{i + 1}</span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>

                  <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2">
                    {service.bullets.map((b) => (
                      <li key={b} className="mono text-[0.72rem] text-faint">
                        <span className="mr-1.5 text-lilac">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <p className="mono mt-auto pt-6 text-[0.68rem] text-faint">
                    {service.file}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
