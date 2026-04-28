# Panta Rheiメンバーが導入すべきMCPとその入門

> 2026/04/28 社内勉強会ハンズオン資料
> 後でスライド化するため、`---` 区切りで1スライド分を構成しています。

---

## 1. Opening

### Panta Rheiメンバーが導入すべきMCPとその入門

- 本日のゴール
  - **MCP**が何かを理解する
  - 社内標準の **5つのMCP** を自分のClaude Codeに導入できる
  - つまずきポイント（CLI vs Desktop）を押さえる

- 想定時間: 約60分（ハンズオン込み）

---

## 2. 自己紹介

- 名前 / 役割
- Claude Code 歴 / 普段の使い方
- 今日話す範囲

> 登壇者は当日加筆してください。

---

## 3. Claude Code 使っていますか！

### 質問タイム

- ❓ 普段から Claude Code を触っている人？
- ❓ MCPを設定したことがある人？
- ❓ `~/.claude/settings.json` を開いたことがある人？

### 触ったことがない人向けの一行説明

> Claude Code は **Anthropic 公式のCLI型コーディングエージェント**です。
> ターミナルから `claude` コマンドで起動し、コードベースを理解しながら開発を進めてくれます。

---

## 4. MCPとは

### Model Context Protocol

- Anthropic が策定した、**LLM⇄外部ツール** の通信プロトコル
- Claude Code に「拡張機能」を追加する仕組み、と理解すればOK
- **stdio**（ローカルプロセス）と **HTTP/SSE**（リモートサーバー）の2形式がある

### 何が嬉しい？

| なし | あり（MCP導入後） |
| --- | --- |
| 学習データの古い情報で実装 | 最新ドキュメントを参照（Context7） |
| ファイル全文をスキャン | シンボル単位で精密に編集（Serena） |
| セッションごとに記憶リセット | 過去の知見を引き継ぐ（Cipher） |
| GitHub操作は手動 | PR作成・Issue管理を自動化（GitHub MCP） |
| 完了通知に気づかない | 音声で報告してくれる（VoiceVox） |

---

## 5. MCP一覧（社内標準）

### Panta Rheiで導入推奨のMCP

| # | ツール | 役割 | 必須/任意 |
| :---: | --- | --- | :---: |
| 1 | **Context7** | ライブラリの最新ドキュメント取得 | 必須 |
| 2 | **Serena** | LSPベースのコード解析 | 必須 |
| 3 | **Cipher** | ローカルメモリ層（知見の蓄積） | 必須 |
| 4 | **GitHub MCP** | GitHub操作（PR/Issue/コミット） | 推奨 |
| 5 | **VoiceVox（ずんだもん）** | 音声通知 | お好みで |

詳細は [PantaRhei_SDD_Guidelines/ClaudeCode/README.md](../PantaRhei_SDD_Guidelines/ClaudeCode/README.md) を参照。

---

## 6. ⚠️ 注意：Claude Code CLI と Claude Desktop は別物！

### 混同しやすいポイント

| | Claude Code（CLI） | Claude Desktop（GUIアプリ） |
| --- | --- | --- |
| 形態 | ターミナルコマンド `claude` | Mac/Windows のGUIアプリ |
| 設定ファイル | `~/.claude/settings.json` | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| 推奨用途 | コーディング | チャット・調査 |

### 本日のハンズオンは **Claude Code CLI** を対象

- 設定ファイルは **`~/.claude/settings.json`**
- Desktop版の設定ファイルにいくら書いてもCLIには反映されません！
- 確認コマンド: `claude mcp list`

---

## 7. SERENA の入れ方

### 概要

LSPを活用したコード解析MCP。シンボル単位の参照・リネーム・編集ができるようになります。

### 前提

```bash
# uv（uvxを含む）が必要
uvx --version
# 入っていなければ:
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 設定（`~/.claude/settings.json`）

```json
{
  "mcpServers": {
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
    }
  }
}
```

### CLIで一発追加するなら

```bash
claude mcp add --scope user serena -- \
  uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant
```

---

## 8. CONTEXT7 の入れ方

### 概要

ライブラリの最新ドキュメントをリアルタイム取得するMCP。学習カットオフを超えて最新APIを参照できます。

### 前提

```bash
node --version  # Node.js が入っていればOK
```

### 設定（`~/.claude/settings.json`）

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### 使い方のコツ

- プロンプトに `use context7` と書くと参照される
- `Claude.md` に「ライブラリの使い方は常にContext7で確認すること」と書いておくと自動利用される

---

## 9. Cipher の入れ方

### 概要

SQLiteベースのローカルメモリ層MCP。**セッションをまたいで知見を蓄積**できます。

### 前提

```bash
# CLIをグローバルインストール（これを忘れがち！）
npm install -g @byterover/cipher

