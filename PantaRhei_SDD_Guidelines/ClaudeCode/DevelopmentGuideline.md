# Github
初期開発: main ← dev
中規模開発: main ← dev → stg
大規模開発: 都度

# 最適技術スタック
FrontEnd: React.js, Next.js, TypeScript
Infra: Google Cloud

# ディレクトリ構成

# 命名規則
- 本番環境は「prod」ではなく「prd」としてください。「dev」と文字数を合わせるためです。
- Google Cloudのプロジェクトの命名規則は「組織名-フォルダ名-フォルダ名(-フォルダ名, 省略化)-環境名 (例: pantarhei-oarth-app-prd)

# CIは必ずCloud Build/Artifact Registry

# Claude Code環境導入手順
- Claudeを導入する前にbrewからのuv/npmの導入
