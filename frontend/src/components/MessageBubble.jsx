import React from 'react';
import { motion } from 'framer-motion';
import VoicePlayback from './VoicePlayback';
import ActionPlanCard from './ActionPlanCard';
import EmailPreview from './EmailPreview';
import CallPreview from './CallPreview';
import SmsCard from './SmsCard';
import ServiceCard from './ServiceCard';
import DocumentExplainerCard from './DocumentExplainerCard';
import EligibilityCard from './EligibilityCard';
import ReminderCard from './ReminderCard';
import OrbIcon from './OrbIcon';

function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const content = renderInline(headerMatch[2]);
      if (level === 1) elements.push(<h1 key={i} className="mb-2 mt-2 text-lg font-bold font-heading text-golden">{content}</h1>);
      else if (level === 2) elements.push(<h2 key={i} className="mb-1.5 mt-2 text-base font-bold font-heading text-golden-glow">{content}</h2>);
      else elements.push(<h3 key={i} className="mb-1 mt-1.5 text-sm font-bold font-heading text-golden-light">{content}</h3>);
      i++; continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, '')); i++; }
      elements.push(<ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-2 ml-2">{items.map((item, j) => <li key={j} className="text-sm leading-relaxed text-warm-50/80">{renderInline(item)}</li>)}</ul>);
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+[.)]\s+/, '')); i++; }
      elements.push(<ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-2 ml-2">{items.map((item, j) => <li key={j} className="text-sm leading-relaxed text-warm-50/80">{renderInline(item)}</li>)}</ol>);
      continue;
    }
    if (line.trim() === '') { elements.push(<div key={i} className="h-1.5" />); i++; continue; }
    elements.push(<p key={i} className="text-sm leading-relaxed text-warm-50/80">{renderInline(line)}</p>);
    i++;
  }
  return elements;
}

function renderInline(text) {
  if (!text) return text;
  const parts = [];
  const inlineRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;
  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[2] !== undefined) parts.push(<strong key={match.index} className="text-warm-50">{match[2]}</strong>);
    else if (match[3] !== undefined) parts.push(<em key={match.index}>{match[3]}</em>);
    else if (match[4] !== undefined) parts.push(<code key={match.index} className="rounded bg-white/10 px-1.5 py-0.5 text-sm font-mono text-golden-light">{match[4]}</code>);
    else if (match[5] !== undefined && match[6] !== undefined) parts.push(<a key={match.index} href={match[6]} target="_blank" rel="noopener noreferrer" className="font-semibold text-golden underline underline-offset-2 hover:text-golden-glow">{match[5]}</a>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}

export default function MessageBubble({ message, onExecuteEmail, onExecuteSms, onExecuteCall, apiUrl }) {
  const isUser = message.role === 'user';

  const parseContent = (text) => {
    if (!text) return { text: '', cards: [] };
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
    let match;
    const cards = [];
    let cleanText = text;
    while ((match = jsonRegex.exec(text)) !== null) {
      try {
        const data = JSON.parse(match[1]);
        cards.push(data);
        cleanText = cleanText.replace(match[0], '');
      } catch (e) { console.error('Failed to parse JSON in message:', e); }
    }
    return { text: cleanText.trim(), cards };
  };

  const { text: displayText, cards: embeddedCards } = parseContent(message.text);

  const allCards = [...embeddedCards];
  if (message.structured_data) {
    const sd = message.structured_data;
    if (sd.action_plan) allCards.push({ action_plan: sd.action_plan });
    if (sd.draft) allCards.push({ draft: sd.draft });
    if (sd.eligibility) allCards.push({ eligibility: sd.eligibility });
    if (sd.reminder) allCards.push({ reminder: sd.reminder });
    if (sd.document_explanation) allCards.push({ document_explanation: sd.document_explanation });
    if (sd.pending_actions) sd.pending_actions.forEach(action => allCards.push(action));
  }

  const renderCard = (data, index) => {
    if (data.action_plan || (data.steps && Array.isArray(data.steps)))
      return <ActionPlanCard key={index} plan={data.action_plan || data} onExecuteCall={onExecuteCall} onExecuteEmail={onExecuteEmail} onExecuteSms={onExecuteSms} />;
    if (data.email_draft || data.draft)
      return <EmailPreview key={index} draft={data.email_draft || data.draft} onSend={onExecuteEmail} onCancel={() => {}} />;
    if (data.call_preview || (data.recipient_name && data.phone_number))
      return <CallPreview key={index} preview={data.call_preview || data} onConfirm={onExecuteCall} />;
    if (data.eligibility)
      return <EligibilityCard key={index} eligibility={data.eligibility} />;
    if (data.reminder)
      return <ReminderCard key={index} reminder={data.reminder} />;
    if (data.document_explanation || data.plain_english)
      return <DocumentExplainerCard key={index} explanation={data.document_explanation || data} />;
    if (data.action === 'send_sms')
      return <SmsCard key={index} onSend={onExecuteSms} message={data.message || ''} />;
    if (data.action === 'send_email')
      return <EmailPreview key={index} draft={data} onSend={onExecuteEmail} onCancel={() => {}} />;
    if (data.action === 'place_call')
      return <CallPreview key={index} preview={data} onConfirm={onExecuteCall} />;
    if (data.service || (data.name && data.phone))
      return <ServiceCard key={index} service={data.service || data} onCallForMe={onExecuteCall} onEmailForMe={onExecuteEmail} />;
    return null;
  };

  return (
    <div className={`flex w-full animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[88%] md:max-w-[80%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>

        {!isUser && (
          <div className="mb-1.5 flex items-center gap-2 pl-1">
            <div className="goldie-glow">
              <OrbIcon mode={message.error ? 'idle' : 'speaking'} size={28} animated={false} />
            </div>
            <span className="text-xs font-bold text-warm-100/50 tracking-wide">Goldie</span>
          </div>
        )}

        <div className={`relative rounded-2xl p-3.5 text-sm ${
          isUser
            ? 'rounded-br-sm user-msg'
            : 'rounded-bl-sm glass glass-highlight'
        }`}>
          <div className="leading-relaxed">
            {isUser
              ? displayText.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < displayText.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              : renderMarkdown(displayText)
            }
          </div>

          {!isUser && displayText && (
            <div className="mt-2 flex justify-end border-t border-white/5 pt-2">
              <VoicePlayback text={displayText} apiUrl={apiUrl} />
            </div>
          )}
        </div>

        {allCards.length > 0 && (
          <div className="mt-2 w-full space-y-3">
            {allCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28, delay: idx * 0.08 }}
              >
                {renderCard(card, idx)}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
