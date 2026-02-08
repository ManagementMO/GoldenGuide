import React from 'react';
import { CalendarPlus, FileText, ListChecks } from 'lucide-react';
import { downloadReminder } from '../lib/api';

export default function DocumentExplainerCard({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="my-2 rounded-2xl border border-slate-200 bg-white p-4 text-[#334155] shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-xl font-bold">
        <FileText className="h-6 w-6 text-[#475569]" strokeWidth={2} aria-hidden="true" />
        {explanation.document_type || 'Document Explanation'}
      </h3>

      {explanation.plain_english && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">In Plain English</h4>
          <p className="text-base leading-relaxed">{explanation.plain_english}</p>
        </div>
      )}

      {explanation.action_items && explanation.action_items.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">
            <ListChecks className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Action Items
          </h4>
          <ol className="list-decimal list-inside space-y-2">
            {explanation.action_items.map((item, index) => (
              <li key={index} className="text-base leading-relaxed">{item}</li>
            ))}
          </ol>
        </div>
      )}

      {explanation.deadlines && explanation.deadlines.length > 0 && (
        <div className="mb-2">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">Deadlines</h4>
          <div className="space-y-3">
            {explanation.deadlines.map((deadline, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-[#1e293b]">{deadline.title}</p>
                  <p className="text-base text-[#475569]">{deadline.date}</p>
                  {deadline.description && (
                    <p className="mt-1 text-base text-[#64748B]">{deadline.description}</p>
                  )}
                </div>
                <button
                  onClick={() => downloadReminder({ title: deadline.title, date: deadline.date, description: deadline.description || '' })}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#334155] px-3 py-2 text-base font-semibold text-white transition-colors hover:bg-[#1e293b]"
                >
                  <CalendarPlus className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
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
