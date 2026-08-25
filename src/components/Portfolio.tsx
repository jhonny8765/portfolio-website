import React from 'react';
import { ArrowRight, Code, Server, GitMerge, Wifi } from 'lucide-react';

const projects = [
  { title: "Suki Suite", desc: "CRM, loyalty, and business ops suite.", icon: <Server size={16} />, tech: ["React", "Node", "PostgreSQL"] },
  { title: "Salon Automation", desc: "Booking and inventory management.", icon: <Code size={16} />, tech: ["TypeScript", "Next.js", "Redis"] },
  { title: "Tournament System", desc: "Real-time bracket management.", icon: <GitMerge size={16} />, tech: ["WebSockets", "Go", "Vue"] },
  { title: "WiFi & Vending", desc: "IoT payment gateways & dashboard.", icon: <Wifi size={16} />, tech: ["Hardware", "Payment API", "Python"] }
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="section bg-main">
      <div className="container">
        <div className="mb-12">
          <h2 className="mb-2 text-primary">## Projects_Log</h2>
          <p className="text-secondary font-mono text-sm">
            $ ls -la ./deployments
          </p>
        </div>

        <div className="grid grid-cols-2">
          {projects.map((project, index) => (
            <div key={index} className="panel">
              <div className="flex items-center gap-3 mb-4 border-b-subtle pb-3">
                <span className="text-accent">{project.icon}</span>
                <h3 className="text-lg text-primary">{project.title}</h3>
              </div>
              <p className="text-secondary mb-6 font-sans text-sm min-h-40">
                {project.desc}
              </p>
              <div className="flex gap-2 flex-wrap mb-6 font-mono text-xs">
                {project.tech.map(t => (
                  <span key={t} className="text-tertiary">[{t}]</span>
                ))}
              </div>
              <a href="#contact" className="link-hover inline-flex-center text-sm font-mono text-secondary">
                View details <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
