import React, { useState, useRef, useEffect } from 'react';

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
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-golden/20 hover:bg-golden/30 text-textbrown transition-colors ml-2"
      aria-label={status === 'playing' ? 'Stop reading' : 'Read aloud'}
      disabled={status === 'loading'}
    >
      {status === 'loading' && (
        <span className="animate-spin">⏳</span>
      )}
      {status === 'playing' && (
        <span>⏹️</span>
      )}
      {status === 'idle' && (
        <span>🔊</span>
      )}
    </button>
  );
}
