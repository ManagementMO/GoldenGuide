import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MessageBubble from './MessageBubble';

export default function ChatWindow({
  messages,
  onExecuteEmail,
  onExecuteSms,
  onExecuteCall,
  apiUrl,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-3 px-1 py-2">
      <AnimatePresence initial={false}>
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id || index}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <MessageBubble
              message={msg}
              onExecuteEmail={onExecuteEmail}
              onExecuteSms={onExecuteSms}
              onExecuteCall={onExecuteCall}
              apiUrl={apiUrl}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
