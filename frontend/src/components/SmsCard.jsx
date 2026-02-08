import React, { useState } from 'react';

export default function SmsCard({ onSend, message }) {
  const [phone, setPhone] = useState('');
  const [secondPhone, setSecondPhone] = useState('');
  const [showSecond, setShowSecond] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSend = async () => {
    if (!phone) return;
    
    setStatus('sending');
    try {
      const phones = [phone];
      if (showSecond && secondPhone) phones.push(secondPhone);
      
      await onSend({ phones, message });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="mt-4 rounded-[1.1rem] border border-[#e6dbc9] bg-[#fffaf2] p-5 shadow-[0_3px_10px_rgba(73,54,31,0.04)]">
      <h3 className="font-bold text-lg mb-4 text-textbrown">Text this plan to my phone</h3>

      {status === 'success' ? (
        <div className="text-success font-bold text-lg flex items-center gap-2">
          Text sent successfully.
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-textbrown">Your Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="555-0199"
              className="w-full p-3 rounded-lg border border-[#cfbfa7] text-lg bg-white"
              inputMode="tel"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendToFamily"
              checked={showSecond}
              onChange={(e) => setShowSecond(e.target.checked)}
              className="w-5 h-5 accent-[#2b3848]"
            />
            <label htmlFor="sendToFamily" className="text-textbrown font-medium">
              Also send to a family member / caregiver
            </label>
          </div>

          {showSecond && (
             <div>
               <label className="block text-sm font-bold mb-1 text-textbrown">Family Member's Number</label>
               <input
                 type="tel"
                 value={secondPhone}
                 onChange={(e) => setSecondPhone(e.target.value)}
                 placeholder="555-0123"
                 className="w-full p-3 rounded-lg border border-[#cfbfa7] text-lg bg-white"
                 inputMode="tel"
               />
             </div>
          )}

          <button
            onClick={handleSend}
            disabled={status === 'sending' || !phone}
            className="min-h-[60px] w-full rounded-[0.8rem] bg-[#293646] px-4 py-2.5 font-bold text-white shadow-[0_8px_16px_rgba(43,56,72,0.22)] transition-all duration-150 hover:-translate-y-px hover:bg-[#1f2a37] active:translate-y-0 disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending...' : 'Send Text'}
          </button>
          
          {status === 'error' && (
            <p className="text-danger font-bold">Failed to send. Please try again.</p>
          )}
        </div>
      )}
    </div>
  );
}
