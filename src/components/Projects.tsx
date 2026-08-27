'use client';

import React, { useRef, useEffect } from 'react';
import { TransitionLink as Link } from './TransitionLink';
import Image from 'next/image';
import { portfolioData } from '@/data/portfolioData';
import { ExternalLink, FolderOpen, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  // Trail DOM Pool refs
  const poolRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentIndexRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Defer via rAF (not sync setState in effect) to avoid cascading renders —
    // matches the pattern in useCapabilities.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop Horizontal Scroll
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        if (!scrollContainerRef.current || !scrollWrapperRef.current) return;

        const sections = gsap.utils.toArray('.project-card', scrollContainerRef.current);

        // Calculate total scroll distance
        const getScrollAmount = () => {
          const containerWidth = scrollContainerRef.current!.scrollWidth;
          const viewportWidth = window.innerWidth;
          return -(containerWidth - viewportWidth + 100); // 100px padding
        };

        const tween = gsap.to(sections, {
          x: getScrollAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: scrollWrapperRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  // Handle Hover Trail
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only active on desktop
      if (window.innerWidth < 768) return;

      const target = e.target as HTMLElement;
      const card = target.closest('.project-card') as HTMLElement;

      if (!card) return;

      const imgSrc = card.dataset.image;
      if (!imgSrc) return;

      const dist = Math.hypot(e.clientX - lastPosRef.current.x, e.clientY - lastPosRef.current.y);
      // Only spawn a new image if moved enough distance
      if (dist < 22) return;

      lastPosRef.current = { x: e.clientX, y: e.clientY };

      const imgNode = poolRef.current[currentIndexRef.current];
      if (!imgNode) return;

      // Update image source and position
      imgNode.src = imgSrc;

      // Animate the cloned image
      gsap.killTweensOf(imgNode);
      gsap.set(imgNode, {
        x: e.clientX - 100, // offset by half width
        y: e.clientY - 60, // offset by half height
        scale: 1,
        opacity: 0.95,
        zIndex: ((gsap.getProperty(imgNode, 'zIndex') as number) || 30) + 1,
      });

      gsap.to(imgNode, {
        y: e.clientY - 35,
        scale: 0.85,
        opacity: 0,
        duration: 1.3,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(imgNode, { opacity: 0 });
        },
      });

      // Increment index (pool size 15)
      currentIndexRef.current = (currentIndexRef.current + 1) % 15;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="projects" ref={containerRef} className="relative w-full scroll-mt-32">
      {/* Header section (not pinned) */}
      <div className="mb-10 flex flex-col gap-2 px-6 sm:px-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <FolderOpen className="text-[var(--color-volt)]" />
          Proof of Work
        </h2>
      </div>

      {/* Pinned Wrapper for Desktop */}
      <div ref={scrollWrapperRef} className="relative h-full w-full">
        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex w-full snap-x snap-mandatory flex-nowrap gap-6 overflow-x-auto px-6 pb-8 sm:px-12 md:w-max md:snap-none md:gap-10 md:overflow-visible md:pb-0"
        >
          {portfolioData.projects.map((project) => (
            <div
              key={project.id}
              data-image={project.imagePlaceholder}
              className="project-card glass-panel group relative z-10 flex w-[85vw] flex-shrink-0 snap-center snap-always flex-col overflow-hidden rounded-2xl bg-[var(--bg-primary)] transition-all duration-300 hover:border-[var(--color-volt)]/30 hover:shadow-[0_10px_30px_-15px_rgba(232,245,74,0.5)] sm:w-[500px] md:w-[600px]"
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="mb-1 text-xl font-bold text-white transition-colors group-hover:text-[var(--color-volt)] sm:text-2xl">
                      {project.title}
                    </h3>
                    <p className="text-sm font-medium text-[var(--color-volt)]">
                      {project.tagline}
                    </p>
                  </div>
                  {project.liveUrl === 'preview-on-request' ? (
                    <span
                      className="flex h-8 shrink-0 cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium text-white/50"
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
                      className="flex h-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-volt)]/30 bg-[var(--color-volt)]/10 px-3 text-xs font-semibold text-[var(--color-volt)] transition-all hover:border-[var(--color-volt)]/50 hover:bg-[var(--color-volt)]/20"
                    >
                      Live
                    </a>
                  ) : (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View ${project.title} live`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:border-white/20 hover:bg-white/10"
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
                      className="group/link flex w-max items-center gap-2 text-sm font-semibold text-[var(--color-volt)] transition-colors hover:text-white"
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
      </div>

      {mounted && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[30] hidden md:block"
        >
          {[...Array(15)].map((_, i) => {
            return (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                ref={(el) => {
                  poolRef.current[i] = el;
                }}
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt=""
                className="absolute top-0 left-0 h-[120px] w-[200px] rounded-lg border border-[var(--color-volt)]/20 object-cover opacity-0 shadow-2xl"
                style={{ transformOrigin: 'center center' }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
