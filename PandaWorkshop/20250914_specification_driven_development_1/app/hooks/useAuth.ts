'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { createUserProfile } from '@/lib/firebase/firestore';
import type { LoginForm, RegisterForm } from '@/types';

export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);

  const login = async ({ email, password }: LoginForm) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async ({ email, password, displayName }: RegisterForm) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await createUserProfile(result.user.uid, {
        email,
        displayName,
        profile: {
          allergies: [],
          dislikedIngredients: [],
          likedIngredients: [],
          cookingTimePreference: 30,
          spiceLevel: 'normal',
          calorieTarget: 500,
          storageDay: 5,
        },
        notifications: {
          push: {
            enabled: true,
            newRecipe: true,
            weeklyRecipe: true,
            updates: false,
            timeRange: {
              start: '09:00',
              end: '21:00',
            },
          },
          email: {
            enabled: false,
            frequency: 'weekly',
          },
        },
      });
      
      return result;
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };
};
