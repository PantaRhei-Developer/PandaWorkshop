# Go Recipi! - API仕様書

## 1. API概要

### 1.1 基本情報
- **ベースURL**: `https://your-domain.com/api`
- **プロトコル**: HTTPS
- **レスポンス形式**: JSON
- **文字エンコーディング**: UTF-8
- **認証方式**: Firebase ID Token（Bearer Token）

### 1.2 共通ヘッダー
```http
Content-Type: application/json
Authorization: Bearer <Firebase_ID_Token>
```

### 1.3 共通レスポンス形式
```typescript
// 成功レスポンス
{
  data: T;           // レスポンスデータ
  message?: string;  // 成功メッセージ
  timestamp: string; // ISO 8601形式のタイムスタンプ
}

// エラーレスポンス
{
  error: string;     // エラーメッセージ
  code?: string;     // エラーコード
  details?: any;     // 詳細情報
  timestamp: string; // ISO 8601形式のタイムスタンプ
}
```

## 2. 認証API

### 2.1 ユーザー登録
```http
POST /api/auth/register
```

**リクエストボディ**
```typescript
{
  email: string;        // メールアドレス
  password: string;     // パスワード（8文字以上）
  displayName: string;  // 表示名
}
```

**レスポンス**
```typescript
{
  data: {
    uid: string;
    email: string;
    displayName: string;
    idToken: string;
  },
  message: "User registered successfully"
}
```

**エラーレスポンス例**
```typescript
// 400 Bad Request
{
  error: "Invalid email format",
  code: "INVALID_EMAIL"
}

// 409 Conflict
{
  error: "Email already exists",
  code: "EMAIL_EXISTS"
}
```

### 2.2 ログイン
```http
POST /api/auth/login
```

**リクエストボディ**
```typescript
{
  email: string;
  password: string;
}
```

**レスポンス**
```typescript
{
  data: {
    uid: string;
    email: string;
    displayName: string;
    idToken: string;
    refreshToken: string;
  },
  message: "Login successful"
}
```

### 2.3 トークン更新
```http
POST /api/auth/refresh
```

**リクエストボディ**
```typescript
{
  refreshToken: string;
}
```

**レスポンス**
```typescript
{
  data: {
    idToken: string;
    refreshToken: string;
    expiresIn: number; // 秒数
  }
}
```

## 3. ユーザー管理API

### 3.1 ユーザープロフィール取得
```http
GET /api/user/profile
```

**レスポンス**
```typescript
{
  data: {
    uid: string;
    email: string;
    displayName: string;
    profileImageUrl?: string;
    profile: {
      allergies: string[];
      dislikedIngredients: string[];
      likedIngredients: string[];
      cookingTimePreference: number;
      spiceLevel: 'mild' | 'normal' | 'spicy' | 'extra_spicy';
      calorieTarget: number;
      storageDay: 3 | 5 | 7;
    };
    notifications: {
      push: {
        enabled: boolean;
        newRecipe: boolean;
        weeklyRecipe: boolean;
        updates: boolean;
        timeRange: {
          start: string;
          end: string;
        };
      };
      email: {
        enabled: boolean;
        frequency: 'daily' | 'weekly' | 'monthly' | 'never';
      };
    };
    createdAt: string;
    updatedAt: string;
  }
}
```

### 3.2 ユーザープロフィール更新
```http
PUT /api/user/profile
```

**リクエストボディ**
```typescript
{
  displayName?: string;
  profileImageUrl?: string;
  profile?: {
    allergies?: string[];
    dislikedIngredients?: string[];
    likedIngredients?: string[];
    cookingTimePreference?: number;
    spiceLevel?: 'mild' | 'normal' | 'spicy' | 'extra_spicy';
    calorieTarget?: number;
    storageDay?: 3 | 5 | 7;
  };
  notifications?: {
    push?: {
      enabled?: boolean;
      newRecipe?: boolean;
      weeklyRecipe?: boolean;
      updates?: boolean;
      timeRange?: {
        start?: string;
        end?: string;
      };
    };
    email?: {
      enabled?: boolean;
      frequency?: 'daily' | 'weekly' | 'monthly' | 'never';
    };
  };
}
```

