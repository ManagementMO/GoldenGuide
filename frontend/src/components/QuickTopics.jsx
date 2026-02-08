import React from 'react';

export default function QuickTopics({ onSelect, language = 'en' }) {
  const topicsEn = [
    { emoji: '🚌', label: 'Transit', query: 'How do I take the bus in Kingston? What are senior transit options?' },
    { emoji: '🏠', label: 'Housing', query: 'What housing assistance programs are available for seniors in Kingston?' },
    { emoji: '🏥', label: 'Health', query: 'What health services and dental programs are available for seniors in Kingston?' },
    { emoji: '🎨', label: 'Activities', query: 'What activities and recreation programs are available for seniors in Kingston?' },
    { emoji: '💰', label: 'Financial Help', query: 'What financial assistance programs are available for seniors in Kingston?' },
    { emoji: '♿', label: 'Accessibility', query: 'What accessibility services and disability support are available in Kingston?' },
  ];

  const topicsFr = [
    { emoji: '🚌', label: 'Transport', query: "Comment prendre l'autobus à Kingston? Quelles sont les options de transport pour les aînés?" },
    { emoji: '🏠', label: 'Logement', query: "Quels programmes d'aide au logement sont disponibles pour les aînés à Kingston?" },
    { emoji: '🏥', label: 'Santé', query: 'Quels services de santé et programmes dentaires sont disponibles pour les aînés à Kingston?' },
    { emoji: '🎨', label: 'Activités', query: 'Quelles activités et programmes de loisirs sont disponibles pour les aînés à Kingston?' },
    { emoji: '💰', label: 'Aide financière', query: "Quels programmes d'aide financière sont disponibles pour les aînés à Kingston?" },
    { emoji: '♿', label: 'Accessibilité', query: "Quels services d'accessibilité et de soutien aux personnes handicapées sont disponibles à Kingston?" },
  ];

  const topics = language === 'fr' ? topicsFr : topicsEn;

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
