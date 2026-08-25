import React from 'react';
import { Terminal, Database, Webhook, Cpu, FileJson, Users, HardDrive } from 'lucide-react';

const services = [
  { icon: <Terminal size={18} />, title: "Web Development", desc: "Modern responsive web applications." },
  { icon: <Database size={18} />, title: "SaaS Development", desc: "Scalable subscription-based systems." },
  { icon: <Webhook size={18} />, title: "Automation", desc: "Smart workflows and tool integrations." },
  { icon: <Cpu size={18} />, title: "AI Solutions", desc: "AI-assisted business tools & processing." },
  { icon: <FileJson size={18} />, title: "Resume Services", desc: "Professional ATS-friendly career materials." },
  { icon: <Users size={18} />, title: "Applicant Gen", desc: "Social recruitment and lead generation." },
  { icon: <HardDrive size={18} />, title: "Virtual Assistance", desc: "Tech-assisted administrative support." }
];

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>// Services & Capabilities</h2>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            {"{"} "stack": ["full-stack", "automation", "ai", "operations"] {"}"}
          </p>
        </div>
        
        <div className="grid grid-cols-2">
          {services.map((service, index) => (
            <div key={index} className="panel" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                {service.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'var(--font-sans)' }}>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
