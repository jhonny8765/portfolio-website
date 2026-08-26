'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] bg-[var(--bg-primary)] overflow-hidden">
      <motion.div
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, 30, 0, -30, 0],
          scale: [1, 1.1, 1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-violet)]/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -40, 0, 40, 0],
          y: [0, -50, 0, 50, 0],
          scale: [1, 0.9, 1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-violet)]/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, 60, 0, -60, 0],
          y: [0, 60, 0, -60, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-[#06B6D4]/5 rounded-full blur-[100px]"
      />
    </div>
  );
}
