import React from 'react';
import { Hammer, BookOpen, FlaskConical, Rocket } from 'lucide-react';

const logItems = [
  {
    icon: Hammer,
    label: "Currently Building",
    text: "A local delivery application for Kidapawan City. Driven by the growth of independent riders using Messenger, it features a web app for quick ordering and precise location-based deliveries.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  {
    icon: BookOpen,
    label: "Currently Learning",
    text: "Techniques and architectures to minimize token usage and optimize costs when building with the Gemini Pro API.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20"
  },
  {
    icon: FlaskConical,
    label: "Recent Experiment",
    text: "The AI Playground (/playground), an interactive testing environment to experiment with AI models and custom system prompts.",
    color: "text-[var(--color-violet-light)]",
    bg: "bg-[var(--color-violet)]/10",
    border: "border-[var(--color-violet)]/20"
  },
  {
    icon: Rocket,
    label: "Next Up",
    text: "A Point of Sale (POS) system designed for easier business management, inspired by the growing number of milk tea shops in Kidapawan City.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20"
  }
];

export default function BuildLog() {
  return (
    <section className="w-full py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-violet-light)] to-[var(--color-violet)]">Log</span>
        </h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
          A snapshot of what I&apos;m working on and exploring right now.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {logItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              className={`flex items-start gap-4 p-5 rounded-2xl border ${item.border} bg-white/[0.02] hover:bg-white/[0.04] transition-colors`}
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">{item.label}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
