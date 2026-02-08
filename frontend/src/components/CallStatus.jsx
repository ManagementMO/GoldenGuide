import React, { useState, useEffect } from 'react';
import styles from './Mascot.module.css';

export default function CallStatus({ recipientName, status, onEnd }) {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval;
    if (status === 'connected' || status === 'in-progress') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const secondaryButtonClass =
    'min-h-[60px] min-w-[200px] rounded-[0.8rem] border border-[#c4b299] bg-white px-4 py-3 text-lg font-bold text-[#5b4a35] transition-all duration-150 hover:-translate-y-px hover:bg-[#fff8ed] active:translate-y-0';
  const primaryButtonClass =
    'min-h-[60px] min-w-[200px] rounded-[0.8rem] bg-[#293646] px-4 py-3 text-lg font-bold text-white shadow-[0_8px_16px_rgba(43,56,72,0.22)] transition-all duration-150 hover:-translate-y-px hover:bg-[#1f2a37] active:translate-y-0';
  const dangerButtonClass =
    'min-h-[60px] min-w-[200px] rounded-[0.8rem] bg-[#a63a35] px-4 py-3 text-lg font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-red-700 active:translate-y-0';

  return (
    <div className={`mt-4 rounded-[1.1rem] border border-[#77a083] bg-white p-6 shadow-[0_6px_18px_rgba(73,54,31,0.08)] ${styles.fadeIn}`}>
      <div className="flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold mb-2">
          {status === 'ended' ? 'Call Ended' : `Calling ${recipientName}...`}
        </h3>
        
        {status !== 'ended' && (
          <div className="flex items-center gap-2 mb-4">
             <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
             <span className="font-bold text-red-500 text-base uppercase tracking-wider">
               Live Call in Progress
             </span>
          </div>
        )}

        <div className="text-4xl font-mono font-bold mb-6 text-textbrown">
          {formatTime(duration)}
        </div>

        {status !== 'ended' && (
          <>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`${isMuted ? primaryButtonClass : secondaryButtonClass} mb-3`}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>

            <button
              onClick={() => alert('Taking over the call — you will be connected directly with the service provider.')}
              className={`${primaryButtonClass} mb-3`}
            >
              Take Over Call
            </button>

            <div className="w-full bg-[#fbf7ee] border border-[#e3d5c0] rounded-xl p-4 mb-4 text-left">
              <h4 className="font-bold text-sm uppercase text-textbrown/70 mb-2">Live Transcript</h4>
              <p className="text-base text-textbrown/70 italic">
                Live transcript will appear here when WebSocket support is available...
              </p>
            </div>

            <button
              onClick={onEnd}
              className={dangerButtonClass}
            >
              End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
}
