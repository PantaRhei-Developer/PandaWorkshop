'use client';

import useSWR from 'swr';
import { useAuth } from './useAuth';
import { getUserProfile } from '@/lib/firebase/firestore';
import type { UseUserReturn } from '@/types';

export const useUser = (): UseUserReturn => {
  const { user: authUser } = useAuth();
  
  const { data: user, error, mutate } = useSWR(
    authUser ? `user:${authUser.uid}` : null,
    () => authUser ? getUserProfile(authUser.uid) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    user,
    isLoading: !error && !user && !!authUser,
    isError: error,
    mutate,
  };
};
