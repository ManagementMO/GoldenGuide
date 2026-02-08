import React, { useState, useEffect, useRef } from 'react';
import OrbIcon from './OrbIcon';

export default function VoiceInput({ onTranscript, disabled }) {
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
        recognitionRef.current.lang = 'en-US';

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
  }, [onTranscript]);

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
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={`relative min-w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all border ${
        isListening 
          ? 'bg-[#a63a35] animate-pulse text-white border-[#a63a35] ring-4 ring-red-200' 
          : 'bg-white text-textbrown border-[#d8ccb8] hover:bg-[#f7ecdb]'
      }`}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <span className="text-[0.67rem] font-bold tracking-wide uppercase">Stop</span>
      ) : (
        <OrbIcon name="voice" tone="cool" size="sm" />
      )}
      {isListening && (
        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#1f2a37] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Listening...
        </span>
      )}
    </button>
  );
}
