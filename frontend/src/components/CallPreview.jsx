import React, { useState } from 'react';
import { PencilLine, PhoneCall } from 'lucide-react';
import CallStatus from './CallStatus';

export default function CallPreview({ preview, onConfirm }) {
  const [isEditing, setIsEditing] = useState(false);
  const [script, setScript] = useState(preview.script || '');
  const [callState, setCallState] = useState('idle'); // idle, calling, ended

  if (callState === 'calling' || callState === 'ended') {
    return (
      <CallStatus 
        recipientName={preview.recipient_name} 
        status={callState === 'ended' ? 'ended' : 'connected'}
        onEnd={() => setCallState('ended')}
      />
    );
  }

  const handlePlaceCall = () => {
    setCallState('calling');
    onConfirm({ ...preview, script });
  };

  return (
    <div className="my-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 border-b border-slate-200 pb-2 text-lg font-semibold text-[#1e293b]">
        Ready to place call?
      </h3>

      <div className="mb-6 space-y-4">
        <div>
          <span className="block text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">Calling</span>
          <span className="text-lg font-semibold text-[#1e293b]">{preview.recipient_name}</span>
        </div>

        <div>
          <span className="block text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">Number</span>
          <span className="text-lg font-mono text-[#334155]">{preview.phone_number}</span>
        </div>

        <div>
          <span className="mb-1 block text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">What I'll Say</span>
          {isEditing ? (
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="h-28 w-full rounded-xl border border-slate-300 p-2.5 text-base text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#475569]"
            />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-base italic text-[#334155]">
              "{script}"
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handlePlaceCall}
          className="flex min-h-[52px] flex-grow items-center justify-center gap-2 rounded-xl bg-[#334155] text-base font-semibold text-white transition-colors hover:bg-[#1e293b]"
        >
          <PhoneCall className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          Place Call
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex min-h-[52px] flex-grow items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-base font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC]"
        >
          <PencilLine className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          {isEditing ? 'Save Changes' : 'Edit First'}
        </button>
      </div>
    </div>
  );
}
