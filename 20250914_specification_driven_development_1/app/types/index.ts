import { Timestamp } from 'firebase/firestore';

// User Types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  profileImageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  
  profile: UserProfile;
  notifications: NotificationSettings;
}

export interface UserProfile {
  allergies: string[];
  dislikedIngredients: string[];
  likedIngredients: string[];
  cookingTimePreference: number;
  spiceLevel: 'mild' | 'normal' | 'spicy' | 'extra_spicy';
  calorieTarget: number;
  storageDay: 3 | 5 | 7;
}

export interface NotificationSettings {
  push: {
    enabled: boolean;
    newRecipe: boolean;
    weeklyRecipe: boolean;
    updates: boolean;
    timeRange: {
      start: string;
      end: string;
    };
  };
  email: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  };
}

// Ingredient Types
export interface IngredientCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Ingredient {
  id: string;
  name: string;
  nameEn: string;
  categoryId: string;
  season?: string[];
  storageMethod: string;
  storageDays: number;
  allergyInfo?: string[];
  nutritionPer100g: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrate: number;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Recipe Types
export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'normal' | 'hard';
  spiceLevel: 'mild' | 'normal' | 'spicy' | 'extra_spicy';
  
  requiredIngredients: RequiredIngredient[];
  steps: RecipeStep[];
  nutrition: Nutrition;
  mealPrep: MealPrepInfo;
  
  tags: string[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  metadata: {
    authorId?: string;
    source?: string;
    rating?: number;
    viewCount: number;
    generationCount: number;
  };
}

export interface RequiredIngredient {
  ingredientId: string;
  ingredientName?: string; // For display purposes
  amount: number;
  unit: string;
  isEssential: boolean;
}

export interface RecipeStep {
  order: number;
  description: string;
  imageUrl?: string;
  time?: number;
}

export interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  salt: number;
}

export interface MealPrepInfo {
  isEnabled: boolean;
  storageDays: number;
  storageMethod: string;
  reheatingInstructions: string;
}

// Weekly Menu Types
export interface WeeklyMenu {
  id: string;
  userId: string;
  generatedAt: Timestamp;
  usedIngredients: string[];
  
  dailyRecipes: DailyRecipes;
  weeklyNutrition: WeeklyNutrition;
  userActions: UserActions;
  
  isDeleted: boolean;
  deletedAt?: Timestamp;
}

export interface DailyRecipes {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface WeeklyNutrition {
  totalCalories: number;
  averageCaloriesPerDay: number;
  totalProtein: number;
  totalFat: number;
  totalCarbohydrate: number;
}

export interface UserActions {
  isFavorite: boolean;
  regenerationCount: number;
  lastAccessedAt?: Timestamp;
  notes?: string;
}

// API Types
export interface APIResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface APIError {
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  displayName: string;
  confirmPassword: string;
}

export interface RecipeGenerationRequest {
  ingredients: string[];
  preferences?: {
    cookingTimeMax?: number;
    spiceLevel?: string;
    calorieTargetPerMeal?: number;
    avoidIngredients?: string[];
  };
  regenerate?: boolean;
  previousMenuId?: string;
}

// Component Props Types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'large';
  loading?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export interface IngredientCardProps {
  category: IngredientCategory;
  selected: boolean;
  onClick: () => void;
}

export interface RecipeCardProps {
  recipe: Recipe;
  day: keyof DailyRecipes;
  onClick?: () => void;
}

// Hook Types
export interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  isError: any;
  mutate: () => void;
}

export interface UseIngredientsReturn {
  ingredients: Ingredient[];
  categories: IngredientCategory[];
  isLoading: boolean;
  isError: any;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}
