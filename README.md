# TRYPAS Web Game

![TRYPAS Logo](public/trypas-logo-new.png)

**TRYPAS（トライパス）** は、思考力・記憶力・創造力を鍛える日本発祥の抽象戦略ボードゲームです。

🎮 **プレイする**: https://shikanoniku-ops.github.io/trypas-game/

---

## ✨ 特徴

- 🎯 **シンプルなルール** - 誰でもすぐにプレイ可能
- 🧠 **奥深い戦略性** - 1億以上の開始陣形、14手以内で決着
- 📱 **レスポンシブデザイン** - PC・タブレット・スマートフォン対応
- 🎨 **サイバーパンクUI** - 近未来的なデザインとアニメーション
- 🔊 **BGM対応** - 没入感のあるサウンド

---

## 🎮 ゲームモード

| モード | 説明 |
|--------|------|
| **SOLO PLAY** | 1人でハイスコアを目指す |
| **VS CPU** | CPUと対戦（EASY/NORMAL/HARD） |
| **2 PLAYERS** | ローカル2人対戦 |
| **TUTORIAL** | 初心者向けチュートリアル |

---

## 📋 基本ルール

### スコア
| 色 | 得点 |
|----|------|
| 🔴 赤 | 10点 |
| 🟡 黄 | 20点 |
| 🟢 緑 | 30点 |
| 🔵 青 | 40点 |
| ⚪ 白 | 50点 |

### 基本動作
1. コマを選んで、隣接するコマを飛び越えて空きマスに着地
2. 飛び越えた最後のコマを獲得（得点化）
3. 最大3個まで一直線に飛び越え可能

### 特殊ルール
- **初手制限**: 赤コマは最初に取れない
- **TRYPAS!**: 赤コマを取ると追加ターン（対戦モードのみ）
- **自爆ルール**: 最後に赤を取ると敗北

---

## 🛠️ 技術スタック

| 技術 | バージョン |
|------|-----------|
| React | 19.2.0 |
| Vite | 7.2.4 |
| TailwindCSS | 3.4.18 |
| Framer Motion | 12.23.24 |

---

## 🚀 開発環境セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/shikanoniku-ops/trypas-game.git
cd trypas-game

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバー: http://localhost:5173/

---

## 📁 プロジェクト構造

```
trypas-web/
├── src/
│   ├── App.jsx              # メインアプリ
│   ├── components/          # UIコンポーネント
│   │   ├── TitleScreen.jsx
│   │   ├── GameBoard.jsx
│   │   ├── GameOverModal.jsx
│   │   └── ...
│   ├── hooks/               # カスタムフック
│   │   ├── useGameLogic.js  # ゲームロジック
│   │   └── ...
│   └── constants/           # 定数定義
├── public/                  # 静的アセット
├── docs/                    # ドキュメント
└── .github/workflows/       # GitHub Actions
```

---

## 📚 ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [ゲームルール](docs/game_rules.md) | 詳細なルール説明 |
| [要件定義書](docs/要件定義書.md) | プロジェクト要件 |
| [システム仕様書](docs/システム仕様書.md) | 技術仕様 |
| [UIデザイン仕様書](docs/UIデザイン仕様書.md) | デザイン仕様 |
| [デプロイメントガイド](docs/デプロイメントガイド.md) | デプロイ手順 |

---

## 📝 ライセンス

© 2025 TRYPAS Project. All Rights Reserved.

---

## 🤝 フィードバック

ゲームに関するご意見・ご要望は、アプリ内のフィードバック機能からお送りください。
