#!/usr/bin/env bash
# 上流 showheyohtaki/motion-prompt の指定コミットから、描画コードと API を vendor/motion-prompt/ へ取り込む。
# 上流のファイルは改変せずにコピーする。
#
# 使い方:
#   tools/sync-upstream.sh                 # GitHub から SHA を取得してコピー
#   UPSTREAM_DIR=/path/to/clone tools/sync-upstream.sh   # 手元の clone から SHA を取り出してコピー
#   SHA=<commit> tools/sync-upstream.sh    # 別のコミットに更新する
set -euo pipefail

SHA="${SHA:-770eefb7091cc725ab0eb6d4ef5cbf28b28e282c}"
REPO_URL="https://github.com/showheyohtaki/motion-prompt.git"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/vendor/motion-prompt"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
SRC="$WORK/src"

if [ -n "${UPSTREAM_DIR:-}" ]; then
  git -C "$UPSTREAM_DIR" cat-file -e "$SHA^{commit}"
  git clone --quiet --no-checkout "$UPSTREAM_DIR" "$SRC"
else
  git clone --quiet --no-checkout --filter=blob:none "$REPO_URL" "$SRC"
fi
git -C "$SRC" -c advice.detachedHead=false checkout --quiet "$SHA"

actual="$(git -C "$SRC" rev-parse HEAD)"
if [ "$actual" != "$SHA" ]; then
  echo "SHA が一致しません: $actual" >&2
  exit 1
fi

rm -rf "$DEST"
mkdir -p "$DEST/assets" "$DEST/api"

cp "$SRC/assets/runtime.js" "$DEST/assets/runtime.js"
for dir in "$SRC"/packs/*/; do
  pack="$(basename "$dir")"
  [ -f "$dir/pack.js" ] || continue
  mkdir -p "$DEST/packs/$pack"
  cp "$dir/pack.js" "$DEST/packs/$pack/pack.js"
  if [ -d "$dir/fonts" ]; then
    cp -R "$dir/fonts" "$DEST/packs/$pack/fonts"
  fi
done
cp -R "$SRC/api/v1" "$DEST/api/v1"
cp "$SRC/LICENSE" "$DEST/UPSTREAM-LICENSE"
cp "$SRC/THIRD-PARTY-NOTICES.md" "$DEST/THIRD-PARTY-NOTICES.md"
printf '%s\n' "$SHA" > "$DEST/UPSTREAM_SHA"

# Service Worker のキャッシュ名に使う短い SHA を反映する
short="${SHA:0:7}"
sed -i.bak -E "s/^const UPSTREAM = '[0-9a-f]+';/const UPSTREAM = '$short';/" "$ROOT/sw.js"
rm -f "$ROOT/sw.js.bak"

count="$(find "$DEST" -type f | wc -l | tr -d ' ')"
echo "vendor/motion-prompt を $SHA で更新しました（$count ファイル）"
