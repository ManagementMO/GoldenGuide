import React, { useState } from 'react';
import { BookmarkPlus, Check, ChevronRight, Mail, PhoneCall } from 'lucide-react';

export default function ServiceCard({ service, onCallForMe, onEmailForMe }) {
  const [saved, setSaved] = useState(false);

  if (!service) return null;

  const handleSaveToPlan = async () => {
    const details = [
      service.name,
      service.phone ? `Phone: ${service.phone}` : '',
      service.address ? `Address: ${service.address}` : '',
      service.how_to_apply ? `How to apply: ${service.how_to_apply}` : '',
    ]
      .filter(Boolean)
      .join('\n');

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
    <section className="my-1.5 rounded-2xl bg-white px-3.5 py-2.5 text-[#334155] shadow-sm transition-shadow hover:shadow-md">
      <header className="border-b border-slate-200 pb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Municipal Service Record</p>
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-[#334155]">{service.name}</h3>
        {service.description && <p className="mt-1.5 text-base leading-relaxed text-[#475569]">{service.description}</p>}
      </header>

      <dl className="mt-3 grid gap-2.5 text-base">
        {service.phone && (
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748B]">Phone</dt>
            <dd className="mt-1">
              <a href={`tel:${service.phone}`} className="font-semibold text-[#334155] underline decoration-slate-300 underline-offset-4">
                {service.phone}
              </a>
            </dd>
          </div>
        )}

        {service.address && (
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748B]">Address</dt>
            <dd className="mt-1 text-[#334155]">{service.address}</dd>
          </div>
        )}

        {service.cost && (
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748B]">Cost</dt>
            <dd className="mt-1 text-[#334155]">{service.cost}</dd>
          </div>
        )}

        {service.how_to_apply && (
          <div className="rounded-xl bg-slate-50 px-3 py-2.5">
            <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[#64748B]">How To Apply</dt>
            <dd className="mt-1 text-[#334155]">{service.how_to_apply}</dd>
          </div>
        )}
      </dl>

      <div className="mt-3 space-y-1.5">
        {onCallForMe && (
          <button
            onClick={() => onCallForMe(service)}
            className="group flex min-h-[56px] w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-left shadow-sm transition-all hover:shadow-md"
            aria-label={`Request call support for ${service.name}`}
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                <PhoneCall className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-semibold text-[#334155]">Call For Me</span>
                <span className="block text-sm text-[#64748B]">Prepare a supervised call request.</span>
              </span>
            </span>
            <ChevronRight className="h-5 w-5 text-[#64748B] transition-transform group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
          </button>
        )}

        {onEmailForMe && (
          <button
            onClick={() => onEmailForMe(service)}
            className="group flex min-h-[56px] w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-left shadow-sm transition-all hover:shadow-md"
            aria-label={`Request email support for ${service.name}`}
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                <Mail className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-semibold text-[#334155]">Email For Me</span>
                <span className="block text-sm text-[#64748B]">Draft and review before sending.</span>
              </span>
            </span>
            <ChevronRight className="h-5 w-5 text-[#64748B] transition-transform group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
          </button>
        )}

        <button
          onClick={handleSaveToPlan}
          className="group flex min-h-[56px] w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-left shadow-sm transition-all hover:shadow-md"
          aria-label={`Save ${service.name} details to clipboard`}
        >
          <span className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
              {saved ? <Check className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> : <BookmarkPlus className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
            </span>
            <span>
              <span className="block text-base font-semibold text-[#334155]">{saved ? 'Saved To Plan' : 'Save To Plan'}</span>
              <span className="block text-sm text-[#64748B]">Copy key service details for later use.</span>
            </span>
          </span>
          <ChevronRight className="h-5 w-5 text-[#64748B] transition-transform group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
