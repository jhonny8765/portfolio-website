import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { portfolioData } from '@/data/portfolioData';
import { ExternalLink, FolderOpen, ArrowRight } from 'lucide-react';

export default function Projects() {
  return (
    <section id="projects" className="w-full flex flex-col gap-10 scroll-mt-24">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          <FolderOpen className="text-[var(--color-violet)]" />
          Proof of Work
        </h2>
        <p className="text-[var(--text-secondary)] text-lg">Verified products and applications I&apos;ve built.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolioData.projects.map((project) => (
          <div key={project.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col group hover:border-[var(--color-violet)]/30 hover:-translate-y-1 transition-all duration-300">
            {/* Project Image */}
            <div className="aspect-video w-full relative border-b border-white/10 overflow-hidden bg-black/40">
              {project.imagePlaceholder ? (
                <Image
                  src={project.imagePlaceholder}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
              ) : (
                <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-violet)]/10 to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3 opacity-80 md:opacity-50 md:group-hover:opacity-80 md:group-hover:scale-105 transition-all duration-500">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                      <FolderOpen size={20} className="text-white" />
                    </div>
                    <span className="font-mono text-xs tracking-wider uppercase text-white/70">
                      {project.id}.preview
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 sm:p-8 flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-[var(--color-violet-light)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[var(--color-violet)] text-sm font-medium">{project.tagline}</p>
                </div>
                {project.liveUrl === "preview-on-request" ? (
                  <span 
                    aria-label={`Preview available on request`}
                    className="h-10 px-3 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 text-xs font-medium cursor-not-allowed shrink-0"
                    title="Preview available on request"
                  >
                    Preview on request
                  </span>
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
                    <span key={tech} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[var(--text-secondary)] text-xs font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Link href={`/projects/${project.id}`} className="text-[var(--color-violet-light)] text-sm font-semibold hover:text-white transition-colors flex items-center gap-2 w-max group/link">
                    Read Case Study 
                    <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
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
