import React, { useState } from 'react';
import styles from './Mascot.module.css';

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

  const primaryButtonClass =
    'min-h-[60px] flex-grow rounded-[0.8rem] bg-[#20663a] px-4 py-3 text-lg font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-green-700 active:translate-y-0 disabled:opacity-50';
  const secondaryButtonClass =
    'min-h-[60px] flex-grow rounded-[0.8rem] border border-[#c4b299] bg-white px-4 py-3 text-lg font-bold text-[#5b4a35] transition-all duration-150 hover:-translate-y-px hover:bg-[#fff8ed] active:translate-y-0';

  if (status === 'success') {
    return (
      <div className={`my-4 flex flex-col items-center justify-center rounded-[1.1rem] border border-[#77a083] bg-white p-8 shadow-[0_6px_18px_rgba(73,54,31,0.08)] ${styles.fadeIn}`}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 border border-[#77a083]">
          <span className="text-2xl font-bold text-success">OK</span>
        </div>
        <h3 className="text-2xl font-bold text-success mb-2">Email Sent!</h3>
        <p className="text-lg text-center text-textbrown">Your email has been sent to {formData.to_email}.</p>
      </div>
    );
  }

  return (
    <div className="relative my-4 rounded-[1.1rem] border border-[#e6dbc9] bg-white p-6 shadow-[0_6px_18px_rgba(73,54,31,0.08)]">
      <div className="flex justify-between items-center mb-4 border-b border-[#e3d5c0] pb-2">
        <h3 className="text-xl font-bold text-textbrown font-heading">Draft Email Preview</h3>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-[#2b3848] font-bold hover:underline"
        >
          {isEditing ? 'Done Editing' : 'Edit'}
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-500 uppercase mb-1">To:</label>
          {isEditing ? (
            <input
              type="email"
              name="to_email"
              value={formData.to_email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-[#cfbfa7] text-lg bg-white"
            />
          ) : (
            <div className="text-lg font-medium">{formData.to_email}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-500 uppercase mb-1">Subject:</label>
          {isEditing ? (
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-[#cfbfa7] text-lg font-bold bg-white"
            />
          ) : (
            <div className="text-lg font-bold">{formData.subject}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-500 uppercase mb-1">Message:</label>
          {isEditing ? (
            <textarea
              name="body_html"
              value={formData.body_html}
              onChange={handleChange}
              className="w-full h-48 p-3 rounded-lg border border-[#cfbfa7] text-lg font-body bg-white"
            />
          ) : (
            <div 
              className="bg-[#fbf7ee] p-4 rounded-lg text-lg border border-[#e3d5c0] whitespace-pre-wrap font-body"
              dangerouslySetInnerHTML={{ __html: formData.body_html.replace(/\n/g, '<br/>') }}
            />
          )}
        </div>
      </div>

      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-100 text-danger rounded-lg font-bold text-center border border-red-200">
          Failed to send email. Please try again.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSend}
          disabled={status === 'sending'}
          className={primaryButtonClass}
        >
          {status === 'sending' ? 'Sending...' : 'Send Now'}
        </button>

        <button
          onClick={handleCopy}
          className={secondaryButtonClass}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>

        <button
          onClick={onCancel}
          disabled={status === 'sending'}
          className={`${secondaryButtonClass} border-[#a63a35] text-[#a63a35] hover:bg-red-50`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
