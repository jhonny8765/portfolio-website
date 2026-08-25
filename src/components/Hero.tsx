import React from 'react';
import { Terminal, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="section hero-wrapper">
      <div className="container">
        <div className="max-w-800">
          <div className="flex items-center gap-2 text-tertiary font-mono text-sm mb-6">
            <Terminal size={16} />
            <span>~/jhonny8765/portfolio</span>
          </div>
          
          <h1 className="mb-6 text-primary">
            <span className="text-accent">const</span> developer = "Jhon Rey";
          </h1>
          
          <div className="code-block mb-10">
            <div className="terminal-header">
              <div className="terminal-dot"></div>
              <div className="terminal-dot"></div>
              <div className="terminal-dot"></div>
            </div>
            <p className="text-secondary leading-relaxed">
              <span className="text-accent">&gt;</span> I build digital solutions, web applications, and automated workflows. <br/>
              <span className="text-accent">&gt;</span> Focused on performance, AI integration, and robust architecture.
            </p>
          </div>
          
          <div className="btn-block">
            <a href="#contact" className="btn btn-primary">
              ./execute_contact.sh <ChevronRight size={16} />
            </a>
            <a href="#portfolio" className="btn btn-secondary">
              cat projects.json
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