**レスポンス**
```typescript
{
  data: User, // 更新後のユーザー情報
  message: "Profile updated successfully"
}
```

### 3.3 プロフィール画像アップロード
```http
POST /api/user/upload-image
Content-Type: multipart/form-data
```

**リクエストボディ**
```
image: File (JPEG, PNG, WebP, 最大5MB)
```

**レスポンス**
```typescript
{
  data: {
    imageUrl: string; // Firebase StorageのURL
  },
  message: "Image uploaded successfully"
}
```

## 4. 食材・レシピマスターAPI

### 4.1 食材カテゴリー一覧取得
```http
GET /api/ingredients/categories
```

**レスポンス**
```typescript
{
  data: {
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    color: string;
    order: number;
  }[]
}
```

### 4.2 食材一覧取得
```http
GET /api/ingredients?categoryId={categoryId}&search={searchTerm}
```

**クエリパラメータ**
- `categoryId` (optional): カテゴリーIDでフィルタ
- `search` (optional): 食材名での検索
- `limit` (optional): 取得件数制限（デフォルト: 50）
- `offset` (optional): オフセット（デフォルト: 0）

**レスポンス**
```typescript
{
  data: {
    items: {
      id: string;
      name: string;
      nameEn: string;
      categoryId: string;
      season?: string[];
      allergyInfo?: string[];
      nutritionPer100g: {
        calories: number;
        protein: number;
        fat: number;
        carbohydrate: number;
      };
    }[];
    total: number;
    limit: number;
    offset: number;
  }
}
```

### 4.3 レシピ検索
```http
GET /api/recipes/search
```

**クエリパラメータ**
- `ingredients` (required): 食材ID配列（カンマ区切り）
- `cookingTime` (optional): 最大調理時間（分）
- `spiceLevel` (optional): 辛さレベル
- `excludeAllergies` (optional): 除外するアレルギー食材（カンマ区切り）
- `limit` (optional): 取得件数制限（デフォルト: 20）

**レスポンス**
```typescript
{
  data: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    cookingTime: number;
    servings: number;
    difficulty: 'easy' | 'normal' | 'hard';
    spiceLevel: 'mild' | 'normal' | 'spicy' | 'extra_spicy';
    requiredIngredients: {
      ingredientId: string;
      amount: number;
      unit: string;
      isEssential: boolean;
    }[];
    nutrition: {
      calories: number;
      protein: number;
      fat: number;
      carbohydrate: number;
      salt: number;
    };
    tags: string[];
    matchScore: number; // 0-1の一致度スコア
  }[]
}
```

## 5. レシピ生成API

### 5.1 週間レシピ生成
```http
POST /api/recipes/generate
```

**リクエストボディ**
```typescript
{
  ingredients: string[];           // 使用する食材ID配列
  preferences?: {
    cookingTimeMax?: number;       // 最大調理時間
    spiceLevel?: string;           // 辛さレベル
    calorieTargetPerMeal?: number; // 1食あたりのカロリー目標
    avoidIngredients?: string[];   // 避けたい食材
  };
  regenerate?: boolean;            // 再生成フラグ
  previousMenuId?: string;         // 前回のメニューID（再生成時）
}
```

**レスポンス**
```typescript
{
  data: {
    id: string;
    userId: string;
    generatedAt: string;
    usedIngredients: string[];
    dailyRecipes: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    weeklyNutrition: {
      totalCalories: number;
      averageCaloriesPerDay: number;
      totalProtein: number;
      totalFat: number;
      totalCarbohydrate: number;
    };
    recipes: Recipe[]; // 詳細なレシピデータ
  },
  message: "Weekly recipes generated successfully"
}
```

