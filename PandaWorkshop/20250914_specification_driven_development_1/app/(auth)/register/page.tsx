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
import type { RegisterForm } from '@/types';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegisterForm>({
    mode: 'onChange'
  });

  const watchPassword = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');

    try {
      await registerUser(data);
      router.push('/recipe');
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('このメールアドレスは既に使用されています');
      } else if (error.code === 'auth/weak-password') {
        setError('パスワードが弱すぎます');
      } else {
        setError('アカウント作成に失敗しました');
      }
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
          backButton={{ label: 'ログインページへ', href: '/login' }}
          title="新規登録"
        />

        {/* Register Dialog */}
        <div className="flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10">
            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-700 mb-8">
              新規登録
            </h1>

            {/* Error Banner */}
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="表示名"
                type="text"
                placeholder="お名前を入力"
                error={errors.displayName?.message}
                {...register('displayName', {
                  required: '表示名は必須です',
                  minLength: {
                    value: 1,
                    message: '表示名を入力してください'
                  },
                  maxLength: {
                    value: 50,
                    message: '表示名は50文字以内で入力してください'
                  }
                })}
              />

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
                  placeholder="パスワードを入力（8文字以上）"
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

              <div className="relative">
                <Input
                  label="パスワード（確認）"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="パスワードを再入力"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'パスワード（確認）は必須です',
                    validate: (value) => 
                      value === watchPassword || 'パスワードが一致しません'
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <Button
                type="submit"
                loading={isLoading}
                disabled={!isValid || isLoading}
                className="w-full h-12"
              >
                {isLoading ? 'アカウント作成中...' : 'アカウント作成'}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                既にアカウントをお持ちの場合{' '}
                <Link 
                  href="/login" 
                  className="text-primary-main hover:underline font-semibold"
                >
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
