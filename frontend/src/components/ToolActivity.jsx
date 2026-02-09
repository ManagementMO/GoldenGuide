import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe,
  ListChecks,
  Mail,
  MessageSquare,
  PhoneCall,
  Route,
  Search,
  Settings,
} from 'lucide-react';
import OrbIcon from './OrbIcon';

const TOOL_DISPLAY = {
  search_services: { label: 'Searching services', icon: Search },
  check_eligibility: { label: 'Checking eligibility', icon: CheckCircle2 },
  get_transit_info: { label: 'Looking up transit', icon: Route },
  generate_action_plan: { label: 'Building action plan', icon: ListChecks },
  draft_communication: { label: 'Drafting message', icon: Mail },
  create_reminder: { label: 'Creating reminder', icon: CalendarDays },
  explain_document: { label: 'Reading document', icon: FileText },
  web_search: { label: 'Searching the web', icon: Globe },
  place_call: { label: 'Preparing call', icon: PhoneCall },
  send_email: { label: 'Preparing email', icon: Mail },
  send_sms: { label: 'Preparing text', icon: MessageSquare },
};

export default function ToolActivity({ activeTools = [], completedTools = [] }) {
  const allTools = [...new Set([...completedTools, ...activeTools])];

  if (allTools.length === 0) {
    return (
      <div className="mb-3 flex w-full justify-start animate-fade-in">
        <div className="flex max-w-[82%] flex-row items-end">
          <div className="mb-1 mr-2 flex-shrink-0">
            <OrbIcon mode="thinking" animated size={32} />
          </div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="relative glass glass-highlight rounded-2xl rounded-bl-sm p-3">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">Goldie is thinking</p>
            <div className="mt-1 flex gap-1.5">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                className="h-2 w-2 rounded-full bg-golden" />
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.12 }}
                className="h-2 w-2 rounded-full bg-golden" />
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.24 }}
                className="h-2 w-2 rounded-full bg-golden" />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 flex w-full justify-start animate-fade-in">
      <div className="flex max-w-[82%] flex-row items-end">
        <div className="mb-1 mr-2 flex-shrink-0">
          <OrbIcon mode="thinking" animated size={32} />
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="relative min-w-[200px] glass glass-highlight rounded-2xl rounded-bl-sm p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-warm-100/40">Goldie is working</p>
          <div className="space-y-2">
            {allTools.map((tool, index) => {
              const info = TOOL_DISPLAY[tool] || { label: tool, icon: Settings };
              const Icon = info.icon;
              const isActive = activeTools.includes(tool);
              const isDone = completedTools.includes(tool);
              return (
                <motion.div key={tool}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="flex items-center gap-2 text-sm">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${isDone ? 'bg-success/20 text-success' : 'glass-subtle text-warm-100/50'}`}>
                    {isDone ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> : <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />}
                  </span>
                  <span className={isDone ? 'font-bold text-success' : 'text-warm-50/70'}>{info.label}</span>
                  {isActive && !isDone && (
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }}
                      className="inline-block h-1.5 w-1.5 rounded-full bg-golden" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
