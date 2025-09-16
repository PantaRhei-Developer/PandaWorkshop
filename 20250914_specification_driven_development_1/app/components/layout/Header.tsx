'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import Button from '@/components/ui/Button';

interface HeaderProps {
  variant?: 'main' | 'auth';
  showNavigation?: boolean;
  title?: string;
  backButton?: {
    label: string;
    href: string;
  };
}

const Header: React.FC<HeaderProps> = ({ 
  variant = 'main', 
  showNavigation = false,
  title,
  backButton
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    // 🚧 開発用：認証無効化中のため、単純にホームに遷移
    router.push('/');
    
    /* バックエンド実装後に有効化
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    */
  };

  if (variant === 'auth') {
    return (
      <header className="header-main">
        <div className="flex items-center">
          {backButton && (
            <Link href={backButton.href} className="nav-button mr-4">
              ← {backButton.label}
            </Link>
          )}
          <Link href="/" className="logo text-2xl">
            Go Recipi!
          </Link>
        </div>
        
        {title && (
          <h1 className="text-xl font-semibold text-white">
            {title}
          </h1>
        )}
        
        <div /> {/* Spacer for centering */}
      </header>
    );
  }

  return (
    <header className="header-main">
      <Link href="/recipe" className="logo">
        Go Recipi!
      </Link>
      
      {title && (
        <h1 className="text-xl font-semibold text-white">
          {title}
        </h1>
      )}
      
      {showNavigation && (
        <nav className="flex items-center gap-6">
          <Link href="/history" className="nav-button">
            履歴
          </Link>
          <Link href="/settings" className="nav-button">
            設定
          </Link>
          <button 
            onClick={handleLogout}
            className="nav-button hover:text-primary-light transition-colors"
          >
            ログアウト
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
