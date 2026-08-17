"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', service: 'General Inquiry' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      setTimeout(() => setStatus('success'), 1000);
      return;
    }

    try {
      const { error } = await supabase.from('contacts').insert([formData]);
      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', email: '', message: '', service: 'General Inquiry' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="grid grid-cols-2" style={{ gap: '4rem', alignItems: 'center' }}>
          <div className="reveal">
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Let's Discuss <br/><span className="text-gradient">Your Project</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: 1.8 }}>
              Whether you need a full-stack web application, an automated business workflow, or professional resume services, I'm here to help. Reach out and let's build something great.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-tertiary)', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-subtle)' }}>
              <p>Pricing is tailored to the scope of your project. Contact me for a custom quote.</p>
            </div>
          </div>

          <div className="card-glass reveal delay-1">
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }} className="animate-fade-in">
                <div style={{ display: 'inline-flex', color: '#10b981', marginBottom: '1.5rem' }}>
                  <CheckCircle size={56} />
                </div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Thanks for reaching out. I'll get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} className="btn btn-secondary">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {status === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertCircle size={20} />
                    <span>Something went wrong. Please try again.</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="name" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Name</label>
                  <input 
                    id="name" required type="text" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input-glass"
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
                  <input 
                    id="email" required type="email" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="input-glass"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="service" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Service Needed</label>
                  <select 
                    id="service" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}
                    className="input-glass" style={{ appearance: 'none' }}
                  >
                    <option>General Inquiry</option>
                    <option>Web & SaaS Development</option>
                    <option>Business Automation</option>
                    <option>AI Solutions</option>
                    <option>Resume & CV Services</option>
                    <option>Applicant Generation</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="message" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message</label>
                  <textarea 
                    id="message" required rows={4}
                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    className="input-glass" style={{ resize: 'vertical' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="btn btn-primary" 
                  style={{ marginTop: '0.5rem', width: '100%', opacity: status === 'submitting' ? 0.7 : 1 }}
                >
                  {status === 'submitting' ? 'Sending...' : (
                    <>Send Message <Send size={18} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
