import React, { useState } from 'react';

export default function ServiceCard({ service, onCallForMe, onEmailForMe }) {
  const [saved, setSaved] = useState(false);

  if (!service) return null;

  const handleSaveToPlan = async () => {
    const details = [
      service.name,
      service.phone ? `Phone: ${service.phone}` : '',
      service.address ? `Address: ${service.address}` : '',
      service.how_to_apply ? `How to apply: ${service.how_to_apply}` : '',
    ].filter(Boolean).join('\n');
    try {
      await navigator.clipboard.writeText(details);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = details;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-cornsilk border border-[#F5DEB3] rounded-xl p-6 shadow-sm my-4 text-textbrown">
      <h3 className="text-xl md:text-2xl font-bold mb-2 font-heading">{service.name}</h3>
      
      <p className="mb-4 text-lg">{service.description}</p>
      
      <div className="space-y-3 mb-6">
        {service.phone && (
          <div className="flex items-center gap-2">
            <span className="text-xl">📞</span>
            <a href={`tel:${service.phone}`} className="text-xl font-bold text-accent hover:underline">
              {service.phone}
            </a>
          </div>
        )}
        
        {service.address && (
          <div className="flex items-start gap-2">
            <span className="text-xl mt-1">📍</span>
            <span className="text-lg">{service.address}</span>
          </div>
        )}
        
        {service.cost && (
           <div className="flex items-start gap-2">
             <span className="text-xl mt-1">💰</span>
             <span className="text-lg"><strong>Cost:</strong> {service.cost}</span>
           </div>
        )}
        
        {service.how_to_apply && (
           <div className="flex items-start gap-2">
             <span className="text-xl mt-1">📝</span>
             <span className="text-lg"><strong>How to apply:</strong> {service.how_to_apply}</span>
           </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {onCallForMe && (
          <button 
            onClick={() => onCallForMe(service)}
            className="flex-1 min-h-[48px] bg-golden text-white font-bold rounded-lg px-4 py-2 hover:bg-[#A67C00] transition-colors shadow-sm"
          >
            Call for Me
          </button>
        )}
        
        {onEmailForMe && (
          <button
            onClick={() => onEmailForMe(service)}
            className="flex-1 min-h-[48px] bg-white border-2 border-golden text-golden font-bold rounded-lg px-4 py-2 hover:bg-cornsilk transition-colors shadow-sm"
          >
            Email for Me
          </button>
        )}

        <button
          onClick={handleSaveToPlan}
          className={`flex-1 min-h-[48px] font-bold rounded-lg px-4 py-2 transition-colors shadow-sm ${
            saved ? 'bg-green-100 text-success border-2 border-success' : 'bg-white border-2 border-accent text-accent hover:bg-gray-50'
          }`}
        >
          {saved ? '✅ Saved!' : '📌 Save to Plan'}
        </button>
      </div>
    </div>
  );
}
