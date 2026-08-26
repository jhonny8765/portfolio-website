'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { portfolioData } from '@/data/portfolioData';
import { Cpu, Terminal, LayoutTemplate } from 'lucide-react';

const icons = [LayoutTemplate, Cpu, Terminal];

export default function Services() {
  return (
    <AnimatedSection id="services" className="w-full flex flex-col gap-10 scroll-mt-24">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          <Cpu className="text-[var(--color-violet)]" />
          Services
        </h2>
        <p className="text-[var(--text-secondary)] text-lg">How I can help bring your ideas to life.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portfolioData.services.map((service, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.div 
              key={index} 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.05] hover:border-[var(--color-violet)]/30 hover:shadow-[0_10px_30px_-15px_rgba(139,92,246,0.3)] transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-violet)]/10 border border-[var(--color-violet)]/20 flex items-center justify-center text-[var(--color-violet-light)] mb-2">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">{service.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
