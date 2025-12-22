FROM python:3.11-slim

RUN apt-get update && apt-get install -y ffmpeg git \
  && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -U pip openai-whisper requests

WORKDIR /work
