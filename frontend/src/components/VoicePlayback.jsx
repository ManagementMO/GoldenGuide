import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Square, Volume2 } from 'lucide-react';

export default function VoicePlayback({ text, apiUrl }) {
  const [status, setStatus] = useState('idle'); // idle, loading, playing
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = async () => {
    if (status === 'playing') {
      audioRef.current?.pause();
      audioRef.current = null;
      setStatus('idle');
      return;
    }

    try {
      setStatus('loading');

      const formBody = new URLSearchParams();
      formBody.append('text', text);

      const response = await fetch(`${apiUrl}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      if (!response.ok) throw new Error('TTS failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setStatus('idle');
        URL.revokeObjectURL(url);
      };

      audio.onerror = () => {
        setStatus('idle');
        console.error('Audio playback error');
      };

      await audio.play();
      setStatus('playing');
    } catch (error) {
      console.error('TTS error:', error);
      setStatus('idle');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handlePlay}
      className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full glass-subtle text-warm-100/50 transition-colors hover:text-golden hover:bg-white/[0.06]"
      aria-label={status === 'playing' ? 'Stop reading' : 'Read aloud'}
      disabled={status === 'loading'}
    >
      {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin text-golden" strokeWidth={2} aria-hidden="true" />}
      {status === 'playing' && <Square className="h-4 w-4 text-golden" strokeWidth={2} aria-hidden="true" />}
      {status === 'idle' && <Volume2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
    </motion.button>
  );
}
