import React from 'react';
import { Building2 } from 'lucide-react';

export default function Header({ fontSize, onFontSizeChange, language, onLanguageChange }) {
  const controlClass =
    'min-w-[60px] min-h-[60px] rounded-2xl border border-[#CBD5E1] bg-white px-3 font-semibold text-base text-[#334155] transition-colors hover:bg-[#F1F5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#475569]';

  return (
    <header className="z-10 flex w-full flex-row items-center justify-between border-b border-slate-200 bg-white p-4 text-[#334155] shadow-sm">
      <div className="flex flex-col">
        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight md:text-2xl">
          <Building2 className="h-5 w-5 text-[#334155]" strokeWidth={2} aria-hidden="true" />
          GoldenGuide
        </h1>
        <p className="text-sm text-[#64748B] md:text-base">
          Your Kingston Services Assistant
        </p>
      </div>

      <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFontSizeChange('normal')}
            className={`${controlClass} ${fontSize === 'normal' ? 'border-[#475569] bg-[#E2E8F0]' : ''}`}
            aria-label="Normal font size"
          >
            A-
          </button>
          <button
            onClick={() => onFontSizeChange('large')}
            className={`${controlClass} ${fontSize === 'large' ? 'border-[#475569] bg-[#E2E8F0]' : ''}`}
            aria-label="Large font size"
          >
            A+
          </button>
        </div>
        <div className="h-8 w-px bg-slate-300" aria-hidden="true" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onLanguageChange('en')}
            className={`${controlClass} ${language === 'en' ? 'border-[#475569] bg-[#E2E8F0]' : ''}`}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('fr')}
            className={`${controlClass} ${language === 'fr' ? 'border-[#475569] bg-[#E2E8F0]' : ''}`}
            aria-label="Passer au français"
          >
            FR
          </button>
        </div>
      </div>
    </header>
  );
}
