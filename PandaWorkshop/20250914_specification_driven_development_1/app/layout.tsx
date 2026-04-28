import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Go Recipi! - お弁当の献立を考えてくれるアプリ',
  description: '冷蔵庫の食材から1週間分の作り置きレシピを提案するアプリケーションです。',
  keywords: 'レシピ, 作り置き, お弁当, 献立, 食材',
  authors: [{ name: 'Go Recipi!' }],
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
