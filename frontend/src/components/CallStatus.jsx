import React, { useState, useEffect } from 'react';

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

  return (
    <div className="bg-white border-2 border-green-500 rounded-xl p-6 shadow-md mt-4 animate-fade-in">
      <div className="flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold mb-2">
          {status === 'ended' ? 'Call Ended' : `Calling ${recipientName}...`}
        </h3>
        
        {status !== 'ended' && (
          <div className="flex items-center gap-2 mb-4">
             <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
             <span className="font-bold text-red-500 text-lg uppercase tracking-wider">
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
              className={`min-w-[200px] min-h-[56px] font-bold rounded-xl text-xl transition-colors shadow-sm mb-3 ${
                isMuted ? 'bg-golden text-white' : 'bg-white border-2 border-golden text-golden hover:bg-cornsilk'
              }`}
            >
              {isMuted ? '🔇 Unmute' : '🔊 Mute'}
            </button>

            <button
              onClick={() => alert('Taking over the call — you will be connected directly with the service provider.')}
              className="min-w-[200px] min-h-[56px] bg-accent text-white font-bold rounded-xl text-xl hover:bg-[#6d360f] transition-colors shadow-sm mb-3"
            >
              📞 Take Over Call
            </button>

            <div className="w-full bg-cornsilk border border-[#F5DEB3] rounded-xl p-4 mb-4 text-left">
              <h4 className="font-bold text-sm uppercase text-golden mb-2">Live Transcript</h4>
              <p className="text-base text-textbrown/70 italic">
                Live transcript will appear here when WebSocket support is available...
              </p>
            </div>

            <button
              onClick={onEnd}
              className="min-w-[200px] min-h-[56px] bg-danger text-white font-bold rounded-xl text-xl hover:bg-red-700 transition-colors shadow-lg"
            >
              End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
}
