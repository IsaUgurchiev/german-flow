#!/usr/bin/env bash
set -euo pipefail

VIDEO="${1:?Usage: ./asr/transcribe.sh lesson-1.mp4}"
MODEL="${2:-small}"
LANG="${3:-de}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEOS="$ROOT/src/assets/videos"
SUBS="$ROOT/src/assets/subtitles"

mkdir -p "$HOME/.cache/whisper"
mkdir -p "$SUBS"

cd "$VIDEOS"

docker run --rm -it \
  -v "$PWD:/work" -w /work \
  -v "$HOME/.cache/whisper:/root/.cache/whisper" \
  germanflow-whisper \
  whisper "$VIDEO" --language "$LANG" --task transcribe --model "$MODEL" --output_format vtt --output_dir /work

mv "${VIDEO%.*}.vtt" "$SUBS/"
echo "Done: $SUBS/${VIDEO%.*}.vtt"
