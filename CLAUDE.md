# CLAUDE.md - Claude Code Guidelines

このリポジトリは様々なプロジェクトの実験場（サンドボックス）です。

## 🎯 リポジトリの目的

- 新しいアイデアの迅速なプロトタイピング
- 様々なプロジェクトの初期開発
- 有望なプロジェクトは後で独立したリポジトリへ移行

## 📁 ディレクトリ構造

```
claude-code-sandbox/
├── projects/           # 各プロジェクトのルート
│   ├── project/
│   ├── another-project/
│   └── ...
├── shared/            # 共通リソース（もしあれば）
└── archive/           # 完了/移行済みプロジェクト
```

## 🚀 新規プロジェクトの開始方法

1. `projects/`ディレクトリに新しいフォルダを作成
2. プロジェクト名は明確で説明的に（例: `ultra-fast-reader`）
3. 各プロジェクトには必ず`README.md`を含める

## 📝 プロジェクトごとのREADME

各プロジェクトのREADMEには以下を記載：
- プロジェクトの概要
- 現在のステータス（実験中/開発中/完了/移行済み）
- 主な機能
- 技術スタック
- セットアップ方法

## ✅ コーディング規約

- 可読性を最優先
- 過度な最適化より明確さを重視
- 各プロジェクトは独立して動作可能に
- 依存関係は最小限に

## 🔄 プロジェクトの移行

プロジェクトが成熟したら：
1. 独立したリポジトリを作成
2. コードとhistoryを移行
3. このリポジトリでは`archive/`に移動
4. READMEに新リポジトリへのリンクを追加

## 💡 Issueの書き方

新しいタスクを依頼する際：
```markdown
@claude

## プロジェクト名
[新規の場合は名前を提案/既存の場合は指定]

## タスク内容
[具体的な要求]

## 参考情報
[必要に応じて]
