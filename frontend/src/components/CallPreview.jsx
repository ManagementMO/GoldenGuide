import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PencilLine, PhoneCall } from 'lucide-react';
import CallStatus from './CallStatus';

export default function CallPreview({ preview, onConfirm }) {
  const [isEditing, setIsEditing] = useState(false);
  const [script, setScript] = useState(preview.script || '');
  const [callState, setCallState] = useState('idle');

  if (callState === 'calling' || callState === 'ended') {
    return <CallStatus recipientName={preview.recipient_name} status={callState === 'ended' ? 'ended' : 'connected'} onEnd={() => setCallState('ended')} />;
  }

  const handlePlaceCall = () => {
    setCallState('calling');
    onConfirm({ ...preview, script });
  };

  return (
    <div className="my-2 glass-strong rounded-2xl p-5 glass-highlight">
      <h3 className="mb-4 border-b border-white/5 pb-2 text-lg font-bold text-golden font-heading">Ready to place call?</h3>

      <div className="mb-6 space-y-4">
        <div>
          <span className="block text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">Calling</span>
          <span className="text-lg font-bold text-warm-50">{preview.recipient_name}</span>
        </div>
        <div>
          <span className="block text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">Number</span>
          <span className="text-lg font-mono text-golden">{preview.phone_number}</span>
        </div>
        <div>
          <span className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">What I'll Say</span>
          {isEditing ? (
            <textarea value={script} onChange={(e) => setScript(e.target.value)} className="h-28 w-full rounded-xl glass-input p-2.5 text-base" />
          ) : (
            <div className="rounded-xl glass p-3 text-base italic text-warm-50/70 border-l-4 border-golden/30">"{script}"</div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handlePlaceCall}
          className="flex min-h-[48px] flex-grow items-center justify-center gap-2 btn-success text-base font-bold">
          <PhoneCall className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Place Call
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setIsEditing(!isEditing)}
          className="flex min-h-[48px] flex-grow items-center justify-center gap-2 btn-glass text-base font-bold">
          <PencilLine className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> {isEditing ? 'Save Changes' : 'Edit First'}
        </motion.button>
      </div>
    </div>
  );
}
