import type { Metadata } from 'next';
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
  description: 'Welcome to Tone Trainer! Break free from fixed note orders — random prompts train real-time fretboard recall. 指板をいつもの順番で覚える癖をリセット。ランダムな音名提示で本当の記憶を鍛えましょう。',
  manifest: '/tonetrainer/manifest.json',
  themeColor: '#4f46e5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tone Trainer',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
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
          <main className="h-full overflow-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}