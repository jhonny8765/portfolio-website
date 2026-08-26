import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, CheckCircle2, Terminal } from 'lucide-react';
import { portfolioData } from '@/data/portfolioData';

export const metadata: Metadata = {
  title: 'BetterYield Case Study | Jhon Rey Consolacion',
  description: 'Agricultural product catalog and local-commerce experience serving farmers across Regions 11 and 12.',
  openGraph: {
    title: 'BetterYield Case Study | Jhon Rey Consolacion',
    description: 'Agricultural product catalog and local-commerce experience serving farmers across Regions 11 and 12.',
    url: 'https://jhonreyconsolacion.vercel.app/projects/betteryield',
    images: ['/projects/betteryield.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BetterYield Case Study | Jhon Rey Consolacion',
    description: 'Agricultural product catalog and local-commerce experience serving farmers across Regions 11 and 12.',
    images: ['/projects/betteryield.png'],
  }
};

export default function BetterYieldCaseStudy() {
  const project = portfolioData.projects.find(p => p.id === 'betteryield');
  
  if (!project) return null;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden selection:bg-[var(--color-violet)] selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[var(--color-violet)]/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-12">
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-xs font-semibold uppercase tracking-widest mb-6">
            <Terminal size={14} />
            Live Deployment
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
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
              <h2 className="text-2xl font-semibold text-white mb-4">Verified Product Surface</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                The public catalog currently shows seven products, allowing users to browse essentials based on branch availability.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <CheckCircle2 size={20} className="text-[var(--color-violet-light)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-1">Product Catalog</strong>
                    Includes product search, category filtering, and dedicated product detail pages.
                  </div>
                </li>
                <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <CheckCircle2 size={20} className="text-[var(--color-violet-light)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-1">Branch-Aware Availability</strong>
                    Farmers can check product availability specific to their nearby branch.
                  </div>
                </li>
                <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <CheckCircle2 size={20} className="text-[var(--color-violet-light)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-1">Branch Directory</strong>
                    Presents four branches: Magpet, Arakan, Antipas, and Tulunan.
                  </div>
                </li>
                <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <CheckCircle2 size={20} className="text-[var(--color-violet-light)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-1">Contact and Location Experience</strong>
                    Provides phone contact, Facebook contact, and Google Maps directions for easy access.
                  </div>
                </li>
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
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
              >
                Visit Live Site
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
