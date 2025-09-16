# Go Recipi! - デザインシステム

## 1. カラーパレット

### 1.1 プライマリーカラー
```scss
// メインオレンジ
$primary-main: #FF6B35;      // RGB(255, 107, 53)
$primary-dark: #E5522A;      // ホバー、アクティブ状態
$primary-light: #FFA07A;     // 背景グラデーション
$primary-bg: #FFF5F2;        // 薄い背景色

// グレースケール
$gray-50: #F8F9FA;          // 画面背景
$gray-100: #F0F0F0;         // カード背景
$gray-200: #E5E5E5;         // ボーダー
$gray-300: #DDD;            // 入力欄ボーダー
$gray-400: #CCC;            // 無効状態
$gray-500: #888;            // 補助テキスト
$gray-600: #666;            // サブテキスト
$gray-700: #333;            // メインテキスト

// システムカラー
$success: #28A745;          // 成功
$error: #E74C3C;            // エラー
$warning: #FFC107;          // 警告
$info: #17A2B8;             // 情報

// 背景色
$bg-white: #FFFFFF;         // 白背景
$bg-error: #FFF5F5;         // エラー背景
$bg-error-border: #FEB2B2;  // エラーボーダー
```

### 1.2 グラデーション定義
```scss
$gradient-primary: linear-gradient(135deg, #FF6B35 0%, #FFA07A 100%);
$gradient-overlay: rgba(255, 255, 255, 0.1);
```

## 2. タイポグラフィ

### 2.1 フォント設定
```scss
// フォントファミリー
$font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;

// フォントサイズ（基準: 16px = 1rem）
$font-size-xs: 0.75rem;     // 12px
$font-size-sm: 0.875rem;    // 14px
$font-size-base: 1rem;      // 16px
$font-size-lg: 1.125rem;    // 18px
$font-size-xl: 1.25rem;     // 20px
$font-size-2xl: 1.5rem;     // 24px
$font-size-3xl: 1.875rem;   // 30px
$font-size-4xl: 2.25rem;    // 36px
$font-size-5xl: 3rem;       // 48px

// 行間
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.6;

// フォントウェイト
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### 2.2 テキストスタイル定義
```scss
// 見出し
.heading-1 { font-size: $font-size-5xl; font-weight: $font-weight-bold; line-height: $line-height-tight; color: $primary-main; }
.heading-2 { font-size: $font-size-3xl; font-weight: $font-weight-bold; line-height: $line-height-tight; color: $gray-700; }
.heading-3 { font-size: $font-size-2xl; font-weight: $font-weight-semibold; line-height: $line-height-normal; color: $gray-700; }

// 本文
.body-large { font-size: $font-size-lg; font-weight: $font-weight-normal; line-height: $line-height-relaxed; color: $gray-600; }
.body-base { font-size: $font-size-base; font-weight: $font-weight-normal; line-height: $line-height-relaxed; color: $gray-600; }
.body-small { font-size: $font-size-sm; font-weight: $font-weight-normal; line-height: $line-height-normal; color: $gray-500; }

// キャプション
.caption { font-size: $font-size-xs; font-weight: $font-weight-normal; line-height: $line-height-normal; color: $gray-500; }
```

## 3. スペーシング

### 3.1 スペーシングスケール
```scss
$spacing-0: 0;           // 0px
$spacing-1: 0.25rem;     // 4px
$spacing-2: 0.5rem;      // 8px
$spacing-3: 0.75rem;     // 12px
$spacing-4: 1rem;        // 16px
$spacing-5: 1.25rem;     // 20px
$spacing-6: 1.5rem;      // 24px
$spacing-8: 2rem;        // 32px
$spacing-10: 2.5rem;     // 40px
$spacing-12: 3rem;       // 48px
$spacing-16: 4rem;       // 64px
$spacing-20: 5rem;       // 80px
```

## 4. コンポーネント仕様

### 4.1 ボタン
```scss
// プライマリーボタン
.btn-primary {
  background: $primary-main;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  padding: 12px 24px;
  transition: background-color 0.2s ease;
  
  &:hover { background: $primary-dark; }
  &:disabled { background: $gray-400; cursor: not-allowed; }
}

