# ANful のカフェブログのデモ

[https://anfulcafe.vercel.app](https://anfulcafe.vercel.app)

## What

Next.js と microCMS を使ったカフェブログ

- インスタからの自動投稿
- 予約機能
- 決済機能
- google の口コミ表示
- google map での所在地表示

## Feature

#### ライブラリ

- React

#### フレームワーク

- Next.js

#### ブログ管理

- microCMS

#### スタイル・UI

- tailwindCSS
- Ant Design

## How

```
git clone https://github.com/edegp/cafe-cms-demo.git
```

```
yarn install # ライブラリのインストール
// or
npm install
```

```
npm run dev # ローカルで立ち上げ
```

[http://localhost:3000](http://localhost:3000)にアクセス

### microCMS

[アカウント登録](https://microcms.io/docs/manual/signup)
[ログイン](https://microcms.io/docs/manual/signin)
[サービスの作成](https://microcms.io/docs/manual/create-service)
api サービスの作成時にエンドポイント名は`blogs`と入力

[API の作成](https://microcms.io/docs/manual/create-service)

#### .env.local の作成

.env.example を.env.local に名前を変更し
microCMS の api キーとサービスドメイン(○○○○.microcms.io の ○○○○ の部分)を追加
