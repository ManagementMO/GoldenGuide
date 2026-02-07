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

  return (
    <div id="printable-action-plan" className="bg-white border-2 border-golden rounded-xl p-6 shadow-md my-4 w-full">
      <h3 className="text-2xl font-bold mb-6 text-textbrown font-heading flex items-center gap-2">
        <span>🎯</span> Your Personalized Action Plan
      </h3>

      <div className="space-y-8">
        {plan.steps.map((step, index) => (
          <div key={index} className="relative pl-4 border-l-2 border-[#F5DEB3] last:border-0 pb-4">
            <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-golden text-white flex items-center justify-center font-bold text-lg border-4 border-white">
              {index + 1}
            </div>
            
            <div className="ml-4">
              <h4 className="text-xl font-bold text-textbrown mb-2 flex items-center gap-2">
                {step.icon && <span>{step.icon}</span>}
                {step.service_name}
              </h4>
              
              <p className="text-lg mb-3 text-textbrown/90">{step.description}</p>
              
              <div className="space-y-2 mb-4 text-base">
                {step.phone && (
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <a href={`tel:${step.phone}`} className="font-bold text-accent hover:underline">
                      {step.phone}
                    </a>
                  </div>
                )}
                {step.address && (
                  <div className="flex items-start gap-2">
                    <span>📍</span>
                    <span>{step.address}</span>
                  </div>
                )}
                {step.what_to_bring && (
                  <div className="flex items-start gap-2 bg-cornsilk p-3 rounded-lg mt-2">
                    <span>🎒</span>
                    <div>
                      <span className="font-bold block text-sm">What to bring:</span>
                      <span>{step.what_to_bring}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {step.phone && onExecuteCall && (
                  <button 
                    onClick={() => onExecuteCall(step)}
                    className="flex-1 min-w-[140px] min-h-[48px] bg-golden text-white font-bold rounded-lg px-4 py-2 hover:bg-[#A67C00] transition-colors shadow-sm text-sm sm:text-base"
                  >
                    Call for Me
                  </button>
                )}
                {step.email && onExecuteEmail && (
                  <button 
                    onClick={() => onExecuteEmail(step)}
                    className="flex-1 min-w-[140px] min-h-[48px] bg-white border-2 border-golden text-golden font-bold rounded-lg px-4 py-2 hover:bg-cornsilk transition-colors shadow-sm text-sm sm:text-base"
                  >
                    Email for Me
                  </button>
                )}
              </div>
            </div>
             
             {index < plan.steps.length - 1 && (
               <div className="w-full h-px bg-[#F5DEB3] mt-8 mb-4 opacity-50" />
             )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t-2 border-[#F5DEB3] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
           <button
             onClick={() => setShowSms(!showSms)}
             className="flex-1 min-h-[48px] bg-accent text-white font-bold rounded-lg px-6 py-3 hover:bg-[#6d360f] transition-colors shadow-sm"
           >
             📱 Text This Plan to My Phone
           </button>
           
           <button
             onClick={handleDownload}
             className="flex-1 min-h-[48px] bg-white border-2 border-accent text-accent font-bold rounded-lg px-6 py-3 hover:bg-gray-50 transition-colors shadow-sm"
           >
             ⬇️ Download Plan
           </button>

           <button
             onClick={() => window.print()}
             className="flex-1 min-h-[48px] bg-white border-2 border-golden text-golden font-bold rounded-lg px-6 py-3 hover:bg-cornsilk transition-colors shadow-sm"
           >
             🖨️ Print Plan
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
