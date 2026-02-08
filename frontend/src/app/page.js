'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Accessibility,
  Bus,
  ChevronRight,
  FileText,
  FileUp,
  House,
  Landmark,
  Loader2,
  Lock,
  ShieldCheck,
  Stethoscope,
  Trash2,
  Users,
} from 'lucide-react';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import ToolActivity from '../components/ToolActivity';
import Mascot from '../components/Mascot';
import Header from '../components/Header';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const SERVICE_PATHWAYS = [
  {
    key: 'transit',
    icon: Bus,
    title: { en: 'Transit and Mobility', fr: 'Transport et mobilite' },
    detail: {
      en: 'Bus routes, reduced fares, and accessible transportation options.',
      fr: "Trajets d'autobus, tarifs reduits et options de transport accessible.",
    },
    query: {
      en: 'How do I take the bus in Kingston? What are senior transit options?',
      fr: "Comment prendre l'autobus a Kingston? Quelles sont les options de transport pour les aines?",
    },
  },
  {
    key: 'health',
    icon: Stethoscope,
    title: { en: 'Health and Dental Support', fr: 'Soutien sante et dentaire' },
    detail: {
      en: 'Clinics, dental coverage, and wellness services for older adults.',
      fr: 'Cliniques, couverture dentaire et services de bien-etre pour aines.',
    },
    query: {
      en: 'What health services and dental programs are available for seniors in Kingston?',
      fr: 'Quels services de sante et programmes dentaires sont disponibles pour les aines a Kingston?',
    },
  },
  {
    key: 'housing',
    icon: House,
    title: { en: 'Housing and Home Safety', fr: 'Logement et securite a domicile' },
    detail: {
      en: 'Affordable housing programs, rent support, and home safety referrals.',
      fr: 'Programmes de logement abordable, aide au loyer et references de securite.',
    },
    query: {
      en: 'What housing assistance programs are available for seniors in Kingston?',
      fr: "Quels programmes d'aide au logement sont disponibles pour les aines a Kingston?",
    },
  },
  {
    key: 'financial',
    icon: Landmark,
    title: { en: 'Financial Assistance', fr: 'Aide financiere' },
    detail: {
      en: 'Income supports, tax benefits, and emergency municipal assistance.',
      fr: "Soutiens au revenu, avantages fiscaux et aide municipale d'urgence.",
    },
    query: {
      en: 'What financial assistance programs are available for seniors in Kingston?',
      fr: "Quels programmes d'aide financiere sont disponibles pour les aines a Kingston?",
    },
  },
  {
    key: 'accessibility',
    icon: Accessibility,
    title: { en: 'Accessibility and Disability', fr: 'Accessibilite et handicap' },
    detail: {
      en: 'Accessibility services, mobility supports, and rights guidance.',
      fr: "Services d'accessibilite, soutien a la mobilite et conseils sur les droits.",
    },
    query: {
      en: 'What accessibility services and disability support are available in Kingston?',
      fr: "Quels services d'accessibilite et de soutien au handicap sont disponibles a Kingston?",
    },
  },
  {
    key: 'community',
    icon: Users,
    title: { en: 'Community and Activities', fr: 'Communaute et activites' },
    detail: {
      en: 'Social programs, recreation options, and local participation opportunities.',
      fr: 'Programmes sociaux, loisirs et occasions de participation locale.',
    },
    query: {
      en: 'What activities and recreation programs are available for seniors in Kingston?',
      fr: 'Quelles activites et programmes de loisirs sont disponibles pour les aines a Kingston?',
    },
  },
];

