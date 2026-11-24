---
name: elevenlabs-voice
description: >
  Generates natural-sounding Portuguese (and multilingual) voiceovers and audio narrations
  for Reels, YouTube Shorts, and videos using the ElevenLabs API.
description_pt-BR: >
  Gera narrações e áudios naturais em Português para Reels, Shorts e vídeos usando a API da ElevenLabs.
type: script
version: "1.0.0"
script:
  path: scripts/generate-audio.js
  runtime: node
  invoke: "node --env-file=.env {skill_path}/scripts/generate-audio.js --text \"{text}\" --out \"{out}\""
env:
  - ELEVENLABS_API_KEY
categories: [audio, voice, video, reels]
---

# ElevenLabs Voice & Audio Generator

## When to use
Use this skill whenever the squad creates a **Reels**, **YouTube Shorts**, or **Video Script** and needs a ready-to-use `.mp3` voiceover narration in natural Portuguese.

## Usage
- **List available voices (including cloned voices):**
  ```bash
  node --env-file=.env skills/elevenlabs-voice/scripts/generate-audio.js --list-voices
  ```
- **Generate narration MP3 from text:**
  ```bash
  node --env-file=.env skills/elevenlabs-voice/scripts/generate-audio.js --text "Seu texto aqui" --out "output/narracao.mp3"
  ```
- **Optional flags:**
  - `--voice <voice_id>`: Specific voice ID (defaults to first available or `pNInz6obpgDQGcFmaJgB` Adam)
  - `--file <path.txt>`: Read narration script from a text file
  - `--model <model_id>`: Defaults to `eleven_multilingual_v2`
