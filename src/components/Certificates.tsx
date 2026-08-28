import React from 'react';
import { ArrowUpRight, Award, BadgeCheck, FileText } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { portfolioData } from '@/data/portfolioData';

function CredentialCard({
  credential,
  index,
}: {
  credential: (typeof portfolioData.certificates)[number];
  index: number;
}) {
  const isSkillVerification = credential.kind === 'Skill verification';
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0e13] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-volt)]/40 hover:shadow-[0_18px_45px_-24px_rgba(232,245,74,0.65)] sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-volt)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[var(--color-volt)]/10 blur-3xl transition-transform duration-500 group-hover:scale-150" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-volt)]/25 bg-[var(--color-volt)]/10 text-[var(--color-volt)] transition-colors group-hover:border-[var(--color-volt)]/50 group-hover:bg-[var(--color-volt)]/15">
            {isSkillVerification ? <BadgeCheck size={21} /> : <Award size={21} />}
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-volt-light)] uppercase">
              {credential.kind}
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-white/45 uppercase">
              DataCamp / {number}
            </p>
          </div>
        </div>
        <span className="font-mono text-xs text-white/30">{number}</span>
      </div>

      <div className="relative z-10 mt-8 flex-1">
        <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase">
          Credential
        </p>
        <h3 className="max-w-sm text-2xl leading-tight font-semibold tracking-tight text-white transition-colors group-hover:text-[var(--color-volt-light)]">
          {credential.title}
        </h3>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-white/10 pt-4">
          <span className="font-mono text-[10px] tracking-wider text-white/40 uppercase">ID</span>
          <code className="font-mono text-[11px] text-white/65">{credential.credentialId}</code>
        </div>
      </div>

      <div className="relative z-10 mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-5">
        <a
          href={credential.verifyUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Verify ${credential.title} on DataCamp`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--color-volt)] px-3.5 py-2.5 text-xs font-bold text-[var(--bg-primary)] transition-colors hover:bg-[var(--color-volt-light)]"
        >
          <BadgeCheck size={15} aria-hidden="true" />
          {isSkillVerification ? 'Verify skill' : 'Verify certificate'}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <a
          href={credential.pdfUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${credential.title} PDF`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-white/80 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
        >
          <FileText size={15} aria-hidden="true" />
          View PDF
        </a>
      </div>
    </article>
  );
}

export default function Certificates() {
  const certificateCount = portfolioData.certificates.filter(
    (credential) => credential.kind === 'Certificate',
  ).length;
  const skillVerificationCount = portfolioData.certificates.filter(
    (credential) => credential.kind === 'Skill verification',
  ).length;

  return (
    <AnimatedSection id="credentials" className="flex w-full scroll-mt-32 flex-col gap-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--color-volt)]/20 bg-gradient-to-br from-[#10130f] via-[#0b0d11] to-[#090a0f] p-7 shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute -top-32 -right-16 h-72 w-72 rounded-full bg-[var(--color-volt)]/10 blur-[90px]" />
        <div className="pointer-events-none absolute right-8 bottom-8 h-20 w-20 rounded-full border border-[var(--color-volt)]/20 sm:right-12 sm:bottom-12" />
        <div className="pointer-events-none absolute right-14 bottom-14 h-8 w-8 rounded-full bg-[var(--color-volt)]/20 blur-md sm:right-16 sm:bottom-16" />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-volt)]/30 bg-[var(--color-volt)]/10 px-3 py-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] text-[var(--color-volt-light)] uppercase">
              <Award size={14} aria-hidden="true" />
              Credentials / DataCamp
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Proof that compounds.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              A growing record of the systems, data, and AI fundamentals behind the work. Every card
              links to its public DataCamp verification page, with a PDF copy ready to open.
            </p>
          </div>

          <div className="grid w-full max-w-xs grid-cols-2 divide-x divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-black/20 md:shrink-0">
            <div className="p-4 sm:p-5">
              <p className="font-mono text-3xl font-semibold text-[var(--color-volt)]">
                {certificateCount.toString().padStart(2, '0')}
              </p>
              <p className="mt-1 text-xs text-white/55">certificates</p>
            </div>
            <div className="p-4 sm:p-5">
              <p className="font-mono text-3xl font-semibold text-white">
                {skillVerificationCount.toString().padStart(2, '0')}
              </p>
              <p className="mt-1 text-xs text-white/55">skill checks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {portfolioData.certificates.map((credential, index) => (
          <CredentialCard key={credential.credentialId} credential={credential} index={index} />
        ))}
      </div>
    </AnimatedSection>
  );
}
