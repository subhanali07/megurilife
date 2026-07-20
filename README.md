# client-project

> MEGURILIFE ランディングページ — めぐりめぐって地域のしあわせに、つながる仕事。

クライアント：**株式会社 メグリライフ** — 美晴市の環境インフラを支える廃棄物処理・収集事業会社のコーポレートランディングページ。

## 概要

地域密着型の静的なウェブサイト。ごみ・廃棄物の適正処理を通じて地域の環境と暮らしを守るメグリライフの事業を、イラストと写真を交えて紹介する。

## スタック

| what | used |
|---|---|
| マークアップ | HTML5 (静的) |
| スタイル | CSS（カスタムプロパティ） |
| 言語 | 日本語（`lang="ja"`） |
| フォント | Montserrat（英字）+ Hiragino Sans / Noto Sans JP（和文）|
| スクリプト | バニラJS — IntersectionObserver スクロールリビール、カルーセル、ハンバーガーメニュー |
| テスト | Jest + jest-environment-jsdom |
| デプロイ | Vercel（出力ディレクトリ: `landing page`）|

## セクション

| セクション | ID | 内容 |
|---|---|---|
| ヘッダー | — | 固定ナビゲーション、モバイルハンバーガーメニュー |
| ヒーロー | `#top` | アニメーションタイトル「めぐりめぐって地域のしあわせに、つながる仕事。」 |
| まちのイラスト | `#map` | 美晴市の村イラスト＋吹き出しリンク（ごみと資源ずかん、おしごとずかん）|
| リバーバンド | — | ビデオ風バナー（橋を渡るバキューム車）|
| ステートメント | `#statement` | 会社紹介テキスト＋現場写真 |
| シーバンド | — | 海のイラストアセット（フェリー、イルカ、エビ）|
| 事業紹介 | `#service` | カルーセル形式（4事業：粗大ごみ回収、環境インフラ維持、浄化槽管理、産業廃棄物回収）|
| 採用情報 | `#recruit` | 採用告知＋写真 |
| お知らせ | `#blog` | ブログカード一覧 |
| ギャラリー | — | 現場写真グリッド |
| フッター | `#footer` | 住所、電話番号、フッターナビ |


## 構造

```
client-project/
├── package.json              # プロジェクト設定（jest）
├── vercel.json               # Vercel 出力ディレクトリ設定
├── .gitignore
├── landing page/
│   ├── index.html            # メインページ
│   ├── css/
│   │   └── index.css         # 全スタイル（カスタムプロパティ + セクションごと）
│   ├── js/
│   │   ├── dom.js            # DOM ヘルパー（querySelector ラッパー）
│   │   └── script.js         # 全機能（ハンバーガー、リビール、カルーセル、スクロール）
│   └── assets/
│       ├── Fonts/            # Montserrat-VariableFont_wght.ttf
│       ├── illust/           # 村・海・キャラクターのイラスト PNG
│       ├── Links/            # 現場写真・PSD デザインソース
│       └── top_pc.png        # ヒーロー背景
└── tests/
    └── script.test.js        # Jest テスト（ハンバーガー、カルーセル、リビール、アンカー）
```

## カラーパレット

CSS カスタムプロパティで一元管理：

| 変数 | 値 | 用途 |
|---|---|---|
| `--color-primary` | `#4ec3f0` | アクセント（吹き出し・ボタン枠線） |
| `--color-primary-deep` | `#2ea6db` | 濃い方のアクセント、フォーカスリング |
| `--color-pink` | `#f2a0bf` | サブアクセント |
| `--color-book-yellow` | `#f6d873` | ずかん本 |
| `--color-bg` | `#fbf9f4` | ページ背景 |
| `--color-field` | `#d3ecb4` | フィールド（緑） |
| `--color-water` | `#bfe3f5` | 水色帯 |
| `--color-ink` | `#2b3a3f` | 本文テキスト |
| `--color-muted` | `#6a7780` | 補足テキスト |

## 機能

- **スクロールリビール** — `[data-reveal]` 属性に IntersectionObserver でフェードイン
- **サービスカルーセル** — 前後ナビゲーション、ループ、リサイズ対応
- **ハンバーガーメニュー** — モバイル用、リンククリックで自動クローズ
- **固定ヘッダー** — スクロール量に応じて `scrolled` クラスでスタイル変更
- **スムーススクロール** — 内部アンカーリンクを `scrollIntoView` で処理

## 開発

```bash
npm install
npm test              # Jest テスト実行
npm run test:coverage # カバレッジレポート出力
```

テストは `tests/script.test.js` にあり、`landing page/js/script.js` から関数を直接 `require` してモジュール単位で検証する。

Vercel に接続済み。`git push` のたびに `landing page/` ディレクトリが自動デプロイされる（`vercel.json` で設定）。

## 備考

- html の `lang="ja"` 設定、日本語コンテンツ
- 全イラスト元データは `assets/Links/photoshop files/` に .psd で保存
- ヒーローのタイトルは1文字ずつ `<span class="letter">` でマークアップ済み
- 電話番号：0957-99-9999
- 所在地：緑川県美晴市青葉町108番地1
