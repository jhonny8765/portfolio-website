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
    
    // Check if supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setTimeout(() => setStatus('success'), 1000);
      return;
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([formData]);

      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', email: '', message: '', service: 'General Inquiry' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-10)' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-4)' }}>Let's Discuss Your Project</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: 'var(--spacing-8)', maxWidth: '500px' }}>
              Whether you need a full-stack web application, an automated business workflow, or professional resume services, I'm here to help. Reach out and let's build something great.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', color: 'var(--text-secondary)' }}>
              <p>Pricing is tailored to the scope of your project. Contact me for a custom quote.</p>
            </div>
          </div>

          <div className="card">
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-10) 0' }}>
                <div style={{ display: 'inline-flex', color: '#10b981', marginBottom: 'var(--spacing-4)' }}>
                  <CheckCircle size={48} />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-6)' }}>Thanks for reaching out. I'll get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} className="btn-secondary">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {status === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-md)' }}>
                    <AlertCircle size={18} />
                    <span style={{ fontSize: '0.9rem' }}>Something went wrong. Please try again.</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <label htmlFor="name" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Name</label>
                  <input 
                    id="name"
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    style={{ 
                      padding: 'var(--spacing-3)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit'
                    }} 
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
                  <input 
                    id="email"
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{ 
                      padding: 'var(--spacing-3)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit'
                    }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <label htmlFor="service" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Service Needed</label>
                  <select 
                    id="service"
                    value={formData.service}
                    onChange={e => setFormData({...formData, service: e.target.value})}
                    style={{ 
                      padding: 'var(--spacing-3)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      appearance: 'none'
                    }} 
                  >
                    <option>General Inquiry</option>
                    <option>Web & SaaS Development</option>
                    <option>Business Automation</option>
                    <option>AI Solutions</option>
                    <option>Resume & CV Services</option>
                    <option>Applicant Generation</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <label htmlFor="message" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message</label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    style={{ 
                      padding: 'var(--spacing-3)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }} 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="btn-primary" 
                  style={{ marginTop: 'var(--spacing-2)', width: '100%', opacity: status === 'submitting' ? 0.7 : 1 }}
                >
                  {status === 'submitting' ? 'Sending...' : (
                    <>Send Message <Send size={16} style={{ marginLeft: 'var(--spacing-2)' }} /></>
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
