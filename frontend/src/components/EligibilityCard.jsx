import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, CircleX, HelpCircle } from 'lucide-react';

export default function EligibilityCard({ eligibility }) {
  if (!eligibility) return null;
  const { eligible = [], maybe_eligible = [], not_eligible = [] } = eligibility;
  if (eligible.length === 0 && maybe_eligible.length === 0 && not_eligible.length === 0) return null;

  const sections = [
    { items: eligible, icon: BadgeCheck, title: 'Eligible', borderColor: 'border-success/20', bgColor: 'bg-success/10', textColor: 'text-success' },
    { items: maybe_eligible, icon: HelpCircle, title: 'Maybe Eligible', borderColor: 'border-golden/20', bgColor: 'bg-golden/10', textColor: 'text-golden' },
    { items: not_eligible, icon: CircleX, title: 'Not Eligible', borderColor: 'border-white/5', bgColor: 'bg-white/5', textColor: 'text-warm-100/50' },
  ];

  return (
    <div className="my-2 glass-strong rounded-2xl p-5 glass-highlight">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-golden font-heading">
        <BadgeCheck className="h-6 w-6" strokeWidth={2} aria-hidden="true" /> Your Eligibility Results
      </h3>

      {sections.map((section, sIdx) => section.items.length > 0 && (
        <motion.div key={sIdx}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sIdx * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
          className={`mb-4 last:mb-0 rounded-xl border ${section.borderColor} ${section.bgColor} p-4`}
        >
          <h4 className={`mb-2 flex items-center gap-2 text-base font-bold ${section.textColor}`}>
            <section.icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> {section.title}
          </h4>
          <ul className="space-y-3">
            {section.items.map((item, i) => (
              <li key={i} className="text-base">
                <span className="block font-bold text-warm-50/90">{item.program}</span>
                <span className="text-base text-warm-100/60">{item.reason}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
