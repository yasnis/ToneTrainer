import type { Metadata } from 'next';
import { AppHeader } from '@tone-trainer/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Random Tone Trainer',
  description: 'フレットボードの音名を練習するためのツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full overflow-hidden">
      <body className="bg-background text-text h-full overflow-hidden flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}