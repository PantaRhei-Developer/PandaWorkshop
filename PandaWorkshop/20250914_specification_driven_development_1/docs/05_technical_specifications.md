# Go Recipi! - 技術仕様書

## 1. アーキテクチャ概要

### 1.1 システム構成
```
[Frontend] ← → [Next.js API Routes] ← → [Firebase Services]
  React.js        サーバーサイド処理         Firestore/Auth
  Next.js         レシピ生成ロジック        Storage
```

### 1.2 技術スタック

#### フロントエンド
- **React.js**: 18.x 以上
- **Next.js**: 13.x 以上（App Router使用）
- **TypeScript**: 5.x 以上
- **Tailwind CSS**: 3.x 以上（スタイリング）
- **Framer Motion**: アニメーション
- **React Hook Form**: フォーム管理
- **SWR**: データ取得・キャッシュ管理

#### バックエンド
- **Next.js API Routes**: サーバーサイド処理
- **Firebase Admin SDK**: サーバーサイドFirebase操作

#### データベース・インフラ
- **Firebase Firestore**: メインデータベース
- **Firebase Authentication**: 認証
- **Firebase Storage**: 画像・ファイルストレージ
- **Firebase Hosting**: 静的コンテンツ配信
- **Vercel**: アプリケーションホスティング

#### 開発・運用
- **ESLint**: コード品質
- **Prettier**: コードフォーマット
- **Husky**: Git フック
- **Jest**: ユニットテスト
- **Playwright**: E2Eテスト

## 2. プロジェクト構成

### 2.1 ディレクトリ構成
```
go-recipi/
├── src/
│   ├── app/                    # App Router（Next.js 13+）
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/
│   │   │   ├── recipe/
│   │   │   ├── history/
│   │   │   └── settings/
│   │   ├── api/                # API Routes
│   │   │   ├── auth/
│   │   │   ├── recipes/
│   │   │   └── user/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # 再利用可能なコンポーネント
│   │   ├── ui/                 # 基本UIコンポーネント
│   │   ├── forms/              # フォーム関連コンポーネント
│   │   ├── recipe/             # レシピ関連コンポーネント
│   │   └── layout/             # レイアウトコンポーネント
│   ├── hooks/                  # カスタムフック
│   ├── lib/                    # ユーティリティ・設定
│   │   ├── firebase/
│   │   ├── auth/
│   │   └── utils/
│   ├── types/                  # TypeScript型定義
│   ├── constants/              # 定数定義
│   └── styles/                 # グローバルスタイル
├── public/                     # 静的ファイル
├── docs/                       # ドキュメント
├── tests/                      # テストファイル
├── firebase.json               # Firebase設定
├── next.config.js              # Next.js設定
├── tailwind.config.js          # Tailwind CSS設定
├── tsconfig.json               # TypeScript設定
└── package.json
```

### 2.2 型定義構造
```typescript
// src/types/index.ts
export interface User {
  uid: string;
  email: string;
  displayName: string;
  profileImageUrl?: string;
  profile: UserProfile;
  notifications: NotificationSettings;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  cookingTime: number;
  // ... 他のフィールド
}

export interface WeeklyMenu {
  id: string;
  userId: string;
  dailyRecipes: DailyRecipes;
  // ... 他のフィールド
}
```

## 3. 認証・セキュリティ

### 3.1 Firebase Authentication
```typescript
// src/lib/auth/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... その他の設定
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 3.2 認証ガード
```typescript
// src/components/auth/AuthGuard.tsx
'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return null;

  return <>{children}</>;
}
```

### 3.3 サーバーサイド認証
```typescript
// src/lib/auth/admin.ts
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert } from 'firebase-admin/app';

