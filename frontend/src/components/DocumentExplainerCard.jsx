import React from 'react';
import { downloadReminder } from '../lib/api';

export default function DocumentExplainerCard({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="bg-cornsilk border-2 border-golden rounded-2xl p-6 shadow-md my-4 text-textbrown">
      <h3 className="text-2xl font-bold mb-4 font-heading flex items-center gap-2">
        <span role="img" aria-label="Document">📄</span>
        {explanation.document_type || 'Document Explanation'}
      </h3>

      {explanation.plain_english && (
        <div className="bg-white border border-[#F5DEB3] rounded-xl p-4 mb-4">
          <h4 className="font-bold text-sm uppercase text-golden mb-2">In Plain English</h4>
          <p className="text-lg leading-relaxed">{explanation.plain_english}</p>
        </div>
      )}

      {explanation.action_items && explanation.action_items.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold text-sm uppercase text-golden mb-2">Action Items</h4>
          <ol className="list-decimal list-inside space-y-2">
            {explanation.action_items.map((item, index) => (
              <li key={index} className="text-lg leading-relaxed">{item}</li>
            ))}
          </ol>
        </div>
      )}

      {explanation.deadlines && explanation.deadlines.length > 0 && (
        <div className="mb-2">
          <h4 className="font-bold text-sm uppercase text-golden mb-2">Deadlines</h4>
          <div className="space-y-3">
            {explanation.deadlines.map((deadline, index) => (
              <div key={index} className="bg-white border border-[#F5DEB3] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-bold text-lg">{deadline.title}</p>
                  <p className="text-base text-textbrown/80">{deadline.date}</p>
                  {deadline.description && (
                    <p className="text-base text-textbrown/70 mt-1">{deadline.description}</p>
                  )}
                </div>
                <button
                  onClick={() => downloadReminder({ title: deadline.title, date: deadline.date, description: deadline.description || '' })}
                  className="min-h-[48px] bg-golden text-white font-bold rounded-lg px-4 py-2 hover:bg-[#A67C00] transition-colors shadow-sm whitespace-nowrap"
                >
                  Add to Calendar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
