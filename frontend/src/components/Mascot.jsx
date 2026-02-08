import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './Mascot.module.css';

const MODE_LABELS = {
  idle: 'Idle',
  listening: 'Listening',
  speaking: 'Speaking',
};

const SPRING = {
  type: 'spring',
  damping: 34,
  stiffness: 42,
  mass: 1.35,
};

const MORPH_BY_MODE = {
  idle: [
    '44% 56% 51% 49% / 45% 42% 58% 55%',
    '50% 50% 47% 53% / 49% 55% 45% 51%',
    '46% 54% 55% 45% / 52% 46% 54% 48%',
    '44% 56% 51% 49% / 45% 42% 58% 55%',
  ],
  listening: [
    '42% 58% 53% 47% / 46% 44% 56% 54%',
    '54% 46% 42% 58% / 57% 43% 53% 47%',
    '45% 55% 58% 42% / 41% 57% 43% 59%',
    '50% 50% 46% 54% / 52% 48% 55% 45%',
  ],
  speaking: [
    '48% 52% 43% 57% / 56% 44% 52% 48%',
    '53% 47% 57% 43% / 45% 56% 44% 55%',
    '43% 57% 52% 48% / 54% 45% 55% 46%',
    '48% 52% 43% 57% / 56% 44% 52% 48%',
  ],
};

function clampLevel(level) {
  if (!Number.isFinite(level)) return 0;
  return Math.min(1, Math.max(0, level));
}

function getModeProfile(mode, level) {
  const intensity = clampLevel(level);

  if (mode === 'listening') {
    return {
      container: {
        scale: 1.01 + intensity * 0.02,
        y: -3.2 - intensity * 1.1,
      },
      shell: {
        scale: [1, 1.032 + intensity * 0.028, 1],
        rotate: [0, 0.48 + intensity * 0.32, 0],
        x: [0, 0.25, 0],
        y: [0, -1.9 - intensity * 1.4, 0],
        duration: Math.max(2.45, 3.4 - intensity * 0.9),
      },
      aura: {
        scale: [0.99, 1.11 + intensity * 0.07, 1.01],
        opacity: [0.58, 0.92, 0.62],
        duration: Math.max(2.6, 3.6 - intensity * 0.6),
      },
      rippleDuration: Math.max(2.1, 3.2 - intensity * 0.8),
      layerSpeed: [14, 18, 24],
      labelPulse: [1, 1.18 + intensity * 0.12, 1],
    };
  }

  if (mode === 'speaking') {
    return {
      container: {
        scale: 1.015,
        y: -3.6,
      },
      shell: {
        scale: [1, 1.03, 0.996, 1],
        rotate: [0, 4.2, -3.4, 0],
        x: [0, 0.55, -0.45, 0],
        y: [0, -2.4, 0.9, 0],
        duration: 4.8,
      },
      aura: {
        scale: [0.99, 1.1, 1.01],
        opacity: [0.64, 0.9, 0.7],
        duration: 4.2,
      },
      rippleDuration: 2.9,
      layerSpeed: [12.5, 17, 22],
      labelPulse: [1, 1.16, 1],
    };
  }

  return {
    container: {
      scale: 1,
      y: -2,
    },
    shell: {
      scale: [0.992, 1.028, 0.992],
      rotate: [0, 0.75, -0.6, 0],
      x: [0, 0.22, -0.22, 0],
      y: [0, -1.5, 0.4, 0],
      duration: 5.2,
    },
    aura: {
      scale: [0.98, 1.07, 1],
      opacity: [0.58, 0.86, 0.62],
      duration: 5.4,
    },
    rippleDuration: 3.1,
    layerSpeed: [16, 22, 28],
    labelPulse: [1, 1.12, 1],
  };
}

