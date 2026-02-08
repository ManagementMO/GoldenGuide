import React from 'react';
import { CalendarDays, Download } from 'lucide-react';
import { downloadReminder } from '../lib/api';

export default function ReminderCard({ reminder }) {
  if (!reminder) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-CA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleDownload = () => {
    downloadReminder({
      title: reminder.title,
      date: reminder.date,
      time: reminder.time || '',
      description: reminder.description || '',
    });
  };

  return (
    <div className="my-2 rounded-2xl border border-slate-200 bg-white p-4 text-[#334155] shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-xl font-bold">
        <CalendarDays className="h-6 w-6 text-[#475569]" strokeWidth={2} aria-hidden="true" />
        Reminder Set
      </h3>

      <div className="mb-4 space-y-2 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
        <p className="text-lg font-semibold text-[#1e293b]">{reminder.title}</p>
        {reminder.date && (
          <p className="text-base">
            <span className="font-semibold">Date:</span> {formatDate(reminder.date)}
          </p>
        )}
        {reminder.time && (
          <p className="text-base">
            <span className="font-semibold">Time:</span> {reminder.time}
          </p>
        )}
        {reminder.description && (
          <p className="text-base text-[#475569]">{reminder.description}</p>
        )}
      </div>

      <button
        onClick={handleDownload}
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#334155] px-4 text-base font-semibold text-white transition-colors hover:bg-[#1e293b]"
      >
        <Download className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        Download Calendar File (.ics)
      </button>
    </div>
  );
}
