import './globals.css';

export const metadata = {
  title: 'GoldenGuide — Your Kingston Services Assistant',
  description: 'AI-powered assistant helping Kingston seniors access municipal services with dignity and ease.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'GoldenGuide',
    description: 'AI assistant helping Kingston seniors navigate municipal services',
    locale: 'en_CA',
    siteName: 'GoldenGuide',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-floral">{children}</body>
    </html>
  );
}
