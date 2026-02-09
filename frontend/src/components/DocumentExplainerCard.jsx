import React from 'react';
import { motion } from 'framer-motion';
import { CalendarPlus, FileText, ListChecks } from 'lucide-react';
import { downloadReminder } from '../lib/api';

export default function DocumentExplainerCard({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="my-2 glass-strong rounded-2xl p-5 glass-highlight">
      <h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-golden font-heading">
        <FileText className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
        {explanation.document_type || 'Document Explanation'}
      </h3>

      {explanation.plain_english && (
        <div className="mb-4 glass rounded-xl p-4">
          <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">In Plain English</h4>
          <p className="text-base leading-relaxed text-warm-50/80">{explanation.plain_english}</p>
        </div>
      )}

      {explanation.action_items && explanation.action_items.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">
            <ListChecks className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Action Items
          </h4>
          <ol className="list-decimal list-inside space-y-2">
            {explanation.action_items.map((item, index) => (
              <motion.li key={index}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="text-base leading-relaxed text-warm-50/80">{item}</motion.li>
            ))}
          </ol>
        </div>
      )}

      {explanation.deadlines && explanation.deadlines.length > 0 && (
        <div className="mb-2">
          <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">Deadlines</h4>
          <div className="space-y-3">
            {explanation.deadlines.map((deadline, index) => (
              <motion.div key={index}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col gap-3 glass rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-bold text-warm-50">{deadline.title}</p>
                  <p className="text-base text-golden">{deadline.date}</p>
                  {deadline.description && <p className="mt-1 text-base text-warm-100/50">{deadline.description}</p>}
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => downloadReminder({ title: deadline.title, date: deadline.date, description: deadline.description || '' })}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap btn-golden px-3 py-2 text-sm">
                  <CalendarPlus className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Add to Calendar
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
