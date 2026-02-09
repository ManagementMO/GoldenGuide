import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceInput({ onTranscript, disabled, language = 'en' }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language === 'fr' ? 'fr-CA' : 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          onTranscript(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsSupported(false);
      }
    }
  }, [onTranscript, language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition', error);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={toggleListening}
        disabled={disabled}
        className={`flex min-h-[52px] min-w-[52px] items-center justify-center rounded-2xl transition-all ${
          isListening
            ? 'bg-danger/20 border border-danger/40 text-danger shadow-[0_0_16px_rgba(239,68,68,0.2)]'
            : 'glass-subtle text-warm-100/50 hover:text-golden hover:bg-white/[0.06]'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <MicOff className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> : <Mic className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
      </motion.button>
      {isListening && (
        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg glass-strong px-2.5 py-1 text-xs font-bold text-danger">
          Listening...
        </motion.span>
      )}
    </div>
  );
}
