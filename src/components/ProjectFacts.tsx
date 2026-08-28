import React from 'react';
import { Calendar, Clock, Code2, Quote, TrendingUp, PlayCircle } from 'lucide-react';

export interface ProjectFactShape {
  shippedDate?: string;
  buildTime?: string;
  quote?: { text: string; author: string };
  metric?: { value: string; label: string };
  githubUrl?: string;
  walkthroughUrl?: string;
}

interface ProjectFactsProps {
  project: ProjectFactShape;
}

/**
 * Conversion facts for case-study pages (plan 5.1/5.2/5.4). Every block is
 * conditionally rendered ONLY when its data exists — real values are added to
 * portfolioData by the owner; nothing here may be fabricated.
 */
export function ProjectFacts({ project }: ProjectFactsProps) {
  const { shippedDate, buildTime, quote, metric, githubUrl, walkthroughUrl } = project;

  if (!shippedDate && !buildTime && !quote && !metric && !githubUrl && !walkthroughUrl) {
    return null;
  }

  return (
    <div className="mb-16 space-y-8">
      {/* Facts strip: shipped date + build duration + source/walkthrough links */}
      {(shippedDate || buildTime || githubUrl || walkthroughUrl) && (
        <dl className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-4 font-mono text-sm">
          {shippedDate && (
            <div className="flex items-center gap-2">
              <Calendar size={16} aria-hidden="true" className="text-[var(--color-volt)]" />
              <dt className="sr-only">Shipped</dt>
              <dd className="text-[var(--text-secondary)]">
                Shipped <span className="text-white">{shippedDate}</span>
              </dd>
            </div>
          )}
          {buildTime && (
            <div className="flex items-center gap-2">
              <Clock size={16} aria-hidden="true" className="text-[var(--color-volt)]" />
              <dt className="sr-only">Build time</dt>
              <dd className="text-[var(--text-secondary)]">
                Built in <span className="text-white">{buildTime}</span>
              </dd>
            </div>
          )}
          {walkthroughUrl && (
            <a
              href={walkthroughUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg text-[var(--color-volt)] underline-offset-4 transition-colors hover:text-[var(--color-volt-light)] hover:underline"
            >
              <PlayCircle size={16} aria-hidden="true" />
              Watch walkthrough
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg text-[var(--color-volt)] underline-offset-4 transition-colors hover:text-[var(--color-volt-light)] hover:underline"
            >
              <Code2 size={16} aria-hidden="true" />
              View source
            </a>
          )}
        </dl>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Honest metric callout */}
        {metric && (
          <figure className="flex flex-col justify-center rounded-2xl border border-[var(--color-volt)]/20 bg-[var(--color-volt)]/5 p-6">
            <div className="flex items-center gap-3">
              <TrendingUp
                size={20}
                aria-hidden="true"
                className="shrink-0 text-[var(--color-volt)]"
              />
              <span className="text-4xl font-bold tracking-tight text-white">{metric.value}</span>
            </div>
            <figcaption className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {metric.label}
            </figcaption>
          </figure>
        )}

        {/* Real third-party quote */}
        {quote && (
          <blockquote className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <Quote size={18} aria-hidden="true" className="mb-3 text-[var(--color-volt)]" />
            <p className="leading-relaxed text-white/90">&ldquo;{quote.text}&rdquo;</p>
            <footer className="mt-3 font-mono text-xs text-[var(--text-secondary)]">
              — {quote.author}
            </footer>
          </blockquote>
        )}
      </div>
    </div>
  );
}
