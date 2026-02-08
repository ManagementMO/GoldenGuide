'use client';

import Mascot from './Mascot';

export default function OrbIcon({ mode = 'idle', className = '', animated = false, size = 32 }) {
  return (
    <Mascot
      mode={mode}
      animated={animated}
      size={size}
      className={className}
      ariaLabel="GoldenGuide orb icon"
      showBadge={false}
    />
  );
}
