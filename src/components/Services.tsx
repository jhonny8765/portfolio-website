import React from 'react';
import { Globe, Layers, Zap, Cpu, FileText, Users } from 'lucide-react';

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
    title: "Resume & CV",
    description: "Professional resumes, CVs, cover letters, and complete job-application materials."
  },
  {
    icon: <Users size={24} />,
    title: "Applicant Generation",
    description: "Social-media-driven applicant generation and recruitment campaigns."
  }
];

export default function Services() {
  return (
    <section id="services" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="reveal max-w-2xl mb-16">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
            Expertise & <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
            You don't have to hire five different people for your digital needs. I combine web development, AI, automation, and more to turn ideas into working solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className={`glass-panel p-8 rounded-3xl reveal delay-${(index % 3) + 1}`}>
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 text-[var(--color-text-primary)] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight">{service.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
