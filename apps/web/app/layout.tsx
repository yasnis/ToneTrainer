import type { Metadata } from 'next';
import { AppHeader } from '@tone-trainer/ui';
import './globals.css';
import GoogleAnalytics from './components/GoogleAnalytics';
import { Baloo_2 } from 'next/font/google';

// Baloo 2フォントを読み込む
const baloo2 = Baloo_2({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'], // 300を削除し、利用可能なウェイトのみを指定
  variable: '--font-baloo-2',
});

export const metadata: Metadata = {
  title: 'Tone Trainer',
  description: 'フレットボードの音名を練習するためのツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`h-full overflow-hidden ${baloo2.variable}`}>
      <head>
        {/* Google Analytics コンポーネントを追加 */}
        <GoogleAnalytics />
      </head>
      <body className="bg-background text-text h-full overflow-hidden">
        <div className="relative h-full">
          {/* メインコンテンツを画面全体に広げる */}
          <main className="h-full overflow-hidden">
            {children}
          </main>
          
          {/* ヘッダーをメインコンテンツの上に重ねる（絶対配置） */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <AppHeader />
          </div>
        </div>
      </body>
    </html>
  );
}