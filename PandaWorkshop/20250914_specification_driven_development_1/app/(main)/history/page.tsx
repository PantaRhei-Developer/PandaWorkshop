'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getUserWeeklyMenus, getWeeklyMenu, deleteWeeklyMenu } from '@/lib/firebase/firestore';
import type { WeeklyMenu, Recipe } from '@/types';

interface HistoryItem {
  id: string;
  generatedAt: Date;
  usedIngredients: { id: string; name: string }[];
  recipePreviews: { day: string; recipeName: string; imageUrl?: string }[];
  userActions: {
    isFavorite: boolean;
    regenerationCount: number;
    lastAccessedAt?: Date;
  };
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('すべて');
  const [ingredientFilter, setIngredientFilter] = useState('すべて');
  const [sortOrder, setSortOrder] = useState('新しい順');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 🚧 開発用：認証無効化中のため、ユーザーデータをモック
  // const { user } = useAuth();
  const router = useRouter();

  // Load history data (mock)
  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      // モック履歴データ
      const mockMenus = [
        {
          id: 'mock-1',
          generatedAt: { toDate: () => new Date('2024-01-15') },
          usedIngredients: ['chicken', 'vegetables', 'rice'],
          dailyRecipes: {
            monday: 'recipe-1',
            tuesday: 'recipe-2',
            wednesday: 'recipe-3',
            thursday: 'recipe-4',
            friday: 'recipe-5',
            saturday: 'recipe-6',
            sunday: 'recipe-7',
          },
          userActions: {
            isFavorite: false,
            regenerationCount: 1,
            lastAccessedAt: { toDate: () => new Date('2024-01-15') },
          },
        },
        {
          id: 'mock-2',
          generatedAt: { toDate: () => new Date('2024-01-10') },
          usedIngredients: ['fish', 'potatoes'],
          dailyRecipes: {
            monday: 'recipe-8',
            tuesday: 'recipe-9',
            wednesday: 'recipe-10',
            thursday: 'recipe-11',
            friday: 'recipe-12',
            saturday: 'recipe-13',
            sunday: 'recipe-14',
          },
          userActions: {
            isFavorite: true,
            regenerationCount: 2,
            lastAccessedAt: { toDate: () => new Date('2024-01-10') },
          },
        },
      ];
      
      // const { menus } = await getUserWeeklyMenus(user.uid, 20);
      
      // Transform mock data for display  
      const items: HistoryItem[] = mockMenus.map(menu => ({
        id: menu.id,
        generatedAt: menu.generatedAt.toDate(),
        usedIngredients: menu.usedIngredients.map(id => ({ 
          id, 
          name: id === 'chicken' ? '鶏肉' : id === 'vegetables' ? '野菜' : id === 'fish' ? '魚' : id === 'rice' ? 'ご飯' : id === 'potatoes' ? 'じゃがいも' : '食材' 
        })),
        recipePreviews: Object.entries(menu.dailyRecipes).map(([day, recipeId]) => ({
          day,
          recipeName: '作り置きレシピ',
          imageUrl: undefined,
        })),
        userActions: {
          isFavorite: menu.userActions.isFavorite,
          regenerationCount: menu.userActions.regenerationCount,
          lastAccessedAt: menu.userActions.lastAccessedAt?.toDate(),
        },
      }));

