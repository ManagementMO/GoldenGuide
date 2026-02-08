import React from 'react';
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
    <div className="bg-cornsilk border-2 border-golden rounded-xl p-6 shadow-md my-4 text-textbrown">
      <h3 className="text-2xl font-bold mb-4 font-heading flex items-center gap-2">
        <span role="img" aria-label="Calendar">📅</span>
        Reminder Set
      </h3>

      <div className="bg-white border border-[#F5DEB3] rounded-xl p-4 mb-4 space-y-2">
        <p className="text-xl font-bold">{reminder.title}</p>
        {reminder.date && (
          <p className="text-lg">
            <span className="font-bold">Date:</span> {formatDate(reminder.date)}
          </p>
        )}
        {reminder.time && (
          <p className="text-lg">
            <span className="font-bold">Time:</span> {reminder.time}
          </p>
        )}
        {reminder.description && (
          <p className="text-lg text-textbrown/80">{reminder.description}</p>
        )}
      </div>

      <button
        onClick={handleDownload}
        className="w-full min-h-[48px] bg-golden text-white font-bold rounded-lg px-6 py-3 hover:bg-[#A67C00] transition-colors shadow-sm text-lg"
      >
        Download Calendar File (.ics)
      </button>
    </div>
  );
}
