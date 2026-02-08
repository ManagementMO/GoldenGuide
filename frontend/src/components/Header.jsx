import React from 'react';

const FONT_LABELS = ['Small', 'Default', 'Large', 'XL'];

export default function Header({
  currentTime,
  showBack,
  onBack,
  fontScale,
  onDecreaseFont,
  onIncreaseFont,
}) {
  const canDecrease = fontScale > 0;
  const canIncrease = fontScale < FONT_LABELS.length - 1;

  return (
    <header className="sticky top-0 z-10 w-full border-b border-[#e4dacb] bg-[rgba(255,252,246,0.96)] px-4 pt-4 pb-3 shadow-[0_4px_18px_rgba(44,34,20,0.05)] backdrop-blur md:px-6">
      <div className="mb-3 flex items-center justify-between text-xs font-bold tracking-[0.14em] uppercase text-textbrown/58">
        <span>{currentTime}</span>
        <span>GoldenGuide</span>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3 min-h-[48px]">
          {showBack ? (
            <button
              onClick={onBack}
              className="min-h-[46px] rounded-xl border border-[#d6c7b2] bg-white px-4 text-sm font-bold text-textbrown hover:bg-[#f6efe3] transition-colors"
              aria-label="Back to topics"
            >
              Back
            </button>
          ) : (
            <div className="h-[46px] w-[78px]" />
          )}
          <div>
            <h1 className="text-[1.35rem] md:text-[1.6rem] font-bold leading-tight text-textbrown">
              Service Assistant
            </h1>
            <p className="text-sm md:text-base text-textbrown/74 font-body leading-tight">
              Kingston support in plain language
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#fffdf9] rounded-xl border border-[#e1d6c5] px-2 py-1.5">
          <button
            onClick={onDecreaseFont}
            disabled={!canDecrease}
            className="min-w-[42px] min-h-[42px] rounded-lg border border-[#d6c7b2] bg-white px-2 text-xl font-bold text-textbrown hover:bg-[#f6efe3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease text size"
            aria-pressed="false"
          >
            -
          </button>
          <div
            className="px-2 text-center"
            role="status"
            aria-live="polite"
            aria-label={`Text size: ${FONT_LABELS[fontScale]}`}
          >
            <p className="text-[0.64rem] uppercase tracking-[0.12em] text-textbrown/55 font-bold">
              Text
            </p>
            <p className="text-sm font-bold text-textbrown">{FONT_LABELS[fontScale]}</p>
          </div>
          <button
            onClick={onIncreaseFont}
            disabled={!canIncrease}
            className="min-w-[42px] min-h-[42px] rounded-lg border border-[#d6c7b2] bg-white px-2 text-xl font-bold text-textbrown hover:bg-[#f6efe3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase text size"
            aria-pressed="false"
          >
            +
          </button>
        </div>
      </div>
    </header>
  );
}
