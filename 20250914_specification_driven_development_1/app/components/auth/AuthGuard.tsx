'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

// 🚧 開発用：認証を無効化（バックエンド実装後に有効化）
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = false, // デフォルトで認証不要に変更
  redirectTo 
}) => {
  // 開発用：認証チェックをスキップして直接コンテンツを表示
  return <>{children}</>;
};

export default AuthGuard;
