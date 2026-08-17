import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '0' }}>
      <div className="container">
        <div style={{ maxWidth: '850px', position: 'relative', zIndex: 1 }} className="reveal">
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            padding: '0.5rem 1rem', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '999px',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
              Jhon Rey Consolacion
            </span>
          </div>
          
          <h1 style={{ marginBottom: '1.5rem' }}>
            <span className="text-gradient">AI-Powered Full-Stack Developer</span> <br />
            <span style={{ color: 'var(--text-primary)' }}>& Digital Solutions Builder</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '650px', lineHeight: 1.8 }}>
            An all-rounder who knows technology and AI — from websites and SaaS platforms to automation, recruitment, resumes, and virtual assistance.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="reveal delay-1">
            <a href="#contact" className="btn btn-primary">
              Let's Discuss Your Project <ArrowRight size={18} />
            </a>
            <a href="#portfolio" className="btn btn-secondary">
              View My Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
