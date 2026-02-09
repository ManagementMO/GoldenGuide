import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  const handleFileUpload = (file) => {
    if (!disabled) {
      onSendImage(text, file);
      setText('');
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sticky bottom-0 z-20 w-full px-4 py-3"
    >
      <div className="glass-strong glass-highlight rounded-2xl px-4 py-3"
        style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.15), 0 0 60px rgba(212,165,50,0.03)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <DocumentUpload onUpload={handleFileUpload} />
          </div>

          <div className="relative flex-grow">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={disabled}
              placeholder={language === 'fr' ? 'Posez votre question...' : 'Ask your question...'}
              className="w-full min-h-[48px] max-h-[120px] resize-none rounded-xl glass-input px-4 py-2.5 text-base"
              rows={1}
              style={{ lineHeight: '1.6' }}
            />
          </div>

          <div className="flex flex-shrink-0 gap-2">
            <VoiceInput onTranscript={handleTranscript} disabled={disabled} language={language} />

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleSend}
              disabled={disabled || !text.trim()}
              className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl btn-golden px-3"
              aria-label="Send message"
            >
              <SendHorizontal className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
