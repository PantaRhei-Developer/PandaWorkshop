import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';
import type { 
  User, 
  WeeklyMenu, 
  Recipe, 
  Ingredient, 
  IngredientCategory 
} from '@/types';

// Collection references
export const collections = {
  users: 'users',
  weeklyMenus: 'weeklyMenus',
  recipes: 'recipes',
  ingredients: 'ingredients',
  ingredientCategories: 'ingredientCategories',
  generationLogs: 'generationLogs',
} as const;

// User operations
export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, collections.users, uid));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const createUserProfile = async (uid: string, userData: Partial<User>): Promise<void> => {
  try {
    await setDoc(doc(db, collections.users, uid), {
      ...userData,
      uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(db, collections.users, uid), {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Ingredient operations
export const getIngredientCategories = async (): Promise<IngredientCategory[]> => {
  try {
    const q = query(
      collection(db, collections.ingredientCategories),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as IngredientCategory));
  } catch (error) {
    console.error('Error fetching ingredient categories:', error);
    throw error;
  }
};

export const getIngredientsByCategory = async (categoryId?: string): Promise<Ingredient[]> => {
  try {
    const constraints: QueryConstraint[] = [where('isActive', '==', true)];
    
    if (categoryId) {
      constraints.push(where('categoryId', '==', categoryId));
    }
    
    const q = query(collection(db, collections.ingredients), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Ingredient));
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};

// Recipe operations
export const getRecipe = async (recipeId: string): Promise<Recipe | null> => {
  try {
    const recipeDoc = await getDoc(doc(db, collections.recipes, recipeId));
    return recipeDoc.exists() ? ({ ...recipeDoc.data(), id: recipeDoc.id } as Recipe) : null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

export const searchRecipes = async (ingredientIds: string[], maxCookingTime?: number): Promise<Recipe[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('isActive', '==', true),
      where('requiredIngredients.ingredientId', 'array-contains-any', ingredientIds)
    ];
    
    if (maxCookingTime) {
      constraints.push(where('cookingTime', '<=', maxCookingTime));
    }
    
    constraints.push(limit(50));
    
    const q = query(collection(db, collections.recipes), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Recipe));
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Weekly menu operations
export const saveWeeklyMenu = async (userId: string, weeklyMenuData: Omit<WeeklyMenu, 'id' | 'userId'>): Promise<string> => {
  try {
    const menuRef = doc(collection(db, collections.weeklyMenus));
    await setDoc(menuRef, {
      ...weeklyMenuData,
      userId,
      id: menuRef.id,
    });
    return menuRef.id;
  } catch (error) {
    console.error('Error saving weekly menu:', error);
    throw error;
  }
};

export const getUserWeeklyMenus = async (
  userId: string, 
  limitCount: number = 20, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ menus: WeeklyMenu[], lastDoc?: QueryDocumentSnapshot<DocumentData> }> => {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      where('isDeleted', '==', false),
      orderBy('generatedAt', 'desc'),
      limit(limitCount)
    ];
    
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const q = query(collection(db, collections.weeklyMenus), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const menus = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as WeeklyMenu));
    const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { menus, lastDoc: lastDocument };
  } catch (error) {
    console.error('Error fetching weekly menus:', error);
    throw error;
  }
};

export const getWeeklyMenu = async (menuId: string): Promise<WeeklyMenu | null> => {
  try {
    const menuDoc = await getDoc(doc(db, collections.weeklyMenus, menuId));
    return menuDoc.exists() ? ({ ...menuDoc.data(), id: menuDoc.id } as WeeklyMenu) : null;
  } catch (error) {
    console.error('Error fetching weekly menu:', error);
    throw error;
  }
};

export const deleteWeeklyMenu = async (menuId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, collections.weeklyMenus, menuId), {
      isDeleted: true,
      deletedAt: new Date(),
    });
  } catch (error) {
    console.error('Error deleting weekly menu:', error);
    throw error;
  }
};

export const updateMenuFavorite = async (menuId: string, isFavorite: boolean): Promise<void> => {
  try {
    await updateDoc(doc(db, collections.weeklyMenus, menuId), {
      'userActions.isFavorite': isFavorite,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating menu favorite:', error);
    throw error;
  }
};
