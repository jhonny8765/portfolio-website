import React from 'react';
import { Terminal, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <Terminal size={16} />
            <span>~/jhonny8765/portfolio</span>
          </div>
          
          <h1 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--accent-primary)' }}>const</span> developer = "Jhon Rey";
          </h1>
          
          <div className="code-block" style={{ marginBottom: '2.5rem' }}>
            <div className="terminal-header">
              <div className="terminal-dot"></div>
              <div className="terminal-dot"></div>
              <div className="terminal-dot"></div>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <span style={{ color: 'var(--accent-primary)' }}>&gt;</span> I build digital solutions, web applications, and automated workflows. <br/>
              <span style={{ color: 'var(--accent-primary)' }}>&gt;</span> Focused on performance, AI integration, and robust architecture.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
