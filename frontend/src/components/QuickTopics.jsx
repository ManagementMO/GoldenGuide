import React from 'react';

export default function QuickTopics({ onSelect }) {
  const topics = [
    { emoji: '🦷', label: 'Dental Help', query: 'I need help with dental care' },
    { emoji: '🚌', label: 'Bus Times', query: 'When does the bus come?' },
    { emoji: '💰', label: 'Fee Assistance', query: 'I need help with fees and costs' },
    { emoji: '🏠', label: 'Homemaking', query: 'I need help with housekeeping and homemaking' },
    { emoji: '🎨', label: 'Activities', query: 'What activities are available for seniors?' },
    { emoji: '❓', label: 'What Can You Do?', query: 'What can you help me with?' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full p-2">
      {topics.map((topic, index) => (
        <button
          key={index}
          onClick={() => onSelect(topic.query)}
          className="flex flex-col items-center justify-center gap-2 min-h-[100px] p-4 bg-cornsilk hover:bg-[#F5DEB3] border-2 border-golden rounded-xl transition-colors text-textbrown shadow-sm active:scale-95"
        >
          <span className="text-3xl" role="img" aria-label={topic.label}>
            {topic.emoji}
          </span>
          <span className="text-lg font-bold text-center leading-tight">
            {topic.label}
          </span>
        </button>
      ))}
    </div>
  );
}
