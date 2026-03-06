import './globals.css';

export const metadata = {
  title: 'VIBE - Deep Work Sanctuary',
  description: 'AI-powered creative workspace.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">{children}</body>
    </html>
  );
}