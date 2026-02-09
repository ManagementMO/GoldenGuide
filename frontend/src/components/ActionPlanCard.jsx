import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, MessageSquareText, PhoneCall, Printer } from 'lucide-react';
import SmsCard from './SmsCard';

export default function ActionPlanCard({ plan, onExecuteCall, onExecuteEmail, onExecuteSms }) {
  const [showSms, setShowSms] = useState(false);
  if (!plan || !plan.steps) return null;

  const handleDownload = () => {
    const textContent = `Your GoldenGuide Action Plan:\n\n` +
      plan.steps.map((step, i) => `${i+1}. ${step.service_name}\n${step.description}\n${step.phone || ''}\n${step.address || ''}\n`).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'GoldenGuide-ActionPlan.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="printable-action-plan" className="my-2 w-full glass-strong rounded-2xl p-5 golden-stripe glass-highlight">
      <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-golden font-heading">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-golden/20 text-golden badge-glow text-sm font-bold">
          {'🎯'}
        </span>
        Your Personalized Action Plan
      </h3>

      <div className="space-y-4">
        {plan.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
            className="relative glass rounded-2xl p-4 glass-highlight"
          >
            {index < plan.steps.length - 1 && (
              <div className="absolute -bottom-4 left-8 h-4 w-0.5 bg-gradient-to-b from-golden/40 to-transparent" />
            )}

            <div className="absolute -left-3 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-golden text-sm font-bold text-warm-950 badge-glow">
              {index + 1}
            </div>

            <div className="ml-4">
              <h4 className="mb-1.5 text-lg font-bold text-warm-50">{step.service_name}</h4>
              <p className="mb-3 text-base text-warm-100/60">{step.description}</p>

              <div className="mb-4 space-y-2 text-base">
                {step.phone && (
                  <div className="flex items-center gap-2 rounded-xl glass-subtle px-3 py-2">
                    <PhoneCall className="h-4 w-4 text-golden/70" strokeWidth={2} aria-hidden="true" />
                    <a href={`tel:${step.phone}`} className="font-bold text-golden hover:text-golden-glow transition-colors">{step.phone}</a>
                  </div>
                )}
                {step.address && (
                  <div className="flex items-start gap-2 rounded-xl glass-subtle px-3 py-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-warm-100/40" strokeWidth={2} aria-hidden="true" />
                    <span className="text-warm-50/70">{step.address}</span>
                  </div>
                )}
                {step.what_to_bring && (
                  <div className="mt-2 flex items-start gap-2 rounded-xl bg-golden/10 border border-golden/20 p-3">
                    <MessageSquareText className="mt-0.5 h-4 w-4 text-golden" strokeWidth={2} aria-hidden="true" />
                    <div>
                      <span className="block text-sm font-bold text-golden">What to bring:</span>
                      <span className="text-base text-warm-50/80">{step.what_to_bring}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {step.phone && onExecuteCall && (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onExecuteCall({ to_number: step.phone, purpose: step.description, service_name: step.service_name, message_script: `Hello, I am calling about ${step.service_name}. ${step.description}` })}
                    className="flex min-h-[48px] min-w-[130px] flex-1 items-center justify-center gap-2 btn-golden px-3 text-base">
                    <PhoneCall className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Call for Me
                  </motion.button>
                )}
                {step.email && onExecuteEmail && (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onExecuteEmail({ to_email: step.email, subject: `Inquiry about ${step.service_name}`, body_html: `<p>${step.description}</p>` })}
                    className="flex min-h-[48px] min-w-[130px] flex-1 items-center justify-center gap-2 btn-glass px-3 text-base">
                    <Mail className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Email for Me
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-white/5 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowSms(!showSms)}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 btn-golden px-4 text-base">
            <MessageSquareText className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Text This Plan
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleDownload}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 btn-glass px-4 text-base">
            <Download className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Download
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => window.print()}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 btn-glass px-4 text-base">
            <Printer className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Print
          </motion.button>
        </div>
        {showSms && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <SmsCard onSend={(data) => onExecuteSms(data)} message={`Your GoldenGuide Action Plan:\n${plan.steps.map((s, i) => `${i + 1}. ${s.service_name} - ${s.description}`).join('\n')}`} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
