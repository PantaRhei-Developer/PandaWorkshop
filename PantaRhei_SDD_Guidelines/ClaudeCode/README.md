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
参考: !(Claude Codeを実際のプロジェクトにうまく適用させていくTips10選)[https://qiita.com/nokonoko_1203/items/67f8692a0a3ca7e621f3]
以下を導入しましょう。

- Context7
- serena
- Cipher

全部OSSです。

## Contect7

## Serena

## Cipher