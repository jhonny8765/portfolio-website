import React from 'react';
import { Metadata } from 'next';
import { TransitionLink as Link } from '@/components/TransitionLink';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, CheckCircle2, Terminal } from 'lucide-react';
import { portfolioData } from '@/data/portfolioData';

export const metadata: Metadata = {
  alternates: {
    canonical: '/projects/sukisuite',
  },
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
  },
};

export default function SukiSuiteCaseStudy() {
  const project = portfolioData.projects.find((p) => p.id === 'sukisuite');

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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-volt)]/30 bg-[var(--color-volt)]/5 px-3 py-1.5 text-xs font-semibold tracking-widest text-[var(--color-volt-light)] uppercase">
            <Terminal size={14} />
            Live Deployment
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] sm:text-5xl lg:text-7xl">
            {project.title}
          </h1>
          <p className="text-xl font-light text-[var(--text-secondary)]">{project.tagline}</p>
        </div>

        {/* Project Screenshot */}
        <div className="relative mb-8 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <Image
            src={project.imagePlaceholder}
            alt="SukiSuite Interface"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Guided Demo Screenshot */}
        <div className="relative mb-16 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <Image
            src="/projects/salon-suite.png"
            alt="Salon Suite Demo Interface"
            fill
            className="object-cover"
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
              <h2 className="mb-4 text-2xl font-semibold text-white">Verified Product Surface</h2>
              <p className="mb-6 leading-relaxed text-[var(--text-secondary)]">
                The public Salon Suite demo illustrates the following core workflows and
                capabilities. (Note: The demo uses realistic sample data. These features illustrate
                software capability, not active production integrations or verified customer
                results.)
              </p>
              <ul className="space-y-3">
                {[
                  'Booking workflow',
                  'Customer records',
                  'Staff and branch operations',
                  'Checkout and payment controls',
                  'Inventory concepts',
                  'Follow-up queues',
                  'Reports and management views',
                  'Guided onboarding',
                  'Package options and introductory pricing',
                ].map((feature, i) => (
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

            <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-volt)]/20 bg-gradient-to-b from-[var(--color-volt)]/10 to-transparent p-6">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Links</h3>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-volt)] py-3 font-semibold text-[var(--color-bg)] transition-colors hover:bg-[var(--color-volt-light)]"
              >
                Live Product
                <ExternalLink size={16} />
              </a>

              <a
                href="https://123-eight-rosy.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-white transition-colors hover:bg-white/10"
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
