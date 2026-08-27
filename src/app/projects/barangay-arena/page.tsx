import React from 'react';
import { Metadata } from 'next';
import { TransitionLink as Link } from '@/components/TransitionLink';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, CheckCircle2, Terminal } from 'lucide-react';
import { portfolioData } from '@/data/portfolioData';

export const metadata: Metadata = {
  alternates: {
    canonical: '/projects/barangay-arena',
  },
  title: 'Barangay Arena Case Study | Jhon Rey Consolacion',
  description:
    'Community Tournament Platform built with Next.js, React, Tailwind CSS, and Supabase.',
  openGraph: {
    title: 'Barangay Arena Case Study | Jhon Rey Consolacion',
    description:
      'Community Tournament Platform built with Next.js, React, Tailwind CSS, and Supabase.',
    url: 'https://jhonreyconsolacion.vercel.app/projects/barangay-arena',
    images: ['/projects/barangay-arena.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barangay Arena Case Study | Jhon Rey Consolacion',
    description:
      'Community Tournament Platform built with Next.js, React, Tailwind CSS, and Supabase.',
    images: ['/projects/barangay-arena.png'],
  },
};

export default function BarangayArenaCaseStudy() {
  const project = portfolioData.projects.find((p) => p.id === 'barangay-arena');

  if (!project) return null;

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-[var(--bg-primary)] px-4 pt-24 pb-12 selection:bg-[var(--color-volt)] selection:text-white sm:px-6"
    >
      {/* Background Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[400px] w-full max-w-4xl -translate-x-1/2 rounded-full bg-[var(--color-volt)]/10 blur-[100px]"></div>

      <div className="animate-in fade-in slide-in-from-bottom-8 relative z-10 mx-auto max-w-4xl duration-700">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-[var(--text-secondary)] transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-3 py-1.5 text-xs font-semibold tracking-widest text-yellow-500 uppercase">
            <Terminal size={14} />
            Preview Deployment
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] sm:text-5xl lg:text-7xl">
            {project.title}
          </h1>
          <p className="text-xl font-light text-[var(--text-secondary)]">{project.tagline}</p>
        </div>

        {/* Project Screenshot */}
        <div className="relative mb-16 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <Image
            src={project.imagePlaceholder}
            alt={`${project.title} Interface`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="space-y-12 md:col-span-2">
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-white">Project Overview</h2>
              <p className="leading-relaxed text-[var(--text-secondary)]">{project.description}</p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-white">Verified Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--text-secondary)]">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[var(--color-volt)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
                My Role
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Fullstack Developer</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-[var(--text-secondary)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
                Links
              </h3>
              {project.liveUrl !== 'preview-on-request' ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-black transition-colors hover:bg-gray-200"
                >
                  Visit Live Site
                  <ExternalLink size={16} />
                </a>
              ) : (
                <span className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/50">
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
