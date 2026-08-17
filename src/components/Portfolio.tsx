import React from 'react';
import { ArrowRight, Monitor, Settings, Trophy, Wifi } from 'lucide-react';

const projects = [
  {
    title: "Suki Suite",
    description: "A comprehensive digital suite for managing customer relationships, loyalty, and business operations.",
    icon: <Monitor size={20} />,
    tags: ["SaaS", "Web App", "Automation"]
  },
  {
    title: "Salon & Business Automation",
    description: "Automated booking, inventory, and staff management system tailored for salons and retail businesses.",
    icon: <Settings size={20} />,
    tags: ["Automation", "Web App"]
  },
  {
    title: "Tournament System",
    description: "A real-time bracket and participant management platform for competitive events and e-sports.",
    icon: <Trophy size={20} />,
    tags: ["Full-Stack", "Real-time"]
  },
  {
    title: "WiFi & Vending Systems",
    description: "Integrated payment gateways and management dashboards for automated vending and WiFi hotspots.",
    icon: <Wifi size={20} />,
    tags: ["IoT Integration", "Hardware/Software"]
  }
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="reveal" style={{ marginBottom: '4rem', maxWidth: '700px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Systems <span className="text-gradient">I've Built</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            A selection of platforms, tools, and automated systems I have designed and developed to solve real business problems.
          </p>
        </div>

        <div className="grid grid-cols-2">
          {projects.map((project, index) => (
            <div key={index} className={`card-glass reveal delay-${(index % 2) + 1}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ color: 'var(--text-primary)', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  {project.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{project.title}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '48px' }}>
                {project.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.75rem', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    color: 'var(--text-secondary)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <a href="#contact" className="link-hover" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                Discuss a similar project <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
