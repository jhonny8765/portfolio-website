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
        <div className="grid grid-cols-2 items-start">
          <div>
            <h2 className="mb-4 text-primary">Initialize_Contact</h2>
            <p className="text-secondary font-mono text-sm mb-8">
              Ping me for freelance projects, consultations, or resume services.
            </p>
            <div className="code-block">
              <span className="text-tertiary"># Status: Accepting new clients</span><br/>
              <span className="text-tertiary"># Pricing: Scoped per requirement</span><br/><br/>
              <span className="text-accent">$</span> ping jhonny8765<br/>
              PING jhonny (127.0.0.1): 56 data bytes<br/>
              64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms
            </div>
          </div>

          <div className="panel">
            {status === 'success' ? (
              <div className="text-center py-12 font-mono">
                <TerminalSquare size={48} className="text-success mx-auto mb-4" />
                <h3 className="text-success mb-4">POST /api/contact 200 OK</h3>
                <p className="text-secondary mb-8">Message transmitted successfully.</p>
                <button onClick={() => setStatus('idle')} className="btn btn-secondary">reset()</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {status === 'error' && (
                  <div className="error-panel text-error font-mono text-sm">
                    ERR_CONNECTION_REFUSED
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm text-secondary font-mono mb-2">name: string</label>
                  <input 
                    id="name" required type="text" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input-flat"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm text-secondary font-mono mb-2">email: string</label>
                  <input 
                    id="email" required type="email" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="input-flat"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm text-secondary font-mono mb-2">type: Enum</label>
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
                  <label htmlFor="message" className="block text-sm text-secondary font-mono mb-2">payload: text</label>
                  <textarea 
                    id="message" required rows={4}
                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    className="input-flat resize-y"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="btn btn-primary mt-2 w-full" 
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
