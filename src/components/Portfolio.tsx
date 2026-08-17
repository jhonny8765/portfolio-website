import React from 'react';
import { ArrowRight, Monitor, Settings, Trophy, Zap, ExternalLink } from 'lucide-react';

import Image from 'next/image';

const projects = [
  {
    title: "Suki Suite",
    description: "Cloud Salon Operating System. Solved 25%+ no-show rates and disjointed manual ledgers via 100% automated SMS booking confirmation and multi-branch database isolation. Achieved sub-120ms average API latency.",
    icon: <Monitor size={24} />,
    tags: ["Next.js 14", "TypeScript", "PostgreSQL", "Redis", "PayMongo"],
    url: "https://sukisuite.vercel.app/",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    image: "/suki-suite-placeholder.jpg"
  },
  {
    title: "Salon Suite",
    description: "Enterprise multi-branch command center. Implemented secure multi-tenant architecture and real-time inventory sync across locations.",
    icon: <Settings size={24} />,
    tags: ["React", "Node.js", "Supabase", "WebSockets"],
    url: "https://123-eight-rosy.vercel.app/",
    colSpan: "col-span-1 lg:col-span-1",
    image: "/salon-suite-placeholder.jpg"
  },
  {
    title: "Barangay Arena",
    description: "Community tournament engine. Designed complex bracket generation algorithms and scalable real-time match event broadcasting for local sports leagues.",
    icon: <Trophy size={24} />,
    tags: ["Full-Stack", "Algorithms", "Real-time"],
    url: "https://barangay-arena-git-main-jhnry.vercel.app/",
    colSpan: "col-span-1 lg:col-span-1",
    image: "/barangay-arena-placeholder.jpg"
  },
  {
    title: "Enterprise Integrations",
    description: "Data pipelines and automation architecture. Built reliable flows: Webhook Trigger → n8n workflow → OpenAI GPT-4o extraction → HubSpot CRM sync + Slack alert + PDF generation.",
    icon: <Zap size={24} />,
    tags: ["n8n", "OpenAI", "Webhooks", "Idempotency"],
    url: null,
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    image: "/automations-placeholder.jpg"
  }
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 relative bg-[var(--color-bg-surface)]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="reveal max-w-2xl mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
            Engineering <span className="text-strong">Case Studies</span>
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
            A selection of production-ready systems where I architected solutions to complex business problems. Focus is on scalability, architecture, and measurable results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={index} className={`glass-panel rounded-3xl reveal delay-${(index % 3) + 1} flex flex-col h-full overflow-hidden ${project.colSpan}`}>
              <div className="w-full h-48 relative bg-zinc-900 border-b border-[var(--color-border-subtle)]">
                <Image 
                  src={project.image} 
                  alt={`${project.title} Interface`}
                  fill
                  className="object-cover opacity-80 mix-blend-screen"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-[var(--color-text-primary)] p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                      {project.icon}
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
                  </div>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/[0.03] border border-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.08] transition-all">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
                <p className="text-[var(--color-text-secondary)] mb-8 text-lg flex-grow">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-sm px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[var(--color-text-secondary)] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors group">
                    View Live Deployment
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </a>
                ) : (
                  <a href="#contact" className="inline-flex items-center gap-2 font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors group">
                    Discuss Integration Flow
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
