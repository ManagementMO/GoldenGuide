import React, { useState } from 'react';
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

  const primaryButtonClass =
    'min-h-[60px] flex-grow rounded-[0.8rem] bg-[#20663a] px-4 py-2.5 text-lg font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-green-700 active:translate-y-0';
  const secondaryButtonClass =
    'min-h-[60px] flex-grow rounded-[0.8rem] border border-[#c4b299] bg-white px-4 py-2.5 text-lg font-bold text-[#5b4a35] transition-all duration-150 hover:-translate-y-px hover:bg-[#fff8ed] active:translate-y-0';

  return (
    <div className="my-4 rounded-[1.1rem] border border-[#e6dbc9] bg-white p-6 shadow-[0_6px_18px_rgba(73,54,31,0.08)]">
      <h3 className="text-xl font-bold mb-4 text-textbrown font-heading border-b border-[#e3d5c0] pb-2">
        Ready to place call?
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <span className="block text-sm font-bold text-gray-500 uppercase">Calling</span>
          <span className="text-xl font-bold">{preview.recipient_name}</span>
        </div>

        <div>
          <span className="block text-sm font-bold text-gray-500 uppercase">Number</span>
          <span className="text-xl font-mono">{preview.phone_number}</span>
        </div>

        <div>
          <span className="block text-sm font-bold text-gray-500 uppercase mb-1">What I'll Say</span>
          {isEditing ? (
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full h-32 p-3 rounded-lg border border-[#cfbfa7] focus:border-[#2b3848] font-body text-lg bg-white"
            />
          ) : (
            <div className="bg-[#fbf7ee] p-4 rounded-lg text-lg italic border-l-4 border-[#b99f7c]">
              "{script}"
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handlePlaceCall}
          className={primaryButtonClass}
        >
          Place Call
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={secondaryButtonClass}
        >
          {isEditing ? 'Save Changes' : 'Edit First'}
        </button>
      </div>
    </div>
  );
}
