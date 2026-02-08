import React from 'react';
import styles from './Mascot.module.css';

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-14 h-14',
};

function IconGlyph({ name }) {
  switch (name) {
    case 'transit':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="4.5" width="14" height="12" rx="3" />
          <path d="M8 16.5 7 19M16 16.5 17 19M9 11h6M7.8 8h.01M16.2 8h.01" />
        </svg>
      );
    case 'housing':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3.5 11.5 8.5-7 8.5 7" />
          <path d="M6.5 10.8V19h11v-8.2" />
          <path d="M10.3 19v-4.7h3.4V19" />
        </svg>
      );
    case 'health':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5.8v12.4M5.8 12h12.4" />
          <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
        </svg>
      );
    case 'activities':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4.8" y="5.2" width="14.4" height="13.8" rx="3" />
          <path d="M8 3.8v3M16 3.8v3M4.8 9.4h14.4M8.8 12.2h3.5M8.8 15h6.4" />
        </svg>
      );
    case 'financial':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="7" rx="6.7" ry="2.6" />
          <path d="M5.3 7v7.5c0 1.5 3 2.6 6.7 2.6s6.7-1.1 6.7-2.6V7M8.8 10.4h6.3" />
        </svg>
      );
    case 'accessibility':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="5.6" r="1.6" />
          <path d="M11 8.2v4M8.1 10.2h5.8M12.8 12.1l2.7 4.7" />
          <circle cx="12.3" cy="15.7" r="4.2" />
        </svg>
      );
    case 'document':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3.8h7l4 4V20H8z" />
          <path d="M15 3.8V8h4M10.4 12h6.2M10.4 15h6.2" />
        </svg>
      );
    case 'upload':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16.8V7.3M8.8 10.5 12 7.2l3.2 3.3" />
          <rect x="5.2" y="16" width="13.6" height="4.2" rx="1.5" />
        </svg>
      );
    case 'voice':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5.2a2.7 2.7 0 0 1 2.7 2.7v4.2a2.7 2.7 0 0 1-5.4 0V7.9A2.7 2.7 0 0 1 12 5.2z" />
          <path d="M7.2 12.4a4.8 4.8 0 0 0 9.6 0M12 17.2V20" />
        </svg>
      );
    case 'brand':
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.5 8.6a3.6 3.6 0 1 0 0 6.8h2.1v-2.9h-2.2" />
          <path d="M18.5 8.6a3.6 3.6 0 1 0 0 6.8h2.1v-2.9h-2.2" />
        </svg>
      );
  }
}

export default function OrbIcon({ name = 'brand', size = 'md', tone = 'brand', className = '', label = '' }) {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const tokens = className.split(' ').filter(Boolean);
  const hasPill = tokens.includes('orb-pill');
  const cleanedClassName = tokens.filter((token) => token !== 'orb-pill').join(' ');
  const shapeClass = hasPill ? styles.orbPill : styles.orbCircle;
  const toneClass = {
    brand: styles.orbBrand,
    cool: styles.orbCool,
    sage: styles.orbSage,
    blush: styles.orbBlush,
  }[tone] || styles.orbBrand;

  return (
    <span
      className={`${styles.orbIcon} ${shapeClass} ${toneClass} ${sizeClass} ${cleanedClassName}`.trim()}
      aria-hidden={label ? undefined : true}
      aria-label={label || undefined}
      role={label ? 'img' : undefined}
    >
      <span className={styles.orbGlyph}>
        <IconGlyph name={name} />
      </span>
    </span>
  );
}
