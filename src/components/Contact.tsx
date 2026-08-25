'use client';

import React, { useState, useRef } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactForm } from '@/actions/contact';

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
    <section id="contact" className="w-full flex justify-center pb-24 scroll-mt-24">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-8 sm:p-12 shadow-[0_0_40px_rgba(139,92,246,0.05)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-violet)]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-violet)]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Let&apos;s Work Together</h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Have a project in mind or need an AI/Automation builder? Send me a message.
            </p>
            <p className="text-[var(--text-secondary)] text-sm mt-4">
              Fields marked with an asterisk (<span aria-hidden="true" className="text-[var(--color-violet-light)]">*</span>) are required.
            </p>
          </div>

          <div aria-live="polite" className="sr-only">
            {status === 'success' ? 'Message sent successfully. Thank you for reaching out.' : ''}
            {status === 'submitting' ? 'Submitting your message...' : ''}
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-[var(--color-violet)]/20 rounded-full flex items-center justify-center mb-6 border border-[var(--color-violet)]/50">
                <CheckCircle2 size={40} className="text-[var(--color-violet-light)]" aria-hidden="true" />
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
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-white/80">
                    Name <span aria-hidden="true" className="text-[var(--color-violet-light)]">*</span>
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
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-violet)]/50 focus:ring-1 focus:ring-[var(--color-violet)]/50 transition-all disabled:opacity-50"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white/80">
                    Email <span aria-hidden="true" className="text-[var(--color-violet-light)]">*</span>
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
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-violet)]/50 focus:ring-1 focus:ring-[var(--color-violet)]/50 transition-all disabled:opacity-50"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium text-white/80">
                  How can I help you? <span aria-hidden="true" className="text-[var(--color-violet-light)]">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  aria-required="true"
                  disabled={status === 'submitting'}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-white focus:outline-none focus:border-[var(--color-violet)]/50 focus:ring-1 focus:ring-[var(--color-violet)]/50 transition-all appearance-none disabled:opacity-50"
                >
                  <option value="inquiry">General Inquiry</option>
                  <option value="dev">Web & SaaS Development</option>
                  <option value="automation">Business Automation (n8n)</option>
                  <option value="resume">Resume & Portfolio Sites</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-white/80">
                  Message <span aria-hidden="true" className="text-[var(--color-violet-light)]">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  aria-required="true"
                  rows={5}
                  maxLength={3000}
                  disabled={status === 'submitting'}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-violet)]/50 focus:ring-1 focus:ring-[var(--color-violet)]/50 transition-all resize-none disabled:opacity-50"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                aria-disabled={status === 'submitting'}
                className="w-full py-4 rounded-xl bg-[var(--color-violet)] text-white font-bold text-lg hover:bg-[var(--color-violet-light)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
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
    </section>
  );
}
