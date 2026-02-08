import React, { useState, useEffect } from 'react';
import { Mic, MicOff, PhoneCall, PhoneOff, Radio } from 'lucide-react';

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
    <div className="mt-2 animate-fade-in rounded-2xl border border-emerald-300 bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center">
        <h3 className="mb-2 text-lg font-semibold text-[#1e293b]">
          {status === 'ended' ? 'Call Ended' : `Calling ${recipientName}...`}
        </h3>

        {status !== 'ended' && (
          <div className="mb-4 flex items-center gap-2">
             <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
             <span className="text-base font-semibold uppercase tracking-[0.08em] text-red-600">
               Live Call in Progress
             </span>
          </div>
        )}

        <div className="mb-6 text-4xl font-mono font-semibold text-[#334155]">
          {formatTime(duration)}
        </div>

        {status !== 'ended' && (
          <>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`mb-3 flex min-h-[52px] min-w-[190px] items-center justify-center gap-2 rounded-xl text-base font-semibold transition-colors ${
                isMuted ? 'bg-[#334155] text-white' : 'border border-slate-300 bg-white text-[#334155] hover:bg-[#F8FAFC]'
              }`}
            >
              {isMuted ? <Mic className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> : <MicOff className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </button>

            <button
              onClick={() => alert('Taking over the call — you will be connected directly with the service provider.')}
              className="mb-3 flex min-h-[52px] min-w-[190px] items-center justify-center gap-2 rounded-xl bg-[#334155] text-base font-semibold text-white transition-colors hover:bg-[#1e293b]"
            >
              <PhoneCall className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              Take Over Call
            </button>

            <div className="mb-4 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 text-left">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                <Radio className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                Live Transcript
              </h4>
              <p className="text-base italic text-[#64748B]">
                Live transcript will appear here when WebSocket support is available...
              </p>
            </div>

            <button
              onClick={onEnd}
              className="flex min-h-[52px] min-w-[190px] items-center justify-center gap-2 rounded-xl bg-red-600 text-base font-semibold text-white transition-colors hover:bg-red-700"
            >
              <PhoneOff className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
}
