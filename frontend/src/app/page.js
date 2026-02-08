'use client';

import { useState, useRef, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import LoadingIndicator from '../components/LoadingIndicator';
import Mascot from '../components/Mascot';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const FONT_SCALES = [16, 18, 20, 22];
const TOPICS = [
  {
    id: 'transit',
    label: 'Transit Support',
    summary: 'Routes, discounted fares, and mobility trip planning.',
    query: 'How do I take the bus in Kingston? What are senior transit options?',
  },
  {
    id: 'housing',
    label: 'Housing & Home Supports',
    summary: 'Affordable housing, home safety, and application guidance.',
    query: 'What housing assistance programs are available for seniors in Kingston?',
  },
  {
    id: 'health',
    label: 'Health & Wellness Services',
    summary: 'Clinics, dental supports, and community wellness resources.',
    query: 'What health services and dental programs are available for seniors in Kingston?',
  },
  {
    id: 'activities',
    label: 'Community Programs',
    summary: 'Recreation, social activities, and city-run classes.',
    query: 'What activities and recreation programs are available for seniors in Kingston?',
  },
  {
    id: 'financial',
    label: 'Financial Assistance',
    summary: 'Benefits, subsidies, and income support programs.',
    query: 'What financial assistance programs are available for seniors in Kingston?',
  },
  {
    id: 'accessibility',
    label: 'Accessibility Services',
    summary: 'Mobility aids, disability supports, and inclusive access.',
    query: 'What accessibility services and disability support are available in Kingston?',
  },
];

function formatLocalTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function TopicGlyph({ id }) {
  switch (id) {
    case 'transit':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
          <rect x="5" y="4.5" width="14" height="12" rx="2.8" />
          <path d="M8 16.5 7 19M16 16.5 17 19M9 11h6M8 8h.01M16 8h.01" strokeLinecap="round" />
        </svg>
      );
    case 'housing':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <path d="m3.5 11.5 8.5-7 8.5 7" />
          <path d="M6.5 10.8V19h11v-8.2M10.3 19v-4.7h3.4V19" />
        </svg>
      );
    case 'health':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <path d="M12 5.5v13M5.5 12h13" />
          <rect x="4.5" y="4.5" width="15" height="15" rx="3.2" />
        </svg>
      );
    case 'activities':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M8.2 3.8v3M15.8 3.8v3M5 9.4h14M8.5 12.2h7M8.5 15.1h4.3" />
        </svg>
      );
    case 'financial':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <path d="M6 8h12M6 12h12M6 16h8" />
          <rect x="4.5" y="5" width="15" height="14" rx="3" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <circle cx="12" cy="5.5" r="1.6" />
          <path d="M12 7.8v4M9 10.5h6M12.8 11.8l2.7 4.7" />
          <circle cx="12.2" cy="15.7" r="4.2" />
        </svg>
      );
  }
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [activeView, setActiveView] = useState('topics');
  const [currentTime, setCurrentTime] = useState(() => formatLocalTime(new Date()));
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const savedScale = window.localStorage.getItem('goldenguide_font_scale');
    if (savedScale === null) return;
    const parsed = Number(savedScale);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed < FONT_SCALES.length) {
      setFontScale(parsed);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SCALES[fontScale]}px`;
    window.localStorage.setItem('goldenguide_font_scale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(formatLocalTime(new Date()));
    }, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setActiveView('topics');
    }
  }, [messages.length]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    setActiveView('chat');
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

    setActiveView('chat');
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

  const showBack = activeView === 'chat';
  const canDecrease = fontScale > 0;
  const canIncrease = fontScale < FONT_SCALES.length - 1;
  const isTopicsView = activeView === 'topics';
  const orbMode = isLoading ? 'speaking' : activeView === 'chat' ? 'listening' : 'idle';
  const orbLevel = isLoading ? 0.72 : activeView === 'chat' ? 0.48 : 0.15;

  return (
    <div
      className="h-[100dvh] overflow-hidden bg-[linear-gradient(180deg,#e9eff5_0%,#dee7f0_100%)] text-[#1d2f42]"
      style={{ fontFamily: '"Plus Jakarta Sans", "Atkinson Hyperlegible", "Segoe UI", sans-serif' }}
    >
      <div className="grid h-full w-full grid-cols-1 overflow-hidden lg:grid-cols-[40%_60%]">
        <aside className="relative hidden min-h-0 overflow-y-auto border-b border-[#cbd6e3] bg-[linear-gradient(165deg,#edf2f6_0%,#dfe8f0_100%)] lg:block lg:border-b-0 lg:border-r">
          <div className="flex h-full min-h-0 flex-col p-8 md:p-12">
            <div className="inline-flex w-fit items-center gap-4 rounded-2xl border border-[#c4d0dc] bg-[rgba(255,255,255,0.8)] px-4 py-3 shadow-[0_8px_22px_rgba(45,71,98,0.08)]">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#b9c8d6] bg-[#f7fafc] text-base font-semibold text-[#2b435a]">
                K
              </span>
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#586c81]">
                  City of Kingston
                </p>
                <p className="text-sm font-medium text-[#243a4f]">
                  Resident Service Platform
                </p>
              </div>
            </div>

            <div className="mx-auto mt-12 flex w-full max-w-[420px] flex-col items-center text-center">
              <Mascot mode={orbMode} level={orbLevel} />
              <h2 className="mt-8 text-[1.7rem] font-semibold leading-tight tracking-[-0.01em] text-[#22384d] font-sans">
                Municipal Guidance
              </h2>
              <p className="mt-3 max-w-[36ch] text-[1.03rem] leading-relaxed text-[#304a61]">
                Calm, step-by-step support for city services, communication drafts, and action planning.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-[#c7d3df] bg-[rgba(255,255,255,0.84)] p-5 shadow-[0_10px_18px_rgba(46,68,91,0.08)]">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#62778d]">
                  Live Status
                </p>
                <p className="mt-2 text-lg font-medium text-[#254056]">
                  Intake queue open
                </p>
                <p className="mt-1 text-[0.98rem] text-[#3a556b]">
                  Senior-support pathways are available now.
                </p>
              </div>

              <div className="rounded-2xl border border-[#c7d3df] bg-[rgba(255,255,255,0.84)] p-5 shadow-[0_10px_18px_rgba(46,68,91,0.08)]">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#62778d]">
                  Session Context
                </p>
                <p className="mt-2 text-[1rem] leading-relaxed text-[#334f66]">
                  {messages.length > 0
                    ? `${messages.length} messages captured in this session.`
                    : 'No active case notes yet. Select a service pathway to begin.'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex h-full min-h-0 flex-col overflow-hidden bg-[linear-gradient(180deg,#f7fafd_0%,#f2f7fb_100%)]">
          <header className="z-20 shrink-0 border-b border-[#c8d4df] bg-[rgba(248,252,255,0.95)] px-8 py-7 shadow-[0_8px_18px_rgba(54,79,104,0.06)] backdrop-blur md:px-12">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.23em] text-[#5b7085]">
                  City of Kingston • Municipal Assistance Desk
                </p>
                <h1 className="mt-2 text-[1.7rem] font-semibold leading-tight tracking-[-0.01em] text-[#1f3549] font-sans">
                  Main Service Dashboard
                </h1>
              </div>
              <div className="rounded-xl border border-[#c7d3df] bg-white px-4 py-3 text-right shadow-[0_8px_16px_rgba(48,73,96,0.08)]">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#5f758a]">
                  Local Time
                </p>
                <p className="text-lg font-semibold text-[#1f3549]">{currentTime}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              {showBack ? (
                <button
                  onClick={() => setActiveView('topics')}
                  className="min-h-[60px] rounded-2xl border border-[#b8c7d6] bg-white px-6 py-3 text-[0.95rem] font-semibold text-[#24445d] transition-colors hover:bg-[#eff5fa]"
                  aria-label="Back to service menu"
                >
                  Return to Service Menu
                </button>
              ) : (
                <div className="h-[60px] w-[230px]" aria-hidden="true" />
              )}

              <div className="flex items-center gap-3 rounded-2xl border border-[#c4d1de] bg-white px-3 py-2 shadow-[0_8px_16px_rgba(48,73,96,0.08)]">
                <span className="px-2 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[#5f7488]">
                  Text Size
                </span>
                <button
                  onClick={() => setFontScale((scale) => Math.max(0, scale - 1))}
                  disabled={!canDecrease}
                  className="min-h-[46px] min-w-[46px] rounded-xl border border-[#c4d1de] bg-[#f9fcff] text-xl font-semibold text-[#28465e] transition-colors hover:bg-[#edf4fa] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease text size"
                >
                  -
                </button>
                <span className="min-w-[72px] text-center text-sm font-semibold text-[#26435a]">
                  {FONT_SCALES[fontScale]}px
                </span>
                <button
                  onClick={() =>
                    setFontScale((scale) => Math.min(FONT_SCALES.length - 1, scale + 1))
                  }
                  disabled={!canIncrease}
                  className="min-h-[46px] min-w-[46px] rounded-xl border border-[#c4d1de] bg-[#f9fcff] text-xl font-semibold text-[#28465e] transition-colors hover:bg-[#edf4fa] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Increase text size"
                >
                  +
                </button>
              </div>
            </div>
          </header>

          <main className={`flex-1 min-h-0 overflow-hidden px-8 md:px-12 ${isTopicsView ? 'pb-0' : 'pb-6'}`}>
            {isTopicsView && (
              <div className="h-full min-h-0 w-full">
                <div className="h-full min-h-0 overflow-y-auto py-6 pr-1">
                  <div className="space-y-4">
                    {TOPICS.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => sendMessage(topic.query)}
                        className="group flex w-full min-h-[86px] items-center justify-between rounded-2xl border border-[#cad6e2] bg-[#f9fcff] px-5 py-4 text-left shadow-[0_5px_14px_rgba(42,66,92,0.06)] transition-all duration-150 hover:border-[#a8bccf] hover:bg-white hover:shadow-[0_10px_18px_rgba(42,66,92,0.09)]"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#bcccdc] bg-white text-[#2a4a63]">
                            <TopicGlyph id={topic.id} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-lg font-semibold leading-snug text-[#1f3549]">
                              {topic.label}
                            </p>
                            <p className="mt-1 text-[0.95rem] leading-snug text-[#466078]">
                              {topic.summary}
                            </p>
                          </div>
                        </div>
                        <span className="ml-4 text-2xl text-[#698099] transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeView === 'chat' && (
              <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col pt-6 pb-2">
                <ChatWindow
                  messages={messages}
                  onExecuteEmail={executeEmail}
                  onExecuteSms={executeSms}
                  onExecuteCall={executeCall}
                  apiUrl={API_URL}
                />

                {isLoading && <LoadingIndicator />}
                <div ref={chatEndRef} />
              </div>
            )}
          </main>

          {activeView === 'chat' && (
            <div className="border-t border-[#c8d4df] bg-[rgba(246,251,255,0.9)]">
              <ChatInput
                onSend={sendMessage}
                onSendImage={sendImage}
                disabled={isLoading}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
