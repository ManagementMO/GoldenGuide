import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Send } from 'lucide-react';

export default function SmsCard({ onSend, message }) {
  const [phone, setPhone] = useState('');
  const [secondPhone, setSecondPhone] = useState('');
  const [showSecond, setShowSecond] = useState(false);
  const [status, setStatus] = useState('idle');

  const handleSend = async () => {
    if (!phone) return;
    setStatus('sending');
    try {
      await onSend({ to_number: phone, message, caregiver_number: showSecond && secondPhone ? secondPhone : null });
      setStatus('success');
    } catch (err) { console.error(err); setStatus('error'); }
  };

  return (
    <div className="mt-2 glass rounded-2xl p-4 glass-highlight">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-golden font-heading">
        <MessageSquareText className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Text this to my phone
      </h3>

      {status === 'success' ? (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
          className="flex items-center gap-2 text-base font-bold text-success">Text sent successfully!</motion.div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">Your Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="555-0199"
              className="w-full rounded-xl glass-input p-2.5 text-base" inputMode="tel" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="sendToFamily" checked={showSecond} onChange={(e) => setShowSecond(e.target.checked)}
              className="h-5 w-5 accent-golden rounded" />
            <label htmlFor="sendToFamily" className="text-base font-medium text-warm-50/70">Also send to a family member / caregiver</label>
          </div>

          {showSecond && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">Family Member Number</label>
              <input type="tel" value={secondPhone} onChange={(e) => setSecondPhone(e.target.value)} placeholder="555-0123"
                className="w-full rounded-xl glass-input p-2.5 text-base" inputMode="tel" />
            </motion.div>
          )}

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleSend} disabled={status === 'sending' || !phone}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 btn-golden px-4 text-base">
            <Send className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> {status === 'sending' ? 'Sending...' : 'Send Text'}
          </motion.button>

          {status === 'error' && <p className="text-base font-bold text-danger">Failed to send. Please try again.</p>}
        </div>
      )}
    </div>
  );
}
