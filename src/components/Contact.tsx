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
    <AnimatedSection id="contact" className="flex w-full scroll-mt-32 justify-center pb-24">
      <div className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-3xl p-8 shadow-[0_0_40px_rgba(232,245,74,0.05)] sm:p-12">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-[var(--color-volt)]/10 blur-[80px]"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[var(--color-volt)]/10 blur-[80px]"></div>

        <div className="relative z-10">
          <div className="mb-10 font-mono">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-volt)]"></div>
              <span className="text-sm tracking-widest text-[var(--color-volt-light)] uppercase">
                Connect_
              </span>
            </div>
            <h2 className="mb-4 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Initiate <span className="text-[var(--color-volt)]">Handshake</span>
            </h2>
            <p className="text-base text-[var(--text-secondary)]">
              Have a project in mind or need an AI/Automation builder? Open a channel below.
            </p>
            <p className="mt-4 text-xs text-[var(--text-secondary)]/60">
              <span aria-hidden="true" className="text-[var(--color-volt)]">
                *
              </span>{' '}
              required parameter
            </p>
          </div>

          <div aria-live="polite" className="sr-only">
            {status === 'success' ? 'Message sent successfully. Thank you for reaching out.' : ''}
            {status === 'submitting' ? 'Submitting your message...' : ''}
          </div>

          {status === 'success' ? (
            <div className="animate-in fade-in zoom-in flex flex-col items-center justify-center py-12 text-center duration-500">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-volt)]/50 bg-[var(--color-volt)]/20">
                <CheckCircle2 size={40} className="text-[var(--color-volt)]" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Message Sent!</h3>
              <p className="mb-8 max-w-sm text-[var(--text-secondary)]">
                Thank you for reaching out. I&apos;ll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6"
              aria-busy={status === 'submitting'}
            >
              <div role="alert" aria-live="assertive">
                {status === 'error' && (
                  <div className="mb-2 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
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

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block font-mono text-xs tracking-wider text-white/60 uppercase"
                  >
                    Name{' '}
                    <span aria-hidden="true" className="text-[var(--color-volt)]">
                      *
                    </span>
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
                    className="min-h-[44px] w-full rounded-none border-b border-white/10 bg-transparent px-0 py-2 font-mono text-white placeholder-white/20 transition-all focus:border-[var(--color-volt)] focus:outline-none disabled:opacity-50"
                    placeholder="guest_user"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block font-mono text-xs tracking-wider text-white/60 uppercase"
                  >
                    Email{' '}
                    <span aria-hidden="true" className="text-[var(--color-volt)]">
                      *
                    </span>
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
                    className="min-h-[44px] w-full rounded-none border-b border-white/10 bg-transparent px-0 py-2 font-mono text-white placeholder-white/20 transition-all focus:border-[var(--color-volt)] focus:outline-none disabled:opacity-50"
                    placeholder="guest@network.local"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="mb-1 block font-mono text-xs tracking-wider text-white/60 uppercase"
                >
                  Request_Type{' '}
                  <span aria-hidden="true" className="text-[var(--color-volt)]">
                    *
                  </span>
                  <span className="sr-only"> (required)</span>
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  aria-required="true"
                  disabled={status === 'submitting'}
                  className="min-h-[44px] w-full cursor-pointer appearance-none rounded-none border-b border-white/10 bg-transparent px-0 py-2 font-mono text-white transition-all focus:border-[var(--color-volt)] focus:outline-none disabled:opacity-50"
                >
                  <option value="inquiry" className="bg-[#151518]">
                    General Inquiry
                  </option>
                  <option value="dev" className="bg-[#151518]">
                    Web & SaaS Development
                  </option>
                  <option value="automation" className="bg-[#151518]">
                    Business Automation (n8n)
                  </option>
                  <option value="resume" className="bg-[#151518]">
                    Resume & Portfolio Sites
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block font-mono text-xs tracking-wider text-white/60 uppercase"
                >
                  Payload{' '}
                  <span aria-hidden="true" className="text-[var(--color-volt)]">
                    *
                  </span>
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
                  className="min-h-[100px] w-full resize-y rounded-none border-b border-white/10 bg-transparent px-0 py-2 font-mono text-white placeholder-white/20 transition-all focus:border-[var(--color-volt)] focus:outline-none disabled:opacity-50"
                  placeholder="Enter message body..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                aria-disabled={status === 'submitting'}
                className="group flex w-full items-center justify-center gap-2 bg-[var(--color-volt)] py-4 font-mono text-sm font-bold tracking-wider text-black uppercase transition-all hover:bg-[var(--color-volt)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send
                      size={20}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
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
