import React, { useState } from 'react';

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
      <div className="bg-white border-2 border-success rounded-xl p-8 shadow-md my-4 flex flex-col items-center justify-center animate-fade-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h3 className="text-2xl font-bold text-success mb-2">Email Sent!</h3>
        <p className="text-lg text-center text-textbrown">Your email has been successfully sent to {formData.to_email}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-golden rounded-xl p-6 shadow-md my-4 relative">
      <div className="flex justify-between items-center mb-4 border-b border-[#F5DEB3] pb-2">
        <h3 className="text-xl font-bold text-textbrown font-heading">Draft Email Preview</h3>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-golden font-bold hover:underline"
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
              className="w-full p-3 rounded-lg border border-golden/50 text-lg"
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
              className="w-full p-3 rounded-lg border border-golden/50 text-lg font-bold"
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
              className="w-full h-48 p-3 rounded-lg border border-golden/50 text-lg font-body"
            />
          ) : (
            <div 
              className="bg-gray-50 p-4 rounded-lg text-lg border border-gray-100 whitespace-pre-wrap font-body"
              dangerouslySetInnerHTML={{ __html: formData.body_html.replace(/\n/g, '<br/>') }}
            />
          )}
        </div>
      </div>

      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-100 text-danger rounded-lg font-bold text-center">
          Failed to send email. Please try again.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSend}
          disabled={status === 'sending'}
          className="flex-grow min-h-[56px] bg-success text-white font-bold rounded-xl text-xl hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending...' : '📨 Send Now'}
        </button>

        <button
          onClick={handleCopy}
          className="flex-grow min-h-[56px] bg-white border-2 border-golden text-golden font-bold rounded-xl text-xl hover:bg-cornsilk transition-colors shadow-sm"
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>

        <button
          onClick={onCancel}
          disabled={status === 'sending'}
          className="flex-grow min-h-[56px] bg-white border-2 border-danger text-danger font-bold rounded-xl text-xl hover:bg-red-50 transition-colors shadow-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
