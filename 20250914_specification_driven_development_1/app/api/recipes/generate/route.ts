import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin';
import { getUserProfile, saveWeeklyMenu, searchRecipes, getRecipe } from '@/lib/firebase/firestore';
import type { Recipe, DailyRecipes, WeeklyNutrition } from '@/types';

// Mock recipe generation logic (simplified)
function generateWeeklyRecipes(
  availableRecipes: Recipe[], 
  userPreferences?: any
): { selectedRecipes: Recipe[], dailyRecipes: DailyRecipes } {
  // Simple selection algorithm - in reality this would be much more sophisticated
  const selectedRecipes = availableRecipes.slice(0, 7);
  
  const dailyRecipes: DailyRecipes = {
    monday: selectedRecipes[0]?.id || '',
    tuesday: selectedRecipes[1]?.id || '',
    wednesday: selectedRecipes[2]?.id || '',
    thursday: selectedRecipes[3]?.id || '',
    friday: selectedRecipes[4]?.id || '',
    saturday: selectedRecipes[5]?.id || '',
    sunday: selectedRecipes[6]?.id || '',
  };

  return { selectedRecipes, dailyRecipes };
}

function calculateWeeklyNutrition(recipes: Recipe[]): WeeklyNutrition {
  const totalNutrition = recipes.reduce(
    (acc, recipe) => ({
      calories: acc.calories + recipe.nutrition.calories,
      protein: acc.protein + recipe.nutrition.protein,
      fat: acc.fat + recipe.nutrition.fat,
      carbohydrate: acc.carbohydrate + recipe.nutrition.carbohydrate,
    }),
    { calories: 0, protein: 0, fat: 0, carbohydrate: 0 }
  );

  return {
    totalCalories: totalNutrition.calories,
    averageCaloriesPerDay: totalNutrition.calories / 7,
    totalProtein: totalNutrition.protein,
    totalFat: totalNutrition.fat,
    totalCarbohydrate: totalNutrition.carbohydrate,
  };
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const decodedToken = await verifyIdToken(token);
    const { ingredients, preferences, regenerate, previousMenuId } = await request.json();

    // Validate input
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { 
          error: '食材を選択してください', 
          code: 'INSUFFICIENT_INGREDIENTS',
          details: { minRequired: 1, provided: ingredients?.length || 0 }
        },
        { status: 400 }
      );
    }

    if (ingredients.length < 2) {
      return NextResponse.json(
        { 
          error: 'レシピ生成には最低2つの食材が必要です', 
          code: 'INSUFFICIENT_INGREDIENTS',
          details: { minRequired: 2, provided: ingredients.length }
        },
        { status: 400 }
      );
    }

    // Get user preferences
    const user = await getUserProfile(decodedToken.uid);
    const userPreferences = user?.profile || {};

    // Search for matching recipes
    const maxCookingTime = preferences?.cookingTimeMax || userPreferences.cookingTimePreference || 60;
    const availableRecipes = await searchRecipes(ingredients, maxCookingTime);

    if (availableRecipes.length < 7) {
      return NextResponse.json(
        { 
          error: '選択した食材では十分なレシピを生成できません', 
          code: 'GENERATION_FAILED',
          details: { 
            availableRecipes: availableRecipes.length, 
            required: 7,
            suggestion: '他の食材も追加してみてください'
          }
        },
        { status: 400 }
      );
    }

    // Generate weekly menu
    const { selectedRecipes, dailyRecipes } = generateWeeklyRecipes(
      availableRecipes,
      { ...userPreferences, ...preferences }
    );

    // Calculate nutrition
    const weeklyNutrition = calculateWeeklyNutrition(selectedRecipes);

    // Save to database
    const menuId = await saveWeeklyMenu(decodedToken.uid, {
      generatedAt: new Date() as any,
      usedIngredients: ingredients,
      dailyRecipes,
      weeklyNutrition,
      userActions: {
        isFavorite: false,
        regenerationCount: 0,
      },
      isDeleted: false,
    });

    // Get complete recipe data for response
    const completeRecipes = await Promise.all(
      selectedRecipes.map(recipe => getRecipe(recipe.id))
    );

    return NextResponse.json({
      data: {
        id: menuId,
        userId: decodedToken.uid,
        generatedAt: new Date().toISOString(),
        usedIngredients: ingredients,
        dailyRecipes,
        weeklyNutrition,
        recipes: completeRecipes.filter(Boolean),
      },
      message: 'Weekly recipes generated successfully',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Recipe generation error:', error);

    if (error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'レシピの生成に失敗しました', 
        code: 'GENERATION_FAILED',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
