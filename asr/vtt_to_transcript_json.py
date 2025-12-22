import json, os, re, sys
import requests

# Supports:
#  - HH:MM:SS.mmm --> HH:MM:SS.mmm
#  - MM:SS.mmm --> MM:SS.mmm
VTT_TS = re.compile(
    r"(?P<s>(?:\d{1,2}:)?\d{2}:\d{2}\.\d{3})\s*-->\s*(?P<e>(?:\d{1,2}:)?\d{2}:\d{2}\.\d{3})"
)

def ts_to_sec(ts: str) -> float:
    # ts: "MM:SS.mmm" or "HH:MM:SS.mmm"
    parts = ts.split(":")
    if len(parts) == 2:
        mm = int(parts[0])
        ss_ms = parts[1]
        ss, ms = ss_ms.split(".")
        return mm * 60 + int(ss) + int(ms) / 1000.0
    if len(parts) == 3:
        hh = int(parts[0])
        mm = int(parts[1])
        ss_ms = parts[2]
        ss, ms = ss_ms.split(".")
        return hh * 3600 + mm * 60 + int(ss) + int(ms) / 1000.0
    raise ValueError(f"Bad timestamp: {ts}")

def parse_vtt(text: str):
    lines = [l.rstrip("\n") for l in text.splitlines()]
    i = 0
    out = []
    while i < len(lines):
        line = lines[i].strip()
        i += 1

        if not line or line.upper() == "WEBVTT":
            continue

        # optional cue index (some VTTs have numeric id)
        if line.isdigit() and i < len(lines):
            line = lines[i].strip()
            i += 1

        m = VTT_TS.search(line)
        if not m:
            continue

        start = ts_to_sec(m.group("s"))
        end = ts_to_sec(m.group("e"))

        text_parts = []
        while i < len(lines) and lines[i].strip():
            text_parts.append(lines[i].strip())
            i += 1

        de = " ".join(text_parts).strip()
        if de:
            out.append({"startSec": start, "endSec": end, "de": de})

    return out

def deepl_translate(texts, source="DE", target="EN"):
    key = os.environ.get("DEEPL_AUTH_KEY")
    if not key:
        raise SystemExit("DEEPL_AUTH_KEY is not set")
    r = requests.post(
        "https://api-free.deepl.com/v2/translate",
        data={
            "auth_key": key,
            "source_lang": source,
            "target_lang": target,
            "text": texts,
        },
        timeout=60,
    )
    r.raise_for_status()
    data = r.json()
    return [t["text"] for t in data["translations"]]

def main():
    if len(sys.argv) < 3:
        print("Usage: python vtt_to_transcript_json.py input.vtt output.json", file=sys.stderr)
        sys.exit(1)

    vtt_path = sys.argv[1]
    out_path = sys.argv[2]

    with open(vtt_path, "r", encoding="utf-8") as f:
        vtt_text = f.read()

    cues = parse_vtt(vtt_text)

    # If cues are empty, still write a helpful file (debug-friendly)
    batch_size = 40
    for b in range(0, len(cues), batch_size):
        batch = cues[b:b+batch_size]
        de_texts = [c["de"] for c in batch]
        en_texts = deepl_translate(de_texts)
        for c, en in zip(batch, en_texts):
            c["en"] = en

    payload = {
        "version": 1,
        "source": {"lang": "de"},
        "target": {"lang": "en"},
        "lines": cues,
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"Wrote {out_path} ({len(cues)} lines)")

if __name__ == "__main__":
    main()
