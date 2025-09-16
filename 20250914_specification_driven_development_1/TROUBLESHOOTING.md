# Go Recipi! - トラブルシューティングガイド

## 🚨 緊急対応

### 開発サーバーが起動しない

#### 1. Next.js設定エラー

**症状**:
```bash
⚠ Invalid next.config.js options detected: 
⚠     Unrecognized key(s) in object: 'appDir' at "experimental"
```

**原因**: Next.js 14では`experimental.appDir`は不要
**解決方法**:
```javascript
// next.config.js
const nextConfig = {
  // experimental: { appDir: true }, // ← この行を削除
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

#### 2. CSS クラスエラー  

**症状**:
```bash
Syntax error: The `border-border` class does not exist.
```

**原因**: 未定義のTailwindクラス使用
**解決方法**:
```css
/* app/globals.css */
@layer base {
  * {
    @apply border-gray-200; /* 定義済みクラスに変更 */
  }
}
```

**症状**:
```bash
Syntax error: The `ease-out-quad` class does not exist.
```

**原因**: カスタムtransition timing functionが未定義
**解決方法**:
```css
/* app/globals.css - カスタムクラスを標準クラスに変更 */
.btn-primary {
  @apply transition-colors duration-200 ease-out; /* ease-out-quad → ease-out */
}
```

## 🔧 一般的な問題

### Firebase関連

#### 1. Firebase APIキーエラー

**症状**: 
```bash
⨯ FirebaseError: Firebase: Error (auth/invalid-api-key).
```

**原因**: `.env.local`ファイルが存在しないか、Firebase設定が無効
**解決方法**:

1. **`.env.local`ファイルの作成**:
```bash
# プロジェクトルートに .env.local ファイルを作成
touch .env.local
```

2. **Firebase設定の記入**:
```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----"

NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Firebase Console で設定値取得**:
   - [Firebase Console](https://console.firebase.google.com/)
   - プロジェクト設定 > 全般タブ > アプリ
   - サービスアカウントキーをダウンロード

#### 2. 認証エラー

**症状**: 「Invalid token」エラー
**解決方法**:
1. `.env.local`の設定確認
2. Firebase Console で設定値を再確認
3. ブラウザのキャッシュクリア

#### 2. Firestore接続エラー

**症状**: 「Permission denied」エラー  
**解決方法**:
1. Firestore Security Rules の確認
2. 認証状態の確認
3. コレクション・ドキュメントパスの確認

### TypeScript関連

#### 1. 型エラー

**症状**: 型の不一致エラー
**解決方法**:
```bash
# 型チェック実行
npm run type-check

# 型定義の再生成
rm -rf .next && npm run dev
```

#### 2. import エラー

**症状**: モジュールが見つからない
**解決方法**:
```typescript
// tsconfig.json の paths 設定確認
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./app/*"]
    }
  }
}
```

## 🐛 デバッグ手順

### 1. 環境確認

```bash
# Node.js バージョン確認
node --version  # 18以上推奨

# 依存関係確認  
npm list --depth=0

# キャッシュクリア
rm -rf .next node_modules package-lock.json
npm install
```

### 2. ログ確認

```bash
# 詳細ログで起動
npm run dev -- --turbo

# ビルドログ
npm run build

# ESLintチェック
npm run lint
```

### 3. Firebase設定確認

```javascript
// デバッグ用コード (一時的に追加)
console.log('Environment Variables:', {
  NODE_ENV: process.env.NODE_ENV,
  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓' : '✗',
  FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓' : '✗',
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓' : '✗',
});
```

## 📋 チェックリスト

### 開発開始前の確認事項

- [ ] Node.js 18以上がインストール済み
- [ ] `.env.local` ファイルが正しく設定済み  
- [ ] Firebase プロジェクトが作成済み
- [ ] 必要なFirebase サービスが有効化済み
  - [ ] Authentication
  - [ ] Firestore Database  
  - [ ] Storage

### エラー発生時の確認事項

- [ ] ターミナルエラーメッセージの確認
- [ ] ブラウザ Developer Tools のコンソール確認
- [ ] Firebase Console での設定値確認
- [ ] `.env.local` ファイルの存在と内容確認

## 🔍 よくある質問

### Q: 「Module not found」エラーが発生する

**A**: インポートパスを確認してください
```typescript
// ❌ 間違い
import { Button } from '../../../components/ui/Button'

// ✅ 正しい  
import Button from '@/components/ui/Button'
```

### Q: スタイルが反映されない

**A**: Tailwind CSSの設定を確認
1. `tailwind.config.js` の content 設定
2. `globals.css` の @tailwind ディレクティブ
3. PostCSS設定

### Q: Firebase 認証がうまくいかない

**A**: 以下を順番に確認
1. Firebase Console での認証方法有効化
2. 許可ドメインの設定
3. 環境変数の設定
4. ネットワーク接続

## 💡 パフォーマンス向上のヒント

### 1. 開発環境

```bash
# Turbo 使用で高速化
npm run dev -- --turbo

# 並列ビルド
npm run build -- --experimental-build-mode=compile
```

### 2. メモリ使用量削減

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  }
}
```

## 🆘 それでも解決しない場合

1. **GitHub Issues** で問題を報告
2. 以下の情報を含めてください：
   - OS とバージョン
   - Node.js バージョン  
   - エラーメッセージ全文
   - 実行したコマンド
   - 環境変数設定状況（秘匿情報は除く）

### 報告テンプレート

```markdown
## 環境情報
- OS: 
- Node.js: 
- npm: 

## 発生したエラー
```bash
[エラーメッセージをここに貼り付け]
```

## 実行したコマンド
```bash
[実行したコマンドを記載]
```

## 追加情報
[その他関連する情報]
```
