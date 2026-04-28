'use client';

import useSWR from 'swr';
import { getIngredientCategories, getIngredientsByCategory } from '@/lib/firebase/firestore';
import type { UseIngredientsReturn } from '@/types';

export const useIngredients = (categoryId?: string): UseIngredientsReturn => {
  const { data: categories, error: categoriesError } = useSWR(
    'ingredient-categories',
    getIngredientCategories,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 3600000, // 1 hour
    }
  );

  const { data: ingredients, error: ingredientsError } = useSWR(
    categoryId ? `ingredients:${categoryId}` : 'ingredients:all',
    () => getIngredientsByCategory(categoryId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 1800000, // 30 minutes
    }
  );

  return {
    ingredients: ingredients || [],
    categories: categories || [],
    isLoading: (!categories && !categoriesError) || (!ingredients && !ingredientsError),
    isError: categoriesError || ingredientsError,
  };
};
