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
    <section id="portfolio" className="section" style={{ background: 'var(--bg-main)' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>## Projects_Log</h2>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            $ ls -la ./deployments
          </p>
        </div>

        <div className="grid grid-cols-2">
          {projects.map((project, index) => (
            <div key={index} className="panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>{project.icon}</span>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{project.title}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', minHeight: '40px' }}>
                {project.desc}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                {project.tech.map(t => (
                  <span key={t} style={{ color: 'var(--text-tertiary)' }}>[{t}]</span>
                ))}
              </div>
              <a href="#contact" className="link-hover" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                View details <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
