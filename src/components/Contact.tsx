'use client';

import React, { useState, useRef } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactForm } from '@/actions/contact';
import AnimatedSection from './AnimatedSection';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setStatus('success');
        formRef.current?.reset();
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <AnimatedSection id="contact" className="w-full flex justify-center pb-24 scroll-mt-32">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-8 sm:p-12 shadow-[0_0_40px_rgba(232,245,74,0.05)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-volt)]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-volt)]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-10 font-mono">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[var(--color-volt)] animate-pulse"></div>
              <span className="text-[var(--color-volt-light)] text-sm uppercase tracking-widest">Connect_</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight font-sans">
              Initiate <span className="text-[var(--color-volt)]">Handshake</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base">
              Have a project in mind or need an AI/Automation builder? Open a channel below.
            </p>
            <p className="text-[var(--text-secondary)]/60 text-xs mt-4">
              <span aria-hidden="true" className="text-[var(--color-volt)]">*</span> required parameter
            </p>
          </div>

          <div aria-live="polite" className="sr-only">
            {status === 'success' ? 'Message sent successfully. Thank you for reaching out.' : ''}
            {status === 'submitting' ? 'Submitting your message...' : ''}
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-[var(--color-volt)]/20 rounded-full flex items-center justify-center mb-6 border border-[var(--color-volt)]/50">
                <CheckCircle2 size={40} className="text-[var(--color-volt)]" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-[var(--text-secondary)] mb-8 max-w-sm">
                Thank you for reaching out. I&apos;ll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" aria-busy={status === 'submitting'}>
              <div role="alert" aria-live="assertive">
                {status === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 mb-2">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}
              </div>

              {/* Honeypot field (hidden from screen readers and visual users) */}
              <div aria-hidden="true" className="hidden">
                <label>
                  Don&apos;t fill this out if you&apos;re human:
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="text-xs font-mono text-white/50 uppercase tracking-wider mb-1 block">
                    Name <span aria-hidden="true" className="text-[var(--color-volt)]">*</span>
                    <span className="sr-only"> (required)</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    autoComplete="name"
                    maxLength={100}
                    disabled={status === 'submitting'}
                    className="w-full bg-transparent border-b border-white/10 px-0 py-2 min-h-[44px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-[var(--color-volt)] transition-all disabled:opacity-50 rounded-none"
                    placeholder="guest_user"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-mono text-white/50 uppercase tracking-wider mb-1 block">
                    Email <span aria-hidden="true" className="text-[var(--color-volt)]">*</span>
                    <span className="sr-only"> (required)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    autoComplete="email"
                    maxLength={150}
                    disabled={status === 'submitting'}
                    className="w-full bg-transparent border-b border-white/10 px-0 py-2 min-h-[44px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-[var(--color-volt)] transition-all disabled:opacity-50 rounded-none"
                    placeholder="guest@network.local"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="text-xs font-mono text-white/50 uppercase tracking-wider mb-1 block">
                  Request_Type <span aria-hidden="true" className="text-[var(--color-volt)]">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  aria-required="true"
                  disabled={status === 'submitting'}
                  className="w-full bg-transparent border-b border-white/10 px-0 py-2 min-h-[44px] text-white font-mono focus:outline-none focus:border-[var(--color-volt)] transition-all appearance-none disabled:opacity-50 rounded-none cursor-pointer"
                >
                  <option value="inquiry" className="bg-[#151518]">General Inquiry</option>
                  <option value="dev" className="bg-[#151518]">Web & SaaS Development</option>
                  <option value="automation" className="bg-[#151518]">Business Automation (n8n)</option>
                  <option value="resume" className="bg-[#151518]">Resume & Portfolio Sites</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="text-xs font-mono text-white/50 uppercase tracking-wider mb-1 block">
                  Payload <span aria-hidden="true" className="text-[var(--color-volt)]">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  aria-required="true"
                  rows={4}
                  maxLength={1000}
                  disabled={status === 'submitting'}
                  className="w-full bg-transparent border-b border-white/10 px-0 py-2 min-h-[100px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-[var(--color-volt)] transition-all resize-y disabled:opacity-50 rounded-none"
                  placeholder="Enter message body..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                aria-disabled={status === 'submitting'}
                className="w-full py-4 bg-[var(--color-volt)] text-black font-mono font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-volt)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}

