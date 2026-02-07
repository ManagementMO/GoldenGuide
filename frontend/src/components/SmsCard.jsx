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
    <div className="bg-cornsilk rounded-xl p-4 mt-4 border border-[#F5DEB3]">
      <h3 className="font-bold text-lg mb-4 text-textbrown">Text this to my phone</h3>
      
      {status === 'success' ? (
        <div className="text-success font-bold text-lg flex items-center gap-2">
          <span>✅</span> Text sent successfully!
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
              className="w-full p-3 rounded-lg border border-golden/50 text-lg"
              inputMode="tel"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendToFamily"
              checked={showSecond}
              onChange={(e) => setShowSecond(e.target.checked)}
              className="w-5 h-5 accent-golden"
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
                 className="w-full p-3 rounded-lg border border-golden/50 text-lg"
                 inputMode="tel"
               />
             </div>
          )}

          <button
            onClick={handleSend}
            disabled={status === 'sending' || !phone}
            className="w-full bg-golden text-white font-bold py-3 px-6 rounded-lg text-lg shadow-sm hover:bg-[#A67C00] disabled:opacity-50 transition-colors"
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
