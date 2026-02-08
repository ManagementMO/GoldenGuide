'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import QuickTopics from '../components/QuickTopics';
import ToolActivity from '../components/ToolActivity';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [language, setLanguage] = useState('en');
  const [activeTools, setActiveTools] = useState([]);
  const [completedTools, setCompletedTools] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', fontSize === 'large');
  }, [fontSize]);

  // Demo safety net: Ctrl+Shift+D loads a cached response for offline demos
  useEffect(() => {
    const handleDemoKey = async (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        try {
          const res = await fetch('/demo_cache.json');
          const data = await res.json();
          const userMsg = { role: 'user', text: "I'm 73, I live alone, I can't afford the dentist" };
          const agentMsg = {
            role: 'agent',
            text: data.text,
            structured_data: data.structured_data || {},
            tool_calls_made: data.tool_calls_made || [],
          };
          setMessages([userMsg, agentMsg]);
          setHistory(data.history || []);
        } catch (err) {
          console.error('Failed to load demo cache:', err);
        }
      }
    };
    window.addEventListener('keydown', handleDemoKey);
    return () => window.removeEventListener('keydown', handleDemoKey);
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setActiveTools([]);
    setCompletedTools([]);

    try {
      const res = await fetch(`${API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history, language }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = null;
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7);
          } else if (line.startsWith('data: ') && currentEvent) {
            try {
              const data = JSON.parse(line.slice(6));
              if (currentEvent === 'tool_start') {
                setActiveTools((prev) => [...prev, data.tool]);
              } else if (currentEvent === 'tool_done') {
                setActiveTools((prev) => prev.filter((t) => t !== data.tool));
                setCompletedTools((prev) => [...prev, data.tool]);
              } else if (currentEvent === 'complete') {
                const agentMsg = {
                  role: 'agent',
                  text: data.text,
                  structured_data: data.structured_data || {},
                  tool_calls_made: data.tool_calls_made || [],
                };
                setMessages((prev) => [...prev, agentMsg]);
                setHistory(data.history);
              }
            } catch (e) {}
            currentEvent = null;
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: "I'm sorry, I had trouble connecting. Please try again.", error: true },
      ]);
    } finally {
      setIsLoading(false);
      setActiveTools([]);
      setCompletedTools([]);
    }
  };

  const sendImage = async (text, imageFile) => {
    if (!imageFile) return;

    const userMsg = { role: 'user', text: text || 'Can you explain this document?', hasImage: true };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', text || 'Please explain this document in plain English.');
      formData.append('history', JSON.stringify(history));
      formData.append('image', imageFile);

      const res = await fetch(`${API_URL}/api/chat/image`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      const agentMsg = {
        role: 'agent',
        text: data.text,
        structured_data: data.structured_data || {},
        tool_calls_made: data.tool_calls_made || [],
      };
      setMessages((prev) => [...prev, agentMsg]);
      setHistory(data.history);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: "I had trouble reading that document. Could you try again?", error: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeEmail = async (emailData) => {
    try {
      const res = await fetch(`${API_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });
      return await res.json();
    } catch { return { status: 'error' }; }
  };

  const executeSms = async (smsData) => {
    try {
      const res = await fetch(`${API_URL}/api/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smsData),
      });
      return await res.json();
    } catch { return { status: 'error' }; }
  };

  const executeCall = async (callData) => {
    try {
      const res = await fetch(`${API_URL}/api/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callData),
      });
      return await res.json();
    } catch { return { status: 'error' }; }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      <Header fontSize={fontSize} onFontSizeChange={setFontSize} language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 overflow-y-auto chat-scroll px-4 pb-4">
        {messages.length === 0 && (
          <div className="mt-8">
            <div className="bg-cornsilk rounded-2xl p-6 mb-6 text-center shadow-sm">
              <h2 className="font-heading text-heading text-golden font-bold mb-2">
                {language === 'fr' ? 'Bienvenue! Je suis GoldenGuide.' : "Welcome! I'm GoldenGuide."}
              </h2>
              <p className="text-textbrown">
                {language === 'fr'
                  ? "Je peux vous aider \u00e0 trouver les services municipaux de Kingston, v\u00e9rifier vos admissibilit\u00e9s, et m\u00eame passer des appels ou envoyer des courriels en votre nom. Posez-moi une question ou choisissez un sujet ci-dessous :"
                  : "I can help you find Kingston city services, check what you qualify for, and even make phone calls or send emails on your behalf. Ask me anything, or tap a topic below:"}
              </p>
            </div>
            <QuickTopics onSelect={sendMessage} language={language} />
          </div>
        )}

        <ChatWindow
          messages={messages}
          onExecuteEmail={executeEmail}
          onExecuteSms={executeSms}
          onExecuteCall={executeCall}
          apiUrl={API_URL}
        />

        {isLoading && <ToolActivity activeTools={activeTools} completedTools={completedTools} />}
        <div ref={chatEndRef} />
      </main>

      <ChatInput
        onSend={sendMessage}
        onSendImage={sendImage}
        disabled={isLoading}
        language={language}
      />
    </div>
  );
}
