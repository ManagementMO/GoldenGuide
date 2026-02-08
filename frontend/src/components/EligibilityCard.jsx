import React from 'react';

export default function EligibilityCard({ eligibility }) {
  if (!eligibility) return null;

  const { eligible = [], maybe_eligible = [], not_eligible = [] } = eligibility;

  if (eligible.length === 0 && maybe_eligible.length === 0 && not_eligible.length === 0) {
    return null;
  }

  return (
    <div className="bg-cornsilk border-2 border-golden rounded-xl p-6 shadow-md my-4 text-textbrown">
      <h3 className="text-2xl font-bold mb-4 font-heading flex items-center gap-2">
        <span role="img" aria-label="Clipboard">📋</span>
        Your Eligibility Results
      </h3>

      {eligible.length > 0 && (
        <div className="mb-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-lg text-success mb-3 flex items-center gap-2">
              <span>&#10003;</span> Eligible
            </h4>
            <ul className="space-y-3">
              {eligible.map((item, i) => (
                <li key={i} className="text-lg">
                  <span className="font-bold block">{item.program}</span>
                  <span className="text-base text-textbrown/80">{item.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {maybe_eligible.length > 0 && (
        <div className="mb-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-bold text-lg text-amber-700 mb-3 flex items-center gap-2">
              <span>?</span> Maybe Eligible
            </h4>
            <ul className="space-y-3">
              {maybe_eligible.map((item, i) => (
                <li key={i} className="text-lg">
                  <span className="font-bold block">{item.program}</span>
                  <span className="text-base text-textbrown/80">{item.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {not_eligible.length > 0 && (
        <div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-lg text-gray-500 mb-3 flex items-center gap-2">
              <span>&#10007;</span> Not Eligible
            </h4>
            <ul className="space-y-3">
              {not_eligible.map((item, i) => (
                <li key={i} className="text-lg">
                  <span className="font-bold block">{item.program}</span>
                  <span className="text-base text-textbrown/80">{item.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
