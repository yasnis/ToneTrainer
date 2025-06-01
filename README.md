![Tone Trainer Logo](apps/web/public/images/logo.svg)

# Tone Trainer

> *音符を覚え、完璧なタイミングを維持する*  
> 弦楽器奏者のためのウェブファースト＆ネイティブ対応練習ツール

## 概要

Tone Trainerは、メトロノームに同期してランダムな音符を表示することで、ミュージシャンがフレットボード上の音符名をマスターするのを支援します。ユーザーは音符が変わる前に、表示された音符を自分の楽器で合わせます。BPMを上げることで、速さと自信を構築できます。


## 機能

- **高精度メトロノーム**: BPM 20〜240、拍子記号（2/4、3/4、4/4）、アクセント付き第一拍のトグル
- **ランダム音符生成器**: ユーザー定義の音符プール（12半音のうち≥1）から選択。プールが使い果たされるまで繰り返しなし
- **タップでスタート/一時停止**: 現在の音符をタップすると再生状態が切り替わります
- **ビート可視化**: 脈動するリングと拍位置表示（"M 2 | B 3"）
- **設定と音符プール編集**: インラインの選択音符サマリー（編集ボタン付き）、音符セレクターモーダル（3×4のトグルグリッド）
- **永続化とPWA**: 設定はLocalStorage/AsyncStorageに保存、オフラインインストール可能なPWA
- **コード対応**: 単音だけでなく、さまざまなタイプのコードも練習可能（maj7, 7, m7, m7(b5), dim7）

## 開始方法

### 前提条件

- Node.js (v18 LTS以上推奨)
- Yarn パッケージマネージャー (v1.22以上)

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yasnis/ToneTrainer.git
cd ToneTrainer

# 依存関係をインストール
yarn install
```

### 開発サーバーの起動

```bash
# Webアプリを開発モードで実行
yarn dev:web

# モバイルアプリを開発モードで実行
yarn dev:mobile
```

### ビルド

```bash
# Webアプリをビルド
yarn build:web

# モバイルアプリをビルド
yarn build:mobile
```

## デプロイ

### Vercelへのデプロイ

Vercelにデプロイする際は、以下の設定が必要です：

1. ルートディレクトリとして`apps/web`を指定
2. フレームワークプリセットとして「Next.js」を選択
3. 環境変数を必要に応じて設定

```bash
# Vercel CLIを使用してデプロイする場合
cd apps/web
vercel
```

## プロジェクト構造

```
tone-trainer/
├ apps/                  # アプリケーション
│ ├ mobile/             # Expoモバイルアプリ
│ └ web/                # Next.jsウェブアプリ
├ packages/              # 共有パッケージ
│ ├ core/               # オーディオ、スケジューラー、音符ロジック
│ ├ ui/                 # 共有Reactコンポーネント
│ └ config/             # eslint、tailwind、tsconfigs
└ docs/                 # ドキュメント
```

## 技術スタック

| レイヤー | 選択技術 | 理由 |
|---------|----------|------|
| UI＆ルーティング | Next.js 14 (Web) / Expo Router (Mobile) | 単一のTypeScriptコードベース |
| スタイリング | NativeWind (Tailwind) | WebとNativeで共有可能なクラス |
| 状態管理 | Zustand | 軽量なグローバルストア |
| オーディオ | Web Audio API / Expo-AV | 低レイテンシー; `IAudioEngine`で抽象化 |
| グラフィックス | react-native-skia (+ webシム) | GPU駆動のパルスリング |
| テスト | Vitest, Testing Library, Cypress | ユニット/レンダリング/E2Eテスト |
| CI/CD | GitHub Actions + Vercel + Expo EAS | 自動プレビューとビルド |
| リポジトリ | Turborepo + Yarn PnP | 共有`core`、`ui`、`config`パッケージ |

## アーキテクチャ

```
UI (Next.js / Expo Router)
  ├─ NoteDisplay     (タップでスタート/一時停止)
  ├─ BeatVisualizer + BeatPositionDisplay
  └─ ControlsCard    (スライダー、ピッカー、サマリー)
          │
          ▼ 購読
   settingsStore (Zustand)
          │ 注入
          ▼
   BeatManager + SimpleMetronome ── onBeat/onMeasure
          │
          ▼
   Web Audio API / Expo-AV
```

## 互換性に関する注意

### Next.js 14.2.29以降

Next.js 14.2.29以降では、`useSearchParams()`などのクライアントフックを使用するコンポーネントは必ず`<Suspense>`でラップする必要があります。このプロジェクトでは以下の方法で対応しています：

- Server Component（`page.tsx`、`not-found.tsx`）では、Client Componentを別ファイルに分離
- すべてのClient Componentを`<Suspense>`でラップ
- 必要に応じて`dynamic = 'force-dynamic'`を設定

## トラブルシューティング

### ビルドエラー

**エラー: `useSearchParams() should be wrapped in a suspense boundary`**

対処法: 該当するページコンポーネントがServer Componentであることを確認し、Client Componentを`<Suspense>`でラップします。詳細は「互換性に関する注意」セクションを参照してください。

**エラー: `'X' is declared but its value is never read`**

対処法: 未使用の変数やインポートを削除します。

### Web Audioの問題

**エラー: ユーザーインタラクション前にAudioContextが開始できない**

対処法: AudioContextの初期化は必ずユーザーアクションのハンドラー内（例：ボタンクリック）で行います。

## 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを開く

## ライセンス

MIT

## お問い合わせ

質問や提案がある場合は、[issues](https://github.com/your-username/tone-trainer/issues)を開いてください。

---

© 2025 Tone Trainer Team