import React from 'react';

export default function Footer() {
  return (
    <footer style={{ padding: '2rem 0', background: 'var(--bg-main)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            jhonny8765/portfolio-website v1.0.0
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="https://github.com/jhonny8765" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="link-hover" style={{ color: 'var(--text-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.7a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13 13 0 0 0-7 0C4.3 1.6 3 2 3 2a5.5 5.5 0 0 0-.1 3.8 5.5 5.5 0 0 0-1.5 3.8c0 5.2 3 6.4 6 6.7a4.8 4.8 0 0 0-1 3.2v4"></path>
              </svg>
            </a>
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" aria-label="Vercel Profile" className="link-hover" style={{ color: 'var(--text-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
