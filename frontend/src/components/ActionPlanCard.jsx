import React, { useState } from 'react';
import { Download, Mail, MapPin, MessageSquareText, PhoneCall, Printer } from 'lucide-react';
import SmsCard from './SmsCard';

export default function ActionPlanCard({ plan, onExecuteCall, onExecuteEmail, onExecuteSms }) {
  const [showSms, setShowSms] = useState(false);

  if (!plan || !plan.steps) return null;

  const handleDownload = () => {
    const textContent = `Your GoldenGuide Action Plan:\n\n` + 
      plan.steps.map((step, i) => 
        `${i+1}. ${step.service_name}\n${step.description}\n${step.phone || ''}\n${step.address || ''}\n`
      ).join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GoldenGuide-ActionPlan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="printable-action-plan" className="my-2 w-full rounded-2xl border border-slate-200 bg-white p-4 text-[#334155] shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">1</span>
        Your Personalized Action Plan
      </h3>

      <div className="space-y-4">
        {plan.steps.map((step, index) => (
          <div key={index} className="relative rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
            <div className="absolute -left-3 top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#334155] text-base font-semibold text-white shadow-sm">
              {index + 1}
            </div>

            <div className="ml-3">
              <h4 className="mb-1.5 flex items-center gap-2 text-lg font-semibold text-[#1e293b]">
                {step.service_name}
              </h4>

              <p className="mb-2 text-base text-[#475569]">{step.description}</p>

              <div className="mb-4 space-y-2 text-base">
                {step.phone && (
                  <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
                    <PhoneCall className="h-4 w-4 text-slate-600" strokeWidth={2} aria-hidden="true" />
                    <a href={`tel:${step.phone}`} className="text-base font-semibold text-[#334155] underline decoration-slate-300 underline-offset-4">
                      {step.phone}
                    </a>
                  </div>
                )}
                {step.address && (
                  <div className="flex items-start gap-2 rounded-xl bg-white px-3 py-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-slate-600" strokeWidth={2} aria-hidden="true" />
                    <span className="text-base text-[#334155]">{step.address}</span>
                  </div>
                )}
                {step.what_to_bring && (
                  <div className="mt-2 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <MessageSquareText className="mt-0.5 h-4 w-4 text-amber-700" strokeWidth={2} aria-hidden="true" />
                    <div>
                      <span className="block text-sm font-semibold text-amber-800">What to bring:</span>
                      <span className="text-base text-amber-900">{step.what_to_bring}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {step.phone && onExecuteCall && (
                  <button
                    onClick={() => onExecuteCall({
                      to_number: step.phone,
                      purpose: step.description,
                      service_name: step.service_name,
                      message_script: `Hello, I am calling about ${step.service_name}. ${step.description}`,
                    })}
                    className="flex min-h-[52px] min-w-[140px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#334155] px-3 text-base font-semibold text-white transition-colors hover:bg-[#1e293b]"
                  >
                    <PhoneCall className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    Call for Me
                  </button>
                )}
                {step.email && onExecuteEmail && (
                  <button
                    onClick={() => onExecuteEmail({
                      to_email: step.email,
                      subject: `Inquiry about ${step.service_name}`,
                      body_html: `<p>${step.description}</p>`,
                    })}
                    className="flex min-h-[52px] min-w-[140px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-base font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC]"
                  >
                    <Mail className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    Email for Me
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => setShowSms(!showSms)}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#334155] px-4 text-base font-semibold text-white transition-colors hover:bg-[#1e293b]"
          >
            <MessageSquareText className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            Text This Plan
          </button>

          <button
            onClick={handleDownload}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC]"
          >
            <Download className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            Download Plan
          </button>

          <button
            onClick={() => window.print()}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC]"
          >
            <Printer className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            Print Plan
          </button>
        </div>

        {showSms && (
          <SmsCard
            onSend={(data) => onExecuteSms(data)}
            message={`Your GoldenGuide Action Plan:\n${plan.steps.map((s, i) => `${i + 1}. ${s.service_name} - ${s.description}`).join('\n')}`}
          />
        )}
      </div>
    </div>
  );
}