if (!admin.apps.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

## 4. データアクセス層

### 4.1 Firebase Firestore設定
```typescript
// src/lib/firebase/firestore.ts
import { getFirestore } from 'firebase/firestore';
import { app } from './config';

export const db = getFirestore(app);

// Firestoreコレクション参照
export const collections = {
  users: 'users',
  weeklyMenus: 'weeklyMenus',
  recipes: 'recipes',
  ingredients: 'ingredients',
  ingredientCategories: 'ingredientCategories',
  generationLogs: 'generationLogs',
} as const;
```

### 4.2 データアクセス関数
```typescript
// src/lib/firebase/users.ts
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, collections } from './firestore';
import type { User } from '@/types';

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, collections.users, uid));
  return userDoc.exists() ? userDoc.data() as User : null;
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
  await updateDoc(doc(db, collections.users, uid), {
    ...data,
    updatedAt: new Date(),
  });
};
```

### 4.3 SWRによるデータ取得
```typescript
// src/hooks/useUser.ts
import useSWR from 'swr';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { getUserProfile } from '@/lib/firebase/users';

export function useUser() {
  const [authUser] = useAuthState(auth);
  
  const { data: user, error, mutate } = useSWR(
    authUser ? `user:${authUser.uid}` : null,
    () => getUserProfile(authUser!.uid),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    user,
    isLoading: !error && !user && authUser,
    isError: error,
    mutate,
  };
}
```

## 5. API設計

### 5.1 API Routes構成
```typescript
// src/app/api/recipes/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/auth/admin';
import { generateWeeklyRecipes } from '@/lib/recipe/generator';

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyIdToken(token);
    const { ingredients } = await request.json();

    // レシピ生成処理
    const weeklyMenu = await generateWeeklyRecipes(
      decodedToken.uid,
      ingredients
    );

    return NextResponse.json(weeklyMenu);
  } catch (error) {
    return NextResponse.json(
      { error: 'Recipe generation failed' },
      { status: 500 }
    );
  }
}
```

### 5.2 エラーハンドリング
```typescript
// src/lib/errors/api.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown) => {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
};
```

## 6. レシピ生成ロジック

### 6.1 アルゴリズム概要
```typescript
// src/lib/recipe/generator.ts
interface GenerationConfig {
  userId: string;
  ingredients: string[];
  preferences?: {
    cookingTime?: number;
    spiceLevel?: string;
    calorieTarget?: number;
  };
}

export async function generateWeeklyRecipes(
  userId: string,
  ingredients: string[]
): Promise<WeeklyMenu> {
  // 1. ユーザー設定の取得
  const userPreferences = await getUserPreferences(userId);
  
  // 2. 利用可能レシピの検索
  const availableRecipes = await findMatchingRecipes(
    ingredients,
    userPreferences
  );
  
  // 3. 栄養バランスと多様性を考慮した選択
  const selectedRecipes = selectBalancedRecipes(
    availableRecipes,
    userPreferences
  );
  
  // 4. 週間メニューの生成
  const weeklyMenu = createWeeklyMenu(selectedRecipes);
  
  // 5. データベースへの保存
  await saveWeeklyMenu(userId, weeklyMenu);
  
  return weeklyMenu;
}
```

### 6.2 レシピ選択アルゴリズム
```typescript
// 栄養バランスを考慮したレシピ選択
function selectBalancedRecipes(
  recipes: Recipe[],
  preferences: UserPreferences
): Recipe[] {
  const selectedRecipes: Recipe[] = [];
  const nutritionTargets = calculateNutritionTargets(preferences);
  
  // 各曜日に対してレシピを選択
  for (let day = 0; day < 7; day++) {
    const remainingTargets = calculateRemainingTargets(
      nutritionTargets,
      selectedRecipes
    );
    
    const bestRecipe = findBestRecipe(recipes, remainingTargets, selectedRecipes);
    selectedRecipes.push(bestRecipe);
  }
  
  return selectedRecipes;
}
```

## 7. パフォーマンス最適化

### 7.1 画像最適化
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // その他の設定
};

export default nextConfig;
```

### 7.2 バンドル最適化
```typescript
// 動的インポート
const RecipeModal = dynamic(() => import('@/components/recipe/RecipeModal'), {
  loading: () => <div>Loading...</div>,
});

// コード分割
const SettingsPage = lazy(() => import('@/app/(main)/settings/page'));
```

### 7.3 キャッシュ戦略
```typescript
// src/lib/cache/config.ts
export const cacheConfig = {
  user: { ttl: 5 * 60 * 1000 }, // 5分
  recipes: { ttl: 30 * 60 * 1000 }, // 30分
  ingredients: { ttl: 60 * 60 * 1000 }, // 1時間
};

// SWRグローバル設定
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};
```

## 8. テスト戦略

### 8.1 ユニットテスト
```typescript
// src/lib/recipe/__tests__/generator.test.ts
import { generateWeeklyRecipes } from '../generator';

