import React from 'react';
import VoicePlayback from './VoicePlayback';
import ActionPlanCard from './ActionPlanCard';
import EmailPreview from './EmailPreview';
import CallPreview from './CallPreview';
import SmsCard from './SmsCard';
import ServiceCard from './ServiceCard';
import DocumentExplainerCard from './DocumentExplainerCard';
import OrbIcon from './OrbIcon';
import styles from './Mascot.module.css';

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
  
  // Combine embedded cards with structured_data if exists
  const allCards = [...embeddedCards];
  if (message.structured_data) {
    allCards.push(message.structured_data);
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
          onCancel={() => {}} // Optional cancel handler
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

    // Document explainer check
    if (data.document_explanation || data.plain_english) {
      return (
        <DocumentExplainerCard
          key={index}
          explanation={data.document_explanation || data}
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
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} ${styles.fadeIn}`}>
      <div className={`flex flex-col max-w-[90%] md:max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>

        {!isUser && (
          <div className="flex items-center gap-2 mb-2 pl-1">
             <OrbIcon name="brand" tone="brand" size="sm" />
             <span className="text-sm font-bold text-textbrown/80">GoldenGuide</span>
          </div>
        )}

        <div
          className={`relative p-5 md:p-5 rounded-[1.15rem] text-[1.05rem] md:text-lg ${
            isUser
              ? 'bg-[#2b3848] text-white rounded-br-md shadow-[0_10px_22px_rgba(43,56,72,0.25)]'
              : 'bg-[#fffdf9] text-textbrown rounded-bl-md border border-[#d9ccb8] shadow-[0_8px_20px_rgba(63,44,25,0.12)]'
          }`}
        >
          <div className="whitespace-pre-wrap font-body leading-[1.75]">
            {displayText.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {!isUser && displayText && (
             <div className="mt-3 pt-3 border-t border-[#e6dac9] flex justify-end">
                <VoicePlayback text={displayText} apiUrl={apiUrl} />
             </div>
          )}
        </div>

        {allCards.length > 0 && (
          <div className="w-full mt-3 space-y-4">
            {allCards.map((card, idx) => renderCard(card, idx))}
          </div>
        )}
      </div>
    </div>
  );
}
