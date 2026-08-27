'use client';

import React from 'react';
import AnimatedSection from './AnimatedSection';
import { portfolioData } from '@/data/portfolioData';
import { Cpu } from 'lucide-react';
import { Magnetic } from './Magnetic';
import Image from 'next/image';

const serviceImages = [
  "/site-assets/floating/console-cut.webp",
  "/site-assets/floating/ai-braces.webp",
  "/site-assets/floating/workflow-nodes.webp"
];

export default function Services() {
  return (
    <AnimatedSection id="services" className="w-full flex flex-col gap-10 scroll-mt-24">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          <Cpu className="text-[var(--color-volt)]" />
          Services
        </h2>
        <p className="text-[var(--text-secondary)] text-lg">How I can help bring your ideas to life.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portfolioData.services.map((service, index) => {
          const imageSrc = serviceImages[index % serviceImages.length];
          const isScreen = imageSrc.includes('ai-braces') || imageSrc.includes('workflow-nodes');
          return (
            <Magnetic key={index} strength={0.2}>
              <div 
                className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col gap-4 motion-safe:hover:-translate-y-1 hover:bg-white/[0.05] hover:border-[var(--color-volt)]/30 hover:shadow-[0_10px_30px_-15px_rgba(232,245,74,0.3)] motion-safe:transition-all duration-300 cursor-default"
              >
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 p-2">
                  <Image src={imageSrc} alt={service.title} width={48} height={48} className={`object-contain drop-shadow-md ${isScreen ? 'mix-blend-screen' : ''}`} />
                </div>
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
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
