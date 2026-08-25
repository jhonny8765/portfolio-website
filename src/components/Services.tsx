import React from 'react';
import { Terminal, Database, Webhook, Cpu, FileJson, Users, HardDrive } from 'lucide-react';

const services = [
  { icon: <Terminal size={24} />, title: "Web Development", desc: "Modern responsive web applications." },
  { icon: <Database size={24} />, title: "SaaS Development", desc: "Scalable subscription-based systems." },
  { icon: <Webhook size={24} />, title: "Automation", desc: "Smart workflows and tool integrations." },
  { icon: <Cpu size={24} />, title: "AI Solutions", desc: "AI-assisted business tools & processing." },
  { icon: <FileJson size={24} />, title: "Resume Services", desc: "Professional ATS-friendly career materials." },
  { icon: <Users size={24} />, title: "Applicant Gen", desc: "Social recruitment and lead generation." },
  { icon: <HardDrive size={24} />, title: "Virtual Assistance", desc: "Tech-assisted administrative support." }
];

export default function Services() {
  return (
    <div>
      <h2 style={{ fontSize: '18px', borderBottom: '1px solid #7f9db9', paddingBottom: '5px', margin: '0 0 15px 0' }}>Services & Capabilities</h2>
      <div className="grid-2">
        {services.map((service, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ color: '#0054e3', padding: '5px' }}>
              {service.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '13px', margin: '0 0 4px 0', color: '#000' }}>{service.title}</h3>
              <p style={{ margin: 0, color: '#333', fontSize: '12px' }}>{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
