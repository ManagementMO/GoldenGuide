import React from 'react';
import { BadgeCheck, CircleX, HelpCircle } from 'lucide-react';

export default function EligibilityCard({ eligibility }) {
  if (!eligibility) return null;

  const { eligible = [], maybe_eligible = [], not_eligible = [] } = eligibility;

  if (eligible.length === 0 && maybe_eligible.length === 0 && not_eligible.length === 0) {
    return null;
  }

  return (
    <div className="my-2 rounded-2xl border border-slate-200 bg-white p-4 text-[#334155] shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-xl font-bold">
        <BadgeCheck className="h-6 w-6 text-[#475569]" strokeWidth={2} aria-hidden="true" />
        Your Eligibility Results
      </h3>

      {eligible.length > 0 && (
        <div className="mb-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-emerald-700">
              <BadgeCheck className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Eligible
            </h4>
            <ul className="space-y-3">
              {eligible.map((item, i) => (
                <li key={i} className="text-base">
                  <span className="block font-semibold">{item.program}</span>
                  <span className="text-base text-[#475569]">{item.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {maybe_eligible.length > 0 && (
        <div className="mb-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-amber-700">
              <HelpCircle className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Maybe Eligible
            </h4>
            <ul className="space-y-3">
              {maybe_eligible.map((item, i) => (
                <li key={i} className="text-base">
                  <span className="block font-semibold">{item.program}</span>
                  <span className="text-base text-[#475569]">{item.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {not_eligible.length > 0 && (
        <div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-600">
              <CircleX className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Not Eligible
            </h4>
            <ul className="space-y-3">
              {not_eligible.map((item, i) => (
                <li key={i} className="text-base">
                  <span className="block font-semibold">{item.program}</span>
                  <span className="text-base text-[#475569]">{item.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
