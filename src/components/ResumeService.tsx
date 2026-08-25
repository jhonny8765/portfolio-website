import React from 'react';
import { FileText } from 'lucide-react';

export default function ResumeService() {
  return (
    <section className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
          <FileText size={32} style={{ color: 'var(--text-tertiary)', marginBottom: '1.5rem' }} />
          
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>export function ResumeServices()</h2>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '1rem', maxWidth: '600px', marginBottom: '2rem' }}>
            Get your career materials polished by someone who understands what hiring managers and automated systems look for.
          </p>
          
          <div className="code-block" style={{ textAlign: 'left', width: '100%', maxWidth: '500px', marginBottom: '2rem' }}>
            <span style={{ color: 'var(--accent-primary)' }}>const</span> deliverables = [<br/>
            &nbsp;&nbsp;<span style={{ color: '#a3be8c' }}>"ATS-Optimized Resume"</span>,<br/>
            &nbsp;&nbsp;<span style={{ color: '#a3be8c' }}>"Cover Letter Template"</span>,<br/>
            &nbsp;&nbsp;<span style={{ color: '#a3be8c' }}>"LinkedIn Profile Copy"</span><br/>
            ];
          </div>

          <a href="#contact" className="btn btn-primary">
            ./request_review.sh
          </a>
        </div>
      </div>
    </section>
  );
}
