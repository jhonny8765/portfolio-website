import React from 'react';
import { ArrowRight, Monitor, Settings, Trophy, Zap, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: "Suki Suite",
    description: "The complete Salon OS of the Philippines. Features online booking, POS, client records, prepaid packages, and comprehensive reports. GCash, Maya, and QR Ph ready.",
    icon: <Monitor size={24} />,
    tags: ["SaaS", "Next.js", "Payments", "Booking"],
    url: "https://sukisuite.vercel.app/",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2"
  },
  {
    title: "Salon Suite",
    description: "The calm command center for modern salons. Run bookings, customers, staff, checkout, inventory, and reporting from one secure multi-branch workspace.",
    icon: <Settings size={24} />,
    tags: ["SaaS", "Management", "Multi-branch"],
    url: "https://123-eight-rosy.vercel.app/",
    colSpan: "col-span-1 lg:col-span-1"
  },
  {
    title: "Barangay Arena",
    description: "A community-focused tournament and sports management platform designed specifically for local barangay leagues, brackets, and events.",
    icon: <Trophy size={24} />,
    tags: ["Full-Stack", "Community", "Sports"],
    url: "https://barangay-arena-git-main-jhnry.vercel.app/",
    colSpan: "col-span-1 lg:col-span-1"
  },
  {
    title: "Custom Automations",
    description: "I have built numerous bespoke automation workflows connecting different software tools to eliminate repetitive work, sync data, and accelerate business operations.",
    icon: <Zap size={24} />,
    tags: ["n8n", "Zapier", "API Integrations", "Workflows"],
    url: null,
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2"
  }
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-32 relative bg-[var(--color-bg-surface)]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="reveal max-w-2xl mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
            Systems <span className="text-gradient">I've Built</span>
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
            A selection of production-ready platforms, tools, and automated systems I have designed and developed to solve real business problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={index} className={`glass-panel p-8 rounded-3xl reveal delay-${(index % 3) + 1} flex flex-col h-full ${project.colSpan}`}>
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
              <a href="#contact" className="inline-flex items-center gap-2 font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors group">
                Discuss a similar project 
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
