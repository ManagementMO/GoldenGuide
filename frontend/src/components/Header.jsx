import React from 'react';

export default function Header({ fontSize, onFontSizeChange, language, onLanguageChange }) {
  return (
    <header className="sticky top-0 z-10 w-full bg-golden text-white p-4 shadow-md flex flex-row items-center justify-between font-heading">
      <div className="flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          GoldenGuide <span>✨</span>
        </h1>
        <p className="text-sm md:text-base opacity-90 font-body">
          Your Kingston Services Assistant
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="sr-only">Adjust font size</span>
        <button
          onClick={() => onFontSizeChange('normal')}
          className={`min-w-[48px] min-h-[48px] rounded-lg border-2 border-white/50 px-3 font-bold text-lg hover:bg-white/10 transition-colors ${
            fontSize === 'normal' ? 'bg-white/20' : 'bg-transparent'
          }`}
          aria-label="Normal font size"
        >
          A-
        </button>
        <button
          onClick={() => onFontSizeChange('large')}
          className={`min-w-[48px] min-h-[48px] rounded-lg border-2 border-white/50 px-3 font-bold text-2xl hover:bg-white/10 transition-colors ${
            fontSize === 'large' ? 'bg-white/20' : 'bg-transparent'
          }`}
          aria-label="Large font size"
        >
          A+
        </button>
        <div className="border-l-2 border-white/30 h-8 mx-1"></div>
        <button
          onClick={() => onLanguageChange('en')}
          className={`min-w-[48px] min-h-[48px] rounded-lg border-2 border-white/50 px-3 font-bold text-lg hover:bg-white/10 transition-colors ${language === 'en' ? 'bg-white/20' : 'bg-transparent'}`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange('fr')}
          className={`min-w-[48px] min-h-[48px] rounded-lg border-2 border-white/50 px-3 font-bold text-lg hover:bg-white/10 transition-colors ${language === 'fr' ? 'bg-white/20' : 'bg-transparent'}`}
          aria-label="Passer au français"
        >
          FR
        </button>
      </div>
    </header>
  );
}
