import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="flex w-full justify-start mb-4 animate-fade-in">
      <div className="flex flex-row max-w-[85%] items-end">
        <div className="flex-shrink-0 mr-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-golden flex items-center justify-center text-white">
            <span role="img" aria-label="GoldenGuide Avatar">✨</span>
          </div>
        </div>
        
        <div className="relative p-4 rounded-2xl rounded-bl-sm bg-cornsilk text-textbrown shadow-sm">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-accent mb-1">GoldenGuide is thinking...</p>
          </div>
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
