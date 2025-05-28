# Claude Code Sandbox

様々なプロジェクトのプロトタイピングと実験を行うサンドボックスリポジトリ

## 🎯 このリポジトリについて

このリポジトリは、Claude Codeを使用して様々なアイデアを素早く形にするための実験場です。有望なプロジェクトは後に独立したリポジトリとして切り出されます。

## 📁 現在のプロジェクト

| プロジェクト | 説明 | ステータス |
|------------|------|----------|
| [helicopter-game](./projects/helicopter-game) | クラシックなヘリコプターゲーム | ✅ 完成 |
| [modern-tetris](./projects/modern-tetris) | モダンなデザインのテトリス | ✅ 完成 |
| [ultra-fast-reader](./projects/ultra-fast-reader) | ミニマルな高速読書アプリ | ✅ 完成 |

## 🌐 プロジェクトを見る

すべてのプロジェクトはGitHub Pagesで公開されています：
- [プロジェクト一覧](https://nichiki.github.io/claude-code-sandbox/projects/)

## 🚀 使い方

新しいプロジェクトを始めるには、Issueを作成して`@claude`をメンションしてください：

```markdown
@claude

新しいプロジェクト「プロジェクト名」を projects/ ディレクトリに作成してください。

[詳細な要件]
```

## 📝 プロジェクト管理

- **実験段階**: `projects/` ディレクトリで開発
- **成熟したら**: 独立リポジトリへ移行
- **完了後**: `archive/` へ移動

詳細は [CLAUDE.md](./CLAUDE.md) を参照してください。

## ⚙️ GitHub Actions

このリポジトリには Claude Code が自動実行される GitHub Actions が設定されています。
