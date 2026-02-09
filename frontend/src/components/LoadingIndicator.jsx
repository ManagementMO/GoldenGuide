import React from 'react';
import { motion } from 'framer-motion';
import OrbIcon from './OrbIcon';

export default function LoadingIndicator() {
  return (
    <div className="flex w-full justify-start mb-4 animate-fade-in">
      <div className="flex flex-row max-w-[85%] items-end">
        <div className="flex-shrink-0 mr-2 mb-1">
          <OrbIcon mode="thinking" animated size={32} />
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="relative glass glass-highlight rounded-2xl rounded-bl-sm p-4">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">Goldie is thinking...</p>
          <div className="flex gap-1.5 mt-1">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
              className="w-2 h-2 rounded-full bg-golden" />
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.12 }}
              className="w-2 h-2 rounded-full bg-golden" />
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.24 }}
              className="w-2 h-2 rounded-full bg-golden" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