describe('generateWeeklyRecipes', () => {
  it('should generate 7 recipes for a week', async () => {
    const ingredients = ['chicken_breast', 'broccoli', 'rice'];
    const weeklyMenu = await generateWeeklyRecipes('user123', ingredients);
    
    expect(Object.keys(weeklyMenu.dailyRecipes)).toHaveLength(7);
  });
  
  it('should consider user allergies', async () => {
    // テスト実装
  });
});
```

### 8.2 E2Eテスト
```typescript
// tests/e2e/recipe-generation.spec.ts
import { test, expect } from '@playwright/test';

test('recipe generation flow', async ({ page }) => {
  // ログイン
  await page.goto('/login');
  await page.fill('[data-testid=email]', 'test@example.com');
  await page.fill('[data-testid=password]', 'password123');
  await page.click('[data-testid=login-button]');
  
  // レシピ生成
  await page.goto('/recipe');
  await page.click('[data-testid=ingredient-meat]');
  await page.click('[data-testid=ingredient-vegetables]');
  await page.click('[data-testid=generate-button]');
  
  // 結果確認
  await expect(page.locator('[data-testid=weekly-recipes]')).toBeVisible();
});
```

## 9. デプロイメント

### 9.1 環境設定
```bash
# .env.local (開発環境)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# サーバーサイド環境変数
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

### 9.2 ビルドとデプロイ
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:e2e": "playwright test",
    "deploy": "vercel --prod"
  }
}
```

### 9.3 CI/CD パイプライン
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 10. 監視・ロギング

### 10.1 エラートラッキング
```typescript
// src/lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### 10.2 パフォーマンス監視
```typescript
// src/lib/monitoring/analytics.ts
import { getAnalytics, logEvent } from 'firebase/analytics';

export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined') {
    const analytics = getAnalytics();
    logEvent(analytics, eventName, parameters);
  }
};
```

## 11. セキュリティ対策

### 11.1 CSP設定
```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};
```

### 11.2 API レート制限
```typescript
// src/lib/security/rate-limit.ts
import { NextRequest } from 'next/server';

const rateLimit = new Map();

export function checkRateLimit(request: NextRequest, limit = 100) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15分
  
  const current = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs };
  
  if (now > current.resetTime) {
    current.count = 1;
    current.resetTime = now + windowMs;
  } else {
    current.count++;
  }
  
  rateLimit.set(ip, current);
  
  return current.count <= limit;
}
```


## 12. トラブルシューティング

### 12.1 よくある問題

#### Next.js設定エラー
```bash
# エラー例
⚠ Invalid next.config.js options detected: 'appDir' at "experimental"

# 解決方法: next.config.jsから削除
const nextConfig = {
  // experimental: { appDir: true }, // ← この行を削除
  images: { /* ... */ },
}
```

#### CSS設定エラー  
```bash
# エラー例1
The `border-border` class does not exist

# 解決方法: globals.cssで適切なクラス使用
@layer base {
  * {
    @apply border-gray-200; // 定義済みクラスを使用
  }
}

# エラー例2
The `ease-out-quad` class does not exist

# 解決方法: カスタムクラスを標準クラスに変更
.btn-primary {
  @apply transition-colors duration-200 ease-out; // ease-out-quad → ease-out
}
```

#### Next.js Viewport警告
```bash
# エラー例
⚠ Unsupported metadata viewport is configured in metadata export

# 解決方法: app/layout.tsx でviewportを分離
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Go Recipi!',
  description: '...',
  // viewport: '...' // ← 削除
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
```

#### Firebase接続エラー
```bash
# エラー例
⨯ FirebaseError: Firebase: Error (auth/invalid-api-key).

# 解決方法1: .env.localファイル作成
touch .env.local

# 解決方法2: Firebase設定値記入
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# ... 他の設定値

# 解決方法3: 環境変数の確認
console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '設定済み' : '未設定',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '設定済み' : '未設定',
  // ...
});
```

### 12.2 デバッグ方法

```bash
# 開発サーバー詳細ログ
npm run dev -- --turbo

# 型チェック
npm run type-check

# ビルドテスト
npm run build
```

## 13. 保守・運用

### 13.1 ログ管理
```typescript
// src/lib/utils/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // Sentryにも送信
    Sentry.captureException(error || new Error(message));
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta);
  },
};
```

### 12.2 ヘルスチェック
```typescript
// src/app/api/health/route.ts
export async function GET() {
  try {
    // データベース接続チェック
    await checkFirestoreConnection();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    );
  }
}
```
