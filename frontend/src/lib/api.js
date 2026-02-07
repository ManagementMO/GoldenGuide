const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function sendChat(message, history) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  return res.json();
}

export async function sendChatWithImage(message, history, imageFile) {
  const formData = new FormData();
  formData.append('message', message);
  formData.append('history', JSON.stringify(history));
  formData.append('image', imageFile);
  const res = await fetch(`${API_URL}/api/chat/image`, { method: 'POST', body: formData });
  return res.json();
}

export async function executeEmail(data) {
  const res = await fetch(`${API_URL}/api/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function executeSms(data) {
  const res = await fetch(`${API_URL}/api/sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function executeCall(data) {
  const res = await fetch(`${API_URL}/api/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getTts(text) {
  const res = await fetch(`${API_URL}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `text=${encodeURIComponent(text)}`,
  });
  return res.blob();
}

export async function downloadReminder(data) {
  const res = await fetch(`${API_URL}/api/reminder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'goldenguide-reminder.ics';
  a.click();
  URL.revokeObjectURL(url);
}
