import React from 'react';
import { 
  Globe, 
  Layers, 
  Zap, 
  Cpu, 
  FileText, 
  Users, 
  Headset 
} from 'lucide-react';

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
    title: "Recruitment & Applicant Gen",
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
    <section id="services" className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--spacing-16)' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-4)' }}>Services I Offer</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px' }}>
            You don't have to hire five different people for your digital needs. I combine web development, AI, automation, and more to turn ideas into working solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-3">
          {services.map((service, index) => (
            <div key={index} className="card">
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: 'var(--bg-tertiary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 'var(--spacing-6)',
                color: 'var(--text-primary)'
              }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)' }}>{service.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