# 動作確認
cipher --version
```

### 設定（`~/.claude/settings.json`）

```json
{
  "mcpServers": {
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

> APIキーをファイルに書きたくない場合は、`~/.zshrc` で `export ANTHROPIC_API_KEY=...` してから Claude Code を起動してください。

---

## 10. GitHub MCP の入れ方

### 概要

GitHub公式のMCPサーバー。PR作成・Issue管理・コードレビューなどをClaude Codeから直接実行できます。

### 前提

1. **Personal Access Token (PAT) の作成**
   - https://github.com/settings/personal-access-tokens/new
   - Scope: `repo`, `read:org` を付与
2. **Docker Desktop のインストール**（公式版はDockerベース）

### 設定（`~/.claude/settings.json`）

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    }
  }
}
```

> 旧npmパッケージ `@modelcontextprotocol/server-github` は2025年にアーカイブ済み。**公式Docker版**を使ってください。

---

## 11. ずんだもん（VoiceVox）MCP の入れ方

### 概要

タスク完了時にずんだもんの声で報告してくれるMCP。**待ち時間のストレスが減る**と評判。

### 前提

1. **VOICEVOX本体の起動**
   - https://voicevox.hiroshiba.jp/ からダウンロード
   - 起動して `http://localhost:50021` でAPIが立ち上がっていることを確認

### 設定（`~/.claude/settings.json`）

```json
{
  "mcpServers": {
    "voicevox": {
      "command": "npx",
      "args": ["-y", "@arrow2nd/vv-mcp"],
      "env": {
        "VOICEVOX_URL": "http://localhost:50021",
        "DEFAULT_VOICE_ID": "7",
        "DEFAULT_SPEED": "1.0"
      }
    }
  }
}
```

> `DEFAULT_VOICE_ID: 7` は **ずんだもん（ノーマル）**。他キャラに変えたい場合はVOICEVOXのスピーカーIDを参照。

---

## 12. 全部入れた `~/.claude/settings.json` の完成形

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
    },
    "github": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    },
    "voicevox": {
      "command": "npx",
      "args": ["-y", "@arrow2nd/vv-mcp"],
      "env": {
        "VOICEVOX_URL": "http://localhost:50021",
        "DEFAULT_VOICE_ID": "7",
        "DEFAULT_SPEED": "1.0"
      }
    }
  }
}
```

### 反映手順

```bash
# 1. Claude Code を完全終了して再起動
# 2. 認識確認
claude mcp list
```

---

## 13. まとめ

### 今日のおさらい

- ✅ MCPは Claude Code の**拡張機能**
- ✅ **CLIとDesktopは別物**、設定ファイルも別。本日のハンズオンはCLI側
- ✅ 社内標準は **Context7 / Serena / Cipher**（必須）+ **GitHub / VoiceVox**（推奨）
- ✅ 設定ファイルは `~/.claude/settings.json` に **`mcpServers`** で定義
- ✅ 反映には **Claude Codeの再起動** が必要

### 次のステップ

- 自分のプロジェクトに `Claude.md` を整備（[Claude.example.md](../PantaRhei_SDD_Guidelines/ClaudeCode/Claude.example.md) を参考に）
- チームでCipherの記憶を共有する運用を試す
- 質問・困りごとは社内Slackへ！

### 参考リンク

- [Claude Code MCP Serena & Cipher 導入ガイド](https://zenn.dev/aki1990/articles/a7db63dbc99848)
- [Claude Codeを実際のプロジェクトにうまく適用させていくTips10選](https://qiita.com/nokonoko_1203/items/67f8692a0a3ca7e621f3)
- [Serena (GitHub)](https://github.com/oraios/serena)
- [Context7 (GitHub)](https://github.com/upstash/context7)
- [Cipher (GitHub)](https://github.com/campfirein/cipher)
- [GitHub MCP Server (公式)](https://github.com/github/github-mcp-server)
- [vv-mcp (VoiceVox)](https://github.com/arrow2nd/vv-mcp)

---

### ご清聴ありがとうございました 🎉
