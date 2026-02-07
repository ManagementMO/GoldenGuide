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

  return (
    <div className="bg-white border-2 border-golden rounded-xl p-6 shadow-md my-4">
      <h3 className="text-xl font-bold mb-4 text-textbrown font-heading border-b border-[#F5DEB3] pb-2">
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
              className="w-full h-32 p-3 rounded-lg border-2 border-golden focus:border-accent font-body text-lg"
            />
          ) : (
            <div className="bg-cornsilk p-4 rounded-lg text-lg italic border-l-4 border-golden">
              "{script}"
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handlePlaceCall}
          className="flex-grow min-h-[56px] bg-success text-white font-bold rounded-xl text-xl hover:bg-green-700 transition-colors shadow-sm"
        >
          📞 Place Call
        </button>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex-grow min-h-[56px] bg-white border-2 border-golden text-golden font-bold rounded-xl text-xl hover:bg-cornsilk transition-colors shadow-sm"
        >
          {isEditing ? 'Save Changes' : '✏️ Edit First'}
        </button>
      </div>
    </div>
  );
}
