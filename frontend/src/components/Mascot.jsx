'use client';

import { motion, useReducedMotion } from 'framer-motion';

const MODE_LABEL = {
  idle: 'Ready',
  listening: 'Listening',
  speaking: 'Thinking',
};

export default function Mascot({
  mode = 'idle',
  animated = true,
  size = 170,
  className = '',
  ariaLabel = 'GoldenGuide assistant',
  showBadge = true,
}) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animated && !reduceMotion;
  const px = typeof size === 'number' ? size : parseInt(size, 10) || 170;
  const safeMode = MODE_LABEL[mode] ? mode : 'idle';
  const isExcited = safeMode === 'speaking';
  const isListening = safeMode === 'listening';

  return (
    <div
      className={`inline-flex flex-col items-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <motion.div
        animate={
          shouldAnimate
            ? { y: [0, -8, 0], rotate: isExcited ? [0, -2, 2, 0] : 0 }
            : {}
        }
        transition={
          shouldAnimate
            ? {
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                rotate: isExcited
                  ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
                  : {},
              }
            : {}
        }
        style={{ width: px, height: px }}
        className="goldie-glow relative"
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
          {/* Left ear */}
          <ellipse cx="20" cy="40" rx="14" ry="22" fill="#B8860B" transform="rotate(-10 20 40)" />
          <ellipse cx="21" cy="40" rx="10" ry="17" fill="#C49D54" transform="rotate(-10 21 40)" />

          {/* Right ear */}
          <ellipse cx="80" cy="40" rx="14" ry="22" fill="#B8860B" transform="rotate(10 80 40)" />
          <ellipse cx="79" cy="40" rx="10" ry="17" fill="#C49D54" transform="rotate(10 79 40)" />

          {/* Head */}
          <circle cx="50" cy="50" r="34" fill="#DAA520" />

          {/* Inner face */}
          <ellipse cx="50" cy="55" rx="27" ry="24" fill="#E8C55A" />

          {/* Muzzle */}
          <ellipse cx="50" cy="63" rx="17" ry="13" fill="#F5DEB3" />

          {/* Cheek blush */}
          <circle cx="28" cy="55" r="5.5" fill="#E8A0BF" opacity="0.18" />
          <circle cx="72" cy="55" r="5.5" fill="#E8A0BF" opacity="0.18" />

          {/* Eyes */}
          {isExcited ? (
            <>
              <path d="M 33 44 Q 38 37 43 44" stroke="#3D2B1F" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 57 44 Q 62 37 67 44" stroke="#3D2B1F" strokeWidth="2.8" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left eye */}
              <ellipse cx="38" cy="44" rx="5.5" ry="6" fill="#3D2B1F" />
              <ellipse cx="36" cy="42" rx="2.2" ry="2.2" fill="white" />
              <ellipse cx="40" cy="43.5" rx="1" ry="1" fill="white" opacity="0.5" />
              {/* Right eye */}
              <ellipse cx="62" cy="44" rx="5.5" ry="6" fill="#3D2B1F" />
              <ellipse cx="60" cy="42" rx="2.2" ry="2.2" fill="white" />
              <ellipse cx="64" cy="43.5" rx="1" ry="1" fill="white" opacity="0.5" />
            </>
          )}

          {/* Eyebrows (subtle) */}
          {isListening && (
            <>
              <path d="M 32 37 Q 38 34 44 37" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M 56 37 Q 62 34 68 37" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Nose */}
          <ellipse cx="50" cy="57" rx="5.5" ry="4" fill="#3D2B1F" />
          <ellipse cx="48" cy="55.8" rx="2.2" ry="1.3" fill="white" opacity="0.2" />

          {/* Mouth */}
          {isExcited ? (
            <>
              <path d="M 41 63 Q 45.5 70 50 64 Q 54.5 70 59 63" fill="none" stroke="#3D2B1F" strokeWidth="1.8" strokeLinecap="round" />
              <ellipse cx="50" cy="69" rx="5.5" ry="6" fill="#E8788A" />
              <ellipse cx="50" cy="67" rx="4" ry="3" fill="#F09DA8" opacity="0.5" />
            </>
          ) : (
            <path d="M 43 63 Q 46.5 68 50 64 Q 53.5 68 57 63" fill="none" stroke="#3D2B1F" strokeWidth="1.8" strokeLinecap="round" />
          )}
        </svg>

        {/* Thinking dots */}
        {isListening && shouldAnimate && (
          <div className="absolute -top-2 -right-1 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-golden"
                animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {showBadge && (
        <span className="glass rounded-full px-4 py-1.5 text-sm font-bold text-warm-50/80 tracking-wide">
          {MODE_LABEL[safeMode]}
        </span>
      )}
    </div>
  );
}
