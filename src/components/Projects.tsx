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
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Trail DOM Pool refs
  const poolRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentIndexRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Desktop Horizontal Scroll
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
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
        ease: "none",
        scrollTrigger: {
          trigger: scrollWrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
          invalidateOnRefresh: true,
        }
      });

      return () => {
        tween.kill();
      };
    });

    return () => mm.revert();
  }, { scope: containerRef });

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
      if (dist < 40) return;

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
        opacity: 0.8,
        zIndex: gsap.getProperty(imgNode, "zIndex") as number + 1,
      });

      gsap.to(imgNode, {
        y: e.clientY - 40,
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });

      // Increment index (pool size 15)
      currentIndexRef.current = (currentIndexRef.current + 1) % 15;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="projects" ref={containerRef} className="w-full relative scroll-mt-24">
      {/* Header section (not pinned) */}
      <div className="flex flex-col gap-2 mb-10 px-6 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          <FolderOpen className="text-[var(--color-volt)]" />
          Proof of Work
        </h2>
      </div>

      {/* Pinned Wrapper for Desktop */}
      <div ref={scrollWrapperRef} className="w-full h-full relative">
        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef} 
          className="flex flex-nowrap gap-6 md:gap-10 w-full md:w-max px-6 sm:px-12 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-8 md:pb-0 scrollbar-hide"
        >
          {portfolioData.projects.map((project) => (
            <div 
              key={project.id}
              data-image={project.imagePlaceholder}
              className="project-card flex-shrink-0 w-[85vw] sm:w-[500px] md:w-[600px] snap-center snap-always glass-panel rounded-2xl overflow-hidden flex flex-col group hover:border-[var(--color-volt)]/30 hover:shadow-[0_10px_30px_-15px_rgba(232,245,74,0.5)] transition-all duration-300 relative z-10 bg-[var(--bg-primary)]"
            >
              {/* Project Image */}
              <div className="aspect-video w-full relative border-b border-white/10 overflow-hidden bg-black/40">
                {project.imagePlaceholder ? (
                  <div className="absolute inset-0 w-full h-full group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500 ease-out">
                    <Image
                      src={project.imagePlaceholder}
                      alt={`${project.title} screenshot`}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                ) : (
                  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-volt)]/10 to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center gap-3 opacity-80 md:opacity-50 md:group-hover:opacity-80 md:group-hover:scale-105 transition-all duration-500">
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                        <FolderOpen size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 sm:p-8 flex flex-col gap-4 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-[var(--color-volt)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[var(--color-volt)] text-sm font-medium">{project.tagline}</p>
                  </div>
                  {project.liveUrl === "preview-on-request" ? (
                    <span 
                      className="h-8 px-3 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 text-xs font-medium cursor-not-allowed shrink-0"
                      title="Preview available on request"
                    >
                      Preview on request
                    </span>
                  ) : project.id === "sukisuite" ? (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      aria-label={`View ${project.title} live`}
                      className="h-8 px-3 rounded-full bg-[var(--color-volt)]/10 border border-[var(--color-volt)]/30 flex items-center justify-center text-[var(--color-volt)] hover:bg-[var(--color-volt)]/20 hover:border-[var(--color-volt)]/50 transition-all text-xs font-semibold shrink-0"
                    >
                      Live
                    </a>
                  ) : (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      aria-label={`View ${project.title} live`}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all text-white shrink-0"
                    >
                      <ExternalLink size={18} aria-hidden="true" />
                    </a>
                  )}
                </div>
                
                <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
                  {project.description}
                </p>
                
                <div className="mt-auto pt-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Features</span>
                    <ul className="text-sm text-white/80 list-disc list-inside space-y-1">
                      {project.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.techStack.map((tech) => (
                      <span 
                        key={tech} 
                        className={`px-2.5 py-1 rounded-md border text-xs font-mono ${
                          tech === "[Pending confirmation]" 
                            ? "bg-[var(--color-volt)]/5 border-[var(--color-volt)]/20 text-[var(--color-volt)] opacity-70" 
                            : "bg-white/5 border-white/10 text-[var(--text-secondary)]"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Link href={`/projects/${project.id}`} className="text-[var(--color-volt)] text-sm font-semibold hover:text-white transition-colors flex items-center gap-2 w-max group/link">
                      Read Case Study 
                      <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="hidden md:block pointer-events-none fixed inset-0 z-[30]">
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
            className="absolute top-0 left-0 w-[200px] h-[120px] object-cover rounded-lg border border-[var(--color-volt)]/20 shadow-2xl opacity-0"
            style={{ transformOrigin: 'center center' }}
            />
          );
        })}
      </div>
    </section>
  );
}
