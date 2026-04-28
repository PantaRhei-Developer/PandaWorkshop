# Go Recipi! - データベース設計書

## 1. 設計概要

### 1.1 データベース種別
- **種別**: Firebase Firestore（NoSQLドキュメントデータベース）
- **理由**: リアルタイム更新、スケーラビリティ、Firebase Authenticationとの親和性

### 1.2 設計原則
- **非正規化**: 読み取りパフォーマンス優先
- **セキュリティルール**: Firestore Security Rulesによるアクセス制御
- **インデックス**: クエリパフォーマンス最適化
- **データ構造**: フラットな構造を基本とし、必要に応じてサブコレクションを使用

## 2. コレクション設計

### 2.1 usersコレクション
ユーザーの基本情報とプロフィール設定を管理

```typescript
interface User {
  uid: string;                    // Firebase Auth UID（ドキュメントID）
  email: string;                  // メールアドレス
  displayName: string;            // 表示名
  profileImageUrl?: string;       // プロフィール画像URL（Firebase Storage）
  createdAt: Timestamp;           // アカウント作成日時
  updatedAt: Timestamp;           // 最終更新日時
  isActive: boolean;              // アカウント有効フラグ
  
  // プロフィール設定
  profile: {
    allergies: string[];          // アレルギー情報
    dislikedIngredients: string[]; // 嫌いな食材
    likedIngredients: string[];   // 好きな食材
    cookingTimePreference: number; // 希望調理時間（分）
    spiceLevel: 'mild' | 'normal' | 'spicy' | 'extra_spicy'; // 辛さレベル
    calorieTarget: number;        // 1食あたりのカロリー目標
    storageDay: 3 | 5 | 7;        // 作り置き保存日数
  };
  
  // 通知設定
  notifications: {
    push: {
      enabled: boolean;
      newRecipe: boolean;
      weeklyRecipe: boolean;
      updates: boolean;
      timeRange: {
        start: string;            // "09:00"
        end: string;              // "21:00"
      };
    };
    email: {
      enabled: boolean;
      frequency: 'daily' | 'weekly' | 'monthly' | 'never';
    };
  };
}
```

### 2.2 ingredientCategoriesコレクション
食材カテゴリーのマスターデータ

