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
    <section id="portfolio" className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--spacing-16)' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-4)' }}>Projects / Systems I've Built</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px' }}>
            A selection of platforms, tools, and automated systems I have designed and developed to solve real business problems.
          </p>
        </div>

        <div className="grid grid-cols-2">
          {projects.map((project, index) => (
            <div key={index} className="card" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>
                  {project.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem' }}>{project.title}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-6)', minHeight: '48px' }}>
                {project.description}
              </p>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{ 
                    fontSize: '0.8rem', 
                    padding: 'var(--spacing-1) var(--spacing-3)', 
                    backgroundColor: 'var(--bg-tertiary)', 
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--text-secondary)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: '0.9rem', fontWeight: 500 }}>
                Discuss a similar project <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
