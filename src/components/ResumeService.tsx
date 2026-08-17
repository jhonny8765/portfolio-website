import React from 'react';
import { FileSignature } from 'lucide-react';

export default function ResumeService() {
  return (
    <section className="section">
      <div className="container">
        <div className="card-glass reveal" style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ 
            display: 'inline-flex', padding: '1rem', borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', 
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '2rem', color: 'var(--text-primary)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <FileSignature size={36} />
          </div>
          
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Need a <span className="text-gradient">Resume That Gets Noticed?</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            Beyond development and automation, I help professionals stand out. Get your career materials polished by someone who understands what hiring managers and automated applicant tracking systems (ATS) look for.
          </p>
          
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {['Resume', 'CV', 'Cover Letter', 'LinkedIn Profile', 'Complete Application Package'].map(item => (
              <span key={item} style={{ 
                padding: '0.5rem 1rem', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                {item}
              </span>
            ))}
          </div>

          <a href="#contact" className="btn btn-primary">
            Request Resume Services
          </a>
        </div>
      </div>
    </section>
  );
}
