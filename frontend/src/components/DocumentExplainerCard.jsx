import React from 'react';
import { downloadReminder } from '../lib/api';

export default function DocumentExplainerCard({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="my-4 rounded-[1.1rem] border border-[#e6dbc9] bg-white p-6 text-textbrown shadow-[0_6px_18px_rgba(73,54,31,0.08)]">
      <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-textbrown/70">Document Help</p>
      <h3 className="text-2xl font-bold mb-4 font-heading flex items-center gap-2">
        {explanation.document_type || 'Document Explanation'}
      </h3>

      {explanation.plain_english && (
        <div className="bg-[#fbf7ee] border border-[#e3d5c0] rounded-xl p-4 mb-4">
          <h4 className="font-bold text-sm uppercase text-textbrown/65 mb-2">In Plain English</h4>
          <p className="text-lg leading-relaxed">{explanation.plain_english}</p>
        </div>
      )}

      {explanation.action_items && explanation.action_items.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold text-sm uppercase text-textbrown/65 mb-2">Action Items</h4>
          <ol className="list-decimal list-inside space-y-2">
            {explanation.action_items.map((item, index) => (
              <li key={index} className="text-lg leading-relaxed">{item}</li>
            ))}
          </ol>
        </div>
      )}

      {explanation.deadlines && explanation.deadlines.length > 0 && (
        <div className="mb-2">
          <h4 className="font-bold text-sm uppercase text-textbrown/65 mb-2">Deadlines</h4>
          <div className="space-y-3">
            {explanation.deadlines.map((deadline, index) => (
              <div key={index} className="bg-[#fbf7ee] border border-[#e3d5c0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-bold text-lg">{deadline.title}</p>
                  <p className="text-base text-textbrown/80">{deadline.date}</p>
                  {deadline.description && (
                    <p className="text-base text-textbrown/70 mt-1">{deadline.description}</p>
                  )}
                </div>
                <button
                  onClick={() => downloadReminder({ title: deadline.title, date: deadline.date, description: deadline.description || '' })}
                  className="min-h-[60px] whitespace-nowrap rounded-[0.8rem] bg-[#293646] px-4 py-2.5 font-bold text-white shadow-[0_8px_16px_rgba(43,56,72,0.22)] transition-all duration-150 hover:-translate-y-px hover:bg-[#1f2a37] active:translate-y-0"
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
