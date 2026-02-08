'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import QuickTopics from '../components/QuickTopics';
import LoadingIndicator from '../components/LoadingIndicator';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
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

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history }),
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
        { role: 'agent', text: "I'm sorry, I had trouble connecting. Please try again.", error: true },
      ]);
    } finally {
      setIsLoading(false);
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
      <Header fontSize={fontSize} onFontSizeChange={setFontSize} />

      <main className="flex-1 overflow-y-auto chat-scroll px-4 pb-4">
        {messages.length === 0 && (
          <div className="mt-8">
            <div className="bg-cornsilk rounded-2xl p-6 mb-6 text-center shadow-sm">
              <h2 className="font-heading text-heading text-golden font-bold mb-2">
                Welcome! I'm GoldenGuide.
              </h2>
              <p className="text-textbrown">
                I can help you find Kingston city services, check what you qualify for,
                and even make phone calls or send emails on your behalf.
                Ask me anything, or tap a topic below:
              </p>
            </div>
            <QuickTopics onSelect={sendMessage} />
          </div>
        )}

        <ChatWindow
          messages={messages}
          onExecuteEmail={executeEmail}
          onExecuteSms={executeSms}
          onExecuteCall={executeCall}
          apiUrl={API_URL}
        />

        {isLoading && <LoadingIndicator />}
        <div ref={chatEndRef} />
      </main>

      <ChatInput
        onSend={sendMessage}
        onSendImage={sendImage}
        disabled={isLoading}
      />
    </div>
  );
}