```typescript
interface IngredientCategory {
  id: string;                     // カテゴリーID
  name: string;                   // カテゴリー名（例: "肉類"）
  nameEn: string;                 // 英語名（例: "meat"）
  icon: string;                   // アイコン文字（例: "🥩"）
  color: string;                  // カテゴリーカラー（例: "#FF6B35"）
  order: number;                  // 表示順序
  isActive: boolean;              // 有効フラグ
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2.3 ingredientsコレクション
具体的な食材データ

```typescript
interface Ingredient {
  id: string;                     // 食材ID
  name: string;                   // 食材名（例: "鶏むね肉"）
  nameEn: string;                 // 英語名（例: "chicken_breast"）
  categoryId: string;             // カテゴリーID（ingredientCategoriesへの参照）
  season?: string[];              // 旬の季節（例: ["spring", "summer"]）
  storageMethod: string;          // 保存方法（例: "refrigerator"）
  storageDays: number;            // 保存可能日数
  allergyInfo?: string[];         // アレルギー情報
  nutritionPer100g: {            // 100gあたりの栄養素
    calories: number;             // カロリー
    protein: number;              // タンパク質（g）
    fat: number;                  // 脂質（g）
    carbohydrate: number;         // 炭水化物（g）
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2.4 recipesコレクション
レシピのマスターデータ

```typescript
interface Recipe {
  id: string;                     // レシピID
  name: string;                   // レシピ名
  description: string;            // 説明
  imageUrl?: string;              // レシピ画像URL
  cookingTime: number;            // 調理時間（分）
  servings: number;               // 何人分
  difficulty: 'easy' | 'normal' | 'hard'; // 難易度
  spiceLevel: 'mild' | 'normal' | 'spicy' | 'extra_spicy';
  
  // 必要な食材
  requiredIngredients: {
    ingredientId: string;         // 食材ID
    amount: number;               // 必要量
    unit: string;                 // 単位（g, ml, 個など）
    isEssential: boolean;         // 必須フラグ
  }[];
  
  // 調理手順
  steps: {
    order: number;                // 手順番号
    description: string;          // 手順説明
    imageUrl?: string;            // 手順画像URL（オプション）
    time?: number;                // この手順にかかる時間（分）
  }[];
  
  // 栄養情報（1人分）
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrate: number;
    salt: number;                 // 塩分（g）
  };
  
  // 作り置き情報
  mealPrep: {
    isEnabled: boolean;           // 作り置き可能フラグ
    storageDays: number;          // 保存可能日数
    storageMethod: string;        // 保存方法
    reheatingInstructions: string; // 温め直し方法
  };
  
  tags: string[];                 // タグ（例: ["和食", "低糖質", "時短"]）
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // メタデータ
  metadata: {
    authorId?: string;            // 作成者ID（システム管理者用）
    source?: string;              // レシピソース
    rating?: number;              // 評価（将来拡張用）
    viewCount: number;            // 表示回数
    generationCount: number;      // 生成回数
  };
}
```

### 2.5 weeklyMenusコレクション
ユーザーが生成した週間メニューの履歴

```typescript
interface WeeklyMenu {
  id: string;                     // メニューID
  userId: string;                 // ユーザーID
  generatedAt: Timestamp;         // 生成日時
  usedIngredients: string[];      // 使用した食材ID配列
  
  // 各曜日のレシピ
  dailyRecipes: {
    monday: string;               // レシピID
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  
  // 週間栄養サマリー
  weeklyNutrition: {
    totalCalories: number;        // 週間総カロリー
    averageCaloriesPerDay: number; // 1日平均カロリー
    totalProtein: number;         // 週間総タンパク質
    totalFat: number;             // 週間総脂質
    totalCarbohydrate: number;    // 週間総炭水化物
  };
  
  // ユーザーアクション
  userActions: {
    isFavorite: boolean;          // お気に入りフラグ
    regenerationCount: number;    // 再生成回数
    lastAccessedAt?: Timestamp;   // 最終アクセス日時
    notes?: string;               // メモ（将来拡張用）
  };
  
  isDeleted: boolean;             // 論理削除フラグ
  deletedAt?: Timestamp;          // 削除日時
}
```

### 2.6 generationLogsコレクション
レシピ生成のログデータ（分析・改善用）

```typescript
interface GenerationLog {
  id: string;                     // ログID
  userId: string;                 // ユーザーID
  timestamp: Timestamp;           // 生成日時
  inputIngredients: string[];     // 入力食材ID配列
  generatedRecipes: string[];     // 生成されたレシピID配列
  generationTime: number;         // 生成にかかった時間（ミリ秒）
  userPreferences: {             // 生成時のユーザー設定
    cookingTime: number;
    spiceLevel: string;
    calorieTarget: number;
    allergies: string[];
    dislikedIngredients: string[];
  };
  success: boolean;               // 成功フラグ
  errorMessage?: string;          // エラーメッセージ（失敗時）
}
```

## 3. セキュリティルール

### 3.1 基本原則
- ユーザーは自分のデータのみアクセス可能
- マスターデータ（ingredients, recipes等）は読み取り専用
- 管理者のみマスターデータの更新が可能

### 3.2 Firestore Security Rules例

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーデータ: 本人のみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 週間メニュー: 本人のみ読み書き可能
    match /weeklyMenus/{menuId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // マスターデータ: 認証済みユーザーは読み取りのみ可能
    match /ingredientCategories/{categoryId} {
      allow read: if request.auth != null;
    }
    
    match /ingredients/{ingredientId} {
      allow read: if request.auth != null;
    }
    
    match /recipes/{recipeId} {
      allow read: if request.auth != null;
    }
    
    // 生成ログ: システムのみ書き込み可能、本人は読み取り可能
    match /generationLogs/{logId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## 4. インデックス設計

### 4.1 必要なコンポジットインデックス

```typescript
// weeklyMenusコレクション
// ユーザー別、生成日時順での取得用
{
  collection: 'weeklyMenus',
  fields: [
    { fieldPath: 'userId', order: 'ASCENDING' },
    { fieldPath: 'generatedAt', order: 'DESCENDING' }
  ]
}

// 削除されていないメニューの取得用
{
  collection: 'weeklyMenus',
  fields: [
    { fieldPath: 'userId', order: 'ASCENDING' },
    { fieldPath: 'isDeleted', order: 'ASCENDING' },
    { fieldPath: 'generatedAt', order: 'DESCENDING' }
  ]
}

// ingredientsコレクション
// カテゴリー別、アクティブフラグでの取得用
{
  collection: 'ingredients',
  fields: [
    { fieldPath: 'categoryId', order: 'ASCENDING' },
    { fieldPath: 'isActive', order: 'ASCENDING' }
  ]
}

// recipesコレクション
// 必要食材での検索用
{
  collection: 'recipes',
  fields: [
    { fieldPath: 'requiredIngredients.ingredientId', order: 'ASCENDING' },
    { fieldPath: 'isActive', order: 'ASCENDING' }
  ]
}
```

## 5. データ移行・シード戦略

### 5.1 初期データ投入順序
1. `ingredientCategories` - 食材カテゴリー
2. `ingredients` - 食材マスター
3. `recipes` - レシピマスター
4. 管理者ユーザー作成

### 5.2 サンプルデータ
- 食材カテゴリー: 8カテゴリー
- 食材マスター: 各カテゴリー10-20品目（合計100-150品目）
- レシピマスター: 初期50-100レシピ

## 6. バックアップ・復旧戦略

### 6.1 自動バックアップ
- Firebase Firestoreの自動バックアップ機能を有効化
- 日次バックアップの実行
- 保持期間: 30日間

### 6.2 災害復旧
- 複数リージョンでのレプリケーション
- 重要データの定期エクスポート
- 復旧手順書の作成・維持

## 7. パフォーマンス最適化

### 7.1 読み取り最適化
- 非正規化によるJOIN処理の回避
- 必要な情報を1回のクエリで取得
- キャッシュ戦略の実装（クライアントサイド）

### 7.2 書き込み最適化
- バッチ処理の活用（複数ドキュメントの同時更新）
- トランザクション処理の適切な使用
- 不要な更新の回避（差分チェック）

## 8. 監視・メンテナンス

### 8.1 監視項目
- 読み取り/書き込み操作数
- レスポンス時間
- エラー率
- ストレージ使用量

### 8.2 定期メンテナンス
- 削除データのクリーンアップ（論理削除→物理削除）
- 使用頻度の低いデータのアーカイブ化
- インデックスの最適化
