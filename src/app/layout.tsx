import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VIBE - Deep Work Sanctuary',
  description: 'AI-powered creative writing and productivity workspace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}