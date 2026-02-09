import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookmarkPlus, Check, ChevronRight, Mail, PhoneCall } from 'lucide-react';

export default function ServiceCard({ service, onCallForMe, onEmailForMe }) {
  const [saved, setSaved] = useState(false);
  if (!service) return null;

  const handleSaveToPlan = async () => {
    const details = [service.name, service.phone ? `Phone: ${service.phone}` : '', service.address ? `Address: ${service.address}` : '', service.how_to_apply ? `How to apply: ${service.how_to_apply}` : ''].filter(Boolean).join('\n');
    try { await navigator.clipboard.writeText(details); } catch { const ta = document.createElement('textarea'); ta.value = details; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section className="my-2 glass rounded-2xl p-4 glass-highlight card-3d">
      <header className="border-b border-white/5 pb-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-warm-100/40">Municipal Service</p>
        <h3 className="mt-1.5 text-lg font-bold tracking-tight text-warm-50 font-heading">{service.name}</h3>
        {service.description && <p className="mt-1.5 text-base leading-relaxed text-warm-100/60">{service.description}</p>}
      </header>

      <dl className="mt-3 grid gap-2 text-base">
        {service.phone && (
          <div className="rounded-xl glass-subtle px-3 py-2.5">
            <dt className="text-xs font-bold uppercase tracking-[0.1em] text-warm-100/40">Phone</dt>
            <dd className="mt-1"><a href={`tel:${service.phone}`} className="font-bold text-golden hover:text-golden-glow transition-colors">{service.phone}</a></dd>
          </div>
        )}
        {service.address && (
          <div className="rounded-xl glass-subtle px-3 py-2.5">
            <dt className="text-xs font-bold uppercase tracking-[0.1em] text-warm-100/40">Address</dt>
            <dd className="mt-1 text-warm-50/70">{service.address}</dd>
          </div>
        )}
        {service.cost && (
          <div className="rounded-xl glass-subtle px-3 py-2.5">
            <dt className="text-xs font-bold uppercase tracking-[0.1em] text-warm-100/40">Cost</dt>
            <dd className="mt-1 text-warm-50/70">{service.cost}</dd>
          </div>
        )}
        {service.how_to_apply && (
          <div className="rounded-xl glass-subtle px-3 py-2.5">
            <dt className="text-xs font-bold uppercase tracking-[0.1em] text-warm-100/40">How To Apply</dt>
            <dd className="mt-1 text-warm-50/70">{service.how_to_apply}</dd>
          </div>
        )}
      </dl>

      <div className="mt-3 space-y-1.5">
        {[
          onCallForMe && { icon: PhoneCall, label: 'Call For Me', sub: 'Prepare a supervised call request.', onClick: () => onCallForMe(service) },
          onEmailForMe && { icon: Mail, label: 'Email For Me', sub: 'Draft and review before sending.', onClick: () => onEmailForMe(service) },
          { icon: saved ? Check : BookmarkPlus, label: saved ? 'Saved To Plan' : 'Save To Plan', sub: 'Copy key service details for later use.', onClick: handleSaveToPlan },
        ].filter(Boolean).map((action, i) => (
          <motion.button key={i} whileHover={{ scale: 1.01, x: 3 }} whileTap={{ scale: 0.99 }}
            onClick={action.onClick}
            className="group flex min-h-[52px] w-full items-center justify-between rounded-xl glass-subtle px-3 py-2 text-left transition-all hover:bg-white/[0.06]"
            aria-label={action.label}>
            <span className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-warm-100/50 transition-colors group-hover:bg-golden/15 group-hover:text-golden">
                <action.icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-base font-bold text-warm-50/80">{action.label}</span>
                <span className="block text-sm text-warm-100/40">{action.sub}</span>
              </span>
            </span>
            <ChevronRight className="h-5 w-5 text-warm-100/20 transition-all group-hover:translate-x-1 group-hover:text-golden/60" strokeWidth={2} aria-hidden="true" />
          </motion.button>
        ))}
      </div>
    </section>
  );
}
