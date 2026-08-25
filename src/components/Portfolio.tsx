import React from 'react';
import { ArrowRight, Code, Server, GitMerge, Wifi } from 'lucide-react';

const projects = [
  { title: "Suki Suite", desc: "CRM, loyalty, and business ops suite.", icon: <Server size={24} />, tech: ["React", "Node", "PostgreSQL"] },
  { title: "Salon Automation", desc: "Booking and inventory management.", icon: <Code size={24} />, tech: ["TypeScript", "Next.js", "Redis"] },
  { title: "Tournament System", desc: "Real-time bracket management.", icon: <GitMerge size={24} />, tech: ["WebSockets", "Go", "Vue"] },
  { title: "WiFi & Vending", desc: "IoT payment gateways & dashboard.", icon: <Wifi size={24} />, tech: ["Hardware", "Payment API", "Python"] }
];

export default function Portfolio() {
  return (
    <div>
      <h2 style={{ fontSize: '18px', borderBottom: '1px solid #7f9db9', paddingBottom: '5px', margin: '0 0 15px 0' }}>Projects Log</h2>
      <div className="grid-2">
        {projects.map((project, index) => (
          <div key={index} style={{ border: '1px solid #ece9d8', padding: '10px', background: '#faf9f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ color: '#3c9a4e' }}>{project.icon}</span>
              <h3 style={{ fontSize: '14px', margin: 0 }}>{project.title}</h3>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#333' }}>
              {project.desc}
            </p>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {project.tech.map(t => (
                <span key={t} style={{ background: '#e0e0e0', padding: '2px 5px', fontSize: '10px', borderRadius: '3px' }}>{t}</span>
              ))}
            </div>
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#0000ee' }}>
              View details <ArrowRight size={12} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
