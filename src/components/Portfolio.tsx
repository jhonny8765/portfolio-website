"use client";

import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { PROJECTS, type Project } from "@/lib/content";

/* ------------------------------------------------------------------ */
/* Stylized, honest product previews (drawn in CSS/SVG — not fake     */
/* screenshots). Each is labelled as a preview and links to the       */
/* real live app.                                                     */
/* ------------------------------------------------------------------ */

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="browser-bar">
      <div className="browser-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <span className="browser-url">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" />
        {url}
      </span>
    </div>
  );
}

function DashboardPreview() {
  // SukiSuite — calendar + appointments, as a quiet wireframe
  const booked = [2, 4, 9, 11, 15];
  return (
    <div className="grid grid-cols-[56px_1fr] gap-3 p-4" aria-hidden="true">
      {/* sidebar */}
      <div className="flex flex-col gap-2.5 border-r border-line pr-3 pt-1">
        <span className="mb-1 h-4 w-4 rounded-md bg-violet/70" />
        {[22, 16, 19, 12].map((w, i) => (
          <span key={i} className="skel h-2" style={{ width: `${w}px` }} />
        ))}
      </div>
      {/* main */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="skel h-8 flex-1 rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 21 }).map((_, i) => (
            <span
              key={i}
              className={`cal-cell h-5 rounded-[4px] transition-transform duration-200 ${
                booked.includes(i)
                  ? "border border-glow/50 bg-glow/25"
                  : "skel opacity-60"
              }`}
              style={
                booked.includes(i)
                  ? { transitionDelay: `${(i % 7) * 35}ms` }
                  : undefined
              }
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="skel h-2 w-24" />
          <span className="ml-auto h-4 w-14 rounded-full border border-mint/40 bg-mint/15" />
        </div>
      </div>
    </div>
  );
}

function BracketPreview() {
  // Barangay Arena — 8-team single elimination bracket
  const line = "stroke-line-strong";
  const win = "flow-wire";
  return (
    <svg
      viewBox="0 0 320 168"
      className="h-[168px] w-full p-2"
      aria-hidden="true"
      role="presentation"
    >
      {/* quarter finals */}
      {[14, 46, 86, 118].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="56" height="16" rx="4" className="fill-raised stroke-line-strong" strokeWidth="1" />
          <rect x="14" y={y + 5} width={i % 2 ? 24 : 34} height="6" rx="3" className="fill-faint opacity-40" />
        </g>
      ))}
      {/* semis */}
      {[30, 102].map((y, i) => (
        <g key={i}>
          <rect x="104" y={y} width="56" height="16" rx="4" className="fill-raised stroke-line-strong" strokeWidth="1" />
          <rect x="110" y={y + 5} width="26" height="6" rx="3" className="fill-faint opacity-40" />
        </g>
      ))}
      {/* final */}
      <rect x="200" y="66" width="56" height="16" rx="4" className="fill-raised stroke-line-strong" strokeWidth="1" />
      <rect x="206" y="71" width="28" height="6" rx="3" className="fill-faint opacity-40" />
      {/* champion */}
      <rect x="258" y="60" width="54" height="28" rx="6" className="fill-glow/20 stroke-glow/70" strokeWidth="1.2" />
      <circle cx="272" cy="74" r="5" className="fill-glow champ-node" />
      <rect x="282" y="70" width="20" height="7" rx="3.5" className="fill-lilac-strong opacity-80" />

      {/* connectors */}
      <path d="M64 22 H84 V38 H104" fill="none" className={line} strokeWidth="1" />
      <path d="M64 54 H84 V38 H104" fill="none" className={line} strokeWidth="1" />
      <path d="M64 94 H84 V110 H104" fill="none" className={line} strokeWidth="1" />
      <path d="M64 126 H84 V110 H104" fill="none" className={line} strokeWidth="1" />
      {/* winning path — animated */}
      <path d="M160 38 H180 V74 H200" fill="none" className={`${win} stroke-glow`} strokeWidth="1.4" />
      <path d="M256 74 H258" fill="none" className={`${win} stroke-glow`} strokeWidth="1.4" />
      <path d="M160 110 H180 V74 H200" fill="none" className={line} strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------ cards ------------------------------ */

function ProjectCard({
  project,
  featured,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <article
      className={`project-card surface spotlight card-hover group flex h-full flex-col overflow-hidden ${
        featured ? "lg:col-span-7" : "lg:col-span-5"
      }`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {/* preview */}
      <div className="border-b border-line">
        <BrowserChrome url={project.file} />
        {project.preview === "dashboard" ? <DashboardPreview /> : <BracketPreview />}
        <p className="mono border-t border-line px-4 py-1.5 text-[0.62rem] text-faint">
          stylized preview — the real app is one click away
        </p>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-center gap-3">
          <span className="status-pill px-3! py-1! text-[0.68rem]!">
            <span className="status-dot" aria-hidden="true" />
            Live
          </span>
          <span className="mono text-[0.72rem] text-faint">{project.file}</span>
        </div>

        <h3 className="mt-4 text-[length:var(--text-2xl)] font-semibold tracking-tight text-ink">
          {project.name}
        </h3>
        <p className="mono mt-1 text-[0.8rem] text-lilac">{project.tagline}</p>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-4 space-y-1.5">
          {project.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[0.84rem] text-muted">
              <span className="mt-1 text-[0.7rem] text-lilac" aria-hidden="true">
                ▸
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm w-fit"
            aria-label={`Open the live ${project.name} app in a new tab`}
          >
            View live
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------ section ---------------------------- */

export default function Portfolio() {
  return (
    <section id="work" className="section" aria-labelledby="work-heading">
      <div className="container">
        <SectionHeading
          kicker="01 · proof of work"
          title={
            <span id="work-heading">
              Shipped beats <span className="text-gradient">polished slides</span>.
            </span>
          }
          sub="Real products, deployed and publicly reachable — not mockups. Click through and try them."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7" as="div">
            <ProjectCard project={PROJECTS[0]} featured />
          </Reveal>
          <Reveal delay={140} className="lg:col-span-5">
            <ProjectCard project={PROJECTS[1]} />
          </Reveal>

          {/* open slot */}
          <Reveal delay={220} className="lg:col-span-12">
            <a
              href="#contact"
              className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-line-strong px-6 py-5 transition-all duration-300 hover:border-glow/60 hover:bg-glow/5 md:px-8"
            >
              <p className="mono text-[0.82rem] text-faint">
                <span className="mr-2 text-lilac">$</span>
                slot_reserved --for=<span className="text-ink">your_idea</span>
              </p>
              <p className="mono flex items-center gap-2 text-[0.82rem] text-lilac transition-transform duration-300 group-hover:translate-x-1">
                claim it
                <ArrowUpRight size={14} aria-hidden="true" />
              </p>
            </a>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <p className="mono mt-8 text-[0.72rem] text-faint">
            <span className="mr-2 text-lilac">$</span>
            next up: written case studies for both products — the live apps
            above are the current proof
          </p>
        </Reveal>
      </div>
    </section>
  );
}
