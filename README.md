# Motion Prompt Mobile（非公式）

[Motion Prompt](https://showheyohtaki.github.io/motion-prompt/) の見本を、iPhone でアプリのように使えるようにした Web ページ（PWA）です。

公開先は https://atani.github.io/motion-prompt-mobile/ です。

## 非公式のモバイル版です

このリポジトリは個人が作った非公式のモバイル版です。上流の作者とは関係がありません。見本の内容への問い合わせや削除・訂正の依頼は、上流のリポジトリへお願いします。

## 上流のクレジットとライセンス

- 上流: [showheyohtaki/motion-prompt](https://github.com/showheyohtaki/motion-prompt)
- 作者: 大滝昇平 / Shohei Ohtaki（[@showheyohtaki](https://x.com/showheyohtaki)）
- ライセンス: MIT License（Copyright (c) 2026 Shohei Ohtaki）

`vendor/motion-prompt/` には上流のファイルを改変せずに同梱しています。上流のライセンス全文は `vendor/motion-prompt/UPSTREAM-LICENSE` にあります。`vendor/motion-prompt/THIRD-PARTY-NOTICES.md` も同梱しています。同梱したコミットは `vendor/motion-prompt/UPSTREAM_SHA` に記録しています。

このモバイル版の画面とコード（`vendor/` 以外）も MIT License です（Copyright (c) 2026 atani）。全文は `LICENSE` にあります。

## できること

- 下部のタブで「見本」「選んだ物」「お気に入り」「情報」を切り替えます。
- 見本は画面に入っているカードだけを描画し、画面の外では止めます。
- 詳細シートで「プロンプトをコピー」「コードをコピー」「共有」を使えます。左右のスワイプで前後の要素へ移り、下へ引くと閉じます。
- `#001` のようなハッシュ付き URL で、その要素の詳細を直接開けます。上流と同じ形式です。
- 「選んだ物をコピー」は上流サイトと同じ文面を出します。上流との違いは 1 点だけです。要素ごとにメモを書くと、その要素の行の下に `   メモ: …` の行が入ります。メモが無ければ上流と同じ文面になります。
- 選択・メモ・お気に入り・言語・列数は端末の localStorage に保存します。保存できない環境でも動きます。
- Service Worker が同梱ファイルを先に保存するので、一度開けば通信がなくても使えます。

## 上流の更新を取り込む

`tools/sync-upstream.sh` が上流の指定コミットを取得し、必要なファイルを `vendor/motion-prompt/` へコピーします。Service Worker のキャッシュ名も同じ SHA に合わせて書き換えます。

```sh
# 既定の SHA で GitHub から取り込む
tools/sync-upstream.sh

# 別のコミットを取り込む
SHA=<コミットの SHA> tools/sync-upstream.sh

# 手元の clone から取り込む
UPSTREAM_DIR=/path/to/motion-prompt tools/sync-upstream.sh
```

取り込むファイルは次のとおりです。

- `assets/runtime.js`
- `packs/*/pack.js`（`fonts/` があればライセンスごと）
- `api/v1/` 以下すべて
- `LICENSE`（`UPSTREAM-LICENSE` という名前で保存します）
- `THIRD-PARTY-NOTICES.md`

画面側のファイル（`index.html` `app.css` `app.js`）を変えたときは、`sw.js` の `APP_VERSION` を上げてください。キャッシュ名が変わり、利用者の端末で新しいファイルに入れ替わります。

## ローカルで確認する

ビルドは不要です。リポジトリの直下で HTTP サーバーを起動し、ブラウザで開きます。

```sh
python3 -m http.server 8000
# http://localhost:8000/ を開きます
```

GitHub Pages と同じサブパスで確かめるときは、親ディレクトリに置いたシンボリックリンク経由で配信します。

```sh
mkdir -p /tmp/mpm-serve
ln -sfn "$PWD" /tmp/mpm-serve/motion-prompt-mobile
cd /tmp/mpm-serve && python3 -m http.server 8000
# http://localhost:8000/motion-prompt-mobile/ を開きます
```

Service Worker は `localhost` か HTTPS でだけ動きます。

## iPhone のホーム画面に追加する

1. Safari で公開ページを開きます。
2. 共有ボタンを押し、「ホーム画面に追加」を選びます。
3. ホーム画面のアイコンから開くと、全画面のアプリとして動きます。
