import React from 'react';
import { FileSignature } from 'lucide-react';

export default function ResumeService() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        <div style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-xl)', 
          padding: 'var(--spacing-10)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'inline-flex', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-tertiary)', marginBottom: 'var(--spacing-6)' }}>
            <FileSignature size={32} />
          </div>
          <h2 style={{ fontSize: '2.25rem', marginBottom: 'var(--spacing-4)' }}>Need a Resume That Gets Noticed?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: 'var(--spacing-8)' }}>
            Beyond development and automation, I help professionals stand out. Get your career materials polished by someone who understands what hiring managers and automated applicant tracking systems (ATS) look for.
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--spacing-8)' }}>
            {['Resume', 'CV', 'Cover Letter', 'LinkedIn Profile', 'Complete Job Application Package'].map(item => (
              <span key={item} style={{ 
                padding: 'var(--spacing-2) var(--spacing-4)', 
                backgroundColor: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.95rem'
              }}>
                {item}
              </span>
            ))}
          </div>

          <a href="#contact" className="btn-primary">
            Request Resume Services
          </a>
        </div>
      </div>
    </section>
  );
}
