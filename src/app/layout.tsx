import { StoryBiblePanel } from '@/components/StoryBiblePanel';
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
      <body className="bg-[#05050a] text-white min-h-screen">
        {children}
        <StoryBiblePanel />
      </body>
    </html>
  );
}