import React, { useState } from 'react';

function ActionGlyph({ type }) {
  switch (type) {
    case 'call':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <path d="M6.1 5.8c.2-.5.7-.8 1.2-.8h2.2c.6 0 1.1.4 1.2 1l.5 2.8c.1.5-.1 1-.5 1.2l-1.5.9a13.7 13.7 0 0 0 4.8 4.8l.9-1.5c.3-.4.8-.6 1.3-.5l2.7.5c.6.1 1 .6 1 1.2v2.2c0 .6-.4 1.1-.9 1.2-1.1.2-2.2.3-3.2.2a14.6 14.6 0 0 1-10-10c-.1-1.1 0-2.2.3-3.2z" />
        </svg>
      );
    case 'email':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <rect x="4.2" y="5.5" width="15.6" height="13" rx="2.3" />
          <path d="m5 7 7 5.4L19 7" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <path d="M7 4.8h10a2 2 0 0 1 2 2v12.4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6.8a2 2 0 0 1 2-2z" />
          <path d="M8.8 9.2h6.6M8.8 12.1h6.6M8.8 15h4.2" />
        </svg>
      );
  }
}

function DetailRow({ label, value, link }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-3 px-4 py-3 md:grid-cols-[140px_1fr] md:px-5">
      <p className="text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#5f768c]">
        {label}
      </p>
      {link ? (
        <a href={link} className="text-base font-medium text-[#1f3a51] underline-offset-2 hover:underline">
          {value}
        </a>
      ) : (
        <p className="text-base leading-relaxed text-[#304d66]">{value}</p>
      )}
    </div>
  );
}

function ActionRow({ type, title, subtitle, onClick, emphasized = false }) {
  const rowClass = emphasized
    ? 'group flex w-full min-h-[64px] items-center justify-between rounded-2xl border border-[#afc2d4] bg-[#eaf2fa] px-4 py-3 text-left transition-colors hover:bg-[#e1ecf7]'
    : 'group flex w-full min-h-[64px] items-center justify-between rounded-2xl border border-[#c8d5e2] bg-white px-4 py-3 text-left transition-colors hover:bg-[#f5f9fd]';
  return (
    <button onClick={onClick} className={rowClass}>
      <span className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#c3d0de] bg-[#f4f8fc] text-[#2b4b65]">
          <ActionGlyph type={type} />
        </span>
        <span>
          <span className="block text-base font-semibold text-[#1f3a51]">{title}</span>
          <span className="block text-[0.86rem] text-[#5a7288]">{subtitle}</span>
        </span>
      </span>
      <span className="text-xl text-[#6c8299] transition-transform group-hover:translate-x-0.5" aria-hidden="true">
        →
      </span>
    </button>
  );
}

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

  const metadataRows = [
    { label: 'Phone', value: service.phone, link: service.phone ? `tel:${service.phone}` : '' },
    { label: 'Address', value: service.address },
    { label: 'Cost', value: service.cost },
    { label: 'Application', value: service.how_to_apply },
  ].filter((item) => item.value);

  return (
    <div className="my-5 rounded-3xl border border-[#c7d4e1] bg-white p-7 text-[#233b50] shadow-[0_18px_30px_rgba(47,73,96,0.09)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#5c7388]">
            Verified Service Listing
          </p>
          <h3 className="mt-1 text-[1.35rem] font-semibold leading-tight text-[#1f3549] font-sans md:text-[1.55rem]">
            {service.name}
          </h3>
        </div>
        <span className="rounded-xl border border-[#bdd0df] bg-[#f5f9fd] px-3 py-2 text-[0.74rem] font-semibold uppercase tracking-[0.13em] text-[#3a5871]">
          City Directory
        </span>
      </div>

      {service.description && (
        <p className="mt-4 text-[1rem] leading-relaxed text-[#344f66]">{service.description}</p>
      )}

      {metadataRows.length > 0 && (
        <div className="mt-6 divide-y divide-[#d8e3ed] rounded-2xl border border-[#cddae7] bg-[#f8fbff]">
          {metadataRows.map((item) => (
            <DetailRow key={item.label} label={item.label} value={item.value} link={item.link} />
          ))}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {onCallForMe && (
          <ActionRow
            type="call"
            title="Request Assisted Call"
            subtitle="GoldenGuide will prepare and place this call for review."
            onClick={() => onCallForMe(service)}
            emphasized
          />
        )}

        {onEmailForMe && (
          <ActionRow
            type="email"
            title="Prepare Email Draft"
            subtitle="Generate an official message you can approve first."
            onClick={() => onEmailForMe(service)}
          />
        )}

        <ActionRow
          type="save"
          title={saved ? 'Saved to Plan' : 'Save Service Notes'}
          subtitle={saved ? 'Details copied to clipboard for your records.' : 'Copy this listing for your case notes or caregiver.'}
          onClick={handleSaveToPlan}
        />
      </div>
    </div>
  );
}
