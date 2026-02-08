import React from 'react';
import {
  Building2,
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
          <div className="mb-1 mr-1.5 flex-shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#334155] text-white shadow-sm">
              <Building2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </div>
          </div>
          <div className="relative rounded-xl rounded-bl-sm border border-slate-200 bg-[#F8FAFC] p-2.5 text-[#334155] shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#64748B]">GoldenGuide is thinking</p>
            <div className="mt-1 flex gap-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: '0s' }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: '0.1s' }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 flex w-full justify-start animate-fade-in">
      <div className="flex max-w-[82%] flex-row items-end">
        <div className="mb-1 mr-1.5 flex-shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#334155] text-white shadow-sm">
            <Building2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </div>
        </div>
        <div className="relative min-w-[190px] rounded-xl rounded-bl-sm border border-slate-200 bg-[#F8FAFC] p-2.5 text-[#334155] shadow-sm">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#64748B]">GoldenGuide is working</p>
          <div className="space-y-1.5">
            {allTools.map((tool) => {
              const info = TOOL_DISPLAY[tool] || { label: tool, icon: Settings };
              const Icon = info.icon;
              const isActive = activeTools.includes(tool);
              const isDone = completedTools.includes(tool);
              return (
                <div key={tool} className="flex animate-fade-in items-center gap-1.5 text-xs">
                  <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {isDone ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> : <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />}
                  </span>
                  <span className={isDone ? 'font-semibold text-emerald-700' : 'text-[#334155]'}>{info.label}</span>
                  {isActive && !isDone && (
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-slate-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
