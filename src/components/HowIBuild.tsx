import React from 'react';
import { Search, PenTool, Link2, TrendingUp } from 'lucide-react';

const steps = [
  {
    num: "01",
    title: "Discover",
    desc: "Understand the idea and the real problem.",
    icon: Search
  },
  {
    num: "02",
    title: "Prototype",
    desc: "Turn the concept into a working interface quickly.",
    icon: PenTool
  },
  {
    num: "03",
    title: "Integrate",
    desc: "Connect APIs, AI, databases, and automations.",
    icon: Link2
  },
  {
    num: "04",
    title: "Improve",
    desc: "Test, refine, secure, and deploy.",
    icon: TrendingUp
  }
];

export default function HowIBuild() {
  return (
    <section className="w-full py-16">
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          How I <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-violet-light)] to-[var(--color-violet)]">Build</span>
        </h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
          My transparent process for turning ideas into deployed digital products.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div 
              key={step.num}
              className="relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
            >
              <div className="text-[var(--color-violet-light)]/20 text-5xl font-bold absolute top-4 right-6 pointer-events-none transition-all group-hover:scale-110 group-hover:text-[var(--color-violet-light)]/30">
                {step.num}
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-[var(--color-violet)]/10 flex items-center justify-center text-[var(--color-violet-light)] mb-6 border border-[var(--color-violet)]/20">
                <Icon size={24} />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
