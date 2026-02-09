import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, PhoneCall, PhoneOff, Radio } from 'lucide-react';

export default function CallStatus({ recipientName, status, onEnd }) {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval;
    if (status === 'connected' || status === 'in-progress') {
      interval = setInterval(() => setDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className="mt-2 glass-strong rounded-2xl p-5 glass-highlight border border-success/20">
      <div className="flex flex-col items-center justify-center text-center">
        <h3 className="mb-2 text-lg font-bold text-warm-50 font-heading">
          {status === 'ended' ? 'Call Ended' : `Calling ${recipientName}...`}
        </h3>

        {status !== 'ended' && (
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-danger" />
            <span className="text-base font-bold uppercase tracking-[0.08em] text-danger">Live Call</span>
          </div>
        )}

        <div className="mb-6 text-4xl font-mono font-bold text-golden">{formatTime(duration)}</div>

        {status !== 'ended' && (
          <>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setIsMuted(!isMuted)}
              className={`mb-3 flex min-h-[48px] min-w-[180px] items-center justify-center gap-2 rounded-xl text-base font-bold transition-all ${
                isMuted ? 'btn-golden' : 'btn-glass'
              }`}>
              {isMuted ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </motion.button>

            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => alert('Taking over the call — you will be connected directly with the service provider.')}
              className="mb-3 flex min-h-[48px] min-w-[180px] items-center justify-center gap-2 btn-golden text-base">
              <PhoneCall className="h-5 w-5" /> Take Over Call
            </motion.button>

            <div className="mb-4 w-full glass rounded-xl p-4 text-left">
              <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">
                <Radio className="h-4 w-4" /> Live Transcript
              </h4>
              <p className="text-base italic text-warm-100/40">Live transcript will appear here when WebSocket support is available...</p>
            </div>

            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={onEnd}
              className="flex min-h-[48px] min-w-[180px] items-center justify-center gap-2 btn-danger text-base font-bold">
              <PhoneOff className="h-5 w-5" /> End Call
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}
