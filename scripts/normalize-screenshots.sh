#!/usr/bin/env bash
# Pads captured screenshots to the Chrome Web Store's 1280x800 canvas.
# Capture at any size, drop the files in store/screenshots/raw/, run this.
# Uses sips, which ships with macOS — no dependencies to install.

set -euo pipefail

raw="store/screenshots/raw"
out="store/screenshots"
background="1F2430"

shopt -s nullglob
files=("$raw"/*.png)

if [ ${#files[@]} -eq 0 ]; then
  echo "No PNGs in $raw" >&2
  exit 1
fi

for file in "${files[@]}"; do
  name="$(basename "$file")"

  sips --resampleHeightWidthMax 1280 "$file" --out "$out/$name" >/dev/null
  sips --padToHeightWidth 800 1280 --padColor "$background" "$out/$name" --out "$out/$name" >/dev/null

  echo "$name — $(sips -g pixelWidth -g pixelHeight "$out/$name" | tail -2 | tr -d ' \n')"
done
