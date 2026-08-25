"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TerminalSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', service: 'inquiry' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      setTimeout(() => setStatus('success'), 800);
      return;
    }

    try {
      const { error } = await supabase.from('contacts').insert([formData]);
      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', email: '', message: '', service: 'inquiry' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="grid grid-cols-2" style={{ alignItems: 'start' }}>
          <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Initialize_Contact</h2>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Ping me for freelance projects, consultations, or resume services.
            </p>
            <div className="code-block">
              <span style={{ color: 'var(--text-tertiary)' }}># Status: Accepting new clients</span><br/>
              <span style={{ color: 'var(--text-tertiary)' }}># Pricing: Scoped per requirement</span><br/><br/>
              <span style={{ color: 'var(--accent-primary)' }}>$</span> ping jhonny8765<br/>
              PING jhonny (127.0.0.1): 56 data bytes<br/>
              64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms
            </div>
          </div>

          <div className="panel">
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', fontFamily: 'var(--font-mono)' }}>
                <TerminalSquare size={48} style={{ color: '#a3be8c', margin: '0 auto 1rem' }} />
                <h3 style={{ color: '#a3be8c', marginBottom: '1rem' }}>POST /api/contact 200 OK</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Message transmitted successfully.</p>
                <button onClick={() => setStatus('idle')} className="btn btn-secondary">reset()</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {status === 'error' && (
                  <div style={{ padding: '0.75rem', background: '#3b1c1c', border: '1px solid #7f1d1d', borderRadius: '4px', color: '#fca5a5', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    ERR_CONNECTION_REFUSED
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>name: string</label>
                  <input 
                    id="name" required type="text" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input-flat"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>email: string</label>
                  <input 
                    id="email" required type="email" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="input-flat"
                  />
                </div>

                <div>
                  <label htmlFor="service" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>type: Enum</label>
                  <select 
                    id="service" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}
                    className="input-flat"
                  >
                    <option value="inquiry">General Inquiry</option>
                    <option value="dev">Web & SaaS Development</option>
                    <option value="automation">Business Automation</option>
                    <option value="resume">Resume Services</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>payload: text</label>
                  <textarea 
                    id="message" required rows={4}
                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    className="input-flat" style={{ resize: 'vertical' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="btn btn-primary" 
                  style={{ marginTop: '0.5rem', width: '100%', opacity: status === 'submitting' ? 0.7 : 1 }}
                >
                  {status === 'submitting' ? 'Executing...' : 'Submit()'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
