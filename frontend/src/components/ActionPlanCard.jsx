import React, { useState } from 'react';
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

  const pillClass =
    'inline-flex items-center rounded-full border border-[#e6dbc9] bg-white px-3 py-1 text-[0.8rem] text-[#5f5344]';
  const primaryButtonClass =
    'min-h-[60px] flex-1 rounded-[0.8rem] bg-[#293646] px-4 py-2.5 font-bold text-white shadow-[0_8px_16px_rgba(43,56,72,0.22)] transition-all duration-150 hover:-translate-y-px hover:bg-[#1f2a37] active:translate-y-0';
  const secondaryButtonClass =
    'min-h-[60px] flex-1 rounded-[0.8rem] border border-[#c4b299] bg-white px-4 py-2.5 font-bold text-[#5b4a35] transition-all duration-150 hover:-translate-y-px hover:bg-[#fff8ed] active:translate-y-0';

  return (
    <div id="printable-action-plan" className="my-4 w-full rounded-[1.1rem] border border-[#e6dbc9] bg-white p-6 shadow-[0_6px_18px_rgba(73,54,31,0.08)]">
      <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-textbrown/70">Step-by-Step Support</p>
      <h3 className="text-2xl font-bold mb-6 text-textbrown font-heading">
        Your Personalized Action Plan
      </h3>

      <div className="space-y-7">
        {plan.steps.map((step, index) => (
          <div key={index} className="relative pl-5 border-l-2 border-[#d9ccb9] last:border-0 pb-4">
            <div className="absolute -left-[18px] top-0 w-8 h-8 rounded-full bg-[#2b3848] text-white flex items-center justify-center font-bold text-sm border-2 border-white">
              {index + 1}
            </div>

            <div className="ml-4">
              <h4 className="text-[1.2rem] font-bold text-textbrown mb-2 flex items-center gap-2">
                {step.service_name}
              </h4>

              <p className="text-[1.02rem] mb-3 text-textbrown/90 leading-relaxed">{step.description}</p>

              <div className="space-y-2 mb-4 text-[0.96rem]">
                {step.phone && (
                  <div className="flex items-center gap-2">
                    <span className={pillClass}>Phone</span>
                    <a href={`tel:${step.phone}`} className="font-bold text-[#2b3848] hover:underline">
                      {step.phone}
                    </a>
                  </div>
                )}
                {step.address && (
                  <div className="flex items-start gap-2">
                    <span className={`${pillClass} mt-1`}>Address</span>
                    <span>{step.address}</span>
                  </div>
                )}
                {step.what_to_bring && (
                  <div className="flex items-start gap-2 bg-[#faf4e8] p-3 rounded-xl mt-2 border border-[#e2d4bf]">
                    <span className={`${pillClass} mt-0.5`}>Bring</span>
                    <div>
                      <span className="font-bold block text-sm text-textbrown/85">What to bring:</span>
                      <span>{step.what_to_bring}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {step.phone && onExecuteCall && (
                  <button 
                    onClick={() => onExecuteCall(step)}
                    className={`${primaryButtonClass} min-w-[140px] text-sm sm:text-base`}
                  >
                    Call for Me
                  </button>
                )}
                {step.email && onExecuteEmail && (
                  <button 
                    onClick={() => onExecuteEmail(step)}
                    className={`${secondaryButtonClass} min-w-[140px] text-sm sm:text-base`}
                  >
                    Email for Me
                  </button>
                )}
              </div>
            </div>

             {index < plan.steps.length - 1 && (
               <div className="w-full h-px bg-[#e3d5c0] mt-8 mb-4 opacity-70" />
             )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-[#e3d5c0] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
           <button
             onClick={() => setShowSms(!showSms)}
             className={primaryButtonClass}
           >
             Text This Plan to My Phone
           </button>

           <button
             onClick={handleDownload}
             className={`${secondaryButtonClass} text-[#2b3848]`}
           >
             Download Plan
           </button>

           <button
             onClick={() => window.print()}
             className={secondaryButtonClass}
           >
             Print Plan
           </button>
        </div>

        {showSms && (
          <SmsCard 
            onSend={(data) => onExecuteSms({ ...data, plan })} 
            message={`Here is your action plan: ${plan.steps.map(s => s.service_name).join(', ')}`}
          />
        )}
      </div>
    </div>
  );
}
