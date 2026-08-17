import React from 'react';
import { Globe, Layers, Zap, Cpu, FileText, Users, Headset } from 'lucide-react';

const services = [
  {
    icon: <Globe size={24} />,
    title: "Web Development",
    description: "Modern responsive websites and web applications tailored to your business needs."
  },
  {
    icon: <Layers size={24} />,
    title: "SaaS Development",
    description: "Business platforms and scalable, subscription-based systems."
  },
  {
    icon: <Zap size={24} />,
    title: "Automation",
    description: "Smart workflows that connect tools and eliminate repetitive work seamlessly."
  },
  {
    icon: <Cpu size={24} />,
    title: "AI Solutions",
    description: "AI-assisted business tools and processes to accelerate your operations."
  },
  {
    icon: <FileText size={24} />,
    title: "Resume & CV Services",
    description: "Professional resumes, CVs, cover letters, and complete job-application materials."
  },
  {
    icon: <Users size={24} />,
    title: "Applicant Generation",
    description: "Social-media-driven applicant generation and recruitment campaigns."
  },
  {
    icon: <Headset size={24} />,
    title: "Virtual Assistance",
    description: "Technology-assisted administrative and digital support to help you scale."
  }
];

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="reveal" style={{ marginBottom: '4rem', maxWidth: '700px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Expertise & <span className="text-gradient">Services</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            You don't have to hire five different people for your digital needs. I combine web development, AI, automation, and more to turn ideas into working solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-3">
          {services.map((service, index) => (
            <div key={index} className={`card-glass reveal delay-${(index % 3) + 1}`}>
              <div style={{ 
                width: '56px', height: '56px', 
                borderRadius: '16px', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem', color: 'var(--text-primary)',
                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)'
              }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{service.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
