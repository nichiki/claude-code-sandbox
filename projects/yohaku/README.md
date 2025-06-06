# 余白（yohaku）

日本の美意識を取り入れたミニマルな読書アプリケーション

## 🎯 概要

「余白」は、和の美学とモダンなデザインを融合させた読書専用Webアプリケーションです。日本の伝統色と微細なテクスチャを使用し、最高の読書体験を提供します。

## ✨ 主な機能

### 📖 読書体験
- **スクロール位置自動保存**: 記事を途中まで読んで他記事に移動しても、戻った時に続きから読める
- **トップに戻るコマンド**: コマンドパレットから記事の最初に素早く移動
- **日本語最適化タイポグラフィ**: ゴシック体（Inter + Noto Sans JP）と明朝体（Crimson Pro + Noto Serif JP）
- **微細な紙テクスチャ**: 織物のような質感で読書の集中力をサポート

### 🎨 デザインシステム
- **日本の伝統色**: 生成り色（背景）、墨色（テキスト）、利休鼠（アクセント）
- **ダークモード**: 濡羽色、胡粉色、灰白色を使用した夜間読書対応
- **レスポンシブデザイン**: デスクトップ・モバイル両対応

### ⌨️ ナビゲーション
- **コマンドパレット**: `Cmd/Ctrl + K`でVSCode風の操作
- **ファジー検索**: 記事とコマンドを柔軟に検索
- **キーボードナビゲーション**: 矢印キー、Enter、Escで完全操作

### ⚙️ カスタマイズ
- **フォントサイズ調整**: 小・標準・大の3段階
- **フォントファミリー切り替え**: ゴシック体⇄明朝体
- **テーマ切り替え**: ライト⇄ダークモード
- **設定の永続化**: LocalStorageで設定を保存

## 🚀 使い方

1. `index.html`をブラウザで開く
2. `Cmd/Ctrl + K`でコマンドパレットを開く
3. 記事名を入力して検索、またはコマンドを実行

### コマンド例
- `デジタル` → 記事検索
- `theme` → テーマ切り替え
- `font` → フォント設定
- `top` → 記事の最初に戻る

### キーボードショートカット
- `Cmd/Ctrl + K`: コマンドパレット
- `↑` / `↓`: 項目選択
- `Enter`: 実行
- `Esc`: 閉じる

## 📚 収録記事

- **デジタルデトックスの重要性**: ライフスタイル・5分読了・1.2k文字
- **ミニマリズムとデザイン**: デザイン・3分読了・0.9k文字  
- **デジタル時代の読書論**: 読書・教育・6分読了・1.6k文字

## 🛠 技術スタック

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **Markdown**: marked.js + js-yaml (フロントマター対応)
- **フォント**: Google Fonts (Inter, Noto Sans JP, Crimson Pro, Noto Serif JP)
- **ストレージ**: LocalStorage (設定・スクロール位置)

## 📂 ファイル構成

```
yohaku/
├── index.html      # メインHTML
├── styles.css      # 日本的デザインシステム
├── script.js       # コマンドパレット + スクロール保存
├── articles/       # Markdown記事
│   ├── digital-detox.md
│   ├── minimalism-in-design.md
│   └── reading-in-digital-age.md
└── README.md       # このファイル
```

## 🎨 デザイン哲学

### 色彩設計
- **ライトモード**: 生成り色（和紙）+ 墨色（文字）+ 利休鼠（アクセント）
- **ダークモード**: 濡羽色（背景）+ 胡粉色（文字）+ 灰白色（アクセント）

### テクスチャ
- CSS gradientsによる微細な織物テクスチャ（opacity: 0.15）
- 普通の人は気づかないレベルの上質なこだわり

### タイポグラフィー
- ベースサイズ: 16px（モバイル: 14px）
- 行間: 1.8（明朝体: 1.9）
- 文字間隔: 0.02em（明朝体: 0.03em）

## 💭 開発の経緯

1. **初期構想**: Ultra Fast Readerとして高速読書アプリを企画
2. **UI刷新**: サイドバーを廃止、コマンドパレット方式に移行
3. **日本化**: 「余白」に改名、和の美意識を導入
4. **フォント強化**: Web Fonts導入、ゴシック/明朝切り替え実装
5. **テクスチャ実験**: 3種類のアプローチを試行、CSS gradients採用
6. **UX改善**: スクロール位置自動保存、ナビゲーション機能追加

## 🔮 将来の展望

### 短期目標
- コンテンツ充実（AI活用パイプライン + 過去記事リライト）
- 引用共有機能（選択テキスト + URL）
- 読了カード自動生成

### 中長期目標
- PWA化（オフライン読書対応）
- 独立サイトとしての公開
- 読書コミュニティ機能

## 📝 ライセンス

このプロジェクトはClaude Code Sandboxの一部として開発されています。