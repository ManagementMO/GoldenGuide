import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Download } from 'lucide-react';
import { downloadReminder } from '../lib/api';

export default function ReminderCard({ reminder }) {
  if (!reminder) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return dateStr; }
  };

  const handleDownload = () => {
    downloadReminder({ title: reminder.title, date: reminder.date, time: reminder.time || '', description: reminder.description || '' });
  };

  return (
    <div className="my-2 glass-strong rounded-2xl p-5 glass-highlight">
      <h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-golden font-heading">
        <CalendarDays className="h-6 w-6" strokeWidth={2} aria-hidden="true" /> Reminder Set
      </h3>

      <div className="mb-4 space-y-2 glass rounded-xl p-4">
        <p className="text-lg font-bold text-warm-50">{reminder.title}</p>
        {reminder.date && <p className="text-base"><span className="font-bold text-golden">Date:</span> <span className="text-warm-50/70">{formatDate(reminder.date)}</span></p>}
        {reminder.time && <p className="text-base"><span className="font-bold text-golden">Time:</span> <span className="text-warm-50/70">{reminder.time}</span></p>}
        {reminder.description && <p className="text-base text-warm-100/60">{reminder.description}</p>}
      </div>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={handleDownload}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 btn-golden px-4 text-base">
        <Download className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> Download Calendar File (.ics)
      </motion.button>
    </div>
  );
}
