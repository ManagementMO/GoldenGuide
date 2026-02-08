import React, { useState } from 'react';
import { MessageSquareText, Send } from 'lucide-react';

export default function SmsCard({ onSend, message }) {
  const [phone, setPhone] = useState('');
  const [secondPhone, setSecondPhone] = useState('');
  const [showSecond, setShowSecond] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSend = async () => {
    if (!phone) return;

    setStatus('sending');
    try {
      await onSend({
        to_number: phone,
        message,
        caregiver_number: showSecond && secondPhone ? secondPhone : null,
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3 text-[#334155]">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <MessageSquareText className="h-5 w-5 text-[#475569]" strokeWidth={2} aria-hidden="true" />
        Text this to my phone
      </h3>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-base font-semibold text-emerald-700">
          Text sent successfully!
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">Your Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="555-0199"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-base text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#475569]"
              inputMode="tel"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendToFamily"
              checked={showSecond}
              onChange={(e) => setShowSecond(e.target.checked)}
              className="h-5 w-5 accent-slate-700"
            />
            <label htmlFor="sendToFamily" className="text-base font-medium text-[#334155]">
              Also send to a family member / caregiver
            </label>
          </div>

          {showSecond && (
            <div>
              <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">Family Member Number</label>
              <input
                type="tel"
                value={secondPhone}
                onChange={(e) => setSecondPhone(e.target.value)}
                placeholder="555-0123"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-base text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#475569]"
                inputMode="tel"
              />
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={status === 'sending' || !phone}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#334155] px-4 text-base font-semibold text-white transition-colors hover:bg-[#1e293b] disabled:opacity-50"
          >
            <Send className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            {status === 'sending' ? 'Sending...' : 'Send Text'}
          </button>

          {status === 'error' && (
            <p className="text-base font-semibold text-red-700">Failed to send. Please try again.</p>
          )}
        </div>
      )}
    </div>
  );
}