export default function Mascot({
  mode = 'idle',
  level = 0,
  className = '',
  showLabel = true,
}) {
  const reduceMotion = useReducedMotion();
  const safeMode = MODE_LABELS[mode] ? mode : 'idle';
  const profile = getModeProfile(safeMode, level);
  const isListening = safeMode === 'listening';
  const morph = MORPH_BY_MODE[safeMode];
  const strengthByMode = {
    idle: 0.22,
    listening: 0.72,
    speaking: 0.46,
  };
  const warmthStrength = strengthByMode[safeMode];
  const listeningLevel = clampLevel(level);
  const liquidVars = {
    '--sunset-slate': '#334155',
    '--sunset-sky': '#60a5fa',
    '--sunset-gold': '#fcd34d',
    '--sunset-amber': '#f59e0b',
    '--sunset-lavender': '#e0e7ff',
    '--warmth-strength': String(warmthStrength),
    '--ring-visibility': isListening ? String(0.36 + listeningLevel * 0.46) : '0',
    '--state-dot-color': isListening ? '#f59e0b' : safeMode === 'speaking' ? '#60a5fa' : '#334155',
  };

  return (
    <motion.div
      className={`${styles.mascot} ${styles[`mode${safeMode[0].toUpperCase()}${safeMode.slice(1)}`]} ${className}`.trim()}
      initial={false}
      animate={{
        scale: profile.container.scale,
        y: profile.container.y,
      }}
      transition={SPRING}
      style={liquidVars}
      role="status"
      aria-live="polite"
      aria-label={`Voice orb ${MODE_LABELS[safeMode]}`}
    >
      <div className={styles.orbField} aria-hidden="true">
        <motion.div
          className={styles.orbAura}
          animate={
            reduceMotion
              ? { opacity: 0.7, scale: 1 }
              : { opacity: profile.aura.opacity, scale: profile.aura.scale }
          }
          transition={
            reduceMotion
              ? SPRING
              : {
                  duration: profile.aura.duration,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'mirror',
                }
          }
        />

        {[0, 1, 2].map((ringIndex) => (
          <motion.div
            key={ringIndex}
            className={styles.ring}
            animate={
              reduceMotion || !isListening
                ? { scale: 0.92, opacity: 0 }
                : { scale: [0.9, 1.06, 1.18], opacity: [0.42, 0.16, 0] }
            }
            transition={{
              duration: profile.rippleDuration,
              repeat: Infinity,
              ease: 'easeOut',
              delay: ringIndex * (profile.rippleDuration / 3.25),
            }}
          />
        ))}

        <motion.div
          className={styles.orbBody}
          animate={
            reduceMotion
              ? { borderRadius: morph[0] }
              : {
                  scale: profile.shell.scale,
                  rotate: profile.shell.rotate,
                  x: profile.shell.x,
                  y: profile.shell.y,
                  borderRadius: morph,
                }
          }
          transition={
            reduceMotion
              ? SPRING
              : {
                  duration: profile.shell.duration,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'mirror',
                }
          }
        >
          <motion.div
            className={`${styles.liquidLayer} ${styles.layerOne}`}
            animate={reduceMotion ? { rotate: 8 } : { rotate: [8, 34, 14, 8], x: [0, -3, 2, 0], y: [0, 3, -2, 0] }}
            transition={{ duration: profile.layerSpeed[0], repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className={`${styles.liquidLayer} ${styles.layerTwo}`}
            animate={reduceMotion ? { rotate: -16 } : { rotate: [-16, -56, -24, -16], x: [0, 2, -3, 0], y: [0, -2, 2, 0] }}
            transition={{ duration: profile.layerSpeed[1], repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className={`${styles.liquidLayer} ${styles.layerThree}`}
            animate={reduceMotion ? { rotate: 24 } : { rotate: [24, 86, 46, 24], x: [0, 1, -2, 0], y: [0, -1, 1, 0] }}
            transition={{ duration: profile.layerSpeed[2], repeat: Infinity, ease: 'linear' }}
          />

          <div className={styles.innerBloom} />
          <div className={styles.specular} />
          <div className={styles.depthShade} />
        </motion.div>
        <div className={styles.orbShadow} />
      </div>

      {showLabel && (
        <div className={styles.stateBadge}>
          <motion.span
            className={styles.stateDot}
            animate={reduceMotion ? { scale: 1 } : { scale: profile.labelPulse }}
            transition={{
              duration: safeMode === 'idle' ? 2.8 : safeMode === 'listening' ? 1.9 : 2.2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            aria-hidden="true"
          />
          <span className={styles.stateText}>{MODE_LABELS[safeMode]}</span>
        </div>
      )}
    </motion.div>
  );
}
