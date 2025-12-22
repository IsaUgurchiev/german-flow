#!/usr/bin/env bash
set -euo pipefail

VIDEO="${1:?Usage: ./asr/transcribe.sh lesson-1.mp4}"
MODEL="${2:-small}"
LANG="${3:-de}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEOS="$ROOT/src/assets/videos"
SUBS="$ROOT/src/assets/subtitles"
TRANS="$ROOT/src/assets/transcripts"

mkdir -p "$HOME/.cache/whisper"
mkdir -p "$SUBS"
mkdir -p "$TRANS"

cd "$VIDEOS"

# vtt output filename from VIDEO
VTT_OUT="${VIDEO%.*}.vtt"
JSON_OUT="${VIDEO%.*}.transcript.en.json"

docker run --rm -it \
  -v "$PWD:/work" -w /work \
  -v "$HOME/.cache/whisper:/root/.cache/whisper" \
  -v "$ROOT/asr:/pipeline" \
  -e DEEPL_AUTH_KEY="${DEEPL_AUTH_KEY:-}" \
  germanflow-whisper \
  bash -lc "
    whisper \"$VIDEO\" --language \"$LANG\" --task transcribe --model \"$MODEL\" --output_format vtt --output_dir /work
    python /pipeline/vtt_to_transcript_json.py \"/work/$VTT_OUT\" \"/work/$JSON_OUT\"
  "

mv "$VTT_OUT" "$SUBS/"
mv "$JSON_OUT" "$TRANS/"

echo "Done:"
echo "  VTT:  $SUBS/$VTT_OUT"
echo "  JSON: $TRANS/$JSON_OUT"
