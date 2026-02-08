import React from 'react';

const TOOL_DISPLAY = {
  search_services: { label: 'Searching services', icon: '🔍' },
  check_eligibility: { label: 'Checking eligibility', icon: '✅' },
  get_transit_info: { label: 'Looking up transit', icon: '🚌' },
  generate_action_plan: { label: 'Building action plan', icon: '📋' },
  draft_communication: { label: 'Drafting message', icon: '✉️' },
  create_reminder: { label: 'Creating reminder', icon: '📅' },
  explain_document: { label: 'Reading document', icon: '📄' },
  web_search: { label: 'Searching the web', icon: '🌐' },
  place_call: { label: 'Preparing call', icon: '📞' },
  send_email: { label: 'Preparing email', icon: '📧' },
  send_sms: { label: 'Preparing text', icon: '💬' },
};

export default function ToolActivity({ activeTools = [], completedTools = [] }) {
  const allTools = [...new Set([...completedTools, ...activeTools])];

  if (allTools.length === 0) {
    return (
      <div className="flex w-full justify-start mb-4 animate-fade-in">
        <div className="flex flex-row max-w-[85%] items-end">
          <div className="flex-shrink-0 mr-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-golden flex items-center justify-center text-white">
              <span role="img" aria-label="GoldenGuide Avatar">✨</span>
            </div>
          </div>
          <div className="relative p-4 rounded-2xl rounded-bl-sm bg-cornsilk text-textbrown shadow-sm">
            <p className="font-bold text-sm text-accent mb-1">GoldenGuide is thinking...</p>
            <div className="flex gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-golden animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 rounded-full bg-golden animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 rounded-full bg-golden animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start mb-4 animate-fade-in">
      <div className="flex flex-row max-w-[85%] items-end">
        <div className="flex-shrink-0 mr-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-golden flex items-center justify-center text-white">
            <span role="img" aria-label="GoldenGuide Avatar">✨</span>
          </div>
        </div>
        <div className="relative p-4 rounded-2xl rounded-bl-sm bg-cornsilk text-textbrown shadow-sm min-w-[240px]">
          <p className="font-bold text-sm text-accent mb-2">GoldenGuide is working...</p>
          <div className="space-y-1.5">
            {allTools.map((tool) => {
              const info = TOOL_DISPLAY[tool] || { label: tool, icon: '⚙️' };
              const isActive = activeTools.includes(tool);
              const isDone = completedTools.includes(tool);
              return (
                <div key={tool} className="flex items-center gap-2 text-sm animate-fade-in">
                  <span className="text-base">{isDone ? '✓' : info.icon}</span>
                  <span className={isDone ? 'text-green-700 font-medium' : 'text-textbrown'}>
                    {info.label}
                  </span>
                  {isActive && !isDone && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-golden animate-pulse"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
