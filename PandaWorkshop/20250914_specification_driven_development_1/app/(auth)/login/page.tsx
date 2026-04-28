'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import Header from '@/components/layout/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { LoginForm } from '@/types';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginForm>({
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');

    try {
      await login(data);
      router.push('/recipe');
    } catch (error: any) {
      console.error('Login error:', error);
      setError('メールアドレスまたはパスワードが間違っています');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div 
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FFA07A 100%)',
        }}
      >
        {/* Header */}
        <Header 
          variant="auth"
          backButton={{ label: '戻る', href: '/' }}
        />

        {/* Login Dialog */}
        <div className="flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10">
            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-700 mb-8">
              ログイン
            </h1>

            {/* Error Banner */}
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="メールアドレス"
                type="email"
                placeholder="example@email.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'メールアドレスは必須です',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'メールアドレスの形式が正しくありません'
                  }
                })}
              />

              <div className="relative">
                <Input
                  label="パスワード"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="パスワードを入力"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'パスワードは必須です',
                    minLength: {
                      value: 8,
                      message: 'パスワードは8文字以上で入力してください'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <Button
                type="submit"
                loading={isLoading}
                disabled={!isValid || isLoading}
                className="w-full h-12"
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </Button>
            </form>

            {/* Password Reset Link */}
            <div className="text-center mt-5">
              <Link 
                href="/password-reset" 
                className="text-primary-main text-sm hover:underline"
              >
                パスワードを忘れた場合
              </Link>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            {/* Register Section */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                アカウントをお持ちでない場合
              </p>
              <Link href="/register">
                <Button variant="secondary" className="w-full h-12">
                  新規登録
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
