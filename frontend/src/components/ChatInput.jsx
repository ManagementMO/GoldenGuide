import React, { useState } from 'react';
import VoiceInput from './VoiceInput';
import DocumentUpload from './DocumentUpload';

export default function ChatInput({ onSend, onSendImage, disabled }) {
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
    <div className="shrink-0 z-20 w-full border-t border-[#d8ccb8] bg-[rgba(255,250,241,0.95)] px-4 pt-4 pb-5 md:px-6 flex flex-row gap-3 items-center shadow-[0_-10px_28px_rgba(52,38,20,0.09)] backdrop-blur">
      <div className="flex-shrink-0">
        <DocumentUpload onUpload={handleFileUpload} />
      </div>

      <div className="flex-grow relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={disabled}
          placeholder="Ask me anything..."
          className="w-full min-h-[60px] max-h-[140px] rounded-2xl border border-[#d8ccb8] bg-white px-4 py-4 text-lg md:text-xl font-body focus:outline-none focus:ring-2 focus:ring-[#2b3848] focus:border-[#9f8864] resize-none shadow-[inset_0_1px_2px_rgba(50,35,20,0.08)]"
          rows={1}
          style={{ lineHeight: '1.6' }}
        />
      </div>

      <div className="flex-shrink-0 flex gap-2">
         <VoiceInput onTranscript={handleTranscript} disabled={disabled} />

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="min-w-[70px] h-[48px] px-4 bg-[#2b3848] text-white rounded-xl font-bold text-base shadow-[0_8px_16px_rgba(43,56,72,0.25)] hover:bg-[#1f2a37] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
}