**エラーレスポンス例**
```typescript
// 400 Bad Request - 食材不足
{
  error: "Insufficient ingredients to generate recipes",
  code: "INSUFFICIENT_INGREDIENTS",
  details: {
    minRequired: 3,
    provided: 1
  }
}

// 500 Internal Server Error - 生成失敗
{
  error: "Recipe generation failed",
  code: "GENERATION_FAILED"
}
```

### 5.2 レシピ詳細取得
```http
GET /api/recipes/{recipeId}
```

**レスポンス**
```typescript
{
  data: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    cookingTime: number;
    servings: number;
    difficulty: 'easy' | 'normal' | 'hard';
    spiceLevel: 'mild' | 'normal' | 'spicy' | 'extra_spicy';
    requiredIngredients: {
      ingredientId: string;
      ingredientName: string; // 食材名も含む
      amount: number;
      unit: string;
      isEssential: boolean;
    }[];
    steps: {
      order: number;
      description: string;
      imageUrl?: string;
      time?: number;
    }[];
    nutrition: {
      calories: number;
      protein: number;
      fat: number;
      carbohydrate: number;
      salt: number;
    };
    mealPrep: {
      isEnabled: boolean;
      storageDays: number;
      storageMethod: string;
      reheatingInstructions: string;
    };
    tags: string[];
  }
}
```

## 6. 履歴管理API

### 6.1 週間メニュー履歴一覧取得
```http
GET /api/history/weekly-menus
```

**クエリパラメータ**
- `limit` (optional): 取得件数制限（デフォルト: 20）
- `offset` (optional): オフセット（デフォルト: 0）
- `startDate` (optional): 開始日（YYYY-MM-DD形式）
- `endDate` (optional): 終了日（YYYY-MM-DD形式）
- `search` (optional): 検索キーワード
- `sortBy` (optional): ソート項目（created_at, accessed_at）
- `sortOrder` (optional): ソート順序（asc, desc）

**レスポンス**
```typescript
{
  data: {
    items: {
      id: string;
      generatedAt: string;
      usedIngredients: {
        id: string;
        name: string;
      }[];
      recipePreviews: {
        day: string;
        recipeName: string;
        imageUrl?: string;
      }[];
      userActions: {
        isFavorite: boolean;
        regenerationCount: number;
        lastAccessedAt?: string;
      };
    }[];
    total: number;
    limit: number;
    offset: number;
  }
}
```

### 6.2 週間メニュー詳細取得
```http
GET /api/history/weekly-menus/{menuId}
```

**レスポンス**
```typescript
{
  data: {
    id: string;
    userId: string;
    generatedAt: string;
    usedIngredients: {
      id: string;
      name: string;
    }[];
    dailyRecipes: {
      monday: Recipe;
      tuesday: Recipe;
      wednesday: Recipe;
      thursday: Recipe;
      friday: Recipe;
      saturday: Recipe;
      sunday: Recipe;
    };
    weeklyNutrition: {
      totalCalories: number;
      averageCaloriesPerDay: number;
      totalProtein: number;
      totalFat: number;
      totalCarbohydrate: number;
    };
    userActions: {
      isFavorite: boolean;
      regenerationCount: number;
      lastAccessedAt?: string;
      notes?: string;
    };
  }
}
```

### 6.3 週間メニュー削除
```http
DELETE /api/history/weekly-menus/{menuId}
```

**レスポンス**
```typescript
{
  message: "Weekly menu deleted successfully"
}
```

### 6.4 お気に入り設定
```http
POST /api/history/weekly-menus/{menuId}/favorite
```

**リクエストボディ**
```typescript
{
  isFavorite: boolean;
}
```

**レスポンス**
```typescript
{
  message: "Favorite status updated successfully"
}
```

### 6.5 履歴一括削除
```http
DELETE /api/history/weekly-menus
```

**リクエストボディ**
```typescript
{
  menuIds?: string[]; // 指定したIDのみ削除（未指定の場合は全削除）
  olderThan?: string; // 指定した日付より古いものを削除（YYYY-MM-DD形式）
}
```

**レスポンス**
```typescript
{
  data: {
    deletedCount: number;
  },
  message: "History deleted successfully"
}
```

## 7. エラーコード一覧

