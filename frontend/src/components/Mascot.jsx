'use client';

import { motion, useReducedMotion } from 'framer-motion';
import styles from './Mascot.module.css';

const SPRING = {
  type: 'spring',
  stiffness: 40,
  damping: 30,
  mass: 1.25,
};

const MODE_LABEL = {
  idle: 'Ready',
  listening: 'Listening',
  speaking: 'Speaking',
};

const MODE_GLOW = {
  idle: 0.18,
  listening: 0.24,
  speaking: 0.3,
};

export default function Mascot({
  mode = 'idle',
  animated = true,
  size = 170,
  className = '',
  ariaLabel = 'GoldenGuide assistant status',
  showBadge = true,
}) {
  const reduceMotion = useReducedMotion();
  const safeMode = MODE_LABEL[mode] ? mode : 'idle';
  const glow = MODE_GLOW[safeMode];
  const orbSize = typeof size === 'number' ? `${size}px` : size;

  const shouldAnimate = animated && !reduceMotion;
  const animate = {
    scale: shouldAnimate ? (safeMode === 'speaking' ? 1.028 : safeMode === 'listening' ? 1.022 : 1.016) : 1,
  };

  const transition = !shouldAnimate
    ? { duration: 0 }
    : {
        ...SPRING,
        repeat: Infinity,
        repeatType: 'mirror',
        repeatDelay: safeMode === 'speaking' ? 0.08 : 0.14,
      };

  return (
    <div
      className={`${styles.wrapper} ${styles[safeMode]} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      data-mode={safeMode}
      data-animated={shouldAnimate ? 'true' : 'false'}
      style={{
        '--orb-size': orbSize,
        '--orb-glow': glow,
        '--orb-highlight': '#d8cfb2',
        '--orb-body': '#27415e',
        '--orb-shadow': '#050b17',
      }}
    >
      <motion.div className={styles.lantern} animate={animate} transition={transition}>
        <div className={styles.halo} />
        <div className={styles.glass}>
          <div className={styles.sunset} />
          <div className={styles.softener} />
          <div className={styles.gloss} />
        </div>
      </motion.div>

      {showBadge && <span className={styles.badge}>{MODE_LABEL[safeMode]}</span>}
    </div>
  );
}
