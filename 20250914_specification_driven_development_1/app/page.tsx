'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

export default function WelcomePage() {
  // 🚧 開発用：認証チェック無効化
  // const { user, loading } = useAuth();
  const router = useRouter();

  /* バックエンド実装後に有効化
  // Redirect authenticated users to recipe page
  useEffect(() => {
    if (!loading && user) {
      router.push('/recipe');
    }
  }, [user, loading, router]);

  // Don't render if user is authenticated (will redirect)
  if (user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="body-base text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }
  */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full h-20 bg-primary-main flex items-center justify-between px-5">
        <Link href="/" className="text-4xl font-bold text-white">
          Go Recipi!
        </Link>
        <Link 
          href="/login" 
          className="bg-white text-primary-main px-6 py-2 rounded hover:bg-gray-50 transition-colors duration-200"
        >
          ログイン
        </Link>
      </header>

      {/* Main Content */}
      <main className="container-responsive section-padding">
        {/* Catch Copy Section */}
        <div className="text-center mb-16">
          <h1 className="heading-1 mb-5">
            Go Recipi!
          </h1>
          <p className="heading-3 font-normal text-gray-700">
            冷蔵庫の食材で、1週間の作り置きレシピを提案
          </p>
        </div>

        {/* Description Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="body-base text-gray-600 leading-relaxed">
            冷蔵庫にある食材を選ぶだけで、栄養バランスの取れた作り置きレシピを1週間分提案します。
            忙しいあなたの毎日を、美味しい手作りお弁当でサポートします。
          </p>
        </div>

        {/* Feature Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-primary-bg rounded-full flex items-center justify-center">
              <span className="text-3xl">🥗</span>
            </div>
            <h3 className="heading-3 mb-2">簡単食材選択</h3>
            <p className="body-small text-gray-600">
              カテゴリーから食材を選ぶだけ。複数選択で多様なレシピを生成できます。
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-primary-bg rounded-full flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="heading-3 mb-2">作り置き最適化</h3>
            <p className="body-small text-gray-600">
              保存期間や温め直し方法も考慮した、作り置きに最適なレシピを提案します。
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-primary-bg rounded-full flex items-center justify-center">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="heading-3 mb-2">1週間分提案</h3>
            <p className="body-small text-gray-600">
              月曜日から日曜日まで、栄養バランスを考慮した1週間分のメニューを一度に生成。
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/login">
            <Button 
              size="large"
              className="w-70 h-15 text-lg"
            >
              無料で始める
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
