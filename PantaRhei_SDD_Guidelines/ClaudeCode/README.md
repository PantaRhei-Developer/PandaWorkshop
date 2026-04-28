# Claude Code 運用ガイドライン

PantaRhei社内における Claude Code の標準セットアップと、プロジェクト種別ごとの技術スタックを定めます。

`Claude.md` のテンプレートは [Claude.example.md](./Claude.example.md) を参照してください。

---

# プロジェクト種別ごとの技術スタック

## インフラ開発

TBD

## Web開発（アプリ）

TBD

## Web開発（ホームページ）

| 項目 | 技術 |
| :---: | :---: |
| フレームワーク | React.js, Next.js, TypeScript |
| ホスティング | Vercel |
| CMS | microCMS |
| E2Eテスト | Playwright |

### レンダリング戦略: SSG + ISR

- **基本 (SSG)**: 「会社概要」「サービス紹介」など更新頻度が低いページはSSGにし、CDNから高速配信する。
- **更新頻度が高い部分 (ISR)**: 「お知らせ」「ブログ」などmicroCMSで頻繁に更新するページは ISR (Incremental Static Regeneration) を採用する。

### 仕様書ディレクトリ構成

```
/docs
├── structure.md
└── spec/
    ├── components/
    ├── screens/
    ├── models/
    ├── services/
    ├── themes/
    ├── repositories/
    ├── providers/
    └── tests/
```

## ネイティブアプリ開発

TBD

---

# MCP

社内標準として以下3つのMCPサーバーを導入します。いずれもOSSです。

| ツール | 役割 |
| --- | --- |
| [Context7](https://github.com/upstash/context7) | ライブラリの最新ドキュメントをリアルタイム取得 |
| [Serena](https://github.com/oraios/serena) | LSPベースのコード解析（シンボル参照・リネーム等のIDE機能） |
| [Cipher](https://github.com/campfirein/cipher) | SQLiteによるローカルメモリ層（セッション横断の知識蓄積） |

**参考リンク:**
- [Claude Codeを実際のプロジェクトにうまく適用させていくTips10選](https://qiita.com/nokonoko_1203/items/67f8692a0a3ca7e621f3)
- [Claude Code MCP Serena & Cipher 導入ガイド](https://zenn.dev/aki1990/articles/a7db63dbc99848)

## 導入手順

### Step 1: 前提ツールの確認

ターミナルで以下を実行し、すべてバージョンが表示されることを確認します。

```bash
node --version   # Node.js — Context7 / Cipher で使用
npm --version
uvx --version    # uv — Serena で使用
```

未インストールの場合：

- **Node.js**: https://nodejs.org からインストール
- **uv（uvxを含む）**: `curl -LsSf https://astral.sh/uv/install.sh | sh`

### Step 2: Cipher のグローバルインストール

Context7 と Serena は JSON 設定だけで動作しますが、Cipher のみ事前のCLIインストールが必要です。

```bash
npm install -g @byterover/cipher
```

### Step 3: 設定ファイルへの追記

設定ファイルの選び方：

| ファイル | 適用範囲 |
| --- | --- |
| `~/.claude/settings.json` | 自分のPC全プロジェクト（推奨） |
| `<project>/.claude/settings.json` | そのプロジェクトのみ |

設定ファイルに以下を追記します（既存の `mcpServers` がある場合はマージ）。

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "serena": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena",
        "serena",
        "start-mcp-server",
        "--context",
        "ide-assistant"
      ]
    },
    "cipher": {
      "type": "stdio",
      "command": "cipher",
      "args": ["--mode", "mcp"],
      "env": {
        "MCP_SERVER_MODE": "aggregator",
        "ANTHROPIC_API_KEY": "sk-ant-xxxxxxxx"
      }
    }
  }
}
```

> **Note:** `ANTHROPIC_API_KEY` には自分のAnthropic APIキーを設定してください。APIキーをファイルに直接書きたくない場合は、シェルで環境変数として `export` しておく方法もあります。

### Step 4: Claude Code の再起動と確認

設定を保存したら、Claude Code を**完全に終了して再起動**します。再起動後、以下のコマンドで認識状態を確認できます。

```bash
claude mcp list
```

3つすべてが表示されれば導入完了です。

### Step 5: 動作確認

| ツール | 確認方法 |
| --- | --- |
| Context7 | プロンプトに `use context7` を含め、ライブラリの最新ドキュメントが返るか確認 |
| Serena | コードベース内で `find_symbol` などのツールが呼び出せるか確認 |
| Cipher | `これを覚えておいて` のような記憶系の指示を試す |

## トラブルシューティング

| 症状 | 原因と対処 |
| --- | --- |
| Cipher で `command not found` | Step 2 のグローバルインストール未実施 |
| Serena が起動しない | `uvx` 未インストール（uv のインストールが必要） |
| 設定が反映されない | Claude Code の再起動忘れ |
| APIキーをJSONに書きたくない | `~/.zshrc` などで `export ANTHROPIC_API_KEY=...` してから Claude Code を起動 |

## 各MCPの概要

### Context7

ライブラリの最新ドキュメントをリアルタイムで取得するMCPサーバー。学習データの知識カットオフを超えて最新APIを参照できます。
プロンプトに `use context7` と書くか、`Claude.md` に常時使用する旨を記載することで機能します。

### Serena

LSP（Language Server Protocol）を活用したコード解析MCPサーバー。
シンボルレベルの解析・参照・リネームなどのIDE機能をエージェントに提供します。大規模プロジェクトでも高精度な編集が可能になります。

### Cipher

SQLiteベースのローカルメモリ層MCPサーバー。
過去のやり取りや解決した問題を蓄積し、セッションをまたいで再利用できます。チームで知見を共有する用途にも適しています。
