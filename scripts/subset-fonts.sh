#!/usr/bin/env bash
# Re-creates the small, self-hosted font files in src/fonts/.
# Developer-only: needs Python with `pip install fonttools brotli`.
# Sources are the OFL-licensed @fontsource packages in node_modules.
set -euo pipefail
cd "$(dirname "$0")/.."
# Basic Latin + Latin-1 + smart quotes, dashes, ellipsis, bullets, arrows, trademark.
U="U+0020-007E,U+00A0-00FF,U+2010-2027,U+2032-2033,U+2039-203A,U+20AC,U+2122,U+2190-2193,U+2713"
sub() { pyftsubset "$1" --unicodes="$U" --flavor=woff2 --layout-features='kern,liga,calt,lnum,tnum' --output-file="$2"; }
sub node_modules/@fontsource/zilla-slab/files/zilla-slab-latin-700-normal.woff2 src/fonts/zilla-slab-700.woff2
sub node_modules/@fontsource/gochi-hand/files/gochi-hand-latin-400-normal.woff2 src/fonts/gochi-hand-400.woff2
sub node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2 src/fonts/figtree-var.woff2
sub node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-italic.woff2 src/fonts/figtree-var-italic.woff2
ls -la src/fonts
