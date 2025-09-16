# Go Recipi! - お弁当の献立を考えてくれるアプリ

冷蔵庫の食材から1週間分の作り置きレシピを提案するWebアプリケーションです。

## 🌟 主な機能

- **食材選択**: カテゴリーから食材を選択
- **レシピ生成**: 選択した食材を基に1週間分のレシピを自動生成
- **ユーザー管理**: メールアドレスによる認証とプロフィール管理
- **履歴管理**: 過去に生成したレシピの保存・検索
- **設定機能**: アレルギー情報や好みの設定

## 🚧 開発ステータス

**現在の状態**: フロントエンド実装完了（**ログイン不要で動作**）

- ✅ UI/UX実装完了（全画面）
- ✅ レスポンシブデザイン対応
- ✅ デザインシステム適用
- 🚧 **認証システム無効化中**（後で実装）
- 🚧 **バックエンド機能モック化**（後で実装）

### 🔧 開発用設定

**認証不要**: 現在はログインなしで全ての画面にアクセス可能
- `/` - ウェルカム画面
- `/recipe` - レシピ生成画面（**メイン機能**）
- `/settings` - 設定画面（モックデータ使用）
- `/history` - 履歴画面（モックデータ使用）
- `/login` - ログイン画面（表示のみ）

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript
- **スタイリング**: Tailwind CSS
- **認証・データベース**: Firebase (Auth, Firestore, Storage) - **後で実装**
- **フォーム管理**: React Hook Form
- **データ取得**: SWR
- **アニメーション**: Framer Motion

## 🚀 セットアップ

### 1. プロジェクトのクローン

```bash
git clone <repository-url>
cd go-recipi
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 （または http://localhost:3001）でアプリにアクセスできます。

### 4. Firebase設定（オプション・後で実装）

現在は **Firebase設定なしで動作** しますが、将来的に以下が必要になります：

**重要**: アプリを動作させるには`.env.local`ファイルが必要です。

```bash
# .env.localファイルを作成
touch .env.local
```

以下の内容を`.env.local`に記入してください（**実際の値に置き換え**）:

```env
# Firebase Configuration (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Configuration (Server - Admin SDK)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----"

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Firebase プロジェクトの設定（後で実装）

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Authentication, Firestore, Storage を有効化
3. Web アプリを追加し、設定値を `.env.local` に記入
4. サービスアカウントキーを生成し、環境変数に設定

## 📁 プロジェクト構成

```
app/
├── (auth)/          # 認証関連画面（後で実装）
├── (main)/          # メイン機能画面  
├── api/             # API Routes（後で実装）
├── components/      # 再利用可能コンポーネント
├── hooks/           # カスタムフック
├── lib/             # ユーティリティ・設定
├── types/           # TypeScript型定義
└── globals.css      # グローバルスタイル

docs/               # 設計ドキュメント
├── 00_design_system.md
├── 01_overview.md
├── 02_requirements.md
├── 03_screens/
├── 04_database_design.md
├── 05_technical_specifications.md
└── 06_api_specifications.md
```

## 🎨 デザインシステム

- **プライマリーカラー**: #FF6B35 (オレンジ)
- **フォント**: システムフォント
- **コンポーネント**: 統一されたUI・UXガイドライン

詳細は `docs/00_design_system.md` を参照してください。

## 🔒 セキュリティ（後で実装）

- Firebase Authentication による認証
- Firestore Security Rules による認可
- CSP (Content Security Policy) の設定
- API レート制限の実装

## 📱 レスポンシブ対応

- **モバイル**: 767px以下
- **タブレット**: 768px〜1023px  
- **デスクトップ**: 1024px以上

## 🧪 テスト

```bash
# ユニットテスト
npm run test

# E2Eテスト  
npm run test:e2e

# 型チェック
npm run type-check
```

## 🚢 デプロイ

### Vercel (推奨)

```bash
npm run build
npm run deploy
```

### Firebase Hosting

```bash
firebase deploy
```

## 📋 開発時の注意点

1. **認証**: 現在は無効化中（後で有効化）
2. **エラーハンドリング**: 統一されたエラー表示形式
3. **パフォーマンス**: 画像最適化とコード分割
4. **アクセシビリティ**: WAI-ARIAガイドラインの遵守

## 🛠️ トラブルシューティング

### よくある問題と解決方法

#### 1. 開発サーバー起動時のエラー

**問題**: `npm run dev` 実行時にCSSエラーが発生
```
The `border-border` class does not exist
```

**解決方法**: `app/globals.css`で未定義のクラス使用が原因。以下を確認：
```css
/* ❌ 間違い */
@apply border-border;

/* ✅ 正しい */
@apply border-gray-200;
```

**問題**: Next.js設定の警告
```
Invalid next.config.js options detected: 'appDir' at "experimental"
```

**解決方法**: Next.js 14では`experimental.appDir`は不要。`next.config.js`から削除。

#### 2. Firebase接続エラー

**問題**: Firebase初期化エラー
```
Firebase configuration object is invalid
```

**解決方法**: 
1. `.env.local`ファイルの環境変数を確認
2. Firebase Console で設定値を再確認
3. ファイアウォール・プロキシ設定を確認

#### 3. 型エラー

**問題**: TypeScript型エラー
```
Type 'undefined' is not assignable to type 'User'
```

**解決方法**:
```bash
npm run type-check  # 型チェック実行
```

### ログ確認方法

```bash
# 開発サーバーログ
npm run dev

# ビルドログ
npm run build

# 型チェックログ  
npm run type-check
```

## 🤝 コントリビューション

1. フィーチャーブランチを作成
2. 変更をコミット
3. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🆘 サポート

問題が発生した場合は、以下の情報と共にGitHub Issues で報告してください：
- エラーメッセージ全文
- 実行環境（Node.js版、OS）
- 実行したコマンド
- `.env.local`の設定状況（秘匿情報は除く）