      setHistoryItems(items);
    } catch (error) {
      console.error('Failed to load history:', error);
      setError('履歴の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRegenerate = async (historyId: string) => {
    try {
      // 🚧 開発用：モック履歴から材料を取得
      const mockMenu = historyItems.find(item => item.id === historyId);
      if (!mockMenu) return;

      const ingredients = mockMenu.usedIngredients.map(ing => ing.id).join(',');
      router.push(`/recipe?ingredients=${ingredients}&regenerate=${historyId}`);
    } catch (error) {
      console.error('Failed to regenerate:', error);
      setError('再生成に失敗しました');
    }
  };

  const handleDelete = async (historyId: string) => {
    if (!confirm('この履歴を削除してもよろしいですか？')) return;

    try {
      // 🚧 開発用：モック削除処理
      setHistoryItems(prev => prev.filter(item => item.id !== historyId));
      console.log('🚧 開発用：履歴削除をシミュレート', historyId);
    } catch (error) {
      console.error('Failed to delete history:', error);
      setError('履歴の削除に失敗しました');
    }
  };

  const handleViewDetail = async (historyId: string) => {
    // Open detail modal or navigate to detail page
    console.log('View detail:', historyId);
  };

  const handleDeleteAll = async () => {
    if (!confirm('すべての履歴を削除してもよろしいですか？')) return;
    
    try {
      // 🚧 開発用：モック一括削除処理
      setHistoryItems([]);
      console.log('🚧 開発用：全履歴削除をシミュレート');
    } catch (error) {
      console.error('Failed to delete all history:', error);
      setError('履歴の一括削除に失敗しました');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="body-base text-gray-500">履歴を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          variant="auth"
          title="作り置き履歴"
          backButton={{ label: 'レシピ画面へ', href: '/recipe' }}
        />

        {/* Search and Filter Section */}
        <section className="bg-gray-50 border-b border-gray-200 p-5">
          <div className="container-responsive">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="レシピ名や食材で検索"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-full"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="すべて">すべて</option>
                  <option value="今日">今日</option>
                  <option value="1週間">1週間</option>
                  <option value="1ヶ月">1ヶ月</option>
                </select>

                <select
                  value={ingredientFilter}
                  onChange={(e) => setIngredientFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="すべて">すべて</option>
                  <option value="肉類">肉類</option>
                  <option value="魚類">魚類</option>
                  <option value="野菜">野菜</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="新しい順">新しい順</option>
                  <option value="古い順">古い順</option>
                  <option value="よく使う順">よく使う順</option>
                </select>
              </div>

              {/* Delete All Button */}
              <Button
                variant="secondary"
                onClick={handleDeleteAll}
                className="text-sm text-red-600 border-red-300 hover:bg-red-50"
              >
                すべて削除
              </Button>
            </div>
          </div>
        </section>

        {/* History List */}
        <main className="container-responsive section-padding">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          {historyItems.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="heading-3 mb-2">まだ履歴がありません</h3>
              <p className="body-base text-gray-600 mb-6">
                レシピを生成して履歴を作りましょう
              </p>
              <Button onClick={() => router.push('/recipe')}>
                レシピを作る
              </Button>
            </div>
          ) : (
            /* History Items */
            <div className="space-y-0">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border-b border-gray-100 p-5 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-5">
                    {/* Date */}
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="text-lg font-bold text-primary-main">
                        {formatDate(item.generatedAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(item.generatedAt)}
                      </div>
                    </div>

                    {/* Used Ingredients */}
                    <div className="flex-shrink-0 w-50">
                      <div className="caption text-gray-500 mb-1">使用食材</div>
                      <div className="flex flex-wrap gap-1">
                        {item.usedIngredients.slice(0, 3).map((ingredient, index) => (
                          <span
                            key={ingredient.id}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            {ingredient.name}
                          </span>
                        ))}
                        {item.usedIngredients.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            +{item.usedIngredients.length - 3}個
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Recipe Previews */}
                    <div className="flex-1">
                      <div className="caption text-gray-500 mb-1">今週のレシピ</div>
                      <div className="flex gap-1">
                        {item.recipePreviews.slice(0, 7).map((recipe, index) => (
                          <div
                            key={`${recipe.day}-${index}`}
                            className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
                          >
                            <span className="text-xs">🍽️</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      <Button
                        onClick={() => handleRegenerate(item.id)}
                        className="w-25 h-8 text-xs"
                      >
                        再生成
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleViewDetail(item.id)}
                        className="w-25 h-8 text-xs"
                      >
                        詳細
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
