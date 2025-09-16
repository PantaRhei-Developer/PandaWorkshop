# Go Recipi! - 開発メモ

## 🚧 現在の開発ステータス

### **フェーズ1: フロントエンド実装完了** ✅

**完了日**: 2024年12月現在  
**状態**: **ログイン不要で全機能が動作**

#### 実装済み機能
- ✅ **UI/UX実装**: 全5画面の実装完了
- ✅ **デザインシステム**: 統一されたカラー・フォント・コンポーネント
- ✅ **レスポンシブデザイン**: PC/タブレット/モバイル対応
- ✅ **認証システム無効化**: 開発用にログイン不要設定
- ✅ **モックデータ対応**: バックエンド未実装でも動作

#### 動作確認済みページ
- `/` - ウェルカム画面（ログインなしでアクセス可能）
- `/recipe` - **レシピ生成画面**（メイン機能・モックデータで動作）
- `/settings` - 設定画面（モックデータで動作）
- `/history` - 履歴画面（モックデータで動作）
- `/login` - ログイン画面（表示のみ）

---

## 🔧 開発用設定の詳細

### **認証システム無効化**

```typescript
// app/components/auth/AuthGuard.tsx
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = false, // デフォルトで認証不要に変更
  redirectTo 
}) => {
  // 開発用：認証チェックをスキップして直接コンテンツを表示
  return <>{children}</>;
};
```

**変更箇所:**
- `AuthGuard.tsx`: 認証チェック完全無効化
- `page.tsx`: 認証状態チェック無効化
- `Header.tsx`: ログアウト機能無効化（ホーム遷移のみ）

### **モックデータ実装**

#### 1. 設定画面
```typescript
const mockUser = {
  displayName: 'テストユーザー',
  email: 'test@example.com',
  profile: {
    allergies: [],
    cookingTimePreference: 30,
    spiceLevel: 'normal',
    calorieTarget: 500,
    // ...
  }
};
```

#### 2. 履歴画面
```typescript
const mockMenus = [
  {
    id: 'mock-1',
    generatedAt: { toDate: () => new Date('2024-01-15') },
    usedIngredients: ['chicken', 'vegetables', 'rice'],
    // ...
  }
];
```

#### 3. レシピ画面
```typescript
const mockCategories = [
  { id: 'meat', name: '肉類', icon: '🥩' },
  { id: 'fish', name: '魚類', icon: '🐟' },
  // ...
];

const mockRecipes = [
  { id: 'recipe-1', name: '鶏肉の照り焼き弁当', cookingTime: 20 },
  // ...
];
```

---

## 🔄 バックエンド実装時の復元手順

### **フェーズ2: バックエンド実装**（予定）

#### 1. 認証システム復元
```typescript
// app/components/auth/AuthGuard.tsx
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, // 認証必須に戻す
  redirectTo 
}) => {
  const { user, loading } = useAuth(); // useAuth復活
  
  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo || '/login');
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);
  
  // 認証チェック復活
  if (loading) return <LoadingSpinner />;
  if (requireAuth && !user) return null;
  return <>{children}</>;
};
```

#### 2. Firebase設定復元
```typescript
// app/lib/firebase/config.ts  
// 現在の設定をコメントアウトから復元
const hasFirebaseConfig = Object.values(firebaseConfig).every(value => value);
if (!hasFirebaseConfig) {
  throw new Error('Firebase configuration is incomplete');
}
```

#### 3. API呼び出し復元
```typescript
// app/(main)/recipe/page.tsx
const generateRecipes = async () => {
  // モック処理を削除
  const response = await fetch('/api/recipes/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ingredients: selectedCategories.map(c => c.id),
    }),
  });
  // ...
};
```

#### 4. データベース連携復元
- Firebase Firestore接続
- ユーザーデータの実際の保存・取得
- レシピ履歴の実際の管理

---

## 📂 コードの構造と復元ポイント

### **無効化されたコード識別**

**検索パターン**: `🚧 開発用`でコメントアウトされた部分
```typescript
// 🚧 開発用：認証無効化中のため、ユーザーデータをモック
// const { user, loading } = useAuth();

/* バックエンド実装後に有効化
const response = await fetch('/api/recipes/generate', ...);
*/
```

### **復元対象ファイル**

| ファイル | 無効化内容 | 復元時の作業 |
|----------|------------|--------------|
| `AuthGuard.tsx` | 認証チェック全体 | useAuth復活、リダイレクト復活 |
| `Header.tsx` | ログアウト機能 | signOut復活 |
| `page.tsx` | 認証済みユーザーのリダイレクト | useAuth復活、条件分岐復活 |
| `settings/page.tsx` | ユーザーデータ取得・保存 | useUser復活、API呼び出し復活 |
| `history/page.tsx` | 履歴データ取得・操作 | Firebase API復活 |
| `recipe/page.tsx` | 食材・レシピAPI | useIngredients復活、API呼び出し復活 |

---

## 🧪 テスト項目

### **現在のフロントエンド機能テスト** ✅

- [x] ウェルカム画面表示
- [x] レシピ画面での食材選択
- [x] モックレシピ生成（2秒ローディング）
- [x] 設定画面でのフォーム操作
- [x] 履歴画面での操作
- [x] レスポンシブ動作
- [x] ページ間遷移

### **バックエンド実装後のテスト項目**（予定）

- [ ] ユーザー登録・ログイン
- [ ] 実際のレシピ生成API
- [ ] データベースへの保存・取得
- [ ] 認証が必要なページのリダイレクト
- [ ] エラーハンドリング

---

## 🚀 デプロイメント

### **現在の状態**（フロントエンドのみ）
```bash
# 開発サーバー
npm run dev

# 本番ビルド
npm run build
npm run start
```

### **バックエンド実装後**
- Firebase プロジェクト作成
- 環境変数設定（`.env.local`）
- Firestore Security Rules適用
- API Routes有効化

---

## 📝 開発メモ

### **決定事項**
1. **認証後回し**: UIを先に完成させ、後でバックエンド実装
2. **モックデータ活用**: 実際のデータがなくても動作確認可能
3. **段階的実装**: フェーズ1（フロント）→ フェーズ2（バック）

### **技術選択理由**
- **Next.js 14 App Router**: 最新のファイルベースルーティング
- **Firebase**: 認証とデータベースの統合ソリューション
- **Tailwind CSS**: 高速なスタイル開発
- **TypeScript**: 型安全性によるバグ削減

### **今後の改善予定**
- レシピ生成ロジックの高度化
- 栄養バランス計算の実装
- 食材の季節性考慮
- ユーザーレビュー機能

---

## 🏁 **現在の成果**

**✅ 完成度**: フロントエンド100%、バックエンド0%  
**✅ 動作確認**: 全ページでUI/UX動作確認済み  
**✅ 再現性**: 仕様書通りの実装完了  
**🚧 次フェーズ**: Firebase統合とAPI実装