// セカンダリーボタン
.btn-secondary {
  background: white;
  color: $primary-main;
  border: 2px solid $primary-main;
  border-radius: 6px;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  padding: 10px 22px; // ボーダー分調整
  transition: background-color 0.2s ease;
  
  &:hover { background: $primary-bg; }
}
```

### 4.2 入力フィールド
```scss
.input-field {
  width: 100%;
  height: 48px;
  border: 1px solid $gray-300;
  border-radius: 4px;
  padding: 12px;
  font-size: $font-size-base;
  color: $gray-700;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: $primary-main;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
  
  &.error {
    border-color: $error;
  }
  
  &:disabled {
    background: $gray-100;
    color: $gray-500;
    cursor: not-allowed;
  }
}
```

### 4.3 カード
```scss
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    transition: all 0.2s ease;
  }
}
```

## 5. アニメーション・トランジション

### 5.1 イージング関数
```scss
$ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
$ease-in-quad: cubic-bezier(0.55, 0.085, 0.68, 0.53);
$ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955);
```

### 5.2 アニメーション定義
```scss
// フェードイン
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s $ease-out-quad;
}

// ステージドアニメーション（カード表示用）
.staggered-fade-in {
  animation: fadeIn 0.4s $ease-out-quad forwards;
  opacity: 0;
  
  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }
  &:nth-child(5) { animation-delay: 0.4s; }
  &:nth-child(6) { animation-delay: 0.5s; }
  &:nth-child(7) { animation-delay: 0.6s; }
}

// ローディングスピナー
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

## 6. レスポンシブブレークポイント

### 6.1 ブレークポイント定義
```scss
$breakpoints: (
  mobile: 767px,
  tablet: 1023px,
  desktop: 1024px,
  large: 1440px
);

// メディアクエリMixin
@mixin mobile {
  @media (max-width: #{map-get($breakpoints, mobile)}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{map-get($breakpoints, mobile) + 1px}) and (max-width: #{map-get($breakpoints, tablet)}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{map-get($breakpoints, desktop)}) {
    @content;
  }
}
```

## 7. エラー表示統一仕様

### 7.1 エラーメッセージ表示
```scss
.error-message {
  color: $error;
  font-size: $font-size-xs;
  margin-top: $spacing-1;
  display: flex;
  align-items: center;
  gap: $spacing-1;
  
  &::before {
    content: "⚠️";
    font-size: $font-size-sm;
  }
}

.error-banner {
  background: $bg-error;
  border: 1px solid $bg-error-border;
  border-radius: 6px;
  padding: $spacing-4;
  color: $error;
  font-size: $font-size-sm;
  margin-bottom: $spacing-6;
}
```

### 7.2 トースト通知
```scss
.toast {
  position: fixed;
  top: $spacing-6;
  right: $spacing-6;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: $spacing-4;
  max-width: 400px;
  z-index: 1000;
  
  &.success { border-left: 4px solid $success; }
  &.error { border-left: 4px solid $error; }
  &.warning { border-left: 4px solid $warning; }
  &.info { border-left: 4px solid $info; }
}
```

## 8. 使用例

### 8.1 ボタンの実装例
```jsx
// プライマリーボタン
<button className="btn-primary">
  Go Recipi!
</button>

// ローディング状態
<button className="btn-primary" disabled>
  <span className="spinner"></span>
  生成中...
</button>
```

### 8.2 フォームの実装例
```jsx
<div className="form-group">
  <label className="body-small">メールアドレス</label>
  <input 
    className="input-field" 
    type="email" 
    placeholder="example@email.com" 
  />
  <div className="error-message">
    メールアドレスの形式が正しくありません
  </div>
</div>
```
