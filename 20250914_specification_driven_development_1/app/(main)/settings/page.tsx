'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AuthGuard from '@/components/auth/AuthGuard';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useUser } from '@/hooks/useUser';
import { updateUserProfile } from '@/lib/firebase/firestore';
import type { UserProfile, NotificationSettings } from '@/types';

type TabType = 'profile' | 'ingredients' | 'recipe' | 'notifications';

interface SettingsForm {
  displayName: string;
  allergies: string[];
  dislikedIngredients: string[];
  likedIngredients: string[];
  cookingTimePreference: number;
  spiceLevel: 'mild' | 'normal' | 'spicy' | 'extra_spicy';
  calorieTarget: number;
  storageDay: 3 | 5 | 7;
  pushEnabled: boolean;
  pushNewRecipe: boolean;
  pushWeeklyRecipe: boolean;
  pushUpdates: boolean;
  pushTimeStart: string;
  pushTimeEnd: string;
  emailEnabled: boolean;
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  // 🚧 開発用：認証無効化中のため、ユーザーデータをモック
  // const { user, mutate } = useUser();
  const mockUser = {
    displayName: 'テストユーザー',
    email: 'test@example.com',
    profile: {
      allergies: [],
      dislikedIngredients: [],
      likedIngredients: [],
      cookingTimePreference: 30,
      spiceLevel: 'normal' as const,
      calorieTarget: 500,
      storageDay: 5 as const,
    },
    notifications: {
      push: {
        enabled: true,
        newRecipe: true,
        weeklyRecipe: true,
        updates: false,
        timeRange: { start: '09:00', end: '21:00' },
      },
      email: {
        enabled: false,
        frequency: 'weekly' as const,
      },
    },
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<SettingsForm>();

  // Initialize form with mock user data
  useEffect(() => {
    setValue('displayName', mockUser.displayName);
    setValue('allergies', mockUser.profile.allergies);
    setValue('dislikedIngredients', mockUser.profile.dislikedIngredients);
    setValue('likedIngredients', mockUser.profile.likedIngredients);
    setValue('cookingTimePreference', mockUser.profile.cookingTimePreference);
    setValue('spiceLevel', mockUser.profile.spiceLevel);
    setValue('calorieTarget', mockUser.profile.calorieTarget);
    setValue('storageDay', mockUser.profile.storageDay);
    setValue('pushEnabled', mockUser.notifications.push.enabled);
    setValue('pushNewRecipe', mockUser.notifications.push.newRecipe);
    setValue('pushWeeklyRecipe', mockUser.notifications.push.weeklyRecipe);
    setValue('pushUpdates', mockUser.notifications.push.updates);
    setValue('pushTimeStart', mockUser.notifications.push.timeRange.start);
    setValue('pushTimeEnd', mockUser.notifications.push.timeRange.end);
    setValue('emailEnabled', mockUser.notifications.email.enabled);
    setValue('emailFrequency', mockUser.notifications.email.frequency);
  }, [setValue]);

  const onSubmit = async (data: SettingsForm) => {
    // 🚧 開発用：実際の保存処理をモック
    setIsLoading(true);
    setMessage('');

    try {
      // モック保存処理（実際には何もしない）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🚧 開発用：設定データ保存をシミュレート', data);
      
      setMessage('設定を保存しました（開発用モック）');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Settings update error:', error);
      setMessage('設定の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'プロフィール' },
    { id: 'ingredients', label: '食材設定' },
    { id: 'recipe', label: 'レシピ設定' },
    { id: 'notifications', label: '通知設定' },
  ];

  // 🚧 開発用：ローディング画面をスキップ

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header 
          variant="auth"
          title="設定"
          backButton={{ label: 'レシピ画面へ', href: '/recipe' }}
        />

        {/* Main Content */}
        <main className="container-responsive section-padding max-w-4xl">
          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
              {message}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 mb-8">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-50 h-12 text-base font-semibold transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-main text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-lg p-10">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-30 h-30 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                    <Button variant="secondary" className="text-sm">
                      画像を変更
                    </Button>
                  </div>

                  <Input
                    label="表示名"
                    {...register('displayName', {
                      required: '表示名は必須です',
                      maxLength: {
                        value: 50,
                        message: '表示名は50文字以内で入力してください'
                      }
                    })}
                    error={errors.displayName?.message}
                  />

                  <div>
                    <label className="form-label">メールアドレス</label>
                    <div className="input-field bg-gray-100 text-gray-500 cursor-not-allowed">
                      {mockUser.email}
                    </div>
                    <p className="caption text-gray-500 mt-1">
                      メールアドレスは変更できません
                    </p>
                  </div>

                  <Button variant="secondary" className="w-50">
                    パスワードを変更する
                  </Button>
                </div>
              )}

              {/* Ingredients Tab */}
              {activeTab === 'ingredients' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="heading-3 mb-4">アレルギー情報</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['卵', '乳製品', '小麦', 'そば', '落花生', 'えび', 'かに'].map((allergy) => (
                        <label key={allergy} className="flex items-center">
                          <input
                            type="checkbox"
                            value={allergy}
                            {...register('allergies')}
                            className="mr-2"
                          />
                          <span className="body-base">{allergy}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="heading-3 mb-4">嫌いな食材</h3>
                    <p className="body-small text-gray-600 mb-4">
                      レシピ生成時に除外される食材を選択してください
                    </p>
                    <div className="bg-gray-50 p-4 rounded-md min-h-20">
                      <p className="text-gray-500 text-sm">
                        食材選択UI（実装予定）
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="heading-3 mb-4">好きな食材</h3>
                    <p className="body-small text-gray-600 mb-4">
                      レシピ生成時に優先的に使用される食材を選択してください
                    </p>
                    <div className="bg-gray-50 p-4 rounded-md min-h-20">
                      <p className="text-gray-500 text-sm">
                        食材選択UI（実装予定）
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recipe Tab */}
              {activeTab === 'recipe' && (
                <div className="space-y-6">
                  <div>
                    <label className="form-label">希望調理時間: {watch('cookingTimePreference')}分</label>
                    <input
                      type="range"
                      min="15"
                      max="120"
                      step="5"
                      {...register('cookingTimePreference')}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>15分</span>
                      <span>120分</span>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">辛さの好み</label>
                    <div className="space-y-2">
                      {[
                        { value: 'mild', label: '辛いものが苦手' },
                        { value: 'normal', label: '普通' },
                        { value: 'spicy', label: '辛いものが好き' },
                        { value: 'extra_spicy', label: '激辛好き' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            value={option.value}
                            {...register('spiceLevel')}
                            className="mr-2"
                          />
                          <span className="body-base">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="1食あたりのカロリー目標"
                    type="number"
                    min="300"
                    max="1000"
                    {...register('calorieTarget', {
                      min: { value: 300, message: '300kcal以上で入力してください' },
                      max: { value: 1000, message: '1000kcal以下で入力してください' },
                    })}
                    error={errors.calorieTarget?.message}
                    helperText="300〜1000kcalの範囲で入力してください"
                  />

                  <div>
                    <label className="form-label">作り置き保存日数</label>
                    <select
                      {...register('storageDay')}
                      className="input-field"
                    >
                      <option value="3">3日間</option>
                      <option value="5">5日間</option>
                      <option value="7">7日間</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="heading-3 mb-4">プッシュ通知設定</h3>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('pushEnabled')}
                          className="mr-3"
                        />
                        <span className="body-base">通知を受け取る</span>
                      </label>

                      <div className="ml-6 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            {...register('pushNewRecipe')}
                            disabled={!watch('pushEnabled')}
                            className="mr-3"
                          />
                          <span className="body-base">新しいレシピのお知らせ</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            {...register('pushWeeklyRecipe')}
                            disabled={!watch('pushEnabled')}
                            className="mr-3"
                          />
                          <span className="body-base">週間レシピの提案</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            {...register('pushUpdates')}
                            disabled={!watch('pushEnabled')}
                            className="mr-3"
                          />
                          <span className="body-base">アップデート情報</span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="form-label">通知を受け取る時間帯</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="time"
                          {...register('pushTimeStart')}
                          disabled={!watch('pushEnabled')}
                          className="input-field w-32"
                        />
                        <span className="text-gray-500">〜</span>
                        <input
                          type="time"
                          {...register('pushTimeEnd')}
                          disabled={!watch('pushEnabled')}
                          className="input-field w-32"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="heading-3 mb-4">メール通知設定</h3>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('emailEnabled')}
                          className="mr-3"
                        />
                        <span className="body-base">メール通知を受け取る</span>
                      </label>

                      <div>
                        <label className="form-label">通知頻度</label>
                        <select
                          {...register('emailFrequency')}
                          disabled={!watch('emailEnabled')}
                          className="input-field"
                        >
                          <option value="daily">毎日</option>
                          <option value="weekly">週1回</option>
                          <option value="monthly">月1回</option>
                          <option value="never">なし</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={!isDirty || isLoading}
                  className="w-40"
                >
                  {isLoading ? '保存中...' : '保存する'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-30"
                  onClick={() => {
                    // Reset form to original values
                    setValue('displayName', mockUser.displayName);
                    setValue('cookingTimePreference', mockUser.profile.cookingTimePreference);
                    setValue('spiceLevel', mockUser.profile.spiceLevel);
                    setValue('calorieTarget', mockUser.profile.calorieTarget);
                    setValue('storageDay', mockUser.profile.storageDay);
                  }}
                >
                  リセット
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </AuthGuard>
  );
}
