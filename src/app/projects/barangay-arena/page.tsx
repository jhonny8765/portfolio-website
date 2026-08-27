import React from 'react';
import { Metadata } from 'next';
import { TransitionLink as Link } from '@/components/TransitionLink';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, CheckCircle2, Terminal } from 'lucide-react';
import { portfolioData } from '@/data/portfolioData';

export const metadata: Metadata = {
  title: 'Barangay Arena Case Study | Jhon Rey Consolacion',
  description: 'Community Tournament Platform built with Next.js, React, Tailwind CSS, and Supabase.',
  openGraph: {
    title: 'Barangay Arena Case Study | Jhon Rey Consolacion',
    description: 'Community Tournament Platform built with Next.js, React, Tailwind CSS, and Supabase.',
    url: 'https://jhonreyconsolacion.vercel.app/projects/barangay-arena',
    images: ['/projects/barangay-arena.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barangay Arena Case Study | Jhon Rey Consolacion',
    description: 'Community Tournament Platform built with Next.js, React, Tailwind CSS, and Supabase.',
    images: ['/projects/barangay-arena.png'],
  }
};

export default function BarangayArenaCaseStudy() {
  const project = portfolioData.projects.find(p => p.id === 'barangay-arena');
  
  if (!project) return null;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden selection:bg-[var(--color-volt)] selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-volt)]/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-12">
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-500 text-xs font-semibold uppercase tracking-widest mb-6">
            <Terminal size={14} />
            Preview Deployment
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {project.title}
          </h1>
          <p className="text-xl text-[var(--text-secondary)] font-light">
            {project.tagline}
          </p>
        </div>

        {/* Project Screenshot */}
        <div className="w-full aspect-video rounded-2xl border border-white/10 bg-black flex items-center justify-center mb-16 relative overflow-hidden shadow-2xl">
          <Image
            src={project.imagePlaceholder}
            alt={`${project.title} Interface`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Project Overview</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {project.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Verified Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--text-secondary)]">
                    <CheckCircle2 size={20} className="text-[var(--color-volt)] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">My Role</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Fullstack Developer
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tech => (
                  <span key={tech} className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-[var(--text-secondary)]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Links</h3>
              {project.liveUrl !== "preview-on-request" ? (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                >
                  Visit Live Site
                  <ExternalLink size={16} />
                </a>
              ) : (
                <span className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-medium cursor-not-allowed">
                  Preview on request
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
