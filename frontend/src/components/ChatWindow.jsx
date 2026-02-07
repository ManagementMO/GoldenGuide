import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ 
  messages, 
  onExecuteEmail, 
  onExecuteSms, 
  onExecuteCall, 
  apiUrl 
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-6 bg-floral min-h-0">
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id || index}
          message={msg}
          onExecuteEmail={onExecuteEmail}
          onExecuteSms={onExecuteSms}
          onExecuteCall={onExecuteCall}
          apiUrl={apiUrl}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
