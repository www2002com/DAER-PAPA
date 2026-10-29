#!/usr/bin/env bash
# Rebuild public/fonts/pretendard-critical.woff2 from checked-in unicodes.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2"
UNI="$ROOT/public/fonts/pretendard-critical-unicodes.txt"
OUT="$ROOT/public/fonts/pretendard-critical.woff2"
pyftsubset "$SRC" \
  --unicodes-file="$UNI" \
  --output-file="$OUT" \
  --flavor=woff2 \
  --layout-features='*' \
  --notdef-glyph --notdef-outline --recommended-glyphs \
  --name-IDs='*' --name-legacy --name-languages='*' \
  --recalc-bounds
ls -la "$OUT"