export default function Home() {
  const intakeInputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [language, setLanguage] = useState('en');
  const [showIngestionGate, setShowIngestionGate] = useState(true);
  const [isIngestionLoading, setIsIngestionLoading] = useState(false);
  const [ingestedFiles, setIngestedFiles] = useState([]);
  const [activeTools, setActiveTools] = useState([]);
  const [completedTools, setCompletedTools] = useState([]);
  const [localTime, setLocalTime] = useState(new Date());
  const chatEndRef = useRef(null);

  const isChatMode = messages.length > 0 || isLoading;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', fontSize === 'large');
  }, [fontSize]);

  useEffect(() => {
    const timer = window.setInterval(() => setLocalTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

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
        { role: 'agent', text: 'I had trouble reading that document. Could you try again?', error: true },
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
    } catch {
      return { status: 'error' };
    }
  };

  const executeSms = async (smsData) => {
    try {
      const res = await fetch(`${API_URL}/api/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smsData),
      });
      return await res.json();
    } catch {
      return { status: 'error' };
    }
  };

  const executeCall = async (callData) => {
    try {
      const res = await fetch(`${API_URL}/api/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callData),
      });
      return await res.json();
    } catch {
      return { status: 'error' };
    }
  };

  const handleBackToPathways = () => {
    if (isLoading) return;
    setMessages([]);
    setHistory([]);
    setActiveTools([]);
    setCompletedTools([]);
  };

  const formatFileSize = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const appendIngestionFiles = (fileList) => {
    if (isIngestionLoading) return;
    const mappedFiles = Array.from(fileList).map((file, index) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
    }));
    setIngestedFiles((prev) => [...prev, ...mappedFiles]);
    if (mappedFiles.length > 0) {
      setIsIngestionLoading(true);
      window.setTimeout(() => {
        setShowIngestionGate(false);
      }, 1800);
    }
  };

  const handleIngestionSelect = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    appendIngestionFiles(files);
    event.target.value = '';
  };

  const handleIngestionDrop = (event) => {
    if (isIngestionLoading) return;
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    appendIngestionFiles(files);
  };

  const handleIngestionDragOver = (event) => {
    if (isIngestionLoading) return;
    event.preventDefault();
  };

  const handleRemoveIngestedFile = (fileId) => {
    if (isIngestionLoading) return;
    setIngestedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  if (showIngestionGate) {
    return (
      <div className="h-[100dvh] overflow-hidden bg-[#fbfbfa] text-[#334155]">
        <main className="grid h-full min-h-0 lg:grid-cols-[30%_70%]">
          <aside className="relative hidden min-h-0 overflow-hidden border-r border-slate-800 bg-slate-900 p-4 lg:flex lg:p-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <img
                src="/city-hall.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-50"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-transparent" />
            </div>

            <div className="relative z-10 flex h-full min-h-0 w-full flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">City of Kingston</p>
                <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-50">GoldenGuide Intake</h1>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-1">
                <Mascot mode="idle" animated={false} showBadge={false} ariaLabel="GoldenGuide intake orb" />
                <p className="max-w-xs text-center text-base text-slate-100/95">
                  Upload reference documents before entering the municipal assistant workspace.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Session Flow</h3>
                <div className="rounded-xl border border-slate-400/25 bg-slate-800/45 p-3 shadow-sm backdrop-blur-sm">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-200" strokeWidth={2} aria-hidden="true" />
                    <p className="text-sm font-medium text-slate-100">Step 1: Ingest documents</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-400/25 bg-slate-800/45 p-3 shadow-sm backdrop-blur-sm">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-5 w-5 text-amber-200" strokeWidth={2} aria-hidden="true" />
                    <p className="text-sm font-medium text-slate-100">Step 2: Preparing assistant workspace</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex h-full min-h-0 flex-col bg-white">
            <div className="border-b border-slate-200 p-4 lg:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">Welcome</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#334155]">Welcome to GoldenGuide</h2>
              <p className="mt-2 max-w-2xl text-base text-[#64748B]">
                Upload any relevant letters, forms, or notes. This is a mock intake step for demo workflow.
              </p>
            </div>

            <div className="chat-scroll flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
                <input
                  ref={intakeInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleIngestionSelect}
                />

                <button
                  onClick={() => intakeInputRef.current?.click()}
                  disabled={isIngestionLoading}
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-[#334155] px-4 text-base font-semibold text-white transition-colors hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FileUp className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  Upload Documents
                </button>

                <div
                  onDrop={handleIngestionDrop}
                  onDragOver={handleIngestionDragOver}
                  className={`mt-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center ${isIngestionLoading ? 'opacity-60' : ''}`}
                >
                  <p className="text-base font-semibold text-[#334155]">Drag and drop files here</p>
                  <p className="mt-1 text-sm text-[#64748B]">Supports PDF, image, text, and document files</p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748B]">Ingested Documents</p>
                  {ingestedFiles.length === 0 ? (
                    <p className="mt-2 text-sm text-[#64748B]">No files uploaded yet.</p>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {ingestedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                              <FileText className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#334155]">{file.name}</p>
                              <p className="text-xs text-[#64748B]">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveIngestedFile(file.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`Remove ${file.name}`}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {isIngestionLoading && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#334155]">
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden="true" />
                      Ingesting documents and preparing GoldenGuide...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#fbfbfa] text-[#334155]">
      <main className="grid h-full min-h-0 lg:grid-cols-[30%_70%]">
        <aside className="relative hidden min-h-0 overflow-hidden border-r border-slate-800 bg-slate-900 p-4 lg:flex lg:p-6">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <img
              src="/city-hall.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-55"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/25 to-transparent" />
          </div>

          <div className="relative z-10 flex h-full min-h-0 w-full flex-col justify-between">
            <div className="flex w-full items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">City of Kingston</p>
                <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-50">Municipal Services Access Desk</h1>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-1">
              <Mascot
                mode={isLoading ? 'speaking' : 'idle'}
                animated={isChatMode}
                showBadge={false}
                ariaLabel="GoldenGuide status orb"
              />
              <p className="max-w-xs text-center text-base text-slate-100/95">
                {language === 'fr'
                  ? 'Assistance municipale calme et fiable pour les residents ages.'
                  : 'Calm, trusted municipal support for older residents.'}
              </p>
              <p className="text-sm text-slate-300">
                {localTime.toLocaleTimeString(language === 'fr' ? 'fr-CA' : 'en-CA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Verified Sources</h3>
              <div className="rounded-xl border border-slate-400/25 bg-slate-800/45 p-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-200" strokeWidth={2} aria-hidden="true" />
                  <p className="text-sm font-medium text-slate-100">Official Data: Verified by City of Kingston</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-400/25 bg-slate-800/45 p-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-start gap-2">
                  <Lock className="mt-0.5 h-5 w-5 text-amber-200" strokeWidth={2} aria-hidden="true" />
                  <p className="text-sm font-medium text-slate-100">Agentic: Will draft emails and make calls for you</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex h-full min-h-0 flex-col bg-white">
          <Header
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            language={language}
            onLanguageChange={setLanguage}
          />
          {isChatMode && (
            <div className="border-b border-slate-200 px-4 py-3 lg:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToPathways}
                    disabled={isLoading}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-base font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={language === 'fr' ? 'Retour aux parcours' : 'Back to pathways'}
                  >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    {language === 'fr' ? 'Retour' : 'Back'}
                  </button>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                    {language === 'fr' ? 'Espace de conversation' : 'Conversation Workspace'}
                  </p>
                </div>
                <h2 className="text-lg font-semibold text-[#334155]">
                  {language === 'fr' ? 'Assistance municipale active' : 'Active Municipal Assistance'}
                </h2>
              </div>
            </div>
          )}

          {!isChatMode ? (
            <div className="chat-scroll flex-1 overflow-y-auto px-4 pt-2 pb-2 lg:px-6">
              <div className="flex min-h-full flex-col gap-2">
                {SERVICE_PATHWAYS.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <button
                      key={topic.key}
                      onClick={() => sendMessage(topic.query[language])}
                      className="group flex min-h-[92px] w-full flex-1 items-center justify-between rounded-2xl bg-white px-4 py-4 text-left shadow-sm transition-all hover:shadow-md"
                      aria-label={`${topic.title[language]}: ${topic.detail[language]}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                          <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-xl font-semibold text-[#334155]">{topic.title[language]}</span>
                          <span className="block text-base text-[#64748B]">{topic.detail[language]}</span>
                        </span>
                      </span>
                      <ChevronRight className="h-5 w-5 text-[#64748B] transition-transform group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <main className="chat-scroll flex-1 overflow-y-auto px-4 py-4 lg:px-6">
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
          )}
        </section>
      </main>
    </div>
  );
}
