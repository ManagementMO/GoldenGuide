import React from 'react';
import OrbIcon from './OrbIcon';

export default function QuickTopics({ onSelect }) {
  const topics = [
    {
      icon: 'transit',
      tone: 'cool',
      label: 'Transit',
      summary: 'Bus routes, discounts, and ride booking support.',
      query: 'How do I take the bus in Kingston? What are senior transit options?',
    },
    {
      icon: 'housing',
      tone: 'brand',
      label: 'Housing',
      summary: 'Affordable housing options and application steps.',
      query: 'What housing assistance programs are available for seniors in Kingston?',
    },
    {
      icon: 'health',
      tone: 'sage',
      label: 'Health',
      summary: 'Clinics, dental care, and local wellness services.',
      query: 'What health services and dental programs are available for seniors in Kingston?',
    },
    {
      icon: 'activities',
      tone: 'blush',
      label: 'Activities',
      summary: 'Community programs, classes, and social events.',
      query: 'What activities and recreation programs are available for seniors in Kingston?',
    },
    {
      icon: 'financial',
      tone: 'brand',
      label: 'Financial Help',
      summary: 'Benefits, subsidies, and income support programs.',
      query: 'What financial assistance programs are available for seniors in Kingston?',
    },
    {
      icon: 'accessibility',
      tone: 'cool',
      label: 'Accessibility',
      summary: 'Mobility support, aids, and inclusive services.',
      query: 'What accessibility services and disability support are available in Kingston?',
    },
  ];

  return (
    <div className="w-full flex-1 min-h-0 overflow-y-auto p-1 pr-1">
      <div className="grid grid-cols-1 gap-3">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onSelect(topic.query)}
            className="flex min-h-[106px] items-start gap-4 rounded-[0.85rem] border border-[#e5dac9] bg-[#fffdfa] p-4 text-left text-textbrown shadow-[0_3px_10px_rgba(73,54,31,0.04)] transition-[background-color,transform,box-shadow] duration-150 hover:bg-[#fbf5eb] hover:shadow-[0_9px_18px_rgba(73,54,31,0.08)] active:scale-[0.99] md:p-5"
          >
            <OrbIcon name={topic.icon} tone={topic.tone} size="md" className="orb-pill" />
            <div className="min-w-0">
              <p className="text-base md:text-lg font-bold leading-snug">
                {topic.label}
              </p>
              <p className="text-sm md:text-[0.95rem] text-textbrown/75 mt-1 leading-snug">
                {topic.summary}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
