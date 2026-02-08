import React from 'react';
import OrbIcon from './OrbIcon';
import styles from './Mascot.module.css';

export default function LoadingIndicator() {
  return (
    <div className={`mb-4 flex w-full justify-start ${styles.fadeIn}`}>
      <div className="flex flex-row max-w-[90%] md:max-w-[82%] items-end">
        <div className="flex-shrink-0 mr-2 mb-1">
          <OrbIcon name="brand" tone="brand" size="sm" />
        </div>

        <div className="relative p-4 rounded-2xl rounded-bl-sm bg-[#fffdf9] border border-[#d9ccb8] text-textbrown shadow-[0_8px_20px_rgba(63,44,25,0.12)]">
          <p className="font-bold text-sm text-textbrown/75 mb-1">GoldenGuide is preparing a response...</p>
          <div className="flex gap-1 mt-1">
             <div className={`h-2 w-2 rounded-full bg-[#7a5a34] ${styles.loadingDot}`}></div>
             <div className={`h-2 w-2 rounded-full bg-[#7a5a34] ${styles.loadingDot}`}></div>
             <div className={`h-2 w-2 rounded-full bg-[#7a5a34] ${styles.loadingDot}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
