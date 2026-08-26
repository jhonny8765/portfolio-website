import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, CheckCircle2, Terminal } from 'lucide-react';
import { portfolioData } from '@/data/portfolioData';

export const metadata: Metadata = {
  title: 'SukiSuite Case Study | Jhon Rey Consolacion',
  description: 'Salon Management SaaS built with Next.js, React, Tailwind CSS, and Firebase.',
  openGraph: {
    title: 'SukiSuite Case Study | Jhon Rey Consolacion',
    description: 'Salon Management SaaS built with Next.js, React, Tailwind CSS, and Firebase.',
    url: 'https://jhonreyconsolacion.vercel.app/projects/sukisuite',
    images: ['/projects/sukisuite.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SukiSuite Case Study | Jhon Rey Consolacion',
    description: 'Salon Management SaaS built with Next.js, React, Tailwind CSS, and Firebase.',
    images: ['/projects/sukisuite.png'],
  }
};

export default function SukiSuiteCaseStudy() {
  const project = portfolioData.projects.find(p => p.id === 'sukisuite');
  
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-violet)]/30 bg-[var(--color-violet)]/5 text-[var(--color-violet-light)] text-xs font-semibold uppercase tracking-widest mb-6">
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
        <div className="w-full aspect-video rounded-2xl border border-white/10 bg-black flex items-center justify-center mb-8 relative overflow-hidden shadow-2xl">
          <Image
            src={project.imagePlaceholder}
            alt="SukiSuite Interface"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Guided Demo Screenshot */}
        <div className="w-full aspect-video rounded-2xl border border-white/10 bg-black flex items-center justify-center mb-16 relative overflow-hidden shadow-2xl">
          <Image
            src="/projects/salon-suite.png"
            alt="Salon Suite Demo Interface"
            fill
            className="object-cover"
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
                The public Salon Suite demo illustrates the following core workflows and capabilities. (Note: The demo uses realistic sample data. These features illustrate software capability, not active production integrations or verified customer results.)
              </p>
              <ul className="space-y-3">
                {[
                  "Booking workflow",
                  "Customer records",
                  "Staff and branch operations",
                  "Checkout and payment controls",
                  "Inventory concepts",
                  "Follow-up queues",
                  "Reports and management views",
                  "Guided onboarding",
                  "Package options and introductory pricing"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--text-secondary)]">
                    <CheckCircle2 size={20} className="text-[var(--color-violet-light)] shrink-0 mt-0.5" />
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

            <div className="p-6 rounded-2xl border border-[var(--color-violet)]/20 bg-gradient-to-b from-[var(--color-violet)]/10 to-transparent flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Links</h3>
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--color-violet)] text-white font-semibold hover:bg-[var(--color-violet-light)] transition-colors"
              >
                Live Product
                <ExternalLink size={16} />
              </a>
              
              <a 
                href="https://123-eight-rosy.vercel.app/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Guided Product Demo
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
