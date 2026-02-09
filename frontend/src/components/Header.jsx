import React from 'react';
import { motion } from 'framer-motion';

export default function Header({ fontSize, onFontSizeChange, language, onLanguageChange }) {
  return (
    <header className="z-10 flex w-full items-center justify-between glass-strong glass-highlight rounded-b-2xl px-5 py-3">
      <div className="flex flex-col">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-warm-50 font-heading md:text-2xl">
          GoldenGuide
        </h1>
        <p className="text-sm text-warm-100/50">Your Kingston Services Assistant</p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          {['normal', 'large'].map((sz) => (
            <motion.button
              key={sz}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onFontSizeChange(sz)}
              className={`min-w-[48px] min-h-[48px] rounded-xl px-3 font-bold text-base transition-all ${
                fontSize === sz
                  ? 'btn-golden'
                  : 'btn-glass'
              }`}
              aria-label={sz === 'normal' ? 'Normal font size' : 'Large font size'}
            >
              {sz === 'normal' ? 'A-' : 'A+'}
            </motion.button>
          ))}
        </div>

        <div className="h-7 w-px bg-white/10" aria-hidden="true" />

        <div className="flex items-center gap-1.5">
          {[
            { code: 'en', label: 'EN', ariaLabel: 'Switch to English' },
            { code: 'fr', label: 'FR', ariaLabel: 'Passer au français' },
          ].map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onLanguageChange(lang.code)}
              className={`min-w-[48px] min-h-[48px] rounded-xl px-3 font-bold text-base transition-all ${
                language === lang.code
                  ? 'btn-golden'
                  : 'btn-glass'
              }`}
              aria-label={lang.ariaLabel}
            >
              {lang.label}
            </motion.button>
          ))}
        </div>
      </div>
    </header>
  );
}
