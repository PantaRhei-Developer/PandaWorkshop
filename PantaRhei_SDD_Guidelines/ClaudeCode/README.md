# 例
Claude.example.md

# PJごとにベースとする技術スタック

## インフラ開発

## Web開発(アプリ)

## Web開発(ホームページ)
|項目|技術|
|:---:|:---:|
|フレームワーク|React.js, Next.js, TypeScript|
|ホスティング|vercel|
|CMS|microCMS|
|E2Eテスト|Playwright|
### レンダリング戦略: SSG + ISR ###
- 基本 (SSG): 「会社概要」「サービス紹介」など更新頻度が低いページはSSGにし、CDNから高速配信します。
- 更新頻度が高い部分 (ISR): 「お知らせ」「ブログ」などmicroCMSで頻繁に更新するページはISR (Incremental Static Regeneration)を採用します。

### 仕様書ディレクトリ構成

- /docs
  - structure.md
  - spec/
    - components/
    - screens/
    - models/
    - services/
    - themes/
    - repositories/
    - providers/
    - tests/


## ネイティブアプリ開発

# MCP
参考: [Claude Codeを実際のプロジェクトにうまく適用させていくTips10選](https://qiita.com/nokonoko_1203/items/67f8692a0a3ca7e621f3)
以下を導入しましょう。

- Context7
- Serena
- Cipher

参考: [Claude Code MCP Serena & Cipher 導入ガイド](https://zenn.dev/aki1990/articles/a7db63dbc99848)
全部OSSです。

## 設定方法

`.claude/settings.json`（プロジェクト単位）または `~/.claude/settings.json`（グローバル）に以下を追記してください。

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
        "ANTHROPIC_API_KEY": "your_anthropic_api_key"
      }
    }
  }
}
```

> **Note:** Cipher は `npm install -g @byterover/cipher` で事前にグローバルインストールが必要です。`ANTHROPIC_API_KEY` は Anthropic のAPIキーを設定してください。

## Context7

ライブラリの最新ドキュメントをリアルタイムで取得するMCPサーバー。
`use context7` とプロンプトに追加するか、`Claude.md` に常時使用する旨を記載することで機能します。

- リポジトリ: https://github.com/upstash/context7

## Serena

LSP（Language Server Protocol）を活用したコード解析MCPサーバー。
シンボルレベルの解析・参照・リネームなどのIDE機能をエージェントに提供します。

- リポジトリ: https://github.com/oraios/serena

## Cipher

SQLiteベースのローカルメモリ層MCPサーバー。
過去のやり取りや解決した問題を蓄積し、セッションをまたいで再利用できるようにします。

- リポジトリ: https://github.com/campfirein/cipher