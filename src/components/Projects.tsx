'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TransitionLink as Link } from './TransitionLink';
import Image from 'next/image';
import { portfolioData } from '@/data/portfolioData';
import { ExternalLink, FolderOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCapabilities } from '@/hooks/useCapabilities';

export default function Projects() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const targetScrollRef = useRef<number | null>(null);
  const { prefersReducedMotion } = useCapabilities();
  const [bounds, setBounds] = useState({ atStart: true, atEnd: false });

  useEffect(() => {
    const track = scrollContainerRef.current;
    if (!track) return;
    const updateBounds = () => {
      if (
        targetScrollRef.current !== null &&
        Math.abs(track.scrollLeft - targetScrollRef.current) < 2
      ) {
        targetScrollRef.current = null;
      }
      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      setBounds((previous) =>
        previous.atStart === atStart && previous.atEnd === atEnd ? previous : { atStart, atEnd },
      );
    };
    const frame = requestAnimationFrame(updateBounds);
    const observer = new ResizeObserver(updateBounds);
    observer.observe(track);
    track.addEventListener('scroll', updateBounds, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      track.removeEventListener('scroll', updateBounds);
    };
  }, []);

  const scrollProject = (direction: number) => {
    const track = scrollContainerRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('.project-card'));
    if (!cards.length) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const positions = cards.map((card) =>
      Math.max(
        0,
        Math.min(
          maxScroll,
          card.offsetLeft - cards[0].offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
        ),
      ),
    );
    const current = targetScrollRef.current ?? track.scrollLeft;
    const nearest = positions.reduce(
      (best, value, index) =>
        Math.abs(value - current) < Math.abs(positions[best] - current) ? index : best,
      0,
    );
    const next = Math.max(0, Math.min(cards.length - 1, nearest + direction));
    // Retain the destination during the animation so rapid clicks don't restart
    // the same movement from an intermediate scroll position.
    targetScrollRef.current = positions[next];
    track.scrollTo({
      left: positions[next],
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  };

  return (
    <section id="projects" className="relative w-full min-w-0 scroll-mt-32">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2
            id="projects-title"
            className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            <FolderOpen className="shrink-0 text-[var(--color-volt)]" aria-hidden="true" />
            Proof of Work
          </h2>
          <p id="projects-help" className="mt-3 text-sm text-[var(--text-secondary)]">
            Swipe or use the arrows to explore all {portfolioData.projects.length} projects.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollProject(-1)}
            disabled={bounds.atStart}
            aria-label="Previous project"
            aria-controls="project-showcase"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[var(--color-volt)] transition-colors hover:border-[var(--color-volt)]/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollProject(1)}
            disabled={bounds.atEnd}
            aria-label="Next project"
            aria-controls="project-showcase"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[var(--color-volt)] transition-colors hover:border-[var(--color-volt)]/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Native scrolling stays usable with touch, keyboards, reduced motion, and no JS.
          Never translate the cards out of their scrollable area or pin adjacent sections. */}
      <div
        id="project-showcase"
        ref={scrollContainerRef}
        role="region"
        aria-labelledby="projects-title"
        aria-describedby="projects-help"
        aria-roledescription="carousel"
        tabIndex={0}
        data-lenis-prevent-horizontal
        onPointerDown={() => {
          targetScrollRef.current = null;
        }}
        onWheel={() => {
          targetScrollRef.current = null;
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollProject(event.key === 'ArrowRight' ? 1 : -1);
          }
          if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            targetScrollRef.current = null;
            event.currentTarget.scrollTo({
              left: event.key === 'Home' ? 0 : event.currentTarget.scrollWidth,
              behavior: prefersReducedMotion ? 'instant' : 'smooth',
            });
          }
        }}
        className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-5 md:gap-8"
      >
        {portfolioData.projects.map((project) => (
          <div
            key={project.id}
            className="project-card glass-panel group relative z-10 flex w-full flex-shrink-0 snap-center snap-always flex-col overflow-hidden rounded-2xl bg-[var(--bg-primary)] transition-[border-color,box-shadow] duration-300 hover:border-[var(--color-volt)]/30 hover:shadow-[0_10px_30px_-15px_rgba(232,245,74,0.5)] sm:w-[500px] lg:w-[600px]"
          >
            {/* Project Image */}
            <div className="relative aspect-video w-full overflow-hidden border-b border-white/10 bg-black/40">
              {project.imagePlaceholder ? (
                <div className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-1">
                  <Image
                    src={project.imagePlaceholder}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-volt)]/10 to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3 opacity-80 transition-all duration-500 md:opacity-50 md:group-hover:scale-105 md:group-hover:opacity-80">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5">
                      <FolderOpen size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="mb-1 text-xl font-bold text-white transition-colors group-hover:text-[var(--color-volt)] sm:text-2xl">
                    {project.title}
                  </h3>
                  <p className="text-sm font-medium text-[var(--color-volt)]">{project.tagline}</p>
                </div>
                {project.liveUrl === 'preview-on-request' ? (
                  <span
                    className="flex h-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium text-white/60"
                    title="Preview available on request"
                  >
                    Preview on request
                  </span>
                ) : project.id === 'sukisuite' ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${project.title} live`}
                    className="flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-[var(--color-volt)]/30 bg-[var(--color-volt)]/10 px-3 text-xs font-semibold text-[var(--color-volt)] transition-all hover:border-[var(--color-volt)]/50 hover:bg-[var(--color-volt)]/20"
                  >
                    Live
                  </a>
                ) : (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${project.title} live`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:border-white/20 hover:bg-white/10"
                  >
                    <ExternalLink size={18} aria-hidden="true" />
                  </a>
                )}
              </div>

              <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                {project.description}
              </p>

              <div className="mt-auto flex flex-col gap-4 pt-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
                    Features
                  </span>
                  <ul className="list-inside list-disc space-y-1 text-sm text-white/80">
                    {project.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="group/link flex min-h-[44px] w-max items-center gap-2 text-sm font-semibold text-[var(--color-volt)] transition-colors hover:text-white"
                  >
                    Read Case Study
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
