import React, { useState } from 'react';
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
    <div className="sticky bottom-0 z-20 w-full bg-white border-t-2 border-[#F5DEB3] p-4 flex flex-row gap-3 items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
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
          className="w-full min-h-[60px] max-h-[120px] rounded-xl border border-[#F5DEB3] p-4 text-lg md:text-xl font-body focus:outline-none focus:ring-2 focus:ring-golden resize-none"
          rows={1}
          style={{ lineHeight: '1.6' }}
        />
      </div>

      <div className="flex-shrink-0 flex gap-2">
         <VoiceInput onTranscript={handleTranscript} disabled={disabled} language={language} />

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="min-w-[48px] h-[48px] px-4 bg-golden text-white rounded-xl font-bold text-lg shadow-sm hover:bg-[#A67C00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
}
