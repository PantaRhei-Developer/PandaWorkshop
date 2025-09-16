'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import IngredientCard from '@/components/recipe/IngredientCard';
import RecipeCard from '@/components/recipe/RecipeCard';
import SelectedIngredientsDisplay from '@/components/recipe/SelectedIngredientsDisplay';
import { useIngredients } from '@/hooks/useIngredients';
import type { IngredientCategory, Recipe, DailyRecipes } from '@/types';

export default function RecipePage() {
  const [selectedCategories, setSelectedCategories] = useState<IngredientCategory[]>([]);
  const [weeklyRecipes, setWeeklyRecipes] = useState<DailyRecipes | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // 🚧 開発用：Firebase接続無効化中のため、食材データをモック  
  const mockCategories = [
    { id: 'meat', name: '肉類', nameEn: 'meat', icon: '🥩', color: '#FF6B35', order: 1, isActive: true },
    { id: 'fish', name: '魚類', nameEn: 'fish', icon: '🐟', color: '#4A90E2', order: 2, isActive: true },
    { id: 'vegetables', name: '野菜', nameEn: 'vegetables', icon: '🥬', color: '#7ED321', order: 3, isActive: true },
    { id: 'fruits', name: '果物', nameEn: 'fruits', icon: '🍎', color: '#F5A623', order: 4, isActive: true },
    { id: 'grains', name: '穀物', nameEn: 'grains', icon: '🌾', color: '#D0021B', order: 5, isActive: true },
    { id: 'dairy', name: '乳製品', nameEn: 'dairy', icon: '🥛', color: '#9013FE', order: 6, isActive: true },
    { id: 'seasoning', name: '調味料', nameEn: 'seasoning', icon: '🧂', color: '#50E3C2', order: 7, isActive: true },
    { id: 'other', name: 'その他', nameEn: 'other', icon: '📦', color: '#B8E986', order: 8, isActive: true },
  ];
  
  const categories = mockCategories;
  const isLoading = false;
  // const { categories, isLoading } = useIngredients();
  const router = useRouter();

  const handleCategorySelect = useCallback((category: IngredientCategory) => {
    setSelectedCategories(prev => {
      const isSelected = prev.some(c => c.id === category.id);
      
      if (isSelected) {
        // Remove if already selected
        return prev.filter(c => c.id !== category.id);
      } else {
        // Add if not selected (max 10)
        if (prev.length >= 10) {
          setError('食材は最大10個まで選択できます');
          setTimeout(() => setError(''), 3000);
          return prev;
        }
        return [...prev, category];
      }
    });
  }, []);

  const handleRemoveCategory = useCallback((categoryId: string) => {
    setSelectedCategories(prev => prev.filter(c => c.id !== categoryId));
  }, []);

  const generateRecipes = async () => {
    if (selectedCategories.length === 0) {
      setError('食材を選択してください');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // 🚧 開発用：API呼び出しをモック化
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒の疑似読み込み
      
      // モックレシピデータ
      const mockRecipes = [
        { id: 'recipe-1', name: '鶏肉の照り焼き弁当', imageUrl: null, cookingTime: 20, nutrition: { calories: 450 } },
        { id: 'recipe-2', name: '野菜炒め弁当', imageUrl: null, cookingTime: 15, nutrition: { calories: 350 } },
        { id: 'recipe-3', name: 'サーモンのムニエル弁当', imageUrl: null, cookingTime: 25, nutrition: { calories: 480 } },
        { id: 'recipe-4', name: '豚肉の生姜焼き弁当', imageUrl: null, cookingTime: 18, nutrition: { calories: 420 } },
        { id: 'recipe-5', name: '卵焼きとおかず弁当', imageUrl: null, cookingTime: 12, nutrition: { calories: 380 } },
        { id: 'recipe-6', name: 'ハンバーグ弁当', imageUrl: null, cookingTime: 30, nutrition: { calories: 520 } },
        { id: 'recipe-7', name: '唐揚げ弁当', imageUrl: null, cookingTime: 25, nutrition: { calories: 550 } },
      ];
      
      const mockDailyRecipes = {
        monday: 'recipe-1',
        tuesday: 'recipe-2',
        wednesday: 'recipe-3',
        thursday: 'recipe-4',
        friday: 'recipe-5',
        saturday: 'recipe-6',
        sunday: 'recipe-7',
      };
      
      console.log('🚧 開発用：レシピ生成をシミュレート', {
        selectedIngredients: selectedCategories.map(c => c.name),
        generatedRecipes: mockRecipes.length
      });
      
      setWeeklyRecipes(mockDailyRecipes);
      setRecipes(mockRecipes);
      
      /* バックエンド実装後に有効化
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: selectedCategories.map(c => c.id),
        }),
      });

      if (!response.ok) {
        throw new Error('レシピの生成に失敗しました');
      }

      const data = await response.json();
      setWeeklyRecipes(data.data.dailyRecipes);
      setRecipes(data.data.recipes);
      */
    } catch (error) {
      console.error('Recipe generation error:', error);
      setError('レシピの生成に失敗しました。再度お試しください。');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="body-base text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header showNavigation />

        {/* Main Content */}
        <main className="flex flex-col h-screen">
          {/* Upper Section - Ingredient Selection */}
          <section className="flex-1 bg-gray-50 section-padding">
            <div className="container-responsive">
              {/* Section Title */}
              <h2 className="heading-2 text-center mb-10">
                食材を選んでください
              </h2>

              {/* Error Message */}
              {error && (
                <div className="error-banner max-w-2xl mx-auto">
                  {error}
                </div>
              )}

              {/* Ingredient Categories Grid */}
              <div className="ingredient-grid mb-10">
                {categories.map((category) => (
                  <IngredientCard
                    key={category.id}
                    category={category}
                    selected={selectedCategories.some(c => c.id === category.id)}
                    onClick={() => handleCategorySelect(category)}
                  />
                ))}
              </div>

              {/* Selected Ingredients Display */}
              <div className="mb-8">
                <SelectedIngredientsDisplay
                  selectedCategories={selectedCategories}
                  onRemove={handleRemoveCategory}
                />
              </div>

              {/* Generate Button */}
              <div className="flex justify-end">
                <Button
                  onClick={generateRecipes}
                  loading={isGenerating}
                  disabled={selectedCategories.length === 0 || isGenerating}
                  className="w-45 h-12 text-lg rounded-3xl"
                >
                  {isGenerating ? '生成中...' : 'Go Recipi!'}
                </Button>
              </div>
            </div>
          </section>

          {/* Lower Section - Recipe Display */}
          <section className="flex-1 bg-white section-padding">
            <div className="container-responsive">
              {!weeklyRecipes ? (
                /* Initial State - Cute Illustration */
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-75 h-60 mx-auto mb-5 flex items-center justify-center">
                      <span className="text-9xl">👨‍🍳</span>
                    </div>
                    <p className="body-large text-gray-600">
                      食材を選んでレシピを生成しましょう！
                    </p>
                  </div>
                </div>
              ) : (
                /* Recipe Display State */
                <div>
                  <h2 className="heading-2 text-center mb-8">
                    今週の作り置きレシピ
                  </h2>

                  {/* Weekly Recipe Cards */}
                  <div className="recipe-grid">
                    {Object.entries(weeklyRecipes).map(([day, recipeId]) => {
                      const recipe = recipes.find(r => r.id === recipeId);
                      if (!recipe) return null;

                      return (
                        <div key={day} className="staggered-fade-in">
                          <RecipeCard
                            recipe={recipe}
                            day={day as keyof DailyRecipes}
                            onClick={() => {
                              // Open recipe detail modal
                              console.log('Open recipe detail:', recipe);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
