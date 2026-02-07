import React from 'react';
import VoicePlayback from './VoicePlayback';
import ActionPlanCard from './ActionPlanCard';
import EmailPreview from './EmailPreview';
import CallPreview from './CallPreview';
import SmsCard from './SmsCard';
import ServiceCard from './ServiceCard';

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
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Agent Avatar */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-1 pl-1">
             <div className="w-8 h-8 rounded-full bg-golden flex items-center justify-center text-white shadow-sm">
               <span role="img" aria-label="GoldenGuide Avatar">✨</span>
             </div>
             <span className="text-sm font-bold text-textbrown opacity-75">GoldenGuide</span>
          </div>
        )}

        <div className={`
          relative p-4 rounded-2xl shadow-sm text-lg
          ${isUser 
            ? 'bg-accent text-white rounded-br-sm' 
            : 'bg-cornsilk text-textbrown rounded-bl-sm border border-[#F5DEB3]'
          }
        `}>
          {/* Text Content */}
          <div className="whitespace-pre-wrap font-body leading-relaxed">
            {displayText.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < displayText.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {/* TTS Button for Agent */}
          {!isUser && displayText && (
             <div className="mt-2 pt-2 border-t border-golden/20 flex justify-end">
                <VoicePlayback text={displayText} apiUrl={apiUrl} />
             </div>
          )}
        </div>

        {/* Render Cards */}
        {allCards.length > 0 && (
          <div className="w-full mt-2 space-y-4">
            {allCards.map((card, idx) => renderCard(card, idx))}
          </div>
        )}
        
      </div>
    </div>
  );
}
