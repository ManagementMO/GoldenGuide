import './globals.css';

export const metadata = {
  title: 'GoldenGuide — Your Kingston Services Assistant',
  description: 'AI-powered assistant helping Kingston seniors access municipal services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-floral">{children}</body>
    </html>
  );
}