### 7.1 認証エラー（4xx）
| コード | HTTPステータス | 説明 |
|--------|----------------|------|
| UNAUTHORIZED | 401 | 認証が必要です |
| INVALID_TOKEN | 401 | トークンが無効です |
| TOKEN_EXPIRED | 401 | トークンの有効期限が切れています |
| FORBIDDEN | 403 | アクセス権限がありません |
| USER_NOT_FOUND | 404 | ユーザーが見つかりません |

### 7.2 バリデーションエラー（4xx）
| コード | HTTPステータス | 説明 |
|--------|----------------|------|
| VALIDATION_ERROR | 400 | 入力データが無効です |
| INVALID_EMAIL | 400 | メールアドレスの形式が無効です |
| WEAK_PASSWORD | 400 | パスワードが弱すぎます |
| EMAIL_EXISTS | 409 | メールアドレスが既に使用されています |
| INSUFFICIENT_INGREDIENTS | 400 | レシピ生成に必要な食材が不足しています |

### 7.3 サーバーエラー（5xx）
| コード | HTTPステータス | 説明 |
|--------|----------------|------|
| INTERNAL_SERVER_ERROR | 500 | 内部サーバーエラーが発生しました |
| DATABASE_ERROR | 500 | データベースエラーが発生しました |
| GENERATION_FAILED | 500 | レシピ生成に失敗しました |
| FILE_UPLOAD_FAILED | 500 | ファイルアップロードに失敗しました |
| SERVICE_UNAVAILABLE | 503 | サービスが一時的に利用できません |

## 8. レート制限

### 8.1 制限ルール
| エンドポイント | 制限 | ウィンドウ |
|----------------|------|-----------|
| `/api/auth/*` | 20回 | 15分 |
| `/api/recipes/generate` | 10回 | 1時間 |
| `/api/user/*` | 100回 | 15分 |
| その他のエンドポイント | 200回 | 15分 |

### 8.2 レート制限ヘッダー
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### 8.3 制限超過時のレスポンス
```typescript
// 429 Too Many Requests
{
  error: "Rate limit exceeded",
  code: "RATE_LIMIT_EXCEEDED",
  details: {
    limit: 100,
    remaining: 0,
    resetTime: "2024-01-01T00:00:00Z"
  }
}
```

## 9. Webhooks

### 9.1 ユーザー登録通知
```http
POST {your_webhook_url}/user-registered
```

**ペイロード**
```typescript
{
  event: "user.registered";
  data: {
    uid: string;
    email: string;
    displayName: string;
    registeredAt: string;
  };
  timestamp: string;
}
```

### 9.2 レシピ生成完了通知
```http
POST {your_webhook_url}/recipe-generated
```

**ペイロード**
```typescript
{
  event: "recipe.generated";
  data: {
    userId: string;
    menuId: string;
    ingredients: string[];
    generatedAt: string;
  };
  timestamp: string;
}
```

## 10. API使用例

### 10.1 レシピ生成フロー（JavaScript）
```javascript
// 1. 認証
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { data: authData } = await loginResponse.json();

// 2. 食材取得
const ingredientsResponse = await fetch('/api/ingredients?categoryId=meat', {
  headers: { 'Authorization': `Bearer ${authData.idToken}` }
});
const { data: ingredients } = await ingredientsResponse.json();

// 3. レシピ生成
const generateResponse = await fetch('/api/recipes/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authData.idToken}`
  },
  body: JSON.stringify({
    ingredients: ['chicken_breast', 'broccoli', 'rice']
  })
});
const { data: weeklyMenu } = await generateResponse.json();

console.log('Generated weekly menu:', weeklyMenu);
```

### 10.2 エラーハンドリング例
```javascript
async function apiCall(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new APIError(data.error, response.status, data.code);
    }
    
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      // APIエラーの処理
      console.error('API Error:', error.message, error.code);
    } else {
      // ネットワークエラーなど
      console.error('Network Error:', error.message);
    }
    throw error;
  }
}

class APIError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
```
