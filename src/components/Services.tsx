'use client';

import React from 'react';
import AnimatedSection from './AnimatedSection';
import { portfolioData } from '@/data/portfolioData';
import { Cpu } from 'lucide-react';
import { Magnetic } from './Magnetic';
import Image from 'next/image';

const serviceImages = [
  '/site-assets/floating/console-cut.webp',
  '/site-assets/floating/ai-braces.webp',
  '/site-assets/floating/workflow-nodes.webp',
];

export default function Services() {
  return (
    <AnimatedSection id="services" className="flex w-full scroll-mt-32 flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <Cpu className="text-[var(--color-volt)]" />
          Services
        </h2>
        <p className="text-lg text-[var(--text-secondary)]">
          How I can help bring your ideas to life.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {portfolioData.services.map((service, index) => {
          const imageSrc = serviceImages[index % serviceImages.length];
          const isScreen = imageSrc.includes('ai-braces') || imageSrc.includes('workflow-nodes');
          return (
            <Magnetic key={index} strength={0.2}>
              <div className="glass-panel flex cursor-default flex-col gap-4 rounded-2xl p-6 duration-300 hover:border-[var(--color-volt)]/30 hover:bg-white/[0.05] hover:shadow-[0_10px_30px_-15px_rgba(232,245,74,0.3)] motion-safe:transition-all motion-safe:hover:-translate-y-1 sm:p-8">
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2">
                  <Image
                    src={imageSrc}
                    alt={service.title}
                    width={48}
                    height={48}
                    className={`object-contain drop-shadow-md ${isScreen ? 'mix-blend-screen' : ''}`}
                  />
                </div>
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                <p className="leading-relaxed text-[var(--text-secondary)]">
                  {service.description}
                </p>
              </div>
            </Magnetic>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
