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
    <section id="contact" className="py-32 relative bg-[var(--color-bg-surface)]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
              Let's Discuss <br/><span className="text-gradient">Your Project</span>
            </h2>
            <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed mb-10 max-w-lg">
              Whether you need a full-stack web application, an automated business workflow, or professional resume services, I'm here to help. Reach out and let's build something great.
            </p>
            
            <div className="flex flex-col gap-4 text-[var(--color-text-tertiary)] pl-6 border-l-2 border-[var(--color-border-subtle)] text-lg">
              <p>Pricing is tailored to the scope of your project. Contact me for a custom quote.</p>
            </div>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-3xl reveal delay-1">
            {status === 'success' ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="inline-flex text-emerald-500 mb-6">
                  <CheckCircle size={64} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-medium tracking-tight mb-4">Message Sent!</h3>
                <p className="text-[var(--color-text-secondary)] text-lg mb-8">Thanks for reaching out. I'll get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-base transition-all duration-300 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-[var(--color-border-strong)] hover:-translate-y-0.5">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                    <AlertCircle size={20} />
                    <span>Something went wrong. Please try again.</span>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-[var(--color-text-secondary)]">Name</label>
                  <input 
                    id="name" required type="text" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[var(--color-text-primary)] transition-all duration-300 focus:bg-white/[0.05] focus:border-white/20 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.05)] outline-none"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
                  <input 
                    id="email" required type="email" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[var(--color-text-primary)] transition-all duration-300 focus:bg-white/[0.05] focus:border-white/20 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.05)] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="service" className="text-sm font-medium text-[var(--color-text-secondary)]">Service Needed</label>
                  <select 
                    id="service" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}
                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[var(--color-text-primary)] transition-all duration-300 focus:bg-white/[0.05] focus:border-white/20 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.05)] outline-none appearance-none"
                  >
                    <option className="bg-[var(--color-bg-surface)]">General Inquiry</option>
                    <option className="bg-[var(--color-bg-surface)]">Web & SaaS Development</option>
                    <option className="bg-[var(--color-bg-surface)]">Business Automation</option>
                    <option className="bg-[var(--color-bg-surface)]">AI Solutions</option>
                    <option className="bg-[var(--color-bg-surface)]">Resume & CV Services</option>
                    <option className="bg-[var(--color-bg-surface)]">Applicant Generation</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-[var(--color-text-secondary)]">Message</label>
                  <textarea 
                    id="message" required rows={4}
                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[var(--color-text-primary)] transition-all duration-300 focus:bg-white/[0.05] focus:border-white/20 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.05)] outline-none resize-y"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className={`mt-2 w-full inline-flex items-center justify-center px-8 py-4 rounded-xl font-medium text-base transition-all duration-500 bg-[var(--color-text-primary)] text-[var(--color-bg-main)] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] gap-2 ${status === 'submitting' ? 'opacity-70' : ''}`}
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
