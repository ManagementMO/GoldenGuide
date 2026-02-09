import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Mail, PencilLine, Send, X } from 'lucide-react';

export default function EmailPreview({ draft, onSend, onCancel }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ to_email: draft.to_email || '', subject: draft.subject || '', body_html: draft.body_html || draft.body || '' });
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);

  const handleSend = async () => { setStatus('sending'); try { await onSend(formData); setStatus('success'); } catch (error) { console.error(error); setStatus('error'); } };

  const handleCopy = async () => {
    const plainText = formData.body_html.replace(/<[^>]*>/g, '');
    const fullText = `To: ${formData.to_email}\nSubject: ${formData.subject}\n\n${plainText}`;
    try { await navigator.clipboard.writeText(fullText); } catch { const ta = document.createElement('textarea'); ta.value = fullText; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  if (status === 'success') {
    return (
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="my-2 flex flex-col items-center justify-center glass-strong rounded-2xl border border-success/20 p-6 glass-highlight">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
          <CheckCircle2 className="h-8 w-8" strokeWidth={2} aria-hidden="true" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-success">Email Sent!</h3>
        <p className="text-center text-base text-warm-50/70">Your email has been successfully sent to {formData.to_email}.</p>
      </motion.div>
    );
  }

  return (
    <div className="relative my-2 glass-strong rounded-2xl p-4 glass-highlight">
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-2">
        <h3 className="flex items-center gap-2 text-lg font-bold text-golden font-heading">
          <Mail className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Draft Email Preview
        </h3>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex min-h-[40px] items-center gap-1 rounded-lg btn-glass px-3 text-sm font-bold">
          <PencilLine className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          {isEditing ? 'Done' : 'Edit'}
        </motion.button>
      </div>

      <div className="mb-6 space-y-4">
        {[
          { label: 'To', name: 'to_email', type: 'email' },
          { label: 'Subject', name: 'subject', type: 'text' },
        ].map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">{field.label}</label>
            {isEditing ? (
              <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange}
                className="w-full rounded-xl glass-input p-2.5 text-base" />
            ) : (
              <div className="text-base font-medium text-warm-50/80">{formData[field.name]}</div>
            )}
          </div>
        ))}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">Message</label>
          {isEditing ? (
            <textarea name="body_html" value={formData.body_html} onChange={handleChange}
              className="h-40 w-full rounded-xl glass-input p-2.5 text-base" />
          ) : (
            <div className="whitespace-pre-wrap rounded-xl glass p-3 text-base text-warm-50/70"
              dangerouslySetInnerHTML={{ __html: formData.body_html.replace(/\n/g, '<br/>') }} />
          )}
        </div>
      </div>

      {status === 'error' && (
        <div className="mb-4 rounded-lg bg-danger/20 border border-danger/30 p-3 text-center text-base font-bold text-danger">
          Failed to send email. Please try again.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSend} disabled={status === 'sending'}
          className="flex min-h-[48px] flex-grow items-center justify-center gap-2 btn-success text-base">
          <Send className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> {status === 'sending' ? 'Sending...' : 'Send Now'}
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCopy}
          className="flex min-h-[48px] flex-grow items-center justify-center gap-2 btn-glass text-base">
          <Copy className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> {copied ? 'Copied!' : 'Copy'}
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCancel} disabled={status === 'sending'}
          className="flex min-h-[48px] flex-grow items-center justify-center gap-2 btn-danger text-base">
          <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Cancel
        </motion.button>
      </div>
    </div>
  );
}
