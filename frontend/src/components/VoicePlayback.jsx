import React, { useState, useRef, useEffect } from 'react';
import OrbIcon from './OrbIcon';

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
    <button
      onClick={handlePlay}
      className="inline-flex items-center justify-center min-w-[78px] h-[40px] rounded-full border border-[#cdbca4] bg-white hover:bg-[#f6ede1] text-textbrown transition-colors px-2 gap-1.5"
      aria-label={status === 'playing' ? 'Stop reading' : 'Read aloud'}
      disabled={status === 'loading'}
    >
      {status === 'loading' && (
        <span className="animate-spin text-base">◌</span>
      )}
      {status === 'playing' && (
        <>
          <span className="h-2.5 w-2.5 rounded-sm bg-[#2b3848]" />
          <span className="text-xs font-bold">Stop</span>
        </>
      )}
      {status === 'idle' && (
        <>
          <OrbIcon name="voice" tone="cool" size="sm" />
          <span className="text-xs font-bold">Read</span>
        </>
      )}
    </button>
  );
}
