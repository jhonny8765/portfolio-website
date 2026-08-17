import React from 'react';

export default function Hero() {
  return (
    <section className="section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: '800px' }} className="animate-fade-in">
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-4)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Jhon Rey Consolacion
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: 'var(--spacing-6)' }}>
            <span className="text-gradient">AI-Powered Full-Stack Developer</span> <br />
            & Digital Solutions Builder
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-10)', maxWidth: '600px' }}>
            An all-rounder who knows technology and AI — from websites and SaaS platforms to automation, recruitment, resumes, and virtual assistance.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
            <a href="#contact" className="btn-primary">
              Let's Discuss Your Project
            </a>
            <a href="#portfolio" className="btn-secondary">
              View My Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
