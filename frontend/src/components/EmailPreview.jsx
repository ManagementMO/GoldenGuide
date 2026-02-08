import React, { useState } from 'react';
import { CheckCircle2, Copy, Mail, PencilLine, Send, X } from 'lucide-react';

export default function EmailPreview({ draft, onSend, onCancel }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    to_email: draft.to_email || '',
    subject: draft.subject || '',
    body_html: draft.body_html || draft.body || ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    setStatus('sending');
    try {
      await onSend(formData);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleCopy = async () => {
    const plainText = formData.body_html.replace(/<[^>]*>/g, '');
    const fullText = `To: ${formData.to_email}\nSubject: ${formData.subject}\n\n${plainText}`;
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = fullText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (status === 'success') {
    return (
      <div className="my-2 flex animate-fade-in flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-8 w-8" strokeWidth={2} aria-hidden="true" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-emerald-700">Email Sent!</h3>
        <p className="text-center text-base text-[#334155]">Your email has been successfully sent to {formData.to_email}.</p>
      </div>
    );
  }

  return (
    <div className="relative my-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1e293b]">
          <Mail className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          Draft Email Preview
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-3 text-base font-semibold text-[#334155] hover:bg-[#F8FAFC]"
        >
          <PencilLine className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          {isEditing ? 'Done Editing' : 'Edit'}
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">To</label>
          {isEditing ? (
            <input
              type="email"
              name="to_email"
              value={formData.to_email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-base text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#475569]"
            />
          ) : (
            <div className="text-base font-medium text-[#334155]">{formData.to_email}</div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">Subject</label>
          {isEditing ? (
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-base font-semibold text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#475569]"
            />
          ) : (
            <div className="text-base font-semibold text-[#1e293b]">{formData.subject}</div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">Message</label>
          {isEditing ? (
            <textarea
              name="body_html"
              value={formData.body_html}
              onChange={handleChange}
              className="h-40 w-full rounded-xl border border-slate-300 p-2.5 text-base text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#475569]"
            />
          ) : (
            <div
              className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-base text-[#334155]"
              dangerouslySetInnerHTML={{ __html: formData.body_html.replace(/\n/g, '<br/>') }}
            />
          )}
        </div>
      </div>

      {status === 'error' && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-base font-semibold text-red-700">
          Failed to send email. Please try again.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleSend}
          disabled={status === 'sending'}
          className="flex min-h-[52px] flex-grow items-center justify-center gap-2 rounded-xl bg-[#334155] text-base font-semibold text-white transition-colors hover:bg-[#1e293b] disabled:opacity-50"
        >
          <Send className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          {status === 'sending' ? 'Sending...' : 'Send Now'}
        </button>

        <button
          onClick={handleCopy}
          className="flex min-h-[52px] flex-grow items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-base font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC]"
        >
          <Copy className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={onCancel}
          disabled={status === 'sending'}
          className="flex min-h-[52px] flex-grow items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-base font-semibold text-[#334155] transition-colors hover:bg-red-50"
        >
          <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          Cancel
        </button>
      </div>
    </div>
  );
}
