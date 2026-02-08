import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import VoiceInput from './VoiceInput';
import DocumentUpload from './DocumentUpload';

export default function ChatInput({ onSend, onSendImage, disabled, language }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTranscript = (transcript) => {
    // If we have existing text, append to it, otherwise set it
    setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  const handleFileUpload = (file) => {
    // When a file is selected, we send it immediately with the current text (or empty text)
    // As per spec: calls onSendImage(text, file)
    if (!disabled) {
      onSendImage(text, file);
      setText('');
    }
  };

  return (
    <div className="sticky bottom-0 z-20 w-full border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="flex flex-row items-center gap-3">
        <div className="flex-shrink-0">
          <DocumentUpload onUpload={handleFileUpload} />
        </div>

        <div className="relative flex-grow">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={disabled}
            placeholder={language === 'fr' ? 'Posez votre question municipale...' : 'Ask your municipal question...'}
            className="w-full min-h-[52px] max-h-[120px] resize-none rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-base text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#475569]"
            rows={1}
            style={{ lineHeight: '1.6' }}
          />
        </div>

        <div className="flex flex-shrink-0 gap-2">
          <VoiceInput onTranscript={handleTranscript} disabled={disabled} language={language} />

          <button
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            className="flex min-h-[52px] min-w-[64px] items-center justify-center rounded-2xl border border-[#CBD5E1] bg-[#334155] px-3 text-base font-semibold text-white transition-colors hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <span className="flex items-center gap-2">
              <SendHorizontal className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              <span>{language === 'fr' ? 'Envoyer' : 'Send'}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
