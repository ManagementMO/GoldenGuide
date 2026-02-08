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
    <div className="min-h-0 flex-grow space-y-2 overflow-y-auto bg-white px-0.5 py-1">
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
