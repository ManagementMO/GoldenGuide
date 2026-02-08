import React from 'react';
import { Building2 } from 'lucide-react';
import VoicePlayback from './VoicePlayback';
import ActionPlanCard from './ActionPlanCard';
import EmailPreview from './EmailPreview';
import CallPreview from './CallPreview';
import SmsCard from './SmsCard';
import ServiceCard from './ServiceCard';
import DocumentExplainerCard from './DocumentExplainerCard';
import EligibilityCard from './EligibilityCard';
import ReminderCard from './ReminderCard';

// Lightweight markdown-to-React renderer
function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headers: ### , ## , #
    const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const content = renderInline(headerMatch[2]);
      if (level === 1) {
        elements.push(<h1 key={i} className="mb-1.5 mt-1.5 text-lg font-bold font-heading">{content}</h1>);
      } else if (level === 2) {
        elements.push(<h2 key={i} className="mb-1.5 mt-1.5 text-base font-bold font-heading">{content}</h2>);
      } else {
        elements.push(<h3 key={i} className="mb-1 mt-1.5 text-sm font-bold font-heading">{content}</h3>);
      }
      i++;
      continue;
    }

    // Bullet list: collect consecutive lines starting with - or *
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-2 ml-2">
          {items.map((item, j) => (
            <li key={j} className="text-sm leading-relaxed">{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list: collect consecutive lines starting with digits.
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-2 ml-2">
          {items.map((item, j) => (
            <li key={j} className="text-sm leading-relaxed">{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line → spacing
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-1.5" />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

// Render inline markdown: **bold**, *italic*, `code`, [link](url)
function renderInline(text) {
  if (!text) return text;

  // Split text into tokens using a regex that captures markdown patterns
  const parts = [];
  // Match: **bold**, *italic*, `code`, [text](url)
  const inlineRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2] !== undefined) {
      // **bold**
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      // *italic*
      parts.push(<em key={match.index}>{match[3]}</em>);
    } else if (match[4] !== undefined) {
      // `code`
      parts.push(
        <code key={match.index} className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-[#334155]">
          {match[4]}
        </code>
      );
    } else if (match[5] !== undefined && match[6] !== undefined) {
      // [text](url)
      parts.push(
        <a key={match.index} href={match[6]} target="_blank" rel="noopener noreferrer"
           className="font-semibold text-[#1e40af] underline hover:opacity-80">
          {match[5]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining plain text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}

export default function MessageBubble({ message, onExecuteEmail, onExecuteSms, onExecuteCall, apiUrl }) {
  const isUser = message.role === 'user';

  // Helper to parse content for JSON blocks
  const parseContent = (text) => {
    if (!text) return { text: '', cards: [] };

    const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
    let match;
    const cards = [];
    let cleanText = text;

    // Extract all JSON blocks
    while ((match = jsonRegex.exec(text)) !== null) {
      try {
        const jsonStr = match[1];
        const data = JSON.parse(jsonStr);
        cards.push(data);
        // Remove the block from text
        cleanText = cleanText.replace(match[0], '');
      } catch (e) {
        console.error('Failed to parse JSON in message:', e);
      }
    }

    return { text: cleanText.trim(), cards };
  };

  const { text: displayText, cards: embeddedCards } = parseContent(message.text);

  // Combine embedded cards with structured_data expanded into individual cards
  const allCards = [...embeddedCards];
  if (message.structured_data) {
    const sd = message.structured_data;
    if (sd.action_plan) allCards.push({ action_plan: sd.action_plan });
    if (sd.draft) allCards.push({ draft: sd.draft });
    if (sd.eligibility) allCards.push({ eligibility: sd.eligibility });
    if (sd.reminder) allCards.push({ reminder: sd.reminder });
    if (sd.document_explanation) allCards.push({ document_explanation: sd.document_explanation });
    if (sd.pending_actions) {
      sd.pending_actions.forEach(action => allCards.push(action));
    }
  }

  const renderCard = (data, index) => {
    // Determine card type based on keys
    if (data.action_plan || (data.steps && Array.isArray(data.steps))) {
      return (
        <ActionPlanCard
          key={index}
          plan={data.action_plan || data}
          onExecuteCall={onExecuteCall}
          onExecuteEmail={onExecuteEmail}
          onExecuteSms={onExecuteSms}
        />
      );
    }

    if (data.email_draft || data.draft) {
      return (
        <EmailPreview
          key={index}
          draft={data.email_draft || data.draft}
          onSend={onExecuteEmail}
          onCancel={() => {}}
        />
      );
    }

    if (data.call_preview || (data.recipient_name && data.phone_number)) {
      return (
        <CallPreview
          key={index}
          preview={data.call_preview || data}
          onConfirm={onExecuteCall}
        />
      );
    }

    // Eligibility check results
    if (data.eligibility) {
      return (
        <EligibilityCard
          key={index}
          eligibility={data.eligibility}
        />
      );
    }

    // Calendar reminder
    if (data.reminder) {
      return (
        <ReminderCard
          key={index}
          reminder={data.reminder}
        />
      );
    }

    // Document explainer check
    if (data.document_explanation || data.plain_english) {
      return (
        <DocumentExplainerCard
          key={index}
          explanation={data.document_explanation || data}
        />
      );
    }

    // Pending action: send_sms
    if (data.action === 'send_sms') {
      return (
        <SmsCard
          key={index}
          onSend={onExecuteSms}
          message={data.message || ''}
        />
      );
    }

    // Pending action: send_email
    if (data.action === 'send_email') {
      return (
        <EmailPreview
          key={index}
          draft={data}
          onSend={onExecuteEmail}
          onCancel={() => {}}
        />
      );
    }

    // Pending action: place_call
    if (data.action === 'place_call') {
      return (
        <CallPreview
          key={index}
          preview={data}
          onConfirm={onExecuteCall}
        />
      );
    }

    // Service card check - usually simpler structure
    if (data.service || (data.name && data.phone)) {
        return (
            <ServiceCard
                key={index}
                service={data.service || data}
                onCallForMe={onExecuteCall}
                onEmailForMe={onExecuteEmail}
            />
        );
    }

    return null;
  };

  return (
    <div className={`flex w-full animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[88%] md:max-w-[80%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>

        {/* Agent Avatar */}
        {!isUser && (
          <div className="mb-1 flex items-center gap-1.5 pl-0.5">
             <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#334155] text-white shadow-sm">
               <Building2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
             </div>
             <span className="text-xs font-semibold text-[#475569]">GoldenGuide</span>
          </div>
        )}

        <div className={`
          relative rounded-xl p-2.5 text-sm shadow-sm
          ${isUser
            ? 'rounded-br-sm bg-[#334155] text-white'
            : 'rounded-bl-sm border border-slate-200 bg-[#F8FAFC] text-[#334155]'
          }
        `}>
          {/* Text Content */}
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

          {/* TTS Button for Agent */}
          {!isUser && displayText && (
             <div className="mt-1.5 flex justify-end border-t border-slate-200 pt-1.5">
                <VoicePlayback text={displayText} apiUrl={apiUrl} />
             </div>
          )}
        </div>

        {/* Render Cards */}
        {allCards.length > 0 && (
          <div className="mt-1.5 w-full space-y-2">
            {allCards.map((card, idx) => renderCard(card, idx))}
          </div>
        )}

      </div>
    </div>
  );
}
